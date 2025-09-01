import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/store/auth';

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

interface SendMessageData {
  content: string;
  type: Message['type'];
  metadata?: any;
}

interface ChatState {
  messages: Message[];
  isConnected: boolean;
  isLoading: boolean;
  unreadCount: number;
}

// 模擬 WebSocket 連接
class MockWebSocket {
  private listeners: { [event: string]: Function[] } = {};
  private connected = false;
  
  constructor(url: string) {
    // 模擬連接延遲
    setTimeout(() => {
      this.connected = true;
      this.emit('open');
      
      // 模擬接收客服自動回覆
      if (url.includes('support')) {
        setTimeout(() => {
          this.emit('message', {
            data: JSON.stringify({
              type: 'message',
              data: {
                id: 'auto-reply-1',
                content: '您好！我是 Guidee 客服，有什麼可以幫助您的嗎？',
                timestamp: new Date().toISOString(),
                sender: {
                  id: 'support',
                  name: '客服中心',
                  role: 'support'
                },
                type: 'text',
                status: 'sent'
              }
            })
          });
        }, 1000);
      }
    }, 500);
  }
  
  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }
  
  off(event: string, callback: Function) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }
  
  emit(event: string, data?: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }
  
  send(data: string) {
    if (!this.connected) return;
    
    // 模擬發送訊息
    setTimeout(() => {
      this.emit('message', {
        data: JSON.stringify({
          type: 'status',
          messageId: JSON.parse(data).messageId,
          status: 'delivered'
        })
      });
    }, 500);
    
    // 模擬對方回覆（僅客服）
    const messageData = JSON.parse(data);
    if (messageData.recipient === 'support' && Math.random() > 0.3) {
      setTimeout(() => {
        const responses = [
          '我了解您的問題，讓我為您查詢一下。',
          '感謝您的詢問，我會盡快為您處理。',
          '請稍等，我正在為您安排相關人員。',
          '這個問題很常見，讓我為您詳細說明。'
        ];
        
        this.emit('message', {
          data: JSON.stringify({
            type: 'message',
            data: {
              id: `reply-${Date.now()}`,
              content: responses[Math.floor(Math.random() * responses.length)],
              timestamp: new Date().toISOString(),
              sender: {
                id: 'support',
                name: '客服中心',
                role: 'support'
              },
              type: 'text',
              status: 'sent'
            }
          })
        });
      }, 1000 + Math.random() * 2000);
    }
  }
  
  close() {
    this.connected = false;
    this.emit('close');
  }
  
  get readyState() {
    return this.connected ? 1 : 0; // OPEN : CONNECTING
  }
}

export function useChat(recipientId: string, chatType: 'customer_support' | 'guide_chat' | 'booking_chat') {
  const { user } = useAuth();
  const [state, setState] = useState<ChatState>({
    messages: [],
    isConnected: false,
    isLoading: true,
    unreadCount: 0
  });
  
  const wsRef = useRef<MockWebSocket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 初始化 WebSocket 連接
  useEffect(() => {
    if (!user) return;

    const wsUrl = `ws://localhost:3001/chat/${chatType}/${recipientId}`;
    const ws = new MockWebSocket(wsUrl);
    wsRef.current = ws;

    const handleOpen = () => {
      setState(prev => ({ 
        ...prev, 
        isConnected: true, 
        isLoading: false 
      }));
    };

    const handleMessage = (event: any) => {
      try {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'message':
            const newMessage: Message = {
              ...data.data,
              timestamp: new Date(data.data.timestamp)
            };
            
            setState(prev => ({
              ...prev,
              messages: [...prev.messages, newMessage],
              unreadCount: newMessage.sender.id !== user.id 
                ? prev.unreadCount + 1 
                : prev.unreadCount
            }));
            break;
            
          case 'status':
            setState(prev => ({
              ...prev,
              messages: prev.messages.map(msg => 
                msg.id === data.messageId 
                  ? { ...msg, status: data.status }
                  : msg
              )
            }));
            break;
            
          case 'typing':
            // 處理對方正在輸入狀態
            break;
        }
      } catch (error) {
        console.error('解析訊息失敗:', error);
      }
    };

    const handleClose = () => {
      setState(prev => ({ 
        ...prev, 
        isConnected: false 
      }));
    };

    const handleError = (error: any) => {
      console.error('WebSocket 錯誤:', error);
      setState(prev => ({ 
        ...prev, 
        isConnected: false,
        isLoading: false 
      }));
    };

    ws.on('open', handleOpen);
    ws.on('message', handleMessage);
    ws.on('close', handleClose);
    ws.on('error', handleError);

    return () => {
      ws.off('open', handleOpen);
      ws.off('message', handleMessage);
      ws.off('close', handleClose);
      ws.off('error', handleError);
      ws.close();
    };
  }, [user, recipientId, chatType]);

  // 發送訊息
  const sendMessage = useCallback(async (messageData: SendMessageData) => {
    if (!wsRef.current || !user) return;

    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const message: Message = {
      id: messageId,
      content: messageData.content,
      timestamp: new Date(),
      sender: {
        id: user.id,
        name: user.name,
        avatar: user.profile?.avatar,
        role: user.role === 'guide' ? 'guide' : 'user'
      },
      type: messageData.type,
      status: 'sending',
      metadata: messageData.metadata
    };

    // 立即添加到本地訊息列表
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, message]
    }));

    try {
      // 發送到服務器
      wsRef.current.send(JSON.stringify({
        messageId,
        recipient: recipientId,
        content: messageData.content,
        type: messageData.type,
        metadata: messageData.metadata
      }));

      // 更新狀態為已發送
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          messages: prev.messages.map(msg => 
            msg.id === messageId 
              ? { ...msg, status: 'sent' }
              : msg
          )
        }));
      }, 100);

    } catch (error) {
      console.error('發送訊息失敗:', error);
      
      // 更新訊息狀態為失敗
      setState(prev => ({
        ...prev,
        messages: prev.messages.map(msg => 
          msg.id === messageId 
            ? { ...msg, status: 'sending' } // 可以改為 'failed' 狀態
            : msg
        )
      }));
      
      throw error;
    }
  }, [user, recipientId]);

  // 標記訊息為已讀
  const markAsRead = useCallback(() => {
    setState(prev => ({
      ...prev,
      unreadCount: 0,
      messages: prev.messages.map(msg => 
        msg.sender.id !== user?.id && msg.status !== 'read'
          ? { ...msg, status: 'read' }
          : msg
      )
    }));
  }, [user]);

  // 開始輸入
  const startTyping = useCallback(() => {
    if (!wsRef.current) return;

    // 清除之前的計時器
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // 發送正在輸入狀態
    wsRef.current.send(JSON.stringify({
      type: 'typing',
      recipient: recipientId,
      isTyping: true
    }));

    // 設定停止輸入的計時器
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 3000);
  }, [recipientId]);

  // 停止輸入
  const stopTyping = useCallback(() => {
    if (!wsRef.current) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    wsRef.current.send(JSON.stringify({
      type: 'typing',
      recipient: recipientId,
      isTyping: false
    }));
  }, [recipientId]);

  // 清除計時器
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return {
    messages: state.messages,
    isConnected: state.isConnected,
    isLoading: state.isLoading,
    unreadCount: state.unreadCount,
    sendMessage,
    markAsRead,
    startTyping,
    stopTyping
  };
}