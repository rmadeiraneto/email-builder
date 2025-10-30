/**
 * Modal component types
 */

import type { Placement } from '@floating-ui/dom';

/**
 * Modal component properties
 *
 * @example
 * Basic modal:
 * ```ts
 * const modal = new Modal({
 *   content: document.createElement('div'),
 *   isStartOpen: true
 * });
 * ```
 *
 * @example
 * Positioned modal with trigger:
 * ```ts
 * const triggerBtn = document.getElementById('trigger');
 * const modal = new Modal({
 *   triggerElement: triggerBtn,
 *   content: document.createElement('div'),
 *   placement: 'bottom'
 * });
 * ```
 */
export interface ModalProps {
  /**
   * Element that triggers the modal to open when clicked
   */
  triggerElement?: HTMLElement | null;

  /**
   * Container element where modal will be appended
   * If not provided, a #modalContainer div will be created/used
   */
  targetElement?: HTMLElement | null;

  /**
   * Content to display inside the modal dialog
   */
  content: HTMLElement | string;

  /**
   * Whether modal should be open on initialization
   * @default false
   */
  isStartOpen?: boolean;

  /**
   * Additional CSS classes for the modal backdrop
   */
  modalExtendedClasses?: string[];

  /**
   * Additional CSS classes for the modal dialog
   */
  modalDialogExtendedClasses?: string[];

  /**
   * Placement of the modal relative to trigger element
   * Only applies when triggerElement is provided
   * Uses @floating-ui/dom positioning
   */
  placement?: Placement;

  /**
   * Additional CSS class names for the modal element
   */
  className?: string;

  /**
   * Callback fired when modal opens
   */
  onOpen?: () => void;

  /**
   * Callback fired when modal closes
   */
  onClose?: () => void;
}
