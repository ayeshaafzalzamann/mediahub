import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Search, User, LogOut, LogIn, Heart, Menu, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useBookStore } from '../store/bookStore';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const { user, logout, checkSession } = useAuthStore();
  const { searchForBooks } = useBookStore();
  const navigate = useNavigate();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      searchForBooks(searchInput);
      navigate('/search');
      setIsMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-[#121212] shadow-md border-b border-[#E53935]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <BookOpen className="h-8 w-8 text-[#E53935]" />
              <span className="ml-2 text-xl font-bold text-white">House Of Wisdom</span>
            </Link>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center flex-1 max-w-lg mx-6">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for books..."
                  className="w-full py-2 pl-4 pr-10 rounded-md bg-[#1E1E1E] border border-[#E53935]/30 focus:border-[#E53935] text-white focus:outline-none"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <button 
                  type="submit" 
                  className="absolute right-0 top-0 h-full px-3 text-[#E53935]"
                >
                  <Search size={20} />
                </button>
              </div>
            </form>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/browse" className="text-white hover:text-[#E53935] transition-colors">
              Browse
            </Link>
            {user ? (
              <>
                <Link to="/favorites" className="text-white hover:text-[#E53935] transition-colors flex items-center">
                  <Heart size={18} className="mr-1" />
                  Favorites
                </Link>
                <Link to="/profile" className="text-white hover:text-[#E53935] transition-colors flex items-center">
                  <User size={18} className="mr-1" />
                  Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center text-white hover:text-[#E53935] transition-colors"
                >
                  <LogOut size={18} className="mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-white hover:text-[#E53935] transition-colors flex items-center"
                >
                  <LogIn size={18} className="mr-1" />
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-[#E53935] text-white px-4 py-2 rounded-md hover:bg-[#C62828] transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-[#E53935] focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#1A1A1A] border-t border-[#E53935]/20 shadow-lg">
          <div className="px-4 pt-2 pb-4 space-y-3">
            <form onSubmit={handleSearch} className="w-full mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for books..."
                  className="w-full py-2 pl-4 pr-10 rounded-md bg-[#1E1E1E] border border-[#E53935]/30 focus:border-[#E53935] text-white focus:outline-none"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <button 
                  type="submit" 
                  className="absolute right-0 top-0 h-full px-3 text-[#E53935]"
                >
                  <Search size={20} />
                </button>
              </div>
            </form>
            
            <Link 
              to="/browse" 
              className="block py-2 text-white hover:text-[#E53935] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Browse
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/favorites" 
                  className="block py-2 text-white hover:text-[#E53935] transition-colors flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Heart size={18} className="mr-2" />
                  Favorites
                </Link>
                <Link 
                  to="/profile" 
                  className="block py-2 text-white hover:text-[#E53935] transition-colors flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={18} className="mr-2" />
                  Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left py-2 text-white hover:text-[#E53935] transition-colors flex items-center"
                >
                  <LogOut size={18} className="mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="block py-2 text-white hover:text-[#E53935] transition-colors flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LogIn size={18} className="mr-2" />
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="block py-2 bg-[#E53935] text-white px-4 rounded-md hover:bg-[#C62828] transition-colors text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;