import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  user: {
    userId: string;
    role: string;
  } | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    loading: true,
    user: null,
  });
  const router = useRouter();

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/session', {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success && data.authenticated) {
        setAuthState({
          isAuthenticated: true,
          loading: false,
          user: data.user,
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          loading: false,
          user: null,
        });
      }
    } catch (error) {
      console.error('验证失败:', error);
      setAuthState({
        isAuthenticated: false,
        loading: false,
        user: null,
      });
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/admin/auth', {
        method: 'DELETE',
        credentials: 'include',
      });
      
      // 清除客户端token
      Cookies.remove('admin-token');
      
      setAuthState({
        isAuthenticated: false,
        loading: false,
        user: null,
      });
      
      // 重定向到首页
      router.push('/');
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  const refreshAuth = () => {
    setAuthState(prev => ({ ...prev, loading: true }));
    checkAuth();
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return {
    ...authState,
    logout,
    refreshAuth,
  };
}