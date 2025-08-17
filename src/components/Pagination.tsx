import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationInfo } from '@/types';
import { cn } from '@/lib/utils';

interface PaginationProps {
  pagination: PaginationInfo;
  basePath?: string;
}

export function Pagination({ pagination, basePath = '/posts' }: PaginationProps) {
  const { currentPage, totalPages, hasNextPage, hasPrevPage } = pagination;

  if (totalPages <= 1) return null;

  const generatePageUrl = (page: number) => {
    if (page === 1) return basePath;
    return `${basePath}?page=${page}`;
  };

  const renderPageNumbers = () => {
    const pages = [];
    const showPages = 5; // 显示的页码数量
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    const endPage = Math.min(totalPages, startPage + showPages - 1);

    // 调整起始页码
    if (endPage - startPage + 1 < showPages) {
      startPage = Math.max(1, endPage - showPages + 1);
    }

    // 第一页
    if (startPage > 1) {
      pages.push(
        <Link
          key={1}
          href={generatePageUrl(1) as any}
          className={cn(
            'px-3 py-2 text-sm rounded-md transition-colors',
            'hover:bg-accent hover:text-accent-foreground',
            currentPage === 1
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground'
          )}
        >
          1
        </Link>
      );

      if (startPage > 2) {
        pages.push(
          <span key="ellipsis1" className="px-2 py-2 text-sm text-muted-foreground">
            ...
          </span>
        );
      }
    }

    // 页码范围
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Link
          key={i}
          href={generatePageUrl(i) as any}
          className={cn(
            'px-3 py-2 text-sm rounded-md transition-colors',
            'hover:bg-accent hover:text-accent-foreground',
            currentPage === i
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground'
          )}
        >
          {i}
        </Link>
      );
    }

    // 最后一页
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="ellipsis2" className="px-2 py-2 text-sm text-muted-foreground">
            ...
          </span>
        );
      }

      pages.push(
        <Link
          key={totalPages}
          href={generatePageUrl(totalPages) as any}
          className={cn(
            'px-3 py-2 text-sm rounded-md transition-colors',
            'hover:bg-accent hover:text-accent-foreground',
            currentPage === totalPages
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground'
          )}
        >
          {totalPages}
        </Link>
      );
    }

    return pages;
  };

  return (
    <nav className="flex items-center justify-center space-x-1 mt-8">
      <Link
        href={hasPrevPage ? generatePageUrl(currentPage - 1) as any : '#'}
        className={cn(
          'flex items-center px-3 py-2 text-sm rounded-md transition-colors',
          hasPrevPage
            ? 'hover:bg-accent hover:text-accent-foreground text-muted-foreground'
            : 'text-muted-foreground/50 cursor-not-allowed'
        )}
        {...(!hasPrevPage && { onClick: (e) => e.preventDefault() })}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        上一页
      </Link>

      <div className="flex items-center space-x-1 mx-4">
        {renderPageNumbers()}
      </div>

      <Link
        href={hasNextPage ? generatePageUrl(currentPage + 1) as any : '#'}
        className={cn(
          'flex items-center px-3 py-2 text-sm rounded-md transition-colors',
          hasNextPage
            ? 'hover:bg-accent hover:text-accent-foreground text-muted-foreground'
            : 'text-muted-foreground/50 cursor-not-allowed'
        )}
        {...(!hasNextPage && { onClick: (e) => e.preventDefault() })}
      >
        下一页
        <ChevronRight className="h-4 w-4 ml-1" />
      </Link>
    </nav>
  );
}