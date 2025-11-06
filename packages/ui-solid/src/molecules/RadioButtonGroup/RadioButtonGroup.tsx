/**
 * RadioButtonGroup component (SolidJS)
 *
 * A group of selectable radio button items.
 *
 * @example
 * ```tsx
 * <RadioButtonGroup
 *   items={[
 *     { value: 'option1', label: 'Option 1' },
 *     { value: 'option2', label: 'Option 2', selected: true },
 *     { value: 'option3', label: 'Option 3' }
 *   ]}
 *   singleSelection
 *   onChange={(value) => console.log('Selected:', value)}
 * />
 * ```
 */

import { Component, For, createSignal, mergeProps, splitProps } from 'solid-js';
import { classNames } from '../../utils';
import styles from '@email-builder/ui-components/src/molecules/RadioButtonGroup/radio-button-group.module.scss';

/**
 * Radio button item configuration
 */
export interface RadioButtonItem {
  /**
   * Item value
   */
  value: string | number;

  /**
   * Item label
   */
  label?: string;

  /**
   * Item icon (Remix icon name)
   */
  icon?: string;

  /**
   * Whether the item is initially selected
   */
  selected?: boolean;

  /**
   * Tooltip description
   */
  description?: string;
}

/**
 * SolidJS RadioButtonGroup props
 */
export interface RadioButtonGroupProps {
  /**
   * Array of radio button items
   */
  items: RadioButtonItem[];

  /**
   * Whether only one item can be selected at a time
   */
  singleSelection?: boolean;

  /**
   * Whether to allow no items to be selected
   */
  allowNoSelection?: boolean;

  /**
   * Additional CSS classes
   */
  class?: string;

  /**
   * Callback fired when selection changes
   */
  onChange?: (selectedValues: (string | number)[]) => void;
}

/**
 * Default props
 */
const defaultProps: Partial<RadioButtonGroupProps> = {
  singleSelection: false,
  allowNoSelection: true,
};

/**
 * SolidJS RadioButtonGroup Component
 */
export const RadioButtonGroup: Component<RadioButtonGroupProps> = (props) => {
  const merged = mergeProps(defaultProps, props);
  const [local] = splitProps(merged, [
    'items',
    'singleSelection',
    'allowNoSelection',
    'class',
    'onChange',
  ]);

  // Track selected values
  const initialSelected = local.items.filter(item => item.selected).map(item => item.value);
  const [selectedValues, setSelectedValues] = createSignal<(string | number)[]>(initialSelected);

  /**
   * Handle item click
   */
  const handleItemClick = (value: string | number) => {
    setSelectedValues(prev => {
      let newSelected: (string | number)[];

      if (local.singleSelection) {
        // Single selection mode
        if (prev.includes(value) && local.allowNoSelection) {
          newSelected = [];
        } else {
          newSelected = [value];
        }
      } else {
        // Multi selection mode
        if (prev.includes(value)) {
          if (local.allowNoSelection || prev.length > 1) {
            newSelected = prev.filter(v => v !== value);
          } else {
            newSelected = prev;
          }
        } else {
          newSelected = [...prev, value];
        }
      }

      local.onChange?.(newSelected);
      return newSelected;
    });
  };

  /**
   * Check if item is selected
   */
  const isSelected = (value: string | number) => {
    return selectedValues().includes(value);
  };

  /**
   * Get root classes
   */
  const getRootClasses = () => {
    return classNames(
      styles['radio-btn-group'],
      local.class
    );
  };

  /**
   * Get item classes
   */
  const getItemClasses = (value: string | number) => {
    return classNames(
      styles['radio-btn-group__item'],
      isSelected(value) && styles['radio-btn-group__item--active']
    );
  };

  return (
    <div class={getRootClasses()} data-testid="radio-button-group">
      <For each={local.items}>
        {(item) => (
          <button
            type="button"
            class={getItemClasses(item.value)}
            onClick={() => handleItemClick(item.value)}
            title={item.description}
            aria-pressed={isSelected(item.value)}
          >
            {item.icon && <i class={`ri-${item.icon}`} />}
            {item.label && <span>{item.label}</span>}
          </button>
        )}
      </For>
    </div>
  );
};
