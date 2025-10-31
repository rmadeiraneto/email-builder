import styles from './label.module.scss';
import type { LabelOptions, ILabel } from './label.types';

/**
 * Label Component
 *
 * A simple label element wrapper with text content and form association support.
 * This class provides methods to create, configure, and manipulate a label element.
 *
 * @example
 * ```ts
 * const label = new Label({
 *   text: 'Username',
 *   for: 'username-input',
 *   extendedClasses: 'custom-label'
 * });
 * document.body.appendChild(label.getEl());
 *
 * // Update the label text
 * label.setText('Email');
 *
 * // Associate with a different input
 * label.setFor('email-input');
 * ```
 */
export class Label implements ILabel {
  private options: Required<Omit<LabelOptions, 'for'>> & {
    for?: string | null;
  };
  private label: HTMLLabelElement;

  constructor(options: LabelOptions = {}) {
    // Set defaults
    this.options = {
      text: options.text ?? '',
      for: options.for ?? null,
      extendedClasses: options.extendedClasses ?? '',
    };

    this.label = this.createLabel();
    this.init();
  }

  /**
   * Create the label element
   */
  private createLabel(): HTMLLabelElement {
    const label = document.createElement('label');
    label.className = this.getClassNames();
    return label;
  }

  /**
   * Get class names for the label element
   */
  private getClassNames(): string {
    const classes = [styles.label];

    if (this.options.extendedClasses) {
      classes.push(this.options.extendedClasses);
    }

    return classes.join(' ');
  }

  /**
   * Initialize the label element
   */
  private init(): void {
    // Set text content if provided
    if (this.options.text) {
      this.label.textContent = this.options.text;
    }

    // Set htmlFor attribute if provided
    if (this.options.for) {
      this.label.htmlFor = this.options.for;
    }
  }

  /**
   * Set the text content of the label
   */
  public setText(text: string): void {
    this.label.textContent = text;
  }

  /**
   * Set the `for` attribute of the label (which form element it's associated with)
   */
  public setFor(forId: string): void {
    this.label.htmlFor = forId;
  }

  /**
   * Get the label element
   */
  public getEl(): HTMLLabelElement {
    return this.label;
  }

  /**
   * Clean up the component
   */
  public destroy(): void {
    this.label.remove();
  }
}
