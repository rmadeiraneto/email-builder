/**
 * ColorPicker component (SolidJS)
 *
 * A color picker with input field, swatch, and optional transparency support.
 * Note: This is a simplified version. Full implementation would integrate with Alwan library.
 *
 * @example
 * ```tsx
 * <ColorPicker
 *   value="#3b82f6"
 *   onChange={(color) => console.log('Color:', color)}
 * />
 * ```
 */

import { Component, Show, createSignal, mergeProps, splitProps } from 'solid-js';
import { classNames } from '../../utils';
import styles from '@email-builder/ui-components/src/molecules/ColorPicker/color-picker.module.scss';

/**
 * SolidJS ColorPicker props
 */
export interface ColorPickerProps {
  /**
   * Current color value
   */
  value?: string;

  /**
   * Whether to show opacity controls
   */
  opacity?: boolean;

  /**
   * Whether to hide the input field
   */
  noInput?: boolean;

  /**
   * Empty color label
   */
  emptyColorLabel?: string;

  /**
   * Additional CSS classes
   */
  class?: string;

  /**
   * Callback when color changes
   */
  onChange?: (color: string) => void;

  /**
   * Callback when color is reset
   */
  onReset?: () => void;
}

/**
 * Default props
 */
const defaultProps: Partial<ColorPickerProps> = {
  value: '#000000',
  opacity: true,
  noInput: false,
  emptyColorLabel: 'none',
};

/**
 * SolidJS ColorPicker Component
 *
 * Note: This is a basic implementation using native HTML5 color input.
 * For full Alwan integration, additional work would be needed.
 */
export const ColorPicker: Component<ColorPickerProps> = (props) => {
  const merged = mergeProps(defaultProps, props);
  const [local] = splitProps(merged, [
    'value',
    'opacity',
    'noInput',
    'emptyColorLabel',
    'class',
    'onChange',
    'onReset',
  ]);

  const [currentColor, setCurrentColor] = createSignal(local.value!);
  const [inputValue, setInputValue] = createSignal(local.value!);

  /**
   * Handle color input change
   */
  const handleColorChange = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    setCurrentColor(value);
    setInputValue(value);
    local.onChange?.(value);
  };

  /**
   * Handle text input change
   */
  const handleTextChange = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    setInputValue(value);

    // Validate color format (basic validation)
    if (/^#([0-9A-F]{3}){1,2}$/i.test(value) || /^#([0-9A-F]{4}){1,2}$/i.test(value)) {
      setCurrentColor(value);
      local.onChange?.(value);
    }
  };

  /**
   * Handle reset
   */
  const handleReset = () => {
    setCurrentColor('transparent');
    setInputValue('transparent');
    local.onReset?.();
  };

  /**
   * Get root classes
   */
  const getRootClasses = () => {
    return classNames(
      styles['color-picker'],
      local.class
    );
  };

  return (
    <div class={getRootClasses()}>
      <div class={styles['color-picker__controls']}>
        <div
          class={styles['color-picker__swatch']}
          style={{ 'background-color': currentColor() }}
          title="Current color"
        >
          <input
            type="color"
            class={styles['color-picker__color-input']}
            value={currentColor() === 'transparent' ? '#000000' : currentColor()}
            onInput={handleColorChange}
            aria-label="Pick a color"
          />
        </div>

        <Show when={!local.noInput}>
          <input
            type="text"
            class={styles['color-picker__text-input']}
            value={inputValue()}
            onInput={handleTextChange}
            placeholder="#000000"
            aria-label="Color value"
          />
        </Show>

        <Show when={local.onReset}>
          <button
            type="button"
            class={styles['color-picker__reset']}
            onClick={handleReset}
            title={`Reset to ${local.emptyColorLabel}`}
            aria-label="Reset color"
          >
            <i class="ri-close-line" />
          </button>
        </Show>
      </div>
    </div>
  );
};
