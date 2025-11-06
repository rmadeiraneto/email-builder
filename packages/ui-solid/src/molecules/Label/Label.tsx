/**
 * Label component (SolidJS)
 *
 * A simple label element wrapper with text content and form association support.
 *
 * @example
 * ```tsx
 * <Label for="username-input" class="custom-label">
 *   Username
 * </Label>
 * ```
 */

import { Component, JSX, mergeProps, splitProps } from 'solid-js';
import { classNames } from '../../utils';
import styles from '@email-builder/ui-components/src/molecules/Label/label.module.scss';

/**
 * SolidJS Label props
 */
export interface LabelProps {
  /**
   * Label content
   */
  children: JSX.Element;

  /**
   * The ID of the form element this label is associated with
   */
  for?: string;

  /**
   * Additional CSS classes
   */
  class?: string;
}

/**
 * Default props
 */
const defaultProps: Partial<LabelProps> = {};

/**
 * SolidJS Label Component
 */
export const Label: Component<LabelProps> = (props) => {
  const merged = mergeProps(defaultProps, props);
  const [local] = splitProps(merged, ['children', 'for', 'class']);

  /**
   * Get label classes
   */
  const getLabelClasses = () => {
    return classNames(styles.label, local.class);
  };

  return (
    <label class={getLabelClasses()} for={local.for}>
      {local.children}
    </label>
  );
};
