/**
 * Support Matrix Modal
 *
 * Modal for displaying the comprehensive email client support matrix.
 * Shows tier-based client organization and feature support grid.
 */

import { type Component, createSignal } from 'solid-js';
import { EmailClientSupportMatrix, CompatibilityModal } from '@email-builder/ui-solid';
import type { EmailClient } from '@email-builder/core';
import styles from './SupportMatrixModal.module.scss';

export interface SupportMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportMatrixModal: Component<SupportMatrixModalProps> = (props) => {
  const [selectedProperty, setSelectedProperty] = createSignal<string | null>(null);
  const [_selectedClient, _setSelectedClient] = createSignal<EmailClient | null>(null);
  const [showCompatibilityModal, setShowCompatibilityModal] = createSignal(false);

  /**
   * Handle property click in the matrix
   */
  const handlePropertyClick = (property: string, client?: EmailClient) => {
    setSelectedProperty(property);
    setSelectedClient(client ?? null);
    setShowCompatibilityModal(true);
  };

  /**
   * Handle view details click for a client
   */
  const handleViewDetails = (clientId: EmailClient) => {
    // For now, just show the compatibility modal
    // In the future, could show client-specific view
    setSelectedClient(clientId);
    setShowCompatibilityModal(true);
  };

  /**
   * Close compatibility modal
   */
  const closeCompatibilityModal = () => {
    setShowCompatibilityModal(false);
    setSelectedProperty(null);
    setSelectedClient(null);
  };

  if (!props.isOpen) return null;

  return (
    <>
      <div class={styles.overlay} onClick={props.onClose}>
        <div class={styles.modal} onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div class={styles.header}>
            <div class={styles.header__content}>
              <h2 class={styles.title}>Email Client Support Matrix</h2>
              <p class={styles.subtitle}>
                Comprehensive overview of email client support for CSS properties
              </p>
            </div>
            <button class={styles.closeButton} onClick={props.onClose} aria-label="Close modal">
              ×
            </button>
          </div>

          {/* Content */}
          <div class={styles.content}>
            <EmailClientSupportMatrix
              onPropertyClick={handlePropertyClick}
              onViewDetails={handleViewDetails}
              showMatrix={true}
            />
          </div>

          {/* Footer */}
          <div class={styles.footer}>
            <button class={styles.closeBtn} onClick={props.onClose}>
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Compatibility Modal - Nested */}
      {showCompatibilityModal() && selectedProperty() && (
        <CompatibilityModal
          isOpen={showCompatibilityModal()}
          onClose={closeCompatibilityModal}
          property={selectedProperty()!}
        />
      )}
    </>
  );
};
