/**
 * Accordion component (SolidJS)
 *
 * An expandable/collapsible content container.
 *
 * @example
 * ```tsx
 * <Accordion title="Click to expand">
 *   <div>Accordion content here</div>
 * </Accordion>
 * ```
 */

import {
  Component,
  JSX,
  createSignal,
  Show,
  mergeProps,
  splitProps,
} from 'solid-js';
import { classNames } from '@email-builder/ui-components/utils';
import styles from '@email-builder/ui-components/src/molecules/Accordion/accordion.module.scss';

/**
 * SolidJS Accordion props
 */
export interface AccordionProps {
  /**
   * Accordion title/header
   */
  title: string | JSX.Element;

  /**
   * Accordion content
   */
  children: JSX.Element;

  /**
   * Whether accordion starts open
   */
  startOpen?: boolean;

  /**
   * Color variant
   */
  variant?: 'default' | 'primary' | 'secondary';

  /**
   * Icon to show when collapsed
   */
  iconCollapsed?: string;

  /**
   * Icon to show when expanded
   */
  iconExpanded?: string;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Callback when accordion is toggled
   */
  onToggle?: (isOpen: boolean) => void;
}

/**
 * Default props
 */
const defaultProps: Partial<AccordionProps> = {
  startOpen: false,
  variant: 'default',
  iconCollapsed: 'arrow-right-s-line',
  iconExpanded: 'arrow-down-s-line',
};

/**
 * SolidJS Accordion Component
 */
export const Accordion: Component<AccordionProps> = (props) => {
  const merged = mergeProps(defaultProps, props);
  const [local] = splitProps(merged, [
    'title',
    'children',
    'startOpen',
    'variant',
    'iconCollapsed',
    'iconExpanded',
    'className',
    'onToggle',
  ]);

  const [isOpen, setIsOpen] = createSignal(local.startOpen ?? false);

  /**
   * Toggle accordion
   */
  const toggle = () => {
    const newState = !isOpen();
    setIsOpen(newState);
    local.onToggle?.(newState);
  };

  /**
   * Get accordion classes
   */
  const getAccordionClasses = () => {
    return classNames(
      styles.accordion,
      styles[`accordion--${local.variant}`],
      isOpen() && styles['accordion--open'],
      local.className
    );
  };

  return (
    <div class={getAccordionClasses()}>
      <button
        type="button"
        class={styles.accordion__header}
        onClick={toggle}
        aria-expanded={isOpen()}
      >
        <i
          class={classNames(
            styles.accordion__icon,
            `ri-${isOpen() ? local.iconExpanded : local.iconCollapsed}`
          )}
        />
        <span class={styles.accordion__title}>{local.title}</span>
      </button>

      <Show when={isOpen()}>
        <div class={styles.accordion__content}>{local.children}</div>
      </Show>
    </div>
  );
};
