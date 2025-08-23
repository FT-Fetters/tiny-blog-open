'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedAdminPage } from '@/components/ProtectedAdminPage';
import { PostForm } from '@/components/PostForm';

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

export default function NewPost() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: PostFormData) => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        router.push('/admin/posts');
      } else {
        alert('创建文章失败: ' + result.error);
      }
    } catch (error) {
      console.error('创建文章失败:', error);
      alert('创建文章失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (confirm('确定要取消创建文章吗？未保存的内容将丢失。')) {
      router.push('/admin/posts');
    }
  };

  return (
    <ProtectedAdminPage>
      <div className="mb-6">
        <div className="text-2xl font-medium text-neutral-900 dark:text-neutral-100 mb-2">
          {'>'} Create New Post
        </div>
        <div className="text-neutral-600 dark:text-neutral-400 text-sm">
          ──────────────────────────────────────────────
        </div>
      </div>

      <PostForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
        submitText="创建文章"
      />
    </ProtectedAdminPage>
  );
}