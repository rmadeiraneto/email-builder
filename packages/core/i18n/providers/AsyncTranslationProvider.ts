/**
 * Async Translation Provider
 *
 * Loads translations on-demand, useful for lazy-loading language packs.
 */

import type { AsyncTranslationProvider, TranslationDictionary } from '../types';

/**
 * Loader function type for async translations
 */
export type TranslationLoader = (locale: string) => Promise<TranslationDictionary>;

/**
 * Async translation provider that loads translations on demand
 */
export class AsyncTranslationProviderImpl implements AsyncTranslationProvider {
  private translations: Map<string, TranslationDictionary>;
  private loadedLocales: Set<string>;
  private loadingPromises: Map<string, Promise<void>>;
  private loader: TranslationLoader;
  private supportedLocales: string[];

  constructor(loader: TranslationLoader, supportedLocales: string[] = []) {
    this.translations = new Map();
    this.loadedLocales = new Set();
    this.loadingPromises = new Map();
    this.loader = loader;
    this.supportedLocales = supportedLocales;
  }

  /**
   * Load translations for a locale
   */
  async load(locale: string): Promise<void> {
    // Check if already loaded
    if (this.loadedLocales.has(locale)) {
      return;
    }

    // Check if currently loading
    const existingPromise = this.loadingPromises.get(locale);
    if (existingPromise) {
      return existingPromise;
    }

    // Start loading
    const loadPromise = this.loadTranslations(locale);
    this.loadingPromises.set(locale, loadPromise);

    try {
      await loadPromise;
    } finally {
      this.loadingPromises.delete(locale);
    }
  }

  /**
   * Check if locale is loaded
   */
  isLoaded(locale: string): boolean {
    return this.loadedLocales.has(locale);
  }

  /**
   * Get translation for a key
   */
  get(key: string, locale: string): string | undefined {
    if (!this.loadedLocales.has(locale)) {
      return undefined;
    }

    const translations = this.translations.get(locale);
    if (!translations) return undefined;

    return this.getNestedValue(translations, key);
  }

  /**
   * Get all translations for a locale
   */
  getAll(locale: string): TranslationDictionary | undefined {
    return this.translations.get(locale);
  }

  /**
   * Check if provider has translations for a locale
   */
  hasLocale(locale: string): boolean {
    return this.loadedLocales.has(locale) || this.supportedLocales.includes(locale);
  }

  /**
   * Get list of supported locales
   */
  getSupportedLocales(): string[] {
    return this.supportedLocales;
  }

  /**
   * Load translations from loader
   * @private
   */
  private async loadTranslations(locale: string): Promise<void> {
    try {
      const translations = await this.loader(locale);
      this.translations.set(locale, translations);
      this.loadedLocales.add(locale);
    } catch (error) {
      console.error(`Failed to load translations for locale ${locale}:`, error);
      throw error;
    }
  }

  /**
   * Get nested value from object using dot notation
   * @private
   */
  private getNestedValue(obj: TranslationDictionary, path: string): string | undefined {
    const keys = path.split('.');
    let current: string | TranslationDictionary | undefined = obj;

    for (const key of keys) {
      if (typeof current === 'object' && current !== null && key in current) {
        current = current[key];
      } else {
        return undefined;
      }
    }

    return typeof current === 'string' ? current : undefined;
  }
}
