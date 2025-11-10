/**
 * SolidJS Integration Example
 *
 * Demonstrates how to integrate the translation system with SolidJS components.
 */

import { Component, For, createSignal } from 'solid-js';
import { Builder } from '@email-builder/core';
import { StaticTranslationProvider, enUS, esES } from '@email-builder/core/i18n';
import { TranslationProvider, useTranslation } from '@email-builder/ui-solid/i18n';

// Setup builder with translations
const translationProvider = new StaticTranslationProvider({
  'en-US': enUS,
  'es-ES': esES,
  'fr-FR': {
    ui: {
      toolbar: {
        new: 'Nouveau',
        save: 'Enregistrer',
      },
    },
  },
});

const builder = new Builder({
  target: 'email',
  storage: { method: 'local' },
  translation: {
    defaultLocale: 'en-US',
    locale: 'en-US',
    providers: [translationProvider],
  },
});

await builder.initialize();

// Example 1: Basic component using translations
const Toolbar: Component = () => {
  const { t } = useTranslation();

  return (
    <div class="toolbar">
      <button>{t('ui.toolbar.new')}</button>
      <button>{t('ui.toolbar.save')}</button>
      <button>{t('ui.toolbar.load')}</button>
      <button>{t('ui.toolbar.undo')}</button>
      <button>{t('ui.toolbar.redo')}</button>
    </div>
  );
};

// Example 2: Language switcher component
const LanguageSwitcher: Component = () => {
  const { locale, setLocale, getAvailableLocales } = useTranslation();
  const availableLocales = getAvailableLocales();

  return (
    <select
      value={locale()}
      onChange={(e) => setLocale(e.currentTarget.value)}
    >
      <For each={availableLocales}>
        {(loc) => (
          <option value={loc}>
            {loc}
          </option>
        )}
      </For>
    </select>
  );
};

// Example 3: Property panel with translations
const PropertyInput: Component<{
  propertyKey: string;
  value: string;
  onChange: (value: string) => void;
}> = (props) => {
  const { t } = useTranslation();

  return (
    <div class="property-input">
      <label>
        {t(`property.${props.propertyKey}`)}
      </label>
      <input
        type="text"
        value={props.value}
        onInput={(e) => props.onChange(e.currentTarget.value)}
        placeholder={t(`property.${props.propertyKey}Placeholder`, {}, '')}
      />
    </div>
  );
};

// Example 4: Component with interpolation
const ValidationMessage: Component<{
  error: string;
  min?: number;
  max?: number;
}> = (props) => {
  const { t } = useTranslation();

  const getMessage = () => {
    switch (props.error) {
      case 'required':
        return t('validation.required');
      case 'minValue':
        return t('validation.minValue', { min: props.min });
      case 'maxValue':
        return t('validation.maxValue', { max: props.max });
      default:
        return '';
    }
  };

  return (
    <div class="error-message">
      {getMessage()}
    </div>
  );
};

// Example 5: Full app with translation provider
const App: Component = () => {
  const translationManager = builder.getTranslationManager()!;

  return (
    <TranslationProvider manager={translationManager}>
      <div class="email-builder">
        <LanguageSwitcher />
        <Toolbar />
        <PropertyInput
          propertyKey="canvas.width"
          value="600"
          onChange={(v) => console.log(v)}
        />
        <ValidationMessage error="minValue" min={200} />
      </div>
    </TranslationProvider>
  );
};

export {
  App,
  Toolbar,
  LanguageSwitcher,
  PropertyInput,
  ValidationMessage,
};
