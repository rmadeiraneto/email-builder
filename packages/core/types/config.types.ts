/**
 * Builder configuration types
 */

import type { TranslationConfig } from '../i18n/types';

/**
 * Rendering target for the builder
 */
export type BuilderTarget = 'web' | 'email' | 'hybrid';

/**
 * Storage method
 */
export type StorageMethod = 'local' | 'api' | 'custom';

/**
 * Storage adapter interface
 *
 * Implement this interface to provide custom storage functionality
 */
export interface StorageAdapter {
  /**
   * Gets a value from storage
   *
   * @param key - Storage key
   * @returns Promise resolving to the stored value
   */
  get<T = unknown>(key: string): Promise<T | null>;

  /**
   * Sets a value in storage
   *
   * @param key - Storage key
   * @param value - Value to store
   * @returns Promise resolving when storage is complete
   */
  set<T = unknown>(key: string, value: T): Promise<void>;

  /**
   * Removes a value from storage
   *
   * @param key - Storage key
   * @returns Promise resolving when removal is complete
   */
  remove(key: string): Promise<void>;

  /**
   * Clears all storage
   *
   * @returns Promise resolving when clear is complete
   */
  clear(): Promise<void>;
}

/**
 * Storage configuration
 */
export interface StorageConfig {
  /**
   * Storage method to use
   */
  method: StorageMethod;

  /**
   * Custom storage adapter (required when method is 'custom')
   */
  adapter?: StorageAdapter;

  /**
   * API endpoint (required when method is 'api')
   */
  apiEndpoint?: string;

  /**
   * Storage key prefix
   *
   * @default 'email-builder'
   */
  keyPrefix?: string;
}

/**
 * Feature flags configuration
 */
export interface FeatureFlags {
  /**
   * Enable custom component creation
   *
   * @default true
   */
  customComponents?: boolean;

  /**
   * Enable data injection
   *
   * @default true
   */
  dataInjection?: boolean;

  /**
   * Enable template versioning
   *
   * @default false
   */
  templateVersioning?: boolean;

  /**
   * Enable undo/redo
   *
   * @default true
   */
  undoRedo?: boolean;

  /**
   * Enable auto-save
   *
   * @default false
   */
  autoSave?: boolean;
}

/**
 * Builder callbacks
 */
export interface BuilderCallbacks {
  /**
   * Called when a template is saved
   */
  onSaveTemplate?: (template: unknown) => void | Promise<void>;

  /**
   * Called when a template is loaded
   */
  onLoadTemplate?: (templateId: string) => void | Promise<void>;

  /**
   * Called when a style preset is saved
   */
  onSaveStylePreset?: (preset: unknown) => void | Promise<void>;

  /**
   * Called when template is exported
   */
  onExport?: (html: string) => void | Promise<void>;

  /**
   * Called when an error occurs
   */
  onError?: (error: Error) => void;

  /**
   * Called when builder state changes
   */
  onStateChange?: (state: unknown) => void;
}

/**
 * Builder configuration
 *
 * @example
 * ```ts
 * const config: BuilderConfig = {
 *   target: 'email',
 *   locale: 'en-US',
 *   storage: {
 *     method: 'local',
 *     keyPrefix: 'my-app'
 *   },
 *   callbacks: {
 *     onSaveTemplate: async (template) => {
 *       await api.saveTemplate(template);
 *     }
 *   }
 * };
 * ```
 */
export interface BuilderConfig {
  /**
   * Rendering target
   *
   * - `web`: Full CSS support, modern features
   * - `email`: Limited CSS, email client compatible
   * - `hybrid`: Both web and email, with compatibility warnings
   */
  target: BuilderTarget;

  /**
   * Locale code (BCP 47)
   *
   * @default 'en-US'
   */
  locale?: string;

  /**
   * Storage configuration
   */
  storage: StorageConfig;

  /**
   * Feature flags
   */
  features?: FeatureFlags;

  /**
   * Callback functions
   */
  callbacks?: BuilderCallbacks;

  /**
   * Initial template state
   */
  initialTemplate?: unknown;

  /**
   * Debug mode
   *
   * @default false
   */
  debug?: boolean;

  /**
   * Translation configuration
   *
   * Configure how the builder handles translations:
   * - Provide your own translations via providers
   * - Enable auto-translation with Google Translate or other services
   * - Set default locale and fallback behavior
   *
   * @example
   * ```ts
   * import { StaticTranslationProvider } from '@email-builder/core/i18n';
   *
   * const config = {
   *   target: 'email',
   *   translation: {
   *     locale: 'es-ES',
   *     providers: [
   *       new StaticTranslationProvider({
   *         'es-ES': { ui: { toolbar: { new: 'Nuevo' } } }
   *       })
   *     ]
   *   }
   * };
   * ```
   */
  translation?: TranslationConfig;

  /**
   * Mobile Development Mode configuration
   *
   * Configure the responsive editing system that allows users to create
   * device-specific customizations with desktop-first inheritance.
   *
   * @example
   * ```ts
   * import { DEFAULT_MOBILE_DEV_MODE_CONFIG } from '@email-builder/core/mobile';
   *
   * const config = {
   *   target: 'email',
   *   mobileDevMode: {
   *     ...DEFAULT_MOBILE_DEV_MODE_CONFIG,
   *     breakpoints: {
   *       mobile: 375
   *     },
   *     mobileDefaults: {
   *       enabled: true,
   *       transformations: {
   *         paddingReduction: 0.5,
   *         marginReduction: 0.5,
   *         fontSizeReduction: 0.9
   *       }
   *     }
   *   }
   * };
   * ```
   */
  mobileDevMode?: import('../mobile').MobileDevModeConfig;
}
