'use client';

import type { Metadata } from 'next';
import Link from 'next/link';
import { Hash } from 'lucide-react';
import { useTags } from '@/hooks/useTags';
import { LoadingTransition } from '@/components/LoadingComponents';

export default function TagsPage() {
  const { tags, loading, error } = useTags();

  if (error) {
    return (
      <div className="content-wrapper py-12">
        <div className="text-center py-16 fade-in">
          <div className="text-red-500 dark:text-red-400">
            <h2 className="text-2xl font-semibold mb-4">加载失败</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const skeletonContent = (
    <div className="content-wrapper py-12">
      <div className="mb-8">
        <div className="h-8 w-32 shimmer rounded mb-4"></div>
        <div className="h-4 w-48 shimmer rounded"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card p-6 card-loading min-h-[120px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 shimmer rounded-lg"></div>
                <div className="space-y-2">
                  <div className="h-5 w-16 shimmer rounded"></div>
                  <div className="h-4 w-12 shimmer rounded"></div>
                </div>
              </div>
              <div className="h-6 w-6 shimmer rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const actualContent = (
    <div className="content-wrapper py-12">
      <div className="mb-8 fade-in-up">
        <h1 className="text-3xl font-bold mb-4">Tags</h1>
        <p className="text-muted-foreground">
          Browse articles by tags, total {tags.length} tags
        </p>
      </div>

      {tags.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
          {tags.map(({ tag, count }) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              className="card p-6 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <Hash className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {tag}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {count} 篇文章
                    </p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-muted-foreground/50">
                  {count}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 fade-in">
          <Hash className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-4">暂无标签</h2>
          <p className="text-muted-foreground">
            还没有任何标签，发布文章后标签会在这里显示。
          </p>
        </div>
      )}
    </div>
  );

  return (
    <LoadingTransition
      loading={loading}
      skeleton={skeletonContent}
      delay={300}
    >
      {actualContent}
    </LoadingTransition>
  );
}