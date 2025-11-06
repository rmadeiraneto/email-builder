/**
 * InputNumber - A number input with increment/decrement controls
 *
 * @example
 * ```ts
 * const inputNumber = new InputNumber({
 *   defaultValue: 16,
 *   min: 0,
 *   max: 100,
 *   unit: 'px',
 *   increment: 1,
 *   onChange: (value, unit) => {
 *     console.log(`Value: ${value}${unit}`);
 *   }
 * });
 *
 * document.body.appendChild(inputNumber.getElement());
 * ```
 */

import type { InputNumberConfig } from './input-number.types';
import { CSS_UNITS as DEFAULT_UNITS } from './input-number.types';
import styles from './input-number.module.scss';

type EventCallback = (
  value: number,
  unit: string,
  inputValue: string,
  userInput: boolean
) => void;

export class InputNumber {
  private config: Required<
    Omit<
      InputNumberConfig,
      | 'min'
      | 'max'
      | 'onChange'
      | 'onUpArrowClick'
      | 'onDownArrowClick'
      | 'arrowUp'
      | 'arrowDown'
    >
  > & {
    min: number | null;
    max: number | null;
    onChange?: (value: number, unit: string, inputValue: string, userInput: boolean) => void;
    onUpArrowClick?: (value: number, unit: string, inputValue: string) => void;
    onDownArrowClick?: (value: number, unit: string, inputValue: string) => void;
    arrowUp?: string | HTMLElement;
    arrowDown?: string | HTMLElement;
  };

  private element: HTMLDivElement;
  private input: HTMLInputElement;
  private upArrow: HTMLDivElement;
  private downArrow: HTMLDivElement;
  private value: number;
  private unit: string;
  private inputValue: string;
  private disabled: boolean;
  private eventListeners: Map<string, EventCallback[]> = new Map();

  constructor(config: InputNumberConfig = {}) {
    this.config = {
      defaultValue: config.defaultValue ?? 0,
      increment: config.increment ?? 1,
      min: config.min ?? null,
      max: config.max ?? null,
      unit: config.unit ?? 'px',
      changeableUnit: config.changeableUnit ?? false,
      availableUnits: config.availableUnits ?? DEFAULT_UNITS,
      class: config.class ?? '',
      inputClass: config.inputClass ?? '',
      disabled: config.disabled ?? false,
      emitEventsWhenDisabled: config.emitEventsWhenDisabled ?? false,
      arrowUpClickPreventDefault: config.arrowUpClickPreventDefault ?? false,
      arrowDownClickPreventDefault: config.arrowDownClickPreventDefault ?? false,
      ...(config.arrowUp !== undefined && { arrowUp: config.arrowUp }),
      ...(config.arrowDown !== undefined && { arrowDown: config.arrowDown }),
      ...(config.onChange !== undefined && { onChange: config.onChange }),
      ...(config.onUpArrowClick !== undefined && { onUpArrowClick: config.onUpArrowClick }),
      ...(config.onDownArrowClick !== undefined && { onDownArrowClick: config.onDownArrowClick }),
    };

    this.value = this.config.defaultValue;
    this.unit = this.config.unit;
    this.inputValue = `${this.value}${this.unit}`;
    this.disabled = this.config.disabled;

    this.element = this.createWrapper();
    this.input = this.createInput();
    this.upArrow = this.createArrow('up');
    this.downArrow = this.createArrow('down');

    this.draw();

    // Check initial arrow states based on min/max
    if (this.config.min !== null && this.value <= this.config.min) {
      this.disableArrow(this.downArrow);
    }
    if (this.config.max !== null && this.value >= this.config.max) {
      this.disableArrow(this.upArrow);
    }

    if (this.disabled) {
      this.disable();
    }
  }

  /**
   * Create the wrapper element
   */
  private createWrapper(): HTMLDivElement {
    const wrapper = document.createElement('div');
    wrapper.className = styles['input-number'] ?? '';

    if (this.config.class) {
      wrapper.className += ` ${this.config.class}`;
    }

    return wrapper;
  }

  /**
   * Create the input element
   */
  private createInput(): HTMLInputElement {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = `${styles['input-number__input']}`;

    if (this.config.inputClass) {
      input.className += ` ${this.config.inputClass}`;
    }

    input.value = this.inputValue;

    input.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      this.validateAndSetValue(target.value, true);
    });

    return input;
  }

  /**
   * Create arrow element
   */
  private createArrow(direction: 'up' | 'down'): HTMLDivElement {
    const arrow = document.createElement('div');
    arrow.className =
      direction === 'up'
        ? (styles['input-number__up-arrow'] ?? '')
        : (styles['input-number__down-arrow'] ?? '');

    // Add data-testid for testing
    arrow.setAttribute('data-testid', `input-number-${direction}-arrow`);

    arrow.addEventListener('click', () => {
      if (direction === 'up') {
        this.onUpArrowClick();
      } else {
        this.onDownArrowClick();
      }
    });

    // Set arrow content
    const arrowContent =
      direction === 'up' ? this.config.arrowUp : this.config.arrowDown;

    if (arrowContent) {
      if (typeof arrowContent === 'string') {
        arrow.innerHTML = arrowContent;
      } else {
        arrow.appendChild(arrowContent);
      }
    } else {
      // Default arrow icon
      arrow.textContent = direction === 'up' ? '▲' : '▼';
    }

    return arrow;
  }

  /**
   * Draw/append elements to wrapper
   */
  private draw(): void {
    this.element.appendChild(this.input);
    this.element.appendChild(this.upArrow);
    this.element.appendChild(this.downArrow);
  }

  /**
   * Extract unit from a value string
   */
  private extractUnit(valueString: string): string {
    const match = valueString.match(/[a-z%]+$/i);
    return match ? match[0] : this.unit;
  }

  /**
   * Validate if a unit is allowed
   */
  private validateUnit(valueString: string): boolean {
    const unit = this.extractUnit(valueString);
    return this.config.availableUnits.includes(unit);
  }

  /**
   * Set the value
   */
  private setValue(inputValue: string | number, userInput = false): void {
    const valueString = String(inputValue);
    this.value = parseFloat(valueString) || 0;

    if (this.config.changeableUnit && this.validateUnit(valueString)) {
      this.inputValue = valueString.replace(/\s+/g, '');
      this.unit = this.extractUnit(valueString);
    } else {
      this.inputValue = `${this.value}${this.unit}`;
    }

    this.handleChange(userInput);
  }

  /**
   * Validate value against min/max and set
   */
  private validateAndSetValue(newValue: string | number, userInput = false): void {
    // Handle empty string as 0
    if (newValue === '' || newValue === null || newValue === undefined) {
      newValue = 0;
    }

    const valueString = String(newValue);
    let numValue = typeof newValue === 'string' ? parseFloat(newValue) : newValue;

    if (isNaN(numValue)) {
      numValue = this.value; // Keep current value if parse fails
    }

    // Check min constraint
    if (this.config.min !== null && numValue <= this.config.min) {
      numValue = this.config.min;
      this.disableArrow(this.downArrow);
    } else if (
      this.config.min !== null &&
      numValue > this.config.min &&
      this.arrowIsDisabled(this.downArrow)
    ) {
      this.enableArrow(this.downArrow);
    }

    // Check max constraint
    if (this.config.max !== null && numValue >= this.config.max) {
      numValue = this.config.max;
      this.disableArrow(this.upArrow);
    } else if (
      this.config.max !== null &&
      numValue < this.config.max &&
      this.arrowIsDisabled(this.upArrow)
    ) {
      this.enableArrow(this.upArrow);
    }

    // Preserve unit from input if changeableUnit is enabled and unit is valid
    let unitToUse = this.unit;
    if (this.config.changeableUnit && typeof newValue === 'string' && this.validateUnit(valueString)) {
      unitToUse = this.extractUnit(valueString);
    }

    this.setValue(`${numValue}${unitToUse}`, userInput);
  }

  /**
   * Handle change event
   */
  private handleChange(userInput: boolean): void {
    this.input.value = this.inputValue;

    if (this.config.emitEventsWhenDisabled || !this.disabled) {
      // Call onChange callback
      if (this.config.onChange) {
        this.config.onChange(this.value, this.unit, this.inputValue, userInput);
      }

      // Emit to event listeners
      this.emit('change', this.value, this.unit, this.inputValue, userInput);
    }
  }

  /**
   * Increment the value
   */
  private incrementValue(userInput = false): void {
    this.validateAndSetValue(this.value + this.config.increment, userInput);
  }

  /**
   * Decrement the value
   */
  private decrementValue(userInput = false): void {
    this.validateAndSetValue(this.value - this.config.increment, userInput);
  }

  /**
   * Handle up arrow click
   */
  private onUpArrowClick(): void {
    if (!this.config.arrowUpClickPreventDefault) {
      this.incrementValue(true);
    }

    if (this.config.onUpArrowClick) {
      this.config.onUpArrowClick(this.value, this.unit, this.inputValue);
    }
  }

  /**
   * Handle down arrow click
   */
  private onDownArrowClick(): void {
    if (!this.config.arrowDownClickPreventDefault) {
      this.decrementValue(true);
    }

    if (this.config.onDownArrowClick) {
      this.config.onDownArrowClick(this.value, this.unit, this.inputValue);
    }
  }

  /**
   * Check if arrow is disabled
   */
  private arrowIsDisabled(arrow: HTMLDivElement): boolean {
    return arrow.classList.contains(styles['input-number__arrow--disabled'] ?? '');
  }

  /**
   * Disable an arrow
   */
  private disableArrow(arrow: HTMLDivElement): void {
    const disabledClass = styles['input-number__arrow--disabled'];
    if (disabledClass) {
      arrow.classList.add(disabledClass);
    }
    arrow.setAttribute('data-disabled', 'true');
  }

  /**
   * Enable an arrow
   */
  private enableArrow(arrow: HTMLDivElement): void {
    const disabledClass = styles['input-number__arrow--disabled'];
    if (disabledClass) {
      arrow.classList.remove(disabledClass);
    }
    arrow.removeAttribute('data-disabled');
  }

  /**
   * Emit an event to listeners
   */
  private emit(
    event: string,
    value: number,
    unit: string,
    inputValue: string,
    userInput: boolean
  ): void {
    const callbacks = this.eventListeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(value, unit, inputValue, userInput));
    }
  }

  // Public API

  /**
   * Get the root element
   */
  public getElement(): HTMLDivElement {
    return this.element;
  }

  /**
   * Get the input element
   */
  public getInput(): HTMLInputElement {
    return this.input;
  }

  /**
   * Get the numeric value
   */
  public getValue(): number {
    return this.value;
  }

  /**
   * Get the unit
   */
  public getUnit(): string {
    return this.unit;
  }

  /**
   * Get the full input value (with unit)
   */
  public getInputValue(): string {
    return this.inputValue;
  }

  /**
   * Set value programmatically
   */
  public update(newValue: number | string): void {
    this.validateAndSetValue(newValue, false);
  }

  /**
   * Enable the input
   */
  public enable(): void {
    const disabledClass = styles['input-number--disabled'];
    if (disabledClass) {
      this.element.classList.remove(disabledClass);
    }
    this.input.removeAttribute('disabled');
    this.enableArrow(this.upArrow);
    this.enableArrow(this.downArrow);
    this.disabled = false;
  }

  /**
   * Disable the input
   */
  public disable(): void {
    const disabledClass = styles['input-number--disabled'];
    if (disabledClass) {
      this.element.classList.add(disabledClass);
    }
    this.input.setAttribute('disabled', '');
    this.disableArrow(this.upArrow);
    this.disableArrow(this.downArrow);
    this.disabled = true;
  }

  /**
   * Check if disabled
   */
  public isDisabled(): boolean {
    return this.disabled;
  }

  /**
   * Register event listener
   */
  public on(event: string, callback: EventCallback): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  /**
   * Unregister event listener
   */
  public off(event: string, callback: EventCallback): void {
    const callbacks = this.eventListeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * Destroy the component
   */
  public destroy(): void {
    this.element.remove();
    this.eventListeners.clear();
  }
}
