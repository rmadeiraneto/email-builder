/**
 * Alert type variants
 */
export type AlertType = 'info' | 'success' | 'warning' | 'error';

/**
 * Alert content that can be either a string or an HTMLElement
 */
export type AlertContent = string | HTMLElement;

/**
 * Configuration options for the Alert component
 */
export interface AlertOptions {
  /**
   * Type of alert (determines styling)
   * @default 'info'
   */
  type?: AlertType;

  /**
   * Title content for the alert
   * Can be a string or HTMLElement
   * @default ''
   */
  title?: AlertContent;

  /**
   * Description content for the alert
   * Can be a string or HTMLElement
   * @default ''
   */
  description?: AlertContent;

  /**
   * Icon element to display
   * Must be an HTMLElement
   * @default null
   */
  icon?: HTMLElement | null;

  /**
   * Whether the alert is initially hidden
   * @default true
   */
  isHidden?: boolean;
}

/**
 * Internal configuration with required defaults
 */
export interface AlertConfig extends Required<AlertOptions> {
  type: AlertType;
  title: AlertContent;
  description: AlertContent;
  icon: HTMLElement | null;
  isHidden: boolean;
}
