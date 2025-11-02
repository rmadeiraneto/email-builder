/**
 * Template Composer
 *
 * Provides utilities for composing templates with a fluent API
 * and common template patterns
 */

import { CANVAS_DEFAULTS } from '../constants';
import type {
  Template,
  TemplateMetadata,
  TemplateSettings,
  GeneralStyles,
  CanvasDimensions,
  ResponsiveBreakpoints,
  TypographyPreset,
} from '../types/template.types';
import type { BaseComponent } from '../types/component.types';
import type { BuilderTarget } from '../types/config.types';

/**
 * Template composition options
 */
export interface TemplateComposerOptions {
  target: BuilderTarget;
  name: string;
  description?: string;
  author?: string;
  category?: string;
  tags?: string[];
  locale?: string;
  width?: number;
  responsive?: boolean;
}

/**
 * Template Composer
 *
 * Provides a fluent API for building templates programmatically
 *
 * @example
 * ```ts
 * const template = new TemplateComposer({
 *   target: 'email',
 *   name: 'Welcome Email'
 * })
 *   .setCanvasWidth(600)
 *   .setBackgroundColor('#f5f5f5')
 *   .addComponent(headerComponent)
 *   .addComponent(heroComponent)
 *   .build();
 * ```
 */
export class TemplateComposer {
  private template: Partial<Template>;
  private components: BaseComponent[] = [];

  constructor(options: TemplateComposerOptions) {
    const now = Date.now();

    // Initialize metadata
    const metadata: TemplateMetadata = {
      id: this.generateId(),
      name: options.name,
      description: options.description,
      author: options.author,
      category: options.category,
      tags: options.tags,
      version: '1.0.0',
      createdAt: now,
      updatedAt: now,
    };

    // Initialize settings with defaults
    const settings: TemplateSettings = {
      target: options.target,
      canvasDimensions: {
        width: options.width || this.getDefaultWidth(options.target),
        maxWidth: this.getDefaultMaxWidth(options.target),
      },
      breakpoints: this.getDefaultBreakpoints(),
      responsive: options.responsive !== undefined ? options.responsive : true,
      locale: options.locale || 'en-US',
    };

    this.template = {
      metadata,
      settings,
      generalStyles: {},
      components: [],
      dataInjection: {
        enabled: false,
      },
      customData: {},
    };
  }

  /**
   * Set canvas width
   */
  setCanvasWidth(width: number): this {
    if (this.template.settings) {
      this.template.settings.canvasDimensions.width = width;
    }
    return this;
  }

  /**
   * Set canvas max width
   */
  setCanvasMaxWidth(maxWidth: number): this {
    if (this.template.settings) {
      this.template.settings.canvasDimensions.maxWidth = maxWidth;
    }
    return this;
  }

  /**
   * Set canvas background color
   */
  setBackgroundColor(color: string): this {
    if (!this.template.generalStyles) {
      this.template.generalStyles = {};
    }
    this.template.generalStyles.canvasBackgroundColor = color;
    return this;
  }

  /**
   * Set canvas background image
   */
  setBackgroundImage(url: string): this {
    if (!this.template.generalStyles) {
      this.template.generalStyles = {};
    }
    this.template.generalStyles.canvasBackgroundImage = url;
    return this;
  }

  /**
   * Set canvas border
   */
  setCanvasBorder(border: string): this {
    if (!this.template.generalStyles) {
      this.template.generalStyles = {};
    }
    this.template.generalStyles.canvasBorder = border;
    return this;
  }

  /**
   * Set default component background color
   */
  setDefaultComponentBackground(color: string): this {
    if (!this.template.generalStyles) {
      this.template.generalStyles = {};
    }
    this.template.generalStyles.defaultComponentBackgroundColor = color;
    return this;
  }

  /**
   * Set typography preset
   */
  setTypography(
    type: 'body' | 'paragraph' | 'heading1' | 'heading2' | 'heading3' | 'heading4' | 'heading5' | 'heading6',
    preset: TypographyPreset
  ): this {
    if (!this.template.generalStyles) {
      this.template.generalStyles = {};
    }
    if (!this.template.generalStyles.typography) {
      this.template.generalStyles.typography = {};
    }
    this.template.generalStyles.typography[type] = preset;
    return this;
  }

  /**
   * Set responsive breakpoints
   */
  setBreakpoints(breakpoints: ResponsiveBreakpoints): this {
    if (this.template.settings) {
      this.template.settings.breakpoints = breakpoints;
    }
    return this;
  }

  /**
   * Set locale
   */
  setLocale(locale: string): this {
    if (this.template.settings) {
      this.template.settings.locale = locale;
    }
    return this;
  }

  /**
   * Enable RTL
   */
  enableRTL(enabled: boolean = true): this {
    if (this.template.settings) {
      this.template.settings.rtl = enabled;
    }
    return this;
  }

  /**
   * Enable responsive design
   */
  enableResponsive(enabled: boolean = true): this {
    if (this.template.settings) {
      this.template.settings.responsive = enabled;
    }
    return this;
  }

  /**
   * Add component to template
   */
  addComponent(component: BaseComponent): this {
    this.components.push(component);
    return this;
  }

  /**
   * Add multiple components
   */
  addComponents(components: BaseComponent[]): this {
    this.components.push(...components);
    return this;
  }

  /**
   * Set template metadata
   */
  setMetadata(metadata: Partial<Omit<TemplateMetadata, 'id' | 'createdAt' | 'updatedAt'>>): this {
    if (this.template.metadata) {
      this.template.metadata = {
        ...this.template.metadata,
        ...metadata,
      };
    }
    return this;
  }

  /**
   * Set custom data
   */
  setCustomData(key: string, value: unknown): this {
    if (!this.template.customData) {
      this.template.customData = {};
    }
    this.template.customData[key] = value;
    return this;
  }

  /**
   * Enable data injection
   */
  enableDataInjection(enabled: boolean = true): this {
    if (!this.template.dataInjection) {
      this.template.dataInjection = { enabled: false };
    }
    this.template.dataInjection.enabled = enabled;
    return this;
  }

  /**
   * Add data placeholders
   */
  addPlaceholders(placeholders: Record<string, string>): this {
    if (!this.template.dataInjection) {
      this.template.dataInjection = { enabled: false };
    }
    if (!this.template.dataInjection.placeholders) {
      this.template.dataInjection.placeholders = {};
    }
    Object.assign(this.template.dataInjection.placeholders, placeholders);
    return this;
  }

  /**
   * Build the final template
   */
  build(): Template {
    return {
      ...this.template,
      components: this.components,
    } as Template;
  }

  /**
   * Get default canvas width based on target
   */
  private getDefaultWidth(target: BuilderTarget): number {
    switch (target) {
      case 'email':
        return CANVAS_DEFAULTS.EMAIL.WIDTH;
      case 'hybrid':
        return CANVAS_DEFAULTS.HYBRID.WIDTH;
      case 'web':
        return CANVAS_DEFAULTS.WEB.WIDTH;
      default:
        return CANVAS_DEFAULTS.DEFAULT.WIDTH;
    }
  }

  /**
   * Get default max width based on target
   */
  private getDefaultMaxWidth(target: BuilderTarget): number {
    switch (target) {
      case 'email':
        return CANVAS_DEFAULTS.EMAIL.MAX_WIDTH;
      case 'hybrid':
        return CANVAS_DEFAULTS.HYBRID.MAX_WIDTH;
      case 'web':
        return CANVAS_DEFAULTS.WEB.MAX_WIDTH;
      default:
        return CANVAS_DEFAULTS.DEFAULT.MAX_WIDTH;
    }
  }

  /**
   * Get default responsive breakpoints
   */
  private getDefaultBreakpoints(): ResponsiveBreakpoints {
    return {
      mobile: 480,
      tablet: 768,
      desktop: 1024,
    };
  }

  /**
   * Generate unique template ID
   */
  private generateId(): string {
    const uuid = crypto.randomUUID().slice(0, 9);
    return `tpl_${Date.now()}_${uuid}`;
  }
}

/**
 * Factory function for creating templates quickly
 *
 * @example
 * ```ts
 * const template = createTemplate({
 *   target: 'email',
 *   name: 'Newsletter',
 *   components: [header, content, footer]
 * });
 * ```
 */
export function createTemplate(
  options: TemplateComposerOptions & { components?: BaseComponent[] }
): Template {
  const composer = new TemplateComposer(options);

  if (options.components) {
    composer.addComponents(options.components);
  }

  return composer.build();
}

/**
 * Create an empty email template with standard dimensions
 */
export function createEmptyEmailTemplate(name: string): Template {
  return new TemplateComposer({
    target: 'email',
    name,
    width: 600,
    responsive: true,
  })
    .setBackgroundColor('#ffffff')
    .build();
}

/**
 * Create an empty web template
 */
export function createEmptyWebTemplate(name: string): Template {
  return new TemplateComposer({
    target: 'web',
    name,
    width: 1200,
    responsive: true,
  })
    .setBackgroundColor('#ffffff')
    .build();
}

/**
 * Clone a template with a new ID and name
 */
export function cloneTemplate(
  template: Template,
  newName?: string
): Template {
  const now = Date.now();
  const uuid = crypto.randomUUID().slice(0, 9);

  return {
    ...template,
    metadata: {
      ...template.metadata,
      id: `tpl_${Date.now()}_${uuid}`,
      name: newName || `${template.metadata.name} (Copy)`,
      createdAt: now,
      updatedAt: now,
      version: '1.0.0',
    },
  };
}

/**
 * Merge multiple templates into one
 * Components are combined in order
 */
export function mergeTemplates(
  name: string,
  templates: Template[],
  options?: {
    target?: BuilderTarget;
    preferGeneralStyles?: number; // Index of template to prefer for general styles
  }
): Template {
  if (templates.length === 0) {
    throw new Error('At least one template is required to merge');
  }

  const baseTemplate = templates[0];
  const target = options?.target || baseTemplate.settings.target;

  const composer = new TemplateComposer({
    target,
    name,
    width: baseTemplate.settings.canvasDimensions.width,
    responsive: baseTemplate.settings.responsive,
    locale: baseTemplate.settings.locale,
  });

  // Use general styles from preferred template
  const stylesIndex = options?.preferGeneralStyles || 0;
  const preferredTemplate = templates[stylesIndex] || baseTemplate;

  if (preferredTemplate.generalStyles) {
    const { generalStyles } = preferredTemplate;

    if (generalStyles.canvasBackgroundColor) {
      composer.setBackgroundColor(generalStyles.canvasBackgroundColor);
    }

    if (generalStyles.canvasBackgroundImage) {
      composer.setBackgroundImage(generalStyles.canvasBackgroundImage);
    }

    if (generalStyles.canvasBorder) {
      composer.setCanvasBorder(generalStyles.canvasBorder);
    }

    if (generalStyles.defaultComponentBackgroundColor) {
      composer.setDefaultComponentBackground(generalStyles.defaultComponentBackgroundColor);
    }

    if (generalStyles.typography) {
      Object.entries(generalStyles.typography).forEach(([key, value]) => {
        if (value) {
          composer.setTypography(
            key as keyof NonNullable<GeneralStyles['typography']>,
            value
          );
        }
      });
    }
  }

  // Combine all components from all templates
  templates.forEach((template) => {
    composer.addComponents(template.components);
  });

  return composer.build();
}
