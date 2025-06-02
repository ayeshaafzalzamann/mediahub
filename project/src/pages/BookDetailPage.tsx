import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBookStore } from '../store/bookStore';
import { useAuthStore } from '../store/authStore';
import LoadingSpinner from '../components/LoadingSpinner';
import { Heart, Share2, Calendar, Bookmark, User, Book, Globe, FileText, BarChart2 } from 'lucide-react';
import BookCard from '../components/BookCard';

const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { fetchBookById, currentBook, isLoading, books, fetchBooksByCategory, addToFavorites, removeFromFavorites, favoriteBooks } = useBookStore();
  const { user } = useAuthStore();
  const [showFullDescription, setShowFullDescription] = useState(false);
  
  useEffect(() => {
    if (id) {
      fetchBookById(id);
    }
  }, [id, fetchBookById]);
  
  useEffect(() => {
    if (currentBook?.volumeInfo.categories && currentBook.volumeInfo.categories.length > 0) {
      fetchBooksByCategory(currentBook.volumeInfo.categories[0]);
    }
  }, [currentBook, fetchBooksByCategory]);
  
  if (isLoading && !currentBook) {
    return (
      <div className="flex justify-center items-center py-32">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (!currentBook) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Book not found</h1>
        <p className="text-gray-400 mb-8">The book you're looking for doesn't exist or has been removed.</p>
        <Link 
          to="/" 
          className="inline-block bg-[#E53935] text-white px-4 py-2 rounded-md hover:bg-[#C62828] transition-colors"
        >
          Return Home
        </Link>
      </div>
    );
  }
  
  const {
    title,
    authors = [],
    publishedDate,
    description,
    pageCount,
    categories = [],
    imageLinks,
    publisher,
    averageRating,
    ratingsCount,
    language,
  } = currentBook.volumeInfo;
  
  const coverImage = imageLinks?.thumbnail || '/placeholder-book.png';
  const isBookFavorite = favoriteBooks.some(book => book.id === currentBook.id);
  
  const handleFavoriteToggle = () => {
    if (isBookFavorite) {
      removeFromFavorites(currentBook.id);
    } else {
      addToFavorites(currentBook);
    }
  };
  
  const truncatedDescription = description && description.length > 500 
    ? `${description.substring(0, 500)}...` 
    : description;
  
  const relatedBooks = books
    .filter(book => book.id !== currentBook.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-[#1E1E1E] rounded-lg overflow-hidden shadow-lg border border-[#E53935]/20">
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Book Cover */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <div className="w-48 h-72 overflow-hidden rounded-md shadow-lg bg-[#2A2A2A] mb-4">
                <img
                  src={coverImage}
                  alt={title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-book.png';
                  }}
                />
              </div>
              
              {user && (
                <button
                  onClick={handleFavoriteToggle}
                  className={`w-full py-2 px-4 rounded-md flex items-center justify-center gap-2 mb-2 ${
                    isBookFavorite 
                      ? 'bg-[#E53935] text-white' 
                      : 'bg-transparent border border-[#E53935] text-[#E53935]'
                  } hover:bg-[#C62828] hover:text-white transition-colors`}
                >
                  <Heart size={18} className={isBookFavorite ? 'fill-white' : ''} />
                  {isBookFavorite ? 'Saved to Favorites' : 'Add to Favorites'}
                </button>
              )}
              
              <button
                className="w-full py-2 px-4 rounded-md flex items-center justify-center gap-2 bg-[#2A2A2A] text-white hover:bg-[#3A3A3A] transition-colors"
              >
                <Share2 size={18} />
                Share
              </button>
            </div>
            
            {/* Book Details */}
            <div className="flex-grow">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{title}</h1>
              
              <div className="mb-4">
                <p className="text-gray-300">
                  {authors.length > 0 ? authors.join(', ') : 'Unknown Author'}
                </p>
                {publisher && (
                  <p className="text-gray-400 text-sm">
                    Published by {publisher} {publishedDate ? `(${publishedDate.substring(0, 4)})` : ''}
                  </p>
                )}
              </div>
              
              {averageRating && (
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-lg">
                        {i < Math.round(averageRating) ? (
                          <span className="text-[#E53935]">★</span>
                        ) : (
                          <span className="text-gray-600">★</span>
                        )}
                      </span>
                    ))}
                  </div>
                  <span className="text-gray-400 ml-2">
                    {averageRating.toFixed(1)} ({ratingsCount} {ratingsCount === 1 ? 'rating' : 'ratings'})
                  </span>
                </div>
              )}
              
              {description && (
                <div className="mb-6">
                  <p className="text-gray-300 leading-relaxed">
                    {showFullDescription ? description : truncatedDescription}
                  </p>
                  {description.length > 500 && (
                    <button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="mt-2 text-[#E53935] hover:text-[#C62828] font-medium"
                    >
                      {showFullDescription ? 'Show less' : 'Read more'}
                    </button>
                  )}
                </div>
              )}
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {pageCount && (
                  <div className="bg-[#2A2A2A] p-4 rounded-md flex flex-col items-center text-center">
                    <FileText className="text-[#E53935] mb-2\" size={20} />
                    <span className="text-white font-medium">{pageCount}</span>
                    <span className="text-gray-400 text-sm">Pages</span>
                  </div>
                )}
                
                {publishedDate && (
                  <div className="bg-[#2A2A2A] p-4 rounded-md flex flex-col items-center text-center">
                    <Calendar className="text-[#E53935] mb-2" size={20} />
                    <span className="text-white font-medium">{publishedDate.substring(0, 4)}</span>
                    <span className="text-gray-400 text-sm">Published</span>
                  </div>
                )}
                
                {language && (
                  <div className="bg-[#2A2A2A] p-4 rounded-md flex flex-col items-center text-center">
                    <Globe className="text-[#E53935] mb-2" size={20} />
                    <span className="text-white font-medium">{language.toUpperCase()}</span>
                    <span className="text-gray-400 text-sm">Language</span>
                  </div>
                )}
                
                {categories.length > 0 && (
                  <div className="bg-[#2A2A2A] p-4 rounded-md flex flex-col items-center text-center">
                    <Book className="text-[#E53935] mb-2" size={20} />
                    <span className="text-white font-medium truncate max-w-full">{categories[0]}</span>
                    <span className="text-gray-400 text-sm">Category</span>
                  </div>
                )}
              </div>
              
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {categories.map((category, index) => (
                    <Link
                      key={index}
                      to={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                      className="bg-[#2A2A2A] px-3 py-1 rounded-full text-sm text-gray-300 hover:bg-[#E53935]/20 hover:text-white transition-colors"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Books */}
      {relatedBooks.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">You might also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {relatedBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetailPage;