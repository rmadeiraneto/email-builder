/**
 * InputNumber component types
 */

/**
 * CSS unit types supported by InputNumber
 */
export type CSSUnit =
  | 'px'
  | 'rem'
  | 'em'
  | '%'
  | 'vh'
  | 'vw'
  | 'vmin'
  | 'vmax'
  | 'ch'
  | 'ex'
  | 'pt'
  | 'pc'
  | 'in'
  | 'cm'
  | 'mm';

/**
 * Default CSS units array
 */
export const CSS_UNITS: readonly CSSUnit[] = [
  'px',
  'rem',
  'em',
  '%',
  'vh',
  'vw',
  'vmin',
  'vmax',
  'ch',
  'ex',
  'pt',
  'pc',
  'in',
  'cm',
  'mm',
] as const;

/**
 * Props for the InputNumber component
 */
export interface InputNumberProps {
  /**
   * Initial/default value
   * @default 0
   */
  defaultValue?: number;

  /**
   * Increment/decrement step value
   * @default 1
   */
  increment?: number;

  /**
   * Minimum allowed value
   */
  min?: number | null;

  /**
   * Maximum allowed value
   */
  max?: number | null;

  /**
   * CSS unit for the value
   * @default 'px'
   */
  unit?: CSSUnit | string;

  /**
   * Allow user to change the unit
   * @default false
   */
  changeableUnit?: boolean;

  /**
   * Available units when changeableUnit is true
   * @default CSS_UNITS
   */
  availableUnits?: readonly (CSSUnit | string)[];

  /**
   * Additional CSS classes for the root element
   */
  class?: string;

  /**
   * Additional CSS classes for the input element
   */
  inputClass?: string;

  /**
   * Disable the input
   * @default false
   */
  disabled?: boolean;

  /**
   * Emit change events even when disabled
   * @default false
   */
  emitEventsWhenDisabled?: boolean;

  /**
   * Custom up arrow content (HTML string or element)
   */
  arrowUp?: string | HTMLElement;

  /**
   * Custom down arrow content (HTML string or element)
   */
  arrowDown?: string | HTMLElement;

  /**
   * Callback fired when value changes
   * @param value - The numeric value
   * @param unit - The current unit
   * @param inputValue - The full input string (value + unit)
   * @param userInput - Whether the change was initiated by user input
   */
  onChange?: (value: number, unit: string, inputValue: string, userInput: boolean) => void;

  /**
   * Callback for up arrow clicks (before increment)
   */
  onUpArrowClick?: (value: number, unit: string, inputValue: string) => void;

  /**
   * Callback for down arrow clicks (before decrement)
   */
  onDownArrowClick?: (value: number, unit: string, inputValue: string) => void;

  /**
   * Prevent default increment behavior on up arrow click
   * @default false
   */
  arrowUpClickPreventDefault?: boolean;

  /**
   * Prevent default decrement behavior on down arrow click
   * @default false
   */
  arrowDownClickPreventDefault?: boolean;
}

/**
 * Configuration for InputNumber (extends props)
 */
export interface InputNumberConfig extends InputNumberProps {}

/**
 * Event emitter callback signature
 */
export type InputNumberChangeCallback = (
  value: number,
  unit: string,
  inputValue: string,
  userInput: boolean
) => void;
