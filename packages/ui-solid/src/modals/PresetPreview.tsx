/**
 * Preset Preview Modal
 *
 * Modal for previewing a preset before applying it
 */

import { type Component, For, Show } from 'solid-js';
import type { ComponentPreset } from '@email-builder/core';
import styles from './PresetPreview.module.scss';

export interface PresetPreviewProps {
  preset: ComponentPreset | null;
  componentType: string;
  isOpen: boolean;
  onClose: () => void;
  onApply: (presetId: string) => void;
}

/**
 * Format a style value for display
 */
function formatStyleValue(value: any): string {
  if (value === null || value === undefined) {
    return 'none';
  }

  if (typeof value === 'object') {
    if ('value' in value && 'unit' in value) {
      return `${value.value}${value.unit}`;
    }
    return JSON.stringify(value, null, 2);
  }

  return String(value);
}

/**
 * Flatten nested style objects into key-value pairs
 */
function flattenStyles(obj: any, prefix = ''): Array<[string, any]> {
  const result: Array<[string, any]> = [];

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === 'object' && !('value' in value && 'unit' in value)) {
      result.push(...flattenStyles(value, fullKey));
    } else {
      result.push([fullKey, value]);
    }
  }

  return result;
}

export const PresetPreview: Component<PresetPreviewProps> = (props) => {
  const handleApply = () => {
    if (props.preset) {
      props.onApply(props.preset.id);
      props.onClose();
    }
  };

  const flattenedStyles = () => {
    if (!props.preset?.styles) return [];
    return flattenStyles(props.preset.styles);
  };

  return (
    <Show when={props.isOpen && props.preset}>
      <div class={styles.modal}>
        <div class={styles.modal__overlay} onClick={props.onClose} />
        <div class={styles.modal__content}>
          <div class={styles.modal__header}>
            <div>
              <h2 class={styles.modal__title}>{props.preset?.name}</h2>
              <p class={styles.modal__subtitle}>{props.componentType} Preset</p>
            </div>
            <button
              class={styles.modal__close}
              onClick={props.onClose}
              aria-label="Close modal"
            >
              ×
            </button>
          </div>

          <div class={styles.modal__body}>
            <Show when={props.preset?.description}>
              <div class={styles.modal__section}>
                <h3 class={styles.modal__sectionTitle}>Description</h3>
                <p class={styles.modal__description}>{props.preset?.description}</p>
              </div>
            </Show>

            <div class={styles.modal__section}>
              <h3 class={styles.modal__sectionTitle}>Styles Applied</h3>
              <div class={styles.modal__stylesList}>
                <Show
                  when={flattenedStyles().length > 0}
                  fallback={<p class={styles.modal__emptyState}>No styles defined</p>}
                >
                  <For each={flattenedStyles()}>
                    {([key, value]) => (
                      <div class={styles.modal__styleItem}>
                        <span class={styles.modal__styleKey}>{key}</span>
                        <span class={styles.modal__styleValue}>{formatStyleValue(value)}</span>
                      </div>
                    )}
                  </For>
                </Show>
              </div>
            </div>

            <Show when={!props.preset?.isCustom}>
              <div class={styles.modal__badge}>
                <span class={styles.modal__badgeText}>Default Preset</span>
              </div>
            </Show>
          </div>

          <div class={styles.modal__actions}>
            <button
              type="button"
              class={styles.modal__button}
              classList={{ [styles['modal__button--secondary']]: true }}
              onClick={props.onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              class={styles.modal__button}
              classList={{ [styles['modal__button--primary']]: true }}
              onClick={handleApply}
            >
              Apply Preset
            </button>
          </div>
        </div>
      </div>
    </Show>
  );
};
