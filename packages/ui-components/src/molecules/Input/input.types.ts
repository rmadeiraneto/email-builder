/**
 * Input component type definitions
 */

/**
 * Options for configuring the Input component
 */
export interface InputOptions {
  /**
   * Height of the input (CSS custom property value)
   * @default null
   */
  height?: string | null;

  /**
   * Class prefix for namespacing
   * @default 'eb-'
   */
  classPrefix?: string;

  /**
   * Base CSS class name
   * @default 'input'
   */
  className?: string;

  /**
   * Additional CSS classes to apply
   * @default ''
   */
  extendedClasses?: string;

  /**
   * Input type attribute
   * @default 'text'
   */
  type?: string;

  /**
   * Change event callback
   * Fired when input loses focus and value has changed
   */
  onChange?: (event: Event, input: HTMLInputElement) => void;

  /**
   * Input event callback
   * Fired on every keystroke
   */
  onInput?: (event: Event, input: HTMLInputElement) => void;

  /**
   * Initial value for the input
   * @default null
   */
  initialValue?: string | null;

  /**
   * Placeholder text
   * @default null
   */
  placeholder?: string | null;
}

/**
 * Event listener callback type
 */
export type InputEventCallback = (event: Event, input: HTMLInputElement) => void;

/**
 * Supported input events
 */
export type InputEvent = 'input' | 'change';
