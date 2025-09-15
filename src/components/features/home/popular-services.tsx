'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, MapPin, Clock, Users, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ServiceCardProps {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  reviewCount: number;
  duration: string;
  maxGuests: number;
  image: string;
  guideName: string;
  guideAvatar: string;
  isLiked?: boolean;
}

function ServiceCard({
  id,
  title,
  location,
  price,
  rating,
  reviewCount,
  duration,
  maxGuests,
  image,
  guideName,
  guideAvatar,
  isLiked = false
}: ServiceCardProps) {
  const [liked, setLiked] = useState(isLiked);

  return (
    <Link href={`/services/${id}`} className="block">
      <div className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 cursor-pointer">
        {/* 圖片區域 */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        
        {/* 喜歡按鈕 */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setLiked(!liked);
          }}
          className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-300 group-hover:scale-110 z-10"
        >
          <Heart 
            className={`w-5 h-5 transition-colors duration-300 ${
              liked ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`} 
          />
        </button>

        {/* 價格標籤 */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-2xl px-3 py-2">
          <div className="text-lg font-bold text-gray-900">NT$ {price}</div>
          <div className="text-xs text-gray-500">每小時</div>
        </div>
      </div>

      {/* 內容區域 */}
      <div className="p-6">
        {/* 標題和位置 */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-sky-600 transition-colors duration-300 line-clamp-2">
            {title}
          </h3>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">{location}</span>
          </div>
        </div>

        {/* 評分和評論 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="font-semibold text-gray-900">{rating}</span>
            <span className="text-gray-500 text-sm ml-1">({reviewCount})</span>
          </div>
          <div className="flex items-center space-x-4 text-gray-500 text-sm">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{duration}</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>最多 {maxGuests} 人</span>
            </div>
          </div>
        </div>

        {/* 地陪資訊 */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center">
            <img
              src={guideAvatar}
              alt={guideName}
              className="w-8 h-8 rounded-full object-cover mr-3"
            />
            <span className="font-medium text-gray-900">{guideName}</span>
          </div>
          <Button
            size="sm"
            className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 transform hover:scale-105"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.location.href = `/services/${id}`;
            }}
          >
            查看詳情
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

        {/* 懸停效果 */}
        <div className="absolute inset-0 border-2 border-sky-500 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </Link>
  );
}

export function PopularServices() {
  // 使用真實的服務 ID，將來可以從 API 獲取
  const popularServices = [
    {
      id: '7c29388c-db1b-4439-bcc0-5f6a74f8b3b1', // 台北101 & 信义区深度导览
      title: '台北101 & 信義區深度導覽',
      location: '台北市信義區',
      price: 800,
      rating: 4.9,
      reviewCount: 0,
      duration: '4小時',
      maxGuests: 6,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      guideName: '演示導遊',
      guideAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      isLiked: false
    },
    {
      id: '79084261-80b4-44dc-8b21-89b9d55eaaff', // 夜市美食探险之旅
      title: '夜市美食探險之旅',
      location: '台北市士林區',
      price: 600,
      rating: 4.8,
      reviewCount: 0,
      duration: '3小時',
      maxGuests: 8,
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop',
      guideName: '演示導遊',
      guideAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      isLiked: false
    },
    {
      id: '14abe77f-7f14-4667-aeaf-560eb688823b', // 阳明山温泉秘境一日游
      title: '陽明山溫泉秘境一日遊',
      location: '台北市北投區',
      price: 1200,
      rating: 4.9,
      reviewCount: 0,
      duration: '6小時',
      maxGuests: 4,
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
      guideName: '演示導遊',
      guideAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      isLiked: false
    },
    // 可以添加更多模擬服務來填充網格
    {
      id: 'mock-4',
      title: '高雄駁二藝術特區 & 愛河',
      location: '高雄市鹽埕區',
      price: 700,
      rating: 4.7,
      reviewCount: 94,
      duration: '3小時',
      maxGuests: 5,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      guideName: '阿強',
      guideAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      isLiked: false
    },
    {
      id: 'mock-5',
      title: '花蓮太魯閣峽谷探險',
      location: '花蓮縣秀林鄉',
      price: 1500,
      rating: 4.9,
      reviewCount: 203,
      duration: '10小時',
      maxGuests: 6,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      guideName: '小玲',
      guideAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
      isLiked: true
    },
    {
      id: 'mock-6',
      title: '台南古蹟巡禮 & 美食探索',
      location: '台南市中西區',
      price: 900,
      rating: 4.8,
      reviewCount: 167,
      duration: '5小時',
      maxGuests: 4,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      guideName: '阿德',
      guideAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      isLiked: false
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 標題區域 */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            熱門地陪服務
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            精選最受歡迎的地陪服務，帶你深度體驗台灣各地文化與美景
          </p>
        </div>

        {/* 服務卡片網格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {popularServices.map((service) => (
            <ServiceCard key={service.id} {...service} />
          ))}
        </div>

        {/* 查看更多按鈕 */}
        <div className="text-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-2xl px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            探索更多服務
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* 特色標籤 */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-gradient-to-br from-sky-50 to-blue-50 rounded-3xl">
            <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">精選地陪</h3>
            <p className="text-gray-600">經過嚴格審核的專業地陪，確保服務品質</p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-sky-50 to-blue-50 rounded-3xl">
            <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">在地體驗</h3>
            <p className="text-gray-600">深度探索當地文化，體驗最真實的台灣之美</p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-sky-50 to-blue-50 rounded-3xl">
            <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">安全保障</h3>
            <p className="text-gray-600">全程保險保障，讓您安心享受旅程</p>
          </div>
        </div>
      </div>
    </section>
  );
}