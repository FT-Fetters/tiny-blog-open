'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { useConfig } from '@/hooks/useConfig';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  
  const { data: config, loading } = useConfig();

  const toggleMobileMenu = () => {
    if (isMobileMenuOpen) {
      // 开始关闭动画
      setIsClosing(true);
      // 动画完成后隐藏菜单
      setTimeout(() => {
        setIsMobileMenuOpen(false);
        setIsClosing(false);
        setShouldRender(false);
      }, 250);
    } else {
      // 打开菜单
      setShouldRender(true);
      setIsMobileMenuOpen(true);
    }
  };

  const handleMenuItemClick = () => {
    // 点击菜单项时也要播放关闭动画
    setIsClosing(true);
    setTimeout(() => {
      setIsMobileMenuOpen(false);
      setIsClosing(false);
      setShouldRender(false);
    }, 250);
  };

  // 加载状态显示skeleton
  if (loading || !config) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/80">
        <div className="content-wrapper">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center">
              <div className="h-6 w-32 shimmer rounded"></div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 w-16 shimmer rounded"></div>
              ))}
              <ThemeToggle />
            </nav>

            <div className="flex md:hidden items-center space-x-4">
              <ThemeToggle />
              <div className="h-6 w-6 shimmer rounded"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/80">
        <div className="content-wrapper">
          <div className="flex h-20 items-center justify-between fade-in">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-medium text-neutral-900 dark:text-neutral-100 transition-smooth">
                {config.title}
              </Link>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              {config.nav.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href as any}
                  className={cn(
                    "text-sm font-medium transition-smooth",
                    pathname === item.href
                      ? "text-neutral-900 dark:text-neutral-100"
                      : "text-neutral-600 dark:text-neutral-400"
                  )}
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  {item.name}
                </Link>
              ))}
              <ThemeToggle />
            </nav>

            {/* 移动端导航 */}
            <div className="flex md:hidden items-center space-x-4">
              <ThemeToggle />
              <button
                onClick={toggleMobileMenu}
                className="p-2 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-smooth"
                aria-label="切换菜单"
              >
                {(isMobileMenuOpen && !isClosing) ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 移动端菜单覆盖层 */}
      {shouldRender && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div 
            className="fixed inset-0 bg-black bg-opacity-25"
            style={{
              opacity: isClosing ? 0 : 1,
              transition: 'opacity 0.2s ease-in-out'
            }}
            onClick={toggleMobileMenu} 
          />
          <nav className={cn(
            "fixed right-0 top-20 h-full w-64 bg-white shadow-lg dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800",
            isClosing ? "animate-slide-out-right" : "animate-slide-in-right"
          )}>
            <div className="flex flex-col py-4">
              {config.nav.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href as any}
                  className={cn(
                    "px-6 py-4 text-base font-medium border-b border-neutral-100 dark:border-neutral-800 transition-colors",
                    isClosing 
                      ? "animate-fade-out" 
                      : "animate-fade-in",
                    pathname === item.href
                      ? "text-neutral-900 dark:text-neutral-100 bg-neutral-50 dark:bg-neutral-800"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  )}
                  style={
                    isClosing 
                      ? { 
                          animationDelay: `${(config.nav.length - index - 1) * 20}ms`, 
                          animationFillMode: 'forwards' 
                        }
                      : { 
                          opacity: 0,
                          animationDelay: `${index * 60 + 150}ms`, 
                          animationFillMode: 'forwards' 
                        }
                  }
                  onClick={handleMenuItemClick}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}