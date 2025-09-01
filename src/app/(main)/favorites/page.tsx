'use client'

import { useState, useEffect } from 'react'
import { Heart, Star, MapPin, Users, Clock, Search, Filter, Grid, List } from 'lucide-react'
import { useSearch } from '@/store/search'
import { Rating } from '@/components/ui/rating'
import { Loading } from '@/components/ui/loading'
import Link from 'next/link'

export default function FavoritesPage() {
  const { favorites, removeFromFavorites } = useSearch()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Mock favorites data - 在實際應用中從 API 獲取
  const mockFavorites = [
    {
      id: '1',
      title: '台北101 & 信義區深度導覽',
      description: '帶您深度探索台北最精華的信義區，從台北101觀景台俯瞰整個台北盆地',
      location: '台北市信義區',
      price: 800,
      priceUnit: 'hour' as const,
      rating: 4.9,
      reviewCount: 127,
      duration: '4小時',
      maxGuests: 6,
      images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'],
      guide: {
        id: 'guide-1',
        name: '小美',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
        rating: 4.9,
        reviewCount: 156,
        languages: ['中文', '英文'],
        responseTime: '1小時內回覆',
      },
      tags: ['文化體驗', '城市導覽', '攝影'],
      isInstantBook: true,
      addedAt: '2024-01-15',
    },
    {
      id: '2',
      title: '九份老街 & 金瓜石文化之旅',
      description: '探索台灣最美的山城，品嚐道地小吃，了解採礦歷史',
      location: '新北市瑞芳區',
      price: 1200,
      priceUnit: 'day' as const,
      rating: 4.8,
      reviewCount: 89,
      duration: '8小時',
      maxGuests: 4,
      images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'],
      guide: {
        id: 'guide-2',
        name: '阿明',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
        rating: 4.8,
        reviewCount: 234,
        languages: ['中文', '英文', '日文'],
        responseTime: '2小時內回覆',
      },
      tags: ['歷史文化', '美食探索', '山城'],
      isInstantBook: false,
      addedAt: '2024-01-12',
    },
    {
      id: '3',
      title: '淡水老街 & 漁人碼頭夕陽之旅',
      description: '欣賞台灣最美夕陽，品嚐淡水阿給與鐵蛋',
      location: '新北市淡水區',
      price: 600,
      priceUnit: 'hour' as const,
      rating: 4.7,
      reviewCount: 156,
      duration: '3小時',
      maxGuests: 8,
      images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'],
      guide: {
        id: 'guide-3',
        name: '小花',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
        rating: 4.7,
        reviewCount: 98,
        languages: ['中文'],
        responseTime: '30分鐘內回覆',
      },
      tags: ['夕陽景色', '美食探索', '河岸漫步'],
      isInstantBook: true,
      addedAt: '2024-01-10',
    },
  ]

  const filteredFavorites = mockFavorites.filter(item =>
    favorites.includes(item.id) &&
    (searchQuery === '' || 
     item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
     item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  )

  const handleRemoveFavorite = (serviceId: string) => {
    removeFromFavorites(serviceId)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading variant="spinner" size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="heading-1 text-gray-900 mb-2">我的收藏</h1>
          <p className="body-large text-gray-600">
            您收藏的地陪服務 ({filteredFavorites.length})
          </p>
        </div>

        {/* Search and Filters */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="搜尋收藏的服務..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <button className="btn btn-secondary flex items-center gap-2">
                <Filter className="w-4 h-4" />
                篩選
              </button>
              
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Favorites List */}
        {filteredFavorites.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery ? '沒有找到相關收藏' : '還沒有收藏任何服務'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery 
                ? '試試調整搜尋關鍵字或清除篩選條件'
                : '開始探索並收藏您喜歡的地陪服務'
              }
            </p>
            <Link href="/search" className="btn btn-primary">
              探索服務
            </Link>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-6'
          }>
            {filteredFavorites.map((service) => (
              <div 
                key={service.id}
                className={`card group hover:shadow-lg transition-all duration-200 ${
                  viewMode === 'list' ? 'flex gap-6' : ''
                }`}
              >
                <div className={`relative ${viewMode === 'list' ? 'w-48 h-32' : 'h-48'} overflow-hidden`}>
                  <img 
                    src={service.images[0]} 
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  
                  {/* Favorite Button */}
                  <button
                    onClick={() => handleRemoveFavorite(service.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <Heart className="w-4 h-4 text-red-500 fill-current" />
                  </button>

                  {/* Instant Book Badge */}
                  {service.isInstantBook && (
                    <div className="absolute top-3 left-3 bg-[#FF5A5F] text-white px-2 py-1 rounded text-xs font-medium">
                      即時預訂
                    </div>
                  )}
                </div>

                <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  {/* Guide Info */}
                  <div className="flex items-center gap-2 mb-3">
                    <img 
                      src={service.guide.avatar} 
                      alt={service.guide.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-sm text-gray-600">{service.guide.name}</span>
                  </div>

                  {/* Title */}
                  <Link href={`/services/${service.id}`}>
                    <h3 className="font-semibold text-gray-900 mb-2 hover:text-[#FF5A5F] transition-colors line-clamp-2">
                      {service.title}
                    </h3>
                  </Link>

                  {/* Location */}
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{service.location}</span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <Rating value={service.rating} size="sm" readonly />
                    <span className="text-sm text-gray-600">
                      {service.rating} ({service.reviewCount} 則評價)
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{service.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>最多 {service.maxGuests} 人</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {service.tags.slice(0, 3).map((tag, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Price and Added Date */}
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold text-gray-900">
                      NT$ {service.price.toLocaleString()}
                      <span className="text-sm text-gray-600 font-normal">
                        /{service.priceUnit === 'hour' ? '小時' : service.priceUnit === 'day' ? '天' : '趟'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(service.addedAt).toLocaleDateString('zh-TW')} 收藏
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}