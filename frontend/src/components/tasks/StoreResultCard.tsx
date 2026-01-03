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
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.35 17L16.85 10.5L15.45 9.05L10.35 14.15L8.55 12.35L7.15 13.8L10.35 17ZM6.5 20C5.11667 20 3.93767 19.5123 2.963 18.537C1.98767 17.5623 1.5 16.3833 1.5 15C1.5 13.75 1.90433 12.6457 2.713 11.687C3.521 10.729 4.55 10.1333 5.8 9.9C6.18333 8.41667 6.97067 7.20833 8.162 6.275C9.354 5.34167 10.7 4.875 12.2 4.875C13.9333 4.875 15.4377 5.453 16.713 6.609C17.9877 7.76567 18.6917 9.18333 18.825 10.862C19.875 10.9453 20.7707 11.371 21.512 12.139C22.254 12.9063 22.625 13.8167 22.625 14.87C22.625 15.9867 22.2333 16.941 21.45 17.733C20.6667 18.5243 19.725 18.92 18.625 18.92H13V17H18.625C19.175 17 19.6457 16.8083 20.037 16.425C20.429 16.0417 20.625 15.575 20.625 15.025C20.625 14.475 20.4333 14.0083 20.05 13.625C19.6667 13.2417 19.2 13.05 18.65 13.05H16.95V12C16.95 10.6833 16.4917 9.56267 15.575 8.638C14.6583 7.71267 13.55 7.25 12.25 7.25C10.95 7.25 9.83333 7.71267 8.9 8.638C7.96667 9.56267 7.5 10.6833 7.5 12H6.5C5.66667 12 4.95833 12.2917 4.375 12.875C3.79167 13.4583 3.5 14.1667 3.5 15C3.5 15.8333 3.79167 16.5417 4.375 17.125C4.95833 17.7083 5.66667 18 6.5 18H11V20H6.5Z" fill="currentColor"/>
            </svg>
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
