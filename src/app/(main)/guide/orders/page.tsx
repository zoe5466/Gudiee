import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '訂單紀錄 | Guidee',
  description: '查看您的服務紀錄和收入統計',
};

export default function GuideOrdersPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* 頁面標題 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">訂單紀錄</h1>
          <p className="text-gray-600">追蹤您的服務紀錄和收入狀況</p>
        </div>

        {/* 篩選選項 */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">
          <div className="flex flex-wrap gap-4">
            <input
              type="date"
              className="px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
            />
            <input
              type="date"
              className="px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
            />
            <select className="px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all">
              <option>所有狀態</option>
              <option>已完成</option>
              <option>進行中</option>
              <option>已取消</option>
            </select>
            <select className="px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all">
              <option>所有評分</option>
              <option>5 星</option>
              <option>4 星以上</option>
              <option>3 星以上</option>
            </select>
          </div>
        </div>

        {/* 訂單列表 */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">訂單紀錄功能開發中...</p>
            <p className="text-sm mt-2">即將為您呈現詳細的服務紀錄</p>
          </div>
        </div>
      </div>
    </div>
  );
}