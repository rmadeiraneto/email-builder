/**
 * RadioButtonGroupItem - A single item in a radio button group
 *
 * @example
 * ```ts
 * const item = new RadioButtonGroupItem({
 *   value: 'option1',
 *   label: 'Option 1',
 *   selected: false,
 *   onChange: (isSelected, item) => {
 *     console.log(`Item ${item.getValue()} is now ${isSelected ? 'selected' : 'unselected'}`);
 *   }
 * });
 *
 * document.body.appendChild(item.getElement());
 * ```
 */

import type {
  RadioButtonGroupItemConfig,
  RadioButtonGroupItemChangeCallback,
  RadioButtonGroupItemClickCallback,
} from './radio-button-group.types';
import styles from './radio-button-group.module.scss';

type EventCallback = RadioButtonGroupItemChangeCallback | RadioButtonGroupItemClickCallback;

export class RadioButtonGroupItem {
  private config: Required<
    Omit<RadioButtonGroupItemConfig, 'onChange' | 'onClick' | 'description'>
  > & {
    description?: string;
    onChange?: RadioButtonGroupItemChangeCallback;
    onClick?: RadioButtonGroupItemClickCallback;
  };

  private element: HTMLDivElement;
  private selected: boolean;
  private eventListeners: Map<string, EventCallback[]> = new Map();

  constructor(config: RadioButtonGroupItemConfig) {
    // Validate required fields
    if (config.value == null) {
      throw new Error('RadioButtonGroupItem requires a value');
    }
    if (!config.label && !config.icon) {
      throw new Error('RadioButtonGroupItem requires at least a label or an icon');
    }

    this.config = {
      value: config.value,
      selected: config.selected ?? false,
      label: config.label ?? '',
      icon: config.icon ?? '',
      ...(config.description !== undefined && { description: config.description }),
      class: config.class ?? '',
      changeOnClick: config.changeOnClick ?? true,
      useActiveBorder: config.useActiveBorder ?? true,
      ...(config.onChange !== undefined && { onChange: config.onChange }),
      ...(config.onClick !== undefined && { onClick: config.onClick }),
    };

    this.selected = this.config.selected;
    this.element = this.createElement();
    this.attachEventListeners();
  }

  /**
   * Create the root element
   */
  private createElement(): HTMLDivElement {
    const element = document.createElement('div');
    element.className = this.getClassNames();
    element.setAttribute('data-value', String(this.config.value));
    element.setAttribute('data-testid', 'radio-button-group-item');

    // Create icon element
    const iconEl = document.createElement('div');
    iconEl.className = styles['radio-btn-group-item__icon'] ?? '';
    if (this.config.icon) {
      this.setContent(iconEl, this.config.icon);
    }

    // Create label element
    const labelEl = document.createElement('div');
    labelEl.className = styles['radio-btn-group-item__label'] ?? '';
    if (this.config.label) {
      this.setContent(labelEl, this.config.label);
    }

    // Add tooltip if description exists
    if (this.config.description) {
      const tooltipTrigger = document.createElement('span');
      tooltipTrigger.className = styles['radio-btn-group-item__tooltip-trigger'] ?? '';
      tooltipTrigger.textContent = '?';
      tooltipTrigger.title = this.config.description;
      tooltipTrigger.setAttribute('data-testid', 'radio-button-group-item-tooltip');
      labelEl.appendChild(tooltipTrigger);
    }

    element.appendChild(iconEl);
    element.appendChild(labelEl);

    return element;
  }

  /**
   * Get class names for the element
   */
  private getClassNames(): string {
    const classes = [styles['radio-btn-group-item']];

    if (this.selected) {
      classes.push(styles['radio-btn-group-item--active'] ?? '');
    }

    if (this.config.useActiveBorder) {
      classes.push(styles['radio-btn-group-item--active-border'] ?? '');
    }

    if (this.config.class) {
      classes.push(this.config.class);
    }

    return classes.filter(Boolean).join(' ');
  }

  /**
   * Set content (string or HTMLElement) to an element
   */
  private setContent(element: HTMLElement, content: string | HTMLElement): void {
    if (typeof content === 'string') {
      element.innerHTML = content;
    } else {
      element.innerHTML = '';
      element.appendChild(content);
    }
  }

  /**
   * Attach event listeners
   */
  private attachEventListeners(): void {
    this.element.addEventListener('click', () => {
      this.handleClick();
    });

    // Register onChange callback if provided
    if (this.config.onChange) {
      this.on('change', this.config.onChange);
    }

    // Register onClick callback if provided
    if (this.config.onClick) {
      this.on('click', this.config.onClick);
    }
  }

  /**
   * Handle click event
   */
  private handleClick(): void {
    // Emit click event
    this.emit('click', this);

    // Toggle selection if changeOnClick is enabled
    if (this.config.changeOnClick) {
      this.toggleSelection();
    }
  }

  /**
   * Emit an event to all registered listeners
   */
  private emit(eventName: string, ...args: unknown[]): void {
    const listeners = this.eventListeners.get(eventName);
    if (listeners) {
      listeners.forEach((callback) => {
        if (eventName === 'change') {
          (callback as RadioButtonGroupItemChangeCallback)(...(args as [boolean, RadioButtonGroupItem]));
        } else if (eventName === 'click') {
          (callback as RadioButtonGroupItemClickCallback)(...(args as [RadioButtonGroupItem]));
        }
      });
    }
  }

  /**
   * Add selected class
   */
  private addSelectedClass(): void {
    this.element.classList.add(styles['radio-btn-group-item--active'] ?? '');
  }

  /**
   * Remove selected class
   */
  private removeSelectedClass(): void {
    this.element.classList.remove(styles['radio-btn-group-item--active'] ?? '');
  }

  /**
   * Select the item
   */
  public selectItem(): void {
    const hasChanged = !this.selected;
    this.selected = true;
    this.addSelectedClass();

    if (hasChanged) {
      this.emit('change', this.selected, this);
    }
  }

  /**
   * Unselect the item
   */
  public unselectItem(): void {
    const hasChanged = this.selected;
    this.selected = false;
    this.removeSelectedClass();

    if (hasChanged) {
      this.emit('change', this.selected, this);
    }
  }

  /**
   * Toggle selection state
   */
  public toggleSelection(): boolean {
    if (this.selected) {
      this.unselectItem();
    } else {
      this.selectItem();
    }
    return this.selected;
  }

  /**
   * Check if item is selected
   */
  public isSelected(): boolean {
    return this.selected;
  }

  /**
   * Get the item value
   */
  public getValue(): string | number {
    return this.config.value;
  }

  /**
   * Get the root element
   */
  public getElement(): HTMLDivElement {
    return this.element;
  }

  /**
   * Register an event listener
   *
   * @param eventName - The event name ('change' or 'click')
   * @param callback - The callback function
   */
  public on(eventName: 'change', callback: RadioButtonGroupItemChangeCallback): void;
  public on(eventName: 'click', callback: RadioButtonGroupItemClickCallback): void;
  public on(eventName: string, callback: EventCallback): void {
    if (!this.eventListeners.has(eventName)) {
      this.eventListeners.set(eventName, []);
    }
    this.eventListeners.get(eventName)?.push(callback);
  }

  /**
   * Unregister an event listener
   *
   * @param eventName - The event name ('change' or 'click')
   * @param callback - The callback function to remove
   */
  public off(eventName: string, callback: EventCallback): void {
    const listeners = this.eventListeners.get(eventName);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }
}
