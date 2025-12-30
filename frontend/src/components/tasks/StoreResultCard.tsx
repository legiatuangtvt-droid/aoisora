'use client';

import { useState } from 'react';
import { StoreResult, ImageItem } from '@/types/tasks';
import ImageGrid from './ImageGrid';
import ImageLightbox from './ImageLightbox';
import CommentsSection from './CommentsSection';
import TaskStatusCard from './TaskStatusCard';

interface StoreResultCardProps {
  result: StoreResult;
  showImages?: boolean;
  onAddComment?: (storeId: string, content: string) => void;
}

export default function StoreResultCard({
  result,
  showImages = true,
  onAddComment,
}: StoreResultCardProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
  };

  const handleCloseLightbox = () => {
    setLightboxIndex(null);
  };

  const handleAddComment = (content: string) => {
    onAddComment?.(result.storeId, content);
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-6">
      {/* Store Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between">
          {/* Left - Store Info */}
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              {result.storeLocation}
            </p>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {result.storeName}
            </h3>
          </div>

          {/* Right - Dates & Menu */}
          <div className="flex items-start gap-4">
            {/* Dates - Same row layout */}
            <div className="flex items-start gap-6 text-xs">
              {result.startTime && (
                <div>
                  <p className="text-gray-400 dark:text-gray-500 mb-0.5">Start time</p>
                  <p className="text-gray-700 dark:text-gray-300">{result.startTime}</p>
                </div>
              )}
              {result.completedTime && (
                <div>
                  <p className="text-teal-500 mb-0.5">Completed time</p>
                  <p className="text-gray-700 dark:text-gray-300">{result.completedTime}</p>
                </div>
              )}
            </div>

            {/* Menu button */}
            <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Completed By */}
        {result.completedBy && (
          <div className="mt-3">
            <span className="text-xs text-gray-500 dark:text-gray-400">Completed by</span>
            <div className="inline-flex items-center ml-2 px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 rounded-full text-sm font-medium">
              {result.completedBy.name}
            </div>
          </div>
        )}
      </div>

      {/* Images Grid */}
      {showImages && result.images.length > 0 && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <ImageGrid
            images={result.images}
            onImageClick={handleImageClick}
          />
        </div>
      )}

      {/* Task Status Card (for status display) */}
      {result.status !== 'not_started' && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <TaskStatusCard
            status={result.status}
            linkUrl="#"
            likes={result.likes}
          />
        </div>
      )}

      {/* Comments Section */}
      <CommentsSection
        comments={result.comments}
        onAddComment={handleAddComment}
        defaultExpanded={false}
      />

      {/* Image Lightbox */}
      {lightboxIndex !== null && (
        <ImageLightbox
          images={result.images}
          currentIndex={lightboxIndex}
          onClose={handleCloseLightbox}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
}
