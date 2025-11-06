/**
 * Input component (SolidJS)
 *
 * A versatile input component supporting multiple types, sizes, and validation states.
 *
 * @example
 * Basic usage:
 * ```tsx
 * <Input
 *   type="text"
 *   placeholder="Enter your name"
 *   onInput={(e) => console.log(e.currentTarget.value)}
 * />
 * ```
 *
 * @example
 * With validation:
 * ```tsx
 * <Input
 *   type="email"
 *   validationState="error"
 *   required
 *   placeholder="email@example.com"
 * />
 * ```
 */

import { Component, JSX, mergeProps, splitProps } from 'solid-js';
import type { InputProps as BaseInputProps } from '@email-builder/ui-components/atoms';
import { getComponentClasses, getValidationAriaProps } from '@email-builder/ui-components/utils';
import styles from '@email-builder/ui-components/src/atoms/Input/input.module.scss';

/**
 * SolidJS-specific input props
 * Extends the base InputProps but adapts for SolidJS patterns
 */
export interface InputProps extends Omit<BaseInputProps, 'onChange' | 'onInput' | 'onFocus' | 'onBlur' | 'onKeyDown' | 'onKeyUp'> {
  /**
   * Change event handler (fires when input loses focus)
   */
  onChange?: JSX.EventHandler<HTMLInputElement, Event>;

  /**
   * Input event handler (fires on every keystroke)
   */
  onInput?: JSX.EventHandler<HTMLInputElement, InputEvent>;

  /**
   * Focus event handler
   */
  onFocus?: JSX.EventHandler<HTMLInputElement, FocusEvent>;

  /**
   * Blur event handler
   */
  onBlur?: JSX.EventHandler<HTMLInputElement, FocusEvent>;

  /**
   * Keydown event handler
   */
  onKeyDown?: JSX.EventHandler<HTMLInputElement, KeyboardEvent>;

  /**
   * Keyup event handler
   */
  onKeyUp?: JSX.EventHandler<HTMLInputElement, KeyboardEvent>;

  /**
   * Reference to the input element
   */
  ref?: HTMLInputElement | ((el: HTMLInputElement) => void);
}

/**
 * Default prop values
 */
const defaultProps: Partial<InputProps> = {
  type: 'text',
  size: 'medium',
  disabled: false,
  readonly: false,
  required: false,
  fullWidth: false,
  validationState: 'default',
};

/**
 * SolidJS Input Component
 */
export const Input: Component<InputProps> = (props) => {
  // Merge with defaults
  const merged = mergeProps(defaultProps, props);

  // Split props into input attributes and our custom props
  const [local, inputProps] = splitProps(merged, [
    'size',
    'validationState',
    'fullWidth',
    'className',
    'ariaLabel',
    'ariaDescribedBy',
  ]);

  /**
   * Generate class names
   */
  const getClassNames = (): string => {
    return getComponentClasses(
      styles,
      'input',
      {
        [local.size!]: true,
        [local.validationState!]: local.validationState !== 'default',
        'full-width': local.fullWidth,
      },
      local.className
    );
  };

  /**
   * Get ARIA props for validation
   */
  const ariaProps = getValidationAriaProps(
    local.validationState,
    inputProps.required,
    local.ariaDescribedBy
  );

  return (
    <input
      {...inputProps}
      {...ariaProps}
      class={getClassNames()}
      aria-label={local.ariaLabel}
      autocomplete={inputProps.autocomplete}
    />
  );
};
