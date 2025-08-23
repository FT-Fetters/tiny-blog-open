# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于Next.js 14的极简极客风博客系统，使用Markdown文件作为内容管理，具有黑白灰配色的极简设计风格。

**🆕 新增功能：** 完整的管理后台系统，包含JWT认证、在线编辑器、媒体管理等功能，提供安全便捷的内容管理体验。

## 常用开发命令

### 基础开发
```bash
# 安装依赖
pnpm install

# 启动开发服务器 (http://localhost:3000)
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start

# 代码检查
pnpm lint

# 类型检查
pnpm type-check
```

### Docker部署
```bash
# 一键部署（推荐）
./deploy.sh

# 手动部署
docker compose -f docker/docker-compose.yml up -d

# 查看日志
docker compose -f docker/docker-compose.yml logs -f

# 停止服务
docker compose -f docker/docker-compose.yml down
```

### 内容管理
```bash
# API动态加载模式 - 内容更改立即生效
# 编辑 Markdown 文件后，刷新浏览器即可看到更新

# 重新加载配置文件（Docker环境）
./reload-config.sh

# 手动调用配置重载API
curl -X POST http://localhost:3131/api/config/reload \
  -H "Authorization: Bearer YOUR_SECRET" \
  -H "Content-Type: application/json"
```

### 管理后台开发
```bash
# 访问管理后台（开发环境）
# http://localhost:3000/admin?key=你的安全入口码

# 管理员认证测试
curl -X POST http://localhost:3000/api/admin/auth \
  -H "Content-Type: application/json" \
  -d '{"secureEntrance": "你的安全入口码"}'

# 验证会话状态
curl -X GET http://localhost:3000/api/admin/session \
  -H "Authorization: Bearer JWT_TOKEN"

# 测试文章管理API
curl -X GET http://localhost:3000/api/admin/posts \
  -H "Authorization: Bearer JWT_TOKEN"
```

## 核心架构

### 内容系统架构（API动态加载模式）
- **内容存储**: `content/posts/` 目录存储Markdown文章，`content/pages/` 存储页面内容
- **API路由**: `src/app/api/` 提供动态内容接口，实时读取文件系统
- **类型定义**: `src/types/post.ts` 定义了文章的核心数据结构
- **配置管理**: `config/site.config.json` 统一管理站点配置（JSON格式），通过API动态加载，Docker环境支持挂载外部配置文件

### 文章数据流（API模式）
1. 客户端通过API路由请求内容（`/api/posts`, `/api/posts/[slug]`等）
2. API路由实时读取文件系统中的Markdown文件
3. 服务端解析frontmatter和内容，返回JSON数据
4. 客户端使用React hooks管理状态和缓存

### 渲染策略（API动态加载）
- **所有页面**: 客户端渲染 + API数据获取
- **实时更新**: 内容更改立即生效，无需重新验证
- **加载动画**: 使用LoadingTransition组件提供流畅的过渡效果
- **错误处理**: 统一的错误处理和加载状态管理

### API路由架构
**公开API路由:**
- `/api/posts`: 文章列表API，支持分页、搜索、标签过滤
- `/api/posts/[slug]`: 单篇文章API，包含HTML内容
- `/api/tags`: 标签列表API，包含文章计数
- `/api/tags/[tag]`: 特定标签的文章列表
- `/api/pages/[slug]`: 页面内容API（about-me, about-blog等）
- `/api/config`: 站点配置API，动态读取配置文件
- `/api/config/reload`: 配置重载API（Docker环境）
- `/api/images/[...path]`: 动态图片服务，支持Docker环境的图片访问

**🆕 管理后台API路由:**
- `/api/admin/auth`: 管理员认证，验证安全入口码
- `/api/admin/session`: 会话验证，检查JWT token有效性
- `/api/admin/posts`: 文章管理API（CRUD操作，需认证）
- `/api/admin/posts/[slug]`: 单篇文章管理API（需认证）
- `/api/admin/media`: 媒体文件管理API（上传、删除，需认证）
- `/api/admin/media/[filename]`: 单个媒体文件操作API（需认证）

## 关键技术实现

### API动态加载系统
- 使用Next.js App Router API路由处理动态内容
- React hooks（useConfig, usePosts, usePost等）管理客户端状态
- LoadingTransition组件提供流畅的加载过渡动画
- 统一的错误处理和加载状态管理

### 动画系统
- LoadingTransition组件实现cross-fade过渡效果
- Shimmer骨架屏动画，透明度优化
- 分层渐入动画（fade-in, fade-in-up, stagger-children）
- 所有页面统一的加载体验

### 主题系统
- 使用Tailwind CSS的`darkMode: 'class'`实现深色模式
- 通过CSS变量在`globals.css`中定义主题色彩
- `ThemeToggle`组件负责主题切换逻辑

### 字体配置
- 主字体: JetBrains Mono (等宽字体)
- 代码字体: Fira Code
- 所有文本统一使用等宽字体以保持极客风格

### 代码高亮
- 使用`remark-prism`和`rehype-prism-plus`处理代码块
- Prism.js提供语法高亮支持

### 图片处理
- 支持WebP和AVIF格式
- Docker环境通过API路由`/api/images/[...path]`访问图片
- 图片存储在`content/images/`或`public/images/`目录

### 🆕 管理后台系统
**认证与安全:**
- JWT (JSON Web Token) 认证机制，使用`jsonwebtoken`库
- 安全入口码机制：8位随机字符串，防止暴力破解
- 基于角色的权限控制（admin角色）
- 会话管理：自动刷新token，保持登录状态

**前端组件架构:**
- `AdminLayout`: 管理后台统一布局组件
- `ProtectedAdminPage`: 权限保护高阶组件
- `AdminLogin`: 认证登录组件
- `MarkdownEditor`: 在线Markdown编辑器，支持实时预览
- `PostForm`: 文章创建/编辑表单组件
- `ConfigManager`: 站点配置管理组件
- `MobileRestricted`: 移动端访问限制组件

**状态管理:**
- `useAuth`: 认证状态管理Hook，处理登录/登出
- `useMobileDetection`: 移动设备检测Hook
- Cookie存储JWT token，支持持久化登录

**安全特性:**
- 移动端访问限制，管理功能仅PC端可用
- API路由中间件验证，所有管理接口需要认证
- Token自动续期机制，提升用户体验
- 文件系统操作权限控制，防止目录遍历攻击

## 内容创建指南

### 文章Frontmatter结构
```yaml
---
title: "文章标题"           # 必填
date: "2024-01-01"        # 必填，YYYY-MM-DD格式
tags: ["标签1", "标签2"]   # 可选，标签数组
description: "文章摘要"    # 可选，SEO和摘要显示
cover: "/images/cover.jpg" # 可选，封面图片路径
published: true           # 可选，默认true，设为false为草稿
---
```

### 文件组织
- 文章文件: `content/posts/文件名.md`
- 页面文件: `content/pages/页面名.md`
- 图片资源: `content/images/` 或 `public/images/`

## 部署配置

### 环境变量
```bash
# Docker部署端口
BLOG_PORT=3131

# ISR重新验证密钥
REVALIDATE_SECRET=your-secret-key

# 数据目录路径
DATA_PATH=./blog-data

# 用户权限配置（Linux）
USER_ID=1001
GROUP_ID=1001

# 站点配置
SITE_URL=https://your-blog.com
GITHUB_URL=https://github.com/username
EMAIL=your@email.com
TWITTER_URL=https://twitter.com/username
```

### Docker目录结构
- 数据目录: `${DATA_PATH}/content` 和 `${DATA_PATH}/config`
- 容器端口: 3000（内部） → 3131（外部，可配置）
- 健康检查: 每30秒检查HTTP响应

## 开发注意事项

### 代码规范
- 使用TypeScript严格模式
- 组件采用函数式编程风格
- 文件命名：组件使用PascalCase，工具函数使用camelCase
- 优先使用现有的工具函数和组件模式

### 性能优化（API动态加载模式）
- 文章列表只加载元数据，不包含完整内容
- 使用Next.js的图片优化和字体优化
- 客户端组件的代码分割和懒加载
- React hooks实现智能缓存和状态管理

### 文章处理逻辑
- 阅读时间通过`calculateReadingTime()`自动计算
- 文章摘要优先使用frontmatter的description，否则自动生成
- 标签系统支持大小写不敏感的搜索和计数

### 实时内容更新
- API动态加载模式，内容更改立即生效
- 无需手动重新验证，文件保存后刷新即可看到更新
- Docker挂载内容支持实时同步
- 配置文件支持热重载（通过/api/config/reload）

## 高级开发指南

### TypeScript类型系统架构
- **核心类型定义**: `src/types/post.ts` 定义了Post、PostMeta和PostFrontmatter接口
- **Post vs PostMeta**: Post包含完整内容，PostMeta只包含元数据（用于列表页面性能优化）
- **类型导出模式**: 所有类型通过`src/types/index.ts`统一导出
- **严格模式**: 启用TypeScript严格模式，确保类型安全

### React Hooks架构模式
项目使用了统一的hooks模式管理API状态：
- **usePosts**: 文章列表管理，支持分页、搜索、标签过滤
- **usePost**: 单篇文章获取，包含加载状态管理
- **useConfig**: 站点配置管理，支持动态重载
- **🆕 useAuth**: 管理后台认证状态管理，JWT token处理
- **🆕 useMobileDetection**: 移动设备检测，管理后台访问控制
- **通用模式**: 所有hooks都实现`{data, loading, error, refetch}`模式

### 组件加载系统架构
- **LoadingTransition**: 核心过渡组件，实现cross-fade效果
- **骨架屏组件**: Skeleton、SkeletonText、SkeletonCard提供加载占位
- **分层动画**: fade-in、fade-in-up、stagger-children实现渐进式加载
- **状态管理**: 通过useState和useEffect精确控制加载过渡时序

### Markdown处理管道
```javascript
// 处理流程：Markdown → remark → remarkHtml → rehype → rehypePrismPlus
// 位置：src/lib/posts.ts 的 markdownToHtml 函数
// 特性：支持代码高亮、行号显示、HTML输出
```

### 关键工具函数 (`src/lib/utils.ts`)
- `calculateReadingTime()`: 基于字符数计算阅读时间
- `generateExcerpt()`: 自动生成文章摘要
- 这些函数在文章处理管道中被广泛使用

### 调试和故障排查

#### 常见开发问题
1. **文章不显示**: 检查frontmatter中的`published`字段和日期格式
2. **代码高亮问题**: 确认Prism.js语言包是否正确加载
3. **图片加载失败**: 检查Docker环境下的图片路径映射
4. **类型错误**: 优先检查`src/types/`中的类型定义
5. **🆕 管理后台无法访问**: 检查安全入口码是否正确，确认JWT token有效性
6. **🆕 移动端被限制**: 管理后台仅支持PC端访问，检查设备类型检测
7. **🆕 认证失效**: 检查Cookie中的JWT token，可能需要重新登录

#### API调试技巧
```bash
# 测试公开API端点
curl -X GET "http://localhost:3000/api/posts"
curl -X GET "http://localhost:3000/api/posts/sample-post"
curl -X GET "http://localhost:3000/api/config"

# Docker环境测试
curl -X GET "http://localhost:3131/api/posts"

# 🆕 测试管理后台API
# 1. 先进行认证获取JWT token
curl -X POST "http://localhost:3000/api/admin/auth" \
  -H "Content-Type: application/json" \
  -d '{"secureEntrance": "YOUR_8_CHAR_CODE"}'

# 2. 使用token访问管理API（替换JWT_TOKEN）
curl -X GET "http://localhost:3000/api/admin/session" \
  -H "Authorization: Bearer JWT_TOKEN"

curl -X GET "http://localhost:3000/api/admin/posts" \
  -H "Authorization: Bearer JWT_TOKEN"

# 3. 测试配置更新API
curl -X PUT "http://localhost:3000/api/config" \
  -H "Authorization: Bearer JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Title"}'
```

#### 构建问题诊断
```bash
# 完整的开发检查流程
pnpm install      # 确保依赖完整
pnpm type-check   # 类型检查（必须先通过）
pnpm lint         # 代码规范检查
pnpm build        # 构建检查
```

### 代码贡献规范
- **组件命名**: 使用PascalCase，如`PostCard.tsx`
- **Hook命名**: 使用camelCase，以use开头，如`usePosts.ts`
- **文件组织**: 组件放在`components/`，hooks放在`hooks/`，工具函数放在`lib/`
- **导入顺序**: React导入 → 第三方库 → 本地导入（相对路径）
- **CSS类名**: 使用Tailwind原子类，避免自定义CSS除非必要

### 性能监控点
- **内存泄漏**: 注意useEffect清理函数，特别是定时器和事件监听器
- **重复渲染**: 使用React DevTools检查不必要的重渲染
- **API调用频率**: hooks中使用依赖数组避免不必要的API请求
- **包体积**: 定期检查bundle大小，避免导入整个工具库