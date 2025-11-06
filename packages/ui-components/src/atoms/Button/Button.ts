/**
 * Button component
 *
 * A versatile button component supporting multiple variants, sizes, and states.
 * Can be used with icons and custom content.
 *
 * @example
 * Basic usage:
 * ```ts
 * const button = new Button({
 *   variant: 'primary',
 *   children: 'Click me',
 *   onClick: () => console.log('clicked')
 * });
 * document.body.appendChild(button.render());
 * ```
 *
 * @example
 * With icon:
 * ```ts
 * const button = new Button({
 *   variant: 'secondary',
 *   size: 'large',
 *   icon: 'star',
 *   children: 'Favorite'
 * });
 * document.body.appendChild(button.render());
 * ```
 */

import type { ButtonProps } from './button.types';
import styles from './button.module.scss';
import { classNames, setAriaAttribute } from '../../utils';

export class Button {
  private props: ButtonProps;
  private element: HTMLButtonElement;

  /**
   * Creates a new Button instance
   *
   * @param props - Button properties
   */
  constructor(props: ButtonProps) {
    this.props = {
      variant: 'primary',
      size: 'medium',
      type: 'button',
      disabled: false,
      fullWidth: false,
      iconPosition: 'left',
      ...props,
    };

    this.element = this.createButton();
    this.attachEventListeners();
  }

  /**
   * Creates the button element
   *
   * @returns Button element
   */
  private createButton(): HTMLButtonElement {
    const button = document.createElement('button');

    // Set attributes
    button.type = this.props.type!;
    button.className = this.getClassNames();
    button.disabled = this.props.disabled!;

    // Set ARIA attributes
    setAriaAttribute(button, 'aria-disabled', this.props.disabled);

    // Build button content
    this.buildContent(button);

    return button;
  }

  /**
   * Builds the button content
   *
   * @param button - Button element to populate
   */
  private buildContent(button: HTMLButtonElement): void {
    // Clear existing content
    button.innerHTML = '';

    // Add icon (left position)
    if (this.props.icon && this.props.iconPosition === 'left') {
      button.appendChild(this.createIcon());
    }

    // Add text
    const textSpan = document.createElement('span');
    textSpan.className = styles.button__text ?? '';
    textSpan.textContent = this.props.children;
    button.appendChild(textSpan);

    // Add icon (right position)
    if (this.props.icon && this.props.iconPosition === 'right') {
      button.appendChild(this.createIcon());
    }
  }

  /**
   * Creates an icon element
   *
   * @returns Icon element
   */
  private createIcon(): HTMLElement {
    const icon = document.createElement('i');
    const iconClass = this.props.iconPosition === 'right' ? styles['button__icon--right'] : styles.button__icon;
    icon.className = `ri-${this.props.icon} ${iconClass}`;
    icon.setAttribute('aria-hidden', 'true');
    return icon;
  }

  /**
   * Generates CSS class names based on props
   *
   * @returns Space-separated class names
   */
  private getClassNames(): string {
    return classNames(
      styles.button,
      this.props.variant && styles[`button--${this.props.variant}`],
      this.props.size && styles[`button--${this.props.size}`],
      this.props.fullWidth && styles['button--full-width'],
      this.props.disabled && styles['button--disabled'],
      this.props.className
    );
  }

  /**
   * Attaches event listeners
   */
  private attachEventListeners(): void {
    if (this.props.onClick) {
      this.element.addEventListener('click', this.props.onClick);
    }

    if (this.props.onFocus) {
      this.element.addEventListener('focus', this.props.onFocus);
    }

    if (this.props.onBlur) {
      this.element.addEventListener('blur', this.props.onBlur);
    }
  }

  /**
   * Removes event listeners
   */
  private removeEventListeners(): void {
    if (this.props.onClick) {
      this.element.removeEventListener('click', this.props.onClick);
    }

    if (this.props.onFocus) {
      this.element.removeEventListener('focus', this.props.onFocus);
    }

    if (this.props.onBlur) {
      this.element.removeEventListener('blur', this.props.onBlur);
    }
  }

  /**
   * Updates button properties
   *
   * @param props - Partial properties to update
   */
  public update(props: Partial<ButtonProps>): void {
    // Remove old event listeners
    this.removeEventListeners();

    // Update props
    this.props = { ...this.props, ...props };

    // Update element
    this.element.className = this.getClassNames();
    this.element.disabled = this.props.disabled!;
    this.element.type = this.props.type!;

    // Update ARIA
    if (this.props.disabled) {
      this.element.setAttribute('aria-disabled', 'true');
    } else {
      this.element.removeAttribute('aria-disabled');
    }

    // Rebuild content
    this.buildContent(this.element);

    // Attach new event listeners
    this.attachEventListeners();
  }

  /**
   * Renders the button element
   *
   * @returns Button HTML element
   */
  public render(): HTMLButtonElement {
    return this.element;
  }

  /**
   * Destroys the button and cleans up
   */
  public destroy(): void {
    this.removeEventListeners();
    this.element.remove();
  }

  /**
   * Gets the button's disabled state
   *
   * @returns Whether button is disabled
   */
  public isDisabled(): boolean {
    return this.props.disabled!;
  }

  /**
   * Sets the button's disabled state
   *
   * @param disabled - New disabled state
   */
  public setDisabled(disabled: boolean): void {
    this.update({ disabled });
  }

  /**
   * Triggers a programmatic click
   */
  public click(): void {
    this.element.click();
  }

  /**
   * Focuses the button
   */
  public focus(): void {
    this.element.focus();
  }

  /**
   * Blurs the button
   */
  public blur(): void {
    this.element.blur();
  }
}
