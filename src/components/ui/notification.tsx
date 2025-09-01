'use client';

import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number; // in milliseconds, 0 means persistent
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationItemProps {
  notification: Notification;
  onDismiss: (id: string) => void;
}

function NotificationItem({ notification, onDismiss }: NotificationItemProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (notification.duration && notification.duration > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, notification.duration);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [notification.duration]);

  const handleDismiss = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onDismiss(notification.id);
    }, 300);
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle style={{ width: '1.25rem', height: '1.25rem', color: '#10b981' }} />;
      case 'error':
        return <AlertCircle style={{ width: '1.25rem', height: '1.25rem', color: '#ef4444' }} />;
      case 'warning':
        return <AlertTriangle style={{ width: '1.25rem', height: '1.25rem', color: '#f59e0b' }} />;
      case 'info':
        return <Info style={{ width: '1.25rem', height: '1.25rem', color: '#3b82f6' }} />;
    }
  };

  const getStyles = () => {
    const baseStyles = {
      backgroundColor: 'white',
      border: '1px solid',
      borderRadius: '0.75rem',
      padding: '1rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      maxWidth: '24rem',
      width: '100%',
      transform: isVisible && !isLeaving ? 'translateX(0)' : 'translateX(100%)',
      opacity: isVisible && !isLeaving ? 1 : 0,
      transition: 'all 0.3s ease-in-out',
      position: 'relative' as const
    };

    switch (notification.type) {
      case 'success':
        return { ...baseStyles, borderColor: '#10b981', backgroundColor: '#f0fdf4' };
      case 'error':
        return { ...baseStyles, borderColor: '#ef4444', backgroundColor: '#fef2f2' };
      case 'warning':
        return { ...baseStyles, borderColor: '#f59e0b', backgroundColor: '#fffbeb' };
      case 'info':
        return { ...baseStyles, borderColor: '#3b82f6', backgroundColor: '#eff6ff' };
    }
  };

  return (
    <div style={getStyles()}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
        {getIcon()}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4 style={{ 
            fontSize: '0.875rem', 
            fontWeight: '600', 
            color: '#111827',
            marginBottom: notification.message ? '0.25rem' : 0 
          }}>
            {notification.title}
          </h4>
          {notification.message && (
            <p style={{ 
              fontSize: '0.875rem', 
              color: '#6b7280',
              lineHeight: '1.4',
              marginBottom: notification.action ? '0.75rem' : 0 
            }}>
              {notification.message}
            </p>
          )}
          {notification.action && (
            <button
              onClick={notification.action.onClick}
              style={{
                padding: '0.375rem 0.75rem',
                backgroundColor: 'transparent',
                color: '#2563eb',
                border: '1px solid #2563eb',
                borderRadius: '0.375rem',
                fontSize: '0.75rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              className="hover:bg-blue-50"
            >
              {notification.action.label}
            </button>
          )}
        </div>
        <button
          onClick={handleDismiss}
          style={{
            padding: '0.25rem',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer',
            color: '#9ca3af',
            transition: 'color 0.2s'
          }}
          className="hover:text-gray-700"
        >
          <X style={{ width: '1rem', height: '1rem' }} />
        </button>
      </div>
    </div>
  );
}

interface NotificationContainerProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

export function NotificationContainer({ notifications, onDismiss }: NotificationContainerProps) {
  if (notifications.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '1rem',
      right: '1rem',
      zIndex: 50,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      pointerEvents: 'none'
    }}>
      {notifications.map(notification => (
        <div key={notification.id} style={{ pointerEvents: 'auto' }}>
          <NotificationItem 
            notification={notification} 
            onDismiss={onDismiss} 
          />
        </div>
      ))}
    </div>
  );
}

// Hook for managing notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration ?? 5000 // 預設5秒後自動消失
    };
    
    setNotifications(prev => [...prev, newNotification]);
    return id;
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  // Convenience methods
  const success = (title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({ type: 'success', title, message, ...options });
  };

  const error = (title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({ type: 'error', title, message, duration: 0, ...options }); // 錯誤通知預設不自動消失
  };

  const warning = (title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({ type: 'warning', title, message, ...options });
  };

  const info = (title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({ type: 'info', title, message, ...options });
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info
  };
}