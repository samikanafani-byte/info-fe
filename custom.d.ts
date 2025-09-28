// Declaration file for CSS Modules and plain CSS imports
declare module "*.css" {
    // If you are using CSS Modules, you might expect a default export of a type
    // that maps class names to strings, e.g., const styles: Record<string, string>;
    // export default styles;

    // For a side-effect import (like your './tiptap-styles.css'),
    // where you just want to load the CSS globally, the simple module declaration below is enough
    // to tell TypeScript that importing a CSS file is valid.
    const content: any;
    export default content;
}