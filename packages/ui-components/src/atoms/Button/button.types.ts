/**
 * Button component types
 */

/**
 * Button variant type
 */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

/**
 * Button size type
 */
export type ButtonSize = 'small' | 'medium' | 'large';

/**
 * Button type attribute
 */
export type ButtonType = 'button' | 'submit' | 'reset';

/**
 * Button component properties
 *
 * @example
 * Basic usage:
 * ```ts
 * const button = new Button({
 *   variant: 'primary',
 *   children: 'Click me',
 *   onClick: () => console.log('clicked')
 * });
 * ```
 *
 * @example
 * With icon:
 * ```ts
 * const button = new Button({
 *   variant: 'secondary',
 *   size: 'large',
 *   icon: 'star',
 *   children: 'Favorite'
 * });
 * ```
 */
export interface ButtonProps {
  /**
   * Visual style variant
   *
   * - `primary`: Main call-to-action
   * - `secondary`: Secondary actions
   * - `ghost`: Minimal emphasis
   *
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * Size of the button
   *
   * @default 'medium'
   */
  size?: ButtonSize;

  /**
   * Button type attribute
   *
   * @default 'button'
   */
  type?: ButtonType;

  /**
   * Disabled state
   *
   * When true, button cannot be interacted with and appears dimmed.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Full width button
   *
   * When true, button takes full width of container.
   *
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Icon name (Remix Icons)
   *
   * When provided, displays an icon before the text.
   *
   * @example 'arrow-right', 'check', 'close'
   */
  icon?: string;

  /**
   * Icon position
   *
   * @default 'left'
   */
  iconPosition?: 'left' | 'right';

  /**
   * Button content
   *
   * Can be text or HTML string.
   */
  children: string;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Click event handler
   *
   * @param event - Mouse event from the click
   */
  onClick?: (event: MouseEvent) => void;

  /**
   * Focus event handler
   *
   * @param event - Focus event
   */
  onFocus?: (event: FocusEvent) => void;

  /**
   * Blur event handler
   *
   * @param event - Blur event
   */
  onBlur?: (event: FocusEvent) => void;
}
