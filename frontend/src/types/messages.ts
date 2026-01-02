// Message types for the Message/Messenger Screen

export interface User {
  id: string;
  name: string;
  avatar?: string;
  initials?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  isSent: boolean; // true = sent by current user, false = received
}

export interface Conversation {
  id: string;
  type: 'group' | 'store';
  name: string;
  icon?: string;
  iconColor?: string;
  iconInitial?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  isRead: boolean;
  unreadCount?: number;
  participants?: User[];
}

export interface ConversationGroup {
  id: string;
  title: string;
  conversations: Conversation[];
}

export interface MessageState {
  conversations: ConversationGroup[];
  activeConversationId: string | null;
  messages: Message[];
  isLoading: boolean;
}
