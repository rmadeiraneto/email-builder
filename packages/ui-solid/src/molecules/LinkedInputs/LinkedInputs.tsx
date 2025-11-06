/**
 * LinkedInputs component (SolidJS)
 *
 * Manages multiple InputNumber components that can be linked/synchronized together.
 *
 * @example
 * ```tsx
 * <LinkedInputs
 *   items={[
 *     { label: 'Top', value: 10, unit: 'px' },
 *     { label: 'Right', value: 10, unit: 'px' },
 *     { label: 'Bottom', value: 10, unit: 'px' },
 *     { label: 'Left', value: 10, unit: 'px' }
 *   ]}
 *   startLinked
 *   onChange={(values) => console.log('Values:', values)}
 * />
 * ```
 */

import { Component, For, createSignal, createEffect, mergeProps, splitProps } from 'solid-js';
import { classNames } from '@email-builder/ui-components/utils';
import { InputNumber } from '../InputNumber';
import type { CSSUnit } from '../InputNumber';
import styles from '@email-builder/ui-components/src/molecules/LinkedInputs/linked-inputs.module.scss';

/**
 * Linked input item configuration
 */
export interface LinkedInputItem {
  /**
   * Label for the input
   */
  label?: string;

  /**
   * Initial value
   */
  value?: number;

  /**
   * Initial unit
   */
  unit?: CSSUnit | string;

  /**
   * Increment step
   */
  increment?: number;

  /**
   * Min value
   */
  min?: number | null;

  /**
   * Max value
   */
  max?: number | null;
}

/**
 * SolidJS LinkedInputs props
 */
export interface LinkedInputsProps {
  /**
   * Array of input configurations
   */
  items: LinkedInputItem[];

  /**
   * Start with inputs linked
   */
  startLinked?: boolean;

  /**
   * Additional CSS classes
   */
  class?: string;

  /**
   * Callback when any value changes
   */
  onChange?: (values: { value: number; unit: string }[]) => void;

  /**
   * Callback when link state changes
   */
  onLink?: (isLinked: boolean) => void;
}

/**
 * Default props
 */
const defaultProps: Partial<LinkedInputsProps> = {
  startLinked: false,
};

/**
 * SolidJS LinkedInputs Component
 */
export const LinkedInputs: Component<LinkedInputsProps> = (props) => {
  const merged = mergeProps(defaultProps, props);
  const [local] = splitProps(merged, [
    'items',
    'startLinked',
    'class',
    'onChange',
    'onLink',
  ]);

  const [isLinked, setIsLinked] = createSignal(local.startLinked!);
  const [values, setValues] = createSignal<{ value: number; unit: string }[]>(
    local.items.map((item) => ({
      value: item.value ?? 0,
      unit: item.unit ?? 'px',
    }))
  );

  // Notify parent of changes
  createEffect(() => {
    local.onChange?.(values());
  });

  /**
   * Toggle link state
   */
  const handleLinkToggle = () => {
    const newState = !isLinked();
    setIsLinked(newState);
    local.onLink?.(newState);

    // If linking, sync all values to the first input
    if (newState && values().length > 0) {
      const firstValue = values()[0];
      if (firstValue) {
        setValues(values().map(() => ({ ...firstValue })));
      }
    }
  };

  /**
   * Handle individual input change
   */
  const handleValueChange = (index: number, value: number, unit: string) => {
    setValues((prev) => {
      const newValues = [...prev];

      if (isLinked()) {
        // Update all values if linked
        return newValues.map(() => ({ value, unit }));
      } else {
        // Update only this value
        if (newValues[index]) {
          newValues[index] = { value, unit };
        }
        return newValues;
      }
    });
  };

  /**
   * Get root classes
   */
  const getRootClasses = () => {
    return classNames(
      styles['linked-inputs'],
      local.class
    );
  };

  /**
   * Get link button classes
   */
  const getLinkButtonClasses = () => {
    return classNames(
      styles['linked-inputs__link'],
      isLinked() && styles['linked-inputs__link--active']
    );
  };

  return (
    <div class={getRootClasses()}>
      <div class={styles['linked-inputs__items']}>
        <For each={local.items}>
          {(item, index) => {
            const currentVal = values()[index()];
            return (
              <div class={styles['linked-inputs__item-wrapper']}>
                {item.label && (
                  <label class={styles['linked-inputs__label']}>{item.label}</label>
                )}
                <InputNumber
                  value={currentVal?.value ?? 0}
                  unit={currentVal?.unit ?? 'px'}
                  increment={item.increment}
                  min={item.min}
                  max={item.max}
                  class={styles['linked-inputs__item']}
                  inputClass={styles['linked-inputs__input']}
                  onChange={(value, unit) => handleValueChange(index(), value, unit)}
                />
              </div>
            );
          }}
        </For>
      </div>

      <button
        type="button"
        class={getLinkButtonClasses()}
        onClick={handleLinkToggle}
        aria-pressed={isLinked()}
        aria-label={isLinked() ? 'Unlink inputs' : 'Link inputs'}
        data-testid="link-button"
      >
        <i class="ri-link" />
      </button>
    </div>
  );
};
