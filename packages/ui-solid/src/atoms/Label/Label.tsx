/**
 * Label component (SolidJS)
 *
 * A simple label component for form inputs.
 *
 * @example
 * ```tsx
 * <Label htmlFor="email-input" required>
 *   Email Address
 * </Label>
 * ```
 */

import { Component, JSX, mergeProps, splitProps, Show } from 'solid-js';
import type { LabelProps as BaseLabelProps } from '@email-builder/ui-components/atoms';
import { createBEM, classNames } from '../../utils';
import styles from '@email-builder/ui-components/src/atoms/Label/label.module.scss';

/**
 * SolidJS-specific label props
 */
export interface LabelProps extends Omit<BaseLabelProps, 'children' | 'onClick'> {
  /**
   * Label content
   */
  children: JSX.Element;

  /**
   * Click event handler
   */
  onClick?: JSX.EventHandler<HTMLLabelElement, MouseEvent>;

  /**
   * Reference to the label element
   */
  ref?: HTMLLabelElement | ((el: HTMLLabelElement) => void);

  /**
   * Test ID for automated testing
   */
  testId?: string;
}

/**
 * Default prop values
 */
const defaultProps: Partial<LabelProps> = {
  required: false,
};

/**
 * SolidJS Label Component
 */
export const Label: Component<LabelProps> = (props) => {
  // Merge with defaults
  const merged = mergeProps(defaultProps, props);

  // Split props
  const [local, labelProps] = splitProps(merged, ['children', 'required', 'className', 'testId']);

  // Create BEM helper
  const bem = createBEM(styles, 'label');

  /**
   * Generate class names
   */
  const getClassNames = (): string => {
    return classNames(bem(), local.className);
  };

  return (
    <label {...labelProps} class={getClassNames()} data-testid={local.testId}>
      {local.children}
      <Show when={local.required}>
        <span class={bem.elem('required')} aria-hidden="true">
          *
        </span>
      </Show>
    </label>
  );
};
