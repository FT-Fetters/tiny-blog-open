'use client';

import { useState, useEffect } from 'react';

interface PageContent {
  content: string;
  htmlContent: string;
}

interface PageState {
  page: PageContent | null;
  loading: boolean;
  error: string | null;
}

export function usePage(slug: string) {
  const [state, setState] = useState<PageState>({
    page: null,
    loading: true,
    error: null
  });

  const fetchPage = async () => {
    if (!slug) return;
    
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await fetch(`/api/pages/${encodeURIComponent(slug)}`, {
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('页面未找到');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setState({
          page: result.data,
          loading: false,
          error: null
        });
      } else {
        throw new Error(result.error || '获取页面失败');
      }
    } catch (error) {
      setState({
        page: null,
        loading: false,
        error: error instanceof Error ? error.message : '获取页面失败'
      });
    }
  };

  useEffect(() => {
    fetchPage();
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    ...state,
    refetch: fetchPage
  };
}