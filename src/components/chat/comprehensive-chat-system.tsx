'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Send,
  Paperclip,
  Phone,
  Video,
  MoreHorizontal,
  X,
  Smile,
  MapPin,
  Image as ImageIcon,
  File,
  Download,
  Play,
  Pause,
  Check,
  CheckCheck,
  Clock,
  AlertCircle,
  UserPlus,
  Archive,
  Bell,
  BellOff,
  Search,
  Reply,
  Trash2,
  Eye,
  Users,
  Calendar,
  CreditCard,
  Info
} from 'lucide-react';
import { useChatSystem } from '@/hooks/useChatSystem';
import { useAuth } from '@/store/auth';
import {
  ChatSystemProps,
  ChatMessage,
  MessageAttachment,
  SendMessageRequest,
  MessageType,
  ConversationParticipant,
  OnlineStatus,
  BookingReference
} from '@/types/chat';

export function ComprehensiveChatSystem({
  conversationId,
  userId,
  className = '',
  height = '600px',
  showHeader = true,
  showParticipants = false,
  enableFileSharing = true,
  enableLocationSharing = true,
  maxFileSize = 10 * 1024 * 1024, // 10MB
  allowedFileTypes = ['image/*', 'application/pdf', 'text/*'],
  onConversationUpdate,
  onMessageSent,
  onError
}: ChatSystemProps) {
  const { user } = useAuth();
  const {
    currentConversation,
    messages,
    isLoading,
    isConnected,
    isTyping,
    uploadingFiles,
    typingUsers,
    error,
    sendMessage,
    startTyping,
    stopTyping,
    markAsRead,
    updateOnlineStatus
  } = useChatSystem({
    conversationId,
    userId,
    enableTypingIndicators: true,
    enableReadReceipts: true,
    enableFileSharing,
    autoReconnect: true
  });

  // Local state
  const [inputValue, setInputValue] = useState('');
  const [replyToMessage, setReplyToMessage] = useState<ChatMessage | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showParticipantList, setShowParticipantList] = useState(showParticipants);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [showBookingInfo, setShowBookingInfo] = useState(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark messages as read when conversation is active
  useEffect(() => {
    if (messages.length > 0 && user) {
      const unreadMessages = messages
        .filter(msg => msg.sender.id !== user.id && !msg.readStatuses.some(rs => rs.userId === user.id))
        .map(msg => msg.id);
      
      if (unreadMessages.length > 0) {
        markAsRead(unreadMessages);
      }
    }
  }, [messages, user, markAsRead]);

  // Handle input changes with typing indicators
  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
    
    if (value.trim() && !isTyping) {
      startTyping();
    } else if (!value.trim() && isTyping) {
      stopTyping();
    }
  }, [isTyping, startTyping, stopTyping]);

  // Handle message sending
  const handleSendMessage = useCallback(async () => {
    const content = inputValue.trim();
    if (!content && selectedFiles.length === 0) return;

    try {
      const messageData: SendMessageRequest = {
        content: content || undefined,
        type: selectedFiles.length > 0 ? (selectedFiles[0]?.type.startsWith('image/') ? 'IMAGE' : 'FILE') : 'TEXT',
        attachments: selectedFiles.length > 0 ? selectedFiles : undefined,
        replyToId: replyToMessage?.id
      };

      await sendMessage(messageData);
      
      // Reset form
      setInputValue('');
      setSelectedFiles([]);
      setReplyToMessage(null);
      stopTyping();
      inputRef.current?.focus();
      
      // Callback
      const lastMessage = messages[messages.length - 1];
      if (lastMessage) {
        onMessageSent?.(lastMessage);
      }
      
    } catch (error) {
      console.error('Failed to send message:', error);
      onError?.('Failed to send message');
    }
  }, [inputValue, selectedFiles, replyToMessage, sendMessage, stopTyping, onMessageSent, onError, messages]);

  // Handle key press
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  // File handling
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files.slice(0, 5 - prev.length)]); // Max 5 files
  }, []);

  const removeSelectedFile = useCallback((index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (enableFileSharing) {
      setSelectedFiles(prev => [...prev, ...files.slice(0, 5 - prev.length)]);
    }
  }, [enableFileSharing]);

  // Format timestamp
  const formatTime = useCallback((date: Date) => {
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
      const days = Math.floor(diffInHours / 24);
      return `${days}天前`;
    } else {
      return date.toLocaleDateString('zh-TW');
    }
  }, []);

  // Get message status icon
  const getStatusIcon = useCallback((message: ChatMessage) => {
    if (message.sender.id !== user?.id) return null;

    const iconStyle = { width: '0.875rem', height: '0.875rem' };
    
    switch (message.status) {
      case 'sending':
        return <Clock style={{ ...iconStyle, color: '#9ca3af' }} />;
      case 'sent':
        return <Check style={{ ...iconStyle, color: '#9ca3af' }} />;
      case 'delivered':
        return <CheckCheck style={{ ...iconStyle, color: '#3b82f6' }} />;
      case 'read':
        return <CheckCheck style={{ ...iconStyle, color: '#10b981' }} />;
      case 'failed':
        return <AlertCircle style={{ ...iconStyle, color: '#ef4444' }} />;
      default:
        return null;
    }
  }, [user]);

  // Get online status indicator
  const getOnlineStatusColor = useCallback((status?: OnlineStatus) => {
    switch (status) {
      case 'online': return '#10b981';
      case 'away': return '#f59e0b';
      case 'busy': return '#ef4444';
      default: return '#9ca3af';
    }
  }, []);

  // Render message attachment
  const renderAttachment = useCallback((attachment: MessageAttachment) => {
    const commonStyle = {
      borderRadius: '0.5rem',
      overflow: 'hidden',
      maxWidth: '300px',
      backgroundColor: '#f3f4f6'
    };

    switch (attachment.type) {
      case 'image':
        return (
          <div key={attachment.id} style={commonStyle}>
            <img
              src={attachment.url}
              alt={attachment.name}
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                cursor: 'pointer'
              }}
              onClick={() => window.open(attachment.url, '_blank')}
            />
          </div>
        );
      
      case 'file':
        return (
          <div
            key={attachment.id}
            style={{
              ...commonStyle,
              padding: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              border: '1px solid #e5e7eb',
              cursor: 'pointer'
            }}
            onClick={() => window.open(attachment.url, '_blank')}
          >
            <File style={{ width: '1.25rem', height: '1.25rem', color: '#6b7280' }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {attachment.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                {(attachment.size / 1024).toFixed(1)} KB
              </div>
            </div>
            <Download style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
          </div>
        );
      
      default:
        return null;
    }
  }, []);

  // Render booking reference
  const renderBookingReference = useCallback((booking: BookingReference) => {
    return (
      <div style={{
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '0.75rem',
        padding: '1rem',
        margin: '0.5rem 0',
        maxWidth: '350px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Calendar style={{ width: '1rem', height: '1rem', color: '#3b82f6' }} />
          <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e40af' }}>
            預訂詳情
          </span>
        </div>
        
        <div style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '0.25rem' }}>
          <strong>{booking.serviceName}</strong>
        </div>
        
        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>
          訂單編號: {booking.orderNumber}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            {new Date(booking.date).toLocaleDateString('zh-TW')}
          </span>
          <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#059669' }}>
            {booking.currency} {booking.totalAmount.toLocaleString()}
          </span>
        </div>
      </div>
    );
  }, []);

  // Render typing indicator
  const renderTypingIndicator = useCallback(() => {
    if (typingUsers.length === 0) return null;

    const typingNames = typingUsers.map(tu => tu.user.name).join(', ');
    
    return (
      <div style={{
        padding: '0.5rem 1rem',
        fontSize: '0.75rem',
        color: '#6b7280',
        fontStyle: 'italic',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <div style={{
          display: 'flex',
          gap: '0.125rem'
        }}>
          {[1, 2, 3].map(i => (
            <div
              key={i}
              style={{
                width: '0.25rem',
                height: '0.25rem',
                backgroundColor: '#9ca3af',
                borderRadius: '50%',
                animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite both`
              }}
            />
          ))}
        </div>
        {typingNames} 正在輸入...
      </div>
    );
  }, [typingUsers]);

  // Loading state
  if (isLoading) {
    return (
      <div style={{
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9fafb',
        borderRadius: '0.5rem',
        border: '1px solid #e5e7eb'
      }} className={className}>
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
          載入對話中...
        </div>
      </div>
    );
  }

  return (
    <div 
      style={{
        height,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        position: 'relative'
      }}
      className={className}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag overlay */}
      {dragOver && enableFileSharing && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          border: '2px dashed #3b82f6',
          borderRadius: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50
        }}>
          <div style={{ textAlign: 'center', color: '#3b82f6' }}>
            <Paperclip style={{ width: '3rem', height: '3rem', margin: '0 auto 0.5rem' }} />
            <div style={{ fontSize: '1.125rem', fontWeight: '600' }}>拖放檔案到這裡</div>
          </div>
        </div>
      )}

      {/* Header */}
      {showHeader && currentConversation && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem',
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
            {currentConversation.type === 'DIRECT' && (
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  backgroundColor: currentConversation.avatar ? 'transparent' : '#e5e7eb',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#6b7280',
                  backgroundImage: currentConversation.avatar ? `url(${currentConversation.avatar})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}>
                  {!currentConversation.avatar && currentConversation.title?.charAt(0).toUpperCase()}
                </div>
                
                {/* Online status indicator */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: '0.75rem',
                  height: '0.75rem',
                  backgroundColor: getOnlineStatusColor(
                    currentConversation.participants.find(p => p.id !== user?.id)?.onlineStatus
                  ),
                  borderRadius: '50%',
                  border: '2px solid white'
                }} />
              </div>
            )}
            
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                {currentConversation.title || 
                 currentConversation.participants
                   .filter(p => p.id !== user?.id)
                   .map(p => p.name)
                   .join(', ')}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                {isConnected ? (
                  typingUsers.length > 0 
                    ? `${typingUsers.map(tu => tu.user.name).join(', ')} 正在輸入...`
                    : `${currentConversation.participants.length} 位參與者`
                ) : '連線中...'}
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {currentConversation.bookingId && (
              <button
                onClick={() => setShowBookingInfo(!showBookingInfo)}
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
                <Calendar style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
              </button>
            )}
            
            <button
              onClick={() => setShowSearch(!showSearch)}
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
              <Search style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
            </button>
            
            <button
              onClick={() => setShowParticipantList(!showParticipantList)}
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
              <Users style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
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
          </div>
        </div>
      )}

      {/* Search bar */}
      {showSearch && (
        <div style={{
          padding: '0.5rem 1rem',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb'
        }}>
          <input
            type="text"
            placeholder="搜尋訊息..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              outline: 'none'
            }}
            className="focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      )}

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Messages area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Messages list */}
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
                {messages
                  .filter(message => 
                    !searchQuery || 
                    message.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    message.sender.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((message, index) => {
                    const isCurrentUser = message.sender.id === user?.id;
                    const showDate = index === 0 || 
                      new Date(messages[index - 1]?.timestamp || new Date()).toDateString() !== 
                      new Date(message.timestamp).toDateString();

                    return (
                      <div key={message.id}>
                        {/* Date separator */}
                        {showDate && (
                          <div style={{
                            textAlign: 'center',
                            margin: '1rem 0 0.5rem',
                            fontSize: '0.75rem',
                            color: '#9ca3af'
                          }}>
                            {new Date(message.timestamp).toLocaleDateString('zh-TW', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        )}

                        {/* Message bubble */}
                        <div style={{
                          display: 'flex',
                          flexDirection: isCurrentUser ? 'row-reverse' : 'row',
                          alignItems: 'flex-end',
                          gap: '0.5rem',
                          marginBottom: '0.75rem'
                        }}>
                          {/* Avatar */}
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

                          {/* Message content */}
                          <div style={{
                            maxWidth: '70%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: isCurrentUser ? 'flex-end' : 'flex-start'
                          }}>
                            {/* Reply reference */}
                            {message.replyTo && (
                              <div style={{
                                fontSize: '0.75rem',
                                color: '#6b7280',
                                marginBottom: '0.25rem',
                                padding: '0.5rem',
                                backgroundColor: 'rgba(156, 163, 175, 0.1)',
                                borderRadius: '0.375rem',
                                borderLeft: '3px solid #9ca3af',
                                maxWidth: '100%'
                              }}>
                                <div style={{ fontWeight: '600', marginBottom: '0.125rem' }}>
                                  回復 {message.replyTo.sender.name}
                                </div>
                                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {message.replyTo.content || '[附件]'}
                                </div>
                              </div>
                            )}

                            <div style={{
                              padding: '0.75rem 1rem',
                              backgroundColor: isCurrentUser ? '#3b82f6' : 'white',
                              color: isCurrentUser ? 'white' : '#111827',
                              borderRadius: isCurrentUser ? '1rem 1rem 0.25rem 1rem' : '1rem 1rem 1rem 0.25rem',
                              border: !isCurrentUser ? '1px solid #e5e7eb' : 'none',
                              fontSize: '0.875rem',
                              lineHeight: '1.5',
                              wordBreak: 'break-word',
                              position: 'relative'
                            }}>
                              {/* Message content */}
                              {message.content && (
                                <div style={{ marginBottom: message.attachments?.length ? '0.5rem' : 0 }}>
                                  {message.content}
                                </div>
                              )}

                              {/* Attachments */}
                              {message.attachments?.map(attachment => renderAttachment(attachment))}

                              {/* Booking reference */}
                              {message.bookingReference && renderBookingReference(message.bookingReference)}

                              {/* Location */}
                              {message.location && (
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.5rem',
                                  marginTop: message.content ? '0.5rem' : 0
                                }}>
                                  <MapPin style={{ width: '1rem', height: '1rem' }} />
                                  <span>位置分享</span>
                                </div>
                              )}
                            </div>

                            {/* Time and status */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              marginTop: '0.25rem',
                              fontSize: '0.75rem',
                              color: '#9ca3af'
                            }}>
                              <span>{formatTime(message.timestamp)}</span>
                              {isCurrentUser && getStatusIcon(message)}
                            </div>
                          </div>

                          {/* Message actions */}
                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.25rem',
                            opacity: 0,
                            transition: 'opacity 0.2s'
                          }} className="group-hover:opacity-100">
                            <button
                              onClick={() => setReplyToMessage(message)}
                              style={{
                                width: '1.5rem',
                                height: '1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'white',
                                border: '1px solid #e5e7eb',
                                borderRadius: '50%',
                                cursor: 'pointer',
                                fontSize: '0.75rem'
                              }}
                              className="hover:bg-gray-50"
                            >
                              <Reply style={{ width: '0.75rem', height: '0.75rem', color: '#6b7280' }} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                
                {/* Typing indicator */}
                {renderTypingIndicator()}
                
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Reply preview */}
          {replyToMessage && (
            <div style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#f0f9ff',
              borderTop: '1px solid #e0f2fe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: 0 }}>
                <Reply style={{ width: '1rem', height: '1rem', color: '#0284c7' }} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#0284c7' }}>
                    回復 {replyToMessage.sender.name}
                  </div>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: '#0369a1', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'nowrap' 
                  }}>
                    {replyToMessage.content || '[附件]'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setReplyToMessage(null)}
                style={{
                  width: '1.5rem',
                  height: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: 'pointer'
                }}
                className="hover:bg-blue-100"
              >
                <X style={{ width: '1rem', height: '1rem', color: '#0284c7' }} />
              </button>
            </div>
          )}

          {/* Selected files preview */}
          {selectedFiles.length > 0 && (
            <div style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#fefce8',
              borderTop: '1px solid #fef3c7',
              maxHeight: '120px',
              overflowY: 'auto'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#92400e', marginBottom: '0.5rem' }}>
                選擇的檔案 ({selectedFiles.length})
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem',
                      backgroundColor: 'white',
                      border: '1px solid #fbbf24',
                      borderRadius: '0.375rem',
                      fontSize: '0.75rem'
                    }}
                  >
                    {file.type.startsWith('image/') ? (
                      <ImageIcon style={{ width: '1rem', height: '1rem', color: '#d97706' }} />
                    ) : (
                      <File style={{ width: '1rem', height: '1rem', color: '#d97706' }} />
                    )}
                    <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {file.name}
                    </span>
                    <button
                      onClick={() => removeSelectedFile(index)}
                      style={{
                        width: '1rem',
                        height: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderRadius: '0.125rem',
                        cursor: 'pointer'
                      }}
                      className="hover:bg-yellow-200"
                    >
                      <X style={{ width: '0.75rem', height: '0.75rem', color: '#d97706' }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Input area */}
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
              {enableFileSharing && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  className="hover:bg-gray-100"
                >
                  <Paperclip style={{ width: '1.25rem', height: '1.25rem', color: '#6b7280' }} />
                </button>
              )}

              <div style={{ flex: 1, position: 'relative' }}>
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isConnected ? "輸入訊息..." : "連線中..."}
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
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                style={{
                  padding: '0.5rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                className="hover:bg-gray-100"
                disabled={!isConnected}
              >
                <Smile style={{ width: '1.25rem', height: '1.25rem', color: '#6b7280' }} />
              </button>

              <button
                onClick={handleSendMessage}
                disabled={(!inputValue.trim() && selectedFiles.length === 0) || !isConnected}
                style={{
                  padding: '0.75rem',
                  backgroundColor: (inputValue.trim() || selectedFiles.length > 0) && isConnected ? '#3b82f6' : '#e5e7eb',
                  border: 'none',
                  borderRadius: '50%',
                  cursor: (inputValue.trim() || selectedFiles.length > 0) && isConnected ? 'pointer' : 'not-allowed',
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
                  color: (inputValue.trim() || selectedFiles.length > 0) && isConnected ? 'white' : '#9ca3af'
                }} />
              </button>
            </div>
          </div>
        </div>

        {/* Participant list sidebar */}
        {showParticipantList && currentConversation && (
          <div style={{
            width: '250px',
            backgroundColor: '#f9fafb',
            borderLeft: '1px solid #e5e7eb',
            padding: '1rem',
            overflowY: 'auto'
          }}>
            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827', marginBottom: '0.75rem' }}>
              參與者 ({currentConversation.participants.length})
            </div>
            
            {currentConversation.participants.map(participant => (
              <div key={participant.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                marginBottom: '0.5rem'
              }} className="hover:bg-white">
                <div style={{ position: 'relative' }}>
                  <div style={{
                    width: '2rem',
                    height: '2rem',
                    backgroundColor: participant.avatar ? 'transparent' : '#e5e7eb',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: '#6b7280',
                    backgroundImage: participant.avatar ? `url(${participant.avatar})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}>
                    {!participant.avatar && participant.name.charAt(0).toUpperCase()}
                  </div>
                  
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '0.5rem',
                    height: '0.5rem',
                    backgroundColor: getOnlineStatusColor(participant.onlineStatus),
                    borderRadius: '50%',
                    border: '1px solid white'
                  }} />
                </div>
                
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
                    {participant.name}
                    {participant.id === user?.id && ' (你)'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {participant.role === 'guide' ? '導遊' : participant.role === 'admin' ? '管理員' : '旅客'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={allowedFileTypes.join(',')}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {/* Connection status */}
      {!isConnected && (
        <div style={{
          position: 'absolute',
          top: '1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '0.5rem 1rem',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '0.375rem',
          fontSize: '0.75rem',
          color: '#dc2626',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          zIndex: 10
        }}>
          <AlertCircle style={{ width: '1rem', height: '1rem' }} />
          連線中斷，正在重新連線...
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes bounce {
          0%, 80%, 100% { 
            transform: scale(0);
          } 
          40% { 
            transform: scale(1.0);
          }
        }
      `}</style>
    </div>
  );
}