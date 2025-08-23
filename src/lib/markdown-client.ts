/**
 * 客户端Markdown处理工具
 * 由于remark/rehype在客户端的限制，这里提供简化的预览功能
 */

// 简单的Markdown到HTML转换，用于客户端预览
export function markdownToHtml(markdown: string): Promise<string> {
  return new Promise((resolve) => {
    // 这里使用简化的Markdown处理逻辑
    // 在实际项目中，你可能需要引入客户端兼容的markdown库
    
    let html = markdown
      // 标题
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      
      // 粗体和斜体
      .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      
      // 链接
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline">$1</a>')
      
      // 代码块
      .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-neutral-100 dark:bg-neutral-800 p-4 rounded overflow-x-auto"><code>$2</code></pre>')
      
      // 行内代码
      .replace(/`([^`]+)`/g, '<code class="bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-sm">$1</code>')
      
      // 换行
      .replace(/\n/g, '<br>');

    // 段落处理
    const paragraphs = html.split('<br><br>');
    html = paragraphs.map(p => {
      if (p.trim() && !p.startsWith('<h') && !p.startsWith('<pre') && !p.startsWith('<ul') && !p.startsWith('<ol')) {
        return `<p class="mb-4">${p.replace(/<br>/g, ' ')}</p>`;
      }
      return p;
    }).join('\n\n');

    resolve(html);
  });
}