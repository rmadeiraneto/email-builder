/**
 * Content type for elements - can be a string, HTMLElement, or array of HTMLElements
 */
export type ElementContent = string | HTMLElement | HTMLElement[];

/**
 * Configuration options for the SectionItem component
 */
export interface SectionItemOptions {
  /**
   * Content for the label element
   * Can be HTML string, HTMLElement, or array of HTMLElements
   */
  label?: ElementContent;

  /**
   * Content for the content section
   * Can be HTML string, HTMLElement, or array of HTMLElements
   */
  content?: ElementContent;

  /**
   * Description tooltip that appears next to the label
   * Creates a tooltip icon with the provided description
   */
  description?: string;

  /**
   * HTML tag name for the root element
   * @default 'div'
   */
  tagName?: string;

  /**
   * Additional CSS classes to add to the root element
   * @default ''
   */
  extendedClasses?: string;

  /**
   * Additional CSS classes to add to the label element
   * @default ''
   */
  labelExtendedClasses?: string;

  /**
   * Additional CSS classes to add to the content element
   * @default ''
   */
  contentExtendedClasses?: string;

  /**
   * Whether the section item should start hidden
   * @default false
   */
  isHidden?: boolean;
}

/**
 * Interface for the SectionItem component
 */
export interface ISectionItem {
  /**
   * Show the section item
   */
  show(): void;

  /**
   * Hide the section item
   */
  hide(): void;

  /**
   * Get the root element
   */
  getEl(): HTMLElement;

  /**
   * Get the label element (if exists)
   */
  getLabel(): HTMLElement | undefined;

  /**
   * Get the content element (if exists)
   */
  getContent(): HTMLElement | undefined;

  /**
   * Clean up the component
   */
  destroy(): void;
}
