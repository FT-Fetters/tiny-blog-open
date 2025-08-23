'use client';

import { TypewriterTitle } from '@/components/TypewriterTitle';
import { useConfig } from '@/hooks/useConfig';
import { LoadingTransition } from '@/components/LoadingComponents';

export default function HomePage() {
  const { data: config, loading, error } = useConfig();

  if (error) {
    return (
      <div className="content-wrapper py-16 pb-24">
        <section className="text-center py-20 md:py-32 fade-in">
          <div className="text-red-500 dark:text-red-400">
            <h2 className="text-2xl font-bold mb-4">加载失败</h2>
            <p>{error}</p>
          </div>
        </section>
      </div>
    );
  }

  const skeletonContent = (
    <div className="content-wrapper py-16 pb-24">
      <section className="text-center py-20 md:py-32">
        <div className="mb-12">
          <div className="h-16 w-96 mx-auto mb-4 shimmer rounded" />
        </div>
        
        <div className="h-6 w-2/3 mx-auto mb-12 shimmer rounded" />
        
        <div className="max-w-3xl mx-auto">
          <div className="h-4 w-full mb-2 shimmer rounded" />
          <div className="h-4 w-5/6 mx-auto shimmer rounded" />
        </div>
      </section>
    </div>
  );

  const actualContent = (
    <div className="content-wrapper py-16 pb-24">
      {/* Hero + Introduction Section */}
      <section className="text-center py-20 md:py-32 fade-in-up">
        <div className="mb-12">
          <TypewriterTitle 
            text={config?.title || ''}
            typeSpeed={120}
            deleteSpeed={80}
            pauseDuration={3000}
            restartPause={1500}
            className="text-4xl md:text-6xl lg:text-7xl text-neutral-900 dark:text-neutral-100 mb-4"
          />
        </div>
        
        <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 mb-12 max-w-2xl mx-auto leading-relaxed fade-in-delayed">
          {config?.description || ''}
        </p>
        
        {/* Introduction content */}
        <div className="max-w-3xl mx-auto fade-in-delayed" style={{ animationDelay: '0.4s' }}>
          <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-base">
            {config?.introduction || ''}
          </p>
        </div>
      </section>
    </div>
  );
  
  return (
    <LoadingTransition
      loading={loading || !config}
      skeleton={skeletonContent}
      delay={300}
    >
      {actualContent}
    </LoadingTransition>
  );
}