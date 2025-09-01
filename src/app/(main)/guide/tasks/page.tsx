import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '即時任務版 | Guidee',
  description: '瀏覽和接取地陪任務',
};

export default function GuideTasksPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* 頁面標題 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">即時任務版</h1>
          <p className="text-gray-600">發現適合您的地陪任務</p>
        </div>

        {/* 搜尋篩選欄 */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="搜尋地點..."
              className="px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
            />
            <input
              type="date"
              className="px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
            />
            <select className="px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all">
              <option>價格範圍</option>
              <option>NT$ 500-1000</option>
              <option>NT$ 1000-2000</option>
              <option>NT$ 2000+</option>
            </select>
            <select className="px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all">
              <option>人數</option>
              <option>1-2 人</option>
              <option>3-5 人</option>
              <option>6+ 人</option>
            </select>
          </div>
        </div>

        {/* 任務列表 */}
        <div className="space-y-4">
          <div className="text-center py-12 text-gray-500 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <p className="text-lg">任務列表功能開發中...</p>
            <p className="text-sm mt-2">即將為您呈現豐富的地陪任務</p>
          </div>
        </div>
      </div>
    </div>
  );
}