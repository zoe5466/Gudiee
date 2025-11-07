'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  MapPin, 
  Calendar, 
  Star, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  Shield,
  Bell,
  Search,
  ChevronDown,
  User,
  ArrowLeft,
  MessageCircle,
  FileCheck,
  UserCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useI18n } from '@/components/providers/i18n-provider'
import { LanguageSwitcher } from '@/components/i18n/language-switcher'

interface AdminLayoutProps {
  children: React.ReactNode
}

interface MenuItem {
  id: string
  label: string
  icon: React.ReactNode
  href: string
  badge?: number
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { t } = useI18n()
  const [user, setUser] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifications, setNotifications] = useState(3)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notificationList, setNotificationList] = useState<any[]>([])

  useEffect(() => {
    // 暫時跳過認證檢查，讓用戶能看到現代化設計
    console.log('Skipping auth check for demo purposes')
    setUser({ name: '演示管理員', email: 'demo@guidee.com', role: 'ADMIN' })
    fetchNotifications()
    // checkAuth()
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/admin/notifications')
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setNotificationList(result.notifications || [])
          setNotifications(result.unreadCount || 0)
        }
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }

  const handleNotificationClick = (notification: any) => {
    setShowNotifications(false)
    if (notification.action) {
      router.push(notification.action)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllAsRead: true })
      })
      setNotifications(0)
      setNotificationList(prev => prev.map(n => ({ ...n, read: true })))
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'chat':
        return 'bg-blue-500'
      case 'service':
        return 'bg-green-500'
      case 'booking':
        return 'bg-purple-500'
      case 'user':
        return 'bg-orange-500'
      default:
        return 'bg-gray-500'
    }
  }

  const formatNotificationTime = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diff = now.getTime() - time.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    
    if (minutes < 1) return '剛剛'
    if (minutes < 60) return `${minutes} 分鐘前`
    if (minutes < 1440) return `${Math.floor(minutes / 60)} 小時前`
    return time.toLocaleDateString()
  }

  const checkAuth = async () => {
    try {
      console.log('Starting auth check...')
      
      const response = await fetch('/api/auth/me', {
        credentials: 'include' // 確保發送cookies
      })
      
      console.log('Auth response status:', response.status)
      
      if (!response.ok) {
        console.log('Auth check failed with status:', response.status)
        alert(`認證失敗: ${response.status} - 請重新登入`)
        router.push('/admin/login')
        return
      }
      
      const result = await response.json()
      console.log('Auth check result:', result)
      
      // 處理API響應格式
      const userData = result.success ? result.data.user : result.user || result
      console.log('Extracted user data:', userData)
      
      if (!userData) {
        console.log('No user data found')
        alert('無法獲取用戶資料，請重新登入')
        router.push('/admin/login')
        return
      }
      
      if (userData.role !== 'ADMIN' && userData.role !== 'admin') {
        console.log('User role check failed:', userData?.role)
        alert(`權限不足: ${userData?.role} - 需要管理員權限`)
        router.push('/')
        return
      }
      
      setUser(userData)
      console.log('Auth check successful, user set:', userData)
    } catch (error) {
      console.error('Auth check failed with error:', error)
      const errorMessage = error instanceof Error ? error.message : '未知錯誤'
      alert('認證檢查時發生錯誤: ' + errorMessage)
      router.push('/admin/login')
    }
  }

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: t('admin.nav.dashboard'),
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: '/admin'
    },
    {
      id: 'users',
      label: t('admin.nav.users'),
      icon: <Users className="h-5 w-5" />,
      href: '/admin/users'
    },
    {
      id: 'guides',
      label: t('admin.nav.guides'),
      icon: <Shield className="h-5 w-5" />,
      href: '/admin/guides'
    },
    {
      id: 'kyc-review',
      label: t('admin.nav.kyc_review'),
      icon: <UserCheck className="h-5 w-5" />,
      href: '/admin/kyc-review'
    },
    {
      id: 'services',
      label: t('admin.nav.services'),
      icon: <MapPin className="h-5 w-5" />,
      href: '/admin/services',
      badge: 2
    },
    {
      id: 'bookings',
      label: t('admin.nav.bookings'),
      icon: <Calendar className="h-5 w-5" />,
      href: '/admin/bookings'
    },
    {
      id: 'chat',
      label: t('admin.nav.chat'),
      icon: <MessageCircle className="h-5 w-5" />,
      href: '/admin/chat',
      badge: 23
    },
    {
      id: 'reviews',
      label: t('admin.nav.reviews'),
      icon: <Star className="h-5 w-5" />,
      href: '/admin/reviews'
    },
    {
      id: 'analytics',
      label: t('admin.nav.analytics'),
      icon: <BarChart3 className="h-5 w-5" />,
      href: '/admin/analytics'
    },
    {
      id: 'settings',
      label: t('admin.nav.settings'),
      icon: <Settings className="h-5 w-5" />,
      href: '/admin/settings'
    }
  ]

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl transform transition-all duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 backdrop-blur-xl`}>
        {/* Logo */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-slate-700/50">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div className="ml-3">
              <span className="text-white font-bold text-xl tracking-tight">Guidee</span>
              <p className="text-slate-400 text-xs font-medium tracking-wider">ADMIN PANEL</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white hover:bg-slate-700 p-2 rounded-lg transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  router.push(item.href)
                  setSidebarOpen(false)
                }}
                className={`group w-full flex items-center justify-between px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-[0.98]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50 hover:transform hover:scale-[0.98]'
                } relative overflow-hidden`}
              >
                <div className="flex items-center relative z-10">
                  <div className={`p-1.5 rounded-lg ${
                    isActive(item.href) 
                      ? 'bg-white/20' 
                      : 'group-hover:bg-slate-600/50'
                  } transition-colors duration-200`}>
                    {item.icon}
                  </div>
                  <span className="ml-3 font-medium">{item.label}</span>
                </div>
                {item.badge && (
                  <Badge variant="destructive" className="text-xs bg-red-500 hover:bg-red-600 border-0 shadow-lg">
                    {item.badge}
                  </Badge>
                )}
                {isActive(item.href) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-100" />
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
          <div className="flex items-center bg-slate-700/30 rounded-xl p-3 hover:bg-slate-700/50 transition-all duration-200">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <User className="h-6 w-6 text-white" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-semibold text-white">
                {user?.userProfile?.name || user?.name || t('admin.common.role.admin')}
              </p>
              <p className="text-xs text-slate-400 font-medium">{user?.email}</p>
              <div className="flex items-center mt-1">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-xs text-green-400 font-medium">Online</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-all duration-200 group"
              title={t('admin.nav.logout')}
            >
              <LogOut className="h-5 w-5 group-hover:rotate-12 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-72">
        {/* Top Bar */}
        <header className="bg-white/95 shadow-sm border-b border-slate-200/50 h-20 flex items-center justify-between px-8 relative">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-600 hover:text-slate-900 hover:bg-slate-100 p-2 rounded-lg transition-all duration-200"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            {/* Search Bar */}
            <div className="ml-6 lg:ml-0 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder={t('admin.common.search')}
                className="block w-80 pl-12 pr-4 py-3 border-0 bg-slate-100/50 rounded-xl text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all duration-200 backdrop-blur-sm"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Language Switcher */}
            <div className="relative">
              <LanguageSwitcher variant="dropdown" showFlag={true} showNativeName={false} className="" />
            </div>
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-3 text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-xl transition-all duration-200 group"
              >
                <Bell className="h-5 w-5 group-hover:animate-pulse" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-red-600 text-xs font-bold text-white shadow-lg animate-bounce">
                    {notifications}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-[9999] max-h-96 overflow-y-auto">
                  <div className="p-4 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-900">通知中心</h3>
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        全部標為已讀
                      </button>
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notificationList.length > 0 ? (
                      notificationList.map((notification: any) => (
                        <div
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className="p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors"
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-full ${getNotificationIcon(notification.type)}`}>
                              {notification.type === 'chat' && <MessageCircle className="h-4 w-4 text-white" />}
                              {notification.type === 'service' && <Settings className="h-4 w-4 text-white" />}
                              {notification.type === 'booking' && <Calendar className="h-4 w-4 text-white" />}
                              {notification.type === 'user' && <Users className="h-4 w-4 text-white" />}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-slate-900">{notification.title}</h4>
                              <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
                              <p className="text-xs text-slate-500 mt-2">
                                {formatNotificationTime(notification.timestamp)}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-slate-500">
                        <Bell className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                        <p>沒有新通知</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/')}
              className="hidden md:flex bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-700 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 transition-all duration-200 rounded-xl px-4 py-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
{t('admin.common.return_home')}
            </Button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button className="flex items-center space-x-3 text-sm text-slate-700 hover:text-slate-900 focus:outline-none bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 rounded-xl p-2 transition-all duration-200 border border-slate-200 shadow-sm hover:shadow-md">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="font-semibold text-slate-800">{user?.name || t('admin.common.role.admin')}</p>
                  <p className="text-xs text-slate-500">{t('admin.common.role.admin')}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-500" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 bg-gradient-to-br from-slate-50/50 via-blue-50/30 to-indigo-50/50 min-h-screen">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}