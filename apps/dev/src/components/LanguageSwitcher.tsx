/**
 * Language Switcher Component
 *
 * Allows users to switch between available languages
 */

import { type Component, For } from 'solid-js';
import { useTranslation } from '@email-builder/ui-solid/i18n';
import styles from './LanguageSwitcher.module.scss';

interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: 'en-US', name: 'English', flag: '🇺🇸' },
  { code: 'es-ES', name: 'Español', flag: '🇪🇸' },
];

export const LanguageSwitcher: Component = () => {
  const { locale, setLocale } = useTranslation();

  const handleLanguageChange = (languageCode: string) => {
    setLocale(languageCode);
    console.log(`[LanguageSwitcher] Changed locale to: ${languageCode}`);
  };

  return (
    <div class={styles.languageSwitcher}>
      <label class={styles.label}>
        <span class={styles.icon}>🌐</span>
        <span class={styles.text}>Language</span>
      </label>
      <select
        class={styles.select}
        value={locale()}
        onChange={(e) => handleLanguageChange(e.currentTarget.value)}
      >
        <For each={LANGUAGES}>
          {(language) => (
            <option value={language.code}>
              {language.flag} {language.name}
            </option>
          )}
        </For>
      </select>
    </div>
  );
};
