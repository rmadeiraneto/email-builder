/**
 * @email-builder/core
 *
 * Framework-agnostic core functionality for the email builder.
 * This package provides the foundational logic for building email templates.
 *
 * @packageDocumentation
 */

// Export constants
export * from '../constants';

// Export errors
export * from '../errors';

// Export types
export * from '../types';

// Export utils
export * from '../utils';

// Export builder
export * from '../builder';

// Export commands
export * from '../commands';

// Export services
export { EventEmitter, LocalStorageAdapter, EmailExportService } from '../services';
export type {
  EmailExportOptions,
  EmailExportResult,
  EmailExportWarning,
  EmailExportWarningType,
  CSSCompatibility,
  CSSRule,
  TableConversionContext,
} from '../services';

// Export template management
export * from '../template';

// Export component registry and definitions
export { ComponentRegistry, RegistryEvent, RegistryError } from '../components/ComponentRegistry';
export type { ComponentFilter } from '../components/ComponentRegistry';
export * from '../components/definitions/registry-init';

// Export email testing integration
export * from '../email-testing';

// Export tips
export * from '../tips';

// Export compatibility
export * from '../compatibility';

// Export responsive
export * from '../responsive';

// Export visual feedback
export * from '../visual-feedback';

// Export i18n (internationalization)
export * from '../i18n';
export * from '../i18n/locales';

// Export data injection
export * from '../data-injection';

// Export mobile development mode
export * from '../mobile';
