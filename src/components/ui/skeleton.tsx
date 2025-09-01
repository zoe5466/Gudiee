'use client'

interface SkeletonProps {
  width?: string | number
  height?: string | number
  borderRadius?: string
  className?: string
  children?: React.ReactNode
}

export function Skeleton({ 
  width, 
  height, 
  borderRadius = '0.25rem',
  className = '',
  children 
}: SkeletonProps) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width: width || '100%',
        height: height || '1rem',
        borderRadius,
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite'
      }}
    >
      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
      {children}
    </div>
  )
}

// 預設的骨架組件
export function SkeletonCard() {
  return (
    <div style={{
      padding: '1.5rem',
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      border: '1px solid #f3f4f6'
    }}>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <Skeleton width="4rem" height="4rem" borderRadius="50%" />
        <div style={{ flex: 1 }}>
          <Skeleton height="1.25rem" width="60%" />
          <div style={{ marginTop: '0.5rem' }}>
            <Skeleton height="1rem" width="40%" />
          </div>
        </div>
      </div>
      
      <Skeleton height="1rem" width="100%" />
      <div style={{ marginTop: '0.5rem' }}>
        <Skeleton height="1rem" width="80%" />
      </div>
      <div style={{ marginTop: '0.5rem' }}>
        <Skeleton height="1rem" width="90%" />
      </div>
      
      <div style={{ 
        marginTop: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Skeleton height="1.5rem" width="5rem" />
        <Skeleton height="2rem" width="6rem" borderRadius="0.375rem" />
      </div>
    </div>
  )
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div>
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index} style={{ marginBottom: '0.5rem' }}>
          <Skeleton 
            height="1rem" 
            width={index === lines - 1 ? '60%' : '100%'} 
          />
        </div>
      ))}
    </div>
  )
}

export function SkeletonAvatar({ size = '3rem' }: { size?: string }) {
  return (
    <Skeleton 
      width={size} 
      height={size} 
      borderRadius="50%" 
    />
  )
}

export function SkeletonButton() {
  return (
    <Skeleton 
      height="2.5rem" 
      width="6rem" 
      borderRadius="0.375rem" 
    />
  )
}