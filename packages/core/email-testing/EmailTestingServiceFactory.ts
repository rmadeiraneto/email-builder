/**
 * Email Testing Service Factory
 *
 * Factory for creating email testing service instances based on provider.
 */

import type { EmailTestingConfig } from './email-testing.types';
import { EmailTestingService } from './EmailTestingService';
import { LitmusTestingService } from './LitmusTestingService';
import { EmailOnAcidTestingService } from './EmailOnAcidTestingService';
import { TestiTestingService } from './TestiTestingService';
import { CustomTestingService } from './CustomTestingService';

/**
 * Create an email testing service instance
 *
 * @param config - Service configuration
 * @returns Email testing service instance
 *
 * @example
 * ```ts
 * // Create Litmus service
 * const litmus = createEmailTestingService({
 *   provider: 'litmus',
 *   apiEndpoint: 'https://api.litmus.com/v1',
 *   authMethod: 'basic',
 *   username: 'user@example.com',
 *   password: 'api-key',
 * });
 *
 * // Create Email on Acid service
 * const eoa = createEmailTestingService({
 *   provider: 'email-on-acid',
 *   apiEndpoint: 'https://api.emailonacid.com/v4',
 *   authMethod: 'api-key',
 *   apiKey: 'your-api-key',
 * });
 *
 * // Create custom service
 * const custom = createEmailTestingService({
 *   provider: 'custom',
 *   apiEndpoint: 'https://my-service.com/api',
 *   authMethod: 'bearer',
 *   apiKey: 'token',
 * });
 * ```
 */
export function createEmailTestingService(
  config: EmailTestingConfig
): EmailTestingService {
  switch (config.provider) {
    case 'litmus':
      return new LitmusTestingService(config);

    case 'email-on-acid':
      return new EmailOnAcidTestingService(config);

    case 'testi':
      return new TestiTestingService(config);

    case 'custom':
      return new CustomTestingService(config);

    default:
      throw new Error(`Unknown email testing provider: ${config.provider}`);
  }
}

/**
 * Get default API endpoint for a provider
 *
 * @param provider - Service provider
 * @returns Default API endpoint URL
 */
export function getDefaultApiEndpoint(
  provider: EmailTestingConfig['provider']
): string {
  switch (provider) {
    case 'litmus':
      return 'https://api.litmus.com/v1';

    case 'email-on-acid':
      return 'https://api.emailonacid.com/v4';

    case 'testi':
      return 'https://api.testi.at/v1';

    case 'custom':
      return '';

    default:
      return '';
  }
}

/**
 * Get recommended authentication method for a provider
 *
 * @param provider - Service provider
 * @returns Recommended auth method
 */
export function getRecommendedAuthMethod(
  provider: EmailTestingConfig['provider']
): EmailTestingConfig['authMethod'] {
  switch (provider) {
    case 'litmus':
      return 'basic';

    case 'email-on-acid':
      return 'api-key';

    case 'testi':
      return 'api-key';

    case 'custom':
      return 'bearer';

    default:
      return 'api-key';
  }
}
