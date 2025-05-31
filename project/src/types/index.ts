// User types
export interface User {
  id: string;
  email: string;
  username?: string;
}

// Book types
export interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    publishedDate?: string;
    description?: string;
    pageCount?: number;
    categories?: string[];
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    publisher?: string;
    industryIdentifiers?: Array<{
      type: string;
      identifier: string;
    }>;
    averageRating?: number;
    ratingsCount?: number;
    language?: string;
  };
}

export interface BookCollection {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
  books: string[]; // Array of book ids
}

// Auth related types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  username?: string;
}

// API Response types
export interface GoogleBooksResponse {
  kind: string;
  totalItems: number;
  items: Book[];
}