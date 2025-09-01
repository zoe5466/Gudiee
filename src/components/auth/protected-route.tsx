'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/auth';
import { Shield, AlertTriangle, Lock } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: string[];
  requirePermissions?: string[];
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  allowedRoles = [],
  requirePermissions = [],
  redirectTo = '/auth/login',
  fallback
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, hasPermission } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      // 等待認證狀態載入完成
      if (isLoading) {
        return;
      }

      // 檢查是否需要登入
      if (requireAuth && !isAuthenticated) {
        const currentPath = window.location.pathname + window.location.search;
        router.push(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`);
        return;
      }

      // 檢查角色權限
      if (allowedRoles.length > 0 && user) {
        const hasRequiredRole = allowedRoles.includes(user.role);
        if (!hasRequiredRole) {
          setAccessDenied(true);
          setIsChecking(false);
          return;
        }
      }

      // 檢查細分權限
      if (requirePermissions.length > 0 && user) {
        const hasAllPermissions = requirePermissions.every(permission => 
          hasPermission(permission)
        );
        if (!hasAllPermissions) {
          setAccessDenied(true);
          setIsChecking(false);
          return;
        }
      }

      setIsChecking(false);
    };

    checkAccess();
  }, [isLoading, isAuthenticated, user, allowedRoles, requirePermissions, requireAuth, router, redirectTo, hasPermission]);

  // 顯示載入中
  if (isLoading || isChecking) {
    return fallback || (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '3rem',
            height: '3rem',
            border: '3px solid #e5e7eb',
            borderTop: '3px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280'
          }}>
            正在驗證訪問權限...
          </p>
        </div>
      </div>
    );
  }

  // 顯示權限不足
  if (accessDenied) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9fafb',
        padding: '1rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          textAlign: 'center',
          maxWidth: '400px',
          width: '100%',
          boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            width: '4rem',
            height: '4rem',
            backgroundColor: '#fef2f2',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}>
            <Lock style={{ width: '2rem', height: '2rem', color: '#ef4444' }} />
          </div>
          
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '0.5rem'
          }}>
            訪問受限
          </h2>
          
          <p style={{
            color: '#6b7280',
            marginBottom: '1.5rem',
            lineHeight: '1.5'
          }}>
            您沒有權限訪問此頁面。
            {allowedRoles.length > 0 && (
              <span>需要以下角色之一：{allowedRoles.join('、')}</span>
            )}
            {requirePermissions.length > 0 && (
              <span>需要特定權限才能訪問此功能。</span>
            )}
          </p>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <button
              onClick={() => router.back()}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              返回上一頁
            </button>
            
            <button
              onClick={() => router.push('/')}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'white',
                color: '#374151',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              返回首頁
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 渲染受保護的內容
  return <>{children}</>;
}

// 管理員專用保護組件
export function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute
      requireAuth={true}
      allowedRoles={['admin']}
      redirectTo="/auth/login"
    >
      {children}
    </ProtectedRoute>
  );
}

// 地陪專用保護組件
export function GuideRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute
      requireAuth={true}
      allowedRoles={['guide', 'admin']}
      redirectTo="/auth/login"
    >
      {children}
    </ProtectedRoute>
  );
}

// 用戶專用保護組件（需要登入但不限制角色）
export function UserRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute
      requireAuth={true}
      allowedRoles={['customer', 'guide', 'admin']}
      redirectTo="/auth/login"
    >
      {children}
    </ProtectedRoute>
  );
}

// 權限檢查 Hook
export function useRoleAccess(requiredRoles: string[]) {
  const { user, isAuthenticated } = useAuth();
  
  const hasAccess = isAuthenticated && user && requiredRoles.includes(user.role);
  
  return {
    hasAccess,
    currentRole: user?.role,
    isAuthenticated
  };
}

// 權限檢查組件
export function RoleGate({ 
  allowedRoles, 
  children, 
  fallback 
}: { 
  allowedRoles: string[]; 
  children: React.ReactNode; 
  fallback?: React.ReactNode;
}) {
  const { hasAccess } = useRoleAccess(allowedRoles);
  
  if (!hasAccess) {
    return fallback || (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '1rem',
        backgroundColor: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '0.5rem',
        color: '#dc2626'
      }}>
        <AlertTriangle style={{ width: '1rem', height: '1rem' }} />
        <span style={{ fontSize: '0.875rem' }}>
          您沒有權限查看此內容
        </span>
      </div>
    );
  }
  
  return <>{children}</>;
}

// 權限按鈕組件
export function PermissionButton({ 
  requiredRoles = [], 
  requiredPermissions = [],
  children, 
  ...props 
}: { 
  requiredRoles?: string[];
  requiredPermissions?: string[];
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { user, hasPermission } = useAuth();
  
  const hasRoleAccess = requiredRoles.length === 0 || 
    (user && requiredRoles.includes(user.role));
    
  const hasPermissionAccess = requiredPermissions.length === 0 || 
    requiredPermissions.every(permission => hasPermission(permission));
  
  const isDisabled = !hasRoleAccess || !hasPermissionAccess;
  
  return (
    <button 
      {...props} 
      disabled={isDisabled || props.disabled}
      style={{
        ...props.style,
        opacity: isDisabled ? 0.5 : 1,
        cursor: isDisabled ? 'not-allowed' : 'pointer'
      }}
    >
      {children}
    </button>
  );
}