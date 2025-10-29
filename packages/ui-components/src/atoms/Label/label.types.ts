/**
 * Label component types
 */

/**
 * Label component properties
 *
 * @example
 * Basic usage:
 * ```ts
 * const label = new Label({
 *   htmlFor: 'input-id',
 *   children: 'Email Address'
 * });
 * ```
 */
export interface LabelProps {
  /**
   * Associated input ID (htmlFor attribute)
   */
  htmlFor?: string;

  /**
   * Label text content
   */
  children: string;

  /**
   * Required field indicator
   *
   * @default false
   */
  required?: boolean;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Click event handler
   *
   * @param event - Mouse event
   */
  onClick?: (event: MouseEvent) => void;
}
