import dynamic from 'next/dynamic'

const HeroClient = dynamic(
  () => import('./hero-client').then((mod) => ({ default: mod.HeroClient })),
  {
    ssr: false,
    loading: () => (
      <div 
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(to bottom right, #dbeafe, #ffffff, #e0e7ff)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div 
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '4rem 1.5rem',
            width: '100%',
            textAlign: 'center'
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
            <span style={{ fontWeight: '500' }}>台灣首創地陪媒合平台</span>
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
            找到
            <span style={{ display: 'block', color: '#2563eb' }}>
              完美地陪體驗
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
            連接在地專業地陪，享受獨特且安全的旅遊體驗。讓專業嚮導帶您深度探索台灣之美。
          </p>
        </div>
      </div>
    )
  }
)

export function Hero() {
  return <HeroClient />
}