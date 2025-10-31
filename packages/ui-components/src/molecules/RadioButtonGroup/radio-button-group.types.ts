/**
 * RadioButtonGroup component types
 */

import type { RadioButtonGroupItem } from './RadioButtonGroupItem';

/**
 * Callback fired when a radio button group item changes
 */
export type RadioButtonGroupItemChangeCallback = (
  isSelected: boolean,
  item: RadioButtonGroupItem
) => void;

/**
 * Callback fired when a radio button group item is clicked
 */
export type RadioButtonGroupItemClickCallback = (item: RadioButtonGroupItem) => void;

/**
 * Callback fired when the radio button group selection changes
 */
export type RadioButtonGroupChangeCallback = (
  allSelected: boolean,
  changedItem: RadioButtonGroupItem,
  selectedItems: RadioButtonGroupItem[],
  noneSelected: boolean
) => void;

/**
 * Configuration for RadioButtonGroupItem
 */
export interface RadioButtonGroupItemConfig {
  /**
   * The value of the item
   */
  value: string | number;

  /**
   * Whether the item is initially selected
   * @default false
   */
  selected?: boolean;

  /**
   * The label text or HTML element
   */
  label?: string | HTMLElement;

  /**
   * The icon HTML string or element
   */
  icon?: string | HTMLElement;

  /**
   * Tooltip description text
   */
  description?: string;

  /**
   * Additional CSS classes for the root element
   */
  class?: string;

  /**
   * Whether to toggle selection on click
   * @default true
   */
  changeOnClick?: boolean;

  /**
   * Whether to show active border styling when selected
   * @default true
   */
  useActiveBorder?: boolean;

  /**
   * Callback fired when selection changes
   */
  onChange?: RadioButtonGroupItemChangeCallback;

  /**
   * Callback fired when item is clicked (before selection change)
   */
  onClick?: RadioButtonGroupItemClickCallback;
}

/**
 * Configuration for RadioButtonGroup
 */
export interface RadioButtonGroupConfig {
  /**
   * Array of radio button items or item configs
   */
  items: (RadioButtonGroupItem | RadioButtonGroupItemConfig)[];

  /**
   * Whether only one item can be selected at a time
   * @default false
   */
  singleSelection?: boolean;

  /**
   * Whether to allow no items to be selected
   * @default true
   */
  allowNoSelection?: boolean;

  /**
   * Whether to link items with the same value
   * When true, selecting/deselecting an item will select/deselect all items with the same value
   * @default true
   */
  linkItemsWithSameValue?: boolean;

  /**
   * Additional CSS classes for the root element
   */
  class?: string;

  /**
   * Callback fired when selection changes
   */
  onChange?: RadioButtonGroupChangeCallback;
}
