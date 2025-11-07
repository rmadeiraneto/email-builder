/**
 * Preview Modal
 *
 * Modal for previewing templates in different modes and devices
 * Supports responsive device simulation (mobile, tablet, desktop) and email preview
 */

import { type Component, createSignal, createMemo, Show, For } from 'solid-js';
import { ComponentRenderer } from '@email-builder/ui-solid/canvas';
import { DeviceType, BreakpointManager, isVisibleOnDevice } from '@email-builder/core';
import type { PreviewModalProps, PreviewMode, ViewportDimensions } from './PreviewModal.types';
import { EMAIL_VIEWPORT } from './PreviewModal.types';
import styles from './PreviewModal.module.scss';
import { Button } from '@email-builder/ui-solid/atoms';

export const PreviewModal: Component<PreviewModalProps> = (props) => {
  // Initialize breakpoint manager
  const breakpointManager = new BreakpointManager();

  // Preview mode: responsive or email
  const [previewMode, setPreviewMode] = createSignal<PreviewMode>(props.initialMode ?? 'responsive');

  // Active device for responsive mode
  const [activeDevice, setActiveDevice] = createSignal<DeviceType>(
    props.initialDevice ?? DeviceType.DESKTOP
  );

  const handleClose = () => {
    props.onClose();
  };

  const handleModeChange = (mode: PreviewMode) => {
    setPreviewMode(mode);
  };

  const handleDeviceChange = (device: DeviceType) => {
    setActiveDevice(device);
  };

  /**
   * Get current viewport dimensions based on mode and device
   */
  const getCurrentViewport = createMemo((): ViewportDimensions => {
    if (previewMode() === 'email') {
      return EMAIL_VIEWPORT;
    }

    // Responsive mode: get from breakpoint manager
    const device = activeDevice();
    const breakpoint = breakpointManager.getBreakpoint(device);
    const dimensions = breakpoint.viewportDimensions;

    return {
      width: dimensions.width,
      height: dimensions.height,
      label: `${breakpoint.label} (${dimensions.width}px × ${dimensions.height}px)`,
    };
  });

  /**
   * Get styles for the preview container (viewport simulation)
   */
  const getPreviewContainerStyles = createMemo(() => {
    const viewport = getCurrentViewport();
    return {
      width: `${viewport.width}px`,
      height: `${viewport.height}px`,
      'max-width': '100%',
      'max-height': 'calc(100vh - 200px)',
      transition: 'all 0.3s ease',
    };
  });

  /**
   * Get styles for the template container
   */
  const getTemplateStyles = createMemo(() => {
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
  });

  /**
   * Filter components based on device visibility
   */
  const visibleComponents = createMemo(() => {
    if (!props.template?.components) return [];

    // Email mode shows all components
    if (previewMode() === 'email') {
      return props.template.components;
    }

    // Responsive mode filters by device visibility
    const device = activeDevice();
    return props.template.components.filter((component) => {
      // Check responsive config
      const responsive = component.responsive;
      if (!responsive || !responsive.enabled) {
        // Not responsive, show on all devices
        return true;
      }

      // Check visibility for current device
      return isVisibleOnDevice(responsive.visibility, device);
    });
  });

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

            {/* Preview Mode Switcher */}
            <div class={styles.modal__modes}>
              <Button
                class={styles.modal__modeButton}
                classList={{ [styles['modal__modeButton--active']]: previewMode() === 'responsive' }}
                onClick={() => handleModeChange('responsive')}
                title="Responsive Preview"
                variant="secondary"
                icon="device-line"
                iconPosition="left"
              >
                Responsive
              </Button>
              <Button
                class={styles.modal__modeButton}
                classList={{ [styles['modal__modeButton--active']]: previewMode() === 'email' }}
                onClick={() => handleModeChange('email')}
                title="Email Client Preview"
                variant="secondary"
                icon="mail-line"
                iconPosition="left"
              >
                Email
              </Button>
            </div>

            <Button
              class={styles.modal__close}
              onClick={handleClose}
              aria-label="Close preview"
              variant="ghost"
              icon="close-line"
            />
          </div>

          {/* Device Switcher (only in responsive mode) */}
          <Show when={previewMode() === 'responsive'}>
            <div class={styles.modal__deviceSelector}>
              <div class={styles.modal__deviceLabel}>Device:</div>
              <div class={styles.modal__deviceButtons}>
                <Button
                  class={styles.modal__deviceButton}
                  classList={{ [styles['modal__deviceButton--active']]: activeDevice() === DeviceType.MOBILE }}
                  onClick={() => handleDeviceChange(DeviceType.MOBILE)}
                  title="Mobile Preview"
                  variant="ghost"
                  size="small"
                  icon="smartphone-line"
                  iconPosition="left"
                >
                  Mobile
                </Button>
                <Button
                  class={styles.modal__deviceButton}
                  classList={{ [styles['modal__deviceButton--active']]: activeDevice() === DeviceType.TABLET }}
                  onClick={() => handleDeviceChange(DeviceType.TABLET)}
                  title="Tablet Preview"
                  variant="ghost"
                  size="small"
                  icon="tablet-line"
                  iconPosition="left"
                >
                  Tablet
                </Button>
                <Button
                  class={styles.modal__deviceButton}
                  classList={{ [styles['modal__deviceButton--active']]: activeDevice() === DeviceType.DESKTOP }}
                  onClick={() => handleDeviceChange(DeviceType.DESKTOP)}
                  title="Desktop Preview"
                  variant="ghost"
                  size="small"
                  icon="computer-line"
                  iconPosition="left"
                >
                  Desktop
                </Button>
              </div>
            </div>
          </Show>

          <div class={styles.modal__body}>
            <div class={styles.modal__viewport}>
              {/* Viewport Label with Active Device Indicator */}
              <div class={styles.modal__viewportLabel}>
                <span class={styles.modal__viewportText}>{getCurrentViewport().label}</span>
                <Show when={previewMode() === 'responsive'}>
                  <span class={styles.modal__activeDevice}>
                    <i class="ri-information-line" />
                    Showing {visibleComponents().length} of {props.template?.components.length || 0} components
                  </span>
                </Show>
              </div>

              {/* Preview Container */}
              <div
                class={styles.modal__preview}
                style={getPreviewContainerStyles()}
              >
                <div
                  class={styles.modal__template}
                  style={getTemplateStyles()}
                >
                  <Show when={visibleComponents().length > 0}>
                    <For each={visibleComponents()}>
                      {(component) => (
                        <div class={styles.modal__component}>
                          <ComponentRenderer component={component} />
                        </div>
                      )}
                    </For>
                  </Show>
                  <Show when={visibleComponents().length === 0}>
                    <div class={styles.modal__emptyState}>
                      <i class="ri-information-line" />
                      <p>
                        {props.template?.components && props.template.components.length > 0
                          ? `No components visible on ${activeDevice()}`
                          : 'No components in this template'}
                      </p>
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
