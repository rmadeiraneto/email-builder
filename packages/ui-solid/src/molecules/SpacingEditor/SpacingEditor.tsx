/**
 * SpacingEditor component (SolidJS)
 *
 * Editor for 4-sided spacing (padding/margin) with linked inputs support.
 * Provides individual controls for top, right, bottom, left sides with
 * optional link/unlink for synchronized editing.
 *
 * @example
 * ```tsx
 * <SpacingEditor
 *   label="Padding"
 *   value={{
 *     top: { value: 16, unit: 'px' },
 *     right: { value: 16, unit: 'px' },
 *     bottom: { value: 16, unit: 'px' },
 *     left: { value: 16, unit: 'px' }
 *   }}
 *   startLinked={true}
 *   onChange={(spacing) => console.log(spacing)}
 * />
 * ```
 */

import { Component, mergeProps } from 'solid-js';
import { LinkedInputs, LinkedInputItem } from '../LinkedInputs/LinkedInputs';
import { InputLabel } from '../InputLabel/InputLabel';
import type { Spacing, CSSValue, CSSUnit } from '@email-builder/core/types/component.types';
import { classNames } from '../../utils';
import styles from './spacing-editor.module.scss';

/**
 * SpacingEditor props
 */
export interface SpacingEditorProps {
  /**
   * Current spacing configuration
   */
  value?: Spacing;

  /**
   * Label for the spacing editor (e.g., "Padding", "Margin")
   */
  label?: string;

  /**
   * Available units for selection
   * @default ['px', 'rem', 'em', '%', 'pt']
   */
  availableUnits?: readonly CSSUnit[];

  /**
   * Start with values linked
   * @default true
   */
  startLinked?: boolean;

  /**
   * Increment/decrement step
   * @default 1
   */
  increment?: number;

  /**
   * Minimum allowed value
   */
  min?: number | null;

  /**
   * Maximum allowed value
   */
  max?: number | null;

  /**
   * Disable the inputs
   */
  disabled?: boolean;

  /**
   * Additional CSS classes
   */
  class?: string;

  /**
   * Callback fired when spacing changes
   */
  onChange?: (value: Spacing) => void;

  /**
   * Callback fired when link state changes
   */
  onLinkChange?: (isLinked: boolean) => void;
}

/**
 * Default spacing configuration
 */
const DEFAULT_SPACING: Spacing = {
  top: { value: 0, unit: 'px' },
  right: { value: 0, unit: 'px' },
  bottom: { value: 0, unit: 'px' },
  left: { value: 0, unit: 'px' },
};

/**
 * Default props
 */
const defaultProps: Partial<SpacingEditorProps> = {
  value: DEFAULT_SPACING,
  availableUnits: ['px', 'rem', 'em', '%', 'pt'],
  startLinked: true,
  increment: 1,
  min: null,
  max: null,
  disabled: false,
};

/**
 * SpacingEditor Component
 */
export const SpacingEditor: Component<SpacingEditorProps> = (props) => {
  const merged = mergeProps(defaultProps, props);

  /**
   * Get current spacing value with defaults
   */
  const getSpacingValue = (): Spacing => {
    return {
      ...DEFAULT_SPACING,
      ...merged.value,
    };
  };

  /**
   * Convert Spacing to LinkedInputItem[]
   */
  const spacingToLinkedItems = (spacing: Spacing): LinkedInputItem[] => {
    return [
      {
        label: 'Top',
        value: spacing.top.value === 'auto' ? 0 : spacing.top.value,
        unit: spacing.top.unit,
        increment: merged.increment,
        min: merged.min,
        max: merged.max,
      },
      {
        label: 'Right',
        value: spacing.right.value === 'auto' ? 0 : spacing.right.value,
        unit: spacing.right.unit,
        increment: merged.increment,
        min: merged.min,
        max: merged.max,
      },
      {
        label: 'Bottom',
        value: spacing.bottom.value === 'auto' ? 0 : spacing.bottom.value,
        unit: spacing.bottom.unit,
        increment: merged.increment,
        min: merged.min,
        max: merged.max,
      },
      {
        label: 'Left',
        value: spacing.left.value === 'auto' ? 0 : spacing.left.value,
        unit: spacing.left.unit,
        increment: merged.increment,
        min: merged.min,
        max: merged.max,
      },
    ];
  };

  /**
   * Convert LinkedInputs values back to Spacing
   */
  const linkedItemsToSpacing = (values: { value: number; unit: string }[]): Spacing => {
    if (values.length !== 4) {
      return getSpacingValue();
    }

    return {
      top: {
        value: values[0]?.value ?? 0,
        unit: values[0]?.unit as CSSUnit,
      },
      right: {
        value: values[1]?.value ?? 0,
        unit: values[1]?.unit as CSSUnit,
      },
      bottom: {
        value: values[2]?.value ?? 0,
        unit: values[2]?.unit as CSSUnit,
      },
      left: {
        value: values[3]?.value ?? 0,
        unit: values[3]?.unit as CSSUnit,
      },
    };
  };

  /**
   * Handle LinkedInputs change
   */
  const handleChange = (values: { value: number; unit: string }[]) => {
    const spacing = linkedItemsToSpacing(values);
    merged.onChange?.(spacing);
  };

  /**
   * Handle link state change
   */
  const handleLinkChange = (isLinked: boolean) => {
    merged.onLinkChange?.(isLinked);
  };

  return (
    <div class={classNames(styles['spacing-editor'], merged.class)}>
      {merged.label && <InputLabel>{merged.label}</InputLabel>}

      <LinkedInputs
        items={spacingToLinkedItems(getSpacingValue())}
        startLinked={merged.startLinked}
        onChange={handleChange}
        onLink={handleLinkChange}
      />
    </div>
  );
};
