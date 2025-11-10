/**
 * Internationalization (i18n) System
 *
 * Provides comprehensive translation support for the email builder,
 * including consumer-provided translations and auto-translation plugins.
 *
 * @example
 * ```ts
 * // Setup with consumer-provided translations
 * const translations = {
 *   'en-US': { ui: { toolbar: { new: 'New' } } },
 *   'es-ES': { ui: { toolbar: { new: 'Nuevo' } } }
 * };
 *
 * const provider = new StaticTranslationProvider(translations);
 * const manager = new TranslationManager({ providers: [provider] });
 *
 * // Setup with auto-translation
 * const googlePlugin = new GoogleTranslatePlugin({ apiKey: 'YOUR_API_KEY' });
 * const manager = new TranslationManager({
 *   enableAutoTranslation: true,
 *   autoTranslationPlugin: googlePlugin
 * });
 * ```
 */

// Types
export type {
  TranslationDictionary,
  InterpolationValues,
  TranslationProvider,
  AsyncTranslationProvider,
  AutoTranslationPlugin,
  TranslationConfig,
  TranslateFunction,
  TranslationContextValue,
  TranslationEventData,
} from './types';

export { TranslationEvent } from './types';

// Core
export { TranslationManager } from './TranslationManager';

// Providers
export { StaticTranslationProvider, AsyncTranslationProviderImpl } from './providers';
export type { TranslationLoader } from './providers';

// Plugins
export { GoogleTranslatePlugin } from './plugins';
export type { GoogleTranslateConfig } from './plugins';
