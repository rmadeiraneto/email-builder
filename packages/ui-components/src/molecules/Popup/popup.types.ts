/**
 * Popup Component Types
 *
 * Type definitions for the Popup molecule component.
 */

/**
 * Content that can be rendered in the popup
 * Can be a string, HTMLElement, or array of elements
 */
export type PopupContent = string | HTMLElement | HTMLElement[];

/**
 * Events emitted by the Popup component
 */
export type PopupEventType = 'init' | 'open' | 'close';

/**
 * Event callback function
 */
export type PopupEventCallback = (popup: any) => void;

/**
 * Configuration options for the Popup component
 */
export interface PopupOptions {
  /**
   * Class prefix for BEM naming
   * @default 'eb-'
   */
  classPrefix?: string;

  /**
   * Base CSS class name
   * @default 'popup'
   */
  cssClass?: string;

  /**
   * Additional CSS classes to apply
   * @default ''
   */
  extendedClasses?: string;

  /**
   * Popup title content
   * Can be a string or HTMLElement
   * @default null
   */
  title?: PopupContent | null;

  /**
   * Popup body content
   * Can be a string, HTMLElement, or array of elements
   * @default null
   */
  content?: PopupContent | null;

  /**
   * Additional CSS classes for content wrapper
   * @default ''
   */
  contentExtendedClasses?: string;

  /**
   * Icon for the close button
   * Should be an HTMLElement (icon)
   * @default getIcon('close-line', { size: 'md' })
   */
  closeIcon?: HTMLElement;

  /**
   * Whether to show the close button
   * @default true
   */
  useCloseButton?: boolean;

  /**
   * Whether to prevent the default close button behavior
   * If true, clicking close button won't close the popup
   * Use this to add custom close logic via events
   * @default false
   */
  preventCloseButtonDefault?: boolean;

  /**
   * Whether the popup should be open on initialization
   * @default false
   */
  startOpen?: boolean;

  /**
   * Whether to center the popup in the viewport
   * @default false
   */
  centerPopup?: boolean;
}

/**
 * Internal event emitter interface
 */
export interface PopupEventEmitter {
  on(event: string, callback: PopupEventCallback): void;
  off(event: string, callback: PopupEventCallback): void;
  emit(event: string, ...args: any[]): void;
  clear(): void;
}
