# Tiny Blog

一个基于 Next.js 14 的极简极客风博客系统，采用 Markdown 文件管理内容，具有黑白灰配色的极简设计风格。

## ✨ 特性

- 🎨 **极简设计**：黑白灰配色，极客风格的界面设计
- 📝 **Markdown 驱动**：使用 Markdown 文件管理文章和页面内容
- 🚀 **实时更新**：API 动态加载模式，内容更改立即生效
- 🌙 **深色模式**：内置主题切换功能
- 📱 **响应式设计**：完美适配各种设备屏幕
- 🔍 **搜索和标签**：支持文章搜索和标签分类
- 🐳 **Docker 部署**：一键部署，开箱即用
- ⚡ **性能优化**：基于 Next.js 14 App Router，优化加载性能
- 🛠️ **TypeScript**：完整的类型安全保障

## 🚀 快速开始

### 环境要求

- Node.js 18+ 
- pnpm 8+
- Docker (可选，用于部署)

### 本地开发

```bash
# 克隆项目
git clone https://github.com/FT-Fetters/tiny-blog-open
cd tiny-blog-open

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

访问 http://localhost:3000 查看博客。

### 一键部署 (推荐)

使用自动化部署脚本，快速完成博客部署：

```bash
# 使用部署脚本
./scripts/deploy.sh
```

脚本将引导你完成以下配置：
- 📝 博客标题设置
- 🔗 社交媒体链接 (GitHub、Email、Twitter)
- 📂 数据存储目录选择
- 🚪 服务端口配置

部署完成后，博客将在 http://localhost:3131 (或你指定的端口) 运行。

**脚本功能特性:**
- ✅ 自动检查 Docker 环境
- ⚙️ 智能生成配置文件
- 📁 自动创建数据目录结构
- 🚀 一键启动 Docker 服务
- 🔄 配置热重载支持

> 💡 **更多详细说明请参考：**
> - [用户使用指南 (中文)](docs/用户使用指南.md)
> - [User Guide (English)](docs/USER_GUIDE.md)

### 手动 Docker 部署

```bash
# 构建并启动
docker compose -f docker/docker-compose.yml up -d

# 查看日志
docker compose -f docker/docker-compose.yml logs -f

# 停止服务
docker compose -f docker/docker-compose.yml down
```

## 📚 文档

- [用户使用指南 (中文)](docs/用户使用指南.md) - 详细的博客使用说明
- [User Guide (English)](docs/USER_GUIDE.md) - Complete user guide in English
- [API 接口文档](#-api-接口) - API 接口说明

## 📁 项目结构

```
tiny-blog/
├── src/                          # 源代码
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API 路由
│   │   │   ├── posts/            # 文章 API
│   │   │   ├── tags/             # 标签 API
│   │   │   ├── pages/            # 页面 API
│   │   │   ├── config/           # 配置 API
│   │   │   └── images/           # 图片服务 API
│   │   ├── posts/                # 文章页面
│   │   ├── tags/                 # 标签页面
│   │   └── about/                # 关于页面
│   ├── components/               # React 组件
│   ├── hooks/                    # 自定义 Hooks
│   ├── lib/                      # 工具库
│   └── types/                    # TypeScript 类型定义
├── content/                      # 内容目录
│   ├── posts/                    # Markdown 文章
│   ├── pages/                    # Markdown 页面
│   └── images/                   # 图片资源
├── config/                       # 配置文件
│   └── site.config.json          # 站点配置
├── docker/                       # Docker 配置
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── docker-entrypoint.sh
├── docs/                         # 文档目录
│   ├── 用户使用指南.md           # 中文用户指南
│   └── USER_GUIDE.md            # 英文用户指南
└── scripts/                      # 部署脚本
    └── deploy.sh                 # 一键部署脚本
```

## 📝 内容管理

### 文章管理

在 `content/posts/` 目录下创建 Markdown 文件：

```markdown
---
title: "文章标题"
date: "2024-01-01"
tags: ["技术", "前端"]
description: "文章摘要"
cover: "/images/cover.jpg"
published: true
---

# 文章内容

这里是文章的正文内容...
```

### 页面管理

在 `content/pages/` 目录下创建页面文件：

- `about-me.md` - 关于我页面
- `about-blog.md` - 关于博客页面

### 站点配置

编辑 `config/site.config.json` 文件：

```json
{
  "title": "Tiny Blog",
  "description": "博客描述",
  "author": {
    "name": "作者名称",
    "email": "author@example.com",
    "github": "github-username"
  },
  "url": "https://your-blog.com",
  "social": {
    "github": "https://github.com/username",
    "twitter": "https://twitter.com/username",
    "email": "mailto:contact@example.com"
  }
}
```

## 🔧 开发命令

```bash
# 开发
pnpm dev              # 启动开发服务器
pnpm build            # 构建生产版本
pnpm start            # 启动生产服务器
pnpm lint             # 代码检查
pnpm type-check       # 类型检查
```

## 🐳 Docker 部署配置

### 环境变量

创建 `.env` 文件：

```bash
# 部署端口
BLOG_PORT=3131

# 重新验证密钥
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

### 数据目录结构

```
blog-data/
├── content/
│   ├── posts/          # 文章目录
│   ├── pages/          # 页面目录
│   └── images/         # 图片目录
└── config/
    └── site.config.json # 站点配置
```

### 配置热重载

Docker 环境支持配置文件热重载：

```bash
# 重新加载配置
curl -X POST http://localhost:3131/api/config/reload \
  -H "Authorization: Bearer YOUR_SECRET" \
  -H "Content-Type: application/json"
```

## 🎨 主题定制

### 颜色配置

在 `src/app/globals.css` 中修改 CSS 变量：

```css
:root {
  --primary: 220 14.3% 95.9%;
  --primary-foreground: 220.9 39.3% 11%;
  /* 更多颜色变量... */
}
```

### 字体配置

项目使用等宽字体保持极客风格：

- 主字体：JetBrains Mono
- 代码字体：Fira Code

## 📊 性能优化

### API 动态加载模式

- 文章列表只加载元数据，提高首屏加载速度
- 单篇文章按需加载完整内容
- 客户端智能缓存，减少重复请求

### 图片优化

- 支持 WebP 和 AVIF 格式
- Next.js 自动图片优化
- Docker 环境通过 API 路由访问图片

### 代码分割

- 组件级别的懒加载
- 动态导入减少包体积
- 路由级别的代码分割

## 🔒 安全考虑

- 环境变量管理敏感信息
- API 路由访问控制
- Docker 容器权限最小化
- 内容安全策略 (CSP) 配置

## 🛠️ 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **内容**: Markdown + Gray Matter
- **代码高亮**: Prism.js
- **图标**: Lucide React
- **部署**: Docker + Docker Compose

## 📚 API 接口

### 文章 API

- `GET /api/posts` - 获取文章列表
- `GET /api/posts/[slug]` - 获取单篇文章

### 标签 API

- `GET /api/tags` - 获取标签列表
- `GET /api/tags/[tag]` - 获取特定标签的文章

### 页面 API

- `GET /api/pages/[slug]` - 获取页面内容

### 配置 API

- `GET /api/config` - 获取站点配置
- `POST /api/config/reload` - 重新加载配置

### 图片 API

- `GET /api/images/[...path]` - 动态图片服务

## 📄 许可证

本项目采用 Apache License 2.0 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 💬 支持

如果你喜欢这个项目，请给它一个 ⭐️！

**获取帮助：**
- 📖 [用户使用指南](docs/用户使用指南.md) - 详细使用说明和故障排查
- 📖 [User Guide (English)](docs/USER_GUIDE.md) - Complete documentation in English
- 🐛 [GitHub Issues](../../issues) - 报告问题或提出建议
- 💬 [Discussions](../../discussions) - 社区讨论和交流

---

**Tiny Blog** - 极简，却不简单。