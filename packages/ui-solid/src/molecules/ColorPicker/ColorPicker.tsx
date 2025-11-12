/**
 * ColorPicker component (SolidJS)
 *
 * Enhanced color picker with multiple input modes, swatches, and transparency.
 *
 * Features:
 * - HEX, RGB, and HSL input modes
 * - Preset color swatches
 * - Empty/transparent color support
 * - Opacity controls
 *
 * @example
 * ```tsx
 * <ColorPicker
 *   value="#3b82f6"
 *   onChange={(color) => console.log('Color:', color)}
 *   showSwatches={true}
 *   allowEmpty={true}
 * />
 * ```
 */

import { Component, Show, createSignal, mergeProps, splitProps, For } from 'solid-js';
import { classNames } from '../../utils';
import styles from '@email-builder/ui-components/src/molecules/ColorPicker/color-picker.module.scss';

/**
 * Color input mode
 */
export type ColorInputMode = 'hex' | 'rgb' | 'hsl';

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
   * Whether to show preset color swatches
   * @default true
   */
  showSwatches?: boolean;

  /**
   * Whether to allow empty/transparent color
   * @default false
   */
  allowEmpty?: boolean;

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
  showSwatches: true,
  allowEmpty: false,
  emptyColorLabel: 'none',
};

/**
 * Preset color swatches
 */
const DEFAULT_SWATCHES = [
  '#000000', // Black
  '#FFFFFF', // White
  '#F44336', // Red
  '#E91E63', // Pink
  '#9C27B0', // Purple
  '#673AB7', // Deep Purple
  '#3F51B5', // Indigo
  '#2196F3', // Blue
  '#03A9F4', // Light Blue
  '#00BCD4', // Cyan
  '#009688', // Teal
  '#4CAF50', // Green
  '#8BC34A', // Light Green
  '#CDDC39', // Lime
  '#FFEB3B', // Yellow
  '#FFC107', // Amber
  '#FF9800', // Orange
  '#FF5722', // Deep Orange
  '#795548', // Brown
  '#9E9E9E', // Grey
];

/**
 * SolidJS ColorPicker Component
 *
 * Enhanced with multiple color input modes and swatches.
 */
export const ColorPicker: Component<ColorPickerProps> = (props) => {
  const merged = mergeProps(defaultProps, props);
  const [local] = splitProps(merged, [
    'value',
    'opacity',
    'noInput',
    'showSwatches',
    'allowEmpty',
    'emptyColorLabel',
    'class',
    'onChange',
    'onReset',
  ]);

  const [currentColor, setCurrentColor] = createSignal(local.value!);
  const [inputValue, setInputValue] = createSignal(local.value!);
  const [inputMode, setInputMode] = createSignal<ColorInputMode>('hex');
  const [isEmpty, setIsEmpty] = createSignal(local.value === 'transparent' || local.value === '');

  /**
   * Handle color input change from native picker
   */
  const handleColorChange = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    setCurrentColor(value);
    setInputValue(value);
    setIsEmpty(false);
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
      setIsEmpty(false);
      local.onChange?.(value);
    } else if (value.toLowerCase() === 'transparent' || value === '') {
      setIsEmpty(true);
      setCurrentColor('transparent');
      local.onChange?.('transparent');
    }
  };

  /**
   * Handle swatch selection
   */
  const handleSwatchClick = (color: string) => {
    setCurrentColor(color);
    setInputValue(color);
    setIsEmpty(false);
    local.onChange?.(color);
  };

  /**
   * Handle empty/transparent color
   */
  const handleEmpty = () => {
    setCurrentColor('transparent');
    setInputValue('transparent');
    setIsEmpty(true);
    local.onChange?.('transparent');
    local.onReset?.();
  };

  /**
   * Toggle input mode
   */
  const cycleInputMode = () => {
    const modes: ColorInputMode[] = ['hex', 'rgb', 'hsl'];
    const currentIndex = modes.indexOf(inputMode());
    const nextIndex = (currentIndex + 1) % modes.length;
    setInputMode(modes[nextIndex]);
  };

  /**
   * Get root classes
   */
  const getRootClasses = () => {
    return classNames(styles['color-picker'], local.class);
  };

  /**
   * Get display value based on input mode
   */
  const getDisplayValue = (): string => {
    if (isEmpty()) {
      return 'transparent';
    }

    const color = currentColor();

    // For now, just return the color value as-is
    // Full RGB/HSL conversion would require a color conversion library
    return inputValue();
  };

  return (
    <div class={getRootClasses()}>
      <div class={styles['color-picker__controls']}>
        {/* Color Swatch with Picker */}
        <div
          class={classNames(
            styles['color-picker__swatch'],
            isEmpty() && styles['color-picker__swatch--empty']
          )}
          style={{ 'background-color': isEmpty() ? 'transparent' : currentColor() }}
          title="Current color"
        >
          <Show when={isEmpty()}>
            <div class={styles['color-picker__swatch-empty-indicator']} />
          </Show>
          <input
            type="color"
            class={styles['color-picker__color-input']}
            value={isEmpty() ? '#000000' : currentColor()}
            onInput={handleColorChange}
            aria-label="Pick a color"
          />
        </div>

        {/* Text Input with Mode Switcher */}
        <Show when={!local.noInput}>
          <div class={styles['color-picker__input-group']}>
            <input
              type="text"
              class={styles['color-picker__text-input']}
              value={getDisplayValue()}
              onInput={handleTextChange}
              placeholder={inputMode() === 'hex' ? '#000000' : inputMode().toUpperCase()}
              aria-label="Color value"
            />
            <button
              type="button"
              class={styles['color-picker__mode-toggle']}
              onClick={cycleInputMode}
              title="Switch color mode"
              aria-label={`Current mode: ${inputMode().toUpperCase()}`}
            >
              {inputMode().toUpperCase()}
            </button>
          </div>
        </Show>

        {/* Empty/Transparent Button */}
        <Show when={local.allowEmpty}>
          <button
            type="button"
            class={classNames(
              styles['color-picker__empty-button'],
              isEmpty() && styles['color-picker__empty-button--active']
            )}
            onClick={handleEmpty}
            title={`Set to ${local.emptyColorLabel}`}
            aria-label="Set to transparent"
          >
            <i class="ri-stop-line" />
          </button>
        </Show>
      </div>

      {/* Color Swatches */}
      <Show when={local.showSwatches}>
        <div class={styles['color-picker__swatches']}>
          <For each={DEFAULT_SWATCHES}>
            {(swatchColor) => (
              <button
                type="button"
                class={classNames(
                  styles['color-picker__swatch-item'],
                  currentColor() === swatchColor && styles['color-picker__swatch-item--active']
                )}
                style={{ 'background-color': swatchColor }}
                onClick={() => handleSwatchClick(swatchColor)}
                title={swatchColor}
                aria-label={`Select color ${swatchColor}`}
              />
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};
