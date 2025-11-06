/**
 * InteractiveCard component (SolidJS)
 *
 * A card with interactive actions that appear on hover or click.
 *
 * @example
 * ```tsx
 * <InteractiveCard
 *   actions={[
 *     { icon: 'edit-line', label: 'Edit', callback: () => handleEdit() },
 *     { icon: 'delete-bin-line', label: 'Delete', callback: () => handleDelete() },
 *   ]}
 *   interactionType="hover"
 * >
 *   <div>Card content</div>
 * </InteractiveCard>
 * ```
 */

import { Component, JSX, For, Show, createSignal, mergeProps, splitProps } from 'solid-js';
import { classNames } from '@email-builder/ui-components/utils';
import styles from '@email-builder/ui-components/src/molecules/InteractiveCard/interactive-card.module.scss';

/**
 * Action definition
 */
export interface InteractiveCardAction {
  /**
   * Remix icon name
   */
  icon: string;

  /**
   * Action label
   */
  label?: string;

  /**
   * Tooltip title
   */
  title?: string;

  /**
   * Callback when action is clicked
   */
  callback: () => void;
}

/**
 * SolidJS InteractiveCard props
 */
export interface InteractiveCardProps {
  /**
   * Card content
   */
  children: JSX.Element;

  /**
   * Array of actions
   */
  actions?: InteractiveCardAction[];

  /**
   * Type of interaction to trigger overlay
   */
  interactionType?: 'hover' | 'click';

  /**
   * Additional CSS classes
   */
  class?: string;

  /**
   * Additional CSS classes for content
   */
  contentClass?: string;
}

/**
 * Default props
 */
const defaultProps: Partial<InteractiveCardProps> = {
  actions: [],
  interactionType: 'hover',
};

/**
 * SolidJS InteractiveCard Component
 */
export const InteractiveCard: Component<InteractiveCardProps> = (props) => {
  const merged = mergeProps(defaultProps, props);
  const [local] = splitProps(merged, [
    'children',
    'actions',
    'interactionType',
    'class',
    'contentClass',
  ]);

  const [showActions, setShowActions] = createSignal(false);

  /**
   * Handle mouse enter
   */
  const handleMouseEnter = () => {
    if (local.interactionType === 'hover') {
      setShowActions(true);
    }
  };

  /**
   * Handle mouse leave
   */
  const handleMouseLeave = () => {
    if (local.interactionType === 'hover') {
      setShowActions(false);
    }
  };

  /**
   * Handle click
   */
  const handleClick = () => {
    if (local.interactionType === 'click') {
      setShowActions(!showActions());
    }
  };

  /**
   * Get root classes
   */
  const getRootClasses = () => {
    return classNames(
      styles['interactive-card'],
      showActions() && styles['interactive-card--active'],
      local.class
    );
  };

  /**
   * Get content classes
   */
  const getContentClasses = () => {
    return classNames(
      styles['interactive-card__content'],
      local.contentClass
    );
  };

  return (
    <div
      class={getRootClasses()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div class={getContentClasses()}>
        {local.children}
      </div>

      <Show when={showActions() && local.actions && local.actions.length > 0}>
        <div class={styles['interactive-card__overlay']}>
          <div class={styles['interactive-card__actions']}>
            <For each={local.actions}>
              {(action) => (
                <button
                  type="button"
                  class={styles['interactive-card__action']}
                  onClick={(e) => {
                    e.stopPropagation();
                    action.callback();
                  }}
                  title={action.title || action.label}
                  aria-label={action.label || action.title}
                >
                  <i class={`ri-${action.icon}`} />
                  {action.label && <span>{action.label}</span>}
                </button>
              )}
            </For>
          </div>
        </div>
      </Show>
    </div>
  );
};
