/**
 * Tip Banner Component
 *
 * Displays helpful tips and best practices for email design
 *
 * @module tips
 */

import { Component, Show, createSignal } from 'solid-js';
import type { Tip } from '@email-builder/core/tips';
import { TipSeverity } from '@email-builder/core/tips';
import styles from './TipBanner.module.scss';

export interface TipBannerProps {
  /**
   * The tip to display
   */
  tip: Tip;

  /**
   * Callback when tip is dismissed
   */
  onDismiss?: (tipId: string) => void;

  /**
   * Show learn more link
   * @default true
   */
  showLearnMore?: boolean;

  /**
   * Additional CSS class
   */
  class?: string;
}

/**
 * TipBanner component
 *
 * Displays a colored banner with a helpful tip based on severity:
 * - Info (blue): General helpful information
 * - Warning (yellow): Recommended practices
 * - Critical (red): Important for proper email rendering
 *
 * @example
 * ```tsx
 * <TipBanner
 *   tip={tip}
 *   onDismiss={(id) => dismissTip(id)}
 * />
 * ```
 */
export const TipBanner: Component<TipBannerProps> = (props) => {
  const [isVisible, setIsVisible] = createSignal(true);

  const handleDismiss = () => {
    setIsVisible(false);
    if (props.onDismiss) {
      props.onDismiss(props.tip.id);
    }
  };

  const getSeverityIcon = () => {
    switch (props.tip.severity) {
      case TipSeverity.INFO:
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10ZM11 6C11 6.55228 10.5523 7 10 7C9.44772 7 9 6.55228 9 6C9 5.44772 9.44772 5 10 5C10.5523 5 11 5.44772 11 6ZM9 9C8.44772 9 8 9.44772 8 10C8 10.5523 8.44772 11 9 11V14C9 14.5523 9.44772 15 10 15H11C11.5523 15 12 14.5523 12 14C12 13.4477 11.5523 13 11 13V10C11 9.44772 10.5523 9 10 9H9Z"
              fill="currentColor"
            />
          </svg>
        );
      case TipSeverity.WARNING:
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8.25704 3.09882C9.02227 1.73952 10.9777 1.73952 11.743 3.09882L17.3708 13.0194C18.1363 14.3787 17.1586 16 15.6278 16H4.37221C2.84138 16 1.86365 14.3787 2.62916 13.0194L8.25704 3.09882ZM11 13C11 13.5523 10.5523 14 10 14C9.44772 14 9 13.5523 9 13C9 12.4477 9.44772 12 10 12C10.5523 12 11 12.4477 11 13ZM10 5C9.44772 5 9 5.44772 9 6V9C9 9.55228 9.44772 10 10 10C10.5523 10 11 9.55228 11 9V6C11 5.44772 10.5523 5 10 5Z"
              fill="currentColor"
            />
          </svg>
        );
      case TipSeverity.CRITICAL:
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18ZM8.70711 7.29289C8.31658 6.90237 7.68342 6.90237 7.29289 7.29289C6.90237 7.68342 6.90237 8.31658 7.29289 8.70711L8.58579 10L7.29289 11.2929C6.90237 11.6834 6.90237 12.3166 7.29289 12.7071C7.68342 13.0976 8.31658 13.0976 8.70711 12.7071L10 11.4142L11.2929 12.7071C11.6834 13.0976 12.3166 13.0976 12.7071 12.7071C13.0976 12.3166 13.0976 11.6834 12.7071 11.2929L11.4142 10L12.7071 8.70711C13.0976 8.31658 13.0976 7.68342 12.7071 7.29289C12.3166 6.90237 11.6834 6.90237 11.2929 7.29289L10 8.58579L8.70711 7.29289Z"
              fill="currentColor"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <Show when={isVisible()}>
      <div
        class={`${styles.tipBanner} ${styles[`tipBanner--${props.tip.severity}`]} ${props.class ?? ''}`}
        role="alert"
      >
        <div class={styles.tipBanner__icon}>{getSeverityIcon()}</div>

        <div class={styles.tipBanner__content}>
          <div class={styles.tipBanner__title}>{props.tip.title}</div>
          <div class={styles.tipBanner__message}>{props.tip.message}</div>

          <Show
            when={(props.showLearnMore ?? true) && props.tip.learnMoreUrl}
          >
            <a
              href={props.tip.learnMoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              class={styles.tipBanner__learnMore}
            >
              Learn more →
            </a>
          </Show>
        </div>

        <Show when={props.tip.dismissible !== false}>
          <button
            class={styles.tipBanner__dismissButton}
            onClick={handleDismiss}
            aria-label="Dismiss tip"
            title="Dismiss"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4L4 12M4 4l8 8"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </button>
        </Show>
      </div>
    </Show>
  );
};
