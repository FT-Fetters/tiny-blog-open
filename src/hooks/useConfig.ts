'use client';

import { useState, useEffect } from 'react';
import { SiteConfig } from '@/types';

interface ConfigState {
  config: SiteConfig | null;
  loading: boolean;
  error: string | null;
}

export function useConfig() {
  const [state, setState] = useState<ConfigState>({
    config: null,
    loading: true,
    error: null
  });

  const fetchConfig = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await fetch('/api/config', {
        method: 'GET',
        cache: 'no-cache', // 确保每次都获取最新配置
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setState({
          config: result.data,
          loading: false,
          error: null
        });
      } else {
        throw new Error(result.error || '获取配置失败');
      }
    } catch (error) {
      setState({
        config: null,
        loading: false,
        error: error instanceof Error ? error.message : '获取配置失败'
      });
    }
  };

  const reloadConfig = async () => {
    await fetchConfig();
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return {
    ...state,
    refetch: fetchConfig,
    reload: reloadConfig
  };
}