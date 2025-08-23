'use client';

import { useEffect, useState } from 'react';

export function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      // 检查屏幕宽度 (小于 768px 为移动设备)
      const screenWidth = window.innerWidth;
      const isSmallScreen = screenWidth < 768;
      
      // 检查用户代理字符串
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = [
        'android',
        'iphone',
        'ipad',
        'ipod',
        'blackberry',
        'iemobile',
        'opera mini',
        'mobile'
      ];
      const isMobileUserAgent = mobileKeywords.some(keyword => 
        userAgent.includes(keyword)
      );
      
      // 检查触摸支持
      const hasTouch = 'ontouchstart' in window || 
                      navigator.maxTouchPoints > 0;
      
      // 组合判断：屏幕小或用户代理为移动端或支持触摸
      const mobile = isSmallScreen || isMobileUserAgent || 
                    (hasTouch && screenWidth < 1024);
      
      setIsMobile(mobile);
      setIsLoading(false);
    };

    // 初始检查
    checkMobile();

    // 监听窗口大小变化
    const handleResize = () => {
      checkMobile();
    };

    window.addEventListener('resize', handleResize);
    
    // 清理事件监听器
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return { isMobile, isLoading };
}