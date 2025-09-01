import React from 'react';
import GuidesList from '@/components/guides/guides-list';

export const metadata = {
  title: '尋找在地嚮導 | Guidee',
  description: '探索專業在地嚮導，享受個人化旅遊體驗',
};

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              尋找完美的在地嚮導
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              與經驗豐富的在地專家一起探索世界，享受個人化的旅遊體驗
            </p>
          </div>
        </div>
      </div>

      {/* Guides List */}
      <GuidesList />
    </div>
  );
}