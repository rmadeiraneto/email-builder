/**
 * Modal component (SolidJS)
 *
 * A flexible modal dialog with backdrop overlay and optional positioning.
 * Supports both centered modals and positioned modals relative to trigger elements.
 *
 * @example
 * Basic centered modal:
 * ```tsx
 * <Modal isOpen={isOpen()} onClose={() => setIsOpen(false)}>
 *   <div>Modal content here</div>
 * </Modal>
 * ```
 *
 * @example
 * Positioned modal with trigger:
 * ```tsx
 * <Modal
 *   triggerElement={buttonRef}
 *   placement="bottom"
 *   isOpen={isOpen()}
 *   onClose={() => setIsOpen(false)}
 * >
 *   <div>Modal content</div>
 * </Modal>
 * ```
 */

import {
  Component,
  JSX,
  Show,
  onCleanup,
  createEffect,
  createMemo,
  splitProps,
  mergeProps,
} from 'solid-js';
import {
  autoUpdate,
  computePosition,
  offset,
  shift,
  flip,
  type Placement,
} from '@floating-ui/dom';
import { classNames } from '../../utils';
import styles from '@email-builder/ui-components/src/molecules/Modal/modal.module.scss';

/**
 * SolidJS-specific modal props
 */
export interface ModalProps {
  /**
   * Whether the modal is open
   */
  isOpen: boolean;

  /**
   * Callback when modal should close
   */
  onClose?: () => void;

  /**
   * Callback when modal opens
   */
  onOpen?: () => void;

  /**
   * Modal content
   */
  children: JSX.Element;

  /**
   * Element that the modal is positioned relative to
   * Only used when placement is specified
   */
  triggerElement?: HTMLElement;

  /**
   * Container element where modal will be rendered
   * Defaults to document.body
   */
  targetElement?: HTMLElement;

  /**
   * Placement of the modal relative to trigger element
   * Only applies when triggerElement is provided
   */
  placement?: Placement;

  /**
   * Additional CSS classes for the modal backdrop
   */
  modalClasses?: string | string[];

  /**
   * Additional CSS classes for the modal dialog
   */
  modalDialogClasses?: string | string[];

  /**
   * Additional CSS class names
   */
  className?: string;
}

/**
 * Default props
 */
const defaultProps: Partial<ModalProps> = {
  modalClasses: [],
  modalDialogClasses: [],
};

/**
 * SolidJS Modal Component
 */
export const Modal: Component<ModalProps> = (props) => {
  // Merge with defaults
  const merged = mergeProps(defaultProps, props);

  // Split props
  const [local] = splitProps(merged, [
    'isOpen',
    'onClose',
    'onOpen',
    'children',
    'triggerElement',
    'targetElement',
    'placement',
    'modalClasses',
    'modalDialogClasses',
    'className',
  ]);

  let modalRef: HTMLDivElement | undefined;
  let cleanupAutoUpdate: (() => void) | undefined;

  /**
   * Setup positioning when modal opens with trigger element
   */
  const setupPositioning = () => {
    if (!local.triggerElement || !local.placement || !modalRef) {
      return;
    }

    cleanupAutoUpdate = autoUpdate(
      local.triggerElement,
      modalRef,
      async () => {
        if (!local.triggerElement || !modalRef) return;

        const position = await computePosition(local.triggerElement, modalRef, {
          ...(local.placement ? { placement: local.placement } : {}),
          middleware: [offset(10), flip(), shift({ padding: 5 })],
        });

        Object.assign(modalRef.style, {
          left: `${position.x}px`,
          top: `${position.y}px`,
        });
      }
    );
  };

  /**
   * Cleanup positioning
   */
  const cleanupPositioning = () => {
    if (cleanupAutoUpdate) {
      cleanupAutoUpdate();
      cleanupAutoUpdate = undefined;
    }
  };

  /**
   * Get modal container element
   */
  const _getContainer = (): HTMLElement => {
    if (local.targetElement) {
      return local.targetElement;
    }

    let container = document.getElementById('modalContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'modalContainer';
      document.body.appendChild(container);
    }
    return container;
  };

  /**
   * Generate modal class names (reactive memo)
   */
  const getModalClasses = createMemo(() => {
    const classes = Array.isArray(local.modalClasses)
      ? local.modalClasses
      : [local.modalClasses];

    return classNames(
      styles['modal'],
      local.isOpen && styles['modal--open'],
      local.className,
      ...classes
    );
  });

  /**
   * Generate modal dialog class names
   */
  const getModalDialogClasses = (): string => {
    const classes = Array.isArray(local.modalDialogClasses)
      ? local.modalDialogClasses
      : [local.modalDialogClasses];

    return classNames(styles['modal__dialog'], ...classes);
  };

  /**
   * Handle backdrop click
   */
  const handleBackdropClick = () => {
    local.onClose?.();
  };

  /**
   * Handle dialog click (prevent propagation)
   */
  const handleDialogClick = (e: MouseEvent) => {
    e.stopPropagation();
  };

  // Setup/cleanup positioning when modal state changes
  createEffect(() => {
    if (local.isOpen) {
      setupPositioning();
      local.onOpen?.();
    } else {
      cleanupPositioning();
    }
  });

  // Cleanup on unmount
  onCleanup(() => {
    cleanupPositioning();
  });

  return (
    <Show when={local.isOpen}>
      <div
        ref={modalRef}
        class={getModalClasses()}
        onClick={handleBackdropClick}
      >
        <div class={getModalDialogClasses()} onClick={handleDialogClick}>
          {local.children}
        </div>
      </div>
    </Show>
  );
};
