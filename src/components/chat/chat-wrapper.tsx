'use client';

import React from 'react';
import { ComprehensiveChatSystem } from './comprehensive-chat-system';
import { ChatSystemProps } from '@/types/chat';

// Easy-to-use wrapper components for different chat contexts

interface BookingChatProps {
  bookingId: string;
  className?: string;
  height?: string;
}

interface CustomerSupportChatProps {
  className?: string;
  height?: string;
}

interface DirectChatProps {
  otherUserId: string;
  className?: string;
  height?: string;
}

// Booking-related chat
export function BookingChat({ bookingId, className, height }: BookingChatProps) {
  // This would need to fetch or derive the conversation ID from the booking
  // For now, we'll use a placeholder
  const conversationId = `booking-${bookingId}`;
  
  return (
    <ComprehensiveChatSystem
      conversationId={conversationId}
      userId={""} // Will be filled by the component from useAuth
      className={className}
      height={height}
      showHeader={true}
      enableFileSharing={true}
      enableLocationSharing={true}
      onConversationUpdate={(conversation) => {
        console.log('Booking chat conversation updated:', conversation);
      }}
      onMessageSent={(message) => {
        console.log('Booking chat message sent:', message);
      }}
      onError={(error) => {
        console.error('Booking chat error:', error);
      }}
    />
  );
}

// Customer support chat
export function CustomerSupportChat({ className, height }: CustomerSupportChatProps) {
  // Customer support chat typically has a predefined conversation ID or creates one
  const conversationId = 'support'; // This would be handled by the backend
  
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      overflow: 'hidden'
    }}>
      {/* Support chat header */}
      <div style={{
        backgroundColor: '#3b82f6',
        color: 'white',
        padding: '1rem',
        fontSize: '1rem',
        fontWeight: '600'
      }}>
        客服支援
      </div>
      
      <ComprehensiveChatSystem
        conversationId={conversationId}
        userId={""} // Will be filled by the component from useAuth
        className={className}
        height={height || '500px'}
        showHeader={false} // We have our own header
        enableFileSharing={true}
        enableLocationSharing={false}
        allowedFileTypes={['image/*', 'application/pdf']}
        maxFileSize={5 * 1024 * 1024} // 5MB for support
        onConversationUpdate={(conversation) => {
          console.log('Support chat conversation updated:', conversation);
        }}
        onMessageSent={(message) => {
          console.log('Support chat message sent:', message);
        }}
        onError={(error) => {
          console.error('Support chat error:', error);
        }}
      />
    </div>
  );
}

// Direct chat between two users
export function DirectChat({ otherUserId, className, height }: DirectChatProps) {
  // Direct chat conversation ID would be derived from both user IDs
  const conversationId = `direct-${otherUserId}`;
  
  return (
    <ComprehensiveChatSystem
      conversationId={conversationId}
      userId={""} // Will be filled by the component from useAuth
      className={className}
      height={height}
      showHeader={true}
      showParticipants={false}
      enableFileSharing={true}
      enableLocationSharing={true}
      onConversationUpdate={(conversation) => {
        console.log('Direct chat conversation updated:', conversation);
      }}
      onMessageSent={(message) => {
        console.log('Direct chat message sent:', message);
      }}
      onError={(error) => {
        console.error('Direct chat error:', error);
      }}
    />
  );
}

// Mobile-optimized chat widget (for bottom-right corner)
export function ChatWidget() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [hasUnread, setHasUnread] = React.useState(false);

  if (!isOpen) {
    return (
      <div style={{
        position: 'fixed',
        bottom: '1rem',
        right: '1rem',
        zIndex: 1000
      }}>
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: '3.5rem',
            height: '3.5rem',
            backgroundColor: '#3b82f6',
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.2s',
            position: 'relative'
          }}
          className="hover:bg-blue-700 hover:scale-110"
        >
          <svg
            style={{ width: '1.5rem', height: '1.5rem', color: 'white' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          
          {hasUnread && (
            <div style={{
              position: 'absolute',
              top: '0.25rem',
              right: '0.25rem',
              width: '0.75rem',
              height: '0.75rem',
              backgroundColor: '#ef4444',
              borderRadius: '50%',
              border: '2px solid white'
            }} />
          )}
        </button>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '1rem',
      right: '1rem',
      width: '350px',
      height: '500px',
      zIndex: 1000,
      backgroundColor: 'white',
      borderRadius: '0.75rem',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      overflow: 'hidden'
    }}>
      {/* Widget header */}
      <div style={{
        backgroundColor: '#3b82f6',
        color: 'white',
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ fontSize: '1rem', fontWeight: '600' }}>Guidee 客服</div>
          <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>我們在線上為您服務</div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            width: '2rem',
            height: '2rem',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}
          className="hover:bg-blue-700"
        >
          <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <CustomerSupportChat height="400px" />
    </div>
  );
}

// Export all components
export {
  ComprehensiveChatSystem
};