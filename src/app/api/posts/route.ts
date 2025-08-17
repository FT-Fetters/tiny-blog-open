import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts, getPaginatedPosts } from '@/lib/posts';

// 标记为动态路由
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '6');
    const search = searchParams.get('search');
    const tag = searchParams.get('tag');

    // 如果有搜索或标签过滤参数
    let posts = getAllPosts();
    
    // 搜索过滤
    if (search) {
      const searchLower = search.toLowerCase();
      posts = posts.filter(post => 
        post.title.toLowerCase().includes(searchLower) ||
        post.description?.toLowerCase().includes(searchLower) ||
        post.excerpt?.toLowerCase().includes(searchLower) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // 标签过滤
    if (tag) {
      posts = posts.filter(post => 
        post.tags.some(postTag => 
          postTag.toLowerCase() === tag.toLowerCase()
        )
      );
    }

    // 如果需要分页
    if (searchParams.get('paginated') === 'true') {
      const totalPosts = posts.length;
      const totalPages = Math.ceil(totalPosts / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      const paginatedPosts = posts.slice(startIndex, endIndex);
      
      return NextResponse.json({
        success: true,
        data: {
          posts: paginatedPosts,
          pagination: {
            currentPage: page,
            totalPages,
            totalPosts,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
          }
        }
      });
    }

    // 返回所有文章（不分页）
    return NextResponse.json({
      success: true,
      data: posts
    });

  } catch (error) {
    console.error('❌ 获取文章列表失败:', error);
    return NextResponse.json(
      { 
        success: false,
        error: '获取文章列表失败', 
        details: String(error) 
      },
      { status: 500 }
    );
  }
}