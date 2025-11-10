# @email-builder/core/i18n

Comprehensive internationalization (i18n) system for the Email Builder.

## Features

- 🌍 **Consumer-Provided Translations** - Bring your own translation dictionaries
- 🤖 **Auto-Translation** - Automatic translation via Google Translate API
- 🔄 **Hybrid Approach** - Combine custom + auto-translation
- ⚡ **Lazy Loading** - Load translations on-demand
- 💾 **Caching** - Cache auto-translated strings
- 🎯 **1,500+ Keys** - Complete UI coverage
- 🔌 **Extensible** - Custom providers and plugins

## Quick Start

```typescript
import { Builder } from '@email-builder/core';
import { StaticTranslationProvider, enUS, esES } from '@email-builder/core/i18n';

const provider = new StaticTranslationProvider({
  'en-US': enUS,
  'es-ES': esES,
});

const builder = new Builder({
  target: 'email',
  storage: { method: 'local' },
  translation: {
    locale: 'es-ES',
    providers: [provider],
  },
});

await builder.initialize();

const t = builder.getTranslationManager().getTranslateFunction();
console.log(t('ui.toolbar.new')); // 'Nuevo'
```

## Auto-Translation

```typescript
import { GoogleTranslatePlugin } from '@email-builder/core/i18n';

const plugin = new GoogleTranslatePlugin({
  apiKey: 'YOUR_API_KEY',
});

const builder = new Builder({
  target: 'email',
  storage: { method: 'local' },
  translation: {
    providers: [new StaticTranslationProvider({ 'en-US': enUS })],
    autoTranslationPlugin: plugin,
    enableAutoTranslation: true,
  },
});
```

## SolidJS Integration

```tsx
import { TranslationProvider, useTranslation } from '@email-builder/ui-solid/i18n';

const MyComponent = () => {
  const { t, setLocale } = useTranslation();

  return (
    <div>
      <button>{t('ui.toolbar.new')}</button>
      <button onClick={() => setLocale('es-ES')}>Español</button>
    </div>
  );
};

const App = () => (
  <TranslationProvider manager={builder.getTranslationManager()}>
    <MyComponent />
  </TranslationProvider>
);
```

## Documentation

See [Translation Framework Documentation](../../../docs/TRANSLATION_FRAMEWORK.md) for complete guide.

## Exports

### Types
- `TranslationDictionary`
- `TranslationProvider`
- `AsyncTranslationProvider`
- `AutoTranslationPlugin`
- `TranslationConfig`
- `TranslateFunction`
- `TranslationEvent`

### Classes
- `TranslationManager`
- `StaticTranslationProvider`
- `AsyncTranslationProviderImpl`
- `GoogleTranslatePlugin`

### Default Translations
- `enUS` - English (United States)
- `esES` - Spanish (Spain)

## API

### TranslationManager

```typescript
class TranslationManager {
  getLocale(): string
  setLocale(locale: string): void
  translate(key: string, interpolation?: object, fallback?: string): string
  translateBatch(keys: string[], locale?: string): Promise<Map<string, string>>
  loadLocale(locale: string): Promise<void>
  getAvailableLocales(): string[]
  getTranslateFunction(): TranslateFunction
}
```

### StaticTranslationProvider

```typescript
class StaticTranslationProvider implements TranslationProvider {
  constructor(translations: Record<string, TranslationDictionary>)
  addTranslations(locale: string, translations: TranslationDictionary): void
}
```

### GoogleTranslatePlugin

```typescript
class GoogleTranslatePlugin implements AutoTranslationPlugin {
  constructor(config: GoogleTranslateConfig)
  translate(key: string, sourceLang: string, targetLang: string, text: string): Promise<string>
  translateBatch(items: Array<{key: string, text: string}>, sourceLang: string, targetLang: string): Promise<Map<string, string>>
}
```

## Examples

See `/packages/core/examples/`:
- `i18n-basic-example.ts`
- `i18n-auto-translation-example.ts`
- `i18n-solidjs-integration-example.tsx`

## License

MIT
