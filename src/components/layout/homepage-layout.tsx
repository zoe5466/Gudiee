'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Search, Globe, Menu, User, Heart, MessageCircle } from 'lucide-react'

interface HomePageLayoutProps {
  children: React.ReactNode
}

export function HomePageLayout({ children }: HomePageLayoutProps) {
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Floating Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white shadow-lg' 
            : 'bg-transparent'
        }`}
      >
        <div className="container">
          <div className={`flex items-center justify-between h-16 transition-all duration-300 ${
            isScrolled 
              ? 'bg-white rounded-none' 
              : 'bg-white/90 backdrop-blur-md rounded-2xl mt-4 shadow-lg px-6'
          }`}>
            {/* Logo */}
            <div
              className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => router.push('/')}
            >
              <div className="h-24 flex items-center justify-center flex-shrink-0">
                <Image
                  src="/logo-navbar.png"
                  alt="Guidee Logo"
                  width={450}
                  height={450}
                  priority
                  className="object-contain h-full w-auto"
                />
              </div>
            </div>

            {/* Center Search (when scrolled) */}
            {isScrolled && (
              <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 cursor-pointer hover:shadow-md transition-shadow">
                <Search className="w-4 h-4 text-gray-500 mr-3" />
                <span className="text-gray-700">搜尋地陪服務...</span>
              </div>
            )}

            {/* Right Menu */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.push('/favorites')}
                className="hidden md:flex items-center text-gray-700 hover:text-[#002C56] transition-colors"
              >
                <Heart className="w-5 h-5 mr-1" />
                <span className="text-sm">收藏</span>
              </button>
              
              <button 
                onClick={() => router.push('/history')}
                className="hidden md:flex items-center text-gray-700 hover:text-[#002C56] transition-colors"
              >
                <MessageCircle className="w-5 h-5 mr-1" />
                <span className="text-sm">訂單</span>
              </button>

              <button className="text-gray-700 hover:text-[#002C56] transition-colors">
                <Globe className="w-5 h-5" />
              </button>

              <button 
                onClick={() => router.push('/profile')}
                className="flex items-center bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
              >
                <Menu className="w-4 h-4 text-gray-600 mr-2" />
                <div className="w-6 h-6 bg-[#002C56] rounded-full flex items-center justify-center">
                  <User className="w-3 h-3 text-white" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative">
        {children}
      </main>

      {/* Simple Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company */}
            <div>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src="/logo.png"
                    alt="Guidee Logo"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <span className="ml-2 text-2xl font-bold text-white">Guidee</span>
              </div>
              <p className="text-gray-300 text-sm">
                連接在地地陪與旅客的專業媒合平台
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">快速連結</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="/search" className="hover:text-white transition-colors">搜尋地陪</a></li>
                <li><a href="/register" className="hover:text-white transition-colors">成為地陪</a></li>
                <li><a href="/about" className="hover:text-white transition-colors">關於我們</a></li>
                <li><a href="/help" className="hover:text-white transition-colors">幫助中心</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold mb-4">客戶支援</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="/contact" className="hover:text-white transition-colors">聯絡我們</a></li>
                <li><a href="/safety" className="hover:text-white transition-colors">安全中心</a></li>
                <li><a href="/trust" className="hover:text-white transition-colors">信任保障</a></li>
                <li><a href="/insurance" className="hover:text-white transition-colors">保險政策</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold mb-4">法律條款</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="/terms" className="hover:text-white transition-colors">服務條款</a></li>
                <li><a href="/privacy" className="hover:text-white transition-colors">隱私政策</a></li>
                <li><a href="/cookies" className="hover:text-white transition-colors">Cookie 政策</a></li>
                <li><a href="/disclaimer" className="hover:text-white transition-colors">免責聲明</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Guidee. 版權所有。
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Facebook</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Instagram</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Line</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}