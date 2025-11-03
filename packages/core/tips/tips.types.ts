/**
 * Best practices tips types
 *
 * Types for displaying helpful tips and best practices for email design
 *
 * @module tips
 */

/**
 * Category for tips
 */
export enum TipCategory {
  GENERAL = 'General',
  LAYOUT = 'Layout',
  TYPOGRAPHY = 'Typography',
  IMAGES = 'Images',
  COLORS = 'Colors',
  LINKS = 'Links',
  COMPATIBILITY = 'Compatibility',
  ACCESSIBILITY = 'Accessibility',
  TESTING = 'Testing',
  OPTIMIZATION = 'Optimization',
}

/**
 * Severity level for tips
 */
export enum TipSeverity {
  /**
   * Informational - Nice to know
   */
  INFO = 'info',

  /**
   * Warning - Recommended to follow
   */
  WARNING = 'warning',

  /**
   * Critical - Important to follow for proper email rendering
   */
  CRITICAL = 'critical',
}

/**
 * Trigger condition for showing tips
 */
export enum TipTrigger {
  /**
   * Show when email preview mode is selected
   */
  EMAIL_MODE = 'email-mode',

  /**
   * Show when exporting template
   */
  EXPORT = 'export',

  /**
   * Show when using properties with poor email support
   */
  POOR_COMPATIBILITY = 'poor-compatibility',

  /**
   * Show randomly as "Did you know?" tips
   */
  RANDOM = 'random',

  /**
   * Show on builder initialization
   */
  STARTUP = 'startup',

  /**
   * Always show (permanent tips)
   */
  ALWAYS = 'always',

  /**
   * Manual trigger
   */
  MANUAL = 'manual',
}

/**
 * A helpful tip for email design best practices
 */
export interface Tip {
  /**
   * Unique identifier for the tip
   */
  id: string;

  /**
   * Tip title
   */
  title: string;

  /**
   * Tip message/description
   */
  message: string;

  /**
   * Category of the tip
   */
  category: TipCategory;

  /**
   * Severity level
   */
  severity: TipSeverity;

  /**
   * When to trigger this tip
   */
  trigger: TipTrigger[];

  /**
   * Link to more information
   */
  learnMoreUrl?: string;

  /**
   * Can the user dismiss this tip permanently?
   * @default true
   */
  dismissible?: boolean;

  /**
   * Should this tip be shown only once?
   * @default false
   */
  showOnce?: boolean;
}

/**
 * User's dismissed tips tracking
 */
export interface DismissedTips {
  /**
   * Map of tip ID to timestamp when dismissed
   */
  [tipId: string]: number;
}

/**
 * Tips filter options
 */
export interface TipsQuery {
  /**
   * Filter by category
   */
  category?: TipCategory;

  /**
   * Filter by severity
   */
  severity?: TipSeverity;

  /**
   * Filter by trigger
   */
  trigger?: TipTrigger;

  /**
   * Include dismissed tips
   * @default false
   */
  includeDismissed?: boolean;

  /**
   * Search by keyword
   */
  search?: string;
}
