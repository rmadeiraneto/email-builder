/**
 * Dropdown component
 *
 * A flexible dropdown menu with support for custom items, positioning,
 * and various interaction modes.
 *
 * @example
 * Basic dropdown:
 * ```ts
 * const dropdown = new Dropdown({
 *   items: [
 *     { value: '1', content: 'Option 1' },
 *     { value: '2', content: 'Option 2' }
 *   ],
 *   onChange: (dd, item) => console.log('Selected:', item.getValue())
 * });
 * document.body.appendChild(dropdown.getEl());
 * ```
 */

import { computePosition, flip, offset } from '@floating-ui/dom';
import type { DropdownProps } from './dropdown.types';
import { DropdownItem } from './DropdownItem';
import styles from './dropdown.module.scss';
import { createBEM } from '../../utils/classNames';

export class Dropdown {
  private props: Required<Omit<DropdownProps, 'activeItem' | 'onChange' | 'onReset' | 'onControlClick' | 'placement'>
> & Pick<DropdownProps, 'activeItem' | 'onChange' | 'onReset' | 'onControlClick' | 'placement'>;
  private className: string;
  public items: DropdownItem[];
  public isOpen: boolean;
  public resettable: boolean;
  public defaultItem: DropdownItem | null;
  public activeItem: DropdownItem | null;

  // DOM elements
  private element: HTMLDivElement;
  private control: HTMLDivElement;
  private controlContent: HTMLDivElement;
  private controlArrow: HTMLDivElement;
  private controlArrowUp: HTMLDivElement;
  private controlArrowDown: HTMLDivElement;
  private itemsContainer: HTMLDivElement;

  constructor(props: DropdownProps = {}) {
    // Default arrow icons (simple SVG arrows)
    const defaultArrowDown = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 15l-5-5h10l-5 5z" fill="currentColor"/></svg>`;
    const defaultArrowUp = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 9l5 5H7l5-5z" fill="currentColor"/></svg>`;

    // Set defaults
    this.props = {
      items: [],
      activeItem: null,
      classPrefix: '',
      cssClass: 'dropdown',
      extendedClasses: '',
      placeholder: 'Select an item',
      arrowSize: 'xl',
      size: 'md',
      arrowDown: defaultArrowDown,
      arrowUp: defaultArrowUp,
      onChange: null,
      onReset: null,
      onControlClick: null,
      closeDropdownOnItemClick: true,
      toggleDropdownOnControlClick: true,
      onControlClickPreventDefault: false,
      onControlClickStopPropagation: false,
      startOpened: false,
      openShowsArrowUp: true,
      closeDropdownOnWindowClick: true,
      resettable: false,
      triggerOnChangeOnDefaultItemActivation: true,
      triggerOnChangeOnStartingItemActivation: false,
      useFloater: true,
      placement: 'bottom-start',
      ...props,
    };

    const bem = createBEM(styles, 'dropdown');
    this.className = bem() ?? '';
    this.items = [];
    this.isOpen = this.props.startOpened;
    this.resettable = this.props.resettable;
    this.defaultItem = null;
    this.activeItem = null;

    // Initialize DOM elements (will be created in init)
    this.element = document.createElement('div');
    this.control = document.createElement('div');
    this.controlContent = document.createElement('div');
    this.controlArrow = document.createElement('div');
    this.controlArrowUp = document.createElement('div');
    this.controlArrowDown = document.createElement('div');
    this.itemsContainer = document.createElement('div');

    if (this.props.items.length > 0) {
      this.convertItems();
      this.init();
    }
  }

  /**
   * Convert item objects to DropdownItem instances
   */
  private convertItems(): void {
    this.items = this.props.items.map(item =>
      item instanceof DropdownItem ? item : new DropdownItem({ ...item, classPrefix: this.props.classPrefix })
    );

    if (this.resettable) {
      this.defaultItem = this.items.find(item => item.isDefaultItem()) || this.items[0] || null;
    }
  }

  /**
   * Initialize the dropdown
   */
  private init(): void {
    this.element = this.createElement();
    this.setupOutClickEvents();
    this.draw();
  }

  /**
   * Create the main wrapper element
   */
  private createElement(): HTMLDivElement {
    const bem = createBEM(styles, 'dropdown');
    const el = document.createElement('div');
    el.className = this.className;

    // Add size modifier
    const sizeClass = bem(this.props.size);
    if (sizeClass) {
      el.classList.add(sizeClass);
    }

    // Add extended classes
    if (this.props.extendedClasses) {
      const classes = this.props.extendedClasses.split(' ').filter(c => c.trim());
      el.classList.add(...classes);
    }

    return el;
  }

  /**
   * Setup click outside to close dropdown
   */
  private setupOutClickEvents(): void {
    if (this.props.closeDropdownOnWindowClick) {
      const handleClick = (e: MouseEvent | null) => {
        if (
          !e ||
          !(
            e.target === this.props.arrowDown ||
            e.target === this.props.arrowUp ||
            e.target === this.element ||
            this.element.contains(e.target as Node)
          )
        ) {
          this.close();
        }
      };

      document.body.addEventListener('click', handleClick);

      // Support for iframe messages
      window.addEventListener('message', (ev: MessageEvent) => {
        if (ev.data === 'click') {
          handleClick(null);
        }
      });
    }
  }

  /**
   * Draw the dropdown
   */
  private draw(): void {
    this.setupItems();
    this.createControl();
    this.createControlArrow();
    this.createControlContent();
    this.drawControl();
    this.createItemsContainer();
    this.drawItemsContainer();

    if (this.props.useFloater) {
      this.setupFloater();
    }

    this.setActiveItem();

    if (this.isOpen) {
      this.open();
    }
  }

  /**
   * Setup floating-ui positioning
   */
  private setupFloater(): void {
    const config: any = {
      middleware: [flip(), offset(2)],
    };
    if (this.props.placement) {
      config.placement = this.props.placement;
    }
    computePosition(this.control, this.itemsContainer, config).then((position: { x: number; y: number }) => {
      this.element.style.setProperty('--floater-coords-left', `${position.x}px`);
      this.element.style.setProperty('--floater-coords-top', `${position.y}px`);
    });
  }

  /**
   * Setup items with click handlers
   */
  private setupItems(): void {
    const bem = createBEM(styles, 'dropdown');
    this.items.forEach(item => {
      const el = item.getEl();
      const itemClass = bem.elem('item');
      if (itemClass) {
        el.classList.add(itemClass);
      }

      el.addEventListener('click', () => {
        this.onItemClick(item);
      });
    });
  }

  /**
   * Handle item click
   */
  private onItemClick(item: DropdownItem): void {
    this.deactivateAllItems();
    this.activateItem(item, true);

    if (this.props.closeDropdownOnItemClick) {
      this.close();
    }
  }

  /**
   * Deactivate all items
   */
  private deactivateAllItems(): void {
    const bem = createBEM(styles, 'dropdown');
    const activeClass = bem.elem('item', 'active');
    this.items.forEach(item => {
      if (activeClass) {
        item.getEl().classList.remove(activeClass);
      }
      item.deselect();
    });
  }

  /**
   * Reset dropdown to default item
   */
  public reset(): void {
    if (this.resettable && this.defaultItem) {
      this.deactivateAllItems();
      this.activateItem(this.defaultItem, false);
      this.resetCallback(this.defaultItem);
    } else {
      console.warn('Dropdown is not resettable');
    }
  }

  /**
   * Call reset callback
   */
  private resetCallback(defaultItem: DropdownItem): void {
    if (typeof this.props.onReset === 'function') {
      this.props.onReset(this, defaultItem);
    }
  }

  /**
   * Set the active item from items array
   */
  private setActiveItem(): void {
    const activeItems = this.items.filter(item => item.getIsActive());

    if (activeItems.length > 0 && activeItems[0]) {
      this.deactivateAllItems();
      this.activateItem(activeItems[0], false, { isDraw: true });
    }
  }

  /**
   * Change active item by value
   */
  public changeActiveItem(value: unknown): void {
    const matchingItems = this.items.filter(item => item.value === value);

    if (matchingItems.length > 0 && matchingItems[0]) {
      this.deactivateAllItems();
      this.activateItem(matchingItems[0], false, { isDraw: true });
    }
  }

  /**
   * Activate an item
   */
  private activateItem(
    item: DropdownItem,
    itemClicked: boolean,
    options: { isDraw?: boolean } = {}
  ): void {
    const { isDraw = false } = options;

    if (this.activeItem !== item) {
      this.activeItem = item;

      // Handle onChange callback
      if (typeof this.props.onChange === 'function') {
        if (
          this.resettable &&
          (item !== this.defaultItem ||
            (item === this.defaultItem && this.props.triggerOnChangeOnDefaultItemActivation))
        ) {
          this.props.onChange(this, item, item === this.defaultItem);
        } else if (
          !this.resettable &&
          isDraw === this.props.triggerOnChangeOnStartingItemActivation
        ) {
          this.props.onChange(this, item);
        }
      }

      // Handle reset callback
      if (this.resettable && item === this.defaultItem && itemClicked) {
        this.resetCallback(item);
      }
    }

    // Add active class and select
    const bem = createBEM(styles, 'dropdown');
    const activeClass = bem.elem('item', 'active');
    if (activeClass) {
      item.getEl().classList.add(activeClass);
    }
    item.select();

    this.drawControl();
  }

  /**
   * Create control element
   */
  private createControl(): void {
    const bem = createBEM(styles, 'dropdown');
    this.control = document.createElement('div');
    const controlClass = bem.elem('control');
    if (controlClass) {
      this.control.classList.add(controlClass);
    }

    this.control.addEventListener('click', (e: MouseEvent) => {
      if (this.props.onControlClickStopPropagation) {
        e.stopPropagation();
      }
      this.onControlClick();
    });
  }

  /**
   * Create control content element
   */
  private createControlContent(): void {
    const bem = createBEM(styles, 'dropdown');
    this.controlContent = document.createElement('div');
    const contentClass = bem.elem('control-content');
    if (contentClass) {
      this.controlContent.classList.add(contentClass);
    }
  }

  /**
   * Create control arrow elements
   */
  private createControlArrow(): void {
    const bem = createBEM(styles, 'dropdown');
    this.controlArrowUp = document.createElement('div');
    const arrowUpClass = bem.elem('control-arrow-up');
    if (arrowUpClass) {
      this.controlArrowUp.classList.add(arrowUpClass);
    }
    this.setContent(this.controlArrowUp, this.props.arrowUp);

    this.controlArrowDown = document.createElement('div');
    const arrowDownClass = bem.elem('control-arrow-down');
    if (arrowDownClass) {
      this.controlArrowDown.classList.add(arrowDownClass);
    }
    this.setContent(this.controlArrowDown, this.props.arrowDown);

    this.controlArrow = document.createElement('div');
    const arrowClass = bem.elem('control-arrow');
    if (arrowClass) {
      this.controlArrow.classList.add(arrowClass);
    }
    this.controlArrow.append(this.controlArrowUp, this.controlArrowDown);
  }

  /**
   * Handle control click
   */
  private onControlClick(): void {
    if (!this.props.onControlClickPreventDefault) {
      if (this.props.toggleDropdownOnControlClick) {
        this.toggle();
      } else {
        this.open();
      }
    }

    if (typeof this.props.onControlClick === 'function') {
      this.props.onControlClick(this);
    }
  }

  /**
   * Draw the control
   */
  private drawControl(): void {
    this.updateControlContent(this.activeItem);
    this.updateControlArrow();
    this.control.innerHTML = '';
    this.control.append(this.controlContent, this.controlArrow);
    this.element.append(this.control);
  }

  /**
   * Create items container
   */
  private createItemsContainer(): void {
    const bem = createBEM(styles, 'dropdown');
    this.itemsContainer = document.createElement('div');
    const optionsClass = bem.elem('options');
    if (optionsClass) {
      this.itemsContainer.classList.add(optionsClass);
    }
    this.element.append(this.itemsContainer);
  }

  /**
   * Draw items in container
   */
  private drawItemsContainer(): void {
    this.itemsContainer.innerHTML = '';
    this.itemsContainer.append(...this.items.map(item => item.getEl()));
  }

  /**
   * Update control content
   */
  private updateControlContent(item: DropdownItem | null): void {
    if (item) {
      const content = item.content;

      if (Array.isArray(content)) {
        this.controlContent.innerHTML = '';
        content.forEach(node => {
          if (node instanceof Node) {
            this.controlContent.appendChild(node.cloneNode(true));
          }
        });
      } else if (content instanceof HTMLElement) {
        this.controlContent.innerHTML = '';
        this.controlContent.appendChild(content.cloneNode(true));
      } else {
        this.setContent(this.controlContent, content);
      }
    } else {
      this.setContent(this.controlContent, this.props.placeholder);
    }
  }

  /**
   * Update control arrow visibility
   */
  private updateControlArrow(): void {
    if (
      (this.isOpen && this.props.openShowsArrowUp) ||
      (!this.isOpen && !this.props.openShowsArrowUp)
    ) {
      this.controlArrowUp.removeAttribute('hidden');
      this.controlArrowDown.setAttribute('hidden', 'true');
    } else {
      this.controlArrowUp.setAttribute('hidden', 'true');
      this.controlArrowDown.removeAttribute('hidden');
    }
  }

  /**
   * Set content helper
   */
  private setContent(element: HTMLElement, content: unknown): void {
    if (!content) {
      element.textContent = '';
      return;
    }

    if (typeof content === 'string') {
      // Try to parse as HTML
      const template = document.createElement('template');
      template.innerHTML = (content as string).trim();

      if (template.content.firstChild) {
        element.innerHTML = '';
        element.appendChild(template.content.firstChild.cloneNode(true));
      } else {
        element.textContent = content;
      }
    } else if (content instanceof HTMLElement) {
      element.innerHTML = '';
      element.appendChild(content);
    } else {
      element.textContent = String(content);
    }
  }

  /**
   * Open the dropdown
   */
  public open(): void {
    const bem = createBEM(styles, 'dropdown');
    const openClass = bem('open');
    if (openClass) {
      this.element.classList.add(openClass);
    }
    this.isOpen = true;
    this.updateControlArrow();

    if (this.props.useFloater) {
      this.setupFloater();
    }
  }

  /**
   * Close the dropdown
   */
  public close(): void {
    const bem = createBEM(styles, 'dropdown');
    const openClass = bem('open');
    if (openClass) {
      this.element.classList.remove(openClass);
    }
    this.isOpen = false;
    this.updateControlArrow();
  }

  /**
   * Toggle the dropdown
   */
  public toggle(): void {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Get the dropdown element
   */
  public getEl(): HTMLDivElement {
    return this.element;
  }

  /**
   * Get active item
   */
  public getActiveItem(): DropdownItem | null {
    return this.activeItem;
  }

  /**
   * Destroy the dropdown
   */
  public destroy(): void {
    this.element.remove();
  }
}
