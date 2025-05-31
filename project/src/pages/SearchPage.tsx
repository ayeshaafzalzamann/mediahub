import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useBookStore } from '../store/bookStore';
import BookGrid from '../components/BookGrid';
import { Filter, SortAsc, BookOpen } from 'lucide-react';

const SearchPage: React.FC = () => {
  const { books, isLoading, searchQuery, searchForBooks, totalItems, loadMoreBooks } = useBookStore();
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 20;

  // Get query from URL or store
  const query = searchParams.get('q') || searchQuery;

  useEffect(() => {
    if (query) {
      searchForBooks(query);
    }
  }, [query, searchForBooks]);

  const loadMore = () => {
    const nextPage = currentPage + 1;
    const startIndex = nextPage * booksPerPage;
    loadMoreBooks(startIndex);
    setCurrentPage(nextPage);
  };

  const hasMore = books.length < totalItems;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {query ? (
              <>Search Results for "<span className="text-[#E53935]">{query}</span>"</>
            ) : (
              "Search Books"
            )}
          </h1>
          {books.length > 0 && (
            <p className="text-gray-400 mt-1">
              Found {totalItems} books
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1E1E1E] border border-[#E53935]/30 rounded-md text-white hover:bg-[#2A2A2A] transition-colors">
            <Filter size={18} />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1E1E1E] border border-[#E53935]/30 rounded-md text-white hover:bg-[#2A2A2A] transition-colors">
            <SortAsc size={18} />
            Sort
          </button>
        </div>
      </div>

      {books.length > 0 ? (
        <BookGrid
          books={books}
          isLoading={isLoading}
          loadMore={loadMore}
          hasMore={hasMore}
        />
      ) : !isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <BookOpen className="h-16 w-16 text-[#E53935]/50 mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            {query ? "No books found" : "Search for books to get started"}
          </h2>
          <p className="text-gray-400 max-w-md">
            {query
              ? "Try using different keywords or check the spelling."
              : "Enter a search term above to find books by title, author, or subject."}
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default SearchPage;
