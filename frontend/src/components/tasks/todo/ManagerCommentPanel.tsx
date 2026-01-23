'use client';

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

type CommentTab = 'manager' | 'other';

export default function ManagerCommentPanel({
  managerComments,
  otherComments,
  onAddManagerComment,
  onAddOtherComment,
}: ManagerCommentPanelProps) {
  const [managerReplyText, setManagerReplyText] = useState('');
  const [otherReplyText, setOtherReplyText] = useState('');
  const [activeTab, setActiveTab] = useState<CommentTab>('manager');

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

  // Reusable Comment Card component
  const CommentCard = ({
    comments,
    replyText,
    setReplyText,
    onSend,
  }: {
    comments: ManagerComment[];
    replyText: string;
    setReplyText: (text: string) => void;
    onSend: () => void;
  }) => (
    <div className="bg-white dark:bg-gray-800 rounded-[10px] p-3 sm:p-4 border border-gray-300 dark:border-gray-500">
      {/* Comments List */}
      <div className="space-y-3 sm:space-y-4 max-h-[300px] sm:max-h-none overflow-y-auto">
        {comments.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            No comments yet
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-2 sm:gap-3">
              {/* Avatar with initials */}
              <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-900/40">
                <span className="text-[11px] sm:text-[13px] font-bold text-blue-800 dark:text-blue-300">
                  {getInitials(comment.author)}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 px-3 sm:px-5 py-2 sm:py-3 bg-gray-100 dark:bg-gray-700 rounded-tr-[10px] rounded-br-[10px] rounded-bl-[10px]">
                <div className="flex flex-wrap items-baseline gap-1 sm:gap-2">
                  <span className="font-bold text-[14px] sm:text-[16px] text-black dark:text-white">
                    {comment.author}
                  </span>
                  <span className="text-[11px] sm:text-[13px] text-gray-500 dark:text-gray-400">
                    {formatTime(comment.createdAt)}
                  </span>
                </div>
                <p className="text-[13px] sm:text-[15px] mt-1 text-black dark:text-gray-200">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reply Input */}
      <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-4">
        {/* User Avatar placeholder */}
        <div className="flex-shrink-0 w-6 h-6 rounded-full overflow-hidden bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gray-500 dark:text-gray-400">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>

        {/* Input with Send Button */}
        <div className="flex-1 relative rounded-[10px] bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-600">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Reply..."
            className="w-full px-3 sm:px-5 py-2 sm:py-3 pr-10 sm:pr-12 text-[14px] sm:text-[16px] bg-transparent border-none focus:ring-0 focus:outline-none text-gray-900 dark:text-white"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
          />
          {/* Send Button */}
          <button
            onClick={onSend}
            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 hover:opacity-80 transition-opacity p-1"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#C5055B" className="sm:w-6 sm:h-6">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Mobile: Tab View */}
      <div className="sm:hidden">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
          <button
            onClick={() => setActiveTab('manager')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'manager'
                ? 'border-pink-600 text-pink-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            <span className="flex items-center justify-center gap-1">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M22 4C22 2.9 21.1 2 20 2H4C2.9 2 2 2.9 2 4V16C2 17.1 2.9 18 4 18H18L22 22V4Z"/>
              </svg>
              Manager ({managerComments.length})
            </span>
          </button>
          <button
            onClick={() => setActiveTab('other')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'other'
                ? 'border-pink-600 text-pink-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            <span className="flex items-center justify-center gap-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
              </svg>
              Other ({otherComments.length})
            </span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'manager' ? (
          <CommentCard
            comments={managerComments}
            replyText={managerReplyText}
            setReplyText={setManagerReplyText}
            onSend={handleSendManagerReply}
          />
        ) : (
          <CommentCard
            comments={otherComments}
            replyText={otherReplyText}
            setReplyText={setOtherReplyText}
            onSend={handleSendOtherReply}
          />
        )}
      </div>

      {/* Desktop: Both sections visible */}
      <div className="hidden sm:block space-y-6">
        {/* Manager Comment Section */}
        <div className="space-y-2">
          {/* Header */}
          <div className="flex items-center gap-1">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-black dark:text-white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M22 4C22 2.9 21.1 2 20 2H4C2.9 2 2 2.9 2 4V16C2 17.1 2.9 18 4 18H18L22 22V4Z"/>
            </svg>
            <span className="text-[16px] font-bold text-black dark:text-white">
              Manager Comment
            </span>
          </div>

          <CommentCard
            comments={managerComments}
            replyText={managerReplyText}
            setReplyText={setManagerReplyText}
            onSend={handleSendManagerReply}
          />
        </div>

        {/* Other Comment Section */}
        <div className="space-y-2">
          {/* Header */}
          <div className="flex items-center gap-1">
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

          <CommentCard
            comments={otherComments}
            replyText={otherReplyText}
            setReplyText={setOtherReplyText}
            onSend={handleSendOtherReply}
          />
        </div>
      </div>
    </div>
  );
}
