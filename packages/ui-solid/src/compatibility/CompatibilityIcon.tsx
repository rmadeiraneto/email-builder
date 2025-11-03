/**
 * Compatibility Icon Component
 *
 * Displays a visual indicator showing email client support for a CSS property
 *
 * @module compatibility
 */

import { Component, createMemo, Show } from 'solid-js';
import type { CompatibilityService } from '@email-builder/core/compatibility';
import styles from './CompatibilityIcon.module.scss';

export interface CompatibilityIconProps {
  /**
   * CSS property name to check compatibility for
   */
  property: string;

  /**
   * CompatibilityService instance
   */
  compatibilityService?: CompatibilityService;

  /**
   * Size of the icon in pixels
   * @default 16
   */
  size?: number;

  /**
   * Show label text next to icon
   * @default false
   */
  showLabel?: boolean;

  /**
   * Click handler - opens compatibility modal
   */
  onClick?: () => void;

  /**
   * Additional CSS class
   */
  class?: string;
}

/**
 * CompatibilityIcon component
 *
 * Shows a colored icon indicating email client support for a CSS property:
 * - 🟢 Green (90%+): Excellent support
 * - 🟡 Yellow (50-89%): Moderate support
 * - 🔴 Red (<50%): Poor support
 * - ⚪ Gray: Unknown/no data
 *
 * @example
 * ```tsx
 * <CompatibilityIcon
 *   property="border-radius"
 *   compatibilityService={service}
 *   onClick={() => setShowModal(true)}
 * />
 * ```
 */
export const CompatibilityIcon: Component<CompatibilityIconProps> = (props) => {
  const stats = createMemo(() => {
    if (!props.compatibilityService) return undefined;
    return props.compatibilityService.getPropertyStatistics(props.property);
  });

  const supportColor = createMemo(() => {
    const s = stats();
    if (!s || s.supportLevel === 'unknown') return 'gray';
    if (s.supportLevel === 'high') return 'green';
    if (s.supportLevel === 'medium') return 'yellow';
    return 'red';
  });

  const supportText = createMemo(() => {
    const s = stats();
    if (!s) return 'Unknown';
    return `${s.supportScore}% support (${s.fullSupport}/${s.totalClients} clients)`;
  });

  const iconSize = () => props.size ?? 16;

  return (
    <div
      class={`${styles.compatibilityIcon} ${styles[`compatibilityIcon--${supportColor()}`]} ${props.class ?? ''}`}
      onClick={props.onClick}
      title={supportText()}
    >
      <svg
        width={iconSize()}
        height={iconSize()}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          display: 'block',
          width: `${iconSize()}px`,
          height: `${iconSize()}px`,
          'max-width': `${iconSize()}px`,
          'max-height': `${iconSize()}px`
        }}
      >
        <circle cx="8" cy="8" r="7" fill="currentColor" opacity="0.2" />
        <circle cx="8" cy="8" r="5" fill="currentColor" />
      </svg>

      <Show when={props.showLabel}>
        <span class={styles.compatibilityIcon__label}>{supportText()}</span>
      </Show>
    </div>
  );
};
