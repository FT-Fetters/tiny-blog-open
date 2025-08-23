import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminPassword, generateAdminToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { success: false, error: '密码不能为空' },
        { status: 400 }
      );
    }

    // 验证密码
    if (!verifyAdminPassword(password)) {
      return NextResponse.json(
        { success: false, error: '密码错误' },
        { status: 401 }
      );
    }

    // 生成token
    const token = generateAdminToken();

    // 创建响应
    const response = NextResponse.json({
      success: true,
      message: '登录成功',
      token
    });

    // 设置HTTP-only cookie
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24小时
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('管理员登录失败:', error);
    return NextResponse.json(
      { success: false, error: '登录失败' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const response = NextResponse.json({
      success: true,
      message: '已退出登录'
    });

    // 清除cookie
    response.cookies.delete('admin-token');

    return response;

  } catch (error) {
    console.error('登出失败:', error);
    return NextResponse.json(
      { success: false, error: '登出失败' },
      { status: 500 }
    );
  }
}