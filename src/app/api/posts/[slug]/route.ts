import { NextRequest, NextResponse } from 'next/server';
import { getPostBySlug, markdownToHtml } from '@/lib/posts';

interface RouteContext {
  params: { slug: string };
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { slug } = params;
    const { searchParams } = new URL(request.url);
    const includeContent = searchParams.get('includeContent') !== 'false';

    const post = getPostBySlug(slug);

    if (!post) {
      return NextResponse.json(
        { 
          success: false,
          error: '文章未找到' 
        },
        { status: 404 }
      );
    }

    let responseData: any = {
      ...post
    };

    // 如果需要包含HTML内容，处理markdown
    if (includeContent && post.content) {
      const htmlContent = await markdownToHtml(post.content);
      responseData = {
        ...responseData,
        htmlContent
      };
    }

    return NextResponse.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error(`❌ 获取文章 ${params.slug} 失败:`, error);
    return NextResponse.json(
      { 
        success: false,
        error: '获取文章失败', 
        details: String(error) 
      },
      { status: 500 }
    );
  }
}