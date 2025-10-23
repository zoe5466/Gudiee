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
  Filter, 
  MoreHorizontal, 
  Edit, 
  Ban, 
  CheckCircle,
  Eye,
  Mail,
  Phone,
  MapPin
} from 'lucide-react'

interface User {
  id: string
  email: string
  name: string
  avatar?: string | null
  role: 'customer' | 'guide' | 'admin'
  isEmailVerified: boolean
  isKycVerified: boolean
  createdAt: string
  lastLoginAt?: string
  permissions?: string[]
  profile?: {
    phone?: string
    bio?: string
    location?: string
    birthDate?: string
    languages?: string[]
    specialties?: string[]
    experienceYears?: number
    certifications?: string[]
  }
  stats?: {
    servicesCount: number
    bookingsCount: number
    reviewsCount: number
  }
}

export default function UsersManagement() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState<string>('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserDetail, setShowUserDetail] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, searchTerm, selectedRole])


  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = users

    // 按搜索詞過濾
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // 按角色過濾
    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role === selectedRole)
    }

    setFilteredUsers(filtered)
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

  const handleUserAction = async (userId: string, action: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      })

      if (response.ok) {
        fetchUsers() // 重新獲取用戶列表
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

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Users className="h-8 w-8 mr-3" />
            用戶管理
          </h1>
          <p className="text-gray-600 mt-2">管理註冊用戶、地陪和客戶資料</p>
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
                    placeholder="搜索用戶 (姓名、電子郵件)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="md:w-48">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">所有角色</option>
                  <option value="admin">管理員</option>
                  <option value="guide">地陪</option>
                  <option value="customer">客戶</option>
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
                  <p className="text-sm font-medium text-gray-600">總用戶數</p>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
                <Users className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">地陪</p>
                  <p className="text-2xl font-bold">
                    {users.filter(u => u.role === 'guide').length}
                  </p>
                </div>
                <Badge variant="default" className="text-xs">地陪</Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">客戶</p>
                  <p className="text-2xl font-bold">
                    {users.filter(u => u.role === 'customer').length}
                  </p>
                </div>
                <Badge variant="secondary" className="text-xs">客戶</Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">已驗證</p>
                  <p className="text-2xl font-bold">
                    {users.filter(u => u.isEmailVerified).length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>用戶列表 ({filteredUsers.length})</CardTitle>
            <CardDescription>
              點擊用戶查看詳細資料，或使用操作菜單管理用戶
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-gray-600">
                        {(user.name || user.email || '?')[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-semibold text-gray-900">
                          {user.name || '未設定'}
                        </h3>
                        <Badge variant={getRoleVariant(user.role)} className="text-xs">
                          {getRoleLabel(user.role)}
                        </Badge>
                        {user.isEmailVerified && (
                          <Badge variant="success" className="text-xs">
                            <Mail className="h-3 w-3 mr-1" />
                            已驗證
                          </Badge>
                        )}
                        {user.isKycVerified && (
                          <Badge variant="success" className="text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            KYC
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      {user.profile?.location && (
                        <p className="text-xs text-gray-500">📍 {user.profile.location}</p>
                      )}
                      {user.profile?.languages && user.profile.languages.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {user.profile.languages.slice(0, 3).map((lang, index) => (
                            <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {lang}
                            </span>
                          ))}
                          {user.profile.languages.length > 3 && (
                            <span className="text-xs text-gray-500">+{user.profile.languages.length - 3} 更多</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        註冊於 {new Date(user.createdAt).toLocaleDateString('zh-TW')}
                      </p>
                      {user.profile?.experienceYears && (
                        <p className="text-xs text-gray-500">
                          {user.profile.experienceYears} 年經驗
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedUser(user)
                        setShowUserDetail(true)
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      查看
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUserAction(user.id, 'edit')}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      編輯
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUserAction(user.id, 'suspend')}
                    >
                      <Ban className="h-4 w-4 mr-1" />
                      停用
                    </Button>
                  </div>
                </div>
              ))}

              {filteredUsers.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">沒有找到符合條件的用戶</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* User Detail Modal */}
        {showUserDetail && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">客戶詳細資料</h2>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowUserDetail(false)}
                  >
                    關閉
                  </Button>
                </div>
                
                {/* User Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">基本資料</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-xl font-bold text-gray-600">
                            {(selectedUser.name || selectedUser.email || '?')[0]?.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">
                            {selectedUser.name || '未設定'}
                          </h3>
                          <p className="text-gray-600">{selectedUser.email}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant={getRoleVariant(selectedUser.role)}>
                              {getRoleLabel(selectedUser.role)}
                            </Badge>
                            {selectedUser.isEmailVerified && (
                              <Badge variant="success" className="text-xs">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                已驗證
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                        <div>
                          <p className="text-sm text-gray-600">註冊時間</p>
                          <p className="text-sm font-medium">
                            {new Date(selectedUser.createdAt).toLocaleDateString('zh-TW', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">最後登入</p>
                          <p className="text-sm font-medium">
                            {selectedUser.lastLoginAt 
                              ? new Date(selectedUser.lastLoginAt).toLocaleDateString('zh-TW')
                              : '從未登入'
                            }
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">統計數據</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">
                            {selectedUser.stats?.servicesCount || 0}
                          </p>
                          <p className="text-sm text-gray-600">提供服務</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">
                            {selectedUser.stats?.bookingsCount || 0}
                          </p>
                          <p className="text-sm text-gray-600">預訂記錄</p>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                          <p className="text-2xl font-bold text-yellow-600">
                            {selectedUser.stats?.reviewsCount || 0}
                          </p>
                          <p className="text-sm text-gray-600">評論數量</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Profile Details */}
                {selectedUser.profile && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">個人檔案</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {selectedUser.profile.bio && (
                          <div>
                            <p className="text-sm text-gray-600 mb-1">個人簡介</p>
                            <p className="text-sm bg-gray-50 p-3 rounded">{selectedUser.profile.bio}</p>
                          </div>
                        )}
                        
                        {selectedUser.profile.location && (
                          <div>
                            <p className="text-sm text-gray-600 mb-1">所在地區</p>
                            <p className="text-sm flex items-center">
                              <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                              {selectedUser.profile.location}
                            </p>
                          </div>
                        )}
                        
                        {selectedUser.profile.experienceYears && (
                          <div>
                            <p className="text-sm text-gray-600 mb-1">經驗年數</p>
                            <p className="text-sm">{selectedUser.profile.experienceYears} 年</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">技能與語言</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {selectedUser.profile.languages && selectedUser.profile.languages.length > 0 && (
                          <div>
                            <p className="text-sm text-gray-600 mb-2">語言能力</p>
                            <div className="flex flex-wrap gap-2">
                              {selectedUser.profile.languages.map((lang, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {lang}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {selectedUser.profile.specialties && selectedUser.profile.specialties.length > 0 && (
                          <div>
                            <p className="text-sm text-gray-600 mb-2">專業領域</p>
                            <div className="flex flex-wrap gap-2">
                              {selectedUser.profile.specialties.map((specialty, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {specialty}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {selectedUser.profile.certifications && selectedUser.profile.certifications.length > 0 && (
                          <div>
                            <p className="text-sm text-gray-600 mb-2">認證資格</p>
                            <div className="space-y-1">
                              {selectedUser.profile.certifications.map((cert, index) => (
                                <p key={index} className="text-xs bg-green-50 text-green-700 p-2 rounded flex items-center">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  {cert}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}