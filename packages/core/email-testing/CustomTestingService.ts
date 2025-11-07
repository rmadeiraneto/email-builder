/**
 * Custom Email Testing Service
 *
 * Generic implementation for custom/self-hosted email testing services.
 * Allows users to configure their own API endpoints and authentication.
 */

import { EmailTestingService } from './EmailTestingService';
import type {
  ConnectionTestResult,
  EmailClient,
  EmailTestRequest,
  EmailTestResponse,
  TestStatus,
} from './email-testing.types';

/**
 * Generic API response structure
 */
interface GenericTestResponse {
  id?: string;
  testId?: string;
  test_id?: string;
  status?: string;
  state?: string;
  url?: string;
  resultsUrl?: string;
  results_url?: string;
  permalink?: string;
  createdAt?: string;
  created_at?: string;
  created?: string;
  [key: string]: unknown;
}

/**
 * Custom testing service implementation
 *
 * This service provides a flexible implementation for custom or self-hosted
 * email testing services. It attempts to handle common API patterns but
 * may require response mapping configuration for specific APIs.
 *
 * @example
 * ```ts
 * const custom = new CustomTestingService({
 *   provider: 'custom',
 *   apiEndpoint: 'https://my-testing-service.com/api',
 *   authMethod: 'bearer',
 *   apiKey: 'your-token',
 * });
 *
 * await custom.connect();
 * const test = await custom.sendTest({
 *   name: 'My Template Test',
 *   subject: 'Test Email',
 *   htmlContent: '<html>...</html>',
 *   clients: ['desktop', 'mobile'],
 * });
 * ```
 */
export class CustomTestingService extends EmailTestingService {
  /**
   * Test connection to custom API
   */
  public async testConnection(): Promise<ConnectionTestResult> {
    try {
      this.status = 'testing';

      const isValid = await this.validateCredentials();

      if (!isValid) {
        this.status = 'error';
        return {
          success: false,
          error: 'Failed to connect to custom API. Check your endpoint and credentials.',
        };
      }

      this.status = 'connected';

      return {
        success: true,
        serviceInfo: {
          name: 'Custom Email Testing Service',
          version: 'custom',
        },
      };
    } catch (error) {
      this.status = 'error';
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Connect to custom service
   */
  public async connect(): Promise<void> {
    this.status = 'testing';

    const isValid = await this.validateCredentials();

    if (!isValid) {
      this.status = 'error';
      throw new Error('Failed to connect to custom service: Connection test failed');
    }

    this.status = 'connected';
  }

  /**
   * Disconnect from custom service
   */
  public async disconnect(): Promise<void> {
    this.status = 'disconnected';
  }

  /**
   * Get available email clients
   *
   * Attempts to fetch from /clients or /email-clients endpoint.
   * Returns empty array if not available.
   */
  public async getAvailableClients(): Promise<EmailClient[]> {
    const endpoints = ['/clients', '/email-clients', '/available-clients'];

    for (const endpoint of endpoints) {
      try {
        const response = await this.makeRequest<{ clients?: EmailClient[]; data?: EmailClient[] }>(
          endpoint
        );

        if (response.clients) {
          return response.clients;
        }

        if (response.data) {
          return response.data;
        }

        // If response is directly an array
        if (Array.isArray(response)) {
          return response as EmailClient[];
        }
      } catch (error) {
        // Try next endpoint
        continue;
      }
    }

    // Return empty array if no clients endpoint is available
    console.warn('Custom service does not provide a clients endpoint');
    return [];
  }

  /**
   * Send test to custom service
   */
  public async sendTest(request: EmailTestRequest): Promise<EmailTestResponse> {
    if (this.status !== 'connected') {
      throw new Error('Not connected to custom service. Call connect() first.');
    }

    try {
      const response = await this.makeRequest<GenericTestResponse>('/tests', {
        method: 'POST',
        body: JSON.stringify({
          name: request.name,
          subject: request.subject,
          html: request.htmlContent,
          htmlContent: request.htmlContent,
          html_content: request.htmlContent,
          plainText: request.plainTextContent,
          plain_text: request.plainTextContent,
          clients: request.clients,
          description: request.description,
          spamTest: request.spamTest,
          spam_test: request.spamTest,
          metadata: request.metadata,
        }),
      });

      return this.parseTestResponse(response);
    } catch (error) {
      throw new Error(
        `Failed to send test to custom service: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get test results from custom service
   */
  public async getTestResults(testId: string): Promise<EmailTestResponse> {
    try {
      const response = await this.makeRequest<GenericTestResponse>(`/tests/${testId}`);
      return this.parseTestResponse(response);
    } catch (error) {
      throw new Error(
        `Failed to get test results from custom service: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Cancel test
   */
  public async cancelTest(testId: string): Promise<boolean> {
    try {
      await this.makeRequest(`/tests/${testId}`, {
        method: 'DELETE',
      });
      return true;
    } catch (error) {
      // Try alternative cancel endpoint
      try {
        await this.makeRequest(`/tests/${testId}/cancel`, {
          method: 'POST',
        });
        return true;
      } catch (alternativeError) {
        console.error('Failed to cancel test:', error, alternativeError);
        return false;
      }
    }
  }

  /**
   * Validate custom service credentials
   */
  protected async validateCredentials(): Promise<boolean> {
    // Try common health/ping endpoints
    const endpoints = ['/health', '/ping', '/status', '/account', '/me'];

    for (const endpoint of endpoints) {
      try {
        await this.makeRequest(endpoint);
        return true;
      } catch (error) {
        continue;
      }
    }

    // If no health endpoint works, try fetching clients
    try {
      const clients = await this.getAvailableClients();
      // Only consider it valid if we actually got clients back
      // (getAvailableClients returns empty array on failure)
      return clients.length > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Build authentication headers
   */
  protected buildAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};

    if (this.config.authMethod === 'api-key' && this.config.apiKey) {
      headers['X-API-Key'] = this.config.apiKey;
    }

    if (this.config.authMethod === 'bearer' && this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }

    if (this.config.authMethod === 'oauth' && this.config.oauthToken) {
      headers['Authorization'] = `Bearer ${this.config.oauthToken}`;
    }

    if (this.config.authMethod === 'basic' && this.config.username && this.config.password) {
      const credentials = btoa(`${this.config.username}:${this.config.password}`);
      headers['Authorization'] = `Basic ${credentials}`;
    }

    return headers;
  }

  /**
   * Parse generic test response
   */
  private parseTestResponse(response: GenericTestResponse): EmailTestResponse {
    // Extract test ID (try multiple field names)
    const testId = response.id ?? response.testId ?? response.test_id ?? 'unknown';

    // Extract status
    const statusField = response.status ?? response.state ?? 'pending';
    const status = this.mapTestStatus(String(statusField));

    // Extract results URL
    const resultsUrl =
      response.url ?? response.resultsUrl ?? response.results_url ?? response.permalink;

    // Extract created date
    const createdAtField =
      response.createdAt ?? response.created_at ?? response.created ?? new Date().toISOString();
    const createdAt = new Date(String(createdAtField));

    return {
      testId: String(testId),
      status,
      ...(resultsUrl && { resultsUrl: String(resultsUrl) }),
      createdAt,
      rawResponse: response,
    };
  }

  /**
   * Map status string to TestStatus
   */
  private mapTestStatus(status: string): TestStatus {
    const lowerStatus = status.toLowerCase();

    // Check 'processing' before 'pending' to avoid matching 'in_progress' as 'pending'
    if (lowerStatus.includes('process') || lowerStatus.includes('running') || lowerStatus === 'in_progress') {
      return 'processing';
    }

    if (lowerStatus.includes('pend') || lowerStatus.includes('queue') || lowerStatus.includes('waiting')) {
      return 'pending';
    }

    if (lowerStatus.includes('complete') || lowerStatus.includes('done') || lowerStatus.includes('finish')) {
      return 'completed';
    }

    if (lowerStatus.includes('fail') || lowerStatus.includes('error')) {
      return 'failed';
    }

    if (lowerStatus.includes('cancel')) {
      return 'cancelled';
    }

    return 'pending';
  }
}
