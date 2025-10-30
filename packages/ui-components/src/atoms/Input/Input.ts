/**
 * Input component
 *
 * A versatile input component supporting multiple types, sizes, and validation states.
 *
 * @example
 * Basic usage:
 * ```ts
 * const input = new Input({
 *   type: 'text',
 *   placeholder: 'Enter your name',
 *   onChange: (value) => console.log(value)
 * });
 * document.body.appendChild(input.render());
 * ```
 */

import type { InputProps } from './input.types';
import styles from './input.module.scss';

export class Input {
  private props: InputProps;
  private element: HTMLInputElement;

  /**
   * Creates a new Input instance
   *
   * @param props - Input properties
   */
  constructor(props: InputProps) {
    this.props = {
      type: 'text',
      size: 'medium',
      disabled: false,
      readonly: false,
      required: false,
      fullWidth: false,
      validationState: 'default',
      ...props,
    };

    this.element = this.createInput();
    this.attachEventListeners();
  }

  /**
   * Creates the input element
   *
   * @returns Input element
   */
  private createInput(): HTMLInputElement {
    const input = document.createElement('input');

    // Set attributes
    input.type = this.props.type!;
    input.className = this.getClassNames();

    if (this.props.value !== undefined) {
      input.value = this.props.value;
    }

    if (this.props.placeholder) {
      input.placeholder = this.props.placeholder;
    }

    if (this.props.name) {
      input.name = this.props.name;
    }

    if (this.props.id) {
      input.id = this.props.id;
    }

    input.disabled = this.props.disabled!;
    input.readOnly = this.props.readonly!;
    input.required = this.props.required!;

    if (this.props.minLength !== undefined) {
      input.minLength = this.props.minLength;
    }

    if (this.props.maxLength !== undefined) {
      input.maxLength = this.props.maxLength;
    }

    if (this.props.pattern) {
      input.pattern = this.props.pattern;
    }

    if (this.props.autocomplete) {
      input.setAttribute('autocomplete', this.props.autocomplete);
    }

    // Set ARIA attributes
    if (this.props.ariaLabel) {
      input.setAttribute('aria-label', this.props.ariaLabel);
    }

    if (this.props.ariaDescribedBy) {
      input.setAttribute('aria-describedby', this.props.ariaDescribedBy);
    }

    if (this.props.validationState === 'error') {
      input.setAttribute('aria-invalid', 'true');
    }

    if (this.props.required) {
      input.setAttribute('aria-required', 'true');
    }

    return input;
  }

  /**
   * Generates CSS class names based on props
   *
   * @returns Space-separated class names
   */
  private getClassNames(): string {
    const classes = [styles.input];

    // Size
    if (this.props.size) {
      classes.push(styles[`input--${this.props.size}`]);
    }

    // Validation state
    if (this.props.validationState && this.props.validationState !== 'default') {
      classes.push(styles[`input--${this.props.validationState}`]);
    }

    // Full width
    if (this.props.fullWidth) {
      classes.push(styles['input--full-width']);
    }

    // Custom class
    if (this.props.className) {
      classes.push(this.props.className);
    }

    return classes.join(' ');
  }

  /**
   * Attaches event listeners
   */
  private attachEventListeners(): void {
    if (this.props.onChange) {
      this.element.addEventListener('change', (e) => {
        this.props.onChange!(this.element.value, e);
      });
    }

    if (this.props.onInput) {
      this.element.addEventListener('input', (e) => {
        this.props.onInput!(this.element.value, e);
      });
    }

    if (this.props.onFocus) {
      this.element.addEventListener('focus', this.props.onFocus);
    }

    if (this.props.onBlur) {
      this.element.addEventListener('blur', this.props.onBlur);
    }

    if (this.props.onKeyDown) {
      this.element.addEventListener('keydown', this.props.onKeyDown);
    }

    if (this.props.onKeyUp) {
      this.element.addEventListener('keyup', this.props.onKeyUp);
    }
  }

  /**
   * Removes event listeners
   */
  private removeEventListeners(): void {
    if (this.props.onChange) {
      this.element.removeEventListener('change', (e) => {
        this.props.onChange!(this.element.value, e);
      });
    }

    if (this.props.onInput) {
      this.element.removeEventListener('input', (e) => {
        this.props.onInput!(this.element.value, e);
      });
    }

    if (this.props.onFocus) {
      this.element.removeEventListener('focus', this.props.onFocus);
    }

    if (this.props.onBlur) {
      this.element.removeEventListener('blur', this.props.onBlur);
    }

    if (this.props.onKeyDown) {
      this.element.removeEventListener('keydown', this.props.onKeyDown);
    }

    if (this.props.onKeyUp) {
      this.element.removeEventListener('keyup', this.props.onKeyUp);
    }
  }

  /**
   * Updates input properties
   *
   * @param props - Partial properties to update
   */
  public update(props: Partial<InputProps>): void {
    this.removeEventListeners();

    this.props = { ...this.props, ...props };

    // Update element attributes
    this.element.className = this.getClassNames();
    this.element.type = this.props.type!;

    if (props.value !== undefined) {
      this.element.value = props.value;
    }

    if (props.placeholder !== undefined) {
      this.element.placeholder = props.placeholder;
    }

    if (props.disabled !== undefined) {
      this.element.disabled = props.disabled;
    }

    if (props.readonly !== undefined) {
      this.element.readOnly = props.readonly;
    }

    if (props.required !== undefined) {
      this.element.required = props.required;
      if (props.required) {
        this.element.setAttribute('aria-required', 'true');
      } else {
        this.element.removeAttribute('aria-required');
      }
    }

    if (props.validationState !== undefined) {
      if (props.validationState === 'error') {
        this.element.setAttribute('aria-invalid', 'true');
      } else {
        this.element.removeAttribute('aria-invalid');
      }
    }

    this.attachEventListeners();
  }

  /**
   * Renders the input element
   *
   * @returns Input HTML element
   */
  public render(): HTMLInputElement {
    return this.element;
  }

  /**
   * Destroys the input and cleans up
   */
  public destroy(): void {
    this.removeEventListeners();
    this.element.remove();
  }

  /**
   * Gets the input value
   *
   * @returns Current input value
   */
  public getValue(): string {
    return this.element.value;
  }

  /**
   * Sets the input value
   *
   * @param value - New value
   */
  public setValue(value: string): void {
    this.element.value = value;
  }

  /**
   * Clears the input
   */
  public clear(): void {
    this.element.value = '';
  }

  /**
   * Focuses the input
   */
  public focus(): void {
    this.element.focus();
  }

  /**
   * Blurs the input
   */
  public blur(): void {
    this.element.blur();
  }

  /**
   * Selects all text in the input
   */
  public select(): void {
    this.element.select();
  }

  /**
   * Gets the input's disabled state
   *
   * @returns Whether input is disabled
   */
  public isDisabled(): boolean {
    return this.element.disabled;
  }

  /**
   * Sets the input's disabled state
   *
   * @param disabled - New disabled state
   */
  public setDisabled(disabled: boolean): void {
    this.update({ disabled });
  }

  /**
   * Validates the input using HTML5 validation
   *
   * @returns Whether the input is valid
   */
  public validate(): boolean {
    return this.element.checkValidity();
  }
}
