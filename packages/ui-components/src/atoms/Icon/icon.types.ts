/**
 * Icon component types
 */

/**
 * Icon size type (in pixels)
 */
export type IconSize = number | 'small' | 'medium' | 'large';

/**
 * Icon component properties
 *
 * @example
 * Basic usage:
 * ```ts
 * const icon = new Icon({
 *   name: 'star',
 *   size: 24
 * });
 * ```
 *
 * @example
 * With color:
 * ```ts
 * const icon = new Icon({
 *   name: 'heart',
 *   size: 'large',
 *   color: '#ef4444'
 * });
 * ```
 */
export interface IconProps {
  /**
   * Icon name from Remix Icons
   *
   * @example 'star', 'heart', 'arrow-right', 'check'
   */
  name: string;

  /**
   * Icon size
   *
   * Can be a number (pixels) or predefined size:
   * - small: 16px
   * - medium: 24px
   * - large: 32px
   *
   * @default 'medium'
   */
  size?: IconSize;

  /**
   * Icon color (uses currentColor if not specified)
   */
  color?: string;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * ARIA label for accessibility
   *
   * If provided, icon will be treated as meaningful content.
   * Otherwise, icon is hidden from screen readers (decorative).
   */
  ariaLabel?: string;

  /**
   * Click event handler
   *
   * @param event - Mouse event
   */
  onClick?: (event: MouseEvent) => void;
}
