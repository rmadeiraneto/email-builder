declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// Allow both dot and bracket notation for CSS modules
declare module '*.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
