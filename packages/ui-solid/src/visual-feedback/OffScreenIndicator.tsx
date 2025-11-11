/**
 * Off-Screen Indicator Component
 *
 * Shows indicators when affected elements are outside the viewport.
 * Displays directional arrows and counts at canvas edges.
 *
 * @module visual-feedback
 */

import { Component, Show, createMemo } from 'solid-js';
import styles from './OffScreenIndicator.module.scss';

export type OffScreenDirection = 'top' | 'bottom' | 'left' | 'right';

export interface OffScreenIndicatorProps {
  /** Direction where off-screen elements are located */
  direction: OffScreenDirection;

  /** Count of off-screen elements in this direction */
  count: number;

  /** Canvas element for positioning */
  canvasElement?: HTMLElement;

  /** Color for indicator */
  color?: string;

  /** Optional click handler to scroll elements into view */
  onClick?: () => void;
}

/**
 * Off-Screen Indicator Component
 *
 * Displays arrows at canvas edges indicating off-screen elements.
 */
export const OffScreenIndicator: Component<OffScreenIndicatorProps> = (props) => {
  const color = () => props.color || '#FF0000';
  const hasMultiple = () => props.count > 1;

  // Calculate indicator position based on direction
  const positionStyles = createMemo(() => {
    const base = {
      position: 'absolute' as const,
      'z-index': 1001,
      'pointer-events': (props.onClick ? 'auto' : 'none') as 'auto' | 'none',
      cursor: props.onClick ? 'pointer' : 'default',
    };

    const offset = '12px';

    switch (props.direction) {
      case 'top':
        return {
          ...base,
          top: offset,
          left: '50%',
          transform: 'translateX(-50%)',
        };
      case 'bottom':
        return {
          ...base,
          bottom: offset,
          left: '50%',
          transform: 'translateX(-50%)',
        };
      case 'left':
        return {
          ...base,
          left: offset,
          top: '50%',
          transform: 'translateY(-50%)',
        };
      case 'right':
        return {
          ...base,
          right: offset,
          top: '50%',
          transform: 'translateY(-50%)',
        };
    }
  });

  // Get arrow icon based on direction
  const arrowPath = createMemo(() => {
    switch (props.direction) {
      case 'top':
        return 'M12 4l-8 8h16l-8-8z'; // Up arrow
      case 'bottom':
        return 'M12 20l8-8H4l8 8z'; // Down arrow
      case 'left':
        return 'M4 12l8-8v16l-8-8z'; // Left arrow
      case 'right':
        return 'M20 12l-8 8V4l8 8z'; // Right arrow
    }
  });

  return (
    <div
      class={styles.offScreenIndicator}
      style={positionStyles()}
      onClick={props.onClick}
      data-direction={props.direction}
      title={`${props.count} element${props.count > 1 ? 's' : ''} ${props.direction}`}
    >
      {/* Arrow icon */}
      <svg
        class={styles.arrow}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill={color()}
      >
        <path d={arrowPath()} />
      </svg>

      {/* Count badge */}
      <Show when={hasMultiple()}>
        <div
          class={styles.countBadge}
          style={{
            'background-color': color(),
          }}
        >
          {props.count}
        </div>
      </Show>
    </div>
  );
};
