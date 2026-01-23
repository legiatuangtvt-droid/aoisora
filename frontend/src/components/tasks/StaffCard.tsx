'use client';

import { useState } from 'react';
import { StaffResult, Comment, RequirementImage } from '@/types/tasks';
import ImageLightbox from './ImageLightbox';
import { LazyImageSimple } from '@/components/ui/LazyImage';

interface StaffCardProps {
  staff: StaffResult;
  onSendReminder?: (staffId: string) => void;
  onAddComment?: (staffId: string, content: string) => void;
}

export default function StaffCard({ staff, onSendReminder, onAddComment }: StaffCardProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [newComment, setNewComment] = useState('');

  const getStatusConfig = () => {
    switch (staff.status) {
      case 'success':
        return {
          label: 'Completed',
          bgColor: 'bg-green-100 dark:bg-green-900/30',
          textColor: 'text-green-700 dark:text-green-400',
          borderColor: 'border-green-500',
        };
      case 'in_progress':
        return {
          label: 'In Progress',
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
          textColor: 'text-yellow-700 dark:text-yellow-400',
          borderColor: 'border-yellow-500',
        };
      default:
        return {
          label: 'Not Started',
          bgColor: 'bg-gray-100 dark:bg-gray-700',
          textColor: 'text-gray-600 dark:text-gray-400',
          borderColor: 'border-gray-300 dark:border-gray-600',
        };
    }
  };

  const statusConfig = getStatusConfig();

  // Convert requirements to ImageItem format for lightbox
  const requirementImages = staff.requirements
    .filter(r => r.url)
    .map(r => ({
      id: r.id,
      title: 'Requirement Image',
      url: r.url,
      thumbnailUrl: r.thumbnailUrl || r.url,
      uploadedAt: '',
    }));

  const handleSubmitComment = () => {
    if (newComment.trim() && onAddComment) {
      onAddComment(staff.id, newComment.trim());
      setNewComment('');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      {/* Header - Staff Info */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between">
          {/* Left - Avatar & Info */}
          <div className="flex items-start gap-3">
            {/* Avatar with status indicator */}
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-pink-200 dark:bg-pink-900/50 flex items-center justify-center overflow-hidden">
                {staff.avatar ? (
                  <LazyImageSimple src={staff.avatar} alt={staff.staffName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-pink-700 dark:text-pink-300 font-bold text-lg">
                    {staff.staffName.charAt(0)}
                  </span>
                )}
              </div>
              {/* Status dot */}
              <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${
                staff.status === 'success' ? 'bg-green-500' :
                staff.status === 'in_progress' ? 'bg-yellow-500' : 'bg-gray-400'
              }`} />
            </div>

            {/* Info */}
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white">{staff.staffName}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">ID: {staff.staffId}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{staff.position} • {staff.store}</p>
            </div>
          </div>

          {/* Right - Status Badge */}
          <span className={`px-2 py-1 rounded text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}>
            {statusConfig.label}
          </span>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">Progress</span>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{staff.progressText}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                staff.progress === 100 ? 'bg-green-500' :
                staff.progress > 0 ? 'bg-yellow-500' : 'bg-gray-400'
              }`}
              style={{ width: `${staff.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Requirements Grid */}
      {staff.requirements.length > 0 && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">REQUIREMENTS</p>
          <div className="grid grid-cols-2 gap-2">
            {staff.requirements.map((req, index) => (
              <div
                key={req.id}
                className={`aspect-square rounded-lg overflow-hidden border-2 cursor-pointer ${
                  req.isCompleted ? 'border-green-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                onClick={() => req.url && setLightboxIndex(index)}
              >
                {req.url ? (
                  <img
                    src={req.thumbnailUrl || req.url}
                    alt={`Requirement ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comments */}
      {staff.comments.length > 0 && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-2">
          {staff.comments.slice(0, 2).map((comment) => (
            <div key={comment.id} className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs">{comment.userInitials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs">
                  <span className="font-medium text-gray-900 dark:text-white">{comment.userName}</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">{formatTime(comment.createdAt)}</span>
                </p>
                <p className="text-xs text-gray-700 dark:text-gray-300 truncate">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comment Input / Send Reminder */}
      <div className="p-3">
        {staff.status === 'not_started' ? (
          <button
            onClick={() => onSendReminder?.(staff.id)}
            className="w-full py-2 px-4 border border-[#C5055B] text-[#C5055B] rounded-lg text-sm font-medium hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors"
          >
            Send Reminder
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-pink-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
            />
            <button
              onClick={handleSubmitComment}
              disabled={!newComment.trim()}
              className="p-1.5 text-[#C5055B] hover:text-pink-700 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Image Lightbox */}
      {lightboxIndex !== null && requirementImages.length > 0 && (
        <ImageLightbox
          images={requirementImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}
