import styles from './accordion.module.scss';
import type {
  AccordionConfig,
  AccordionColor,
  AccordionType,
  AccordionEvent,
  AccordionEventCallback,
} from './accordion.types';

/**
 * Accordion component for collapsible content sections
 *
 * Provides an expandable/collapsible panel with a header and content area.
 * Supports multiple color variants, custom icons, and event callbacks.
 *
 * @example
 * Basic usage:
 * ```ts
 * const accordion = new Accordion({
 *   title: 'Section Title',
 *   content: 'Section content goes here'
 * });
 * document.body.appendChild(accordion.getEl());
 * ```
 *
 * @example
 * With custom styling and callbacks:
 * ```ts
 * const accordion = new Accordion({
 *   title: 'Settings',
 *   content: '<div>Settings content</div>',
 *   accordionColor: 'grey',
 *   startOpen: true
 * });
 *
 * accordion.on('open', () => console.log('Accordion opened'));
 * accordion.on('close', () => console.log('Accordion closed'));
 * ```
 */
export class Accordion {
  private config: Required<
    Omit<AccordionConfig, 'appendTo' | 'extendedClasses' | 'contentExtendedClasses'>
  > & {
    extendedClasses: string;
    contentExtendedClasses: string;
  };
  private element: HTMLElement;
  private control: HTMLElement;
  private controlInner: HTMLElement;
  private arrowWrapper: HTMLElement;
  private content: HTMLElement;
  private _isOpen: boolean = false;
  private eventCallbacks: Map<AccordionEvent, Set<AccordionEventCallback>> = new Map();

  constructor(config: AccordionConfig) {
    if (config.title === undefined || config.title === null || config.content === undefined || config.content === null) {
      throw new Error('You must pass title and content to Accordion');
    }

    // Default arrow icons (simple SVG arrows)
    const defaultArrowDown = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 15L7 10H17L12 15Z" fill="currentColor"/>
    </svg>`;

    const defaultArrowUp = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 9L17 14H7L12 9Z" fill="currentColor"/>
    </svg>`;

    this.config = {
      title: config.title,
      content: config.content,
      accordionColor: config.accordionColor ?? 'primary',
      accordionType: config.accordionType ?? 'normal',
      extendedClasses: config.extendedClasses ?? '',
      contentExtendedClasses: config.contentExtendedClasses ?? '',
      arrowDown: config.arrowDown ?? defaultArrowDown,
      arrowUp: config.arrowUp ?? defaultArrowUp,
      useArrowUpWhenOpen: config.useArrowUpWhenOpen ?? true,
      startOpen: config.startOpen ?? false,
    };

    this.element = this.createElement();
    this.control = this.createControl();
    this.controlInner = this.createControlInner();
    this.arrowWrapper = this.createArrowWrapper();
    this.content = this.createContent();

    this.control.appendChild(this.controlInner);
    this.control.appendChild(this.arrowWrapper);
    this.element.appendChild(this.control);
    this.element.appendChild(this.content);

    this.control.addEventListener('click', this.toggle.bind(this));

    if (this.config.startOpen) {
      this.open();
    } else {
      this.close();
    }

    if (config.appendTo) {
      config.appendTo.appendChild(this.element);
    }

    this.emit('init');
  }

  /**
   * Get the root element of the accordion
   */
  getEl(): HTMLElement {
    return this.element;
  }

  /**
   * Check if accordion is open
   */
  isOpenState(): boolean {
    return this._isOpen;
  }

  /**
   * Toggle accordion open/closed state
   */
  toggle(): void {
    if (this._isOpen) {
      this.close();
    } else {
      this.open();
    }
    this.emit('toggle');
  }

  /**
   * Open the accordion
   */
  open(): void {
    this.element.classList.add(styles['accordion--open']);

    if (this.config.useArrowUpWhenOpen) {
      this.showArrowUp();
    } else {
      this.showArrowDown();
    }

    this._isOpen = true;
    this.emit('open');
  }

  /**
   * Close the accordion
   */
  close(): void {
    this.element.classList.remove(styles['accordion--open']);

    if (this.config.useArrowUpWhenOpen) {
      this.showArrowDown();
    } else {
      this.showArrowUp();
    }

    this._isOpen = false;
    this.emit('close');
  }

  /**
   * Set the title content
   */
  setTitle(title: string | HTMLElement): void {
    this.controlInner.innerHTML = '';
    if (typeof title === 'string') {
      this.controlInner.innerHTML = title;
    } else {
      this.controlInner.appendChild(title);
    }
  }

  /**
   * Get the title content
   */
  getTitle(): string {
    return this.control.innerHTML;
  }

  /**
   * Get the content nodes
   */
  getContent(): NodeList {
    return this.content.childNodes;
  }

  /**
   * Register an event callback
   */
  on(event: AccordionEvent, callback: AccordionEventCallback): void {
    if (!this.eventCallbacks.has(event)) {
      this.eventCallbacks.set(event, new Set());
    }
    this.eventCallbacks.get(event)!.add(callback);
  }

  /**
   * Unregister an event callback
   */
  off(event: AccordionEvent, callback: AccordionEventCallback): void {
    const callbacks = this.eventCallbacks.get(event);
    if (callbacks) {
      callbacks.delete(callback);
    }
  }

  /**
   * Destroy the accordion and clean up
   */
  destroy(): void {
    this.control.removeEventListener('click', this.toggle.bind(this));
    this.eventCallbacks.clear();
    this.element.remove();
  }

  private createElement(): HTMLElement {
    const element = document.createElement('div');
    element.className = `${styles.accordion}${
      this.config.extendedClasses ? ' ' + this.config.extendedClasses : ''
    }`;

    // Add color variant class
    const colorClass = styles[`accordion--${this.config.accordionColor}`];
    if (colorClass) {
      element.classList.add(colorClass);
    }

    // Add type variant class
    const typeClass = styles[`accordion--${this.config.accordionType}`];
    if (typeClass) {
      element.classList.add(typeClass);
    }

    return element;
  }

  private createControl(): HTMLElement {
    const control = document.createElement('div');
    control.className = styles.accordion__control;
    return control;
  }

  private createControlInner(): HTMLElement {
    const controlInner = document.createElement('div');
    controlInner.className = styles.accordion__controlInner;

    if (typeof this.config.title === 'string') {
      controlInner.innerHTML = this.config.title;
    } else {
      controlInner.appendChild(this.config.title);
    }

    return controlInner;
  }

  private createArrowWrapper(): HTMLElement {
    const arrowWrapper = document.createElement('div');
    arrowWrapper.className = styles.accordion__arrow;
    return arrowWrapper;
  }

  private createContent(): HTMLElement {
    const content = document.createElement('div');
    content.className = `${styles.accordion__content}${
      this.config.contentExtendedClasses ? ' ' + this.config.contentExtendedClasses : ''
    }`;

    if (typeof this.config.content === 'string') {
      content.innerHTML = this.config.content;
    } else {
      content.appendChild(this.config.content);
    }

    return content;
  }

  private showArrowUp(): void {
    this.arrowWrapper.innerHTML = '';
    if (typeof this.config.arrowUp === 'string') {
      this.arrowWrapper.innerHTML = this.config.arrowUp;
    } else {
      this.arrowWrapper.appendChild(this.config.arrowUp);
    }
  }

  private showArrowDown(): void {
    this.arrowWrapper.innerHTML = '';
    if (typeof this.config.arrowDown === 'string') {
      this.arrowWrapper.innerHTML = this.config.arrowDown;
    } else {
      this.arrowWrapper.appendChild(this.config.arrowDown);
    }
  }

  private emit(event: AccordionEvent): void {
    const callbacks = this.eventCallbacks.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(this));
    }
  }
}
