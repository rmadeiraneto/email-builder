/**
 * Section component type definitions
 */

/**
 * Options for configuring the Section component
 */
export interface SectionOptions {
  /**
   * CSS class name for the section
   * @default 'section'
   */
  cssClass?: string;

  /**
   * Class prefix for namespacing
   * @default 'eb-'
   */
  classPrefix?: string;

  /**
   * Additional CSS classes to apply
   * @default ''
   */
  extendedClasses?: string;

  /**
   * HTML tag name for the section element
   * @default 'div'
   */
  tagName?: keyof HTMLElementTagNameMap;

  /**
   * Label text or element to display
   * @default null
   */
  label?: string | HTMLElement | null;

  /**
   * Initial content to add to the section
   * Can be a string, HTMLElement, or array of elements
   * @default null
   */
  content?: string | HTMLElement | HTMLElement[] | null;
}

/**
 * Section element interface with extended methods
 */
export interface SectionElement extends HTMLElement {
  /**
   * Add content to the section
   * @param element - Element to add
   */
  addContent(element: HTMLElement | string): HTMLElement;

  /**
   * Remove content from the section
   * @param element - Element to remove
   */
  removeContent(element: HTMLElement): HTMLElement;

  /**
   * Check if section contains an element
   * @param element - Element to check
   */
  hasContent(element: HTMLElement): boolean;

  /**
   * Toggle content visibility
   * @param element - Element to toggle
   */
  toggleContent(element: HTMLElement): void;
}
