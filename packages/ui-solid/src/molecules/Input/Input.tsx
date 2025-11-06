/**
 * Input component (SolidJS)
 *
 * A basic input component with event handling and customization options.
 *
 * @example
 * ```tsx
 * <Input
 *   type="text"
 *   placeholder="Enter text..."
 *   value={value()}
 *   onInput={(e) => setValue(e.currentTarget.value)}
 *   onChange={(e) => console.log('Changed:', e.currentTarget.value)}
 * />
 * ```
 */

import { Component, JSX, mergeProps, splitProps } from 'solid-js';
import { classNames } from '../../utils';
import styles from '@email-builder/ui-components/src/molecules/Input/input.module.scss';

/**
 * SolidJS Input props
 */
export interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Input type
   */
  type?: string;

  /**
   * Input value
   */
  value?: string;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Additional CSS classes
   */
  class?: string;

  /**
   * Disabled state
   */
  disabled?: boolean;

  /**
   * Input event handler
   */
  onInput?: JSX.EventHandler<HTMLInputElement, InputEvent>;

  /**
   * Change event handler
   */
  onChange?: JSX.EventHandler<HTMLInputElement, Event>;
}

/**
 * Default props
 */
const defaultProps: Partial<InputProps> = {
  type: 'text',
};

/**
 * SolidJS Input Component
 */
export const Input: Component<InputProps> = (props) => {
  const merged = mergeProps(defaultProps, props);
  const [local, others] = splitProps(merged, [
    'type',
    'value',
    'placeholder',
    'class',
    'disabled',
    'onInput',
    'onChange',
  ]);

  /**
   * Get input classes
   */
  const getInputClasses = () => {
    return classNames(
      styles.input,
      local.disabled && styles['input--disabled'],
      local.class
    );
  };

  return (
    <input
      type={local.type}
      value={local.value}
      placeholder={local.placeholder}
      class={getInputClasses()}
      disabled={local.disabled}
      onInput={local.onInput}
      onChange={local.onChange}
      {...others}
    />
  );
};
