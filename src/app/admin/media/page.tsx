'use client';

import { ProtectedAdminPage } from '@/components/ProtectedAdminPage';
import { useState, useEffect, useRef } from 'react';

interface MediaFile {
  name: string;
  path: string;
  size: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminMedia() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/media', {
        credentials: 'include',
      });
      const data = await response.json();
      
      if (data.success) {
        setFiles(data.data);
      } else {
        console.error('获取文件列表失败:', data.error);
      }
    } catch (error) {
      console.error('获取文件列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/admin/media', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    return response.json();
  };

  const handleFileUpload = async (files: FileList) => {
    setUploading(true);
    const uploadPromises = Array.from(files).map(uploadFile);
    
    try {
      const results = await Promise.allSettled(uploadPromises);
      
      let successCount = 0;
      let errorCount = 0;
      
      results.forEach((result) => {
        if (result.status === 'fulfilled' && result.value.success) {
          successCount++;
        } else {
          errorCount++;
        }
      });

      if (successCount > 0) {
        await fetchFiles(); // 刷新文件列表
      }

      if (errorCount > 0) {
        alert(`上传完成：${successCount} 个成功，${errorCount} 个失败`);
      }
    } catch (error) {
      console.error('上传失败:', error);
      alert('上传失败');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (filename: string) => {
    if (!confirm(`确定要删除文件 "${filename}" 吗？`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/media/${filename}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();
      
      if (data.success) {
        setFiles(files.filter(file => file.name !== filename));
        setSelectedFiles(selectedFiles.filter(name => name !== filename));
      } else {
        alert('删除失败: ' + data.error);
      }
    } catch (error) {
      console.error('删除文件失败:', error);
      alert('删除失败');
    }
  };

  const handleBatchDelete = async () => {
    if (selectedFiles.length === 0) return;
    
    if (!confirm(`确定要删除 ${selectedFiles.length} 个文件吗？`)) {
      return;
    }

    try {
      const deletePromises = selectedFiles.map(filename =>
        fetch(`/api/admin/media/${filename}`, {
          method: 'DELETE',
          credentials: 'include',
        })
      );

      await Promise.all(deletePromises);
      setFiles(files.filter(file => !selectedFiles.includes(file.name)));
      setSelectedFiles([]);
    } catch (error) {
      console.error('批量删除失败:', error);
      alert('批量删除失败');
    }
  };

  const toggleFileSelection = (filename: string) => {
    setSelectedFiles(prev =>
      prev.includes(filename)
        ? prev.filter(name => name !== filename)
        : [...prev, filename]
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // 简单的提示，实际项目中可以使用toast组件
    const originalText = text;
    setTimeout(() => {
      alert('链接已复制到剪贴板');
    }, 100);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  return (
    <ProtectedAdminPage>
      <div className="max-w-7xl mx-auto">
        {/* 标题和上传区域 */}
        <div className="mb-6">
          <div className="text-2xl font-medium text-neutral-900 dark:text-neutral-100 mb-2">
            {'>'} Media Management
          </div>
          <div className="text-neutral-600 dark:text-neutral-400 text-sm">
            ──────────────────────────────────────────────
          </div>
        </div>

        {/* 上传区域 */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 mb-6 transition-colors ${
            dragOver
              ? 'border-neutral-400 bg-neutral-100 dark:bg-neutral-800'
              : 'border-neutral-300 dark:border-neutral-600'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="text-center">
            <div className="text-4xl mb-4">📁</div>
            <div className="text-neutral-900 dark:text-neutral-100 font-medium mb-2">
              拖拽文件到这里上传
            </div>
            <div className="text-neutral-600 dark:text-neutral-400 text-sm mb-4">
              支持 JPG, PNG, GIF, WebP, SVG 格式，单个文件最大 5MB
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900 px-4 py-2 rounded hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? '上传中...' : '选择文件'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files) {
                  handleFileUpload(e.target.files);
                }
              }}
            />
          </div>
        </div>

        {/* 批量操作 */}
        {selectedFiles.length > 0 && (
          <div className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                已选择 {selectedFiles.length} 个文件
              </span>
              <button
                onClick={handleBatchDelete}
                className="bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600 transition-colors"
              >
                删除选中
              </button>
            </div>
          </div>
        )}

        {/* 文件列表 */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded p-4">
                <div className="skeleton h-32 w-full mb-2 rounded"></div>
                <div className="skeleton h-4 w-full mb-1"></div>
                <div className="skeleton h-3 w-16"></div>
              </div>
            ))}
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🖼️</div>
            <div className="text-neutral-600 dark:text-neutral-400 mb-4">
              还没有上传任何媒体文件
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900 px-4 py-2 rounded hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
            >
              上传第一个文件
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map((file) => (
              <div
                key={file.name}
                className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded overflow-hidden hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectedFiles.includes(file.name)}
                    onChange={() => toggleFileSelection(file.name)}
                    className="absolute top-2 left-2 z-10"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={file.path}
                    alt={file.name}
                    className="w-full h-32 object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-3">
                  <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate mb-1">
                    {file.name}
                  </div>
                  <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">
                    {formatFileSize(file.size)}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => copyToClipboard(file.path)}
                      className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                    >
                      复制链接
                    </button>
                    <button
                      onClick={() => handleDelete(file.name)}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedAdminPage>
  );
}