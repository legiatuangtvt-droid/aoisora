import { Conversation, ConversationGroup, Message } from '@/types/messages';

// Mock conversations grouped by type
export const mockConversationGroups: ConversationGroup[] = [
  {
    id: 'groups',
    title: 'Groups',
    conversations: [
      {
        id: 'all-stores',
        type: 'group',
        name: 'ALL STORE',
        iconInitial: 'All',
        iconColor: 'bg-pink-500',
        lastMessage: 'Reminder: Please complete the daily checklist',
        lastMessageTime: 'Dec 12, 2025',
        isRead: true,
      },
      {
        id: 'unable-complete',
        type: 'group',
        name: 'Store unable to complete',
        iconInitial: 'U',
        iconColor: 'bg-pink-500',
        lastMessage: 'Please check your pending tasks',
        lastMessageTime: 'Dec 11, 2025',
        isRead: true,
      },
    ],
  },
  {
    id: 'completed-stores',
    title: 'Completed Stores',
    conversations: [
      {
        id: 'ocean-park',
        type: 'store',
        name: 'OCEAN PARK',
        iconInitial: 'OP',
        iconColor: 'bg-teal-500',
        lastMessage: 'Task completed successfully',
        lastMessageTime: 'Dec 12, 2025',
        isRead: true,
      },
      {
        id: 'eco-park',
        type: 'store',
        name: 'ECO PARK',
        iconInitial: 'EP',
        iconColor: 'bg-blue-500',
        lastMessage: 'All items checked',
        lastMessageTime: 'Dec 11, 2025',
        isRead: false,
        unreadCount: 2,
      },
      {
        id: 'zen-park',
        type: 'store',
        name: 'ZEN PARK',
        iconInitial: 'ZP',
        iconColor: 'bg-purple-500',
        lastMessage: 'Ready for inspection',
        lastMessageTime: 'Dec 10, 2025',
        isRead: true,
      },
    ],
  },
];

// Mock messages for each conversation
export const mockMessages: Record<string, Message[]> = {
  'all-stores': [
    {
      id: 'msg-1',
      conversationId: 'all-stores',
      senderId: 'hq-user',
      senderName: 'HQ Staff',
      content: 'Good morning everyone! Please remember to complete your daily fresh food checks by 10 AM.',
      timestamp: '2025-12-12T08:00:00',
      isRead: true,
      isSent: true,
    },
    {
      id: 'msg-2',
      conversationId: 'all-stores',
      senderId: 'hq-user',
      senderName: 'HQ Staff',
      content: 'Reminder: The holiday decoration task needs to be completed by end of week.',
      timestamp: '2025-12-12T18:16:00',
      isRead: true,
      isSent: true,
    },
  ],
  'unable-complete': [
    {
      id: 'msg-3',
      conversationId: 'unable-complete',
      senderId: 'hq-user',
      senderName: 'HQ Staff',
      content: 'Please review your pending tasks and provide status update.',
      timestamp: '2025-12-11T09:30:00',
      isRead: true,
      isSent: true,
    },
  ],
  'ocean-park': [
    {
      id: 'msg-4',
      conversationId: 'ocean-park',
      senderId: 'store-3016',
      senderName: 'OCEAN PARK',
      content: 'Good morning! We have completed all morning tasks.',
      timestamp: '2025-12-12T07:00:00',
      isRead: true,
      isSent: false,
    },
    {
      id: 'msg-5',
      conversationId: 'ocean-park',
      senderId: 'hq-user',
      senderName: 'HQ Staff',
      content: 'Great work! Please continue with the afternoon checklist.',
      timestamp: '2025-12-12T10:30:00',
      isRead: true,
      isSent: true,
    },
  ],
  'eco-park': [
    {
      id: 'msg-6',
      conversationId: 'eco-park',
      senderId: 'store-3017',
      senderName: 'ECO PARK',
      content: 'We need assistance with the inventory system.',
      timestamp: '2025-12-11T14:00:00',
      isRead: false,
      isSent: false,
    },
    {
      id: 'msg-7',
      conversationId: 'eco-park',
      senderId: 'store-3017',
      senderName: 'ECO PARK',
      content: 'Update: Issue has been resolved.',
      timestamp: '2025-12-11T16:30:00',
      isRead: false,
      isSent: false,
    },
  ],
  'zen-park': [
    {
      id: 'msg-8',
      conversationId: 'zen-park',
      senderId: 'store-3027',
      senderName: 'ZEN PARK',
      content: 'All tasks completed for today. Ready for inspection.',
      timestamp: '2025-12-10T17:00:00',
      isRead: true,
      isSent: false,
    },
  ],
};

// Helper function to get messages by conversation ID
export function getMessagesByConversationId(conversationId: string): Message[] {
  return mockMessages[conversationId] || [];
}

// Helper function to get all conversations as flat list
export function getAllConversations(): Conversation[] {
  return mockConversationGroups.flatMap(group => group.conversations);
}

// Helper function to get conversation by ID
export function getConversationById(conversationId: string): Conversation | undefined {
  return getAllConversations().find(conv => conv.id === conversationId);
}
