/// <reference types="vite/client" />

// CSS Modules type declarations
// Using Record type to avoid index signature restrictions with noPropertyAccessFromIndexSignature
type CSSModuleClasses = Record<string, string>;

declare module '*.module.css' {
  const classes: CSSModuleClasses;
  export default classes;
}

declare module '*.module.scss' {
  const classes: CSSModuleClasses;
  export default classes;
}

declare module '*.module.sass' {
  const classes: CSSModuleClasses;
  export default classes;
}

declare module '*.module.less' {
  const classes: CSSModuleClasses;
  export default classes;
}

declare module '*.module.styl' {
  const classes: CSSModuleClasses;
  export default classes;
}
