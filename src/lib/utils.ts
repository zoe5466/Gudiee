// 通用工具函數庫
// 功能：提供應用程式中常用的工具函數，包含樣式合併、格式化、驗證、數據處理等
import { type ClassValue, clsx } from "clsx" // 條件式 class 名稱處理
import { twMerge } from "tailwind-merge" // Tailwind CSS 類別合併

/**
 * 合併 CSS 類別名稱
 * 結合 clsx 和 tailwind-merge 的功能，處理條件式類別和 Tailwind 衝突
 * @param inputs CSS 類別名稱
 * @returns 合併後的類別名稱字串
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 格式化貨幣
export function formatCurrency(amount: number, currency: string = 'TWD'): string {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// 格式化評分
export function formatRating(rating: number): string {
  return rating.toFixed(1)
}

// 計算時間差
export function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return '剛剛'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} 分鐘前`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} 小時前`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} 天前`
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} 個月前`
  return `${Math.floor(diffInSeconds / 31536000)} 年前`
}

// 格式化日期時間
export function formatDateTime(date: Date, locale: string = 'zh-TW'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

// 格式化日期
export function formatDate(date: Date, locale: string = 'zh-TW'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

// 生成隨機 ID
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

// 檢查是否為有效的 Email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 檢查是否為有效的手機號碼（台灣）
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^09\d{8}$/
  return phoneRegex.test(phone.replace(/\s+/g, ''))
}

// 格式化手機號碼
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 7)}-${cleaned.slice(7)}`
  }
  return phone
}

// URL slug 化
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

// 深度複製物件
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

// 防抖函數
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

// 節流函數
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// 計算距離（使用 Haversine 公式）
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // 地球半徑（公里）
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// 格式化檔案大小
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 檢查物件是否為空
export function isEmpty(obj: any): boolean {
  if (obj == null) return true
  if (typeof obj === 'string' || Array.isArray(obj)) return obj.length === 0
  if (typeof obj === 'object') return Object.keys(obj).length === 0
  return false
}

// 安全的 JSON 解析
export function safeJsonParse<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str)
  } catch {
    return fallback
  }
}

// 獲取瀏覽器語言
export function getBrowserLanguage(): string {
  if (typeof window !== 'undefined') {
    return navigator.language || 'zh-TW'
  }
  return 'zh-TW'
}

// 複製到剪貼簿
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

// 檢查是否為行動裝置
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768
}

// 平滑滾動到元素
export function scrollToElement(elementId: string, offset: number = 0): void {
  const element = document.getElementById(elementId)
  if (element) {
    const y = element.getBoundingClientRect().top + window.pageYOffset - offset
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}