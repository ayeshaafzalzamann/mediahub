import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Github, Twitter, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1A1A1A] border-t border-[#E53935]/20 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              <BookOpen className="h-8 w-8 text-[#E53935]" />
              <span className="ml-2 text-xl font-bold">BookHaven</span>
            </Link>
            <p className="text-gray-300 text-sm">
              Your digital sanctuary for book lovers. Discover, collect, and organize your favorite books.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-[#E53935]">
                <Github size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-[#E53935]">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-[#E53935]">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/browse" className="text-gray-300 hover:text-[#E53935] transition-colors">
                  Browse Books
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-300 hover:text-[#E53935] transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/new-releases" className="text-gray-300 hover:text-[#E53935] transition-colors">
                  New Releases
                </Link>
              </li>
              <li>
                <Link to="/bestsellers" className="text-gray-300 hover:text-[#E53935] transition-colors">
                  Bestsellers
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Account</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/profile" className="text-gray-300 hover:text-[#E53935] transition-colors">
                  My Profile
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="text-gray-300 hover:text-[#E53935] transition-colors">
                  My Favorites
                </Link>
              </li>
              <li>
                <Link to="/reading-list" className="text-gray-300 hover:text-[#E53935] transition-colors">
                  Reading List
                </Link>
              </li>
              <li>
                <Link to="/settings" className="text-gray-300 hover:text-[#E53935] transition-colors">
                  Settings
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Help</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-[#E53935] transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-[#E53935] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-[#E53935] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-[#E53935] transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[#E53935]/20 mt-8 pt-8 text-center">
          <p className="text-gray-300 text-sm">
            &copy; {new Date().getFullYear()} BookHaven. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;