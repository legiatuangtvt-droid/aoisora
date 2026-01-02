'use client';

import { Message } from '@/types/messages';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  return (
    <div
      className={`flex ${message.isSent ? 'justify-end' : 'justify-start'} mb-3`}
    >
      <div
        className={`max-w-[70%] rounded-lg px-4 py-2 ${
          message.isSent
            ? 'bg-pink-500 text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
        }`}
      >
        {/* Message Content */}
        <p className="text-sm">{message.content}</p>

        {/* Timestamp and Read Status */}
        <div
          className={`flex items-center justify-end gap-1 mt-1 ${
            message.isSent ? 'text-pink-200' : 'text-gray-400 dark:text-gray-500'
          }`}
        >
          <span className="text-xs">{formatTime(message.timestamp)}</span>

          {/* Read Receipt (only for sent messages) */}
          {message.isSent && (
            <svg
              className={`w-4 h-4 ${message.isRead ? 'text-blue-300' : 'text-pink-200'}`}
              fill="none"
              viewBox="0 0 24 24"
            >
              {message.isRead ? (
                // Double check for read
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7M5 13l4 4M12 13l7-7"
                />
              ) : (
                // Single check for sent
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              )}
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
