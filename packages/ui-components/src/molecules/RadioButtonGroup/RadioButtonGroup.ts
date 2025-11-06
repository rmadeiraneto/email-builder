/**
 * RadioButtonGroup - A group of selectable radio button items
 *
 * @example
 * ```ts
 * const radioGroup = new RadioButtonGroup({
 *   items: [
 *     { value: 'option1', label: 'Option 1' },
 *     { value: 'option2', label: 'Option 2', selected: true },
 *     { value: 'option3', label: 'Option 3' }
 *   ],
 *   singleSelection: true,
 *   onChange: (allSelected, changedItem, selectedItems, noneSelected) => {
 *     console.log('Selected items:', selectedItems.map(item => item.getValue()));
 *   }
 * });
 *
 * document.body.appendChild(radioGroup.getElement());
 * ```
 */

import { RadioButtonGroupItem } from './RadioButtonGroupItem';
import type {
  RadioButtonGroupConfig,
  RadioButtonGroupChangeCallback,
} from './radio-button-group.types';
import styles from './radio-button-group.module.scss';

export class RadioButtonGroup {
  private config: Required<Omit<RadioButtonGroupConfig, 'onChange'>> & {
    onChange?: RadioButtonGroupChangeCallback;
  };

  private element: HTMLDivElement;
  private items: RadioButtonGroupItem[];
  private eventListeners: Map<string, RadioButtonGroupChangeCallback[]> = new Map();

  constructor(config: RadioButtonGroupConfig) {
    // Validate required fields
    if (!config.items || config.items.length === 0) {
      throw new Error('RadioButtonGroup requires at least one item');
    }

    this.config = {
      items: config.items,
      singleSelection: config.singleSelection ?? false,
      allowNoSelection: config.allowNoSelection ?? true,
      linkItemsWithSameValue: config.linkItemsWithSameValue ?? true,
      class: config.class ?? '',
      ...(config.onChange !== undefined && { onChange: config.onChange }),
    };

    this.items = [];
    this.element = this.createElement();
    this.createItems();
    this.appendItems();

    // Register onChange callback if provided
    if (this.config.onChange) {
      this.on('change', this.config.onChange);
    }

    // If no selection is allowed and nothing is selected, select first item
    if (!this.config.allowNoSelection && this.getSelectedItems().length === 0) {
      const firstItem = this.items[0];
      if (firstItem) {
        this.selectItem(firstItem);
      }
    }
  }

  /**
   * Create the root element
   */
  private createElement(): HTMLDivElement {
    const element = document.createElement('div');
    element.className = this.getClassNames();
    element.setAttribute('data-testid', 'radio-button-group');
    return element;
  }

  /**
   * Get class names for the element
   */
  private getClassNames(): string {
    const classes = [styles['radio-btn-group']];

    if (this.config.class) {
      classes.push(this.config.class);
    }

    return classes.filter(Boolean).join(' ');
  }

  /**
   * Create items from config
   */
  private createItems(): void {
    this.items = this.config.items.map((item) => {
      if (item instanceof RadioButtonGroupItem) {
        return item;
      } else {
        return new RadioButtonGroupItem(item);
      }
    });

    // Attach event listeners to items
    this.items.forEach((item) => {
      item.on('change', (isSelected, changedItem) => {
        this.handleSelectionChanged(isSelected, changedItem);
      });

      // If single selection mode, unselect all before allowing selection
      if (this.config.singleSelection) {
        item.on('click', () => {
          this.unselectAll();
        });
      }
    });
  }

  /**
   * Append items to the element
   */
  private appendItems(): void {
    this.items.forEach((item) => {
      this.element.appendChild(item.getElement());
    });
  }

  /**
   * Handle when an item's selection changes
   */
  private handleSelectionChanged(isSelected: boolean, changedItem: RadioButtonGroupItem): void {
    // Link items with same value if enabled
    if (this.config.linkItemsWithSameValue) {
      if (isSelected) {
        this.selectValue(changedItem.getValue());
      } else {
        this.unselectValue(changedItem.getValue());
      }
    }

    // Emit change event
    this.emit('change', changedItem);
  }

  /**
   * Emit change event to all listeners
   */
  private emit(eventName: string, changedItem: RadioButtonGroupItem): void {
    const listeners = this.eventListeners.get(eventName);
    if (listeners) {
      const selectedItems = this.getSelectedItems();
      const allSelected = this.areAllItemsSelected();
      const noneSelected = selectedItems.length === 0;

      listeners.forEach((callback) => {
        callback(allSelected, changedItem, selectedItems, noneSelected);
      });
    }
  }

  /**
   * Get an item from the items array
   */
  private getItem(item: RadioButtonGroupItem): RadioButtonGroupItem | undefined {
    return this.items.find((i) => i === item);
  }

  /**
   * Get all selected items
   */
  public getSelectedItems(): RadioButtonGroupItem[] {
    return this.items.filter((item) => item.isSelected());
  }

  /**
   * Check if all items are selected
   */
  public areAllItemsSelected(): boolean {
    return this.getSelectedItems().length === this.items.length;
  }

  /**
   * Select items with a specific value
   */
  public selectValue(value: string | number): void {
    this.items.forEach((item) => {
      if (item.getValue() === value && !item.isSelected()) {
        item.selectItem();
      }
    });
  }

  /**
   * Unselect items with a specific value
   */
  public unselectValue(value: string | number): void {
    this.items.forEach((item) => {
      if (item.getValue() === value && item.isSelected()) {
        item.unselectItem();
      }
    });
  }

  /**
   * Select a specific item
   */
  public selectItem(item: RadioButtonGroupItem): void {
    const foundItem = this.getItem(item);
    if (foundItem && !foundItem.isSelected()) {
      foundItem.selectItem();
    }
  }

  /**
   * Unselect a specific item
   */
  public unselectItem(item: RadioButtonGroupItem): void {
    const foundItem = this.getItem(item);
    if (foundItem && foundItem.isSelected()) {
      foundItem.unselectItem();
    }
  }

  /**
   * Select all items
   */
  public selectAll(): void {
    this.items.forEach((item) => {
      if (!item.isSelected()) {
        item.selectItem();
      }
    });
  }

  /**
   * Unselect all items
   */
  public unselectAll(): void {
    this.items.forEach((item) => {
      if (item.isSelected()) {
        item.unselectItem();
      }
    });
  }

  /**
   * Get all items
   */
  public getItems(): RadioButtonGroupItem[] {
    return this.items;
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
   * @param eventName - The event name ('change')
   * @param callback - The callback function
   */
  public on(eventName: 'change', callback: RadioButtonGroupChangeCallback): void {
    if (!this.eventListeners.has(eventName)) {
      this.eventListeners.set(eventName, []);
    }
    this.eventListeners.get(eventName)?.push(callback);
  }

  /**
   * Unregister an event listener
   *
   * @param eventName - The event name ('change')
   * @param callback - The callback function to remove
   */
  public off(eventName: string, callback: RadioButtonGroupChangeCallback): void {
    const listeners = this.eventListeners.get(eventName);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * Destroy the component and clean up
   */
  public destroy(): void {
    this.element.remove();
    this.eventListeners.clear();
  }
}
