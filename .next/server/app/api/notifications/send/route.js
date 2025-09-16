"use strict";(()=>{var e={};e.id=5285,e.ids=[5285],e.modules={30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},82759:(e,t,r)=>{r.r(t),r.d(t,{headerHooks:()=>h,originalPathname:()=>v,patchFetch:()=>w,requestAsyncStorage:()=>u,routeModule:()=>p,serverHooks:()=>b,staticGenerationAsyncStorage:()=>y,staticGenerationBailout:()=>f});var i={};r.r(i),r.d(i,{GET:()=>g,POST:()=>c});var a=r(95419),o=r(69108),d=r(99678),n=r(80424),s=r(78070);async function l(e){try{return!0}catch(e){return!1}}let m={sendBookingConfirmation:async(e,t)=>l({to:e,subject:`預訂確認 - ${t.serviceName}`,html:`
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2rem; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 2rem;">Guidee</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 0.5rem 0 0;">您的預訂已確認</p>
        </div>
        
        <div style="padding: 2rem; background: white;">
          <h2 style="color: #333; margin-bottom: 1rem;">預訂確認</h2>
          <p>親愛的 ${t.userName}，</p>
          <p>感謝您使用 Guidee！您的預訂已成功確認。</p>
          
          <div style="background: #f8fafc; padding: 1.5rem; border-radius: 8px; margin: 1.5rem 0;">
            <h3 style="margin: 0 0 1rem; color: #333;">預訂詳情</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 0.5rem 0; font-weight: bold; color: #666;">服務名稱：</td>
                <td style="padding: 0.5rem 0;">${t.serviceName}</td>
              </tr>
              <tr>
                <td style="padding: 0.5rem 0; font-weight: bold; color: #666;">導遊：</td>
                <td style="padding: 0.5rem 0;">${t.guideName}</td>
              </tr>
              <tr>
                <td style="padding: 0.5rem 0; font-weight: bold; color: #666;">日期：</td>
                <td style="padding: 0.5rem 0;">${t.bookingDate}</td>
              </tr>
              <tr>
                <td style="padding: 0.5rem 0; font-weight: bold; color: #666;">時間：</td>
                <td style="padding: 0.5rem 0;">${t.bookingTime}</td>
              </tr>
              <tr>
                <td style="padding: 0.5rem 0; font-weight: bold; color: #666;">總金額：</td>
                <td style="padding: 0.5rem 0; font-size: 1.2rem; font-weight: bold; color: #3b82f6;">NT$ ${t.totalPrice.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 0.5rem 0; font-weight: bold; color: #666;">預訂編號：</td>
                <td style="padding: 0.5rem 0; font-family: monospace;">${t.bookingId}</td>
              </tr>
            </table>
          </div>
          
          <div style="margin: 2rem 0;">
            <a href="http://localhost:3000/my-bookings" 
               style="background: #3b82f6; color: white; padding: 1rem 2rem; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
              查看預訂詳情
            </a>
          </div>
          
          <p style="color: #666; font-size: 0.9rem; margin-top: 2rem;">
            如有任何問題，請聯繫我們的客服團隊或直接與您的導遊聯繫。
          </p>
        </div>
        
        <div style="background: #f3f4f6; padding: 1.5rem; text-align: center; color: #666; font-size: 0.8rem;">
          <p>\xa9 2024 Guidee. 保留所有權利。</p>
          <p>這是一封自動發送的郵件，請勿直接回覆。</p>
        </div>
      </div>
    `,text:`
      Guidee - 預訂確認
      
      親愛的 ${t.userName}，
      
      感謝您使用 Guidee！您的預訂已成功確認。
      
      預訂詳情：
      服務名稱：${t.serviceName}
      導遊：${t.guideName}
      日期：${t.bookingDate}
      時間：${t.bookingTime}
      總金額：NT$ ${t.totalPrice.toLocaleString()}
      預訂編號：${t.bookingId}
      
      查看預訂詳情：http://localhost:3000/my-bookings
      
      如有任何問題，請聯繫我們的客服團隊。
      
      \xa9 2024 Guidee
    `}),sendNewMessageNotification:async(e,t)=>l({to:e,subject:`新訊息 - ${t.senderName}`,html:`
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2rem; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 2rem;">Guidee</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 0.5rem 0 0;">您有新訊息</p>
        </div>
        
        <div style="padding: 2rem; background: white;">
          <h2 style="color: #333; margin-bottom: 1rem;">新訊息通知</h2>
          <p>親愛的 ${t.recipientName}，</p>
          <p>${t.senderName} 發送了一條新訊息給您：</p>
          
          <div style="background: #f8fafc; padding: 1.5rem; border-radius: 8px; margin: 1.5rem 0; border-left: 4px solid #3b82f6;">
            <p style="margin: 0; font-style: italic; color: #666;">"${t.messagePreview}"</p>
          </div>
          
          <div style="margin: 2rem 0;">
            <a href="http://localhost:3000/chat" 
               style="background: #3b82f6; color: white; padding: 1rem 2rem; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
              回覆訊息
            </a>
          </div>
        </div>
        
        <div style="background: #f3f4f6; padding: 1.5rem; text-align: center; color: #666; font-size: 0.8rem;">
          <p>\xa9 2024 Guidee. 保留所有權利。</p>
        </div>
      </div>
    `,text:`
      Guidee - 新訊息通知
      
      親愛的 ${t.recipientName}，
      
      ${t.senderName} 發送了一條新訊息給您：
      "${t.messagePreview}"
      
      回覆訊息：http://localhost:3000/chat
      
      \xa9 2024 Guidee
    `}),sendPaymentSuccessNotification:async(e,t)=>l({to:e,subject:"付款成功確認",html:`
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 2rem; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 2rem;">付款成功</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 0.5rem 0 0;">您的付款已成功處理</p>
        </div>
        
        <div style="padding: 2rem; background: white;">
          <h2 style="color: #333; margin-bottom: 1rem;">付款確認</h2>
          <p>親愛的 ${t.userName}，</p>
          <p>您的付款已成功處理，以下是交易詳情：</p>
          
          <div style="background: #f0fdf4; padding: 1.5rem; border-radius: 8px; margin: 1.5rem 0; border: 1px solid #bbf7d0;">
            <h3 style="margin: 0 0 1rem; color: #166534;">交易詳情</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 0.5rem 0; font-weight: bold; color: #666;">服務名稱：</td>
                <td style="padding: 0.5rem 0;">${t.serviceName}</td>
              </tr>
              <tr>
                <td style="padding: 0.5rem 0; font-weight: bold; color: #666;">付款金額：</td>
                <td style="padding: 0.5rem 0; font-size: 1.2rem; font-weight: bold; color: #059669;">NT$ ${t.amount.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 0.5rem 0; font-weight: bold; color: #666;">交易編號：</td>
                <td style="padding: 0.5rem 0; font-family: monospace;">${t.transactionId}</td>
              </tr>
              <tr>
                <td style="padding: 0.5rem 0; font-weight: bold; color: #666;">付款時間：</td>
                <td style="padding: 0.5rem 0;">${new Date().toLocaleString("zh-TW")}</td>
              </tr>
            </table>
          </div>
          
          <div style="margin: 2rem 0;">
            <a href="http://localhost:3000/my-bookings" 
               style="background: #059669; color: white; padding: 1rem 2rem; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
              查看預訂
            </a>
          </div>
        </div>
        
        <div style="background: #f3f4f6; padding: 1.5rem; text-align: center; color: #666; font-size: 0.8rem;">
          <p>\xa9 2024 Guidee. 保留所有權利。</p>
        </div>
      </div>
    `,text:`
      Guidee - 付款成功確認
      
      親愛的 ${t.userName}，
      
      您的付款已成功處理。
      
      交易詳情：
      服務名稱：${t.serviceName}
      付款金額：NT$ ${t.amount.toLocaleString()}
      交易編號：${t.transactionId}
      付款時間：${new Date().toLocaleString("zh-TW")}
      
      查看預訂：http://localhost:3000/my-bookings
      
      \xa9 2024 Guidee
    `}),sendReviewRequest:async(e,t)=>l({to:e,subject:"邀請您分享體驗評價",html:`
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 2rem; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 2rem;">分享您的體驗</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 0.5rem 0 0;">您的評價對我們很重要</p>
        </div>
        
        <div style="padding: 2rem; background: white;">
          <h2 style="color: #333; margin-bottom: 1rem;">評價邀請</h2>
          <p>親愛的 ${t.userName}，</p>
          <p>希望您對 ${t.guideName} 提供的「${t.serviceName}」服務感到滿意！</p>
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
            <a href="http://localhost:3000/my-bookings?review=${t.bookingId}" 
               style="background: #f59e0b; color: white; padding: 1rem 2rem; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; margin: 0.5rem;">
              ⭐ 撰寫評價
            </a>
          </div>
          
          <p style="color: #666; font-size: 0.9rem; text-align: center;">
            只需要幾分鐘，您的分享很有價值！
          </p>
        </div>
        
        <div style="background: #f3f4f6; padding: 1.5rem; text-align: center; color: #666; font-size: 0.8rem;">
          <p>\xa9 2024 Guidee. 保留所有權利。</p>
        </div>
      </div>
    `,text:`
      Guidee - 評價邀請
      
      親愛的 ${t.userName}，
      
      希望您對 ${t.guideName} 提供的「${t.serviceName}」服務感到滿意！
      
      您的評價將幫助其他旅客做出更好的選擇，也能幫助導遊提升服務品質。
      
      撰寫評價：http://localhost:3000/my-bookings?review=${t.bookingId}
      
      \xa9 2024 Guidee
    `})};async function c(e){try{let t=await e.json();if(!t.type||!t.userId||!t.email)return s.Z.json({error:"缺少必要的通知資訊"},{status:400});let r={email:!1,push:!1,errors:[]};if(!1!==t.sendEmail)try{let e=!1;switch(t.type){case"booking_confirmed":e=await m.sendBookingConfirmation(t.email,t.data);break;case"new_message":e=await m.sendNewMessageNotification(t.email,t.data);break;case"payment_success":e=await m.sendPaymentSuccessNotification(t.email,t.data);break;case"review_request":e=await m.sendReviewRequest(t.email,t.data);break;default:r.errors.push(`不支援的郵件通知類型: ${t.type}`)}r.email=e}catch(e){r.errors.push("郵件發送失敗")}if(!1!==t.sendPush)try{r.push=!0}catch(e){r.errors.push("推送通知發送失敗")}return s.Z.json({success:!0,results:r,message:"通知發送完成"})}catch(e){return s.Z.json({error:"通知發送失敗，請稍後再試"},{status:500})}}async function g(e){let t=new URL(e.url),r=t.searchParams.get("type"),i=t.searchParams.get("email");if(!r||!i)return s.Z.json({error:"缺少測試參數 (type, email)"},{status:400});let a={booking_confirmed:{userName:"測試用戶",guideName:"張小明導遊",serviceName:"台北一日遊",bookingDate:"2024-08-20",bookingTime:"09:00",totalPrice:2500,bookingId:"TEST-001"},new_message:{recipientName:"測試用戶",senderName:"張小明導遊",messagePreview:"您好！明天的行程我已經安排好了..."},payment_success:{userName:"測試用戶",amount:2500,serviceName:"台北一日遊",transactionId:"TXN-TEST-001"},review_request:{userName:"測試用戶",guideName:"張小明導遊",serviceName:"台北一日遊",bookingId:"TEST-001"}}[r];return a?c(new n.Z(e.url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:r,userId:"test-user",email:i,data:a,sendEmail:!0,sendPush:!1})})):s.Z.json({error:"不支援的測試類型"},{status:400})}let p=new a.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/notifications/send/route",pathname:"/api/notifications/send",filename:"route",bundlePath:"app/api/notifications/send/route"},resolvedPagePath:"/Users/zoechang/projects/Guidee/src/app/api/notifications/send/route.ts",nextConfigOutput:"",userland:i}),{requestAsyncStorage:u,staticGenerationAsyncStorage:y,serverHooks:b,headerHooks:h,staticGenerationBailout:f}=p,v="/api/notifications/send/route";function w(){return(0,d.patchFetch)({serverHooks:b,staticGenerationAsyncStorage:y})}}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),i=t.X(0,[1216],()=>r(82759));module.exports=i})();