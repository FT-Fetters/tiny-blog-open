import { SiteConfig } from '@/types';
import fs from 'fs';
import path from 'path';

/**
 * 服务端配置加载器
 * 仅在服务端运行，支持从Docker挂载目录动态加载配置
 */
export function loadServerSiteConfig(): SiteConfig {
  // 配置文件路径优先级：
  // 1. Docker挂载的配置目录 /app/config/site.config.json
  // 2. 项目根目录的配置文件
  
  const dockerConfigPath = '/app/config/site.config.json';
  const localConfigPath = path.resolve(process.cwd(), 'config/site.config.json');
  
  let configPath = localConfigPath;
  let isDockerConfig = false;
  
  // 在生产环境中，优先使用挂载的配置
  if (process.env.NODE_ENV === 'production' && fs.existsSync(dockerConfigPath)) {
    configPath = dockerConfigPath;
    isDockerConfig = true;
    console.log('📖 加载Docker挂载的JSON配置文件:', dockerConfigPath);
  } else if (fs.existsSync(localConfigPath)) {
    console.log('📖 加载本地JSON配置文件:', localConfigPath);
  } else {
    // 在构建时，配置文件可能不存在，直接返回默认配置，不记录警告
    if (process.env.NODE_ENV !== 'production') {
      console.log('📄 使用默认配置（构建时或开发时）');
    }
    return getDefaultConfig();
  }
  
  try {
    // 读取JSON配置文件
    const configData = fs.readFileSync(configPath, 'utf-8');
    const config = JSON.parse(configData) as SiteConfig;
    return config;
  } catch (error) {
    // 只在真正的错误时才记录
    if (fs.existsSync(configPath)) {
      console.error('❌ JSON配置文件存在但解析失败:', error);
    }
    return getDefaultConfig();
  }
}

function getDefaultConfig(): SiteConfig {
  return {
    title: "Lynn's Blog",
    description: "😜Yes, I broke it. No, I didn't mean to. Yes, I learned something.",
    introduction: '"Do not go gentle into that good night. Old age should burn and rave at close of day. Rage, rage against the dying of the light."',
    author: {
      name: 'Lynn',
      email: 'blog@example.com',
      github: 'github-username'
    },
    url: process.env.SITE_URL || 'https://your-blog.com',
    social: {
      github: process.env.GITHUB_URL || 'https://github.com/FT-Fetters',
      twitter: process.env.TWITTER_URL || 'https://twitter.com/username',
      email: process.env.EMAIL || 'mailto:ftfetters@gmail.com'
    },
    theme: {
      primaryColor: '#3b82f6'
    },
    nav: [
      { name: 'Home', href: '/' },
      { name: 'Posts', href: '/posts' },
      { name: 'Tags', href: '/tags' },
      { name: 'About', href: '/about' }
    ],
    postsPerPage: 6,
    excerptLength: 200
  };
}