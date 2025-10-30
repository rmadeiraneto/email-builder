/**
 * @email-builder/core
 *
 * Framework-agnostic core functionality for the email builder.
 * This package provides the foundational logic for building email templates.
 *
 * @packageDocumentation
 */

// Export types
export * from '../types';

// Export builder
export * from '../builder';

// Export commands
export * from '../commands';

// Export services (EventEmitter as concrete implementation)
export { EventEmitter } from '../services';
