'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  FileCheck, 
  User, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail,
  Eye,
  Check,
  X,
  Clock,
  Download,
  AlertTriangle,
  Shield,
  UserCheck
} from 'lucide-react'

interface KYCSubmission {
  id: string
  user: {
    id: string
    name: string
    email: string
    phone?: string
    role: string
  }
  idNumber: string
  birthDate: string
  address: string
  emergencyContact: string
  idFrontImageUrl: string
  idBackImageUrl: string
  selfieImageUrl: string
  criminalRecordUrl?: string
  status: 'pending' | 'approved' | 'rejected'
  reviewedBy?: string
  reviewedAt?: string
  rejectionReason?: string
  createdAt: string
  updatedAt: string
}

export default function KYCReviewPage() {
  const [submissions, setSubmissions] = useState<KYCSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState<KYCSubmission | null>(null)
  const [activeTab, setActiveTab] = useState('pending')
  const [reviewing, setReviewing] = useState(false)

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/kyc/submissions')
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setSubmissions(result.data || [])
        }
      }
    } catch (error) {
      console.error('Failed to fetch KYC submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReview = async (submissionId: string, action: 'approve' | 'reject', reason?: string) => {
    try {
      setReviewing(true)
      const response = await fetch(`/api/admin/kyc/submissions/${submissionId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action,
          rejectionReason: reason
        })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          // 更新提交狀態
          setSubmissions(prev => 
            prev.map(sub => 
              sub.id === submissionId 
                ? { ...sub, status: action === 'approve' ? 'approved' : 'rejected', reviewedAt: new Date().toISOString() }
                : sub
            )
          )
          setSelectedSubmission(null)
          // 重新獲取數據以確保同步
          fetchSubmissions()
        }
      }
    } catch (error) {
      console.error('Failed to review KYC submission:', error)
    } finally {
      setReviewing(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-300 bg-yellow-50"><Clock className="h-3 w-3 mr-1" />等待審核</Badge>
      case 'approved':
        return <Badge variant="default" className="text-green-600 border-green-300 bg-green-50"><Check className="h-3 w-3 mr-1" />已通過</Badge>
      case 'rejected':
        return <Badge variant="destructive" className="text-red-600 border-red-300 bg-red-50"><X className="h-3 w-3 mr-1" />已拒絕</Badge>
      default:
        return <Badge variant="secondary">未知</Badge>
    }
  }

  const filteredSubmissions = submissions.filter(sub => {
    if (activeTab === 'pending') return sub.status === 'pending'
    if (activeTab === 'approved') return sub.status === 'approved'
    if (activeTab === 'rejected') return sub.status === 'rejected'
    return true
  })

  const stats = {
    pending: submissions.filter(s => s.status === 'pending').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    rejected: submissions.filter(s => s.status === 'rejected').length,
    total: submissions.length
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <UserCheck className="h-8 w-8 mr-3 text-blue-600" />
              地陪資格審核
            </h1>
            <p className="text-gray-600 mt-2">審核導遊的 KYC 身分驗證和良民證文件</p>
          </div>
          <Button 
            onClick={fetchSubmissions}
            variant="outline"
            className="mt-4 lg:mt-0"
          >
            刷新資料
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">等待審核</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Check className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">已通過</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <X className="h-8 w-8 text-red-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">已拒絕</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileCheck className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">總申請</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pending" className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              等待審核 ({stats.pending})
            </TabsTrigger>
            <TabsTrigger value="approved" className="flex items-center">
              <Check className="h-4 w-4 mr-2" />
              已通過 ({stats.approved})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="flex items-center">
              <X className="h-4 w-4 mr-2" />
              已拒絕 ({stats.rejected})
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center">
              <FileCheck className="h-4 w-4 mr-2" />
              全部 ({stats.total})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Submissions List */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>KYC 申請列表</CardTitle>
                    <CardDescription>
                      {activeTab === 'pending' && '等待審核的申請'}
                      {activeTab === 'approved' && '已通過的申請'}
                      {activeTab === 'rejected' && '已拒絕的申請'}
                      {activeTab === 'all' && '所有申請'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {filteredSubmissions.length === 0 ? (
                      <div className="text-center py-8">
                        <FileCheck className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">沒有找到相關申請</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredSubmissions.map((submission) => (
                          <div
                            key={submission.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-all ${
                              selectedSubmission?.id === submission.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                            onClick={() => setSelectedSubmission(submission)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                                    <User className="h-5 w-5 text-white" />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-gray-900">{submission.user.name}</h3>
                                    <p className="text-sm text-gray-600">{submission.user.email}</p>
                                  </div>
                                </div>
                                <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                                  <div className="flex items-center text-gray-600">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    申請時間：{formatDate(submission.createdAt)}
                                  </div>
                                  <div className="flex items-center text-gray-600">
                                    <Shield className="h-4 w-4 mr-2" />
                                    {submission.criminalRecordUrl ? '包含良民證' : '無良民證'}
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end space-y-2">
                                {getStatusBadge(submission.status)}
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedSubmission(submission)
                                  }}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  檢視
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Submission Detail */}
              <div className="lg:col-span-1">
                {selectedSubmission ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <FileCheck className="h-5 w-5 mr-2" />
                        申請詳情
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* User Info */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">申請人資料</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-gray-500" />
                            {selectedSubmission.user.name}
                          </div>
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-gray-500" />
                            {selectedSubmission.user.email}
                          </div>
                          {selectedSubmission.user.phone && (
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-2 text-gray-500" />
                              {selectedSubmission.user.phone}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* KYC Info */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">身分資料</h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-600">身分證字號：</span>
                            <span className="font-mono">{selectedSubmission.idNumber}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">出生日期：</span>
                            {formatDate(selectedSubmission.birthDate)}
                          </div>
                          <div>
                            <span className="text-gray-600">地址：</span>
                            {selectedSubmission.address}
                          </div>
                          <div>
                            <span className="text-gray-600">緊急聯絡人：</span>
                            {selectedSubmission.emergencyContact}
                          </div>
                        </div>
                      </div>

                      {/* Documents */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">上傳文件</h4>
                        <div className="space-y-2">
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <Download className="h-4 w-4 mr-2" />
                            身分證正面
                          </Button>
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <Download className="h-4 w-4 mr-2" />
                            身分證背面
                          </Button>
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <Download className="h-4 w-4 mr-2" />
                            自拍照片
                          </Button>
                          {selectedSubmission.criminalRecordUrl && (
                            <Button variant="outline" size="sm" className="w-full justify-start">
                              <Download className="h-4 w-4 mr-2" />
                              <Shield className="h-4 w-4 mr-1" />
                              良民證
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      {selectedSubmission.status === 'pending' && (
                        <div className="space-y-3">
                          <Button 
                            className="w-full"
                            onClick={() => handleReview(selectedSubmission.id, 'approve')}
                            disabled={reviewing}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            通過申請
                          </Button>
                          <Button 
                            variant="destructive"
                            className="w-full"
                            onClick={() => {
                              const reason = prompt('請輸入拒絕原因：')
                              if (reason) {
                                handleReview(selectedSubmission.id, 'reject', reason)
                              }
                            }}
                            disabled={reviewing}
                          >
                            <X className="h-4 w-4 mr-2" />
                            拒絕申請
                          </Button>
                        </div>
                      )}

                      {/* Status */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">審核狀態</h4>
                        {getStatusBadge(selectedSubmission.status)}
                        {selectedSubmission.reviewedAt && (
                          <p className="text-xs text-gray-500 mt-2">
                            審核時間：{formatDate(selectedSubmission.reviewedAt)}
                          </p>
                        )}
                        {selectedSubmission.rejectionReason && (
                          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-start">
                              <AlertTriangle className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-red-800">拒絕原因</p>
                                <p className="text-sm text-red-700 mt-1">{selectedSubmission.rejectionReason}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <FileCheck className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">選擇申請</h3>
                      <p className="text-gray-600">點擊左側的申請項目來查看詳細資訊</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}