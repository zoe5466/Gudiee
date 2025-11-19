'use client'

import { Shield, Award, Headphones, CreditCard, MapPin, Users, Clock, Star } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: Shield,
      title: '安全認證',
      description: '每位地陪都經過嚴格身分驗證與背景調查，確保您的旅遊安全',
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600'
    },
    {
      icon: Award,
      title: '品質保證',
      description: '只有評分 4.5 星以上的優秀地陪，提供專業導覽服務',
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600'
    },
    {
      icon: Headphones,
      title: '24/7 支援',
      description: '全天候客服團隊，隨時為您解決旅途中的任何問題',
      color: 'from-purple-500 to-indigo-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      icon: CreditCard,
      title: '安全付款',
      description: '多種付款方式，平台擔保交易，退款保障讓您安心',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    }
  ];

  const highlights = [
    {
      icon: MapPin,
      title: '服務範圍',
      value: '全台 20+',
      subtitle: '個城市',
      description: '覆蓋台灣主要旅遊景點',
      color: 'text-[#002C56]'
    },
    {
      icon: Users,
      title: '專業地陪',
      value: '500+',
      subtitle: '位認證地陪',
      description: '經過嚴格審核的在地嚮導',
      color: 'text-blue-600'
    },
    {
      icon: Clock,
      title: '回應速度',
      value: '< 2',
      subtitle: '小時回覆',
      description: '快速媒合，立即確認',
      color: 'text-green-600'
    },
    {
      icon: Star,
      title: '服務評分',
      value: '4.8',
      subtitle: '星平均評分',
      description: '超過 10,000 則好評',
      color: 'text-yellow-500'
    }
  ];

  return (
    <section 
      style={{
        padding: '5rem 0',
        backgroundColor: '#f8fafc'
      }}
    >
      <div 
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1.5rem'
        }}
      >
        {/* Section Header */}
        <div 
          style={{
            textAlign: 'center',
            marginBottom: '4rem'
          }}
        >
          <h2 
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '1rem'
            }}
          >
            為什麼選擇 Guidee？
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
            我們致力於連接最優秀的在地地陪與旅客，提供安全、專業、難忘的旅遊體驗
          </p>
        </div>

        {/* Features Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginBottom: '5rem'
          }}
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="group"
              style={{
                textAlign: 'center',
                padding: '2rem',
                borderRadius: '1.5rem',
                border: '1px solid #f3f4f6',
                backgroundColor: 'white',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
            >
              {/* Icon */}
              <div 
                className="group-hover:scale-110"
                style={{
                  width: '4rem',
                  height: '4rem',
                  margin: '0 auto 1.5rem auto',
                  borderRadius: '0.75rem',
                  background: 'linear-gradient(to right, #2563eb, #4f46e5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.3s ease'
                }}
              >
                <feature.icon style={{ width: '32px', height: '32px', color: 'white' }} />
              </div>
              
              {/* Content */}
              <h3 
                className="group-hover:text-blue-600"
                style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: '#111827',
                  marginBottom: '0.75rem',
                  transition: 'color 0.3s ease'
                }}
              >
                {feature.title}
              </h3>
              <p 
                style={{
                  color: '#4b5563',
                  lineHeight: '1.75'
                }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Highlights Section */}
        <div 
          style={{
            background: 'linear-gradient(to bottom right, #f8fafc, #ffffff)',
            borderRadius: '1.5rem',
            padding: '3rem 2rem',
            border: '1px solid #f3f4f6',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
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
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '1rem'
              }}
            >
              平台實力一覽
            </h3>
            <p 
              style={{
                fontSize: '1.125rem',
                color: '#4b5563'
              }}
            >
              數據說話，品質保證
            </p>
          </div>

          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '2rem'
            }}
          >
            {highlights.map((highlight, index) => (
              <div
                key={index}
                className="group"
                style={{
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease'
                }}
              >
                {/* Icon */}
                <div 
                  className="group-hover:scale-110"
                  style={{
                    width: '3rem',
                    height: '3rem',
                    margin: '0 auto 1rem auto',
                    borderRadius: '0.75rem',
                    backgroundColor: 'white',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.3s ease'
                  }}
                >
                  <highlight.icon style={{ width: '24px', height: '24px', color: '#2563eb' }} />
                </div>

                {/* Value */}
                <div style={{ marginBottom: '0.5rem' }}>
                  <div 
                    style={{
                      fontSize: 'clamp(2rem, 4vw, 2.5rem)',
                      fontWeight: '700',
                      color: '#2563eb',
                      marginBottom: '0.25rem'
                    }}
                  >
                    {highlight.value}
                  </div>
                  <div 
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151'
                    }}
                  >
                    {highlight.subtitle}
                  </div>
                </div>

                {/* Title & Description */}
                <h4 
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '0.25rem'
                  }}
                >
                  {highlight.title}
                </h4>
                <p 
                  style={{
                    fontSize: '0.75rem',
                    color: '#4b5563'
                  }}
                >
                  {highlight.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div 
          style={{
            marginTop: '4rem',
            textAlign: 'center'
          }}
        >
          <p 
            style={{
              color: '#6b7280',
              marginBottom: '2rem',
              fontSize: '1rem',
              fontWeight: '500'
            }}
          >
            信賴保障
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
            {[
              { name: 'SSL 加密', icon: '🔒' },
              { name: '合法立案', icon: '🏛️' },
              { name: '保險保障', icon: '🛡️' },
              { name: '退款保證', icon: '💰' }
            ].map((badge, index) => (
              <div 
                key={index}
                className="hover:scale-105 hover:shadow-lg"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#4b5563',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'white',
                  borderRadius: '9999px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
              >
                <span style={{ fontSize: '1.25rem' }}>{badge.icon}</span>
                <span style={{ fontWeight: '500' }}>{badge.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}