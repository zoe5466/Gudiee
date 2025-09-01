'use client'

import { Search, MessageCircle, Calendar, MapPin, ArrowRight } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: '搜尋地陪',
      description: '輸入目的地，瀏覽專業地陪的個人檔案和服務內容',
      color: 'from-sky-500 to-blue-600'
    },
    {
      icon: MessageCircle,
      title: '溝通需求',
      description: '透過站內訊息與地陪討論行程安排和特殊需求',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      icon: Calendar,
      title: '預訂服務',
      description: '確認日期時間，完成付款預訂，等待地陪確認',
      color: 'from-amber-500 to-orange-600'
    },
    {
      icon: MapPin,
      title: '享受旅程',
      description: '按約定時間地點會面，開始您的專屬旅遊體驗',
      color: 'from-purple-500 to-indigo-600'
    }
  ];

  return (
    <section 
      style={{
        padding: '6rem 0',
        backgroundColor: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div 
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1.5rem'
        }}
      >
        {/* 標題區域 */}
        <div 
          style={{
            textAlign: 'center',
            marginBottom: '5rem'
          }}
        >
          <h2 
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '1.5rem'
            }}
          >
            如何使用{' '}
            <span 
              style={{
                color: '#2563eb'
              }}
            >
              Guidee？
            </span>
          </h2>
          <p 
            style={{
              fontSize: '1.25rem',
              color: '#4b5563',
              maxWidth: '768px',
              margin: '0 auto',
              lineHeight: '1.75'
            }}
          >
            簡單四步驟，輕鬆預訂專屬地陪服務
          </p>
        </div>

        {/* 步驟流程 */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginBottom: '5rem'
          }}
        >
          {steps.map((step, index) => (
            <div 
              key={index}
              className="group"
              style={{
                textAlign: 'center',
                transition: 'transform 0.3s ease',
                cursor: 'pointer'
              }}
            >
              {/* 步驟圓圈 */}
              <div 
                className="group-hover:scale-110"
                style={{
                  position: 'relative',
                  margin: '0 auto 2rem auto',
                  width: '6rem',
                  height: '6rem',
                  backgroundColor: 'white',
                  border: '4px solid #2563eb',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div 
                  style={{
                    width: '4rem',
                    height: '4rem',
                    background: 'linear-gradient(to bottom right, #2563eb, #4f46e5)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <step.icon style={{ width: '32px', height: '32px', color: 'white' }} />
                </div>
                
                {/* 步驟編號 */}
                <div 
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    width: '2rem',
                    height: '2rem',
                    background: 'linear-gradient(to bottom right, #2563eb, #4f46e5)',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: '700',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {index + 1}
                </div>
              </div>

              {/* 內容 */}
              <h3 
                className="group-hover:text-blue-600"
                style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: '#111827',
                  marginBottom: '1rem',
                  transition: 'color 0.3s ease'
                }}
              >
                {step.title}
              </h3>
              <p 
                style={{
                  color: '#4b5563',
                  lineHeight: '1.75',
                  maxWidth: '300px',
                  margin: '0 auto'
                }}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* 特色說明 */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            marginBottom: '5rem'
          }}
        >
          {[
            { icon: Search, title: '智能搜尋', desc: '根據您的偏好和需求，智能推薦最適合的地陪服務' },
            { icon: MessageCircle, title: '即時溝通', desc: '內建聊天功能，與地陪即時討論行程細節和特殊需求' },
            { icon: Calendar, title: '安全預訂', desc: '平台擔保交易，多重安全保障，讓您安心預訂' }
          ].map((feature, index) => (
            <div 
              key={index}
              className="group"
              style={{
                textAlign: 'center',
                padding: '2rem',
                background: 'linear-gradient(to bottom right, #dbeafe, #e0e7ff)',
                borderRadius: '1.5rem',
                border: '1px solid #bfdbfe',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
            >
              <div 
                className="group-hover:scale-110"
                style={{
                  width: '4rem',
                  height: '4rem',
                  background: 'linear-gradient(to bottom right, #2563eb, #4f46e5)',
                  borderRadius: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem auto',
                  transition: 'transform 0.3s ease'
                }}
              >
                <feature.icon style={{ width: '32px', height: '32px', color: 'white' }} />
              </div>
              <h3 
                style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: '#111827',
                  marginBottom: '1rem'
                }}
              >
                {feature.title}
              </h3>
              <p style={{ color: '#4b5563' }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* 行動按鈕 */}
        <div 
          style={{
            textAlign: 'center'
          }}
        >
          <button
            className="hover:scale-105 hover:shadow-xl"
            style={{
              background: 'linear-gradient(to right, #2563eb, #4f46e5)',
              color: 'white',
              borderRadius: '1rem',
              padding: '1rem 2rem',
              fontSize: '1.125rem',
              fontWeight: '600',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            開始您的旅程
            <ArrowRight style={{ width: '20px', height: '20px' }} />
          </button>
        </div>
      </div>
    </section>
  );
}