/**
 * Configuration options for the Label component
 */
export interface LabelOptions {
  /**
   * Text content for the label
   * @default ''
   */
  text?: string;

  /**
   * The ID of the form element this label is associated with
   * Maps to the `for` attribute in HTML (`htmlFor` in JavaScript)
   * @default null
   */
  for?: string | null;

  /**
   * Additional CSS classes to add to the label element
   * @default ''
   */
  extendedClasses?: string;
}

/**
 * Interface for the Label component
 */
export interface ILabel {
  /**
   * Set the text content of the label
   */
  setText(text: string): void;

  /**
   * Set the `for` attribute of the label (which form element it's associated with)
   */
  setFor(forId: string): void;

  /**
   * Get the label element
   */
  getEl(): HTMLLabelElement;

  /**
   * Clean up the component
   */
  destroy(): void;
}
