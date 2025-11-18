# Guidee Chat System Documentation

## Overview

The Guidee Chat System is a comprehensive real-time messaging solution designed for the travel guide platform. It supports direct messaging between customers and guides, customer support chat, booking-related discussions, and group conversations.

## Features

### ✨ Core Features
- **Real-time messaging** with WebSocket support
- **File and image sharing** with drag-and-drop upload
- **Message read receipts** and delivery status
- **Typing indicators** for real-time interaction
- **Online status indicators** (online, away, busy, offline)
- **Reply/quote functionality** for message threading
- **Mobile-responsive design** with inline styles
- **Booking integration** for order-related discussions
- **Search functionality** within conversations
- **Participant management** for group chats
- **Auto-reconnection** with exponential backoff

### 🎯 Chat Types
1. **Direct Chat** - One-on-one messaging between users
2. **Booking Chat** - Conversation related to specific bookings
3. **Customer Support** - Professional support interface
4. **Group Chat** - Multi-participant conversations

## Installation & Setup

### 1. Dependencies
The chat system uses the following technologies:
- Next.js 14+ with App Router
- TypeScript for type safety
- WebSocket for real-time communication
- Zustand for state management
- Lucide React for icons

### 2. File Structure
```
src/
├── components/chat/
│   ├── comprehensive-chat-system.tsx   # Main chat component
│   ├── chat-wrapper.tsx               # Easy-to-use wrapper components
│   ├── chat-interface.tsx             # Legacy component
│   └── index.ts                       # Export file
├── hooks/
│   ├── useChatSystem.ts               # Enhanced chat hook
│   └── useChat.ts                     # Legacy hook
├── types/
│   └── chat.ts                        # TypeScript definitions
└── app/api/chat/
    └── upload/route.ts                # File upload API
```

## Quick Start

### Basic Usage

```tsx
import { ComprehensiveChatSystem } from '@/components/chat';

function MyPage() {
  return (
    <ComprehensiveChatSystem
      conversationId="conversation-123"
      userId="current-user-id"
      height="600px"
      enableFileSharing={true}
      enableLocationSharing={true}
      onMessageSent={(message) => {
        console.log('Message sent:', message);
      }}
      onError={(error) => {
        console.error('Chat error:', error);
      }}
    />
  );
}
```

### Specialized Components

#### Customer Support Chat
```tsx
import { CustomerSupportChat } from '@/components/chat';

function SupportPage() {
  return <CustomerSupportChat height="500px" />;
}
```

#### Booking-Related Chat
```tsx
import { BookingChat } from '@/components/chat';

function BookingPage() {
  return <BookingChat bookingId="booking-123" />;
}
```

#### Direct User Chat
```tsx
import { DirectChat } from '@/components/chat';

function UserProfile() {
  return <DirectChat otherUserId="guide-456" />;
}
```

#### Floating Chat Widget
```tsx
import { ChatWidget } from '@/components/chat';

function Layout() {
  return (
    <div>
      {/* Your page content */}
      <ChatWidget />
    </div>
  );
}
```

## Component API

### ComprehensiveChatSystem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `conversationId` | `string` | **required** | Unique conversation identifier |
| `userId` | `string` | **required** | Current user ID |
| `className` | `string` | `''` | Additional CSS classes |
| `height` | `string` | `'600px'` | Component height |
| `showHeader` | `boolean` | `true` | Show conversation header |
| `showParticipants` | `boolean` | `false` | Show participants sidebar |
| `enableFileSharing` | `boolean` | `true` | Enable file upload/sharing |
| `enableLocationSharing` | `boolean` | `true` | Enable location sharing |
| `maxFileSize` | `number` | `10MB` | Maximum file size in bytes |
| `allowedFileTypes` | `string[]` | `['image/*', 'application/pdf', 'text/*']` | Allowed MIME types |
| `onConversationUpdate` | `function` | - | Callback when conversation updates |
| `onMessageSent` | `function` | - | Callback when message is sent |
| `onError` | `function` | - | Error callback |

### useChatSystem Hook

```tsx
import { useChatSystem } from '@/hooks/useChatSystem';

function MyComponent() {
  const {
    currentConversation,
    messages,
    isLoading,
    isConnected,
    isTyping,
    uploadingFiles,
    typingUsers,
    sendMessage,
    startTyping,
    stopTyping,
    markAsRead,
    updateOnlineStatus
  } = useChatSystem({
    conversationId: 'conv-123',
    userId: 'user-456',
    enableTypingIndicators: true,
    enableReadReceipts: true,
    enableFileSharing: true
  });
  
  // Use the chat functionality
}
```

## TypeScript Support

The chat system is fully typed with comprehensive TypeScript definitions:

```tsx
import type {
  ChatMessage,
  ChatConversation,
  ChatUser,
  MessageAttachment,
  SendMessageRequest,
  OnlineStatus
} from '@/types/chat';
```

### Key Types

#### ChatMessage
```tsx
interface ChatMessage {
  id: string;
  conversationId: string;
  content?: string;
  type: MessageType;
  status: MessageStatus;
  sender: ChatUser;
  timestamp: Date;
  attachments?: MessageAttachment[];
  replyTo?: ReplyToMessage;
  readStatuses: MessageReadStatus[];
  bookingReference?: BookingReference;
}
```

#### SendMessageRequest
```tsx
interface SendMessageRequest {
  content?: string;
  type: MessageType;
  attachments?: File[];
  location?: LocationData;
  replyToId?: string;
  bookingId?: string;
  metadata?: any;
}
```

## Styling

The chat system uses inline styles for maximum compatibility and doesn't require external CSS files. All styles are mobile-responsive and follow the Guidee design system.

### Customization
You can customize the appearance by:
1. Passing custom `className` props
2. Overriding CSS classes with higher specificity
3. Using CSS-in-JS libraries
4. Modifying the component's inline styles

## File Upload

### Supported File Types
- **Images**: JPEG, PNG, GIF, WebP
- **Documents**: PDF, DOC, DOCX, TXT
- **Maximum size**: 10MB (configurable)

### Upload Process
1. User selects files via button or drag-and-drop
2. Files are validated (type, size)
3. Upload progress is shown
4. Files are stored in `/public/uploads/chat/[conversationId]/`
5. Thumbnails are generated for images
6. File metadata is attached to messages

## WebSocket Integration

### Connection Management
- Auto-connect on component mount
- Heartbeat mechanism (30-second intervals)
- Auto-reconnection with exponential backoff
- Graceful degradation when offline

### Message Types
- `message` - New message received
- `typing_start/stop` - Typing indicators
- `user_status_update` - Online status changes
- `message_read` - Read receipt updates
- `message_status_update` - Delivery status updates

## Database Integration

The chat system integrates with the existing Prisma schema:

### Required Models
- `Conversation` - Chat conversations
- `Message` - Individual messages
- `MessageReadStatus` - Read receipts
- `User` - User information

### API Endpoints
- `GET /api/conversations` - List conversations
- `GET /api/conversations/[id]` - Get conversation details
- `GET /api/conversations/[id]/messages` - Get messages
- `POST /api/conversations/[id]/messages` - Send message
- `POST /api/conversations/[id]/read` - Mark messages as read
- `POST /api/chat/upload` - Upload files

## Performance Considerations

### Optimizations
- **Message pagination** - Load messages in chunks
- **Lazy loading** - Components load on demand
- **File compression** - Images are optimized
- **Connection pooling** - Efficient WebSocket management
- **Memory management** - Cleanup on component unmount

### Scalability
- Supports thousands of concurrent connections
- Horizontal scaling with load balancers
- Database indexing for fast message retrieval
- CDN integration for file delivery

## Security

### File Upload Security
- MIME type validation
- File size restrictions
- Virus scanning (recommended)
- Access control based on conversation membership

### Message Security
- User authentication required
- Conversation access control
- Input sanitization
- XSS protection

## Testing

### Component Testing
```tsx
import { render, screen } from '@testing-library/react';
import { ComprehensiveChatSystem } from '@/components/chat';

test('renders chat system', () => {
  render(
    <ComprehensiveChatSystem 
      conversationId="test-conv"
      userId="test-user"
    />
  );
  
  expect(screen.getByPlaceholderText('輸入訊息...')).toBeInTheDocument();
});
```

### Hook Testing
```tsx
import { renderHook } from '@testing-library/react';
import { useChatSystem } from '@/hooks/useChatSystem';

test('chat hook initializes correctly', () => {
  const { result } = renderHook(() => 
    useChatSystem({
      conversationId: 'test-conv',
      userId: 'test-user'
    })
  );
  
  expect(result.current.isLoading).toBe(true);
});
```

## Troubleshooting

### Common Issues

#### WebSocket Connection Failed
- Check if WebSocket server is running
- Verify firewall settings
- Ensure HTTPS for production

#### File Upload Not Working
- Check file size limits
- Verify upload directory permissions
- Confirm MIME type support

#### Messages Not Appearing
- Check user authentication
- Verify conversation access
- Check network connectivity

#### Styling Issues
- Ensure no CSS conflicts
- Check responsive breakpoints
- Verify inline style overrides

### Debug Mode
Enable debug logging:
```tsx
<ComprehensiveChatSystem
  conversationId="conv-123"
  userId="user-456"
  onError={(error) => {
    console.error('Chat Error:', error);
  }}
/>
```

## Examples

Visit `/chat/demo` in your application to see all chat components in action with interactive examples.

## Contributing

When contributing to the chat system:
1. Follow TypeScript best practices
2. Maintain mobile responsiveness
3. Add comprehensive error handling
4. Include tests for new features
5. Update documentation

## License

This chat system is part of the Guidee platform and follows the same licensing terms.