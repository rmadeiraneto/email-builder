/**
 * Mobile Export Service
 *
 * Handles export of templates with mobile dev mode customizations
 *
 * Responsibilities:
 * - Generate HTML/CSS with mobile overrides
 * - Create media queries for mobile styles
 * - Handle component visibility (display: none)
 * - Generate component order via HTML structure
 * - Support multiple export modes (hybrid, web, email-only)
 * - Email client compatibility (Outlook 2016-2021)
 *
 * @module mobile
 */

import type { Template, BaseComponent, BaseStyles } from '../types';
import type { ModeManager } from './ModeManager';
import type { MobileLayoutManager } from './MobileLayoutManager';
import type { MobileDevModeConfig } from './mobile.types';

/**
 * Export mode
 */
export enum ExportMode {
  /**
   * Hybrid: Desktop inline + mobile media queries
   * Best for email clients (Outlook sees desktop, modern clients see responsive)
   */
  HYBRID = 'hybrid',

  /**
   * Web: Modern CSS with media queries
   * Best for web-only usage
   */
  WEB = 'web',

  /**
   * Email-only: Desktop only, no responsive
   * For clients that don't support media queries
   */
  EMAIL_ONLY = 'email-only',
}

/**
 * Export options
 */
export interface MobileExportOptions {
  /**
   * Export mode
   */
  mode: ExportMode;

  /**
   * Mobile breakpoint for media queries
   */
  mobileBreakpoint: number;

  /**
   * Inline desktop styles
   */
  inlineStyles: boolean;

  /**
   * Generate media queries
   */
  generateMediaQueries: boolean;

  /**
   * Minify CSS
   */
  minifyCss: boolean;

  /**
   * Include comments in output
   */
  includeComments: boolean;
}

/**
 * Export result
 */
export interface MobileExportResult {
  /**
   * Generated HTML
   */
  html: string;

  /**
   * Generated CSS (if not inlined)
   */
  css?: string;

  /**
   * Inline styles (if inlined)
   */
  inlineStyles: Record<string, string>;

  /**
   * Media queries
   */
  mediaQueries: string;

  /**
   * Export mode used
   */
  mode: ExportMode;

  /**
   * Export statistics
   */
  stats: {
    componentsExported: number;
    mobileOverrides: number;
    mediaQueryRules: number;
    visibilityRules: number;
  };
}

/**
 * CSS rule
 */
interface CSSRule {
  selector: string;
  properties: Record<string, string>;
}

/**
 * Mobile Export Service Options
 */
export interface MobileExportServiceOptions {
  /**
   * Mode manager instance
   */
  modeManager: ModeManager;

  /**
   * Layout manager instance
   */
  layoutManager: MobileLayoutManager;

  /**
   * Mobile dev mode configuration
   */
  config: MobileDevModeConfig;
}

/**
 * Mobile Export Service
 *
 * Exports templates with mobile dev mode customizations
 */
export class MobileExportService {
  private layoutManager: MobileLayoutManager;
  private config: MobileDevModeConfig;

  constructor(options: MobileExportServiceOptions) {
    // modeManager is available in options but not currently used
    this.layoutManager = options.layoutManager;
    this.config = options.config;
  }

  /**
   * Export template with mobile customizations
   *
   * @param template - Template to export
   * @param options - Export options
   */
  public exportTemplate(
    template: Template,
    options?: Partial<MobileExportOptions>
  ): MobileExportResult {
    const exportOptions = this.getExportOptions(options);

    // Generate component HTML with proper ordering
    const componentsHtml = this.generateComponentsHtml(template, exportOptions);

    // Generate media queries for mobile overrides
    const mediaQueries = exportOptions.generateMediaQueries
      ? this.generateMediaQueries(template, exportOptions)
      : '';

    // Generate inline styles map
    const inlineStyles = exportOptions.inlineStyles
      ? this.generateInlineStyles(template)
      : {};

    // Combine into final HTML
    const html = this.generateFinalHtml(template, componentsHtml, mediaQueries, exportOptions);

    // Calculate statistics
    const stats = this.calculateStats(template);

    const result: MobileExportResult = {
      html,
      inlineStyles,
      mediaQueries,
      mode: exportOptions.mode,
      stats,
    };

    if (!exportOptions.inlineStyles) {
      result.css = this.generateCssFile(template, exportOptions);
    }

    return result;
  }

  /**
   * Generate components HTML with mobile ordering
   */
  private generateComponentsHtml(
    template: Template,
    options: MobileExportOptions
  ): string {
    const topLevelComponents = template.components.filter((c) => !c.parentId);
    const mobileOrder = this.layoutManager.getLayoutItems().map((item) => item.id);

    // Use mobile order for HTML structure
    const orderedComponents = mobileOrder
      .map((id) => topLevelComponents.find((c) => c.id === id))
      .filter((c): c is BaseComponent => c !== undefined);

    return orderedComponents
      .map((component) => this.generateComponentHtml(component, template, options))
      .join('\n');
  }

  /**
   * Generate HTML for a single component
   */
  private generateComponentHtml(
    component: BaseComponent,
    template: Template,
    options: MobileExportOptions
  ): string {
    // Get desktop styles
    const desktopStyles = this.stylesToCss(component.styles);

    // Add visibility classes
    const visibilityClasses = this.getVisibilityClasses(component);

    // Generate component HTML
    const styleAttr = options.inlineStyles ? ` style="${desktopStyles}"` : '';
    const classAttr = visibilityClasses.length > 0 ? ` class="${visibilityClasses.join(' ')}"` : '';

    return `<div id="${component.id}" data-component-type="${component.type}"${classAttr}${styleAttr}>
  ${this.generateComponentContent(component, template, options)}
</div>`;
  }

  /**
   * Generate component content
   */
  private generateComponentContent(
    component: BaseComponent,
    template: Template,
    options: MobileExportOptions
  ): string {
    // This is a simplified version - actual implementation would render based on component type
    const content = 'content' in component ? component.content : {};

    if (component.type === 'text' && (content as any).text) {
      return (content as any).text;
    }

    if (component.type === 'button' && (content as any).text) {
      return `<a href="${(content as any).url || '#'}">${(content as any).text}</a>`;
    }

    if (component.type === 'image' && (content as any).imageUrl) {
      return `<img src="${(content as any).imageUrl}" alt="${(content as any).altText || ''}" />`;
    }

    // Default: render children
    if ('children' in component && Array.isArray((component as any).children)) {
      const childIds = (component as any).children as string[];
      return childIds
        .map((childId) => {
          const child = template.components.find((c) => c.id === childId);
          return child ? this.generateComponentHtml(child, template, options) : '';
        })
        .join('\n');
    }

    return '';
  }

  /**
   * Generate media queries for mobile overrides
   */
  private generateMediaQueries(
    template: Template,
    options: MobileExportOptions
  ): string {
    const breakpoint = options.mobileBreakpoint;
    const rules: CSSRule[] = [];

    // Generate rules for each component with mobile overrides
    for (const component of template.components) {
      if (component.mobileStyles) {
        const selector = `#${component.id}`;
        const properties = this.stylesToCssObject(component.mobileStyles);
        rules.push({ selector, properties });
      }

      // Add visibility rules
      const visibilityRule = this.generateVisibilityRule(component, breakpoint);
      if (visibilityRule) {
        rules.push(visibilityRule);
      }
    }

    // Generate media query block
    if (rules.length === 0) {
      return '';
    }

    const cssRules = rules.map((rule) => {
      const props = Object.entries(rule.properties)
        .map(([key, value]) => `  ${key}: ${value};`)
        .join('\n');
      return `${rule.selector} {\n${props}\n}`;
    }).join('\n\n');

    return `
@media only screen and (max-width: ${breakpoint}px) {
${cssRules}
}`;
  }

  /**
   * Generate visibility rule for component
   */
  private generateVisibilityRule(
    component: BaseComponent,
    _breakpoint: number
  ): CSSRule | null {
    if (!component.visibility) {
      return null;
    }

    const visibleOnDesktop = component.visibility.desktop;
    const visibleOnMobile = component.visibility.mobile ?? visibleOnDesktop;

    // Only generate rule if visibility differs
    if (visibleOnDesktop === visibleOnMobile) {
      return null;
    }

    const selector = `#${component.id}`;
    const properties: Record<string, string> = {};

    if (visibleOnMobile === false) {
      properties['display'] = 'none !important';
    } else {
      // Component hidden on desktop, visible on mobile
      properties['display'] = 'block';
    }

    return { selector, properties };
  }

  /**
   * Get visibility CSS classes for component
   */
  private getVisibilityClasses(component: BaseComponent): string[] {
    const classes: string[] = [];

    if (!component.visibility) {
      return classes;
    }

    const visibleOnDesktop = component.visibility.desktop;
    const visibleOnMobile = component.visibility.mobile ?? visibleOnDesktop;

    if (!visibleOnDesktop) {
      classes.push('hide-desktop');
    }

    if (!visibleOnMobile) {
      classes.push('hide-mobile');
    }

    return classes;
  }

  /**
   * Generate inline styles map
   */
  private generateInlineStyles(template: Template): Record<string, string> {
    const inlineStyles: Record<string, string> = {};

    for (const component of template.components) {
      const styles = this.stylesToCss(component.styles);
      inlineStyles[component.id] = styles;
    }

    return inlineStyles;
  }

  /**
   * Generate final HTML document
   */
  private generateFinalHtml(
    template: Template,
    componentsHtml: string,
    mediaQueries: string,
    _options: MobileExportOptions
  ): string {
    const hasMediaQueries = mediaQueries.trim().length > 0;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${(template as any).name || 'Email Template'}</title>
  ${hasMediaQueries ? `<style>${mediaQueries}</style>` : ''}
</head>
<body>
  <div class="email-container">
${componentsHtml}
  </div>
</body>
</html>`;
  }

  /**
   * Generate standalone CSS file
   */
  private generateCssFile(
    template: Template,
    options: MobileExportOptions
  ): string {
    let css = '';

    // Desktop styles
    for (const component of template.components) {
      const selector = `#${component.id}`;
      const properties = this.stylesToCssObject(component.styles);
      const props = Object.entries(properties)
        .map(([key, value]) => `  ${key}: ${value};`)
        .join('\n');
      css += `${selector} {\n${props}\n}\n\n`;
    }

    // Media queries
    if (options.generateMediaQueries) {
      css += this.generateMediaQueries(template, options);
    }

    return css;
  }

  /**
   * Convert styles object to CSS string
   */
  private stylesToCss(styles: BaseStyles): string {
    return Object.entries(styles)
      .map(([key, value]) => `${this.camelToKebab(key)}: ${value}`)
      .join('; ');
  }

  /**
   * Convert styles object to CSS object
   */
  private stylesToCssObject(styles: Partial<BaseStyles>): Record<string, string> {
    const result: Record<string, string> = {};

    for (const [key, value] of Object.entries(styles)) {
      if (value !== undefined) {
        result[this.camelToKebab(key)] = String(value);
      }
    }

    return result;
  }

  /**
   * Convert camelCase to kebab-case
   */
  private camelToKebab(str: string): string {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  }

  /**
   * Calculate export statistics
   */
  private calculateStats(template: Template): {
    componentsExported: number;
    mobileOverrides: number;
    mediaQueryRules: number;
    visibilityRules: number;
  } {
    let mobileOverrides = 0;
    let visibilityRules = 0;

    for (const component of template.components) {
      if (component.mobileStyles && Object.keys(component.mobileStyles).length > 0) {
        mobileOverrides++;
      }

      if (component.visibility) {
        const visibleOnDesktop = component.visibility.desktop;
        const visibleOnMobile = component.visibility.mobile ?? visibleOnDesktop;
        if (visibleOnDesktop !== visibleOnMobile) {
          visibilityRules++;
        }
      }
    }

    return {
      componentsExported: template.components.length,
      mobileOverrides,
      mediaQueryRules: mobileOverrides,
      visibilityRules,
    };
  }

  /**
   * Get export options with defaults
   */
  private getExportOptions(options?: Partial<MobileExportOptions>): MobileExportOptions {
    const configDefaults = this.config.export;

    return {
      mode: options?.mode || (configDefaults.defaultMode as ExportMode) || ExportMode.HYBRID,
      mobileBreakpoint: options?.mobileBreakpoint || configDefaults.mobileBreakpoint || 768,
      inlineStyles: options?.inlineStyles ?? configDefaults.inlineStyles ?? true,
      generateMediaQueries: options?.generateMediaQueries ?? configDefaults.generateMediaQueries ?? true,
      minifyCss: options?.minifyCss ?? false,
      includeComments: options?.includeComments ?? false,
    };
  }
}
