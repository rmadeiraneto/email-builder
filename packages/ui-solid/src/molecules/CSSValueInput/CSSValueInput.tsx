/**
 * CSSValueInput component (SolidJS)
 *
 * A wrapper around InputNumber for editing CSSValue objects.
 * Provides input + unit dropdown for CSS measurements.
 *
 * @example
 * ```tsx
 * <CSSValueInput
 *   value={{ value: 16, unit: 'px' }}
 *   availableUnits={['px', 'rem', 'em', '%']}
 *   onChange={(cssValue) => console.log(cssValue)}
 * />
 * ```
 */

import { Component, mergeProps } from 'solid-js';
import { InputNumber } from '../InputNumber/InputNumber';
import type { CSSValue, CSSUnit } from '@email-builder/core/types/component.types';

/**
 * CSSValueInput props
 */
export interface CSSValueInputProps {
  /**
   * Current CSS value
   */
  value?: CSSValue;

  /**
   * Available units for selection
   * @default ['px', 'rem', 'em', '%', 'pt']
   */
  availableUnits?: readonly CSSUnit[];

  /**
   * Increment/decrement step
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
   * Allow user to change the unit
   * @default true
   */
  changeableUnit?: boolean;

  /**
   * Disable the input
   */
  disabled?: boolean;

  /**
   * Additional CSS classes for the root element
   */
  class?: string;

  /**
   * Additional CSS classes for the input element
   */
  inputClass?: string;

  /**
   * Callback fired when value changes
   */
  onChange?: (value: CSSValue) => void;
}

/**
 * Default available units
 */
const DEFAULT_UNITS: readonly CSSUnit[] = ['px', 'rem', 'em', '%', 'pt'];

/**
 * Default props
 */
const defaultProps: Partial<CSSValueInputProps> = {
  value: { value: 0, unit: 'px' },
  availableUnits: DEFAULT_UNITS,
  increment: 1,
  min: null,
  max: null,
  changeableUnit: true,
  disabled: false,
};

/**
 * CSSValueInput Component
 */
export const CSSValueInput: Component<CSSValueInputProps> = (props) => {
  const merged = mergeProps(defaultProps, props);

  /**
   * Handle InputNumber change
   */
  const handleChange = (value: number, unit: string) => {
    const cssValue: CSSValue = {
      value: value === 0 && unit === 'auto' ? 'auto' : value,
      unit: unit as CSSUnit,
    };
    merged.onChange?.(cssValue);
  };

  /**
   * Get numeric value from CSSValue
   */
  const getNumericValue = (): number => {
    const val = merged.value!.value;
    return val === 'auto' ? 0 : val;
  };

  /**
   * Get unit from CSSValue
   */
  const getUnit = (): string => {
    return merged.value!.unit;
  };

  return (
    <InputNumber
      value={getNumericValue()}
      unit={getUnit()}
      increment={merged.increment ?? 1}
      min={merged.min ?? null}
      max={merged.max ?? null}
      changeableUnit={merged.changeableUnit ?? true}
      availableUnits={merged.availableUnits as readonly string[]}
      disabled={merged.disabled ?? false}
      class={merged.class}
      inputClass={merged.inputClass}
      onChange={handleChange}
    />
  );
};
