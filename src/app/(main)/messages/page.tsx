'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Send, 
  Search, 
  MoreVertical, 
  Phone, 
  Video, 
  Image as ImageIcon, 
  Paperclip, 
  Smile,
  Check,
  CheckCheck,
  Circle,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '@/store/auth';
import { useToast } from '@/components/ui/toast';
import { Loading } from '@/components/ui/loading';

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
  status: 'sending' | 'sent' | 'delivered' | 'read';
  replyTo?: string;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  participantRole: 'guide' | 'traveler';
  lastMessage?: Message;
  unreadCount: number;
  isOnline: boolean;
  lastSeen?: string;
}

function MessagesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const { error } = useToast();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 檢查認證狀態
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    // 檢查是否有指定的對話對象
    const guideId = searchParams.get('guide');
    if (guideId) {
      // 自動開始與指定地陪的對話
      handleStartConversation(guideId);
    }
    
    loadConversations();
  }, [isAuthenticated, router, searchParams]);

  // 檢查螢幕大小
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // 自動滾動到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    setIsLoading(true);
    try {
      // TODO: 實際 API 調用
      const mockConversations: Conversation[] = [
        {
          id: 'conv-1',
          participantId: 'guide-1',
          participantName: '小美',
          participantAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
          participantRole: 'guide',
          unreadCount: 2,
          isOnline: true,
          lastMessage: {
            id: 'msg-1',
            content: '期待與您一起探索台北！',
            senderId: 'guide-1',
            receiverId: user?.id || '',
            timestamp: '2024-01-16T10:30:00Z',
            type: 'text',
            status: 'read'
          }
        },
        {
          id: 'conv-2',
          participantId: 'guide-2',
          participantName: '阿明',
          participantAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
          participantRole: 'guide',
          unreadCount: 0,
          isOnline: false,
          lastSeen: '2024-01-16T08:00:00Z',
          lastMessage: {
            id: 'msg-2',
            content: '九份的行程我們明天確認',
            senderId: user?.id || '',
            receiverId: 'guide-2',
            timestamp: '2024-01-15T16:20:00Z',
            type: 'text',
            status: 'read'
          }
        }
      ];
      
      setConversations(mockConversations);
      
      // 如果沒有活動對話且有對話，自動選擇第一個
      if (!activeConversation && mockConversations.length > 0) {
        setActiveConversation(mockConversations[0]?.id || null);
        if (mockConversations[0]?.id) {
          loadMessages(mockConversations[0].id);
        }
      }
      
    } catch (err) {
      error('載入失敗', '無法載入對話列表');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      // TODO: 實際 API 調用
      const mockMessages: Message[] = [
        {
          id: 'msg-1',
          content: '您好！我是小美，很高興為您提供台北導覽服務',
          senderId: 'guide-1',
          receiverId: user?.id || '',
          timestamp: '2024-01-16T09:00:00Z',
          type: 'text',
          status: 'read'
        },
        {
          id: 'msg-2',
          content: '您好！我想詢問台北101的導覽行程',
          senderId: user?.id || '',
          receiverId: 'guide-1',
          timestamp: '2024-01-16T09:15:00Z',
          type: 'text',
          status: 'read'
        },
        {
          id: 'msg-3',
          content: '沒問題！我可以為您安排4小時的深度導覽，包含台北101觀景台和信義商圈',
          senderId: 'guide-1',
          receiverId: user?.id || '',
          timestamp: '2024-01-16T09:18:00Z',
          type: 'text',
          status: 'read'
        },
        {
          id: 'msg-4',
          content: '期待與您一起探索台北！',
          senderId: 'guide-1',
          receiverId: user?.id || '',
          timestamp: '2024-01-16T10:30:00Z',
          type: 'text',
          status: 'delivered'
        }
      ];
      
      setMessages(mockMessages);
    } catch (err) {
      error('載入失敗', '無法載入訊息');
    }
  };

  const handleStartConversation = async (guideId: string) => {
    // 檢查是否已經有與此地陪的對話
    const existingConv = conversations.find(conv => conv.participantId === guideId);
    if (existingConv) {
      setActiveConversation(existingConv.id);
      loadMessages(existingConv.id);
    } else {
      // 創建新對話
      // TODO: 實際 API 調用獲取地陪資訊
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversation || isSending) return;
    
    setIsSending(true);
    
    const message: Message = {
      id: `msg-${Date.now()}`,
      content: newMessage.trim(),
      senderId: user?.id || '',
      receiverId: conversations.find(c => c.id === activeConversation)?.participantId || '',
      timestamp: new Date().toISOString(),
      type: 'text',
      status: 'sending'
    };

    // 立即顯示訊息
    setMessages(prev => [...prev, message]);
    setNewMessage('');

    try {
      // TODO: 實際 API 調用
      await new Promise(resolve => setTimeout(resolve, 1000)); // 模擬延遲
      
      // 更新訊息狀態
      setMessages(prev => 
        prev.map(msg => 
          msg.id === message.id 
            ? { ...msg, status: 'sent' as const }
            : msg
        )
      );
      
    } catch (err) {
      // 發送失敗，移除訊息或標記為失敗
      setMessages(prev => prev.filter(msg => msg.id !== message.id));
      error('發送失敗', '訊息發送失敗，請重試');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getMessageStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sending':
        return <Circle className="w-3 h-3 text-gray-400" />;
      case 'sent':
        return <Check className="w-3 h-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      default:
        return null;
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeConv = conversations.find(conv => conv.id === activeConversation);

  if (isLoading) {
    return (
      <div className="bg-white">
        <div className="container py-8">
          <div className="flex justify-center items-center py-20">
            <Loading size="lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="container py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">訊息中心</h1>
          <p className="text-gray-600">與地陪即時溝通，規劃完美行程</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" style={{ height: '600px' }}>
          <div className="flex h-full">
            {/* 對話列表 */}
            <div className={`border-r border-gray-200 ${isMobileView && activeConversation ? 'hidden' : 'w-full md:w-1/3'}`}>
              {/* 搜尋框 */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="搜尋對話..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#002C56] focus:border-[#002C56]"
                  />
                </div>
              </div>

              {/* 對話列表 */}
              <div className="overflow-y-auto" style={{ height: 'calc(100% - 73px)' }}>
                {filteredConversations.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {filteredConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        onClick={() => {
                          setActiveConversation(conversation.id);
                          loadMessages(conversation.id);
                        }}
                        className={`p-4 cursor-pointer hover:bg-[#cfdbe9] transition-colors ${
                          activeConversation === conversation.id ? 'bg-blue-50 border-r-2 border-[#002C56]' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <img
                              src={conversation.participantAvatar}
                              alt={conversation.participantName}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            {conversation.isOnline && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-medium text-gray-900 truncate">
                                {conversation.participantName}
                              </h3>
                              <div className="flex items-center space-x-1">
                                {conversation.lastMessage && (
                                  <span className="text-xs text-gray-500">
                                    {new Date(conversation.lastMessage.timestamp).toLocaleTimeString('zh-TW', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                )}
                                {conversation.unreadCount > 0 && (
                                  <div className="bg-[#002C56] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {conversation.unreadCount}
                                  </div>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 truncate mt-1">
                              {conversation.lastMessage?.content || '開始新對話'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <p>沒有找到對話</p>
                  </div>
                )}
              </div>
            </div>

            {/* 對話內容區 */}
            <div className={`flex flex-col ${isMobileView && !activeConversation ? 'hidden' : 'flex-1'}`}>
              {activeConv ? (
                <>
                  {/* 對話標題 */}
                  <div className="bg-white">
                    <div className="flex items-center space-x-3">
                      {isMobileView && (
                        <button
                          onClick={() => setActiveConversation(null)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <ArrowLeft className="w-5 h-5" />
                        </button>
                      )}
                      <img
                        src={activeConv.participantAvatar}
                        alt={activeConv.participantName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">{activeConv.participantName}</h3>
                        <p className="text-sm text-gray-600">
                          {activeConv.isOnline ? '線上' : `最後上線 ${activeConv.lastSeen ? new Date(activeConv.lastSeen).toLocaleString('zh-TW') : '未知'}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-gray-200 rounded-full">
                        <Phone className="w-5 h-5 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-200 rounded-full">
                        <Video className="w-5 h-5 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-200 rounded-full">
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* 訊息區域 */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: 'calc(100% - 140px)' }}>
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.senderId === user?.id
                            ? 'bg-[#002C56] text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          <div className={`flex items-center justify-end mt-1 space-x-1 ${
                            message.senderId === user?.id ? 'text-red-200' : 'text-gray-500'
                          }`}>
                            <span className="text-xs">
                              {new Date(message.timestamp).toLocaleTimeString('zh-TW', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            {message.senderId === user?.id && getMessageStatusIcon(message.status)}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* 輸入區域 */}
                  <div className="bg-white">
                    <div className="flex items-end space-x-2">
                      <button className="p-2 text-gray-500 hover:text-gray-700">
                        <Paperclip className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-gray-700">
                        <ImageIcon className="w-5 h-5" />
                      </button>
                      <div className="flex-1 relative">
                        <textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="輸入訊息..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-[#002C56] focus:border-[#002C56]"
                          rows={1}
                          style={{ minHeight: '40px', maxHeight: '100px' }}
                        />
                      </div>
                      <button className="p-2 text-gray-500 hover:text-gray-700">
                        <Smile className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || isSending}
                        className="p-2 bg-[#002C56] text-white rounded-lg hover:bg-[#001f3f] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">選擇對話開始聊天</h3>
                    <p className="text-gray-600">與地陪即時溝通，規劃完美的旅行體驗</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MessagesPageContent />
    </Suspense>
  );
}