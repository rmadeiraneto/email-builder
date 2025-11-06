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
import { classNames } from '@email-builder/ui-components/utils';
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
  const [local, labelProps] = splitProps(merged, ['children', 'required', 'className']);

  /**
   * Generate class names
   */
  const getClassNames = (): string => {
    return classNames(styles.label, local.className);
  };

  return (
    <label {...labelProps} class={getClassNames()}>
      {local.children}
      <Show when={local.required}>
        <span class={styles.label__required} aria-hidden="true">
          *
        </span>
      </Show>
    </label>
  );
};
