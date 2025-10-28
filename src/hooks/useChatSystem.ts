import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/store/auth';
import {
  ChatMessage,
  ChatConversation,
  ChatState,
  SendMessageRequest,
  FileUploadProgress,
  TypingIndicator,
  ChatEvent,
  WebSocketMessage,
  MessageAttachment,
  ChatHookConfig,
  OnlineStatus
} from '@/types/chat';

// Enhanced WebSocket implementation with reconnection and heartbeat
class EnhancedWebSocket {
  private ws: WebSocket | null = null;
  private url: string;
  private listeners: { [event: string]: Function[] } = {};
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 1000;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private isConnecting = false;
  private shouldReconnect = true;

  constructor(url: string) {
    this.url = url;
    this.connect();
  }

  private connect() {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return;
    }

    this.isConnecting = true;
    
    try {
      this.ws = new WebSocket(this.url);
      this.setupEventListeners();
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.handleReconnect();
    }
  }

  private setupEventListeners() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      this.startHeartbeat();
      this.emit('open');
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'pong') {
          return; // Heartbeat response
        }
        this.emit('message', { data: event.data });
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason);
      this.isConnecting = false;
      this.stopHeartbeat();
      this.emit('close', event);
      
      if (this.shouldReconnect && event.code !== 1000) {
        this.handleReconnect();
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.emit('error', error);
    };
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000); // Send ping every 30 seconds
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts || !this.shouldReconnect) {
      console.error('Max reconnection attempts reached');
      this.emit('maxReconnectAttemptsReached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      if (this.shouldReconnect) {
        this.connect();
      }
    }, delay);
  }

  public on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  public off(event: string, callback: Function) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  public emit(event: string, data?: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  public send(data: string | object) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = typeof data === 'string' ? data : JSON.stringify(data);
      this.ws.send(message);
      return true;
    }
    return false;
  }

  public close() {
    this.shouldReconnect = false;
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close(1000, 'Manual close');
    }
  }

  public get readyState() {
    return this.ws ? this.ws.readyState : WebSocket.CLOSED;
  }

  public get isConnected() {
    return this.ws ? this.ws.readyState === WebSocket.OPEN : false;
  }
}

export function useChatSystem(config: ChatHookConfig) {
  const { user } = useAuth();
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: true,
    isConnected: false,
    isTyping: false,
    uploadingFiles: [],
    typingUsers: [],
  });

  const wsRef = useRef<EnhancedWebSocket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTypingTime = useRef<number>(0);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!user || !config.conversationId) return;

    const wsUrl = process.env.NODE_ENV === 'production' 
      ? `wss://${window.location.host}/ws/chat/${config.conversationId}`
      : `ws://localhost:3001/chat/${config.conversationId}`;

    const ws = new EnhancedWebSocket(wsUrl);
    wsRef.current = ws;

    const handleOpen = () => {
      setState(prev => ({ ...prev, isConnected: true, isLoading: false }));
      
      // Send join message
      ws.send({
        type: 'join',
        conversationId: config.conversationId,
        userId: user.id,
        userInfo: {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          role: user.role
        }
      });
    };

    const handleMessage = (event: any) => {
      try {
        const data: WebSocketMessage = JSON.parse(event.data);
        handleWebSocketMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    const handleClose = () => {
      setState(prev => ({ ...prev, isConnected: false }));
    };

    const handleError = (error: any) => {
      console.error('WebSocket error:', error);
      setState(prev => ({ 
        ...prev, 
        isConnected: false, 
        connectionError: 'Connection error occurred'
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
  }, [user, config.conversationId]);

  // Handle WebSocket messages
  const handleWebSocketMessage = useCallback((data: WebSocketMessage) => {
    switch (data.type) {
      case 'message':
        if (data.data) {
          const newMessage: ChatMessage = {
            ...data.data,
            timestamp: new Date(data.data.timestamp),
            readStatuses: data.data.readStatuses || []
          };
          
          setState(prev => ({
            ...prev,
            messages: [...prev.messages, newMessage]
          }));
        }
        break;

      case 'message_status_update':
        if (data.messageId && data.data?.status) {
          setState(prev => ({
            ...prev,
            messages: prev.messages.map(msg =>
              msg.id === data.messageId
                ? { ...msg, status: data.data.status }
                : msg
            )
          }));
        }
        break;

      case 'message_read':
        if (data.messageId && data.data?.readStatus) {
          setState(prev => ({
            ...prev,
            messages: prev.messages.map(msg =>
              msg.id === data.messageId
                ? {
                    ...msg,
                    readStatuses: [
                      ...msg.readStatuses.filter(rs => rs.userId !== data.data.readStatus.userId),
                      data.data.readStatus
                    ]
                  }
                : msg
            )
          }));
        }
        break;

      case 'typing_start':
        if (data.userId !== user?.id && data.data?.user) {
          const typingIndicator: TypingIndicator = {
            userId: data.userId!,
            user: data.data.user,
            conversationId: config.conversationId,
            startedAt: new Date()
          };
          
          setState(prev => ({
            ...prev,
            typingUsers: [
              ...prev.typingUsers.filter(tu => tu.userId !== data.userId),
              typingIndicator
            ]
          }));
        }
        break;

      case 'typing_stop':
        if (data.userId) {
          setState(prev => ({
            ...prev,
            typingUsers: prev.typingUsers.filter(tu => tu.userId !== data.userId)
          }));
        }
        break;

      case 'user_status_update':
        if (data.data?.onlineStatus) {
          // Update user online status in conversation
          setState(prev => ({
            ...prev,
            currentConversation: prev.currentConversation ? {
              ...prev.currentConversation,
              participants: prev.currentConversation.participants.map(p =>
                p.id === data.userId
                  ? { ...p, onlineStatus: data.data.onlineStatus }
                  : p
              )
            } : undefined
          }));
        }
        break;

      default:
        console.log('Unhandled WebSocket message type:', data.type);
    }
  }, [user, config.conversationId]);

  // Fetch conversation and initial messages
  const fetchConversationData = useCallback(async () => {
    if (!config.conversationId) return;

    try {
      setState(prev => ({ ...prev, isLoading: true }));

      const [conversationResponse, messagesResponse] = await Promise.all([
        fetch(`/api/conversations/${config.conversationId}`, {
          credentials: 'include'
        }),
        fetch(`/api/conversations/${config.conversationId}/messages?limit=50`, {
          credentials: 'include'
        })
      ]);

      if (conversationResponse.ok && messagesResponse.ok) {
        const conversationData = await conversationResponse.json();
        const messagesData = await messagesResponse.json();

        setState(prev => ({
          ...prev,
          currentConversation: conversationData.data,
          messages: messagesData.data.messages || [],
          isLoading: false
        }));
      }
    } catch (error) {
      console.error('Error fetching conversation data:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'Failed to load conversation'
      }));
    }
  }, [config.conversationId]);

  // Load initial data
  useEffect(() => {
    fetchConversationData();
  }, [fetchConversationData]);

  // Send message
  const sendMessage = useCallback(async (messageData: SendMessageRequest) => {
    if (!wsRef.current?.isConnected || !user) {
      throw new Error('Not connected to chat server');
    }

    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const tempMessage: ChatMessage = {
      id: messageId,
      conversationId: config.conversationId,
      content: messageData.content,
      type: messageData.type,
      status: 'sending',
      sender: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        role: user.role as any
      },
      timestamp: new Date(),
      readStatuses: [],
      attachments: messageData.attachments ? await uploadFiles(messageData.attachments) : undefined,
      location: messageData.location,
      bookingReference: messageData.bookingId ? await fetchBookingReference(messageData.bookingId) : undefined
    };

    // Add temporary message to state
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, tempMessage]
    }));

    try {
      // Send via WebSocket
      const success = wsRef.current.send({
        type: 'send_message',
        messageId,
        conversationId: config.conversationId,
        content: messageData.content,
        messageType: messageData.type,
        replyToId: messageData.replyToId,
        metadata: messageData.metadata,
        attachments: tempMessage.attachments,
        location: messageData.location,
        bookingId: messageData.bookingId
      });

      if (!success) {
        throw new Error('Failed to send message via WebSocket');
      }

      // Update message status to sent
      setState(prev => ({
        ...prev,
        messages: prev.messages.map(msg =>
          msg.id === messageId ? { ...msg, status: 'sent' } : msg
        )
      }));

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Update message status to failed
      setState(prev => ({
        ...prev,
        messages: prev.messages.map(msg =>
          msg.id === messageId ? { ...msg, status: 'failed' } : msg
        )
      }));
      
      throw error;
    }
  }, [user, config.conversationId]);

  // Upload files
  const uploadFiles = useCallback(async (files: File[]): Promise<MessageAttachment[]> => {
    const attachments: MessageAttachment[] = [];

    for (const file of files) {
      const fileId = `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Add to upload progress
      setState(prev => ({
        ...prev,
        uploadingFiles: [
          ...prev.uploadingFiles,
          {
            fileId,
            fileName: file.name,
            progress: 0,
            status: 'uploading'
          }
        ]
      }));

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('conversationId', config.conversationId);

        const response = await fetch('/api/chat/upload', {
          method: 'POST',
          body: formData,
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const result = await response.json();
        
        attachments.push({
          id: result.data.id,
          type: file.type.startsWith('image/') ? 'image' : 'file',
          name: file.name,
          url: result.data.url,
          size: file.size,
          mimeType: file.type,
          thumbnailUrl: result.data.thumbnailUrl
        });

        // Update upload progress to completed
        setState(prev => ({
          ...prev,
          uploadingFiles: prev.uploadingFiles.map(uf =>
            uf.fileId === fileId
              ? { ...uf, progress: 100, status: 'completed' }
              : uf
          )
        }));

      } catch (error) {
        console.error('File upload error:', error);
        
        // Update upload progress to failed
        setState(prev => ({
          ...prev,
          uploadingFiles: prev.uploadingFiles.map(uf =>
            uf.fileId === fileId
              ? { ...uf, status: 'failed', error: 'Upload failed' }
              : uf
          )
        }));
      }
    }

    // Clean up completed/failed uploads after a delay
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        uploadingFiles: prev.uploadingFiles.filter(uf => uf.status === 'uploading')
      }));
    }, 5000);

    return attachments;
  }, [config.conversationId]);

  // Fetch booking reference
  const fetchBookingReference = useCallback(async (bookingId: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.data;
      }
    } catch (error) {
      console.error('Error fetching booking reference:', error);
    }
    
    return undefined;
  }, []);

  // Start typing
  const startTyping = useCallback(() => {
    if (!config.enableTypingIndicators || !wsRef.current?.isConnected) return;

    const now = Date.now();
    lastTypingTime.current = now;

    if (!state.isTyping) {
      setState(prev => ({ ...prev, isTyping: true }));
      
      wsRef.current.send({
        type: 'typing_start',
        conversationId: config.conversationId,
        userId: user?.id
      });
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      if (Date.now() - lastTypingTime.current >= 3000) {
        stopTyping();
      }
    }, 3000);
  }, [config.enableTypingIndicators, config.conversationId, user, state.isTyping]);

  // Stop typing
  const stopTyping = useCallback(() => {
    if (!state.isTyping || !wsRef.current?.isConnected) return;

    setState(prev => ({ ...prev, isTyping: false }));
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    wsRef.current.send({
      type: 'typing_stop',
      conversationId: config.conversationId,
      userId: user?.id
    });
  }, [config.conversationId, user, state.isTyping]);

  // Mark messages as read
  const markAsRead = useCallback(async (messageIds?: string[]) => {
    if (!config.enableReadReceipts || !user) return;

    const unreadMessages = state.messages.filter(msg => 
      msg.sender.id !== user.id && 
      !msg.readStatuses.some(rs => rs.userId === user.id) &&
      (!messageIds || messageIds.includes(msg.id))
    );

    if (unreadMessages.length === 0) return;

    try {
      const response = await fetch(`/api/conversations/${config.conversationId}/read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageIds: messageIds || unreadMessages.map(m => m.id)
        }),
        credentials: 'include'
      });

      if (response.ok) {
        // Send read receipt via WebSocket
        wsRef.current?.send({
          type: 'messages_read',
          conversationId: config.conversationId,
          messageIds: messageIds || unreadMessages.map(m => m.id),
          userId: user.id
        });
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }, [config.conversationId, config.enableReadReceipts, user, state.messages]);

  // Update online status
  const updateOnlineStatus = useCallback((status: OnlineStatus) => {
    if (!wsRef.current?.isConnected || !user) return;

    wsRef.current.send({
      type: 'update_status',
      userId: user.id,
      onlineStatus: status
    });
  }, [user]);

  // Clean up
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      stopTyping();
    };
  }, [stopTyping]);

  return {
    // State
    ...state,
    
    // Actions
    sendMessage,
    startTyping,
    stopTyping,
    markAsRead,
    updateOnlineStatus,
    
    // Utilities
    refreshConversation: fetchConversationData,
    isConnected: state.isConnected && wsRef.current?.isConnected || false
  };
}