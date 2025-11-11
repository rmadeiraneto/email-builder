/**
 * Icon component (SolidJS)
 *
 * Display Remix Icons with customizable size and color.
 *
 * @example
 * ```tsx
 * <Icon name="star-fill" size={24} color="#f59e0b" />
 * ```
 *
 * @example
 * With accessibility:
 * ```tsx
 * <Icon name="heart" size="large" ariaLabel="Favorite" />
 * ```
 */

import { Component, JSX, mergeProps, splitProps, createMemo } from 'solid-js';
import type { IconProps as BaseIconProps, IconSize } from '@email-builder/ui-components/atoms';
import { createBEM, classNames } from '../../utils';
import styles from '@email-builder/ui-components/src/atoms/Icon/icon.module.scss';

/**
 * SolidJS-specific icon props
 */
export interface IconProps extends Omit<BaseIconProps, 'onClick'> {
  /**
   * Click event handler
   */
  onClick?: JSX.EventHandler<HTMLElement, MouseEvent>;

  /**
   * Reference to the icon element
   */
  ref?: HTMLElement | ((el: HTMLElement) => void);

  /**
   * Test ID for automated testing
   */
  testId?: string;
}

/**
 * Default prop values
 */
const defaultProps: Partial<IconProps> = {
  size: 'medium',
};

/**
 * Converts size prop to pixels
 */
function getSizeInPixels(size: IconSize): number {
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

/**
 * SolidJS Icon Component
 */
export const Icon: Component<IconProps> = (props) => {
  // Merge with defaults
  const merged = mergeProps(defaultProps, props);

  // Split props
  const [local, iconProps] = splitProps(merged, [
    'name',
    'size',
    'color',
    'ariaLabel',
    'className',
    'onClick',
    'testId',
  ]);

  // Create BEM helper
  const bem = createBEM(styles, 'icon');

  /**
   * Generate class names
   */
  const getClassNames = (): string => {
    return classNames(
      bem(local.onClick && 'clickable'),
      `ri-${local.name}`,
      local.className
    );
  };

  /**
   * Calculate icon size in pixels
   */
  const iconSize = createMemo(() => getSizeInPixels(local.size!));

  /**
   * Get style object
   */
  const iconStyle = createMemo((): JSX.CSSProperties => ({
    'font-size': `${iconSize()}px`,
    color: local.color,
  }));

  /**
   * Get ARIA props
   */
  const ariaProps = createMemo(() => {
    if (local.ariaLabel) {
      return {
        'aria-label': local.ariaLabel,
        role: 'img' as const,
      };
    }
    return {
      'aria-hidden': 'true' as const,
    };
  });

  return (
    <i
      {...iconProps}
      {...ariaProps()}
      class={getClassNames()}
      style={iconStyle()}
      onClick={local.onClick}
      data-testid={local.testId}
    />
  );
};
