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
  MessageCircle, 
  Search, 
  Send, 
  Filter, 
  Clock, 
  User, 
  CheckCircle,
  AlertCircle,
  Star,
  MoreHorizontal,
  Archive,
  Trash2,
  Eye,
  UserCheck,
  MessageSquare,
  TrendingUp,
  Users,
  Timer,
  Zap,
  RefreshCcw
} from 'lucide-react'

interface ChatMessage {
  id: string
  userId: string
  userType: 'USER' | 'GUIDE' | 'ADMIN'
  userName: string
  userAvatar?: string
  message: string
  timestamp: string
  status: 'SENT' | 'READ' | 'REPLIED'
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'
  category: 'GENERAL' | 'BOOKING' | 'PAYMENT' | 'COMPLAINT' | 'FEEDBACK'
  replies?: ChatReply[]
}

interface ChatReply {
  id: string
  adminId: string
  adminName: string
  message: string
  timestamp: string
}

interface ChatStats {
  totalChats: number
  unreadChats: number
  pendingChats: number
  resolvedChats: number
  averageResponseTime: string
  todayMessages: number
}

export default function ChatManagement() {
  const { t } = useI18n()
  const [chats, setChats] = useState<ChatMessage[]>([])
  const [stats, setStats] = useState<ChatStats>({
    totalChats: 0,
    unreadChats: 0,
    pendingChats: 0,
    resolvedChats: 0,
    averageResponseTime: '0 ' + t('admin.chat_management.minutes'),
    todayMessages: 0
  })
  const [selectedChat, setSelectedChat] = useState<ChatMessage | null>(null)
  const [replyMessage, setReplyMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'UNREAD' | 'PENDING' | 'RESOLVED'>('ALL')
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'GENERAL' | 'BOOKING' | 'PAYMENT' | 'COMPLAINT' | 'FEEDBACK'>('ALL')

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        await Promise.all([fetchChats(), fetchChatStats()])
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const fetchChats = async () => {
    try {
      const queryParams = new URLSearchParams()
      if (filterStatus !== 'ALL') queryParams.append('status', filterStatus)
      if (filterCategory !== 'ALL') queryParams.append('category', filterCategory)
      
      const response = await fetch(`/api/admin/chat?${queryParams}`)
      if (!response.ok) {
        throw new Error('Failed to fetch chats')
      }
      
      const result = await response.json()
      if (result.success) {
        setChats(result.chats || [])
        if (result.stats) {
          setStats(result.stats)
        }
      } else {
        console.error('API error:', result.error)
        // 如果API失敗，使用假資料作為備案
        const mockChats: ChatMessage[] = [
        {
          id: '1',
          userId: 'user1',
          userType: 'USER',
          userName: '張小明',
          userAvatar: '',
          message: '您好，我想詢問關於台北一日遊的服務，請問有什麼推薦的行程嗎？',
          timestamp: '2025-01-21T10:30:00Z',
          status: 'SENT',
          priority: 'NORMAL',
          category: 'GENERAL',
          replies: []
        },
        {
          id: '2',
          userId: 'user2',
          userType: 'USER',
          userName: '李美華',
          userAvatar: '',
          message: '我昨天預訂的服務還沒有收到確認，能幫我查看一下嗎？訂單編號是 #GD2025001',
          timestamp: '2025-01-21T09:15:00Z',
          status: 'READ',
          priority: 'HIGH',
          category: 'BOOKING',
          replies: [
            {
              id: 'reply1',
              adminId: 'admin1',
              adminName: '客服小王',
              message: '您好李小姐，我已經查到您的訂單，正在為您處理中，預計今天下午會有確認通知。',
              timestamp: '2025-01-21T09:45:00Z'
            }
          ]
        },
        {
          id: '3',
          userId: 'guide1',
          userType: 'GUIDE',
          userName: '陳導遊',
          userAvatar: '',
          message: '管理員您好，我想申請提高服務費用，因為最近油價上漲，希望能調整價格。',
          timestamp: '2025-01-21T08:20:00Z',
          status: 'REPLIED',
          priority: 'NORMAL',
          category: 'FEEDBACK',
          replies: []
        },
        {
          id: '4',
          userId: 'user4',
          userType: 'USER',
          userName: '王先生',
          userAvatar: '',
          message: '我對昨天的服務不太滿意，地陪遲到了30分鐘，希望能得到合理的處理。',
          timestamp: '2025-01-21T07:45:00Z',
          status: 'SENT',
          priority: 'URGENT',
          category: 'COMPLAINT',
          replies: []
        },
        {
          id: '5',
          userId: 'user5',
          userType: 'USER',
          userName: '劉小姐',
          userAvatar: '',
          message: '付款後一直沒有收到收據，請幫我處理一下，謝謝！',
          timestamp: '2025-01-20T16:30:00Z',
          status: 'READ',
          priority: 'HIGH',
          category: 'PAYMENT',
          replies: []
        }
      ]
        setChats(mockChats)
      }
    } catch (error) {
      console.error('Failed to fetch chats:', error)
      // 錯誤時使用假資料
      const mockChats: ChatMessage[] = [
        {
          id: '1',
          userId: 'user1',
          userType: 'USER',
          userName: '張小明',
          userAvatar: '',
          message: '您好，我想詢問關於台北一日遊的服務，請問有什麼推薦的行程嗎？',
          timestamp: '2025-01-21T10:30:00Z',
          status: 'SENT',
          priority: 'NORMAL',
          category: 'GENERAL',
          replies: []
        }
      ]
      setChats(mockChats)
    }
  }

  const fetchChatStats = async () => {
    try {
      // Mock stats
      setStats({
        totalChats: 127,
        unreadChats: 23,
        pendingChats: 15,
        resolvedChats: 89,
        averageResponseTime: '12 ' + t('admin.chat_management.minutes'),
        todayMessages: 34
      })
    } catch (error) {
      console.error('Failed to fetch chat stats:', error)
    }
  }

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !selectedChat) return

    try {
      const response = await fetch(`/api/admin/chat/${selectedChat.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: replyMessage
        })
      })

      if (!response.ok) {
        throw new Error('Failed to send reply')
      }

      const result = await response.json()
      if (result.success && result.reply) {
        // 更新本地狀態
        const updatedChats = chats.map(chat => {
          if (chat.id === selectedChat.id) {
            return {
              ...chat,
              status: 'REPLIED' as const,
              replies: [...(chat.replies || []), result.reply]
            }
          }
          return chat
        })

        setChats(updatedChats)
        setSelectedChat({
          ...selectedChat,
          status: 'REPLIED',
          replies: [...(selectedChat.replies || []), result.reply]
        })
        setReplyMessage('')
      } else {
        throw new Error(result.error || 'Failed to send reply')
      }
    } catch (error) {
      console.error('Failed to send reply:', error)
      alert('發送回覆失敗，請重試')
    }
  }

  const handleMarkAsRead = (chatId: string) => {
    const updatedChats = chats.map(chat => {
      if (chat.id === chatId && chat.status === 'SENT') {
        return { ...chat, status: 'READ' as const }
      }
      return chat
    })
    setChats(updatedChats)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-500'
      case 'HIGH': return 'bg-orange-500'
      case 'NORMAL': return 'bg-blue-500'
      case 'LOW': return 'bg-[#cfdbe9]0'
      default: return 'bg-[#cfdbe9]0'
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'GENERAL': return '一般詢問'
      case 'BOOKING': return '預訂相關'
      case 'PAYMENT': return '付款問題'
      case 'COMPLAINT': return '客訴'
      case 'FEEDBACK': return '建議回饋'
      default: return '其他'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SENT': return 'text-red-600 bg-red-50'
      case 'READ': return 'text-orange-600 bg-orange-50'
      case 'REPLIED': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-[#cfdbe9]'
    }
  }

  const filteredChats = chats.filter(chat => {
    const matchesSearch = chat.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         chat.message.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = filterStatus === 'ALL' || 
                         (filterStatus === 'UNREAD' && chat.status === 'SENT') ||
                         (filterStatus === 'PENDING' && chat.status === 'READ') ||
                         (filterStatus === 'RESOLVED' && chat.status === 'REPLIED')
    
    const matchesCategory = filterCategory === 'ALL' || chat.category === filterCategory

    return matchesSearch && matchesStatus && matchesCategory
  })

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
      <div className="bg-gradient-to-r from-white/90 to-purple-50/50 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-slate-200/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-purple-600 bg-clip-text text-transparent">{t('admin.chat_management.title')}</h1>
            <p className="text-slate-600 mt-3 text-lg">管理用戶諮詢、投訴和支援請求</p>
            <div className="flex items-center mt-4 text-sm text-slate-500">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <span>即時監控中</span>
              </div>
              <div className="ml-6 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>平均回覆時間：{stats.averageResponseTime}</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">{t('admin.chat_management.active_conversations')}</p>
                <p className="text-2xl font-bold">{stats.totalChats}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">{t('admin.chat_management.pending_messages')}</p>
                <p className="text-2xl font-bold">{stats.unreadChats}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">待處理</p>
                <p className="text-2xl font-bold">{stats.pendingChats}</p>
              </div>
              <Timer className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">已解決</p>
                <p className="text-2xl font-bold">{stats.resolvedChats}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">{t('admin.chat_management.avg_response_time')}</p>
                <p className="text-xl font-bold">{stats.averageResponseTime}</p>
              </div>
              <Zap className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm">今日訊息</p>
                <p className="text-2xl font-bold">{stats.todayMessages}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-indigo-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chat List */}
        <div className="lg:col-span-1">
          <Card className="h-[800px] flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold">對話列表</CardTitle>
                <Button size="sm" variant="outline" onClick={fetchChats}>
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  重新整理
                </Button>
              </div>
              
              {/* Search and Filters */}
              <div className="space-y-3 mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={t('admin.chat_management.search_conversations')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex space-x-2">
                  <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="flex-1 p-2 border border-gray-200 rounded-lg text-sm"
                  >
                    <option value="ALL">{t('admin.chat_management.all_status')}</option>
                    <option value="UNREAD">未讀</option>
                    <option value="PENDING">待處理</option>
                    <option value="RESOLVED">已解決</option>
                  </select>

                  <select 
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value as any)}
                    className="flex-1 p-2 border border-gray-200 rounded-lg text-sm"
                  >
                    <option value="ALL">所有分類</option>
                    <option value="GENERAL">一般詢問</option>
                    <option value="BOOKING">預訂相關</option>
                    <option value="PAYMENT">付款問題</option>
                    <option value="COMPLAINT">客訴</option>
                    <option value="FEEDBACK">建議回饋</option>
                  </select>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-0">
              <div className="space-y-2 p-4">
                {filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                      selectedChat?.id === chat.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      setSelectedChat(chat)
                      if (chat.status === 'SENT') {
                        handleMarkAsRead(chat.id)
                      }
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {chat.userName}
                            </p>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${chat.userType === 'GUIDE' ? 'border-green-500 text-green-700' : 'border-blue-500 text-blue-700'}`}
                            >
                              {chat.userType === 'GUIDE' ? '地陪' : '用戶'}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {getCategoryLabel(chat.category)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-2">
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(chat.priority)}`}></div>
                        <Badge className={`text-xs ${getStatusColor(chat.status)}`}>
                          {chat.status === 'SENT' ? '未讀' : chat.status === 'READ' ? '已讀' : '已回覆'}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                      {chat.message}
                    </p>
                    
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-gray-400">
                        {new Date(chat.timestamp).toLocaleString('zh-TW')}
                      </span>
                      {chat.replies && chat.replies.length > 0 && (
                        <span className="text-xs text-blue-600">
                          {chat.replies.length} 則回覆
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Detail */}
        <div className="lg:col-span-2">
          <Card className="h-[800px] flex flex-col">
            {selectedChat ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{selectedChat.userName}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {selectedChat.userType === 'GUIDE' ? '地陪' : '用戶'}
                          </Badge>
                          <Badge className={`text-xs ${getStatusColor(selectedChat.status)}`}>
                            {selectedChat.status === 'SENT' ? '未讀' : selectedChat.status === 'READ' ? '已讀' : '已回覆'}
                          </Badge>
                          <span className={`w-2 h-2 rounded-full ${getPriorityColor(selectedChat.priority)}`}></span>
                          <span className="text-xs text-gray-500">{getCategoryLabel(selectedChat.category)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Archive className="h-4 w-4 mr-2" />
                        封存
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        查看用戶
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-6">
                    {/* Original Message */}
                    <div className="bg-[#cfdbe9] rounded-2xl p-6">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-semibold text-gray-900">{selectedChat.userName}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(selectedChat.timestamp).toLocaleString('zh-TW')}
                            </span>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{selectedChat.message}</p>
                        </div>
                      </div>
                    </div>

                    {/* Replies */}
                    {selectedChat.replies?.map((reply) => (
                      <div key={reply.id} className="bg-blue-50 rounded-2xl p-6">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                            <UserCheck className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-semibold text-gray-900">{reply.adminName}</span>
                              <Badge variant="outline" className="text-xs border-green-500 text-green-700">
                                管理員
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {new Date(reply.timestamp).toLocaleString('zh-TW')}
                              </span>
                            </div>
                            <p className="text-gray-700 leading-relaxed">{reply.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>

                {/* Reply Input */}
                <div className="border-t p-6">
                  <div className="space-y-4">
                    <Textarea
                      placeholder={t('admin.chat_management.send_message')}
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      rows={3}
                      className="resize-none"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Archive className="h-4 w-4 mr-2" />
                          封存對話
                        </Button>
                        <Button size="sm" variant="outline">
  {t('admin.chat_management.resolve')}
                        </Button>
                      </div>
                      <Button onClick={handleSendReply} disabled={!replyMessage.trim()}>
                        <Send className="h-4 w-4 mr-2" />
                        發送回覆
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">選擇一個對話</h3>
                  <p className="text-sm">從左側選擇對話開始管理客戶服務</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}