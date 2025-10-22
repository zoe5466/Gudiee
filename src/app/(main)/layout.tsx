import { DualLayout } from '@/components/layout/dual-layout'
import { AuthInit } from '@/components/auth/auth-init'
import { ProfileSetupGuard } from '@/components/auth/profile-setup-guard'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AuthInit />
      <ProfileSetupGuard>
        <DualLayout>
          {children}
        </DualLayout>
      </ProfileSetupGuard>
    </>
  )
}