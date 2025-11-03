/**
 * Email Testing Service Types
 *
 * Type definitions for external email testing service integration.
 * Supports services like Litmus, Email on Acid, Testi@, and custom services.
 */

/**
 * Available email testing service providers
 */
export type EmailTestingProvider =
  | 'litmus'
  | 'email-on-acid'
  | 'testi'
  | 'custom';

/**
 * Authentication method for API access
 */
export type AuthenticationMethod = 'api-key' | 'bearer' | 'oauth' | 'basic';

/**
 * Service connection status
 */
export type ServiceStatus = 'connected' | 'disconnected' | 'error' | 'testing';

/**
 * Email testing service configuration
 */
export interface EmailTestingConfig {
  /**
   * Service provider
   */
  provider: EmailTestingProvider;

  /**
   * API endpoint URL
   * @example 'https://api.litmus.com/v1'
   */
  apiEndpoint: string;

  /**
   * Authentication method
   */
  authMethod: AuthenticationMethod;

  /**
   * API key or token
   */
  apiKey?: string;

  /**
   * OAuth token (if using OAuth)
   */
  oauthToken?: string;

  /**
   * Username (if using basic auth)
   */
  username?: string;

  /**
   * Password (if using basic auth)
   */
  password?: string;

  /**
   * Custom headers to include in API requests
   */
  customHeaders?: Record<string, string>;

  /**
   * Request timeout in milliseconds
   * @default 30000
   */
  timeout?: number;
}

/**
 * Email client platform types
 */
export type EmailClientPlatform =
  | 'desktop'
  | 'webmail'
  | 'mobile-ios'
  | 'mobile-android';

/**
 * Major email clients for testing
 */
export interface EmailClient {
  /**
   * Client identifier
   */
  id: string;

  /**
   * Display name
   */
  name: string;

  /**
   * Client version (if applicable)
   */
  version?: string;

  /**
   * Platform type
   */
  platform: EmailClientPlatform;

  /**
   * Whether this client is available for testing
   */
  available: boolean;
}

/**
 * Common email clients
 */
export const COMMON_EMAIL_CLIENTS: EmailClient[] = [
  // Outlook Desktop
  { id: 'ol2016', name: 'Outlook 2016', version: '2016', platform: 'desktop', available: true },
  { id: 'ol2019', name: 'Outlook 2019', version: '2019', platform: 'desktop', available: true },
  { id: 'ol2021', name: 'Outlook 2021', version: '2021', platform: 'desktop', available: true },

  // Outlook Webmail
  { id: 'ol365', name: 'Outlook 365', platform: 'webmail', available: true },
  { id: 'olweb', name: 'Outlook.com', platform: 'webmail', available: true },

  // Gmail
  { id: 'gmail', name: 'Gmail', platform: 'webmail', available: true },
  { id: 'gmail-ios', name: 'Gmail iOS', platform: 'mobile-ios', available: true },
  { id: 'gmail-android', name: 'Gmail Android', platform: 'mobile-android', available: true },

  // Apple Mail
  { id: 'applemail', name: 'Apple Mail', platform: 'desktop', available: true },
  { id: 'applemail-ios', name: 'Apple Mail iOS', platform: 'mobile-ios', available: true },

  // Yahoo Mail
  { id: 'yahoo', name: 'Yahoo Mail', platform: 'webmail', available: true },

  // Others
  { id: 'aol', name: 'AOL Mail', platform: 'webmail', available: true },
  { id: 'thunderbird', name: 'Thunderbird', platform: 'desktop', available: true },
];

/**
 * Email test configuration
 */
export interface EmailTestRequest {
  /**
   * Test name/title
   */
  name: string;

  /**
   * Email subject line
   */
  subject: string;

  /**
   * HTML content to test
   */
  htmlContent: string;

  /**
   * Plain text version (optional)
   */
  plainTextContent?: string;

  /**
   * Email clients to test against
   */
  clients: string[];

  /**
   * Optional test description
   */
  description?: string;

  /**
   * Whether to enable spam testing
   * @default false
   */
  spamTest?: boolean;

  /**
   * Custom metadata
   */
  metadata?: Record<string, unknown>;
}

/**
 * Test execution status
 */
export type TestStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

/**
 * Email test response from service
 */
export interface EmailTestResponse {
  /**
   * Unique test ID
   */
  testId: string;

  /**
   * Test status
   */
  status: TestStatus;

  /**
   * URL to view test results
   */
  resultsUrl?: string;

  /**
   * Direct links to individual client previews
   */
  previewUrls?: Record<string, string>;

  /**
   * Estimated completion time (if processing)
   */
  estimatedCompletion?: Date;

  /**
   * Error message (if failed)
   */
  error?: string;

  /**
   * Test creation timestamp
   */
  createdAt: Date;

  /**
   * Raw response data from service
   */
  rawResponse?: unknown;
}

/**
 * Service connection test result
 */
export interface ConnectionTestResult {
  /**
   * Whether connection was successful
   */
  success: boolean;

  /**
   * Error message (if failed)
   */
  error?: string;

  /**
   * Service information (if successful)
   */
  serviceInfo?: {
    /**
     * Service name
     */
    name: string;

    /**
     * API version
     */
    version?: string;

    /**
     * Available email clients
     */
    availableClients?: EmailClient[];

    /**
     * Account information
     */
    account?: {
      /**
       * Account email or username
       */
      email?: string;

      /**
       * Plan name
       */
      plan?: string;

      /**
       * Remaining test credits
       */
      credits?: number;
    };
  };
}

/**
 * Test history item
 */
export interface EmailTestHistoryItem {
  /**
   * Test ID
   */
  id: string;

  /**
   * Test name
   */
  name: string;

  /**
   * Template name
   */
  templateName: string;

  /**
   * Test status
   */
  status: TestStatus;

  /**
   * Tested clients
   */
  clients: string[];

  /**
   * Results URL
   */
  resultsUrl?: string;

  /**
   * Created timestamp
   */
  createdAt: Date;

  /**
   * Completed timestamp
   */
  completedAt?: Date;
}
