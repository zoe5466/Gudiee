'use client'

import { useState } from 'react'
import { Clock, MapPin, User, Calendar, Star, MessageCircle, RotateCcw, Filter, Search } from 'lucide-react'
import { useBooking } from '@/store/booking'
import { Rating } from '@/components/ui/rating'
import { Loading } from '@/components/ui/loading'
import Link from 'next/link'

export default function HistoryPage() {
  const { bookings, isLoading } = useBooking()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'COMPLETED' | 'PENDING' | 'CANCELLED'>('all')

  // Mock booking history data - 在實際應用中從 API 獲取
  const mockBookings = [
    {
      id: 'booking-1',
      serviceTitle: '台北101 & 信義區深度導覽',
      status: 'COMPLETED' as const,
      date: '2024-01-15',
      time: '09:00',
      duration: 4,
      guests: 2,
      totalPrice: 1760,
      guide: {
        name: '小美',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
      },
      serviceImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      rating: 5,
      review: '非常棒的體驗！小美導遊很專業，推薦的景點和美食都很棒。',
      location: '台北市信義區',
      bookedAt: '2024-01-10',
    },
    {
      id: 'booking-2',
      serviceTitle: '九份老街 & 金瓜石文化之旅',
      status: 'PENDING' as const,
      date: '2024-01-25',
      time: '10:00',
      duration: 8,
      guests: 3,
      totalPrice: 3960,
      guide: {
        name: '阿明',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
      },
      serviceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      location: '新北市瑞芳區',
      bookedAt: '2024-01-20',
    },
    {
      id: 'booking-3',
      serviceTitle: '淡水老街 & 漁人碼頭夕陽之旅',
      status: 'cancelled' as const,
      date: '2024-01-05',
      time: '15:00',
      duration: 3,
      guests: 2,
      totalPrice: 1320,
      guide: {
        name: '小花',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
      },
      serviceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      location: '新北市淡水區',
      bookedAt: '2024-01-02',
      cancelledReason: '天氣不佳',
    },
  ]

  const filteredBookings = mockBookings.filter(booking => {
    const matchesSearch = searchQuery === '' ||
      booking.serviceTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.guide.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const statusMap = {
      COMPLETED: { text: '已完成', class: 'bg-green-100 text-green-800' },
      PENDING: { text: '待確認', class: 'bg-yellow-100 text-yellow-800' },
      CANCELLED: { text: '已取消', class: 'bg-red-100 text-red-800' },
      CONFIRMED: { text: '已確認', class: 'bg-blue-100 text-blue-800' },
      // Backwards compatibility
      completed: { text: '已完成', class: 'bg-green-100 text-green-800' },
      pending: { text: '待確認', class: 'bg-yellow-100 text-yellow-800' },
      cancelled: { text: '已取消', class: 'bg-red-100 text-red-800' },
      confirmed: { text: '已確認', class: 'bg-blue-100 text-blue-800' },
    }
    const config = statusMap[status as keyof typeof statusMap] || { text: status, class: 'bg-gray-100 text-gray-800' }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.class}`}>
        {config.text}
      </span>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading variant="spinner" size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="heading-1 text-gray-900 mb-2">預訂歷史</h1>
          <p className="body-large text-gray-600">
            您的所有預訂記錄 ({filteredBookings.length})
          </p>
        </div>

        {/* Search and Filters */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="搜尋預訂記錄..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="input"
              >
                <option value="all">所有狀態</option>
                <option value="COMPLETED">已完成</option>
                <option value="PENDING">待確認</option>
                <option value="CANCELLED">已取消</option>
              </select>
              
              <button className="btn btn-secondary flex items-center gap-2">
                <Filter className="w-4 h-4" />
                更多篩選
              </button>
            </div>
          </div>
        </div>

        {/* Booking History List */}
        {filteredBookings.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery || statusFilter !== 'all' ? '沒有找到相關記錄' : '還沒有任何預訂'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || statusFilter !== 'all'
                ? '試試調整搜尋關鍵字或篩選條件'
                : '開始探索並預訂您感興趣的地陪服務'
              }
            </p>
            <Link href="/search" className="btn btn-primary">
              探索服務
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="card hover:shadow-lg transition-shadow duration-200">
                <div className="flex flex-col lg:flex-row gap-6 p-6">
                  {/* Service Image */}
                  <div className="w-full lg:w-48 h-32 lg:h-32 overflow-hidden rounded-lg">
                    <img 
                      src={booking.serviceImage} 
                      alt={booking.serviceTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {booking.serviceTitle}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{booking.location}</span>
                        </div>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>

                    {/* Booking Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(booking.date).toLocaleDateString('zh-TW')} {booking.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{booking.duration} 小時</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="w-4 h-4" />
                        <span>{booking.guests} 位旅客</span>
                      </div>
                      <div className="text-lg font-semibold text-gray-900">
                        NT$ {booking.totalPrice.toLocaleString()}
                      </div>
                    </div>

                    {/* Guide Info */}
                    <div className="flex items-center gap-3 py-3 border-t border-gray-200">
                      <img 
                        src={booking.guide.avatar} 
                        alt={booking.guide.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium text-gray-900">地陪：{booking.guide.name}</div>
                        <div className="text-sm text-gray-600">
                          預訂於 {new Date(booking.bookedAt).toLocaleDateString('zh-TW')}
                        </div>
                      </div>
                    </div>

                    {/* Status-specific content */}
                    {booking.status === 'completed' && booking.rating && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="font-medium text-green-900">您的評價</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Rating value={booking.rating} size="sm" readonly />
                          <span className="text-sm text-green-700">{booking.rating} 顆星</span>
                        </div>
                        {booking.review && (
                          <p className="text-sm text-green-700">{booking.review}</p>
                        )}
                      </div>
                    )}

                    {booking.status === 'cancelled' && booking.cancelledReason && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <RotateCcw className="w-4 h-4 text-red-500" />
                          <span className="font-medium text-red-900">取消原因</span>
                        </div>
                        <p className="text-sm text-red-700">{booking.cancelledReason}</p>
                      </div>
                    )}

                    {booking.status === 'pending' && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-yellow-500" />
                          <span className="font-medium text-yellow-900">等待地陪確認</span>
                        </div>
                        <p className="text-sm text-yellow-700 mt-1">
                          地陪將在 24 小時內回覆您的預訂請求
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-3 lg:w-32">
                    {booking.status === 'completed' && !booking.rating && (
                      <button className="btn btn-primary btn-sm flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        評價
                      </button>
                    )}
                    
                    {booking.status === 'pending' && (
                      <button className="btn btn-secondary btn-sm">
                        取消預訂
                      </button>
                    )}
                    
                    <button className="btn btn-secondary btn-sm flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      聯絡地陪
                    </button>
                    
                    <button className="btn btn-secondary btn-sm">
                      再次預訂
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}