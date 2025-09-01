'use client'

import { Star, Quote } from 'lucide-react';

export function Testimonials() {
  const testimonials = [
    {
      name: '王小明',
      role: '旅客',
      location: '台北',
      rating: 5,
      content: '透過 Guidee 找到了超棒的地陪！小美帶我們深度體驗台北文化，比自己走馬看花有趣太多了。她不僅是導遊，更像是當地的朋友，讓我們真正感受到台灣的人情味。',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      service: '台北101 & 信義區深度導覽'
    },
    {
      name: '李美華',
      role: '地陪',
      location: '高雄',
      rating: 5,
      content: '成為 Guidee 地陪後，每個月都有穩定的收入。平台很安全，客服也很專業。最重要的是，能夠分享家鄉之美，看到旅客滿意的笑容，這份工作真的很有意義。',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      service: '高雄駁二藝術特區導覽'
    },
    {
      name: 'John Smith',
      role: '旅客',
      location: '台中',
      rating: 5,
      content: 'Amazing experience! The local guide was knowledgeable and friendly. Guidee made it so easy to book and the whole process was smooth. Highly recommend for anyone visiting Taiwan!',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      service: '台中文化之旅'
    },
    {
      name: '陳雅婷',
      role: '旅客',
      location: '花蓮',
      rating: 5,
      content: '花蓮太魯閣的行程超棒的！地陪小玲對當地非常熟悉，帶我們去了很多一般遊客不會去的地方。風景美得讓人屏息，這趟旅程讓我愛上了台灣東部。',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
      service: '花蓮太魯閣峽谷探險'
    },
    {
      name: '張志明',
      role: '地陪',
      location: '台南',
      rating: 5,
      content: '在 Guidee 平台上接案很穩定，收入比之前做兼職好很多。平台提供的培訓課程也讓我學到很多導覽技巧，客戶評價都很正面。',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      service: '台南古蹟巡禮'
    },
    {
      name: 'Sarah Johnson',
      role: '旅客',
      location: '九份',
      rating: 5,
      content: 'The guide was incredibly knowledgeable about the mining history and local culture. The sunset view from Jiufen was breathtaking. This experience exceeded all my expectations!',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      service: '九份老街 & 金瓜石礦業遺址'
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        style={{
          width: '20px',
          height: '20px',
          color: i < rating ? '#fbbf24' : '#d1d5db',
          fill: i < rating ? '#fbbf24' : 'none'
        }}
      />
    ));
  };

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
            用戶真實分享
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
            聽聽使用者怎麼說 Guidee，真實的體驗分享
          </p>
        </div>

        {/* 見證卡片網格 */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem'
          }}
        >
          {testimonials.map((testimonial, index) => (
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
              {/* 引號裝飾 */}
              <div 
                className="group-hover:opacity-30"
                style={{
                  position: 'absolute',
                  top: '1.5rem',
                  right: '1.5rem',
                  width: '3rem',
                  height: '3rem',
                  background: 'linear-gradient(to bottom right, #2563eb, #4f46e5)',
                  borderRadius: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: '0.1',
                  transition: 'opacity 0.3s ease'
                }}
              >
                <Quote style={{ width: '24px', height: '24px', color: 'white' }} />
              </div>

              {/* 評分 */}
              <div 
                style={{
                  display: 'flex',
                  gap: '0.25rem',
                  marginBottom: '1.5rem'
                }}
              >
                {renderStars(testimonial.rating)}
              </div>

              {/* 內容 */}
              <blockquote 
                style={{
                  color: '#374151',
                  lineHeight: '1.75',
                  marginBottom: '1.5rem',
                  fontStyle: 'italic'
                }}
              >
                "{testimonial.content}"
              </blockquote>

              {/* 服務資訊 */}
              <div 
                style={{
                  fontSize: '0.875rem',
                  color: '#2563eb',
                  fontWeight: '500',
                  marginBottom: '1rem'
                }}
              >
                {testimonial.service}
              </div>

              {/* 用戶資訊 */}
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  style={{
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginRight: '1rem'
                  }}
                />
                <div>
                  <div 
                    style={{
                      fontWeight: '600',
                      color: '#111827'
                    }}
                  >
                    {testimonial.name}
                  </div>
                  <div 
                    style={{
                      fontSize: '0.875rem',
                      color: '#6b7280'
                    }}
                  >
                    {testimonial.role} • {testimonial.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 統計摘要 */}
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
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem',
              textAlign: 'center'
            }}
          >
            {[
              { value: '4.9', label: '平均評分', desc: '基於 2,000+ 評價' },
              { value: '98%', label: '推薦率', desc: '用戶願意推薦' },
              { value: '2,000+', label: '真實評價', desc: '來自實際用戶' },
              { value: '24/7', label: '客服支援', desc: '全天候服務' }
            ].map((item, index) => (
              <div key={index}>
                <div 
                  style={{
                    fontSize: '2.5rem',
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
                    marginBottom: '0.25rem'
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

        {/* 行動呼籲 */}
        <div 
          style={{
            textAlign: 'center',
            marginTop: '4rem'
          }}
        >
          <p 
            style={{
              fontSize: '1.25rem',
              color: '#4b5563',
              marginBottom: '2rem'
            }}
          >
            加入我們，開始您的專屬旅遊體驗
          </p>
          <div 
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            className="sm:flex-row"
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
                transition: 'all 0.3s ease'
              }}
            >
              立即預訂
            </button>
            <button
              className="hover:bg-blue-600 hover:text-white hover:scale-105"
              style={{
                border: '2px solid #2563eb',
                color: '#2563eb',
                backgroundColor: 'transparent',
                borderRadius: '1rem',
                padding: '1rem 2rem',
                fontSize: '1.125rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              查看更多評價
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}