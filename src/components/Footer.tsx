import Link from 'next/link';
import { Github, Mail, Twitter } from 'lucide-react';
import { siteConfig } from '@/lib/config';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="content-wrapper">
        <div className="py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-4">{siteConfig.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {siteConfig.description}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">导航</h4>
              <ul className="space-y-2 text-sm">
                {siteConfig.nav.map((item) => (
                  <li key={item.href}>
                    <Link 
                      href={item.href as any}
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">联系方式</h4>
              <div className="flex space-x-4">
                {siteConfig.social.github && (
                  <a
                    href={siteConfig.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                    aria-label="GitHub"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                )}
                {siteConfig.social.twitter && (
                  <a
                    href={siteConfig.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                )}
                {siteConfig.social.email && (
                  <a
                    href={siteConfig.social.email}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                    aria-label="Email"
                  >
                    <Mail className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-400">
              <p>© {currentYear} {siteConfig.author.name}. 保留所有权利。</p>
              <p className="mt-2 md:mt-0">
                基于 Next.js 构建
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}