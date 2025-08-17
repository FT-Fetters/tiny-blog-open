import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock } from 'lucide-react';
import { PostMeta } from '@/types';
import { formatDate } from '@/lib/utils';
import { TagList } from './TagList';

interface PostCardProps {
  post: PostMeta;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="card transition-all duration-200 hover:shadow-md overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* 封面图片区域 */}
        {post.cover && (
          <div className="relative w-full md:w-64 h-48 md:h-auto flex-shrink-0">
            <Image
              src={post.cover}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        
        {/* 内容区域 */}
        <div className="flex flex-col flex-1 p-6 md:p-8">
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-3 line-clamp-2 leading-snug">
              <Link 
                href={`/posts/${post.slug}`}
                className="text-neutral-900 dark:text-neutral-100"
              >
                {post.title}
              </Link>
            </h3>
            
            {post.excerpt && (
              <p className="text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2 leading-relaxed">
                {post.excerpt}
              </p>
            )}
            
            {post.tags.length > 0 && (
              <div className="mb-4">
                <TagList tags={post.tags} />
              </div>
            )}
          </div>
          
          {/* 底部元信息 */}
          <div className="flex items-center justify-between text-sm text-neutral-500 dark:text-neutral-500 pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.date}>
                  {formatDate(post.date)}
                </time>
              </div>
              
              {post.readingTime && (
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{post.readingTime} 分钟阅读</span>
                </div>
              )}
            </div>
            
            <Link 
              href={`/posts/${post.slug}`}
              className="text-neutral-600 dark:text-neutral-400 font-medium"
            >
              阅读更多 →
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}