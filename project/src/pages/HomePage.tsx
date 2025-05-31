import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, ChevronRight } from 'lucide-react';
import { useBookStore } from '../store/bookStore';
import BookCarousel from '../components/BookCarousel';
import { getBooksByCategory, getNewestBooks } from '../lib/api';
import { Book } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import SpotifySearch from '../components/SpotifySearch';

const HomePage: React.FC = () => {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [newReleases, setNewReleases] = useState<Book[]>([]);
  const [fictionBooks, setFictionBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const { searchForBooks } = useBookStore();
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const fetchInitialBooks = async () => {
      setLoading(true);
      try {
        // Get new releases
        const newBooks = await getNewestBooks();
        if (newBooks?.items) {
          setNewReleases(newBooks.items);
        }
        
        // Get fiction books
        const fiction = await getBooksByCategory('fiction');
        if (fiction?.items) {
          setFictionBooks(fiction.items);
        }
        
        // Get featured books (popular non-fiction)
        const featured = await getBooksByCategory('non-fiction');
        if (featured?.items) {
          setFeaturedBooks(featured.items);
        }
      } catch (error) {
        console.error('Error fetching initial books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialBooks();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      searchForBooks(searchInput);
      // Navigate programmatically to search results
      window.location.href = '/search';
    }
  };

  const featuredCategories = [
    { name: 'Science Fiction', slug: 'science-fiction' },
    { name: 'Mystery', slug: 'mystery' },
    { name: 'Romance', slug: 'romance' },
    { name: 'Biography', slug: 'biography' },
    { name: 'History', slug: 'history' },
    { name: 'Self-Help', slug: 'self-help' },
  ];

  return (
    <div className="text-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#000000] to-[#121212] py-16 md:py-24">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <BookOpen className="h-16 w-16 text-[#E53935] mb-6" />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Discover Your Next Favorite Book
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mb-8">
            Search millions of books, create your personal library, and join a community of book lovers.
          </p>
          
          <form onSubmit={handleSearch} className="w-full max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by title, author, or ISBN..."
                className="w-full py-4 pl-5 pr-12 rounded-lg bg-[#1E1E1E] border border-[#E53935]/30 focus:border-[#E53935] text-white focus:outline-none text-lg"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button 
                type="submit" 
                className="absolute right-0 top-0 h-full px-4 text-[#E53935] hover:text-white hover:bg-[#E53935] rounded-r-lg transition-colors"
              >
                <Search size={24} />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            {/* New Releases */}
            <section className="mb-16">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">New Releases</h2>
                <Link to="/new-releases" className="text-[#E53935] hover:text-[#C62828] flex items-center transition-colors">
                  View all <ChevronRight size={16} />
                </Link>
              </div>
              <BookCarousel title="" books={newReleases} />
            </section>

            {/* Categories */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold mb-6">Popular Categories</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {featuredCategories.map((category) => (
                  <Link
                    key={category.slug}
                    to={`/category/${category.slug}`}
                    className="bg-[#1E1E1E] rounded-lg p-6 text-center hover:bg-[#E53935]/10 hover:border-[#E53935] border border-transparent transition-all duration-300"
                  >
                    <h3 className="text-lg font-medium">{category.name}</h3>
                  </Link>
                ))}
              </div>
            </section>

            {/* Fiction Books */}
            <section className="mb-16">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Fiction Bestsellers</h2>
                <Link to="/category/fiction" className="text-[#E53935] hover:text-[#C62828] flex items-center transition-colors">
                  View all <ChevronRight size={16} />
                </Link>
              </div>
              <BookCarousel title="" books={fictionBooks} />
            </section>

            {/* Featured Non-Fiction */}
            <section className="mb-16">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Featured Non-Fiction</h2>
                <Link to="/category/non-fiction" className="text-[#E53935] hover:text-[#C62828] flex items-center transition-colors">
                  View all <ChevronRight size={16} />
                </Link>
              </div>
              <BookCarousel title="" books={featuredBooks} />
            </section>
            

            {/* Call to Action */}
            <section className="bg-gradient-to-r from-[#E53935]/20 to-[#1E1E1E] rounded-lg p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Join Our Community of Book Lovers</h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Create a free account to build your personal library, track your reading progress, and connect with other readers.
              </p>
              <Link 
                to="/signup" 
                className="inline-block bg-[#E53935] text-white px-6 py-3 rounded-md hover:bg-[#C62828] transition-colors font-medium"
              >
                Sign Up Now
              </Link>
            </section>
            {/* Spotify Music Discovery */}
              <section className="mb-16">
                <h2 className="text-2xl font-bold mb-6">Discover Music on Spotify</h2>
                <SpotifySearch />
              </section>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;