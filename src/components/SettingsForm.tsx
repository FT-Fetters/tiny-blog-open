'use client';

import { useState, useEffect } from 'react';
import { SiteConfig, NavItem } from '@/types';

interface SettingsFormProps {
  initialConfig: SiteConfig | null;
  onSave: (config: SiteConfig) => Promise<void>;
  loading?: boolean;
}

interface FormErrors {
  [key: string]: string;
}

export function SettingsForm({ initialConfig, onSave, loading = false }: SettingsFormProps) {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // 初始化表单数据
  useEffect(() => {
    if (initialConfig) {
      setConfig({ ...initialConfig });
    }
  }, [initialConfig]);

  // 验证函数
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!config?.title?.trim()) {
      newErrors.title = '站点标题不能为空';
    }

    if (!config?.description?.trim()) {
      newErrors.description = '站点描述不能为空';
    }

    if (!config?.author?.name?.trim()) {
      newErrors.authorName = '作者姓名不能为空';
    }

    if (!config?.author?.email?.trim()) {
      newErrors.authorEmail = '作者邮箱不能为空';
    } else {
      // 支持邮箱和 mailto: 链接格式
      const email = config.author.email;
      const isMailtoFormat = email.startsWith('mailto:');
      const emailToValidate = isMailtoFormat ? email.substring(7) : email;
      
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailToValidate)) {
        newErrors.authorEmail = '邮箱格式不正确';
      }
    }

    if (!config?.url?.trim()) {
      newErrors.url = '站点URL不能为空';
    } else if (!/^https?:\/\/.+/.test(config.url)) {
      newErrors.url = 'URL格式不正确，需要包含http://或https://';
    }

    if (config?.postsPerPage && (config.postsPerPage < 1 || config.postsPerPage > 50)) {
      newErrors.postsPerPage = '每页文章数应在1-50之间';
    }

    if (config?.excerptLength && (config.excerptLength < 50 || config.excerptLength > 500)) {
      newErrors.excerptLength = '摘要长度应在50-500字符之间';
    }

    // 验证导航项
    config?.nav?.forEach((item, index) => {
      if (!item.name?.trim()) {
        newErrors[`nav_${index}_name`] = '导航项名称不能为空';
      }
      if (!item.href?.trim()) {
        newErrors[`nav_${index}_href`] = '导航项链接不能为空';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!config || !validateForm()) {
      return;
    }

    setSaving(true);
    try {
      await onSave(config);
    } catch (error) {
      console.error('保存配置失败:', error);
    } finally {
      setSaving(false);
    }
  };

  // 添加导航项
  const addNavItem = () => {
    if (!config) return;
    setConfig({
      ...config,
      nav: [...config.nav, { name: '', href: '' }]
    });
  };

  // 删除导航项
  const removeNavItem = (index: number) => {
    if (!config) return;
    const newNav = config.nav.filter((_, i) => i !== index);
    setConfig({ ...config, nav: newNav });
  };

  // 更新导航项
  const updateNavItem = (index: number, field: keyof NavItem, value: string) => {
    if (!config) return;
    const newNav = [...config.nav];
    newNav[index] = { ...newNav[index], [field]: value };
    setConfig({ ...config, nav: newNav });
  };

  // 如果还在加载配置
  if (loading || !config) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-neutral-300 dark:bg-neutral-600 rounded animate-pulse w-24"></div>
            <div className="h-10 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 基本设置 */}
      <div className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
        <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-4">
          {'>'} 基本设置
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              站点标题 *
            </label>
            <input
              type="text"
              value={config.title}
              onChange={(e) => setConfig({ ...config, title: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="输入站点标题"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              站点描述 *
            </label>
            <textarea
              value={config.description}
              onChange={(e) => setConfig({ ...config, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="输入站点描述"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              站点介绍
            </label>
            <textarea
              value={config.introduction}
              onChange={(e) => setConfig({ ...config, introduction: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="输入站点介绍（可选）"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              站点URL *
            </label>
            <input
              type="url"
              value={config.url}
              onChange={(e) => setConfig({ ...config, url: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://your-blog.com"
            />
            {errors.url && <p className="text-red-500 text-sm mt-1">{errors.url}</p>}
          </div>
        </div>
      </div>

      {/* 作者信息 */}
      <div className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
        <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-4">
          {'>'} 作者信息
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              姓名 *
            </label>
            <input
              type="text"
              value={config.author.name}
              onChange={(e) => setConfig({ 
                ...config, 
                author: { ...config.author, name: e.target.value }
              })}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="输入作者姓名"
            />
            {errors.authorName && <p className="text-red-500 text-sm mt-1">{errors.authorName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              邮箱 *
            </label>
            <input
              type="email"
              value={config.author.email}
              onChange={(e) => setConfig({ 
                ...config, 
                author: { ...config.author, email: e.target.value }
              })}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="author@example.com"
            />
            {errors.authorEmail && <p className="text-red-500 text-sm mt-1">{errors.authorEmail}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              GitHub 用户名
            </label>
            <input
              type="text"
              value={config.author.github || ''}
              onChange={(e) => setConfig({ 
                ...config, 
                author: { ...config.author, github: e.target.value }
              })}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="github-username"
            />
          </div>
        </div>
      </div>

      {/* 社交链接 */}
      <div className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
        <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-4">
          {'>'} 社交链接
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              GitHub
            </label>
            <input
              type="url"
              value={config.social.github || ''}
              onChange={(e) => setConfig({ 
                ...config, 
                social: { ...config.social, github: e.target.value }
              })}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://github.com/username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Twitter
            </label>
            <input
              type="url"
              value={config.social.twitter || ''}
              onChange={(e) => setConfig({ 
                ...config, 
                social: { ...config.social, twitter: e.target.value }
              })}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://twitter.com/username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={config.social.email || ''}
              onChange={(e) => setConfig({ 
                ...config, 
                social: { ...config.social, email: e.target.value }
              })}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="mailto:contact@example.com"
            />
          </div>
        </div>
      </div>

      {/* 导航管理 */}
      <div className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
            {'>'} 导航菜单
          </h3>
          <button
            type="button"
            onClick={addNavItem}
            className="px-3 py-1 bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900 rounded text-sm hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors font-mono"
          >
            [+ add]
          </button>
        </div>

        <div className="space-y-3">
          {config.nav.map((item, index) => (
            <div key={index} className="flex gap-3 items-start">
              <div className="flex-1">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateNavItem(index, 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="导航名称"
                />
                {errors[`nav_${index}_name`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`nav_${index}_name`]}</p>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={item.href}
                  onChange={(e) => updateNavItem(index, 'href', e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="/path 或 https://..."
                />
                {errors[`nav_${index}_href`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`nav_${index}_href`]}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeNavItem(index)}
                className="px-3 py-2 bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded text-sm hover:bg-red-200 dark:hover:bg-red-800 hover:text-red-600 dark:hover:text-red-300 transition-colors font-mono"
              >
                [del]
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 高级设置 */}
      <div className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between w-full text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-4 font-mono"
        >
          <span>{'>'} 高级设置</span>
          <span className="text-sm px-2 py-1 bg-neutral-200 dark:bg-neutral-700 rounded">
            {showAdvanced ? '[hide]' : '[show]'}
          </span>
        </button>

        {showAdvanced && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  每页文章数
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={config.postsPerPage}
                  onChange={(e) => setConfig({ 
                    ...config, 
                    postsPerPage: parseInt(e.target.value) || 6 
                  })}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.postsPerPage && <p className="text-red-500 text-sm mt-1">{errors.postsPerPage}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  摘要长度
                </label>
                <input
                  type="number"
                  min="50"
                  max="500"
                  value={config.excerptLength}
                  onChange={(e) => setConfig({ 
                    ...config, 
                    excerptLength: parseInt(e.target.value) || 200 
                  })}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.excerptLength && <p className="text-red-500 text-sm mt-1">{errors.excerptLength}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                主题色
              </label>
              <div className="flex gap-3 items-center">
                <input
                  type="color"
                  value={config.theme.primaryColor}
                  onChange={(e) => setConfig({ 
                    ...config, 
                    theme: { ...config.theme, primaryColor: e.target.value }
                  })}
                  className="w-12 h-10 border border-neutral-300 dark:border-neutral-600 rounded"
                />
                <input
                  type="text"
                  value={config.theme.primaryColor}
                  onChange={(e) => setConfig({ 
                    ...config, 
                    theme: { ...config.theme, primaryColor: e.target.value }
                  })}
                  className="flex-1 px-3 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="#3b82f6"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                安全入口密钥
              </label>
              <input
                type="text"
                value={config.secureEntrance || ''}
                onChange={(e) => setConfig({ 
                  ...config, 
                  secureEntrance: e.target.value 
                })}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="留空表示不使用安全入口"
              />
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                设置后，访问管理后台需要在URL中添加此密钥
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 保存按钮 */}
      <div className="flex justify-end gap-4">
        <button
          type="submit"
          disabled={saving || loading}
          className="px-8 py-3 bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900 rounded hover:bg-neutral-700 dark:hover:bg-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-mono text-sm"
        >
          {saving ? '[saving...]' : '[save config]'}
        </button>
      </div>
    </form>
  );
}