/**
 * Accordion color variants
 */
export type AccordionColor = 'primary' | 'grey' | 'grey-outline';

/**
 * Accordion type variants
 */
export type AccordionType = 'normal' | 'extend';

/**
 * Accordion event types
 */
export type AccordionEvent = 'open' | 'close' | 'toggle';

/**
 * Accordion event callback
 */
export type AccordionEventCallback = (accordion: Accordion) => void;

/**
 * Accordion configuration
 */
export interface AccordionConfig {
  /**
   * Title content for the accordion header
   * Can be text, HTML string, or HTMLElement
   */
  title: string | HTMLElement;

  /**
   * Content to display in the accordion body
   * Can be text, HTML string, or HTMLElement
   */
  content: string | HTMLElement;

  /**
   * Color variant
   * @default 'primary'
   */
  accordionColor?: AccordionColor;

  /**
   * Type variant (affects padding)
   * @default 'normal'
   */
  accordionType?: AccordionType;

  /**
   * Additional CSS classes for the accordion container
   */
  extendedClasses?: string;

  /**
   * Additional CSS classes for the content area
   */
  contentExtendedClasses?: string;

  /**
   * Arrow icon to show when closed
   * Can be HTML string or HTMLElement
   * @default down arrow icon
   */
  arrowDown?: string | HTMLElement;

  /**
   * Arrow icon to show when open
   * Can be HTML string or HTMLElement
   * @default up arrow icon
   */
  arrowUp?: string | HTMLElement;

  /**
   * Whether to use arrow up icon when accordion is open
   * If false, uses arrow down when open
   * @default true
   */
  useArrowUpWhenOpen?: boolean;

  /**
   * Whether the accordion should start in open state
   * @default false
   */
  startOpen?: boolean;

  /**
   * Element to append the accordion to
   * If not provided, use getEl() to get the element and append it manually
   */
  appendTo?: HTMLElement;
}

/**
 * Accordion component props (for external use)
 */
export interface AccordionProps extends AccordionConfig {}

/**
 * Import for Accordion class to avoid circular dependency
 */
import type { Accordion } from './Accordion';
