/**
 * Content type for elements - can be a string, HTMLElement, or array of HTMLElements
 */
export type ElementContent = string | HTMLElement | HTMLElement[];

/**
 * Configuration options for the ExpandCollapse component
 */
export interface ExpandCollapseOptions {
  /**
   * Content for the expandable section
   * Can be HTML string, HTMLElement, or array of HTMLElements
   */
  expandable?: ElementContent;

  /**
   * Content for the trigger element (that toggles expand/collapse)
   * Can be HTML string, HTMLElement, or array of HTMLElements
   */
  trigger?: ElementContent;

  /**
   * Additional CSS classes to add to the root element
   * @default ''
   */
  extendedClasses?: string;

  /**
   * Whether the component should start in expanded state
   * @default false
   */
  startExpanded?: boolean;

  /**
   * Whether to position expandable to the right instead of left
   * When true, the expandable content aligns to the right edge
   * @default false
   */
  rightToLeft?: boolean;

  /**
   * Prevent default click behavior on trigger
   * When true, clicking the trigger won't toggle the expandable
   * Useful when you want to control expand/collapse programmatically
   * @default false
   */
  preventDefaultBehavior?: boolean;

  /**
   * Base element to use instead of creating a new one
   * If provided, this element will be used as the container
   */
  element?: HTMLElement;
}

/**
 * Interface for the ExpandCollapse component
 */
export interface IExpandCollapse {
  /**
   * Expands the expandable content
   */
  expand(): void;

  /**
   * Collapses the expandable content
   */
  collapse(): void;

  /**
   * Gets the root element
   */
  getEl(): HTMLElement;

  /**
   * Gets the trigger element
   */
  getTrigger(): HTMLElement;

  /**
   * Gets the expandable element
   */
  getExpandable(): HTMLElement;

  /**
   * Checks if the component is currently expanded
   */
  isExpanded(): boolean;
}
