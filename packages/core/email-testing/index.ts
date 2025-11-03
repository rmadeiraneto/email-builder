/**
 * Email Testing Integration
 *
 * Services for integrating with external email testing platforms.
 * Supports Litmus, Email on Acid, Testi@, and custom services.
 *
 * @packageDocumentation
 */

// Export types
export type {
  EmailTestingProvider,
  AuthenticationMethod,
  ServiceStatus,
  EmailTestingConfig,
  EmailClientPlatform,
  EmailClient,
  EmailTestRequest,
  TestStatus,
  EmailTestResponse,
  ConnectionTestResult,
  EmailTestHistoryItem,
} from './email-testing.types';

export { COMMON_EMAIL_CLIENTS } from './email-testing.types';

// Export base service
export { EmailTestingService } from './EmailTestingService';

// Export implementations
export { LitmusTestingService } from './LitmusTestingService';
export { EmailOnAcidTestingService } from './EmailOnAcidTestingService';
export { TestiTestingService } from './TestiTestingService';
export { CustomTestingService } from './CustomTestingService';

// Export factory
export {
  createEmailTestingService,
  getDefaultApiEndpoint,
  getRecommendedAuthMethod,
} from './EmailTestingServiceFactory';
