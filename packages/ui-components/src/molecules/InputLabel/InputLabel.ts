/**
 * InputLabel - A component that wraps an input with a label
 *
 * @example
 * ```ts
 * const input = document.createElement('input');
 * input.type = 'text';
 * input.id = 'username';
 *
 * const inputLabel = new InputLabel({
 *   input,
 *   label: 'Username',
 *   description: 'Enter your username',
 *   required: true,
 *   inputId: 'username'
 * });
 *
 * document.body.appendChild(inputLabel.getElement());
 * ```
 */

import type { InputLabelConfig } from './input-label.types';
import styles from './input-label.module.scss';

export class InputLabel {
  private config: Required<Omit<InputLabelConfig, 'description' | 'onChange'>> & {
    description?: string;
    onChange?: (value: string) => void;
  };
  private element: HTMLDivElement;
  private labelElement: HTMLLabelElement;
  private inputWrapper: HTMLDivElement;
  private inputElement: HTMLInputElement;
  private tooltipElement?: HTMLSpanElement;

  constructor(config: InputLabelConfig) {
    this.config = {
      input: config.input,
      label: config.label,
      description: config.description,
      labelClass: config.labelClass ?? '',
      inputWrapperClass: config.inputWrapperClass ?? '',
      class: config.class ?? '',
      sideBySide: config.sideBySide ?? false,
      required: config.required ?? false,
      inputId: config.inputId ?? this.generateId(),
      onChange: config.onChange,
    };

    this.inputElement = this.setupInput();
    this.inputWrapper = this.createInputWrapper();
    this.labelElement = this.createLabel();
    this.element = this.createWrapper();
  }

  /**
   * Generate a unique ID for the input
   */
  private generateId(): string {
    return `input-${Math.random().toString(36).substring(2, 11)}`;
  }

  /**
   * Setup the input element
   */
  private setupInput(): HTMLInputElement {
    if (typeof this.config.input === 'string') {
      const input = document.createElement('input');
      input.type = 'text';
      input.value = this.config.input;
      input.id = this.config.inputId;
      return input;
    } else if (this.config.input instanceof HTMLInputElement) {
      this.config.input.id = this.config.inputId;
      return this.config.input;
    }

    throw new Error('Invalid input type');
  }

  /**
   * Create the input wrapper element
   */
  private createInputWrapper(): HTMLDivElement {
    const wrapper = document.createElement('div');
    wrapper.className = styles['input-label__input'];

    if (this.config.inputWrapperClass) {
      wrapper.className += ` ${this.config.inputWrapperClass}`;
    }

    wrapper.appendChild(this.inputElement);
    return wrapper;
  }

  /**
   * Create the label element
   */
  private createLabel(): HTMLLabelElement {
    const label = document.createElement('label');
    label.className = styles['input-label__label'];
    label.htmlFor = this.config.inputId;

    if (this.config.labelClass) {
      label.className += ` ${this.config.labelClass}`;
    }

    // Set label content
    if (typeof this.config.label === 'string') {
      label.textContent = this.config.label;
    } else if (this.config.label instanceof HTMLElement) {
      label.appendChild(this.config.label);
    }

    // Add required indicator
    if (this.config.required) {
      const requiredIndicator = document.createElement('span');
      requiredIndicator.className = styles['input-label__required'];
      requiredIndicator.textContent = '*';
      requiredIndicator.setAttribute('aria-label', 'required');
      label.appendChild(requiredIndicator);
    }

    // Add description tooltip if provided
    if (this.config.description) {
      this.tooltipElement = this.createTooltip(this.config.description);
      label.appendChild(this.tooltipElement);
    }

    return label;
  }

  /**
   * Create a tooltip element for the description
   */
  private createTooltip(description: string): HTMLSpanElement {
    const tooltip = document.createElement('span');
    tooltip.className = styles['input-label__tooltip'];
    tooltip.textContent = '?';
    tooltip.title = description;
    tooltip.setAttribute('aria-label', description);
    tooltip.setAttribute('role', 'tooltip');
    return tooltip;
  }

  /**
   * Create the wrapper element
   */
  private createWrapper(): HTMLDivElement {
    const wrapper = document.createElement('div');
    wrapper.className = styles['input-label'];

    if (this.config.sideBySide) {
      wrapper.className += ` ${styles['input-label--inline']}`;
    }

    if (this.config.class) {
      wrapper.className += ` ${this.config.class}`;
    }

    wrapper.appendChild(this.labelElement);
    wrapper.appendChild(this.inputWrapper);

    // Attach change listener if provided
    if (this.config.onChange) {
      this.inputElement.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement;
        this.config.onChange?.(target.value);
      });
    }

    return wrapper;
  }

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
    return this.inputElement;
  }

  /**
   * Get the label element
   */
  public getLabel(): HTMLLabelElement {
    return this.labelElement;
  }

  /**
   * Set the input value
   */
  public setValue(value: string): void {
    this.inputElement.value = value;
  }

  /**
   * Get the input value
   */
  public getValue(): string {
    return this.inputElement.value;
  }

  /**
   * Set the label text
   */
  public setLabel(label: string): void {
    if (this.labelElement.firstChild) {
      this.labelElement.firstChild.textContent = label;
    } else {
      this.labelElement.textContent = label;
    }
  }

  /**
   * Enable the input
   */
  public enable(): void {
    this.inputElement.removeAttribute('disabled');
    this.element.classList.remove(styles['input-label--disabled']);
  }

  /**
   * Disable the input
   */
  public disable(): void {
    this.inputElement.setAttribute('disabled', '');
    this.element.classList.add(styles['input-label--disabled']);
  }

  /**
   * Check if the input is disabled
   */
  public isDisabled(): boolean {
    return this.inputElement.hasAttribute('disabled');
  }

  /**
   * Destroy the component and clean up
   */
  public destroy(): void {
    this.element.remove();
  }
}
