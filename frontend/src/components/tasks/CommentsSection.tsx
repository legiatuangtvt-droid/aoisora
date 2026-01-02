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

  // Group comments by date
  const groupedComments = comments.reduce((acc, comment) => {
    const date = new Date(comment.createdAt).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
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
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
                  <div className="flex items-center justify-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
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
          <div className="mt-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="flex-1 relative">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Write a comment..."
                className="w-full px-4 py-2 pr-12 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button
                onClick={handleSubmit}
                disabled={!newComment.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-[#C5055B] hover:text-pink-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
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
      <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0">
        {comment.userAvatar ? (
          <img
            src={comment.userAvatar}
            alt={comment.userName}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span className="text-white text-xs font-medium">
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
