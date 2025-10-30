/**
 * Icon component
 *
 * Display Remix Icons with customizable size and color.
 *
 * @example
 * ```ts
 * const icon = new Icon({
 *   name: 'star-fill',
 *   size: 24,
 *   color: '#f59e0b'
 * });
 * ```
 */

import type { IconProps } from './icon.types';
import styles from './icon.module.scss';

export class Icon {
  private props: IconProps;
  private element: HTMLElement;

  constructor(props: IconProps) {
    this.props = {
      size: 'medium',
      ...props,
    };

    this.element = this.createIcon();
    this.attachEventListeners();
  }

  private createIcon(): HTMLElement {
    const icon = document.createElement('i');

    icon.className = this.getClassNames();

    // Set size
    const size = this.getSizeInPixels();
    icon.style.fontSize = `${size}px`;

    // Set color
    if (this.props.color) {
      icon.style.color = this.props.color;
    }

    // Set ARIA
    if (this.props.ariaLabel) {
      icon.setAttribute('aria-label', this.props.ariaLabel);
      icon.setAttribute('role', 'img');
    } else {
      icon.setAttribute('aria-hidden', 'true');
    }

    return icon;
  }

  private getSizeInPixels(): number {
    const size = this.props.size!;

    if (typeof size === 'number') {
      return size;
    }

    switch (size) {
      case 'small':
        return 16;
      case 'medium':
        return 24;
      case 'large':
        return 32;
      default:
        return 24;
    }
  }

  private getClassNames(): string {
    const classes = [styles.icon, `ri-${this.props.name}`];

    if (this.props.onClick) {
      classes.push(styles['icon--clickable']);
    }

    if (this.props.className) {
      classes.push(this.props.className);
    }

    return classes.join(' ');
  }

  private attachEventListeners(): void {
    if (this.props.onClick) {
      this.element.addEventListener('click', this.props.onClick);
    }
  }

  private removeEventListeners(): void {
    if (this.props.onClick) {
      this.element.removeEventListener('click', this.props.onClick);
    }
  }

  public update(props: Partial<IconProps>): void {
    this.removeEventListeners();
    this.props = { ...this.props, ...props };

    this.element.className = this.getClassNames();

    if (props.size !== undefined) {
      const size = this.getSizeInPixels();
      this.element.style.fontSize = `${size}px`;
    }

    if (props.color !== undefined) {
      this.element.style.color = props.color;
    }

    if (props.ariaLabel !== undefined) {
      if (props.ariaLabel) {
        this.element.setAttribute('aria-label', props.ariaLabel);
        this.element.setAttribute('role', 'img');
      } else {
        this.element.setAttribute('aria-hidden', 'true');
        this.element.removeAttribute('role');
        this.element.removeAttribute('aria-label');
      }
    }

    this.attachEventListeners();
  }

  public render(): HTMLElement {
    return this.element;
  }

  public destroy(): void {
    this.removeEventListeners();
    this.element.remove();
  }
}
