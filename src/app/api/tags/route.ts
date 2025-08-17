import { NextRequest, NextResponse } from 'next/server';
import { getAllTags, getPostsByTag } from '@/lib/posts';

// 标记为动态路由
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get('tag');

    // 如果指定了标签，返回该标签下的文章
    if (tag) {
      const posts = getPostsByTag(tag);
      return NextResponse.json({
        success: true,
        data: {
          tag,
          posts,
          count: posts.length
        }
      });
    }

    // 否则返回所有标签
    const tags = getAllTags();
    return NextResponse.json({
      success: true,
      data: tags
    });

  } catch (error) {
    console.error('❌ 获取标签失败:', error);
    return NextResponse.json(
      { 
        success: false,
        error: '获取标签失败', 
        details: String(error) 
      },
      { status: 500 }
    );
  }
}