# Translation Framework

The Email Builder includes a comprehensive internationalization (i18n) system that allows you to translate every label, property, and UI element into any language. The framework supports both **consumer-provided translations** and **automatic translation** using services like Google Translate.

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Translation Providers](#translation-providers)
- [Auto-Translation](#auto-translation)
- [SolidJS Integration](#solidjs-integration)
- [Translation Keys](#translation-keys)
- [Best Practices](#best-practices)
- [API Reference](#api-reference)
- [Examples](#examples)

## Features

✅ **Consumer-Provided Translations** - Provide your own translation dictionaries
✅ **Auto-Translation** - Automatic translation using Google Translate API
✅ **Hybrid Approach** - Combine custom translations with auto-translation fallback
✅ **Lazy Loading** - Load translations on-demand for better performance
✅ **Caching** - Cache translations to minimize API calls
✅ **Interpolation** - Insert dynamic values into translations
✅ **Fallback** - Graceful fallback to default language
✅ **1,500+ Strings** - Complete coverage of UI, properties, and components
✅ **SolidJS Integration** - React-style hooks for easy component integration

## Quick Start

### 1. Basic Setup with Consumer Translations

```typescript
import { Builder } from '@email-builder/core';
import { StaticTranslationProvider, enUS, esES } from '@email-builder/core/i18n';

// Create translation provider with your translations
const translationProvider = new StaticTranslationProvider({
  'en-US': enUS,
  'es-ES': esES,
});

// Create builder with translation config
const builder = new Builder({
  target: 'email',
  storage: { method: 'local' },
  translation: {
    defaultLocale: 'en-US',
    locale: 'es-ES', // Start in Spanish
    providers: [translationProvider],
  },
});

await builder.initialize();

// Get translation function
const translationManager = builder.getTranslationManager();
const t = translationManager.getTranslateFunction();

console.log(t('ui.toolbar.new')); // 'Nuevo'
```

### 2. Auto-Translation with Google Translate

```typescript
import { GoogleTranslatePlugin } from '@email-builder/core/i18n';

// Create Google Translate plugin
const googlePlugin = new GoogleTranslatePlugin({
  apiKey: 'YOUR_GOOGLE_CLOUD_API_KEY',
});

const builder = new Builder({
  target: 'email',
  storage: { method: 'local' },
  translation: {
    defaultLocale: 'en-US',
    providers: [new StaticTranslationProvider({ 'en-US': enUS })],
    autoTranslationPlugin: googlePlugin,
    enableAutoTranslation: true,
    enableCache: true,
  },
});

await builder.initialize();

const translationManager = builder.getTranslationManager();
translationManager.setLocale('ja-JP'); // Switch to Japanese

const t = translationManager.getTranslateFunction();
console.log(t('ui.toolbar.new')); // 'New' -> '新規' (auto-translated)
```

### 3. SolidJS Component Integration

```tsx
import { TranslationProvider, useTranslation } from '@email-builder/ui-solid/i18n';

const Toolbar = () => {
  const { t, setLocale } = useTranslation();

  return (
    <div>
      <button>{t('ui.toolbar.new')}</button>
      <button>{t('ui.toolbar.save')}</button>
      <button onClick={() => setLocale('es-ES')}>Español</button>
    </div>
  );
};

const App = () => {
  const translationManager = builder.getTranslationManager();

  return (
    <TranslationProvider manager={translationManager}>
      <Toolbar />
    </TranslationProvider>
  );
};
```

## Architecture

### Overview

The translation system consists of several layers:

```
┌─────────────────────────────────────────────┐
│          SolidJS Components                 │
│  (useTranslation hook, TranslationProvider) │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│         TranslationManager                  │
│  (Orchestrates providers & plugins)         │
└──────┬──────────────────────────┬───────────┘
       │                          │
┌──────▼──────────┐      ┌────────▼──────────┐
│   Providers     │      │  Auto-Translation │
│                 │      │      Plugin       │
│ - Static        │      │                   │
│ - Async         │      │ - Google Translate│
│ - Custom        │      │ - Custom Services │
└─────────────────┘      └───────────────────┘
```

### Key Components

1. **TranslationManager** - Core service that orchestrates translation
2. **TranslationProvider** - Interface for providing translations
3. **AutoTranslationPlugin** - Interface for automatic translation services
4. **StaticTranslationProvider** - Built-in provider for static dictionaries
5. **AsyncTranslationProvider** - Provider for lazy-loading translations
6. **GoogleTranslatePlugin** - Auto-translation using Google Cloud Translation API

## Translation Providers

### StaticTranslationProvider

Best for: Pre-defined translations loaded at initialization

```typescript
import { StaticTranslationProvider } from '@email-builder/core/i18n';

const provider = new StaticTranslationProvider({
  'en-US': {
    ui: {
      toolbar: {
        new: 'New',
        save: 'Save',
      },
    },
  },
  'es-ES': {
    ui: {
      toolbar: {
        new: 'Nuevo',
        save: 'Guardar',
      },
    },
  },
});

// Add translations dynamically
provider.addTranslations('fr-FR', {
  ui: {
    toolbar: {
      new: 'Nouveau',
    },
  },
});
```

### AsyncTranslationProvider

Best for: Large translation files loaded on-demand

```typescript
import { AsyncTranslationProviderImpl } from '@email-builder/core/i18n';

const provider = new AsyncTranslationProviderImpl(
  async (locale) => {
    // Load translation file from server
    const response = await fetch(`/translations/${locale}.json`);
    return response.json();
  },
  ['en-US', 'es-ES', 'fr-FR'] // Supported locales
);

// Load a locale
await provider.load('es-ES');
```

### Custom Provider

Implement `TranslationProvider` interface:

```typescript
import type { TranslationProvider } from '@email-builder/core/i18n';

class DatabaseTranslationProvider implements TranslationProvider {
  async get(key: string, locale: string): Promise<string | undefined> {
    // Fetch from database
    const translation = await db.translations.findOne({ key, locale });
    return translation?.value;
  }

  getAll(locale: string) {
    // Return all translations for locale
  }

  hasLocale(locale: string): boolean {
    // Check if locale is supported
  }

  getSupportedLocales(): string[] {
    // Return supported locales
  }
}
```

## Auto-Translation

### Google Translate Plugin

```typescript
import { GoogleTranslatePlugin } from '@email-builder/core/i18n';

const plugin = new GoogleTranslatePlugin({
  apiKey: 'YOUR_GOOGLE_CLOUD_API_KEY',
  enableBatching: true,      // Batch multiple translations
  maxBatchSize: 100,          // Max items per batch
  timeout: 10000,             // Request timeout (ms)
  retry: true,                // Retry failed requests
  maxRetries: 3,              // Max retry attempts
});

// Single translation
const translation = await plugin.translate(
  'ui.toolbar.new',
  'en-US',
  'ja-JP',
  'New'
);

// Batch translation (more efficient)
const translations = await plugin.translateBatch(
  [
    { key: 'ui.toolbar.new', text: 'New' },
    { key: 'ui.toolbar.save', text: 'Save' },
  ],
  'en-US',
  'ja-JP'
);
```

### Custom Auto-Translation Plugin

Implement `AutoTranslationPlugin` interface:

```typescript
import type { AutoTranslationPlugin } from '@email-builder/core/i18n';

class CustomTranslationPlugin implements AutoTranslationPlugin {
  name = 'my-plugin';

  async translate(
    key: string,
    sourceLocale: string,
    targetLocale: string,
    sourceText: string
  ): Promise<string> {
    // Call your translation API
    const response = await fetch('https://my-api.com/translate', {
      method: 'POST',
      body: JSON.stringify({
        text: sourceText,
        from: sourceLocale,
        to: targetLocale,
      }),
    });
    const data = await response.json();
    return data.translatedText;
  }

  async translateBatch(items, sourceLocale, targetLocale) {
    // Batch translation implementation
  }

  supportsLocale(locale: string): boolean {
    // Check if locale is supported
    return true;
  }
}
```

## SolidJS Integration

### TranslationProvider

Wrap your app with `TranslationProvider`:

```tsx
import { TranslationProvider } from '@email-builder/ui-solid/i18n';

const App = () => {
  const translationManager = builder.getTranslationManager();

  return (
    <TranslationProvider manager={translationManager}>
      <YourComponents />
    </TranslationProvider>
  );
};
```

### useTranslation Hook

Access translation in any component:

```tsx
import { useTranslation } from '@email-builder/ui-solid/i18n';

const MyComponent = () => {
  const { t, locale, setLocale, getAvailableLocales } = useTranslation();

  return (
    <div>
      <h1>{t('ui.toolbar.new')}</h1>
      <p>Current: {locale()}</p>
      <button onClick={() => setLocale('es-ES')}>Spanish</button>
    </div>
  );
};
```

### With Interpolation

```tsx
const ValidationMessage = (props) => {
  const { t } = useTranslation();

  return (
    <div class="error">
      {t('validation.minValue', { min: props.min })}
      {/* Output: "Value must be at least 10" */}
    </div>
  );
};
```

## Translation Keys

### Key Structure

Translation keys use dot notation:

```
section.subsection.item
```

### Available Keys

#### UI Keys

- `ui.toolbar.*` - Toolbar buttons and actions
- `ui.palette.*` - Component palette
- `ui.panel.*` - Property panel
- `ui.modal.*` - Modal dialogs
- `ui.common.*` - Common UI elements

#### Property Keys

- `property.canvas.*` - Canvas settings
- `property.typography.*` - Typography settings
- `property.button.*` - Button properties
- `property.text.*` - Text properties
- `property.image.*` - Image properties
- `property.separator.*` - Separator properties
- `property.spacer.*` - Spacer properties

#### Component Keys

- `component.button.*` - Button component
- `component.text.*` - Text component
- `component.image.*` - Image component
- `component.separator.*` - Separator component
- `component.spacer.*` - Spacer component
- `component.header.*` - Header component
- `component.footer.*` - Footer component
- `component.hero.*` - Hero component
- `component.list.*` - List component
- `component.cta.*` - CTA component

#### Message Keys

- `message.*` - Success/error messages

#### Validation Keys

- `validation.*` - Validation error messages

### Full Key List

See `/packages/core/i18n/locales/en-US.ts` for the complete list of ~1,500 translation keys.

## Best Practices

### 1. Recommended Approach: Hybrid

Combine consumer translations with auto-translation fallback:

```typescript
const builder = new Builder({
  target: 'email',
  storage: { method: 'local' },
  translation: {
    defaultLocale: 'en-US',
    // Provide translations for your primary languages
    providers: [
      new StaticTranslationProvider({
        'en-US': enUS,
        'es-ES': esES,
        'fr-FR': frFR,
      }),
    ],
    // Auto-translate for other languages
    autoTranslationPlugin: googlePlugin,
    enableAutoTranslation: true,
    enableCache: true,
  },
});
```

**Benefits:**
- High-quality translations for primary languages
- Automatic support for all other languages
- Cost-effective (only translate less common languages)

### 2. Caching

Always enable caching to minimize API calls:

```typescript
translation: {
  enableCache: true, // Cache auto-translated strings
}
```

### 3. Batch Translation

Use batch translation for better performance:

```typescript
const keys = ['ui.toolbar.new', 'ui.toolbar.save', 'ui.toolbar.load'];
const translations = await translationManager.translateBatch(keys, 'ja-JP');
```

### 4. Pre-load Common Locales

Pre-load translations for better UX:

```typescript
await builder.initialize();
const translationManager = builder.getTranslationManager();

// Pre-load common locales
await Promise.all([
  translationManager.loadLocale('es-ES'),
  translationManager.loadLocale('fr-FR'),
  translationManager.loadLocale('de-DE'),
]);

// Now switching to these locales is instant
```

### 5. Fallback Strategy

Configure fallback behavior:

```typescript
translation: {
  warnOnMissing: true,      // Warn about missing translations in dev
  fallbackToKey: false,     // Use default locale instead of key
  defaultLocale: 'en-US',   // Fallback locale
}
```

### 6. Translation Events

Listen to translation events:

```typescript
import { TranslationEvent } from '@email-builder/core/i18n';

builder.on(TranslationEvent.LOCALE_CHANGED, (data) => {
  console.log(`Locale changed: ${data.previousLocale} -> ${data.currentLocale}`);
});

builder.on(TranslationEvent.MISSING_TRANSLATION, (data) => {
  console.log(`Missing translation: ${data.key} for ${data.locale}`);
});
```

## API Reference

### TranslationManager

#### Methods

```typescript
// Get current locale
getLocale(): string

// Set current locale
setLocale(locale: string): void

// Get available locales
getAvailableLocales(): string[]

// Translate a key
translate(key: string, interpolation?: object, fallback?: string): string

// Translate multiple keys
translateBatch(keys: string[], targetLocale?: string): Promise<Map<string, string>>

// Load locale (for async providers)
loadLocale(locale: string): Promise<void>

// Check if locale is loaded
isLocaleLoaded(locale: string): boolean

// Get translate function
getTranslateFunction(): (key: string, interpolation?: object, fallback?: string) => string

// Clear translation cache
clearCache(locale?: string): void
```

### useTranslation Hook

```typescript
const {
  t,                      // Translate function
  locale,                 // Current locale (signal)
  setLocale,              // Set locale function
  getAvailableLocales,    // Get available locales
  isLocaleLoaded,         // Check if locale is loaded
} = useTranslation();
```

## Examples

See the `/packages/core/examples/` directory for complete examples:

- `i18n-basic-example.ts` - Basic setup with consumer translations
- `i18n-auto-translation-example.ts` - Auto-translation with Google Translate
- `i18n-solidjs-integration-example.tsx` - Full SolidJS integration

## Supported Locales

The framework supports any BCP 47 locale code. Common examples:

- `en-US` - English (United States)
- `en-GB` - English (United Kingdom)
- `es-ES` - Spanish (Spain)
- `es-MX` - Spanish (Mexico)
- `fr-FR` - French (France)
- `de-DE` - German (Germany)
- `it-IT` - Italian (Italy)
- `pt-BR` - Portuguese (Brazil)
- `ja-JP` - Japanese (Japan)
- `ko-KR` - Korean (South Korea)
- `zh-CN` - Chinese (Simplified)
- `ru-RU` - Russian (Russia)
- `ar-SA` - Arabic (Saudi Arabia)

And many more...

## FAQ

**Q: How much does auto-translation cost?**
A: Google Translate pricing varies. As of 2024, it's approximately $20 per 1M characters. With caching enabled, you only translate each string once per language.

**Q: Can I use a different translation service?**
A: Yes! Implement the `AutoTranslationPlugin` interface to use any translation service (DeepL, Azure, AWS, etc.).

**Q: How do I translate component presets?**
A: Component presets use keys like `component.button.preset.primary.name`. Include these in your translation dictionaries.

**Q: What happens if a translation is missing?**
A: The system falls back to the default locale. If that's also missing, it returns the key (or empty string if `fallbackToKey: false`).

**Q: Can I override default translations?**
A: Yes! Add your provider before the default provider. The first provider with a translation wins.

## License

This translation framework is part of the Email Builder project and follows the same license.
