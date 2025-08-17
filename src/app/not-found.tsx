import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="content-wrapper">
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8">
            <Search className="h-24 w-24 text-muted-foreground/50 mx-auto mb-4" />
            <h1 className="text-6xl font-bold text-muted-foreground/50 mb-2">404</h1>
            <h2 className="text-2xl font-semibold mb-4">页面未找到</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              抱歉，您访问的页面不存在。可能是链接错误或页面已被移动。
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="btn-primary" as="/">
              {/* <Home className="mr-2 h-4 w-4" /> */}
              返回首页
            </Link>
            <Link href="/posts" className="btn-secondary" as="/posts">
              浏览文章
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}