'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  MapPin, 
  Search, 
  Filter, 
  Eye, 
  Check, 
  X, 
  Clock,
  Users,
  DollarSign,
  Star
} from 'lucide-react'

interface Service {
  id: string
  title: string
  description: string
  location: string
  durationHours: number
  price: number
  maxGuests: number
  status: string
  createdAt: string
  images: string[]
  guide: {
    id: string
    name: string
    userProfile?: {
      name: string
      location: string
    }
  }
  _count: {
    bookings: number
    reviews: number
  }
  averageRating?: number
}

export default function ServicesManagement() {
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [filteredServices, setFilteredServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  useEffect(() => {
    fetchServices()
  }, [])

  useEffect(() => {
    filterServices()
  }, [services, searchTerm, selectedStatus])

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/admin/services')
      if (response.ok) {
        const data = await response.json()
        setServices(data)
      }
    } catch (error) {
      console.error('Failed to fetch services:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterServices = () => {
    let filtered = services

    // 按搜索詞過濾
    if (searchTerm) {
      filtered = filtered.filter(service => 
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.guide.userProfile?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.guide.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // 按狀態過濾
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(service => service.status.toLowerCase() === selectedStatus.toLowerCase())
    }

    setFilteredServices(filtered)
  }

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      'PENDING': '待審核',
      'ACTIVE': '已上線',
      'REJECTED': '已拒絕',
      'SUSPENDED': '已暫停'
    }
    return statusMap[status] || status
  }

  const getStatusVariant = (status: string) => {
    const variantMap: Record<string, 'default' | 'secondary' | 'destructive' | 'outline' | 'warning'> = {
      'PENDING': 'warning',
      'ACTIVE': 'default',
      'REJECTED': 'destructive',
      'SUSPENDED': 'secondary'
    }
    return variantMap[status] || 'outline'
  }

  const handleServiceAction = async (serviceId: string, action: string) => {
    try {
      const response = await fetch(`/api/admin/services/${serviceId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      })

      if (response.ok) {
        fetchServices() // 重新獲取服務列表
      }
    } catch (error) {
      console.error('Failed to perform service action:', error)
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

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <MapPin className="h-8 w-8 mr-3" />
            服務管理
          </h1>
          <p className="text-gray-600 mt-2">審核和管理地陪服務項目</p>
        </div>
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>搜索和篩選</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="搜索服務 (標題、地點、地陪名稱)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="md:w-48">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">所有狀態</option>
                  <option value="pending">待審核</option>
                  <option value="active">已上線</option>
                  <option value="rejected">已拒絕</option>
                  <option value="suspended">已暫停</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">總服務數</p>
                  <p className="text-2xl font-bold">{services.length}</p>
                </div>
                <MapPin className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">待審核</p>
                  <p className="text-2xl font-bold">
                    {services.filter(s => s.status === 'PENDING').length}
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
                  <p className="text-sm font-medium text-gray-600">已上線</p>
                  <p className="text-2xl font-bold">
                    {services.filter(s => s.status === 'ACTIVE').length}
                  </p>
                </div>
                <Check className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">平均價格</p>
                  <p className="text-2xl font-bold">
                    NT$ {Math.round(services.reduce((sum, s) => sum + s.price, 0) / services.length || 0)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services List */}
        <Card>
          <CardHeader>
            <CardTitle>服務列表 ({filteredServices.length})</CardTitle>
            <CardDescription>
              點擊服務查看詳細資料，或使用操作按鈕審核服務
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {service.images?.[0] ? (
                        <img
                          src={service.images[0]}
                          alt={service.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <MapPin className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {service.title}
                            </h3>
                            <Badge variant={getStatusVariant(service.status)} className="text-xs">
                              {getStatusLabel(service.status)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {service.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                            <span className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {service.location}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {service.durationHours} 小時
                            </span>
                            <span className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              最多 {service.maxGuests} 人
                            </span>
                            <span className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-1" />
                              NT$ {service.price.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="text-gray-600">
                              地陪: {service.guide.userProfile?.name || service.guide.name}
                            </span>
                            <span className="text-gray-500">
                              {service._count.bookings} 次預訂
                            </span>
                            <span className="text-gray-500">
                              {service._count.reviews} 則評論
                            </span>
                            {service.averageRating && (
                              <span className="flex items-center text-yellow-600">
                                <Star className="h-4 w-4 mr-1 fill-current" />
                                {service.averageRating.toFixed(1)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/admin/services/${service.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      查看
                    </Button>
                    {service.status === 'PENDING' && (
                      <>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleServiceAction(service.id, 'approve')}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          通過
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleServiceAction(service.id, 'reject')}
                        >
                          <X className="h-4 w-4 mr-1" />
                          拒絕
                        </Button>
                      </>
                    )}
                    {service.status === 'ACTIVE' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleServiceAction(service.id, 'suspend')}
                      >
                        暫停
                      </Button>
                    )}
                    {service.status === 'SUSPENDED' && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleServiceAction(service.id, 'activate')}
                      >
                        啟用
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              {filteredServices.length === 0 && (
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">沒有找到符合條件的服務</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}