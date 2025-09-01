'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Calendar, Users, ChevronDown, Globe, LogIn, UserPlus } from 'lucide-react'
import { DatePicker } from '@/components/ui/date-picker'
import { useAuth } from '@/store/auth'
import { LanguageToggle } from '@/components/i18n/language-switcher'
import { useI18n } from '@/components/providers/i18n-provider'

export function HeroClient() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { t, locale } = useI18n()
  
  const [location, setLocation] = useState('')
  const [checkIn, setCheckIn] = useState<Date | null>(null)
  const [checkOut, setCheckOut] = useState<Date | null>(null)
  const [guests, setGuests] = useState(2)
  const [showGuestPicker, setShowGuestPicker] = useState(false)
  const [today, setToday] = useState<Date>(new Date())
  const [twoMonthsLater, setTwoMonthsLater] = useState<Date>(new Date())
  
  useEffect(() => {
    const todayDate = new Date()
    todayDate.setHours(0, 0, 0, 0)
    const futureDate = new Date(todayDate)
    futureDate.setMonth(todayDate.getMonth() + 2)
    setToday(todayDate)
    setTwoMonthsLater(futureDate)
  }, [])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (location) params.set('location', location)
    if (checkIn) params.set('checkIn', checkIn.toISOString())
    if (checkOut) params.set('checkOut', checkOut.toISOString())
    params.set('guests', guests.toString())
    router.push(`/search?${params.toString()}`)
  }

  const getTexts = () => {
    if (locale === 'en') {
      return {
        badge: 'Taiwan\'s First Guide Matching Platform',
        title1: 'Find Your',
        title2: 'Perfect Guide Experience',
        description: 'Connect with professional local guides and enjoy unique and safe travel experiences. Let expert guides help you explore the beauty of Taiwan in depth.',
        searchTitle: 'Start Your Journey',
        destinationPlaceholder: 'Where do you want to go?',
        guestsCount: (count: number) => `${count} guest${count > 1 ? 's' : ''}`,
        searchButton: 'Search Guides',
        popularSearches: 'Popular Searches',
        popularTags: ['Taipei', 'Taichung', 'Tainan', 'Kaohsiung', 'Food', 'Culture'],
        login: 'Log In',
        register: 'Sign Up'
      }
    }
    return {
      badge: '台灣首創地陪媒合平台',
      title1: '找到',
      title2: '完美地陪體驗',
      description: '連接在地專業地陪，享受獨特且安全的旅遊體驗。讓專業嚮導帶您深度探索台灣之美。',
      searchTitle: '開始您的旅程',
      destinationPlaceholder: '你想去哪裡？',
      guestsCount: (count: number) => `${count} 位旅客`,
      searchButton: '搜尋地陪',
      popularSearches: '熱門搜尋',
      popularTags: ['台北', '台中', '台南', '高雄', '美食', '文化'],
      login: '登入',
      register: '註冊'
    }
  }

  const texts = getTexts()

  return (
    <div 
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #dbeafe, #ffffff, #e0e7ff)',
        position: 'relative'
      }}
    >
      {/* 頂部導航欄 */}
      <div 
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          zIndex: 10,
          padding: '1rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {/* Logo */}
        <div 
          style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#2563eb',
            cursor: 'pointer'
          }}
          onClick={() => router.push('/')}
        >
          Guidee
        </div>

        {/* 右側按鈕組 */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          {/* 語言切換 */}
          <LanguageToggle />

          {/* 登入/註冊按鈕 */}
          {isAuthenticated ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.75rem',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '0.5rem',
                fontSize: '0.875rem'
              }}
            >
              <span>歡迎回來，{user?.name}</span>
            </div>
          ) : (
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              <button
                onClick={() => router.push('/login')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '0.5rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
                className="hover:bg-white hover:shadow-md"
              >
                <LogIn style={{ width: '16px', height: '16px' }} />
                {texts.login}
              </button>
              
              <button
                onClick={() => router.push('/register')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  background: 'linear-gradient(to right, #2563eb, #4f46e5)',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                className="hover:shadow-lg hover:scale-105"
              >
                <UserPlus style={{ width: '16px', height: '16px' }} />
                {texts.register}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <div 
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '6rem 1.5rem 4rem',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh'
        }}
      >
        <div style={{ width: '100%' }}>
          {/* Header */}
          <div 
            style={{
              textAlign: 'center',
              marginBottom: '4rem'
            }}
          >
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
              <span style={{ fontWeight: '500' }}>{texts.badge}</span>
            </div>
            
            <h1 
              style={{
                fontSize: 'clamp(3rem, 8vw, 5rem)',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '1.5rem',
                lineHeight: '1.1'
              }}
            >
              {texts.title1}
              <span 
                style={{
                  display: 'block',
                  color: '#2563eb'
                }}
              >
                {texts.title2}
              </span>
            </h1>
            
            <p 
              style={{
                fontSize: '1.25rem',
                color: '#4b5563',
                maxWidth: '768px',
                margin: '0 auto',
                lineHeight: '1.75'
              }}
            >
              {texts.description}
            </p>
          </div>

          {/* Search Card */}
          <div 
            style={{
              maxWidth: '1000px',
              margin: '0 auto'
            }}
          >
            <div 
              style={{
                backgroundColor: 'white',
                borderRadius: '1rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                border: '1px solid #f3f4f6',
                padding: '2rem'
              }}
            >
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem'
                }}
              >
                <h2 
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#111827',
                    textAlign: 'center'
                  }}
                >
                  {texts.searchTitle}
                </h2>
              </div>

              {/* Search Form */}
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'end',
                  gap: '1rem',
                  marginBottom: '1.5rem',
                  flexWrap: 'wrap'
                }}
              >
                {/* Location */}
                <div style={{ flex: '1', minWidth: '200px' }}>
                  <label 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '0.5rem'
                    }}
                  >
                    <MapPin style={{ width: '16px', height: '16px', marginRight: '8px', color: '#3b82f6' }} />
                    {t('search.destination')}
                  </label>
                  <input
                    type="text"
                    placeholder={texts.destinationPlaceholder}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      transition: 'all 0.2s',
                      outline: 'none'
                    }}
                    className="focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                {/* 出發日 */}
                <div style={{ flex: '1', minWidth: '180px', position: 'relative' }}>
                  <label 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '0.5rem'
                    }}
                  >
                    <Calendar style={{ width: '16px', height: '16px', marginRight: '8px', color: '#3b82f6' }} />
                    {t('search.departure_date')}
                  </label>
                  <DatePicker
                    value={checkIn || undefined}
                    onChange={(date) => setCheckIn(date || null)}
                    placeholder={t('search.departure_placeholder')}
                    className="w-full"
                    minDate={today}
                    maxDate={twoMonthsLater}
                  />
                </div>

                {/* 回程日 */}
                <div style={{ flex: '1', minWidth: '180px', position: 'relative' }}>
                  <label 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '0.5rem'
                    }}
                  >
                    <Calendar style={{ width: '16px', height: '16px', marginRight: '8px', color: '#3b82f6' }} />
                    {t('search.return_date')}
                  </label>
                  <DatePicker
                    value={checkOut || undefined}
                    onChange={(date) => setCheckOut(date || null)}
                    placeholder={t('search.return_placeholder')}
                    className="w-full"
                    minDate={checkIn || today}
                    maxDate={twoMonthsLater}
                  />
                </div>

                {/* Guests */}
                <div style={{ flex: '1', minWidth: '150px', position: 'relative' }}>
                  <label 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '0.5rem'
                    }}
                  >
                    <Users style={{ width: '16px', height: '16px', marginRight: '8px', color: '#3b82f6' }} />
                    {t('search.guests')}
                  </label>
                  <button
                    onClick={() => setShowGuestPicker(!showGuestPicker)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      textAlign: 'left',
                      backgroundColor: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    className="hover:border-gray-400"
                  >
                    <span>{texts.guestsCount(guests)}</span>
                    <ChevronDown style={{ width: '16px', height: '16px' }} />
                  </button>
                  
                  {showGuestPicker && (
                    <div 
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 0.5rem)',
                        left: '0',
                        right: '0',
                        padding: '1.5rem',
                        backgroundColor: 'white',
                        borderRadius: '0.75rem',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        border: '1px solid #e5e7eb',
                        zIndex: 50
                      }}
                    >
                      <div 
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <span 
                          style={{
                            color: '#374151',
                            fontWeight: '500'
                          }}
                        >
                          {t('search.guests')}
                        </span>
                        <div 
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem'
                          }}
                        >
                          <button
                            onClick={() => setGuests(Math.max(1, guests - 1))}
                            className="hover:bg-blue-50 hover:border-blue-300"
                            style={{
                              width: '2.5rem',
                              height: '2.5rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: 'white',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                          >
                            <span style={{ fontSize: '1.125rem' }}>−</span>
                          </button>
                          <span 
                            style={{
                              fontWeight: '700',
                              fontSize: '1.125rem',
                              width: '2rem',
                              textAlign: 'center'
                            }}
                          >
                            {guests}
                          </span>
                          <button
                            onClick={() => setGuests(Math.min(10, guests + 1))}
                            className="hover:bg-blue-50 hover:border-blue-300"
                            style={{
                              width: '2.5rem',
                              height: '2.5rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: 'white',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                          >
                            <span style={{ fontSize: '1.125rem' }}>+</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Search Button */}
                <div>
                  <label style={{ display: 'block', height: '1.5rem' }}></label>
                  <button
                    onClick={handleSearch}
                    className="hover:scale-105 hover:shadow-xl"
                    style={{
                      background: 'linear-gradient(to right, #2563eb, #4f46e5)',
                      color: 'white',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '0.5rem',
                      fontWeight: '600',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      fontSize: '1rem',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <Search style={{ width: '18px', height: '18px' }} />
                    {texts.searchButton}
                  </button>
                </div>
              </div>

              {/* Quick Search Tags */}
              <div 
                style={{
                  marginTop: '2rem',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid #f3f4f6'
                }}
              >
                <p 
                  style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    marginBottom: '1rem',
                    textAlign: 'center'
                  }}
                >
                  {texts.popularSearches}
                </p>
                <div 
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    justifyContent: 'center'
                  }}
                >
                  {texts.popularTags.map((tag, index) => (
                    <button
                      key={index}
                      onClick={() => router.push(`/search?${tag.includes('食') || tag.includes('文') || tag.includes('Food') || tag.includes('Culture') ? 'category' : 'location'}=${tag}`)}
                      className="hover:bg-blue-50 hover:text-blue-600"
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '9999px',
                        backgroundColor: '#f3f4f6',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}