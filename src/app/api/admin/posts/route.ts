import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/middleware';
import { getAllPosts } from '@/lib/posts';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// 获取所有文章（包括草稿）- 管理员视图
const handleGetPosts = withAdminAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const includeContent = searchParams.get('includeContent') === 'true';
    const filterTag = searchParams.get('tag');

    // 获取posts目录
    const postsDirectory = path.join(process.cwd(), 'content/posts');
    
    if (!fs.existsSync(postsDirectory)) {
      return NextResponse.json({
        success: true,
        data: []
      });
    }

    const fileNames = fs.readdirSync(postsDirectory);
    let posts = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);
        
        const stats = fs.statSync(fullPath);
        
        return {
          slug,
          title: data.title,
          date: data.date,
          published: data.published ?? true,
          tags: data.tags || [],
          description: data.description,
          cover: data.cover,
          content: includeContent ? content : undefined,
          createdAt: stats.birthtime.toISOString(),
          updatedAt: stats.mtime.toISOString(),
        };
      });

    // 按标签筛选
    if (filterTag && filterTag.trim() !== '') {
      posts = posts.filter(post => 
        post.tags && post.tags.some((tag: string) => 
          tag.toLowerCase() === filterTag.toLowerCase()
        )
      );
    }

    // 按日期排序
    posts = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({
      success: true,
      data: posts
    });

  } catch (error) {
    console.error('获取管理员文章列表失败:', error);
    return NextResponse.json(
      { success: false, error: '获取文章列表失败' },
      { status: 500 }
    );
  }
});

// 创建新文章
const handleCreatePost = withAdminAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { slug, title, content, date, tags = [], description, cover, published = true } = body;

    if (!slug || !title || !content) {
      return NextResponse.json(
        { success: false, error: 'slug, title, content 是必填字段' },
        { status: 400 }
      );
    }

    // 检查slug是否已存在
    const postsDirectory = path.join(process.cwd(), 'content/posts');
    const filePath = path.join(postsDirectory, `${slug}.md`);
    
    if (fs.existsSync(filePath)) {
      return NextResponse.json(
        { success: false, error: '该文章slug已存在' },
        { status: 409 }
      );
    }

    // 确保目录存在
    if (!fs.existsSync(postsDirectory)) {
      fs.mkdirSync(postsDirectory, { recursive: true });
    }

    // 构建frontmatter
    const frontmatter = {
      title,
      date: date || new Date().toISOString().split('T')[0],
      ...(tags.length > 0 && { tags }),
      ...(description && { description }),
      ...(cover && { cover }),
      published,
    };

    // 生成markdown内容
    const fileContent = matter.stringify(content, frontmatter);

    // 写入文件
    fs.writeFileSync(filePath, fileContent, 'utf8');

    return NextResponse.json({
      success: true,
      message: '文章创建成功',
      data: { slug }
    });

  } catch (error) {
    console.error('创建文章失败:', error);
    return NextResponse.json(
      { success: false, error: '创建文章失败' },
      { status: 500 }
    );
  }
});

export const GET = handleGetPosts;
export const POST = handleCreatePost;