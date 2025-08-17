import { NextResponse } from 'next/server';
import { getSiteConfigServer } from '@/lib/config';

// 强制动态渲染，禁用缓存
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const config = getSiteConfigServer();
    
    const response = NextResponse.json({
      success: true,
      data: config
    });
    
    // 禁用缓存，确保每次都获取最新配置
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');
    
    return response;
  } catch (error) {
    console.error('❌ 配置API错误:', error);
    return NextResponse.json(
      { 
        success: false,
        error: '获取配置失败', 
        details: String(error) 
      },
      { status: 500 }
    );
  }
}