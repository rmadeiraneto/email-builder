/**
 * ChoosableSection component (SolidJS)
 *
 * A section with a dropdown to choose between different content options.
 *
 * @example
 * ```tsx
 * <ChoosableSection
 *   label="Display Mode"
 *   items={[
 *     { label: 'Grid', content: <GridView /> },
 *     { label: 'List', content: <ListView />, active: true },
 *   ]}
 *   onChange={(item) => console.log('Selected:', item.label)}
 * />
 * ```
 */

import { Component, JSX, For, Show, createSignal, mergeProps, splitProps } from 'solid-js';
import { classNames } from '../../utils';
import styles from '@email-builder/ui-components/src/molecules/ChoosableSection/choosable-section.module.scss';

/**
 * Choosable section item
 */
export interface ChoosableSectionItem {
  /**
   * Whether this item should start as active
   */
  active?: boolean;

  /**
   * Label displayed in the dropdown
   */
  label: string;

  /**
   * Content to display when selected
   */
  content: JSX.Element;
}

/**
 * SolidJS ChoosableSection props
 */
export interface ChoosableSectionProps {
  /**
   * Main label for the section
   */
  label?: string;

  /**
   * Array of items that can be chosen
   */
  items: ChoosableSectionItem[];

  /**
   * Additional CSS classes
   */
  class?: string;

  /**
   * Callback when the selected item changes
   */
  onChange?: (item: ChoosableSectionItem) => void;
}

/**
 * Default props
 */
const defaultProps: Partial<ChoosableSectionProps> = {};

/**
 * SolidJS ChoosableSection Component
 */
export const ChoosableSection: Component<ChoosableSectionProps> = (props) => {
  const merged = mergeProps(defaultProps, props);
  const [local] = splitProps(merged, ['label', 'items', 'class', 'onChange']);

  // Find initial active item
  const initialIndex = local.items.findIndex(item => item.active) ?? 0;
  const [selectedIndex, setSelectedIndex] = createSignal(initialIndex >= 0 ? initialIndex : 0);

  /**
   * Handle selection change
   */
  const handleChange = (e: Event) => {
    const index = parseInt((e.target as HTMLSelectElement).value, 10);
    setSelectedIndex(index);
    const item = local.items[index];
    if (item) {
      local.onChange?.(item);
    }
  };

  /**
   * Get root classes
   */
  const getRootClasses = () => {
    return classNames(
      styles['choosable-section'],
      local.class
    );
  };

  return (
    <div class={getRootClasses()}>
      <Show when={local.label}>
        <div class={styles['choosable-section__header']}>
          <label class={styles['choosable-section__label']}>{local.label}</label>

          <select
            class={styles['choosable-section__dropdown']}
            value={selectedIndex()}
            onChange={handleChange}
          >
            <For each={local.items}>
              {(item, index) => (
                <option value={index()}>{item.label}</option>
              )}
            </For>
          </select>
        </div>
      </Show>

      <div class={styles['choosable-section__content']}>
        {local.items[selectedIndex()]?.content}
      </div>
    </div>
  );
};
