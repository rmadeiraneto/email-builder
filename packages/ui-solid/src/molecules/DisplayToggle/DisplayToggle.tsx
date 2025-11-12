/**
 * DisplayToggle component (SolidJS)
 *
 * A labeled toggle switch for showing/hiding optional content sections.
 * Shows visual indicator (eye icon with slash) for on/off state.
 *
 * @example
 * ```tsx
 * <DisplayToggle
 *   label="Show Image"
 *   value={true}
 *   onChange={(show) => console.log('Show image:', show)}
 * />
 * ```
 */

import { Component, Show, mergeProps } from 'solid-js';
import { ToggleButton } from '../ToggleButton/ToggleButton';
import { classNames } from '../../utils';
import styles from './display-toggle.module.scss';

/**
 * DisplayToggle props
 */
export interface DisplayToggleProps {
  /**
   * Label for the toggle
   */
  label?: string;

  /**
   * Current visibility state
   * @default true
   */
  value?: boolean;

  /**
   * Disable the toggle
   */
  disabled?: boolean;

  /**
   * Show visual indicator icon
   * @default true
   */
  showIcon?: boolean;

  /**
   * Additional CSS classes
   */
  class?: string;

  /**
   * Callback fired when value changes
   */
  onChange?: (value: boolean) => void;
}

/**
 * Default props
 */
const defaultProps: Partial<DisplayToggleProps> = {
  value: true,
  disabled: false,
  showIcon: true,
};

/**
 * DisplayToggle Component
 */
export const DisplayToggle: Component<DisplayToggleProps> = (props) => {
  const merged = mergeProps(defaultProps, props);

  /**
   * Handle toggle change
   */
  const handleChange = (isActive: boolean) => {
    merged.onChange?.(isActive);
  };

  /**
   * Get icon class based on state
   */
  const getIconClass = (): string => {
    return merged.value ? 'ri-eye-line' : 'ri-eye-off-line';
  };

  /**
   * Get status text
   */
  const getStatusText = (): string => {
    return merged.value ? 'Visible' : 'Hidden';
  };

  return (
    <div class={classNames(styles['display-toggle'], merged.class)}>
      <div class={styles['display-toggle__header']}>
        {merged.label && (
          <label class={styles['display-toggle__label']}>
            {merged.label}
          </label>
        )}

        <div class={styles['display-toggle__controls']}>
          {/* Visual indicator */}
          <Show when={merged.showIcon}>
            <span
              class={classNames(
                styles['display-toggle__icon'],
                !merged.value && styles['display-toggle__icon--hidden']
              )}
              title={getStatusText()}
            >
              <i class={getIconClass()} />
            </span>
          </Show>

          {/* Status text */}
          <span
            class={classNames(
              styles['display-toggle__status'],
              !merged.value && styles['display-toggle__status--hidden']
            )}
          >
            {getStatusText()}
          </span>

          {/* Toggle button */}
          <ToggleButton
            isActive={merged.value ?? true}
            disabled={merged.disabled ?? false}
            onChange={handleChange}
            ariaLabel={`Toggle ${merged.label ?? 'visibility'}`}
          />
        </div>
      </div>
    </div>
  );
};
