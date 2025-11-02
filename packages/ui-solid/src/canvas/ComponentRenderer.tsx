/**
 * Component Renderer
 *
 * Renders components as actual HTML instead of JSON preview
 */

import { type Component, Match, Switch } from 'solid-js';
import type {
  BaseComponent,
  ButtonComponent,
  TextComponent,
  ImageComponent,
  SeparatorComponent,
  SpacerComponent,
} from '@email-builder/core';
import { ComponentType } from '@email-builder/core';
import styles from './ComponentRenderer.module.scss';

export interface ComponentRendererProps {
  component: BaseComponent;
}

/**
 * Main component renderer - switches between component types
 */
export const ComponentRenderer: Component<ComponentRendererProps> = (props) => {
  return (
    <Switch fallback={<div>Unknown component type: {props.component.type}</div>}>
      <Match when={props.component.type === ComponentType.BUTTON}>
        <ButtonRenderer component={props.component as unknown as ButtonComponent} />
      </Match>
      <Match when={props.component.type === ComponentType.TEXT}>
        <TextRenderer component={props.component as unknown as TextComponent} />
      </Match>
      <Match when={props.component.type === ComponentType.IMAGE}>
        <ImageRenderer component={props.component as unknown as ImageComponent} />
      </Match>
      <Match when={props.component.type === ComponentType.SEPARATOR}>
        <SeparatorRenderer component={props.component as unknown as SeparatorComponent} />
      </Match>
      <Match when={props.component.type === ComponentType.SPACER}>
        <SpacerRenderer component={props.component as unknown as SpacerComponent} />
      </Match>
    </Switch>
  );
};

/**
 * Button component renderer
 */
const ButtonRenderer: Component<{ component: ButtonComponent }> = (props) => {
  const getButtonStyles = () => {
    const s = props.component.styles || {};

    return {
      'background-color': s.backgroundColor || '#007bff',
      'color': s.color || '#ffffff',
      'padding': s.padding
        ? `${s.padding.top?.value || 12}${s.padding.top?.unit || 'px'} ${s.padding.right?.value || 24}${s.padding.right?.unit || 'px'} ${s.padding.bottom?.value || 12}${s.padding.bottom?.unit || 'px'} ${s.padding.left?.value || 24}${s.padding.left?.unit || 'px'}`
        : '12px 24px',
      'font-family': s.fontFamily || 'system-ui, -apple-system, sans-serif',
      'font-size': s.fontSize ? `${s.fontSize.value}${s.fontSize.unit}` : '16px',
      'font-weight': s.fontWeight || 500,
      'text-align': s.textAlign || 'center',
      'border': s.border
        ? `${s.border.width?.value || 1}${s.border.width?.unit || 'px'} ${s.border.style || 'solid'} ${s.border.color || '#007bff'}`
        : '1px solid #007bff',
      'border-radius': s.border?.radius
        ? `${s.border.radius.topLeft?.value || 4}${s.border.radius.topLeft?.unit || 'px'} ${s.border.radius.topRight?.value || 4}${s.border.radius.topRight?.unit || 'px'} ${s.border.radius.bottomRight?.value || 4}${s.border.radius.bottomRight?.unit || 'px'} ${s.border.radius.bottomLeft?.value || 4}${s.border.radius.bottomLeft?.unit || 'px'}`
        : '4px',
      'cursor': 'pointer',
      'display': 'inline-block',
      'text-decoration': 'none',
    };
  };

  return (
    <div class={styles.buttonContainer}>
      <a
        href={props.component.content?.link?.href || '#'}
        target={props.component.content?.link?.target || '_blank'}
        rel="noopener noreferrer"
        class={styles.button}
        style={getButtonStyles()}
        onClick={(e) => e.preventDefault()} // Prevent navigation in preview
      >
        {props.component.content?.text || 'Button'}
      </a>
    </div>
  );
};

/**
 * Text component renderer
 */
const TextRenderer: Component<{ component: TextComponent }> = (props) => {
  const getTextStyles = () => {
    const s = props.component.styles || {};

    return {
      'font-family': s.fontFamily || 'system-ui, -apple-system, sans-serif',
      'font-size': s.fontSize ? `${s.fontSize.value}${s.fontSize.unit}` : '16px',
      'font-weight': s.fontWeight || 400,
      'color': s.color || '#333333',
      'line-height': s.lineHeight ? `${s.lineHeight.value}${s.lineHeight.unit || ''}` : '1.5',
      'text-align': s.textAlign || 'left',
    };
  };

  return (
    <div
      class={styles.text}
      style={getTextStyles()}
      innerHTML={props.component.content?.html || props.component.content?.plainText || 'Text'}
    />
  );
};

/**
 * Image component renderer
 */
const ImageRenderer: Component<{ component: ImageComponent }> = (props) => {
  const getImageStyles = () => {
    const s = props.component.styles || {};

    return {
      'width': s.width ? `${s.width.value}${s.width.unit}` : '100%',
      'height': s.height ? `${s.height.value}${s.height.unit}` : 'auto',
      'object-fit': s.objectFit || 'cover',
      'display': s.display || 'block',
    };
  };

  return (
    <div class={styles.imageContainer}>
      <img
        src={props.component.content?.src || 'https://via.placeholder.com/600x400'}
        alt={props.component.content?.alt || 'Image'}
        title={props.component.content?.title}
        loading={props.component.content?.lazy ? 'lazy' : 'eager'}
        class={styles.image}
        style={getImageStyles()}
      />
    </div>
  );
};

/**
 * Separator component renderer
 */
const SeparatorRenderer: Component<{ component: SeparatorComponent }> = (props) => {
  const getSeparatorStyles = () => {
    const c = props.component.content || {};
    const isHorizontal = c.orientation === 'horizontal';

    return {
      'border-top': isHorizontal
        ? `${c.thickness?.value || 1}${c.thickness?.unit || 'px'} ${c.style || 'solid'} ${c.color || '#e0e0e0'}`
        : 'none',
      'border-left': !isHorizontal
        ? `${c.thickness?.value || 1}${c.thickness?.unit || 'px'} ${c.style || 'solid'} ${c.color || '#e0e0e0'}`
        : 'none',
      'width': isHorizontal ? '100%' : 'auto',
      'height': !isHorizontal ? '50px' : '0',
      'margin': '0',
    };
  };

  return (
    <hr
      class={styles.separator}
      style={getSeparatorStyles()}
    />
  );
};

/**
 * Spacer component renderer
 */
const SpacerRenderer: Component<{ component: SpacerComponent }> = (props) => {
  const getSpacerStyles = () => {
    const c = props.component.content || {};

    return {
      'height': c.height ? `${c.height.value}${c.height.unit}` : '20px',
      'width': '100%',
      'display': 'block',
    };
  };

  return (
    <div
      class={styles.spacer}
      style={getSpacerStyles()}
    />
  );
};
