import { NextRequest, NextResponse } from 'next/server';
import { getPageContent } from '@/lib/pages';

// 标记为动态路由
export const dynamic = 'force-dynamic';

interface RouteContext {
  params: { slug: string };
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { slug } = params;

    const pageContent = await getPageContent(slug);

    if (!pageContent) {
      return NextResponse.json(
        { 
          success: false,
          error: '页面未找到' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: pageContent
    });

  } catch (error) {
    console.error(`❌ 获取页面 ${params.slug} 失败:`, error);
    return NextResponse.json(
      { 
        success: false,
        error: '获取页面失败', 
        details: String(error) 
      },
      { status: 500 }
    );
  }
}