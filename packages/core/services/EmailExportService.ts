/**
 * Email Export Service
 *
 * Converts builder HTML to email-safe HTML with:
 * - CSS inlining
 * - Table-based layout conversion
 * - Outlook conditional comments
 * - Email-incompatible CSS removal
 * - Structure optimizations
 */

import type {
  EmailExportOptions,
  EmailExportResult,
  EmailExportWarning,
  CSSRule,
  TableConversionContext,
  CSSCompatibility,
} from './email-export.types';

/**
 * Default export options
 */
const DEFAULT_OPTIONS: Required<EmailExportOptions> = {
  inlineCSS: true,
  useTableLayout: true,
  addOutlookFixes: true,
  removeIncompatibleCSS: true,
  optimizeStructure: true,
  doctype:
    '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">',
  charset: 'utf-8',
  clientOptimizations: {
    gmail: true,
    outlook: true,
    ios: true,
    yahoo: true,
  },
  maxWidth: 600,
  minify: false,
};

/**
 * Email-safe and unsafe CSS properties
 */
const CSS_COMPATIBILITY: CSSCompatibility = {
  safe: [
    'color',
    'background-color',
    'background-image',
    'background-position',
    'background-repeat',
    'border',
    'border-color',
    'border-style',
    'border-width',
    'border-top',
    'border-right',
    'border-bottom',
    'border-left',
    'border-radius',
    'font-family',
    'font-size',
    'font-weight',
    'font-style',
    'line-height',
    'text-align',
    'text-decoration',
    'text-transform',
    'letter-spacing',
    'padding',
    'padding-top',
    'padding-right',
    'padding-bottom',
    'padding-left',
    'margin',
    'margin-top',
    'margin-right',
    'margin-bottom',
    'margin-left',
    'width',
    'height',
    'max-width',
    'max-height',
    'min-width',
    'min-height',
    'vertical-align',
  ],
  unsafe: [
    'display',
    'position',
    'top',
    'right',
    'bottom',
    'left',
    'float',
    'clear',
    'z-index',
    'flex',
    'flex-direction',
    'flex-wrap',
    'justify-content',
    'align-items',
    'align-content',
    'grid',
    'grid-template-columns',
    'grid-template-rows',
    'grid-gap',
    'transform',
    'transition',
    'animation',
    'animation-name',
    'animation-duration',
    'box-shadow',
    'text-shadow',
    'opacity',
  ],
  conditional: ['background-image', 'border-radius'],
};

/**
 * Email Export Service
 *
 * Transforms builder HTML into email-compatible HTML
 */
export class EmailExportService {
  private options: Required<EmailExportOptions>;
  private warnings: EmailExportWarning[] = [];
  private stats = {
    inlinedRules: 0,
    convertedElements: 0,
    removedProperties: 0,
    outputSize: 0,
  };

  /**
   * Creates a new EmailExportService instance
   *
   * @param options - Export configuration options
   */
  constructor(options: EmailExportOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    if (options.clientOptimizations) {
      this.options.clientOptimizations = {
        ...DEFAULT_OPTIONS.clientOptimizations,
        ...options.clientOptimizations,
      };
    }
  }

  /**
   * Export HTML for email clients
   *
   * @param html - Builder HTML to export
   * @returns Email-safe HTML with warnings and stats
   *
   * @example
   * ```ts
   * const service = new EmailExportService();
   * const result = service.export('<div>Hello</div>');
   * console.log(result.html);
   * ```
   */
  public export(html: string): EmailExportResult {
    // Reset state
    this.warnings = [];
    this.stats = {
      inlinedRules: 0,
      convertedElements: 0,
      removedProperties: 0,
      outputSize: 0,
    };

    try {
      let processedHTML = html;

      // Step 1: Parse and extract CSS
      const cssRules = this.options.inlineCSS ? this.extractCSS(processedHTML) : [];

      // Step 2: Inline CSS
      if (this.options.inlineCSS && cssRules.length > 0) {
        processedHTML = this.inlineCSS(processedHTML, cssRules);
      }

      // Step 3: Remove incompatible CSS
      if (this.options.removeIncompatibleCSS) {
        processedHTML = this.removeIncompatibleCSS(processedHTML);
      }

      // Step 4: Convert to table-based layout
      if (this.options.useTableLayout) {
        processedHTML = this.convertToTableLayout(processedHTML);
      }

      // Step 5: Add Outlook fixes
      if (this.options.addOutlookFixes) {
        processedHTML = this.addOutlookFixes(processedHTML);
      }

      // Step 6: Optimize structure
      if (this.options.optimizeStructure) {
        processedHTML = this.optimizeStructure(processedHTML);
      }

      // Step 7: Wrap in email template
      const finalHTML = this.wrapInEmailTemplate(processedHTML);

      // Step 8: Minify if requested
      const output = this.options.minify ? this.minifyHTML(finalHTML) : finalHTML;

      this.stats.outputSize = new Blob([output]).size;

      return {
        html: output,
        warnings: this.warnings,
        stats: this.stats,
      };
    } catch (error) {
      this.addWarning({
        type: 'general',
        message: `Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        severity: 'error',
      });

      return {
        html: '',
        warnings: this.warnings,
        stats: this.stats,
      };
    }
  }

  /**
   * Extract CSS rules from HTML
   */
  private extractCSS(html: string): CSSRule[] {
    const rules: CSSRule[] = [];
    const styleTagRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
    let match;

    while ((match = styleTagRegex.exec(html)) !== null) {
      const cssText = match[1];
      const parsedRules = this.parseCSS(cssText);
      rules.push(...parsedRules);
    }

    return rules;
  }

  /**
   * Parse CSS text into rules
   */
  private parseCSS(cssText: string): CSSRule[] {
    const rules: CSSRule[] = [];

    // Remove comments
    cssText = cssText.replace(/\/\*[\s\S]*?\*\//g, '');

    // Match CSS rules
    const ruleRegex = /([^{]+)\{([^}]+)\}/g;
    let match;

    while ((match = ruleRegex.exec(cssText)) !== null) {
      const selector = match[1].trim();
      const propertiesText = match[2];

      // Skip @media, @keyframes, etc.
      if (selector.startsWith('@')) {
        continue;
      }

      const properties: Record<string, string> = {};
      const propertyRegex = /([^:]+):([^;]+)/g;
      let propMatch;

      while ((propMatch = propertyRegex.exec(propertiesText)) !== null) {
        const property = propMatch[1].trim();
        const value = propMatch[2].trim();
        properties[property] = value;
      }

      rules.push({
        selector,
        properties,
        specificity: this.calculateSpecificity(selector),
      });
    }

    return rules;
  }

  /**
   * Calculate CSS specificity for a selector
   */
  private calculateSpecificity(selector: string): number {
    const idCount = (selector.match(/#/g) || []).length;
    const classCount = (selector.match(/\./g) || []).length;
    const elementCount = selector.split(/[\s>+~]/).filter((s) => s && !s.match(/[#.]/))
      .length;

    return idCount * 100 + classCount * 10 + elementCount;
  }

  /**
   * Inline CSS rules into HTML elements
   */
  private inlineCSS(html: string, rules: CSSRule[]): string {
    // Sort rules by specificity (lowest first)
    const sortedRules = [...rules].sort((a, b) => a.specificity - b.specificity);

    let processedHTML = html;

    // Process simple class selectors
    sortedRules.forEach((rule) => {
      // Only handle simple class selectors for now (e.g., .classname)
      const classMatch = rule.selector.match(/^\.([a-zA-Z0-9_-]+)$/);
      if (classMatch) {
        const className = classMatch[1];
        const styleString = Object.entries(rule.properties)
          .map(([prop, value]) => `${prop}: ${value}`)
          .join('; ');

        // Find all elements with this class
        const classRegex = new RegExp(
          `(<[^>]+class=["'][^"']*\\b${className}\\b[^"']*["'][^>]*)(style=["']([^"']*)["'])?([^>]*>)`,
          'gi'
        );

        processedHTML = processedHTML.replace(classRegex, (match, before, styleAttr, existingStyle, after) => {
          const existingProps = this.parseInlineStyle(existingStyle || '');
          const mergedProps = { ...rule.properties, ...existingProps };
          const newStyle = Object.entries(mergedProps)
            .map(([prop, value]) => `${prop}: ${value}`)
            .join('; ');

          this.stats.inlinedRules++;
          return `${before}style="${newStyle}"${after}`;
        });
      }
    });

    return processedHTML;
  }

  /**
   * Parse inline style attribute into properties object
   */
  private parseInlineStyle(styleText: string): Record<string, string> {
    const properties: Record<string, string> = {};

    if (!styleText) return properties;

    styleText.split(';').forEach((declaration) => {
      const [property, value] = declaration.split(':').map((s) => s.trim());
      if (property && value) {
        properties[property] = value;
      }
    });

    return properties;
  }

  /**
   * Remove email-incompatible CSS properties
   */
  private removeIncompatibleCSS(html: string): string {
    let processedHTML = html;

    // Remove style tags
    processedHTML = processedHTML.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

    // Clean inline styles
    const styleRegex = /(<[^>]+)style=["']([^"']*)["']([^>]*>)/gi;
    processedHTML = processedHTML.replace(styleRegex, (match, before, styleText, after) => {
      const properties = this.parseInlineStyle(styleText);

      // Filter out unsafe properties
      const safeProperties: Record<string, string> = {};
      Object.entries(properties).forEach(([prop, value]) => {
        if (CSS_COMPATIBILITY.unsafe.includes(prop)) {
          this.stats.removedProperties++;
          this.addWarning({
            type: 'incompatible-css',
            message: `Removed unsupported property: ${prop}`,
            context: 'inline-style',
            severity: 'info',
          });
        } else {
          safeProperties[prop] = value;
        }
      });

      const newStyle = Object.entries(safeProperties)
        .map(([prop, value]) => `${prop}: ${value}`)
        .join('; ');

      if (newStyle) {
        return `${before}style="${newStyle}"${after}`;
      } else {
        return `${before}${after}`;
      }
    });

    return processedHTML;
  }

  /**
   * Convert div-based layouts to table-based layouts
   */
  private convertToTableLayout(html: string): string {
    let processedHTML = html;

    // Convert layout divs to tables
    const layoutDivRegex = /<div\s+([^>]*(?:data-layout|class=["'][^"']*(?:container|row|column)[^"']*["'])[^>]*)>([\s\S]*?)<\/div>/gi;

    processedHTML = processedHTML.replace(layoutDivRegex, (match, attributes, content) => {
      // Extract style attribute
      const styleMatch = attributes.match(/style=["']([^"']*)["']/);
      const styleText = styleMatch ? styleMatch[1] : '';
      const properties = this.parseInlineStyle(styleText);

      // Extract context
      const align = this.extractAlign(properties);
      const valign = this.extractVAlign(properties);
      const width = properties.width || this.options.maxWidth.toString();
      const bgcolor = properties['background-color'];

      // Build table
      const tableAttrs = [
        'border="0"',
        'cellpadding="0"',
        'cellspacing="0"',
        'role="presentation"',
      ];

      if (width) {
        tableAttrs.push(`width="${width}"`);
      }

      if (align) {
        tableAttrs.push(`align="${align}"`);
      }

      const tdAttrs: string[] = [];

      if (valign) {
        tdAttrs.push(`valign="${valign}"`);
      }

      if (bgcolor) {
        tdAttrs.push(`bgcolor="${bgcolor}"`);
      }

      if (styleText) {
        tdAttrs.push(`style="${styleText}"`);
      }

      const table = `<table ${tableAttrs.join(' ')}>
<tbody>
<tr>
<td${tdAttrs.length > 0 ? ' ' + tdAttrs.join(' ') : ''}>
${content}
</td>
</tr>
</tbody>
</table>`;

      this.stats.convertedElements++;
      return table;
    });

    return processedHTML;
  }

  /**
   * Extract horizontal alignment from CSS properties
   */
  private extractAlign(
    properties: Record<string, string>
  ): 'left' | 'center' | 'right' | undefined {
    const textAlign = properties['text-align'];
    if (textAlign === 'center' || textAlign === 'left' || textAlign === 'right') {
      return textAlign;
    }
    return undefined;
  }

  /**
   * Extract vertical alignment from CSS properties
   */
  private extractVAlign(
    properties: Record<string, string>
  ): 'top' | 'middle' | 'bottom' | undefined {
    const verticalAlign = properties['vertical-align'];
    if (
      verticalAlign === 'top' ||
      verticalAlign === 'middle' ||
      verticalAlign === 'bottom'
    ) {
      return verticalAlign;
    }
    return undefined;
  }

  /**
   * Add Outlook-specific conditional comments and fixes
   */
  private addOutlookFixes(html: string): string {
    if (!this.options.clientOptimizations.outlook) {
      return html;
    }

    // Wrap content in Outlook-safe table
    const outlookSafeTable = `
<!--[if mso]>
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="${this.options.maxWidth}">
<tr>
<td>
<![endif]-->
${html}
<!--[if mso]>
</td>
</tr>
</table>
<![endif]-->
`;

    return outlookSafeTable.trim();
  }

  /**
   * Optimize email structure with proper DOCTYPE, meta tags, etc.
   */
  private optimizeStructure(html: string): string {
    // This will be applied in wrapInEmailTemplate
    return html;
  }

  /**
   * Wrap content in complete email template
   */
  private wrapInEmailTemplate(bodyContent: string): string {
    const metaTags: string[] = [
      `<meta charset="${this.options.charset}">`,
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
      '<meta http-equiv="X-UA-Compatible" content="IE=edge">',
    ];

    // Add client-specific meta tags
    if (this.options.clientOptimizations.ios) {
      metaTags.push(
        '<meta name="format-detection" content="telephone=no">',
        '<meta name="format-detection" content="date=no">',
        '<meta name="format-detection" content="address=no">',
        '<meta name="format-detection" content="email=no">'
      );
    }

    // Build style tag with resets
    const resetStyles = this.buildResetStyles();

    // Build Outlook conditional comment if needed
    const outlookStyles = this.options.addOutlookFixes && this.options.clientOptimizations.outlook
      ? `<!--[if mso]>
<style type="text/css">
body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
</style>
<![endif]-->
`
      : '';

    const template = `${this.options.doctype}
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
${metaTags.join('\n')}
<title>Email</title>
${outlookStyles}<style type="text/css">
${resetStyles}
</style>
</head>
<body style="margin: 0; padding: 0; width: 100%; background-color: #f4f4f4;">
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
<tr>
<td align="center" style="padding: 20px 0;">
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="${this.options.maxWidth}" style="max-width: ${this.options.maxWidth}px;">
<tr>
<td>
${bodyContent}
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`;

    return template;
  }

  /**
   * Build CSS reset styles for email
   */
  private buildResetStyles(): string {
    const resets: string[] = [
      '/* Email Reset Styles */',
      'body { margin: 0; padding: 0; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }',
      'table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }',
      'img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }',
      'a { text-decoration: none; }',
    ];

    // Gmail-specific resets
    if (this.options.clientOptimizations.gmail) {
      resets.push(
        '.gmail-fix { display: none; display: none !important; }',
        'u + .body a { color: inherit; text-decoration: none; }'
      );
    }

    // iOS-specific resets
    if (this.options.clientOptimizations.ios) {
      resets.push('a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; }');
    }

    return resets.join('\n');
  }

  /**
   * Minify HTML output
   */
  private minifyHTML(html: string): string {
    return html
      .replace(/\n\s+/g, '\n') // Remove leading whitespace
      .replace(/\n+/g, '\n') // Remove multiple newlines
      .replace(/>\s+</g, '><') // Remove whitespace between tags
      .trim();
  }

  /**
   * Add a warning to the warnings array
   */
  private addWarning(warning: EmailExportWarning): void {
    this.warnings.push(warning);
  }
}
