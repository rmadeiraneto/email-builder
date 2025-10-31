/**
 * Component factory utilities
 *
 * Helper functions for component creation
 */

import type { CSSValue, Spacing, ResponsiveVisibility } from '../../types';

/**
 * Generates a unique component ID
 *
 * @param prefix - Component type prefix
 * @returns Unique component ID
 */
export function generateId(prefix: string): string {
  const timestamp = Date.now();
  // Use crypto.randomUUID for cryptographically secure random IDs
  const random = crypto.randomUUID().slice(0, 9);
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Creates a CSS value
 *
 * @param value - Numeric value or 'auto'
 * @param unit - CSS unit
 * @returns CSS value object
 */
export function createCSSValue(value: number | 'auto', unit: CSSValue['unit'] = 'px'): CSSValue {
  return { value, unit };
}

/**
 * Creates default spacing (all sides 0px)
 *
 * @returns Default spacing
 */
export function createDefaultSpacing(): Spacing {
  return {
    top: createCSSValue(0),
    right: createCSSValue(0),
    bottom: createCSSValue(0),
    left: createCSSValue(0),
  };
}

/**
 * Creates spacing with uniform values
 *
 * @param value - Value for all sides
 * @param unit - CSS unit
 * @returns Uniform spacing
 */
export function createUniformSpacing(value: number, unit: CSSValue['unit'] = 'px'): Spacing {
  const cssValue = createCSSValue(value, unit);
  return {
    top: cssValue,
    right: cssValue,
    bottom: cssValue,
    left: cssValue,
  };
}

/**
 * Creates default responsive visibility (visible on all devices)
 *
 * @returns Default responsive visibility
 */
export function createDefaultVisibility(): ResponsiveVisibility {
  return {
    desktop: true,
    tablet: true,
    mobile: true,
  };
}

/**
 * Gets current timestamp
 *
 * @returns Current timestamp in milliseconds
 */
export function getCurrentTimestamp(): number {
  return Date.now();
}

/**
 * Default component version
 */
export const DEFAULT_VERSION = '1.0.0';
