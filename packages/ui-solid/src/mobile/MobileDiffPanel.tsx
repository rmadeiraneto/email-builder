/**
 * Mobile Diff Panel
 *
 * Displays visual comparison between desktop and mobile configurations
 */

import { type Component, Show, For, createMemo } from 'solid-js';
import { DiffCalculator, type DiffSummary, type ComponentDiff } from '@email-builder/core/mobile/DiffCalculator';
import type { Template } from '@email-builder/core';
import styles from './MobileDiffPanel.module.scss';

export interface MobileDiffPanelProps {
  template: Template | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDiffPanel: Component<MobileDiffPanelProps> = (props) => {
  const diffData = createMemo(() => {
    if (!props.template) return null;
    return DiffCalculator.calculateDiff(props.template);
  });

  const diffSummary = createMemo((): DiffSummary | null => {
    if (!props.template) return null;
    return DiffCalculator.calculateSummary(props.template);
  });

  const componentDiffs = createMemo((): ComponentDiff[] => {
    if (!props.template) return [];
    return DiffCalculator.calculateComponentDiffs(props.template);
  });

  const formatValue = (value: any): string => {
    if (value === undefined || value === null) return 'Not set';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  const getCategoryIcon = (category: string): string => {
    switch (category) {
      case 'layout':
        return '📐';
      case 'spacing':
        return '↔️';
      case 'typography':
        return '🔤';
      case 'colors':
        return '🎨';
      default:
        return '⚙️';
    }
  };

  return (
    <Show when={props.isOpen}>
      <div class={styles.diffPanelOverlay} onClick={props.onClose}>
        <div class={styles.diffPanel} onClick={(e) => e.stopPropagation()}>
          <div class={styles.diffHeader}>
            <h3 class={styles.diffTitle}>Mobile vs Desktop Differences</h3>
            <button
              class={styles.closeButton}
              onClick={props.onClose}
              aria-label="Close diff panel"
            >
              ×
            </button>
          </div>

          <Show when={diffSummary()}>
            {(summary) => (
              <div class={styles.diffSummary}>
                <div class={styles.summaryItem}>
                  <span class={styles.summaryLabel}>Total Changes</span>
                  <span class={styles.summaryValue}>{summary().totalChanges}</span>
                </div>
                <div class={styles.summaryItem}>
                  <span class={styles.summaryLabel}>Order Changes</span>
                  <span class={styles.summaryValue}>{summary().orderChanges}</span>
                </div>
                <div class={styles.summaryItem}>
                  <span class={styles.summaryLabel}>Visibility Changes</span>
                  <span class={styles.summaryValue}>{summary().visibilityChanges}</span>
                </div>
                <div class={styles.summaryItem}>
                  <span class={styles.summaryLabel}>Property Overrides</span>
                  <span class={styles.summaryValue}>{summary().totalPropertyOverrides}</span>
                </div>
              </div>
            )}
          </Show>

          <Show
            when={componentDiffs().length > 0}
            fallback={
              <div class={styles.noChanges}>
                <span class={styles.noChangesIcon}>✅</span>
                <p>No differences between desktop and mobile configurations.</p>
              </div>
            }
          >
            <div class={styles.diffContent}>
              <For each={componentDiffs().filter((d) => d.hasOrderChange || d.hasVisibilityChange || d.hasPropertyOverrides)}>
                {(componentDiff) => (
                  <div class={styles.componentDiff}>
                    <div class={styles.componentHeader}>
                      <span class={styles.componentName}>{componentDiff.componentName}</span>
                      <span class={styles.componentType}>{componentDiff.componentType}</span>
                    </div>

                    <div class={styles.changeList}>
                      <Show when={componentDiff.hasOrderChange}>
                        <div class={styles.changeItem}>
                          <span class={styles.changeIcon}>🔄</span>
                          <span class={styles.changeLabel}>Order</span>
                          <div class={styles.changeValues}>
                            <span class={styles.desktopValue}>
                              Desktop: #{componentDiff.desktopPosition + 1}
                            </span>
                            <span class={styles.arrow}>→</span>
                            <span class={styles.mobileValue}>
                              Mobile: #{componentDiff.mobilePosition + 1}
                            </span>
                          </div>
                        </div>
                      </Show>

                      <Show when={componentDiff.hasVisibilityChange}>
                        <div class={styles.changeItem}>
                          <span class={styles.changeIcon}>👁️</span>
                          <span class={styles.changeLabel}>Visibility</span>
                          <div class={styles.changeValues}>
                            <span class={styles.desktopValue}>
                              Desktop: {componentDiff.visibleOnDesktop ? 'Visible' : 'Hidden'}
                            </span>
                            <span class={styles.arrow}>→</span>
                            <span class={styles.mobileValue}>
                              Mobile: {componentDiff.visibleOnMobile ? 'Visible' : 'Hidden'}
                            </span>
                          </div>
                        </div>
                      </Show>

                      <Show when={componentDiff.propertyOverrides.length > 0}>
                        <div class={styles.propertyOverrides}>
                          <div class={styles.propertyOverridesHeader}>
                            Property Overrides ({componentDiff.propertyOverrides.length})
                          </div>
                          <For each={componentDiff.propertyOverrides}>
                            {(prop) => (
                              <div class={styles.propertyDiff}>
                                <div class={styles.propertyHeader}>
                                  <span class={styles.categoryIcon}>
                                    {getCategoryIcon(prop.category)}
                                  </span>
                                  <span class={styles.propertyLabel}>{prop.propertyLabel}</span>
                                </div>
                                <div class={styles.propertyValues}>
                                  <div class={styles.desktopValue}>
                                    <span class={styles.valueLabel}>Desktop:</span>
                                    <code>{prop.formattedDesktop || formatValue(prop.desktopValue)}</code>
                                  </div>
                                  <div class={styles.mobileValue}>
                                    <span class={styles.valueLabel}>Mobile:</span>
                                    <code>{prop.formattedMobile || formatValue(prop.mobileValue)}</code>
                                  </div>
                                </div>
                              </div>
                            )}
                          </For>
                        </div>
                      </Show>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </Show>

          <div class={styles.diffFooter}>
            <button class={styles.closeButtonFooter} onClick={props.onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </Show>
  );
};
