/**
 * Template Constraints & Policies
 *
 * Defines validation rules, constraints, and policies for templates
 */

import { EMAIL_CONSTRAINTS } from '../constants';
import type { Template } from '../types/template.types';

/**
 * Constraint severity levels
 */
export enum ConstraintSeverity {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

/**
 * Constraint violation
 */
export interface ConstraintViolation {
  constraintId: string;
  severity: ConstraintSeverity;
  message: string;
  componentId?: string;
  field?: string;
  suggestion?: string;
}

/**
 * Constraint validation result
 */
export interface ConstraintValidationResult {
  valid: boolean;
  violations: ConstraintViolation[];
}

/**
 * Template constraint interface
 */
export interface TemplateConstraint {
  id: string;
  name: string;
  description: string;
  severity: ConstraintSeverity;
  enabled: boolean;
  validate: (template: Template) => ConstraintViolation[];
}

/**
 * Template Policy
 *
 * A collection of constraints that can be applied together
 */
export interface TemplatePolicy {
  id: string;
  name: string;
  description: string;
  constraints: TemplateConstraint[];
}

/**
 * Template Constraints Manager
 *
 * Manages and applies constraints to templates
 */
export class TemplateConstraintsManager {
  private constraints: Map<string, TemplateConstraint> = new Map();
  private policies: Map<string, TemplatePolicy> = new Map();

  /**
   * Register a constraint
   */
  registerConstraint(constraint: TemplateConstraint): void {
    this.constraints.set(constraint.id, constraint);
  }

  /**
   * Register multiple constraints
   */
  registerConstraints(constraints: TemplateConstraint[]): void {
    constraints.forEach((constraint) => this.registerConstraint(constraint));
  }

  /**
   * Register a policy
   */
  registerPolicy(policy: TemplatePolicy): void {
    this.policies.set(policy.id, policy);
  }

  /**
   * Get constraint by ID
   */
  getConstraint(id: string): TemplateConstraint | undefined {
    return this.constraints.get(id);
  }

  /**
   * Get policy by ID
   */
  getPolicy(id: string): TemplatePolicy | undefined {
    return this.policies.get(id);
  }

  /**
   * Validate template against specific constraints
   */
  validateConstraints(
    template: Template,
    constraintIds: string[]
  ): ConstraintValidationResult {
    const violations: ConstraintViolation[] = [];

    constraintIds.forEach((id) => {
      const constraint = this.constraints.get(id);
      if (constraint && constraint.enabled) {
        const constraintViolations = constraint.validate(template);
        violations.push(...constraintViolations);
      }
    });

    return {
      valid: violations.filter((v) => v.severity === ConstraintSeverity.ERROR).length === 0,
      violations,
    };
  }

  /**
   * Validate template against a policy
   */
  validatePolicy(template: Template, policyId: string): ConstraintValidationResult {
    const policy = this.policies.get(policyId);
    if (!policy) {
      throw new Error(`Policy not found: ${policyId}`);
    }

    const violations: ConstraintViolation[] = [];

    policy.constraints.forEach((constraint) => {
      if (constraint.enabled) {
        const constraintViolations = constraint.validate(template);
        violations.push(...constraintViolations);
      }
    });

    return {
      valid: violations.filter((v) => v.severity === ConstraintSeverity.ERROR).length === 0,
      violations,
    };
  }

  /**
   * Validate template against all enabled constraints
   */
  validateAll(template: Template): ConstraintValidationResult {
    const violations: ConstraintViolation[] = [];

    this.constraints.forEach((constraint) => {
      if (constraint.enabled) {
        const constraintViolations = constraint.validate(template);
        violations.push(...constraintViolations);
      }
    });

    return {
      valid: violations.filter((v) => v.severity === ConstraintSeverity.ERROR).length === 0,
      violations,
    };
  }

  /**
   * Enable/disable a constraint
   */
  setConstraintEnabled(id: string, enabled: boolean): void {
    const constraint = this.constraints.get(id);
    if (constraint) {
      constraint.enabled = enabled;
    }
  }

  /**
   * Get all constraints
   */
  getAllConstraints(): TemplateConstraint[] {
    return Array.from(this.constraints.values());
  }

  /**
   * Get all policies
   */
  getAllPolicies(): TemplatePolicy[] {
    return Array.from(this.policies.values());
  }
}

// =============================================================================
// BUILT-IN CONSTRAINTS
// =============================================================================

/**
 * Performance Constraint: Maximum component limit
 */
export const maxComponentsConstraint: TemplateConstraint = {
  id: 'max-components',
  name: 'Maximum Components',
  description: 'Ensures template does not exceed maximum component count',
  severity: ConstraintSeverity.ERROR,
  enabled: true,
  validate: (template: Template): ConstraintViolation[] => {
    const maxComponents = 100;
    const violations: ConstraintViolation[] = [];

    if (template.components.length > maxComponents) {
      violations.push({
        constraintId: 'max-components',
        severity: ConstraintSeverity.ERROR,
        message: `Template has ${template.components.length} components, exceeding the maximum of ${maxComponents}`,
        suggestion: 'Consider breaking the template into multiple smaller templates',
      });
    }

    return violations;
  },
};

/**
 * Performance Constraint: Maximum nesting depth
 */
export const maxNestingDepthConstraint: TemplateConstraint = {
  id: 'max-nesting-depth',
  name: 'Maximum Nesting Depth',
  description: 'Ensures components are not nested too deeply',
  severity: ConstraintSeverity.WARNING,
  enabled: true,
  validate: (template: Template): ConstraintViolation[] => {
    const maxDepth = 5;
    const violations: ConstraintViolation[] = [];

    if (template.componentTree) {
      const checkDepth = (depth: number, componentId: string): void => {
        if (depth > maxDepth) {
          violations.push({
            constraintId: 'max-nesting-depth',
            severity: ConstraintSeverity.WARNING,
            message: `Component is nested ${depth} levels deep, exceeding recommended maximum of ${maxDepth}`,
            componentId,
            suggestion: 'Consider flattening the component structure',
          });
        }
      };

      template.componentTree.forEach((node) => {
        const traverse = (n: typeof node, depth: number): void => {
          checkDepth(depth, n.component.id);
          n.children.forEach((child) => traverse(child, depth + 1));
        };
        traverse(node, node.depth);
      });
    }

    return violations;
  },
};

/**
 * Accessibility Constraint: Image alt text
 */
export const imageAltTextConstraint: TemplateConstraint = {
  id: 'image-alt-text',
  name: 'Image Alt Text',
  description: 'Ensures all images have alt text for accessibility',
  severity: ConstraintSeverity.WARNING,
  enabled: true,
  validate: (template: Template): ConstraintViolation[] => {
    const violations: ConstraintViolation[] = [];

    template.components.forEach((component) => {
      if (component.type === 'image') {
        const alt = (component.content as { alt?: string }).alt;
        if (!alt || alt.trim() === '') {
          violations.push({
            constraintId: 'image-alt-text',
            severity: ConstraintSeverity.WARNING,
            message: 'Image component missing alt text',
            componentId: component.id,
            suggestion: 'Add descriptive alt text for screen readers',
          });
        }
      }
    });

    return violations;
  },
};

/**
 * Accessibility Constraint: Link text
 */
export const linkTextConstraint: TemplateConstraint = {
  id: 'link-text',
  name: 'Link Text',
  description: 'Ensures links have descriptive text',
  severity: ConstraintSeverity.WARNING,
  enabled: true,
  validate: (template: Template): ConstraintViolation[] => {
    const violations: ConstraintViolation[] = [];
    const genericLinkText = ['click here', 'read more', 'here', 'link'];

    template.components.forEach((component) => {
      if (component.type === 'button') {
        const text = (component.content as { text?: string }).text;
        if (text && genericLinkText.includes(text.toLowerCase().trim())) {
          violations.push({
            constraintId: 'link-text',
            severity: ConstraintSeverity.WARNING,
            message: `Link has generic text: "${text}"`,
            componentId: component.id,
            suggestion: 'Use more descriptive link text that explains the destination',
          });
        }
      }
    });

    return violations;
  },
};

/**
 * Accessibility Constraint: Color contrast
 */
export const colorContrastConstraint: TemplateConstraint = {
  id: 'color-contrast',
  name: 'Color Contrast',
  description: 'Checks for sufficient color contrast (basic check)',
  severity: ConstraintSeverity.INFO,
  enabled: true,
  validate: (template: Template): ConstraintViolation[] => {
    const violations: ConstraintViolation[] = [];

    // This is a simplified check - a full implementation would calculate WCAG contrast ratios
    template.components.forEach((component) => {
      const bgColor = component.styles.backgroundColor;
      const textColor = (component.content as { color?: string }).color;

      if (bgColor && textColor) {
        // Simplified check: warn about light-on-light or dark-on-dark
        const isLightBg = bgColor.toLowerCase().includes('fff') || bgColor.toLowerCase().includes('white');
        const isLightText = textColor.toLowerCase().includes('fff') || textColor.toLowerCase().includes('white');
        const isDarkBg = bgColor.toLowerCase().includes('000') || bgColor.toLowerCase().includes('black');
        const isDarkText = textColor.toLowerCase().includes('000') || textColor.toLowerCase().includes('black');

        if ((isLightBg && isLightText) || (isDarkBg && isDarkText)) {
          violations.push({
            constraintId: 'color-contrast',
            severity: ConstraintSeverity.INFO,
            message: 'Potential low color contrast detected',
            componentId: component.id,
            suggestion: 'Verify that text has sufficient contrast with background (WCAG AA: 4.5:1)',
          });
        }
      }
    });

    return violations;
  },
};

/**
 * Email Constraint: Total width for email clients
 */
export const emailWidthConstraint: TemplateConstraint = {
  id: 'email-width',
  name: 'Email Width Limit',
  description: 'Ensures email templates are not too wide for email clients',
  severity: ConstraintSeverity.ERROR,
  enabled: true,
  validate: (template: Template): ConstraintViolation[] => {
    const violations: ConstraintViolation[] = [];

    if (template.settings.target === 'email' || template.settings.target === 'hybrid') {
      const maxWidth = EMAIL_CONSTRAINTS.MAX_WIDTH_WARNING;
      const currentWidth = template.settings.canvasDimensions.width;

      if (currentWidth > maxWidth) {
        violations.push({
          constraintId: 'email-width',
          severity: ConstraintSeverity.ERROR,
          message: `Email template width (${currentWidth}px) exceeds recommended maximum of ${maxWidth}px`,
          field: 'settings.canvasDimensions.width',
          suggestion: `Reduce canvas width to ${maxWidth}px or less for better email client compatibility`,
        });
      }
    }

    return violations;
  },
};

/**
 * Content Constraint: Minimum components
 */
export const minComponentsConstraint: TemplateConstraint = {
  id: 'min-components',
  name: 'Minimum Components',
  description: 'Ensures template has minimum required components',
  severity: ConstraintSeverity.WARNING,
  enabled: true,
  validate: (template: Template): ConstraintViolation[] => {
    const violations: ConstraintViolation[] = [];
    const minComponents = 1;

    if (template.components.length < minComponents) {
      violations.push({
        constraintId: 'min-components',
        severity: ConstraintSeverity.WARNING,
        message: `Template has only ${template.components.length} component(s)`,
        suggestion: 'Add more components to create a complete template',
      });
    }

    return violations;
  },
};

// =============================================================================
// BUILT-IN POLICIES
// =============================================================================

/**
 * Email Best Practices Policy
 */
export const emailBestPracticesPolicy: TemplatePolicy = {
  id: 'email-best-practices',
  name: 'Email Best Practices',
  description: 'Standard constraints for email templates',
  constraints: [
    emailWidthConstraint,
    imageAltTextConstraint,
    linkTextConstraint,
    maxComponentsConstraint,
  ],
};

/**
 * Accessibility Policy (WCAG Level A)
 */
export const accessibilityPolicyA: TemplatePolicy = {
  id: 'accessibility-a',
  name: 'Accessibility Level A',
  description: 'WCAG 2.1 Level A accessibility requirements',
  constraints: [imageAltTextConstraint, linkTextConstraint, colorContrastConstraint],
};

/**
 * Performance Policy
 */
export const performancePolicy: TemplatePolicy = {
  id: 'performance',
  name: 'Performance Optimization',
  description: 'Constraints for optimal template performance',
  constraints: [maxComponentsConstraint, maxNestingDepthConstraint],
};

/**
 * Strict Policy (all constraints)
 */
export const strictPolicy: TemplatePolicy = {
  id: 'strict',
  name: 'Strict Validation',
  description: 'All validation constraints enabled',
  constraints: [
    maxComponentsConstraint,
    maxNestingDepthConstraint,
    imageAltTextConstraint,
    linkTextConstraint,
    colorContrastConstraint,
    emailWidthConstraint,
    minComponentsConstraint,
  ],
};

/**
 * Create default constraints manager with built-in constraints
 */
export function createDefaultConstraintsManager(): TemplateConstraintsManager {
  const manager = new TemplateConstraintsManager();

  // Register all built-in constraints
  manager.registerConstraints([
    maxComponentsConstraint,
    maxNestingDepthConstraint,
    imageAltTextConstraint,
    linkTextConstraint,
    colorContrastConstraint,
    emailWidthConstraint,
    minComponentsConstraint,
  ]);

  // Register all built-in policies
  manager.registerPolicy(emailBestPracticesPolicy);
  manager.registerPolicy(accessibilityPolicyA);
  manager.registerPolicy(performancePolicy);
  manager.registerPolicy(strictPolicy);

  return manager;
}
