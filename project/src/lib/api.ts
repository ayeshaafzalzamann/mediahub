import { GoogleBooksResponse, Book } from '../types';

const API_BASE_URL = 'https://www.googleapis.com/books/v1/volumes';
const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY || '';

const keyParam = API_KEY ? `&key=${API_KEY}` : '';

export const searchBooks = async (query: string, startIndex = 0, maxResults = 20): Promise<GoogleBooksResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}?q=${encodeURIComponent(query)}&startIndex=${startIndex}&maxResults=${maxResults}${keyParam}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching books:', error);
    throw error;
  }
};

export const getBookById = async (id: string): Promise<Book> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}${keyParam ? keyParam : ''}`);

    if (!response.ok) {
      throw new Error('Failed to fetch book details');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching book details:', error);
    throw error;
  }
};

export const getBooksByCategory = async (category: string, startIndex = 0, maxResults = 20): Promise<GoogleBooksResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}?q=subject:${encodeURIComponent(category)}&startIndex=${startIndex}&maxResults=${maxResults}${keyParam}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch books by category');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching books by category:', error);
    throw error;
  }
};

export const getNewestBooks = async (maxResults = 20): Promise<GoogleBooksResponse> => {
  // Get books sorted by newest first
  try {
    const response = await fetch(
      `${API_BASE_URL}?q=subject:fiction&orderBy=newest&maxResults=${maxResults}${keyParam}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch newest books');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching newest books:', error);
    throw error;
  }
};