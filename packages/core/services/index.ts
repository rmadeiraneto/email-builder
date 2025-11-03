/**
 * Service exports
 */

export { EventEmitter } from './EventEmitter';
export { LocalStorageAdapter } from './LocalStorageAdapter';
export { EmailExportService } from './EmailExportService';

/**
 * Email Export types
 */
export type {
  EmailExportOptions,
  EmailExportResult,
  EmailExportWarning,
  EmailExportWarningType,
  CSSCompatibility,
  CSSRule,
  TableConversionContext,
} from './email-export.types';
