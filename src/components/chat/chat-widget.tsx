'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Minimize2, Maximize2, Phone, Video, MoreHorizontal } from 'lucide-react';
import { useAuth } from '@/store/auth';
import { useChat } from '@/hooks/useChat';

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  sender: {
    id: string;
    name: string;
    avatar?: string;
    role: 'user' | 'guide' | 'support';
  };
  type: 'text' | 'image' | 'location' | 'booking' | 'system';
  status: 'sending' | 'sent' | 'delivered' | 'read';
  metadata?: any;
}

interface ChatWidgetProps {
  recipientId?: string;
  recipientName?: string;
  recipientAvatar?: string;
  chatType?: 'customer_support' | 'guide_chat' | 'booking_chat';
  className?: string;
}

export function ChatWidget({ 
  recipientId,
  recipientName = '客服中心',
  recipientAvatar,
  chatType = 'customer_support',
  className = ''
}: ChatWidgetProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    messages,
    isConnected,
    isLoading,
    sendMessage,
    markAsRead,
    startTyping,
    stopTyping
  } = useChat(recipientId || 'support', chatType);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length > 0) {
      markAsRead();
    }
  }, [isOpen, messages, markAsRead]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !user) return;

    try {
      await sendMessage({
        content: message.trim(),
        type: 'text'
      });
      setMessage('');
      stopTyping();
    } catch (error) {
      console.error('發送訊息失敗:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    if (e.target.value.trim()) {
      startTyping();
    } else {
      stopTyping();
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('zh-TW', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sending':
        return '⏳';
      case 'sent':
        return '✓';
      case 'delivered':
        return '✓✓';
      case 'read':
        return <span style={{ color: '#3b82f6' }}>✓✓</span>;
    }
  };

  // 聊天按鈕（未開啟時）
  if (!isOpen) {
    return (
      <div className={className}>
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            width: '3.5rem',
            height: '3.5rem',
            backgroundColor: '#2563eb',
            borderRadius: '50%',
            border: 'none',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            zIndex: 1000
          }}
          className="hover:bg-blue-700 hover:scale-110"
        >
          <MessageCircle style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
          {/* 未讀訊息指示器 */}
          {messages.some(m => m.status !== 'read' && m.sender.id !== user?.id) && (
            <div style={{
              position: 'absolute',
              top: '-0.25rem',
              right: '-0.25rem',
              width: '1rem',
              height: '1rem',
              backgroundColor: '#ef4444',
              borderRadius: '50%',
              border: '2px solid white'
            }} />
          )}
        </button>
      </div>
    );
  }

  // 聊天視窗
  return (
    <div 
      style={{
        position: 'fixed',
        bottom: isMinimized ? '2rem' : '2rem',
        right: '2rem',
        width: isMinimized ? '20rem' : '24rem',
        height: isMinimized ? '3rem' : '32rem',
        backgroundColor: 'white',
        borderRadius: '1rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid #e5e7eb',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out'
      }}
      className={className}
    >
      {/* 聊天標題列 */}
      <div style={{
        padding: '1rem',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '2rem',
            height: '2rem',
            borderRadius: '50%',
            backgroundColor: '#e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            {recipientAvatar ? (
              <img 
                src={recipientAvatar} 
                alt={recipientName}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <MessageCircle style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
            )}
          </div>
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
              {recipientName}
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <div style={{
                width: '0.5rem',
                height: '0.5rem',
                borderRadius: '50%',
                backgroundColor: isConnected ? '#10b981' : '#ef4444'
              }} />
              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                {isConnected ? '線上' : '離線'}
              </span>
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {chatType === 'guide_chat' && (
            <>
              <button
                style={{
                  padding: '0.25rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
                className="hover:bg-gray-100"
              >
                <Phone style={{ width: '1rem', height: '1rem' }} />
              </button>
              <button
                style={{
                  padding: '0.25rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
                className="hover:bg-gray-100"
              >
                <Video style={{ width: '1rem', height: '1rem' }} />
              </button>
            </>
          )}
          
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            style={{
              padding: '0.25rem',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              color: '#6b7280'
            }}
            className="hover:bg-gray-100"
          >
            {isMinimized ? <Maximize2 style={{ width: '1rem', height: '1rem' }} /> : <Minimize2 style={{ width: '1rem', height: '1rem' }} />}
          </button>
          
          <button
            onClick={() => setIsOpen(false)}
            style={{
              padding: '0.25rem',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              color: '#6b7280'
            }}
            className="hover:bg-gray-100"
          >
            <X style={{ width: '1rem', height: '1rem' }} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* 訊息列表 */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            {isLoading ? (
              <div style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
                載入中...
              </div>
            ) : messages.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
                <MessageCircle style={{ width: '2rem', height: '2rem', margin: '0 auto 0.5rem', color: '#d1d5db' }} />
                <p style={{ fontSize: '0.875rem' }}>開始對話吧！</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: msg.sender.id === user?.id ? 'row-reverse' : 'row',
                    gap: '0.5rem',
                    alignItems: 'flex-end'
                  }}
                >
                  {msg.sender.id !== user?.id && (
                    <div style={{
                      width: '1.5rem',
                      height: '1.5rem',
                      borderRadius: '50%',
                      backgroundColor: '#e5e7eb',
                      flexShrink: 0
                    }}>
                      {msg.sender.avatar && (
                        <img 
                          src={msg.sender.avatar} 
                          alt={msg.sender.name}
                          style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                        />
                      )}
                    </div>
                  )}
                  
                  <div style={{
                    maxWidth: '70%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem'
                  }}>
                    <div style={{
                      padding: '0.75rem',
                      borderRadius: '1rem',
                      backgroundColor: msg.sender.id === user?.id ? '#2563eb' : '#f3f4f6',
                      color: msg.sender.id === user?.id ? 'white' : '#111827',
                      fontSize: '0.875rem',
                      lineHeight: '1.4',
                      wordWrap: 'break-word'
                    }}>
                      {msg.content}
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '0.75rem',
                      color: '#9ca3af',
                      justifyContent: msg.sender.id === user?.id ? 'flex-end' : 'flex-start'
                    }}>
                      <span>{formatTime(msg.timestamp)}</span>
                      {msg.sender.id === user?.id && (
                        <span>{getStatusIcon(msg.status)}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {isTyping && (
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'flex-end'
              }}>
                <div style={{
                  width: '1.5rem',
                  height: '1.5rem',
                  borderRadius: '50%',
                  backgroundColor: '#e5e7eb'
                }} />
                <div style={{
                  padding: '0.75rem',
                  borderRadius: '1rem',
                  backgroundColor: '#f3f4f6',
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>
                  正在輸入...
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* 輸入區域 */}
          <div style={{
            padding: '1rem',
            borderTop: '1px solid #e5e7eb',
            backgroundColor: '#f8fafc'
          }}>
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'flex-end'
            }}>
              <textarea
                value={message}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="輸入訊息..."
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  outline: 'none',
                  resize: 'none',
                  minHeight: '2.5rem',
                  maxHeight: '6rem'
                }}
                className="focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                rows={1}
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim() || !isConnected}
                style={{
                  padding: '0.75rem',
                  backgroundColor: message.trim() && isConnected ? '#2563eb' : '#d1d5db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: message.trim() && isConnected ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s'
                }}
                className={message.trim() && isConnected ? 'hover:bg-blue-700' : ''}
              >
                <Send style={{ width: '1rem', height: '1rem' }} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}