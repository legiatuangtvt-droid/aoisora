'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ManagerComment } from '@/types/todoTask';

interface ManagerCommentPanelProps {
  managerComments: ManagerComment[];
  otherComments: ManagerComment[];
  onAddManagerComment?: (content: string) => void;
  onAddOtherComment?: (content: string) => void;
}

// Get initials from name
function getInitials(name: string): string {
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

// Format time from Date
function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export default function ManagerCommentPanel({
  managerComments,
  onAddManagerComment,
}: ManagerCommentPanelProps) {
  const [replyText, setReplyText] = useState('');

  const handleSendReply = () => {
    if (replyText.trim() && onAddManagerComment) {
      onAddManagerComment(replyText.trim());
      setReplyText('');
    }
  };

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center gap-1">
        <Image
          src="/icons/material-symbols_comment-rounded.png"
          alt="Comment"
          width={24}
          height={24}
        />
        <span className="text-[16px] font-bold text-black dark:text-white">
          Manager Comment
        </span>
      </div>

      {/* Comment Card */}
      <div
        className="bg-white dark:bg-gray-800 rounded-[10px] p-4"
        style={{ border: '0.5px solid #6B6B6B' }}
      >
        {/* Comments List */}
        <div className="space-y-4">
          {managerComments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              {/* Avatar with initials - outside message box */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-xs font-medium text-white">
                  {getInitials(comment.author)}
                </span>
              </div>

              {/* Content with gray background */}
              <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-sm text-black dark:text-white">
                    {comment.author}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatTime(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Reply Input */}
        <div className="flex items-start gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          {/* User Avatar placeholder */}
          <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-gray-500"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>

          {/* Input with Send Button */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Reply..."
              className="w-full px-3 py-2 pr-10 text-sm bg-transparent border-none focus:ring-0 focus:outline-none placeholder-gray-400 text-gray-900 dark:text-white"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendReply();
                }
              }}
            />
            {/* Send Button */}
            <button
              onClick={handleSendReply}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-pink-500 hover:text-pink-600 transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
