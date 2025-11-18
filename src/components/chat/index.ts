/**
 * Chat Components Index
 *
 * Core Systems:
 * - ComprehensiveChatSystem: Feature-rich chat system with files, search, group support
 * - ChatInterface: Lightweight peer-to-peer chat (used by /chat page)
 *
 * Convenience Wrappers:
 * - BookingChat: Pre-configured chat for booking-specific conversations
 * - CustomerSupportChat: Pre-configured support chat with custom headers
 * - DirectChat: Direct user-to-user messaging
 * - ChatWidget: Floating widget for chat access
 */

// Core chat systems
export { ComprehensiveChatSystem } from './comprehensive-chat-system';
export { ChatInterface } from './chat-interface';

// Convenience wrapper components for different use cases
export {
  BookingChat,
  CustomerSupportChat,
  DirectChat,
  ChatWidget
} from './chat-wrapper';

// Hooks
export { useChatSystem } from '@/hooks/useChatSystem';
export { useChat } from '@/hooks/useChat';

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