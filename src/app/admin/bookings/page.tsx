'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Calendar, 
  Search, 
  MapPin, 
  Users, 
  DollarSign,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Filter,
  Download,
  RefreshCw,
  User,
  Star
} from 'lucide-react'

interface Booking {
  id: string
  bookingDate: string
  guests: number
  totalAmount: number
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  createdAt: string
  notes?: string
  service: {
    id: string
    title: string
    location: string
    price: number
    durationHours: number
  }
  traveler: {
    id: string
    name: string
    email: string
    userProfile?: {
      name: string
      phone?: string
    }
  }
  guide: {
    id: string
    name: string
    userProfile?: {
      name: string
      phone?: string
    }
  }
  payment?: {
    status: 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED'
    method: string
    transactionId?: string
  }
  review?: {
    id: string
    rating: number
    comment: string
  }
}

export default function BookingsManagement() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>('all')
  const [dateRange, setDateRange] = useState<{ start: string, end: string }>({ start: '', end: '' })

  useEffect(() => {
    fetchBookings()
  }, [])

  useEffect(() => {
    filterBookings()
  }, [bookings, searchTerm, selectedStatus, selectedPaymentStatus, dateRange])

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/admin/bookings')
      if (response.ok) {
        const result = await response.json()
        console.log('Fetched bookings:', result)
        
        if (result.success) {
          const data = result.bookings || result.data || []
          setBookings(Array.isArray(data) ? data : [])
        } else {
          console.error('API error:', result.error)
          setBookings([])
        }
      } else {
        console.error('HTTP error:', response.status)
        setBookings([])
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  const filterBookings = () => {
    let filtered = bookings

    // 按搜索詞過濾
    if (searchTerm) {
      filtered = filtered.filter(booking => 
        booking.service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.traveler.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.traveler.userProfile?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.guide.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.guide.userProfile?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // 按預訂狀態過濾
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(booking => booking.status.toLowerCase() === selectedStatus.toLowerCase())
    }

    // 按付款狀態過濾
    if (selectedPaymentStatus !== 'all') {
      filtered = filtered.filter(booking => 
        booking.payment?.status.toLowerCase() === selectedPaymentStatus.toLowerCase()
      )
    }

    // 按日期範圍過濾
    if (dateRange.start && dateRange.end) {
      const startDate = new Date(dateRange.start)
      const endDate = new Date(dateRange.end)
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.bookingDate)
        return bookingDate >= startDate && bookingDate <= endDate
      })
    }

    setFilteredBookings(filtered)
  }

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      'PENDING': '待確認',
      'CONFIRMED': '已確認',
      'IN_PROGRESS': '進行中',
      'COMPLETED': '已完成',
      'CANCELLED': '已取消'
    }
    return statusMap[status] || status
  }

  const getStatusVariant = (status: string) => {
    const variantMap: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      'PENDING': 'secondary',
      'CONFIRMED': 'default',
      'IN_PROGRESS': 'default',
      'COMPLETED': 'default',
      'CANCELLED': 'destructive'
    }
    return variantMap[status] || 'outline'
  }

  const getPaymentStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      'PENDING': '待付款',
      'PAID': '已付款',
      'REFUNDED': '已退款',
      'FAILED': '付款失敗'
    }
    return statusMap[status] || status
  }

  const getPaymentStatusVariant = (status: string) => {
    const variantMap: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      'PENDING': 'secondary',
      'PAID': 'default',
      'REFUNDED': 'outline',
      'FAILED': 'destructive'
    }
    return variantMap[status] || 'outline'
  }

  const handleBookingAction = async (bookingId: string, action: string) => {
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      })

      if (response.ok) {
        fetchBookings() // 重新獲取預訂列表
      }
    } catch (error) {
      console.error('Failed to perform booking action:', error)
    }
  }

  const exportBookings = () => {
    // 導出功能實現
    console.log('Exporting bookings...')
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">載入中...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Calendar className="h-8 w-8 mr-3" />
                訂單管理
              </h1>
              <p className="text-gray-600 mt-2">管理所有平台預訂和交易記錄</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => fetchBookings()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                重新整理
              </Button>
              <Button variant="outline" onClick={exportBookings}>
                <Download className="h-4 w-4 mr-2" />
                匯出
              </Button>
            </div>
          </div>
        </div>
        
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>搜索和篩選</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="搜索訂單 (ID、服務、客戶、地陪)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">所有狀態</option>
                  <option value="pending">待確認</option>
                  <option value="confirmed">已確認</option>
                  <option value="in_progress">進行中</option>
                  <option value="completed">已完成</option>
                  <option value="cancelled">已取消</option>
                </select>
              </div>
              
              <div>
                <select
                  value={selectedPaymentStatus}
                  onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">付款狀態</option>
                  <option value="pending">待付款</option>
                  <option value="paid">已付款</option>
                  <option value="refunded">已退款</option>
                  <option value="failed">付款失敗</option>
                </select>
              </div>
              
              <div>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">總訂單數</p>
                  <p className="text-2xl font-bold">{bookings.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">待確認</p>
                  <p className="text-2xl font-bold">
                    {bookings.filter(b => b.status === 'PENDING').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">已完成</p>
                  <p className="text-2xl font-bold">
                    {bookings.filter(b => b.status === 'COMPLETED').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">已取消</p>
                  <p className="text-2xl font-bold">
                    {bookings.filter(b => b.status === 'CANCELLED').length}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">總收入</p>
                  <p className="text-xl font-bold">
                    NT$ {bookings
                      .filter(b => b.status === 'COMPLETED')
                      .reduce((sum, b) => sum + b.totalAmount, 0)
                      .toLocaleString()
                    }
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bookings List */}
        <Card>
          <CardHeader>
            <CardTitle>訂單列表 ({filteredBookings.length})</CardTitle>
            <CardDescription>
              點擊訂單查看詳細資料，或使用操作按鈕管理訂單狀態
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-[#cfdbe9] transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Header Row */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {booking.service.title}
                          </h3>
                          <Badge variant={getStatusVariant(booking.status)} className="text-xs">
                            {getStatusLabel(booking.status)}
                          </Badge>
                          {booking.payment && (
                            <Badge variant={getPaymentStatusVariant(booking.payment.status)} className="text-xs">
                              {getPaymentStatusLabel(booking.payment.status)}
                            </Badge>
                          )}
                        </div>
                        <div className="text-right text-xs text-gray-500">
                          <p>訂單 #{booking.id.slice(0, 8)}</p>
                          <p>{new Date(booking.createdAt).toLocaleDateString('zh-TW')}</p>
                        </div>
                      </div>
                      
                      {/* Details Row */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        {/* Service & Location */}
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            {booking.service.location}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-2" />
                            {booking.service.durationHours} 小時
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            {new Date(booking.bookingDate).toLocaleDateString('zh-TW')}
                          </div>
                        </div>
                        
                        {/* Participants */}
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <User className="h-4 w-4 mr-2" />
                            客戶: {booking.traveler.userProfile?.name || booking.traveler.name}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <User className="h-4 w-4 mr-2" />
                            地陪: {booking.guide.userProfile?.name || booking.guide.name}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="h-4 w-4 mr-2" />
                            {booking.guests} 人
                          </div>
                        </div>
                        
                        {/* Financial */}
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <DollarSign className="h-4 w-4 mr-2" />
                            NT$ {booking.totalAmount.toLocaleString()}
                          </div>
                          {booking.payment && (
                            <div className="text-xs text-gray-500">
                              {booking.payment.method} 
                              {booking.payment.transactionId && ` - ${booking.payment.transactionId}`}
                            </div>
                          )}
                          {booking.review && (
                            <div className="flex items-center text-sm text-yellow-600">
                              <Star className="h-4 w-4 mr-1 fill-current" />
                              {booking.review.rating}/5
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Notes */}
                      {booking.notes && (
                        <div className="text-sm text-gray-600 bg-[#cfdbe9] p-2 rounded mt-2">
                          <strong>備註:</strong> {booking.notes}
                        </div>
                      )}
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/admin/bookings/${booking.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        詳情
                      </Button>
                      
                      {booking.status === 'PENDING' && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleBookingAction(booking.id, 'confirm')}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          確認
                        </Button>
                      )}
                      
                      {booking.status === 'CONFIRMED' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleBookingAction(booking.id, 'cancel')}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          取消
                        </Button>
                      )}
                      
                      {booking.status === 'COMPLETED' && !booking.review && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleBookingAction(booking.id, 'request_review')}
                        >
                          <Star className="h-4 w-4 mr-1" />
                          請求評價
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {filteredBookings.length === 0 && (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">沒有找到符合條件的訂單</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}