'use client'

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ReactNode
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  separator?: React.ReactNode
  className?: string
}

export function Breadcrumb({ 
  items, 
  separator = <ChevronRight style={{ width: '16px', height: '16px' }} />,
  className = '' 
}: BreadcrumbProps) {
  return (
    <nav 
      aria-label="Breadcrumb"
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.875rem',
        color: '#6b7280'
      }}
    >
      <ol style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, padding: 0, listStyle: 'none' }}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          
          return (
            <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {index > 0 && (
                <span style={{ color: '#d1d5db' }}>
                  {separator}
                </span>
              )}
              
              {item.href ? (
                <Link
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    color: isLast ? '#374151' : '#6b7280',
                    textDecoration: 'none',
                    fontWeight: isLast ? '500' : '400',
                    transition: 'color 0.2s'
                  }}
                  className="hover:text-gray-900"
                >
                  {item.icon}
                  {item.label}
                </Link>
              ) : (
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    color: '#374151',
                    fontWeight: '500'
                  }}
                >
                  {item.icon}
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

// 預設的首頁面包屑
export function HomeBreadcrumb() {
  return (
    <Breadcrumb
      items={[
        {
          label: '首頁',
          href: '/',
          icon: <Home style={{ width: '14px', height: '14px' }} />
        }
      ]}
    />
  )
}

// 服務頁面面包屑範例
export function ServiceBreadcrumb({ 
  serviceName, 
  serviceId 
}: { 
  serviceName: string
  serviceId: string 
}) {
  return (
    <Breadcrumb
      items={[
        {
          label: '首頁',
          href: '/',
          icon: <Home style={{ width: '14px', height: '14px' }} />
        },
        {
          label: '搜尋結果',
          href: '/search'
        },
        {
          label: serviceName
        }
      ]}
    />
  )
}

// 用戶頁面面包屑
export function UserBreadcrumb({ 
  currentPage 
}: { 
  currentPage: string 
}) {
  return (
    <Breadcrumb
      items={[
        {
          label: '首頁',
          href: '/',
          icon: <Home style={{ width: '14px', height: '14px' }} />
        },
        {
          label: '個人中心',
          href: '/profile'
        },
        {
          label: currentPage
        }
      ]}
    />
  )
}