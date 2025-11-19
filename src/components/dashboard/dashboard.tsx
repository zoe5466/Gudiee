'use client';

import React from 'react';
import { useAuth } from '@/store/auth';
import TravelerDashboard from './traveler-dashboard';
import GuideDashboard from './guide-dashboard';
import AdminDashboard from './admin-dashboard';
import { Shield, User, Map } from 'lucide-react';

interface DashboardProps {
  className?: string;
}

export default function Dashboard({ className = '' }: DashboardProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-200 h-64 rounded-lg"></div>
            <div className="bg-gray-200 h-64 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`flex items-center justify-center min-h-[400px] ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">請先登入</h3>
          <p className="text-gray-600 mb-6">您需要登入才能查看儀表板</p>
          <div className="space-x-4">
            <a
              href="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              立即登入
            </a>
            <a
              href="/register"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-[#cfdbe9]"
            >
              創建帳號
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 根據用戶角色渲染對應的儀表板
  switch (user.role) {
    case 'admin':
      return <AdminDashboard className={className} />;
    
    case 'guide':
      return <GuideDashboard className={className} />;
    
    case 'customer':
    default:
      return <TravelerDashboard className={className} />;
  }
}

// 角色識別組件
export function RoleBadge({ role }: { role: string }) {
  const getRoleConfig = (role: string) => {
    switch (role) {
      case 'admin':
        return {
          label: '管理員',
          icon: Shield,
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          iconColor: 'text-red-600'
        };
      case 'guide':
        return {
          label: '嚮導',
          icon: Map,
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          iconColor: 'text-green-600'
        };
      case 'customer':
      default:
        return {
          label: '旅行者',
          icon: User,
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          iconColor: 'text-blue-600'
        };
    }
  };

  const config = getRoleConfig(role);
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
      <Icon className={`w-3 h-3 mr-1 ${config.iconColor}`} />
      {config.label}
    </span>
  );
}

// 權限檢查組件
export function RoleGuard({ 
  allowedRoles, 
  children, 
  fallback 
}: { 
  allowedRoles: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return fallback || (
      <div className="text-center py-8">
        <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">權限不足</h3>
        <p className="text-gray-600">您沒有權限查看此內容</p>
      </div>
    );
  }

  return <>{children}</>;
}