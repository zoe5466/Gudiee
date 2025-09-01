'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Globe, Shield, Heart, MapPin, Star, Award, TrendingUp, Eye, Target, Zap } from 'lucide-react';

export default function AboutPage() {
  const router = useRouter();

  const stats = [
    { label: '註冊地陪', value: '2,500+', icon: Users },
    { label: '完成體驗', value: '15,000+', icon: Star },
    { label: '覆蓋城市', value: '50+', icon: MapPin },
    { label: '用戶滿意度', value: '98%', icon: Heart }
  ];

  const values = [
    {
      icon: Shield,
      title: '安全第一',
      description: '我們嚴格審核每一位地陪，確保所有體驗都安全可靠，讓您放心探索。'
    },
    {
      icon: Heart,
      title: '用心服務',
      description: '每一次相遇都是獨特的故事，我們用心連接旅客與在地人，創造難忘回憶。'
    },
    {
      icon: Globe,
      title: '文化交流',
      description: '促進不同文化間的理解與交流，讓旅行成為心靈的橋梁。'
    },
    {
      icon: Award,
      title: '品質保證',
      description: '持續優化服務品質，為用戶提供最優質的在地體驗。'
    }
  ];

  const team = [
    {
      name: '張小明',
      position: '創辦人 & CEO',
      bio: '擁有10年旅遊業經驗，致力於推動台灣在地旅遊發展',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face'
    },
    {
      name: '李小華',
      position: '技術長 & CTO',
      bio: '前知名科技公司技術主管，專精於平台開發與用戶體驗',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face'
    },
    {
      name: '王小美',
      position: '營運長 & COO',
      bio: '豐富的營運管理經驗，專注於地陪社群建立與服務品質',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face'
    }
  ];

  const milestones = [
    { year: '2020', title: 'Guidee 成立', description: '創立台灣首個地陪媒合平台' },
    { year: '2021', title: '快速成長', description: '達成 1,000 位註冊地陪' },
    { year: '2022', title: '服務擴展', description: '服務範圍擴展至全台 30 個城市' },
    { year: '2023', title: '品質提升', description: '推出地陪認證制度，提升服務品質' },
    { year: '2024', title: '持續創新', description: '推出 AI 智能配對功能，優化使用者體驗' }
  ];

  return (
    <div 
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #dbeafe, #ffffff, #e0e7ff)'
      }}
    >
      {/* Back to Home Button */}
      <div 
        style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          zIndex: 10
        }}
      >
        <button
          onClick={() => router.push('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '0.5rem',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#374151'
          }}
          className="hover:bg-white hover:shadow-md"
        >
          ← 回到首頁
        </button>
      </div>

      {/* Hero Section */}
      <section style={{ padding: '6rem 1rem 4rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
            <span style={{ fontWeight: '500' }}>關於 Guidee</span>
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
            連接旅客與在地人
            <span style={{ display: 'block', color: '#2563eb' }}>
              創造難忘旅程
            </span>
          </h1>
          
          <p 
            style={{
              fontSize: '1.25rem',
              color: '#4b5563',
              maxWidth: '768px',
              margin: '0 auto 3rem',
              lineHeight: '1.75'
            }}
          >
            Guidee 是台灣首創的地陪媒合平台，我們相信每一次旅行都應該是獨特而有意義的體驗。
            透過連接專業的在地導覽員與旅客，我們讓您以最真實的方式探索台灣之美。
          </p>
        </div>
      </section>

      {/* Statistics */}
      <section style={{ padding: '4rem 1rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index}
                  style={{
                    textAlign: 'center',
                    padding: '2rem',
                    borderRadius: '1rem',
                    backgroundColor: '#f9fafb',
                    border: '1px solid #f3f4f6'
                  }}
                >
                  <div 
                    style={{
                      width: '4rem',
                      height: '4rem',
                      margin: '0 auto 1rem',
                      background: 'linear-gradient(to right, #2563eb, #4f46e5)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Icon style={{ width: '2rem', height: '2rem', color: 'white' }} />
                  </div>
                  <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>
                    {stat.value}
                  </div>
                  <div style={{ color: '#6b7280', fontWeight: '500' }}>
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section style={{ padding: '4rem 1rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <Target style={{ width: '2rem', height: '2rem', color: '#2563eb' }} />
                <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#111827' }}>我們的使命</h2>
              </div>
              <p style={{ fontSize: '1.125rem', color: '#4b5563', lineHeight: '1.75' }}>
                讓每個人都能透過在地人的視角，深度體驗台灣的文化與美景。我們致力於建立一個安全、可信賴的平台，
                連接旅客與專業地陪，創造真實而有意義的旅行體驗。
              </p>
            </div>
            
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <Eye style={{ width: '2rem', height: '2rem', color: '#2563eb' }} />
                <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#111827' }}>我們的願景</h2>
              </div>
              <p style={{ fontSize: '1.125rem', color: '#4b5563', lineHeight: '1.75' }}>
                成為亞洲領先的在地體驗媒合平台，讓旅行不再只是走馬看花，而是深入了解當地文化、
                建立跨文化友誼的橋梁，推動永續且有意義的旅遊發展。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section style={{ padding: '4rem 1rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#111827', marginBottom: '1rem' }}>
              核心價值
            </h2>
            <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
              這些價值觀指引著我們每一個決策與行動
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div 
                  key={index}
                  style={{
                    padding: '2rem',
                    borderRadius: '1rem',
                    border: '1px solid #e5e7eb',
                    textAlign: 'center',
                    transition: 'all 0.3s'
                  }}
                  className="hover:shadow-lg hover:-translate-y-1"
                >
                  <div 
                    style={{
                      width: '4rem',
                      height: '4rem',
                      margin: '0 auto 1.5rem',
                      backgroundColor: '#eff6ff',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Icon style={{ width: '2rem', height: '2rem', color: '#2563eb' }} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
                    {value.title}
                  </h3>
                  <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ padding: '4rem 1rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#111827', marginBottom: '1rem' }}>
              發展歷程
            </h2>
            <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
              從創立到現在，我們持續成長與進步
            </p>
          </div>

          <div style={{ position: 'relative' }}>
            {/* Timeline line */}
            <div 
              style={{
                position: 'absolute',
                left: '50%',
                top: '0',
                bottom: '0',
                width: '2px',
                backgroundColor: '#e5e7eb',
                transform: 'translateX(-50%)'
              }}
            ></div>

            {milestones.map((milestone, index) => (
              <div 
                key={index}
                style={{
                  position: 'relative',
                  marginBottom: '3rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: index % 2 === 0 ? 'flex-start' : 'flex-end'
                }}
              >
                {/* Timeline dot */}
                <div 
                  style={{
                    position: 'absolute',
                    left: '50%',
                    width: '1rem',
                    height: '1rem',
                    backgroundColor: '#2563eb',
                    borderRadius: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 1
                  }}
                ></div>

                {/* Content */}
                <div 
                  style={{
                    width: '45%',
                    padding: '1.5rem',
                    backgroundColor: 'white',
                    borderRadius: '1rem',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2563eb', marginBottom: '0.5rem' }}>
                    {milestone.year}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                    {milestone.title}
                  </h3>
                  <p style={{ color: '#6b7280' }}>
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section style={{ padding: '4rem 1rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#111827', marginBottom: '1rem' }}>
              核心團隊
            </h2>
            <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
              一群熱愛旅行與文化交流的專業人士
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {team.map((member, index) => (
              <div 
                key={index}
                style={{
                  padding: '2rem',
                  textAlign: 'center',
                  borderRadius: '1rem',
                  border: '1px solid #e5e7eb',
                  transition: 'all 0.3s'
                }}
                className="hover:shadow-lg hover:-translate-y-1"
              >
                <img 
                  src={member.avatar}
                  alt={member.name}
                  style={{
                    width: '6rem',
                    height: '6rem',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    margin: '0 auto 1.5rem',
                    border: '4px solid #eff6ff'
                  }}
                />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                  {member.name}
                </h3>
                <div style={{ color: '#2563eb', fontWeight: '500', marginBottom: '1rem' }}>
                  {member.position}
                </div>
                <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#111827', marginBottom: '1rem' }}>
            開始您的 Guidee 之旅
          </h2>
          <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '2rem' }}>
            無論您是想深度探索台灣的旅客，還是希望分享在地知識的地陪，
            Guidee 都歡迎您的加入。
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => router.push('/register')}
              style={{
                padding: '0.875rem 2rem',
                background: 'linear-gradient(to right, #2563eb, #4f46e5)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
              className="hover:shadow-lg hover:scale-105"
            >
              立即加入
            </button>
            <button
              onClick={() => router.push('/search')}
              style={{
                padding: '0.875rem 2rem',
                backgroundColor: 'white',
                color: '#2563eb',
                border: '2px solid #2563eb',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              className="hover:bg-blue-50"
            >
              探索體驗
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}