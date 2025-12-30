'use client';

import { useState } from 'react';
import { Comment } from '@/types/tasks';

interface CommentsSectionProps {
  comments: Comment[];
  onAddComment?: (content: string) => void;
  defaultExpanded?: boolean;
  alwaysExpanded?: boolean; // When true, always expanded and hide toggle arrow
}

export default function CommentsSection({
  comments,
  onAddComment,
  defaultExpanded = false,
  alwaysExpanded = false,
}: CommentsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded || alwaysExpanded);
  const [newComment, setNewComment] = useState('');

  const handleSubmit = () => {
    if (newComment.trim() && onAddComment) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Format date with ordinal suffix (e.g., "Tuesday, December 16th")
  const formatDateWithOrdinal = (date: Date) => {
    const day = date.getDate();
    const ordinal = (d: number) => {
      if (d > 3 && d < 21) return 'th';
      switch (d % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };
    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    return `${weekday}, ${month} ${day}${ordinal(day)}`;
  };

  // Group comments by date
  const groupedComments = comments.reduce((acc, comment) => {
    const date = formatDateWithOrdinal(new Date(comment.createdAt));
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(comment);
    return acc;
  }, {} as Record<string, Comment[]>);

  return (
    <div className="border-t border-gray-200 dark:border-gray-700">
      {/* Header */}
      {alwaysExpanded ? (
        <div className="px-4 py-3">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            Comments ({comments.length})
          </span>
        </div>
      ) : (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Comments ({comments.length})
          </span>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}

      {/* Comments List */}
      {isExpanded && (
        <div className="px-4 pb-4">
          {comments.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 py-4 text-center">
              No comments yet
            </p>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedComments).map(([date, dateComments]) => (
                <div key={date}>
                  {/* Date separator */}
                  <div className="flex items-center justify-center my-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 px-4 py-1.5 rounded-full">
                      {date}
                    </span>
                  </div>

                  {/* Comments for this date */}
                  {dateComments.map((comment) => (
                    <CommentItem key={comment.id} comment={comment} />
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Comment Input */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center gap-3">
            {/* User Avatar */}
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 relative">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Comment..."
                className="w-full px-4 py-3 pr-12 border border-gray-200 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white"
              />
              <button
                onClick={handleSubmit}
                disabled={!newComment.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[#C5055B] hover:text-pink-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Comment Item Component
interface CommentItemProps {
  comment: Comment;
}

function CommentItem({ comment }: CommentItemProps) {
  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="flex items-start gap-3 py-2">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
        {comment.userAvatar ? (
          <img
            src={comment.userAvatar}
            alt={comment.userName}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span className="text-sky-600 text-sm font-semibold">
            {comment.userInitials}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {comment.userName}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatTime(comment.createdAt)}
          </span>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">
          {comment.content}
        </p>
      </div>
    </div>
  );
}
