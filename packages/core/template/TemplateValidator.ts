/**
 * Template Validator
 *
 * Validates template structure, components, and email compatibility
 */

import { EMAIL_CONSTRAINTS } from '../constants';
import type {
  Template,
  TemplateValidationResult,
} from '../types/template.types';
import type { BaseComponent, ValidationResult } from '../types/component.types';
import type { ComponentRegistry } from '../components/ComponentRegistry';
import { ComponentTreeBuilder } from './ComponentTreeBuilder';

/**
 * Template Validator Service
 *
 * Provides comprehensive validation for templates including:
 * - Metadata validation
 * - Settings validation
 * - Component validation
 * - Tree structure validation
 * - Email compatibility checks (for email/hybrid targets)
 */
export class TemplateValidator {
  private registry: ComponentRegistry;
  private treeBuilder: ComponentTreeBuilder;

  constructor(registry: ComponentRegistry) {
    this.registry = registry;
    this.treeBuilder = new ComponentTreeBuilder();
  }

  /**
   * Validate complete template
   *
   * @param template - Template to validate
   * @returns Validation result with errors and warnings
   */
  validate(template: Template): TemplateValidationResult {
    const errors: TemplateValidationResult['errors'] = [];
    const compatibilityWarnings: TemplateValidationResult['compatibilityWarnings'] = [];

    // 1. Validate metadata
    this.validateMetadata(template, errors);

    // 2. Validate settings
    this.validateSettings(template, errors);

    // 3. Validate general styles
    this.validateGeneralStyles(template, errors);

    // 4. Validate components
    this.validateComponents(template, errors);

    // 5. Validate component tree (if present)
    if (template.componentTree) {
      this.validateComponentTree(template, errors);
    }

    // 6. Validate data injection config (if present)
    if (template.dataInjection) {
      this.validateDataInjection(template, errors);
    }

    // 7. Email compatibility checks (for email/hybrid targets)
    if (template.settings.target === 'email' || template.settings.target === 'hybrid') {
      this.checkEmailCompatibility(template, compatibilityWarnings);
    }

    return {
      valid: errors.filter((e) => e.severity === 'error').length === 0,
      errors,
      compatibilityWarnings,
    };
  }

  /**
   * Validate template metadata
   */
  private validateMetadata(
    template: Template,
    errors: TemplateValidationResult['errors']
  ): void {
    const { metadata } = template;

    if (!metadata.id || metadata.id.trim() === '') {
      errors.push({
        field: 'metadata.id',
        message: 'Template ID is required',
        severity: 'error',
      });
    }

    if (!metadata.name || metadata.name.trim() === '') {
      errors.push({
        field: 'metadata.name',
        message: 'Template name is required',
        severity: 'error',
      });
    }

    if (!metadata.version || metadata.version.trim() === '') {
      errors.push({
        field: 'metadata.version',
        message: 'Template version is required',
        severity: 'error',
      });
    } else if (!/^\d+\.\d+\.\d+$/.test(metadata.version)) {
      errors.push({
        field: 'metadata.version',
        message: 'Template version must follow semantic versioning (e.g., 1.0.0)',
        severity: 'warning',
      });
    }

    if (!metadata.createdAt || metadata.createdAt <= 0) {
      errors.push({
        field: 'metadata.createdAt',
        message: 'Template createdAt timestamp is required',
        severity: 'error',
      });
    }

    if (!metadata.updatedAt || metadata.updatedAt <= 0) {
      errors.push({
        field: 'metadata.updatedAt',
        message: 'Template updatedAt timestamp is required',
        severity: 'error',
      });
    }

    if (metadata.createdAt > metadata.updatedAt) {
      errors.push({
        field: 'metadata.updatedAt',
        message: 'Template updatedAt cannot be earlier than createdAt',
        severity: 'error',
      });
    }
  }

  /**
   * Validate template settings
   */
  private validateSettings(
    template: Template,
    errors: TemplateValidationResult['errors']
  ): void {
    const { settings } = template;

    // Validate target
    if (!['web', 'email', 'hybrid'].includes(settings.target)) {
      errors.push({
        field: 'settings.target',
        message: `Invalid target: ${settings.target}. Must be 'web', 'email', or 'hybrid'`,
        severity: 'error',
      });
    }

    // Validate canvas dimensions
    if (!settings.canvasDimensions) {
      errors.push({
        field: 'settings.canvasDimensions',
        message: 'Canvas dimensions are required',
        severity: 'error',
      });
    } else {
      if (!settings.canvasDimensions.width || settings.canvasDimensions.width <= 0) {
        errors.push({
          field: 'settings.canvasDimensions.width',
          message: 'Canvas width must be greater than 0',
          severity: 'error',
        });
      }

      // Email templates should have standard widths
      if (settings.target === 'email' && settings.canvasDimensions.width > EMAIL_CONSTRAINTS.MAX_WIDTH_WARNING) {
        errors.push({
          field: 'settings.canvasDimensions.width',
          message: `Email canvas width should not exceed ${EMAIL_CONSTRAINTS.MAX_WIDTH_WARNING}px for better compatibility`,
          severity: 'warning',
        });
      }
    }

    // Validate breakpoints
    if (!settings.breakpoints) {
      errors.push({
        field: 'settings.breakpoints',
        message: 'Responsive breakpoints are required',
        severity: 'error',
      });
    } else {
      if (settings.breakpoints.mobile >= settings.breakpoints.tablet) {
        errors.push({
          field: 'settings.breakpoints',
          message: 'Mobile breakpoint must be less than tablet breakpoint',
          severity: 'error',
        });
      }
      if (settings.breakpoints.tablet >= settings.breakpoints.desktop) {
        errors.push({
          field: 'settings.breakpoints',
          message: 'Tablet breakpoint must be less than desktop breakpoint',
          severity: 'error',
        });
      }
    }

    // Validate locale
    if (!settings.locale || settings.locale.trim() === '') {
      errors.push({
        field: 'settings.locale',
        message: 'Locale is required',
        severity: 'error',
      });
    } else if (!/^[a-z]{2}(-[A-Z]{2})?$/.test(settings.locale)) {
      errors.push({
        field: 'settings.locale',
        message: 'Locale must follow BCP 47 format (e.g., en-US, fr, pt-BR)',
        severity: 'warning',
      });
    }
  }

  /**
   * Validate general styles
   */
  private validateGeneralStyles(
    template: Template,
    errors: TemplateValidationResult['errors']
  ): void {
    const { generalStyles } = template;

    // Validate colors are valid hex/rgb/rgba
    const colorFields = [
      'canvasBackgroundColor',
      'defaultComponentBackgroundColor',
    ] as const;

    colorFields.forEach((field) => {
      const color = generalStyles[field];
      if (color && !this.isValidColor(color)) {
        errors.push({
          field: `generalStyles.${field}`,
          message: `Invalid color format: ${color}`,
          severity: 'warning',
        });
      }
    });
  }

  /**
   * Validate components
   */
  private validateComponents(
    template: Template,
    errors: TemplateValidationResult['errors']
  ): void {
    if (!template.components || template.components.length === 0) {
      errors.push({
        field: 'components',
        message: 'Template must have at least one component',
        severity: 'warning',
      });
      return;
    }

    const componentIds = new Set<string>();

    template.components.forEach((component) => {
      // Check for duplicate IDs
      if (componentIds.has(component.id)) {
        errors.push({
          componentId: component.id,
          message: `Duplicate component ID: ${component.id}`,
          severity: 'error',
        });
      }
      componentIds.add(component.id);

      // Validate component using registry
      try {
        const result = this.registry.validate(component);
        if (!result.valid) {
          result.errors?.forEach((error) => {
            errors.push({
              componentId: component.id,
              message: error,
              severity: 'error',
            });
          });
          result.warnings?.forEach((warning) => {
            errors.push({
              componentId: component.id,
              message: warning,
              severity: 'warning',
            });
          });
        }
      } catch (error) {
        errors.push({
          componentId: component.id,
          message: `Component validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          severity: 'error',
        });
      }

      // Validate parent-child relationships
      if (component.parentId) {
        if (!componentIds.has(component.parentId)) {
          errors.push({
            componentId: component.id,
            message: `Component references non-existent parent: ${component.parentId}`,
            severity: 'error',
          });
        }
      }
    });
  }

  /**
   * Validate component tree structure
   */
  private validateComponentTree(
    template: Template,
    errors: TemplateValidationResult['errors']
  ): void {
    if (!template.componentTree || template.componentTree.length === 0) {
      return;
    }

    // Validate tree structure
    const treeValidation = this.treeBuilder.validateTree(template.componentTree);
    if (!treeValidation.valid) {
      treeValidation.errors.forEach((error) => {
        errors.push({
          field: 'componentTree',
          message: error,
          severity: 'error',
        });
      });
    }

    // Ensure tree components match flat component array
    const treeComponents = this.treeBuilder.flattenTree(template.componentTree);
    const componentIds = new Set(template.components.map((c) => c.id));
    const treeComponentIds = new Set(treeComponents.map((c) => c.id));

    if (componentIds.size !== treeComponentIds.size) {
      errors.push({
        field: 'componentTree',
        message: 'Component tree does not match flat components array',
        severity: 'error',
      });
    }

    // Check for missing components
    treeComponentIds.forEach((id) => {
      if (!componentIds.has(id)) {
        errors.push({
          field: 'componentTree',
          componentId: id,
          message: `Component in tree not found in components array: ${id}`,
          severity: 'error',
        });
      }
    });

    componentIds.forEach((id) => {
      if (!treeComponentIds.has(id)) {
        errors.push({
          field: 'componentTree',
          componentId: id,
          message: `Component in array not found in tree: ${id}`,
          severity: 'error',
        });
      }
    });
  }

  /**
   * Validate data injection configuration
   */
  private validateDataInjection(
    template: Template,
    errors: TemplateValidationResult['errors']
  ): void {
    const { dataInjection } = template;

    if (!dataInjection) {
      return;
    }

    if (dataInjection.enabled && dataInjection.placeholders) {
      // Check if placeholders are actually used in components
      const placeholderKeys = Object.keys(dataInjection.placeholders);
      const usedPlaceholders = new Set<string>();

      // Search component content for placeholder usage
      template.components.forEach((component) => {
        const contentStr = JSON.stringify(component.content);
        placeholderKeys.forEach((key) => {
          if (contentStr.includes(`{{${key}}}`)) {
            usedPlaceholders.add(key);
          }
        });
      });

      // Warn about unused placeholders
      placeholderKeys.forEach((key) => {
        if (!usedPlaceholders.has(key)) {
          errors.push({
            field: 'dataInjection.placeholders',
            message: `Placeholder '${key}' is defined but not used in any component`,
            severity: 'warning',
          });
        }
      });
    }
  }

  /**
   * Check email compatibility
   */
  private checkEmailCompatibility(
    template: Template,
    warnings: NonNullable<TemplateValidationResult['compatibilityWarnings']>
  ): void {
    template.components.forEach((component) => {
      // Check for unsupported CSS features
      if (component.styles.customStyles) {
        const unsupportedProps = [
          'flexbox',
          'grid',
          'position: fixed',
          'position: sticky',
        ];

        const customStylesStr = JSON.stringify(component.styles.customStyles);
        unsupportedProps.forEach((prop) => {
          if (customStylesStr.toLowerCase().includes(prop.toLowerCase())) {
            warnings.push({
              componentId: component.id,
              feature: prop,
              message: `CSS feature '${prop}' has limited email client support`,
              suggestion: 'Use table-based layouts for better compatibility',
            });
          }
        });
      }

      // Check for background images
      if (component.styles.backgroundImage) {
        warnings.push({
          componentId: component.id,
          feature: 'background-image',
          message: 'Background images have limited support in email clients',
          suggestion: 'Consider using <img> tags with proper fallbacks',
        });
      }

      // Check for complex borders
      if (component.styles.border?.style && component.styles.border.style !== 'solid') {
        warnings.push({
          componentId: component.id,
          feature: `border-style: ${component.styles.border.style}`,
          message: `Border style '${component.styles.border.style}' may not render consistently`,
          suggestion: 'Use solid borders for better compatibility',
        });
      }
    });

    // Check for responsive design with email target
    if (template.settings.responsive && template.settings.target === 'email') {
      warnings.push({
        componentId: '',
        feature: 'responsive-design',
        message: 'Responsive design in emails requires careful testing across email clients',
        suggestion: 'Test with major email clients (Gmail, Outlook, Apple Mail)',
      });
    }
  }

  /**
   * Validate color format
   */
  private isValidColor(color: string): boolean {
    // Hex color
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
      return true;
    }

    // RGB/RGBA
    if (/^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+\s*)?\)$/.test(color)) {
      return true;
    }

    // Named colors (basic check)
    const namedColors = [
      'black',
      'white',
      'red',
      'blue',
      'green',
      'yellow',
      'gray',
      'transparent',
    ];
    if (namedColors.includes(color.toLowerCase())) {
      return true;
    }

    return false;
  }
}
