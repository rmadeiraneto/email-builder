/**
 * Static Translation Provider
 *
 * Provides translations from pre-defined dictionaries.
 * Best for consumer-provided translations loaded at initialization.
 */

import type { TranslationProvider, TranslationDictionary } from '../types';

/**
 * Static translation provider that uses pre-defined dictionaries
 */
export class StaticTranslationProvider implements TranslationProvider {
  private translations: Map<string, TranslationDictionary>;

  constructor(translations: Record<string, TranslationDictionary> = {}) {
    this.translations = new Map(Object.entries(translations));
  }

  /**
   * Add translations for a locale
   */
  addTranslations(locale: string, translations: TranslationDictionary): void {
    const existing = this.translations.get(locale);
    if (existing) {
      // Deep merge
      this.translations.set(locale, this.deepMerge(existing, translations));
    } else {
      this.translations.set(locale, translations);
    }
  }

  /**
   * Get translation for a key using dot notation
   * @example get('ui.toolbar.new', 'es-ES') → 'Nuevo'
   */
  get(key: string, locale: string): string | undefined {
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
    return this.translations.has(locale);
  }

  /**
   * Get list of supported locales
   */
  getSupportedLocales(): string[] {
    return Array.from(this.translations.keys());
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

  /**
   * Deep merge two translation dictionaries
   * @private
   */
  private deepMerge(
    target: TranslationDictionary,
    source: TranslationDictionary
  ): TranslationDictionary {
    const result = { ...target };

    for (const key in source) {
      const targetValue = result[key];
      const sourceValue = source[key];

      if (
        typeof targetValue === 'object' &&
        targetValue !== null &&
        typeof sourceValue === 'object' &&
        sourceValue !== null
      ) {
        result[key] = this.deepMerge(
          targetValue as TranslationDictionary,
          sourceValue as TranslationDictionary
        );
      } else if (sourceValue !== undefined) {
        result[key] = sourceValue;
      }
    }

    return result;
  }
}
