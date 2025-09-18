'use client';

import React, { useState, useEffect, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { Send, Plus, Smile, Paperclip, MoreHorizontal, Phone, Video, Info, Check, CheckCheck } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/store/auth';

interface ChatInterfaceProps {
  conversationId: string;
  className?: string;
}

interface Message {
  id: string;
  content?: string;
  messageType: 'TEXT' | 'IMAGE' | 'FILE' | 'LOCATION' | 'SYSTEM';
  attachments: any[];
  createdAt: string;
  isRead: boolean;
  sender: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
  };
  replyTo?: {
    id: string;
    content?: string;
    sender: {
      id: string;
      name: string;
      avatar?: string;
    };
  };
  readStatuses: Array<{
    userId: string;
    readAt: string;
    user: {
      id: string;
      name: string;
      avatar?: string;
    };
  }>;
}

interface ConversationInfo {
  id: string;
  title?: string;
  type: 'DIRECT' | 'GROUP' | 'CUSTOMER_SUPPORT';
  participants: Array<{
    id: string;
    name: string;
    avatar?: string;
    role: string;
  }>;
  messages: Message[];
}

export default function ChatInterface({ conversationId, className = '' }: ChatInterfaceProps) {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [conversation, setConversation] = useState<ConversationInfo | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);

  useEffect(() => {
    if (conversationId) {
      fetchConversation();
    }
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversation = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/conversations/${conversationId}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setConversation(data.data);
        setMessages(data.data.messages || []);
      }
    } catch (error) {
      console.error('Fetch conversation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    const messageContent = newMessage.trim();
    setNewMessage('');
    setSending(true);

    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          content: messageContent,
          messageType: 'TEXT',
          replyToId: replyingTo?.id
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, data.data]);
        setReplyingTo(null);
      }
    } catch (error) {
      console.error('Send message error:', error);
      // 重新設置訊息內容以便重試
      setNewMessage(messageContent);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getConversationTitle = () => {
    if (!conversation) return '';

    if (conversation.title) {
      return conversation.title;
    }

    if (conversation.type === 'DIRECT') {
      const otherParticipant = conversation.participants.find(p => p.id !== user?.id);
      return otherParticipant?.name || '未知用戶';
    }

    return '群組對話';
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return '剛剛';
    } else if (diffInHours < 24) {
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

  const renderMessageStatus = (message: Message) => {
    if (message.sender.id !== user?.id) return null;

    const isRead = message.readStatuses && message.readStatuses.length > 0;
    return isRead ? (
      <CheckCheck className="w-3 h-3 text-blue-500" />
    ) : (
      <Check className="w-3 h-3 text-gray-400" />
    );
  };

  const renderMessage = (message: Message, index: number) => {
    const isOwn = message.sender.id === user?.id;
    const prevMessage = index > 0 ? messages[index - 1] : null;
    const showAvatar = !isOwn && (!prevMessage || prevMessage.sender.id !== message.sender.id);
    const showSenderName = !isOwn && conversation?.type === 'GROUP' && showAvatar;

    return (
      <div
        key={message.id}
        className={`flex mb-4 ${isOwn ? 'justify-end' : 'justify-start'}`}
      >
        <div className={`flex max-w-[70%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
          {/* 頭像 */}
          <div className={`flex-shrink-0 ${isOwn ? 'ml-2' : 'mr-2'}`}>
            {showAvatar && (
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                {message.sender.avatar ? (
                  <Image
                    src={message.sender.avatar}
                    alt={message.sender.name}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                    {message.sender.name.charAt(0)}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 訊息內容 */}
          <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
            {showSenderName && (
              <span className="text-xs text-gray-500 mb-1 px-1">{message.sender.name}</span>
            )}

            {/* 回復訊息預覽 */}
            {message.replyTo && (
              <div className={`text-xs mb-2 p-2 rounded border-l-2 border-gray-300 bg-gray-50 max-w-full ${
                isOwn ? 'mr-2' : 'ml-2'
              }`}>
                <div className="font-medium text-gray-600">{message.replyTo.sender.name}</div>
                <div className="text-gray-500 truncate">{message.replyTo.content}</div>
              </div>
            )}

            {/* 訊息氣泡 */}
            <div
              className={`relative px-4 py-2 rounded-2xl shadow-sm ${
                isOwn
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-white border border-gray-200 text-gray-900 rounded-bl-sm'
              }`}
            >
              {message.messageType === 'TEXT' && message.content && (
                <div className="whitespace-pre-wrap break-words">
                  {message.content}
                </div>
              )}

              {message.messageType === 'SYSTEM' && (
                <div className="text-center text-gray-500 italic">
                  {message.content}
                </div>
              )}

              {/* 訊息時間和狀態 */}
              <div className={`flex items-center mt-1 space-x-1 ${
                isOwn ? 'justify-end' : 'justify-start'
              }`}>
                <span className={`text-xs ${
                  isOwn ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {formatMessageTime(message.createdAt)}
                </span>
                {renderMessageStatus(message)}
              </div>
            </div>

            {/* 訊息操作按鈕 */}
            <div className="flex items-center space-x-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setReplyingTo(message)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                回復
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`flex flex-col h-full ${className}`}>
        <div className="border-b border-gray-200 p-4">
          <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="flex-1 p-4 space-y-4">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="flex items-start space-x-3 animate-pulse">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="text-center">
          <div className="text-gray-500">找不到對話</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full bg-gray-50 ${className}`}>
      {/* 對話標題欄 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {conversation.type === 'DIRECT' && (
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                {conversation.participants.find(p => p.id !== user?.id)?.avatar ? (
                  <Image
                    src={conversation.participants.find(p => p.id !== user?.id)?.avatar || '/images/default-avatar.png'}
                    alt={getConversationTitle()}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {getConversationTitle().charAt(0)}
                  </div>
                )}
              </div>
            )}
            
            <div>
              <h3 className="font-semibold text-gray-900">{getConversationTitle()}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>在線</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
              <Video className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
              <Info className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 訊息列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <div className="group">
          {messages.map((message, index) => renderMessage(message, index))}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* 回復預覽 */}
      {replyingTo && (
        <div className="bg-blue-50 border-t border-blue-200 px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-2">
              <div className="w-1 h-10 bg-blue-500 rounded-full"></div>
              <div>
                <div className="text-sm font-medium text-blue-800">
                  回復 {replyingTo.sender.name}
                </div>
                <div className="text-sm text-blue-600 truncate max-w-md">
                  {replyingTo.content}
                </div>
              </div>
            </div>
            <button
              onClick={() => setReplyingTo(null)}
              className="text-blue-600 hover:text-blue-800"
            >
              <MoreHorizontal className="w-4 h-4 rotate-45" />
            </button>
          </div>
        </div>
      )}

      {/* 輸入區域 */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-end space-x-3">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full flex-shrink-0">
            <Plus className="w-5 h-5" />
          </button>
          
          <div className="flex-1">
            <textarea
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="輸入訊息..."
              rows={1}
              className="w-full px-4 py-2 bg-gray-100 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:outline-none resize-none"
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
              <Paperclip className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
              <Smile className="w-5 h-5" />
            </button>
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim() || sending}
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}