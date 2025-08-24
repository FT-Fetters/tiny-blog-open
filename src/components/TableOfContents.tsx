'use client';

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { TOCItem, TableOfContentsProps } from '@/types/toc';
import { ChevronRight, List, X } from 'lucide-react';

/**
 * 递归渲染目录树
 */
const TOCTree: React.FC<{
  items: TOCItem[];
  activeId: string;
  maxDepth: number;
  currentDepth?: number;
  onItemClick: (id: string) => void;
}> = ({ items, activeId, maxDepth, currentDepth = 1, onItemClick }) => {
  if (currentDepth > maxDepth) return null;

  return (
    <ul className={cn(
      'space-y-2',
      currentDepth > 1 && 'ml-4 mt-2 border-l border-neutral-200 dark:border-neutral-800'
    )}>
      {items.map((item) => {
        const isActive = item.id === activeId;
        const hasChildren = item.children && item.children.length > 0;

        return (
          <li key={item.id}>
            <button
              onClick={() => onItemClick(item.id)}
              data-toc-id={item.id}
              className={cn(
                'toc-item block w-full text-left text-sm transition-all duration-200',
                currentDepth > 1 && 'pl-4',
                isActive
                  ? 'font-medium text-neutral-900 dark:text-neutral-100'
                  : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100',
                isActive && currentDepth === 1 && 'border-l-2 border-neutral-900 dark:border-neutral-100 -ml-[2px] pl-[14px]'
              )}
            >
              <span className={cn(
                'inline-block',
                isActive && 'underline underline-offset-4'
              )}>
                {item.text}
              </span>
            </button>
            {hasChildren && (
              <TOCTree
                items={item.children!}
                activeId={activeId}
                maxDepth={maxDepth}
                currentDepth={currentDepth + 1}
                onItemClick={onItemClick}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
};

/**
 * 侧边栏目录组件
 */
const SidebarTOC: React.FC<TableOfContentsProps> = ({
  headings,
  activeId = '',
  maxDepth = 3,
  onItemClick = () => {},
  showProgress = false,
  className
}) => {
  const navRef = useRef<HTMLElement>(null);

  // 当 activeId 变化时，自动滚动到激活项
  useEffect(() => {
    if (!activeId || !navRef.current) return;

    // 使用 requestAnimationFrame 确保 DOM 已更新
    requestAnimationFrame(() => {
      const activeElement = navRef.current?.querySelector(`[data-toc-id="${activeId}"]`);
      const container = navRef.current;
      
      if (!activeElement || !container) return;

      const containerRect = container.getBoundingClientRect();
      const elementRect = activeElement.getBoundingClientRect();

      // 计算元素相对于容器的位置
      const relativeTop = elementRect.top - containerRect.top;
      const relativeBottom = elementRect.bottom - containerRect.top;
      
      // 检查元素是否在可视区域外
      const isAbove = relativeTop < 0;
      const isBelow = relativeBottom > containerRect.height;

      if (isAbove || isBelow) {
        // 计算滚动位置，使激活项居中显示
        const scrollTop = container.scrollTop + relativeTop - containerRect.height / 2 + elementRect.height / 2;
        
        // 平滑滚动到目标位置
        container.scrollTo({
          top: scrollTop,
          behavior: 'smooth'
        });
      }
    });
  }, [activeId]);

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-4">
        <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
          目录
        </h3>
        {showProgress && (
          <div className="w-full h-1 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden mb-4">
            <div 
              className="h-full bg-neutral-900 dark:bg-neutral-100 transition-all duration-300"
              style={{ width: '0%' }}
              id="reading-progress"
            />
          </div>
        )}
      </div>
      <nav 
        ref={navRef}
        className="max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin"
      >
        <TOCTree
          items={headings}
          activeId={activeId}
          maxDepth={maxDepth}
          onItemClick={onItemClick}
        />
      </nav>
    </div>
  );
};

/**
 * 浮动目录组件（移动端）
 */
const FloatingTOC: React.FC<TableOfContentsProps> = ({
  headings,
  activeId = '',
  maxDepth = 3,
  onItemClick = () => {}
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // 当 activeId 变化时，自动滚动到激活项（仅在打开状态下）
  useEffect(() => {
    if (!activeId || !navRef.current || !isOpen) return;

    requestAnimationFrame(() => {
      const activeElement = navRef.current?.querySelector(`[data-toc-id="${activeId}"]`);
      const container = navRef.current;
      
      if (!activeElement || !container) return;

      const containerRect = container.getBoundingClientRect();
      const elementRect = activeElement.getBoundingClientRect();

      const relativeTop = elementRect.top - containerRect.top;
      const relativeBottom = elementRect.bottom - containerRect.top;
      
      const isAbove = relativeTop < 0;
      const isBelow = relativeBottom > containerRect.height;

      if (isAbove || isBelow) {
        const scrollTop = container.scrollTop + relativeTop - containerRect.height / 2 + elementRect.height / 2;
        
        container.scrollTo({
          top: scrollTop,
          behavior: 'smooth'
        });
      }
    });
  }, [activeId, isOpen]);

  return (
    <>
      {/* 浮动按钮 */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-8 right-8 z-40',
          'w-12 h-12 rounded-full',
          'bg-white dark:bg-neutral-900',
          'border border-neutral-200 dark:border-neutral-800',
          'shadow-lg hover:shadow-xl transition-all duration-200',
          'flex items-center justify-center',
          'group'
        )}
        aria-label="打开目录"
      >
        <List className="w-5 h-5 text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-100" />
      </button>

      {/* 目录面板 */}
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* 背景遮罩 */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* 目录内容 */}
          <div className={cn(
            'absolute right-0 top-0 bottom-0 w-80 max-w-[85vw]',
            'bg-white dark:bg-neutral-900',
            'border-l border-neutral-200 dark:border-neutral-800',
            'shadow-2xl',
            'animate-slide-in-right'
          )}>
            <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                目录
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                aria-label="关闭目录"
              >
                <X className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              </button>
            </div>
            
            <nav 
              ref={navRef}
              className="p-4 overflow-y-auto max-h-[calc(100vh-5rem)] scrollbar-thin"
            >
              <TOCTree
                items={headings}
                activeId={activeId}
                maxDepth={maxDepth}
                onItemClick={(id) => {
                  onItemClick(id);
                  setIsOpen(false);
                }}
              />
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

/**
 * 内联目录组件
 */
const InlineTOC: React.FC<TableOfContentsProps> = ({
  headings,
  activeId = '',
  maxDepth = 2,
  onItemClick = () => {}
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="mb-8 p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg border border-neutral-200 dark:border-neutral-800">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full mb-3"
      >
        <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
          目录
        </h3>
        <ChevronRight 
          className={cn(
            'w-4 h-4 text-neutral-600 dark:text-neutral-400 transition-transform',
            isExpanded && 'rotate-90'
          )}
        />
      </button>
      
      {isExpanded && (
        <nav className="animate-fade-in">
          <TOCTree
            items={headings}
            activeId={activeId}
            maxDepth={maxDepth}
            onItemClick={onItemClick}
          />
        </nav>
      )}
    </div>
  );
};

/**
 * 主目录组件
 */
export const TableOfContents: React.FC<TableOfContentsProps> = ({
  headings,
  activeId = '',
  maxDepth = 3,
  className,
  onItemClick = () => {},
  variant = 'sidebar',
  showProgress = false,
  config = {}
}) => {
  if (!headings || headings.length === 0) {
    return null;
  }

  const componentProps = {
    headings,
    activeId,
    maxDepth,
    onItemClick,
    showProgress,
    config
  };

  switch (variant) {
    case 'floating':
      return (
        <div className={className}>
          <FloatingTOC {...componentProps} />
        </div>
      );
    
    case 'inline':
      return (
        <div className={className}>
          <InlineTOC {...componentProps} />
        </div>
      );
    
    case 'sidebar':
    default:
      return (
        <SidebarTOC {...componentProps} className={className} />
      );
  }
};