// Guidee Service Worker for Push Notifications

const CACHE_NAME = 'guidee-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Cache opened');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Push event - handle incoming push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push received', event);
  
  let notificationData = {
    title: 'Guidee',
    body: '您有新的通知',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    image: null,
    tag: 'guidee-notification',
    data: {},
    actions: [],
    requireInteraction: false,
    silent: false
  };

  // Parse push data if available
  if (event.data) {
    try {
      const pushData = event.data.json();
      notificationData = {
        ...notificationData,
        ...pushData
      };
    } catch (error) {
      console.error('Service Worker: Error parsing push data', error);
      notificationData.body = event.data.text() || notificationData.body;
    }
  }

  // Add default actions based on notification type
  if (notificationData.data?.type) {
    switch (notificationData.data.type) {
      case 'booking_confirmed':
        notificationData.actions = [
          { action: 'view_booking', title: '查看預訂', icon: '/icons/view.png' },
          { action: 'contact_guide', title: '聯繫導遊', icon: '/icons/message.png' }
        ];
        break;
      case 'new_message':
        notificationData.actions = [
          { action: 'reply', title: '回覆', icon: '/icons/reply.png' },
          { action: 'view_chat', title: '查看對話', icon: '/icons/chat.png' }
        ];
        break;
      case 'payment_success':
        notificationData.actions = [
          { action: 'view_receipt', title: '查看收據', icon: '/icons/receipt.png' }
        ];
        break;
      case 'review_request':
        notificationData.actions = [
          { action: 'write_review', title: '撰寫評價', icon: '/icons/star.png' },
          { action: 'later', title: '稍後提醒', icon: '/icons/later.png' }
        ];
        break;
      case 'new_booking':
        notificationData.actions = [
          { action: 'accept_booking', title: '接受預訂', icon: '/icons/accept.png' },
          { action: 'view_details', title: '查看詳情', icon: '/icons/details.png' }
        ];
        break;
      default:
        notificationData.actions = [
          { action: 'view', title: '查看', icon: '/icons/view.png' }
        ];
    }
  }

  const promiseChain = self.registration.showNotification(
    notificationData.title,
    {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      image: notificationData.image,
      tag: notificationData.tag,
      data: notificationData.data,
      actions: notificationData.actions,
      requireInteraction: notificationData.requireInteraction,
      silent: notificationData.silent,
      vibrate: notificationData.silent ? [] : [200, 100, 200],
      timestamp: Date.now()
    }
  );

  event.waitUntil(promiseChain);
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked', event);
  
  event.notification.close();

  const action = event.action;
  const notificationData = event.notification.data || {};
  
  let url = '/';
  
  // Handle different actions
  switch (action) {
    case 'view_booking':
    case 'view_details':
      url = notificationData.url || '/my-bookings';
      break;
    case 'contact_guide':
    case 'reply':
    case 'view_chat':
      url = notificationData.url || '/chat';
      break;
    case 'view_receipt':
      url = notificationData.url || '/my-bookings';
      break;
    case 'write_review':
      url = notificationData.url || '/my-bookings';
      break;
    case 'accept_booking':
      url = notificationData.url || '/guide-dashboard';
      break;
    case 'later':
      // Schedule reminder (this would need backend support)
      return;
    default:
      // Default click action
      url = notificationData.url || '/';
  }

  // Open or focus the app window
  const promiseChain = clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  })
  .then((clientList) => {
    // Check if app is already open
    for (let client of clientList) {
      if (client.url.includes(self.location.origin)) {
        // Focus existing window and navigate to URL
        client.focus();
        return client.navigate(url);
      }
    }
    
    // Open new window if app is not open
    return clients.openWindow(url);
  });

  event.waitUntil(promiseChain);
});

// Notification close event
self.addEventListener('notificationclose', (event) => {
  console.log('Service Worker: Notification closed', event);
  
  // Track notification dismissal (optional)
  const notificationData = event.notification.data || {};
  if (notificationData.trackDismissal) {
    // Send analytics data to track dismissal rates
    fetch('/api/analytics/notification-dismissed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        notificationId: notificationData.id,
        tag: event.notification.tag,
        timestamp: Date.now()
      })
    }).catch(error => {
      console.log('Service Worker: Failed to track notification dismissal', error);
    });
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync', event);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Handle offline actions when connection is restored
    // This could include sending queued messages, updating booking status, etc.
    console.log('Service Worker: Performing background sync');
    
    // Example: Send queued chat messages
    const queuedMessages = await getQueuedMessages();
    for (const message of queuedMessages) {
      await sendMessage(message);
    }
    
  } catch (error) {
    console.error('Service Worker: Background sync failed', error);
  }
}

async function getQueuedMessages() {
  // Retrieve queued messages from IndexedDB or other storage
  return [];
}

async function sendMessage(message) {
  // Send message to server
  try {
    await fetch('/api/chat/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    });
  } catch (error) {
    console.error('Service Worker: Failed to send queued message', error);
  }
}

// Handle service worker updates
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Handle skip waiting
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});