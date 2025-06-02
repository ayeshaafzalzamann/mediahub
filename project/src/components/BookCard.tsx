import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Book } from '../types';
import { useBookStore } from '../store/bookStore';
import { useAuthStore } from '../store/authStore';

interface BookCardProps {
  book: Book;
  isFavorite?: boolean;
}

const BookCard: React.FC<BookCardProps> = ({ book, isFavorite = false }) => {
  const { addToFavorites, removeFromFavorites, favoriteBooks } = useBookStore();
  const { user } = useAuthStore();
  
  const isBookFavorite = isFavorite || favoriteBooks.some(favorite => favorite.id === book.id);
  
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isBookFavorite) {
      removeFromFavorites(book.id);
    } else {
      addToFavorites(book);
    }
  };
  
  const coverImage = book.volumeInfo.imageLinks?.thumbnail || '/placeholder-book.png';
  const title = book.volumeInfo.title || 'Unknown Title';
  const authors = book.volumeInfo.authors?.join(', ') || 'Unknown Author';

  return (
    <Link to={`/book/${book.id}`} className="group">
      <div className="bg-[#1E1E1E] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        <div className="relative overflow-hidden">
          <div className="aspect-w-2 aspect-h-3 bg-[#2A2A2A]">
            <img
              src={coverImage}
              alt={title}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-book.png';
              }}
            />
          </div>
          {user && (
            <button
              onClick={handleFavoriteToggle}
              className="absolute top-2 right-2 p-2 rounded-full bg-[#121212]/70 hover:bg-[#121212] transition-colors"
            >
              <Heart
                size={18}
                className={isBookFavorite ? "fill-[#E53935] text-[#E53935]" : "text-white"}
              />
            </button>
          )}
        </div>
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="text-white font-medium line-clamp-2 mb-1 group-hover:text-[#E53935] transition-colors">
            {title}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-1">{authors}</p>
          <div className="mt-auto pt-2">
            {book.volumeInfo.averageRating && (
              <div className="flex items-center">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-sm">
                      {i < Math.round(book.volumeInfo.averageRating || 0) ? (
                        <span className="text-[#E53935]">★</span>
                      ) : (
                        <span className="text-gray-600">★</span>
                      )}
                    </span>
                  ))}
                </div>
                <span className="text-gray-400 text-xs ml-1">
                  ({book.volumeInfo.ratingsCount || 0})
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;