'use client';

import { useState, useRef, useEffect } from 'react';
import { ImageItem } from '@/types/tasks';

interface ImageGridProps {
  images: ImageItem[];
  onImageClick: (index: number) => void;
}

export default function ImageGrid({ images, onImageClick }: ImageGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [images]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScroll, 300);
    }
  };

  if (images.length === 0) return null;

  return (
    <div className="relative">
      {/* Scroll Left Button */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Images Container */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-4 overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {images.map((image, index) => (
          <ImageCard
            key={image.id}
            image={image}
            onClick={() => onImageClick(index)}
          />
        ))}
      </div>

      {/* Scroll Right Button */}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}

// Image Card Component - Matching mockup design
interface ImageCardProps {
  image: ImageItem;
  onClick: () => void;
}

function ImageCard({ image, onClick }: ImageCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Format date for display
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="flex-shrink-0 w-[280px] border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
      {/* Card Header - Title + Menu */}
      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-sm font-semibold text-gray-900 dark:text-white">
          {image.title} {image.count && `(${image.count})`}
        </span>
        <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      {/* Image Container */}
      <div
        className="relative aspect-[16/10] cursor-pointer mx-3"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
      >
        <img
          src={image.thumbnailUrl || image.url}
          alt={image.title}
          className="w-full h-full object-cover rounded-md"
        />

        {/* Play Icon (bottom-right corner) */}
        <div className="absolute bottom-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow">
          <svg className="w-4 h-4 text-gray-700 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>

        {/* Hover overlay with View button */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity rounded-md">
            <button className="flex items-center gap-2 px-4 py-2 bg-white/95 rounded-lg text-sm font-medium text-gray-800 hover:bg-white shadow-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              View
            </button>
          </div>
        )}
      </div>

      {/* Upload date */}
      <p className="text-xs text-gray-500 dark:text-gray-400 px-3 py-2">
        Uploaded: {formatDate(image.uploadedAt)}
      </p>
    </div>
  );
}
