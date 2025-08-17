export interface Post {
  slug: string;
  title: string;
  date: string;
  description?: string;
  content: string;
  tags: string[];
  cover?: string;
  excerpt?: string;
  readingTime?: number;
  published?: boolean;
}

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description?: string;
  tags: string[];
  cover?: string;
  excerpt?: string;
  readingTime?: number;
  published?: boolean;
}

export interface PostFrontmatter {
  title: string;
  date: string;
  description?: string;
  tags?: string[];
  cover?: string;
  published?: boolean;
}