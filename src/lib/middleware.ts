import { NextRequest, NextResponse } from 'next/server';
import { extractTokenFromRequest, verifyToken } from '@/lib/auth';

/**
 * 管理员路由保护中间件
 */
export function withAdminAuth(handler: (request: NextRequest, ...args: any[]) => Promise<NextResponse>) {
  return async (request: NextRequest, ...args: any[]) => {
    try {
      const token = extractTokenFromRequest(request);
      
      if (!token) {
        return NextResponse.json(
          { success: false, error: '需要登录', code: 'UNAUTHORIZED' },
          { status: 401 }
        );
      }

      const payload = verifyToken(token);
      
      if (!payload || payload.role !== 'admin') {
        return NextResponse.json(
          { success: false, error: '权限不足', code: 'FORBIDDEN' },
          { status: 403 }
        );
      }

      // 将用户信息添加到请求中
      (request as any).user = payload;
      
      return handler(request, ...args);

    } catch (error) {
      console.error('管理员认证失败:', error);
      return NextResponse.json(
        { success: false, error: '认证失败' },
        { status: 500 }
      );
    }
  };
}

/**
 * 检查是否为管理员路由
 */
export function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith('/admin') || pathname.startsWith('/api/admin');
}