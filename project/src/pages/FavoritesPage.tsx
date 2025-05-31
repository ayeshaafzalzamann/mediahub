import React, { useEffect } from 'react';
import { useBookStore } from '../store/bookStore';
import { useAuthStore } from '../store/authStore';
import { Link, useNavigate } from 'react-router-dom';
import BookGrid from '../components/BookGrid';
import { Heart, BookOpen } from 'lucide-react';

const FavoritesPage: React.FC = () => {
  const { favoriteBooks, fetchUserFavorites, isLoading } = useBookStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    fetchUserFavorites();
  }, [user, fetchUserFavorites, navigate]);
  
  if (!user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center mb-8">
        <Heart className="h-8 w-8 text-[#E53935] mr-3" />
        <h1 className="text-2xl md:text-3xl font-bold text-white">Your Favorites</h1>
      </div>
      
      <BookGrid 
        books={favoriteBooks} 
        isLoading={isLoading} 
        emptyMessage="You haven't added any books to your favorites yet."
      />
      
      {favoriteBooks.length === 0 && !isLoading && (
        <div className="text-center mt-8">
          <Link 
            to="/browse" 
            className="inline-block bg-[#E53935] text-white px-4 py-2 rounded-md hover:bg-[#C62828] transition-colors"
          >
            Browse Books
          </Link>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;