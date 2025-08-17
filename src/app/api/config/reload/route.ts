import { NextRequest, NextResponse } from 'next/server';
import { reloadServerConfig } from '@/lib/config';

// 强制动态渲染，禁用缓存
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: NextRequest) {
  try {
    // 验证密钥（如果设置了的话）
    const secret = request.headers.get('authorization');
    const expectedSecret = process.env.REVALIDATE_SECRET;
    
    if (expectedSecret && secret !== `Bearer ${expectedSecret}`) {
      return NextResponse.json(
        { 
          success: false,
          error: '未授权访问' 
        },
        { status: 401 }
      );
    }

    // 重新加载配置
    const newConfig = reloadServerConfig();
    
    console.log('✅ 配置重载成功:', {
      title: newConfig.title,
      description: newConfig.description
    });

    return NextResponse.json({
      success: true,
      message: '配置重载成功',
      data: {
        title: newConfig.title,
        description: newConfig.description,
        url: newConfig.url
      }
    });
  } catch (error) {
    console.error('❌ 配置重载失败:', error);
    return NextResponse.json(
      { 
        success: false,
        error: '配置重载失败', 
        details: String(error) 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: '使用 POST 方法重新加载配置',
    endpoint: '/api/config/reload'
  });
}