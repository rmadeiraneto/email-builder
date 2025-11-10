/**
 * Basic Translation Example
 *
 * Demonstrates how to set up translations with consumer-provided dictionaries.
 */

import { Builder } from '../builder/Builder';
import { StaticTranslationProvider, enUS, esES } from '../i18n';

// Example 1: Basic setup with static translations
const translations = {
  'en-US': enUS,
  'es-ES': esES,
  'fr-FR': {
    ui: {
      toolbar: {
        new: 'Nouveau',
        save: 'Enregistrer',
        load: 'Charger',
        undo: 'Annuler',
        redo: 'Refaire',
        export: 'Exporter',
        preview: 'Aperçu',
      },
    },
    property: {
      canvas: {
        width: 'Largeur du canevas',
        background: 'Arrière-plan du canevas',
      },
      button: {
        text: 'Texte du bouton',
        background: 'Arrière-plan du bouton',
      },
    },
  },
};

// Create translation provider
const translationProvider = new StaticTranslationProvider(translations);

// Create builder with translation support
const builder = new Builder({
  target: 'email',
  locale: 'en-US', // Default locale
  storage: {
    method: 'local',
  },
  translation: {
    defaultLocale: 'en-US',
    locale: 'en-US',
    providers: [translationProvider],
    warnOnMissing: true,
    fallbackToKey: true,
  },
});

// Initialize builder
await builder.initialize();

// Get translation manager
const translationManager = builder.getTranslationManager();
if (!translationManager) {
  throw new Error('Translation manager not initialized');
}

// Get translate function
const t = translationManager.getTranslateFunction();

// Use translations
console.log(t('ui.toolbar.new')); // 'New'
console.log(t('property.canvas.width')); // 'Canvas Width'

// Switch to Spanish
translationManager.setLocale('es-ES');
console.log(t('ui.toolbar.new')); // 'Nuevo'
console.log(t('property.canvas.width')); // 'Ancho del lienzo'

// Switch to French
translationManager.setLocale('fr-FR');
console.log(t('ui.toolbar.new')); // 'Nouveau'
console.log(t('property.canvas.width')); // 'Largeur du canevas'

// Example 2: Partial translations with fallback
const partialTranslations = {
  'en-US': enUS,
  'de-DE': {
    ui: {
      toolbar: {
        new: 'Neu',
        save: 'Speichern',
        // Other keys missing - will fall back to English
      },
    },
  },
};

const partialProvider = new StaticTranslationProvider(partialTranslations);

const builderWithFallback = new Builder({
  target: 'email',
  storage: { method: 'local' },
  translation: {
    defaultLocale: 'en-US',
    locale: 'de-DE',
    providers: [partialProvider],
    fallbackToKey: false, // Use default locale instead of key
  },
});

await builderWithFallback.initialize();
const tWithFallback = builderWithFallback.getTranslationManager()!.getTranslateFunction();

console.log(tWithFallback('ui.toolbar.new')); // 'Neu' (from German)
console.log(tWithFallback('ui.toolbar.export')); // 'Export' (fallback to English)

// Example 3: Translation with interpolation
const message = t('message.saveSuccess'); // 'Template saved successfully'
const userMessage = t('validation.minValue', { min: 10 }); // 'Value must be at least 10'

export {
  builder,
  translationProvider,
  builderWithFallback,
};
