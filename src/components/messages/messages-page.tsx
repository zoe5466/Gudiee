'use client';

import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import ConversationList from './conversation-list';
import ChatInterface from './chat-interface';

interface MessagesPageProps {
  initialConversationId?: string;
  className?: string;
}

export default function MessagesPage({ 
  initialConversationId, 
  className = '' 
}: MessagesPageProps) {
  const [selectedConversationId, setSelectedConversationId] = useState<string | undefined>(
    initialConversationId
  );
  const [showNewConversationModal, setShowNewConversationModal] = useState(false);

  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversationId(conversationId);
  };

  const handleNewConversation = () => {
    setShowNewConversationModal(true);
  };

  return (
    <div className={`flex h-screen bg-gray-50 ${className}`}>
      {/* 對話列表 - 桌面版固定顯示，手機版可切換 */}
      <div className={`w-80 border-r border-gray-200 ${
        selectedConversationId ? 'hidden lg:block' : 'block'
      }`}>
        <ConversationList
          selectedConversationId={selectedConversationId}
          onConversationSelect={handleConversationSelect}
          onNewConversation={handleNewConversation}
          className="h-full"
        />
      </div>

      {/* 聊天介面 */}
      <div className={`flex-1 ${
        selectedConversationId ? 'block' : 'hidden lg:block'
      }`}>
        {selectedConversationId ? (
          <ChatInterface 
            conversationId={selectedConversationId}
            className="h-full"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <MessageCircle className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              歡迎使用訊息功能
            </h2>
            <p className="text-gray-600 mb-6 max-w-md">
              與嚮導和旅行者保持聯繫，分享您的旅行經驗和建議。
            </p>
            <div className="space-y-4 text-sm text-gray-500">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>即時訊息通知</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>檔案和圖片分享</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>安全的端到端加密</span>
              </div>
            </div>
            <button
              onClick={handleNewConversation}
              className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              開始新對話
            </button>
          </div>
        )}
      </div>

      {/* 新對話模態框 */}
      {showNewConversationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">開始新對話</h3>
              <p className="text-gray-600 mb-6">
                此功能正在開發中，敬請期待。
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowNewConversationModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                >
                  關閉
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}