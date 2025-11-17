/**
 * Mode Switcher Component
 *
 * Toggle switch UI for switching between Desktop and Mobile Dev Mode
 */

import { Component, createSignal, Show } from 'solid-js';
import { DeviceMode } from '@email-builder/core';
import styles from './ModeSwitcher.module.scss';

export interface ModeSwitcherProps {
  /**
   * Current device mode
   */
  currentMode: DeviceMode;

  /**
   * Callback when mode is changed
   */
  onModeChange: (mode: DeviceMode) => void;

  /**
   * Is switching in progress
   */
  isSwitching?: boolean;

  /**
   * Show labels
   */
  showLabels?: boolean;

  /**
   * Custom labels
   */
  labels?: {
    desktop: string;
    mobile: string;
  };

  /**
   * Sticky positioning
   */
  sticky?: boolean;

  /**
   * Additional CSS class
   */
  class?: string;
}

/**
 * Mode Switcher Component
 *
 * Displays a toggle switch for switching between desktop and mobile editing modes
 */
export const ModeSwitcher: Component<ModeSwitcherProps> = (props) => {
  const [isHovering, setIsHovering] = createSignal(false);

  const isMobile = () => props.currentMode === DeviceMode.MOBILE;
  const labels = () => props.labels || { desktop: 'Desktop', mobile: 'Mobile' };

  const handleToggle = () => {
    if (props.isSwitching) return;

    const newMode = isMobile() ? DeviceMode.DESKTOP : DeviceMode.MOBILE;
    props.onModeChange(newMode);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div
      class={`${styles.modeSwitcher} ${props.sticky ? styles.sticky : ''} ${props.class || ''}`}
      data-switching={props.isSwitching}
    >
      <Show when={props.showLabels !== false}>
        <span class={`${styles.label} ${!isMobile() ? styles.active : ''}`}>
          {labels().desktop}
        </span>
      </Show>

      <button
        type="button"
        role="switch"
        aria-checked={isMobile()}
        aria-label={`Switch to ${isMobile() ? 'desktop' : 'mobile'} mode`}
        class={`${styles.toggle} ${isMobile() ? styles.mobile : styles.desktop}`}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        disabled={props.isSwitching}
      >
        <span class={styles.track}>
          <span class={styles.thumb}>
            <Show when={isMobile()}>
              <i class="ri-smartphone-line" />
            </Show>
            <Show when={!isMobile()}>
              <i class="ri-computer-line" />
            </Show>
          </span>
        </span>
      </button>

      <Show when={props.showLabels !== false}>
        <span class={`${styles.label} ${isMobile() ? styles.active : ''}`}>
          {labels().mobile}
        </span>
      </Show>

      <Show when={isHovering() && !props.isSwitching}>
        <div class={styles.tooltip}>
          Press Cmd/Ctrl+M to toggle
        </div>
      </Show>
    </div>
  );
};
