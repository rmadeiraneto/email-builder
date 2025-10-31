import styles from './expand-collapse.module.scss';
import type {
  ExpandCollapseOptions,
  IExpandCollapse,
  ElementContent,
} from './expand-collapse.types';

/**
 * ExpandCollapse Component
 *
 * A simple expand/collapse component with a trigger and expandable content area.
 * The expandable content is positioned absolutely below the trigger.
 *
 * @example
 * ```ts
 * const expandCollapse = new ExpandCollapse({
 *   trigger: 'Click me',
 *   expandable: '<div>Hidden content</div>',
 *   startExpanded: false
 * });
 * document.body.appendChild(expandCollapse.getEl());
 * ```
 */
export class ExpandCollapse implements IExpandCollapse {
  private options: Required<
    Omit<ExpandCollapseOptions, 'expandable' | 'trigger' | 'element'>
  > & {
    expandable?: ElementContent;
    trigger?: ElementContent;
    element?: HTMLElement;
  };
  private element: HTMLElement;
  private triggerEl: HTMLElement;
  private expandableEl: HTMLElement;
  private expanded: boolean = false;

  constructor(options: ExpandCollapseOptions = {}) {
    // Set defaults
    this.options = {
      expandable: options.expandable,
      trigger: options.trigger,
      element: options.element,
      extendedClasses: options.extendedClasses ?? '',
      startExpanded: options.startExpanded ?? false,
      rightToLeft: options.rightToLeft ?? false,
      preventDefaultBehavior: options.preventDefaultBehavior ?? false,
    };

    this.element = this.createElement();
    this.triggerEl = this.createTrigger();
    this.expandableEl = this.createExpandable();

    this.init();
  }

  /**
   * Initialize the component
   */
  private init(): void {
    this.draw();
    this.setEvents();

    if (this.options.startExpanded) {
      this.expand();
    }
  }

  /**
   * Create the root element
   */
  private createElement(): HTMLElement {
    const element = this.options.element || document.createElement('div');
    element.className = this.getClassNames();
    return element;
  }

  /**
   * Get class names for the root element
   */
  private getClassNames(): string {
    const classes = [styles.expandCollapse];

    if (this.options.rightToLeft) {
      classes.push(styles['expandCollapse--right']);
    }

    if (this.options.extendedClasses) {
      classes.push(this.options.extendedClasses);
    }

    return classes.join(' ');
  }

  /**
   * Create the trigger element
   */
  private createTrigger(): HTMLElement {
    const trigger = document.createElement('div');
    trigger.className = styles.expandCollapse__trigger;

    if (this.options.trigger) {
      this.setContent(trigger, this.options.trigger);
    }

    return trigger;
  }

  /**
   * Create the expandable element
   */
  private createExpandable(): HTMLElement {
    const expandable = document.createElement('div');
    expandable.className = styles.expandCollapse__expandable;

    if (this.options.expandable) {
      this.setContent(expandable, this.options.expandable);
    }

    return expandable;
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
    // Clear element
    this.element.innerHTML = '';

    // Append trigger and expandable
    this.element.appendChild(this.triggerEl);
    this.element.appendChild(this.expandableEl);
  }

  /**
   * Set up event listeners
   */
  private setEvents(): void {
    if (!this.options.preventDefaultBehavior) {
      this.triggerEl.addEventListener('click', this.handleTriggerClick);
    }
  }

  /**
   * Handle trigger click
   */
  private handleTriggerClick = (): void => {
    if (this.expanded) {
      this.collapse();
    } else {
      this.expand();
    }
  };

  /**
   * Expand the expandable content
   */
  public expand(): void {
    this.expanded = true;
    this.element.classList.add(styles['expandCollapse--expanded']);
  }

  /**
   * Collapse the expandable content
   */
  public collapse(): void {
    this.expanded = false;
    this.element.classList.remove(styles['expandCollapse--expanded']);
  }

  /**
   * Check if the component is currently expanded
   */
  public isExpanded(): boolean {
    return this.expanded;
  }

  /**
   * Get the root element
   */
  public getEl(): HTMLElement {
    return this.element;
  }

  /**
   * Get the trigger element
   */
  public getTrigger(): HTMLElement {
    return this.triggerEl;
  }

  /**
   * Get the expandable element
   */
  public getExpandable(): HTMLElement {
    return this.expandableEl;
  }

  /**
   * Clean up the component
   */
  public destroy(): void {
    // Remove event listeners
    this.triggerEl.removeEventListener('click', this.handleTriggerClick);

    // Remove elements
    this.element.remove();
  }
}
