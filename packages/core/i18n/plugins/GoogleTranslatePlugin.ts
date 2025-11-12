/**
 * Google Translate Auto-Translation Plugin
 *
 * Provides automatic translation using Google Cloud Translation API.
 * Supports batch translation and caching to minimize API calls.
 */

import type { AutoTranslationPlugin } from '../types';

/**
 * Google Translate API configuration
 */
export interface GoogleTranslateConfig {
  /**
   * Google Cloud API key
   */
  apiKey: string;

  /**
   * API endpoint (optional, defaults to Google's official endpoint)
   */
  endpoint?: string;

  /**
   * Enable request batching
   * @default true
   */
  enableBatching?: boolean;

  /**
   * Max batch size for translation requests
   * @default 100
   */
  maxBatchSize?: number;

  /**
   * Timeout for API requests in milliseconds
   * @default 10000
   */
  timeout?: number;

  /**
   * Retry failed requests
   * @default true
   */
  retry?: boolean;

  /**
   * Max retry attempts
   * @default 3
   */
  maxRetries?: number;
}

/**
 * Google Translate API response format
 */
interface GoogleTranslateResponse {
  data: {
    translations: Array<{
      translatedText: string;
      detectedSourceLanguage?: string;
    }>;
  };
}

/**
 * Supported locale mappings (Google uses different codes)
 */
const LOCALE_MAPPINGS: Record<string, string> = {
  'en-US': 'en',
  'en-GB': 'en',
  'es-ES': 'es',
  'es-MX': 'es',
  'fr-FR': 'fr',
  'fr-CA': 'fr',
  'de-DE': 'de',
  'it-IT': 'it',
  'pt-BR': 'pt',
  'pt-PT': 'pt',
  'ja-JP': 'ja',
  'ko-KR': 'ko',
  'zh-CN': 'zh-CN',
  'zh-TW': 'zh-TW',
  'ru-RU': 'ru',
  'ar-SA': 'ar',
  'hi-IN': 'hi',
  'nl-NL': 'nl',
  'pl-PL': 'pl',
  'tr-TR': 'tr',
  'sv-SE': 'sv',
  'da-DK': 'da',
  'fi-FI': 'fi',
  'no-NO': 'no',
  'cs-CZ': 'cs',
  'el-GR': 'el',
  'he-IL': 'he',
  'th-TH': 'th',
  'vi-VN': 'vi',
  'id-ID': 'id',
  'ms-MY': 'ms',
  'uk-UA': 'uk',
};

/**
 * Google Translate auto-translation plugin
 */
export class GoogleTranslatePlugin implements AutoTranslationPlugin {
  name = 'google-translate';
  private config: Required<GoogleTranslateConfig>;
  private endpoint: string;
  private cache: Map<string, string>; // cacheKey -> translation

  constructor(config: GoogleTranslateConfig) {
    this.config = {
      apiKey: config.apiKey,
      endpoint: config.endpoint ?? 'https://translation.googleapis.com/language/translate/v2',
      enableBatching: config.enableBatching ?? true,
      maxBatchSize: config.maxBatchSize ?? 100,
      timeout: config.timeout ?? 10000,
      retry: config.retry ?? true,
      maxRetries: config.maxRetries ?? 3,
    };
    this.endpoint = this.config.endpoint;
    this.cache = new Map();
  }

  /**
   * Translate a single key
   */
  async translate(
    key: string,
    sourceLocale: string,
    targetLocale: string,
    sourceText: string
  ): Promise<string> {
    const cacheKey = this.getCacheKey(key, sourceLocale, targetLocale);

    // Check cache
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const sourceLang = this.normalizeLocale(sourceLocale);
    const targetLang = this.normalizeLocale(targetLocale);

    // If same language, return source text
    if (sourceLang === targetLang) {
      return sourceText;
    }

    try {
      const translation = await this.translateWithRetry(
        sourceText,
        sourceLang,
        targetLang
      );

      // Cache the result
      this.cache.set(cacheKey, translation);
      return translation;
    } catch (error) {
      console.error(`Google Translate API error for key "${key}":`, error);
      throw error;
    }
  }

  /**
   * Translate multiple keys in a batch
   */
  async translateBatch(
    items: Array<{ key: string; text: string }>,
    sourceLocale: string,
    targetLocale: string
  ): Promise<Map<string, string>> {
    const results = new Map<string, string>();
    const sourceLang = this.normalizeLocale(sourceLocale);
    const targetLang = this.normalizeLocale(targetLocale);

    // If same language, return source texts
    if (sourceLang === targetLang) {
      items.forEach(({ key, text }) => results.set(key, text));
      return results;
    }

    // Filter out cached items
    const itemsToTranslate: Array<{ key: string; text: string; index: number }> = [];

    items.forEach((item, index) => {
      const cacheKey = this.getCacheKey(item.key, sourceLocale, targetLocale);
      const cached = this.cache.get(cacheKey);

      if (cached) {
        results.set(item.key, cached);
      } else {
        itemsToTranslate.push({ ...item, index });
      }
    });

    // If all were cached, return early
    if (itemsToTranslate.length === 0) {
      return results;
    }

    // Split into batches if needed
    const batches = this.splitIntoBatches(itemsToTranslate, this.config.maxBatchSize);

    // Translate each batch
    for (const batch of batches) {
      try {
        const translations = await this.translateBatchWithRetry(
          batch.map((item) => item.text),
          sourceLang,
          targetLang
        );

        // Map translations back to keys
        batch.forEach((item, i) => {
          const translation = translations[i];
          if (translation) {
            results.set(item.key, translation);

            // Cache the result
            const cacheKey = this.getCacheKey(item.key, sourceLocale, targetLocale);
            this.cache.set(cacheKey, translation);
          }
        });
      } catch (error) {
        console.error('Batch translation failed:', error);
        // Continue with next batch even if this one fails
      }
    }

    return results;
  }

  /**
   * Check if plugin supports a target locale
   */
  supportsLocale(locale: string): boolean {
    const normalized = this.normalizeLocale(locale);
    return normalized !== locale || locale in LOCALE_MAPPINGS;
  }

  /**
   * Clear translation cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Translate with retry logic
   * @private
   */
  private async translateWithRetry(
    text: string,
    sourceLang: string,
    targetLang: string,
    attempt = 1
  ): Promise<string> {
    try {
      return await this.callGoogleTranslateAPI([text], sourceLang, targetLang).then(
        (results) => results[0] || ''
      );
    } catch (error) {
      if (this.config.retry && attempt < this.config.maxRetries) {
        // Exponential backoff
        const delay = Math.pow(2, attempt) * 1000;
        await this.sleep(delay);
        return this.translateWithRetry(text, sourceLang, targetLang, attempt + 1);
      }
      throw error;
    }
  }

  /**
   * Translate batch with retry logic
   * @private
   */
  private async translateBatchWithRetry(
    texts: string[],
    sourceLang: string,
    targetLang: string,
    attempt = 1
  ): Promise<string[]> {
    try {
      return await this.callGoogleTranslateAPI(texts, sourceLang, targetLang);
    } catch (error) {
      if (this.config.retry && attempt < this.config.maxRetries) {
        const delay = Math.pow(2, attempt) * 1000;
        await this.sleep(delay);
        return this.translateBatchWithRetry(texts, sourceLang, targetLang, attempt + 1);
      }
      throw error;
    }
  }

  /**
   * Call Google Translate API
   * @private
   */
  private async callGoogleTranslateAPI(
    texts: string[],
    sourceLang: string,
    targetLang: string
  ): Promise<string[]> {
    const url = `${this.endpoint}?key=${this.config.apiKey}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: texts,
          source: sourceLang,
          target: targetLang,
          format: 'text',
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Google Translate API error: ${response.status} ${response.statusText}`);
      }

      const data: GoogleTranslateResponse = await response.json();
      return data.data.translations.map((t) => t.translatedText);
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Normalize locale to Google Translate language code
   * @private
   */
  private normalizeLocale(locale: string): string {
    return LOCALE_MAPPINGS[locale] ?? locale.split('-')[0] ?? locale;
  }

  /**
   * Get cache key for a translation
   * @private
   */
  private getCacheKey(key: string, sourceLocale: string, targetLocale: string): string {
    return `${key}:${sourceLocale}:${targetLocale}`;
  }

  /**
   * Split array into batches
   * @private
   */
  private splitIntoBatches<T>(items: T[], batchSize: number): T[][] {
    const batches: T[][] = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }
    return batches;
  }

  /**
   * Sleep utility
   * @private
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
