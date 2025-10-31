/**
 * Component factories
 *
 * Factory functions for creating component instances
 */

// Utilities
export * from './utils';

// Base component factories
export {
  createButton,
  createText,
  createImage,
  createSeparator,
  createSpacer,
} from './base-components.factories';

// Email component factories
export {
  createHeader,
  createFooter,
  createHero,
  createList,
  createCTA,
} from './email-components.factories';
