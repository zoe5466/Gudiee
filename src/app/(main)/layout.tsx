import { DualLayout } from '@/components/layout/dual-layout'
import { AuthInit } from '@/components/auth/auth-init'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AuthInit />
      <DualLayout>
        {children}
      </DualLayout>
    </>
  )
}