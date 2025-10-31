/**
 * ToggleButton component type definitions
 */

/**
 * Options for configuring the ToggleButton component
 */
export interface ToggleButtonOptions {
  /**
   * Class prefix for namespacing
   * @default 'eb-'
   */
  classPrefix?: string;

  /**
   * Base CSS class name
   * @default 'toggle-btn'
   */
  cssClass?: string;

  /**
   * Additional CSS classes to apply
   * @default ''
   */
  extendedClasses?: string;

  /**
   * Whether the button is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Change event callback
   * Called when the toggle state changes
   */
  onChange?: (isActive: boolean) => void;

  /**
   * Whether the button starts in active state
   * @default false
   */
  startActive?: boolean;

  /**
   * Whether to stop event propagation on click
   * @default false
   */
  clickStopPropagation?: boolean;
}
