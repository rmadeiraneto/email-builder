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
export function bemToCamelCase(str: string): string {
  return str
    .replace(/--([a-z])/g, (_, letter) => letter.toUpperCase())
    .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
    .replace(/__([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Gets a class name from a CSS modules styles object, automatically converting
 * BEM-style class names to camelCase
 *
 * @param styles - CSS modules styles object
 * @param className - BEM-style class name (e.g., 'modal--open', 'modal__dialog')
 * @returns The corresponding class name from the styles object
 *
 * @example
 * getStyleClass(styles, 'modal') // styles.modal
 * getStyleClass(styles, 'modal--open') // styles.modalOpen
 * getStyleClass(styles, 'modal__dialog') // styles.modalDialog
 */
export function getStyleClass(
  styles: Record<string, string | undefined>,
  className: string
): string | undefined {
  const camelCased = bemToCamelCase(className);
  return styles[camelCased];
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

/**
 * BEM helper function type with overloads for different usage patterns
 */
export interface BEMHelper {
  /** Get the base block class */
  (): string | undefined;
  /** Get a modifier class (block--modifier) */
  (modifier: string): string | undefined;
  /** Get an element with modifier class (block__element--modifier) */
  (element: string, modifier: string): string | undefined;
  /** Explicitly get a modifier class (block--modifier) */
  mod: (modifier: string) => string | undefined;
  /** Get an element class (block__element) or element with modifier (block__element--modifier) */
  elem: (element: string, modifier?: string) => string | undefined;
}

/**
 * Creates a BEM helper function scoped to a specific block and styles object.
 * This provides a more intuitive API for working with BEM class names in components.
 *
 * @param styles - CSS modules styles object
 * @param block - The BEM block name (e.g., 'modal', 'button')
 * @returns A BEM helper function with additional utility methods
 *
 * @example
 * const bem = createBEM(styles, 'modal');
 *
 * // Get block class
 * bem() // → styles.modal
 *
 * // Get modifier class (default behavior with one arg)
 * bem('open') // → styles.modalOpen (modal--open)
 *
 * // Get element with modifier
 * bem('dialog', 'large') // → styles.modalDialogLarge (modal__dialog--large)
 *
 * // Explicitly get element (recommended for clarity)
 * bem.elem('dialog') // → styles.modalDialog (modal__dialog)
 * bem.elem('header', 'sticky') // → styles.modalHeaderSticky (modal__header--sticky)
 *
 * // Explicitly get modifier (though bem('open') works too)
 * bem.mod('open') // → styles.modalOpen (modal--open)
 */
export function createBEM(
  styles: Record<string, string | undefined>,
  block: string
): BEMHelper {
  function bem(arg1?: string, arg2?: string): string | undefined {
    if (!arg1) {
      // Just block: bem()
      return getStyleClass(styles, block);
    }

    if (arg2) {
      // Element with modifier: bem('dialog', 'large')
      return getStyleClass(styles, `${block}__${arg1}--${arg2}`);
    }

    // Single argument - assume it's a modifier by default
    // Users can use bem.elem() for explicit element access
    return getStyleClass(styles, `${block}--${arg1}`);
  }

  // Explicit helper method for modifiers
  bem.mod = (modifier: string) => {
    return getStyleClass(styles, `${block}--${modifier}`);
  };

  // Explicit helper method for elements
  bem.elem = (element: string, modifier?: string) => {
    if (modifier) {
      return getStyleClass(styles, `${block}__${element}--${modifier}`);
    }
    return getStyleClass(styles, `${block}__${element}`);
  };

  return bem as BEMHelper;
}
