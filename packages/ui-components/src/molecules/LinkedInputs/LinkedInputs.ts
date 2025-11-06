/**
 * LinkedInputs component
 *
 * Manages multiple InputNumber components that can be linked/synchronized together.
 * When linked, changing one input updates all others with the same value.
 *
 * @example
 * Basic usage:
 * ```ts
 * const linkedInputs = new LinkedInputs({
 *   items: [
 *     { label: 'Top', input: { defaultValue: 10, defaultUnit: 'px' } },
 *     { label: 'Right', input: { defaultValue: 10, defaultUnit: 'px' } },
 *     { label: 'Bottom', input: { defaultValue: 10, defaultUnit: 'px' } },
 *     { label: 'Left', input: { defaultValue: 10, defaultUnit: 'px' } }
 *   ],
 *   startLinked: true
 * });
 * document.body.appendChild(linkedInputs.getEl());
 * ```
 */

import type {
  LinkedInputsOptions,
  LinkedInputItem,
  InputNumberConfig,
} from './linked-inputs.types';
import { InputNumber } from '../InputNumber/InputNumber';
import { Button } from '../../atoms/Button/Button';
import { Icon } from '../../atoms/Icon/Icon';
import styles from './linked-inputs.module.scss';

export class LinkedInputs {
  private options: Required<Omit<LinkedInputsOptions, 'onLink' | 'extendedClasses' | 'linkIcon'>> & {
    onLink?: LinkedInputsOptions['onLink'];
    extendedClasses?: string;
    linkIcon?: HTMLElement | string;
  };
  private element!: HTMLDivElement;
  private itemsContainer!: HTMLDivElement;
  private linkButton!: Button;
  private linkButtonElement!: HTMLButtonElement;
  private items: Array<LinkedInputItem | (LinkedInputItem & { wrapper: HTMLDivElement })> = [];
  private alphaInput!: InputNumber;
  private isLinked: boolean;
  private autoAlphaInput: boolean;

  /**
   * Creates a new LinkedInputs instance
   *
   * @param options - LinkedInputs configuration
   */
  constructor(options: LinkedInputsOptions) {
    // Default icon
    const defaultIcon = new Icon({ name: 'link', size: 'medium' }).render();

    this.options = {
      startLinked: false,
      linkIconSize: 'md',
      autoAlphaInput: true,
      useLabels: true,
      ...options,
      linkIcon: options.linkIcon || defaultIcon,
      items: options.items || [],
    };

    this.isLinked = this.options.startLinked;
    this.autoAlphaInput = this.options.autoAlphaInput;

    this.init();
  }

  /**
   * Initialize the component
   */
  private init(): void {
    this.convertItems();
    this.createWrapper();
    this.createItemsContainer();
    this.createLinkButton();
    this.drawItems();
    this.draw();
  }

  /**
   * Create the main wrapper element
   */
  private createWrapper(): void {
    this.element = document.createElement('div');
    this.element.className = styles['linked-inputs'] ?? '';

    if (this.options.extendedClasses) {
      this.element.className += ` ${this.options.extendedClasses}`;
    }
  }

  /**
   * Create the items container element
   */
  private createItemsContainer(): void {
    this.itemsContainer = document.createElement('div');
    this.itemsContainer.className = styles['linked-inputs__items'] ?? '';
  }

  /**
   * Create the link/unlink toggle button
   */
  private createLinkButton(): void {
    const buttonClassName = styles['linked-inputs__link'];
    this.linkButton = new Button({
      children: '',
      ...(buttonClassName ? { className: buttonClassName } : {}),
      variant: 'ghost',
      onClick: () => this.handleLinkButtonClick(),
    });

    this.linkButtonElement = this.linkButton.render();

    // Set initial content
    if (this.options.linkIcon) {
      if (typeof this.options.linkIcon === 'string') {
        this.linkButtonElement.innerHTML = this.options.linkIcon;
      } else {
        this.linkButtonElement.innerHTML = '';
        this.linkButtonElement.appendChild(this.options.linkIcon);
      }
    }

    // Set initial active state
    if (this.isLinked) {
      const activeClass = styles['linked-inputs__link--active'];
      if (activeClass) {
        this.linkButtonElement.classList.add(activeClass);
      }
    }

    // Add data attribute for testing
    this.linkButtonElement.setAttribute('data-testid', 'link-button');
  }

  /**
   * Handle link button click
   */
  private handleLinkButtonClick(): void {
    this.isLinked = !this.isLinked;

    // Update button active state
    const activeClass = styles['linked-inputs__link--active'];
    if (this.isLinked) {
      if (activeClass) {
        this.linkButtonElement.classList.add(activeClass);
      }
      this.syncInputs();
    } else {
      if (activeClass) {
        this.linkButtonElement.classList.remove(activeClass);
      }
    }

    // Call callback
    if (this.options.onLink) {
      this.options.onLink(this, this.alphaInput?.getInputValue());
    }
  }

  /**
   * Sync all inputs to the alpha input value
   */
  private syncInputs(): void {
    if (this.alphaInput) {
      const alphaValue = this.alphaInput.getInputValue();

      this.items.forEach((item) => {
        const input = item.input;
        if (input !== this.alphaInput) {
          input.update(alphaValue);
        }
      });
    }
  }

  /**
   * Draw the component
   */
  private draw(): void {
    this.element.innerHTML = '';
    this.element.appendChild(this.itemsContainer);
    this.element.appendChild(this.linkButtonElement);
  }

  /**
   * Draw items into the container
   */
  private drawItems(): void {
    this.itemsContainer.innerHTML = '';

    this.items.forEach((item) => {
      if (this.options.useLabels && 'wrapper' in item) {
        this.itemsContainer.appendChild(item.wrapper);
      } else {
        this.itemsContainer.appendChild(item.input.getElement());
      }
    });
  }

  /**
   * Convert item configurations to InputNumber instances
   */
  private convertItems(): void {
    this.items = this.options.items.map((config) => {
      // Create InputNumber if not already an instance
      let inputNumber: InputNumber;

      if (config.input instanceof InputNumber) {
        inputNumber = config.input;
      } else {
        const inputConfig = config.input as InputNumberConfig;
        const itemClass = styles['linked-inputs__item'];
        const inputClass = styles['linked-inputs__input'];
        inputNumber = new InputNumber({
          ...inputConfig,
          class: `${inputConfig.class || ''} ${itemClass || ''}`.trim(),
          inputClass: `${inputConfig.inputClass || ''} ${inputClass || ''}`.trim(),
        });
      }

      // Check if this is the alpha input
      if (config.alphaInput) {
        this.alphaInput = inputNumber;
        this.autoAlphaInput = false;
      }

      // Add change event listener
      inputNumber.on('change', (value: number, unit: string, inputValue: string, userInput: boolean) => {
        this.handleItemChange(inputNumber, value, unit, inputValue, userInput);
      });

      // Create item object
      const itemLabel = config.label;
      const item: LinkedInputItem = {
        ...(itemLabel !== undefined ? { label: itemLabel } : {}),
        input: inputNumber,
      } as LinkedInputItem;

      // Wrap in label if needed
      if (this.options.useLabels && config.label) {
        const wrapper = document.createElement('div');
        wrapper.className = styles['linked-inputs__item-wrapper'] ?? '';

        const label = document.createElement('label');
        label.className = styles['linked-inputs__label'] ?? '';
        label.textContent = config.label;

        wrapper.appendChild(label);
        wrapper.appendChild(inputNumber.getElement());

        return { ...item, wrapper };
      }

      return item;
    });

    // Set alpha input to first item if not explicitly set
    if (!this.alphaInput && this.items.length > 0 && this.items[0]) {
      this.alphaInput = this.items[0].input;
    }
  }

  /**
   * Handle input change
   */
  private handleItemChange(
    item: InputNumber,
    _itemValue: number,
    _itemUnit: string,
    _itemInputValue: string,
    userInput: boolean
  ): void {
    // Update alpha input if auto mode and user input
    if (this.autoAlphaInput && userInput) {
      this.alphaInput = item;
    }

    // Sync inputs if linked
    if (this.isLinked) {
      // Debounce sync
      setTimeout(() => {
        this.syncInputs();
      }, 0);
    }
  }

  /**
   * Get the component element
   *
   * @returns The root element
   */
  public getEl(): HTMLElement {
    return this.element;
  }

  /**
   * Get all input instances
   *
   * @returns Array of InputNumber instances
   */
  public getInputs(): InputNumber[] {
    return this.items.map((item) => item.input);
  }

  /**
   * Get current link state
   *
   * @returns True if inputs are linked
   */
  public isLinkedState(): boolean {
    return this.isLinked;
  }

  /**
   * Set link state
   *
   * @param linked - Whether to link inputs
   */
  public setLinked(linked: boolean): void {
    if (this.isLinked !== linked) {
      this.handleLinkButtonClick();
    }
  }

  /**
   * Get the alpha (source) input
   *
   * @returns The alpha InputNumber instance
   */
  public getAlphaInput(): InputNumber {
    return this.alphaInput;
  }

  /**
   * Set the alpha (source) input
   *
   * @param input - InputNumber instance to use as alpha
   */
  public setAlphaInput(input: InputNumber): void {
    if (this.items.some((item) => item.input === input)) {
      this.alphaInput = input;
      this.autoAlphaInput = false;

      if (this.isLinked) {
        this.syncInputs();
      }
    }
  }

  /**
   * Destroy the component and clean up
   */
  public destroy(): void {
    // Clean up event listeners
    this.items.forEach((item) => {
      item.input.destroy();
    });

    this.linkButton.destroy();
    this.element.remove();
  }
}
