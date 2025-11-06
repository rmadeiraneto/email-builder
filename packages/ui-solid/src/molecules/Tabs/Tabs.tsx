/**
 * Tabs component (SolidJS)
 *
 * A tab navigation component with active state management.
 *
 * @example
 * ```tsx
 * <Tabs
 *   items={[
 *     { label: 'Tab 1', content: <div>Content 1</div> },
 *     { label: 'Tab 2', content: <div>Content 2</div> },
 *   ]}
 *   activeIndex={activeIndex()}
 *   onTabChange={(index) => setActiveIndex(index)}
 * />
 * ```
 */

import {
  Component,
  JSX,
  createSignal,
  For,
  Show,
  mergeProps,
  splitProps,
  createEffect,
} from 'solid-js';
import { classNames } from '@email-builder/ui-components/utils';
import styles from '@email-builder/ui-components/src/molecules/Tabs/tabs.module.scss';

/**
 * Tab item configuration
 */
export interface TabItem {
  /**
   * Tab label/title
   */
  label: string | JSX.Element;

  /**
   * Tab content
   */
  content: JSX.Element;

  /**
   * Whether tab is disabled
   */
  disabled?: boolean;

  /**
   * Custom class for tab button
   */
  tabClass?: string;

  /**
   * Custom class for tab pane
   */
  paneClass?: string;
}

/**
 * SolidJS Tabs props
 */
export interface TabsProps {
  /**
   * Array of tab items
   */
  items: TabItem[];

  /**
   * Index of the active tab
   */
  activeIndex?: number;

  /**
   * Callback when tab changes
   */
  onTabChange?: (index: number, item: TabItem) => void;

  /**
   * Additional CSS classes for container
   */
  className?: string;

  /**
   * Additional CSS classes for tab list
   */
  tabListClass?: string;

  /**
   * Additional CSS classes for tab panels
   */
  tabPanelsClass?: string;
}

/**
 * Default props
 */
const defaultProps: Partial<TabsProps> = {
  activeIndex: 0,
};

/**
 * SolidJS Tabs Component
 */
export const Tabs: Component<TabsProps> = (props) => {
  const merged = mergeProps(defaultProps, props);
  const [local] = splitProps(merged, [
    'items',
    'activeIndex',
    'onTabChange',
    'className',
    'tabListClass',
    'tabPanelsClass',
  ]);

  const [activeTab, setActiveTab] = createSignal(local.activeIndex ?? 0);

  /**
   * Sync with controlled activeIndex prop
   */
  createEffect(() => {
    if (local.activeIndex !== undefined) {
      setActiveTab(local.activeIndex);
    }
  });

  /**
   * Handle tab click
   */
  const handleTabClick = (index: number, item: TabItem) => {
    if (item.disabled) return;

    setActiveTab(index);
    local.onTabChange?.(index, item);
  };

  /**
   * Get tab button classes
   */
  const getTabClasses = (index: number, item: TabItem) => {
    return classNames(
      styles.tabs__tab,
      activeTab() === index && styles['tabs__tab--active'],
      item.disabled && styles['tabs__tab--disabled'],
      item.tabClass
    );
  };

  /**
   * Get tab pane classes
   */
  const getPaneClasses = (index: number, item: TabItem) => {
    return classNames(
      styles.tabs__pane,
      activeTab() === index && styles['tabs__pane--active'],
      item.paneClass
    );
  };

  return (
    <div class={classNames(styles.tabs, local.className)}>
      {/* Tab List */}
      <div
        class={classNames(styles.tabs__list, local.tabListClass)}
        role="tablist"
      >
        <For each={local.items}>
          {(item, index) => (
            <button
              type="button"
              role="tab"
              class={getTabClasses(index(), item)}
              aria-selected={activeTab() === index()}
              aria-disabled={item.disabled}
              onClick={() => handleTabClick(index(), item)}
            >
              {item.label}
            </button>
          )}
        </For>
      </div>

      {/* Tab Panels */}
      <div class={classNames(styles.tabs__panels, local.tabPanelsClass)}>
        <For each={local.items}>
          {(item, index) => (
            <Show when={activeTab() === index()}>
              <div
                role="tabpanel"
                class={getPaneClasses(index(), item)}
              >
                {item.content}
              </div>
            </Show>
          )}
        </For>
      </div>
    </div>
  );
};
