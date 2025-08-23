'use client';

import { Suspense } from 'react';
import { PostCard } from '@/components/PostCard';
import { Pagination } from '@/components/Pagination';
import { usePosts } from '@/hooks/usePosts';
import { useConfig } from '@/hooks/useConfig';
import { useSearchParams } from 'next/navigation';
import { LoadingTransition } from '@/components/LoadingComponents';

function PostsPageContent() {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  
  const { data: config } = useConfig();
  const postsPerPage = config?.postsPerPage || 6;
  
  const { posts, pagination, loading, error } = usePosts({
    page: currentPage,
    limit: postsPerPage,
    paginated: true
  });

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
      <div className="mb-8 fade-in-up">
        <h1 className="text-3xl font-bold mb-4">所有文章</h1>
        <p className="text-muted-foreground">
          共 {pagination?.totalPosts || posts.length} 篇文章
        </p>
      </div>

      {posts.length > 0 ? (
        <>
          <div className="space-y-6 stagger-children">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
          
          {pagination && pagination.totalPages > 1 && (
            <div className="fade-in-delayed">
              <Pagination pagination={pagination} basePath="/posts" />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16 fade-in">
          <h2 className="text-2xl font-semibold mb-4">暂无文章</h2>
          <p className="text-muted-foreground">
            还没有发布任何文章，请稍后再来查看。
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

export default function PostsPage() {
  return (
    <Suspense fallback={
      <div className="content-wrapper py-12">
        <div className="mb-8">
          <div className="h-8 w-32 shimmer rounded mb-4"></div>
          <div className="h-4 w-48 shimmer rounded"></div>
        </div>
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card p-6 card-loading min-h-[200px]">
              <div className="space-y-4">
                <div className="h-6 w-2/3 shimmer rounded"></div>
                <div className="h-4 w-full shimmer rounded"></div>
                <div className="h-4 w-5/6 shimmer rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    }>
      <PostsPageContent />
    </Suspense>
  );
}