/**
 * InputLabel component (SolidJS)
 *
 * Wraps an input with a label, supporting inline layout, required indicator,
 * and help tooltip.
 *
 * @example
 * ```tsx
 * <InputLabel
 *   label="Username"
 *   description="Enter your username"
 *   required
 *   onChange={(value) => console.log(value)}
 * >
 *   <input type="text" id="username" />
 * </InputLabel>
 * ```
 */

import { Component, JSX, Show, mergeProps, splitProps, createUniqueId } from 'solid-js';
import { classNames } from '@email-builder/ui-components/utils';
import styles from '@email-builder/ui-components/src/molecules/InputLabel/input-label.module.scss';

/**
 * SolidJS InputLabel props
 */
export interface InputLabelProps {
  /**
   * Label text
   */
  label: string;

  /**
   * Optional description/help text shown as a tooltip
   */
  description?: string;

  /**
   * The input element
   */
  children: JSX.Element;

  /**
   * Additional CSS classes for the label element
   */
  labelClass?: string;

  /**
   * Additional CSS classes for the input wrapper
   */
  inputWrapperClass?: string;

  /**
   * Additional CSS classes for the root element
   */
  class?: string;

  /**
   * Display label and input side by side (inline)
   */
  sideBySide?: boolean;

  /**
   * Whether the input field is required
   */
  required?: boolean;

  /**
   * ID for associating label with input
   */
  inputId?: string;

  /**
   * Callback fired when the input value changes
   */
  onChange?: (value: string) => void;

  /**
   * Whether the input is disabled
   */
  disabled?: boolean;
}

/**
 * Default props
 */
const defaultProps: Partial<InputLabelProps> = {
  sideBySide: false,
  required: false,
  disabled: false,
};

/**
 * SolidJS InputLabel Component
 */
export const InputLabel: Component<InputLabelProps> = (props) => {
  const merged = mergeProps(defaultProps, props);
  const [local] = splitProps(merged, [
    'label',
    'description',
    'children',
    'labelClass',
    'inputWrapperClass',
    'class',
    'sideBySide',
    'required',
    'inputId',
    'onChange',
    'disabled',
  ]);

  // Generate unique ID if not provided
  const generatedId = createUniqueId();
  const inputId = () => local.inputId ?? generatedId;

  /**
   * Get root element classes
   */
  const getRootClasses = () => {
    return classNames(
      styles['input-label'],
      local.sideBySide && styles['input-label--inline'],
      local.disabled && styles['input-label--disabled'],
      local.class
    );
  };

  /**
   * Get label classes
   */
  const getLabelClasses = () => {
    return classNames(
      styles['input-label__label'],
      local.labelClass
    );
  };

  /**
   * Get input wrapper classes
   */
  const getInputWrapperClasses = () => {
    return classNames(
      styles['input-label__input'],
      local.inputWrapperClass
    );
  };

  return (
    <div class={getRootClasses()}>
      <label class={getLabelClasses()} for={inputId()}>
        {local.label}

        <Show when={local.required}>
          <span class={styles['input-label__required']} aria-label="required">
            *
          </span>
        </Show>

        <Show when={local.description}>
          <span
            class={styles['input-label__tooltip']}
            title={local.description}
            aria-label={local.description}
            role="tooltip"
          >
            ?
          </span>
        </Show>
      </label>

      <div class={getInputWrapperClasses()}>
        {local.children}
      </div>
    </div>
  );
};
