import { NextRequest, NextResponse } from 'next/server';
import { generateRSSFeed, generateAtomFeed, generateJSONFeed } from '@/lib/feed';

// 标记为动态路由，因为使用了查询参数
export const dynamic = 'force-dynamic';

/**
 * RSS Feed API路由
 * 
 * 支持的查询参数：
 * - format: 'rss' | 'atom' | 'json' (默认: 'rss')
 * - limit: 数字 (默认: 20，最大: 50)
 * - fullContent: 'true' | 'false' (默认: 'false')
 * 
 * 示例：
 * - /api/rss (RSS 2.0格式，20篇文章摘要)
 * - /api/rss?format=atom (Atom格式)
 * - /api/rss?format=json (JSON Feed格式)
 * - /api/rss?limit=10&fullContent=true (RSS格式，10篇文章全文)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // 解析查询参数
    const format = searchParams.get('format') || 'rss';
    const limitParam = searchParams.get('limit');
    const fullContentParam = searchParams.get('fullContent');
    
    // 验证和转换参数
    const limit = limitParam ? Math.min(Math.max(1, parseInt(limitParam, 10)), 50) : 20;
    const fullContent = fullContentParam === 'true';
    
    const options = { limit, fullContent };
    
    let feedContent: string;
    let contentType: string;
    
    // 根据格式生成对应的Feed
    switch (format.toLowerCase()) {
      case 'atom':
        feedContent = await generateAtomFeed(options);
        contentType = 'application/atom+xml; charset=utf-8';
        break;
        
      case 'json':
        feedContent = await generateJSONFeed(options);
        contentType = 'application/feed+json; charset=utf-8';
        break;
        
      case 'rss':
      default:
        feedContent = await generateRSSFeed(options);
        contentType = 'application/rss+xml; charset=utf-8';
        break;
    }
    
    // 返回Feed，设置适当的缓存策略
    return new NextResponse(feedContent, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    
    // 返回错误响应，但使用503表示临时不可用
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Feed Temporarily Unavailable</title><description>The RSS feed is temporarily unavailable. Please try again later.</description><link>/</link></channel></rss>',
      {
        status: 503,
        headers: {
          'Content-Type': 'application/rss+xml; charset=utf-8',
          'Cache-Control': 'no-cache',
          'Retry-After': '300', // 建议5分钟后重试
        },
      }
    );
  }
}