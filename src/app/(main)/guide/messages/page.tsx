'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Send, MoreVertical, Phone, Video, Star, Clock, MessageCircle, Users, Filter } from 'lucide-react';
import { useAuth } from '@/store/auth';
import { Loading } from '@/components/ui/loading';

interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: string;
  isRead: boolean;
}

interface Conversation {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  serviceTitle?: string;
  bookingId?: string;
}

export default function GuideMessagesPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data
  const mockConversations: Conversation[] = [
    {
      id: 'conv-1',
      userId: 'user-1',
      userName: '張小明',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      lastMessage: '請問明天的行程可以調整嗎？',
      lastMessageTime: '10:30',
      unreadCount: 2,
      isOnline: true,
      serviceTitle: '台北101 & 信義區深度導覽',
      bookingId: 'booking-1'
    },
    {
      id: 'conv-2',
      userId: 'user-2',
      userName: '李小華',
      userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      lastMessage: '謝謝您的詳細介紹！',
      lastMessageTime: '昨天',
      unreadCount: 0,
      isOnline: false,
      serviceTitle: '九份老街 & 金瓜石礦業遺址',
      bookingId: 'booking-2'
    },
    {
      id: 'conv-3',
      userId: 'user-3',
      userName: '王大明',
      userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      lastMessage: '想詢問一些當地的美食推薦',
      lastMessageTime: '2天前',
      unreadCount: 1,
      isOnline: true,
      serviceTitle: '台南古蹟巡禮 & 美食探索'
    }
  ];

  const mockMessages: Record<string, Message[]> = {
    'conv-1': [
      {
        id: 'msg-1',
        content: '您好！我已經預訂了您的台北101導覽服務',
        senderId: 'user-1',
        timestamp: '09:15',
        isRead: true
      },
      {
        id: 'msg-2',
        content: '您好！很高興為您服務。我會在約定時間準時到達集合點。',
        senderId: 'guide-1',
        timestamp: '09:20',
        isRead: true
      },
      {
        id: 'msg-3',
        content: '請問明天的行程可以調整嗎？我想要多看一些歷史建築',
        senderId: 'user-1',
        timestamp: '10:30',
        isRead: false
      }
    ]
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    // 模擬載入數據
    setTimeout(() => {
      setConversations(mockConversations);
      setIsLoading(false);
    }, 1000);
  }, [isAuthenticated, router]);

  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversation(conversationId);
    setMessages(mockMessages[conversationId] || []);
    
    // 標記為已讀
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    );
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      content: newMessage,
      senderId: 'guide-1',
      timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
      isRead: true
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');

    // 更新對話列表
    setConversations(prev =>
      prev.map(conv =>
        conv.id === selectedConversation
          ? { ...conv, lastMessage: newMessage, lastMessageTime: '剛剛' }
          : conv
      )
    );
  };

  const selectedConv = conversations.find(c => c.id === selectedConversation);
  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  if (!isAuthenticated || isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '1.5rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#111827' }}>
              訊息中心
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {totalUnread > 0 && (
                <div 
                  style={{
                    padding: '0.25rem 0.75rem',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  {totalUnread} 則未讀
                </div>
              )}
            </div>
          </div>
          <p style={{ color: '#6b7280' }}>與客戶即時溝通，提供優質服務體驗</p>
        </div>

        {/* Chat Interface */}
        <div 
          style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            height: '80vh',
            display: 'flex',
            overflow: 'hidden'
          }}
        >
          {/* Conversations List */}
          <div style={{ width: '24rem', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>
            {/* Search */}
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ position: 'relative' }}>
                <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#9ca3af' }} />
                <input
                  type="text"
                  placeholder="搜尋對話..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    paddingLeft: '2.5rem',
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                  className="focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>

            {/* Conversations */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {conversations.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                  <MessageCircle style={{ width: '3rem', height: '3rem', margin: '0 auto 1rem', color: '#d1d5db' }} />
                  <p>暫無對話</p>
                  <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    當有客戶聯繫您時，對話會顯示在這裡
                  </p>
                </div>
              ) : (
                conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => handleConversationSelect(conversation.id)}
                    style={{
                      padding: '1rem',
                      cursor: 'pointer',
                      borderBottom: '1px solid #f3f4f6',
                      backgroundColor: selectedConversation === conversation.id ? '#eff6ff' : 'transparent',
                      transition: 'all 0.2s'
                    }}
                    className="hover:bg-[#cfdbe9]"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ position: 'relative' }}>
                        <img
                          src={conversation.userAvatar}
                          alt={conversation.userName}
                          style={{ width: '3rem', height: '3rem', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        {conversation.isOnline && (
                          <div 
                            style={{
                              position: 'absolute',
                              bottom: '0',
                              right: '0',
                              width: '0.75rem',
                              height: '0.75rem',
                              backgroundColor: '#10b981',
                              borderRadius: '50%',
                              border: '2px solid white'
                            }}
                          ></div>
                        )}
                      </div>
                      
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                          <h3 style={{ fontWeight: '600', color: '#111827', fontSize: '0.875rem' }}>
                            {conversation.userName}
                          </h3>
                          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                            {conversation.lastMessageTime}
                          </span>
                        </div>
                        
                        {conversation.serviceTitle && (
                          <p style={{ fontSize: '0.75rem', color: '#2563eb', marginBottom: '0.25rem' }}>
                            {conversation.serviceTitle}
                          </p>
                        )}
                        
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <p 
                            style={{ 
                              fontSize: '0.875rem', 
                              color: '#6b7280',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              maxWidth: '10rem'
                            }}
                          >
                            {conversation.lastMessage}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <div 
                              style={{
                                backgroundColor: '#ef4444',
                                color: 'white',
                                borderRadius: '50%',
                                width: '1.25rem',
                                height: '1.25rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem',
                                fontWeight: '600'
                              }}
                            >
                              {conversation.unreadCount}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {selectedConv ? (
              <>
                {/* Chat Header */}
                <div 
                  style={{
                    padding: '1rem 1.5rem',
                    borderBottom: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img
                      src={selectedConv.userAvatar}
                      alt={selectedConv.userName}
                      style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <h3 style={{ fontWeight: '600', color: '#111827' }}>{selectedConv.userName}</h3>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {selectedConv.isOnline ? '線上' : '離線'}
                      </p>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button 
                      style={{
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        backgroundColor: '#f3f4f6',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      className="hover:bg-gray-300"
                    >
                      <Phone style={{ width: '1.25rem', height: '1.25rem', color: '#6b7280' }} />
                    </button>
                    <button 
                      style={{
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        backgroundColor: '#f3f4f6',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      className="hover:bg-gray-300"
                    >
                      <Video style={{ width: '1.25rem', height: '1.25rem', color: '#6b7280' }} />
                    </button>
                    <button 
                      style={{
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        backgroundColor: '#f3f4f6',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      className="hover:bg-gray-300"
                    >
                      <MoreVertical style={{ width: '1.25rem', height: '1.25rem', color: '#6b7280' }} />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {messages.map((message) => (
                    <div 
                      key={message.id}
                      style={{
                        display: 'flex',
                        justifyContent: message.senderId === 'guide-1' ? 'flex-end' : 'flex-start'
                      }}
                    >
                      <div
                        style={{
                          maxWidth: '70%',
                          padding: '0.75rem 1rem',
                          borderRadius: '1rem',
                          backgroundColor: message.senderId === 'guide-1' ? '#2563eb' : '#f3f4f6',
                          color: message.senderId === 'guide-1' ? 'white' : '#111827'
                        }}
                      >
                        <p style={{ margin: 0, lineHeight: '1.5' }}>{message.content}</p>
                        <p 
                          style={{ 
                            margin: '0.25rem 0 0', 
                            fontSize: '0.75rem', 
                            opacity: 0.7,
                            textAlign: 'right'
                          }}
                        >
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input
                      type="text"
                      placeholder="輸入訊息..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSendMessage();
                        }
                      }}
                      style={{
                        flex: 1,
                        padding: '0.75rem 1rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '9999px',
                        fontSize: '0.875rem',
                        outline: 'none'
                      }}
                      className="focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      style={{
                        padding: '0.75rem',
                        backgroundColor: newMessage.trim() ? '#2563eb' : '#d1d5db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s'
                      }}
                    >
                      <Send style={{ width: '1.25rem', height: '1.25rem' }} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* No Chat Selected */
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', color: '#6b7280' }}>
                  <MessageCircle style={{ width: '4rem', height: '4rem', margin: '0 auto 1rem', color: '#d1d5db' }} />
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    選擇對話開始聊天
                  </h3>
                  <p>從左側選擇一個對話來查看訊息</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}