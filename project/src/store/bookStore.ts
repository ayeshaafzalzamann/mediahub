import { create } from 'zustand';
import { Book, GoogleBooksResponse } from '../types';
import { searchBooks, getBookById, getNewestBooks, getBooksByCategory } from '../lib/api';
import supabase from '../lib/supabase';
import { toast } from 'react-hot-toast';

interface BookState {
  books: Book[];
  favoriteBooks: Book[];
  currentBook: Book | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  totalItems: number;

  searchForBooks: (query: string) => Promise<void>;
  loadMoreBooks: (startIndex: number) => Promise<void>;
  fetchBookById: (id: string) => Promise<void>;
  fetchNewestBooks: () => Promise<void>;
  fetchBooksByCategory: (category: string) => Promise<void>;

  addToFavorites: (book: Book) => Promise<void>;
  removeFromFavorites: (bookId: string) => Promise<void>;
  fetchUserFavorites: () => Promise<void>;

  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
}

export const useBookStore = create<BookState>((set, get) => ({
  books: [],
  favoriteBooks: [],
  currentBook: null,
  isLoading: false,
  error: null,
  searchQuery: '',
  totalItems: 0,

  searchForBooks: async (query: string) => {
    set({ isLoading: true, error: null, searchQuery: query });
    try {
      const response: GoogleBooksResponse = await searchBooks(query);
      set({
        books: response.items || [],
        totalItems: response.totalItems,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message || 'Failed to search books', isLoading: false });
      toast.error('Failed to search books');
    }
  },

  loadMoreBooks: async (startIndex: number) => {
    const { searchQuery } = get();
    set({ isLoading: true });
    try {
      const response: GoogleBooksResponse = await searchBooks(searchQuery, startIndex);
      set((state) => ({
        books: [...state.books, ...(response.items || [])],
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to load more books', isLoading: false });
      toast.error('Failed to load more books');
    }
  },

  fetchBookById: async (id: string) => {
    set({ isLoading: true, error: null, currentBook: null });
    try {
      const book = await getBookById(id);
      set({ currentBook: book, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch book details', isLoading: false });
      toast.error('Failed to fetch book details');
    }
  },

  fetchNewestBooks: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getNewestBooks();
      set({ books: response.items || [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch newest books', isLoading: false });
      toast.error('Failed to fetch newest books');
    }
  },

  fetchBooksByCategory: async (category: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getBooksByCategory(category);
      set({ books: response.items || [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch books by category', isLoading: false });
      toast.error('Failed to fetch books by category');
    }
  },

  addToFavorites: async (book: Book) => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) {
      toast.error('You must be logged in to save favorites');
      return;
    }

    try {
      const { data: existingFavorite } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('book_id', book.id)
        .maybeSingle();

      if (existingFavorite) {
        toast.error('Book is already in your favorites');
        return;
      }

      // Flatten volumeInfo to store in favorites table
      const bookData = {
        id: book.id,
        title: book.volumeInfo.title,
        authors: book.volumeInfo.authors || [],
        description: book.volumeInfo.description || '',
        thumbnail: book.volumeInfo.imageLinks?.thumbnail || '',
        publishedDate: book.volumeInfo.publishedDate || '',
        pageCount: book.volumeInfo.pageCount || 0,
        categories: book.volumeInfo.categories || [],
        publisher: book.volumeInfo.publisher || '',
        averageRating: book.volumeInfo.averageRating || null,
        ratingsCount: book.volumeInfo.ratingsCount || 0,
        language: book.volumeInfo.language || '',
        industryIdentifiers: book.volumeInfo.industryIdentifiers || [],
      };

      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          book_id: book.id,
          book_data: bookData,
        });

      if (error) throw error;

      set((state) => ({
        favoriteBooks: [...state.favoriteBooks, book],
      }));

      toast.success('Book added to favorites');
    } catch (error: any) {
      console.error('Add to favorites error:', error);
      toast.error('Failed to add to favorites');
    }
  },

  removeFromFavorites: async (bookId: string) => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) {
      toast.error('You must be logged in to manage favorites');
      return;
    }

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('book_id', bookId);

      if (error) throw error;

      set((state) => ({
        favoriteBooks: state.favoriteBooks.filter((book) => book.id !== bookId),
      }));

      toast.success('Book removed from favorites');
    } catch (error: any) {
      console.error('Remove from favorites error:', error);
      toast.error('Failed to remove from favorites');
    }
  },

  fetchUserFavorites: async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) return;

    set({ isLoading: true });

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('book_data')
        .eq('user_id', user.id);

      if (error) throw error;

      const books = (data || []).map((item) => {
        const b = item.book_data;
        // map back to Book type if needed or return as is
        return {
          id: b.id,
          volumeInfo: {
            title: b.title,
            authors: b.authors,
            description: b.description,
            imageLinks: { thumbnail: b.thumbnail },
            publishedDate: b.publishedDate,
            pageCount: b.pageCount,
            categories: b.categories,
            publisher: b.publisher,
            averageRating: b.averageRating,
            ratingsCount: b.ratingsCount,
            language: b.language,
            industryIdentifiers: b.industryIdentifiers,
          }
        } as Book;
      });

      set({
        favoriteBooks: books,
        isLoading: false,
      });
    } catch (error: any) {
      console.error('Fetch favorites error:', error);
      set({
        error: error.message || 'Failed to fetch favorites',
        isLoading: false,
      });
      toast.error('Failed to fetch favorites');
    }
  },

  setSearchQuery: (query: string) => set({ searchQuery: query }),
  clearSearch: () => set({ searchQuery: '', books: [], totalItems: 0 }),
}));
