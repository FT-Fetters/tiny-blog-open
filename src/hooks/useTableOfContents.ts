'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { TOCItem } from '@/types/toc';
import { extractHeadings, buildHeadingTree, scrollToHeading } from '@/lib/toc';

interface UseTableOfContentsOptions {
  htmlContent?: string;
  offsetTop?: number;
  rootMargin?: string;
  threshold?: number | number[];
}

export function useTableOfContents({
  htmlContent,
  offsetTop = 80,
  rootMargin = '-20% 0% -70% 0%',
  threshold = [0, 0.25, 0.5, 0.75, 1]
}: UseTableOfContentsOptions = {}) {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [flatHeadings, setFlatHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // 提取和构建标题树
  useEffect(() => {
    if (!htmlContent) {
      setHeadings([]);
      setFlatHeadings([]);
      return;
    }

    const extractedHeadings = extractHeadings(htmlContent);
    const tree = buildHeadingTree(extractedHeadings);
    
    setHeadings(tree);
    setFlatHeadings(extractedHeadings);
  }, [htmlContent]);

  // 设置Intersection Observer
  useEffect(() => {
    if (typeof window === 'undefined' || flatHeadings.length === 0) return;

    // 清理之前的observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // 存储每个标题的可见性状态
    const visibilityMap = new Map<string, boolean>();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibilityMap.set(entry.target.id, entry.isIntersecting);
        });

        // 找到第一个可见的标题
        for (const heading of flatHeadings) {
          if (visibilityMap.get(heading.id)) {
            setActiveId(heading.id);
            break;
          }
        }
      },
      {
        rootMargin,
        threshold
      }
    );

    // 观察所有标题元素
    const observer = observerRef.current;
    flatHeadings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
        // 初始化可见性状态
        visibilityMap.set(heading.id, false);
      }
    });

    // 检查初始可见性
    const checkInitialVisibility = () => {
      for (const heading of flatHeadings) {
        const element = document.getElementById(heading.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const isInViewport = rect.top >= 0 && rect.top <= window.innerHeight * 0.4;
          if (isInViewport) {
            setActiveId(heading.id);
            break;
          }
        }
      }
    };

    // 延迟执行初始检查，确保DOM已经渲染
    const timer = setTimeout(checkInitialVisibility, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [flatHeadings, rootMargin, threshold]);

  // 检查是否应该显示目录（至少有2个标题）
  useEffect(() => {
    setIsVisible(flatHeadings.length >= 2);
  }, [flatHeadings]);

  // 滚动到指定标题
  const handleScrollToHeading = useCallback((id: string) => {
    scrollToHeading(id, offsetTop);
    setActiveId(id);
  }, [offsetTop]);

  return {
    headings,
    flatHeadings,
    activeId,
    isVisible,
    scrollToHeading: handleScrollToHeading
  };
}