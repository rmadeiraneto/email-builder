/**
 * Canvas Settings Component
 *
 * Allows editing of canvas-level settings like dimensions, background color, etc.
 */

import { Component, Show, For, createMemo } from 'solid-js';
import type { CanvasSettingsProps, CanvasSettingDefinition } from './CanvasSettings.types';
import styles from './CanvasSettings.module.scss';

/**
 * Canvas setting definitions
 */
const CANVAS_SETTINGS: CanvasSettingDefinition[] = [
  {
    key: 'settings.canvasDimensions.width',
    label: 'Canvas Width',
    type: 'number',
    section: 'dimensions',
    min: 200,
    max: 1600,
    unit: 'px',
    description: 'The width of the canvas (email: typically 600px)',
  },
  {
    key: 'settings.canvasDimensions.maxWidth',
    label: 'Max Width',
    type: 'number',
    section: 'dimensions',
    min: 200,
    max: 1600,
    unit: 'px',
    description: 'Maximum width for responsive layouts',
  },
  {
    key: 'generalStyles.canvasBackgroundColor',
    label: 'Background Color',
    type: 'color',
    section: 'appearance',
    description: 'Canvas background color',
  },
  {
    key: 'settings.responsive',
    label: 'Enable Responsive Design',
    type: 'checkbox',
    section: 'responsive',
    description: 'Enable device-specific styles and breakpoints',
  },
  {
    key: 'settings.breakpoints.mobile',
    label: 'Mobile Breakpoint',
    type: 'number',
    section: 'responsive',
    min: 0,
    max: 767,
    unit: 'px',
    description: 'Maximum width for mobile devices (default: 767px)',
  },
  {
    key: 'settings.breakpoints.tablet',
    label: 'Tablet Breakpoint',
    type: 'number',
    section: 'responsive',
    min: 768,
    max: 1023,
    unit: 'px',
    description: 'Maximum width for tablet devices (default: 1023px)',
  },
  {
    key: 'settings.breakpoints.desktop',
    label: 'Desktop Breakpoint',
    type: 'number',
    section: 'responsive',
    min: 1024,
    max: 2000,
    unit: 'px',
    description: 'Minimum width for desktop devices (default: 1024px)',
  },
];

/**
 * Get nested property value from object using dot notation
 */
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * CanvasSettings component
 * Displays and manages canvas-level settings
 */
export const CanvasSettings: Component<CanvasSettingsProps> = (props) => {
  const groupedSettings = createMemo(() => {
    const grouped: Record<'dimensions' | 'appearance' | 'responsive', CanvasSettingDefinition[]> = {
      dimensions: [],
      appearance: [],
      responsive: [],
    };

    CANVAS_SETTINGS.forEach((setting) => {
      grouped[setting.section].push(setting);
    });

    return grouped;
  });

  const handleSettingChange = (setting: CanvasSettingDefinition, value: any) => {
    if (!props.template) return;
    props.onSettingChange(setting.key, value);
  };

  const renderSettingEditor = (setting: CanvasSettingDefinition) => {
    if (!props.template) return null;

    const currentValue = getNestedValue(props.template, setting.key);
    const inputId = `canvas-setting-${setting.key.replace(/\./g, '-')}`;

    switch (setting.type) {
      case 'number':
        return (
          <div class={styles.settingField}>
            <label for={inputId} class={styles.settingLabel}>
              {setting.label}
              {setting.unit && <span class={styles.unit}> ({setting.unit})</span>}
            </label>
            <input
              id={inputId}
              type="number"
              class={styles.settingInput}
              value={currentValue ?? setting.min ?? 0}
              min={setting.min}
              max={setting.max}
              onInput={(e) =>
                handleSettingChange(setting, parseInt(e.currentTarget.value, 10))
              }
            />
            <Show when={setting.description}>
              <span class={styles.settingDescription}>{setting.description}</span>
            </Show>
          </div>
        );

      case 'color':
        return (
          <div class={styles.settingField}>
            <label for={inputId} class={styles.settingLabel}>
              {setting.label}
            </label>
            <div class={styles.colorInputGroup}>
              <input
                id={inputId}
                type="color"
                class={styles.settingColorInput}
                value={currentValue || '#ffffff'}
                onInput={(e) => handleSettingChange(setting, e.currentTarget.value)}
              />
              <input
                type="text"
                class={styles.settingInput}
                value={currentValue || '#ffffff'}
                placeholder="#ffffff"
                onInput={(e) => handleSettingChange(setting, e.currentTarget.value)}
              />
            </div>
            <Show when={setting.description}>
              <span class={styles.settingDescription}>{setting.description}</span>
            </Show>
          </div>
        );

      case 'text':
        return (
          <div class={styles.settingField}>
            <label for={inputId} class={styles.settingLabel}>
              {setting.label}
            </label>
            <input
              id={inputId}
              type="text"
              class={styles.settingInput}
              value={currentValue || ''}
              placeholder={setting.placeholder}
              onInput={(e) => handleSettingChange(setting, e.currentTarget.value)}
            />
            <Show when={setting.description}>
              <span class={styles.settingDescription}>{setting.description}</span>
            </Show>
          </div>
        );

      case 'checkbox':
        return (
          <div class={styles.settingField}>
            <label class={styles.checkboxLabel}>
              <input
                id={inputId}
                type="checkbox"
                class={styles.settingCheckbox}
                checked={currentValue ?? false}
                onChange={(e) => handleSettingChange(setting, e.currentTarget.checked)}
              />
              <span>{setting.label}</span>
            </label>
            <Show when={setting.description}>
              <span class={styles.settingDescription}>{setting.description}</span>
            </Show>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div class={`${styles.canvasSettings} ${props.class || ''}`}>
      <Show
        when={props.template}
        fallback={
          <div class={styles.emptyState}>
            <div class={styles.emptyStateIcon}>⚙️</div>
            <h3 class={styles.emptyStateTitle}>No Template Loaded</h3>
            <p class={styles.emptyStateText}>
              Load a template to configure canvas settings
            </p>
          </div>
        }
      >
        <div class={styles.canvasSettingsHeader}>
          <h3 class={styles.canvasSettingsTitle}>Canvas Settings</h3>
          <span class={styles.templateName}>{props.template?.metadata?.name}</span>
        </div>

        <div class={styles.canvasSettingsContent}>
          {/* Dimensions Section */}
          <Show when={groupedSettings().dimensions.length > 0}>
            <div class={styles.settingSection}>
              <h4 class={styles.settingSectionTitle}>Dimensions</h4>
              <For each={groupedSettings().dimensions}>
                {(setting) => renderSettingEditor(setting)}
              </For>
            </div>
          </Show>

          {/* Appearance Section */}
          <Show when={groupedSettings().appearance.length > 0}>
            <div class={styles.settingSection}>
              <h4 class={styles.settingSectionTitle}>Appearance</h4>
              <For each={groupedSettings().appearance}>
                {(setting) => renderSettingEditor(setting)}
              </For>
            </div>
          </Show>

          {/* Responsive Section */}
          <Show when={groupedSettings().responsive.length > 0}>
            <div class={styles.settingSection}>
              <h4 class={styles.settingSectionTitle}>
                <i class="ri-smartphone-line" style="margin-right: 8px;" />
                Responsive Design
              </h4>
              <For each={groupedSettings().responsive}>
                {(setting) => renderSettingEditor(setting)}
              </For>
            </div>
          </Show>
        </div>
      </Show>
    </div>
  );
};

export default CanvasSettings;
