'use client';

import { useEffect } from 'react';
import { useAuth } from '@/store/auth';

export function AuthInit() {
  const { initializeAuth } = useAuth();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return null;
}