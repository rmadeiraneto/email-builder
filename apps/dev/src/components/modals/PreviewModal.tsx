/**
 * Preview Modal
 *
 * Modal for previewing templates in different modes (Web, Mobile, Email)
 */

import { type Component, createSignal, Show, For } from 'solid-js';
import { ComponentRenderer } from '@email-builder/ui-solid/canvas';
import type { PreviewModalProps, PreviewMode } from './PreviewModal.types';
import { VIEWPORT_DIMENSIONS } from './PreviewModal.types';
import styles from './PreviewModal.module.scss';

export const PreviewModal: Component<PreviewModalProps> = (props) => {
  const [previewMode, setPreviewMode] = createSignal<PreviewMode>('web');

  const handleClose = () => {
    props.onClose();
  };

  const handleModeChange = (mode: PreviewMode) => {
    setPreviewMode(mode);
  };

  const getPreviewContainerStyles = () => {
    const dimensions = VIEWPORT_DIMENSIONS[previewMode()];
    return {
      width: `${dimensions.width}px`,
      height: `${dimensions.height}px`,
      'max-width': '100%',
      'max-height': 'calc(100vh - 200px)',
      transition: 'all 0.3s ease',
    };
  };

  const getTemplateStyles = () => {
    if (!props.template) return {};

    return {
      width: props.template.settings.canvasDimensions.width
        ? `${props.template.settings.canvasDimensions.width}px`
        : '100%',
      'max-width': props.template.settings.canvasDimensions.maxWidth
        ? `${props.template.settings.canvasDimensions.maxWidth}px`
        : 'none',
      'background-color': props.template.generalStyles.canvasBackgroundColor || '#ffffff',
      'min-height': '100%',
      margin: '0 auto',
    };
  };

  return (
    <Show when={props.isOpen && props.template}>
      <div class={styles.modal}>
        <div class={styles.modal__overlay} onClick={handleClose} />
        <div class={styles.modal__content}>
          <div class={styles.modal__header}>
            <div class={styles.modal__title}>
              <h2>Preview Template</h2>
              <span class={styles.modal__subtitle}>
                {props.template?.name || 'Untitled Template'}
              </span>
            </div>

            <div class={styles.modal__modes}>
              <button
                class={styles.modal__modeButton}
                classList={{ [styles['modal__modeButton--active']]: previewMode() === 'web' }}
                onClick={() => handleModeChange('web')}
                title="Desktop Preview"
              >
                <i class="ri-computer-line" />
                <span>Web</span>
              </button>
              <button
                class={styles.modal__modeButton}
                classList={{ [styles['modal__modeButton--active']]: previewMode() === 'mobile' }}
                onClick={() => handleModeChange('mobile')}
                title="Mobile Preview"
              >
                <i class="ri-smartphone-line" />
                <span>Mobile</span>
              </button>
              <button
                class={styles.modal__modeButton}
                classList={{ [styles['modal__modeButton--active']]: previewMode() === 'email' }}
                onClick={() => handleModeChange('email')}
                title="Email Client Preview"
              >
                <i class="ri-mail-line" />
                <span>Email</span>
              </button>
            </div>

            <button
              class={styles.modal__close}
              onClick={handleClose}
              aria-label="Close preview"
            >
              ×
            </button>
          </div>

          <div class={styles.modal__body}>
            <div class={styles.modal__viewport}>
              <div class={styles.modal__viewportLabel}>
                {VIEWPORT_DIMENSIONS[previewMode()].label}
              </div>
              <div
                class={styles.modal__preview}
                style={getPreviewContainerStyles()}
              >
                <div
                  class={styles.modal__template}
                  style={getTemplateStyles()}
                >
                  <Show when={props.template?.components && props.template.components.length > 0}>
                    <For each={props.template?.components}>
                      {(component) => (
                        <div class={styles.modal__component}>
                          <ComponentRenderer component={component} />
                        </div>
                      )}
                    </For>
                  </Show>
                  <Show when={!props.template?.components || props.template.components.length === 0}>
                    <div class={styles.modal__emptyState}>
                      <p>No components in this template</p>
                    </div>
                  </Show>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Show>
  );
};
