'use client';

import { useState, useEffect } from 'react';
import { Post } from '@/types';

interface PostState {
  post: Post | null;
  htmlContent?: string;
  loading: boolean;
  error: string | null;
}

export function usePost(slug: string, includeContent: boolean = true) {
  const [state, setState] = useState<PostState>({
    post: null,
    loading: true,
    error: null
  });

  const fetchPost = async () => {
    if (!slug) return;
    
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const params = new URLSearchParams();
      if (!includeContent) params.set('includeContent', 'false');

      const response = await fetch(`/api/posts/${encodeURIComponent(slug)}?${params}`, {
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('文章未找到');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setState({
          post: result.data,
          htmlContent: result.data.htmlContent,
          loading: false,
          error: null
        });
      } else {
        throw new Error(result.error || '获取文章失败');
      }
    } catch (error) {
      setState({
        post: null,
        loading: false,
        error: error instanceof Error ? error.message : '获取文章失败'
      });
    }
  };

  useEffect(() => {
    fetchPost();
  }, [slug, includeContent]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    ...state,
    refetch: fetchPost
  };
}