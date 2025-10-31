/**
 * ToggleButton Component
 *
 * A toggle button component that can be clicked to switch between active and inactive states.
 * Uses data attributes for state management.
 *
 * @example
 * ```ts
 * const toggleButton = new ToggleButton({
 *   startActive: false,
 *   onChange: (isActive) => console.log('Active:', isActive)
 * });
 * document.body.appendChild(toggleButton.getEl());
 * ```
 */

import styles from './toggle-button.module.scss';
import type { ToggleButtonOptions } from './toggle-button.types';

export class ToggleButton {
  private options: Required<ToggleButtonOptions>;
  private className: string;
  private isDisable: boolean;
  private isActive: boolean;
  private element: HTMLElement;

  constructor(options: ToggleButtonOptions = {}) {
    const defaults: Required<ToggleButtonOptions> = {
      classPrefix: 'eb-',
      cssClass: 'toggle-btn',
      extendedClasses: '',
      disabled: false,
      onChange: null as any,
      startActive: false,
      clickStopPropagation: false
    };

    this.options = { ...defaults, ...options };
    this.className = `${this.options.classPrefix}${this.options.cssClass}`;
    this.isDisable = this.options.disabled;
    this.isActive = this.options.startActive;
    this.element = document.createElement('div');
    this.init();
  }

  /**
   * Initialize the toggle button
   */
  private init(): void {
    this.createElement();
    this.setActive(this.isActive);
  }

  /**
   * Create the toggle button element
   */
  private createElement(): void {
    // Add base class from CSS modules
    this.element.className = styles['toggle-button'];

    // Add extended classes if provided
    if (this.options.extendedClasses) {
      this.addClassesString(this.element, this.options.extendedClasses);
    }

    // Add click event listener
    this.element.addEventListener('click', (e) => {
      if (this.options.clickStopPropagation) {
        e.stopPropagation();
      }
      this.handleOnClick();
    });
  }

  /**
   * Handle click event
   */
  private handleOnClick(): void {
    if (this.isDisable) {
      return;
    }

    this.toggle();

    if (typeof this.options.onChange === 'function') {
      this.options.onChange.call(this, this.isActive);
    }
  }

  /**
   * Add CSS classes from a space-separated string
   */
  private addClassesString(element: HTMLElement, classString: string): void {
    const classes = classString.split(' ').filter(cls => cls.trim() !== '');
    classes.forEach(cls => element.classList.add(cls));
  }

  /**
   * Toggle the active state
   */
  public toggle(): void {
    this.setActive(!this.isActive);
  }

  /**
   * Set the active state
   */
  public setActive(isActive: boolean = true): void {
    this.isActive = isActive;
    this.element.setAttribute('data-toggled', String(this.isActive));
  }

  /**
   * Get the active state
   */
  public getActive(): boolean {
    return this.isActive;
  }

  /**
   * Set the disabled state
   */
  public setDisable(isDisable: boolean = true): void {
    this.isDisable = isDisable;
    this.element.setAttribute('data-toggle-disabled', String(this.isDisable));
  }

  /**
   * Get the disabled state
   */
  public getDisable(): boolean {
    return this.isDisable;
  }

  /**
   * Get the toggle button element
   */
  public getEl(): HTMLElement {
    return this.element;
  }

  /**
   * Destroy the toggle button and cleanup
   */
  public destroy(): void {
    this.element.remove();
  }
}
