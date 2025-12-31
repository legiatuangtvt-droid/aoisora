'use client';

import { useState, useCallback } from 'react';
import ConversationList from '@/components/messages/ConversationList';
import ChatArea from '@/components/messages/ChatArea';
import { mockConversationGroups, getMessagesByConversationId, getConversationById } from '@/data/mockMessages';
import { Message } from '@/types/messages';

export default function MessagesPage() {
  const [activeConversationId, setActiveConversationId] = useState<string | null>('all-stores');
  const [messages, setMessages] = useState<Message[]>(getMessagesByConversationId('all-stores'));

  const activeConversation = activeConversationId
    ? getConversationById(activeConversationId) || null
    : null;

  const handleSelectConversation = useCallback((conversationId: string) => {
    setActiveConversationId(conversationId);
    setMessages(getMessagesByConversationId(conversationId));
  }, []);

  const handleSendMessage = useCallback((content: string) => {
    if (!activeConversationId) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId: activeConversationId,
      senderId: 'hq-user',
      senderName: 'HQ Staff',
      content,
      timestamp: new Date().toISOString(),
      isRead: false,
      isSent: true,
    };

    setMessages((prev) => [...prev, newMessage]);
  }, [activeConversationId]);

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Left Sidebar - Conversation List */}
      <ConversationList
        conversationGroups={mockConversationGroups}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
      />

      {/* Right - Chat Area */}
      <ChatArea
        conversation={activeConversation}
        messages={messages}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
