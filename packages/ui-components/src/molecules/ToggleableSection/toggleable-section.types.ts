/**
 * Content that can be rendered in the component
 * Can be a string (HTML or text) or an HTMLElement or array of elements
 */
export type ElementContent = string | HTMLElement | HTMLElement[];

/**
 * Type of section (affects styling)
 */
export type ToggleableSectionType = 'section' | string;

/**
 * Event types emitted by ToggleableSection
 */
export type ToggleableSectionEvent = 'toggle' | 'open' | 'close';

/**
 * Callback function for toggle event
 * @param isActive - Current active state of toggle button
 * @param section - The ToggleableSection instance
 */
export type ToggleCallback = (isActive: boolean, section: IToggleableSection) => void;

/**
 * Callback function for open/close events
 * @param section - The ToggleableSection instance
 */
export type OpenCloseCallback = (section: IToggleableSection) => void;

/**
 * Callback function for ToggleableSection events
 */
export type ToggleableSectionEventCallback = ToggleCallback | OpenCloseCallback;

/**
 * Configuration options for ToggleableSection component
 */
export interface ToggleableSectionOptions {
  /**
   * Custom tag name for the root element
   * @default 'div'
   */
  tagName?: string;

  /**
   * Type of section (affects CSS classes)
   * @default 'section'
   */
  type?: ToggleableSectionType;

  /**
   * Label text or HTML content
   */
  label?: ElementContent;

  /**
   * Content text or HTML
   */
  content?: ElementContent;

  /**
   * Additional CSS classes for the root element
   */
  extendedClasses?: string;

  /**
   * Additional CSS classes for the label element
   */
  labelExtendedClasses?: string;

  /**
   * Additional CSS classes for the content element
   */
  contentExtendedClasses?: string;

  /**
   * Additional CSS classes for the toggle label element
   */
  toggleLabelExtendedClasses?: string;

  /**
   * Whether the content can be toggled open/closed
   * @default false
   */
  toggleableContent?: boolean;

  /**
   * Description text shown in a tooltip next to the label
   */
  description?: string;

  /**
   * Whether the section starts in the open state
   * @default false
   */
  startOpen?: boolean;

  /**
   * Label text for the toggle button
   */
  toggleLabel?: ElementContent;

  /**
   * When true, toggle ON shows content; when false, toggle ON hides content
   * @default true
   */
  toggleOnShowsContent?: boolean;

  /**
   * Callback function called when the toggle button state changes
   */
  onToggle?: ToggleCallback;

  /**
   * Callback function called when the section opens
   */
  onOpen?: OpenCloseCallback;

  /**
   * Callback function called when the section closes
   */
  onClose?: OpenCloseCallback;
}

/**
 * Internal EventEmitter interface
 */
export interface EventEmitter {
  on(event: string, callback: (...args: unknown[]) => void): void;
  off(event: string, callback: (...args: unknown[]) => void): void;
  emit(event: string, ...args: unknown[]): void;
}

/**
 * Public API for ToggleableSection component
 */
export interface IToggleableSection {
  /**
   * Get the root element
   */
  getEl(): HTMLElement;

  /**
   * Open the section (show content)
   */
  open(): void;

  /**
   * Close the section (hide content)
   */
  close(): void;

  /**
   * Check if the section is currently open
   */
  isOpenState(): boolean;

  /**
   * Register an event listener
   * @param event - Event name
   * @param callback - Callback function
   */
  on(event: ToggleableSectionEvent, callback: ToggleableSectionEventCallback): void;

  /**
   * Unregister an event listener
   * @param event - Event name
   * @param callback - Callback function
   */
  off(event: ToggleableSectionEvent, callback: ToggleableSectionEventCallback): void;

  /**
   * Destroy the component and clean up
   */
  destroy(): void;
}
