/**
 * Dropdown types
 */

import type { Placement } from '@floating-ui/dom';
import type { DropdownItem } from './DropdownItem';
import type { DropdownItemProps } from './dropdown-item.types';

/**
 * Dropdown change callback
 */
export type DropdownOnChangeCallback = (
  dropdown: unknown,
  activeItem: DropdownItem | null,
  isDefault?: boolean
) => void;

/**
 * Dropdown control click callback
 */
export type DropdownOnControlClickCallback = (dropdown: unknown) => void;

/**
 * Dropdown reset callback
 */
export type DropdownOnResetCallback = (dropdown: unknown, defaultItem: DropdownItem | null) => void;

/**
 * Dropdown size options
 */
export type DropdownSize = 'sm' | 'md' | 'lg';

/**
 * Dropdown properties
 */
export interface DropdownProps {
  /**
   * Array of items for the dropdown
   * @default []
   */
  items?: (DropdownItem | DropdownItemProps)[];

  /**
   * The item that should start active
   * @default null
   */
  activeItem?: DropdownItem | DropdownItemProps | null;

  /**
   * CSS class prefix
   * @default ''
   */
  classPrefix?: string;

  /**
   * Base CSS class
   * @default 'dropdown'
   */
  cssClass?: string;

  /**
   * Additional CSS classes
   * @default ''
   */
  extendedClasses?: string;

  /**
   * Placeholder text when no item is selected
   * @default 'Select an item'
   */
  placeholder?: string;

  /**
   * Size of the dropdown
   * @default 'md'
   */
  size?: DropdownSize;

  /**
   * Size of the arrow icons
   * @default 'xl'
   */
  arrowSize?: string;

  /**
   * Arrow down icon (HTML string or element)
   */
  arrowDown?: string | HTMLElement;

  /**
   * Arrow up icon (HTML string or element)
   */
  arrowUp?: string | HTMLElement;

  /**
   * Callback when active item changes
   */
  onChange?: DropdownOnChangeCallback | null;

  /**
   * Callback when dropdown is reset
   */
  onReset?: DropdownOnResetCallback | null;

  /**
   * Callback when control is clicked
   */
  onControlClick?: DropdownOnControlClickCallback | null;

  /**
   * Whether to close dropdown when an item is clicked
   * @default true
   */
  closeDropdownOnItemClick?: boolean;

  /**
   * Whether to toggle dropdown on control click (false = only open)
   * @default true
   */
  toggleDropdownOnControlClick?: boolean;

  /**
   * Whether to prevent default on control click
   * @default false
   */
  onControlClickPreventDefault?: boolean;

  /**
   * Whether to stop propagation on control click
   * @default false
   */
  onControlClickStopPropagation?: boolean;

  /**
   * Whether dropdown should start opened
   * @default false
   */
  startOpened?: boolean;

  /**
   * If true, opened state shows arrow up, closed shows arrow down
   * @default true
   */
  openShowsArrowUp?: boolean;

  /**
   * Whether to close dropdown when clicking outside
   * @default true
   */
  closeDropdownOnWindowClick?: boolean;

  /**
   * Whether the dropdown can be reset to default item
   * @default false
   */
  resettable?: boolean;

  /**
   * Whether to trigger onChange when default item is activated
   * @default true
   */
  triggerOnChangeOnDefaultItemActivation?: boolean;

  /**
   * Whether to trigger onChange when starting item is activated during initialization
   * @default false
   */
  triggerOnChangeOnStartingItemActivation?: boolean;

  /**
   * Whether to use floating-ui for positioning
   * @default true
   */
  useFloater?: boolean;

  /**
   * Placement for floating dropdown
   * @default 'bottom-start'
   */
  placement?: Placement;
}
