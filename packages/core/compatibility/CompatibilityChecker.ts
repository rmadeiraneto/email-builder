/**
 * Compatibility Checker Service
 *
 * Validates templates for email client compatibility and identifies issues
 *
 * @module compatibility
 */

import type { BaseComponent } from '../types';
import { CompatibilityService } from './CompatibilityService';

/**
 * Severity level for compatibility issues
 */
export enum IssueSeverity {
  /**
   * Critical issue that will cause broken rendering or functionality
   * Must be fixed before export
   */
  CRITICAL = 'critical',

  /**
   * Warning about potential issues in some email clients
   * Should be fixed but not blocking
   */
  WARNING = 'warning',

  /**
   * Suggestion for improvement or best practice
   * Nice to have but optional
   */
  SUGGESTION = 'suggestion',
}

/**
 * Category of compatibility issue
 */
export enum IssueCategory {
  CSS = 'css',
  HTML = 'html',
  IMAGES = 'images',
  ACCESSIBILITY = 'accessibility',
  STRUCTURE = 'structure',
  CONTENT = 'content',
}

/**
 * Represents a compatibility issue found in a template
 */
export interface CompatibilityIssue {
  /**
   * Unique identifier for this issue
   */
  id: string;

  /**
   * Severity of the issue
   */
  severity: IssueSeverity;

  /**
   * Category of the issue
   */
  category: IssueCategory;

  /**
   * Component ID where issue was found
   */
  componentId: string;

  /**
   * Component type (e.g., 'button', 'text', 'image')
   */
  componentType: string;

  /**
   * CSS property or attribute name (if applicable)
   */
  property?: string;

  /**
   * Current value causing the issue
   */
  value?: string;

  /**
   * Human-readable description of the issue
   */
  message: string;

  /**
   * Detailed explanation of why this is an issue
   */
  details?: string;

  /**
   * Whether an automatic fix is available
   */
  autoFixAvailable: boolean;

  /**
   * Suggested fix description
   */
  suggestedFix?: string;

  /**
   * Number of email clients affected (out of 19)
   */
  affectedClients?: number;

  /**
   * Support score percentage (0-100)
   */
  supportScore?: number;
}

/**
 * Compatibility validation report
 */
export interface CompatibilityReport {
  /**
   * Overall compatibility score (0-100)
   * Based on severity and number of issues
   */
  overallScore: number;

  /**
   * Total number of issues found
   */
  totalIssues: number;

  /**
   * Issues grouped by severity
   */
  issues: {
    critical: CompatibilityIssue[];
    warnings: CompatibilityIssue[];
    suggestions: CompatibilityIssue[];
  };

  /**
   * Components checked
   */
  componentsChecked: number;

  /**
   * Timestamp when check was performed
   */
  timestamp: Date;

  /**
   * Whether the template is safe to export
   * False if there are critical issues
   */
  safeToExport: boolean;
}

/**
 * CSS properties that are commonly unsupported in email clients
 */
const PROBLEMATIC_CSS_PROPERTIES = [
  'display',
  'position',
  'float',
  'z-index',
  'transform',
  'animation',
  'transition',
  'box-shadow',
  'text-shadow',
  'opacity',
  'flex',
  'flex-direction',
  'flex-wrap',
  'justify-content',
  'align-items',
  'grid',
  'grid-template-columns',
  'grid-gap',
];

/**
 * Service for checking template compatibility with email clients
 *
 * @example
 * ```ts
 * const checker = new CompatibilityChecker(compatibilityService);
 * const report = checker.checkTemplate(components);
 *
 * if (report.issues.critical.length > 0) {
 *   console.log('Critical issues found!');
 *   report.issues.critical.forEach(issue => {
 *     console.log(`- ${issue.message}`);
 *   });
 * }
 * ```
 */
export class CompatibilityChecker {
  private compatibilityService: CompatibilityService;
  private issueCounter = 0;

  constructor(compatibilityService: CompatibilityService) {
    this.compatibilityService = compatibilityService;
  }

  /**
   * Check a template for compatibility issues
   *
   * @param components - Array of components to check
   * @returns Detailed compatibility report
   */
  public checkTemplate(components: BaseComponent[]): CompatibilityReport {
    this.issueCounter = 0;
    const allIssues: CompatibilityIssue[] = [];

    // Check each component
    for (const component of components) {
      const issues = this.checkComponent(component);
      allIssues.push(...issues);

      // Recursively check children
      if (component.children && component.children.length > 0) {
        const childReport = this.checkTemplate(component.children);
        allIssues.push(
          ...childReport.issues.critical,
          ...childReport.issues.warnings,
          ...childReport.issues.suggestions
        );
      }
    }

    // Group issues by severity
    const critical = allIssues.filter((i) => i.severity === IssueSeverity.CRITICAL);
    const warnings = allIssues.filter((i) => i.severity === IssueSeverity.WARNING);
    const suggestions = allIssues.filter((i) => i.severity === IssueSeverity.SUGGESTION);

    // Calculate overall score
    const overallScore = this.calculateOverallScore(critical.length, warnings.length, suggestions.length);

    return {
      overallScore,
      totalIssues: allIssues.length,
      issues: {
        critical,
        warnings,
        suggestions,
      },
      componentsChecked: components.length,
      timestamp: new Date(),
      safeToExport: critical.length === 0,
    };
  }

  /**
   * Check a single component for issues
   */
  private checkComponent(component: BaseComponent): CompatibilityIssue[] {
    const issues: CompatibilityIssue[] = [];

    // Check CSS properties
    issues.push(...this.checkCSSProperties(component));

    // Check images
    if (component.type === 'image') {
      issues.push(...this.checkImage(component));
    }

    // Check accessibility
    issues.push(...this.checkAccessibility(component));

    // Check content
    issues.push(...this.checkContent(component));

    return issues;
  }

  /**
   * Check CSS properties for compatibility issues
   */
  private checkCSSProperties(component: BaseComponent): CompatibilityIssue[] {
    const issues: CompatibilityIssue[] = [];
    const styles = component.styles || {};

    for (const property of PROBLEMATIC_CSS_PROPERTIES) {
      const value = styles[property as keyof typeof styles];
      if (value === undefined || value === null || value === '') continue;

      // Get compatibility info for this property
      const stats = this.compatibilityService.getPropertyStatistics(property);
      if (!stats) continue;

      // Check support level
      if (stats.supportScore < 50) {
        // Poor support - critical issue
        issues.push(this.createIssue({
          severity: IssueSeverity.CRITICAL,
          category: IssueCategory.CSS,
          componentId: component.id,
          componentType: component.type,
          property,
          value: String(value),
          message: `CSS property "${property}" has poor email client support (${stats.supportScore}%)`,
          details: `Only ${stats.fullSupport} of ${stats.totalClients} email clients fully support this property. This may cause broken layouts or be completely ignored.`,
          autoFixAvailable: this.canAutoFixProperty(property),
          suggestedFix: this.getSuggestedFix(property, value),
          affectedClients: stats.totalClients - stats.fullSupport,
          supportScore: stats.supportScore,
        }));
      } else if (stats.supportScore < 90) {
        // Moderate support - warning
        issues.push(this.createIssue({
          severity: IssueSeverity.WARNING,
          category: IssueCategory.CSS,
          componentId: component.id,
          componentType: component.type,
          property,
          value: String(value),
          message: `CSS property "${property}" has limited email client support (${stats.supportScore}%)`,
          details: `${stats.fullSupport} of ${stats.totalClients} email clients fully support this property. Consider using email-safe alternatives.`,
          autoFixAvailable: this.canAutoFixProperty(property),
          suggestedFix: this.getSuggestedFix(property, value),
          affectedClients: stats.totalClients - stats.fullSupport,
          supportScore: stats.supportScore,
        }));
      }

      // Special checks for specific properties
      if (property === 'display' && (value === 'flex' || value === 'grid')) {
        issues.push(this.createIssue({
          severity: IssueSeverity.CRITICAL,
          category: IssueCategory.CSS,
          componentId: component.id,
          componentType: component.type,
          property: 'display',
          value: String(value),
          message: `CSS "${value}" layout is not supported in email clients`,
          details: `Most email clients do not support modern CSS layout methods like flexbox and grid. Use table-based layouts instead.`,
          autoFixAvailable: true,
          suggestedFix: 'EmailExportService can automatically convert to table-based layout during export',
          affectedClients: 15,
          supportScore: 20,
        }));
      }

      if (property === 'position' && value !== 'static') {
        issues.push(this.createIssue({
          severity: IssueSeverity.WARNING,
          category: IssueCategory.CSS,
          componentId: component.id,
          componentType: component.type,
          property: 'position',
          value: String(value),
          message: `CSS position "${value}" is not reliably supported in email clients`,
          details: `Positioned elements (absolute, relative, fixed) are not supported in most email clients, especially Outlook.`,
          autoFixAvailable: false,
          suggestedFix: 'Restructure your layout using tables and nested elements instead of positioning',
          affectedClients: 12,
          supportScore: 35,
        }));
      }
    }

    return issues;
  }

  /**
   * Check image-specific issues
   */
  private checkImage(component: BaseComponent): CompatibilityIssue[] {
    const issues: CompatibilityIssue[] = [];
    const props = component.props || {};

    // Check for alt text
    if (!props.alt || props.alt.trim() === '') {
      issues.push(this.createIssue({
        severity: IssueSeverity.WARNING,
        category: IssueCategory.ACCESSIBILITY,
        componentId: component.id,
        componentType: component.type,
        property: 'alt',
        message: 'Image is missing alt text',
        details: 'Alt text is important for accessibility and displays when images are blocked by email clients.',
        autoFixAvailable: true,
        suggestedFix: 'Add descriptive alt text for this image',
      }));
    }

    // Check for width and height
    if (!props.width) {
      issues.push(this.createIssue({
        severity: IssueSeverity.SUGGESTION,
        category: IssueCategory.IMAGES,
        componentId: component.id,
        componentType: component.type,
        property: 'width',
        message: 'Image is missing explicit width attribute',
        details: 'Setting explicit width helps email clients render images correctly and prevents layout shifts.',
        autoFixAvailable: false,
        suggestedFix: 'Add width attribute to the image',
      }));
    }

    if (!props.height) {
      issues.push(this.createIssue({
        severity: IssueSeverity.SUGGESTION,
        category: IssueCategory.IMAGES,
        componentId: component.id,
        componentType: component.type,
        property: 'height',
        message: 'Image is missing explicit height attribute',
        details: 'Setting explicit height helps email clients render images correctly and prevents layout shifts.',
        autoFixAvailable: false,
        suggestedFix: 'Add height attribute to the image',
      }));
    }

    // Check for relative URLs
    if (props.src && !props.src.startsWith('http://') && !props.src.startsWith('https://')) {
      issues.push(this.createIssue({
        severity: IssueSeverity.CRITICAL,
        category: IssueCategory.IMAGES,
        componentId: component.id,
        componentType: component.type,
        property: 'src',
        value: props.src,
        message: 'Image uses relative URL instead of absolute URL',
        details: 'Email clients require absolute URLs (starting with http:// or https://) for images to display correctly.',
        autoFixAvailable: false,
        suggestedFix: 'Use an absolute URL for the image source',
      }));
    }

    return issues;
  }

  /**
   * Check accessibility issues
   */
  private checkAccessibility(component: BaseComponent): CompatibilityIssue[] {
    const issues: CompatibilityIssue[] = [];
    const props = component.props || {};

    // Check buttons and links for accessible text
    if ((component.type === 'button' || component.type === 'link') && !props.text && !props.children) {
      issues.push(this.createIssue({
        severity: IssueSeverity.WARNING,
        category: IssueCategory.ACCESSIBILITY,
        componentId: component.id,
        componentType: component.type,
        message: `${component.type} is missing accessible text content`,
        details: 'Interactive elements should have descriptive text for screen readers.',
        autoFixAvailable: false,
        suggestedFix: 'Add descriptive text to the element',
      }));
    }

    return issues;
  }

  /**
   * Check content issues
   */
  private checkContent(component: BaseComponent): CompatibilityIssue[] {
    const issues: CompatibilityIssue[] = [];
    const props = component.props || {};

    // Check for very long text content
    if (component.type === 'text' && props.content) {
      const content = String(props.content);
      if (content.length > 1000) {
        issues.push(this.createIssue({
          severity: IssueSeverity.SUGGESTION,
          category: IssueCategory.CONTENT,
          componentId: component.id,
          componentType: component.type,
          message: 'Text content is very long',
          details: 'Long blocks of text can be difficult to read in email. Consider breaking it into smaller sections.',
          autoFixAvailable: false,
          suggestedFix: 'Break long text into shorter paragraphs or sections',
        }));
      }
    }

    return issues;
  }

  /**
   * Check if a property can be automatically fixed
   */
  private canAutoFixProperty(property: string): boolean {
    // Properties that can be handled by EmailExportService
    const autoFixable = ['display', 'flex', 'grid', 'flex-direction', 'justify-content', 'align-items'];
    return autoFixable.includes(property);
  }

  /**
   * Get suggested fix for a property
   */
  private getSuggestedFix(property: string, value: unknown): string {
    if (property === 'display' && (value === 'flex' || value === 'grid')) {
      return 'Use EmailExportService to automatically convert to table-based layout';
    }
    if (property === 'box-shadow') {
      return 'Use border or background colors instead, or use conditional comments for Outlook';
    }
    if (property === 'border-radius') {
      return 'Consider using VML for rounded corners in Outlook, or accept square corners in older clients';
    }
    if (property === 'position') {
      return 'Use table-based layout with nested tables for positioning';
    }
    return 'Review compatibility guide for alternative approaches';
  }

  /**
   * Create a new issue with a unique ID
   */
  private createIssue(
    issue: Omit<CompatibilityIssue, 'id'>
  ): CompatibilityIssue {
    return {
      ...issue,
      id: `issue-${++this.issueCounter}`,
    };
  }

  /**
   * Calculate overall compatibility score
   *
   * Score is based on:
   * - Critical issues: -10 points each
   * - Warnings: -3 points each
   * - Suggestions: -1 point each
   * - Max score: 100
   * - Min score: 0
   */
  private calculateOverallScore(
    criticalCount: number,
    warningCount: number,
    suggestionCount: number
  ): number {
    const baseScore = 100;
    const criticalPenalty = criticalCount * 10;
    const warningPenalty = warningCount * 3;
    const suggestionPenalty = suggestionCount * 1;

    const score = baseScore - criticalPenalty - warningPenalty - suggestionPenalty;
    return Math.max(0, Math.min(100, score));
  }
}
