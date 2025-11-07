/**
 * Device Tab Selector
 *
 * Allows switching between mobile, tablet, and desktop views for responsive editing
 */

import { Component, For, Show } from 'solid-js';
import { DeviceType } from '@email-builder/core';
import styles from './DeviceTabSelector.module.scss';

export interface DeviceTabSelectorProps {
  /**
   * Currently active device
   */
  activeDevice: DeviceType;

  /**
   * Callback when device changes
   */
  onDeviceChange: (device: DeviceType) => void;

  /**
   * Whether responsive mode is enabled
   */
  enabled?: boolean;

  /**
   * Custom class name
   */
  class?: string;
}

interface DeviceTab {
  type: DeviceType;
  label: string;
  icon: string;
}

const DEVICE_TABS: DeviceTab[] = [
  {
    type: DeviceType.MOBILE,
    label: 'Mobile',
    icon: 'ri-smartphone-line',
  },
  {
    type: DeviceType.TABLET,
    label: 'Tablet',
    icon: 'ri-tablet-line',
  },
  {
    type: DeviceType.DESKTOP,
    label: 'Desktop',
    icon: 'ri-computer-line',
  },
];

/**
 * DeviceTabSelector component
 *
 * Provides tab-based navigation for switching between device types
 */
export const DeviceTabSelector: Component<DeviceTabSelectorProps> = (props) => {
  const handleDeviceClick = (device: DeviceType) => {
    if (!props.enabled) return;
    props.onDeviceChange(device);
  };

  return (
    <div class={`${styles.deviceTabSelector} ${props.class || ''}`}>
      <Show
        when={props.enabled}
        fallback={
          <div class={styles.disabledMessage}>
            <i class="ri-information-line" />
            <span>Enable responsive design in Canvas Settings to use device-specific properties</span>
          </div>
        }
      >
        <div class={styles.tabContainer}>
          <For each={DEVICE_TABS}>
            {(tab) => (
              <button
                type="button"
                class={`${styles.tab} ${props.activeDevice === tab.type ? styles.active : ''}`}
                onClick={() => handleDeviceClick(tab.type)}
                title={tab.label}
              >
                <i class={tab.icon} />
                <span class={styles.tabLabel}>{tab.label}</span>
              </button>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};

export default DeviceTabSelector;
