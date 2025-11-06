/**
 * Prop utility functions for component prop handling
 */

/**
 * Merges default props with provided props
 *
 * @param defaults - Default prop values
 * @param props - Provided prop values
 * @returns Merged props object
 *
 * @example
 * const merged = mergeProps(
 *   { variant: 'primary', size: 'medium' },
 *   { variant: 'secondary' }
 * )
 * // Returns: { variant: 'secondary', size: 'medium' }
 */
export function mergeProps<T extends Record<string, any>>(
  defaults: Partial<T>,
  props: Partial<T>
): T {
  return { ...defaults, ...props } as T;
}

/**
 * Picks only defined values from an object
 * Useful for filtering out undefined props before passing to components
 *
 * @param obj - Source object
 * @returns Object with only defined values
 *
 * @example
 * pickDefined({ a: 1, b: undefined, c: null, d: 'value' })
 * // Returns: { a: 1, c: null, d: 'value' }
 */
export function pickDefined<T extends Record<string, any>>(obj: T): Partial<T> {
  const result: Partial<T> = {};

  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined) {
      result[key as keyof T] = value;
    }
  });

  return result;
}

/**
 * Filters event handler props from a props object
 *
 * @param props - Props object
 * @returns Object containing only event handlers (keys starting with 'on')
 */
export function pickEventHandlers<T extends Record<string, any>>(props: T): Partial<T> {
  const handlers: Partial<T> = {};

  Object.entries(props).forEach(([key, value]) => {
    if (key.startsWith('on') && typeof value === 'function') {
      handlers[key as keyof T] = value;
    }
  });

  return handlers;
}

/**
 * Omits event handler props from a props object
 *
 * @param props - Props object
 * @returns Object without event handlers
 */
export function omitEventHandlers<T extends Record<string, any>>(props: T): Partial<T> {
  const nonHandlers: Partial<T> = {};

  Object.entries(props).forEach(([key, value]) => {
    if (!(key.startsWith('on') && typeof value === 'function')) {
      nonHandlers[key as keyof T] = value;
    }
  });

  return nonHandlers;
}
