/**
 * GridSelector component (SolidJS)
 *
 * A grid layout component for selecting one or multiple items.
 *
 * @example
 * ```tsx
 * <GridSelector
 *   items={[
 *     { content: <div>Item 1</div>, value: '1' },
 *     { content: <div>Item 2</div>, value: '2', selected: true },
 *     { content: <div>Item 3</div>, value: '3' },
 *   ]}
 *   columnsCount={3}
 *   singleSelection
 *   onChange={(selectedValues) => console.log('Selected:', selectedValues)}
 * />
 * ```
 */

import { Component, JSX, For, createSignal, mergeProps, splitProps } from 'solid-js';
import { classNames } from '@email-builder/ui-components/utils';
import styles from '@email-builder/ui-components/src/molecules/GridSelector/grid-selector.module.scss';

/**
 * Grid selector item
 */
export interface GridSelectorItem {
  /**
   * Item content
   */
  content: JSX.Element;

  /**
   * Item value
   */
  value: string | number;

  /**
   * Whether initially selected
   */
  selected?: boolean;

  /**
   * Additional CSS classes
   */
  class?: string;
}

/**
 * SolidJS GridSelector props
 */
export interface GridSelectorProps {
  /**
   * Array of items
   */
  items: GridSelectorItem[];

  /**
   * Whether only one item can be selected
   */
  singleSelection?: boolean;

  /**
   * Number of columns
   */
  columnsCount?: number;

  /**
   * Whether to allow empty selection
   */
  allowEmpty?: boolean;

  /**
   * Additional CSS classes
   */
  class?: string;

  /**
   * Callback when selection changes
   */
  onChange?: (selectedValues: (string | number)[]) => void;

  /**
   * Item height
   */
  itemHeight?: string;
}

/**
 * Default props
 */
const defaultProps: Partial<GridSelectorProps> = {
  singleSelection: false,
  columnsCount: 4,
  allowEmpty: true,
  itemHeight: 'auto',
};

/**
 * SolidJS GridSelector Component
 */
export const GridSelector: Component<GridSelectorProps> = (props) => {
  const merged = mergeProps(defaultProps, props);
  const [local] = splitProps(merged, [
    'items',
    'singleSelection',
    'columnsCount',
    'allowEmpty',
    'class',
    'onChange',
    'itemHeight',
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
        if (prev.includes(value) && local.allowEmpty) {
          newSelected = [];
        } else {
          newSelected = [value];
        }
      } else {
        // Multi selection mode
        if (prev.includes(value)) {
          if (local.allowEmpty || prev.length > 1) {
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
      styles['grid-selector'],
      local.class
    );
  };

  /**
   * Get item classes
   */
  const getItemClasses = (item: GridSelectorItem) => {
    return classNames(
      styles['grid-selector__item'],
      isSelected(item.value) && styles['grid-selector__item--selected'],
      item.class
    );
  };

  /**
   * Get grid style
   */
  const getGridStyle = () => {
    return {
      'grid-template-columns': `repeat(${local.columnsCount}, 1fr)`,
      '--item-height': local.itemHeight,
    };
  };

  return (
    <div class={getRootClasses()} style={getGridStyle()}>
      <For each={local.items}>
        {(item) => (
          <div
            class={getItemClasses(item)}
            onClick={() => handleItemClick(item.value)}
            role="button"
            tabindex={0}
            aria-pressed={isSelected(item.value)}
          >
            {item.content}
          </div>
        )}
      </For>
    </div>
  );
};
