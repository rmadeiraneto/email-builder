/**
 * Email client compatibility module
 *
 * Provides data and utilities for checking CSS property support
 * across different email clients.
 *
 * @example
 * ```ts
 * import { CompatibilityService } from '@email-builder/core/compatibility';
 *
 * const service = new CompatibilityService();
 * const stats = service.getPropertyStatistics('border-radius');
 * console.log(`Support score: ${stats.supportScore}%`);
 * ```
 *
 * @module compatibility
 */

// Services
export { CompatibilityService } from './CompatibilityService';
export { CompatibilityChecker } from './CompatibilityChecker';

// Compatibility Checker Types
export type {
  CompatibilityIssue,
  CompatibilityReport,
} from './CompatibilityChecker';

export {
  IssueSeverity,
  IssueCategory,
} from './CompatibilityChecker';

// Types
export type {
  EmailClient,
  PropertySupport,
  CompatibilityInfo,
  SupportStatistics,
  CompatibilityQuery,
} from './compatibility.types';

export {
  SupportLevel,
  PropertyCategory,
  CLIENT_PLATFORM_MAP,
  EMAIL_CLIENT_LABELS,
  ClientPlatform,
} from './compatibility.types';

// Data utilities
export {
  COMPATIBILITY_DATABASE,
  getAllProperties,
  getPropertyInfo,
  getPropertiesByCategory,
  hasProperty,
} from './compatibility-data';
