/**
 * Testi@ Email Testing Service
 *
 * Implementation of EmailTestingService for Testi@ API.
 * @see https://testi.at/
 */

import { EmailTestingService } from './EmailTestingService';
import type {
  ConnectionTestResult,
  EmailClient,
  EmailTestRequest,
  EmailTestResponse,
  COMMON_EMAIL_CLIENTS,
  TestStatus,
} from './email-testing.types';

/**
 * Testi@ API response types
 */
interface TestiTestResponse {
  test_id: string;
  status: string;
  preview_url: string;
  created_at: string;
}

/**
 * Testi@ testing service implementation
 *
 * @example
 * ```ts
 * const testi = new TestiTestingService({
 *   provider: 'testi',
 *   apiEndpoint: 'https://api.testi.at/v1',
 *   authMethod: 'api-key',
 *   apiKey: 'your-api-key',
 * });
 *
 * await testi.connect();
 * const test = await testi.sendTest({
 *   name: 'My Template Test',
 *   subject: 'Test Email',
 *   htmlContent: '<html>...</html>',
 *   clients: ['outlook', 'gmail', 'apple'],
 * });
 * ```
 */
export class TestiTestingService extends EmailTestingService {
  /**
   * Test connection to Testi@ API
   */
  public async testConnection(): Promise<ConnectionTestResult> {
    try {
      this.status = 'testing';

      const isValid = await this.validateCredentials();

      if (!isValid) {
        this.status = 'error';
        return {
          success: false,
          error: 'Invalid API key',
        };
      }

      const clients = await this.getAvailableClients();

      this.status = 'connected';

      return {
        success: true,
        serviceInfo: {
          name: 'Testi@',
          version: 'v1',
          availableClients: clients,
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
   * Connect to Testi@
   */
  public async connect(): Promise<void> {
    this.status = 'testing';

    const isValid = await this.validateCredentials();

    if (!isValid) {
      this.status = 'error';
      throw new Error('Failed to connect to Testi@: Invalid API key');
    }

    this.status = 'connected';
  }

  /**
   * Disconnect from Testi@
   */
  public async disconnect(): Promise<void> {
    this.status = 'disconnected';
  }

  /**
   * Get available email clients from Testi@
   *
   * Note: Testi@ may have a limited set of clients or use common email clients
   */
  public async getAvailableClients(): Promise<EmailClient[]> {
    try {
      // Try to fetch from API if available
      const response = await this.makeRequest<{ clients?: EmailClient[] }>('/clients');

      if (response.clients) {
        return response.clients;
      }
    } catch (error) {
      console.warn('Failed to fetch Testi@ clients, using defaults:', error);
    }

    // Fallback to common email clients
    // Import COMMON_EMAIL_CLIENTS requires adjustment
    return [
      { id: 'outlook', name: 'Outlook', platform: 'desktop', available: true },
      { id: 'gmail', name: 'Gmail', platform: 'webmail', available: true },
      { id: 'apple', name: 'Apple Mail', platform: 'desktop', available: true },
      { id: 'yahoo', name: 'Yahoo Mail', platform: 'webmail', available: true },
      { id: 'mobile', name: 'Mobile', platform: 'mobile-ios', available: true },
    ];
  }

  /**
   * Send test to Testi@
   */
  public async sendTest(request: EmailTestRequest): Promise<EmailTestResponse> {
    if (this.status !== 'connected') {
      throw new Error('Not connected to Testi@. Call connect() first.');
    }

    try {
      const response = await this.makeRequest<TestiTestResponse>('/tests', {
        method: 'POST',
        body: JSON.stringify({
          test_name: request.name,
          subject: request.subject,
          html_content: request.htmlContent,
          plain_text: request.plainTextContent,
          clients: request.clients,
          description: request.description,
        }),
      });

      return {
        testId: response.test_id,
        status: this.mapTestStatus(response.status),
        resultsUrl: response.preview_url,
        createdAt: new Date(response.created_at),
        rawResponse: response,
      };
    } catch (error) {
      throw new Error(
        `Failed to send test to Testi@: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get test results from Testi@
   */
  public async getTestResults(testId: string): Promise<EmailTestResponse> {
    try {
      const response = await this.makeRequest<TestiTestResponse>(`/tests/${testId}`);

      return {
        testId: response.test_id,
        status: this.mapTestStatus(response.status),
        resultsUrl: response.preview_url,
        createdAt: new Date(response.created_at),
        rawResponse: response,
      };
    } catch (error) {
      throw new Error(
        `Failed to get test results from Testi@: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Cancel test
   */
  public async cancelTest(testId: string): Promise<boolean> {
    try {
      await this.makeRequest(`/tests/${testId}/cancel`, {
        method: 'POST',
      });
      return true;
    } catch (error) {
      console.error('Failed to cancel test:', error);
      return false;
    }
  }

  /**
   * Validate Testi@ credentials
   */
  protected async validateCredentials(): Promise<boolean> {
    try {
      // Try a simple ping or account info endpoint
      await this.makeRequest('/account');
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Build authentication headers for Testi@
   */
  protected buildAuthHeaders(): Record<string, string> {
    if (this.config.authMethod === 'api-key' && this.config.apiKey) {
      return {
        'X-API-Key': this.config.apiKey,
      };
    }

    if (this.config.authMethod === 'bearer' && this.config.apiKey) {
      return {
        Authorization: `Bearer ${this.config.apiKey}`,
      };
    }

    return {};
  }

  /**
   * Map Testi@ status to our test status
   */
  private mapTestStatus(status: string): TestStatus {
    const lowerStatus = status.toLowerCase();

    switch (lowerStatus) {
      case 'pending':
      case 'queued':
        return 'pending';

      case 'processing':
      case 'running':
        return 'processing';

      case 'complete':
      case 'completed':
      case 'done':
        return 'completed';

      case 'failed':
      case 'error':
        return 'failed';

      case 'cancelled':
      case 'canceled':
        return 'cancelled';

      default:
        return 'pending';
    }
  }
}
