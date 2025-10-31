import styles from './section-item.module.scss';
import type {
  SectionItemOptions,
  ISectionItem,
  ElementContent,
} from './section-item.types';
import { Tooltip } from '../Tooltip';

/**
 * SectionItem Component
 *
 * A container component with an optional label and content area.
 * The label can have a tooltip description icon.
 *
 * @example
 * ```ts
 * const sectionItem = new SectionItem({
 *   label: 'Settings',
 *   content: '<div>Content here</div>',
 *   description: 'Configure your settings'
 * });
 * document.body.appendChild(sectionItem.getEl());
 * ```
 */
export class SectionItem implements ISectionItem {
  private options: Required<Omit<SectionItemOptions, 'label' | 'content' | 'description'>> & {
    label?: ElementContent;
    content?: ElementContent;
    description?: string;
  };
  private element: HTMLElement;
  private labelEl?: HTMLLabelElement;
  private contentEl?: HTMLElement;
  private tooltip?: Tooltip;

  constructor(options: SectionItemOptions = {}) {
    // Set defaults
    this.options = {
      label: options.label,
      content: options.content,
      description: options.description,
      tagName: options.tagName ?? 'div',
      extendedClasses: options.extendedClasses ?? '',
      labelExtendedClasses: options.labelExtendedClasses ?? '',
      contentExtendedClasses: options.contentExtendedClasses ?? '',
      isHidden: options.isHidden ?? false,
    };

    this.element = this.createWrapper();
    this.init();
  }

  /**
   * Initialize the component
   */
  private init(): void {
    this.createLabel();
    this.createContent();
    this.draw();

    if (this.options.isHidden) {
      this.hide();
    }
  }

  /**
   * Create the wrapper element
   */
  private createWrapper(): HTMLElement {
    const element = document.createElement(this.options.tagName);
    element.className = this.getClassNames();
    return element;
  }

  /**
   * Get class names for the root element
   */
  private getClassNames(): string {
    const classes = [styles.sectionItem];

    if (this.options.extendedClasses) {
      classes.push(this.options.extendedClasses);
    }

    return classes.join(' ');
  }

  /**
   * Create the label element
   */
  private createLabel(): void {
    if (this.options.label) {
      this.labelEl = document.createElement('label');

      const labelClasses = [
        'eb-label', // Global label class for consistency
        styles.sectionItem__label,
      ];

      if (this.options.labelExtendedClasses) {
        labelClasses.push(this.options.labelExtendedClasses);
      }

      this.labelEl.className = labelClasses.join(' ');

      this.setContent(this.labelEl, this.options.label);

      // Add tooltip if description is provided
      if (this.options.description) {
        this.tooltip = new Tooltip({
          content: this.options.description,
        });
        this.labelEl.appendChild(this.tooltip.getEl());
      }
    }
  }

  /**
   * Create the content element
   */
  private createContent(): void {
    if (this.options.content) {
      this.contentEl = document.createElement('div');

      const contentClasses = [styles.sectionItem__content];

      if (this.options.contentExtendedClasses) {
        contentClasses.push(this.options.contentExtendedClasses);
      }

      this.contentEl.className = contentClasses.join(' ');

      this.setContent(this.contentEl, this.options.content);
    }
  }

  /**
   * Set content of an element
   * Handles string (HTML), HTMLElement, or array of HTMLElements
   */
  private setContent(element: HTMLElement, content: ElementContent): void {
    if (typeof content === 'string') {
      element.innerHTML = content;
    } else if (Array.isArray(content)) {
      element.innerHTML = '';
      content.forEach((item) => element.appendChild(item));
    } else {
      element.innerHTML = '';
      element.appendChild(content);
    }
  }

  /**
   * Build the component structure
   */
  private draw(): void {
    this.element.innerHTML = '';

    const children: HTMLElement[] = [];

    if (this.labelEl) {
      children.push(this.labelEl);
    }

    if (this.contentEl) {
      children.push(this.contentEl);
    }

    children.forEach((child) => this.element.appendChild(child));
  }

  /**
   * Hide the section item
   */
  public hide(): void {
    this.element.style.display = 'none';
  }

  /**
   * Show the section item
   */
  public show(): void {
    this.element.style.display = '';
  }

  /**
   * Get the root element
   */
  public getEl(): HTMLElement {
    return this.element;
  }

  /**
   * Get the label element (if exists)
   */
  public getLabel(): HTMLElement | undefined {
    return this.labelEl;
  }

  /**
   * Get the content element (if exists)
   */
  public getContent(): HTMLElement | undefined {
    return this.contentEl;
  }

  /**
   * Clean up the component
   */
  public destroy(): void {
    // Clean up tooltip if it exists
    if (this.tooltip) {
      this.tooltip.destroy();
    }

    // Remove element
    this.element.remove();
  }
}
