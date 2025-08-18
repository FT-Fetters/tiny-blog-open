# Tiny Blog 页面设计规范

> **Version**: 1.0  
> **Last Updated**: 2024-08-18  
> **Target Audience**: 设计师、前端开发者、产品经理

## 📋 目录

- [设计原则](#设计原则)
- [视觉风格](#视觉风格)
- [字体系统](#字体系统)
- [颜色系统](#颜色系统)
- [布局规范](#布局规范)
- [组件设计](#组件设计)
- [交互规范](#交互规范)
- [响应式设计](#响应式设计)
- [深色模式](#深色模式)
- [动画效果](#动画效果)
- [代码规范](#代码规范)

---

## 🎯 设计原则

### 核心理念
Tiny Blog 致力于打造一个**极简、极客风格**的博客系统，强调内容的可读性和技术的专业感。

### 设计原则
1. **极简主义** - 去除多余装饰，专注内容展示
2. **技术导向** - 使用等宽字体，营造编程环境的氛围
3. **功能至上** - 每个元素都有明确的功能性目的
4. **一致性** - 保持设计语言的统一性和连贯性
5. **可访问性** - 确保良好的对比度和用户体验

---

## 🎨 视觉风格

### 设计语言
- **风格定位**: 极简极客风、专业技术博客
- **目标用户**: 技术从业者、程序员、技术爱好者
- **情感表达**: 专业、简洁、高效、现代

### 视觉特征
- 大量留白，营造呼吸感
- 锐利的边缘和清晰的分界线
- 细腻的阴影和细微的层次感
- 统一的等宽字体家族

---

## 📝 字体系统

### 字体配置
```css
--font-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'SF Mono', Monaco, 'Inconsolata', 'Roboto Mono', 'Source Code Pro', 'Ubuntu Mono', monospace;
```

### 字体层级

#### 标题字体
- **H1**: `text-3xl` (30px), `font-medium`, `line-height: 1.2`
- **H2**: `text-2xl` (24px), `font-medium`, `line-height: 1.3`  
- **H3**: `text-xl` (20px), `font-medium`, `line-height: 1.4`
- **H4-H6**: 根据语义递减，保持等宽字体

#### 正文字体
- **正文**: `font-size: 16px`, `line-height: 1.65`, `letter-spacing: 0.02em`
- **小字**: `text-sm` (14px), `line-height: 1.6`
- **说明文字**: `text-xs` (12px), `line-height: 1.5`

#### 代码字体
- **行内代码**: `JetBrains Mono`, `text-sm`, 背景色区分
- **代码块**: `JetBrains Mono`, `text-sm`, Mac风格容器

### 字体使用规范
1. **全站统一使用等宽字体**，营造技术氛围
2. **字重控制**: 标题使用 `font-medium`，正文使用 `font-normal`
3. **字间距优化**: 标题 `letter-spacing: -0.01em`，正文 `letter-spacing: 0.02em`

---

## 🎨 颜色系统

### 基础色板

#### 浅色主题
```css
/* 中性色 - 主色调 */
--neutral-50: #fafafa    /* 背景色 */
--neutral-100: #f5f5f5   /* 卡片、代码背景 */
--neutral-200: #e5e5e5   /* 边框、分割线 */
--neutral-300: #d4d4d4   /* 次要边框 */
--neutral-400: #a3a3a3   /* 占位文字 */
--neutral-500: #737373   /* 辅助文字 */
--neutral-600: #525252   /* 次要文字 */
--neutral-700: #404040   /* 主要文字 */
--neutral-800: #262626   /* 重要文字 */
--neutral-900: #171717   /* 标题、强调 */
```

#### 深色主题
```css
/* 深色模式对应色值 */
--neutral-900: #0a0a0a   /* 深色背景 */
--neutral-800: #1a1a1a   /* 深色卡片背景 */
--neutral-700: #2a2a2a   /* 深色边框 */
--neutral-400: #a3a3a3   /* 深色主要文字 */
--neutral-100: #fafafa   /* 深色标题 */
```

#### 功能色
```css
/* 强调色 - 可配置 */
--primary-500: #3b82f6   /* 主强调色，支持配置 */

/* 语义色 */
--success: #10b981      /* 成功状态 */
--warning: #f59e0b      /* 警告状态 */
--error: #ef4444        /* 错误状态 */
--info: #3b82f6         /* 信息状态 */
```

#### 代码高亮色
```css
/* 浅色主题代码高亮 */
--code-comment: #6b7280     /* 注释 */
--code-string: #059669      /* 字符串 */
--code-keyword: #9333ea     /* 关键字 */
--code-function: #dc2626    /* 函数 */
--code-number: #2563eb      /* 数字 */

/* 深色主题代码高亮 */
--code-comment-dark: #6b7280
--code-string-dark: #34d399
--code-keyword-dark: #a78bfa
--code-function-dark: #f87171
--code-number-dark: #60a5fa
```

### 颜色使用规范

#### 文本颜色优先级
1. **标题**: `neutral-900` (浅色) / `neutral-100` (深色)
2. **正文**: `neutral-700` (浅色) / `neutral-400` (深色)  
3. **辅助文字**: `neutral-500` (浅色) / `neutral-500` (深色)
4. **链接**: 继承文字色，hover时变为 `neutral-600`

#### 背景颜色层级
1. **页面背景**: `neutral-50` (浅色) / `neutral-900` (深色)
2. **卡片背景**: `white` (浅色) / `neutral-900` (深色)
3. **代码块背景**: `neutral-50` (浅色) / `neutral-800` (深色)

---

## 📐 布局规范

### 栅格系统
```css
/* 内容容器 */
.content-wrapper {
  max-width: 1024px;        /* 4xl = 1024px */
  margin: 0 auto;
  padding: 0 1.5rem;        /* 24px */
}

/* 响应式内边距 */
@media (min-width: 640px) {  /* sm */
  padding: 0 2rem;          /* 32px */
}

@media (min-width: 1024px) { /* lg */
  padding: 0 3rem;          /* 48px */
}
```

### 间距系统
遵循 8px 基准的间距规范：

```css
/* Tailwind间距对照 */
--space-1: 0.25rem    /* 4px */
--space-2: 0.5rem     /* 8px */
--space-3: 0.75rem    /* 12px */
--space-4: 1rem       /* 16px */
--space-6: 1.5rem     /* 24px */
--space-8: 2rem       /* 32px */
--space-10: 2.5rem    /* 40px */
--space-12: 3rem      /* 48px */
--space-16: 4rem      /* 64px */
--space-20: 5rem      /* 80px */
```

#### 垂直间距规范
- **组件间距**: `mb-6` (24px) 至 `mb-8` (32px)
- **段落间距**: `mb-6` (24px)
- **标题间距**: `mt-8 mb-6` (上32px, 下24px)
- **列表间距**: `mb-6` (24px)

#### 水平间距规范
- **内容内边距**: `px-6` (24px) 至 `px-8` (32px)
- **按钮内边距**: `px-6 py-2` (水平24px, 垂直8px)
- **导航间距**: `space-x-8` (32px)

---

## 🧩 组件设计

### 卡片组件 (Card)

#### 设计规格
```css
.card {
  background: white;
  border: 1px solid rgb(229, 229, 229);  /* neutral-200 */
  border-radius: 0.5rem;                 /* 8px */
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
}

.card:hover {
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.2s ease-in-out;
}
```

#### 使用规范
- **内边距**: `p-6` (24px) 至 `p-8` (32px)
- **圆角**: `rounded-lg` (8px)
- **阴影**: 轻微阴影，hover时加深
- **边框**: 细边框 (`border-neutral-200`)

### 按钮组件 (Button)

#### 按钮类型

**主要按钮 (Primary)**
```css
.btn-primary {
  background: rgb(23, 23, 23);           /* neutral-900 */
  color: rgb(250, 250, 250);             /* neutral-50 */
  height: 2.75rem;                       /* 44px */
  padding: 0.5rem 1.5rem;               /* 8px 24px */
  border-radius: 0.375rem;              /* 6px */
  font-weight: 500;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}
```

**次要按钮 (Secondary)**
```css
.btn-secondary {
  background: transparent;
  color: rgb(23, 23, 23);               /* neutral-900 */
  border: 1px solid rgb(212, 212, 212); /* neutral-300 */
  height: 2.75rem;                      /* 44px */
  padding: 0.5rem 1.5rem;              /* 8px 24px */
}
```

**幽灵按钮 (Ghost)**  
```css
.btn-ghost {
  background: transparent;
  color: rgb(64, 64, 64);               /* neutral-700 */
  height: 2.75rem;                      /* 44px */
  padding: 0.5rem 1rem;                /* 8px 16px */
}
```

#### 按钮状态
- **Normal**: 基础样式
- **Hover**: 背景色加深，无下划线
- **Active**: 轻微缩放或颜色变化
- **Disabled**: `opacity: 0.5`, `pointer-events: none`

### 导航组件 (Navigation)

#### Header规格
```css
.header {
  height: 5rem;                         /* 80px */
  background: rgba(255, 255, 255, 0.8); 
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgb(229, 229, 229);
}
```

#### 导航链接规格
- **字体大小**: `text-sm` (14px)
- **字重**: `font-medium`
- **间距**: `space-x-8` (32px)
- **状态**: 当前页高亮，其他页面较淡

### 文章卡片 (Post Card)

#### 设计结构
1. **封面图片区域** (可选)
   - 宽度: `w-64` (256px) 桌面端
   - 高度: `h-48` (192px) 
   - 圆角: 继承父容器

2. **内容区域**
   - 内边距: `p-6` (24px) 至 `p-8` (32px)
   - 标题: `text-xl font-semibold mb-3`
   - 摘要: `line-clamp-2`，最多2行

3. **元信息区域**  
   - 位置: 底部，带分割线
   - 信息: 发布日期、阅读时间
   - 图标: Lucide React icons

---

## ⚡ 交互规范

### 悬浮效果 (Hover States)

#### 链接悬浮
```css
a {
  color: rgb(23, 23, 23);               /* neutral-900 */
  background-image: linear-gradient(to right, currentColor, currentColor);
  background-size: 0% 1px;
  background-position: bottom left;
  background-repeat: no-repeat;
  transition: all 0.2s ease-in-out;
}

a:hover {
  color: rgb(82, 82, 82);               /* neutral-600 */
  background-size: 100% 1px;
}
```

#### 卡片悬浮
- 阴影: 从 `0 1px 3px 0 rgba(0, 0, 0, 0.05)` 到 `0 4px 12px 0 rgba(0, 0, 0, 0.08)`
- 过渡: `transition-all duration-200`
- 无其他变形或缩放

#### 按钮悬浮
- 背景色稍微加深
- 文字颜色保持不变
- 添加细微阴影效果

### 焦点状态 (Focus States)
```css
.focus-ring {
  focus:outline-none;
  focus:ring-2;
  focus:ring-neutral-900;
  focus:ring-offset-2;
}
```

### 过渡动画
- **标准过渡**: `transition-all duration-200 ease-in-out`
- **平滑过渡**: `transition-smooth` (0.3s cubic-bezier)
- **弹跳过渡**: `transition-bounce` (0.4s bounce easing)

---

## 📱 响应式设计

### 断点系统
遵循 Tailwind CSS 的断点规范：

```css
/* 移动端优先 */
/* xs: 0px - 默认 */
/* sm: 640px */
/* md: 768px */  
/* lg: 1024px */
/* xl: 1280px */
/* 2xl: 1536px */
```

### 响应式规则

#### 布局适配
- **移动端**: 单栏布局，全宽内容
- **平板端**: 适当增加内边距和间距
- **桌面端**: 多栏布局，固定最大宽度

#### 导航适配  
- **移动端**: 汉堡菜单，侧滑抽屉
- **桌面端**: 水平导航条

#### 文章卡片适配
- **移动端**: 垂直堆叠，图片全宽
- **桌面端**: 水平布局，图片固定宽度

### 移动端优化
- 触摸目标最小 44px × 44px
- 避免过小的点击区域
- 合理的滑动和手势支持

---

## 🌙 深色模式

### 实现方式
使用 Tailwind 的 `dark:` 前缀和 CSS 类切换：

```css
/* 根元素类切换 */
.dark body {
  background: rgb(10, 10, 10);          /* neutral-900 */
  color: rgb(250, 250, 250);            /* neutral-100 */
}
```

### 颜色映射
| 浅色主题 | 深色主题 | 用途 |
|---------|---------|------|
| `neutral-50` | `neutral-900` | 页面背景 |
| `white` | `neutral-900` | 卡片背景 |
| `neutral-100` | `neutral-800` | 代码背景 |
| `neutral-200` | `neutral-800` | 边框 |
| `neutral-900` | `neutral-100` | 标题文字 |
| `neutral-700` | `neutral-400` | 正文文字 |

### 特殊处理
- **代码高亮**: 专门的深色主题色彩
- **按钮样式**: 反色处理
- **阴影效果**: 适当调整透明度

---

## 🎬 动画效果

### 加载动画

#### Shimmer 效果
```css
@keyframes shimmer {
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}

.shimmer {
  background: linear-gradient(90deg, 
    rgba(245, 245, 245, 0.6) 25%,
    rgba(232, 232, 232, 0.8) 50%,
    rgba(245, 245, 245, 0.6) 75%
  );
  background-size: 200px 100%;
  animation: shimmer 2.5s infinite ease-in-out;
}
```

#### 骨架屏动画
```css
.skeleton {
  background: rgb(229, 229, 229);       /* neutral-200 */
  border-radius: 0.25rem;               /* 4px */
  animation: pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

### 进入动画

#### 渐入效果
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}
```

#### 交错动画
```css
.stagger-children > *:nth-child(1) { animation-delay: 0.1s; }
.stagger-children > *:nth-child(2) { animation-delay: 0.2s; }
.stagger-children > *:nth-child(3) { animation-delay: 0.3s; }
/* ... 递增延迟 */
```

### Cross-fade 过渡
用于加载状态到内容的平滑切换：

```css
.cross-fade-out {
  animation: crossFadeOut 0.4s ease-out forwards;
}

.cross-fade-in {
  animation: crossFadeIn 0.4s ease-out forwards;
  opacity: 0;
}
```

### 动画使用原则
1. **性能优先**: 优先使用 `transform` 和 `opacity`
2. **时长控制**: 大部分动画在 0.2s - 0.6s 之间
3. **缓动函数**: 使用合适的 cubic-bezier 曲线
4. **减少干扰**: 避免过度动画影响阅读

---

## 💻 代码规范

### Mac 风格代码块

#### 设计特点
1. **Mac 标题栏**: 带三个彩色圆形按钮
2. **语言标签**: 右上角显示编程语言
3. **行号支持**: 左侧显示行号（可选）
4. **语法高亮**: Prism.js 驱动的代码高亮

#### 实现规格
```css
.prose pre[class*="language-"] {
  background: rgb(250, 250, 250);       /* neutral-50 */
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  padding-top: 2.5rem;                  /* 为标题栏留空间 */
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Mac 标题栏 */
.prose pre[class*="language-"]::before {
  content: '';
  position: absolute;
  top: 0;
  height: 2.5rem;
  background: rgba(0, 0, 0, 0.03);
  border-radius: 8px 8px 0 0;
}

/* Mac 三色按钮 */
.prose pre[class*="language-"]::after {
  content: '';
  position: absolute;
  top: 0.75rem;
  left: 1rem;
  width: 12px;
  height: 12px;
  background: #ff5f57;                  /* 红色按钮 */
  border-radius: 50%;
  box-shadow: 
    18px 0 0 #ffbd2e,                   /* 黄色按钮 */
    36px 0 0 #28ca42;                   /* 绿色按钮 */
}
```

### 代码高亮方案

#### 语法高亮色彩 (浅色主题)
- **注释**: `text-neutral-500`, 斜体
- **字符串**: `text-green-700`  
- **关键字**: `text-purple-600`
- **函数**: `text-red-600`
- **数字**: `text-blue-600`

#### 语法高亮色彩 (深色主题)
- **注释**: `text-neutral-500`
- **字符串**: `text-green-400`
- **关键字**: `text-purple-400`  
- **函数**: `text-red-400`
- **数字**: `text-blue-400`

### 行内代码
```css
.prose :not(pre) > code {
  background: rgb(245, 245, 245);       /* neutral-100 */
  color: rgb(38, 38, 38);               /* neutral-800 */
  padding: 0.125rem 0.375rem;           /* 2px 6px */
  border-radius: 0.25rem;               /* 4px */
  font-size: 0.875rem;                 /* 14px */
  border: 1px solid rgba(0, 0, 0, 0.05);
}
```

---

## 📖 使用指南

### 设计师指南
1. **设计工具**: 推荐使用 Figma，配置等宽字体
2. **组件库**: 建立基于本规范的设计系统
3. **颜色工具**: 使用 Tailwind 颜色库进行精确匹配
4. **原型制作**: 注意动画效果和交互细节

### 开发者指南
1. **CSS框架**: 基于 Tailwind CSS 实现
2. **组件开发**: 遵循 React + TypeScript 规范
3. **样式组织**: 使用 CSS-in-JS 或 Tailwind classes
4. **性能优化**: 注意动画性能和资源加载

### 内容创作指南
1. **图片规格**: 推荐 16:9 比例，WebP 格式
2. **文章封面**: 宽度 >= 640px，适配响应式
3. **代码示例**: 使用支持的语言标识符
4. **排版建议**: 保持段落长度适中，合理使用标题层级

---

**© 2025 Tiny Blog Design System**  
*本文档将持续更新，以保持设计系统的一致性和现代性。*