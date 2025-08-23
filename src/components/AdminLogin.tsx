'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

/**
 * 管理员登录组件 - 终端风格界面
 * 
 * 特性：
 * - 纯色背景，符合项目极客风格
 * - 闪烁光标效果
 * - 密码输入用*符号显示
 * - 错误时红色闪烁动画
 * - 成功时hover动画效果
 */
export function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [isInputActive, setIsInputActive] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // 主题初始化和检测
  useEffect(() => {
    // 完整的主题初始化逻辑（复制自ThemeToggle）
    const initializeTheme = () => {
      // 检查本地存储或系统偏好
      const saved = localStorage.getItem('theme');
      const isDarkMode = saved === 'dark' || 
        (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
      
      // 设置DOM类和组件状态
      document.documentElement.classList.toggle('dark', isDarkMode);
      setIsDark(isDarkMode);
    };

    // 检查主题状态的函数
    const checkTheme = () => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setIsDark(isDarkMode);
    };

    // 初始化主题
    initializeTheme();

    // 监听主题变化（用户在其他页面切换主题时）
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          checkTheme();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  // 光标闪烁效果
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530); // 终端光标闪烁频率

    return () => clearInterval(interval);
  }, []);

  // 登录提交逻辑
  const handleSubmit = useCallback(async () => {
    if (!password.trim()) return;

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        // 登录成功，跳转到管理后台
        router.push('/admin');
      } else {
        // 登录失败，显示错误动画
        setIsError(true);
        setTimeout(() => {
          setIsError(false);
          setPassword('');
          setIsSubmitting(false);
        }, 1200);
      }
    } catch (error) {
      console.error('登录请求失败:', error);
      setIsError(true);
      setTimeout(() => {
        setIsError(false);
        setPassword('');
        setIsSubmitting(false);
      }, 1200);
    }
  }, [password, router]);

  // 键盘事件处理
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    // 防止在提交状态下继续输入
    if (isSubmitting) return;

    const { key } = event;

    // 处理回车键
    if (key === 'Enter') {
      event.preventDefault();
      handleSubmit();
      return;
    }

    // 处理退格键
    if (key === 'Backspace') {
      event.preventDefault();
      setPassword(prev => prev.slice(0, -1));
      return;
    }

    // 处理普通字符输入
    if (key.length === 1) {
      event.preventDefault();
      setPassword(prev => prev + key);
      setIsInputActive(true);
    }
  }, [isSubmitting, handleSubmit]);

  // 绑定键盘事件
  useEffect(() => {
    // 自动聚焦，启动输入模式
    setIsInputActive(true);
    
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // 管理body样式，防止影响其他页面
  useEffect(() => {
    // 保存原始样式
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    
    // 设置隐藏滚动条
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    // 组件卸载时恢复原始样式
    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, []);

  // 渲染密码星号
  const renderPasswordStars = () => {
    return password.split('').map((_, index) => (
      <span
        key={index}
        className={`inline-block ${
          isError ? 'text-red-500' : (isDark ? 'text-neutral-100' : 'text-neutral-900')
        }`}
        style={{
          animation: isError ? 'blinkHard 0.6s ease-in-out 1' : 'none'
        }}
      >
        *
      </span>
    ));
  };

  return (
    <>
      <div className={`min-h-screen flex items-center justify-center px-4 ${
        isDark ? 'bg-neutral-900' : 'bg-neutral-50'
      }`}>
        <div className="w-full max-w-2xl flex flex-col items-center justify-center">
          {/* 终端提示符和输入区域 - 居中对齐 */}
          <div className={`font-mono text-xl md:text-2xl leading-relaxed text-center relative ${
            isDark ? 'text-neutral-100' : 'text-neutral-900'
          }`}>
            <div className="flex items-center justify-center">
              {/* 密码输入显示 */}
              <span className="flex items-center">
                {renderPasswordStars()}
                
                {/* 光标 */}
                <span
                  className={`inline-block ml-1 transition-opacity duration-75 ${
                    showCursor ? 'opacity-100' : 'opacity-0'
                  } ${isError ? 'text-red-500' : (isDark ? 'text-neutral-100' : 'text-neutral-900')}`}
                >
                  _
                </span>
              </span>
            </div>
            
            {/* 提交状态的hover效果动画 - 紧贴密码下方作为下划线 */}
            {isSubmitting && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1">
                <div className="relative">
                  {/* 背景线条 */}
                  <div className={`w-32 h-px ${isDark ? 'bg-neutral-600' : 'bg-neutral-300'}`}></div>
                  {/* 动态下划线效果 */}
                  <div 
                    className={`absolute top-0 left-0 h-px animate-expand-underline ${
                      isDark ? 'bg-neutral-100' : 'bg-neutral-900'
                    }`}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 自定义样式 */}
      <style jsx global>{`
        @keyframes blinkHard {
          0% { opacity: 1; }
          16.67% { opacity: 0; }
          33.33% { opacity: 1; }
          50% { opacity: 0; }
          66.67% { opacity: 1; }
          83.33% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        @keyframes expandUnderline {
          from {
            width: 0%;
            transform-origin: left;
          }
          to {
            width: 100%;
            transform-origin: left;
          }
        }

        .animate-expand-underline {
          animation: expandUnderline 0.8s ease-out forwards;
          width: 0%;
        }
      `}</style>
    </>
  );
}