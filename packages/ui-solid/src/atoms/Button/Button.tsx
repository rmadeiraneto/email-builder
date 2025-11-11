/**
 * Button component (SolidJS)
 *
 * A versatile button component supporting multiple variants, sizes, and states.
 * Can be used with icons and custom content.
 *
 * @example
 * Basic usage:
 * ```tsx
 * <Button variant="primary" onClick={() => console.log('clicked')}>
 *   Click me
 * </Button>
 * ```
 *
 * @example
 * With icon:
 * ```tsx
 * <Button variant="secondary" size="large" icon="star">
 *   Favorite
 * </Button>
 * ```
 */

import { Component, JSX, mergeProps, splitProps } from 'solid-js';
import type { ButtonProps as BaseButtonProps } from '@email-builder/ui-components/atoms';
import { getComponentClasses, createBEM } from '../../utils';
import styles from '@email-builder/ui-components/src/atoms/Button/button.module.scss';

/**
 * SolidJS-specific button props
 * Extends the base ButtonProps but adapts for SolidJS patterns
 */
export interface ButtonProps extends Omit<BaseButtonProps, 'children' | 'onClick' | 'onFocus' | 'onBlur'> {
  /**
   * Button content (children)
   */
  children: JSX.Element;

  /**
   * Click event handler
   */
  onClick?: JSX.EventHandler<HTMLButtonElement, MouseEvent>;

  /**
   * Focus event handler
   */
  onFocus?: JSX.EventHandler<HTMLButtonElement, FocusEvent>;

  /**
   * Blur event handler
   */
  onBlur?: JSX.EventHandler<HTMLButtonElement, FocusEvent>;

  /**
   * Reference to the button element
   */
  ref?: HTMLButtonElement | ((el: HTMLButtonElement) => void);

  /**
   * Test ID for automated testing
   */
  testId?: string;

  /**
   * Action identifier for automated testing
   */
  action?: string;
}

/**
 * Default prop values
 */
const defaultProps: Partial<ButtonProps> = {
  variant: 'primary',
  size: 'medium',
  type: 'button',
  disabled: false,
  fullWidth: false,
  iconPosition: 'left',
};

/**
 * SolidJS Button Component
 */
export const Button: Component<ButtonProps> = (props) => {
  // Merge with defaults
  const merged = mergeProps(defaultProps, props);

  // Split props into button attributes and our custom props
  const [local, buttonProps] = splitProps(merged, [
    'variant',
    'size',
    'icon',
    'iconPosition',
    'fullWidth',
    'children',
    'className',
    'testId',
    'action',
  ]);

  // Create BEM helper for button classes
  const bem = createBEM(styles, 'button');

  /**
   * Generate class names
   */
  const getClassNames = (): string => {
    return getComponentClasses(
      styles,
      'button',
      {
        [local.variant!]: true,
        [local.size!]: true,
        'full-width': local.fullWidth,
        disabled: buttonProps.disabled,
      },
      local.className
    );
  };

  /**
   * Render icon element
   */
  const renderIcon = (): JSX.Element => {
    if (!local.icon) return null;

    const iconClass = local.iconPosition === 'right'
      ? bem.elem('icon', 'right')
      : bem.elem('icon');

    return <i class={`ri-${local.icon} ${iconClass}`} aria-hidden="true" />;
  };

  return (
    <button
      {...buttonProps}
      class={getClassNames()}
      aria-disabled={buttonProps.disabled ? 'true' : undefined}
      data-testid={local.testId}
      data-action={local.action}
    >
      {local.iconPosition === 'left' && renderIcon()}
      <span class={bem.elem('text')}>{local.children}</span>
      {local.iconPosition === 'right' && renderIcon()}
    </button>
  );
};
