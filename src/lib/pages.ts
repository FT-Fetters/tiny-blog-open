import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { markdownToHtml } from './posts';

const pagesDirectory = path.join(process.cwd(), 'content/pages');

export interface PageContent {
  content: string;
  htmlContent: string;
}

export async function getPageContent(pageName: string): Promise<PageContent | null> {
  try {
    const fullPath = path.join(pagesDirectory, `${pageName}.md`);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { content } = matter(fileContents);
    
    const htmlContent = await markdownToHtml(content);

    return {
      content,
      htmlContent,
    };
  } catch (error) {
    console.error(`Error reading page ${pageName}:`, error);
    return null;
  }
}