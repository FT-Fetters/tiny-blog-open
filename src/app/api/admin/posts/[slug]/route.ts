import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/middleware';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// 获取单篇文章（管理员视图，包括草稿）
const handleGetPost = withAdminAuth(async (request: NextRequest, { params }: { params: { slug: string } }) => {
  try {
    const { slug } = params;
    const postsDirectory = path.join(process.cwd(), 'content/posts');
    const filePath = path.join(postsDirectory, `${slug}.md`);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { success: false, error: '文章不存在' },
        { status: 404 }
      );
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    
    const stats = fs.statSync(filePath);
    
    const post = {
      slug,
      title: data.title,
      date: data.date,
      published: data.published ?? true,
      tags: data.tags || [],
      description: data.description,
      cover: data.cover,
      content,
      createdAt: stats.birthtime.toISOString(),
      updatedAt: stats.mtime.toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: post
    });

  } catch (error) {
    console.error('获取管理员文章失败:', error);
    return NextResponse.json(
      { success: false, error: '获取文章失败' },
      { status: 500 }
    );
  }
});

// 更新文章
const handleUpdatePost = withAdminAuth(async (request: NextRequest, { params }: { params: { slug: string } }) => {
  try {
    const { slug } = params;
    const body = await request.json();
    const { title, content, date, tags = [], description, cover, published = true, newSlug } = body;

    const postsDirectory = path.join(process.cwd(), 'content/posts');
    const currentFilePath = path.join(postsDirectory, `${slug}.md`);

    if (!fs.existsSync(currentFilePath)) {
      return NextResponse.json(
        { success: false, error: '文章不存在' },
        { status: 404 }
      );
    }

    // 如果要修改slug
    if (newSlug && newSlug !== slug) {
      const newFilePath = path.join(postsDirectory, `${newSlug}.md`);
      if (fs.existsSync(newFilePath)) {
        return NextResponse.json(
          { success: false, error: '新的slug已存在' },
          { status: 409 }
        );
      }
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

    // 如果修改了slug，先删除旧文件
    if (newSlug && newSlug !== slug) {
      const newFilePath = path.join(postsDirectory, `${newSlug}.md`);
      fs.writeFileSync(newFilePath, fileContent, 'utf8');
      fs.unlinkSync(currentFilePath);
    } else {
      fs.writeFileSync(currentFilePath, fileContent, 'utf8');
    }

    return NextResponse.json({
      success: true,
      message: '文章更新成功',
      data: { slug: newSlug || slug }
    });

  } catch (error) {
    console.error('更新文章失败:', error);
    return NextResponse.json(
      { success: false, error: '更新文章失败' },
      { status: 500 }
    );
  }
});

// 删除文章
const handleDeletePost = withAdminAuth(async (request: NextRequest, { params }: { params: { slug: string } }) => {
  try {
    const { slug } = params;
    const postsDirectory = path.join(process.cwd(), 'content/posts');
    const filePath = path.join(postsDirectory, `${slug}.md`);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { success: false, error: '文章不存在' },
        { status: 404 }
      );
    }

    fs.unlinkSync(filePath);

    return NextResponse.json({
      success: true,
      message: '文章删除成功'
    });

  } catch (error) {
    console.error('删除文章失败:', error);
    return NextResponse.json(
      { success: false, error: '删除文章失败' },
      { status: 500 }
    );
  }
});

export const GET = handleGetPost;
export const PUT = handleUpdatePost;
export const DELETE = handleDeletePost;