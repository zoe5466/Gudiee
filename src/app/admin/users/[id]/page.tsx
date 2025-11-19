'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  ArrowLeft, 
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  CheckCircle,
  AlertCircle,
  Edit,
  Ban,
  Shield,
  Activity,
  DollarSign
} from 'lucide-react'

interface UserDetail {
  id: string
  email: string
  name: string
  role: string
  isEmailVerified: boolean
  isKycVerified: boolean
  createdAt: string
  lastLoginAt?: string
  userProfile?: {
    name: string
    bio?: string
    location: string
    phone?: string
    languages: string[]
    specialties?: string[]
    experienceYears?: number
    certifications?: string[]
    profileImage?: string
  }
  stats?: {
    servicesCount: number
    bookingsCount: number
    reviewsCount: number
    totalEarnings?: number
    averageRating?: number
  }
  recentServices?: Array<{
    id: string
    title: string
    status: string
    createdAt: string
    price: number
  }>
  recentBookings?: Array<{
    id: string
    serviceTitle: string
    status: string
    bookingDate: string
    totalAmount: number
  }>
}

export default function UserDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [user, setUser] = useState<UserDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (params.id) {
      fetchUserDetail(params.id as string)
    }
  }, [params.id])

  const fetchUserDetail = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`)
      if (response.ok) {
        const data = await response.json()
        setUser(data)
      } else {
        setError('無法獲取用戶詳細資料')
      }
    } catch (error) {
      console.error('Failed to fetch user detail:', error)
      setError('載入用戶資料時發生錯誤')
    } finally {
      setLoading(false)
    }
  }

  const handleUserAction = async (action: string) => {
    if (!user) return
    
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      })

      if (response.ok) {
        fetchUserDetail(user.id) // 重新獲取資料
      }
    } catch (error) {
      console.error('Failed to perform user action:', error)
    }
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

  if (error || !user) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">載入失敗</h2>
          <p className="text-gray-600 mb-6">{error || '找不到該用戶'}</p>
          <Button onClick={() => router.push('/admin/users')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回用戶列表
          </Button>
        </div>
      </AdminLayout>
    )
  }

  const getRoleLabel = (role: string) => {
    const roleMap: Record<string, string> = {
      'admin': '管理員',
      'guide': '地陪',
      'customer': '客戶'
    }
    return roleMap[role] || role
  }

  const getRoleVariant = (role: string) => {
    const variantMap: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      'admin': 'destructive',
      'guide': 'default', 
      'customer': 'secondary'
    }
    return variantMap[role] || 'outline'
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => router.push('/admin/users')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {user.userProfile?.name || user.name || '未設定姓名'}
                </h1>
                <p className="text-gray-600 mt-1">用戶詳細管理</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => handleUserAction('edit')}>
                <Edit className="h-4 w-4 mr-2" />
                編輯
              </Button>
              <Button variant="outline" onClick={() => handleUserAction('suspend')}>
                <Ban className="h-4 w-4 mr-2" />
                停用
              </Button>
              {user.role !== 'admin' && (
                <Button variant="outline" onClick={() => handleUserAction('promote')}>
                  <Shield className="h-4 w-4 mr-2" />
                  提升權限
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - User Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Basic Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>基本資料</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-gray-600">
                      {((user.userProfile?.name || user.name || user.email || '?')[0] || '?').toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold">
                    {user.userProfile?.name || user.name || '未設定'}
                  </h3>
                  <p className="text-gray-600">{user.email}</p>
                  <div className="flex justify-center mt-2">
                    <Badge variant={getRoleVariant(user.role)}>
                      {getRoleLabel(user.role)}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-gray-600">電子郵件驗證</span>
                    {user.isEmailVerified ? (
                      <Badge variant="success">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        已驗證
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        未驗證
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-gray-600">身份驗證 (KYC)</span>
                    {user.isKycVerified ? (
                      <Badge variant="success">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        已通過
                      </Badge>
                    ) : (
                      <Badge variant="outline">未驗證</Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-gray-600">註冊時間</span>
                    <span className="text-sm">
                      {new Date(user.createdAt).toLocaleDateString('zh-TW')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600">最後登入</span>
                    <span className="text-sm">
                      {user.lastLoginAt 
                        ? new Date(user.lastLoginAt).toLocaleDateString('zh-TW')
                        : '從未登入'
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            {user.userProfile && (
              <Card>
                <CardHeader>
                  <CardTitle>聯絡資訊</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {user.userProfile.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{user.userProfile.phone}</span>
                    </div>
                  )}
                  
                  {user.userProfile.location && (
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{user.userProfile.location}</span>
                    </div>
                  )}

                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Stats and Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">提供服務</p>
                      <p className="text-2xl font-bold">{user.stats?.servicesCount || 0}</p>
                    </div>
                    <MapPin className="h-8 w-8 text-gray-400" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">預訂記錄</p>
                      <p className="text-2xl font-bold">{user.stats?.bookingsCount || 0}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-gray-400" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">評論數量</p>
                      <p className="text-2xl font-bold">{user.stats?.reviewsCount || 0}</p>
                    </div>
                    <Star className="h-8 w-8 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Details */}
            {user.userProfile && (
              <Card>
                <CardHeader>
                  <CardTitle>個人檔案</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {user.userProfile.bio && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-2">個人簡介</h4>
                      <p className="text-sm bg-[#cfdbe9] p-4 rounded-lg">{user.userProfile.bio}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {user.userProfile.languages && user.userProfile.languages.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-600 mb-2">語言能力</h4>
                        <div className="flex flex-wrap gap-2">
                          {user.userProfile.languages.map((lang, index) => (
                            <Badge key={index} variant="secondary">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {user.userProfile.specialties && user.userProfile.specialties.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-600 mb-2">專業領域</h4>
                        <div className="flex flex-wrap gap-2">
                          {user.userProfile.specialties.map((specialty, index) => (
                            <Badge key={index} variant="outline">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {user.userProfile.certifications && user.userProfile.certifications.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-2">認證資格</h4>
                      <div className="space-y-2">
                        {user.userProfile.certifications.map((cert, index) => (
                          <div key={index} className="flex items-center p-3 bg-green-50 rounded-lg">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            <span className="text-sm text-green-700">{cert}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  最近活動
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {user.recentServices && user.recentServices.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-3">最近提供的服務</h4>
                      <div className="space-y-2">
                        {user.recentServices.map((service) => (
                          <div key={service.id} className="flex items-center justify-between p-3 bg-[#cfdbe9] rounded-lg">
                            <div>
                              <p className="text-sm font-medium">{service.title}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(service.createdAt).toLocaleDateString('zh-TW')}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge variant={service.status === 'APPROVED' ? 'success' : 'outline'}>
                                {service.status}
                              </Badge>
                              <p className="text-xs text-gray-600 mt-1">NT$ {service.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {user.recentBookings && user.recentBookings.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-3">最近預訂記錄</h4>
                      <div className="space-y-2">
                        {user.recentBookings.map((booking) => (
                          <div key={booking.id} className="flex items-center justify-between p-3 bg-[#cfdbe9] rounded-lg">
                            <div>
                              <p className="text-sm font-medium">{booking.serviceTitle}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(booking.bookingDate).toLocaleDateString('zh-TW')}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge variant="secondary">{booking.status}</Badge>
                              <p className="text-xs text-gray-600 mt-1">NT$ {booking.totalAmount}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(!user.recentServices?.length && !user.recentBookings?.length) && (
                    <div className="text-center text-gray-500 py-8">
                      <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>暫無最近活動記錄</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}