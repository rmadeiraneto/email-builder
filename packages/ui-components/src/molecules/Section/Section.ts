/**
 * Section Component
 *
 * A generic section wrapper component that can contain a label and content.
 * Provides methods to dynamically add, remove, and toggle content.
 *
 * @example
 * ```ts
 * const section = new Section({
 *   label: 'My Section',
 *   content: 'Some content'
 * });
 * document.body.appendChild(section.getEl());
 * section.addContent(document.createElement('div'));
 * ```
 */

import styles from './section.module.scss';
import type { SectionOptions, SectionElement } from './section.types';

export class Section {
  private options: Required<SectionOptions>;
  private element: SectionElement;
  private contentContainer: HTMLElement | null = null;

  constructor(options: SectionOptions = {}) {
    const defaults: Required<SectionOptions> = {
      cssClass: 'section',
      classPrefix: 'eb-',
      extendedClasses: '',
      tagName: 'div',
      label: null,
      content: null
    };

    this.options = { ...defaults, ...options };
    this.element = this.createElement();
  }

  /**
   * Creates the section element
   */
  private createElement(): SectionElement {
    const baseEl = document.createElement(this.options.tagName) as SectionElement;

    // Add base class from CSS modules
    baseEl.className = styles.section;

    // Add extended classes if provided
    if (this.options.extendedClasses) {
      this.addClassesString(baseEl, this.options.extendedClasses);
    }

    // If no content and no label, still add methods to the element
    const hasContent = this.options.content !== null && this.options.content !== undefined;
    const hasLabel = this.options.label !== null && this.options.label !== undefined;

    if (!hasContent && !hasLabel) {
      // Add methods even when no content container
      baseEl.addContent = () => baseEl;
      baseEl.removeContent = () => {
        throw new Error('Cannot remove content: content container not initialized');
      };
      baseEl.hasContent = () => false;
      baseEl.toggleContent = () => {};
      return baseEl;
    }

    // Create content container
    this.contentContainer = document.createElement('div');
    this.contentContainer.className = styles.section__content;

    // Set initial content if provided
    if (hasContent) {
      this.setContent(this.contentContainer, this.options.content);
    }

    // Add label if provided (including empty strings)
    if (hasLabel) {
      const labelEl = document.createElement('label');
      labelEl.className = `${styles.section__label} eb-label`;
      this.setContent(labelEl, this.options.label);
      baseEl.appendChild(labelEl);
    }

    // Add content container
    baseEl.appendChild(this.contentContainer);

    // Add public methods to the element
    baseEl.addContent = (el: HTMLElement | string) => {
      if (!this.contentContainer) {
        return baseEl;
      }
      return this.setContent(this.contentContainer, el, true);
    };

    baseEl.removeContent = (el: HTMLElement) => {
      if (!this.contentContainer) {
        throw new Error('Cannot remove content: content container not initialized');
      }
      return this.contentContainer.removeChild(el) as HTMLElement;
    };

    baseEl.hasContent = (el: HTMLElement) => {
      if (!this.contentContainer) {
        return false;
      }
      return this.contentContainer.contains(el);
    };

    baseEl.toggleContent = (el: HTMLElement) => {
      if (baseEl.hasContent(el)) {
        baseEl.removeContent(el);
      } else {
        baseEl.addContent(el);
      }
    };

    return baseEl;
  }

  /**
   * Add CSS classes from a space-separated string
   */
  private addClassesString(element: HTMLElement, classString: string): HTMLElement {
    const classes = classString.split(' ').filter(cls => cls.trim() !== '');
    classes.forEach(cls => element.classList.add(cls));
    return element;
  }

  /**
   * Set content of an element
   */
  private setContent(
    element: HTMLElement,
    content: string | HTMLElement | HTMLElement[],
    append: boolean = false
  ): HTMLElement {
    if (!append) {
      element.innerHTML = '';
    }

    if (typeof content === 'string') {
      if (append) {
        element.insertAdjacentHTML('beforeend', content);
      } else {
        element.innerHTML = content;
      }
    } else if (Array.isArray(content)) {
      content.forEach(item => element.appendChild(item));
    } else if (content instanceof HTMLElement) {
      element.appendChild(content);
    }

    return element;
  }

  /**
   * Get the section element
   */
  public getEl(): SectionElement {
    return this.element;
  }

  /**
   * Get the content container element
   */
  public getContentContainer(): HTMLElement | null {
    return this.contentContainer;
  }

  /**
   * Add content to the section
   */
  public addContent(element: HTMLElement | string): HTMLElement {
    return this.element.addContent(element);
  }

  /**
   * Remove content from the section
   */
  public removeContent(element: HTMLElement): HTMLElement {
    return this.element.removeContent(element);
  }

  /**
   * Check if section contains an element
   */
  public hasContent(element: HTMLElement): boolean {
    return this.element.hasContent(element);
  }

  /**
   * Toggle content visibility
   */
  public toggleContent(element: HTMLElement): void {
    this.element.toggleContent(element);
  }
}
