'use client';

import { useState } from 'react';
import { StoreResult, TaskType } from '@/types/tasks';
import ImageGrid from './ImageGrid';
import ImageLightbox from './ImageLightbox';
import CommentsSection from './CommentsSection';
import YesNoStatusSection from './YesNoStatusSection';

interface StoreResultCardProps {
  result: StoreResult;
  showImages?: boolean;
  viewMode?: 'results' | 'comment';
  taskType?: TaskType;
  onAddComment?: (storeId: string, content: string) => void;
  onLike?: (storeId: string) => void;
}

export default function StoreResultCard({
  result,
  showImages = true,
  viewMode = 'results',
  taskType = 'image',
  onAddComment,
  onLike,
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

  const handleLike = () => {
    onLike?.(result.storeId);
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-6">
      {/* Main Content Section */}
      <div className="p-4">
        {/* Store Header */}
        <div className="flex items-start justify-between mb-4">
          {/* Left - Store Info */}
          <div>
            <p className="text-xs mb-1">
              <span className="text-teal-500">{result.storeLocation.split(' - ')[0]}</span>
              <span className="text-gray-500 dark:text-gray-400"> - {result.storeLocation.split(' - ').slice(1).join(' - ')}</span>
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

        {/* Content Section - varies by taskType and viewMode */}
        {viewMode === 'results' && (
          <>
            {/* Image Grid - for image task type */}
            {taskType === 'image' && showImages && result.images.length > 0 && (
              <div className="mb-4">
                <ImageGrid
                  images={result.images}
                  onImageClick={handleImageClick}
                />
              </div>
            )}

            {/* Yes/No Status Section - for yes_no task type */}
            {taskType === 'yes_no' && (
              <YesNoStatusSection
                status={result.status}
                likes={result.likes}
                reportLink="#"
                onLike={handleLike}
              />
            )}
          </>
        )}

        {/* Bottom Row: Completed By + Headphone Icon */}
        <div className="flex items-center justify-between">
          {/* Completed By */}
          {result.completedBy && (
            <div className="flex items-center">
              <span className="text-xs text-gray-500 dark:text-gray-400 italic">Completed by</span>
              <div className="inline-flex items-center ml-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/30 text-gray-900 dark:text-green-300 rounded-lg text-sm font-semibold border border-green-200 dark:border-green-700">
                {result.completedBy.name}
              </div>
            </div>
          )}

          {/* Cloud Check Icon */}
          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <img
              src="/icons/mdi_cloud-check-outline.png"
              alt="Cloud check"
              className="w-5 h-5"
            />
          </button>
        </div>
      </div>

      {/* Comments Section - Always expanded in comment view mode */}
      <CommentsSection
        comments={result.comments}
        onAddComment={handleAddComment}
        defaultExpanded={viewMode === 'comment'}
        alwaysExpanded={viewMode === 'comment'}
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
