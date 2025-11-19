'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Users, 
  Search, 
  MapPin, 
  Star, 
  Calendar,
  DollarSign,
  Eye,
  UserCheck,
  UserX,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  Award,
  Languages
} from 'lucide-react'

interface Guide {
  id: string
  email: string
  name: string
  isEmailVerified: boolean
  isKycVerified: boolean
  createdAt: string
  lastLoginAt?: string
  userProfile?: {
    name: string
    bio?: string
    location: string
    languages: string[]
    specialties?: string[]
    experienceYears?: number
    certifications?: string[]
    profileImage?: string
  }
  stats: {
    servicesCount: number
    bookingsCount: number
    reviewsCount: number
    totalEarnings: number
    averageRating: number
  }
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING'
}

export default function GuidesManagement() {
  const router = useRouter()
  const [guides, setGuides] = useState<Guide[]>([])
  const [filteredGuides, setFilteredGuides] = useState<Guide[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedVerification, setSelectedVerification] = useState<string>('all')

  useEffect(() => {
    fetchGuides()
  }, [])

  useEffect(() => {
    filterGuides()
  }, [guides, searchTerm, selectedStatus, selectedVerification])

  const fetchGuides = async () => {
    try {
      const response = await fetch('/api/admin/guides')
      if (response.ok) {
        const data = await response.json()
        setGuides(data)
      }
    } catch (error) {
      console.error('Failed to fetch guides:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterGuides = () => {
    let filtered = guides

    // 按搜索詞過濾
    if (searchTerm) {
      filtered = filtered.filter(guide => 
        guide.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guide.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guide.userProfile?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guide.userProfile?.location?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // 按狀態過濾
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(guide => guide.status.toLowerCase() === selectedStatus.toLowerCase())
    }

    // 按驗證狀態過濾
    if (selectedVerification === 'verified') {
      filtered = filtered.filter(guide => guide.isEmailVerified && guide.isKycVerified)
    } else if (selectedVerification === 'unverified') {
      filtered = filtered.filter(guide => !guide.isEmailVerified || !guide.isKycVerified)
    }

    setFilteredGuides(filtered)
  }

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      'ACTIVE': '活躍',
      'SUSPENDED': '已停權',
      'PENDING': '待審核'
    }
    return statusMap[status] || status
  }

  const getStatusVariant = (status: string) => {
    const variantMap: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      'ACTIVE': 'default',
      'SUSPENDED': 'destructive', 
      'PENDING': 'secondary'
    }
    return variantMap[status] || 'outline'
  }

  const handleGuideAction = async (guideId: string, action: string) => {
    try {
      const response = await fetch(`/api/admin/users/${guideId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      })

      if (response.ok) {
        fetchGuides() // 重新獲取地陪列表
      }
    } catch (error) {
      console.error('Failed to perform guide action:', error)
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
            <Users className="h-8 w-8 mr-3" />
            地陪管理
          </h1>
          <p className="text-gray-600 mt-2">管理平台地陪資訊、認證狀態和營運數據</p>
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
                    placeholder="搜索地陪 (姓名、電子郵件、地點)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="md:w-40">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">所有狀態</option>
                  <option value="active">活躍</option>
                  <option value="suspended">已停權</option>
                  <option value="pending">待審核</option>
                </select>
              </div>
              <div className="md:w-40">
                <select
                  value={selectedVerification}
                  onChange={(e) => setSelectedVerification(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">全部認證</option>
                  <option value="verified">已認證</option>
                  <option value="unverified">待認證</option>
                </select>
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
                  <p className="text-sm font-medium text-gray-600">總地陪數</p>
                  <p className="text-2xl font-bold">{guides.length}</p>
                </div>
                <Users className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">活躍地陪</p>
                  <p className="text-2xl font-bold">
                    {guides.filter(g => g.status === 'ACTIVE').length}
                  </p>
                </div>
                <UserCheck className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">已認證</p>
                  <p className="text-2xl font-bold">
                    {guides.filter(g => g.isEmailVerified && g.isKycVerified).length}
                  </p>
                </div>
                <Shield className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">平均評分</p>
                  <p className="text-2xl font-bold">
                    {guides.length > 0 
                      ? (guides.reduce((sum, g) => sum + g.stats.averageRating, 0) / guides.length).toFixed(1)
                      : '0.0'
                    }
                  </p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">總收入</p>
                  <p className="text-xl font-bold">
                    NT$ {guides.reduce((sum, g) => sum + g.stats.totalEarnings, 0).toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Guides List */}
        <Card>
          <CardHeader>
            <CardTitle>地陪列表 ({filteredGuides.length})</CardTitle>
            <CardDescription>
              點擊地陪查看詳細資料，或使用操作按鈕管理地陪狀態
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredGuides.map((guide) => (
                <div
                  key={guide.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-[#cfdbe9] transition-colors"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-gray-600">
                        {((guide.userProfile?.name || guide.name || guide.email || '?')[0] || '?').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {guide.userProfile?.name || guide.name || '未設定'}
                        </h3>
                        <Badge variant={getStatusVariant(guide.status)} className="text-xs">
                          {getStatusLabel(guide.status)}
                        </Badge>
                        {guide.isEmailVerified && guide.isKycVerified && (
                          <Badge variant="success" className="text-xs">
                            <Shield className="h-3 w-3 mr-1" />
                            已認證
                          </Badge>
                        )}
                        {(!guide.isEmailVerified || !guide.isKycVerified) && (
                          <Badge variant="secondary" className="text-xs">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            待認證
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">{guide.email}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-2">
                        {guide.userProfile?.location && (
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {guide.userProfile.location}
                          </span>
                        )}
                        {guide.userProfile?.experienceYears && (
                          <span className="flex items-center">
                            <Award className="h-4 w-4 mr-1" />
                            {guide.userProfile.experienceYears} 年經驗
                          </span>
                        )}
                        {guide.userProfile?.languages && guide.userProfile.languages.length > 0 && (
                          <span className="flex items-center">
                            <Languages className="h-4 w-4 mr-1" />
                            {guide.userProfile.languages.slice(0, 2).join(', ')}
                            {guide.userProfile.languages.length > 2 && ` +${guide.userProfile.languages.length - 2}`}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="flex items-center text-blue-600">
                          <Calendar className="h-4 w-4 mr-1" />
                          {guide.stats.servicesCount} 個服務
                        </span>
                        <span className="flex items-center text-green-600">
                          <DollarSign className="h-4 w-4 mr-1" />
                          NT$ {guide.stats.totalEarnings.toLocaleString()}
                        </span>
                        <span className="flex items-center text-yellow-600">
                          <Star className="h-4 w-4 mr-1" />
                          {guide.stats.averageRating > 0 ? guide.stats.averageRating.toFixed(1) : 'N/A'}
                        </span>
                        <span className="text-gray-500">
                          {guide.stats.bookingsCount} 次預訂
                        </span>
                        <span className="text-gray-500">
                          {guide.stats.reviewsCount} 則評論
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right text-xs text-gray-500">
                      <p>註冊於</p>
                      <p>{new Date(guide.createdAt).toLocaleDateString('zh-TW')}</p>
                      {guide.lastLoginAt && (
                        <>
                          <p className="mt-1">最後活躍</p>
                          <p>{new Date(guide.lastLoginAt).toLocaleDateString('zh-TW')}</p>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/admin/users/${guide.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      詳情
                    </Button>
                    
                    {guide.status === 'ACTIVE' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGuideAction(guide.id, 'suspend')}
                      >
                        <UserX className="h-4 w-4 mr-1" />
                        停權
                      </Button>
                    )}
                    
                    {guide.status === 'SUSPENDED' && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleGuideAction(guide.id, 'activate')}
                      >
                        <UserCheck className="h-4 w-4 mr-1" />
                        恢復
                      </Button>
                    )}
                    
                    {!guide.isKycVerified && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGuideAction(guide.id, 'verify_kyc')}
                      >
                        <Shield className="h-4 w-4 mr-1" />
                        認證
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              {filteredGuides.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">沒有找到符合條件的地陪</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}