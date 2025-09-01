'use client';

import { useRouter } from 'next/navigation';
import { Calendar, Shield, AlertCircle, FileText, Scale, Users } from 'lucide-react';

export default function TermsPage() {
  const router = useRouter();
  const lastUpdated = '2024年1月15日';

  const sections = [
    {
      id: 'definitions',
      title: '定義與解釋',
      icon: FileText,
      content: [
        '「平台」：指 Guidee 網站及其相關服務',
        '「用戶」：指使用本平台服務的個人或組織',
        '「地陪」：指在平台上提供導覽服務的註冊用戶',
        '「旅客」：指尋求導覽服務的註冊用戶',
        '「服務」：指地陪透過平台提供的各種導覽和體驗服務'
      ]
    },
    {
      id: 'user-obligations',
      title: '用戶義務與責任',
      icon: Users,
      content: [
        '提供真實、準確的個人資訊',
        '遵守當地法律法規及平台規範',
        '尊重其他用戶，維護平台和諧環境',
        '不得從事任何違法或有害活動',
        '保護個人帳戶安全，不得與他人共享'
      ]
    },
    {
      id: 'guide-terms',
      title: '地陪服務條款',
      icon: Shield,
      content: [
        '地陪必須具備相關專業知識和經驗',
        '提供的服務描述必須真實準確',
        '按時履行已確認的服務預約',
        '確保服務過程中旅客的安全',
        '遵守平台的定價和收費規範'
      ]
    },
    {
      id: 'booking-cancellation',
      title: '預訂與取消政策',
      icon: Calendar,
      content: [
        '預訂確認後，雙方應遵守約定的服務內容',
        '旅客可在服務開始前24小時免費取消',
        '24小時內取消將收取50%的服務費用',
        '地陪無故取消服務將面臨相應處罰',
        '因不可抗力因素取消服務將全額退款'
      ]
    },
    {
      id: 'payment-terms',
      title: '付款與退款',
      icon: Scale,
      content: [
        '平台採用第三方支付服務確保交易安全',
        '服務費用將在服務完成後48小時內釋放給地陪',
        '平台收取10%的服務手續費',
        '退款申請將在7個工作日內處理完成',
        '爭議處理期間相關費用將暫時凍結'
      ]
    },
    {
      id: 'liability',
      title: '責任限制',
      icon: AlertCircle,
      content: [
        '平台僅提供媒合服務，不對服務品質承擔直接責任',
        '用戶自行承擔使用服務過程中的風險',
        '平台對間接損失或特殊損害不承擔責任',
        '平台責任限額不超過相關交易金額',
        '建議用戶自行購買相關保險'
      ]
    }
  ];

  return (
    <div 
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #dbeafe, #ffffff, #e0e7ff)'
      }}
    >
      {/* Back to Home Button */}
      <div 
        style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          zIndex: 10
        }}
      >
        <button
          onClick={() => router.push('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '0.5rem',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#374151'
          }}
          className="hover:bg-white hover:shadow-md"
        >
          ← 回到首頁
        </button>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '6rem 1rem 4rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.75rem 1.5rem',
              borderRadius: '9999px',
              background: 'linear-gradient(to right, #2563eb, #4f46e5)',
              color: 'white',
              marginBottom: '2rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Scale style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
            <span style={{ fontWeight: '500' }}>服務條款</span>
          </div>
          
          <h1 
            style={{
              fontSize: '3rem',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '1rem',
              lineHeight: '1.1'
            }}
          >
            Guidee 服務條款
          </h1>
          
          <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '1rem' }}>
            使用 Guidee 平台前，請仔細閱讀以下條款
          </p>
          
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              color: '#6b7280'
            }}
          >
            <Calendar style={{ width: '1rem', height: '1rem' }} />
            最後更新：{lastUpdated}
          </div>
        </div>

        {/* Introduction */}
        <div 
          style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}
        >
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
            歡迎使用 Guidee
          </h2>
          <div style={{ color: '#4b5563', lineHeight: '1.7', fontSize: '1rem' }}>
            <p style={{ marginBottom: '1rem' }}>
              歡迎使用 Guidee 地陪媒合平台！本服務條款（以下簡稱「條款」）構成您與 Guidee 之間的法律協議。
              使用我們的服務即表示您同意遵守這些條款。
            </p>
            <p style={{ marginBottom: '1rem' }}>
              Guidee 致力於為旅客和地陪提供安全、可靠的媒合平台。透過我們的服務，
              您可以發現獨特的在地體驗或分享您的專業知識。
            </p>
            <p>
              請仔細閱讀以下條款。如果您不同意任何條款內容，請勿使用我們的服務。
            </p>
          </div>
        </div>

        {/* Table of Contents */}
        <div 
          style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}
        >
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1.5rem' }}>
            目錄
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    textDecoration: 'none',
                    color: '#374151',
                    transition: 'all 0.2s',
                    border: '1px solid #e5e7eb'
                  }}
                  className="hover:bg-blue-50 hover:border-blue-200"
                >
                  <Icon style={{ width: '1.25rem', height: '1.25rem', color: '#2563eb' }} />
                  <span style={{ fontWeight: '500' }}>{section.title}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Sections */}
        {sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <div 
              key={section.id}
              id={section.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '1rem',
                padding: '2rem',
                marginBottom: '2rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div 
                  style={{
                    width: '3rem',
                    height: '3rem',
                    backgroundColor: '#eff6ff',
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Icon style={{ width: '1.5rem', height: '1.5rem', color: '#2563eb' }} />
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                  {section.title}
                </h2>
              </div>
              
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {section.content.map((item, itemIndex) => (
                  <li 
                    key={itemIndex}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '1rem',
                      marginBottom: '1rem',
                      padding: '1rem',
                      backgroundColor: '#f9fafb',
                      borderRadius: '0.5rem',
                      border: '1px solid #f3f4f6'
                    }}
                  >
                    <div 
                      style={{
                        width: '0.5rem',
                        height: '0.5rem',
                        backgroundColor: '#2563eb',
                        borderRadius: '50%',
                        marginTop: '0.5rem',
                        flexShrink: 0
                      }}
                    ></div>
                    <span style={{ color: '#374151', lineHeight: '1.6' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}

        {/* Important Notice */}
        <div 
          style={{
            backgroundColor: '#fef3c7',
            border: '1px solid #f59e0b',
            borderRadius: '1rem',
            padding: '2rem',
            marginBottom: '2rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <AlertCircle style={{ width: '1.5rem', height: '1.5rem', color: '#f59e0b' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#92400e', margin: 0 }}>
              重要提醒
            </h3>
          </div>
          <div style={{ color: '#92400e', lineHeight: '1.7' }}>
            <p style={{ marginBottom: '1rem' }}>
              本服務條款可能會定期更新。重大變更將會透過電子郵件或平台公告通知您。
              繼續使用服務即表示您接受更新後的條款。
            </p>
            <p>
              如果您對服務條款有任何疑問，請聯繫我們的客服團隊：
              <a 
                href="mailto:support@guidee.tw" 
                style={{ color: '#f59e0b', textDecoration: 'underline', marginLeft: '0.5rem' }}
              >
                support@guidee.tw
              </a>
            </p>
          </div>
        </div>

        {/* Contact */}
        <div 
          style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            textAlign: 'center'
          }}
        >
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
            需要協助？
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            如果您有任何問題或需要進一步說明，我們隨時為您服務
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => router.push('/contact')}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(to right, #2563eb, #4f46e5)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              className="hover:shadow-lg hover:scale-105"
            >
              聯繫客服
            </button>
            <button
              onClick={() => router.push('/faq')}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'white',
                color: '#2563eb',
                border: '2px solid #2563eb',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              className="hover:bg-blue-50"
            >
              常見問題
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}