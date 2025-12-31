'use client';

import { Conversation } from '@/types/messages';

interface ChatHeaderProps {
  conversation: Conversation | null;
  onSearch?: () => void;
  onMenu?: () => void;
}

export default function ChatHeader({
  conversation,
  onSearch,
  onMenu,
}: ChatHeaderProps) {
  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Select a conversation to start messaging
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between px-4 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      {/* Left - Avatar and Name */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm ${
            conversation.iconColor || 'bg-pink-500'
          }`}
        >
          {conversation.iconInitial || conversation.name.charAt(0)}
        </div>

        {/* Name */}
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          {conversation.name}
        </h2>
      </div>

      {/* Right - Actions */}
      <div className="flex items-center gap-2">
        {/* Search Button */}
        <button
          onClick={onSearch}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>

        {/* Menu Button */}
        <button
          onClick={onMenu}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
