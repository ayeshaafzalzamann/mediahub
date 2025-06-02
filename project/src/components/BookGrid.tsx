import React from 'react';
import { Book } from '../types';
import BookCard from './BookCard';
import LoadingSpinner from './LoadingSpinner';

interface BookGridProps {
  books: Book[];
  isLoading?: boolean;
  loadMore?: () => void;
  hasMore?: boolean;
  emptyMessage?: string;
}

const BookGrid: React.FC<BookGridProps> = ({
  books,
  isLoading = false,
  loadMore,
  hasMore = false,
  emptyMessage = 'No books found',
}) => {
  if (isLoading && books.length === 0) {
    return (
      <div className="flex justify-center items-center py-16">
        <LoadingSpinner />
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="flex justify-center items-center py-16">
        <p className="text-gray-400 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {loadMore && hasMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="px-6 py-2 bg-[#E53935] text-white rounded-md hover:bg-[#C62828] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <LoadingSpinner size="sm" /> : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default BookGrid;