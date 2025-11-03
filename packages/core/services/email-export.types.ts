/**
 * Email Export Service Type Definitions
 *
 * Types for converting builder HTML to email-safe HTML
 */

/**
 * Email export configuration options
 */
export interface EmailExportOptions {
  /**
   * Whether to inline CSS styles
   * @default true
   */
  inlineCSS?: boolean;

  /**
   * Whether to convert layouts to table-based structure
   * @default true
   */
  useTableLayout?: boolean;

  /**
   * Whether to add Outlook conditional comments
   * @default true
   */
  addOutlookFixes?: boolean;

  /**
   * Whether to remove email-incompatible CSS
   * @default true
   */
  removeIncompatibleCSS?: boolean;

  /**
   * Whether to add email structure optimizations
   * @default true
   */
  optimizeStructure?: boolean;

  /**
   * Custom DOCTYPE to use
   * @default '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">'
   */
  doctype?: string;

  /**
   * Character encoding
   * @default 'utf-8'
   */
  charset?: string;

  /**
   * Email client specific optimizations
   */
  clientOptimizations?: {
    /**
     * Add Gmail-specific fixes
     * @default true
     */
    gmail?: boolean;

    /**
     * Add Outlook-specific fixes
     * @default true
     */
    outlook?: boolean;

    /**
     * Add iOS Mail-specific fixes
     * @default true
     */
    ios?: boolean;

    /**
     * Add Yahoo Mail-specific fixes
     * @default true
     */
    yahoo?: boolean;
  };

  /**
   * Maximum width for email content
   * @default 600
   */
  maxWidth?: number;

  /**
   * Whether to minify the output HTML
   * @default false
   */
  minify?: boolean;
}

/**
 * CSS property categorization for email compatibility
 */
export interface CSSCompatibility {
  /**
   * Properties that are safe for email
   */
  safe: string[];

  /**
   * Properties that should be removed
   */
  unsafe: string[];

  /**
   * Properties that need special handling
   */
  conditional: string[];
}

/**
 * Email export result
 */
export interface EmailExportResult {
  /**
   * Exported HTML string
   */
  html: string;

  /**
   * Warnings encountered during export
   */
  warnings: EmailExportWarning[];

  /**
   * Statistics about the export
   */
  stats: {
    /**
     * Number of CSS rules inlined
     */
    inlinedRules: number;

    /**
     * Number of elements converted to tables
     */
    convertedElements: number;

    /**
     * Number of incompatible properties removed
     */
    removedProperties: number;

    /**
     * Size of output HTML in bytes
     */
    outputSize: number;
  };
}

/**
 * Warning types for email export
 */
export type EmailExportWarningType =
  | 'incompatible-css'
  | 'unsupported-element'
  | 'layout-conversion'
  | 'outlook-compatibility'
  | 'size-limit'
  | 'general';

/**
 * Warning encountered during email export
 */
export interface EmailExportWarning {
  /**
   * Warning type
   */
  type: EmailExportWarningType;

  /**
   * Warning message
   */
  message: string;

  /**
   * Element or selector that caused the warning
   */
  context?: string;

  /**
   * Severity level
   */
  severity: 'info' | 'warning' | 'error';
}

/**
 * CSS rule representation
 */
export interface CSSRule {
  /**
   * CSS selector
   */
  selector: string;

  /**
   * CSS properties
   */
  properties: Record<string, string>;

  /**
   * Specificity score
   */
  specificity: number;
}

/**
 * Table conversion context
 */
export interface TableConversionContext {
  /**
   * Whether this is a layout container
   */
  isLayout: boolean;

  /**
   * Alignment of the content
   */
  align?: 'left' | 'center' | 'right';

  /**
   * Vertical alignment
   */
  valign?: 'top' | 'middle' | 'bottom';

  /**
   * Width of the table/cell
   */
  width?: string | number;

  /**
   * Background color
   */
  bgcolor?: string;

  /**
   * Cell padding
   */
  cellpadding?: number;

  /**
   * Cell spacing
   */
  cellspacing?: number;
}
