'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, Star, MapPin, Clock, Users, ChevronRight } from 'lucide-react'
import { useSearch } from '@/store/search'

interface Service {
  id: string
  title: string
  description: string
  location: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  duration: string
  maxGuests: number
  image: string
  badge?: string
  guide: {
    name: string
    avatar: string
    isVerified: boolean
  }
  tags: string[]
}

export function FeaturedServices() {
  const router = useRouter()
  const { favorites, addToFavorites, removeFromFavorites } = useSearch()
  
  const featuredServices: Service[] = [
    {
      id: 'c1234567-1234-4567-8901-123456789001',
      title: '台北101 & 信義區深度導覽',
      description: '專業地陪帶您探索台北最精華的商業區，包含101觀景台、信義商圈購物與在地美食體驗',
      location: '台北市信義區',
      price: 1200,
      originalPrice: 1500,
      rating: 4.9,
      reviewCount: 127,
      duration: '4小時',
      maxGuests: 6,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
      badge: '熱門推薦',
      guide: {
        name: '小美',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        isVerified: true
      },
      tags: ['城市導覽', '美食體驗', '攝影指導']
    },
    {
      id: 'c1234567-1234-4567-8901-123456789002',
      title: '九份老街 & 金瓜石文化之旅',
      description: '體驗台灣最美山城，品嚐道地小吃，了解採礦歷史文化，欣賞絕美海景',
      location: '新北市瑞芳區',
      price: 2800,
      rating: 4.8,
      reviewCount: 89,
      duration: '8小時',
      maxGuests: 4,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
      badge: '經典路線',
      guide: {
        name: '阿明',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        isVerified: true
      },
      tags: ['歷史文化', '山城風光', '美食探索']
    },
    {
      id: 'c1234567-1234-4567-8901-123456789003',
      title: '台南古城文化巡禮',
      description: '深度探索府城台南，走訪古蹟廟宇，品嚐正宗台南小吃，感受濃厚的歷史氛圍',
      location: '台南市中西區',
      price: 1500,
      rating: 4.9,
      reviewCount: 156,
      duration: '6小時',
      maxGuests: 8,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
      guide: {
        name: '小花',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        isVerified: true
      },
      tags: ['古蹟巡禮', '台南小吃', '文化導覽']
    },
    {
      id: 'c1234567-1234-4567-8901-123456789004',
      title: '花蓮太魯閣秘境探索',
      description: '專業登山嚮導帶領，探索太魯閣國家公園絕美峽谷，體驗原住民文化',
      location: '花蓮縣秀林鄉',
      price: 3500,
      rating: 4.7,
      reviewCount: 73,
      duration: '全日',
      maxGuests: 6,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
      badge: '冒險體驗',
      guide: {
        name: '原住民嚮導 阿勇',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        isVerified: true
      },
      tags: ['自然景觀', '登山健行', '原住民文化']
    }
  ]

  const handleFavoriteToggle = (serviceId: string) => {
    if (favorites.includes(serviceId)) {
      removeFromFavorites(serviceId)
    } else {
      addToFavorites(serviceId)
    }
  }

  const handleServiceClick = (serviceId: string) => {
    router.push(`/services/${serviceId}`)
  }

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
          padding: '0 1rem'
        }}
        className="sm:px-6"
      >
        {/* Section Header */}
        <div 
          style={{
            textAlign: 'center',
            marginBottom: '3rem'
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
            精選地陪服務
          </h2>
          <p 
            style={{
              fontSize: '1.25rem',
              color: '#4b5563',
              maxWidth: '512px',
              margin: '0 auto 2rem auto',
              lineHeight: '1.75'
            }}
          >
            嚴選優質地陪，為您提供最難忘的台灣旅遊體驗
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={() => router.push('/search')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.75rem 1.5rem',
                color: '#2563eb',
                border: '2px solid #2563eb',
                borderRadius: '0.75rem',
                backgroundColor: 'transparent',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '1rem',
                touchAction: 'manipulation',
                minHeight: '44px'
              }}
              className="hover:bg-blue-600 hover:text-white"
            >
              查看全部服務
              <ChevronRight style={{ width: '16px', height: '16px', marginLeft: '8px' }} />
            </button>
          </div>
        </div>

        {/* Services Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem'
          }}
          className="sm:gap-8"
        >
          {featuredServices.map((service) => (
            <div
              key={service.id}
              onClick={() => handleServiceClick(service.id)}
              style={{
                backgroundColor: 'white',
                borderRadius: '1.5rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s',
                border: '1px solid #f3f4f6',
                touchAction: 'manipulation'
              }}
              className="hover:shadow-2xl hover:-translate-y-2"
            >
              {/* Image Container */}
              <div 
                style={{
                  position: 'relative',
                  height: '12rem',
                  overflow: 'hidden'
                }}
                className="sm:h-56"
              >
                <img 
                  src={service.image} 
                  alt={service.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s'
                  }}
                  className="hover:scale-110"
                />
                
                {/* Badge */}
                {service.badge && (
                  <div 
                    style={{
                      position: 'absolute',
                      top: '0.75rem',
                      left: '0.75rem',
                      backgroundColor: '#2563eb',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}
                  >
                    {service.badge}
                  </div>
                )}
                
                {/* Favorite Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleFavoriteToggle(service.id)
                  }}
                  style={{
                    position: 'absolute',
                    top: '0.75rem',
                    right: '0.75rem',
                    width: '2.75rem',
                    height: '2.75rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(4px)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    touchAction: 'manipulation'
                  }}
                  className="hover:bg-white"
                >
                  <Heart 
                    style={{
                      width: '20px',
                      height: '20px',
                      color: favorites.includes(service.id) ? '#ef4444' : '#6b7280',
                      fill: favorites.includes(service.id) ? '#ef4444' : 'none'
                    }}
                  />
                </button>

                {/* Price Overlay */}
                <div 
                  style={{
                    position: 'absolute',
                    bottom: '0.75rem',
                    right: '0.75rem',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '0.5rem'
                  }}
                >
                  <div 
                    style={{
                      fontSize: '1.125rem',
                      fontWeight: '700'
                    }}
                  >
                    NT${service.price.toLocaleString()}
                  </div>
                  {service.originalPrice && (
                    <div 
                      style={{
                        fontSize: '0.875rem',
                        textDecoration: 'line-through',
                        opacity: '0.75'
                      }}
                    >
                      NT${service.originalPrice.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '1rem' }} className="sm:p-6">
                {/* Rating & Reviews */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Star style={{ width: '1rem', height: '1rem', color: '#fbbf24', fill: 'currentColor' }} />
                    <span style={{ fontWeight: '600', color: '#111827' }}>{service.rating}</span>
                  </div>
                  <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>({service.reviewCount} 則評價)</span>
                </div>

                {/* Title */}
                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {service.title}
                </h3>

                {/* Description */}
                <p style={{ color: '#4b5563', fontSize: '0.875rem', marginBottom: '1rem', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {service.description}
                </p>

                {/* Service Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                    <MapPin style={{ width: '1rem', height: '1rem' }} />
                    <span>{service.location}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6b7280', flexWrap: 'wrap' }} className="sm:gap-4">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock style={{ width: '1rem', height: '1rem' }} />
                      <span>{service.duration}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Users style={{ width: '1rem', height: '1rem' }} />
                      <span>最多 {service.maxGuests} 人</span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '1rem' }}>
                  {service.tags.slice(0, 2).map((tag, index) => (
                    <span 
                      key={index}
                      style={{ padding: '0.25rem 0.5rem', backgroundColor: '#f3f4f6', color: '#4b5563', borderRadius: '0.5rem', fontSize: '0.75rem' }}
                    >
                      {tag}
                    </span>
                  ))}
                  {service.tags.length > 2 && (
                    <span style={{ padding: '0.25rem 0.5rem', backgroundColor: '#f3f4f6', color: '#4b5563', borderRadius: '0.5rem', fontSize: '0.75rem' }}>
                      +{service.tags.length - 2}
                    </span>
                  )}
                </div>

                {/* Guide Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid #f3f4f6' }}>
                  <img 
                    src={service.guide.avatar} 
                    alt={service.guide.name}
                    style={{ width: '2rem', height: '2rem', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>{service.guide.name}</span>
                      {service.guide.isVerified && (
                        <div style={{ width: '1rem', height: '1rem', backgroundColor: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg style={{ width: '0.625rem', height: '0.625rem', color: 'white' }} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>專業地陪</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div 
          style={{
            textAlign: 'center',
            marginTop: '3rem'
          }}
        >
          <button
            onClick={() => router.push('/search')}
            style={{
              background: 'linear-gradient(to right, #2563eb, #4f46e5)',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '0.75rem',
              fontWeight: '600',
              fontSize: '1.125rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              touchAction: 'manipulation',
              minHeight: '48px'
            }}
            className="hover:-translate-y-1 hover:shadow-2xl"
          >
            探索更多精彩體驗
          </button>
        </div>
      </div>
    </section>
  )
}