/**
 * Region Highlight Component
 *
 * Renders semi-transparent overlays for padding/margin areas and element outlines.
 * Used for visualizing spacing regions and content areas.
 *
 * @module visual-feedback
 */

import { Component, Show, createMemo } from 'solid-js';
import styles from './RegionHighlight.module.scss';

export interface RegionHighlightProps {
  /** Target element to highlight */
  targetElement: HTMLElement;

  /** Region to highlight */
  region: 'padding' | 'margin' | 'border' | 'content' | 'all';

  /** Highlight color (CSS color value) */
  color?: string;

  /** Opacity (0-1) */
  opacity?: number;

  /** Feedback mode (hover or active) */
  mode?: 'hover' | 'active';

  /** Position and size (calculated by OverlayManager) */
  bounds?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

/**
 * Region Highlight Component
 *
 * Renders semi-transparent overlays for padding/margin regions.
 * Different color shades for different region types.
 */
export const RegionHighlight: Component<RegionHighlightProps> = (props) => {
  const mode = () => props.mode || 'hover';

  // Calculate color based on region and mode
  const regionColor = createMemo(() => {
    const baseColor = props.color || '#3b82f6'; // blue-500

    // Adjust color based on region type
    switch (props.region) {
      case 'padding':
        return baseColor; // Lighter blue
      case 'margin':
        return adjustColorBrightness(baseColor, -20); // Slightly darker
      case 'content':
        return baseColor;
      case 'border':
        return adjustColorBrightness(baseColor, -40); // Darker
      case 'all':
        return baseColor;
      default:
        return baseColor;
    }
  });

  // Calculate opacity based on mode
  const regionOpacity = createMemo(() => {
    const baseOpacity = props.opacity !== undefined ? props.opacity : 0.2;

    // Active mode is slightly more opaque
    if (mode() === 'active') {
      return Math.min(baseOpacity + 0.1, 1);
    }

    return baseOpacity;
  });

  // Calculate border opacity (for outline style)
  const borderOpacity = createMemo(() => {
    if (mode() === 'active') {
      return 0.8;
    }
    return 0.6;
  });

  // Determine if this is an outline vs fill
  const isOutline = () => props.region === 'border' || props.region === 'content';

  // Calculate region-specific styles
  const regionStyles = createMemo(() => {
    if (!props.bounds) return {};

    const base = {
      position: 'absolute' as const,
      left: `${props.bounds.x}px`,
      top: `${props.bounds.y}px`,
      width: `${props.bounds.width}px`,
      height: `${props.bounds.height}px`,
      'pointer-events': 'none',
      transition: 'all 0.15s ease-out',
    };

    if (isOutline()) {
      // Outline style (border)
      return {
        ...base,
        border: `2px solid ${regionColor()}`,
        'border-radius': '2px',
        opacity: borderOpacity(),
        'background-color': 'transparent',
      };
    } else {
      // Fill style (padding/margin)
      return {
        ...base,
        'background-color': regionColor(),
        opacity: regionOpacity(),
      };
    }
  });

  return (
    <Show when={props.bounds}>
      <div
        class={isOutline() ? styles.regionOutline : styles.regionFill}
        style={regionStyles()}
        data-region={props.region}
        data-mode={mode()}
      />
    </Show>
  );
};

/**
 * Adjust color brightness (helper function)
 */
function adjustColorBrightness(color: string, percent: number): string {
  // Simple brightness adjustment for hex colors
  // For more complex color manipulations, consider using a color library

  // If color is already a named color or rgb/rgba, return as-is
  if (!color.startsWith('#')) {
    return color;
  }

  // Parse hex color
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Adjust brightness
  const adjust = (value: number) => {
    const adjusted = value + (value * percent) / 100;
    return Math.max(0, Math.min(255, Math.round(adjusted)));
  };

  const newR = adjust(r);
  const newG = adjust(g);
  const newB = adjust(b);

  // Convert back to hex
  const toHex = (value: number) => value.toString(16).padStart(2, '0');

  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
}
