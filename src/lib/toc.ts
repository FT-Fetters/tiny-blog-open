import { TOCItem } from '@/types/toc';

/**
 * 生成标题的锚点ID
 */
export function generateHeadingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\s]+/g, '-')
    .replace(/[^\w\u4e00-\u9fa5\-]/g, '') // 保留中文字符
    .replace(/^-+|-+$/g, '');
}

/**
 * 从HTML内容中提取标题
 */
export function extractHeadings(html: string): TOCItem[] {
  if (!html) return [];

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const headingElements = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
  
  const headings: TOCItem[] = [];
  
  Array.from(headingElements).forEach((element) => {
    const text = element.textContent || '';
    const level = parseInt(element.tagName[1]);
    
    // 跳过空标题
    if (!text.trim()) return;
    
    // 如果元素没有ID，生成一个
    let id = element.id;
    if (!id) {
      id = generateHeadingId(text);
    }
    
    headings.push({
      id,
      text: text.trim(),
      level,
    });
  });
  
  return headings;
}

/**
 * 构建标题树形结构
 */
export function buildHeadingTree(headings: TOCItem[]): TOCItem[] {
  const tree: TOCItem[] = [];
  const stack: TOCItem[] = [];
  
  headings.forEach((heading) => {
    const item = { ...heading, children: [] };
    
    // 找到合适的父级
    while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
      stack.pop();
    }
    
    if (stack.length === 0) {
      // 顶级标题
      tree.push(item);
    } else {
      // 子标题
      const parent = stack[stack.length - 1];
      if (!parent.children) parent.children = [];
      parent.children.push(item);
    }
    
    stack.push(item);
  });
  
  return tree;
}

/**
 * 平滑滚动到指定标题
 */
export function scrollToHeading(id: string, offsetTop: number = 80): void {
  const element = document.getElementById(id);
  if (!element) return;
  
  const y = element.getBoundingClientRect().top + window.pageYOffset - offsetTop;
  
  window.scrollTo({
    top: y,
    behavior: 'smooth'
  });
}

/**
 * 获取当前阅读进度百分比
 */
export function getReadingProgress(): number {
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const scrollTop = window.scrollY;
  
  const totalScrollableHeight = documentHeight - windowHeight;
  const progress = (scrollTop / totalScrollableHeight) * 100;
  
  return Math.min(100, Math.max(0, progress));
}

/**
 * 为HTML内容添加标题锚点ID
 */
export function addHeadingIds(html: string): string {
  if (!html) return '';
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
  
  headings.forEach((heading) => {
    if (!heading.id) {
      const text = heading.textContent || '';
      heading.id = generateHeadingId(text);
    }
  });
  
  // 获取body内的HTML（避免返回完整的文档结构）
  return doc.body.innerHTML;
}