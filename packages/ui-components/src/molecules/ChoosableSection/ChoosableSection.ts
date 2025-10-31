/**
 * ChoosableSection - A section with a dropdown to choose between different content options
 *
 * @example
 * ```ts
 * const section = new ChoosableSection({
 *   label: 'Content Type',
 *   dropdownLabel: 'Select:',
 *   items: [
 *     {
 *       active: true,
 *       label: 'Text',
 *       content: '<p>Text content</p>'
 *     },
 *     {
 *       label: 'Image',
 *       content: '<img src="..." />'
 *     }
 *   ],
 *   onChange: (item) => console.log('Selected:', item)
 * });
 * document.body.appendChild(section.getEl());
 * ```
 */

import { merge } from 'lodash-es';
import styles from './choosable-section.module.scss';
import type {
  ChoosableSectionProps,
  ChoosableSectionItem,
} from './choosable-section.types';
import { Dropdown } from '../Dropdown/Dropdown';
import { DropdownItem } from '../Dropdown/DropdownItem';
import type { DropdownItemProps } from '../Dropdown/dropdown-item.types';

/**
 * Simple EventEmitter for internal use
 */
class EventEmitter {
  private events: Map<string, Set<Function>> = new Map();

  on(event: string, callback: Function): void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(callback);
  }

  off(event: string, callback: Function): void {
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
 * Sets content of an element (HTML string or HTMLElement)
 */
function setContent(
  element: HTMLElement,
  content: string | HTMLElement | (string | HTMLElement)[]
): HTMLElement {
  element.innerHTML = '';

  if (Array.isArray(content)) {
    content.forEach((item) => {
      if (typeof item === 'string') {
        element.insertAdjacentHTML('beforeend', item);
      } else {
        element.appendChild(item);
      }
    });
  } else if (typeof content === 'string') {
    element.innerHTML = content;
  } else {
    element.appendChild(content);
  }

  return element;
}

/**
 * Adds multiple CSS classes from a string
 */
function addClassesString(element: HTMLElement, classes: string): HTMLElement {
  const classList = classes
    .split(' ')
    .filter((cls) => cls.trim() !== '');

  classList.forEach((cls) => element.classList.add(cls));
  return element;
}

export class ChoosableSection {
  private options: Required<ChoosableSectionProps>;
  private element: HTMLElement;
  private content: HTMLElement;
  private label: HTMLElement;
  private dropdownLabel?: HTMLElement;
  private cssClass: string;
  private eventEmitter: EventEmitter;
  private dropdown: Dropdown;

  constructor(options: ChoosableSectionProps = {}) {
    const defaults: Required<ChoosableSectionProps> = {
      className: 'choosable-section',
      classPrefix: '',
      extendedClasses: '',
      tagName: 'div',
      label: null,
      items: [],
      labelExtendedClasses: '',
      contentExtendedClasses: '',
      onChange: null,
      dropdownLabel: null,
      dropdownLabelExtendedClasses: '',
    };

    this.options = merge({}, defaults, options);

    this.cssClass = `${this.options.classPrefix}${this.options.className}`;
    this.eventEmitter = new EventEmitter();

    // Create elements
    this.element = this.createElement();
    this.label = this.createLabel();
    this.content = this.createContent();

    if (this.options.dropdownLabel) {
      this.dropdownLabel = this.createDropdownLabel();
    }

    this.dropdown = this.createDropdown();

    this.init();
  }

  /**
   * Initialize the component
   */
  private init(): void {
    // Register onChange callback if provided
    if (typeof this.options.onChange === 'function') {
      this.on('change', this.options.onChange);
    }

    // Draw the component
    this.draw();

    // Trigger initial item click if there's an active item
    if (this.dropdown.activeItem && typeof this.dropdown.activeItem.onItemClick === 'function') {
      this.dropdown.activeItem.onItemClick();
    }
  }

  /**
   * Create the root element
   */
  private createElement(): HTMLElement {
    const el = document.createElement(this.options.tagName);
    const classes = `${styles['choosable-section']}${
      this.options.extendedClasses ? ` ${this.options.extendedClasses}` : ''
    }`;
    return addClassesString(el, classes);
  }

  /**
   * Create the main label element
   */
  private createLabel(): HTMLElement {
    const label = document.createElement('label');
    const classes = `eb-label ${styles['choosable-section__label']}${
      this.options.labelExtendedClasses ? ` ${this.options.labelExtendedClasses}` : ''
    }`;
    addClassesString(label, classes);
    return setContent(label, this.options.label || '');
  }

  /**
   * Create the dropdown label element
   */
  private createDropdownLabel(): HTMLElement {
    const label = document.createElement('label');
    const classes = `eb-label ${styles['choosable-section__toggle-label']}${
      this.options.dropdownLabelExtendedClasses
        ? ` ${this.options.dropdownLabelExtendedClasses}`
        : ''
    }`;
    addClassesString(label, classes);
    return setContent(label, this.options.dropdownLabel || '');
  }

  /**
   * Create the content area element
   */
  private createContent(): HTMLElement {
    const content = document.createElement('div');
    const classes = `${styles['choosable-section__content']}${
      this.options.contentExtendedClasses ? ` ${this.options.contentExtendedClasses}` : ''
    }`;
    return addClassesString(content, classes);
  }

  /**
   * Create the dropdown with items
   */
  private createDropdown(): Dropdown {
    const items: (DropdownItem | DropdownItemProps)[] = this.options.items.map((item) => {
      const dropdownItemProps: DropdownItemProps = {
        active: item.active,
        content: item.label,
        onSelect: item.onSelect as any,
        onDeselect: item.onDeselect as any,
        onClick: () => {
          const content = typeof item.content === 'function' ? item.content() : item.content;
          this.setContent(content);
          this.eventEmitter.emit('change', item);
        },
      };
      return dropdownItemProps;
    });

    return new Dropdown({
      size: 'sm',
      arrowSize: 'sm',
      items,
    });
  }

  /**
   * Set the content of the section
   */
  setContent(content: string | HTMLElement): void {
    setContent(this.content, content);
  }

  /**
   * Draw/render the component structure
   */
  private draw(): void {
    // Create label wrapper
    const labelWrapper = document.createElement('div');
    addClassesString(labelWrapper, styles['choosable-section__label-wrapper']);

    // Add main label
    labelWrapper.appendChild(this.label);

    // Add dropdown (with optional dropdown label)
    if (this.options.dropdownLabel && this.dropdownLabel) {
      const dropdownLabelWrapper = document.createElement('div');
      addClassesString(
        dropdownLabelWrapper,
        styles['choosable-section__dropdown-label-wrapper']
      );
      dropdownLabelWrapper.appendChild(this.dropdownLabel);
      dropdownLabelWrapper.appendChild(this.dropdown.getEl());
      labelWrapper.appendChild(dropdownLabelWrapper);
    } else {
      labelWrapper.appendChild(this.dropdown.getEl());
    }

    // Build final structure
    setContent(this.element, [labelWrapper, this.content]);
  }

  /**
   * Get the root element
   */
  getEl(): HTMLElement {
    return this.element;
  }

  /**
   * Register an event listener
   */
  on(event: string, callback: Function): void {
    this.eventEmitter.on(event, callback);
  }

  /**
   * Unregister an event listener
   */
  off(event: string, callback: Function): void {
    this.eventEmitter.off(event, callback);
  }

  /**
   * Get the dropdown instance
   */
  getDropdown(): Dropdown {
    return this.dropdown;
  }

  /**
   * Get the content element
   */
  getContent(): HTMLElement {
    return this.content;
  }

  /**
   * Destroy the component and clean up
   */
  destroy(): void {
    this.element.remove();
  }
}
