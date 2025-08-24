import { Feed } from 'feed';
import { getAllPosts, getPostBySlug, markdownToHtml } from './posts';
import { PostMeta } from '@/types';
import fs from 'fs';
import path from 'path';

// 缓存机制
interface CachedFeed {
  content: string;
  timestamp: number;
}

class FeedService {
  private cache: Map<string, CachedFeed> = new Map();
  private readonly CACHE_DURATION = 60 * 60 * 1000; // 1小时缓存

  /**
   * 获取站点配置
   */
  private getSiteConfig() {
    try {
      const configPath = path.join(process.cwd(), 'config/site.config.json');
      const configContent = fs.readFileSync(configPath, 'utf8');
      return JSON.parse(configContent);
    } catch (error) {
      console.error('Error reading site config:', error);
      // 返回默认配置
      return {
        title: 'Tiny Blog',
        description: 'A minimal blog system',
        url: 'http://localhost:3000',
        author: {
          name: 'Unknown',
          email: 'blog@example.com',
        },
      };
    }
  }

  /**
   * 检查缓存是否过期
   */
  private isExpired(cached: CachedFeed): boolean {
    return Date.now() - cached.timestamp > this.CACHE_DURATION;
  }

  /**
   * 生成缓存键
   */
  private getCacheKey(options: { limit?: number; fullContent?: boolean }): string {
    return `rss_${options.limit || 20}_${options.fullContent || false}`;
  }

  /**
   * 构建Feed对象
   */
  private async buildFeed(options: {
    limit?: number;
    fullContent?: boolean;
  }): Promise<string> {
    const config = this.getSiteConfig();
    const limit = options.limit || 20;
    const fullContent = options.fullContent || false;

    // 创建Feed实例
    const feed = new Feed({
      title: config.title,
      description: config.description,
      id: config.url,
      link: config.url,
      language: 'zh-CN',
      image: `${config.url}/favicon.ico`,
      favicon: `${config.url}/favicon.ico`,
      copyright: `All rights reserved ${new Date().getFullYear()}, ${config.author.name}`,
      updated: new Date(),
      generator: 'Tiny Blog RSS Generator',
      feedLinks: {
        rss: `${config.url}/api/rss`,
        json: `${config.url}/api/feed.json`,
        atom: `${config.url}/api/atom`,
      },
      author: {
        name: config.author.name,
        email: config.author.email,
        link: config.social?.github || config.url,
      },
    });

    // 获取文章列表
    const posts = getAllPosts().slice(0, limit);

    // 并行处理文章内容
    const postsWithContent = await Promise.all(
      posts.map(async (postMeta: PostMeta) => {
        const fullPost = getPostBySlug(postMeta.slug);
        if (!fullPost) return null;

        let content = postMeta.excerpt;
        
        // 如果需要全文，则转换Markdown为HTML
        if (fullContent && fullPost.content) {
          try {
            content = await markdownToHtml(fullPost.content);
          } catch (error) {
            console.error(`Error converting markdown for ${postMeta.slug}:`, error);
            content = postMeta.excerpt;
          }
        }

        return {
          ...postMeta,
          content,
        };
      })
    );

    // 添加文章到Feed
    postsWithContent
      .filter(post => post !== null)
      .forEach(post => {
        if (!post) return;

        feed.addItem({
          title: post.title,
          id: `${config.url}/posts/${post.slug}`,
          link: `${config.url}/posts/${post.slug}`,
          description: post.excerpt,
          content: post.content || post.excerpt,
          author: [
            {
              name: config.author.name,
              email: config.author.email,
            },
          ],
          date: new Date(post.date),
          category: post.tags.map(tag => ({ name: tag })),
          image: post.cover ? `${config.url}${post.cover}` : undefined,
        });
      });

    return feed.rss2();
  }

  /**
   * 生成RSS Feed
   */
  async generateRSS(options: {
    limit?: number;
    fullContent?: boolean;
  } = {}): Promise<string> {
    const cacheKey = this.getCacheKey(options);

    // 检查缓存
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      if (!this.isExpired(cached)) {
        return cached.content;
      }
    }

    try {
      // 生成新的Feed
      const feedContent = await this.buildFeed(options);

      // 更新缓存
      this.cache.set(cacheKey, {
        content: feedContent,
        timestamp: Date.now(),
      });

      return feedContent;
    } catch (error) {
      console.error('Error generating RSS feed:', error);
      
      // 如果生成失败，尝试返回缓存的版本（即使过期）
      const cached = this.cache.get(cacheKey);
      if (cached) {
        return cached.content;
      }

      // 返回空的但合法的RSS
      return this.generateEmptyFeed();
    }
  }

  /**
   * 生成Atom Feed
   */
  async generateAtom(options: {
    limit?: number;
    fullContent?: boolean;
  } = {}): Promise<string> {
    // 复用相同的构建逻辑，但返回Atom格式
    const feed = await this.buildFeedObject(options);
    return feed.atom1();
  }

  /**
   * 生成JSON Feed
   */
  async generateJSONFeed(options: {
    limit?: number;
    fullContent?: boolean;
  } = {}): Promise<string> {
    // 复用相同的构建逻辑，但返回JSON格式
    const feed = await this.buildFeedObject(options);
    return feed.json1();
  }

  /**
   * 构建Feed对象（内部使用）
   */
  private async buildFeedObject(options: {
    limit?: number;
    fullContent?: boolean;
  }): Promise<Feed> {
    const config = this.getSiteConfig();
    const limit = options.limit || 20;
    const fullContent = options.fullContent || false;

    const feed = new Feed({
      title: config.title,
      description: config.description,
      id: config.url,
      link: config.url,
      language: 'zh-CN',
      updated: new Date(),
      generator: 'Tiny Blog Feed Generator',
      copyright: `All rights reserved ${new Date().getFullYear()}, ${config.author.name}`,
      author: {
        name: config.author.name,
        email: config.author.email,
      },
    });

    const posts = getAllPosts().slice(0, limit);
    
    for (const postMeta of posts) {
      const fullPost = getPostBySlug(postMeta.slug);
      if (!fullPost) continue;

      let content = postMeta.excerpt;
      if (fullContent && fullPost.content) {
        try {
          content = await markdownToHtml(fullPost.content);
        } catch (error) {
          console.error(`Error converting markdown for ${postMeta.slug}:`, error);
        }
      }

      feed.addItem({
        title: postMeta.title,
        id: `${config.url}/posts/${postMeta.slug}`,
        link: `${config.url}/posts/${postMeta.slug}`,
        description: postMeta.excerpt,
        content: content,
        date: new Date(postMeta.date),
        category: postMeta.tags.map(tag => ({ name: tag })),
      });
    }

    return feed;
  }

  /**
   * 生成空的RSS Feed（错误处理用）
   */
  private generateEmptyFeed(): string {
    const config = this.getSiteConfig();
    const feed = new Feed({
      title: config.title,
      description: config.description,
      id: config.url,
      link: config.url,
      language: 'zh-CN',
      updated: new Date(),
      generator: 'Tiny Blog RSS Generator',
      copyright: `All rights reserved ${new Date().getFullYear()}, ${config.author.name}`,
      author: {
        name: config.author.name,
        email: config.author.email,
      },
    });

    return feed.rss2();
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.cache.clear();
  }
}

// 导出单例实例
export const feedService = new FeedService();

// 导出便捷方法
export const generateRSSFeed = (options?: { limit?: number; fullContent?: boolean }) => 
  feedService.generateRSS(options);

export const generateAtomFeed = (options?: { limit?: number; fullContent?: boolean }) =>
  feedService.generateAtom(options);

export const generateJSONFeed = (options?: { limit?: number; fullContent?: boolean }) =>
  feedService.generateJSONFeed(options);