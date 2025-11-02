/**
 * Core Constants
 *
 * Centralized constants for the email builder core package.
 * Extracting these values makes them easier to maintain and configure.
 */

/**
 * Canvas dimension defaults by target type
 */
export const CANVAS_DEFAULTS = {
  /**
   * Email target canvas dimensions
   * Standard width for email clients (600px is widely supported)
   */
  EMAIL: {
    WIDTH: 600,
    MAX_WIDTH: 650,
  },

  /**
   * Hybrid target canvas dimensions
   * Balanced for both email and web
   */
  HYBRID: {
    WIDTH: 650,
    MAX_WIDTH: 800,
  },

  /**
   * Web target canvas dimensions
   * Wider dimensions suitable for web browsers
   */
  WEB: {
    WIDTH: 1200,
    MAX_WIDTH: 1920,
  },

  /**
   * Default fallback dimensions
   */
  DEFAULT: {
    WIDTH: 800,
    MAX_WIDTH: 1200,
  },
} as const;

/**
 * Email validation constraints
 */
export const EMAIL_CONSTRAINTS = {
  /**
   * Maximum recommended width for email templates
   * Templates wider than this will show a warning
   */
  MAX_WIDTH_WARNING: 650,

  /**
   * Maximum recommended width for email content sections
   */
  CONTENT_MAX_WIDTH: 600,
} as const;

/**
 * Component default dimensions
 */
export const COMPONENT_DEFAULTS = {
  /**
   * Default image maximum width
   */
  IMAGE_MAX_WIDTH: 200,

  /**
   * Default content maximum width (for Hero, CTA sections)
   */
  CONTENT_MAX_WIDTH: 600,
} as const;

/**
 * Typography defaults
 */
export const TYPOGRAPHY_DEFAULTS = {
  /**
   * Font weight for semi-bold text
   */
  FONT_WEIGHT_SEMIBOLD: 600,

  /**
   * Font weight for bold text
   */
  FONT_WEIGHT_BOLD: 700,
} as const;

/**
 * Command system configuration
 */
export const COMMAND_DEFAULTS = {
  /**
   * Maximum number of commands to keep in history
   * Older commands are removed to prevent memory issues
   */
  MAX_HISTORY_SIZE: 50,
} as const;

/**
 * Template defaults
 */
export const TEMPLATE_DEFAULTS = {
  /**
   * Default locale for templates
   */
  LOCALE: 'en-US',

  /**
   * Default key prefix for storage
   */
  STORAGE_KEY_PREFIX: 'email-builder',
} as const;

/**
 * Feature flag defaults
 */
export const FEATURE_DEFAULTS = {
  /**
   * Enable undo/redo by default
   */
  UNDO_REDO: true,

  /**
   * Enable custom components by default
   */
  CUSTOM_COMPONENTS: true,

  /**
   * Disable template versioning by default
   */
  TEMPLATE_VERSIONING: false,

  /**
   * Enable data injection by default
   */
  DATA_INJECTION: true,

  /**
   * Disable auto-save by default
   */
  AUTO_SAVE: false,
} as const;
