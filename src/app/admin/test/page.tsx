'use client'

export default function AdminTest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600">
      <div className="container mx-auto p-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-4xl font-bold text-purple-800 mb-4">
            🚀 現代化管理後台測試頁面
          </h1>
          <p className="text-gray-700 text-lg mb-6">
            如果您看到這個頁面，說明現代化設計已成功加載！
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-6 rounded-xl text-white">
              <h3 className="font-bold text-xl mb-2">功能 1</h3>
              <p>現代化卡片設計</p>
            </div>
            <div className="bg-gradient-to-r from-green-400 to-green-600 p-6 rounded-xl text-white">
              <h3 className="font-bold text-xl mb-2">功能 2</h3>
              <p>漂亮的漸變效果</p>
            </div>
            <div className="bg-gradient-to-r from-purple-400 to-purple-600 p-6 rounded-xl text-white">
              <h3 className="font-bold text-xl mb-2">功能 3</h3>
              <p>專業的視覺風格</p>
            </div>
          </div>
          <div className="mt-8">
            <a 
              href="/admin" 
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
            >
              返回管理後台主頁
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}