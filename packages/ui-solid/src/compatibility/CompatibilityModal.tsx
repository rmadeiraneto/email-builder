/**
 * Compatibility Modal Component
 *
 * Displays detailed email client compatibility information for a CSS property
 *
 * @module compatibility
 */

import { Component, createMemo, For, Show } from 'solid-js';
import type {
  CompatibilityService,
  EmailClient,
  CompatibilityInfo,
} from '@email-builder/core/compatibility';
import {
  SupportLevel,
  EMAIL_CLIENT_LABELS,
  ClientPlatform,
  CLIENT_PLATFORM_MAP,
} from '@email-builder/core/compatibility';
import styles from './CompatibilityModal.module.scss';

export interface CompatibilityModalProps {
  /**
   * CSS property name
   */
  property: string;

  /**
   * CompatibilityService instance
   */
  compatibilityService: CompatibilityService;

  /**
   * Whether modal is open
   */
  isOpen: boolean;

  /**
   * Close handler
   */
  onClose: () => void;
}

/**
 * CompatibilityModal component
 *
 * Shows detailed compatibility information including:
 * - Support grid by email client
 * - Support notes and workarounds
 * - Overall statistics
 * - Link to more information
 *
 * @example
 * ```tsx
 * <CompatibilityModal
 *   property="border-radius"
 *   compatibilityService={service}
 *   isOpen={showModal}
 *   onClose={() => setShowModal(false)}
 * />
 * ```
 */
export const CompatibilityModal: Component<CompatibilityModalProps> = (props) => {
  const info = createMemo(() => {
    return props.compatibilityService.getPropertyInfo(props.property);
  });

  const stats = createMemo(() => {
    return props.compatibilityService.getPropertyStatistics(props.property);
  });

  const workarounds = createMemo(() => {
    return props.compatibilityService.getWorkarounds(props.property);
  });

  // Group clients by platform
  const clientsByPlatform = createMemo(() => {
    const i = info();
    if (!i) return new Map();

    const groups = new Map<ClientPlatform, Array<{ client: EmailClient; label: string }>>();

    Object.keys(i.support).forEach((clientKey) => {
      const client = clientKey as EmailClient;
      const platform = CLIENT_PLATFORM_MAP[client];
      const label = EMAIL_CLIENT_LABELS[client];

      if (!groups.has(platform)) {
        groups.set(platform, []);
      }
      groups.get(platform)!.push({ client, label });
    });

    return groups;
  });

  const getSupportLevelColor = (level: SupportLevel): string => {
    switch (level) {
      case SupportLevel.FULL:
        return 'green';
      case SupportLevel.PARTIAL:
        return 'yellow';
      case SupportLevel.NONE:
        return 'red';
      default:
        return 'gray';
    }
  };

  const getSupportLevelText = (level: SupportLevel): string => {
    switch (level) {
      case SupportLevel.FULL:
        return 'Full Support';
      case SupportLevel.PARTIAL:
        return 'Partial Support';
      case SupportLevel.NONE:
        return 'No Support';
      default:
        return 'Unknown';
    }
  };

  const handleOverlayClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      props.onClose();
    }
  };

  return (
    <Show when={props.isOpen}>
      <div class={styles.modalOverlay} onClick={handleOverlayClick}>
        <div class={styles.modal}>
          {/* Header */}
          <div class={styles.modal__header}>
            <div>
              <h2 class={styles.modal__title}>Email Client Compatibility</h2>
              <div class={styles.modal__propertyName}>
                <code>{props.property}</code>
              </div>
            </div>
            <button class={styles.modal__closeButton} onClick={props.onClose} aria-label="Close">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M18 6L6 18M6 6l12 12" stroke-width="2" stroke-linecap="round" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div class={styles.modal__content}>
            <Show when={info()}>
              {(i) => (
                <>
                  {/* Description */}
                  <div class={styles.section}>
                    <p class={styles.description}>{i().description}</p>
                  </div>

                  {/* Statistics */}
                  <Show when={stats()}>
                    {(s) => (
                      <div class={styles.section}>
                        <div class={styles.statsCard}>
                          <div class={styles.stat}>
                            <div class={styles.stat__value}>{s().supportScore}%</div>
                            <div class={styles.stat__label}>Overall Support</div>
                          </div>
                          <div class={styles.stat}>
                            <div class={styles.stat__value}>{s().fullSupport}</div>
                            <div class={styles.stat__label}>Full Support</div>
                          </div>
                          <div class={styles.stat}>
                            <div class={styles.stat__value}>{s().partialSupport}</div>
                            <div class={styles.stat__label}>Partial Support</div>
                          </div>
                          <div class={styles.stat}>
                            <div class={styles.stat__value}>{s().noSupport}</div>
                            <div class={styles.stat__label}>No Support</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Show>

                  {/* Support Grid */}
                  <div class={styles.section}>
                    <h3 class={styles.sectionTitle}>Email Client Support</h3>
                    <div class={styles.platformGroups}>
                      <For each={Array.from(clientsByPlatform())}>
                        {([platform, clients]) => (
                          <div class={styles.platformGroup}>
                            <h4 class={styles.platformGroup__title}>{platform}</h4>
                            <div class={styles.clientList}>
                              <For each={clients}>
                                {({ client, label }) => {
                                  const support = i().support[client];
                                  const color = getSupportLevelColor(support.level);
                                  return (
                                    <div class={`${styles.clientItem} ${styles[`clientItem--${color}`]}`}>
                                      <div class={styles.clientItem__header}>
                                        <div class={styles.clientItem__name}>{label}</div>
                                        <div class={`${styles.clientItem__badge} ${styles[`badge--${color}`]}`}>
                                          {getSupportLevelText(support.level)}
                                        </div>
                                      </div>
                                      <Show when={support.notes && support.notes.length > 0}>
                                        <ul class={styles.clientItem__notes}>
                                          <For each={support.notes}>
                                            {(note) => <li>{note}</li>}
                                          </For>
                                        </ul>
                                      </Show>
                                    </div>
                                  );
                                }}
                              </For>
                            </div>
                          </div>
                        )}
                      </For>
                    </div>
                  </div>

                  {/* General Notes */}
                  <Show when={i().generalNotes && i().generalNotes!.length > 0}>
                    <div class={styles.section}>
                      <h3 class={styles.sectionTitle}>General Notes</h3>
                      <ul class={styles.notesList}>
                        <For each={i().generalNotes}>
                          {(note) => <li>{note}</li>}
                        </For>
                      </ul>
                    </div>
                  </Show>

                  {/* Workarounds */}
                  <Show when={workarounds().length > 0}>
                    <div class={styles.section}>
                      <h3 class={styles.sectionTitle}>Workarounds & Alternatives</h3>
                      <ul class={styles.workaroundsList}>
                        <For each={workarounds()}>
                          {(workaround) => <li>{workaround}</li>}
                        </For>
                      </ul>
                    </div>
                  </Show>

                  {/* Learn More */}
                  <div class={styles.section}>
                    <a
                      href={`https://www.caniemail.com/search/?s=${encodeURIComponent(props.property)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      class={styles.learnMoreLink}
                    >
                      View detailed compatibility data on Can I Email →
                    </a>
                  </div>
                </>
              )}
            </Show>

            <Show when={!info()}>
              <div class={styles.noData}>
                <p>No compatibility data available for this property.</p>
              </div>
            </Show>
          </div>
        </div>
      </div>
    </Show>
  );
};
