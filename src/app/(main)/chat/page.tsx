'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Search, Plus, MessageCircle } from 'lucide-react';
import { ChatInterface } from '@/components/chat/chat-interface';
import { useAuth } from '@/store/auth';

interface ChatContact {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  role: 'guide' | 'traveler' | 'support';
  isOnline: boolean;
}

export default function ChatPage() {
  const { user } = useAuth();
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState<ChatContact[]>([]);

  // 模擬聊天聯絡人數據
  useEffect(() => {
    if (user) {
      const mockContacts: ChatContact[] = [
        {
          id: 'guide-001',
          name: '張小明導遊',
          lastMessage: '您好！我已經安排好明天的行程，期待與您見面！',
          lastMessageTime: new Date(Date.now() - 5 * 60 * 1000), // 5分鐘前
          unreadCount: 2,
          role: 'guide',
          isOnline: true
        },
        {
          id: 'traveler-001',
          name: '李大華',
          lastMessage: '謝謝您的服務，這次旅行非常愉快！',
          lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2小時前
          unreadCount: 0,
          role: 'traveler',
          isOnline: false
        },
        {
          id: 'guide-002',
          name: '王美麗導遊',
          lastMessage: '下次有機會歡迎再來台灣！',
          lastMessageTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1天前
          unreadCount: 0,
          role: 'guide',
          isOnline: true
        },
        {
          id: 'support',
          name: '客服中心',
          lastMessage: '您的問題已經解決了嗎？如有其他需要請隨時聯繫我們。',
          lastMessageTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3天前
          unreadCount: 0,
          role: 'support',
          isOnline: true
        }
      ];
      setContacts(mockContacts);
    }
  }, [user]);

  // 過濾聯絡人
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 格式化時間
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes} 分鐘前`;
    } else if (hours < 24) {
      return `${hours} 小時前`;
    } else if (days < 7) {
      return `${days} 天前`;
    } else {
      return new Intl.DateTimeFormat('zh-TW', {
        month: 'short',
        day: 'numeric'
      }).format(date);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'guide':
        return '#10b981';
      case 'support':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '0.5rem',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
            請先登入
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            您需要登入才能使用聊天功能
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '1rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        overflow: 'hidden',
        height: '90vh',
        display: 'flex'
      }}>
        {/* 聯絡人列表 */}
        <div style={{
          width: selectedContact ? '350px' : '100%',
          borderRight: selectedContact ? '1px solid #e5e7eb' : 'none',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.3s ease'
        }}>
          {/* 標題和搜尋 */}
          <div style={{
            padding: '1rem',
            borderBottom: '1px solid #e5e7eb',
            backgroundColor: '#f8fafc'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => setSelectedContact(null)}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    display: selectedContact ? 'flex' : 'none',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  className="hover:bg-gray-200"
                >
                  <ArrowLeft style={{ width: '1.25rem', height: '1.25rem', color: '#6b7280' }} />
                </button>
                <h1 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827' }}>
                  聊天室
                </h1>
              </div>
              <button style={{
                padding: '0.5rem',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }} className="hover:bg-gray-200">
                <Plus style={{ width: '1.25rem', height: '1.25rem', color: '#6b7280' }} />
              </button>
            </div>

            {/* 搜尋框 */}
            <div style={{ position: 'relative' }}>
              <Search style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '1rem',
                height: '1rem',
                color: '#9ca3af'
              }} />
              <input
                type="text"
                placeholder="搜尋聊天室..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  backgroundColor: 'white',
                  outline: 'none'
                }}
                className="focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 聯絡人列表 */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredContacts.length === 0 ? (
              <div style={{
                padding: '2rem',
                textAlign: 'center',
                color: '#6b7280'
              }}>
                <MessageCircle style={{
                  width: '3rem',
                  height: '3rem',
                  margin: '0 auto 1rem',
                  color: '#d1d5db'
                }} />
                <p>尚無聊天記錄</p>
              </div>
            ) : (
              filteredContacts.map(contact => (
                <div
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  style={{
                    padding: '1rem',
                    borderBottom: '1px solid #f3f4f6',
                    cursor: 'pointer',
                    backgroundColor: selectedContact?.id === contact.id ? '#f0f9ff' : 'transparent',
                    transition: 'all 0.2s'
                  }}
                  className="hover:bg-gray-50"
                >
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {/* 頭像 */}
                    <div style={{ position: 'relative' }}>
                      <div style={{
                        width: '3rem',
                        height: '3rem',
                        backgroundColor: contact.avatar ? 'transparent' : '#e5e7eb',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        color: '#6b7280',
                        backgroundImage: contact.avatar ? `url(${contact.avatar})` : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}>
                        {!contact.avatar && contact.name.charAt(0).toUpperCase()}
                      </div>
                      
                      {/* 在線狀態 */}
                      {contact.isOnline && (
                        <div style={{
                          position: 'absolute',
                          bottom: '0.125rem',
                          right: '0.125rem',
                          width: '0.75rem',
                          height: '0.75rem',
                          backgroundColor: '#10b981',
                          borderRadius: '50%',
                          border: '2px solid white'
                        }} />
                      )}
                      
                      {/* 角色標識 */}
                      <div style={{
                        position: 'absolute',
                        top: '-0.25rem',
                        right: '-0.25rem',
                        width: '1rem',
                        height: '1rem',
                        backgroundColor: getRoleColor(contact.role),
                        borderRadius: '50%',
                        border: '2px solid white'
                      }} />
                    </div>

                    {/* 聊天內容 */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '0.25rem'
                      }}>
                        <div style={{
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: '#111827',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {contact.name}
                        </div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#9ca3af',
                          flexShrink: 0
                        }}>
                          {formatTime(contact.lastMessageTime)}
                        </div>
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#6b7280',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          flex: 1
                        }}>
                          {contact.lastMessage}
                        </div>
                        
                        {contact.unreadCount > 0 && (
                          <div style={{
                            width: '1.25rem',
                            height: '1.25rem',
                            backgroundColor: '#ef4444',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: 'white',
                            marginLeft: '0.5rem',
                            flexShrink: 0
                          }}>
                            {contact.unreadCount > 9 ? '9+' : contact.unreadCount}
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

        {/* 聊天介面 */}
        {selectedContact ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <ChatInterface
              recipientId={selectedContact.id}
              recipientName={selectedContact.name}
              recipientAvatar={selectedContact.avatar}
              chatType={selectedContact.role === 'support' ? 'customer_support' : 'guide_chat'}
            />
          </div>
        ) : (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f9fafb'
          }}>
            <div style={{ textAlign: 'center', color: '#6b7280' }}>
              <MessageCircle style={{
                width: '4rem',
                height: '4rem',
                margin: '0 auto 1rem',
                color: '#d1d5db'
              }} />
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                選擇一個聊天室
              </h3>
              <p>點擊左側聯絡人開始對話</p>
            </div>
          </div>
        )}
      </div>
      
    </div>
  );
}