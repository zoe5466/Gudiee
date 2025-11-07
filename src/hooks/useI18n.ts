import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { useLocalStorage } from './useLocalStorage';

// 支援的語言
export type SupportedLocale = 'zh-TW' | 'zh-CN' | 'en' | 'ja' | 'ko';

// 翻譯鍵值類型
export type TranslationKey = keyof Translations;

// 翻譯資源接口
interface Translations {
  // 通用
  'common.loading': string;
  'common.error': string;
  'common.success': string;
  'common.cancel': string;
  'common.confirm': string;
  'common.save': string;
  'common.edit': string;
  'common.delete': string;
  'common.search': string;
  'common.filter': string;
  'common.sort': string;
  'common.back': string;
  'common.next': string;
  'common.previous': string;
  'common.submit': string;
  'common.reset': string;
  
  // 導航
  'nav.home': string;
  'nav.search': string;
  'nav.bookings': string;
  'nav.profile': string;
  'nav.login': string;
  'nav.register': string;
  'nav.logout': string;
  'nav.dashboard': string;
  
  // 認證
  'auth.login.title': string;
  'auth.login.email': string;
  'auth.login.password': string;
  'auth.login.submit': string;
  'auth.login.forgot_password': string;
  'auth.register.title': string;
  'auth.register.name': string;
  'auth.register.email': string;
  'auth.register.password': string;
  'auth.register.role': string;
  'auth.register.traveler': string;
  'auth.register.guide': string;
  'auth.register.submit': string;
  
  // 搜尋
  'search.title': string;
  'search.location': string;
  'search.date': string;
  'search.guests': string;
  'search.price_range': string;
  'search.rating': string;
  'search.category': string;
  'search.no_results': string;
  'search.destination': string;
  'search.departure_date': string;
  'search.return_date': string;
  'search.departure_placeholder': string;
  'search.return_placeholder': string;
  
  // 預訂
  'booking.title': string;
  'booking.details': string;
  'booking.payment': string;
  'booking.confirmation': string;
  'booking.guest_info': string;
  'booking.special_requests': string;
  'booking.total': string;
  'booking.book_now': string;
  
  // 評價
  'review.title': string;
  'review.rating': string;
  'review.comment': string;
  'review.submit': string;
  'review.reply': string;
  
  // 錯誤訊息
  'error.network': string;
  'error.unauthorized': string;
  'error.not_found': string;
  'error.validation': string;
  'error.server': string;
  
  // 成功訊息
  'success.login': string;
  'success.register': string;
  'success.booking': string;
  'success.payment': string;
  'success.review': string;

  // 管理面板
  'admin.title': string;
  'admin.welcome': string;
  'admin.description': string;
  'admin.system_status': string;
  'admin.last_updated': string;
  
  // 管理面板導航
  'admin.nav.dashboard': string;
  'admin.nav.users': string;
  'admin.nav.guides': string;
  'admin.nav.services': string;
  'admin.nav.bookings': string;
  'admin.nav.reviews': string;
  'admin.nav.chat': string;
  'admin.nav.analytics': string;
  'admin.nav.settings': string;
  'admin.nav.logout': string;
  'admin.nav.cms': string;
  'admin.nav.user_management': string;
  'admin.nav.guide_management': string;
  'admin.nav.booking_management': string;
  'admin.nav.review_management': string;
  'admin.nav.chat_management': string;
  'admin.nav.kyc_review': string;
  
  // 管理面板通用
  'admin.common.loading': string;
  'admin.common.return_home': string;
  'admin.common.search': string;
  'admin.common.role.admin': string;
  
  // 管理面板統計
  'admin.stats.total_users': string;
  'admin.stats.total_services': string;
  'admin.stats.total_bookings': string;
  'admin.stats.total_revenue': string;
  'admin.stats.monthly_growth': string;
  'admin.stats.pending_services': string;
  'admin.stats.active_bookings': string;
  'admin.stats.average_rating': string;
  
  // 用戶管理
  'admin.user_management.title': string;
  'admin.user_management.description': string;
  'admin.user_management.user': string;
  'admin.user_management.view_manage': string;
  
  // 服務管理
  'admin.service_management.title': string;
  'admin.service_management.description': string;
  'admin.service_management.service': string;
  'admin.service_management.pending': string;
  'admin.service_management.manage_services': string;
  
  // 預訂管理
  'admin.booking_management.title': string;
  'admin.booking_management.description': string;
  'admin.booking_management.booking': string;
  'admin.booking_management.in_progress': string;
  'admin.booking_management.manage_bookings': string;
  
  // 客服管理
  'admin.chat_management.title': string;
  'admin.chat_management.admin': string;
  'admin.chat_management.active_conversations': string;
  'admin.chat_management.pending_messages': string;
  'admin.chat_management.avg_response_time': string;
  'admin.chat_management.minutes': string;
  'admin.chat_management.search_conversations': string;
  'admin.chat_management.all_status': string;
  'admin.chat_management.send_message': string;
  'admin.chat_management.resolve': string;
  
  // CMS 管理
  'admin.cms.title': string;
  'admin.cms.description': string;
  'admin.cms.total_content': string;
  'admin.cms.published_content': string;
  'admin.cms.draft_content': string;
  'admin.cms.monthly_views': string;
  'admin.cms.popular_content': string;
  'admin.cms.overview': string;
  'admin.cms.content_management': string;
  'admin.cms.analytics': string;
  'admin.cms.system_settings': string;
  'admin.cms.analytics_coming_soon': string;
  'admin.cms.analytics_description': string;
  'admin.cms.settings_coming_soon': string;
  'admin.cms.settings_description': string;
  
  // 評論管理
  'admin.review_management.title': string;
  'admin.review_management.total_reviews': string;
  'admin.review_management.pending_reviews': string;
  'admin.review_management.search_reviews': string;
  'admin.review_management.all_status': string;
  'admin.review_management.pending': string;
  'admin.review_management.approved': string;
  'admin.review_management.rejected': string;
  'admin.review_management.flagged': string;
}

// 翻譯資源
const translations: Record<SupportedLocale, Translations> = {
  'zh-TW': {
    // 通用
    'common.loading': '載入中...',
    'common.error': '錯誤',
    'common.success': '成功',
    'common.cancel': '取消',
    'common.confirm': '確認',
    'common.save': '儲存',
    'common.edit': '編輯',
    'common.delete': '刪除',
    'common.search': '搜尋',
    'common.filter': '篩選',
    'common.sort': '排序',
    'common.back': '返回',
    'common.next': '下一步',
    'common.previous': '上一步',
    'common.submit': '提交',
    'common.reset': '重設',
    
    // 導航
    'nav.home': '首頁',
    'nav.search': '搜尋',
    'nav.bookings': '我的預訂',
    'nav.profile': '個人資料',
    'nav.login': '登入',
    'nav.register': '註冊',
    'nav.logout': '登出',
    'nav.dashboard': '控制台',
    
    // 認證
    'auth.login.title': '登入帳戶',
    'auth.login.email': '電子郵件',
    'auth.login.password': '密碼',
    'auth.login.submit': '登入',
    'auth.login.forgot_password': '忘記密碼？',
    'auth.register.title': '建立帳戶',
    'auth.register.name': '姓名',
    'auth.register.email': '電子郵件',
    'auth.register.password': '密碼',
    'auth.register.role': '角色',
    'auth.register.traveler': '旅客',
    'auth.register.guide': '導遊',
    'auth.register.submit': '註冊',
    
    // 搜尋
    'search.title': '搜尋導遊服務',
    'search.location': '地點',
    'search.date': '日期',
    'search.guests': '人數',
    'search.price_range': '價格範圍',
    'search.rating': '評分',
    'search.category': '類別',
    'search.no_results': '找不到符合條件的服務',
    'search.destination': '目的地',
    'search.departure_date': '出發',
    'search.return_date': '回程',
    'search.departure_placeholder': '選擇出發日期',
    'search.return_placeholder': '選擇回程日期',
    
    // 預訂
    'booking.title': '預訂服務',
    'booking.details': '預訂詳情',
    'booking.payment': '付款',
    'booking.confirmation': '確認',
    'booking.guest_info': '聯絡資訊',
    'booking.special_requests': '特殊要求',
    'booking.total': '總計',
    'booking.book_now': '立即預訂',
    
    // 評價
    'review.title': '用戶評價',
    'review.rating': '評分',
    'review.comment': '評價內容',
    'review.submit': '提交評價',
    'review.reply': '回覆',
    
    // 錯誤訊息
    'error.network': '網路連線錯誤',
    'error.unauthorized': '未授權訪問',
    'error.not_found': '找不到資源',
    'error.validation': '輸入資料無效',
    'error.server': '伺服器錯誤',
    
    // 成功訊息
    'success.login': '登入成功',
    'success.register': '註冊成功',
    'success.booking': '預訂成功',
    'success.payment': '付款成功',
    'success.review': '評價提交成功',

    // 管理面板
    'admin.title': '管理控制台',
    'admin.welcome': '歡迎回來',
    'admin.description': '系統運行正常，所有服務運作良好',
    'admin.system_status': '系統狀態正常',
    'admin.last_updated': '最後更新時間',
    
    // 管理面板導航
    'admin.nav.dashboard': '儀表板',
    'admin.nav.users': '用戶',
    'admin.nav.guides': '地陪',
    'admin.nav.services': '服務',
    'admin.nav.bookings': '預訂',
    'admin.nav.reviews': '評論',
    'admin.nav.chat': '客服',
    'admin.nav.analytics': '數據分析',
    'admin.nav.settings': '設定',
    'admin.nav.logout': '登出',
    'admin.nav.cms': '內容管理',
    'admin.nav.user_management': '用戶管理',
    'admin.nav.guide_management': '地陪管理',
    'admin.nav.booking_management': '預訂管理',
    'admin.nav.review_management': '評論管理',
    'admin.nav.chat_management': '客服管理',
    'admin.nav.kyc_review': '資格審核',
    
    // 管理面板通用
    'admin.common.loading': '載入中...',
    'admin.common.return_home': '返回首頁',
    'admin.common.search': '搜尋...',
    'admin.common.role.admin': '管理員',
    
    // 管理面板統計
    'admin.stats.total_users': '總用戶數',
    'admin.stats.total_services': '總服務數',
    'admin.stats.total_bookings': '總預訂數',
    'admin.stats.total_revenue': '總營收',
    'admin.stats.monthly_growth': '月成長率',
    'admin.stats.pending_services': '待審核',
    'admin.stats.active_bookings': '進行中',
    'admin.stats.average_rating': '平均評分',
    
    // 用戶管理
    'admin.user_management.title': '用戶管理',
    'admin.user_management.description': '管理註冊用戶與地陪資料',
    'admin.user_management.user': '用戶',
    'admin.user_management.view_manage': '查看和管理',
    
    // 服務管理
    'admin.service_management.title': '服務管理',
    'admin.service_management.description': '審核和管理地陪服務',
    'admin.service_management.service': '服務',
    'admin.service_management.pending': '待審核',
    'admin.service_management.manage_services': '管理服務',
    
    // 預訂管理
    'admin.booking_management.title': '預訂管理',
    'admin.booking_management.description': '處理用戶預訂',
    'admin.booking_management.booking': '預訂',
    'admin.booking_management.in_progress': '進行中',
    'admin.booking_management.manage_bookings': '管理預訂',
    
    // 客服管理
    'admin.chat_management.title': '客服管理',
    'admin.chat_management.admin': '客服人員',
    'admin.chat_management.active_conversations': '進行中對話',
    'admin.chat_management.pending_messages': '待回覆訊息',
    'admin.chat_management.avg_response_time': '平均回覆時間',
    'admin.chat_management.minutes': '分鐘',
    'admin.chat_management.search_conversations': '搜尋對話...',
    'admin.chat_management.all_status': '所有狀態',
    'admin.chat_management.send_message': '輸入回覆訊息...',
    'admin.chat_management.resolve': '標記為已解決',
    
    // CMS 管理
    'admin.cms.title': '內容管理系統',
    'admin.cms.description': '管理網站內容、文章和媒體資源',
    'admin.cms.total_content': '總內容數',
    'admin.cms.published_content': '已發布內容',
    'admin.cms.draft_content': '草稿內容',
    'admin.cms.monthly_views': '月瀏覽量',
    'admin.cms.popular_content': '熱門內容',
    'admin.cms.overview': '總覽',
    'admin.cms.content_management': '內容管理',
    'admin.cms.analytics': '數據分析',
    'admin.cms.system_settings': '系統設定',
    'admin.cms.analytics_coming_soon': '數據分析即將推出',
    'admin.cms.analytics_description': '詳細的流量和用戶行為分析功能正在開發中',
    'admin.cms.settings_coming_soon': '系統設定即將推出',
    'admin.cms.settings_description': '網站配置和系統參數設定功能正在開發中',
    
    // 評論管理
    'admin.review_management.title': '評論管理',
    'admin.review_management.total_reviews': '總評論數',
    'admin.review_management.pending_reviews': '待審核評論',
    'admin.review_management.search_reviews': '搜尋評論...',
    'admin.review_management.all_status': '全部狀態',
    'admin.review_management.pending': '待審核',
    'admin.review_management.approved': '已批准',
    'admin.review_management.rejected': '已拒絕',
    'admin.review_management.flagged': '已舉報'
  },
  
  'zh-CN': {
    // 通用
    'common.loading': '加载中...',
    'common.error': '错误',
    'common.success': '成功',
    'common.cancel': '取消',
    'common.confirm': '确认',
    'common.save': '保存',
    'common.edit': '编辑',
    'common.delete': '删除',
    'common.search': '搜索',
    'common.filter': '筛选',
    'common.sort': '排序',
    'common.back': '返回',
    'common.next': '下一步',
    'common.previous': '上一步',
    'common.submit': '提交',
    'common.reset': '重置',
    
    // 导航
    'nav.home': '首页',
    'nav.search': '搜索',
    'nav.bookings': '我的预订',
    'nav.profile': '个人资料',
    'nav.login': '登录',
    'nav.register': '注册',
    'nav.logout': '退出',
    'nav.dashboard': '控制台',
    
    // 认证
    'auth.login.title': '登录账户',
    'auth.login.email': '电子邮箱',
    'auth.login.password': '密码',
    'auth.login.submit': '登录',
    'auth.login.forgot_password': '忘记密码？',
    'auth.register.title': '创建账户',
    'auth.register.name': '姓名',
    'auth.register.email': '电子邮箱',
    'auth.register.password': '密码',
    'auth.register.role': '角色',
    'auth.register.traveler': '旅客',
    'auth.register.guide': '导游',
    'auth.register.submit': '注册',
    
    // 搜索
    'search.title': '搜索导游服务',
    'search.location': '地点',
    'search.date': '日期',
    'search.guests': '人数',
    'search.price_range': '价格范围',
    'search.rating': '评分',
    'search.category': '类别',
    'search.no_results': '找不到符合条件的服务',
    'search.destination': '目的地',
    'search.departure_date': '出发',
    'search.return_date': '返回',
    'search.departure_placeholder': '选择出发日期',
    'search.return_placeholder': '选择返回日期',
    
    // 预订
    'booking.title': '预订服务',
    'booking.details': '预订详情',
    'booking.payment': '付款',
    'booking.confirmation': '确认',
    'booking.guest_info': '联系信息',
    'booking.special_requests': '特殊要求',
    'booking.total': '总计',
    'booking.book_now': '立即预订',
    
    // 评价
    'review.title': '用户评价',
    'review.rating': '评分',
    'review.comment': '评价内容',
    'review.submit': '提交评价',
    'review.reply': '回复',
    
    // 错误信息
    'error.network': '网络连接错误',
    'error.unauthorized': '未授权访问',
    'error.not_found': '找不到资源',
    'error.validation': '输入数据无效',
    'error.server': '服务器错误',
    
    // 成功信息
    'success.login': '登录成功',
    'success.register': '注册成功',
    'success.booking': '预订成功',
    'success.payment': '付款成功',
    'success.review': '评价提交成功',

    // 管理面板
    'admin.title': '管理控制台',
    'admin.welcome': '欢迎回来',
    'admin.description': '系统运行正常，所有服务运作良好',
    'admin.system_status': '系统状态正常',
    'admin.last_updated': '最后更新时间',
    
    // 管理面板导航
    'admin.nav.dashboard': '仪表板',
    'admin.nav.users': '用户',
    'admin.nav.guides': '导游',
    'admin.nav.services': '服务',
    'admin.nav.bookings': '预订',
    'admin.nav.reviews': '评论',
    'admin.nav.chat': '客服',
    'admin.nav.analytics': '数据分析',
    'admin.nav.settings': '设置',
    'admin.nav.logout': '登出',
    'admin.nav.cms': '内容管理',
    'admin.nav.user_management': '用户管理',
    'admin.nav.guide_management': '导游管理',
    'admin.nav.booking_management': '预订管理',
    'admin.nav.review_management': '评论管理',
    'admin.nav.chat_management': '客服管理',
    'admin.nav.kyc_review': '资格审核',
    
    // 管理面板通用
    'admin.common.loading': '加载中...',
    'admin.common.return_home': '返回首页',
    'admin.common.search': '搜索...',
    'admin.common.role.admin': '管理员',
    
    // 管理面板统计
    'admin.stats.total_users': '总用户数',
    'admin.stats.total_services': '总服务数',
    'admin.stats.total_bookings': '总预订数',
    'admin.stats.total_revenue': '总营收',
    'admin.stats.monthly_growth': '月增长率',
    'admin.stats.pending_services': '待审核',
    'admin.stats.active_bookings': '进行中',
    'admin.stats.average_rating': '平均评分',
    
    // 用户管理
    'admin.user_management.title': '用户管理',
    'admin.user_management.description': '管理注册用户与导游资料',
    'admin.user_management.user': '用户',
    'admin.user_management.view_manage': '查看和管理',
    
    // 服务管理
    'admin.service_management.title': '服务管理',
    'admin.service_management.description': '审核和管理导游服务',
    'admin.service_management.service': '服务',
    'admin.service_management.pending': '待审核',
    'admin.service_management.manage_services': '管理服务',
    
    // 预订管理
    'admin.booking_management.title': '预订管理',
    'admin.booking_management.description': '处理用户预订',
    'admin.booking_management.booking': '预订',
    'admin.booking_management.in_progress': '进行中',
    'admin.booking_management.manage_bookings': '管理预订',
    
    // 客服管理
    'admin.chat_management.title': '客服管理',
    'admin.chat_management.admin': '客服人员',
    'admin.chat_management.active_conversations': '进行中对话',
    'admin.chat_management.pending_messages': '待回复消息',
    'admin.chat_management.avg_response_time': '平均回复时间',
    'admin.chat_management.minutes': '分钟',
    'admin.chat_management.search_conversations': '搜索对话...',
    'admin.chat_management.all_status': '所有状态',
    'admin.chat_management.send_message': '输入回复消息...',
    'admin.chat_management.resolve': '标记为已解决',
    
    // CMS 管理
    'admin.cms.title': '内容管理系统',
    'admin.cms.description': '管理网站内容、文章和媒体资源',
    'admin.cms.total_content': '总内容数',
    'admin.cms.published_content': '已发布内容',
    'admin.cms.draft_content': '草稿内容',
    'admin.cms.monthly_views': '月浏览量',
    'admin.cms.popular_content': '热门内容',
    'admin.cms.overview': '总览',
    'admin.cms.content_management': '内容管理',
    'admin.cms.analytics': '数据分析',
    'admin.cms.system_settings': '系统设置',
    'admin.cms.analytics_coming_soon': '数据分析即将推出',
    'admin.cms.analytics_description': '详细的流量和用户行为分析功能正在开发中',
    'admin.cms.settings_coming_soon': '系统设置即将推出',
    'admin.cms.settings_description': '网站配置和系统参数设置功能正在开发中',
    
    // 评论管理
    'admin.review_management.title': '评论管理',
    'admin.review_management.total_reviews': '总评论数',
    'admin.review_management.pending_reviews': '待审核评论',
    'admin.review_management.search_reviews': '搜索评论...',
    'admin.review_management.all_status': '全部状态',
    'admin.review_management.pending': '待审核',
    'admin.review_management.approved': '已批准',
    'admin.review_management.rejected': '已拒绝',
    'admin.review_management.flagged': '已举报'
  },
  
  'en': {
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.submit': 'Submit',
    'common.reset': 'Reset',
    
    // Navigation
    'nav.home': 'Home',
    'nav.search': 'Search',
    'nav.bookings': 'My Bookings',
    'nav.profile': 'Profile',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.logout': 'Logout',
    'nav.dashboard': 'Dashboard',
    
    // Authentication
    'auth.login.title': 'Login to Account',
    'auth.login.email': 'Email',
    'auth.login.password': 'Password',
    'auth.login.submit': 'Login',
    'auth.login.forgot_password': 'Forgot Password?',
    'auth.register.title': 'Create Account',
    'auth.register.name': 'Name',
    'auth.register.email': 'Email',
    'auth.register.password': 'Password',
    'auth.register.role': 'Role',
    'auth.register.traveler': 'Traveler',
    'auth.register.guide': 'Guide',
    'auth.register.submit': 'Register',
    
    // Search
    'search.title': 'Search Guide Services',
    'search.location': 'Location',
    'search.date': 'Date',
    'search.guests': 'Guests',
    'search.price_range': 'Price Range',
    'search.rating': 'Rating',
    'search.category': 'Category',
    'search.no_results': 'No services found',
    'search.destination': 'Destination',
    'search.departure_date': 'Departure',
    'search.return_date': 'Return',
    'search.departure_placeholder': 'Select departure date',
    'search.return_placeholder': 'Select return date',
    
    // Booking
    'booking.title': 'Book Service',
    'booking.details': 'Booking Details',
    'booking.payment': 'Payment',
    'booking.confirmation': 'Confirmation',
    'booking.guest_info': 'Contact Information',
    'booking.special_requests': 'Special Requests',
    'booking.total': 'Total',
    'booking.book_now': 'Book Now',
    
    // Reviews
    'review.title': 'Reviews',
    'review.rating': 'Rating',
    'review.comment': 'Comment',
    'review.submit': 'Submit Review',
    'review.reply': 'Reply',
    
    // Error messages
    'error.network': 'Network connection error',
    'error.unauthorized': 'Unauthorized access',
    'error.not_found': 'Resource not found',
    'error.validation': 'Invalid input data',
    'error.server': 'Server error',
    
    // Success messages
    'success.login': 'Login successful',
    'success.register': 'Registration successful',
    'success.booking': 'Booking successful',
    'success.payment': 'Payment successful',
    'success.review': 'Review submitted successfully',

    // Admin Panel
    'admin.title': 'Admin Panel',
    'admin.welcome': 'Welcome back',
    'admin.description': 'System running smoothly, all services operational',
    'admin.system_status': 'System Status Online',
    'admin.last_updated': 'Last Updated',
    
    // Admin Navigation
    'admin.nav.dashboard': 'Dashboard',
    'admin.nav.users': 'Users',
    'admin.nav.guides': 'Guides',
    'admin.nav.services': 'Services',
    'admin.nav.bookings': 'Bookings',
    'admin.nav.reviews': 'Reviews',
    'admin.nav.chat': 'Support',
    'admin.nav.analytics': 'Analytics',
    'admin.nav.settings': 'Settings',
    'admin.nav.logout': 'Logout',
    'admin.nav.cms': 'Content Management',
    'admin.nav.user_management': 'User Management',
    'admin.nav.guide_management': 'Guide Management',
    'admin.nav.booking_management': 'Booking Management',
    'admin.nav.review_management': 'Review Management',
    'admin.nav.chat_management': 'Customer Support',
    'admin.nav.kyc_review': 'KYC Review',
    
    // Admin Common
    'admin.common.loading': 'Loading...',
    'admin.common.return_home': 'Return Home',
    'admin.common.search': 'Search...',
    'admin.common.role.admin': 'Administrator',
    
    // Admin Stats
    'admin.stats.total_users': 'Total Users',
    'admin.stats.total_services': 'Total Services',
    'admin.stats.total_bookings': 'Total Bookings',
    'admin.stats.total_revenue': 'Total Revenue',
    'admin.stats.monthly_growth': 'Monthly Growth',
    'admin.stats.pending_services': 'Pending',
    'admin.stats.active_bookings': 'Active',
    'admin.stats.average_rating': 'Avg Rating',
    
    // User Management
    'admin.user_management.title': 'User Management',
    'admin.user_management.description': 'Manage registered users and guides',
    'admin.user_management.user': 'Users',
    'admin.user_management.view_manage': 'View & Manage',
    
    // Service Management
    'admin.service_management.title': 'Service Management',
    'admin.service_management.description': 'Review and manage guide services',
    'admin.service_management.service': 'Services',
    'admin.service_management.pending': 'Pending',
    'admin.service_management.manage_services': 'Manage Services',
    
    // Booking Management
    'admin.booking_management.title': 'Booking Management',
    'admin.booking_management.description': 'Handle user bookings',
    'admin.booking_management.booking': 'Bookings',
    'admin.booking_management.in_progress': 'In Progress',
    'admin.booking_management.manage_bookings': 'Manage Bookings',
    
    // Chat Management
    'admin.chat_management.title': 'Customer Support',
    'admin.chat_management.admin': 'Support Agent',
    'admin.chat_management.active_conversations': 'Active Conversations',
    'admin.chat_management.pending_messages': 'Pending Messages',
    'admin.chat_management.avg_response_time': 'Avg Response Time',
    'admin.chat_management.minutes': 'minutes',
    'admin.chat_management.search_conversations': 'Search conversations...',
    'admin.chat_management.all_status': 'All Status',
    'admin.chat_management.send_message': 'Enter reply message...',
    'admin.chat_management.resolve': 'Mark as Resolved',
    
    // CMS Management
    'admin.cms.title': 'Content Management System',
    'admin.cms.description': 'Manage website content, articles and media resources',
    'admin.cms.total_content': 'Total Content',
    'admin.cms.published_content': 'Published Content',
    'admin.cms.draft_content': 'Draft Content',
    'admin.cms.monthly_views': 'Monthly Views',
    'admin.cms.popular_content': 'Popular Content',
    'admin.cms.overview': 'Overview',
    'admin.cms.content_management': 'Content Management',
    'admin.cms.analytics': 'Analytics',
    'admin.cms.system_settings': 'System Settings',
    'admin.cms.analytics_coming_soon': 'Analytics Coming Soon',
    'admin.cms.analytics_description': 'Detailed traffic and user behavior analysis features are in development',
    'admin.cms.settings_coming_soon': 'Settings Coming Soon',
    'admin.cms.settings_description': 'Website configuration and system parameter settings are in development',
    
    // Review Management
    'admin.review_management.title': 'Review Management',
    'admin.review_management.total_reviews': 'Total Reviews',
    'admin.review_management.pending_reviews': 'Pending Reviews',
    'admin.review_management.search_reviews': 'Search reviews...',
    'admin.review_management.all_status': 'All Status',
    'admin.review_management.pending': 'Pending',
    'admin.review_management.approved': 'Approved',
    'admin.review_management.rejected': 'Rejected',
    'admin.review_management.flagged': 'Flagged'
  },
  
  'ja': {
    // 共通
    'common.loading': '読み込み中...',
    'common.error': 'エラー',
    'common.success': '成功',
    'common.cancel': 'キャンセル',
    'common.confirm': '確認',
    'common.save': '保存',
    'common.edit': '編集',
    'common.delete': '削除',
    'common.search': '検索',
    'common.filter': 'フィルター',
    'common.sort': '並び替え',
    'common.back': '戻る',
    'common.next': '次へ',
    'common.previous': '前へ',
    'common.submit': '送信',
    'common.reset': 'リセット',
    
    // ナビゲーション
    'nav.home': 'ホーム',
    'nav.search': '検索',
    'nav.bookings': 'マイ予約',
    'nav.profile': 'プロフィール',
    'nav.login': 'ログイン',
    'nav.register': '登録',
    'nav.logout': 'ログアウト',
    'nav.dashboard': 'ダッシュボード',
    
    // 認証
    'auth.login.title': 'アカウントにログイン',
    'auth.login.email': 'メールアドレス',
    'auth.login.password': 'パスワード',
    'auth.login.submit': 'ログイン',
    'auth.login.forgot_password': 'パスワードを忘れた方',
    'auth.register.title': 'アカウントを作成',
    'auth.register.name': '名前',
    'auth.register.email': 'メールアドレス',
    'auth.register.password': 'パスワード',
    'auth.register.role': '役割',
    'auth.register.traveler': '旅行者',
    'auth.register.guide': 'ガイド',
    'auth.register.submit': '登録',
    
    // 検索
    'search.title': 'ガイドサービスを検索',
    'search.location': '場所',
    'search.date': '日付',
    'search.guests': '人数',
    'search.price_range': '価格帯',
    'search.rating': '評価',
    'search.category': 'カテゴリ',
    'search.no_results': '条件に合うサービスが見つかりません',
    'search.destination': '目的地',
    'search.departure_date': '出発',
    'search.return_date': '戻り',
    'search.departure_placeholder': '出発日を選択',
    'search.return_placeholder': '戻り日を選択',
    
    // 予約
    'booking.title': 'サービスを予約',
    'booking.details': '予約詳細',
    'booking.payment': '支払い',
    'booking.confirmation': '確認',
    'booking.guest_info': '連絡先情報',
    'booking.special_requests': '特別な要望',
    'booking.total': '合計',
    'booking.book_now': '今すぐ予約',
    
    // レビュー
    'review.title': 'ユーザーレビュー',
    'review.rating': '評価',
    'review.comment': 'コメント',
    'review.submit': 'レビューを送信',
    'review.reply': '返信',
    
    // エラーメッセージ
    'error.network': 'ネットワーク接続エラー',
    'error.unauthorized': '認証されていないアクセス',
    'error.not_found': 'リソースが見つかりません',
    'error.validation': '入力データが無効です',
    'error.server': 'サーバーエラー',
    
    // 成功メッセージ
    'success.login': 'ログイン成功',
    'success.register': '登録成功',
    'success.booking': '予約成功',
    'success.payment': '支払い成功',
    'success.review': 'レビューの送信が完了しました',

    // 管理パネル
    'admin.title': '管理パネル',
    'admin.welcome': 'おかえりなさい',
    'admin.description': 'システムは正常に動作しており、すべてのサービスが稼働しています',
    'admin.system_status': 'システム状態オンライン',
    'admin.last_updated': '最終更新',
    
    // 管理パネルナビゲーション
    'admin.nav.dashboard': 'ダッシュボード',
    'admin.nav.users': 'ユーザー',
    'admin.nav.guides': 'ガイド',
    'admin.nav.services': 'サービス',
    'admin.nav.bookings': '予約',
    'admin.nav.reviews': 'レビュー',
    'admin.nav.chat': 'サポート',
    'admin.nav.analytics': 'アナリティクス',
    'admin.nav.settings': '設定',
    'admin.nav.logout': 'ログアウト',
    'admin.nav.cms': 'コンテンツ管理',
    'admin.nav.user_management': 'ユーザー管理',
    'admin.nav.guide_management': 'ガイド管理',
    'admin.nav.booking_management': '予約管理',
    'admin.nav.review_management': 'レビュー管理',
    'admin.nav.chat_management': 'カスタマーサポート',
    'admin.nav.kyc_review': '資格審査',
    
    // 管理パネル共通
    'admin.common.loading': '読み込み中...',
    'admin.common.return_home': 'ホームに戻る',
    'admin.common.search': '検索...',
    'admin.common.role.admin': '管理者',
    
    // 管理パネル統計
    'admin.stats.total_users': '総ユーザー数',
    'admin.stats.total_services': '総サービス数',
    'admin.stats.total_bookings': '総予約数',
    'admin.stats.total_revenue': '総収益',
    'admin.stats.monthly_growth': '月次成長率',
    'admin.stats.pending_services': '承認待ち',
    'admin.stats.active_bookings': 'アクティブ',
    'admin.stats.average_rating': '平均評価',
    
    // ユーザー管理
    'admin.user_management.title': 'ユーザー管理',
    'admin.user_management.description': '登録ユーザーとガイドを管理',
    'admin.user_management.user': 'ユーザー',
    'admin.user_management.view_manage': '表示と管理',
    
    // サービス管理
    'admin.service_management.title': 'サービス管理',
    'admin.service_management.description': 'ガイドサービスの審査と管理',
    'admin.service_management.service': 'サービス',
    'admin.service_management.pending': '承認待ち',
    'admin.service_management.manage_services': 'サービス管理',
    
    // 予約管理
    'admin.booking_management.title': '予約管理',
    'admin.booking_management.description': 'ユーザー予約の処理',
    'admin.booking_management.booking': '予約',
    'admin.booking_management.in_progress': '進行中',
    'admin.booking_management.manage_bookings': '予約管理',
    
    // チャット管理
    'admin.chat_management.title': 'カスタマーサポート',
    'admin.chat_management.admin': 'サポートエージェント',
    'admin.chat_management.active_conversations': 'アクティブな会話',
    'admin.chat_management.pending_messages': '返信待ちメッセージ',
    'admin.chat_management.avg_response_time': '平均返信時間',
    'admin.chat_management.minutes': '分',
    'admin.chat_management.search_conversations': '会話を検索...',
    'admin.chat_management.all_status': 'すべてのステータス',
    'admin.chat_management.send_message': '返信メッセージを入力...',
    'admin.chat_management.resolve': '解決済みとしてマーク',
    
    // CMS管理
    'admin.cms.title': 'コンテンツ管理システム',
    'admin.cms.description': 'ウェブサイトコンテンツ、記事、メディアリソースを管理',
    'admin.cms.total_content': '総コンテンツ数',
    'admin.cms.published_content': '公開済みコンテンツ',
    'admin.cms.draft_content': '下書きコンテンツ',
    'admin.cms.monthly_views': '月間ビュー数',
    'admin.cms.popular_content': '人気コンテンツ',
    'admin.cms.overview': '概要',
    'admin.cms.content_management': 'コンテンツ管理',
    'admin.cms.analytics': 'アナリティクス',
    'admin.cms.system_settings': 'システム設定',
    'admin.cms.analytics_coming_soon': 'アナリティクス機能は近日公開',
    'admin.cms.analytics_description': '詳細なトラフィックとユーザー行動分析機能を開発中',
    'admin.cms.settings_coming_soon': '設定機能は近日公開',
    'admin.cms.settings_description': 'ウェブサイト設定とシステムパラメータ設定機能を開発中',
    
    // レビュー管理
    'admin.review_management.title': 'レビュー管理',
    'admin.review_management.total_reviews': '総レビュー数',
    'admin.review_management.pending_reviews': '承認待ちレビュー',
    'admin.review_management.search_reviews': 'レビューを検索...',
    'admin.review_management.all_status': 'すべてのステータス',
    'admin.review_management.pending': '承認待ち',
    'admin.review_management.approved': '承認済み',
    'admin.review_management.rejected': '拒否済み',
    'admin.review_management.flagged': 'フラグ付き'
  },
  
  'ko': {
    // 공통
    'common.loading': '로딩 중...',
    'common.error': '오류',
    'common.success': '성공',
    'common.cancel': '취소',
    'common.confirm': '확인',
    'common.save': '저장',
    'common.edit': '편집',
    'common.delete': '삭제',
    'common.search': '검색',
    'common.filter': '필터',
    'common.sort': '정렬',
    'common.back': '뒤로',
    'common.next': '다음',
    'common.previous': '이전',
    'common.submit': '제출',
    'common.reset': '재설정',
    
    // 내비게이션
    'nav.home': '홈',
    'nav.search': '검색',
    'nav.bookings': '내 예약',
    'nav.profile': '프로필',
    'nav.login': '로그인',
    'nav.register': '회원가입',
    'nav.logout': '로그아웃',
    'nav.dashboard': '대시보드',
    
    // 인증
    'auth.login.title': '계정에 로그인',
    'auth.login.email': '이메일',
    'auth.login.password': '비밀번호',
    'auth.login.submit': '로그인',
    'auth.login.forgot_password': '비밀번호를 잊으셨나요?',
    'auth.register.title': '계정 만들기',
    'auth.register.name': '이름',
    'auth.register.email': '이메일',
    'auth.register.password': '비밀번호',
    'auth.register.role': '역할',
    'auth.register.traveler': '여행자',
    'auth.register.guide': '가이드',
    'auth.register.submit': '회원가입',
    
    // 검색
    'search.title': '가이드 서비스 검색',
    'search.location': '위치',
    'search.date': '날짜',
    'search.guests': '인원',
    'search.price_range': '가격 범위',
    'search.rating': '평점',
    'search.category': '카테고리',
    'search.no_results': '조건에 맞는 서비스를 찾을 수 없습니다',
    'search.destination': '목적지',
    'search.departure_date': '출발',
    'search.return_date': '돌아옴',
    'search.departure_placeholder': '출발 날짜 선택',
    'search.return_placeholder': '돌아오는 날짜 선택',
    
    // 예약
    'booking.title': '서비스 예약',
    'booking.details': '예약 세부사항',
    'booking.payment': '결제',
    'booking.confirmation': '확인',
    'booking.guest_info': '연락처 정보',
    'booking.special_requests': '특별 요청',
    'booking.total': '총계',
    'booking.book_now': '지금 예약',
    
    // 리뷰
    'review.title': '사용자 리뷰',
    'review.rating': '평점',
    'review.comment': '댓글',
    'review.submit': '리뷰 제출',
    'review.reply': '답글',
    
    // 오류 메시지
    'error.network': '네트워크 연결 오류',
    'error.unauthorized': '권한이 없는 접근',
    'error.not_found': '리소스를 찾을 수 없음',
    'error.validation': '잘못된 입력 데이터',
    'error.server': '서버 오류',
    
    // 성공 메시지
    'success.login': '로그인 성공',
    'success.register': '회원가입 성공',
    'success.booking': '예약 성공',
    'success.payment': '결제 성공',
    'success.review': '리뷰가 성공적으로 제출되었습니다',

    // 관리 패널
    'admin.title': '관리 패널',
    'admin.welcome': '다시 오신 것을 환영합니다',
    'admin.description': '시스템이 원활하게 실행 중이며 모든 서비스가 작동 중입니다',
    'admin.system_status': '시스템 상태 온라인',
    'admin.last_updated': '마지막 업데이트',
    
    // 관리 패널 네비게이션
    'admin.nav.dashboard': '대시보드',
    'admin.nav.users': '사용자',
    'admin.nav.guides': '가이드',
    'admin.nav.services': '서비스',
    'admin.nav.bookings': '예약',
    'admin.nav.reviews': '리뷰',
    'admin.nav.chat': '지원',
    'admin.nav.analytics': '분석',
    'admin.nav.settings': '설정',
    'admin.nav.logout': '로그아웃',
    'admin.nav.cms': '콘텐츠 관리',
    'admin.nav.user_management': '사용자 관리',
    'admin.nav.guide_management': '가이드 관리',
    'admin.nav.booking_management': '예약 관리',
    'admin.nav.review_management': '리뷰 관리',
    'admin.nav.chat_management': '고객 지원',
    'admin.nav.kyc_review': '신원 확인 심사',
    
    // 관리 패널 공통
    'admin.common.loading': '로딩 중...',
    'admin.common.return_home': '홈으로 돌아가기',
    'admin.common.search': '검색...',
    'admin.common.role.admin': '관리자',
    
    // 관리 패널 통계
    'admin.stats.total_users': '총 사용자 수',
    'admin.stats.total_services': '총 서비스 수',
    'admin.stats.total_bookings': '총 예약 수',
    'admin.stats.total_revenue': '총 수익',
    'admin.stats.monthly_growth': '월간 성장률',
    'admin.stats.pending_services': '승인 대기 중',
    'admin.stats.active_bookings': '활성',
    'admin.stats.average_rating': '평균 평점',
    
    // 사용자 관리
    'admin.user_management.title': '사용자 관리',
    'admin.user_management.description': '등록된 사용자와 가이드 관리',
    'admin.user_management.user': '사용자',
    'admin.user_management.view_manage': '보기 및 관리',
    
    // 서비스 관리
    'admin.service_management.title': '서비스 관리',
    'admin.service_management.description': '가이드 서비스 검토 및 관리',
    'admin.service_management.service': '서비스',
    'admin.service_management.pending': '승인 대기 중',
    'admin.service_management.manage_services': '서비스 관리',
    
    // 예약 관리
    'admin.booking_management.title': '예약 관리',
    'admin.booking_management.description': '사용자 예약 처리',
    'admin.booking_management.booking': '예약',
    'admin.booking_management.in_progress': '진행 중',
    'admin.booking_management.manage_bookings': '예약 관리',
    
    // 채팅 관리
    'admin.chat_management.title': '고객 지원',
    'admin.chat_management.admin': '지원 담당자',
    'admin.chat_management.active_conversations': '활성 대화',
    'admin.chat_management.pending_messages': '답변 대기 메시지',
    'admin.chat_management.avg_response_time': '평균 응답 시간',
    'admin.chat_management.minutes': '분',
    'admin.chat_management.search_conversations': '대화 검색...',
    'admin.chat_management.all_status': '모든 상태',
    'admin.chat_management.send_message': '답변 메시지 입력...',
    'admin.chat_management.resolve': '해결됨으로 표시',
    
    // CMS 관리
    'admin.cms.title': '콘텐츠 관리 시스템',
    'admin.cms.description': '웹사이트 콘텐츠, 기사 및 미디어 리소스 관리',
    'admin.cms.total_content': '총 콘텐츠 수',
    'admin.cms.published_content': '게시된 콘텐츠',
    'admin.cms.draft_content': '임시 저장 콘텐츠',
    'admin.cms.monthly_views': '월간 조회수',
    'admin.cms.popular_content': '인기 콘텐츠',
    'admin.cms.overview': '개요',
    'admin.cms.content_management': '콘텐츠 관리',
    'admin.cms.analytics': '분석',
    'admin.cms.system_settings': '시스템 설정',
    'admin.cms.analytics_coming_soon': '분석 기능 곧 출시',
    'admin.cms.analytics_description': '상세한 트래픽 및 사용자 행동 분석 기능을 개발 중입니다',
    'admin.cms.settings_coming_soon': '설정 기능 곧 출시',
    'admin.cms.settings_description': '웹사이트 구성 및 시스템 매개변수 설정 기능을 개발 중입니다',
    
    // 리뷰 관리
    'admin.review_management.title': '리뷰 관리',
    'admin.review_management.total_reviews': '총 리뷰 수',
    'admin.review_management.pending_reviews': '승인 대기 리뷰',
    'admin.review_management.search_reviews': '리뷰 검색...',
    'admin.review_management.all_status': '모든 상태',
    'admin.review_management.pending': '승인 대기 중',
    'admin.review_management.approved': '승인됨',
    'admin.review_management.rejected': '거부됨',
    'admin.review_management.flagged': '신고됨'
  }
};

// 國際化上下文
interface I18nContextType {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  formatDate: (date: Date) => string;
  formatNumber: (number: number) => string;
  formatCurrency: (amount: number, currency?: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

// 國際化 Hook
export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

// 國際化 Hook 實現
export function useI18nState(defaultLocale: SupportedLocale = 'zh-TW'): I18nContextType {
  const [locale, setLocaleStorage] = useLocalStorage<SupportedLocale>('guidee-locale', defaultLocale);
  
  // 設定語言
  const setLocale = useCallback((newLocale: SupportedLocale) => {
    setLocaleStorage(newLocale);
    
    // 更新 HTML lang 屬性
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLocale;
    }
  }, [setLocaleStorage]);

  // 翻譯函式
  const t = useCallback((key: TranslationKey, params?: Record<string, string | number>): string => {
    const translation = translations[locale]?.[key] || translations['zh-TW'][key] || key;
    
    // 參數替換
    if (params) {
      return Object.entries(params).reduce((str, [paramKey, value]) => {
        return str.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(value));
      }, translation);
    }
    
    return translation;
  }, [locale]);

  // 日期格式化
  const formatDate = useCallback((date: Date): string => {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }, [locale]);

  // 數字格式化
  const formatNumber = useCallback((number: number): string => {
    return new Intl.NumberFormat(locale).format(number);
  }, [locale]);

  // 貨幣格式化
  const formatCurrency = useCallback((amount: number, currency: string = 'TWD'): string => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount);
  }, [locale]);

  // 初始化時設定 HTML lang 屬性
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  return {
    locale,
    setLocale,
    t,
    formatDate,
    formatNumber,
    formatCurrency
  };
}

// 語言資訊
export const localeInfo: Record<SupportedLocale, { name: string; nativeName: string; flag: string }> = {
  'zh-TW': { name: 'Traditional Chinese', nativeName: '繁體中文', flag: '🇹🇼' },
  'zh-CN': { name: 'Simplified Chinese', nativeName: '简体中文', flag: '🇨🇳' },
  'en': { name: 'English', nativeName: 'English', flag: '🇺🇸' },
  'ja': { name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  'ko': { name: 'Korean', nativeName: '한국어', flag: '🇰🇷' }
};

// 瀏覽器語言檢測
export function detectBrowserLocale(): SupportedLocale {
  if (typeof navigator === 'undefined') return 'zh-TW';
  
  const browserLang = navigator.language || (navigator as any).userLanguage;
  
  // 精確匹配
  if (Object.keys(localeInfo).includes(browserLang)) {
    return browserLang as SupportedLocale;
  }
  
  // 語言碼匹配（例如 en-US 匹配 en）
  const langCode = browserLang.split('-')[0];
  const matchedLocale = Object.keys(localeInfo).find(locale => 
    locale.startsWith(langCode)
  );
  
  return (matchedLocale as SupportedLocale) || 'zh-TW';
}

// RTL 語言檢測
export function isRTLLocale(locale: SupportedLocale): boolean {
  const rtlLocales: SupportedLocale[] = []; // 目前支援的語言都是 LTR
  return rtlLocales.includes(locale);
}