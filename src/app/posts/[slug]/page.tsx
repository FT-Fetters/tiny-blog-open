'use client';

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import { usePost } from '@/hooks/usePost';
import { formatDate } from '@/lib/utils';
import { TagList } from '@/components/TagList';
import { useParams } from 'next/navigation';
import { LoadingTransition } from '@/components/LoadingComponents';

export default function PostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { post, htmlContent, loading, error } = usePost(slug, true);

  if (error) {
    return (
      <article className="content-wrapper py-12">
        <div className="text-center py-16 fade-in">
          <div className="text-red-500 dark:text-red-400">
            <h2 className="text-2xl font-semibold mb-4">加载失败</h2>
            <p>{error}</p>
            <Link 
              href="/posts" 
              className="inline-flex items-center mt-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回文章列表
            </Link>
          </div>
        </div>
      </article>
    );
  }

  if (!loading && !post) {
    notFound();
  }

  const skeletonContent = (
    <article className="content-wrapper py-12">
      <div className="mb-8">
        <div className="h-6 w-32 shimmer rounded mb-4"></div>
      </div>

      <header className="mb-8">
        <div className="h-8 w-3/4 shimmer rounded mb-4"></div>
        <div className="h-4 w-48 shimmer rounded mb-2"></div>
        <div className="h-4 w-32 shimmer rounded mb-6"></div>
        <div className="h-20 w-full shimmer rounded mb-8"></div>
      </header>

      <div className="space-y-4 mb-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={`shimmer rounded ${
            i === 3 || i === 7 ? 'h-4 w-2/3' : 'h-4 w-full'
          }`}></div>
        ))}
      </div>

      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-6 w-1/2 shimmer rounded"></div>
            <div className="h-4 w-full shimmer rounded"></div>
            <div className="h-4 w-5/6 shimmer rounded"></div>
            <div className="h-4 w-4/5 shimmer rounded"></div>
          </div>
        ))}
      </div>
    </article>
  );

  const actualContent = (
    <article className="content-wrapper py-12">
      {/* 返回按钮 */}
      <div className="mb-8 fade-in">
        <Link 
          href="/posts" 
          className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回文章列表
        </Link>
      </div>

      {/* 文章头部 */}
      <header className="mb-8 fade-in-up">
        {post?.cover && (
          <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.cover}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        
        <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
          {post?.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <time dateTime={post?.date}>
              {post?.date ? formatDate(post.date) : ''}
            </time>
          </div>
          
          {post?.readingTime && (
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{post.readingTime} 分钟阅读</span>
            </div>
          )}
        </div>
        
        {post?.tags && post.tags.length > 0 && (
          <div className="mb-8">
            <TagList tags={post.tags} linkable showIcon />
          </div>
        )}
        
        {post?.description && (
          <div className="text-lg text-muted-foreground mb-8 p-4 bg-muted rounded-lg">
            {post.description}
          </div>
        )}
      </header>

      {/* 文章内容 */}
      <div className="fade-in-delayed" style={{ animationDelay: '0.2s' }}>
        {htmlContent && (
          <div 
            className="prose"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        )}
      </div>

      {/* 文章底部 */}
      <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 fade-in-delayed" style={{ animationDelay: '0.4s' }}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              如果你觉得这篇文章有用，欢迎分享给更多人。
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              href="/posts" 
              className="btn-secondary"
            >
              查看更多文章
            </Link>
          </div>
        </div>
      </footer>
    </article>
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