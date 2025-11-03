/**
 * Email on Acid Testing Service
 *
 * Implementation of EmailTestingService for Email on Acid API.
 * @see https://www.emailonacid.com/api
 */

import { EmailTestingService } from './EmailTestingService';
import type {
  ConnectionTestResult,
  EmailClient,
  EmailTestRequest,
  EmailTestResponse,
  EmailClientPlatform,
  TestStatus,
} from './email-testing.types';

/**
 * Email on Acid API response types
 */
interface EmailOnAcidTestResponse {
  id: string;
  status: string;
  permalink: string;
  created: string;
}

interface EmailOnAcidClient {
  client_id: string;
  name: string;
  platform: string;
  category: string;
}

/**
 * Email on Acid testing service implementation
 *
 * @example
 * ```ts
 * const eoa = new EmailOnAcidTestingService({
 *   provider: 'email-on-acid',
 *   apiEndpoint: 'https://api.emailonacid.com/v4',
 *   authMethod: 'api-key',
 *   apiKey: 'your-api-key',
 * });
 *
 * await eoa.connect();
 * const test = await eoa.sendTest({
 *   name: 'My Template Test',
 *   subject: 'Test Email',
 *   htmlContent: '<html>...</html>',
 *   clients: ['outlook2019', 'gmailnew', 'iphone13'],
 * });
 * ```
 */
export class EmailOnAcidTestingService extends EmailTestingService {
  /**
   * Test connection to Email on Acid API
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
          name: 'Email on Acid',
          version: 'v4',
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
   * Connect to Email on Acid
   */
  public async connect(): Promise<void> {
    this.status = 'testing';

    const isValid = await this.validateCredentials();

    if (!isValid) {
      this.status = 'error';
      throw new Error('Failed to connect to Email on Acid: Invalid API key');
    }

    this.status = 'connected';
  }

  /**
   * Disconnect from Email on Acid
   */
  public async disconnect(): Promise<void> {
    this.status = 'disconnected';
  }

  /**
   * Get available email clients from Email on Acid
   */
  public async getAvailableClients(): Promise<EmailClient[]> {
    try {
      const response = await this.makeRequest<{ clients: EmailOnAcidClient[] }>('/clients');

      return response.clients.map((client) => ({
        id: client.client_id,
        name: client.name,
        platform: this.mapPlatformType(client.platform),
        available: true,
      }));
    } catch (error) {
      console.error('Failed to fetch Email on Acid clients:', error);
      return [];
    }
  }

  /**
   * Send test to Email on Acid
   */
  public async sendTest(request: EmailTestRequest): Promise<EmailTestResponse> {
    if (this.status !== 'connected') {
      throw new Error('Not connected to Email on Acid. Call connect() first.');
    }

    try {
      const response = await this.makeRequest<EmailOnAcidTestResponse>('/tests', {
        method: 'POST',
        body: JSON.stringify({
          subject: request.subject,
          html: request.htmlContent,
          clients: request.clients,
          test_name: request.name,
          spam_test: request.spamTest ?? false,
        }),
      });

      return {
        testId: response.id,
        status: this.mapTestStatus(response.status),
        resultsUrl: response.permalink,
        createdAt: new Date(response.created),
        rawResponse: response,
      };
    } catch (error) {
      throw new Error(
        `Failed to send test to Email on Acid: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get test results from Email on Acid
   */
  public async getTestResults(testId: string): Promise<EmailTestResponse> {
    try {
      const response = await this.makeRequest<EmailOnAcidTestResponse>(`/tests/${testId}`);

      return {
        testId: response.id,
        status: this.mapTestStatus(response.status),
        resultsUrl: response.permalink,
        createdAt: new Date(response.created),
        rawResponse: response,
      };
    } catch (error) {
      throw new Error(
        `Failed to get test results from Email on Acid: ${error instanceof Error ? error.message : 'Unknown error'}`
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
      console.error('Failed to cancel test:', error);
      return false;
    }
  }

  /**
   * Validate Email on Acid credentials
   */
  protected async validateCredentials(): Promise<boolean> {
    try {
      // Try to fetch clients list as validation
      await this.makeRequest('/clients');
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Build authentication headers for Email on Acid
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
   * Map Email on Acid platform to our platform type
   */
  private mapPlatformType(platform: string): EmailClientPlatform {
    const lowerPlatform = platform.toLowerCase();

    if (lowerPlatform.includes('iphone') || lowerPlatform.includes('ipad') || lowerPlatform.includes('ios')) {
      return 'mobile-ios';
    }

    if (lowerPlatform.includes('android')) {
      return 'mobile-android';
    }

    if (lowerPlatform.includes('webmail') || lowerPlatform.includes('web')) {
      return 'webmail';
    }

    return 'desktop';
  }

  /**
   * Map Email on Acid status to our test status
   */
  private mapTestStatus(status: string): TestStatus {
    const lowerStatus = status.toLowerCase();

    switch (lowerStatus) {
      case 'pending':
      case 'queued':
        return 'pending';

      case 'processing':
      case 'running':
      case 'in_progress':
        return 'processing';

      case 'complete':
      case 'completed':
      case 'finished':
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
