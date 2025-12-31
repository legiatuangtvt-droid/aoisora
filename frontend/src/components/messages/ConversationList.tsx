'use client';

import { useState } from 'react';
import { ConversationGroup } from '@/types/messages';
import ConversationItem from './ConversationItem';

interface ConversationListProps {
  conversationGroups: ConversationGroup[];
  activeConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
}

export default function ConversationList({
  conversationGroups,
  activeConversationId,
  onSelectConversation,
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter conversations based on search query
  const filteredGroups = conversationGroups.map(group => ({
    ...group,
    conversations: group.conversations.filter(conv =>
      conv.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(group => group.conversations.length > 0);

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search or start new chat"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
      </div>

      {/* Conversation Groups */}
      <div className="flex-1 overflow-y-auto">
        {filteredGroups.map((group) => (
          <div key={group.id}>
            {/* Group Header */}
            <div className="px-4 py-2">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                {group.title}
              </h3>
            </div>

            {/* Conversations */}
            {group.conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isActive={conversation.id === activeConversationId}
                onClick={() => onSelectConversation(conversation.id)}
              />
            ))}
          </div>
        ))}

        {filteredGroups.length === 0 && searchQuery && (
          <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
            No conversations found
          </div>
        )}
      </div>
    </div>
  );
}
