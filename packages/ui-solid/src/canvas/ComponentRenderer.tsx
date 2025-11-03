/**
 * Component Renderer
 *
 * Renders components as actual HTML instead of JSON preview
 */

import { type Component, Match, Switch, For } from 'solid-js';
import type {
  BaseComponent,
  ButtonComponent,
  TextComponent,
  ImageComponent,
  SeparatorComponent,
  SpacerComponent,
  HeaderComponent,
  FooterComponent,
  HeroComponent,
  ListComponent,
  CTAComponent,
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
      <Match when={props.component.type === ComponentType.HEADER}>
        <HeaderRenderer component={props.component as unknown as HeaderComponent} />
      </Match>
      <Match when={props.component.type === ComponentType.FOOTER}>
        <FooterRenderer component={props.component as unknown as FooterComponent} />
      </Match>
      <Match when={props.component.type === ComponentType.HERO}>
        <HeroRenderer component={props.component as unknown as HeroComponent} />
      </Match>
      <Match when={props.component.type === ComponentType.LIST}>
        <ListRenderer component={props.component as unknown as ListComponent} />
      </Match>
      <Match when={props.component.type === ComponentType.CALL_TO_ACTION}>
        <CTARenderer component={props.component as unknown as CTAComponent} />
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

/**
 * Header component renderer
 */
const HeaderRenderer: Component<{ component: HeaderComponent }> = (props) => {
  const getHeaderStyles = () => {
    const s = props.component.styles || {};

    return {
      'background-color': s.backgroundColor || '#ffffff',
      'padding': s.padding ? `${s.padding.top?.value || 20}${s.padding.top?.unit || 'px'} ${s.padding.right?.value || 20}${s.padding.right?.unit || 'px'} ${s.padding.bottom?.value || 20}${s.padding.bottom?.unit || 'px'} ${s.padding.left?.value || 20}${s.padding.left?.unit || 'px'}` : '20px',
      'display': 'flex' as const,
      'align-items': 'center' as const,
      'gap': '20px',
      'flex-direction': (props.component.content?.layout === 'image-top' ? 'column' : 'row') as 'column' | 'row',
      'justify-content': (props.component.content?.layout === 'logo-center' ? 'center' : 'space-between') as 'center' | 'space-between',
    };
  };

  const getLinkStyles = () => {
    const s = props.component.styles || {};
    return {
      'color': s.linkStyles?.color || '#333333',
      'text-decoration': 'none',
      'font-family': s.linkStyles?.fontFamily || 'system-ui, -apple-system, sans-serif',
      'font-size': s.linkStyles?.fontSize ? `${s.linkStyles.fontSize.value}${s.linkStyles.fontSize.unit}` : '14px',
      'font-weight': s.linkStyles?.fontWeight || 400,
    };
  };

  const getImageStyles = () => {
    const s = props.component.styles || {};
    return {
      'max-width': s.imageMaxWidth ? `${s.imageMaxWidth.value}${s.imageMaxWidth.unit}` : '200px',
      'max-height': s.imageMaxHeight ? `${s.imageMaxHeight.value}${s.imageMaxHeight.unit}` : '80px',
      'width': 'auto',
      'height': 'auto',
      'display': 'block',
    };
  };

  return (
    <header class={styles.header} style={getHeaderStyles()}>
      <div class={styles.headerLogo}>
        <img
          src={props.component.content?.image?.src || 'https://via.placeholder.com/200x80'}
          alt={props.component.content?.image?.alt || 'Logo'}
          style={getImageStyles()}
        />
      </div>
      {props.component.content?.showNavigation && (
        <nav class={styles.headerNav} style={{ 'display': 'flex', 'gap': '15px', 'align-items': 'center' }}>
          <For each={props.component.content?.navigationLinks || []}>
            {(link) => (
              <a
                href={link.link.href || '#'}
                target={link.link.target || '_self'}
                style={getLinkStyles()}
                onClick={(e) => e.preventDefault()}
              >
                {link.text || 'Link'}
              </a>
            )}
          </For>
        </nav>
      )}
    </header>
  );
};

/**
 * Footer component renderer
 */
const FooterRenderer: Component<{ component: FooterComponent }> = (props) => {
  const getFooterStyles = () => {
    const s = props.component.styles || {};

    return {
      'background-color': s.backgroundColor || '#f5f5f5',
      'padding': s.padding ? `${s.padding.top?.value || 30}${s.padding.top?.unit || 'px'} ${s.padding.right?.value || 20}${s.padding.right?.unit || 'px'} ${s.padding.bottom?.value || 30}${s.padding.bottom?.unit || 'px'} ${s.padding.left?.value || 20}${s.padding.left?.unit || 'px'}` : '30px 20px',
      'text-align': 'center' as const,
    };
  };

  const getTextStyles = () => {
    const s = props.component.styles || {};
    return {
      'font-family': s.textStyles?.fontFamily || 'system-ui, -apple-system, sans-serif',
      'font-size': s.textStyles?.fontSize ? `${s.textStyles.fontSize.value}${s.textStyles.fontSize.unit}` : '14px',
      'color': s.textStyles?.color || '#666666',
      'line-height': s.textStyles?.lineHeight ? `${s.textStyles.lineHeight.value}${s.textStyles.lineHeight.unit || ''}` : '1.5',
    };
  };

  const getSocialIconStyles = () => {
    const s = props.component.styles || {};
    return {
      'color': s.socialIconColor || '#333333',
      'font-size': s.socialIconSize ? `${s.socialIconSize.value}${s.socialIconSize.unit}` : '24px',
      'text-decoration': 'none',
      'display': 'inline-block',
    };
  };

  return (
    <footer class={styles.footer} style={getFooterStyles()}>
      {props.component.content?.showSocialLinks && (
        <div class={styles.footerSocial} style={{ 'margin-bottom': '20px', 'display': 'flex', 'justify-content': 'center', 'gap': '15px' }}>
          <For each={props.component.content?.socialLinks || []}>
            {(social) => (
              <a
                href={social.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                style={getSocialIconStyles()}
                onClick={(e) => e.preventDefault()}
              >
                {social.icon || '🔗'}
              </a>
            )}
          </For>
        </div>
      )}
      <div class={styles.footerContent}>
        <For each={props.component.content?.textSections || []}>
          {(section) => (
            <div
              class={styles.footerSection}
              style={getTextStyles()}
              innerHTML={section.html || section.plainText || ''}
            />
          )}
        </For>
      </div>
      {props.component.content?.copyrightText && (
        <div class={styles.footerCopyright} style={{ ...getTextStyles(), 'margin-top': '15px' }}>
          {props.component.content.copyrightText}
        </div>
      )}
    </footer>
  );
};

/**
 * Hero component renderer
 */
const HeroRenderer: Component<{ component: HeroComponent }> = (props) => {
  const getHeroStyles = () => {
    const s = props.component.styles || {};
    const isBackground = props.component.content?.layout === 'image-background';

    return {
      'background-color': s.backgroundColor || (isBackground ? 'transparent' : '#ffffff'),
      'background-image': isBackground ? `url(${props.component.content?.image?.src || ''})` : 'none',
      'background-size': 'cover' as const,
      'background-position': 'center' as const,
      'padding': s.padding ? `${s.padding.top?.value || 60}${s.padding.top?.unit || 'px'} ${s.padding.right?.value || 20}${s.padding.right?.unit || 'px'} ${s.padding.bottom?.value || 60}${s.padding.bottom?.unit || 'px'} ${s.padding.left?.value || 20}${s.padding.left?.unit || 'px'}` : '60px 20px',
      'display': 'flex' as const,
      'flex-direction': (props.component.content?.layout === 'image-top' ? 'column' : 'row') as 'column' | 'row',
      'align-items': 'center' as const,
      'gap': '30px',
      'position': 'relative' as const,
      'text-align': (s.contentAlign || 'center') as 'left' | 'center' | 'right',
    };
  };

  const getOverlayStyles = () => {
    const s = props.component.styles || {};
    const isBackground = props.component.content?.layout === 'image-background';

    if (!isBackground) return { display: 'none' as const };

    return {
      'position': 'absolute' as const,
      'top': '0',
      'left': '0',
      'right': '0',
      'bottom': '0',
      'background-color': s.overlayColor || 'rgba(0, 0, 0, 0.5)',
      'opacity': s.overlayOpacity !== undefined ? s.overlayOpacity : 0.5,
    };
  };

  const getHeadingStyles = () => {
    const s = props.component.styles || {};
    return {
      'font-family': s.headingStyles?.fontFamily || 'system-ui, -apple-system, sans-serif',
      'font-size': s.headingStyles?.fontSize ? `${s.headingStyles.fontSize.value}${s.headingStyles.fontSize.unit}` : '36px',
      'font-weight': s.headingStyles?.fontWeight || 700,
      'color': s.headingStyles?.color || '#333333',
      'margin': '0 0 15px 0',
    };
  };

  const getDescriptionStyles = () => {
    const s = props.component.styles || {};
    return {
      'font-family': s.descriptionStyles?.fontFamily || 'system-ui, -apple-system, sans-serif',
      'font-size': s.descriptionStyles?.fontSize ? `${s.descriptionStyles.fontSize.value}${s.descriptionStyles.fontSize.unit}` : '18px',
      'font-weight': s.descriptionStyles?.fontWeight || 400,
      'color': s.descriptionStyles?.color || '#666666',
      'line-height': '1.6',
      'margin': '0 0 25px 0',
    };
  };

  const getButtonStyles = () => {
    return {
      'background-color': '#007bff',
      'color': '#ffffff',
      'padding': '14px 28px',
      'border-radius': '4px',
      'text-decoration': 'none',
      'display': 'inline-block',
      'font-weight': '500',
    };
  };

  return (
    <section class={styles.hero} style={getHeroStyles()}>
      <div style={getOverlayStyles()} />
      <div class={styles.heroContent} style={{ 'position': 'relative', 'z-index': '1', 'max-width': props.component.styles?.contentMaxWidth ? `${props.component.styles.contentMaxWidth.value}${props.component.styles.contentMaxWidth.unit}` : '600px' }}>
        <h1 style={getHeadingStyles()} innerHTML={props.component.content?.heading?.html || props.component.content?.heading?.plainText || 'Hero Heading'} />
        {props.component.content?.description && (
          <p style={getDescriptionStyles()} innerHTML={props.component.content.description.html || props.component.content.description.plainText || ''} />
        )}
        {props.component.content?.showButton && props.component.content?.button && (
          <a
            href={props.component.content.button.link?.href || '#'}
            target={props.component.content.button.link?.target || '_blank'}
            style={getButtonStyles()}
            onClick={(e) => e.preventDefault()}
          >
            {props.component.content.button.text || 'Learn More'}
          </a>
        )}
      </div>
      {props.component.content?.layout !== 'image-background' && props.component.content?.image?.src && (
        <div class={styles.heroImage}>
          <img
            src={props.component.content.image.src}
            alt={props.component.content.image.alt || 'Hero image'}
            style={{ 'max-width': '100%', 'height': 'auto', 'display': 'block' }}
          />
        </div>
      )}
    </section>
  );
};

/**
 * List component renderer
 */
const ListRenderer: Component<{ component: ListComponent }> = (props) => {
  const getListStyles = () => {
    const s = props.component.styles || {};
    const isHorizontal = props.component.content?.orientation === 'horizontal';

    return {
      'background-color': s.backgroundColor || 'transparent',
      'padding': s.padding ? `${s.padding.top?.value || 20}${s.padding.top?.unit || 'px'} ${s.padding.right?.value || 20}${s.padding.right?.unit || 'px'} ${s.padding.bottom?.value || 20}${s.padding.bottom?.unit || 'px'} ${s.padding.left?.value || 20}${s.padding.left?.unit || 'px'}` : '20px',
      'display': (isHorizontal ? 'grid' : 'flex') as 'grid' | 'flex',
      'grid-template-columns': isHorizontal ? `repeat(${props.component.content?.columns || 3}, 1fr)` : 'none',
      'flex-direction': (isHorizontal ? 'row' : 'column') as 'row' | 'column',
      'gap': s.itemGap ? `${s.itemGap.value}${s.itemGap.unit}` : '20px',
    };
  };

  const getItemStyles = () => {
    const s = props.component.styles || {};
    return {
      'background-color': s.itemBackgroundColor || '#ffffff',
      'border': s.itemBorder || '1px solid #e0e0e0',
      'padding': s.itemPadding ? `${s.itemPadding.value}${s.itemPadding.unit}` : '20px',
      'border-radius': '8px',
    };
  };

  const getTitleStyles = () => {
    const s = props.component.styles || {};
    return {
      'font-family': s.titleStyles?.fontFamily || 'system-ui, -apple-system, sans-serif',
      'font-size': s.titleStyles?.fontSize ? `${s.titleStyles.fontSize.value}${s.titleStyles.fontSize.unit}` : '20px',
      'font-weight': s.titleStyles?.fontWeight || 600,
      'color': s.titleStyles?.color || '#333333',
      'margin': '0 0 10px 0',
    };
  };

  const getDescriptionStyles = () => {
    const s = props.component.styles || {};
    return {
      'font-family': s.descriptionStyles?.fontFamily || 'system-ui, -apple-system, sans-serif',
      'font-size': s.descriptionStyles?.fontSize ? `${s.descriptionStyles.fontSize.value}${s.descriptionStyles.fontSize.unit}` : '14px',
      'font-weight': s.descriptionStyles?.fontWeight || 400,
      'color': s.descriptionStyles?.color || '#666666',
      'line-height': '1.5',
      'margin': '0 0 15px 0',
    };
  };

  const getButtonStyles = () => {
    return {
      'background-color': '#007bff',
      'color': '#ffffff',
      'padding': '10px 20px',
      'border-radius': '4px',
      'text-decoration': 'none',
      'display': 'inline-block',
      'font-weight': '500',
    };
  };

  return (
    <div class={styles.list} style={getListStyles()}>
      <For each={props.component.content?.items || []}>
        {(item) => (
          <div class={styles.listItem} style={getItemStyles()}>
            {item.showImage && item.image?.src && (
              <div class={styles.listItemImage} style={{ 'margin-bottom': '15px' }}>
                <img
                  src={item.image.src}
                  alt={item.image.alt || ''}
                  style={{ 'max-width': props.component.styles?.imageMaxWidth ? `${props.component.styles.imageMaxWidth.value}${props.component.styles.imageMaxWidth.unit}` : '100%', 'height': 'auto', 'display': 'block', 'border-radius': '4px' }}
                />
              </div>
            )}
            <h3 style={getTitleStyles()} innerHTML={item.title?.html || item.title?.plainText || 'Item Title'} />
            {item.description && (
              <p style={getDescriptionStyles()} innerHTML={item.description.html || item.description.plainText || ''} />
            )}
            {item.showButton && item.button && (
              <a
                href={item.button.link?.href || '#'}
                target={item.button.link?.target || '_blank'}
                style={getButtonStyles()}
                onClick={(e) => e.preventDefault()}
              >
                {item.button.text || 'Learn More'}
              </a>
            )}
          </div>
        )}
      </For>
    </div>
  );
};

/**
 * CTA (Call to Action) component renderer
 */
const CTARenderer: Component<{ component: CTAComponent }> = (props) => {
  const getCTAStyles = () => {
    const s = props.component.styles || {};
    const layout = props.component.content?.layout || 'centered';

    return {
      'background-color': s.backgroundColor || '#f8f9fa',
      'padding': s.padding ? `${s.padding.top?.value || 60}${s.padding.top?.unit || 'px'} ${s.padding.right?.value || 20}${s.padding.right?.unit || 'px'} ${s.padding.bottom?.value || 60}${s.padding.bottom?.unit || 'px'} ${s.padding.left?.value || 20}${s.padding.left?.unit || 'px'}` : '60px 20px',
      'text-align': (layout === 'centered' ? 'center' : (layout === 'right-aligned' ? 'right' : 'left')) as 'left' | 'center' | 'right',
    };
  };

  const getHeadingStyles = () => {
    const s = props.component.styles || {};
    return {
      'font-family': s.headingStyles?.fontFamily || 'system-ui, -apple-system, sans-serif',
      'font-size': s.headingStyles?.fontSize ? `${s.headingStyles.fontSize.value}${s.headingStyles.fontSize.unit}` : '32px',
      'font-weight': s.headingStyles?.fontWeight || 700,
      'color': s.headingStyles?.color || '#333333',
      'margin': '0 0 15px 0',
    };
  };

  const getDescriptionStyles = () => {
    const s = props.component.styles || {};
    return {
      'font-family': s.descriptionStyles?.fontFamily || 'system-ui, -apple-system, sans-serif',
      'font-size': s.descriptionStyles?.fontSize ? `${s.descriptionStyles.fontSize.value}${s.descriptionStyles.fontSize.unit}` : '18px',
      'font-weight': s.descriptionStyles?.fontWeight || 400,
      'color': s.descriptionStyles?.color || '#666666',
      'line-height': '1.6',
      'margin': '0 0 30px 0',
    };
  };

  const getButtonStyles = (isPrimary: boolean) => {
    return {
      'background-color': isPrimary ? '#007bff' : 'transparent',
      'color': isPrimary ? '#ffffff' : '#007bff',
      'padding': '14px 28px',
      'border': isPrimary ? 'none' : '2px solid #007bff',
      'border-radius': '4px',
      'text-decoration': 'none',
      'display': 'inline-block',
      'font-weight': '500',
      'margin': '0 10px',
    };
  };

  return (
    <section class={styles.cta} style={getCTAStyles()}>
      <div class={styles.ctaContent} style={{ 'max-width': props.component.styles?.contentMaxWidth ? `${props.component.styles.contentMaxWidth.value}${props.component.styles.contentMaxWidth.unit}` : '700px', 'margin': '0 auto' }}>
        <h2 style={getHeadingStyles()} innerHTML={props.component.content?.heading?.html || props.component.content?.heading?.plainText || 'Call to Action'} />
        {props.component.content?.showDescription && props.component.content?.description && (
          <p style={getDescriptionStyles()} innerHTML={props.component.content.description.html || props.component.content.description.plainText || ''} />
        )}
        <div class={styles.ctaButtons} style={{ 'display': 'flex', 'gap': props.component.styles?.buttonGap ? `${props.component.styles.buttonGap.value}${props.component.styles.buttonGap.unit}` : '15px', 'justify-content': 'center', 'flex-wrap': 'wrap' }}>
          {props.component.content?.primaryButton && (
            <a
              href={props.component.content.primaryButton.link?.href || '#'}
              target={props.component.content.primaryButton.link?.target || '_blank'}
              style={getButtonStyles(true)}
              onClick={(e) => e.preventDefault()}
            >
              {props.component.content.primaryButton.text || 'Get Started'}
            </a>
          )}
          {props.component.content?.showSecondaryButton && props.component.content?.secondaryButton && (
            <a
              href={props.component.content.secondaryButton.link?.href || '#'}
              target={props.component.content.secondaryButton.link?.target || '_blank'}
              style={getButtonStyles(false)}
              onClick={(e) => e.preventDefault()}
            >
              {props.component.content.secondaryButton.text || 'Learn More'}
            </a>
          )}
        </div>
      </div>
    </section>
  );
};
