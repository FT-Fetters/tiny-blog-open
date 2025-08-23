'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedAdminPage } from '@/components/ProtectedAdminPage';
import { PostForm } from '@/components/PostForm';
import { getPostBySlug } from '@/lib/posts';

interface PostFormData {
  title: string;
  slug: string;
  content: string;
  date: string;
  tags: string[];
  description: string;
  cover: string;
  published: boolean;
}

export default function EditPost({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPost, setIsLoadingPost] = useState(true);
  const [postData, setPostData] = useState<PostFormData | null>(null);
  const [error, setError] = useState<string>('');

  // 加载文章数据
  useEffect(() => {
    const loadPost = async () => {
      try {
        setIsLoadingPost(true);
        const response = await fetch(`/api/admin/posts/${params.slug}`, {
          credentials: 'include',
        });
        const result = await response.json();

        if (result.success) {
          const post = result.data;
          setPostData({
            title: post.title,
            slug: post.slug,
            content: post.content,
            date: post.date,
            tags: post.tags || [],
            description: post.description || '',
            cover: post.cover || '',
            published: post.published ?? true,
          });
        } else {
          setError('文章不存在或加载失败');
        }
      } catch (error) {
        console.error('加载文章失败:', error);
        setError('加载文章失败');
      } finally {
        setIsLoadingPost(false);
      }
    };

    loadPost();
  }, [params.slug]);

  const handleSubmit = async (formData: PostFormData) => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/admin/posts/${params.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          newSlug: formData.slug !== params.slug ? formData.slug : undefined,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // 如果修改了slug，跳转到新的编辑页面
        if (result.data.slug !== params.slug) {
          router.push(`/admin/posts/${result.data.slug}/edit`);
        } else {
          router.push('/admin/posts');
        }
      } else {
        alert('更新文章失败: ' + result.error);
      }
    } catch (error) {
      console.error('更新文章失败:', error);
      alert('更新文章失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/posts');
  };

  if (isLoadingPost) {
    return (
      <ProtectedAdminPage>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-neutral-900 dark:text-neutral-100 mb-2">
              {'>'} Loading post...
            </div>
            <div className="text-neutral-600 dark:text-neutral-400">
              正在加载文章数据...
            </div>
          </div>
        </div>
      </ProtectedAdminPage>
    );
  }

  if (error) {
    return (
      <ProtectedAdminPage>
        <div className="text-center py-12">
          <div className="text-red-500 dark:text-red-400 mb-4">
            {'>'} Error: {error}
          </div>
          <button
            onClick={() => router.push('/admin/posts')}
            className="bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900 px-4 py-2 rounded hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
          >
            返回文章列表
          </button>
        </div>
      </ProtectedAdminPage>
    );
  }

  if (!postData) {
    return (
      <ProtectedAdminPage>
        <div className="text-center py-12">
          <div className="text-neutral-600 dark:text-neutral-400">
            文章数据加载失败
          </div>
        </div>
      </ProtectedAdminPage>
    );
  }

  return (
    <ProtectedAdminPage>
      <div className="mb-6">
        <div className="text-2xl font-medium text-neutral-900 dark:text-neutral-100 mb-2">
          {'>'} Edit Post: {params.slug}
        </div>
        <div className="text-neutral-600 dark:text-neutral-400 text-sm">
          ──────────────────────────────────────────────
        </div>
      </div>

      <PostForm
        initialData={postData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
        submitText="更新文章"
      />
    </ProtectedAdminPage>
  );
}