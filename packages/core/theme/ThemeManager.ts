/**
 * Theme Manager
 * Manages theme creation, loading, applying, and token resolution
 */

import type {
  Theme,
  ThemeTokens,
  ThemeOverride,
  ThemeVariant,
  ColorScale,
  FontSizeScale,
  FontWeightScale,
  SpacingScale,
  RadiusScale,
  ShadowScale,
} from '../types/theme.types';
import type { CSSValue } from '../types/component.types';
import { EventEmitter } from '../services/EventEmitter';
import { StorageAdapter } from '../types/config.types';

export interface ThemeManagerConfig {
  storage?: StorageAdapter;
  defaultTheme?: Theme;
}

export class ThemeManager extends EventEmitter {
  private themes: Map<string, Theme> = new Map();
  private variants: Map<string, ThemeVariant> = new Map();
  private currentTheme: Theme | null = null;
  private storage?: StorageAdapter;

  constructor(config: ThemeManagerConfig = {}) {
    super();
    this.storage = config.storage;

    // Load default theme if provided
    if (config.defaultTheme) {
      this.register(config.defaultTheme);
      this.setCurrentTheme(config.defaultTheme.id);
    }
  }

  // ============================================================================
  // THEME MANAGEMENT
  // ============================================================================

  /**
   * Register a new theme
   */
  register(theme: Theme): void {
    this.validateTheme(theme);
    this.themes.set(theme.id, theme);
    this.emit('theme:registered', { theme });

    // Persist to storage
    if (this.storage) {
      this.storage.set(`theme:${theme.id}`, theme);
    }
  }

  /**
   * Get a theme by ID
   */
  get(themeId: string): Theme | undefined {
    return this.themes.get(themeId);
  }

  /**
   * Get all registered themes
   */
  getAll(): Theme[] {
    return Array.from(this.themes.values());
  }

  /**
   * Get current active theme
   */
  getCurrent(): Theme | null {
    return this.currentTheme;
  }

  /**
   * Set the current active theme
   */
  setCurrentTheme(themeId: string): void {
    const theme = this.themes.get(themeId);
    if (!theme) {
      throw new Error(`Theme not found: ${themeId}`);
    }

    this.currentTheme = theme;
    this.emit('theme:changed', { theme });

    // Persist current theme ID
    if (this.storage) {
      this.storage.set('current-theme-id', themeId);
    }
  }

  /**
   * Update an existing theme
   */
  update(themeId: string, updates: Partial<Omit<Theme, 'id'>>): Theme {
    const theme = this.themes.get(themeId);
    if (!theme) {
      throw new Error(`Theme not found: ${themeId}`);
    }

    const updatedTheme: Theme = {
      ...theme,
      ...updates,
      metadata: {
        ...theme.metadata,
        updatedAt: Date.now(),
      },
    };

    this.themes.set(themeId, updatedTheme);
    this.emit('theme:updated', { theme: updatedTheme });

    // Persist to storage
    if (this.storage) {
      this.storage.set(`theme:${themeId}`, updatedTheme);
    }

    return updatedTheme;
  }

  /**
   * Delete a theme
   */
  delete(themeId: string): void {
    const theme = this.themes.get(themeId);
    if (!theme) {
      throw new Error(`Theme not found: ${themeId}`);
    }

    this.themes.delete(themeId);
    this.emit('theme:deleted', { themeId });

    // Remove from storage
    if (this.storage) {
      this.storage.remove(`theme:${themeId}`);
    }

    // Clear current theme if it was deleted
    if (this.currentTheme?.id === themeId) {
      this.currentTheme = null;
    }
  }

  /**
   * Create a theme from scratch
   */
  create(options: {
    name: string;
    description?: string;
    author?: string;
    category?: Theme['metadata']['category'];
  }): Theme {
    const theme: Theme = {
      id: this.generateThemeId(),
      name: options.name,
      description: options.description,
      author: options.author,
      version: '1.0.0',
      colors: this.createDefaultColorPalette(),
      typography: this.createDefaultTypography(),
      spacing: this.createDefaultSpacing(),
      radius: this.createDefaultRadius(),
      shadows: this.createDefaultShadows(),
      metadata: {
        category: options.category,
        tags: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    };

    this.register(theme);
    return theme;
  }

  /**
   * Duplicate an existing theme
   */
  duplicate(themeId: string, newName: string): Theme {
    const original = this.themes.get(themeId);
    if (!original) {
      throw new Error(`Theme not found: ${themeId}`);
    }

    const duplicated: Theme = {
      ...JSON.parse(JSON.stringify(original)),
      id: this.generateThemeId(),
      name: newName,
      metadata: {
        ...original.metadata,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    };

    this.register(duplicated);
    return duplicated;
  }

  // ============================================================================
  // THEME VARIANTS
  // ============================================================================

  /**
   * Register a theme variant
   */
  registerVariant(variant: ThemeVariant): void {
    this.variants.set(variant.id, variant);
    this.emit('variant:registered', { variant });

    if (this.storage) {
      this.storage.set(`theme-variant:${variant.id}`, variant);
    }
  }

  /**
   * Apply a variant to create a new theme
   */
  applyVariant(variantId: string): Theme {
    const variant = this.variants.get(variantId);
    if (!variant) {
      throw new Error(`Variant not found: ${variantId}`);
    }

    const baseTheme = this.themes.get(variant.baseThemeId);
    if (!baseTheme) {
      throw new Error(`Base theme not found: ${variant.baseThemeId}`);
    }

    const newTheme: Theme = this.mergeTheme(baseTheme, variant.overrides);
    newTheme.id = this.generateThemeId();
    newTheme.name = variant.name;

    this.register(newTheme);
    return newTheme;
  }

  // ============================================================================
  // THEME TOKEN RESOLUTION
  // ============================================================================

  /**
   * Create a token resolver for a theme
   */
  createTokenResolver(themeId?: string): ThemeTokens {
    const theme = themeId ? this.themes.get(themeId) : this.currentTheme;
    if (!theme) {
      throw new Error('No theme available for token resolution');
    }

    return {
      color: (path: string) => this.resolveColorToken(theme, path),
      fontSize: (size: keyof FontSizeScale) => theme.typography.fontSizes[size],
      fontWeight: (weight: keyof FontWeightScale) => theme.typography.fontWeights[weight],
      spacing: (scale: keyof SpacingScale | number) => {
        if (typeof scale === 'number') {
          return theme.spacing[scale as keyof SpacingScale] || { value: scale, unit: 'px' };
        }
        return theme.spacing[scale];
      },
      radius: (size: keyof RadiusScale) => theme.radius[size],
      shadow: (size: keyof ShadowScale) => theme.shadows[size],
      textStyle: (name: string) => theme.typography.textStyles[name],
    };
  }

  /**
   * Resolve a color token path (e.g., 'primary.500', 'semantic.success.600')
   */
  private resolveColorToken(theme: Theme, path: string): string {
    const parts = path.split('.');
    let current: any = theme.colors;

    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        throw new Error(`Invalid color token path: ${path}`);
      }
    }

    if (typeof current !== 'string') {
      throw new Error(`Color token path does not resolve to a string: ${path}`);
    }

    return current;
  }

  // ============================================================================
  // THEME OVERRIDES
  // ============================================================================

  /**
   * Apply overrides to a theme
   */
  applyOverrides(themeId: string, overrides: ThemeOverride): Theme {
    const theme = this.themes.get(themeId);
    if (!theme) {
      throw new Error(`Theme not found: ${themeId}`);
    }

    return this.mergeTheme(theme, overrides);
  }

  /**
   * Merge theme with overrides
   */
  private mergeTheme(base: Theme, overrides: ThemeOverride): Theme {
    return {
      ...base,
      ...overrides,
      colors: overrides.colors ? { ...base.colors, ...overrides.colors } : base.colors,
      typography: overrides.typography
        ? { ...base.typography, ...overrides.typography }
        : base.typography,
      spacing: overrides.spacing ? { ...base.spacing, ...overrides.spacing } : base.spacing,
      radius: overrides.radius ? { ...base.radius, ...overrides.radius } : base.radius,
      shadows: overrides.shadows ? { ...base.shadows, ...overrides.shadows } : base.shadows,
      metadata: {
        ...base.metadata,
        updatedAt: Date.now(),
      },
    };
  }

  // ============================================================================
  // VALIDATION
  // ============================================================================

  /**
   * Validate theme structure
   */
  private validateTheme(theme: Theme): void {
    if (!theme.id || !theme.name) {
      throw new Error('Theme must have id and name');
    }

    if (!theme.colors || !theme.typography || !theme.spacing) {
      throw new Error('Theme must have colors, typography, and spacing');
    }
  }

  // ============================================================================
  // DEFAULT GENERATORS
  // ============================================================================

  private createDefaultColorPalette() {
    return {
      primary: this.createColorScale('#3b82f6'),
      secondary: this.createColorScale('#8b5cf6'),
      accent: this.createColorScale('#ec4899'),
      neutral: this.createColorScale('#6b7280'),
      semantic: {
        success: this.createColorScale('#10b981'),
        warning: this.createColorScale('#f59e0b'),
        danger: this.createColorScale('#ef4444'),
        info: this.createColorScale('#3b82f6'),
      },
    };
  }

  private createColorScale(baseColor: string): ColorScale {
    // Simplified color scale generation
    // In a real implementation, use a color manipulation library
    return {
      50: baseColor + '0D',
      100: baseColor + '1A',
      200: baseColor + '33',
      300: baseColor + '4D',
      400: baseColor + '80',
      500: baseColor,
      600: baseColor,
      700: baseColor,
      800: baseColor,
      900: baseColor,
    };
  }

  private createDefaultTypography() {
    return {
      fontFamilies: {
        heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        mono: '"SF Mono", "Monaco", "Courier New", monospace',
      },
      fontSizes: {
        xs: { value: 12, unit: 'px' as const },
        sm: { value: 14, unit: 'px' as const },
        base: { value: 16, unit: 'px' as const },
        lg: { value: 18, unit: 'px' as const },
        xl: { value: 20, unit: 'px' as const },
        '2xl': { value: 24, unit: 'px' as const },
        '3xl': { value: 30, unit: 'px' as const },
        '4xl': { value: 36, unit: 'px' as const },
        '5xl': { value: 48, unit: 'px' as const },
        '6xl': { value: 64, unit: 'px' as const },
      },
      fontWeights: {
        thin: 100,
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
        black: 900,
      },
      lineHeights: {
        none: 1,
        tight: 1.25,
        snug: 1.375,
        normal: 1.5,
        relaxed: 1.625,
        loose: 2,
      },
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
      },
      textStyles: {
        h1: {
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontSize: { value: 48, unit: 'px' as const },
          fontWeight: 700,
          lineHeight: 1.2,
        },
        h2: {
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontSize: { value: 36, unit: 'px' as const },
          fontWeight: 600,
          lineHeight: 1.3,
        },
        body: {
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontSize: { value: 16, unit: 'px' as const },
          fontWeight: 400,
          lineHeight: 1.5,
        },
      },
    };
  }

  private createDefaultSpacing(): SpacingScale {
    return {
      0: { value: 0, unit: 'px' },
      1: { value: 4, unit: 'px' },
      2: { value: 8, unit: 'px' },
      3: { value: 12, unit: 'px' },
      4: { value: 16, unit: 'px' },
      5: { value: 20, unit: 'px' },
      6: { value: 24, unit: 'px' },
      8: { value: 32, unit: 'px' },
      10: { value: 40, unit: 'px' },
      12: { value: 48, unit: 'px' },
      16: { value: 64, unit: 'px' },
      20: { value: 80, unit: 'px' },
      24: { value: 96, unit: 'px' },
      32: { value: 128, unit: 'px' },
      40: { value: 160, unit: 'px' },
      48: { value: 192, unit: 'px' },
      56: { value: 224, unit: 'px' },
      64: { value: 256, unit: 'px' },
    };
  }

  private createDefaultRadius(): RadiusScale {
    return {
      none: '0',
      sm: '0.125rem',
      base: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      '3xl': '1.5rem',
      full: '9999px',
    };
  }

  private createDefaultShadows(): ShadowScale {
    return {
      none: 'none',
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    };
  }

  private generateThemeId(): string {
    return `theme-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // ============================================================================
  // IMPORT/EXPORT
  // ============================================================================

  /**
   * Export a theme to JSON
   */
  export(themeId: string): string {
    const theme = this.themes.get(themeId);
    if (!theme) {
      throw new Error(`Theme not found: ${themeId}`);
    }

    return JSON.stringify(theme, null, 2);
  }

  /**
   * Import a theme from JSON
   */
  import(json: string): Theme {
    const theme = JSON.parse(json) as Theme;
    this.register(theme);
    return theme;
  }
}

export default ThemeManager;
