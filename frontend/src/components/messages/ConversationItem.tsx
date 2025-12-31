'use client';

import { Conversation } from '@/types/messages';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

export default function ConversationItem({
  conversation,
  isActive,
  onClick,
}: ConversationItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left ${
        isActive ? 'bg-pink-50 dark:bg-pink-900/20' : ''
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm ${
          conversation.iconColor || 'bg-pink-500'
        }`}
      >
        {conversation.iconInitial || conversation.name.charAt(0)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
            {conversation.name}
          </h4>
          {conversation.lastMessageTime && (
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">
              {conversation.lastMessageTime}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-0.5">
          {conversation.lastMessage && (
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {conversation.lastMessage}
            </p>
          )}

          <div className="flex items-center gap-1 ml-2 flex-shrink-0">
            {/* Read status - double check */}
            {conversation.isRead && (
              <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7M5 13l4 4M12 13l7-7"
                />
              </svg>
            )}

            {/* Unread badge */}
            {!conversation.isRead && conversation.unreadCount && conversation.unreadCount > 0 && (
              <span className="bg-pink-500 text-white text-xs font-medium px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                {conversation.unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
