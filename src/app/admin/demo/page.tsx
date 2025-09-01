'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  MapPin, 
  Calendar, 
  Star, 
  BarChart3, 
  Shield,
  MessageCircle,
  TrendingUp,
  DollarSign,
  CheckCircle
} from 'lucide-react'

export default function AdminDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-white/90 to-blue-50/50 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-slate-200/50 m-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
          🎉 現代化管理後台演示
        </h1>
        <p className="text-slate-600 mt-3 text-lg">
          恭喜！現代化設計已成功應用。這是管理後台的新外觀。
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 m-8">
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
                  <CheckCircle className="h-4 w-4 mr-1" />
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
                  <span className="text-sm">平均 4.8 星評價</span>
                </div>
              </div>
              <DollarSign className="h-12 w-12 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 m-8">
        <Card className="group cursor-pointer hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-white to-blue-50/50 border border-blue-100 hover:border-blue-200">
          <CardContent className="p-8">
            <div className="flex items-center mb-6">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <Users className="h-7 w-7 text-white" />
              </div>
              <div className="ml-5">
                <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-700 transition-colors">用戶管理</h3>
                <p className="text-slate-600 mt-1 text-sm">管理平台所有註冊用戶</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group cursor-pointer hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-white to-emerald-50/50 border border-emerald-100 hover:border-emerald-200">
          <CardContent className="p-8">
            <div className="flex items-center mb-6">
              <div className="p-4 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <MapPin className="h-7 w-7 text-white" />
              </div>
              <div className="ml-5">
                <h3 className="text-xl font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">服務管理</h3>
                <p className="text-slate-600 mt-1 text-sm">審核和管理地陪服務</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group cursor-pointer hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-white to-purple-50/50 border border-purple-100 hover:border-purple-200">
          <CardContent className="p-8">
            <div className="flex items-center mb-6">
              <div className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <MessageCircle className="h-7 w-7 text-white" />
              </div>
              <div className="ml-5">
                <h3 className="text-xl font-bold text-slate-800 group-hover:text-purple-700 transition-colors">客服對話</h3>
                <p className="text-slate-600 mt-1 text-sm">管理用戶諮詢和支援</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <div className="m-8">
        <Card className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">🎯 現代化設計成功!</h2>
                <p className="text-slate-300">
                  管理後台已升級為現代化設計，包含漸變背景、動畫效果和專業視覺風格。
                </p>
              </div>
              <div className="flex space-x-4">
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => window.location.href = '/admin/login'}>
                  前往登入
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900" onClick={() => window.location.href = '/admin'}>
                  返回主頁
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}