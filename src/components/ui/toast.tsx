'use client'

import { useState, useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastProps {
  toast: Toast
  onClose: (id: string) => void
}

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const toastColors = {
  success: {
    bg: '#f0fdf4',
    border: '#bbf7d0',
    icon: '#16a34a',
    text: '#166534'
  },
  error: {
    bg: '#fef2f2',
    border: '#fecaca',
    icon: '#dc2626',
    text: '#991b1b'
  },
  warning: {
    bg: '#fffbeb',
    border: '#fed7aa',
    icon: '#ea580c',
    text: '#9a3412'
  },
  info: {
    bg: '#eff6ff',
    border: '#bfdbfe',
    icon: '#2563eb',
    text: '#1e40af'
  }
}

export function ToastComponent({ toast, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const Icon = toastIcons[toast.type]
  const colors = toastColors[toast.type]

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose(toast.id)
    }, 300)
  }

  useEffect(() => {
    setIsMounted(true)
    
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => {
          onClose(toast.id)
        }, 300)
      }, toast.duration)
      
      return () => clearTimeout(timer)
    }
    
    return undefined
  }, [toast.duration, toast.id, onClose])

  if (!isMounted) {
    return null
  }

  return (
    <div
      style={{
        transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
        opacity: isVisible ? 1 : 0,
        transition: 'all 0.3s ease-in-out',
        backgroundColor: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: '0.5rem',
        padding: '1rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        width: '100%',
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
        <Icon 
          style={{ 
            width: '20px', 
            height: '20px', 
            color: colors.icon,
            flexShrink: 0,
            marginTop: '0.125rem'
          }} 
        />
        
        <div style={{ flex: 1, minWidth: 0 }}>
          <div 
            style={{ 
              fontWeight: '600', 
              color: colors.text,
              marginBottom: toast.message ? '0.25rem' : 0
            }}
          >
            {toast.title}
          </div>
          
          {toast.message && (
            <div 
              style={{ 
                fontSize: '0.875rem',
                color: colors.text,
                opacity: 0.8,
                lineHeight: '1.4'
              }}
            >
              {toast.message}
            </div>
          )}
          
          {toast.action && (
            <button
              onClick={toast.action.onClick}
              style={{
                marginTop: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: colors.icon,
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0
              }}
              className="hover:underline"
            >
              {toast.action.label}
            </button>
          )}
        </div>
        
        <button
          onClick={handleClose}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '0.25rem',
            borderRadius: '0.25rem',
            color: colors.text,
            opacity: 0.5,
            flexShrink: 0
          }}
          className="hover:opacity-75"
        >
          <X style={{ width: '16px', height: '16px' }} />
        </button>
      </div>
    </div>
  )
}

// Toast Container
interface ToastContainerProps {
  toasts: Toast[]
  onClose: (id: string) => void
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div
      style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}
    >
      {toasts.map((toast) => (
        <ToastComponent
          key={toast.id}
          toast={toast}
          onClose={onClose}
        />
      ))}
    </div>
  )
}

// Hook for using toasts
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: Toast = {
      id,
      duration: 5000, // 預設 5 秒
      ...toast
    }
    
    setToasts(prev => [...prev, newToast])
    return id
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const success = (title: string, message?: string) => 
    addToast({ type: 'success', title, message })
  
  const error = (title: string, message?: string) => 
    addToast({ type: 'error', title, message })
  
  const warning = (title: string, message?: string) => 
    addToast({ type: 'warning', title, message })
  
  const info = (title: string, message?: string) => 
    addToast({ type: 'info', title, message })

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  }
}