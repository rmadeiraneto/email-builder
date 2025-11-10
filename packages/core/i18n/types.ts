/**
 * Translation System Types
 *
 * Defines the core types and interfaces for the translation framework.
 * Supports consumer-provided translations and auto-translation plugins.
 */

/**
 * Translation dictionary mapping keys to translated strings
 */
export type TranslationDictionary = {
  [key: string]: string | TranslationDictionary;
};

/**
 * Interpolation values for translation placeholders
 * @example t('welcome', { name: 'John' }) → "Welcome, John!"
 */
export type InterpolationValues = Record<string, string | number>;

/**
 * Translation provider interface
 * Implement this to provide custom translations to the builder
 */
export interface TranslationProvider {
  /**
   * Get translation for a key
   * @param key Translation key (e.g., 'ui.toolbar.new')
   * @param locale Locale to get translation for (e.g., 'es-ES')
   * @returns Translated string or undefined if not found
   */
  get(key: string, locale: string): string | undefined;

  /**
   * Get all translations for a locale
   * @param locale Locale to get translations for
   * @returns Full translation dictionary
   */
  getAll(locale: string): TranslationDictionary | undefined;

  /**
   * Check if provider has translations for a locale
   * @param locale Locale to check
   */
  hasLocale(locale: string): boolean;

  /**
   * Get list of supported locales
   */
  getSupportedLocales(): string[];
}

/**
 * Async translation provider for loading translations on demand
 */
export interface AsyncTranslationProvider extends TranslationProvider {
  /**
   * Load translations for a locale
   * @param locale Locale to load
   */
  load(locale: string): Promise<void>;

  /**
   * Check if locale is loaded
   * @param locale Locale to check
   */
  isLoaded(locale: string): boolean;
}

/**
 * Auto-translation plugin interface
 * Implement this to provide automatic translation using services like Google Translate
 */
export interface AutoTranslationPlugin {
  /**
   * Plugin name
   */
  name: string;

  /**
   * Translate a single key
   * @param key Translation key
   * @param sourceLocale Source locale (e.g., 'en-US')
   * @param targetLocale Target locale (e.g., 'es-ES')
   * @param sourceText Source text to translate
   * @returns Translated text
   */
  translate(
    key: string,
    sourceLocale: string,
    targetLocale: string,
    sourceText: string
  ): Promise<string>;

  /**
   * Translate multiple keys in a batch
   * @param items Array of translation items
   * @returns Map of keys to translated text
   */
  translateBatch(
    items: Array<{
      key: string;
      text: string;
    }>,
    sourceLocale: string,
    targetLocale: string
  ): Promise<Map<string, string>>;

  /**
   * Check if plugin supports a target locale
   * @param locale Locale to check
   */
  supportsLocale(locale: string): boolean;
}

/**
 * Translation manager configuration
 */
export interface TranslationConfig {
  /**
   * Default locale (fallback)
   * @default 'en-US'
   */
  defaultLocale?: string;

  /**
   * Current locale
   * @default 'en-US'
   */
  locale?: string;

  /**
   * Translation providers (in order of priority)
   * First provider that has a translation wins
   */
  providers?: TranslationProvider[];

  /**
   * Auto-translation plugin
   * Used when no provider has a translation for a key
   */
  autoTranslationPlugin?: AutoTranslationPlugin;

  /**
   * Enable auto-translation
   * @default false
   */
  enableAutoTranslation?: boolean;

  /**
   * Enable caching for auto-translated strings
   * @default true
   */
  enableCache?: boolean;

  /**
   * Warn on missing translations
   * @default true in development
   */
  warnOnMissing?: boolean;

  /**
   * Fallback to key if no translation found
   * @default true
   */
  fallbackToKey?: boolean;
}

/**
 * Translation function type
 */
export type TranslateFunction = (
  key: string,
  interpolation?: InterpolationValues,
  fallback?: string
) => string;

/**
 * Translation context value
 */
export interface TranslationContextValue {
  /**
   * Translate function
   */
  t: TranslateFunction;

  /**
   * Current locale
   */
  locale: string;

  /**
   * Set locale
   */
  setLocale: (locale: string) => void;

  /**
   * Get list of available locales
   */
  getAvailableLocales: () => string[];

  /**
   * Check if a locale is loaded
   */
  isLocaleLoaded: (locale: string) => boolean;
}

/**
 * Translation event types
 */
export enum TranslationEvent {
  LOCALE_CHANGED = 'translation:locale-changed',
  TRANSLATIONS_LOADED = 'translation:translations-loaded',
  AUTO_TRANSLATION_STARTED = 'translation:auto-translation-started',
  AUTO_TRANSLATION_COMPLETED = 'translation:auto-translation-completed',
  MISSING_TRANSLATION = 'translation:missing-translation',
}

/**
 * Translation event data
 */
export interface TranslationEventData {
  [TranslationEvent.LOCALE_CHANGED]: {
    previousLocale: string;
    currentLocale: string;
  };
  [TranslationEvent.TRANSLATIONS_LOADED]: {
    locale: string;
    provider: string;
  };
  [TranslationEvent.AUTO_TRANSLATION_STARTED]: {
    locale: string;
    keysCount: number;
  };
  [TranslationEvent.AUTO_TRANSLATION_COMPLETED]: {
    locale: string;
    keysCount: number;
    duration: number;
  };
  [TranslationEvent.MISSING_TRANSLATION]: {
    key: string;
    locale: string;
  };
}
