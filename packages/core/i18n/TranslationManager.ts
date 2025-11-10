/**
 * Translation Manager
 *
 * Core translation service that orchestrates multiple providers,
 * handles auto-translation, caching, and fallbacks.
 */

import type {
  TranslationConfig,
  TranslationProvider,
  AsyncTranslationProvider,
  AutoTranslationPlugin,
  InterpolationValues,
  TranslateFunction,
  TranslationEvent,
  TranslationEventData,
} from './types';
import type { EventEmitter } from '../services/EventEmitter';

/**
 * Translation manager that handles all translation operations
 */
export class TranslationManager {
  private config: Required<TranslationConfig>;
  private providers: TranslationProvider[];
  private autoTranslationPlugin?: AutoTranslationPlugin;
  private cache: Map<string, Map<string, string>>; // locale -> key -> translation
  private eventEmitter?: EventEmitter;
  private currentLocale: string;
  private defaultLocale: string;

  constructor(config: TranslationConfig = {}, eventEmitter?: EventEmitter) {
    this.defaultLocale = config.defaultLocale ?? 'en-US';
    this.currentLocale = config.locale ?? this.defaultLocale;
    this.providers = config.providers ?? [];
    this.autoTranslationPlugin = config.autoTranslationPlugin;
    this.cache = new Map();
    this.eventEmitter = eventEmitter;

    this.config = {
      defaultLocale: this.defaultLocale,
      locale: this.currentLocale,
      providers: this.providers,
      autoTranslationPlugin: this.autoTranslationPlugin,
      enableAutoTranslation: config.enableAutoTranslation ?? false,
      enableCache: config.enableCache ?? true,
      warnOnMissing: config.warnOnMissing ?? (process.env.NODE_ENV !== 'production'),
      fallbackToKey: config.fallbackToKey ?? true,
    };
  }

  /**
   * Get current locale
   */
  getLocale(): string {
    return this.currentLocale;
  }

  /**
   * Set current locale
   */
  setLocale(locale: string): void {
    if (locale === this.currentLocale) return;

    const previousLocale = this.currentLocale;
    this.currentLocale = locale;

    // Emit locale change event
    this.emitEvent(TranslationEvent.LOCALE_CHANGED, {
      previousLocale,
      currentLocale: locale,
    });
  }

  /**
   * Get list of available locales from all providers
   */
  getAvailableLocales(): string[] {
    const locales = new Set<string>();
    locales.add(this.defaultLocale);

    for (const provider of this.providers) {
      provider.getSupportedLocales().forEach((locale) => locales.add(locale));
    }

    return Array.from(locales);
  }

  /**
   * Add a translation provider
   */
  addProvider(provider: TranslationProvider): void {
    this.providers.push(provider);
  }

  /**
   * Create translate function
   */
  getTranslateFunction(): TranslateFunction {
    return (key: string, interpolation?: InterpolationValues, fallback?: string): string => {
      return this.translate(key, interpolation, fallback);
    };
  }

  /**
   * Translate a key
   */
  translate(
    key: string,
    interpolation?: InterpolationValues,
    fallback?: string
  ): string {
    // Try to get translation
    let translation = this.getTranslation(key, this.currentLocale);

    // If not found and current locale is not default, try default locale
    if (!translation && this.currentLocale !== this.defaultLocale) {
      translation = this.getTranslation(key, this.defaultLocale);
    }

    // If still not found, use fallback or key
    if (!translation) {
      if (this.config.warnOnMissing) {
        console.warn(`Missing translation for key "${key}" in locale "${this.currentLocale}"`);
        this.emitEvent(TranslationEvent.MISSING_TRANSLATION, {
          key,
          locale: this.currentLocale,
        });
      }
      translation = fallback ?? (this.config.fallbackToKey ? key : '');
    }

    // Apply interpolation if provided
    if (interpolation && translation) {
      translation = this.interpolate(translation, interpolation);
    }

    return translation;
  }

  /**
   * Translate multiple keys in batch
   */
  async translateBatch(
    keys: string[],
    targetLocale?: string
  ): Promise<Map<string, string>> {
    const locale = targetLocale ?? this.currentLocale;
    const results = new Map<string, string>();

    for (const key of keys) {
      let translation = this.getTranslation(key, locale);

      // If not found and auto-translation is enabled, try to auto-translate
      if (!translation && this.config.enableAutoTranslation && this.autoTranslationPlugin) {
        const sourceText = this.getTranslation(key, this.defaultLocale);
        if (sourceText) {
          translation = await this.autoTranslate(key, sourceText, locale);
        }
      }

      if (translation) {
        results.set(key, translation);
      }
    }

    return results;
  }

  /**
   * Load translations for a locale (if using async provider)
   */
  async loadLocale(locale: string): Promise<void> {
    for (const provider of this.providers) {
      if (this.isAsyncProvider(provider) && !provider.isLoaded(locale)) {
        await provider.load(locale);
        this.emitEvent(TranslationEvent.TRANSLATIONS_LOADED, {
          locale,
          provider: provider.constructor.name,
        });
      }
    }
  }

  /**
   * Check if a locale is loaded
   */
  isLocaleLoaded(locale: string): boolean {
    for (const provider of this.providers) {
      if (provider.hasLocale(locale)) {
        if (this.isAsyncProvider(provider)) {
          return provider.isLoaded(locale);
        }
        return true;
      }
    }
    return false;
  }

  /**
   * Get translation from providers or cache
   * @private
   */
  private getTranslation(key: string, locale: string): string | undefined {
    // Check cache first
    if (this.config.enableCache) {
      const cachedTranslation = this.getCachedTranslation(key, locale);
      if (cachedTranslation) {
        return cachedTranslation;
      }
    }

    // Try each provider in order
    for (const provider of this.providers) {
      const translation = provider.get(key, locale);
      if (translation) {
        // Cache the result
        if (this.config.enableCache) {
          this.setCachedTranslation(key, locale, translation);
        }
        return translation;
      }
    }

    return undefined;
  }

  /**
   * Auto-translate a key using the plugin
   * @private
   */
  private async autoTranslate(
    key: string,
    sourceText: string,
    targetLocale: string
  ): Promise<string | undefined> {
    if (!this.autoTranslationPlugin) return undefined;

    try {
      const translation = await this.autoTranslationPlugin.translate(
        key,
        this.defaultLocale,
        targetLocale,
        sourceText
      );

      // Cache the auto-translated result
      if (this.config.enableCache && translation) {
        this.setCachedTranslation(key, targetLocale, translation);
      }

      return translation;
    } catch (error) {
      console.error(`Auto-translation failed for key "${key}":`, error);
      return undefined;
    }
  }

  /**
   * Interpolate values into translation string
   * @private
   */
  private interpolate(text: string, values: InterpolationValues): string {
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      const value = values[key];
      return value !== undefined ? String(value) : match;
    });
  }

  /**
   * Get cached translation
   * @private
   */
  private getCachedTranslation(key: string, locale: string): string | undefined {
    const localeCache = this.cache.get(locale);
    if (!localeCache) return undefined;
    return localeCache.get(key);
  }

  /**
   * Set cached translation
   * @private
   */
  private setCachedTranslation(key: string, locale: string, translation: string): void {
    let localeCache = this.cache.get(locale);
    if (!localeCache) {
      localeCache = new Map();
      this.cache.set(locale, localeCache);
    }
    localeCache.set(key, translation);
  }

  /**
   * Check if provider is async
   * @private
   */
  private isAsyncProvider(provider: TranslationProvider): provider is AsyncTranslationProvider {
    return 'load' in provider && 'isLoaded' in provider;
  }

  /**
   * Emit translation event
   * @private
   */
  private emitEvent<T extends TranslationEvent>(
    event: T,
    data: TranslationEventData[T]
  ): void {
    if (this.eventEmitter) {
      this.eventEmitter.emit(event, data);
    }
  }

  /**
   * Clear translation cache
   */
  clearCache(locale?: string): void {
    if (locale) {
      this.cache.delete(locale);
    } else {
      this.cache.clear();
    }
  }
}
