/**
 * Property Indicator Component
 *
 * Shows floating labels for non-visual property changes.
 * Displays property name and value near the affected component.
 *
 * @module visual-feedback
 */

import { Component, onMount, onCleanup, createSignal } from 'solid-js';
import styles from './PropertyIndicator.module.scss';

export type IndicatorPosition = 'near-component' | 'fixed-top' | 'fixed-bottom';

export interface PropertyIndicatorProps {
  /** Target element to position near */
  targetElement?: HTMLElement;

  /** Property name to display */
  propertyName: string;

  /** New value to display */
  value: string;

  /** Duration to show indicator (in milliseconds) */
  duration?: number;

  /** Position style */
  position?: IndicatorPosition;

  /** Color for indicator */
  color?: string;

  /** Callback when indicator is dismissed */
  onDismiss?: () => void;
}

/**
 * Property Indicator Component
 *
 * Displays a floating label showing property changes.
 * Auto-dismisses after configured duration.
 */
export const PropertyIndicator: Component<PropertyIndicatorProps> = (props) => {
  const [visible, setVisible] = createSignal(true);
  const duration = () => props.duration || 1000;
  const position = () => props.position || 'near-component';
  const color = () => props.color || '#3b82f6';

  // Auto-dismiss after duration
  onMount(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        props.onDismiss?.();
      }, 200); // Wait for fade-out animation
    }, duration());

    onCleanup(() => clearTimeout(timer));
  });

  // Calculate position styles
  const positionStyles = () => {
    const base = {
      'pointer-events': 'none' as const,
      'z-index': 1002,
    };

    if (position() === 'fixed-top') {
      return {
        ...base,
        position: 'fixed' as const,
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
      };
    } else if (position() === 'fixed-bottom') {
      return {
        ...base,
        position: 'fixed' as const,
        bottom: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
      };
    } else {
      // near-component
      if (!props.targetElement) {
        return {
          ...base,
          position: 'absolute' as const,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        };
      }

      const rect = props.targetElement.getBoundingClientRect();
      return {
        ...base,
        position: 'fixed' as const,
        top: `${rect.top - 32}px`,
        left: `${rect.left + rect.width / 2}px`,
        transform: 'translateX(-50%)',
      };
    }
  };

  // Truncate long values
  const displayValue = () => {
    const val = props.value;
    if (val.length > 50) {
      return val.substring(0, 47) + '...';
    }
    return val;
  };

  return (
    <div
      class={styles.propertyIndicator}
      classList={{
        [styles.visible]: visible(),
        [styles.hidden]: !visible(),
      }}
      style={{
        ...positionStyles(),
        '--indicator-color': color(),
      }}
    >
      <div class={styles.content}>
        <span class={styles.propertyName}>{props.propertyName}:</span>
        <span class={styles.propertyValue}>{displayValue()}</span>
      </div>
    </div>
  );
};
