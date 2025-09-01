'use client'

import { useEffect, useState } from 'react'
import { useI18n } from '@/components/providers/i18n-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Star, 
  Search, 
  Filter, 
  Check, 
  X, 
  Eye, 
  AlertTriangle,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Calendar,
  MapPin,
  User,
  TrendingUp,
  Shield,
  Clock,
  BarChart3,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

interface Review {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  serviceId: string
  serviceName: string
  guideId: string
  guideName: string
  rating: number
  comment: string
  images?: string[]
  createdAt: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  moderatorNote?: string
  reportCount: number
  isReported: boolean
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL'
  responseFromGuide?: string
}

interface ReviewStats {
  totalReviews: number
  pendingReviews: number
  approvedReviews: number
  rejectedReviews: number
  reportedReviews: number
  averageRating: number
  positiveReviews: number
  negativeReviews: number
}

export default function ReviewManagement() {
  const { t } = useI18n()
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats>({
    totalReviews: 0,
    pendingReviews: 0,
    approvedReviews: 0,
    rejectedReviews: 0,
    reportedReviews: 0,
    averageRating: 0,
    positiveReviews: 0,
    negativeReviews: 0
  })
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'REPORTED'>('ALL')
  const [filterRating, setFilterRating] = useState<'ALL' | '1' | '2' | '3' | '4' | '5'>('ALL')
  const [moderatorNote, setModeratorNote] = useState('')
  const [activeTab, setActiveTab] = useState('pending')

  useEffect(() => {
    fetchReviews()
    fetchReviewStats()
  }, [])

  const fetchReviews = async () => {
    try {
      // Mock data for demonstration
      const mockReviews: Review[] = [
        {
          id: '1',
          userId: 'user1',
          userName: '張小明',
          serviceId: 'service1',
          serviceName: '台北一日遊',
          guideId: 'guide1',
          guideName: '李導遊',
          rating: 5,
          comment: '非常棒的體驗！導遊專業親切，行程安排得很好，景點介紹詳細，讓我們對台北有了更深的了解。強烈推薦！',
          createdAt: '2025-01-21T10:30:00Z',
          status: 'PENDING',
          reportCount: 0,
          isReported: false,
          sentiment: 'POSITIVE',
          images: ['https://picsum.photos/400/300?random=1']
        },
        {
          id: '2',
          userId: 'user2',
          userName: '王美華',
          serviceId: 'service2',
          serviceName: '九份老街導覽',
          guideId: 'guide2',
          guideName: '陳導遊',
          rating: 2,
          comment: '導遊遲到了30分鐘，而且對景點的介紹不夠詳細，感覺不太專業。價錢偏貴，不值得。',
          createdAt: '2025-01-21T09:15:00Z',
          status: 'PENDING',
          reportCount: 2,
          isReported: true,
          sentiment: 'NEGATIVE',
          moderatorNote: '需要進一步審核是否為惡意評論'
        },
        {
          id: '3',
          userId: 'user3',
          userName: '李先生',
          serviceId: 'service3',
          serviceName: '淡水河岸遊',
          guideId: 'guide1',
          guideName: '李導遊',
          rating: 4,
          comment: '整體來說還不錯，導遊很友善，景色也很美。唯一不足的是時間有點趕，希望能多預留一些時間拍照。',
          createdAt: '2025-01-20T16:20:00Z',
          status: 'APPROVED',
          reportCount: 0,
          isReported: false,
          sentiment: 'POSITIVE',
          responseFromGuide: '謝謝您的建議，我們會調整行程時間安排，確保有充足的拍照時間。'
        },
        {
          id: '4',
          userId: 'user4',
          userName: '劉小姐',
          serviceId: 'service4',
          serviceName: '陽明山溫泉之旅',
          guideId: 'guide3',
          guideName: '黃導遊',
          rating: 1,
          comment: '垃圾服務，導遊態度惡劣，完全不推薦。浪費錢和時間。',
          createdAt: '2025-01-20T14:10:00Z',
          status: 'REJECTED',
          reportCount: 0,
          isReported: false,
          sentiment: 'NEGATIVE',
          moderatorNote: '語言不當，缺乏具體描述，判定為無效評論'
        },
        {
          id: '5',
          userId: 'user5',
          userName: '吳大哥',
          serviceId: 'service5',
          serviceName: '夜市美食探索',
          guideId: 'guide4',
          guideName: '郭導遊',
          rating: 5,
          comment: '超棒的美食之旅！導遊帶我們嘗試了很多當地特色小吃，每一樣都很好吃。郭導遊不僅熟悉美食，還會說很多有趣的故事。',
          createdAt: '2025-01-20T12:45:00Z',
          status: 'APPROVED',
          reportCount: 0,
          isReported: false,
          sentiment: 'POSITIVE'
        }
      ]
      setReviews(mockReviews)
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchReviewStats = async () => {
    try {
      // Mock stats
      setStats({
        totalReviews: 156,
        pendingReviews: 23,
        approvedReviews: 112,
        rejectedReviews: 21,
        reportedReviews: 8,
        averageRating: 4.2,
        positiveReviews: 124,
        negativeReviews: 32
      })
    } catch (error) {
      console.error('Failed to fetch review stats:', error)
    }
  }

  const handleApproveReview = async (reviewId: string) => {
    try {
      const updatedReviews = reviews.map(review => {
        if (review.id === reviewId) {
          return { ...review, status: 'APPROVED' as const }
        }
        return review
      })
      setReviews(updatedReviews)
      if (selectedReview?.id === reviewId) {
        setSelectedReview({ ...selectedReview, status: 'APPROVED' })
      }
    } catch (error) {
      console.error('Failed to approve review:', error)
    }
  }

  const handleRejectReview = async (reviewId: string) => {
    try {
      const updatedReviews = reviews.map(review => {
        if (review.id === reviewId) {
          return { 
            ...review, 
            status: 'REJECTED' as const,
            moderatorNote: moderatorNote || '不符合社群規範'
          }
        }
        return review
      })
      setReviews(updatedReviews)
      if (selectedReview?.id === reviewId) {
        setSelectedReview({ 
          ...selectedReview, 
          status: 'REJECTED',
          moderatorNote: moderatorNote || '不符合社群規範'
        })
      }
      setModeratorNote('')
    } catch (error) {
      console.error('Failed to reject review:', error)
    }
  }

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'APPROVED': return 'bg-green-100 text-green-800 border-green-200'
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'POSITIVE': return 'text-green-600'
      case 'NEGATIVE': return 'text-red-600'
      case 'NEUTRAL': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = filterStatus === 'ALL' || 
                         (filterStatus === 'REPORTED' && review.isReported) ||
                         review.status === filterStatus
    
    const matchesRating = filterRating === 'ALL' || review.rating.toString() === filterRating

    return matchesSearch && matchesStatus && matchesRating
  })

  const getReviewsByTab = (tab: string) => {
    switch (tab) {
      case 'pending':
        return filteredReviews.filter(r => r.status === 'PENDING')
      case 'approved':
        return filteredReviews.filter(r => r.status === 'APPROVED')
      case 'rejected':
        return filteredReviews.filter(r => r.status === 'REJECTED')
      case 'reported':
        return filteredReviews.filter(r => r.isReported)
      default:
        return filteredReviews
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('admin.common.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-white/90 to-orange-50/50 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-slate-200/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-orange-600 bg-clip-text text-transparent">{t('admin.review_management.title')}</h1>
            <p className="text-slate-600 mt-3 text-lg">審核用戶評論，確保內容質量和社群規範</p>
            <div className="flex items-center mt-4 text-sm text-slate-500">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <span>即時監控中</span>
              </div>
              <div className="ml-6 flex items-center">
                <Star className="w-4 h-4 mr-1 text-yellow-500 fill-current" />
                <span>平均評分：{stats.averageRating.toFixed(1)}</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Star className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">{t('admin.review_management.total_reviews')}</p>
                <p className="text-3xl font-bold mt-2">{stats.totalReviews}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">本月新增 +12</span>
                </div>
              </div>
              <BarChart3 className="h-12 w-12 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">{t('admin.review_management.pending_reviews')}</p>
                <p className="text-3xl font-bold mt-2">{stats.pendingReviews}</p>
                <div className="flex items-center mt-2">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">需要關注</span>
                </div>
              </div>
              <AlertCircle className="h-12 w-12 text-yellow-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">已通過</p>
                <p className="text-3xl font-bold mt-2">{stats.approvedReviews}</p>
                <div className="flex items-center mt-2">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span className="text-sm">{((stats.approvedReviews / stats.totalReviews) * 100).toFixed(0)}% 通過率</span>
                </div>
              </div>
              <CheckCircle className="h-12 w-12 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-pink-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">被檢舉</p>
                <p className="text-3xl font-bold mt-2">{stats.reportedReviews}</p>
                <div className="flex items-center mt-2">
                  <Flag className="h-4 w-4 mr-1" />
                  <span className="text-sm">需立即處理</span>
                </div>
              </div>
              <Shield className="h-12 w-12 text-red-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            篩選與搜尋
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t('admin.review_management.search_reviews')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="ALL">{t('admin.review_management.all_status')}</option>
              <option value="PENDING">{t('admin.review_management.pending')}</option>
              <option value="APPROVED">{t('admin.review_management.approved')}</option>
              <option value="REJECTED">{t('admin.review_management.rejected')}</option>
              <option value="REPORTED">{t('admin.review_management.flagged')}</option>
            </select>

            <select 
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value as any)}
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="ALL">所有評分</option>
              <option value="5">⭐⭐⭐⭐⭐</option>
              <option value="4">⭐⭐⭐⭐</option>
              <option value="3">⭐⭐⭐</option>
              <option value="2">⭐⭐</option>
              <option value="1">⭐</option>
            </select>

            <Button variant="outline" onClick={() => {
              setSearchQuery('')
              setFilterStatus('ALL')
              setFilterRating('ALL')
            }}>
              清除篩選
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending" className="relative">
            {t('admin.review_management.pending')}
            {stats.pendingReviews > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                {stats.pendingReviews}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">{t('admin.review_management.approved')}</TabsTrigger>
          <TabsTrigger value="rejected">{t('admin.review_management.rejected')}</TabsTrigger>
          <TabsTrigger value="reported" className="relative">
            {t('admin.review_management.flagged')}
            {stats.reportedReviews > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                {stats.reportedReviews}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 gap-6">
            {getReviewsByTab(activeTab).map((review) => (
              <Card key={review.id} className={`hover:shadow-lg transition-shadow ${
                review.isReported ? 'border-red-200 bg-red-50/30' : ''
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-lg">{review.userName}</h3>
                          <div className="flex items-center space-x-1">
                            {getRatingStars(review.rating)}
                            <span className="text-sm text-gray-600 ml-1">({review.rating}/5)</span>
                          </div>
                          <Badge className={`${getStatusColor(review.status)}`}>
                            {review.status === 'PENDING' ? '待審核' : 
                             review.status === 'APPROVED' ? '已通過' : '已拒絕'}
                          </Badge>
                          {review.isReported && (
                            <Badge variant="destructive" className="animate-pulse">
                              <Flag className="h-3 w-3 mr-1" />
                              被檢舉
                            </Badge>
                          )}
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span className="mr-4">{review.serviceName}</span>
                            <span className="mr-4">地陪：{review.guideName}</span>
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{new Date(review.createdAt).toLocaleDateString('zh-TW')}</span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-gray-800 leading-relaxed">{review.comment}</p>
                          {review.images && review.images.length > 0 && (
                            <div className="mt-3 flex space-x-2">
                              {review.images.map((image, index) => (
                                <img
                                  key={index}
                                  src={image}
                                  alt={`評論圖片 ${index + 1}`}
                                  className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80"
                                />
                              ))}
                            </div>
                          )}
                        </div>

                        {review.responseFromGuide && (
                          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-4">
                            <div className="flex items-center mb-2">
                              <MessageCircle className="h-4 w-4 text-blue-600 mr-2" />
                              <span className="text-sm font-medium text-blue-800">地陪回覆</span>
                            </div>
                            <p className="text-gray-700 text-sm">{review.responseFromGuide}</p>
                          </div>
                        )}

                        {review.moderatorNote && (
                          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
                            <div className="flex items-center mb-2">
                              <Shield className="h-4 w-4 text-yellow-600 mr-2" />
                              <span className="text-sm font-medium text-yellow-800">審核備註</span>
                            </div>
                            <p className="text-gray-700 text-sm">{review.moderatorNote}</p>
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className={`font-medium ${getSentimentColor(review.sentiment)}`}>
                              {review.sentiment === 'POSITIVE' ? '正面評論' : 
                               review.sentiment === 'NEGATIVE' ? '負面評論' : '中性評論'}
                            </span>
                            {review.reportCount > 0 && (
                              <span className="text-red-600">
                                <Flag className="h-4 w-4 inline mr-1" />
                                {review.reportCount} 次檢舉
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      {review.status === 'PENDING' && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApproveReview(review.id)}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            通過
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setSelectedReview(review)
                              // 可以開啟拒絕對話框
                            }}
                          >
                            <X className="h-4 w-4 mr-2" />
                            拒絕
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        詳細
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {getReviewsByTab(activeTab).length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">沒有找到評論</h3>
                  <p className="text-gray-600">目前沒有符合篩選條件的評論</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Rejection Modal (you can implement this with a proper modal component) */}
      {selectedReview && selectedReview.status === 'PENDING' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>拒絕評論</CardTitle>
              <CardDescription>請提供拒絕理由（可選）</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="輸入拒絕理由..."
                value={moderatorNote}
                onChange={(e) => setModeratorNote(e.target.value)}
                rows={3}
              />
              <div className="flex space-x-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedReview(null)
                    setModeratorNote('')
                  }}
                >
                  取消
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleRejectReview(selectedReview.id)
                    setSelectedReview(null)
                  }}
                >
                  確認拒絕
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}