/**
 * ChoosableSection types
 */

/**
 * Item selection callback
 */
export type ChoosableSectionItemCallback = (item: ChoosableSectionItem) => void;

/**
 * Individual item in the choosable section
 */
export interface ChoosableSectionItem {
  /**
   * Whether this item should start as active
   * @default false
   */
  active?: boolean;

  /**
   * Label displayed in the dropdown for this item
   */
  label: string | HTMLElement;

  /**
   * Content to display when this item is selected
   * Can be a string, HTMLElement, or function that returns content
   */
  content: string | HTMLElement | (() => string | HTMLElement);

  /**
   * Callback when this item is selected
   */
  onSelect?: ChoosableSectionItemCallback | null;

  /**
   * Callback when this item is deselected
   */
  onDeselect?: ChoosableSectionItemCallback | null;
}

/**
 * Change event callback
 */
export type ChoosableSectionOnChangeCallback = (item: ChoosableSectionItem) => void;

/**
 * ChoosableSection properties
 */
export interface ChoosableSectionProps {
  /**
   * Base CSS class name
   * @default 'choosable-section'
   */
  className?: string;

  /**
   * CSS class prefix for all elements
   * @default ''
   */
  classPrefix?: string;

  /**
   * Additional CSS classes for root element
   * @default ''
   */
  extendedClasses?: string;

  /**
   * HTML tag name for root element
   * @default 'div'
   */
  tagName?: string;

  /**
   * Main label for the section
   */
  label?: string | HTMLElement | null;

  /**
   * Array of items that can be chosen
   * @default []
   */
  items?: ChoosableSectionItem[];

  /**
   * Additional CSS classes for the main label
   * @default ''
   */
  labelExtendedClasses?: string;

  /**
   * Additional CSS classes for the content area
   * @default ''
   */
  contentExtendedClasses?: string;

  /**
   * Callback when the selected item changes
   */
  onChange?: ChoosableSectionOnChangeCallback | null;

  /**
   * Label for the dropdown control
   */
  dropdownLabel?: string | HTMLElement | null;

  /**
   * Additional CSS classes for the dropdown label
   * @default ''
   */
  dropdownLabelExtendedClasses?: string;
}
