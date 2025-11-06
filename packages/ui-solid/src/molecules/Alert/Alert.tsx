/**
 * Alert component (SolidJS)
 *
 * Display alert messages with different severity levels.
 *
 * @example
 * ```tsx
 * <Alert variant="error" onClose={() => console.log('closed')}>
 *   An error occurred!
 * </Alert>
 * ```
 */

import { Component, JSX, Show, mergeProps, splitProps } from 'solid-js';
import { classNames } from '@email-builder/ui-components/utils';
import styles from '@email-builder/ui-components/src/molecules/Alert/alert.module.scss';

/**
 * SolidJS Alert props
 */
export interface AlertProps {
  /**
   * Alert content
   */
  children: JSX.Element;

  /**
   * Alert variant/severity
   */
  variant?: 'info' | 'success' | 'warning' | 'error';

  /**
   * Whether alert can be closed
   */
  closable?: boolean;

  /**
   * Icon to display (Remix icon name)
   */
  icon?: string;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Close callback
   */
  onClose?: () => void;
}

/**
 * Default props
 */
const defaultProps: Partial<AlertProps> = {
  variant: 'info',
  closable: false,
};

/**
 * Default icons for each variant
 */
const defaultIcons: Record<string, string> = {
  info: 'information-line',
  success: 'checkbox-circle-line',
  warning: 'error-warning-line',
  error: 'close-circle-line',
};

/**
 * SolidJS Alert Component
 */
export const Alert: Component<AlertProps> = (props) => {
  const merged = mergeProps(defaultProps, props);
  const [local] = splitProps(merged, [
    'children',
    'variant',
    'closable',
    'icon',
    'className',
    'onClose',
  ]);

  /**
   * Get alert classes
   */
  const getAlertClasses = () => {
    return classNames(
      styles.alert,
      styles[`alert--${local.variant}`],
      local.className
    );
  };

  /**
   * Get icon name
   */
  const getIcon = () => {
    return local.icon ?? defaultIcons[local.variant!];
  };

  return (
    <div class={getAlertClasses()} role="alert">
      <Show when={getIcon()}>
        <i class={classNames(styles.alert__icon, `ri-${getIcon()}`)} />
      </Show>

      <div class={styles.alert__content}>{local.children}</div>

      <Show when={local.closable}>
        <button
          type="button"
          class={styles.alert__close}
          onClick={local.onClose}
          aria-label="Close alert"
        >
          <i class="ri-close-line" />
        </button>
      </Show>
    </div>
  );
};
