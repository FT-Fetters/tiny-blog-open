'use client';

import { useState, useEffect } from 'react';
import { PostMeta } from '@/types';

interface TagsState {
  tags: { tag: string; count: number }[];
  loading: boolean;
  error: string | null;
}

interface TagPostsState {
  tag: string;
  posts: PostMeta[];
  count: number;
  loading: boolean;
  error: string | null;
}

export function useTags() {
  const [state, setState] = useState<TagsState>({
    tags: [],
    loading: true,
    error: null
  });

  const fetchTags = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await fetch('/api/tags', {
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setState({
          tags: result.data,
          loading: false,
          error: null
        });
      } else {
        throw new Error(result.error || '获取标签失败');
      }
    } catch (error) {
      setState({
        tags: [],
        loading: false,
        error: error instanceof Error ? error.message : '获取标签失败'
      });
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  return {
    ...state,
    refetch: fetchTags
  };
}

export function useTagPosts(tag: string) {
  const [state, setState] = useState<TagPostsState>({
    tag: '',
    posts: [],
    count: 0,
    loading: true,
    error: null
  });

  const fetchTagPosts = async () => {
    if (!tag) return;
    
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await fetch(`/api/tags/${encodeURIComponent(tag)}`, {
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setState({
          tag: result.data.tag,
          posts: result.data.posts,
          count: result.data.count,
          loading: false,
          error: null
        });
      } else {
        throw new Error(result.error || '获取标签文章失败');
      }
    } catch (error) {
      setState({
        tag: '',
        posts: [],
        count: 0,
        loading: false,
        error: error instanceof Error ? error.message : '获取标签文章失败'
      });
    }
  };

  useEffect(() => {
    fetchTagPosts();
  }, [tag]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    ...state,
    refetch: fetchTagPosts
  };
}