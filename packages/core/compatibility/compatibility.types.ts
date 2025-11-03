/**
 * Email client compatibility types
 *
 * These types define the structure for tracking CSS property support
 * across different email clients.
 *
 * @module compatibility
 */

/**
 * Email client identifiers
 *
 * Covers major desktop, webmail, and mobile email clients
 */
export type EmailClient =
  // Desktop clients - Outlook
  | 'outlook-2016-win'
  | 'outlook-2019-win'
  | 'outlook-2021-win'
  | 'outlook-365-win'
  | 'outlook-2016-mac'
  | 'outlook-2019-mac'
  | 'outlook-365-mac'
  // Webmail
  | 'outlook-web'
  | 'gmail-webmail'
  | 'yahoo-webmail'
  | 'aol-webmail'
  // Mobile - Apple Mail
  | 'apple-mail-ios'
  | 'apple-mail-ipados'
  | 'apple-mail-macos'
  // Mobile - Gmail
  | 'gmail-ios'
  | 'gmail-android'
  // Mobile - Other
  | 'samsung-email'
  | 'outlook-ios'
  | 'outlook-android';

/**
 * Support level for a CSS property in an email client
 */
export enum SupportLevel {
  /**
   * Fully supported with no issues
   */
  FULL = 'full',

  /**
   * Partially supported - may work with caveats or workarounds
   */
  PARTIAL = 'partial',

  /**
   * Not supported - will be ignored or cause issues
   */
  NONE = 'none',

  /**
   * Support status unknown or not tested
   */
  UNKNOWN = 'unknown',
}

/**
 * Support information for a CSS property in a specific email client
 */
export interface PropertySupport {
  /**
   * Support level in this client
   */
  level: SupportLevel;

  /**
   * Version information (if applicable)
   * e.g., "Supported since Outlook 2019"
   */
  version?: string;

  /**
   * Notes about support, caveats, or known issues
   * e.g., "Requires !important declaration", "Only works on <td> elements"
   */
  notes?: string[];

  /**
   * Recommended workarounds or alternatives
   * e.g., ["Use nested tables instead", "Use background-color on parent"]
   */
  workarounds?: string[];

  /**
   * Link to documentation or reference
   */
  reference?: string;
}

/**
 * Complete compatibility data for a CSS property across all email clients
 */
export interface CompatibilityInfo {
  /**
   * CSS property name
   * e.g., "border-radius", "box-shadow", "display"
   */
  property: string;

  /**
   * Human-readable category
   * e.g., "Layout", "Typography", "Visual Effects"
   */
  category: PropertyCategory;

  /**
   * Brief description of what the property does
   */
  description: string;

  /**
   * Support data for each email client
   * Key: EmailClient, Value: PropertySupport
   */
  support: Record<EmailClient, PropertySupport>;

  /**
   * General notes applicable to all clients
   */
  generalNotes?: string[];

  /**
   * Safe alternatives that work everywhere
   */
  safeAlternatives?: string[];
}

/**
 * Category for CSS properties
 */
export enum PropertyCategory {
  LAYOUT = 'Layout',
  TYPOGRAPHY = 'Typography',
  COLORS = 'Colors & Backgrounds',
  SPACING = 'Spacing',
  BORDERS = 'Borders',
  VISUAL_EFFECTS = 'Visual Effects',
  POSITIONING = 'Positioning',
  DISPLAY = 'Display',
  IMAGES = 'Images',
  OTHER = 'Other',
}

/**
 * Support statistics for a CSS property
 */
export interface SupportStatistics {
  /**
   * CSS property name
   */
  property: string;

  /**
   * Total number of clients tested
   */
  totalClients: number;

  /**
   * Number of clients with full support
   */
  fullSupport: number;

  /**
   * Number of clients with partial support
   */
  partialSupport: number;

  /**
   * Number of clients with no support
   */
  noSupport: number;

  /**
   * Number of clients with unknown support
   */
  unknownSupport: number;

  /**
   * Overall support score (0-100)
   * Based on weighted average: full=1.0, partial=0.5, none=0.0
   */
  supportScore: number;

  /**
   * Support level category for quick visual indication
   */
  supportLevel: 'high' | 'medium' | 'low' | 'unknown';
}

/**
 * Filter options for querying compatibility data
 */
export interface CompatibilityQuery {
  /**
   * Filter by category
   */
  category?: PropertyCategory;

  /**
   * Filter by minimum support score (0-100)
   */
  minScore?: number;

  /**
   * Filter by support level
   */
  supportLevel?: 'high' | 'medium' | 'low';

  /**
   * Filter by specific email client
   */
  client?: EmailClient;

  /**
   * Search by property name (partial match)
   */
  search?: string;
}

/**
 * Email client platform grouping
 */
export enum ClientPlatform {
  DESKTOP_OUTLOOK = 'Desktop - Outlook',
  DESKTOP_OTHER = 'Desktop - Other',
  WEBMAIL = 'Webmail',
  MOBILE_IOS = 'Mobile - iOS',
  MOBILE_ANDROID = 'Mobile - Android',
  MOBILE_OTHER = 'Mobile - Other',
}

/**
 * Mapping of email clients to platforms
 */
export const CLIENT_PLATFORM_MAP: Record<EmailClient, ClientPlatform> = {
  'outlook-2016-win': ClientPlatform.DESKTOP_OUTLOOK,
  'outlook-2019-win': ClientPlatform.DESKTOP_OUTLOOK,
  'outlook-2021-win': ClientPlatform.DESKTOP_OUTLOOK,
  'outlook-365-win': ClientPlatform.DESKTOP_OUTLOOK,
  'outlook-2016-mac': ClientPlatform.DESKTOP_OUTLOOK,
  'outlook-2019-mac': ClientPlatform.DESKTOP_OUTLOOK,
  'outlook-365-mac': ClientPlatform.DESKTOP_OUTLOOK,
  'outlook-web': ClientPlatform.WEBMAIL,
  'gmail-webmail': ClientPlatform.WEBMAIL,
  'yahoo-webmail': ClientPlatform.WEBMAIL,
  'aol-webmail': ClientPlatform.WEBMAIL,
  'apple-mail-ios': ClientPlatform.MOBILE_IOS,
  'apple-mail-ipados': ClientPlatform.MOBILE_IOS,
  'apple-mail-macos': ClientPlatform.DESKTOP_OTHER,
  'gmail-ios': ClientPlatform.MOBILE_IOS,
  'gmail-android': ClientPlatform.MOBILE_ANDROID,
  'samsung-email': ClientPlatform.MOBILE_ANDROID,
  'outlook-ios': ClientPlatform.MOBILE_IOS,
  'outlook-android': ClientPlatform.MOBILE_ANDROID,
};

/**
 * Human-readable labels for email clients
 */
export const EMAIL_CLIENT_LABELS: Record<EmailClient, string> = {
  'outlook-2016-win': 'Outlook 2016 (Windows)',
  'outlook-2019-win': 'Outlook 2019 (Windows)',
  'outlook-2021-win': 'Outlook 2021 (Windows)',
  'outlook-365-win': 'Outlook 365 (Windows)',
  'outlook-2016-mac': 'Outlook 2016 (Mac)',
  'outlook-2019-mac': 'Outlook 2019 (Mac)',
  'outlook-365-mac': 'Outlook 365 (Mac)',
  'outlook-web': 'Outlook.com',
  'gmail-webmail': 'Gmail (Webmail)',
  'yahoo-webmail': 'Yahoo Mail',
  'aol-webmail': 'AOL Mail',
  'apple-mail-ios': 'Apple Mail (iOS)',
  'apple-mail-ipados': 'Apple Mail (iPadOS)',
  'apple-mail-macos': 'Apple Mail (macOS)',
  'gmail-ios': 'Gmail (iOS)',
  'gmail-android': 'Gmail (Android)',
  'samsung-email': 'Samsung Email',
  'outlook-ios': 'Outlook (iOS)',
  'outlook-android': 'Outlook (Android)',
};
