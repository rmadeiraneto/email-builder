/**
 * BorderEditor component (SolidJS)
 *
 * Complete border configuration editor with:
 * - Border width (CSSValue input)
 * - Border style (9 styles dropdown)
 * - Border color (color picker)
 * - Border radius (toggleable section with 4 corners)
 *
 * @example
 * ```tsx
 * <BorderEditor
 *   value={{
 *     width: { value: 1, unit: 'px' },
 *     style: 'solid',
 *     color: '#000000',
 *     radius: {
 *       topLeft: { value: 4, unit: 'px' },
 *       topRight: { value: 4, unit: 'px' },
 *       bottomRight: { value: 4, unit: 'px' },
 *       bottomLeft: { value: 4, unit: 'px' },
 *     }
 *   }}
 *   onChange={(border) => console.log(border)}
 * />
 * ```
 */

import { Component, Show, mergeProps, createSignal } from 'solid-js';
import { CSSValueInput } from '../CSSValueInput/CSSValueInput';
import { ColorPicker } from '../ColorPicker/ColorPicker';
import { ToggleableSection } from '../ToggleableSection/ToggleableSection';
import { LinkedInputs } from '../LinkedInputs/LinkedInputs';
import type { Border, BorderStyle, BorderRadius, CSSValue } from '@email-builder/core/types/component.types';
import { classNames } from '../../utils';
import styles from './border-editor.module.scss';

/**
 * BorderEditor props
 */
export interface BorderEditorProps {
  /**
   * Current border configuration
   */
  value?: Border;

  /**
   * Label for the border editor
   */
  label?: string;

  /**
   * Show border radius controls
   * @default true
   */
  showRadius?: boolean;

  /**
   * Start with radius section open
   * @default false
   */
  radiusStartOpen?: boolean;

  /**
   * Disable the inputs
   */
  disabled?: boolean;

  /**
   * Additional CSS classes
   */
  class?: string;

  /**
   * Callback fired when border changes
   */
  onChange?: (value: Border) => void;
}

/**
 * Default border configuration
 */
const DEFAULT_BORDER: Border = {
  width: { value: 0, unit: 'px' },
  style: 'none',
  color: '#000000',
};

/**
 * Default border radius
 */
const DEFAULT_RADIUS: BorderRadius = {
  topLeft: { value: 0, unit: 'px' },
  topRight: { value: 0, unit: 'px' },
  bottomRight: { value: 0, unit: 'px' },
  bottomLeft: { value: 0, unit: 'px' },
};

/**
 * Border style options
 */
const BORDER_STYLE_OPTIONS: { value: BorderStyle; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'solid', label: 'Solid' },
  { value: 'dashed', label: 'Dashed' },
  { value: 'dotted', label: 'Dotted' },
  { value: 'double', label: 'Double' },
  { value: 'groove', label: 'Groove (3D)' },
  { value: 'ridge', label: 'Ridge (3D)' },
  { value: 'inset', label: 'Inset (3D)' },
  { value: 'outset', label: 'Outset (3D)' },
];

/**
 * Default props
 */
const defaultProps: Partial<BorderEditorProps> = {
  value: DEFAULT_BORDER,
  showRadius: true,
  radiusStartOpen: false,
  disabled: false,
};

/**
 * BorderEditor Component
 */
export const BorderEditor: Component<BorderEditorProps> = (props) => {
  const merged = mergeProps(defaultProps, props);

  // Track if radius values are linked
  const [radiusLinked, setRadiusLinked] = createSignal(true);

  /**
   * Get current border value with defaults
   */
  const getBorderValue = (): Border => {
    return {
      ...DEFAULT_BORDER,
      ...merged.value,
    };
  };

  /**
   * Get current radius value with defaults
   */
  const getRadiusValue = (): BorderRadius => {
    return {
      ...DEFAULT_RADIUS,
      ...merged.value?.radius,
    };
  };

  /**
   * Handle border width change
   */
  const handleWidthChange = (width: CSSValue) => {
    merged.onChange?.({
      ...getBorderValue(),
      width,
    });
  };

  /**
   * Handle border style change
   */
  const handleStyleChange = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    merged.onChange?.({
      ...getBorderValue(),
      style: target.value as BorderStyle,
    });
  };

  /**
   * Handle border color change
   */
  const handleColorChange = (color: string) => {
    merged.onChange?.({
      ...getBorderValue(),
      color,
    });
  };

  /**
   * Handle radius corner change
   */
  const handleRadiusChange = (corner: keyof BorderRadius, value: CSSValue) => {
    const currentRadius = getRadiusValue();

    // If linked, update all corners
    if (radiusLinked()) {
      merged.onChange?.({
        ...getBorderValue(),
        radius: {
          topLeft: value,
          topRight: value,
          bottomRight: value,
          bottomLeft: value,
        },
      });
    } else {
      // Update only the specific corner
      merged.onChange?.({
        ...getBorderValue(),
        radius: {
          ...currentRadius,
          [corner]: value,
        },
      });
    }
  };

  /**
   * Toggle radius linked state
   */
  const toggleRadiusLinked = () => {
    setRadiusLinked(!radiusLinked());
  };

  /**
   * Get a summary of the current radius for the collapsed state
   */
  const getRadiusSummary = (): string => {
    const radius = getRadiusValue();
    const allSame =
      radius.topLeft.value === radius.topRight.value &&
      radius.topLeft.value === radius.bottomRight.value &&
      radius.topLeft.value === radius.bottomLeft.value &&
      radius.topLeft.unit === radius.topRight.unit &&
      radius.topLeft.unit === radius.bottomRight.unit &&
      radius.topLeft.unit === radius.bottomLeft.unit;

    if (allSame) {
      return `${radius.topLeft.value}${radius.topLeft.unit}`;
    }
    return `${radius.topLeft.value}${radius.topLeft.unit} ${radius.topRight.value}${radius.topRight.unit} ${radius.bottomRight.value}${radius.bottomRight.unit} ${radius.bottomLeft.value}${radius.bottomLeft.unit}`;
  };

  return (
    <div class={classNames(styles['border-editor'], merged.class)}>
      {/* Label */}
      <Show when={merged.label}>
        <label class={styles['border-editor__label']}>{merged.label}</label>
      </Show>

      {/* Border Width */}
      <div class={styles['border-editor__row']}>
        <label class={styles['border-editor__row-label']}>Width</label>
        <CSSValueInput
          value={getBorderValue().width}
          availableUnits={['px', 'em', 'rem']}
          min={0}
          disabled={merged.disabled ?? false}
          onChange={handleWidthChange}
        />
      </div>

      {/* Border Style */}
      <div class={styles['border-editor__row']}>
        <label class={styles['border-editor__row-label']}>Style</label>
        <select
          class={styles['border-editor__select']}
          value={getBorderValue().style}
          onChange={handleStyleChange}
          disabled={merged.disabled ?? false}
        >
          {BORDER_STYLE_OPTIONS.map((option) => (
            <option value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      {/* Border Color */}
      <div class={styles['border-editor__row']}>
        <label class={styles['border-editor__row-label']}>Color</label>
        <ColorPicker
          value={getBorderValue().color}
          onChange={handleColorChange}
        />
      </div>

      {/* Border Radius - Toggleable Section */}
      <Show when={merged.showRadius}>
        <ToggleableSection
          label={`Border Radius: ${getRadiusSummary()}`}
          startOpen={merged.radiusStartOpen ?? false}
          toggleableContent={true}
        >
          <div class={styles['border-editor__radius']}>
            {/* Link/Unlink Toggle */}
            <div class={styles['border-editor__link-toggle']}>
              <button
                class={classNames(
                  styles['border-editor__link-button'],
                  radiusLinked() && styles['border-editor__link-button--active']
                )}
                onClick={toggleRadiusLinked}
                disabled={merged.disabled ?? false}
                title={radiusLinked() ? 'Unlink corners' : 'Link corners'}
              >
                <i class={radiusLinked() ? 'ri-link' : 'ri-link-unlink'} />
              </button>
            </div>

            {/* Radius Corners */}
            <div class={styles['border-editor__corners']}>
              <div class={styles['border-editor__corner']}>
                <label class={styles['border-editor__corner-label']}>Top Left</label>
                <CSSValueInput
                  value={getRadiusValue().topLeft}
                  availableUnits={['px', 'em', 'rem', '%']}
                  min={0}
                  disabled={merged.disabled ?? false}
                  onChange={(value) => handleRadiusChange('topLeft', value)}
                />
              </div>

              <div class={styles['border-editor__corner']}>
                <label class={styles['border-editor__corner-label']}>Top Right</label>
                <CSSValueInput
                  value={getRadiusValue().topRight}
                  availableUnits={['px', 'em', 'rem', '%']}
                  min={0}
                  disabled={merged.disabled ?? false}
                  onChange={(value) => handleRadiusChange('topRight', value)}
                />
              </div>

              <div class={styles['border-editor__corner']}>
                <label class={styles['border-editor__corner-label']}>Bottom Right</label>
                <CSSValueInput
                  value={getRadiusValue().bottomRight}
                  availableUnits={['px', 'em', 'rem', '%']}
                  min={0}
                  disabled={merged.disabled ?? false}
                  onChange={(value) => handleRadiusChange('bottomRight', value)}
                />
              </div>

              <div class={styles['border-editor__corner']}>
                <label class={styles['border-editor__corner-label']}>Bottom Left</label>
                <CSSValueInput
                  value={getRadiusValue().bottomLeft}
                  availableUnits={['px', 'em', 'rem', '%']}
                  min={0}
                  disabled={merged.disabled ?? false}
                  onChange={(value) => handleRadiusChange('bottomLeft', value)}
                />
              </div>
            </div>
          </div>
        </ToggleableSection>
      </Show>
    </div>
  );
};
