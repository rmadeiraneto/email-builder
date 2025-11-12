/**
 * Label component
 *
 * A simple label component for form inputs.
 *
 * @example
 * ```ts
 * const label = new Label({
 *   htmlFor: 'email-input',
 *   children: 'Email Address',
 *   required: true
 * });
 * ```
 */

import type { LabelProps } from './label.types';
import styles from './label.module.scss';
import { createBEM } from '../../utils/classNames';

export class Label {
  private props: LabelProps;
  private element: HTMLLabelElement;

  constructor(props: LabelProps) {
    this.props = {
      required: false,
      ...props,
    };

    this.element = this.createLabel();
    this.attachEventListeners();
  }

  private createLabel(): HTMLLabelElement {
    const bem = createBEM(styles, 'label');
    const label = document.createElement('label');

    label.className = this.getClassNames();
    label.textContent = this.props.children;

    if (this.props.htmlFor) {
      label.htmlFor = this.props.htmlFor;
    }

    if (this.props.required) {
      const required = document.createElement('span');
      required.className = bem.elem('required') ?? '';
      required.textContent = '*';
      required.setAttribute('aria-hidden', 'true');
      label.appendChild(required);
    }

    return label;
  }

  private getClassNames(): string {
    const bem = createBEM(styles, 'label');
    const classes = [bem()];

    if (this.props.className) {
      classes.push(this.props.className);
    }

    return classes.filter(Boolean).join(' ');
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

  public update(props: Partial<LabelProps>): void {
    const bem = createBEM(styles, 'label');
    this.removeEventListeners();
    this.props = { ...this.props, ...props };

    this.element.className = this.getClassNames();

    if (props.children !== undefined) {
      this.element.textContent = props.children;

      if (this.props.required) {
        const required = document.createElement('span');
        required.className = bem.elem('required') ?? '';
        required.textContent = '*';
        required.setAttribute('aria-hidden', 'true');
        this.element.appendChild(required);
      }
    }

    if (props.htmlFor !== undefined) {
      this.element.htmlFor = props.htmlFor;
    }

    this.attachEventListeners();
  }

  public render(): HTMLLabelElement {
    return this.element;
  }

  public destroy(): void {
    this.removeEventListeners();
    this.element.remove();
  }
}
