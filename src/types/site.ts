export interface SiteConfig {
  title: string;
  description: string;
  introduction: string;
  author: {
    name: string;
    email: string;
    github?: string;
  };
  url: string;
  social: {
    github?: string;
    twitter?: string;
    email?: string;
  };
  theme: {
    primaryColor: string;
  };
  nav: NavItem[];
  postsPerPage: number;
  excerptLength: number;
  secureEntrance?: string;
}

export interface NavItem {
  name: string;
  href: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}