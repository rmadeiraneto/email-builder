/**
 * Dropdown item types
 */

/**
 * Callback function for item events
 */
export type DropdownItemCallback = (item: unknown, value: unknown) => void;

/**
 * Dropdown item properties
 */
export interface DropdownItemProps {
  /**
   * Whether the item should start as active
   * @default false
   */
  active?: boolean;

  /**
   * CSS class prefix to add to all classes
   * @default ''
   */
  classPrefix?: string;

  /**
   * Base CSS class for the item
   * @default 'dropdown-item'
   */
  cssClass?: string;

  /**
   * Additional CSS classes
   * @default ''
   */
  extendedClasses?: string;

  /**
   * Content to display in the item
   */
  content?: HTMLElement | string;

  /**
   * Callback when item is selected
   */
  onSelect?: DropdownItemCallback | null;

  /**
   * Callback when item is deselected
   */
  onDeselect?: DropdownItemCallback | null;

  /**
   * Callback when item is clicked
   */
  onClick?: DropdownItemCallback | null;

  /**
   * Value associated with the item
   */
  value?: unknown;

  /**
   * Whether this is the default item
   * @default false
   */
  isDefault?: boolean;
}
