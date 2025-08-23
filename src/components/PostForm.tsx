'use client';

import { useState, useEffect } from 'react';
import { MarkdownEditor } from './MarkdownEditor';

interface PostFormData {
  title: string;
  slug: string;
  content: string;
  date: string;
  tags: string[];
  description: string;
  cover: string;
  published: boolean;
}

interface PostFormProps {
  initialData?: Partial<PostFormData>;
  onSubmit: (data: PostFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  submitText?: string;
}

export function PostForm({
  initialData = {},
  onSubmit,
  onCancel,
  isLoading = false,
  submitText = '保存文章'
}: PostFormProps) {
  const [formData, setFormData] = useState<PostFormData>({
    title: initialData.title || '',
    slug: initialData.slug || '',
    content: initialData.content || '',
    date: initialData.date || new Date().toISOString().split('T')[0],
    tags: initialData.tags || [],
    description: initialData.description || '',
    cover: initialData.cover || '',
    published: initialData.published ?? true,
  });

  const [tagsInput, setTagsInput] = useState<string>(
    initialData.tags ? initialData.tags.join(', ') : ''
  );
  const [slugError, setSlugError] = useState<string>('');

  // 从标题自动生成slug
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 50);
  };

  // 标题变化时自动更新slug（如果slug为空或与标题匹配）
  useEffect(() => {
    if (formData.title && (!formData.slug || formData.slug === generateSlug(initialData.title || ''))) {
      const newSlug = generateSlug(formData.title);
      setFormData(prev => ({ ...prev, slug: newSlug }));
    }
  }, [formData.title, formData.slug, initialData.title]);

  // 处理标签输入
  const handleTagsChange = (value: string) => {
    setTagsInput(value);
    const tags = value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    setFormData(prev => ({ ...prev, tags }));
  };

  // 验证slug格式
  const validateSlug = (slug: string) => {
    if (!slug) {
      setSlugError('Slug不能为空');
      return false;
    }
    if (!/^[a-z0-9-]+$/.test(slug)) {
      setSlugError('Slug只能包含小写字母、数字和连字符');
      return false;
    }
    if (slug.startsWith('-') || slug.endsWith('-')) {
      setSlugError('Slug不能以连字符开头或结尾');
      return false;
    }
    setSlugError('');
    return true;
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSlug(formData.slug)) {
      return;
    }

    if (!formData.title.trim()) {
      alert('标题不能为空');
      return;
    }

    if (!formData.content.trim()) {
      alert('内容不能为空');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('提交失败:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 基本信息 */}
        <div className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
          <div className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-4">
            {'>'} 基本信息
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                文章标题 *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-mono text-sm focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                placeholder="输入文章标题"
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                URL Slug *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, slug: e.target.value }));
                  validateSlug(e.target.value);
                }}
                className={`w-full px-3 py-2 border rounded bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-mono text-sm focus:ring-2 focus:ring-neutral-500 focus:border-transparent ${
                  slugError 
                    ? 'border-red-500 dark:border-red-400' 
                    : 'border-neutral-300 dark:border-neutral-600'
                }`}
                placeholder="article-slug"
                disabled={isLoading}
              />
              {slugError && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">{slugError}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                发布日期
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-mono text-sm focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                标签（用逗号分隔）
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => handleTagsChange(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-mono text-sm focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                placeholder="React, TypeScript, Next.js"
                disabled={isLoading}
              />
              {formData.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              文章摘要
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-mono text-sm focus:ring-2 focus:ring-neutral-500 focus:border-transparent resize-none"
              placeholder="文章简短描述，用于SEO和摘要显示"
              disabled={isLoading}
            />
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              封面图片URL
            </label>
            <input
              type="url"
              value={formData.cover}
              onChange={(e) => setFormData(prev => ({ ...prev, cover: e.target.value }))}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-mono text-sm focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
              placeholder="/images/cover.jpg"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* 文章内容 */}
        <div className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
          <div className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-4">
            {'>'} 文章内容
          </div>
          <MarkdownEditor
            value={formData.content}
            onChange={(content) => setFormData(prev => ({ ...prev, content }))}
            height="h-96"
          />
        </div>

        {/* 发布设置和操作按钮 */}
        <div className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                  className="mr-2"
                  disabled={isLoading}
                />
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  立即发布
                </span>
              </label>
              {!formData.published && (
                <span className="inline-block bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs px-2 py-1 rounded">
                  草稿
                </span>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
                disabled={isLoading}
              >
                取消
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-sm bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900 rounded hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || !!slugError}
              >
                {isLoading ? '保存中...' : submitText}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}