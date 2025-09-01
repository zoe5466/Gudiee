'use client'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'outline' | 'secondary' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
}

const badgeVariants = {
  default: {
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: '1px solid #e5e7eb'
  },
  secondary: {
    backgroundColor: '#f1f5f9',
    color: '#475569',
    border: '1px solid #cbd5e1'
  },
  destructive: {
    backgroundColor: '#fef2f2',
    color: '#991b1b',
    border: '1px solid #fecaca'
  },
  success: {
    backgroundColor: '#f0fdf4',
    color: '#166534',
    border: '1px solid #bbf7d0'
  },
  warning: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
    border: '1px solid #fcd34d'
  },
  error: {
    backgroundColor: '#fef2f2',
    color: '#991b1b',
    border: '1px solid #fecaca'
  },
  info: {
    backgroundColor: '#eff6ff',
    color: '#1e40af',
    border: '1px solid #bfdbfe'
  },
  outline: {
    backgroundColor: 'transparent',
    color: '#374151',
    border: '1px solid #d1d5db'
  }
}

const badgeSizes = {
  sm: {
    fontSize: '0.75rem',
    padding: '0.125rem 0.5rem',
    borderRadius: '0.25rem'
  },
  md: {
    fontSize: '0.875rem',
    padding: '0.25rem 0.75rem',
    borderRadius: '0.375rem'
  },
  lg: {
    fontSize: '1rem',
    padding: '0.375rem 1rem',
    borderRadius: '0.5rem'
  }
}

export function Badge({ 
  children, 
  variant = 'default', 
  size = 'md',
  className = '',
  onClick 
}: BadgeProps) {
  const variantStyles = badgeVariants[variant]
  const sizeStyles = badgeSizes[size]
  
  const Component = onClick ? 'button' : 'span'
  
  return (
    <Component
      onClick={onClick}
      className={className}
      style={{
        ...variantStyles,
        ...sizeStyles,
        fontWeight: '500',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        whiteSpace: 'nowrap',
        transition: 'all 0.2s',
        cursor: onClick ? 'pointer' : 'default',
        border: variantStyles.border,
        ...(onClick && {
          ':hover': {
            opacity: 0.8
          }
        })
      }}
    >
      {children}
    </Component>
  )
}

// 預設的狀態徽章
export function StatusBadge({ status }: { status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'refunded' }) {
  const statusConfig = {
    pending: { variant: 'warning' as const, label: '待處理' },
    confirmed: { variant: 'info' as const, label: '已確認' },
    completed: { variant: 'success' as const, label: '已完成' },
    cancelled: { variant: 'error' as const, label: '已取消' },
    refunded: { variant: 'outline' as const, label: '已退款' }
  }
  
  const config = statusConfig[status]
  
  return (
    <Badge variant={config.variant} size="sm">
      {config.label}
    </Badge>
  )
}

// 評分徽章
export function RatingBadge({ rating }: { rating: number }) {
  const getVariant = (rating: number) => {
    if (rating >= 4.5) return 'success'
    if (rating >= 4.0) return 'info'
    if (rating >= 3.5) return 'warning'
    return 'error'
  }
  
  return (
    <Badge variant={getVariant(rating)} size="sm">
      ⭐ {rating.toFixed(1)}
    </Badge>
  )
}

// 語言徽章
export function LanguageBadge({ language }: { language: string }) {
  const languageEmojis: Record<string, string> = {
    '中文': '🇹🇼',
    '英文': '🇺🇸',
    '日文': '🇯🇵',
    '韓文': '🇰🇷',
    '法文': '🇫🇷',
    '德文': '🇩🇪',
    '西文': '🇪🇸'
  }
  
  return (
    <Badge variant="outline" size="sm">
      {languageEmojis[language] || '🌐'} {language}
    </Badge>
  )
}

// 服務類型徽章
export function ServiceTypeBadge({ type }: { type: string }) {
  const typeEmojis: Record<string, string> = {
    '導覽': '🗺️',
    '翻譯': '🗣️',
    '攝影': '📸',
    '購物': '🛍️',
    '美食': '🍜',
    '交通': '🚗',
    '住宿': '🏨'
  }
  
  return (
    <Badge variant="default" size="sm">
      {typeEmojis[type] || '📋'} {type}
    </Badge>
  )
}