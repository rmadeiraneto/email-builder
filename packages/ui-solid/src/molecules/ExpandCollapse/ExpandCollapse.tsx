/**
 * ExpandCollapse SolidJS Component
 *
 * A component that expands/collapses content with absolute positioning.
 * Useful for dropdowns, tooltips, and expandable menus.
 *
 * @example
 * ```tsx
 * import { ExpandCollapse } from '@email-builder/ui-solid/molecules';
 * import { createSignal } from 'solid-js';
 *
 * const [isExpanded, setIsExpanded] = createSignal(false);
 *
 * <ExpandCollapse
 *   isExpanded={isExpanded()}
 *   trigger={<button onClick={() => setIsExpanded(!isExpanded())}>Toggle</button>}
 *   rightToLeft={false}
 * >
 *   <div>Expandable content here</div>
 * </ExpandCollapse>
 * ```
 */

import { type Component, type JSX, mergeProps, Show } from 'solid-js';
import { classNames } from '../../utils';
import styles from '@email-builder/ui-components/src/molecules/ExpandCollapse/expand-collapse.module.scss';

export interface ExpandCollapseProps {
  /**
   * Whether the expandable content is shown
   */
  isExpanded?: boolean;

  /**
   * Trigger element that controls expansion
   */
  trigger?: JSX.Element;

  /**
   * Expandable content (children)
   */
  children?: JSX.Element;

  /**
   * Whether to position expandable to the right instead of left
   * @default false
   */
  rightToLeft?: boolean;

  /**
   * Additional CSS classes for the root element
   */
  class?: string;

  /**
   * Callback when expand/collapse state should change
   */
  onToggle?: (isExpanded: boolean) => void;
}

export const ExpandCollapse: Component<ExpandCollapseProps> = (props) => {
  const merged = mergeProps(
    {
      isExpanded: false,
      rightToLeft: false,
    },
    props
  );

  const rootClasses = () =>
    classNames(
      styles.expandCollapse,
      merged.isExpanded && styles['expandCollapse--expanded'],
      merged.rightToLeft && styles['expandCollapse--right'],
      merged.class
    );

  const handleTriggerClick = () => {
    merged.onToggle?.(!merged.isExpanded);
  };

  return (
    <div class={rootClasses()}>
      <div class={styles.expandCollapse__trigger} onClick={handleTriggerClick}>
        {merged.trigger}
      </div>
      <Show when={merged.isExpanded}>
        <div class={styles.expandCollapse__expandable}>
          {merged.children}
        </div>
      </Show>
    </div>
  );
};

export default ExpandCollapse;
