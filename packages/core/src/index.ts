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

// Export services
export { EventEmitter, LocalStorageAdapter } from '../services';

// Export template management
export * from '../template';

// Export component registry and definitions
export { ComponentRegistry, RegistryEvent, RegistryError } from '../components/ComponentRegistry';
export type { ComponentFilter } from '../components/ComponentRegistry';
export * from '../components/definitions/registry-init';
