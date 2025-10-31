/**
 * Component definitions
 *
 * Exports all component definitions and registry initialization
 */

// Base component definitions
export {
  buttonDefinition,
  textDefinition,
  imageDefinition,
  separatorDefinition,
  spacerDefinition,
  baseComponentDefinitions,
} from './base-components.definitions';

// Email component definitions
export {
  headerDefinition,
  footerDefinition,
  heroDefinition,
  listDefinition,
  ctaDefinition,
  emailComponentDefinitions,
} from './email-components.definitions';

// Registry initialization
export {
  createDefaultRegistry,
  registerDefaultComponents,
  getAllComponentDefinitions,
} from './registry-init';
