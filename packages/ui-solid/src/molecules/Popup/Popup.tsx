/**
 * Popup component (SolidJS)
 *
 * A popup/modal window with optional title and close button.
 *
 * @example
 * ```tsx
 * <Show when={isOpen()}>
 *   <Popup
 *     title="My Popup"
 *     centerPopup
 *     onClose={() => setIsOpen(false)}
 *   >
 *     <p>Popup content goes here</p>
 *   </Popup>
 * </Show>
 * ```
 */

import { Component, JSX, Show, mergeProps, splitProps } from 'solid-js';
import { classNames } from '@email-builder/ui-components/utils';
import styles from '@email-builder/ui-components/src/molecules/Popup/popup.module.scss';

/**
 * SolidJS Popup props
 */
export interface PopupProps {
  /**
   * Popup title
   */
  title?: string | JSX.Element;

  /**
   * Popup content
   */
  children: JSX.Element;

  /**
   * Whether to show the close button
   */
  useCloseButton?: boolean;

  /**
   * Whether to center the popup in the viewport
   */
  centerPopup?: boolean;

  /**
   * Additional CSS classes
   */
  class?: string;

  /**
   * Additional CSS classes for content wrapper
   */
  contentClass?: string;

  /**
   * Callback when close button is clicked
   */
  onClose?: () => void;
}

/**
 * Default props
 */
const defaultProps: Partial<PopupProps> = {
  useCloseButton: true,
  centerPopup: false,
};

/**
 * SolidJS Popup Component
 */
export const Popup: Component<PopupProps> = (props) => {
  const merged = mergeProps(defaultProps, props);
  const [local] = splitProps(merged, [
    'title',
    'children',
    'useCloseButton',
    'centerPopup',
    'class',
    'contentClass',
    'onClose',
  ]);

  /**
   * Get root classes
   */
  const getRootClasses = () => {
    return classNames(
      styles.popup,
      local.centerPopup && styles['popup--centered'],
      local.class
    );
  };

  /**
   * Get content classes
   */
  const getContentClasses = () => {
    return classNames(
      styles.popup__content,
      local.contentClass
    );
  };

  return (
    <div class={getRootClasses()}>
      <Show when={local.title}>
        <div class={styles.popup__header}>
          <h3 class={styles.popup__title}>{local.title}</h3>

          <Show when={local.useCloseButton}>
            <button
              type="button"
              class={styles.popup__close}
              onClick={local.onClose}
              aria-label="Close"
            >
              <i class="ri-close-line" />
            </button>
          </Show>
        </div>
      </Show>

      <div class={getContentClasses()}>
        {local.children}
      </div>

      <Show when={!local.title && local.useCloseButton}>
        <button
          type="button"
          class={styles.popup__close}
          onClick={local.onClose}
          aria-label="Close"
        >
          <i class="ri-close-line" />
        </button>
      </Show>
    </div>
  );
};
