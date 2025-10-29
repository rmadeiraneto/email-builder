/**
 * Input component types
 */

/**
 * Input type attribute
 */
export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';

/**
 * Input size type
 */
export type InputSize = 'small' | 'medium' | 'large';

/**
 * Input validation state
 */
export type InputValidationState = 'default' | 'error' | 'success' | 'warning';

/**
 * Input component properties
 *
 * @example
 * Basic usage:
 * ```ts
 * const input = new Input({
 *   type: 'text',
 *   placeholder: 'Enter your name',
 *   onChange: (value) => console.log(value)
 * });
 * ```
 *
 * @example
 * With validation:
 * ```ts
 * const input = new Input({
 *   type: 'email',
 *   validationState: 'error',
 *   required: true,
 *   placeholder: 'email@example.com'
 * });
 * ```
 */
export interface InputProps {
  /**
   * Input type attribute
   *
   * @default 'text'
   */
  type?: InputType;

  /**
   * Size of the input
   *
   * @default 'medium'
   */
  size?: InputSize;

  /**
   * Input value
   */
  value?: string;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Input name attribute
   */
  name?: string;

  /**
   * Input ID attribute
   */
  id?: string;

  /**
   * Disabled state
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Readonly state
   *
   * @default false
   */
  readonly?: boolean;

  /**
   * Required field
   *
   * @default false
   */
  required?: boolean;

  /**
   * Full width input
   *
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Validation state
   *
   * @default 'default'
   */
  validationState?: InputValidationState;

  /**
   * Minimum length
   */
  minLength?: number;

  /**
   * Maximum length
   */
  maxLength?: number;

  /**
   * Pattern for validation (regex)
   */
  pattern?: string;

  /**
   * Autocomplete attribute
   */
  autocomplete?: string;

  /**
   * ARIA label
   */
  ariaLabel?: string;

  /**
   * ARIA described by (for error messages)
   */
  ariaDescribedBy?: string;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Change event handler
   *
   * @param value - New input value
   * @param event - Input event
   */
  onChange?: (value: string, event: Event) => void;

  /**
   * Input event handler (fires on every keystroke)
   *
   * @param value - Current input value
   * @param event - Input event
   */
  onInput?: (value: string, event: Event) => void;

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

  /**
   * Keydown event handler
   *
   * @param event - Keyboard event
   */
  onKeyDown?: (event: KeyboardEvent) => void;

  /**
   * Keyup event handler
   *
   * @param event - Keyboard event
   */
  onKeyUp?: (event: KeyboardEvent) => void;
}
