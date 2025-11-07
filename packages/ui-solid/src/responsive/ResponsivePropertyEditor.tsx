/**
 * Responsive Property Editor
 *
 * Allows editing device-specific values for a property
 */

import { Component, Show } from 'solid-js';
import { DeviceType, type ResponsivePropertyValue } from '@email-builder/core';
import styles from './ResponsivePropertyEditor.module.scss';

export interface ResponsivePropertyEditorProps<T = any> {
  /**
   * Property label
   */
  label: string;

  /**
   * Current responsive value
   */
  value: ResponsivePropertyValue<T> | undefined;

  /**
   * Default base value (desktop/fallback)
   */
  defaultValue: T;

  /**
   * Currently active device
   */
  activeDevice: DeviceType;

  /**
   * Whether responsive mode is enabled
   */
  responsiveEnabled: boolean;

  /**
   * Callback when value changes
   */
  onChange: (value: ResponsivePropertyValue<T>) => void;

  /**
   * Render function for the value editor
   */
  renderEditor: (currentValue: T, onChange: (newValue: T) => void) => any;

  /**
   * Optional description
   */
  description?: string;

  /**
   * Custom class name
   */
  class?: string;
}

/**
 * ResponsivePropertyEditor component
 *
 * Provides a wrapper for editing device-specific property values
 */
export const ResponsivePropertyEditor: Component<ResponsivePropertyEditorProps> = (props) => {
  // Get the current value for the active device
  const getCurrentValue = (): any => {
    if (!props.responsiveEnabled) {
      return props.defaultValue;
    }

    if (!props.value) {
      return props.defaultValue;
    }

    // Return device-specific value, fallback to desktop, then default
    return (
      props.value[props.activeDevice] ??
      props.value[DeviceType.DESKTOP] ??
      props.defaultValue
    );
  };

  // Handle value change for the active device
  const handleValueChange = (newValue: any) => {
    if (!props.responsiveEnabled) {
      // If responsive is disabled, just pass the value directly
      props.onChange({
        desktop: newValue,
        tablet: newValue,
        mobile: newValue,
      });
      return;
    }

    // Update only the active device's value
    const updatedValue: ResponsivePropertyValue<any> = {
      ...(props.value || {}),
      [props.activeDevice]: newValue,
    };

    props.onChange(updatedValue);
  };

  // Check if the current device has an override
  const hasDeviceOverride = (): boolean => {
    if (!props.responsiveEnabled || !props.value) {
      return false;
    }

    return props.value[props.activeDevice] !== undefined;
  };

  // Reset device-specific value to inherit from desktop
  const resetToDefault = () => {
    if (!props.value) return;

    const updatedValue: ResponsivePropertyValue<any> = { ...props.value };
    delete updatedValue[props.activeDevice];

    props.onChange(updatedValue);
  };

  return (
    <div class={`${styles.responsivePropertyEditor} ${props.class || ''}`}>
      <div class={styles.header}>
        <label class={styles.label}>{props.label}</label>
        <Show when={props.responsiveEnabled && hasDeviceOverride()}>
          <button
            type="button"
            class={styles.resetButton}
            onClick={resetToDefault}
            title="Reset to default (inherit from desktop)"
          >
            <i class="ri-restart-line" />
            <span>Reset</span>
          </button>
        </Show>
      </div>

      <div class={styles.editorContainer}>
        {props.renderEditor(getCurrentValue(), handleValueChange)}
      </div>

      <Show when={props.description}>
        <div class={styles.description}>{props.description}</div>
      </Show>

      <Show when={props.responsiveEnabled && hasDeviceOverride()}>
        <div class={styles.overrideIndicator}>
          <i class="ri-information-line" />
          <span>This device has a custom value</span>
        </div>
      </Show>
    </div>
  );
};

export default ResponsivePropertyEditor;
