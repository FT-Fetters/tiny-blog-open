'use client';

import { useState, useEffect } from 'react';
import { Post, PostMeta } from '@/types';

interface PostsState {
  posts: PostMeta[];
  loading: boolean;
  error: string | null;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalPosts: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

interface UsePostsOptions {
  page?: number;
  limit?: number;
  search?: string;
  tag?: string;
  paginated?: boolean;
}

export function usePosts(options: UsePostsOptions = {}) {
  const [state, setState] = useState<PostsState>({
    posts: [],
    loading: true,
    error: null
  });

  const fetchPosts = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const params = new URLSearchParams();
      if (options.page) params.set('page', options.page.toString());
      if (options.limit) params.set('limit', options.limit.toString());
      if (options.search) params.set('search', options.search);
      if (options.tag) params.set('tag', options.tag);
      if (options.paginated) params.set('paginated', 'true');

      const response = await fetch(`/api/posts?${params}`, {
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        if (options.paginated && result.data.posts) {
          setState({
            posts: result.data.posts,
            pagination: result.data.pagination,
            loading: false,
            error: null
          });
        } else {
          setState({
            posts: result.data,
            loading: false,
            error: null
          });
        }
      } else {
        throw new Error(result.error || '获取文章失败');
      }
    } catch (error) {
      setState({
        posts: [],
        loading: false,
        error: error instanceof Error ? error.message : '获取文章失败'
      });
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [options.page, options.limit, options.search, options.tag, options.paginated]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    ...state,
    refetch: fetchPosts
  };
}