/**
 * Tooltip component (SolidJS)
 *
 * A tooltip that appears on hover using floating-ui for positioning.
 *
 * @example
 * ```tsx
 * <Tooltip content="This is a tooltip" placement="top">
 *   <button>Hover me</button>
 * </Tooltip>
 * ```
 */

import {
  Component,
  JSX,
  createSignal,
  Show,
  mergeProps,
  splitProps,
  onCleanup,
} from 'solid-js';
import {
  computePosition,
  offset,
  shift,
  flip,
  type Placement,
} from '@floating-ui/dom';
import { classNames } from '../../utils';
import styles from '@email-builder/ui-components/src/molecules/Tooltip/tooltip.module.scss';

/**
 * SolidJS Tooltip props
 */
export interface TooltipProps {
  /**
   * Tooltip content
   */
  content: JSX.Element | string;

  /**
   * Children element (tooltip trigger)
   */
  children: JSX.Element;

  /**
   * Placement of the tooltip
   */
  placement?: Placement;

  /**
   * Delay before showing tooltip (ms)
   */
  delay?: number;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Default props
 */
const defaultProps: Partial<TooltipProps> = {
  placement: 'top',
  delay: 200,
};

/**
 * SolidJS Tooltip Component
 */
export const Tooltip: Component<TooltipProps> = (props) => {
  const merged = mergeProps(defaultProps, props);
  const [local] = splitProps(merged, ['content', 'children', 'placement', 'delay', 'className']);

  const [isVisible, setIsVisible] = createSignal(false);
  let triggerRef: HTMLDivElement | undefined;
  let tooltipRef: HTMLDivElement | undefined;
  let timeoutId: number | undefined;

  /**
   * Update tooltip position
   */
  const updatePosition = async () => {
    if (!triggerRef || !tooltipRef) return;

    const position = await computePosition(triggerRef, tooltipRef, {
      ...(local.placement ? { placement: local.placement } : {}),
      middleware: [offset(8), flip(), shift({ padding: 8 })],
    });

    Object.assign(tooltipRef.style, {
      left: `${position.x}px`,
      top: `${position.y}px`,
    });
  };

  /**
   * Show tooltip with delay
   */
  const showTooltip = () => {
    timeoutId = window.setTimeout(() => {
      setIsVisible(true);
      updatePosition();
    }, local.delay);
  };

  /**
   * Hide tooltip
   */
  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setIsVisible(false);
  };

  onCleanup(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  });

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        class={styles.tooltip__trigger}
      >
        {local.children}
      </div>

      <Show when={isVisible()}>
        <div
          ref={tooltipRef}
          class={classNames(styles.tooltip, local.className)}
          role="tooltip"
        >
          {local.content}
        </div>
      </Show>
    </>
  );
};
