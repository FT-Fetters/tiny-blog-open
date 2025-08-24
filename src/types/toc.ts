export interface TOCItem {
  id: string;
  text: string;
  level: number;
  children?: TOCItem[];
}

export interface TOCConfig {
  maxDepth?: number;
  smoothScroll?: boolean;
  offsetTop?: number;
  highlightStrategy?: 'intersection' | 'scroll';
  collapsible?: boolean;
}

export type TOCVariant = 'sidebar' | 'floating' | 'inline';

export interface TableOfContentsProps {
  headings: TOCItem[];
  activeId?: string;
  maxDepth?: number;
  className?: string;
  onItemClick?: (id: string) => void;
  variant?: TOCVariant;
  showProgress?: boolean;
  config?: TOCConfig;
}