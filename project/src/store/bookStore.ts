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
  
  // Actions
  searchForBooks: (query: string) => Promise<void>;
  loadMoreBooks: (startIndex: number) => Promise<void>;
  fetchBookById: (id: string) => Promise<void>;
  fetchNewestBooks: () => Promise<void>;
  fetchBooksByCategory: (category: string) => Promise<void>;
  
  // User collections
  addToFavorites: (book: Book) => Promise<void>;
  removeFromFavorites: (bookId: string) => Promise<void>;
  fetchUserFavorites: () => Promise<void>;
  
  // Search state
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
      set({
        error: error.message || 'Failed to search books',
        isLoading: false,
      });
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
      set({
        error: error.message || 'Failed to load more books',
        isLoading: false,
      });
      toast.error('Failed to load more books');
    }
  },
  
  fetchBookById: async (id: string) => {
    set({ isLoading: true, error: null, currentBook: null });
    try {
      const book = await getBookById(id);
      set({
        currentBook: book,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch book details',
        isLoading: false,
      });
      toast.error('Failed to fetch book details');
    }
  },
  
  fetchNewestBooks: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getNewestBooks();
      set({
        books: response.items || [],
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch newest books',
        isLoading: false,
      });
      toast.error('Failed to fetch newest books');
    }
  },
  
  fetchBooksByCategory: async (category: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getBooksByCategory(category);
      set({
        books: response.items || [],
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch books by category',
        isLoading: false,
      });
      toast.error('Failed to fetch books by category');
    }
  },
  
  addToFavorites: async (book: Book) => {
    const { user } = await supabase.auth.getUser();
    if (!user.data) {
      toast.error('You must be logged in to save favorites');
      return;
    }
    
    try {
      // Check if book already exists in favorites
      const { data: existingFavorite } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.data.id)
        .eq('book_id', book.id)
        .single();
      
      if (existingFavorite) {
        toast.error('Book is already in your favorites');
        return;
      }
      
      // Add to favorites table
      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.data.id,
          book_id: book.id,
          book_data: book,
        });
      
      if (error) throw error;
      
      set((state) => ({
        favoriteBooks: [...state.favoriteBooks, book],
      }));
      
      toast.success('Added to favorites');
    } catch (error: any) {
      toast.error('Failed to add to favorites');
    }
  },
  
  removeFromFavorites: async (bookId: string) => {
    const { user } = await supabase.auth.getUser();
    if (!user.data) {
      toast.error('You must be logged in to manage favorites');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.data.id)
        .eq('book_id', bookId);
      
      if (error) throw error;
      
      set((state) => ({
        favoriteBooks: state.favoriteBooks.filter(book => book.id !== bookId),
      }));
      
      toast.success('Removed from favorites');
    } catch (error: any) {
      toast.error('Failed to remove from favorites');
    }
  },
  
  fetchUserFavorites: async () => {
    const { user } = await supabase.auth.getUser();
    if (!user.data) return;
    
    set({ isLoading: true });
    
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('book_data')
        .eq('user_id', user.data.id);
      
      if (error) throw error;
      
      const books = data.map(item => item.book_data as Book);
      
      set({
        favoriteBooks: books,
        isLoading: false,
      });
    } catch (error: any) {
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