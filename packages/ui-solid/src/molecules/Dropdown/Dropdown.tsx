/**
 * Dropdown component (SolidJS)
 *
 * A dropdown menu with floating-ui positioning support.
 *
 * @example
 * Basic usage:
 * ```tsx
 * const [selectedItem, setSelectedItem] = createSignal<DropdownItem | null>(null);
 *
 * <Dropdown
 *   items={[
 *     { label: 'Option 1', value: '1' },
 *     { label: 'Option 2', value: '2' }
 *   ]}
 *   selectedItem={selectedItem()}
 *   onChange={(item) => setSelectedItem(item)}
 *   placeholder="Select an option"
 * />
 * ```
 */

import {
  Component,
  createSignal,
  For,
  Show,
  mergeProps,
  splitProps,
  createEffect,
  onCleanup,
} from 'solid-js';
import {
  autoUpdate,
  computePosition,
  offset,
  shift,
  flip,
  type Placement,
} from '@floating-ui/dom';
import { classNames } from '../../utils';
import styles from '@email-builder/ui-components/src/molecules/Dropdown/dropdown.module.scss';

/**
 * Dropdown item
 */
export interface DropdownItem {
  /**
   * Display label
   */
  label: string;

  /**
   * Item value
   */
  value: any;

  /**
   * Whether item is disabled
   */
  disabled?: boolean;

  /**
   * Additional data
   */
  [key: string]: any;
}

/**
 * SolidJS Dropdown props
 */
export interface DropdownProps {
  /**
   * Array of dropdown items
   */
  items: DropdownItem[];

  /**
   * Currently selected item
   */
  selectedItem?: DropdownItem | null;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Whether dropdown starts open
   */
  startOpen?: boolean;

  /**
   * Placement for floating dropdown
   */
  placement?: Placement;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Change callback
   */
  onChange?: (item: DropdownItem | null) => void;

  /**
   * Open/close callback
   */
  onToggle?: (isOpen: boolean) => void;
}

/**
 * Default props
 */
const defaultProps: Partial<DropdownProps> = {
  placeholder: 'Select an item',
  size: 'md',
  startOpen: false,
  placement: 'bottom-start',
};

/**
 * SolidJS Dropdown Component
 */
export const Dropdown: Component<DropdownProps> = (props) => {
  const merged = mergeProps(defaultProps, props);
  const [local] = splitProps(merged, [
    'items',
    'selectedItem',
    'placeholder',
    'size',
    'startOpen',
    'placement',
    'className',
    'onChange',
    'onToggle',
  ]);

  const [isOpen, setIsOpen] = createSignal(local.startOpen ?? false);
  let controlRef: HTMLButtonElement | undefined;
  let menuRef: HTMLDivElement | undefined;
  let cleanupAutoUpdate: (() => void) | undefined;

  /**
   * Setup positioning
   */
  const setupPositioning = () => {
    if (!controlRef || !menuRef) return;

    cleanupAutoUpdate = autoUpdate(controlRef, menuRef, async () => {
      if (!controlRef || !menuRef) return;

      const position = await computePosition(controlRef, menuRef, {
        ...(local.placement ? { placement: local.placement } : {}),
        middleware: [offset(8), flip(), shift({ padding: 8 })],
      });

      Object.assign(menuRef.style, {
        left: `${position.x}px`,
        top: `${position.y}px`,
      });
    });
  };

  /**
   * Toggle dropdown
   */
  const toggleDropdown = () => {
    const newState = !isOpen();
    setIsOpen(newState);
    local.onToggle?.(newState);
  };

  /**
   * Handle item click
   */
  const handleItemClick = (item: DropdownItem) => {
    if (item.disabled) return;

    local.onChange?.(item);
    setIsOpen(false);
    local.onToggle?.(false);
  };

  /**
   * Handle click outside
   */
  const handleClickOutside = (e: MouseEvent) => {
    if (
      controlRef &&
      menuRef &&
      !controlRef.contains(e.target as Node) &&
      !menuRef.contains(e.target as Node)
    ) {
      setIsOpen(false);
      local.onToggle?.(false);
    }
  };

  // Setup/cleanup positioning and click outside listener
  createEffect(() => {
    if (isOpen()) {
      setupPositioning();
      document.addEventListener('click', handleClickOutside);
    } else {
      if (cleanupAutoUpdate) {
        cleanupAutoUpdate();
        cleanupAutoUpdate = undefined;
      }
      document.removeEventListener('click', handleClickOutside);
    }
  });

  onCleanup(() => {
    if (cleanupAutoUpdate) {
      cleanupAutoUpdate();
    }
    document.removeEventListener('click', handleClickOutside);
  });

  const getControlClasses = () => {
    return classNames(
      styles.dropdown__control,
      styles[`dropdown__control--${local.size}`],
      isOpen() && styles['dropdown__control--open'],
      local.className
    );
  };

  const getMenuClasses = () => {
    return classNames(
      styles.dropdown__menu,
      isOpen() && styles['dropdown__menu--open']
    );
  };

  const getItemClasses = (item: DropdownItem) => {
    return classNames(
      styles.dropdown__item,
      item.disabled && styles['dropdown__item--disabled'],
      local.selectedItem?.value === item.value && styles['dropdown__item--selected']
    );
  };

  return (
    <div class={styles.dropdown}>
      <button
        ref={controlRef}
        type="button"
        class={getControlClasses()}
        onClick={toggleDropdown}
      >
        <span class={styles.dropdown__value}>
          {local.selectedItem?.label ?? local.placeholder}
        </span>
        <i
          class={classNames(
            styles.dropdown__arrow,
            isOpen() ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'
          )}
        />
      </button>

      <Show when={isOpen()}>
        <div ref={menuRef} class={getMenuClasses()}>
          <For each={local.items}>
            {(item) => (
              <div
                class={getItemClasses(item)}
                onClick={() => handleItemClick(item)}
              >
                {item.label}
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};
