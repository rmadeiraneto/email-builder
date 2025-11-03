/**
 * Email Testing Service Interface
 *
 * Abstract interface for integrating with external email testing services.
 * Implementations exist for Litmus, Email on Acid, Testi@, and custom services.
 */

import type {
  EmailTestingConfig,
  EmailTestRequest,
  EmailTestResponse,
  ConnectionTestResult,
  EmailClient,
  ServiceStatus,
} from './email-testing.types';

/**
 * Abstract email testing service
 *
 * @example
 * ```ts
 * const service = new LitmusTestingService(config);
 * await service.connect();
 * const result = await service.sendTest(testRequest);
 * console.log(`View results: ${result.resultsUrl}`);
 * ```
 */
export abstract class EmailTestingService {
  protected config: EmailTestingConfig;
  protected status: ServiceStatus = 'disconnected';

  constructor(config: EmailTestingConfig) {
    this.config = config;
  }

  /**
   * Get current service status
   */
  public getStatus(): ServiceStatus {
    return this.status;
  }

  /**
   * Get service configuration
   */
  public getConfig(): Readonly<EmailTestingConfig> {
    return { ...this.config };
  }

  /**
   * Update service configuration
   *
   * @param config - New configuration
   */
  public updateConfig(config: Partial<EmailTestingConfig>): void {
    this.config = { ...this.config, ...config };
    this.status = 'disconnected';
  }

  /**
   * Test connection to service
   *
   * @returns Connection test result with service info
   */
  public abstract testConnection(): Promise<ConnectionTestResult>;

  /**
   * Connect to the testing service
   *
   * @throws {Error} If connection fails
   */
  public abstract connect(): Promise<void>;

  /**
   * Disconnect from the service
   */
  public abstract disconnect(): Promise<void>;

  /**
   * Get list of available email clients for testing
   *
   * @returns Array of available email clients
   */
  public abstract getAvailableClients(): Promise<EmailClient[]>;

  /**
   * Send email for testing
   *
   * @param request - Test configuration
   * @returns Test response with results URL
   * @throws {Error} If test submission fails
   */
  public abstract sendTest(request: EmailTestRequest): Promise<EmailTestResponse>;

  /**
   * Get test status and results
   *
   * @param testId - Test identifier
   * @returns Updated test response
   * @throws {Error} If test retrieval fails
   */
  public abstract getTestResults(testId: string): Promise<EmailTestResponse>;

  /**
   * Cancel a running test
   *
   * @param testId - Test identifier
   * @returns Whether cancellation was successful
   */
  public abstract cancelTest(testId: string): Promise<boolean>;

  /**
   * Validate authentication credentials
   *
   * @returns Whether credentials are valid
   */
  protected abstract validateCredentials(): Promise<boolean>;

  /**
   * Build authentication headers for API requests
   *
   * @returns Headers object
   */
  protected abstract buildAuthHeaders(): Record<string, string>;

  /**
   * Make authenticated API request
   *
   * @param endpoint - API endpoint path
   * @param options - Fetch options
   * @returns Response data
   * @throws {Error} If request fails
   */
  protected async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.config.apiEndpoint}${endpoint}`;
    const headers = {
      ...this.buildAuthHeaders(),
      'Content-Type': 'application/json',
      ...this.config.customHeaders,
      ...options.headers,
    };

    const timeout = this.config.timeout ?? 30000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `API request failed: ${response.status} ${response.statusText}. ${errorText}`
        );
      }

      return (await response.json()) as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(`Request timeout after ${timeout}ms`);
        }
        throw error;
      }

      throw new Error('Unknown error occurred during API request');
    }
  }
}
