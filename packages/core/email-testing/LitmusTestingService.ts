/**
 * Litmus Email Testing Service
 *
 * Implementation of EmailTestingService for Litmus API.
 * @see https://litmus.com/api
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
 * Litmus API response types
 */
interface LitmusTestResponse {
  id: string;
  state: string;
  url_or_guid: string;
  created_at: string;
}

interface LitmusApplication {
  application: string;
  application_code: string;
  platform_name: string;
  platform_type: string;
  status: string;
}

/**
 * Litmus testing service implementation
 *
 * @example
 * ```ts
 * const litmus = new LitmusTestingService({
 *   provider: 'litmus',
 *   apiEndpoint: 'https://api.litmus.com/v1',
 *   authMethod: 'basic',
 *   username: 'your-email@example.com',
 *   password: 'your-api-key',
 * });
 *
 * await litmus.connect();
 * const test = await litmus.sendTest({
 *   name: 'My Template Test',
 *   subject: 'Test Email',
 *   htmlContent: '<html>...</html>',
 *   clients: ['ol2019', 'gmail', 'applemail'],
 * });
 * ```
 */
export class LitmusTestingService extends EmailTestingService {
  /**
   * Test connection to Litmus API
   */
  public async testConnection(): Promise<ConnectionTestResult> {
    try {
      this.status = 'testing';

      const isValid = await this.validateCredentials();

      if (!isValid) {
        this.status = 'error';
        return {
          success: false,
          error: 'Invalid credentials',
        };
      }

      const clients = await this.getAvailableClients();

      this.status = 'connected';

      return {
        success: true,
        serviceInfo: {
          name: 'Litmus',
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
   * Connect to Litmus
   */
  public async connect(): Promise<void> {
    this.status = 'testing';

    const isValid = await this.validateCredentials();

    if (!isValid) {
      this.status = 'error';
      throw new Error('Failed to connect to Litmus: Invalid credentials');
    }

    this.status = 'connected';
  }

  /**
   * Disconnect from Litmus
   */
  public async disconnect(): Promise<void> {
    this.status = 'disconnected';
  }

  /**
   * Get available email clients from Litmus
   */
  public async getAvailableClients(): Promise<EmailClient[]> {
    try {
      const response = await this.makeRequest<{ applications: LitmusApplication[] }>(
        '/emails/clients.json'
      );

      return response.applications
        .filter((app) => app.status === 'available')
        .map((app) => ({
          id: app.application_code,
          name: app.application,
          platform: this.mapPlatformType(app.platform_type),
          available: true,
        }));
    } catch (error) {
      console.error('Failed to fetch Litmus clients:', error);
      return [];
    }
  }

  /**
   * Send test to Litmus
   */
  public async sendTest(request: EmailTestRequest): Promise<EmailTestResponse> {
    if (this.status !== 'connected') {
      throw new Error('Not connected to Litmus. Call connect() first.');
    }

    try {
      const response = await this.makeRequest<LitmusTestResponse>('/emails.json', {
        method: 'POST',
        body: JSON.stringify({
          email: {
            body: request.htmlContent,
            subject: request.subject,
            applications: request.clients,
          },
        }),
      });

      return {
        testId: response.id,
        status: this.mapTestStatus(response.state),
        resultsUrl: `https://litmus.com/tests/${response.url_or_guid}`,
        createdAt: new Date(response.created_at),
        rawResponse: response,
      };
    } catch (error) {
      throw new Error(
        `Failed to send test to Litmus: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get test results from Litmus
   */
  public async getTestResults(testId: string): Promise<EmailTestResponse> {
    try {
      const response = await this.makeRequest<LitmusTestResponse>(`/emails/${testId}.json`);

      return {
        testId: response.id,
        status: this.mapTestStatus(response.state),
        resultsUrl: `https://litmus.com/tests/${response.url_or_guid}`,
        createdAt: new Date(response.created_at),
        rawResponse: response,
      };
    } catch (error) {
      throw new Error(
        `Failed to get test results from Litmus: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Cancel test (not supported by Litmus)
   */
  public async cancelTest(_testId: string): Promise<boolean> {
    // Litmus doesn't support test cancellation
    return false;
  }

  /**
   * Validate Litmus credentials
   */
  protected async validateCredentials(): Promise<boolean> {
    try {
      // Try to fetch clients list as validation
      await this.makeRequest('/emails/clients.json');
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Build authentication headers for Litmus
   */
  protected buildAuthHeaders(): Record<string, string> {
    if (this.config.authMethod === 'basic') {
      const credentials = btoa(`${this.config.username}:${this.config.password}`);
      return {
        Authorization: `Basic ${credentials}`,
      };
    }

    if (this.config.authMethod === 'api-key' && this.config.apiKey) {
      return {
        Authorization: `Bearer ${this.config.apiKey}`,
      };
    }

    return {};
  }

  /**
   * Map Litmus platform type to our platform type
   */
  private mapPlatformType(platformType: string): EmailClientPlatform {
    const lowerType = platformType.toLowerCase();

    if (lowerType.includes('mobile') && lowerType.includes('ios')) {
      return 'mobile-ios';
    }

    if (lowerType.includes('mobile') && lowerType.includes('android')) {
      return 'mobile-android';
    }

    if (lowerType.includes('webmail') || lowerType.includes('web')) {
      return 'webmail';
    }

    return 'desktop';
  }

  /**
   * Map Litmus test state to our test status
   */
  private mapTestStatus(state: string): TestStatus {
    const lowerState = state.toLowerCase();

    switch (lowerState) {
      case 'pending':
      case 'waiting':
        return 'pending';

      case 'processing':
      case 'running':
        return 'processing';

      case 'complete':
      case 'completed':
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
