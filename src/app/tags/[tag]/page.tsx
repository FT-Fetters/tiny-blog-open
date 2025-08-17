'use client';

import type { Metadata } from 'next';
import Link from 'next/link';
import { Hash, ArrowLeft } from 'lucide-react';
import { PostCard } from '@/components/PostCard';
import { useTagPosts } from '@/hooks/useTags';
import { useParams } from 'next/navigation';
import { LoadingTransition } from '@/components/LoadingComponents';

export default function TagPostsPage() {
  const params = useParams();
  const tag = decodeURIComponent(params.tag as string);

  const { posts, count, loading, error } = useTagPosts(tag);

  if (error) {
    return (
      <div className="content-wrapper py-12">
        <div className="text-center py-16 fade-in">
          <div className="text-red-500 dark:text-red-400">
            <h2 className="text-2xl font-semibold mb-4">加载失败</h2>
            <p>{error}</p>
            <Link 
              href="/tags" 
              className="inline-flex items-center mt-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回标签列表
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const skeletonContent = (
    <div className="content-wrapper py-12">
      <div className="mb-8">
        <div className="h-6 w-32 shimmer rounded mb-4"></div>
        <div className="h-8 w-64 shimmer rounded mb-4"></div>
        <div className="h-4 w-48 shimmer rounded"></div>
      </div>

      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card p-6 card-loading min-h-[200px]">
            <div className="space-y-4">
              <div className="h-6 w-2/3 shimmer rounded"></div>
              <div className="h-4 w-full shimmer rounded"></div>
              <div className="h-4 w-5/6 shimmer rounded"></div>
              <div className="flex space-x-2 pt-2">
                <div className="h-6 w-16 shimmer rounded"></div>
                <div className="h-6 w-20 shimmer rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const actualContent = (
    <div className="content-wrapper py-12">
      {/* 返回按钮 */}
      <div className="mb-8 fade-in">
        <Link 
          href="/tags" 
          className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回标签列表
        </Link>
      </div>

      {/* 标签头部 */}
      <div className="mb-8 fade-in-up">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Hash className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{tag}</h1>
            <p className="text-muted-foreground">
              {count} 篇文章
            </p>
          </div>
        </div>
      </div>

      {/* 文章列表 */}
      {posts.length > 0 ? (
        <div className="space-y-6 stagger-children">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 fade-in-delayed">
          <Hash className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-4">暂无文章</h2>
          <p className="text-muted-foreground">
            该标签下还没有任何文章。
          </p>
          <Link 
            href="/posts" 
            className="inline-block mt-4 btn-primary"
          >
            浏览所有文章
          </Link>
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