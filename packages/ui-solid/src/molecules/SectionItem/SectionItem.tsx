/**
 * SectionItem SolidJS Component
 *
 * A section item with label and content areas.
 * Provides consistent spacing and typography for form-like layouts.
 *
 * @example
 * ```tsx
 * import { SectionItem } from '@email-builder/ui-solid/molecules';
 *
 * <SectionItem label="Field Name">
 *   <input type="text" />
 * </SectionItem>
 * ```
 */

import { type Component, type JSX, mergeProps, Show } from 'solid-js';
import { classNames } from '@email-builder/ui-components/utils';
import type { SectionItemOptions } from '@email-builder/ui-components/molecules';
import styles from '@email-builder/ui-components/src/molecules/SectionItem/section-item.module.scss';

export interface SectionItemProps {
  /**
   * Label content to display above the content
   */
  label?: string | JSX.Element;

  /**
   * Description tooltip text
   */
  description?: string;

  /**
   * Child content to render
   */
  children?: JSX.Element;

  /**
   * Additional CSS classes for the root element
   */
  class?: string;

  /**
   * Additional CSS classes for the label element
   */
  labelClass?: string;

  /**
   * Additional CSS classes for the content element
   */
  contentClass?: string;

  /**
   * HTML tag name for the root element
   * @default 'div'
   */
  as?: keyof JSX.IntrinsicElements;

  /**
   * Whether to hide the section item
   */
  hidden?: boolean;
}

export const SectionItem: Component<SectionItemProps> = (props) => {
  const merged = mergeProps(
    {
      as: 'div' as keyof JSX.IntrinsicElements,
      hidden: false,
    },
    props
  );

  const rootClasses = () =>
    classNames(
      styles.sectionItem,
      merged.class
    );

  const labelClasses = () =>
    classNames(
      styles.sectionItem__label,
      merged.labelClass
    );

  const contentClasses = () =>
    classNames(
      styles.sectionItem__content,
      merged.contentClass
    );

  const Tag = merged.as as any;

  return (
    <Tag
      class={rootClasses()}
      style={{ display: merged.hidden ? 'none' : undefined }}
    >
      <Show when={merged.label}>
        <div class={labelClasses()} title={merged.description}>
          {merged.label}
          <Show when={merged.description}>
            <span style={{ cursor: 'help' }}>ⓘ</span>
          </Show>
        </div>
      </Show>
      <Show when={merged.children}>
        <div class={contentClasses()}>
          {merged.children}
        </div>
      </Show>
    </Tag>
  );
};

export default SectionItem;
