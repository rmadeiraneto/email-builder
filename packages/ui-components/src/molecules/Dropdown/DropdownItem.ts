/**
 * DropdownItem component
 *
 * Represents an individual item in a dropdown menu.
 * Manages its own selection state and callbacks.
 */

import type { DropdownItemProps } from './dropdown-item.types';

export class DropdownItem {
  private props: Required<DropdownItemProps>;
  private element: HTMLDivElement;
  private className: string;
  public isActive: boolean;
  public value: unknown;
  public content: HTMLElement | string;
  public isDefault: boolean;

  constructor(props: DropdownItemProps = {}) {
    // Set defaults
    this.props = {
      active: false,
      classPrefix: '',
      cssClass: 'dropdown-item',
      extendedClasses: '',
      content: '',
      onSelect: null,
      onDeselect: null,
      onClick: null,
      value: null,
      isDefault: false,
      ...props,
    };

    this.className = `${this.props.classPrefix}${this.props.cssClass}`;
    this.isActive = this.props.active;
    this.value = this.props.value;
    this.content = this.props.content || this.props.value;
    this.isDefault = this.props.isDefault;

    this.element = this.createItemElement();
  }

  /**
   * Create the item element
   */
  private createItemElement(): HTMLDivElement {
    const el = document.createElement('div');
    el.classList.add(this.className);

    // Add extended classes
    if (this.props.extendedClasses) {
      const classes = this.props.extendedClasses.split(' ').filter(c => c.trim());
      el.classList.add(...classes);
    }

    // Add click listener
    el.addEventListener('click', () => {
      this.onItemClick();
    });

    // Set content after element is created
    this.element = el;
    this.setContent(this.props.content);

    return el;
  }

  /**
   * Set the content of the item
   */
  public setContent(content: HTMLElement | string | unknown): void {
    if (!content) {
      this.element.textContent = '';
      return;
    }

    if (typeof content === 'string') {
      // Try to parse as HTML first
      const template = document.createElement('template');
      template.innerHTML = content.trim();

      if (template.content.firstChild) {
        this.element.innerHTML = '';
        this.element.appendChild(template.content.firstChild.cloneNode(true));
      } else {
        this.element.textContent = content;
      }
    } else if (content instanceof HTMLElement) {
      this.element.innerHTML = '';
      this.element.appendChild(content);
    } else {
      this.element.textContent = String(content);
    }
  }

  /**
   * Set whether this item is the default item
   */
  public setDefault(isDefault: boolean = true): void {
    this.isDefault = isDefault;
  }

  /**
   * Check if this is the default item
   */
  public isDefaultItem(): boolean {
    return this.isDefault;
  }

  /**
   * Handle item click
   */
  private onItemClick(): void {
    if (typeof this.props.onClick === 'function') {
      this.props.onClick(this, this.value);
    }
    this.select();
  }

  /**
   * Select the item
   */
  public select(): void {
    this.isActive = true;
    this.element.classList.add(`${this.className}--active`);

    if (typeof this.props.onSelect === 'function') {
      this.props.onSelect(this, this.value);
    }
  }

  /**
   * Deselect the item
   */
  public deselect(): void {
    this.isActive = false;
    this.element.classList.remove(`${this.className}--active`);

    if (typeof this.props.onDeselect === 'function') {
      this.props.onDeselect(this, this.value);
    }
  }

  /**
   * Get the element
   */
  public getEl(): HTMLDivElement {
    return this.element;
  }

  /**
   * Get the active state
   */
  public getIsActive(): boolean {
    return this.isActive;
  }

  /**
   * Get the value
   */
  public getValue(): unknown {
    return this.value;
  }
}
