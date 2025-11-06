/**
 * ToggleableSection component (SolidJS)
 *
 * A section with a toggle button to show/hide content.
 *
 * @example
 * ```tsx
 * <ToggleableSection
 *   label="Advanced Options"
 *   startOpen={false}
 *   onToggle={(isOpen) => console.log('Is open:', isOpen)}
 * >
 *   <p>Advanced content goes here</p>
 * </ToggleableSection>
 * ```
 */

import { Component, JSX, Show, createSignal, mergeProps, splitProps } from 'solid-js';
import { classNames } from '../../utils';
import styles from '@email-builder/ui-components/src/molecules/ToggleableSection/toggleable-section.module.scss';

/**
 * SolidJS ToggleableSection props
 */
export interface ToggleableSectionProps {
  /**
   * Section label
   */
  label?: string;

  /**
   * Section content
   */
  children: JSX.Element;

  /**
   * Whether the section starts open
   */
  startOpen?: boolean;

  /**
   * Whether the content can be toggled
   */
  toggleableContent?: boolean;

  /**
   * Description tooltip text
   */
  description?: string;

  /**
   * Additional CSS classes
   */
  class?: string;

  /**
   * Callback when toggle state changes
   */
  onToggle?: (isOpen: boolean) => void;
}

/**
 * Default props
 */
const defaultProps: Partial<ToggleableSectionProps> = {
  startOpen: false,
  toggleableContent: false,
};

/**
 * SolidJS ToggleableSection Component
 */
export const ToggleableSection: Component<ToggleableSectionProps> = (props) => {
  const merged = mergeProps(defaultProps, props);
  const [local] = splitProps(merged, [
    'label',
    'children',
    'startOpen',
    'toggleableContent',
    'description',
    'class',
    'onToggle',
  ]);

  const [isOpen, setIsOpen] = createSignal(local.startOpen!);

  /**
   * Toggle open state
   */
  const handleToggle = () => {
    const newState = !isOpen();
    setIsOpen(newState);
    local.onToggle?.(newState);
  };

  /**
   * Get root classes
   */
  const getRootClasses = () => {
    return classNames(
      styles['toggleable-section'],
      isOpen() && styles['toggleable-section--open'],
      local.class
    );
  };

  return (
    <div class={getRootClasses()}>
      <Show when={local.label}>
        <div class={styles['toggleable-section__header']}>
          <label class={styles['toggleable-section__label']}>{local.label}</label>

          <Show when={local.description}>
            <span
              class={styles['toggleable-section__tooltip']}
              title={local.description}
              aria-label={local.description}
              role="tooltip"
            >
              ?
            </span>
          </Show>

          <Show when={local.toggleableContent}>
            <button
              type="button"
              class={styles['toggleable-section__toggle']}
              onClick={handleToggle}
              aria-expanded={isOpen()}
              aria-label={isOpen() ? 'Collapse section' : 'Expand section'}
            >
              <i class={isOpen() ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} />
            </button>
          </Show>
        </div>
      </Show>

      <Show when={!local.toggleableContent || isOpen()}>
        <div class={styles['toggleable-section__content']}>
          {local.children}
        </div>
      </Show>
    </div>
  );
};
