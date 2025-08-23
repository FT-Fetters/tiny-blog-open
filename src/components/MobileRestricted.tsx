'use client';

import { ReactNode } from 'react';
import { useMobileDetection } from '@/hooks/useMobileDetection';

interface MobileRestrictedProps {
  children: ReactNode;
}

export function MobileRestricted({ children }: MobileRestrictedProps) {
  const { isMobile, isLoading } = useMobileDetection();

  // 加载状态，先显示内容避免闪烁
  if (isLoading) {
    return <>{children}</>;
  }

  // 如果是移动端，显示限制提醒
  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4 font-mono">
        <div className="bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-300 dark:border-neutral-600 rounded-lg max-w-md w-full p-8 text-center">
          {/* 终端式标题 */}
          <div className="text-neutral-900 dark:text-neutral-100 text-xl font-medium mb-4">
            {'>'} Access Restricted
          </div>
          
          {/* 分隔线 */}
          <div className="text-neutral-600 dark:text-neutral-400 text-sm mb-6">
            ──────────────────────────
          </div>
          
          {/* 图标和提示信息 */}
          <div className="mb-6">
            <div className="text-6xl mb-4">💻</div>
            <div className="text-neutral-700 dark:text-neutral-300 text-lg mb-2">
              管理后台仅支持PC端访问
            </div>
            <div className="text-neutral-600 dark:text-neutral-400 text-sm">
              Admin panel is only available on desktop
            </div>
          </div>
          
          {/* 建议操作 */}
          <div className="text-left text-sm text-neutral-600 dark:text-neutral-400 bg-neutral-200 dark:bg-neutral-700 rounded p-4 mb-6">
            <div className="font-medium mb-2">建议操作 / Suggested Actions:</div>
            <div className="space-y-1">
              <div>• 使用电脑访问管理后台</div>
              <div>• Use a desktop computer</div>
              <div>• 切换到桌面版浏览器</div>
              <div>• Switch to desktop browser</div>
            </div>
          </div>
          
          {/* 返回首页按钮 */}
          <a
            href="/"
            className="inline-block w-full py-3 px-6 bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900 rounded hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors text-sm font-medium"
          >
            [Return to Homepage] 返回首页
          </a>
          
          {/* 底部状态信息 */}
          <div className="mt-6 pt-4 border-t border-neutral-300 dark:border-neutral-600 text-xs text-neutral-500 dark:text-neutral-400">
            <div>Device: Mobile detected</div>
            <div>Screen: {typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'Unknown'}</div>
          </div>
        </div>
      </div>
    );
  }

  // 如果是PC端，正常显示内容
  return <>{children}</>;
}