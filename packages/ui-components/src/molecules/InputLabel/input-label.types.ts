/**
 * InputLabel component types
 */

/**
 * Props for the InputLabel component
 */
export interface InputLabelProps {
  /**
   * The input element to wrap
   * Can be an HTMLInputElement or string content
   */
  input: HTMLInputElement | string;

  /**
   * Label text or element
   */
  label: string | HTMLElement;

  /**
   * Optional description/help text shown as a tooltip
   */
  description?: string;

  /**
   * Additional CSS classes for the label element
   */
  labelClass?: string;

  /**
   * Additional CSS classes for the input wrapper
   */
  inputWrapperClass?: string;

  /**
   * Additional CSS classes for the root element
   */
  class?: string;

  /**
   * Display label and input side by side (inline)
   * @default false
   */
  sideBySide?: boolean;

  /**
   * Whether the input field is required
   * @default false
   */
  required?: boolean;

  /**
   * ID for associating label with input
   */
  inputId?: string;
}

/**
 * Configuration options for InputLabel
 */
export interface InputLabelConfig extends InputLabelProps {
  /**
   * Callback fired when the input value changes
   */
  onChange?: (value: string) => void;
}
