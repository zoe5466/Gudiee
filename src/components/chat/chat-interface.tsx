'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Phone, Video, MoreHorizontal, X } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/store/auth';

interface ChatInterfaceProps {
  recipientId: string;
  recipientName: string;
  recipientAvatar?: string;
  chatType: 'customer_support' | 'guide_chat' | 'booking_chat';
  onClose?: () => void;
  className?: string;
}

export function ChatInterface({
  recipientId,
  recipientName,
  recipientAvatar,
  chatType,
  onClose,
  className = ''
}: ChatInterfaceProps) {
  const { user } = useAuth();
  const {
    messages,
    isConnected,
    isLoading,
    sendMessage,
    markAsRead,
    startTyping,
    stopTyping
  } = useChat(recipientId, chatType);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 自動捲動到最新訊息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 標記訊息為已讀
  useEffect(() => {
    markAsRead();
  }, [messages, markAsRead]);

  // 處理輸入變化
  const handleInputChange = (value: string) => {
    setInputValue(value);
    
    if (value.trim() && !isTyping) {
      setIsTyping(true);
      startTyping();
    } else if (!value.trim() && isTyping) {
      setIsTyping(false);
      stopTyping();
    }
  };

  // 發送訊息
  const handleSendMessage = async () => {
    const content = inputValue.trim();
    if (!content) return;

    try {
      await sendMessage({
        content,
        type: 'text'
      });
      setInputValue('');
      setIsTyping(false);
      stopTyping();
      inputRef.current?.focus();
    } catch (error) {
      console.error('發送訊息失敗:', error);
    }
  };

  // 處理按鍵
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 格式化時間
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('zh-TW', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // 格式化日期
  const formatDate = (date: Date) => {
    const today = new Date();
    const messageDate = new Date(date);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return '今天';
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return '昨天';
    }
    
    return new Intl.DateTimeFormat('zh-TW', {
      month: 'long',
      day: 'numeric'
    }).format(messageDate);
  };

  // 獲取訊息狀態圖示
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sending':
        return <div style={{ width: '0.75rem', height: '0.75rem', border: '1px solid #9ca3af', borderTop: '1px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />;
      case 'sent':
        return <span style={{ color: '#9ca3af' }}>✓</span>;
      case 'delivered':
        return <span style={{ color: '#3b82f6' }}>✓✓</span>;
      case 'read':
        return <span style={{ color: '#10b981' }}>✓✓</span>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '400px',
        backgroundColor: '#f9fafb',
        borderRadius: '0.5rem'
      }}>
        <div style={{ textAlign: 'center', color: '#6b7280' }}>
          <div style={{
            width: '2rem',
            height: '2rem',
            border: '2px solid #e5e7eb',
            borderTop: '2px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 0.5rem'
          }} />
          連接聊天室中...
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '500px',
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      border: '1px solid #e5e7eb',
      overflow: 'hidden'
    }} className={className}>
      {/* 聊天室標題 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem',
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            backgroundColor: recipientAvatar ? 'transparent' : '#e5e7eb',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            fontWeight: '600',
            color: '#6b7280',
            backgroundImage: recipientAvatar ? `url(${recipientAvatar})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}>
            {!recipientAvatar && recipientName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
              {recipientName}
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: isConnected ? '#10b981' : '#ef4444',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <div style={{
                width: '0.5rem',
                height: '0.5rem',
                backgroundColor: isConnected ? '#10b981' : '#ef4444',
                borderRadius: '50%'
              }} />
              {isConnected ? '線上' : '離線'}
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button style={{
            width: '2rem',
            height: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer'
          }} className="hover:bg-gray-200">
            <Phone style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
          </button>
          <button style={{
            width: '2rem',
            height: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer'
          }} className="hover:bg-gray-200">
            <Video style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
          </button>
          <button style={{
            width: '2rem',
            height: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer'
          }} className="hover:bg-gray-200">
            <MoreHorizontal style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              style={{
                width: '2rem',
                height: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: 'pointer'
              }}
              className="hover:bg-gray-200"
            >
              <X style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
            </button>
          )}
        </div>
      </div>

      {/* 訊息列表 */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem',
        backgroundColor: '#f9fafb'
      }}>
        {messages.length === 0 ? (
          <div style={{
            textAlign: 'center',
            color: '#6b7280',
            fontSize: '0.875rem',
            marginTop: '2rem'
          }}>
            開始對話吧！
          </div>
        ) : (
          <>
            {messages.map((message, index) => {
              const isCurrentUser = message.sender.id === user?.id;
              const showDate = index === 0 || 
                formatDate(messages[index - 1]?.timestamp || new Date()) !== formatDate(message.timestamp);

              return (
                <div key={message.id}>
                  {/* 日期分隔線 */}
                  {showDate && (
                    <div style={{
                      textAlign: 'center',
                      margin: '1rem 0 0.5rem',
                      fontSize: '0.75rem',
                      color: '#9ca3af'
                    }}>
                      {formatDate(message.timestamp)}
                    </div>
                  )}

                  {/* 訊息氣泡 */}
                  <div style={{
                    display: 'flex',
                    flexDirection: isCurrentUser ? 'row-reverse' : 'row',
                    alignItems: 'flex-end',
                    gap: '0.5rem',
                    marginBottom: '0.75rem'
                  }}>
                    {/* 頭像 */}
                    {!isCurrentUser && (
                      <div style={{
                        width: '1.75rem',
                        height: '1.75rem',
                        backgroundColor: message.sender.avatar ? 'transparent' : '#e5e7eb',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: '#6b7280',
                        backgroundImage: message.sender.avatar ? `url(${message.sender.avatar})` : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        flexShrink: 0
                      }}>
                        {!message.sender.avatar && message.sender.name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    {/* 訊息內容 */}
                    <div style={{
                      maxWidth: '70%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isCurrentUser ? 'flex-end' : 'flex-start'
                    }}>
                      <div style={{
                        padding: '0.75rem 1rem',
                        backgroundColor: isCurrentUser ? '#3b82f6' : 'white',
                        color: isCurrentUser ? 'white' : '#111827',
                        borderRadius: isCurrentUser ? '1rem 1rem 0.25rem 1rem' : '1rem 1rem 1rem 0.25rem',
                        border: !isCurrentUser ? '1px solid #e5e7eb' : 'none',
                        fontSize: '0.875rem',
                        lineHeight: '1.5',
                        wordBreak: 'break-word'
                      }}>
                        {message.content}
                      </div>

                      {/* 時間和狀態 */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        marginTop: '0.25rem',
                        fontSize: '0.75rem',
                        color: '#9ca3af'
                      }}>
                        <span>{formatTime(message.timestamp)}</span>
                        {isCurrentUser && getStatusIcon(message.status)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* 輸入區域 */}
      <div style={{
        padding: '1rem',
        backgroundColor: 'white',
        borderTop: '1px solid #e5e7eb'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '0.5rem'
        }}>
          <button style={{
            padding: '0.5rem',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }} className="hover:bg-gray-100">
            <Paperclip style={{ width: '1.25rem', height: '1.25rem', color: '#6b7280' }} />
          </button>

          <div style={{ flex: 1, position: 'relative' }}>
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="輸入訊息..."
              style={{
                width: '100%',
                maxHeight: '6rem',
                padding: '0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '1.5rem',
                fontSize: '0.875rem',
                resize: 'none',
                outline: 'none',
                backgroundColor: '#f9fafb'
              }}
              className="focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              rows={1}
              disabled={!isConnected}
            />
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || !isConnected}
            style={{
              padding: '0.75rem',
              backgroundColor: inputValue.trim() && isConnected ? '#3b82f6' : '#e5e7eb',
              border: 'none',
              borderRadius: '50%',
              cursor: inputValue.trim() && isConnected ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            className="hover:scale-105"
          >
            <Send style={{
              width: '1.125rem',
              height: '1.125rem',
              color: inputValue.trim() && isConnected ? 'white' : '#9ca3af'
            }} />
          </button>
        </div>
      </div>
    </div>
  );
}