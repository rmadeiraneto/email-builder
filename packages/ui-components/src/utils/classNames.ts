/**
 * Utility function to join class names, filtering out falsy values
 *
 * @param classes - Array of class names or falsy values
 * @returns Space-separated string of class names
 *
 * @example
 * classNames('base', isActive && 'active', undefined, 'final')
 * // Returns: 'base active final'
 */
export function classNames(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Converts a BEM-style class name to camelCase for CSS Modules
 *
 * @param str - String to convert
 * @returns camelCase string
 *
 * @example
 * bemToCamelCase('button--full-width') // 'buttonFullWidth'
 * bemToCamelCase('button__icon--right') // 'buttonIconRight'
 */
function bemToCamelCase(str: string): string {
  return str
    .replace(/--([a-z])/g, (_, letter) => letter.toUpperCase())
    .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
    .replace(/__([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Generates class names from a styles object with optional modifiers
 *
 * @param styles - SCSS modules styles object
 * @param baseClass - Base class name
 * @param modifiers - Object of modifier keys and their boolean values
 * @param customClasses - Additional custom class names
 * @returns Space-separated string of class names
 *
 * @example
 * getComponentClasses(
 *   styles,
 *   'button',
 *   { primary: true, disabled: false, 'full-width': true },
 *   'custom-class'
 * )
 * // Returns: 'button buttonPrimary buttonFullWidth custom-class'
 */
export function getComponentClasses(
  styles: Record<string, string | undefined>,
  baseClass: string,
  modifiers?: Record<string, boolean | string | undefined | null>,
  customClasses?: string | string[]
): string {
  const classes: (string | undefined)[] = [styles[baseClass]];

  // Add modifiers
  if (modifiers) {
    Object.entries(modifiers).forEach(([key, value]) => {
      if (value === true) {
        const modifierClass = bemToCamelCase(`${baseClass}--${key}`);
        classes.push(styles[modifierClass]);
      } else if (typeof value === 'string') {
        const modifierClass = bemToCamelCase(`${baseClass}--${value}`);
        classes.push(styles[modifierClass]);
      }
    });
  }

  // Add custom classes
  if (customClasses) {
    if (Array.isArray(customClasses)) {
      classes.push(...customClasses);
    } else {
      classes.push(customClasses);
    }
  }

  return classNames(...classes);
}
