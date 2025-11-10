/**
 * Auto-Translation Example
 *
 * Demonstrates how to use the Google Translate plugin for automatic translation.
 */

import { Builder } from '../builder/Builder';
import { StaticTranslationProvider, GoogleTranslatePlugin, enUS } from '../i18n';

// Example 1: Auto-translation with Google Translate
const googlePlugin = new GoogleTranslatePlugin({
  apiKey: 'YOUR_GOOGLE_CLOUD_API_KEY',
  enableBatching: true,
  maxBatchSize: 100,
  timeout: 10000,
});

// Set up default English translations
const defaultProvider = new StaticTranslationProvider({
  'en-US': enUS,
});

const builder = new Builder({
  target: 'email',
  storage: { method: 'local' },
  translation: {
    defaultLocale: 'en-US',
    locale: 'en-US',
    providers: [defaultProvider],
    autoTranslationPlugin: googlePlugin,
    enableAutoTranslation: true,
    enableCache: true, // Cache auto-translated strings
    warnOnMissing: false, // Don't warn since we're using auto-translation
  },
});

await builder.initialize();

const translationManager = builder.getTranslationManager()!;
const t = translationManager.getTranslateFunction();

// Example 2: Switch to a language without translations
// This will automatically translate from English
translationManager.setLocale('ja-JP');

// These will be auto-translated to Japanese
console.log(t('ui.toolbar.new')); // 'New' -> '新規' (auto-translated)
console.log(t('ui.toolbar.save')); // 'Save' -> '保存' (auto-translated)

// Example 3: Batch translation for better performance
const keysToTranslate = [
  'ui.toolbar.new',
  'ui.toolbar.save',
  'ui.toolbar.load',
  'property.canvas.width',
  'property.button.text',
];

const translations = await translationManager.translateBatch(keysToTranslate, 'ko-KR');

translations.forEach((translation, key) => {
  console.log(`${key} -> ${translation}`);
});

// Example 4: Hybrid approach - Consumer translations + Auto-translation fallback
// This is the recommended approach for production
const hybridProvider = new StaticTranslationProvider({
  'en-US': enUS,
  'es-ES': {
    // Partial Spanish translations
    ui: {
      toolbar: {
        new: 'Nuevo',
        save: 'Guardar',
        // Missing keys will be auto-translated
      },
    },
  },
});

const hybridBuilder = new Builder({
  target: 'email',
  storage: { method: 'local' },
  translation: {
    defaultLocale: 'en-US',
    locale: 'es-ES',
    providers: [hybridProvider],
    autoTranslationPlugin: googlePlugin,
    enableAutoTranslation: true,
    enableCache: true,
  },
});

await hybridBuilder.initialize();
const hybridT = hybridBuilder.getTranslationManager()!.getTranslateFunction();

// 'Nuevo' (from static translations)
console.log(hybridT('ui.toolbar.new'));

// Auto-translated (not in static translations)
console.log(hybridT('property.canvas.width'));

// Example 5: Pre-load translations for a locale
await translationManager.loadLocale('zh-CN');

// Now switching to Chinese is instant (no async translation needed)
translationManager.setLocale('zh-CN');
console.log(t('ui.toolbar.new')); // Already translated and cached

export {
  builder,
  googlePlugin,
  hybridBuilder,
};
