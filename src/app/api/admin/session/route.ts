import { NextRequest, NextResponse } from 'next/server';
import { extractTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = extractTokenFromRequest(request);
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: '未登录', authenticated: false },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Token无效', authenticated: false },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: {
        userId: payload.userId,
        role: payload.role
      }
    });

  } catch (error) {
    console.error('验证会话失败:', error);
    return NextResponse.json(
      { success: false, error: '验证失败', authenticated: false },
      { status: 500 }
    );
  }
}