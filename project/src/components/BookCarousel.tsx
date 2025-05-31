import React, { useState, useRef, useEffect } from 'react';
import { Book } from '../types';
import BookCard from './BookCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BookCarouselProps {
  title: string;
  books: Book[];
  isLoading?: boolean;
}

const BookCarousel: React.FC<BookCarouselProps> = ({ title, books, isLoading = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const { current: container } = containerRef;
      const scrollAmount = container.clientWidth * 0.8;
      
      if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const checkButtonVisibility = () => {
    if (containerRef.current) {
      const { current: container } = containerRef;
      
      // Check if scrolled to the left edge
      setShowLeftButton(container.scrollLeft > 20);
      
      // Check if scrolled to the right edge
      const maxScrollLeft = container.scrollWidth - container.clientWidth - 20;
      setShowRightButton(container.scrollLeft < maxScrollLeft);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', checkButtonVisibility);
      // Initial check
      checkButtonVisibility();
      
      // Check on window resize
      window.addEventListener('resize', checkButtonVisibility);
      
      return () => {
        container.removeEventListener('scroll', checkButtonVisibility);
        window.removeEventListener('resize', checkButtonVisibility);
      };
    }
  }, [books]);

  if (isLoading || books.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <h2 className="text-white text-2xl font-bold mb-6">{title}</h2>
      
      <div className="relative group">
        <div 
          ref={containerRef}
          className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {books.map((book) => (
            <div key={book.id} className="flex-shrink-0 w-44 sm:w-48">
              <BookCard book={book} />
            </div>
          ))}
        </div>
        
        {showLeftButton && (
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 bg-[#121212]/90 hover:bg-[#E53935] text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        
        {showRightButton && (
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 bg-[#121212]/90 hover:bg-[#E53935] text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Scroll right"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </div>
  );
};

export default BookCarousel;