'use client';

import { useConfig } from '@/hooks/useConfig';
import { usePage } from '@/hooks/usePage';
import { LoadingTransition, SkeletonCard, StaggerContainer } from '@/components/LoadingComponents';

export default function AboutPage() {
  const { data: config, loading: configLoading } = useConfig();
  const { page: aboutMePage, loading: aboutMeLoading, error: aboutMeError } = usePage('about-me');
  const { page: aboutBlogPage, loading: aboutBlogLoading, error: aboutBlogError } = usePage('about-blog');

  const loading = configLoading || aboutMeLoading || aboutBlogLoading;
  const error = aboutMeError || aboutBlogError;

  if (error) {
    return (
      <div className="content-wrapper py-12">
        <div className="text-center py-16 fade-in">
          <div className="text-red-500 dark:text-red-400">
            <h2 className="text-2xl font-semibold mb-4">加载失败</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!aboutMePage || !aboutBlogPage || !config) {
    if (!loading) {
      return (
        <div className="content-wrapper py-12">
          <div className="text-center py-16 fade-in">
            <div className="text-yellow-500 dark:text-yellow-400">
              <h2 className="text-2xl font-semibold mb-4">页面不完整</h2>
              <p>缺少必要的页面内容文件</p>
            </div>
          </div>
        </div>
      );
    }
  }

  const skeletonContent = (
    <div className="content-wrapper py-12">
      <div className="max-w-3xl mx-auto">
        <div className="h-8 w-32 shimmer rounded mb-8"></div>
        
        <div className="space-y-8">
          <SkeletonCard lines={5} className="min-h-[300px]" />
          <SkeletonCard lines={3} className="min-h-[200px]" />
        </div>
      </div>
    </div>
  );

  const actualContent = (
    <div className="content-wrapper py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 fade-in-up">关于</h1>
        
        <StaggerContainer className="space-y-8">
          <div className="card p-8">
            <div 
              className="prose prose-gray dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: aboutMePage?.htmlContent || '' }}
            />
            
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-xl font-semibold mb-4">联系方式</h3>
              <div className="flex flex-wrap gap-4">
                {config?.social?.email && (
                  <a
                    href={config.social.email}
                    className="btn-secondary transition-bounce"
                  >
                    邮箱
                  </a>
                )}
                {config?.social?.github && (
                  <a
                    href={config.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary transition-bounce"
                  >
                    GitHub
                  </a>
                )}
                {config?.social?.twitter && (
                  <a
                    href={config.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary transition-bounce"
                  >
                    Twitter
                  </a>
                )}
              </div>
            </div>
          </div>
          
          <div className="card p-8">
            <div 
              className="prose prose-gray dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: aboutBlogPage?.htmlContent || '' }}
            />
          </div>
        </StaggerContainer>
      </div>
    </div>
  );

  return (
    <LoadingTransition
      loading={loading || !aboutMePage || !aboutBlogPage || !config}
      skeleton={skeletonContent}
      delay={300}
    >
      {actualContent}
    </LoadingTransition>
  );
}