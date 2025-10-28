'use client';

import React, { useState } from 'react';
import { 
  ComprehensiveChatSystem,
  BookingChat,
  CustomerSupportChat,
  DirectChat,
  ChatWidget
} from '@/components/chat/chat-wrapper';

export default function ChatDemoPage() {
  const [activeDemo, setActiveDemo] = useState<'comprehensive' | 'booking' | 'support' | 'direct' | 'widget'>('comprehensive');
  const [showWidget, setShowWidget] = useState(false);

  const demoOptions = [
    { id: 'comprehensive', label: '完整聊天系統', description: '包含所有功能的聊天介面' },
    { id: 'booking', label: '預訂聊天', description: '與特定預訂相關的聊天' },
    { id: 'support', label: '客服聊天', description: '客服支援聊天介面' },
    { id: 'direct', label: '直接聊天', description: '兩個用戶之間的直接對話' },
    { id: 'widget', label: '聊天小工具', description: '浮動聊天小工具' }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '1rem'
          }}>
            Guidee 聊天系統展示
          </h1>
          <p style={{
            fontSize: '1.125rem',
            color: '#6b7280',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            體驗我們全功能的即時聊天系統，支援檔案分享、讀取回條、輸入指示器等功能
          </p>
        </div>

        {/* Demo selector */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {demoOptions.map(option => (
            <button
              key={option.id}
              onClick={() => {
                if (option.id === 'widget') {
                  setShowWidget(!showWidget);
                } else {
                  setActiveDemo(option.id as any);
                  setShowWidget(false);
                }
              }}
              style={{
                padding: '1.5rem',
                backgroundColor: activeDemo === option.id || (option.id === 'widget' && showWidget) ? '#3b82f6' : 'white',
                color: activeDemo === option.id || (option.id === 'widget' && showWidget) ? 'white' : '#374151',
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
              }}
              className="hover:shadow-md hover:scale-105"
            >
              <div style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                marginBottom: '0.5rem'
              }}>
                {option.label}
              </div>
              <div style={{
                fontSize: '0.875rem',
                opacity: 0.8
              }}>
                {option.description}
              </div>
            </button>
          ))}
        </div>

        {/* Demo content */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          minHeight: '600px'
        }}>
          {activeDemo === 'comprehensive' && (
            <div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '1rem'
              }}>
                完整聊天系統
              </h2>
              <p style={{
                color: '#6b7280',
                marginBottom: '2rem'
              }}>
                這是包含所有功能的聊天系統，支援即時訊息、檔案分享、位置分享、讀取回條、輸入指示器等功能。
              </p>
              
              <ComprehensiveChatSystem
                conversationId="demo-conversation"
                userId="current-user"
                height="500px"
                showHeader={true}
                showParticipants={true}
                enableFileSharing={true}
                enableLocationSharing={true}
                onConversationUpdate={(conversation) => {
                  console.log('Conversation updated:', conversation);
                }}
                onMessageSent={(message) => {
                  console.log('Message sent:', message);
                }}
                onError={(error) => {
                  console.error('Chat error:', error);
                }}
              />
            </div>
          )}

          {activeDemo === 'booking' && (
            <div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '1rem'
              }}>
                預訂聊天
              </h2>
              <p style={{
                color: '#6b7280',
                marginBottom: '2rem'
              }}>
                與特定預訂相關的聊天，可以分享預訂詳情和進行相關討論。
              </p>
              
              <BookingChat
                bookingId="demo-booking-123"
                height="500px"
              />
            </div>
          )}

          {activeDemo === 'support' && (
            <div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '1rem'
              }}>
                客服聊天
              </h2>
              <p style={{
                color: '#6b7280',
                marginBottom: '2rem'
              }}>
                專門設計的客服聊天介面，提供專業的客戶支援體驗。
              </p>
              
              <CustomerSupportChat height="500px" />
            </div>
          )}

          {activeDemo === 'direct' && (
            <div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '1rem'
              }}>
                直接聊天
              </h2>
              <p style={{
                color: '#6b7280',
                marginBottom: '2rem'
              }}>
                兩個用戶之間的直接對話，適用於私人訊息交換。
              </p>
              
              <DirectChat
                otherUserId="demo-user-456"
                height="500px"
              />
            </div>
          )}

          {activeDemo === 'widget' && !showWidget && (
            <div style={{ textAlign: 'center', paddingTop: '4rem' }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '1rem'
              }}>
                聊天小工具
              </h2>
              <p style={{
                color: '#6b7280',
                marginBottom: '2rem'
              }}>
                點擊右下角的聊天按鈕來開啟浮動聊天小工具。
              </p>
              <div style={{
                fontSize: '3rem',
                color: '#e5e7eb'
              }}>
                💬
              </div>
            </div>
          )}
        </div>

        {/* Features list */}
        <div style={{
          marginTop: '3rem',
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '1.5rem'
          }}>
            功能特色
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            {[
              {
                title: '即時訊息',
                description: '透過 WebSocket 實現的即時雙向通訊',
                icon: '💬'
              },
              {
                title: '檔案分享',
                description: '支援圖片、文件等多種檔案類型上傳分享',
                icon: '📎'
              },
              {
                title: '讀取回條',
                description: '顯示訊息的發送、送達和已讀狀態',
                icon: '✅'
              },
              {
                title: '輸入指示器',
                description: '即時顯示其他用戶正在輸入的狀態',
                icon: '⌨️'
              },
              {
                title: '在線狀態',
                description: '顯示用戶的在線、離線、忙碌等狀態',
                icon: '🟢'
              },
              {
                title: '預訂整合',
                description: '與預訂系統整合，支援預訂相關討論',
                icon: '📅'
              },
              {
                title: '回復功能',
                description: '支援引用回復和訊息串接',
                icon: '↩️'
              },
              {
                title: '多人聊天',
                description: '支援群組聊天和參與者管理',
                icon: '👥'
              }
            ].map((feature, index) => (
              <div key={index} style={{
                padding: '1rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                backgroundColor: '#f9fafb'
              }}>
                <div style={{
                  fontSize: '2rem',
                  marginBottom: '0.5rem'
                }}>
                  {feature.icon}
                </div>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '0.25rem'
                }}>
                  {feature.title}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>
                  {feature.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Usage instructions */}
        <div style={{
          marginTop: '3rem',
          backgroundColor: '#f0f9ff',
          borderRadius: '1rem',
          padding: '2rem',
          border: '1px solid #e0f2fe'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#0c4a6e',
            marginBottom: '1rem'
          }}>
            使用說明
          </h3>
          
          <div style={{
            color: '#0369a1',
            lineHeight: '1.6'
          }}>
            <p style={{ marginBottom: '1rem' }}>
              <strong>基本使用：</strong>在您的 React 組件中導入相應的聊天組件並傳入必要的 props。
            </p>
            
            <pre style={{
              backgroundColor: '#1e293b',
              color: '#e2e8f0',
              padding: '1rem',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              overflow: 'auto',
              marginBottom: '1rem'
            }}>
{`import { ComprehensiveChatSystem } from '@/components/chat/chat-wrapper';

function MyComponent() {
  return (
    <ComprehensiveChatSystem
      conversationId="your-conversation-id"
      userId="current-user-id"
      height="600px"
      enableFileSharing={true}
      onMessageSent={(message) => {
        console.log('Message sent:', message);
      }}
    />
  );
}`}
            </pre>
            
            <p>
              所有聊天組件都支援自定義樣式、高度調整和豐富的回調函數，讓您可以完全整合到現有的應用程式中。
            </p>
          </div>
        </div>
      </div>

      {/* Chat Widget */}
      {showWidget && <ChatWidget />}
    </div>
  );
}