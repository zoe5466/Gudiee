// 通知服務
// 功能：處理訂單相關的通知發送

import { Order } from '@/types/order';

export interface NotificationData {
  to: string;
  subject: string;
  message: string;
  type: 'email' | 'sms' | 'push';
  orderId: string;
}

// 通知模板
const notificationTemplates = {
  orderCreated: {
    customer: {
      subject: '預訂確認 - 訂單 #{orderNumber}',
      message: `您好 {customerName}，\n\n您的預訂已成功創建。\n\n訂單編號：{orderNumber}\n服務：{serviceName}\n日期：{bookingDate}\n金額：NT$ {totalAmount}\n\n我們將盡快與您聯繫確認詳細資訊。\n\nGuidee 團隊`
    },
    guide: {
      subject: '新預訂通知 - 訂單 #{orderNumber}',
      message: `您好 {guideName}，\n\n您收到了一個新的預訂請求。\n\n訂單編號：{orderNumber}\n服務：{serviceName}\n客戶：{customerName}\n日期：{bookingDate}\n人數：{participants}人\n\n請登入系統確認或拒絕此預訂。\n\nGuidee 團隊`
    }
  },
  orderConfirmed: {
    customer: {
      subject: '預訂已確認 - 訂單 #{orderNumber}',
      message: `您好 {customerName}，\n\n您的預訂已被導遊確認！\n\n訂單編號：{orderNumber}\n服務：{serviceName}\n導遊：{guideName}\n日期：{bookingDate}\n集合地點：{meetingPoint}\n\n導遊聯絡方式：{guideContact}\n\n期待為您提供優質的服務體驗！\n\nGuidee 團隊`
    }
  },
  paymentCompleted: {
    customer: {
      subject: '支付成功 - 訂單 #{orderNumber}',
      message: `您好 {customerName}，\n\n您的支付已成功完成。\n\n訂單編號：{orderNumber}\n交易編號：{transactionId}\n支付金額：NT$ {totalAmount}\n\n您的預訂已確保，期待為您提供服務！\n\nGuidee 團隊`
    },
    guide: {
      subject: '客戶已付款 - 訂單 #{orderNumber}',
      message: `您好 {guideName}，\n\n客戶已完成支付。\n\n訂單編號：{orderNumber}\n客戶：{customerName}\n服務日期：{bookingDate}\n\n請準備提供優質服務。\n\nGuidee 團隊`
    }
  },
  orderCancelled: {
    customer: {
      subject: '預訂已取消 - 訂單 #{orderNumber}',
      message: `您好 {customerName}，\n\n您的預訂已取消。\n\n訂單編號：{orderNumber}\n取消原因：{cancellationReason}\n退款金額：NT$ {refundAmount}\n\n如有疑問，請聯繫客服。\n\nGuidee 團隊`
    },
    guide: {
      subject: '預訂已取消 - 訂單 #{orderNumber}',
      message: `您好 {guideName}，\n\n預訂已被取消。\n\n訂單編號：{orderNumber}\n客戶：{customerName}\n取消原因：{cancellationReason}\n\nGuidee 團隊`
    }
  }
};

// 模擬通知發送（實際應該整合真實的通知服務）
class NotificationService {
  // 發送郵件通知
  private async sendEmail(notification: NotificationData): Promise<boolean> {
    console.log('📧 Email notification sent:', {
      to: notification.to,
      subject: notification.subject,
      orderId: notification.orderId
    });
    
    // 在實際應用中，這裡應該整合真實的郵件服務
    // 例如：SendGrid, AWS SES, 或 Nodemailer
    
    return true;
  }

  // 發送簡訊通知
  private async sendSMS(notification: NotificationData): Promise<boolean> {
    console.log('📱 SMS notification sent:', {
      to: notification.to,
      message: notification.message.substring(0, 100) + '...',
      orderId: notification.orderId
    });
    
    // 在實際應用中，這裡應該整合真實的簡訊服務
    // 例如：Twilio, AWS SNS
    
    return true;
  }

  // 發送推播通知
  private async sendPush(notification: NotificationData): Promise<boolean> {
    console.log('🔔 Push notification sent:', {
      to: notification.to,
      subject: notification.subject,
      orderId: notification.orderId
    });
    
    // 在實際應用中，這裡應該整合推播服務
    // 例如：Firebase Cloud Messaging
    
    return true;
  }

  // 替換模板變數
  private replaceTemplateVariables(template: string, data: Record<string, any>): string {
    let result = template;
    
    Object.keys(data).forEach(key => {
      const placeholder = `{${key}}`;
      result = result.replace(new RegExp(placeholder, 'g'), data[key] || '');
    });
    
    return result;
  }

  // 發送通知
  async sendNotification(notification: NotificationData): Promise<boolean> {
    try {
      switch (notification.type) {
        case 'email':
          return await this.sendEmail(notification);
        case 'sms':
          return await this.sendSMS(notification);
        case 'push':
          return await this.sendPush(notification);
        default:
          throw new Error(`Unsupported notification type: ${notification.type}`);
      }
    } catch (error) {
      console.error('Failed to send notification:', error);
      return false;
    }
  }

  // 訂單創建通知
  async sendOrderCreatedNotifications(order: Order): Promise<void> {
    const templateData = {
      orderNumber: order.orderNumber,
      customerName: order.customer.name,
      guideName: order.booking.guideName,
      serviceName: order.booking.serviceName,
      bookingDate: new Date(order.booking.date).toLocaleDateString('zh-TW'),
      participants: order.booking.participants,
      totalAmount: order.pricing.total.toLocaleString(),
      meetingPoint: order.booking.location.name
    };

    // 通知客戶
    const customerTemplate = notificationTemplates.orderCreated.customer;
    await this.sendNotification({
      to: order.customer.email,
      subject: this.replaceTemplateVariables(customerTemplate.subject, templateData),
      message: this.replaceTemplateVariables(customerTemplate.message, templateData),
      type: 'email',
      orderId: order.id
    });

    // 通知導遊（需要導遊聯絡資訊）
    // 在實際應用中，應該從數據庫查詢導遊資訊
    const guideTemplate = notificationTemplates.orderCreated.guide;
    console.log('Guide notification would be sent:', {
      guideId: order.booking.guideId,
      subject: this.replaceTemplateVariables(guideTemplate.subject, templateData),
      message: this.replaceTemplateVariables(guideTemplate.message, templateData)
    });
  }

  // 支付完成通知
  async sendPaymentCompletedNotifications(order: Order): Promise<void> {
    const templateData = {
      orderNumber: order.orderNumber,
      customerName: order.customer.name,
      guideName: order.booking.guideName,
      serviceName: order.booking.serviceName,
      bookingDate: new Date(order.booking.date).toLocaleDateString('zh-TW'),
      totalAmount: order.pricing.total.toLocaleString(),
      transactionId: order.payment.transactionId || 'N/A'
    };

    // 通知客戶
    const customerTemplate = notificationTemplates.paymentCompleted.customer;
    await this.sendNotification({
      to: order.customer.email,
      subject: this.replaceTemplateVariables(customerTemplate.subject, templateData),
      message: this.replaceTemplateVariables(customerTemplate.message, templateData),
      type: 'email',
      orderId: order.id
    });

    // 通知導遊
    const guideTemplate = notificationTemplates.paymentCompleted.guide;
    console.log('Guide payment notification would be sent:', {
      guideId: order.booking.guideId,
      subject: this.replaceTemplateVariables(guideTemplate.subject, templateData),
      message: this.replaceTemplateVariables(guideTemplate.message, templateData)
    });
  }

  // 訂單確認通知
  async sendOrderConfirmedNotifications(order: Order): Promise<void> {
    const templateData = {
      orderNumber: order.orderNumber,
      customerName: order.customer.name,
      guideName: order.booking.guideName,
      serviceName: order.booking.serviceName,
      bookingDate: new Date(order.booking.date).toLocaleDateString('zh-TW'),
      meetingPoint: order.booking.location.name,
      guideContact: '導遊將直接與您聯繫' // 實際應該提供真實聯絡方式
    };

    // 通知客戶
    const customerTemplate = notificationTemplates.orderConfirmed.customer;
    await this.sendNotification({
      to: order.customer.email,
      subject: this.replaceTemplateVariables(customerTemplate.subject, templateData),
      message: this.replaceTemplateVariables(customerTemplate.message, templateData),
      type: 'email',
      orderId: order.id
    });
  }

  // 訂單取消通知
  async sendOrderCancelledNotifications(order: Order): Promise<void> {
    if (!order.cancellation) return;

    const templateData = {
      orderNumber: order.orderNumber,
      customerName: order.customer.name,
      guideName: order.booking.guideName,
      cancellationReason: this.getCancellationReasonText(order.cancellation.reason),
      refundAmount: order.cancellation.refundPolicy.refundAmount.toLocaleString()
    };

    // 通知客戶
    const customerTemplate = notificationTemplates.orderCancelled.customer;
    await this.sendNotification({
      to: order.customer.email,
      subject: this.replaceTemplateVariables(customerTemplate.subject, templateData),
      message: this.replaceTemplateVariables(customerTemplate.message, templateData),
      type: 'email',
      orderId: order.id
    });

    // 通知導遊
    const guideTemplate = notificationTemplates.orderCancelled.guide;
    console.log('Guide cancellation notification would be sent:', {
      guideId: order.booking.guideId,
      subject: this.replaceTemplateVariables(guideTemplate.subject, templateData),
      message: this.replaceTemplateVariables(guideTemplate.message, templateData)
    });
  }

  // 獲取取消原因文字
  private getCancellationReasonText(reason: string): string {
    const reasonMap: Record<string, string> = {
      'USER_REQUEST': '用戶要求取消',
      'GUIDE_UNAVAILABLE': '導遊無法提供服務',
      'WEATHER': '天氣因素',
      'FORCE_MAJEURE': '不可抗力因素',
      'SCHEDULE_CONFLICT': '時間衝突',
      'OTHER': '其他原因'
    };
    
    return reasonMap[reason] || reason;
  }
}

// 導出通知服務實例
export const notificationService = new NotificationService();