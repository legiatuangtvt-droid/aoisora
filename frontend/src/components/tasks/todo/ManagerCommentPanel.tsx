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
  otherComments,
  onAddManagerComment,
  onAddOtherComment,
}: ManagerCommentPanelProps) {
  const [managerReplyText, setManagerReplyText] = useState('');
  const [otherReplyText, setOtherReplyText] = useState('');

  const handleSendManagerReply = () => {
    if (managerReplyText.trim() && onAddManagerComment) {
      onAddManagerComment(managerReplyText.trim());
      setManagerReplyText('');
    }
  };

  const handleSendOtherReply = () => {
    if (otherReplyText.trim() && onAddOtherComment) {
      onAddOtherComment(otherReplyText.trim());
      setOtherReplyText('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Manager Comment Section */}
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
        <div className="bg-white dark:bg-gray-800 rounded-[10px] p-4 border border-gray-300 dark:border-gray-500">
          {/* Comments List */}
          <div className="space-y-4">
            {managerComments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                {/* Avatar with initials - outside message box */}
                <div
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#E5F0FF' }}
                >
                  <span
                    className="text-[13px] font-bold"
                    style={{ color: '#003E95' }}
                  >
                    {getInitials(comment.author)}
                  </span>
                </div>

                {/* Content with gray background - special border-radius */}
                <div
                  className="flex-1 px-5 py-3"
                  style={{
                    backgroundColor: '#F4F4F4',
                    borderRadius: '0px 10px 10px 10px',
                  }}
                >
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-[16px] text-black dark:text-white">
                      {comment.author}
                    </span>
                    <span
                      className="text-[13px]"
                      style={{ color: '#6B6B6B' }}
                    >
                      {formatTime(comment.createdAt)}
                    </span>
                  </div>
                  <p
                    className="text-[15px] mt-1"
                    style={{ color: '#000000' }}
                  >
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Reply Input */}
          <div className="flex items-center gap-3 mt-4">
            {/* User Avatar placeholder */}
            <div className="flex-shrink-0 w-6 h-6 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-gray-500"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>

            {/* Input with Send Button */}
            <div
              className="flex-1 relative rounded-[10px] bg-white dark:bg-gray-800"
              style={{ border: '0.5px solid #9B9B9B' }}
            >
              <input
                type="text"
                value={managerReplyText}
                onChange={(e) => setManagerReplyText(e.target.value)}
                placeholder="Reply..."
                className="w-full px-5 py-3 pr-12 text-[16px] bg-transparent border-none focus:ring-0 focus:outline-none text-gray-900 dark:text-white"
                style={{ color: '#6B6B6B' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendManagerReply();
                  }
                }}
              />
              {/* Send Button */}
              <button
                onClick={handleSendManagerReply}
                className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-80 transition-opacity"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="#C5055B"
                >
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Other Comment Section */}
      <div className="space-y-2">
        {/* Header */}
        <div className="flex items-center gap-1">
          {/* Multiple comment icon */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-black dark:text-white"
          >
            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
          </svg>
          <span className="text-[16px] font-bold text-black dark:text-white">
            Other comment
          </span>
        </div>

        {/* Comment Card */}
        <div className="bg-white dark:bg-gray-800 rounded-[10px] p-4 border border-gray-300 dark:border-gray-500">
          {/* Comments List */}
          <div className="space-y-4">
            {otherComments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                {/* Avatar with initials - outside message box */}
                <div
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#E5F0FF' }}
                >
                  <span
                    className="text-[13px] font-bold"
                    style={{ color: '#003E95' }}
                  >
                    {getInitials(comment.author)}
                  </span>
                </div>

                {/* Content with gray background - special border-radius */}
                <div
                  className="flex-1 px-5 py-3"
                  style={{
                    backgroundColor: '#F4F4F4',
                    borderRadius: '0px 10px 10px 10px',
                  }}
                >
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-[16px] text-black dark:text-white">
                      {comment.author}
                    </span>
                    <span
                      className="text-[13px]"
                      style={{ color: '#6B6B6B' }}
                    >
                      {formatTime(comment.createdAt)}
                    </span>
                  </div>
                  <p
                    className="text-[15px] mt-1"
                    style={{ color: '#000000' }}
                  >
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Reply Input */}
          <div className="flex items-center gap-3 mt-4">
            {/* User Avatar placeholder */}
            <div className="flex-shrink-0 w-6 h-6 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-gray-500"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>

            {/* Input with Send Button */}
            <div
              className="flex-1 relative rounded-[10px] bg-white dark:bg-gray-800"
              style={{ border: '0.5px solid #9B9B9B' }}
            >
              <input
                type="text"
                value={otherReplyText}
                onChange={(e) => setOtherReplyText(e.target.value)}
                placeholder="Reply..."
                className="w-full px-5 py-3 pr-12 text-[16px] bg-transparent border-none focus:ring-0 focus:outline-none text-gray-900 dark:text-white"
                style={{ color: '#6B6B6B' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendOtherReply();
                  }
                }}
              />
              {/* Send Button */}
              <button
                onClick={handleSendOtherReply}
                className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-80 transition-opacity"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="#C5055B"
                >
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
