import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/store/auth';

interface PushNotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  tag?: string;
  data?: any;
  requireInteraction?: boolean;
  silent?: boolean;
}

interface NotificationPermissionState {
  permission: NotificationPermission;
  isSupported: boolean;
  isSubscribed: boolean;
}

export function usePushNotifications() {
  const { user } = useAuth();
  const [state, setState] = useState<NotificationPermissionState>({
    permission: 'default',
    isSupported: false,
    isSubscribed: false
  });

  // 檢查瀏覽器支援
  useEffect(() => {
    const isSupported = 'Notification' in window && 'serviceWorker' in navigator;
    const permission = isSupported ? Notification.permission : 'denied';
    
    setState(prev => ({
      ...prev,
      isSupported,
      permission
    }));
  }, []);

  // 註冊 Service Worker
  useEffect(() => {
    if (!state.isSupported) return;

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker 註冊成功:', registration);
        
        // 檢查是否已訂閱推送
        const subscription = await registration.pushManager.getSubscription();
        setState(prev => ({
          ...prev,
          isSubscribed: !!subscription
        }));
      } catch (error) {
        console.error('Service Worker 註冊失敗:', error);
      }
    };

    registerServiceWorker();
  }, [state.isSupported]);

  // 請求通知權限
  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!state.isSupported) {
      throw new Error('瀏覽器不支援推送通知');
    }

    try {
      const permission = await Notification.requestPermission();
      setState(prev => ({ ...prev, permission }));
      return permission;
    } catch (error) {
      console.error('請求通知權限失敗:', error);
      throw error;
    }
  }, [state.isSupported]);

  // 訂閱推送通知
  const subscribe = useCallback(async () => {
    if (!state.isSupported || state.permission !== 'granted') {
      throw new Error('無法訂閱推送通知：權限被拒絕或不支援');
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      
      // 檢查是否已經訂閱
      let subscription = await registration.pushManager.getSubscription();
      
      if (!subscription) {
        // 創建新的訂閱
        const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 'demo-key';
        
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: vapidPublicKey
        });
      }

      // 將訂閱資訊發送到伺服器
      if (user) {
        await fetch('/api/notifications/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.id}` // 假設有認證
          },
          body: JSON.stringify({
            subscription,
            userId: user.id
          })
        });
      }

      setState(prev => ({ ...prev, isSubscribed: true }));
      return subscription;
    } catch (error) {
      console.error('訂閱推送通知失敗:', error);
      throw error;
    }
  }, [state.isSupported, state.permission, user]);

  // 取消訂閱
  const unsubscribe = useCallback(async () => {
    if (!state.isSupported) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
        
        // 通知伺服器取消訂閱
        if (user) {
          await fetch('/api/notifications/unsubscribe', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.id}`
            },
            body: JSON.stringify({
              userId: user.id
            })
          });
        }
      }

      setState(prev => ({ ...prev, isSubscribed: false }));
    } catch (error) {
      console.error('取消訂閱失敗:', error);
      throw error;
    }
  }, [state.isSupported, user]);

  // 發送本地通知
  const sendLocalNotification = useCallback((options: PushNotificationOptions) => {
    if (!state.isSupported || state.permission !== 'granted') {
      console.warn('無法發送通知：權限被拒絕或不支援');
      return undefined;
    }

    try {
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/icon-192x192.png',
        badge: options.badge || '/badge-72x72.png',
        tag: options.tag,
        data: options.data,
        requireInteraction: options.requireInteraction || false,
        silent: options.silent || false
      });

      // 設定點擊事件
      notification.onclick = (event) => {
        event.preventDefault();
        window.focus();
        
        // 根據 data 中的資訊導航
        if (options.data?.url) {
          window.location.href = options.data.url;
        }
        
        notification.close();
      };

      // 自動關閉（除非 requireInteraction 為 true）
      if (!options.requireInteraction) {
        setTimeout(() => {
          notification.close();
        }, 5000);
      }

      return notification;
    } catch (error) {
      console.error('發送本地通知失敗:', error);
      return undefined;
    }
  }, [state.isSupported, state.permission]);

  // 預設通知類型
  const notificationTemplates = {
    bookingConfirmed: (bookingId: string, guideName: string) => ({
      title: '預訂確認',
      body: `您的預訂已被 ${guideName} 確認！`,
      icon: '/icons/booking-confirmed.png',
      tag: `booking-${bookingId}`,
      data: { 
        type: 'booking_confirmed',
        bookingId,
        url: `/my-bookings`
      },
      requireInteraction: true
    }),

    newMessage: (senderName: string) => ({
      title: '新訊息',
      body: `${senderName} 發送了一條新訊息`,
      icon: '/icons/message.png',
      tag: 'new-message',
      data: { 
        type: 'new_message',
        url: `/messages`
      }
    }),

    paymentSuccess: (amount: number) => ({
      title: '付款成功',
      body: `您的付款 NT$ ${amount.toLocaleString()} 已成功處理`,
      icon: '/icons/payment-success.png',
      tag: 'payment-success',
      data: { 
        type: 'payment_success',
        url: `/my-bookings`
      }
    }),

    reviewRequest: (serviceName: string) => ({
      title: '評價邀請',
      body: `請為您的 ${serviceName} 體驗留下評價`,
      icon: '/icons/review.png',
      tag: 'review-request',
      data: { 
        type: 'review_request',
        url: `/my-bookings`
      }
    }),

    guideNewBooking: (travelerName: string, serviceTitle: string) => ({
      title: '新預訂請求',
      body: `${travelerName} 預訂了您的「${serviceTitle}」服務`,
      icon: '/icons/new-booking.png',
      tag: 'new-booking',
      data: { 
        type: 'new_booking',
        url: `/guide-dashboard`
      },
      requireInteraction: true
    })
  };

  // 便捷方法
  const sendBookingConfirmation = useCallback((bookingId: string, guideName: string) => {
    const options = notificationTemplates.bookingConfirmed(bookingId, guideName);
    return sendLocalNotification(options);
  }, [sendLocalNotification]);

  const sendNewMessageNotification = useCallback((senderName: string) => {
    const options = notificationTemplates.newMessage(senderName);
    return sendLocalNotification(options);
  }, [sendLocalNotification]);

  const sendPaymentSuccessNotification = useCallback((amount: number) => {
    const options = notificationTemplates.paymentSuccess(amount);
    return sendLocalNotification(options);
  }, [sendLocalNotification]);

  const sendReviewRequestNotification = useCallback((serviceName: string) => {
    const options = notificationTemplates.reviewRequest(serviceName);
    return sendLocalNotification(options);
  }, [sendLocalNotification]);

  const sendGuideNewBookingNotification = useCallback((travelerName: string, serviceTitle: string) => {
    const options = notificationTemplates.guideNewBooking(travelerName, serviceTitle);
    return sendLocalNotification(options);
  }, [sendLocalNotification]);

  return {
    // 狀態
    permission: state.permission,
    isSupported: state.isSupported,
    isSubscribed: state.isSubscribed,
    
    // 基本方法
    requestPermission,
    subscribe,
    unsubscribe,
    sendLocalNotification,
    
    // 便捷方法
    sendBookingConfirmation,
    sendNewMessageNotification,
    sendPaymentSuccessNotification,
    sendReviewRequestNotification,
    sendGuideNewBookingNotification,
    
    // 模板
    notificationTemplates
  };
}