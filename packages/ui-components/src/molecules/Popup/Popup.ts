/**
 * Popup Component
 *
 * A simple popup/modal overlay component with optional header,
 * title, close button, and customizable content.
 *
 * @example
 * ```ts
 * const popup = new Popup({
 *   title: 'My Popup',
 *   content: 'Popup content here',
 *   centerPopup: true,
 *   startOpen: true
 * });
 *
 * document.body.appendChild(popup.getEl());
 * ```
 */

import { Button } from '../../atoms/Button';
import type {
  PopupOptions,
  PopupContent,
  PopupEventType,
  PopupEventCallback,
  PopupEventEmitter
} from './popup.types';
import styles from './popup.module.scss';

/**
 * Simple EventEmitter implementation
 */
class EventEmitter implements PopupEventEmitter {
  private events: Map<string, PopupEventCallback[]> = new Map();

  on(event: string, callback: PopupEventCallback): void {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(callback);
  }

  off(event: string, callback: PopupEventCallback): void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event: string, ...args: unknown[]): void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(...(args as Parameters<PopupEventCallback>)));
    }
  }

  clear(): void {
    this.events.clear();
  }
}

/**
 * Sets content on an element
 */
function setContent(element: HTMLElement, content: PopupContent | PopupContent[] | null): HTMLElement {
  element.innerHTML = '';

  if (content === null || content === undefined) {
    return element;
  }

  if (Array.isArray(content)) {
    content.forEach(item => {
      if (item instanceof HTMLElement) {
        element.appendChild(item);
      } else if (typeof item === 'string') {
        element.insertAdjacentHTML('beforeend', item);
      }
    });
  } else if (content instanceof HTMLElement) {
    element.appendChild(content);
  } else if (typeof content === 'string') {
    element.innerHTML = content;
  }

  return element;
}

/**
 * Merges default options with user options
 */
function merge<T extends Record<string, any>>(defaults: T, options: Partial<T>): T {
  return { ...defaults, ...options };
}

/**
 * Popup Component
 *
 * Displays a fixed-position popup/modal with optional header, title,
 * close button, and content. Supports centering and event system.
 */
export class Popup {
  private opts: Required<PopupOptions>;
  private eventEmitter: EventEmitter;
  private element!: HTMLDivElement;
  private header?: HTMLDivElement;
  private titleWrapper?: HTMLDivElement;
  private closeWrapper?: HTMLDivElement;
  private closeButton?: HTMLButtonElement;
  private content!: HTMLDivElement;
  private isOpen: boolean = false;

  constructor(opts: PopupOptions = {}) {
    const defaults: Required<PopupOptions> = {
      classPrefix: 'eb-',
      cssClass: 'popup',
      extendedClasses: '',
      title: null,
      content: null,
      contentExtendedClasses: '',
      closeIcon: this.createDefaultCloseIcon(),
      useCloseButton: true,
      preventCloseButtonDefault: false,
      startOpen: false,
      centerPopup: false
    };

    this.opts = merge(defaults, opts) as Required<PopupOptions>;
    this.eventEmitter = new EventEmitter();

    this.init();
  }

  /**
   * Creates a default close icon (simple X)
   */
  private createDefaultCloseIcon(): HTMLElement {
    const icon = document.createElement('span');
    icon.innerHTML = '×';
    icon.style.fontSize = '24px';
    icon.style.lineHeight = '1';
    return icon;
  }

  /**
   * Initializes the popup component
   */
  private init(): void {
    this.element = document.createElement('div');
    this.element.className = styles.popup ?? '';

    if (this.opts.extendedClasses) {
      this.opts.extendedClasses.split(' ').filter(Boolean).forEach(cls => {
        this.element.classList.add(cls);
      });
    }

    if (this.opts.centerPopup) {
      const centerClass = styles['popup--center'];
      if (centerClass) {
        this.element.classList.add(centerClass);
      }
    }

    if (this.opts.title || this.opts.useCloseButton) {
      this.createHeader();
    }

    if (this.opts.startOpen) {
      this.open();
    } else {
      this.close();
    }

    this.content = document.createElement('div');
    this.content.className = styles.popup__content ?? '';

    if (this.opts.contentExtendedClasses) {
      this.opts.contentExtendedClasses.split(' ').filter(Boolean).forEach(cls => {
        this.content.classList.add(cls);
      });
    }

    setContent(this.content, this.opts.content);

    this.draw();
    this.eventEmitter.emit('init', this);
  }

  /**
   * Draws/updates the popup DOM structure
   */
  private draw(): void {
    const children: HTMLElement[] = [];

    if (this.header) {
      children.push(this.header);
    }

    children.push(this.content);

    setContent(this.element, children);
  }

  /**
   * Creates the header with title and close button
   */
  private createHeader(): void {
    this.header = document.createElement('div');
    this.header.className = styles.popup__header ?? '';

    this.titleWrapper = document.createElement('div');
    this.titleWrapper.className = styles.popup__title ?? '';

    this.closeWrapper = document.createElement('div');
    this.closeWrapper.className = styles.popup__close ?? '';

    // Create close button using Button component
    const buttonInstance = new Button({
      children: '',
      variant: 'ghost',
      size: 'small',
      onClick: () => {
        if (!this.opts.preventCloseButtonDefault) {
          this.close();
        }
      }
    });

    this.closeButton = buttonInstance.render();

    // Add the close icon to the button
    this.closeButton.innerHTML = '';
    this.closeButton.appendChild(this.opts.closeIcon);

    const headerChildren: HTMLElement[] = [];

    if (this.opts.title) {
      setContent(this.titleWrapper, this.opts.title);
      headerChildren.push(this.titleWrapper);
    } else {
      headerChildren.push(this.titleWrapper);
    }

    if (this.opts.useCloseButton) {
      setContent(this.closeWrapper, this.closeButton);
      headerChildren.push(this.closeWrapper);
    }

    setContent(this.header, headerChildren);
  }

  /**
   * Toggles the popup open/closed
   */
  toggle(): void {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Opens the popup
   */
  open(): void {
    const openClass = styles['popup--open'];
    if (openClass) {
      this.element.classList.add(openClass);
    }
    this.isOpen = true;
    this.eventEmitter.emit('open', this);
  }

  /**
   * Closes the popup
   */
  close(): void {
    const openClass = styles['popup--open'];
    if (openClass) {
      this.element.classList.remove(openClass);
    }
    this.isOpen = false;
    this.eventEmitter.emit('close', this);
  }

  /**
   * Sets the title content
   */
  setTitle(title: PopupContent): void {
    if (this.titleWrapper) {
      setContent(this.titleWrapper, title);
    }
  }

  /**
   * Gets the title HTML content
   */
  getTitle(): string {
    return this.titleWrapper?.innerHTML ?? '';
  }

  /**
   * Gets the content child nodes
   */
  getContent(): NodeListOf<ChildNode> | ChildNode[] {
    return this.content.childNodes;
  }

  /**
   * Gets the popup DOM element
   */
  getEl(): HTMLElement {
    return this.element;
  }

  /**
   * Checks if popup is currently open
   */
  getIsOpen(): boolean {
    return this.isOpen;
  }

  /**
   * Registers an event listener
   */
  on(event: PopupEventType, callback: PopupEventCallback): void {
    this.eventEmitter.on(event, callback);
  }

  /**
   * Removes an event listener
   */
  off(event: PopupEventType, callback: PopupEventCallback): void {
    this.eventEmitter.off(event, callback);
  }

  /**
   * Destroys the popup and cleans up
   */
  destroy(): void {
    this.eventEmitter.clear();
    this.element.remove();
  }
}
