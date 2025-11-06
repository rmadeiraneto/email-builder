/**
 * ToggleButton SolidJS Component
 *
 * A toggle button component that switches between active and inactive states.
 * Built with SolidJS for reactive state management.
 *
 * @example
 * ```tsx
 * import { ToggleButton } from '@email-builder/ui-solid/molecules';
 * import { createSignal } from 'solid-js';
 *
 * const [isActive, setIsActive] = createSignal(false);
 *
 * <ToggleButton
 *   isActive={isActive()}
 *   onChange={(active) => setIsActive(active)}
 *   disabled={false}
 * />
 * ```
 */

import { type Component, mergeProps } from 'solid-js';
import { classNames } from '../../utils';
import styles from '@email-builder/ui-components/src/molecules/ToggleButton/toggle-button.module.scss';

export interface ToggleButtonProps {
  /**
   * Whether the button is in active state
   * @default false
   */
  isActive?: boolean;

  /**
   * Whether the button is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Change event callback
   * Called when the toggle state changes
   */
  onChange?: (isActive: boolean) => void;

  /**
   * Additional CSS classes to apply
   */
  class?: string;

  /**
   * Whether to stop event propagation on click
   * @default false
   */
  clickStopPropagation?: boolean;

  /**
   * ARIA label for accessibility
   */
  ariaLabel?: string;
}

export const ToggleButton: Component<ToggleButtonProps> = (props) => {
  const merged = mergeProps(
    {
      isActive: false,
      disabled: false,
      clickStopPropagation: false,
    } as Required<ToggleButtonProps>,
    props
  );

  const handleClick = (e: MouseEvent) => {
    if (merged.disabled) {
      return;
    }

    if (merged.clickStopPropagation) {
      e.stopPropagation();
    }

    merged.onChange?.(!merged.isActive);
  };

  const classes = () =>
    classNames(
      styles['toggle-button'],
      merged.class
    );

  return (
    <div
      class={classes()}
      data-toggled={String(merged.isActive)}
      data-toggle-disabled={String(merged.disabled)}
      onClick={handleClick}
      role="switch"
      aria-checked={merged.isActive}
      aria-label={merged.ariaLabel}
      aria-disabled={merged.disabled}
    />
  );
};

export default ToggleButton;
