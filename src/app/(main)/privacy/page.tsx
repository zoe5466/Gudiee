'use client';

import { useRouter } from 'next/navigation';
import { Calendar, Shield, Eye, Lock, Database, Share2, Settings, AlertTriangle } from 'lucide-react';

export default function PrivacyPage() {
  const router = useRouter();
  const lastUpdated = '2024年1月15日';

  const sections = [
    {
      id: 'information-collection',
      title: '資訊收集',
      icon: Database,
      content: [
        '帳戶資訊：姓名、電子郵件、電話號碼等註冊時提供的基本資料',
        '個人檔案：自我介紹、專長、語言能力等個人展示資訊',
        '位置資訊：為提供在地服務而收集的地理位置資料',
        '交易資訊：預訂記錄、付款資訊、服務評價等交易相關數據',
        '使用資訊：瀏覽記錄、搜尋習慣、偏好設定等平台使用數據'
      ]
    },
    {
      id: 'information-usage',
      title: '資訊使用',
      icon: Eye,
      content: [
        '提供和改善我們的媒合服務',
        '處理預訂和付款事務',
        '與其他用戶進行服務配對',
        '發送服務相關通知和更新',
        '分析平台使用情況以優化用戶體驗',
        '防範詐欺和維護平台安全'
      ]
    },
    {
      id: 'information-sharing',
      title: '資訊分享',
      icon: Share2,
      content: [
        '與配對的地陪或旅客分享必要的聯繫資訊',
        '向第三方支付服務商提供交易相關資訊',
        '在法律要求下向相關機關提供資訊',
        '與我們的服務供應商分享營運所需的資訊',
        '經您明確同意後分享其他資訊'
      ]
    },
    {
      id: 'data-security',
      title: '資料安全',
      icon: Shield,
      content: [
        '使用業界標準的加密技術保護您的資料',
        '定期進行安全性評估和漏洞修補',
        '限制員工對個人資料的存取權限',
        '與可信任的第三方服務商合作',
        '建立完整的資料備份和災難復原機制'
      ]
    },
    {
      id: 'data-retention',
      title: '資料保存',
      icon: Lock,
      content: [
        '帳戶資料將保存至您刪除帳戶為止',
        '交易記錄將依法保存7年',
        '已刪除的資料將在30天內從我們的系統中完全移除',
        '備份資料可能需要額外90天才能完全清除',
        '法律要求保存的資料將依相關法規處理'
      ]
    },
    {
      id: 'user-rights',
      title: '用戶權利',
      icon: Settings,
      content: [
        '查看我們持有的您的個人資料',
        '要求更正不準確的個人資料',
        '要求刪除您的個人資料',
        '限制或反對某些資料處理方式',
        '將您的資料轉移至其他服務商',
        '隨時撤回對資料處理的同意'
      ]
    }
  ];

  const cookieTypes = [
    {
      type: '必要 Cookie',
      description: '這些 Cookie 對網站正常運作必不可少，包括用戶認證、安全防護等功能。',
      examples: ['登入狀態', '安全令牌', '語言偏好']
    },
    {
      type: '分析 Cookie',
      description: '幫助我們了解用戶如何使用網站，以便改善用戶體驗。',
      examples: ['頁面瀏覽統計', '使用時長', '點擊行為']
    },
    {
      type: '功能 Cookie',
      description: '記住您的偏好設定，提供個人化的使用體驗。',
      examples: ['搜尋偏好', '位置設定', '通知偏好']
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
            <Shield style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
            <span style={{ fontWeight: '500' }}>隱私政策</span>
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
            隱私政策
          </h1>
          
          <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '1rem' }}>
            我們重視您的隱私，致力於保護您的個人資料安全
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
            我們對隱私的承諾
          </h2>
          <div style={{ color: '#4b5563', lineHeight: '1.7', fontSize: '1rem' }}>
            <p style={{ marginBottom: '1rem' }}>
              Guidee 深知個人隱私的重要性。本隱私政策說明我們如何收集、使用、儲存和保護您的個人資訊。
              我們承諾遵循最高的隱私保護標準，確保您的資料安全。
            </p>
            <p style={{ marginBottom: '1rem' }}>
              使用我們的服務即表示您同意本隱私政策的內容。我們建議您仔細閱讀以下內容，
              了解我們如何處理您的個人資訊。
            </p>
            <p>
              我們遵循個人資料保護法及相關法規，並採用業界最佳實務來保護您的隱私權。
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
            政策內容
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

        {/* Cookie Policy */}
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
              <Database style={{ width: '1.5rem', height: '1.5rem', color: '#2563eb' }} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', margin: 0 }}>
              Cookie 政策
            </h2>
          </div>
          
          <p style={{ color: '#4b5563', marginBottom: '1.5rem', lineHeight: '1.7' }}>
            我們使用 Cookie 和類似技術來改善您的使用體驗。以下是我們使用的不同類型 Cookie：
          </p>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            {cookieTypes.map((cookie, index) => (
              <div 
                key={index}
                style={{
                  padding: '1.5rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '0.5rem',
                  border: '1px solid #f3f4f6'
                }}
              >
                <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                  {cookie.type}
                </h4>
                <p style={{ color: '#4b5563', marginBottom: '1rem', lineHeight: '1.6' }}>
                  {cookie.description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {cookie.examples.map((example, exampleIndex) => (
                    <span 
                      key={exampleIndex}
                      style={{
                        padding: '0.25rem 0.75rem',
                        backgroundColor: '#e0e7ff',
                        color: '#3730a3',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}
                    >
                      {example}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

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
            <AlertTriangle style={{ width: '1.5rem', height: '1.5rem', color: '#f59e0b' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#92400e', margin: 0 }}>
              您的權利與選擇
            </h3>
          </div>
          <div style={{ color: '#92400e', lineHeight: '1.7' }}>
            <p style={{ marginBottom: '1rem' }}>
              您可以隨時透過帳戶設定頁面管理您的隱私偏好，包括：
            </p>
            <ul style={{ marginBottom: '1rem', paddingLeft: '1.5rem' }}>
              <li>修改個人資料的公開範圍</li>
              <li>選擇接收通知的類型</li>
              <li>管理 Cookie 偏好設定</li>
              <li>要求下載或刪除您的資料</li>
            </ul>
            <p>
              如有任何隱私相關問題，請聯繫我們：
              <a 
                href="mailto:privacy@guidee.tw" 
                style={{ color: '#f59e0b', textDecoration: 'underline', marginLeft: '0.5rem' }}
              >
                privacy@guidee.tw
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
            隱私保護承諾
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            我們持續改善隱私保護措施，確保您的資料安全。如有疑問，歡迎聯繫我們。
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
              聯繫我們
            </button>
            <button
              onClick={() => router.push('/profile')}
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
              隱私設定
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}