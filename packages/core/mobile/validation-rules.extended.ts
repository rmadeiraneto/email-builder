/**
 * Extended Validation Rules for Mobile Development Mode
 *
 * Additional specialized validation rules beyond the defaults
 */

import type { Template, ValidationRule, ValidationIssue } from '../types';
import { DeviceMode } from './mobile.types';

/**
 * Extended validation rules for specific use cases
 */
export const EXTENDED_VALIDATION_RULES: ValidationRule[] = [
  // ============================================================================
  // Email Client Specific Rules
  // ============================================================================

  {
    id: 'gmail-specific-width',
    name: 'Gmail Width Recommendation',
    description: 'Gmail works best with max-width instead of fixed width',
    severity: 'info',
    validate: (template: Template, mode: DeviceMode) => {
      const issues: ValidationIssue[] = [];

      for (const component of template.components) {
        const styles = component.mobileStyles || component.styles;

        if (styles.width && !styles.maxWidth) {
          const widthValue = String(styles.width);

          if (widthValue.includes('px') || widthValue.includes('%')) {
            issues.push({
              ruleId: 'gmail-specific-width',
              componentId: component.id,
              message: 'Consider using max-width instead of width for better Gmail compatibility',
              severity: 'info',
              propertyPath: 'styles.maxWidth',
              suggestion: `Add maxWidth: ${styles.width}`,
              fixable: true,
            });
          }
        }
      }

      return issues;
    },
  },

  {
    id: 'outlook-table-layout',
    name: 'Outlook Table Layout',
    description: 'Outlook 2016-2021 requires table-based layouts for reliability',
    severity: 'warning',
    validate: (template: Template, mode: DeviceMode) => {
      const issues: ValidationIssue[] = [];

      for (const component of template.components) {
        const styles = component.mobileStyles || component.styles;

        if (styles.display === 'flex' || styles.display === 'grid') {
          issues.push({
            ruleId: 'outlook-table-layout',
            componentId: component.id,
            message: `${styles.display} is not supported in Outlook 2016-2021`,
            severity: 'warning',
            propertyPath: 'styles.display',
            suggestion: 'Consider using table-based layout for Outlook compatibility',
            fixable: false,
          });
        }
      }

      return issues;
    },
  },

  {
    id: 'outlook-css-unsupported',
    name: 'Outlook Unsupported CSS',
    description: 'Detect CSS properties not supported by Outlook',
    severity: 'warning',
    validate: (template: Template, mode: DeviceMode) => {
      const issues: ValidationIssue[] = [];
      const unsupportedProperties = [
        'background-size',
        'box-shadow',
        'border-radius',
        'opacity',
        'transform',
        'transition',
      ];

      for (const component of template.components) {
        const styles = component.mobileStyles || component.styles;

        for (const prop of unsupportedProperties) {
          const camelCaseProp = prop.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

          if ((styles as any)[camelCaseProp] !== undefined) {
            issues.push({
              ruleId: 'outlook-css-unsupported',
              componentId: component.id,
              message: `${prop} is not supported in Outlook 2016-2021`,
              severity: 'warning',
              propertyPath: `styles.${camelCaseProp}`,
              suggestion: 'This property will be ignored in Outlook',
              fixable: false,
            });
          }
        }
      }

      return issues;
    },
  },

  // ============================================================================
  // Accessibility Rules
  // ============================================================================

  {
    id: 'color-contrast',
    name: 'Color Contrast',
    description: 'Ensure sufficient color contrast for readability',
    severity: 'warning',
    validate: (template: Template, mode: DeviceMode) => {
      const issues: ValidationIssue[] = [];

      // This is a simplified version - full implementation would use WCAG contrast ratio
      for (const component of template.components) {
        const styles = component.mobileStyles || component.styles;

        if (styles.color && styles.backgroundColor) {
          // Simplified check: warn if both are light or both are dark
          const colorIsLight = isLightColor(styles.color);
          const bgIsLight = isLightColor(styles.backgroundColor);

          if (colorIsLight === bgIsLight) {
            issues.push({
              ruleId: 'color-contrast',
              componentId: component.id,
              message: 'Low color contrast may affect readability',
              severity: 'warning',
              propertyPath: 'styles.color',
              suggestion: 'Ensure sufficient contrast between text and background',
              fixable: false,
            });
          }
        }
      }

      return issues;
    },
  },

  {
    id: 'alt-text-required',
    name: 'Alt Text Required',
    description: 'Images should have alt text for accessibility',
    severity: 'warning',
    validate: (template: Template, mode: DeviceMode) => {
      const issues: ValidationIssue[] = [];

      for (const component of template.components) {
        if (component.type === 'image') {
          const content = 'content' in component ? (component.content as any) : {};

          if (!content.altText || content.altText.trim() === '') {
            issues.push({
              ruleId: 'alt-text-required',
              componentId: component.id,
              message: 'Image is missing alt text for accessibility',
              severity: 'warning',
              propertyPath: 'content.altText',
              suggestion: 'Add descriptive alt text for screen readers',
              fixable: false,
            });
          }
        }
      }

      return issues;
    },
  },

  // ============================================================================
  // Mobile-Specific Best Practices
  // ============================================================================

  {
    id: 'mobile-tap-spacing',
    name: 'Mobile Tap Spacing',
    description: 'Interactive elements should have adequate spacing on mobile',
    severity: 'info',
    validate: (template: Template, mode: DeviceMode) => {
      const issues: ValidationIssue[] = [];
      const minSpacing = 8; // Minimum 8px between tappable elements

      const interactiveTypes = ['button', 'link', 'cta'];
      const interactiveComponents = template.components.filter((c) =>
        interactiveTypes.includes(c.type)
      );

      for (let i = 0; i < interactiveComponents.length - 1; i++) {
        const current = interactiveComponents[i];
        const next = interactiveComponents[i + 1];

        const currentStyles = current.mobileStyles || current.styles;
        const marginBottom = parseInt(String(currentStyles.marginBottom || '0'));
        const nextMarginTop = parseInt(String((next.mobileStyles || next.styles).marginTop || '0'));

        const totalSpacing = marginBottom + nextMarginTop;

        if (totalSpacing < minSpacing) {
          issues.push({
            ruleId: 'mobile-tap-spacing',
            componentId: current.id,
            message: `Insufficient spacing (${totalSpacing}px) between interactive elements`,
            severity: 'info',
            propertyPath: 'styles.marginBottom',
            suggestion: `Add at least ${minSpacing}px spacing`,
            fixable: true,
          });
        }
      }

      return issues;
    },
  },

  {
    id: 'mobile-text-size-adjust',
    name: 'Mobile Text Size Adjust',
    description: 'Prevent automatic text size adjustment on mobile',
    severity: 'info',
    validate: (template: Template, mode: DeviceMode) => {
      const issues: ValidationIssue[] = [];

      // Check if template has text-size-adjust set
      const hasTextSizeAdjust = template.components.some((c) => {
        const styles = c.mobileStyles || c.styles;
        return (styles as any).textSizeAdjust !== undefined;
      });

      if (!hasTextSizeAdjust && mode === DeviceMode.MOBILE) {
        issues.push({
          ruleId: 'mobile-text-size-adjust',
          message: 'Consider adding text-size-adjust: 100% to prevent automatic scaling',
          severity: 'info',
          suggestion: 'Add textSizeAdjust: "100%" to body or container styles',
          fixable: false,
        });
      }

      return issues;
    },
  },

  {
    id: 'mobile-horizontal-scroll',
    name: 'Mobile Horizontal Scroll',
    description: 'Prevent horizontal scrolling on mobile',
    severity: 'warning',
    validate: (template: Template, mode: DeviceMode) => {
      const issues: ValidationIssue[] = [];
      const mobileViewportWidth = 375; // Typical mobile width

      for (const component of template.components) {
        const styles = component.mobileStyles || component.styles;
        const width = parseInt(String(styles.width || '0'));
        const minWidth = parseInt(String(styles.minWidth || '0'));

        if ((width > 0 && width > mobileViewportWidth) || minWidth > mobileViewportWidth) {
          issues.push({
            ruleId: 'mobile-horizontal-scroll',
            componentId: component.id,
            message: 'Component may cause horizontal scrolling on mobile',
            severity: 'warning',
            propertyPath: width > 0 ? 'styles.width' : 'styles.minWidth',
            suggestion: 'Use max-width: 100% or percentage widths',
            fixable: true,
          });
        }
      }

      return issues;
    },
  },

  // ============================================================================
  // Performance Rules
  // ============================================================================

  {
    id: 'large-image-size',
    name: 'Large Image Size',
    description: 'Large images should be optimized for mobile',
    severity: 'warning',
    validate: (template: Template, mode: DeviceMode) => {
      const issues: ValidationIssue[] = [];

      for (const component of template.components) {
        if (component.type === 'image') {
          const content = 'content' in component ? (component.content as any) : {};
          const styles = component.mobileStyles || component.styles;

          const width = parseInt(String(styles.width || '600'));

          // If desktop width > 600px, suggest mobile optimization
          if (width > 600 && mode === DeviceMode.MOBILE) {
            issues.push({
              ruleId: 'large-image-size',
              componentId: component.id,
              message: 'Large image may be slow to load on mobile',
              severity: 'warning',
              propertyPath: 'content.imageUrl',
              suggestion: 'Consider using responsive images or smaller mobile version',
              fixable: false,
            });
          }
        }
      }

      return issues;
    },
  },

  {
    id: 'excessive-components',
    name: 'Excessive Components',
    description: 'Too many components may impact performance',
    severity: 'info',
    validate: (template: Template, mode: DeviceMode) => {
      const issues: ValidationIssue[] = [];
      const maxRecommended = 50;

      if (template.components.length > maxRecommended) {
        issues.push({
          ruleId: 'excessive-components',
          message: `Template has ${template.components.length} components (recommended: <${maxRecommended})`,
          severity: 'info',
          suggestion: 'Consider simplifying template or using component groups',
          fixable: false,
        });
      }

      return issues;
    },
  },

  // ============================================================================
  // Content Rules
  // ============================================================================

  {
    id: 'empty-content',
    name: 'Empty Content',
    description: 'Components should have content',
    severity: 'warning',
    validate: (template: Template, mode: DeviceMode) => {
      const issues: ValidationIssue[] = [];

      for (const component of template.components) {
        if ('content' in component) {
          const content = component.content as any;

          if (component.type === 'text' && (!content.text || content.text.trim() === '')) {
            issues.push({
              ruleId: 'empty-content',
              componentId: component.id,
              message: 'Text component is empty',
              severity: 'warning',
              propertyPath: 'content.text',
              suggestion: 'Add content or remove component',
              fixable: false,
            });
          }

          if (component.type === 'button' && (!content.text || content.text.trim() === '')) {
            issues.push({
              ruleId: 'empty-content',
              componentId: component.id,
              message: 'Button has no label text',
              severity: 'warning',
              propertyPath: 'content.text',
              suggestion: 'Add button label for clarity',
              fixable: false,
            });
          }
        }
      }

      return issues;
    },
  },

  {
    id: 'broken-links',
    name: 'Broken Links',
    description: 'Validate link URLs',
    severity: 'warning',
    validate: (template: Template, mode: DeviceMode) => {
      const issues: ValidationIssue[] = [];

      for (const component of template.components) {
        if (component.type === 'link' || component.type === 'button') {
          const content = 'content' in component ? (component.content as any) : {};

          if (content.url) {
            // Basic URL validation
            if (!isValidUrl(content.url)) {
              issues.push({
                ruleId: 'broken-links',
                componentId: component.id,
                message: 'Invalid or incomplete URL',
                severity: 'warning',
                propertyPath: 'content.url',
                suggestion: 'Check URL format (should start with http:// or https://)',
                fixable: false,
              });
            }
          } else {
            issues.push({
              ruleId: 'broken-links',
              componentId: component.id,
              message: 'Link/button is missing URL',
              severity: 'warning',
              propertyPath: 'content.url',
              suggestion: 'Add target URL',
              fixable: false,
            });
          }
        }
      }

      return issues;
    },
  },
];

// ============================================================================
// Helper Functions
// ============================================================================

function isLightColor(color: string): boolean {
  // Simplified color brightness check
  // Full implementation would parse hex/rgb and calculate luminance

  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    const rgb = parseInt(hex, 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luma > 128;
  }

  // Fallback for named colors
  const lightColors = ['white', 'lightgray', 'silver', 'yellow', 'lime', 'cyan', 'pink'];
  return lightColors.some((lc) => color.toLowerCase().includes(lc));
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Register all extended rules with validation service
 */
export function registerExtendedRules(validationService: any): void {
  for (const rule of EXTENDED_VALIDATION_RULES) {
    validationService.registerRule(rule);
  }
}
