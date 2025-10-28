// Enhanced Chat System Types
// Comprehensive type definitions for the Guidee chat system supporting real-time messaging,
// file sharing, read receipts, and booking integration

export type ConversationType = 'DIRECT' | 'GROUP' | 'CUSTOMER_SUPPORT';
export type MessageType = 'TEXT' | 'IMAGE' | 'FILE' | 'LOCATION' | 'SYSTEM' | 'BOOKING_UPDATE';
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
export type UserRole = 'customer' | 'guide' | 'admin';
export type OnlineStatus = 'online' | 'offline' | 'away' | 'busy';

// Base User interface for chat participants
export interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  role: UserRole;
  onlineStatus?: OnlineStatus;
  lastSeen?: Date;
}

// File attachment interface
export interface MessageAttachment {
  id: string;
  type: 'image' | 'file' | 'audio' | 'video';
  name: string;
  url: string;
  size: number;
  mimeType: string;
  thumbnailUrl?: string; // For images and videos
  duration?: number; // For audio and video files
}

// Location data interface
export interface LocationData {
  latitude: number;
  longitude: number;
  name?: string;
  address?: string;
}

// Booking reference for chat integration
export interface BookingReference {
  id: string;
  orderNumber: string;
  serviceName: string;
  serviceImage?: string;
  date: string;
  status: string;
  totalAmount: number;
  currency: string;
}

// Message read status
export interface MessageReadStatus {
  userId: string;
  user: ChatUser;
  readAt: Date;
}

// Reply/Quote message reference
export interface ReplyToMessage {
  id: string;
  content?: string;
  sender: ChatUser;
  type: MessageType;
  attachments?: MessageAttachment[];
}

// Enhanced message interface
export interface ChatMessage {
  id: string;
  conversationId: string;
  content?: string;
  type: MessageType;
  status: MessageStatus;
  sender: ChatUser;
  timestamp: Date;
  editedAt?: Date;
  deletedAt?: Date;
  
  // Attachments and media
  attachments?: MessageAttachment[];
  
  // Location data
  location?: LocationData;
  
  // Reply/Quote functionality
  replyTo?: ReplyToMessage;
  
  // Read receipts
  readStatuses: MessageReadStatus[];
  
  // Booking integration
  bookingReference?: BookingReference;
  
  // System message data
  systemEventType?: string;
  systemEventData?: any;
  
  // Message metadata
  metadata?: {
    isEdited?: boolean;
    isForwarded?: boolean;
    forwardedFrom?: ChatUser;
    reactions?: Array<{
      emoji: string;
      users: ChatUser[];
      count: number;
    }>;
  };
}

// Typing indicator
export interface TypingIndicator {
  userId: string;
  user: ChatUser;
  conversationId: string;
  startedAt: Date;
}

// Conversation participant with permissions
export interface ConversationParticipant extends ChatUser {
  joinedAt: Date;
  permissions?: {
    canSendMessages: boolean;
    canAddParticipants: boolean;
    canRemoveParticipants: boolean;
    canEditConversation: boolean;
  };
}

// Enhanced conversation interface
export interface ChatConversation {
  id: string;
  type: ConversationType;
  title?: string;
  description?: string;
  avatar?: string;
  
  // Participants
  participants: ConversationParticipant[];
  createdBy: string;
  
  // Message tracking
  lastMessage?: ChatMessage;
  lastActivityAt: Date;
  messageCount: number;
  
  // Unread counts per participant
  unreadCounts: Record<string, number>;
  
  // Conversation settings
  settings?: {
    isArchived: boolean;
    isMuted: boolean;
    mutedUntil?: Date;
    allowFileSharing: boolean;
    allowLocationSharing: boolean;
    retentionDays?: number;
  };
  
  // Booking integration
  bookingId?: string;
  booking?: BookingReference;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// File upload progress
export interface FileUploadProgress {
  fileId: string;
  fileName: string;
  progress: number; // 0-100
  status: 'uploading' | 'completed' | 'failed';
  error?: string;
}

// Send message request
export interface SendMessageRequest {
  content?: string;
  type: MessageType;
  attachments?: File[];
  location?: LocationData;
  replyToId?: string;
  bookingId?: string;
  metadata?: any;
}

// Chat state management
export interface ChatState {
  // Current conversation
  currentConversation?: ChatConversation;
  messages: ChatMessage[];
  
  // UI state
  isLoading: boolean;
  isConnected: boolean;
  isTyping: boolean;
  
  // File uploads
  uploadingFiles: FileUploadProgress[];
  
  // Typing indicators
  typingUsers: TypingIndicator[];
  
  // Errors
  error?: string;
  connectionError?: string;
}

// Chat events for WebSocket
export type ChatEventType = 
  | 'message_sent'
  | 'message_received' 
  | 'message_read'
  | 'typing_start'
  | 'typing_stop'
  | 'user_online'
  | 'user_offline'
  | 'conversation_updated'
  | 'participant_added'
  | 'participant_removed';

export interface ChatEvent {
  type: ChatEventType;
  conversationId: string;
  userId: string;
  data: any;
  timestamp: Date;
}

// Chat hook configuration
export interface ChatHookConfig {
  conversationId: string;
  userId: string;
  enableTypingIndicators?: boolean;
  enableReadReceipts?: boolean;
  enableFileSharing?: boolean;
  autoReconnect?: boolean;
  heartbeatInterval?: number;
}

// WebSocket message format
export interface WebSocketMessage {
  type: string;
  conversationId?: string;
  messageId?: string;
  userId?: string;
  data?: any;
  timestamp?: string;
}

// Chat component props
export interface ChatSystemProps {
  conversationId: string;
  userId: string;
  className?: string;
  height?: string;
  showHeader?: boolean;
  showParticipants?: boolean;
  enableFileSharing?: boolean;
  enableLocationSharing?: boolean;
  maxFileSize?: number; // in bytes
  allowedFileTypes?: string[];
  onConversationUpdate?: (conversation: ChatConversation) => void;
  onMessageSent?: (message: ChatMessage) => void;
  onError?: (error: string) => void;
}

// API response types
export interface ChatAPIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ConversationListResponse extends ChatAPIResponse {
  data?: {
    conversations: ChatConversation[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface MessagesResponse extends ChatAPIResponse {
  data?: {
    messages: ChatMessage[];
    conversation: ChatConversation;
    hasMore: boolean;
    nextCursor?: string;
  };
}

// Search and filter types
export interface MessageSearchParams {
  query: string;
  conversationId?: string;
  senderId?: string;
  messageType?: MessageType;
  startDate?: Date;
  endDate?: Date;
  hasAttachments?: boolean;
}

export interface ConversationFilter {
  type?: ConversationType;
  hasUnread?: boolean;
  isArchived?: boolean;
  participantId?: string;
  bookingId?: string;
}

// Notification preferences
export interface ChatNotificationSettings {
  enabled: boolean;
  sound: boolean;
  desktop: boolean;
  mobile: boolean;
  email: boolean;
  quietHours?: {
    enabled: boolean;
    startTime: string; // HH:mm format
    endTime: string;
  };
  mutedConversations: string[];
}