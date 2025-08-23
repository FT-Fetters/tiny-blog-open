import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import { rehype } from 'rehype';
import rehypePrismPlus from 'rehype-prism-plus';
import rehypeStringify from 'rehype-stringify';
import { Post, PostMeta, PostFrontmatter } from '@/types';
import { calculateReadingTime, generateExcerpt } from './utils';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => fileName.replace(/\.md$/, ''));
}

export function getPostBySlug(slug: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    const frontmatter = data as PostFrontmatter;
    
    // 如果文章未发布，返回 null
    if (frontmatter.published === false) {
      return null;
    }

    const readingTime = calculateReadingTime(content);
    const excerpt = frontmatter.description || generateExcerpt(content);

    return {
      slug,
      title: frontmatter.title,
      date: frontmatter.date,
      description: frontmatter.description,
      content,
      tags: frontmatter.tags || [],
      cover: frontmatter.cover,
      excerpt,
      readingTime,
      published: frontmatter.published ?? true,
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

export function getAllPosts(): PostMeta[] {
  const slugs = getAllPostSlugs();
  const posts = slugs
    .map(slug => {
      const post = getPostBySlug(slug);
      if (!post) return null;
      
      // 只返回元数据，不包含内容
      const { content, ...meta } = post;
      return meta;
    })
    .filter((post): post is PostMeta => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export function getPostsByTag(tag: string): PostMeta[] {
  const allPosts = getAllPosts();
  return allPosts.filter(post => 
    post.tags.some(postTag => 
      postTag.toLowerCase() === tag.toLowerCase()
    )
  );
}

export function getAllTags(): { tag: string; count: number }[] {
  const allPosts = getAllPosts();
  const tagCounts: Record<string, number> = {};

  allPosts.forEach(post => {
    post.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  return Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function getPaginatedPosts(page: number = 1, limit: number = 6) {
  const allPosts = getAllPosts();
  const totalPosts = allPosts.length;
  const totalPages = Math.ceil(totalPosts / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  const posts = allPosts.slice(startIndex, endIndex);
  
  return {
    posts,
    pagination: {
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

export async function markdownToHtml(markdown: string): Promise<string> {
  // 首先将 markdown 转换为 HTML
  const remarkResult = await remark()
    .use(remarkHtml, { sanitize: false })
    .process(markdown);
    
  // 然后使用 rehype 处理 HTML，添加代码高亮
  const rehypeResult = await rehype()
    .use(rehypePrismPlus, {
      showLineNumbers: true,
      ignoreMissing: true,
      // 确保行号功能正确启用
      lineNumbersStyle: true
    })
    .use(rehypeStringify)
    .process(remarkResult.toString());
    
  return rehypeResult.toString();
}