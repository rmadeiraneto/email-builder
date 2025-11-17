/**
 * Support Matrix Modal
 *
 * Modal for displaying the full Email Client Support Matrix
 */

import { type Component } from 'solid-js';
import { EmailClientSupportMatrix } from '@email-builder/ui-solid/compatibility';
import { Button } from '@email-builder/ui-solid/atoms';
import styles from './SupportMatrixModal.module.scss';

export interface SupportMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportMatrixModal: Component<SupportMatrixModalProps> = (props) => {
  if (!props.isOpen) return null;

  return (
    <div class={styles.overlay} onClick={props.onClose}>
      <div class={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div class={styles.header}>
          <h2 class={styles.title}>Email Client Support Matrix</h2>
          <Button
            class={styles.closeButton}
            onClick={props.onClose}
            variant="ghost"
            icon="close-line"
          />
        </div>

        {/* Content */}
        <div class={styles.content}>
          <EmailClientSupportMatrix />
        </div>
      </div>
    </div>
  );
};
