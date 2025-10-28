// Export all chat-related components and types for easy importing

// Main chat system component
export { ComprehensiveChatSystem } from './comprehensive-chat-system';

// Wrapper components for different use cases
export {
  BookingChat,
  CustomerSupportChat,
  DirectChat,
  ChatWidget
} from './chat-wrapper';

// Hooks
export { useChatSystem } from '@/hooks/useChatSystem';

// Types
export type {
  ChatSystemProps,
  ChatMessage,
  ChatConversation,
  ChatUser,
  MessageAttachment,
  SendMessageRequest,
  MessageType,
  ConversationType,
  OnlineStatus,
  ChatState,
  FileUploadProgress,
  TypingIndicator,
  BookingReference,
  ChatHookConfig
} from '@/types/chat';

// Legacy components (for backward compatibility)
export { ChatInterface } from './chat-interface';
export { useChat } from '@/hooks/useChat';