import styles from './alert.module.scss';
import type { AlertOptions, AlertConfig, AlertContent, AlertType } from './alert.types';
import { createBEM } from '../../utils/classNames';

/**
 * Alert component for displaying notifications and messages
 *
 * Supports multiple types (info, success, warning, error) with customizable
 * title, description, and icon. Can be shown or hidden programmatically.
 *
 * @example
 * Basic usage:
 * ```ts
 * const alert = new Alert({
 *   type: 'success',
 *   title: 'Success!',
 *   description: 'Your changes have been saved.',
 *   isHidden: false
 * });
 * document.body.appendChild(alert.getEl());
 * ```
 *
 * @example
 * With custom icon:
 * ```ts
 * const icon = document.createElement('i');
 * icon.className = 'ri-check-line';
 *
 * const alert = new Alert({
 *   type: 'success',
 *   title: 'Success!',
 *   icon: icon
 * });
 * ```
 */
export class Alert {
  private options: AlertConfig;
  private alert: HTMLDivElement;
  private alertLeft: HTMLDivElement;
  private alertRight: HTMLDivElement;
  private iconWrapper: HTMLDivElement | null = null;
  private titleWrapper: HTMLDivElement | null = null;
  private descriptionWrapper: HTMLDivElement | null = null;

  public type: AlertType;
  public icon: HTMLElement | null;
  public title: AlertContent;
  public description: AlertContent;
  public isHidden: boolean;

  constructor(options: AlertOptions = {}) {
    const defaults: AlertConfig = {
      type: 'info',
      title: '',
      description: '',
      icon: null,
      isHidden: true,
    };

    this.options = { ...defaults, ...options };

    this.type = this.options.type;
    this.icon = this.options.icon;
    this.title = this.options.title;
    this.description = this.options.description;
    this.isHidden = this.options.isHidden;

    // Create structure
    this.alertLeft = document.createElement('div');
    this.alertRight = document.createElement('div');
    this.alert = document.createElement('div');

    this.init();
  }

  /**
   * Initialize the alert component
   */
  private init(): void {
    this.createIcon();
    this.createTitle();
    this.createDescription();
    this.createAlert();

    if (this.options.isHidden) {
      this.hide();
    }
  }

  /**
   * Create the icon wrapper element
   */
  private createIcon(): void {
    if (!this.options.icon) {
      return;
    }

    const bem = createBEM(styles, 'alert');
    this.iconWrapper = document.createElement('div');
    this.iconWrapper.className = bem.elem('icon') ?? '';
    this.iconWrapper.setAttribute('data-testid', 'alert-icon');

    this.setIcon(this.options.icon);
  }

  /**
   * Create the title wrapper element
   */
  private createTitle(): void {
    if (!this.options.title) {
      return;
    }

    const bem = createBEM(styles, 'alert');
    this.titleWrapper = document.createElement('div');
    this.titleWrapper.className = bem.elem('title') ?? '';
    this.titleWrapper.setAttribute('data-testid', 'alert-title');

    this.setTitle(this.options.title);
  }

  /**
   * Create the description wrapper element
   */
  private createDescription(): void {
    if (!this.options.description) {
      return;
    }

    const bem = createBEM(styles, 'alert');
    this.descriptionWrapper = document.createElement('div');
    this.descriptionWrapper.className = bem.elem('description') ?? '';
    this.descriptionWrapper.setAttribute('data-testid', 'alert-description');

    this.setDescription(this.options.description);
  }

  /**
   * Create the main alert structure
   */
  private createAlert(): void {
    const bem = createBEM(styles, 'alert');
    // Create main wrapper
    this.alert.className = `${bem()} ${bem(this.type) ?? ''}`;
    this.alert.setAttribute('data-testid', 'alert');
    this.alert.setAttribute('role', 'alert');

    // Create left column (icon)
    this.alertLeft.className = bem.elem('left') ?? '';
    this.alertLeft.setAttribute('data-testid', 'alert-left');

    if (this.iconWrapper) {
      this.alertLeft.appendChild(this.iconWrapper);
    }

    // Create right column (title + description)
    this.alertRight.className = bem.elem('right') ?? '';
    this.alertRight.setAttribute('data-testid', 'alert-right');

    if (this.titleWrapper) {
      this.alertRight.appendChild(this.titleWrapper);
    }

    if (this.descriptionWrapper) {
      this.alertRight.appendChild(this.descriptionWrapper);
    }

    // Assemble alert
    this.alert.appendChild(this.alertLeft);
    this.alert.appendChild(this.alertRight);
  }

  /**
   * Set or update the icon
   * @param icon - HTMLElement to use as icon
   */
  public setIcon(icon: HTMLElement): void {
    const bem = createBEM(styles, 'alert');
    this.icon = icon;

    if (!this.iconWrapper) {
      // Create the wrapper manually instead of using createIcon
      this.iconWrapper = document.createElement('div');
      this.iconWrapper.className = bem.elem('icon') ?? '';
      this.iconWrapper.setAttribute('data-testid', 'alert-icon');

      // Append to the left column
      this.alertLeft.appendChild(this.iconWrapper);
    }

    if (this.iconWrapper && icon instanceof HTMLElement) {
      this.iconWrapper.innerHTML = '';
      this.iconWrapper.appendChild(icon);
    }
  }

  /**
   * Set or update the title
   * @param title - String or HTMLElement to use as title
   */
  public setTitle(title: AlertContent): void {
    const bem = createBEM(styles, 'alert');
    this.title = title;

    if (!this.titleWrapper) {
      // Create the wrapper manually instead of using createTitle
      this.titleWrapper = document.createElement('div');
      this.titleWrapper.className = bem.elem('title') ?? '';
      this.titleWrapper.setAttribute('data-testid', 'alert-title');

      // Insert before description if it exists
      this.alertRight.insertBefore(
        this.titleWrapper,
        this.descriptionWrapper || null
      );
    }

    if (this.titleWrapper) {
      if (typeof title === 'string') {
        this.titleWrapper.textContent = title;
      } else if (title instanceof HTMLElement) {
        this.titleWrapper.innerHTML = '';
        this.titleWrapper.appendChild(title);
      }
    }
  }

  /**
   * Set or update the description
   * @param description - String or HTMLElement to use as description
   */
  public setDescription(description: AlertContent): void {
    const bem = createBEM(styles, 'alert');
    this.description = description;

    if (!this.descriptionWrapper) {
      // Create the wrapper manually instead of using createDescription
      this.descriptionWrapper = document.createElement('div');
      this.descriptionWrapper.className = bem.elem('description') ?? '';
      this.descriptionWrapper.setAttribute('data-testid', 'alert-description');

      // Append to the right column
      this.alertRight.appendChild(this.descriptionWrapper);
    }

    if (this.descriptionWrapper) {
      if (typeof description === 'string') {
        this.descriptionWrapper.textContent = description;
      } else if (description instanceof HTMLElement) {
        this.descriptionWrapper.innerHTML = '';
        this.descriptionWrapper.appendChild(description);
      }
    }
  }

  /**
   * Show the alert
   */
  public show(): void {
    const bem = createBEM(styles, 'alert');
    this.isHidden = false;
    const hiddenClass = bem('hidden');
    if (hiddenClass) {
      this.alert.classList.remove(hiddenClass);
    }
  }

  /**
   * Hide the alert
   */
  public hide(): void {
    const bem = createBEM(styles, 'alert');
    this.isHidden = true;
    const hiddenClass = bem('hidden');
    if (hiddenClass) {
      this.alert.classList.add(hiddenClass);
    }
  }

  /**
   * Get the alert DOM element
   * @returns The alert HTMLElement
   */
  public getEl(): HTMLElement {
    return this.alert;
  }

  /**
   * Clean up and remove the alert
   */
  public destroy(): void {
    this.alert.remove();
  }
}
