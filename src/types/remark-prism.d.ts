declare module 'remark-prism' {
  import { Plugin } from 'unified';
  
  interface RemarkPrismOptions {
    transformInlineCode?: boolean;
    plugins?: string[];
  }
  
  const remarkPrism: Plugin<[RemarkPrismOptions?]>;
  export default remarkPrism;
}