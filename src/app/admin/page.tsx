'use client';

import { ProtectedAdminPage } from '@/components/ProtectedAdminPage';
import { useEffect, useState } from 'react';
import { useConfig } from '@/hooks/useConfig';

interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalTags: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: config } = useConfig();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [postsResponse, tagsResponse] = await Promise.all([
        fetch('/api/posts'),
        fetch('/api/tags'),
      ]);

      const postsData = await postsResponse.json();
      const tagsData = await tagsResponse.json();

      if (postsData.success && tagsData.success) {
        const posts = postsData.data;
        const publishedPosts = posts.filter((post: any) => post.published !== false);
        const draftPosts = posts.filter((post: any) => post.published === false);

        setStats({
          totalPosts: posts.length,
          publishedPosts: publishedPosts.length,
          draftPosts: draftPosts.length,
          totalTags: tagsData.data.length,
        });
      }
    } catch (error) {
      console.error('获取统计数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentTime = new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <ProtectedAdminPage>
      <div className="max-w-6xl mx-auto">
        {/* 终端式欢迎信息 */}
        <div className="mb-8">
          <div className="text-2xl font-medium text-neutral-900 dark:text-neutral-100 mb-2">
            {'>'} Dashboard
          </div>
          <div className="text-neutral-600 dark:text-neutral-400 text-sm">
            ──────────────────────────────────────────────
          </div>
          <div className="mt-4 text-neutral-700 dark:text-neutral-300">
            Welcome back! Current time: {currentTime}
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loading ? (
            // 加载状态
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded p-6">
                <div className="skeleton h-4 w-16 mb-2"></div>
                <div className="skeleton h-8 w-12"></div>
              </div>
            ))
          ) : (
            <>
              <div className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded p-6">
                <div className="text-neutral-600 dark:text-neutral-400 text-sm mb-2">TOTAL_POSTS</div>
                <div className="text-3xl font-mono text-neutral-900 dark:text-neutral-100">
                  {stats?.totalPosts || 0}
                </div>
              </div>
              <div className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded p-6">
                <div className="text-neutral-600 dark:text-neutral-400 text-sm mb-2">PUBLISHED</div>
                <div className="text-3xl font-mono text-green-600 dark:text-green-400">
                  {stats?.publishedPosts || 0}
                </div>
              </div>
              <div className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded p-6">
                <div className="text-neutral-600 dark:text-neutral-400 text-sm mb-2">DRAFTS</div>
                <div className="text-3xl font-mono text-yellow-600 dark:text-yellow-400">
                  {stats?.draftPosts || 0}
                </div>
              </div>
              <div className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded p-6">
                <div className="text-neutral-600 dark:text-neutral-400 text-sm mb-2">TAGS</div>
                <div className="text-3xl font-mono text-blue-600 dark:text-blue-400">
                  {stats?.totalTags || 0}
                </div>
              </div>
            </>
          )}
        </div>

        {/* 快速操作 */}
        <div className="mb-8">
          <div className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-4">
            {'>'} Quick Actions
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <a
              href="/admin/posts/new"
              className="block p-4 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            >
              <div className="text-neutral-900 dark:text-neutral-100 font-medium mb-1">
                📝 New Post
              </div>
              <div className="text-neutral-600 dark:text-neutral-400 text-sm">
                Create a new blog post
              </div>
            </a>
            <a
              href="/admin/media"
              className="block p-4 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            >
              <div className="text-neutral-900 dark:text-neutral-100 font-medium mb-1">
                🖼️ Upload Media
              </div>
              <div className="text-neutral-600 dark:text-neutral-400 text-sm">
                Manage images and files
              </div>
            </a>
            <a
              href="/admin/settings"
              className="block p-4 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            >
              <div className="text-neutral-900 dark:text-neutral-100 font-medium mb-1">
                ⚙️ Settings
              </div>
              <div className="text-neutral-600 dark:text-neutral-400 text-sm">
                Configure site settings
              </div>
            </a>
          </div>
        </div>

        {/* 站点信息 */}
        <div className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded p-6">
          <div className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-4">
            {'>'} Site Information
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-neutral-600 dark:text-neutral-400 mb-1">Site Title:</div>
              <div className="text-neutral-900 dark:text-neutral-100">{config?.title || 'Loading...'}</div>
            </div>
            <div>
              <div className="text-neutral-600 dark:text-neutral-400 mb-1">Description:</div>
              <div className="text-neutral-900 dark:text-neutral-100">{config?.description || 'Loading...'}</div>
            </div>
            <div>
              <div className="text-neutral-600 dark:text-neutral-400 mb-1">Author:</div>
              <div className="text-neutral-900 dark:text-neutral-100">{config?.author?.name || 'Loading...'}</div>
            </div>
            <div>
              <div className="text-neutral-600 dark:text-neutral-400 mb-1">URL:</div>
              <div className="text-neutral-900 dark:text-neutral-100">{config?.url || 'Loading...'}</div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedAdminPage>
  );
}