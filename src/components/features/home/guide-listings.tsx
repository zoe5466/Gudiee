'use client';

import { Star, Heart, MapPin } from 'lucide-react';

const featuredGuides = [
  {
    id: 1,
    name: '阿明',
    title: '台北美食專家',
    location: '台北市',
    rating: 4.95,
    reviewCount: 237,
    price: 1500,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRkY1QTVGIi8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjEyMCIgcj0iNDAiIGZpbGw9IndoaXRlIi8+CjxyZWN0IHg9IjEyNSIgeT0iMTgwIiB3aWR0aD0iNTAiIGhlaWdodD0iNjAiIGZpbGw9IndoaXRlIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMjcwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxNCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuWPsOWMl+e+jumjn+WwiOWutjwvdGV4dD4KPC9zdmc+',
    specialty: '夜市美食導覽',
    experience: '5年經驗',
    languages: ['中文', '英文'],
    badges: ['超級導遊', '美食專家']
  },
  {
    id: 2,
    name: 'Sarah',
    title: '台中文青指南',
    location: '台中市',
    rating: 4.87,
    reviewCount: 156,
    price: 1200,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMTBCOTgxIi8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjEyMCIgcj0iNDAiIGZpbGw9IndoaXRlIi8+CjxyZWN0IHg9IjEyNSIgeT0iMTgwIiB3aWR0aD0iNTAiIGhlaWdodD0iNjAiIGZpbGw9IndoaXRlIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMjcwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxNCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuWPsOS4reaWh+mdkuaMh+WNlzwvdGV4dD4KPC9zdmc+',
    specialty: '文創景點巡禮',
    experience: '3年經驗',
    languages: ['中文', '英文', '日文'],
    badges: ['文青達人', '攝影高手']
  },
  {
    id: 3,
    name: '志明',
    title: '台南古蹟解說員',
    location: '台南市',
    rating: 4.92,
    reviewCount: 189,
    price: 1000,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjk3OTE2Ii8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjEyMCIgcj0iNDAiIGZpbGw9IndoaXRlIi8+CjxyZWN0IHg9IjEyNSIgeT0iMTgwIiB3aWR0aD0iNTAiIGhlaWdodD0iNjAiIGZpbGw9IndoaXRlIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMjcwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxNCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuWPsOWNl+WPpOiFueino+iqquWToe8L3RleHQ+Cjwvc3ZnPgo=',
    specialty: '歷史文化導覽',
    experience: '8年經驗',
    languages: ['中文', '英文'],
    badges: ['歷史專家', '認證導遊']
  },
  {
    id: 4,
    name: '小美',
    title: '花蓮戶外達人',
    location: '花蓮縣',
    rating: 4.88,
    reviewCount: 124,
    price: 2500,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMEY3MkZGIi8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjEyMCIgcj0iNDAiIGZpbGw9IndoaXRlIi8+CjxyZWN0IHg9IjEyNSIgeT0iMTgwIiB3aWR0aD0iNTAiIGhlaWdodD0iNjAiIGZpbGw9IndoaXRlIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMjcwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxNCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuiKseiTruaItOWklOmBkOS6ujwvdGV4dD4KPC9zdmc+',
    specialty: '太魯閣生態導覽',
    experience: '6年經驗',
    languages: ['中文', '英文'],
    badges: ['生態專家', '登山嚮導']
  },
];

export function GuideListings() {
  return (
    <section className="section bg-white">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <h2 className="heading-2">精選地陪</h2>
          <button className="btn btn-ghost text-[#FF5A5F] hover:bg-red-50">
            查看全部
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredGuides.map((guide, index) => (
            <div 
              key={guide.id} 
              className="card-listing animate-fade-in"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              {/* Guide Image */}
              <div className="listing-image relative">
                <img 
                  src={guide.image} 
                  alt={guide.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <button className="w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors group">
                    <Heart className="w-4 h-4 text-gray-600 group-hover:text-red-500 transition-colors" />
                  </button>
                </div>
                
                {/* Badges */}
                <div className="absolute bottom-3 left-3">
                  <div className="flex flex-wrap gap-1">
                    {guide.badges.slice(0, 1).map((badge, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-1 bg-white/90 text-xs font-medium text-gray-800 rounded-full"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Guide Info */}
              <div className="listing-content">
                {/* Rating */}
                <div className="listing-rating mb-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-medium text-gray-900 ml-1">{guide.rating}</span>
                  <span className="text-gray-500 ml-1">({guide.reviewCount})</span>
                </div>

                {/* Name & Title */}
                <h3 className="listing-title">{guide.name} - {guide.title}</h3>
                
                {/* Location */}
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-3 h-3 mr-1" />
                  <span className="text-sm">{guide.location}</span>
                </div>

                {/* Specialty */}
                <p className="listing-subtitle">{guide.specialty}</p>

                {/* Languages */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {guide.languages.map((lang, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded-full"
                    >
                      {lang}
                    </span>
                  ))}
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div className="listing-price">NT${guide.price.toLocaleString()} / 天</div>
                  <span className="text-xs text-gray-500">{guide.experience}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <button className="btn btn-primary btn-lg">
            成為 Guidee 地陪
          </button>
          <p className="text-gray-500 mt-2">分享你的在地知識，創造額外收入</p>
        </div>
      </div>
    </section>
  );
}