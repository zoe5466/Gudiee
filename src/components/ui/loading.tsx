'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'pulse';
  className?: string;
  text?: string;
}

export function Loading({ 
  size = 'md', 
  variant = 'spinner', 
  className,
  text 
}: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  if (variant === 'spinner') {
    return (
      <div className={cn('flex flex-col items-center justify-center', className)}>
        <div 
          className={cn(
            'animate-spin rounded-full border-2 border-gray-300 border-t-[#002C56]',
            sizeClasses[size]
          )}
        />
        {text && (
          <p className={cn('mt-2 text-gray-600', textSizeClasses[size])}>
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={cn('flex flex-col items-center justify-center', className)}>
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                'bg-[#002C56] rounded-full animate-pulse',
                size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'
              )}
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1.2s'
              }}
            />
          ))}
        </div>
        {text && (
          <p className={cn('mt-2 text-gray-600', textSizeClasses[size])}>
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn('flex flex-col items-center justify-center', className)}>
        <div 
          className={cn(
            'bg-[#002C56] rounded-full animate-pulse',
            sizeClasses[size]
          )}
        />
        {text && (
          <p className={cn('mt-2 text-gray-600', textSizeClasses[size])}>
            {text}
          </p>
        )}
      </div>
    );
  }

  return null;
}

// Skeleton Loading Component
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ 
  className, 
  variant = 'rectangular',
  width,
  height 
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-200';
  
  const variantClasses = {
    text: 'rounded-md h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-md'
  };

  const style = {
    width: width || undefined,
    height: height || undefined
  };

  return (
    <div 
      className={cn(baseClasses, variantClasses[variant], className)}
      style={style}
    />
  );
}

// Page Loading Component
export function PageLoading() {
  return (
    <div className="bg-white">
      <Loading size="lg" text="載入中..." />
    </div>
  );
}

// Button Loading Component
export function ButtonLoading({ size = 'sm' }: { size?: 'sm' | 'md' | 'lg' }) {
  return <Loading size={size} variant="spinner" />;
}