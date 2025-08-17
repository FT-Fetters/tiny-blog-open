import { NextRequest, NextResponse } from 'next/server';
import { getPostsByTag } from '@/lib/posts';

interface RouteContext {
  params: { tag: string };
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { tag } = params;
    const decodedTag = decodeURIComponent(tag);
    
    const posts = getPostsByTag(decodedTag);

    return NextResponse.json({
      success: true,
      data: {
        tag: decodedTag,
        posts,
        count: posts.length
      }
    });

  } catch (error) {
    console.error(`❌ 获取标签 ${params.tag} 下的文章失败:`, error);
    return NextResponse.json(
      { 
        success: false,
        error: '获取标签文章失败', 
        details: String(error) 
      },
      { status: 500 }
    );
  }
}