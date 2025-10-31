import type { InputNumber } from '../InputNumber/InputNumber';

/**
 * Configuration for a single input item in LinkedInputs
 */
export interface LinkedInputItemConfig {
  /**
   * Label text for the input
   */
  label?: string;

  /**
   * Input configuration or InputNumber instance
   */
  input: InputNumberConfig | InputNumber;

  /**
   * Mark this input as the alpha (source) input for syncing
   * @default false
   */
  alphaInput?: boolean;
}

/**
 * Configuration for InputNumber within LinkedInputs
 */
export interface InputNumberConfig {
  /**
   * Default/initial value
   */
  defaultValue?: number;

  /**
   * Default unit for the value (px, rem, %, etc.)
   */
  defaultUnit?: string;

  /**
   * Minimum allowed value
   */
  min?: number;

  /**
   * Maximum allowed value
   */
  max?: number;

  /**
   * Increment/decrement step
   */
  increment?: number;

  /**
   * Additional classes for the wrapper
   */
  extendedClasses?: string;

  /**
   * Additional classes for the input element
   */
  inputExtendedClasses?: string;
}

/**
 * LinkedInputs component options
 */
export interface LinkedInputsOptions {
  /**
   * Array of input item configurations
   */
  items: LinkedInputItemConfig[];

  /**
   * Start with inputs linked
   * @default false
   */
  startLinked?: boolean;

  /**
   * Icon for the link button
   * Can be an HTMLElement or string
   */
  linkIcon?: HTMLElement | string;

  /**
   * Size of the link icon
   * @default 'md'
   */
  linkIconSize?: 'sm' | 'md' | 'lg';

  /**
   * Callback when link state changes
   * @param isLinked - Current link state
   * @param alphaValue - Value of the alpha input
   */
  onLink?: (linkedInputs: any, alphaValue: string | undefined) => void;

  /**
   * Automatically detect which input should be the alpha input
   * based on user interaction
   * @default true
   */
  autoAlphaInput?: boolean;

  /**
   * Wrap inputs in InputLabel components
   * @default true
   */
  useLabels?: boolean;

  /**
   * Additional CSS classes for the wrapper
   */
  extendedClasses?: string;
}

/**
 * Internal item structure after conversion
 */
export interface LinkedInputItem {
  /**
   * Label text
   */
  label?: string;

  /**
   * InputNumber instance
   */
  input: InputNumber;
}

/**
 * Internal item structure with label wrapper
 */
export interface LinkedInputItemWithLabel extends LinkedInputItem {
  /**
   * Label wrapper element
   */
  wrapper: HTMLDivElement;
}

/**
 * Event callback type for item change
 */
export type LinkedInputItemChangeCallback = (
  item: InputNumber,
  itemValue: number,
  itemUnit: string,
  itemInputValue: string,
  userInput: boolean
) => void;
