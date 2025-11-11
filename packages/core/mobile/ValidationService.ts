/**
 * Validation Service
 *
 * Validates mobile customizations and provides warnings
 *
 * Responsibilities:
 * - Validate mobile customizations
 * - Check for common issues (overflow, touch targets, etc.)
 * - Provide inline warnings
 * - Auto-fix suggestions
 * - Rule-based validation system
 *
 * @module mobile
 */

import { EventEmitter } from '../services/EventEmitter';
import type { Template, BaseComponent } from '../types';
import type {
  DeviceMode,
  MobileDevModeConfig,
  ValidationRule,
  ValidationIssue,
} from './mobile.types';
import type { ModeManager } from './ModeManager';

/**
 * Validation Service Events
 */
export enum ValidationEvent {
  /**
   * Fired when validation starts
   */
  VALIDATION_START = 'validation:start',

  /**
   * Fired when validation completes
   */
  VALIDATION_COMPLETE = 'validation:complete',

  /**
   * Fired when an issue is found
   */
  ISSUE_FOUND = 'validation:issue-found',

  /**
   * Fired when auto-fix is applied
   */
  AUTO_FIX_APPLIED = 'validation:auto-fix-applied',
}

/**
 * Validation result
 */
export interface ValidationResult {
  /**
   * Is valid (no critical issues)
   */
  isValid: boolean;

  /**
   * All issues found
   */
  issues: ValidationIssue[];

  /**
   * Issues by severity
   */
  issuesBySeverity: {
    info: ValidationIssue[];
    warning: ValidationIssue[];
    critical: ValidationIssue[];
  };

  /**
   * Total issue count
   */
  totalIssues: number;

  /**
   * Components with issues
   */
  componentsWithIssues: string[];

  /**
   * Fixable issue count
   */
  fixableIssues: number;
}

/**
 * Validation Service Options
 */
export interface ValidationServiceOptions {
  /**
   * Event emitter instance
   */
  eventEmitter: EventEmitter;

  /**
   * Mode manager instance
   */
  modeManager: ModeManager;

  /**
   * Mobile dev mode configuration
   */
  config: MobileDevModeConfig;
}

/**
 * Default validation rules
 */
export const DEFAULT_VALIDATION_RULES: ValidationRule[] = [
  {
    id: 'min-touch-target-size',
    name: 'Minimum Touch Target Size',
    description: 'Interactive elements should be at least 44x44px for touch targets',
    severity: 'warning',
    validate: (template: Template, mode: DeviceMode) => {
      const issues: ValidationIssue[] = [];
      const minSize = 44;
      const interactiveTypes = ['button', 'link', 'cta'];

      for (const component of template.components) {
        if (!interactiveTypes.includes(component.type)) {
          continue;
        }

        const styles = component.mobileStyles || component.styles;
        const height = parseInt(String(styles.height || styles.minHeight || '0'));

        if (height > 0 && height < minSize) {
          issues.push({
            ruleId: 'min-touch-target-size',
            componentId: component.id,
            message: `Touch target too small (${height}px). Minimum recommended: ${minSize}px`,
            severity: 'warning',
            propertyPath: 'styles.minHeight',
            suggestion: `Set minHeight to ${minSize}px`,
            fixable: true,
          });
        }
      }

      return issues;
    },
    fix: (template: Template) => {
      // Auto-fix would be implemented here
      return template;
    },
  },
  {
    id: 'min-font-size',
    name: 'Minimum Font Size',
    description: 'Text should be at least 14px on mobile for readability',
    severity: 'warning',
    validate: (template: Template, mode: DeviceMode) => {
      const issues: ValidationIssue[] = [];
      const minFontSize = 14;

      for (const component of template.components) {
        const styles = component.mobileStyles || component.styles;
        const fontSize = parseInt(String(styles.fontSize || '0'));

        if (fontSize > 0 && fontSize < minFontSize) {
          issues.push({
            ruleId: 'min-font-size',
            componentId: component.id,
            message: `Font size too small (${fontSize}px). Minimum recommended: ${minFontSize}px`,
            severity: 'warning',
            propertyPath: 'styles.fontSize',
            suggestion: `Increase fontSize to at least ${minFontSize}px`,
            fixable: true,
          });
        }
      }

      return issues;
    },
  },
  {
    id: 'overflow-hidden-content',
    name: 'Overflow Hidden Content',
    description: 'Components with overflow:hidden may hide important content on mobile',
    severity: 'info',
    validate: (template: Template, mode: DeviceMode) => {
      const issues: ValidationIssue[] = [];

      for (const component of template.components) {
        const styles = component.mobileStyles || component.styles;

        if (styles.overflow === 'hidden') {
          issues.push({
            ruleId: 'overflow-hidden-content',
            componentId: component.id,
            message: 'Component has overflow:hidden which may hide content on mobile',
            severity: 'info',
            propertyPath: 'styles.overflow',
            suggestion: 'Consider using overflow:auto or overflow:visible',
            fixable: false,
          });
        }
      }

      return issues;
    },
  },
  {
    id: 'all-components-hidden',
    name: 'All Components Hidden',
    description: 'All components are hidden on mobile',
    severity: 'critical',
    validate: (template: Template, mode: DeviceMode) => {
      const issues: ValidationIssue[] = [];
      const topLevelComponents = template.components.filter((c) => !c.parentId);

      const allHidden = topLevelComponents.every((c) => {
        const visibleOnDesktop = c.visibility?.desktop ?? true;
        const visibleOnMobile = c.visibility?.mobile ?? visibleOnDesktop;
        return !visibleOnMobile;
      });

      if (allHidden && topLevelComponents.length > 0) {
        issues.push({
          ruleId: 'all-components-hidden',
          message: 'All components are hidden on mobile. Email will be blank.',
          severity: 'critical',
          suggestion: 'Show at least one component on mobile',
          fixable: false,
        });
      }

      return issues;
    },
  },
  {
    id: 'excessive-width',
    name: 'Excessive Width',
    description: 'Component width exceeds mobile viewport',
    severity: 'warning',
    validate: (template: Template, mode: DeviceMode) => {
      const issues: ValidationIssue[] = [];
      const mobileBreakpoint = 375; // Typical mobile width

      for (const component of template.components) {
        const styles = component.mobileStyles || component.styles;
        const width = parseInt(String(styles.width || '0'));

        if (width > mobileBreakpoint) {
          issues.push({
            ruleId: 'excessive-width',
            componentId: component.id,
            message: `Component width (${width}px) exceeds mobile viewport (${mobileBreakpoint}px)`,
            severity: 'warning',
            propertyPath: 'styles.width',
            suggestion: 'Use 100% or max-width for responsive sizing',
            fixable: true,
          });
        }
      }

      return issues;
    },
  },
  {
    id: 'fixed-positioning',
    name: 'Fixed Positioning',
    description: 'Fixed positioning may not work correctly in email clients',
    severity: 'warning',
    validate: (template: Template, mode: DeviceMode) => {
      const issues: ValidationIssue[] = [];

      for (const component of template.components) {
        const styles = component.mobileStyles || component.styles;

        if (styles.position === 'fixed' || styles.position === 'sticky') {
          issues.push({
            ruleId: 'fixed-positioning',
            componentId: component.id,
            message: `Position ${styles.position} may not work in email clients`,
            severity: 'warning',
            propertyPath: 'styles.position',
            suggestion: 'Use relative or absolute positioning',
            fixable: false,
          });
        }
      }

      return issues;
    },
  },
];

/**
 * Validation Service
 *
 * Validates mobile customizations
 */
export class ValidationService {
  private eventEmitter: EventEmitter;
  private modeManager: ModeManager;
  private config: MobileDevModeConfig;
  private rules: Map<string, ValidationRule>;

  constructor(options: ValidationServiceOptions) {
    this.eventEmitter = options.eventEmitter;
    this.modeManager = options.modeManager;
    this.config = options.config;

    // Initialize rules
    this.rules = new Map();
    const configRules = this.config.validation.rules || [];
    const allRules = [...DEFAULT_VALIDATION_RULES, ...configRules];

    for (const rule of allRules) {
      this.rules.set(rule.id, rule);
    }
  }

  /**
   * Validate template
   *
   * @param template - Template to validate
   * @param mode - Device mode (optional, uses current mode if not specified)
   */
  public validate(template: Template, mode?: DeviceMode): ValidationResult {
    const validationMode = mode || this.modeManager.getCurrentMode();

    // Emit validation start
    this.eventEmitter.emit(ValidationEvent.VALIDATION_START, {
      timestamp: Date.now(),
      mode: validationMode,
    });

    const allIssues: ValidationIssue[] = [];

    // Run all rules
    for (const rule of this.rules.values()) {
      try {
        const issues = rule.validate(template, validationMode);

        for (const issue of issues) {
          allIssues.push(issue);

          // Emit issue found event
          this.eventEmitter.emit(ValidationEvent.ISSUE_FOUND, {
            issue,
            timestamp: Date.now(),
          });
        }
      } catch (error) {
        console.error(`Error running validation rule ${rule.id}:`, error);
      }
    }

    // Categorize issues
    const issuesBySeverity = {
      info: allIssues.filter((i) => i.severity === 'info'),
      warning: allIssues.filter((i) => i.severity === 'warning'),
      critical: allIssues.filter((i) => i.severity === 'critical'),
    };

    // Get unique components with issues
    const componentsWithIssues = [...new Set(
      allIssues.filter((i) => i.componentId).map((i) => i.componentId!)
    )];

    // Count fixable issues
    const fixableIssues = allIssues.filter((i) => i.fixable).length;

    const result: ValidationResult = {
      isValid: issuesBySeverity.critical.length === 0,
      issues: allIssues,
      issuesBySeverity,
      totalIssues: allIssues.length,
      componentsWithIssues,
      fixableIssues,
    };

    // Emit validation complete
    this.eventEmitter.emit(ValidationEvent.VALIDATION_COMPLETE, {
      result,
      timestamp: Date.now(),
    });

    return result;
  }

  /**
   * Validate component
   *
   * @param component - Component to validate
   * @param template - Template context
   * @param mode - Device mode
   */
  public validateComponent(
    component: BaseComponent,
    template: Template,
    mode?: DeviceMode
  ): ValidationIssue[] {
    const validationMode = mode || this.modeManager.getCurrentMode();
    const issues: ValidationIssue[] = [];

    // Create temporary template with only this component
    const tempTemplate: Template = {
      ...template,
      components: [component],
    };

    // Run all rules
    for (const rule of this.rules.values()) {
      try {
        const ruleIssues = rule.validate(tempTemplate, validationMode);
        issues.push(...ruleIssues);
      } catch (error) {
        console.error(`Error running validation rule ${rule.id}:`, error);
      }
    }

    return issues;
  }

  /**
   * Get issues for a specific component
   *
   * @param componentId - Component ID
   * @param allIssues - All validation issues
   */
  public getComponentIssues(
    componentId: string,
    allIssues: ValidationIssue[]
  ): ValidationIssue[] {
    return allIssues.filter((issue) => issue.componentId === componentId);
  }

  /**
   * Check if validation is enabled
   */
  public isEnabled(): boolean {
    return this.config.validation.enabled;
  }

  /**
   * Get rule by ID
   *
   * @param ruleId - Rule ID
   */
  public getRule(ruleId: string): ValidationRule | undefined {
    return this.rules.get(ruleId);
  }

  /**
   * Get all rules
   */
  public getRules(): ValidationRule[] {
    return Array.from(this.rules.values());
  }

  /**
   * Register custom validation rule
   *
   * @param rule - Validation rule
   */
  public registerRule(rule: ValidationRule): void {
    this.rules.set(rule.id, rule);
  }

  /**
   * Unregister validation rule
   *
   * @param ruleId - Rule ID
   */
  public unregisterRule(ruleId: string): void {
    this.rules.delete(ruleId);
  }

  /**
   * Enable rule
   *
   * @param ruleId - Rule ID
   */
  public enableRule(ruleId: string): void {
    // Rule enablement would be tracked in config
    // This is a simplified implementation
  }

  /**
   * Disable rule
   *
   * @param ruleId - Rule ID
   */
  public disableRule(ruleId: string): void {
    // Rule disablement would be tracked in config
    // This is a simplified implementation
  }
}
