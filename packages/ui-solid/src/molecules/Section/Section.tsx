/**
 * Section SolidJS Component
 *
 * A generic section wrapper component with optional label and content.
 * Built with SolidJS for reactive composition.
 *
 * @example
 * ```tsx
 * import { Section } from '@email-builder/ui-solid/molecules';
 *
 * <Section label="My Section">
 *   <div>Section content here</div>
 * </Section>
 * ```
 */

import { type Component, type JSX, mergeProps, Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { classNames } from '../../utils';
import styles from '@email-builder/ui-components/src/molecules/Section/section.module.scss';

export interface SectionProps {
  /**
   * Label text to display above the content
   */
  label?: string | JSX.Element;

  /**
   * Child content to render in the section
   */
  children?: JSX.Element;

  /**
   * Additional CSS classes to apply
   */
  class?: string;

  /**
   * HTML tag name for the section element
   * @default 'div'
   */
  as?: keyof JSX.IntrinsicElements;
}

export const Section: Component<SectionProps> = (props) => {
  const merged = mergeProps(
    {
      as: 'div' as keyof JSX.IntrinsicElements,
    },
    props
  );

  const classes = () =>
    classNames(
      styles.section,
      merged.class
    );

  return (
    <Dynamic component={merged.as} class={classes()}>
      <Show when={merged.label}>
        <label class={`${styles.section__label} eb-label`}>
          {merged.label}
        </label>
      </Show>
      <div class={styles.section__content}>
        {merged.children}
      </div>
    </Dynamic>
  );
};

export default Section;
