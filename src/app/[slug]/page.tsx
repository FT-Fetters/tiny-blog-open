'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AdminLogin } from '@/components/AdminLogin';
import { useConfig } from '@/hooks/useConfig';

/**
 * 动态路由页面组件
 * 处理 /<secureEntrance> 路径的访问
 */
export default function DynamicSlugPage() {
  const params = useParams();
  const router = useRouter();
  const { data: config, loading } = useConfig();
  const [isValidSecureEntrance, setIsValidSecureEntrance] = useState<boolean | null>(null);
  
  const slug = params.slug as string;

  useEffect(() => {
    if (!loading && config) {
      // 检查访问的slug是否匹配配置中的secureEntrance
      const isValid = slug === config.secureEntrance;
      setIsValidSecureEntrance(isValid);
      
      // 如果不匹配，重定向到首页
      if (!isValid) {
        router.replace('/');
      }
    }
  }, [slug, config, loading, router]);

  // 加载中状态
  if (loading || isValidSecureEntrance === null) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-neutral-400 text-lg font-mono">Loading...</div>
      </div>
    );
  }

  // 如果是有效的安全入口码，显示登录界面
  if (isValidSecureEntrance) {
    return <AdminLogin />;
  }

  // 如果无效，显示空页面（实际上会被重定向）
  return null;
}