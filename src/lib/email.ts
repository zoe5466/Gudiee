// Email service for Guidee notifications

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

interface EmailData {
  to: string;
  from?: string;
  subject: string;
  html?: string;
  text?: string;
  templateId?: string;
  templateData?: Record<string, any>;
}

// Email templates
export const emailTemplates = {
  bookingConfirmation: (data: {
    userName: string;
    guideName: string;
    serviceName: string;
    bookingDate: string;
    bookingTime: string;
    totalPrice: number;
    bookingId: string;
  }): EmailTemplate => ({
    subject: `預訂確認 - ${data.serviceName}`,
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2rem; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 2rem;">Guidee</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 0.5rem 0 0;">您的預訂已確認</p>
        </div>
        
        <div style="padding: 2rem; background: white;">
          <h2 style="color: #333; margin-bottom: 1rem;">預訂確認</h2>
          <p>親愛的 ${data.userName}，</p>
          <p>感謝您使用 Guidee！您的預訂已成功確認。</p>
          
          <div style="background: #f8fafc; padding: 1.5rem; border-radius: 8px; margin: 1.5rem 0;">
            <h3 style="margin: 0 0 1rem; color: #333;">預訂詳情</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 0.5rem 0; font-weight: bold; color: #666;">服務名稱：</td>
                <td style="padding: 0.5rem 0;">${data.serviceName}</td>
              </tr>
              <tr>
                <td style="padding: 0.5rem 0; font-weight: bold; color: #666;">導遊：</td>
                <td style="padding: 0.5rem 0;">${data.guideName}</td>
              </tr>
              <tr>
                <td style="padding: 0.5rem 0; font-weight: bold; color: #666;">日期：</td>
                <td style="padding: 0.5rem 0;">${data.bookingDate}</td>
              </tr>
              <tr>
                <td style="padding: 0.5rem 0; font-weight: bold; color: #666;">時間：</td>
                <td style="padding: 0.5rem 0;">${data.bookingTime}</td>
              </tr>
              <tr>
                <td style="padding: 0.5rem 0; font-weight: bold; color: #666;">總金額：</td>
                <td style="padding: 0.5rem 0; font-size: 1.2rem; font-weight: bold; color: #3b82f6;">NT$ ${data.totalPrice.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 0.5rem 0; font-weight: bold; color: #666;">預訂編號：</td>
                <td style="padding: 0.5rem 0; font-family: monospace;">${data.bookingId}</td>
              </tr>
            </table>
          </div>
          
          <div style="margin: 2rem 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/my-bookings" 
               style="background: #3b82f6; color: white; padding: 1rem 2rem; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
              查看預訂詳情
            </a>
          </div>
          
          <p style="color: #666; font-size: 0.9rem; margin-top: 2rem;">
            如有任何問題，請聯繫我們的客服團隊或直接與您的導遊聯繫。
          </p>
        </div>
        
        <div style="background: #f3f4f6; padding: 1.5rem; text-align: center; color: #666; font-size: 0.8rem;">
          <p>© 2024 Guidee. 保留所有權利。</p>
          <p>這是一封自動發送的郵件，請勿直接回覆。</p>
        </div>
      </div>
    `,
    text: `
      Guidee - 預訂確認
      
      親愛的 ${data.userName}，
      
      感謝您使用 Guidee！您的預訂已成功確認。
      
      預訂詳情：
      服務名稱：${data.serviceName}
      導遊：${data.guideName}
      日期：${data.bookingDate}
      時間：${data.bookingTime}
      總金額：NT$ ${data.totalPrice.toLocaleString()}
      預訂編號：${data.bookingId}
      
      查看預訂詳情：${process.env.NEXT_PUBLIC_APP_URL}/my-bookings
      
      如有任何問題，請聯繫我們的客服團隊。
      
      © 2024 Guidee
    `
  }),

  newMessage: (data: {
    recipientName: string;
    senderName: string;
    messagePreview: string;
  }): EmailTemplate => ({
    subject: `新訊息 - ${data.senderName}`,
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2rem; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 2rem;">Guidee</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 0.5rem 0 0;">您有新訊息</p>
        </div>
        
        <div style="padding: 2rem; background: white;">
          <h2 style="color: #333; margin-bottom: 1rem;">新訊息通知</h2>
          <p>親愛的 ${data.recipientName}，</p>
          <p>${data.senderName} 發送了一條新訊息給您：</p>
          
          <div style="background: #f8fafc; padding: 1.5rem; border-radius: 8px; margin: 1.5rem 0; border-left: 4px solid #3b82f6;">
            <p style="margin: 0; font-style: italic; color: #666;">"${data.messagePreview}"</p>
          </div>
          
          <div style="margin: 2rem 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/chat" 
               style="background: #3b82f6; color: white; padding: 1rem 2rem; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
              回覆訊息
            </a>
          </div>
        </div>
        
        <div style="background: #f3f4f6; padding: 1.5rem; text-align: center; color: #666; font-size: 0.8rem;">
          <p>© 2024 Guidee. 保留所有權利。</p>
        </div>
      </div>
    `,
    text: `
      Guidee - 新訊息通知
      
      親愛的 ${data.recipientName}，
      
      ${data.senderName} 發送了一條新訊息給您：
      "${data.messagePreview}"
      
      回覆訊息：${process.env.NEXT_PUBLIC_APP_URL}/chat
      
      © 2024 Guidee
    `
  }),

  paymentSuccess: (data: {
    userName: string;
    amount: number;
    serviceName: string;
    transactionId: string;
  }): EmailTemplate => ({
    subject: '付款成功確認',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 2rem; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 2rem;">付款成功</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 0.5rem 0 0;">您的付款已成功處理</p>
        </div>
        
        <div style="padding: 2rem; background: white;">
          <h2 style="color: #333; margin-bottom: 1rem;">付款確認</h2>
          <p>親愛的 ${data.userName}，</p>
          <p>您的付款已成功處理，以下是交易詳情：</p>
          
          <div style="background: #f0fdf4; padding: 1.5rem; border-radius: 8px; margin: 1.5rem 0; border: 1px solid #bbf7d0;">
            <h3 style="margin: 0 0 1rem; color: #166534;">交易詳情</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 0.5rem 0; font-weight: bold; color: #666;">服務名稱：</td>
                <td style="padding: 0.5rem 0;">${data.serviceName}</td>
              </tr>
              <tr>
                <td style="padding: 0.5rem 0; font-weight: bold; color: #666;">付款金額：</td>
                <td style="padding: 0.5rem 0; font-size: 1.2rem; font-weight: bold; color: #059669;">NT$ ${data.amount.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 0.5rem 0; font-weight: bold; color: #666;">交易編號：</td>
                <td style="padding: 0.5rem 0; font-family: monospace;">${data.transactionId}</td>
              </tr>
              <tr>
                <td style="padding: 0.5rem 0; font-weight: bold; color: #666;">付款時間：</td>
                <td style="padding: 0.5rem 0;">${new Date().toLocaleString('zh-TW')}</td>
              </tr>
            </table>
          </div>
          
          <div style="margin: 2rem 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/my-bookings" 
               style="background: #059669; color: white; padding: 1rem 2rem; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
              查看預訂
            </a>
          </div>
        </div>
        
        <div style="background: #f3f4f6; padding: 1.5rem; text-align: center; color: #666; font-size: 0.8rem;">
          <p>© 2024 Guidee. 保留所有權利。</p>
        </div>
      </div>
    `,
    text: `
      Guidee - 付款成功確認
      
      親愛的 ${data.userName}，
      
      您的付款已成功處理。
      
      交易詳情：
      服務名稱：${data.serviceName}
      付款金額：NT$ ${data.amount.toLocaleString()}
      交易編號：${data.transactionId}
      付款時間：${new Date().toLocaleString('zh-TW')}
      
      查看預訂：${process.env.NEXT_PUBLIC_APP_URL}/my-bookings
      
      © 2024 Guidee
    `
  }),

  reviewRequest: (data: {
    userName: string;
    guideName: string;
    serviceName: string;
    bookingId: string;
  }): EmailTemplate => ({
    subject: '邀請您分享體驗評價',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 2rem; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 2rem;">分享您的體驗</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 0.5rem 0 0;">您的評價對我們很重要</p>
        </div>
        
        <div style="padding: 2rem; background: white;">
          <h2 style="color: #333; margin-bottom: 1rem;">評價邀請</h2>
          <p>親愛的 ${data.userName}，</p>
          <p>希望您對 ${data.guideName} 提供的「${data.serviceName}」服務感到滿意！</p>
          <p>您的評價將幫助其他旅客做出更好的選擇，也能幫助導遊提升服務品質。</p>
          
          <div style="background: #fffbeb; padding: 1.5rem; border-radius: 8px; margin: 1.5rem 0; border: 1px solid #fed7aa;">
            <h3 style="margin: 0 0 1rem; color: #92400e;">為什麼評價很重要？</h3>
            <ul style="margin: 0; padding-left: 1.5rem; color: #b45309;">
              <li>幫助其他旅客找到優質服務</li>
              <li>協助導遊改善服務品質</li>
              <li>建立更可靠的平台社群</li>
            </ul>
          </div>
          
          <div style="margin: 2rem 0; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/my-bookings?review=${data.bookingId}" 
               style="background: #f59e0b; color: white; padding: 1rem 2rem; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; margin: 0.5rem;">
              ⭐ 撰寫評價
            </a>
          </div>
          
          <p style="color: #666; font-size: 0.9rem; text-align: center;">
            只需要幾分鐘，您的分享很有價值！
          </p>
        </div>
        
        <div style="background: #f3f4f6; padding: 1.5rem; text-align: center; color: #666; font-size: 0.8rem;">
          <p>© 2024 Guidee. 保留所有權利。</p>
        </div>
      </div>
    `,
    text: `
      Guidee - 評價邀請
      
      親愛的 ${data.userName}，
      
      希望您對 ${data.guideName} 提供的「${data.serviceName}」服務感到滿意！
      
      您的評價將幫助其他旅客做出更好的選擇，也能幫助導遊提升服務品質。
      
      撰寫評價：${process.env.NEXT_PUBLIC_APP_URL}/my-bookings?review=${data.bookingId}
      
      © 2024 Guidee
    `
  })
};

// Mock email sending function (in production, this would integrate with an email service like SendGrid, AWS SES, etc.)
export async function sendEmail(emailData: EmailData): Promise<boolean> {
  try {
    console.log('📧 Sending email:', {
      to: emailData.to,
      subject: emailData.subject,
      from: emailData.from || 'noreply@guidee.online'
    });

    // In a real application, you would integrate with an email service here
    // For demo purposes, we'll just simulate the API call
    
    if (process.env.NODE_ENV === 'development') {
      // Log email content in development
      console.log('Email content:', {
        html: emailData.html?.substring(0, 200) + '...',
        text: emailData.text?.substring(0, 200) + '...'
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    }

    // Production email sending would look like this:
    /*
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: emailData.to }],
          subject: emailData.subject
        }],
        from: { email: emailData.from || 'noreply@guidee.online' },
        content: [
          {
            type: 'text/html',
            value: emailData.html || emailData.text || ''
          },
          {
            type: 'text/plain',
            value: emailData.text || ''
          }
        ]
      })
    });

    return response.ok;
    */

    return true; // Mock success
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

// Convenience functions for sending specific types of emails
export const emailService = {
  sendBookingConfirmation: async (to: string, data: Parameters<typeof emailTemplates.bookingConfirmation>[0]) => {
    const template = emailTemplates.bookingConfirmation(data);
    return sendEmail({
      to,
      ...template
    });
  },

  sendNewMessageNotification: async (to: string, data: Parameters<typeof emailTemplates.newMessage>[0]) => {
    const template = emailTemplates.newMessage(data);
    return sendEmail({
      to,
      ...template
    });
  },

  sendPaymentSuccessNotification: async (to: string, data: Parameters<typeof emailTemplates.paymentSuccess>[0]) => {
    const template = emailTemplates.paymentSuccess(data);
    return sendEmail({
      to,
      ...template
    });
  },

  sendReviewRequest: async (to: string, data: Parameters<typeof emailTemplates.reviewRequest>[0]) => {
    const template = emailTemplates.reviewRequest(data);
    return sendEmail({
      to,
      ...template
    });
  }
};