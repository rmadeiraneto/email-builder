/**
 * Translation Context for SolidJS
 *
 * Provides translation functionality to all SolidJS components
 */

import { createContext, useContext, createSignal, onMount, type ParentComponent } from 'solid-js';

/**
 * Translation function type
 */
export type TranslateFunction = (
  key: string,
  interpolation?: Record<string, string>,
  fallback?: string
) => string;

/**
 * Translation context value
 */
export interface TranslationContextValue {
  t: TranslateFunction;
  locale: () => string;
  setLocale: (locale: string) => Promise<void>;
  getAvailableLocales: () => string[];
  isLocaleLoaded: (locale: string) => boolean;
}

/**
 * Translation manager interface
 */
export interface TranslationManager {
  getLocale(): string;
  setLocale(locale: string): void;
  translate(key: string, interpolation?: Record<string, string>, fallback?: string): string;
  loadLocale(locale: string): Promise<void>;
  isLocaleLoaded(locale: string): boolean;
  getAvailableLocales(): string[];
}

const TranslationContext = createContext<TranslationContextValue>();

/**
 * Translation Provider Props
 */
export interface TranslationProviderProps {
  /**
   * Translation manager instance
   */
  manager: TranslationManager;

  /**
   * Children components
   */
  children?: any;
}

/**
 * Translation Provider Component
 *
 * Wraps the application to provide translation functionality
 *
 * @example
 * ```tsx
 * import { TranslationProvider } from '@email-builder/ui-solid/i18n';
 *
 * <TranslationProvider manager={translationManager}>
 *   <App />
 * </TranslationProvider>
 * ```
 */
export const TranslationProvider: ParentComponent<TranslationProviderProps> = (props) => {
  const [locale, setLocale] = createSignal(props.manager.getLocale());

  // Create translate function that uses the current locale
  const t: TranslateFunction = (key: string, interpolation?: Record<string, string>, fallback?: string) => {
    // Force re-evaluation when locale changes
    locale();
    return props.manager.translate(key, interpolation, fallback);
  };

  const handleSetLocale = async (newLocale: string) => {
    // Load locale if needed
    if (!props.manager.isLocaleLoaded(newLocale)) {
      await props.manager.loadLocale(newLocale);
    }

    // Set locale
    props.manager.setLocale(newLocale);
    setLocale(newLocale);
  };

  const contextValue: TranslationContextValue = {
    t,
    locale: () => locale(),
    setLocale: handleSetLocale,
    getAvailableLocales: () => props.manager.getAvailableLocales(),
    isLocaleLoaded: (locale: string) => props.manager.isLocaleLoaded(locale),
  };

  return (
    <TranslationContext.Provider value={contextValue}>
      {props.children}
    </TranslationContext.Provider>
  );
};

/**
 * Hook to access translation functionality
 *
 * @example
 * ```tsx
 * const { t, locale, setLocale } = useTranslation();
 *
 * return (
 *   <div>
 *     <h1>{t('ui.toolbar.new')}</h1>
 *     <p>Current locale: {locale()}</p>
 *     <button onClick={() => setLocale('es-ES')}>Spanish</button>
 *   </div>
 * );
 * ```
 */
export function useTranslation(): TranslationContextValue {
  const context = useContext(TranslationContext);

  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }

  return context;
}
