'use client';

import { useState } from 'react';
import { TrendingUp, Users, DollarSign, Calendar, BarChart3, PieChart, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');

  const stats = [
    {
      title: '總用戶數',
      value: '12,543',
      change: '+12.3%',
      trend: 'up',
      icon: Users,
      color: 'blue'
    },
    {
      title: '總收入',
      value: 'NT$ 1,234,567',
      change: '+8.7%',
      trend: 'up',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: '完成訂單',
      value: '3,456',
      change: '+15.2%',
      trend: 'up',
      icon: Calendar,
      color: 'purple'
    },
    {
      title: '活躍地陪',
      value: '234',
      change: '-2.1%',
      trend: 'down',
      icon: Activity,
      color: 'orange'
    }
  ];

  const recentActivities = [
    { id: 1, action: '新用戶註冊', user: '張小明', time: '2 分鐘前' },
    { id: 2, action: 'KYC 申請提交', user: '李小美', time: '5 分鐘前' },
    { id: 3, action: '訂單完成', user: '王大明', time: '10 分鐘前' },
    { id: 4, action: '地陪認證通過', user: '陳小華', time: '15 分鐘前' },
    { id: 5, action: '客服問題回覆', user: '林小芳', time: '20 分鐘前' }
  ];

  const topGuides = [
    { id: 1, name: '張專業', orders: 45, rating: 4.9, revenue: 'NT$ 156,000' },
    { id: 2, name: '李導遊', orders: 38, rating: 4.8, revenue: 'NT$ 142,000' },
    { id: 3, name: '王地陪', orders: 32, rating: 4.7, revenue: 'NT$ 128,000' },
    { id: 4, name: '陳服務', orders: 28, rating: 4.6, revenue: 'NT$ 98,000' },
    { id: 5, name: '林嚮導', orders: 25, rating: 4.5, revenue: 'NT$ 87,000' }
  ];

  return (
    <div className="min-h-screen bg-[#cfdbe9] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">數據分析</h1>
              <p className="mt-2 text-gray-600">平台營運數據總覽</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7d">過去 7 天</option>
                <option value="30d">過去 30 天</option>
                <option value="90d">過去 90 天</option>
                <option value="1y">過去一年</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
                    <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  <div className={`flex items-center text-sm ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.trend === 'up' ? (
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 mr-1" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Chart Placeholder */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">收入趨勢</h2>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="h-64 bg-[#cfdbe9] rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">圖表數據加載中...</p>
                <p className="text-sm text-gray-400 mt-1">需要整合圖表庫如 Chart.js 或 Recharts</p>
              </div>
            </div>
          </div>

          {/* User Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">用戶分布</h2>
              <PieChart className="w-5 h-5 text-gray-400" />
            </div>
            <div className="h-64 bg-[#cfdbe9] rounded-lg flex items-center justify-center">
              <div className="text-center">
                <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">圖表數據加載中...</p>
                <p className="text-sm text-gray-400 mt-1">需要整合圖表庫如 Chart.js 或 Recharts</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">最近活動</h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-[#cfdbe9] rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-600">{activity.user}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Guides */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">頂級地陪</h2>
            <div className="space-y-4">
              {topGuides.map((guide, index) => (
                <div key={guide.id} className="flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-100 text-gray-800' :
                      index === 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{guide.name}</p>
                      <p className="text-xs text-gray-600">{guide.orders} 訂單 • {guide.rating} ⭐</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{guide.revenue}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}