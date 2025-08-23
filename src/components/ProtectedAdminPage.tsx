'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { AdminLayout } from './AdminLayout';
import { MobileRestricted } from './MobileRestricted';

interface ProtectedAdminPageProps {
  children: ReactNode;
}

export function ProtectedAdminPage({ children }: ProtectedAdminPageProps) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // 如果未登录，重定向到首页
      router.push('/');
    }
  }, [isAuthenticated, loading, router]);

  // 显示加载状态
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center font-mono">
        <div className="text-center">
          <div className="text-neutral-900 dark:text-neutral-100 mb-2">
            {'>'} Authenticating...
          </div>
          <div className="flex items-center justify-center space-x-1 text-neutral-600 dark:text-neutral-400">
            <span>Loading</span>
            <div className="loading-dots">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 如果未认证，显示空白（即将重定向）
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center font-mono">
        <div className="text-neutral-900 dark:text-neutral-100">
          {'>'} Redirecting...
        </div>
      </div>
    );
  }

  // 如果已认证，显示管理界面
  return (
    <MobileRestricted>
      <AdminLayout>
        {children}
      </AdminLayout>
    </MobileRestricted>
  );
}