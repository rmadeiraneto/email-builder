/**
 * Measurement Overlay Component
 *
 * Renders Figma-style measurement lines with pixel values using SVG.
 * Used for visualizing spacing and sizing properties.
 *
 * @module visual-feedback
 */

import { Component, Show, createMemo } from 'solid-js';
import styles from './MeasurementOverlay.module.scss';

export interface MeasurementOverlayProps {
  /** Target element to measure */
  targetElement: HTMLElement;

  /** Measurement direction */
  measurementType: 'horizontal' | 'vertical' | 'both';

  /** Value to display (in pixels or other unit) */
  value: number | string;

  /** Region being measured */
  region: 'padding' | 'margin' | 'content' | 'border';

  /** Whether to show the value label */
  showValue?: boolean;

  /** Color for measurement lines */
  color?: string;

  /** Position coordinates (calculated by OverlayManager) */
  position?: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    value: number;
  };

  /** Feedback mode (hover or active) */
  mode?: 'hover' | 'active';
}

/**
 * Measurement Overlay Component
 *
 * Renders measurement lines with dimension labels.
 * Figma-style aesthetic with configurable colors.
 */
export const MeasurementOverlay: Component<MeasurementOverlayProps> = (props) => {
  const color = () => props.color || '#FF0000';
  const showValue = () => props.showValue !== false;
  const mode = () => props.mode || 'hover';

  // Calculate line opacity based on mode
  const lineOpacity = () => (mode() === 'active' ? 1 : 0.8);

  // Calculate label opacity based on mode
  const labelOpacity = () => (mode() === 'active' ? 1 : 0.9);

  // Format value for display
  const formattedValue = createMemo(() => {
    if (!showValue()) return '';

    const val = props.position?.value || props.value;
    if (typeof val === 'number') {
      return `${Math.round(val)}px`;
    }
    return String(val);
  });

  // Calculate label position (center of line)
  const labelX = createMemo(() => {
    if (!props.position) return 0;
    return (props.position.x1 + props.position.x2) / 2;
  });

  const labelY = createMemo(() => {
    if (!props.position) return 0;
    return (props.position.y1 + props.position.y2) / 2;
  });

  // Determine if line is horizontal or vertical
  const isHorizontal = createMemo(() => {
    if (!props.position) return props.measurementType === 'horizontal';
    return Math.abs(props.position.y2 - props.position.y1) < Math.abs(props.position.x2 - props.position.x1);
  });

  // Calculate cap positions (perpendicular to line)
  const capLength = 6;
  const getCapCoordinates = (x: number, y: number, _isStart: boolean) => {
    if (isHorizontal()) {
      return {
        x1: x,
        y1: y - capLength,
        x2: x,
        y2: y + capLength,
      };
    } else {
      return {
        x1: x - capLength,
        y1: y,
        x2: x + capLength,
        y2: y,
      };
    }
  };

  const startCap = createMemo(() => {
    if (!props.position) return { x1: 0, y1: 0, x2: 0, y2: 0 };
    return getCapCoordinates(props.position.x1, props.position.y1, true);
  });

  const endCap = createMemo(() => {
    if (!props.position) return { x1: 0, y1: 0, x2: 0, y2: 0 };
    return getCapCoordinates(props.position.x2, props.position.y2, false);
  });

  // Calculate label offset to position above/beside line
  const labelOffset = 8;
  const labelTransform = createMemo(() => {
    if (isHorizontal()) {
      return `translate(0, -${labelOffset})`;
    } else {
      return `translate(-${labelOffset}, 0) rotate(-90, ${labelX()}, ${labelY()})`;
    }
  });

  return (
    <Show when={props.position}>
      <svg class={styles.measurementOverlay} xmlns="http://www.w3.org/2000/svg">
        {/* Measurement line */}
        <line
          x1={props.position!.x1}
          y1={props.position!.y1}
          x2={props.position!.x2}
          y2={props.position!.y2}
          stroke={color()}
          stroke-width="1.5"
          opacity={lineOpacity()}
          class={styles.measurementLine}
        />

        {/* Start cap */}
        <line
          x1={startCap().x1}
          y1={startCap().y1}
          x2={startCap().x2}
          y2={startCap().y2}
          stroke={color()}
          stroke-width="1.5"
          opacity={lineOpacity()}
          class={styles.capLine}
        />

        {/* End cap */}
        <line
          x1={endCap().x1}
          y1={endCap().y1}
          x2={endCap().x2}
          y2={endCap().y2}
          stroke={color()}
          stroke-width="1.5"
          opacity={lineOpacity()}
          class={styles.capLine}
        />

        {/* Value label */}
        <Show when={showValue() && formattedValue()}>
          <g transform={labelTransform()}>
            {/* Background for label (for better readability) */}
            <text
              x={labelX()}
              y={labelY()}
              text-anchor="middle"
              dominant-baseline="middle"
              class={styles.labelBackground}
              stroke="white"
              stroke-width="3"
              opacity={labelOpacity()}
            >
              {formattedValue()}
            </text>

            {/* Actual label text */}
            <text
              x={labelX()}
              y={labelY()}
              text-anchor="middle"
              dominant-baseline="middle"
              class={styles.labelText}
              fill={color()}
              opacity={labelOpacity()}
            >
              {formattedValue()}
            </text>
          </g>
        </Show>
      </svg>
    </Show>
  );
};
