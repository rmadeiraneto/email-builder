/**
 * Property Mapping Registry
 *
 * Maps component properties to their visual feedback behavior.
 * Provides default mappings for all base and email components.
 *
 * @module visual-feedback
 */

import type {
  PropertyType,
  PropertyVisualMapping,
  ComponentPropertyMappings,
  VisualTarget,
} from './visual-feedback.types';

/**
 * Property Mapping Registry
 *
 * Manages mappings between property paths and their visual feedback behavior.
 * Provides default mappings for standard components and allows custom overrides.
 */
export class PropertyMappingRegistry {
  private mappings: Map<string, Map<string, PropertyVisualMapping>>;

  constructor() {
    this.mappings = new Map();
    this.initializeDefaultMappings();
  }

  /**
   * Get mapping for a specific property
   */
  getMapping(componentType: string, propertyPath: string): PropertyVisualMapping | null {
    const componentMappings = this.mappings.get(componentType);
    if (!componentMappings) {
      // Try generic mappings
      return this.mappings.get('*')?.get(propertyPath) || null;
    }

    return componentMappings.get(propertyPath) || this.mappings.get('*')?.get(propertyPath) || null;
  }

  /**
   * Check if mapping exists for a property
   */
  hasMapping(componentType: string, propertyPath: string): boolean {
    return this.getMapping(componentType, propertyPath) !== null;
  }

  /**
   * Register a custom mapping
   */
  registerMapping(componentType: string, mapping: PropertyVisualMapping): void {
    if (!this.mappings.has(componentType)) {
      this.mappings.set(componentType, new Map());
    }

    this.mappings.get(componentType)!.set(mapping.propertyPath, mapping);
  }

  /**
   * Register multiple mappings for a component
   */
  registerComponentMappings(componentMappings: ComponentPropertyMappings): void {
    const mappingsMap = new Map<string, PropertyVisualMapping>();

    Object.values(componentMappings.mappings).forEach((mapping) => {
      mappingsMap.set(mapping.propertyPath, mapping);
    });

    this.mappings.set(componentMappings.componentType, mappingsMap);
  }

  /**
   * Get property type from property path
   */
  getPropertyType(propertyPath: string): PropertyType {
    // Spacing properties
    if (propertyPath.includes('padding') || propertyPath.includes('margin') || propertyPath.includes('gap')) {
      return 'spacing';
    }

    // Size properties
    if (propertyPath.includes('width') || propertyPath.includes('height')) {
      return 'size';
    }

    // Color properties
    if (propertyPath.includes('color') || propertyPath.includes('Color')) {
      return 'color';
    }

    // Border properties
    if (propertyPath.includes('border') || propertyPath.includes('radius')) {
      return 'border';
    }

    // Typography properties
    if (
      propertyPath.includes('font') ||
      propertyPath.includes('lineHeight') ||
      propertyPath.includes('letterSpacing') ||
      propertyPath.includes('textAlign')
    ) {
      return 'typography';
    }

    // Effect properties
    if (propertyPath.includes('opacity') || propertyPath.includes('shadow')) {
      return 'effect';
    }

    // Position properties
    if (propertyPath.match(/\b(top|left|right|bottom)\b/)) {
      return 'position';
    }

    // Content properties
    if (
      propertyPath.includes('text') ||
      propertyPath.includes('alt') ||
      propertyPath.includes('url') ||
      propertyPath.includes('href')
    ) {
      return 'content';
    }

    // Layout properties
    if (propertyPath.includes('layout') || propertyPath.includes('display') || propertyPath.includes('flex')) {
      return 'layout';
    }

    return 'default';
  }

  /**
   * Get all mappings for a component type
   */
  getComponentMappings(componentType: string): Map<string, PropertyVisualMapping> {
    return this.mappings.get(componentType) || new Map();
  }

  /**
   * Get all registered component types
   */
  getRegisteredComponentTypes(): string[] {
    return Array.from(this.mappings.keys()).filter((key) => key !== '*');
  }

  /**
   * Initialize default mappings for all standard components
   */
  private initializeDefaultMappings(): void {
    // Generic mappings that apply to all components
    this.registerGenericMappings();

    // Base components
    this.registerButtonMappings();
    this.registerTextMappings();
    this.registerImageMappings();
    this.registerSeparatorMappings();
    this.registerSpacerMappings();

    // Email components
    this.registerHeaderMappings();
    this.registerFooterMappings();
    this.registerHeroMappings();
    this.registerListMappings();
    this.registerCTAMappings();
  }

  /**
   * Register generic mappings that apply to all components
   */
  private registerGenericMappings(): void {
    const genericMappings: PropertyVisualMapping[] = [
      // Spacing
      this.createMapping('styles.padding', 'spacing', { region: 'padding', measurementType: 'both' }),
      this.createMapping('styles.paddingTop', 'spacing', { region: 'padding', measurementType: 'vertical' }),
      this.createMapping('styles.paddingRight', 'spacing', { region: 'padding', measurementType: 'horizontal' }),
      this.createMapping('styles.paddingBottom', 'spacing', { region: 'padding', measurementType: 'vertical' }),
      this.createMapping('styles.paddingLeft', 'spacing', { region: 'padding', measurementType: 'horizontal' }),

      this.createMapping('styles.margin', 'spacing', { region: 'margin', measurementType: 'both' }),
      this.createMapping('styles.marginTop', 'spacing', { region: 'margin', measurementType: 'vertical' }),
      this.createMapping('styles.marginRight', 'spacing', { region: 'margin', measurementType: 'horizontal' }),
      this.createMapping('styles.marginBottom', 'spacing', { region: 'margin', measurementType: 'vertical' }),
      this.createMapping('styles.marginLeft', 'spacing', { region: 'margin', measurementType: 'horizontal' }),

      // Colors
      this.createMapping('styles.backgroundColor', 'color', { region: 'content' }),
      this.createMapping('styles.color', 'color', { region: 'content' }),

      // Borders
      this.createMapping('styles.borderWidth', 'border', { region: 'border', measurementType: 'both' }),
      this.createMapping('styles.borderRadius', 'border', { region: 'border' }),
      this.createMapping('styles.borderColor', 'color', { region: 'border' }),
      this.createMapping('styles.borderStyle', 'border', { region: 'border' }),

      // Size
      this.createMapping('styles.width', 'size', { measurementType: 'horizontal' }),
      this.createMapping('styles.height', 'size', { measurementType: 'vertical' }),
      this.createMapping('styles.maxWidth', 'size', { measurementType: 'horizontal' }),
      this.createMapping('styles.maxHeight', 'size', { measurementType: 'vertical' }),
      this.createMapping('styles.minWidth', 'size', { measurementType: 'horizontal' }),
      this.createMapping('styles.minHeight', 'size', { measurementType: 'vertical' }),

      // Typography
      this.createMapping('styles.fontSize', 'typography', { region: 'content' }),
      this.createMapping('styles.fontWeight', 'typography', { region: 'content' }),
      this.createMapping('styles.lineHeight', 'typography', { region: 'content' }),
      this.createMapping('styles.letterSpacing', 'typography', { region: 'content' }),
      this.createMapping('styles.textAlign', 'typography', { region: 'content' }),
      this.createMapping('styles.fontFamily', 'typography', { region: 'content' }),

      // Effects
      this.createMapping('styles.opacity', 'effect', { region: 'all' }),
      this.createMapping('styles.boxShadow', 'effect', { region: 'all' }),
      this.createMapping('styles.textShadow', 'effect', { region: 'content' }),
    ];

    const genericMap = new Map<string, PropertyVisualMapping>();
    genericMappings.forEach((mapping) => {
      genericMap.set(mapping.propertyPath, mapping);
    });

    this.mappings.set('*', genericMap);
  }

  /**
   * Register Button component mappings
   */
  private registerButtonMappings(): void {
    this.registerComponentMappings({
      componentType: 'button',
      mappings: {
        'content.text': this.createMapping('content.text', 'content', {
          region: 'content',
          description: 'Button text content',
        }),
        'content.url': this.createMapping('content.url', 'content', {
          region: 'content',
          description: 'Button link URL',
        }),
        'styles.hoverBackgroundColor': this.createMapping('styles.hoverBackgroundColor', 'color', {
          region: 'content',
          description: 'Button hover background color',
        }),
        'styles.hoverColor': this.createMapping('styles.hoverColor', 'color', {
          region: 'content',
          description: 'Button hover text color',
        }),
      },
    });
  }

  /**
   * Register Text component mappings
   */
  private registerTextMappings(): void {
    this.registerComponentMappings({
      componentType: 'text',
      mappings: {
        'content.html': this.createMapping('content.html', 'content', {
          region: 'content',
          description: 'Text HTML content',
        }),
        'content.plainText': this.createMapping('content.plainText', 'content', {
          region: 'content',
          description: 'Text plain content',
        }),
      },
    });
  }

  /**
   * Register Image component mappings
   */
  private registerImageMappings(): void {
    this.registerComponentMappings({
      componentType: 'image',
      mappings: {
        'content.src': this.createMapping('content.src', 'content', {
          region: 'content',
          description: 'Image source URL',
        }),
        'content.alt': this.createMapping('content.alt', 'content', {
          region: 'content',
          description: 'Image alt text',
        }),
        'styles.objectFit': this.createMapping('styles.objectFit', 'layout', {
          region: 'content',
          description: 'Image object fit',
        }),
      },
    });
  }

  /**
   * Register Separator component mappings
   */
  private registerSeparatorMappings(): void {
    this.registerComponentMappings({
      componentType: 'separator',
      mappings: {
        'styles.borderTopWidth': this.createMapping('styles.borderTopWidth', 'border', {
          region: 'border',
          measurementType: 'horizontal',
          description: 'Separator line thickness',
        }),
      },
    });
  }

  /**
   * Register Spacer component mappings
   */
  private registerSpacerMappings(): void {
    this.registerComponentMappings({
      componentType: 'spacer',
      mappings: {
        'styles.height': this.createMapping('styles.height', 'size', {
          measurementType: 'vertical',
          description: 'Spacer height',
        }),
      },
    });
  }

  /**
   * Register Header component mappings
   */
  private registerHeaderMappings(): void {
    this.registerComponentMappings({
      componentType: 'header',
      mappings: {
        'content.logoSrc': this.createMapping('content.logoSrc', 'content', {
          region: 'content',
          description: 'Header logo image',
        }),
        'content.logoAlt': this.createMapping('content.logoAlt', 'content', {
          region: 'content',
          description: 'Header logo alt text',
        }),
        'styles.logoSize': this.createMapping('styles.logoSize', 'size', {
          measurementType: 'both',
          description: 'Header logo size',
        }),
        'styles.gap': this.createMapping('styles.gap', 'spacing', {
          region: 'content',
          measurementType: 'horizontal',
          description: 'Gap between logo and navigation',
        }),
        'styles.navigationGap': this.createMapping('styles.navigationGap', 'spacing', {
          region: 'content',
          measurementType: 'horizontal',
          description: 'Gap between navigation items',
        }),
        'content.layout': this.createMapping('content.layout', 'layout', {
          region: 'content',
          description: 'Header layout type',
        }),
      },
    });
  }

  /**
   * Register Footer component mappings
   */
  private registerFooterMappings(): void {
    this.registerComponentMappings({
      componentType: 'footer',
      mappings: {
        'content.text': this.createMapping('content.text', 'content', {
          region: 'content',
          description: 'Footer text content',
        }),
        'styles.socialIconSize': this.createMapping('styles.socialIconSize', 'size', {
          measurementType: 'both',
          description: 'Social media icon size',
        }),
        'styles.socialIconGap': this.createMapping('styles.socialIconGap', 'spacing', {
          region: 'content',
          measurementType: 'horizontal',
          description: 'Gap between social icons',
        }),
        'styles.socialIconColor': this.createMapping('styles.socialIconColor', 'color', {
          region: 'content',
          description: 'Social icon color',
        }),
        'styles.socialIconHoverColor': this.createMapping('styles.socialIconHoverColor', 'color', {
          region: 'content',
          description: 'Social icon hover color',
        }),
        'styles.sectionGap': this.createMapping('styles.sectionGap', 'spacing', {
          region: 'content',
          measurementType: 'vertical',
          description: 'Gap between footer sections',
        }),
      },
    });
  }

  /**
   * Register Hero component mappings
   */
  private registerHeroMappings(): void {
    this.registerComponentMappings({
      componentType: 'hero',
      mappings: {
        'content.imageSrc': this.createMapping('content.imageSrc', 'content', {
          region: 'content',
          description: 'Hero image source',
        }),
        'content.imageAlt': this.createMapping('content.imageAlt', 'content', {
          region: 'content',
          description: 'Hero image alt text',
        }),
        'content.headline': this.createMapping('content.headline', 'content', {
          region: 'content',
          description: 'Hero headline text',
        }),
        'content.subheadline': this.createMapping('content.subheadline', 'content', {
          region: 'content',
          description: 'Hero subheadline text',
        }),
        'content.buttonText': this.createMapping('content.buttonText', 'content', {
          region: 'content',
          description: 'Hero button text',
        }),
        'content.buttonUrl': this.createMapping('content.buttonUrl', 'content', {
          region: 'content',
          description: 'Hero button URL',
        }),
        'styles.imageHeight': this.createMapping('styles.imageHeight', 'size', {
          measurementType: 'vertical',
          description: 'Hero image height',
        }),
        'styles.buttonGap': this.createMapping('styles.buttonGap', 'spacing', {
          region: 'content',
          measurementType: 'vertical',
          description: 'Gap between text and button',
        }),
        'content.imagePosition': this.createMapping('content.imagePosition', 'layout', {
          region: 'content',
          description: 'Hero image position',
        }),
      },
    });
  }

  /**
   * Register List component mappings
   */
  private registerListMappings(): void {
    this.registerComponentMappings({
      componentType: 'list',
      mappings: {
        'styles.itemGap': this.createMapping('styles.itemGap', 'spacing', {
          region: 'content',
          measurementType: 'vertical',
          description: 'Gap between list items',
        }),
        'styles.itemPadding': this.createMapping('styles.itemPadding', 'spacing', {
          region: 'padding',
          measurementType: 'both',
          description: 'Padding inside list items',
        }),
        'styles.imageMaxWidth': this.createMapping('styles.imageMaxWidth', 'size', {
          measurementType: 'horizontal',
          description: 'Maximum width for list item images',
        }),
        'styles.imageMaxHeight': this.createMapping('styles.imageMaxHeight', 'size', {
          measurementType: 'vertical',
          description: 'Maximum height for list item images',
        }),
        'content.layout': this.createMapping('content.layout', 'layout', {
          region: 'content',
          description: 'List layout type (vertical/horizontal)',
        }),
        'content.itemLayout': this.createMapping('content.itemLayout', 'layout', {
          region: 'content',
          description: 'List item layout',
        }),
      },
    });
  }

  /**
   * Register CTA (Call to Action) component mappings
   */
  private registerCTAMappings(): void {
    this.registerComponentMappings({
      componentType: 'cta',
      mappings: {
        'content.headline': this.createMapping('content.headline', 'content', {
          region: 'content',
          description: 'CTA headline text',
        }),
        'content.text': this.createMapping('content.text', 'content', {
          region: 'content',
          description: 'CTA body text',
        }),
        'content.buttonText': this.createMapping('content.buttonText', 'content', {
          region: 'content',
          description: 'CTA button text',
        }),
        'content.buttonUrl': this.createMapping('content.buttonUrl', 'content', {
          region: 'content',
          description: 'CTA button URL',
        }),
        'styles.buttonGap': this.createMapping('styles.buttonGap', 'spacing', {
          region: 'content',
          measurementType: 'vertical',
          description: 'Gap between text and button',
        }),
      },
    });
  }

  /**
   * Helper to create a mapping object
   */
  private createMapping(
    propertyPath: string,
    type: PropertyType,
    options: Partial<VisualTarget> & { description?: string } = {}
  ): PropertyVisualMapping {
    const { description, ...visualTargetOptions } = options;

    const mapping: PropertyVisualMapping = {
      propertyPath,
      visualTarget: {
        type,
        ...visualTargetOptions,
      },
    };

    if (description !== undefined) {
      mapping.description = description;
    }

    return mapping;
  }
}

/**
 * Singleton instance of the property mapping registry
 */
let registryInstance: PropertyMappingRegistry | null = null;

/**
 * Get the global property mapping registry instance
 */
export function getPropertyMappingRegistry(): PropertyMappingRegistry {
  if (!registryInstance) {
    registryInstance = new PropertyMappingRegistry();
  }
  return registryInstance;
}

/**
 * Reset the global registry instance (mainly for testing)
 */
export function resetPropertyMappingRegistry(): void {
  registryInstance = null;
}
