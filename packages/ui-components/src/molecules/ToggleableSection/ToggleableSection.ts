import styles from './toggleable-section.module.scss';
import { ToggleButton } from '../ToggleButton';
import { Tooltip } from '../Tooltip';
import type {
  ToggleableSectionOptions,
  IToggleableSection,
  ElementContent,
  ToggleableSectionEvent,
  ToggleableSectionEventCallback,
  EventEmitter,
} from './toggleable-section.types';

/**
 * Simple EventEmitter implementation
 */
class SimpleEventEmitter implements EventEmitter {
  private events: Map<string, Set<(...args: unknown[]) => void>> = new Map();

  on(event: string, callback: (...args: unknown[]) => void): void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(callback);
  }

  off(event: string, callback: (...args: unknown[]) => void): void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.delete(callback);
    }
  }

  emit(event: string, ...args: unknown[]): void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(...args));
    }
  }
}

/**
 * ToggleableSection Component
 *
 * A section with label and content that can optionally be toggled open/closed
 * with a toggle button. Supports description tooltips and custom toggle labels.
 *
 * @example
 * Basic section without toggle:
 * ```ts
 * const section = new ToggleableSection({
 *   label: 'Section Label',
 *   content: '<div>Section content</div>'
 * });
 * document.body.appendChild(section.getEl());
 * ```
 *
 * @example
 * Toggleable section with toggle button:
 * ```ts
 * const section = new ToggleableSection({
 *   label: 'Settings',
 *   content: '<div>Settings content</div>',
 *   toggleableContent: true,
 *   startOpen: false,
 *   toggleLabel: 'Enable',
 *   description: 'Configure your settings here'
 * });
 *
 * section.on('toggle', (isActive) => {
 *   console.log('Toggle state:', isActive);
 * });
 * ```
 *
 * @example
 * Inverted toggle behavior:
 * ```ts
 * const section = new ToggleableSection({
 *   label: 'Advanced Options',
 *   content: '<div>Advanced content</div>',
 *   toggleableContent: true,
 *   toggleOnShowsContent: false, // Toggle OFF shows content
 *   startOpen: true
 * });
 * ```
 */
export class ToggleableSection implements IToggleableSection {
  private options: Required<
    Omit<
      ToggleableSectionOptions,
      | 'label'
      | 'content'
      | 'description'
      | 'toggleLabel'
      | 'onToggle'
      | 'onOpen'
      | 'onClose'
    >
  > & {
    label?: ElementContent;
    content?: ElementContent;
    description?: string;
    toggleLabel?: ElementContent;
    onToggle?: (isActive: boolean, section: IToggleableSection) => void;
    onOpen?: (section: IToggleableSection) => void;
    onClose?: (section: IToggleableSection) => void;
  };
  private element: HTMLElement;
  private labelEl: HTMLElement;
  private contentEl: HTMLElement;
  private toggleLabelEl?: HTMLElement;
  private toggleButton?: ToggleButton;
  private isOpen: boolean = false;
  private eventEmitter: EventEmitter;

  constructor(options: ToggleableSectionOptions = {}) {
    this.options = {
      tagName: options.tagName ?? 'div',
      type: options.type ?? 'section',
      ...(options.label !== undefined && { label: options.label }),
      ...(options.content !== undefined && { content: options.content }),
      extendedClasses: options.extendedClasses ?? '',
      labelExtendedClasses: options.labelExtendedClasses ?? '',
      contentExtendedClasses: options.contentExtendedClasses ?? '',
      toggleLabelExtendedClasses: options.toggleLabelExtendedClasses ?? '',
      toggleableContent: options.toggleableContent ?? false,
      ...(options.description !== undefined && { description: options.description }),
      startOpen: options.startOpen ?? false,
      ...(options.toggleLabel !== undefined && { toggleLabel: options.toggleLabel }),
      toggleOnShowsContent: options.toggleOnShowsContent ?? true,
      ...(options.onToggle !== undefined && { onToggle: options.onToggle }),
      ...(options.onOpen !== undefined && { onOpen: options.onOpen }),
      ...(options.onClose !== undefined && { onClose: options.onClose }),
    };

    this.eventEmitter = new SimpleEventEmitter();

    // Calculate initial open state
    this.isOpen =
      this.options.toggleableContent &&
      this.options.startOpen === this.options.toggleOnShowsContent;

    this.element = this.createElement();
    this.labelEl = this.createLabel();
    this.contentEl = this.createContent();

    if (this.options.toggleLabel) {
      this.toggleLabelEl = this.createToggleLabel();
    }

    if (this.options.toggleableContent) {
      this.createToggleButton();
    }

    this.init();
  }

  /**
   * Initialize the component
   */
  private init(): void {
    // Set initial open state
    if (this.isOpen || !this.options.toggleableContent) {
      this.open();
    }

    // Register callbacks as event listeners
    if (this.options.onToggle) {
      this.on('toggle', this.options.onToggle);
    }
    if (this.options.onOpen) {
      this.on('open', this.options.onOpen);
    }
    if (this.options.onClose) {
      this.on('close', this.options.onClose);
    }

    this.draw();
  }

  /**
   * Create the root element
   */
  private createElement(): HTMLElement {
    const element = document.createElement(this.options.tagName);
    element.className = this.getClassNames();
    return element;
  }

  /**
   * Get class names for the root element
   */
  private getClassNames(): string {
    const classes = [styles.toggleableSection ?? ''];

    if (this.options.type !== 'section') {
      const typeClass = styles[`toggleableSection--${this.options.type}`];
      if (typeClass) {
        classes.push(typeClass);
      }
    }

    if (this.options.extendedClasses) {
      classes.push(this.options.extendedClasses);
    }

    return classes.filter(Boolean).join(' ');
  }

  /**
   * Create the label element
   */
  private createLabel(): HTMLElement {
    const label = document.createElement('label');
    const classList = ['eb-label', styles.toggleableSection__label ?? ''];

    if (this.options.labelExtendedClasses) {
      classList.push(this.options.labelExtendedClasses);
    }

    label.className = classList.filter(Boolean).join(' ');
    this.setContent(label, this.options.label || '');

    // Add description tooltip if provided
    if (this.options.description) {
      const tooltip = new Tooltip({
        content: this.options.description,
      });
      label.appendChild(tooltip.getEl());
    }

    return label;
  }

  /**
   * Create the toggle label element
   */
  private createToggleLabel(): HTMLElement {
    const toggleLabel = document.createElement('label');
    const classList = ['eb-label', styles.toggleableSection__toggleLabel ?? ''];

    if (this.options.toggleLabelExtendedClasses) {
      classList.push(this.options.toggleLabelExtendedClasses);
    }

    toggleLabel.className = classList.filter(Boolean).join(' ');
    this.setContent(toggleLabel, this.options.toggleLabel || '');

    return toggleLabel;
  }

  /**
   * Create the content element
   */
  private createContent(): HTMLElement {
    const content = document.createElement('div');
    const classList = [styles.toggleableSection__content ?? ''];

    if (this.options.contentExtendedClasses) {
      classList.push(this.options.contentExtendedClasses);
    }

    content.className = classList.filter(Boolean).join(' ');
    this.setContent(content, this.options.content);

    return content;
  }

  /**
   * Create the toggle button
   */
  private createToggleButton(): void {
    this.toggleButton = new ToggleButton({
      onChange: (isActive) => {
        if (isActive === this.options.toggleOnShowsContent) {
          this.open();
        } else {
          this.close();
        }
        this.eventEmitter.emit('toggle', isActive, this);
      },
      startActive: this.options.startOpen,
    });
  }

  /**
   * Draw the component structure
   */
  private draw(): void {
    // Clear existing content
    this.element.innerHTML = '';

    if (this.options.toggleableContent) {
      // Create label wrapper
      const labelWrapper = document.createElement('div');
      labelWrapper.className = styles.toggleableSection__labelWrapper ?? '';

      // Add label
      labelWrapper.appendChild(this.labelEl);

      // Add toggle button (with optional toggle label)
      if (this.options.toggleLabel && this.toggleLabelEl && this.toggleButton) {
        const toggleLabelWrapper = document.createElement('div');
        toggleLabelWrapper.className = styles.toggleableSection__toggleLabelWrapper ?? '';
        toggleLabelWrapper.appendChild(this.toggleLabelEl);
        toggleLabelWrapper.appendChild(this.toggleButton.getEl());
        labelWrapper.appendChild(toggleLabelWrapper);
      } else if (this.toggleButton) {
        labelWrapper.appendChild(this.toggleButton.getEl());
      }

      this.element.appendChild(labelWrapper);
    } else {
      // Non-toggleable: just add label
      this.element.appendChild(this.labelEl);
    }

    // Add content
    this.element.appendChild(this.contentEl);
  }

  /**
   * Set content of an element
   */
  private setContent(element: HTMLElement, content?: ElementContent): void {
    if (!content) {
      return;
    }

    if (typeof content === 'string') {
      element.innerHTML = content;
    } else if (Array.isArray(content)) {
      content.forEach((item) => element.appendChild(item));
    } else {
      element.appendChild(content);
    }
  }

  /**
   * Open the section (show content)
   */
  public open(): void {
    const openClass = styles['toggleableSection--open'];
    if (openClass) {
      this.element.classList.add(openClass);
    }
    this.isOpen = true;
    this.eventEmitter.emit('open', this);
  }

  /**
   * Close the section (hide content)
   */
  public close(): void {
    const openClass = styles['toggleableSection--open'];
    if (openClass) {
      this.element.classList.remove(openClass);
    }
    this.isOpen = false;
    this.eventEmitter.emit('close', this);
  }

  /**
   * Check if the section is currently open
   */
  public isOpenState(): boolean {
    return this.isOpen;
  }

  /**
   * Get the root element
   */
  public getEl(): HTMLElement {
    return this.element;
  }

  /**
   * Register an event listener
   */
  public on(event: ToggleableSectionEvent, callback: ToggleableSectionEventCallback): void {
    this.eventEmitter.on(event, callback as (...args: unknown[]) => void);
  }

  /**
   * Unregister an event listener
   */
  public off(event: ToggleableSectionEvent, callback: ToggleableSectionEventCallback): void {
    this.eventEmitter.off(event, callback as (...args: unknown[]) => void);
  }

  /**
   * Destroy the component and clean up
   */
  public destroy(): void {
    if (this.toggleButton) {
      this.toggleButton.destroy();
    }
    this.element.remove();
  }
}
