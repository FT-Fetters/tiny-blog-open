'use client';

import { useState, useEffect, useRef } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  html: string;
}

export function CodeBlock({ html }: CodeBlockProps) {
  const codeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!codeRef.current) return;

    // 等待一个微任务周期，确保 DOM 已经更新
    const timeoutId = setTimeout(() => {
      const codeBlocks = codeRef.current?.querySelectorAll('pre[class*="language-"]');
      
      if (!codeBlocks) return;

      codeBlocks.forEach((block) => {
        // 类型断言为 HTMLElement
        const htmlBlock = block as HTMLElement;
        
        // 检查是否已经有复制按钮
        if (htmlBlock.querySelector('.copy-code-btn')) return;

        // 获取代码内容
        const codeElement = htmlBlock.querySelector('code');
        if (!codeElement) return;

        // 提取语言信息
        const className = htmlBlock.className;
        const languageMatch = className.match(/language-(\w+)/);
        const language = languageMatch ? languageMatch[1] : 'code';
        
        // 语言名称映射
        const languageNames: Record<string, string> = {
          'typescript': 'TypeScript',
          'ts': 'TypeScript',
          'javascript': 'JavaScript',
          'js': 'JavaScript',
          'python': 'Python',
          'py': 'Python',
          'json': 'JSON',
          'bash': 'Bash',
          'shell': 'Shell',
          'css': 'CSS',
          'html': 'HTML',
          'react': 'React',
          'jsx': 'JSX',
          'tsx': 'TSX',
          'vue': 'Vue',
          'go': 'Go',
          'rust': 'Rust',
          'java': 'Java',
          'php': 'PHP',
          'sql': 'SQL',
          'yaml': 'YAML',
          'xml': 'XML',
          'markdown': 'Markdown',
          'md': 'Markdown'
        };

        // 添加行号功能
        // 计算代码行数 - 更准确的计算方式
        const codeText = codeElement.textContent || '';
        const lines = codeText.split('\n');
        // 移除最后的空行
        let lineCount = lines.length;
        if (lines[lines.length - 1] === '') {
          lineCount--;
        }
        
        if (lineCount > 1) {
          // 创建行号容器 - 添加到pre元素而不是code元素
          const lineNumbersContainer = document.createElement('div');
          lineNumbersContainer.className = 'line-numbers-container';
          
          // 为每一行创建行号
          for (let i = 1; i <= lineCount; i++) {
            const lineNumber = document.createElement('span');
            lineNumber.className = 'line-number';
            lineNumber.textContent = i.toString();
            lineNumbersContainer.appendChild(lineNumber);
          }
          
          // 添加行号容器到pre元素
          htmlBlock.appendChild(lineNumbersContainer);
          htmlBlock.classList.add('has-line-numbers');
        }
        
        // 创建语言标签
        const languageLabel = document.createElement('div');
        languageLabel.className = 'language-label';
        languageLabel.textContent = languageNames[language] || language.toUpperCase();

        // 创建复制按钮
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-code-btn absolute flex items-center gap-1 px-2 py-1 text-xs rounded transition-all duration-200 opacity-0 hover:opacity-100 z-20';
        copyButton.innerHTML = `
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
          </svg>
          <span>Copy</span>
        `;

        // 添加复制功能
        copyButton.addEventListener('click', async () => {
          const text = codeElement.textContent || '';
          
          try {
            await navigator.clipboard.writeText(text);
            
            // 更新按钮状态
            copyButton.innerHTML = `
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Copied!</span>
            `;
            copyButton.classList.add('copied');
            
            // 3秒后恢复
            setTimeout(() => {
              copyButton.innerHTML = `
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
                <span>Copy</span>
              `;
              copyButton.classList.remove('copied');
            }, 3000);
          } catch (err) {
            console.error('复制失败:', err);
          }
        });

        // 添加按钮和标签到代码块
        htmlBlock.style.position = 'relative';
        htmlBlock.appendChild(languageLabel);
        htmlBlock.appendChild(copyButton);

        // 添加悬停显示效果
        htmlBlock.addEventListener('mouseenter', () => {
          copyButton.style.opacity = '1';
        });

        htmlBlock.addEventListener('mouseleave', () => {
          copyButton.style.opacity = '0';
        });
      });
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [html]);

  return (
    <div 
      ref={codeRef}
      dangerouslySetInnerHTML={{ __html: html }}
      className="code-block-container"
    />
  );
}