/**
 * Data Injection System
 *
 * Exports all components of the data injection system:
 * - Type definitions
 * - Template variable parser
 * - Data processing service
 * - Data source manager
 * - Built-in helper functions
 */

// Type definitions
export * from './data-injection.types';

// Services
export { TemplateVariableParser } from './TemplateVariableParser';
export { DataProcessingService } from './DataProcessingService';
export { DataSourceManager } from './DataSourceManager';

// Helpers
export { builtInHelpers } from './helpers';
export * from './helpers';
