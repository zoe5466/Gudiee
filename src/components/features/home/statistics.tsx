'use client'

import { Users, MapPin, Clock, Star, TrendingUp, Award } from 'lucide-react';

export function Statistics() {
  const stats = [
    {
      icon: Users,
      value: '1,500+',
      label: '認證地陪',
      description: '遍布各大城市的專業導遊',
      color: 'from-sky-500 to-blue-600'
    },
    {
      icon: MapPin,
      value: '50+',
      label: '服務地點',
      description: '覆蓋台灣熱門旅遊景點',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      icon: Clock,
      value: '< 2 小時',
      label: '平均回應',
      description: '快速媒合最適合的地陪',
      color: 'from-amber-500 to-orange-600'
    },
    {
      icon: Star,
      value: '4.9',
      label: '用戶評分',
      description: '超越期待的服務體驗',
      color: 'from-purple-500 to-indigo-600'
    }
  ];

  const achievements = [
    {
      icon: TrendingUp,
      title: '持續成長',
      value: '300%',
      description: '年度用戶增長率'
    },
    {
      icon: Award,
      title: '品質認證',
      value: '100%',
      description: '地陪審核通過率'
    }
  ];

  return (
    <section 
      style={{
        padding: '6rem 0',
        background: 'linear-gradient(to bottom right, #dbeafe, #e0e7ff, #f3e8ff)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* 背景裝飾 */}
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
            background: 'rgba(147, 197, 253, 0.2)',
            borderRadius: '50%',
            filter: 'blur(48px)'
          }}
        />
        <div 
          style={{
            position: 'absolute',
            bottom: '5rem',
            right: '5rem',
            width: '20rem',
            height: '20rem',
            background: 'rgba(191, 219, 254, 0.2)',
            borderRadius: '50%',
            filter: 'blur(48px)'
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
            background: 'rgba(196, 181, 253, 0.2)',
            borderRadius: '50%',
            filter: 'blur(48px)'
          }}
        />
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
            數字說話，見證{' '}
            <span 
              style={{
                color: '#2563eb'
              }}
            >
              Guidee
            </span>{' '}
            的成長軌跡
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
            透過真實數據展現我們的服務品質和用戶滿意度
          </p>
        </div>

        {/* 主要統計數據 */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginBottom: '5rem'
          }}
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group hover:scale-105 hover:shadow-2xl"
              style={{
                position: 'relative',
                backgroundColor: 'white',
                borderRadius: '1.5rem',
                padding: '2rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.5s ease',
                cursor: 'pointer',
                border: '1px solid #f3f4f6'
              }}
            >
              {/* 背景裝飾 */}
              <div 
                className="group-hover:opacity-20"
                style={{
                  position: 'absolute',
                  inset: '0',
                  background: 'linear-gradient(to bottom right, #dbeafe, #e0e7ff)',
                  opacity: '0.1',
                  borderRadius: '1.5rem',
                  transition: 'opacity 0.5s ease'
                }}
              />
              
              {/* 圖標 */}
              <div 
                className="group-hover:scale-110"
                style={{
                  position: 'relative',
                  width: '4rem',
                  height: '4rem',
                  background: 'linear-gradient(to bottom right, #2563eb, #4f46e5)',
                  borderRadius: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                  transition: 'transform 0.3s ease'
                }}
              >
                <stat.icon style={{ width: '32px', height: '32px', color: 'white' }} />
              </div>

              {/* 數據 */}
              <div 
                className="group-hover:text-blue-600"
                style={{
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  color: '#111827',
                  marginBottom: '0.5rem',
                  transition: 'color 0.3s ease'
                }}
              >
                {stat.value}
              </div>
              <div 
                style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}
              >
                {stat.label}
              </div>
              <div 
                style={{
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}
              >
                {stat.description}
              </div>
            </div>
          ))}
        </div>

        {/* 成就展示 */}
        <div 
          style={{
            backgroundColor: 'white',
            borderRadius: '1.5rem',
            padding: '3rem',
            boxShadow: '0 35px 60px -12px rgba(0, 0, 0, 0.35)',
            border: '1px solid #f3f4f6'
          }}
        >
          <div 
            style={{
              textAlign: 'center',
              marginBottom: '3rem'
            }}
          >
            <h3 
              style={{
                fontSize: 'clamp(1.875rem, 3vw, 2.25rem)',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '1rem'
              }}
            >
              平台成就
            </h3>
            <p 
              style={{
                fontSize: '1.125rem',
                color: '#4b5563'
              }}
            >
              我們為用戶創造的價值和成就
            </p>
          </div>

          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '2rem'
            }}
          >
            {achievements.map((achievement, index) => (
              <div 
                key={index}
                className="group hover:scale-105"
                style={{
                  textAlign: 'center',
                  transition: 'transform 0.3s ease',
                  cursor: 'pointer'
                }}
              >
                <div 
                  className="group-hover:scale-110"
                  style={{
                    width: '5rem',
                    height: '5rem',
                    background: 'linear-gradient(to bottom right, #2563eb, #4f46e5)',
                    borderRadius: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem auto',
                    transition: 'transform 0.3s ease'
                  }}
                >
                  <achievement.icon style={{ width: '40px', height: '40px', color: 'white' }} />
                </div>
                <div 
                  className="group-hover:text-blue-600"
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: '700',
                    color: '#111827',
                    marginBottom: '0.5rem',
                    transition: 'color 0.3s ease'
                  }}
                >
                  {achievement.value}
                </div>
                <div 
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}
                >
                  {achievement.title}
                </div>
                <div 
                  style={{
                    color: '#6b7280'
                  }}
                >
                  {achievement.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 信任指標 */}
        <div 
          style={{
            marginTop: '4rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem'
          }}
        >
          {[
            { value: '98%', label: '用戶滿意度', desc: '基於真實用戶評價' },
            { value: '24/7', label: '客服支援', desc: '全天候專業服務' },
            { value: '100%', label: '安全保障', desc: '全程保險覆蓋' }
          ].map((item, index) => (
            <div 
              key={index}
              className="hover:scale-105 hover:shadow-lg"
              style={{
                textAlign: 'center',
                padding: '1.5rem',
                backgroundColor: 'white',
                borderRadius: '1.5rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                border: '1px solid #f3f4f6',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
            >
              <div 
                style={{
                  fontSize: '1.875rem',
                  fontWeight: '700',
                  color: '#2563eb',
                  marginBottom: '0.5rem'
                }}
              >
                {item.value}
              </div>
              <div 
                style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '0.5rem'
                }}
              >
                {item.label}
              </div>
              <div 
                style={{
                  color: '#6b7280'
                }}
              >
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}