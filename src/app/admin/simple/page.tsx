'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Users, MapPin, Calendar, Star, BarChart3, TrendingUp, DollarSign } from 'lucide-react'

export default function SimpleAdmin() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      {/* 頁面標題 */}
      <div className="bg-gradient-to-r from-white/90 to-blue-50/50 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-slate-200/50 mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
          ✅ 現代化管理後台 - 簡化版本
        </h1>
        <p className="text-slate-600 mt-3 text-lg">
          如果您看到這個現代化設計，說明樣式已正確載入！
        </p>
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
          <p className="text-green-800 font-medium">
            🎉 現代化設計測試成功！包含漸變背景、現代卡片和專業樣式。
          </p>
        </div>
      </div>

      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="group bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">總用戶數</p>
                <p className="text-4xl font-bold mt-2">1,234</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">+15% 本月增長</span>
                </div>
              </div>
              <Users className="h-12 w-12 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="group bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium">總服務數</p>
                <p className="text-4xl font-bold mt-2">567</p>
                <div className="flex items-center mt-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">89% 已審核</span>
                </div>
              </div>
              <MapPin className="h-12 w-12 text-emerald-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="group bg-gradient-to-br from-violet-500 via-violet-600 to-violet-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-violet-100 text-sm font-medium">總訂單數</p>
                <p className="text-4xl font-bold mt-2">890</p>
                <div className="flex items-center mt-2">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="text-sm">今日 +23</span>
                </div>
              </div>
              <Calendar className="h-12 w-12 text-violet-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="group bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">總營收</p>
                <p className="text-4xl font-bold mt-2">NT$ 456,789</p>
                <div className="flex items-center mt-2">
                  <Star className="h-4 w-4 mr-1 fill-current" />
                  <span className="text-sm">平均 4.8 星</span>
                </div>
              </div>
              <DollarSign className="h-12 w-12 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 測試信息 */}
      <Card className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <CardContent className="p-8">
          <div className="text-center">
            <BarChart3 className="h-16 w-16 mx-auto mb-4 text-blue-400" />
            <h2 className="text-2xl font-bold mb-4">現代化設計測試頁面</h2>
            <p className="text-slate-300 mb-6">
              這個頁面展示了新的管理後台設計，包含漸變背景、現代卡片和動畫效果。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-600/20 p-4 rounded-xl">
                <h3 className="font-bold text-blue-300">✨ 漸變背景</h3>
                <p className="text-sm text-blue-100">現代化的漸變色彩方案</p>
              </div>
              <div className="bg-green-600/20 p-4 rounded-xl">
                <h3 className="font-bold text-green-300">🎨 專業卡片</h3>
                <p className="text-sm text-green-100">精美的卡片設計和陰影</p>
              </div>
              <div className="bg-purple-600/20 p-4 rounded-xl">
                <h3 className="font-bold text-purple-300">⚡ 流暢動畫</h3>
                <p className="text-sm text-purple-100">hover 效果和轉場動畫</p>
              </div>
            </div>
            <div className="mt-8 space-x-4">
              <button 
                onClick={() => window.location.href = '/admin'}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-all"
              >
                訪問完整管理後台
              </button>
              <button 
                onClick={() => window.location.href = '/admin/login'}
                className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg transition-all"
              >
                管理員登入
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}