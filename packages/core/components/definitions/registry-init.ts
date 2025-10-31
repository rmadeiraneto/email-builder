/**
 * Registry initialization
 *
 * Functions for creating and populating a ComponentRegistry with default components
 */

import { ComponentRegistry } from '../ComponentRegistry';
import type { ComponentDefinition } from '../../types';
import { baseComponentDefinitions } from './base-components.definitions';
import { emailComponentDefinitions } from './email-components.definitions';

/**
 * Gets all default component definitions
 *
 * @returns Array of all default component definitions
 */
export function getAllComponentDefinitions(): ComponentDefinition[] {
  return [
    ...baseComponentDefinitions,
    ...emailComponentDefinitions,
  ];
}

/**
 * Registers all default components in a registry
 *
 * @param registry - ComponentRegistry instance to populate
 * @returns The same registry instance with all components registered
 */
export function registerDefaultComponents(registry: ComponentRegistry): ComponentRegistry {
  const definitions = getAllComponentDefinitions();
  registry.registerMany(definitions);
  return registry;
}

/**
 * Creates a new ComponentRegistry with all default components registered
 *
 * @returns New ComponentRegistry instance with all default components
 */
export function createDefaultRegistry(): ComponentRegistry {
  const registry = new ComponentRegistry();
  return registerDefaultComponents(registry);
}
