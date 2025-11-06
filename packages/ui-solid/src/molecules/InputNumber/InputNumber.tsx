/**
 * InputNumber component (SolidJS)
 *
 * A number input with increment/decrement controls and optional unit selector.
 *
 * @example
 * ```tsx
 * <InputNumber
 *   value={16}
 *   unit="px"
 *   min={0}
 *   max={100}
 *   increment={1}
 *   onChange={(value, unit) => console.log(value, unit)}
 * />
 * ```
 */

import {
  Component,
  Show,
  createSignal,
  createEffect,
  mergeProps,
  splitProps,
} from 'solid-js';
import { classNames } from '../../utils';
import styles from '@email-builder/ui-components/src/molecules/InputNumber/input-number.module.scss';

/**
 * CSS unit types
 */
export type CSSUnit = 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw' | 'vmin' | 'vmax' | 'ch' | 'ex' | 'pt' | 'pc' | 'in' | 'cm' | 'mm';

/**
 * SolidJS InputNumber props
 */
export interface InputNumberProps {
  /**
   * Current value
   */
  value?: number;

  /**
   * Current unit
   */
  unit?: CSSUnit | string;

  /**
   * Increment/decrement step
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
   */
  changeableUnit?: boolean;

  /**
   * Available units when changeableUnit is true
   */
  availableUnits?: readonly (CSSUnit | string)[];

  /**
   * Additional CSS classes for the root element
   */
  class?: string | undefined;

  /**
   * Additional CSS classes for the input element
   */
  inputClass?: string | undefined;

  /**
   * Disable the input
   */
  disabled?: boolean;

  /**
   * Callback fired when value changes
   */
  onChange?: (value: number, unit: string, inputValue: string) => void;

  /**
   * Callback for up arrow clicks
   */
  onUpArrowClick?: (value: number, unit: string) => void;

  /**
   * Callback for down arrow clicks
   */
  onDownArrowClick?: (value: number, unit: string) => void;
}

/**
 * Default units
 */
const DEFAULT_UNITS: readonly CSSUnit[] = ['px', 'rem', 'em', '%', 'vh', 'vw', 'vmin', 'vmax', 'ch', 'ex', 'pt', 'pc', 'in', 'cm', 'mm'] as const;

/**
 * Default props
 */
const defaultProps: Partial<InputNumberProps> = {
  value: 0,
  unit: 'px',
  increment: 1,
  min: null,
  max: null,
  changeableUnit: false,
  availableUnits: DEFAULT_UNITS,
  disabled: false,
};

/**
 * SolidJS InputNumber Component
 */
export const InputNumber: Component<InputNumberProps> = (props) => {
  const merged = mergeProps(defaultProps, props);
  const [local] = splitProps(merged, [
    'value',
    'unit',
    'increment',
    'min',
    'max',
    'changeableUnit',
    'availableUnits',
    'class',
    'inputClass',
    'disabled',
    'onChange',
    'onUpArrowClick',
    'onDownArrowClick',
  ]);

  // Internal state
  const [currentValue, setCurrentValue] = createSignal(local.value!);
  const [currentUnit, setCurrentUnit] = createSignal(local.unit!);
  const [inputValue, setInputValue] = createSignal(`${local.value}${local.unit}`);

  // Sync with external value changes
  createEffect(() => {
    if (local.value !== undefined) {
      setCurrentValue(local.value);
      setInputValue(`${local.value}${currentUnit()}`);
    }
  });

  createEffect(() => {
    if (local.unit !== undefined) {
      setCurrentUnit(local.unit);
      setInputValue(`${currentValue()}${local.unit}`);
    }
  });

  /**
   * Parse input string to extract value and unit
   */
  const parseInput = (input: string): { value: number; unit: string } => {
    const match = input.match(/^(-?\d*\.?\d+)(.*)$/);
    if (match) {
      const value = parseFloat(match[1] ?? '0');
      const unit = match[2]?.trim() || currentUnit();
      return { value: isNaN(value) ? 0 : value, unit };
    }
    return { value: 0, unit: currentUnit() };
  };

  /**
   * Validate and clamp value within min/max bounds
   */
  const clampValue = (value: number): number => {
    let clamped = value;
    const min = local.min ?? null;
    const max = local.max ?? null;
    if (min !== null && clamped < min) {
      clamped = min;
    }
    if (max !== null && clamped > max) {
      clamped = max;
    }
    return clamped;
  };

  /**
   * Handle input change
   */
  const handleInputChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const input = target.value;
    setInputValue(input);

    const parsed = parseInput(input);
    const clamped = clampValue(parsed.value);

    setCurrentValue(clamped);
    setCurrentUnit(parsed.unit);

    local.onChange?.(clamped, parsed.unit, `${clamped}${parsed.unit}`);
  };

  /**
   * Increment value
   */
  const handleIncrement = () => {
    if (local.disabled) return;

    const newValue = clampValue(currentValue() + local.increment!);
    setCurrentValue(newValue);
    setInputValue(`${newValue}${currentUnit()}`);

    local.onUpArrowClick?.(newValue, currentUnit());
    local.onChange?.(newValue, currentUnit(), `${newValue}${currentUnit()}`);
  };

  /**
   * Decrement value
   */
  const handleDecrement = () => {
    if (local.disabled) return;

    const newValue = clampValue(currentValue() - local.increment!);
    setCurrentValue(newValue);
    setInputValue(`${newValue}${currentUnit()}`);

    local.onDownArrowClick?.(newValue, currentUnit());
    local.onChange?.(newValue, currentUnit(), `${newValue}${currentUnit()}`);
  };

  /**
   * Check if increment is disabled
   */
  const isIncrementDisabled = () => {
    const max = local.max ?? null;
    return local.disabled || (max !== null && currentValue() >= max);
  };

  /**
   * Check if decrement is disabled
   */
  const isDecrementDisabled = () => {
    const min = local.min ?? null;
    return local.disabled || (min !== null && currentValue() <= min);
  };

  /**
   * Get root classes
   */
  const getRootClasses = () => {
    return classNames(
      styles['input-number'],
      local.disabled && styles['input-number--disabled'],
      local.class
    );
  };

  /**
   * Get input classes
   */
  const getInputClasses = () => {
    return classNames(
      styles['input-number__input'],
      local.inputClass
    );
  };

  return (
    <div class={getRootClasses()}>
      <input
        type="text"
        class={getInputClasses()}
        value={inputValue()}
        onInput={handleInputChange}
        disabled={local.disabled}
      />

      <div class={styles['input-number__arrows']}>
        <div
          class={classNames(
            styles['input-number__arrow'],
            styles['input-number__arrow--up'],
            isIncrementDisabled() && styles['input-number__arrow--disabled']
          )}
          onClick={handleIncrement}
          role="button"
          aria-label="Increment value"
          tabindex={isIncrementDisabled() ? -1 : 0}
        >
          <i class="ri-arrow-up-s-line" />
        </div>

        <div
          class={classNames(
            styles['input-number__arrow'],
            styles['input-number__arrow--down'],
            isDecrementDisabled() && styles['input-number__arrow--disabled']
          )}
          onClick={handleDecrement}
          role="button"
          aria-label="Decrement value"
          tabindex={isDecrementDisabled() ? -1 : 0}
        >
          <i class="ri-arrow-down-s-line" />
        </div>
      </div>

      <Show when={local.changeableUnit}>
        <select
          class={styles['input-number__unit']}
          value={currentUnit()}
          onChange={(e) => {
            const newUnit = e.currentTarget.value;
            setCurrentUnit(newUnit);
            setInputValue(`${currentValue()}${newUnit}`);
            local.onChange?.(currentValue(), newUnit, `${currentValue()}${newUnit}`);
          }}
          disabled={local.disabled}
        >
          {local.availableUnits!.map((unit) => (
            <option value={unit}>{unit}</option>
          ))}
        </select>
      </Show>
    </div>
  );
};
