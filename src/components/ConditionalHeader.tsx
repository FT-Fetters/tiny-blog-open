'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/Header';
import { useConfig } from '@/hooks/useConfig';

/**
 * 条件性Header组件
 * 根据当前路径决定是否显示Header
 * 在管理员登录页面（secureEntrance路径）时隐藏Header
 */
export function ConditionalHeader() {
  const pathname = usePathname();
  const { data: config, loading } = useConfig();

  // 如果配置正在加载，先不显示Header
  if (loading || !config) {
    return null;
  }

  // 检查当前路径是否为安全入口码路径或管理页面
  const isAdminLoginPage = pathname === `/${config.secureEntrance}`;
  const isAdminPage = pathname.startsWith('/admin');

  // 如果是管理员登录页面或管理页面，不显示Header
  if (isAdminLoginPage || isAdminPage) {
    return null;
  }

  // 其他页面正常显示Header
  return <Header />;
}