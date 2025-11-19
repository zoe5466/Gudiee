'use client';

import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { Search, Plus, MessageCircle, Phone, Video, MoreHorizontal, Check, CheckCheck } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/store/auth';

interface ConversationListProps {
  selectedConversationId?: string;
  onConversationSelect: (conversationId: string) => void;
  onNewConversation: () => void;
  className?: string;
}

interface Conversation {
  id: string;
  title?: string;
  type: 'DIRECT' | 'GROUP' | 'CUSTOMER_SUPPORT';
  participants: Array<{
    id: string;
    name: string;
    avatar?: string;
    role: string;
  }>;
  unreadCount: number;
  lastMessage?: {
    id: string;
    content?: string;
    messageType: string;
    createdAt: string;
    sender: {
      id: string;
      name: string;
      avatar?: string;
    };
    isRead: boolean;
  };
  lastActivityAt: string;
}

export default function ConversationList({
  selectedConversationId,
  onConversationSelect,
  onNewConversation,
  className = ''
}: ConversationListProps) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    // 篩選對話
    if (!searchQuery.trim()) {
      setFilteredConversations(conversations);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = conversations.filter(conversation => {
        // 搜尋對話標題
        if (conversation.title?.toLowerCase().includes(query)) {
          return true;
        }
        
        // 搜尋參與者名稱
        if (conversation.participants.some(p => p.name.toLowerCase().includes(query))) {
          return true;
        }
        
        // 搜尋最後一條消息內容
        if (conversation.lastMessage?.content?.toLowerCase().includes(query)) {
          return true;
        }
        
        return false;
      });
      setFilteredConversations(filtered);
    }
  }, [conversations, searchQuery]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/conversations', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setConversations(data.data.conversations || []);
      }
    } catch (error) {
      console.error('Fetch conversations error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getConversationTitle = (conversation: Conversation) => {
    if (conversation.title) {
      return conversation.title;
    }

    if (conversation.type === 'DIRECT') {
      const otherParticipant = conversation.participants.find(p => p.id !== user?.id);
      return otherParticipant?.name || '未知用戶';
    }

    return '群組對話';
  };

  const getConversationAvatar = (conversation: Conversation) => {
    if (conversation.type === 'DIRECT') {
      const otherParticipant = conversation.participants.find(p => p.id !== user?.id);
      return otherParticipant?.avatar;
    }
    return null;
  };

  const getLastMessagePreview = (conversation: Conversation) => {
    if (!conversation.lastMessage) {
      return '尚無消息';
    }

    const message = conversation.lastMessage;
    const isOwnMessage = message.sender.id === user?.id;
    const senderName = isOwnMessage ? '您' : message.sender.name;

    switch (message.messageType) {
      case 'TEXT':
        return `${senderName}: ${message.content || ''}`;
      case 'IMAGE':
        return `${senderName}: [圖片]`;
      case 'FILE':
        return `${senderName}: [檔案]`;
      case 'LOCATION':
        return `${senderName}: [位置]`;
      case 'SYSTEM':
        return message.content || '[系統訊息]';
      default:
        return `${senderName}: [訊息]`;
    }
  };

  const formatLastMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('zh-TW', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    } else if (diffInHours < 24 * 7) {
      return formatDistanceToNow(date, { addSuffix: false, locale: zhTW });
    } else {
      return date.toLocaleDateString('zh-TW');
    }
  };

  const renderMessageStatus = (conversation: Conversation) => {
    if (!conversation.lastMessage || conversation.lastMessage.sender.id !== user?.id) {
      return null;
    }

    return conversation.lastMessage.isRead ? (
      <CheckCheck className="w-4 h-4 text-blue-500" />
    ) : (
      <Check className="w-4 h-4 text-gray-400" />
    );
  };

  if (loading) {
    return (
      <div className={`bg-white border-r border-gray-200 ${className}`}>
        <div className="p-4 border-b border-gray-200">
          <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="space-y-1 p-2">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="flex items-center p-3 space-x-3 animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border-r border-gray-200 flex flex-col ${className}`}>
      {/* 標題欄 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">訊息</h2>
        <button
          onClick={onNewConversation}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
          title="新對話"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* 搜尋欄 */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜尋對話..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-transparent rounded-lg focus:bg-white focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* 對話列表 */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <MessageCircle className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-gray-500 mb-2">
              {searchQuery ? '找不到相符的對話' : '尚無對話'}
            </p>
            {!searchQuery && (
              <button
                onClick={onNewConversation}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                開始新對話
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredConversations.map((conversation) => {
              const isSelected = conversation.id === selectedConversationId;
              
              return (
                <button
                  key={conversation.id}
                  onClick={() => onConversationSelect(conversation.id)}
                  className={`w-full flex items-center p-4 hover:bg-[#cfdbe9] transition-colors text-left ${
                    isSelected ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                      {conversation.type === 'DIRECT' && getConversationAvatar(conversation) ? (
                        <Image
                          src={getConversationAvatar(conversation)!}
                          alt={getConversationTitle(conversation)}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                          {conversation.type === 'GROUP' ? '群' : getConversationTitle(conversation).charAt(0)}
                        </div>
                      )}
                    </div>
                    
                    {/* 在線狀態指示器 */}
                    {conversation.type === 'DIRECT' && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 ml-3">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`text-sm font-medium truncate ${
                        conversation.unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {getConversationTitle(conversation)}
                      </h3>
                      <div className="flex items-center space-x-1">
                        {renderMessageStatus(conversation)}
                        <span className="text-xs text-gray-500">
                          {conversation.lastMessage && formatLastMessageTime(conversation.lastMessage.createdAt)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className={`text-sm truncate ${
                        conversation.unreadCount > 0 ? 'text-gray-600 font-medium' : 'text-gray-500'
                      }`}>
                        {getLastMessagePreview(conversation)}
                      </p>
                      
                      <div className="flex items-center space-x-2">
                        {conversation.unreadCount > 0 && (
                          <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-600 text-white text-xs font-medium rounded-full">
                            {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                          </span>
                        )}
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: 實現更多操作菜單
                          }}
                          className="p-1 text-gray-400 hover:text-gray-600 rounded"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}