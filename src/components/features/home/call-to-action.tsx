'use client'

import { ArrowRight, MapPin, Users, Calendar, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function CallToAction() {
  const router = useRouter();
  const benefits = [
    {
      icon: MapPin,
      title: '遍布全台',
      description: '20+ 城市，500+ 認證地陪'
    },
    {
      icon: Users,
      title: '專業服務',
      description: '4.9 星評分，98% 滿意度'
    },
    {
      icon: Calendar,
      title: '彈性預訂',
      description: '24/7 客服，快速回應'
    },
    {
      icon: Star,
      title: '安全保障',
      description: '全程保險，安心無憂'
    }
  ];

  return (
    <section 
      style={{
        position: 'relative',
        padding: '6rem 0',
        overflow: 'hidden'
      }}
    >
      {/* 背景設計 */}
      <div 
        style={{
          position: 'absolute',
          inset: '0'
        }}
      >
        {/* 主要背景漸層 */}
        <div 
          style={{
            position: 'absolute',
            inset: '0',
            background: 'linear-gradient(to bottom right, #0ea5e9, #2563eb, #4338ca)'
          }}
        />
        
        {/* 裝飾元素 */}
        <div 
          style={{
            position: 'absolute',
            inset: '0'
          }}
        >
          <div 
            style={{
              position: 'absolute',
              top: '5rem',
              left: '5rem',
              width: '24rem',
              height: '24rem',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              filter: 'blur(48px)',
              animation: 'pulse 2s infinite'
            }}
          />
          <div 
            style={{
              position: 'absolute',
              bottom: '5rem',
              right: '5rem',
              width: '20rem',
              height: '20rem',
              background: 'rgba(147, 197, 253, 0.2)',
              borderRadius: '50%',
              filter: 'blur(48px)',
              animation: 'pulse 2s infinite 1s'
            }}
          />
          <div 
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '16rem',
              height: '16rem',
              background: 'rgba(125, 211, 252, 0.3)',
              borderRadius: '50%',
              filter: 'blur(48px)',
              animation: 'pulse 2s infinite 0.5s'
            }}
          />
        </div>

        {/* 旅遊元素裝飾 */}
        <div 
          style={{
            position: 'absolute',
            top: '2.5rem',
            right: '2.5rem',
            width: '8rem',
            height: '8rem',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <MapPin style={{ width: '64px', height: '64px', color: 'rgba(255, 255, 255, 0.3)' }} />
        </div>
        <div 
          style={{
            position: 'absolute',
            bottom: '2.5rem',
            left: '2.5rem',
            width: '6rem',
            height: '6rem',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Star style={{ width: '48px', height: '48px', color: 'rgba(255, 255, 255, 0.3)' }} />
        </div>
      </div>

      <div 
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1.5rem'
        }}
      >
        <div 
          style={{
            textAlign: 'center'
          }}
        >
          {/* 主要標題 */}
          <h2 
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: '700',
              color: 'white',
              marginBottom: '1.5rem',
              lineHeight: '1.1'
            }}
          >
            準備開始您的
            <span 
              style={{
                display: 'block',
                color: '#fbbf24'
              }}
            >
              專屬旅程
            </span>
          </h2>
          
          <p 
            style={{
              fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
              color: 'rgba(255, 255, 255, 0.9)',
              maxWidth: '768px',
              margin: '0 auto 3rem auto',
              lineHeight: '1.75'
            }}
          >
            立即加入 Guidee，尋找專屬地陪或成為地陪，
            <br />
            開啟全新的旅遊體驗
          </p>

          {/* 行動按鈕 */}
          <div 
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              justifyContent: 'center',
              marginBottom: '4rem'
            }}
            className="sm:flex-row"
          >
            <button
              onClick={() => router.push('/search')}
              className="hover:scale-105 hover:shadow-2xl"
              style={{
                backgroundColor: 'white',
                color: '#0284c7',
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
                justifyContent: 'center'
              }}
            >
              尋找地陪
              <ArrowRight style={{ width: '20px', height: '20px', marginLeft: '8px' }} />
            </button>
            
            <button
              onClick={() => router.push('/register')}
              className="hover:bg-white hover:text-sky-600 hover:scale-105"
              style={{
                border: '2px solid white',
                color: 'white',
                backgroundColor: 'transparent',
                borderRadius: '1rem',
                padding: '1rem 2rem',
                fontSize: '1.125rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              成為地陪
              <ArrowRight style={{ width: '20px', height: '20px', marginLeft: '8px' }} />
            </button>
          </div>

          {/* 特色亮點 */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
              maxWidth: '1000px',
              margin: '0 auto'
            }}
          >
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group hover:scale-105"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(4px)',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
              >
                <div 
                  className="group-hover:scale-110"
                  style={{
                    width: '3rem',
                    height: '3rem',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                    margin: '0 auto 1rem auto',
                    transition: 'transform 0.3s ease'
                  }}
                >
                  <benefit.icon style={{ width: '24px', height: '24px', color: 'white' }} />
                </div>
                <h3 
                  style={{
                    color: 'white',
                    fontWeight: '600',
                    marginBottom: '0.5rem'
                  }}
                >
                  {benefit.title}
                </h3>
                <p 
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.875rem'
                  }}
                >
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>

          {/* 信任標章 */}
          <div 
            style={{
              marginTop: '4rem'
            }}
          >
            <p 
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '2rem'
              }}
            >
              受信任的合作夥伴
            </p>
            <div 
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '2rem'
              }}
            >
              {[1, 2, 3, 4].map((item, index) => (
                <div 
                  key={index}
                  className="hover:scale-105"
                  style={{
                    width: '6rem',
                    height: '3rem',
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(4px)',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.3s ease',
                    cursor: 'pointer'
                  }}
                >
                  <span 
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontWeight: '600',
                      fontSize: '0.875rem'
                    }}
                  >
                    合作夥伴
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 底部資訊 */}
          <div 
            style={{
              marginTop: '4rem',
              paddingTop: '2rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <p 
              style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '0.875rem'
              }}
            >
              已有超過 10,000 位旅客選擇 Guidee，開始您的專屬旅程吧！
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}