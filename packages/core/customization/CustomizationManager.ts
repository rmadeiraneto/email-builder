/**
 * Customization Manager
 * Central manager that integrates all customization systems:
 * - Theme Engine
 * - Variant System
 * - Recipe System
 * - Profile System
 * - Blueprint System
 */

import { ThemeManager } from '../theme/ThemeManager';
import { VariantManager } from '../variant/VariantManager';
import { RecipeManager } from '../recipe/RecipeManager';
import { CustomizationProfileManager } from './CustomizationProfileManager';
import { BlueprintManager } from '../blueprint/BlueprintManager';
import { EventEmitter } from '../services/EventEmitter';
import { StorageAdapter } from '../types/config.types';

import type { Theme } from '../types/theme.types';
import type { ComponentVariant } from '../types/variant.types';
import type { StyleRecipe } from '../types/recipe.types';
import type { CustomizationProfile } from '../types/customization-profile.types';
import type { TemplateBlueprint } from '../types/blueprint.types';
import type { BaseStyles } from '../types/component.types';

// Import default collections
import { defaultThemes } from '../theme/default-themes';
import { getAllDefaultVariants } from '../variant/default-variants';
import { defaultRecipes } from '../recipe/default-recipes';

export interface CustomizationManagerConfig {
  storage?: StorageAdapter;
  loadDefaults?: boolean;
}

/**
 * Central hub for all customization functionality
 */
export class CustomizationManager extends EventEmitter {
  // Sub-managers
  public readonly themes: ThemeManager;
  public readonly variants: VariantManager;
  public readonly recipes: RecipeManager;
  public readonly profiles: CustomizationProfileManager;
  public readonly blueprints: BlueprintManager;

  private storage?: StorageAdapter;

  constructor(config: CustomizationManagerConfig = {}) {
    super();
    this.storage = config.storage;

    // Initialize sub-managers
    this.themes = new ThemeManager({ storage: this.storage });
    this.variants = new VariantManager({ storage: this.storage });
    this.recipes = new RecipeManager({ storage: this.storage });
    this.profiles = new CustomizationProfileManager({ storage: this.storage });
    this.blueprints = new BlueprintManager({ storage: this.storage });

    // Forward events from sub-managers
    this.setupEventForwarding();

    // Load defaults if requested
    if (config.loadDefaults !== false) {
      this.loadDefaults();
    }
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  /**
   * Load default themes, variants, and recipes
   */
  private loadDefaults(): void {
    // Load default themes
    defaultThemes.forEach((theme) => {
      this.themes.register(theme);
    });

    // Set modern theme as default
    if (defaultThemes.length > 0) {
      this.themes.setCurrentTheme('modern');
    }

    // Load default variants
    getAllDefaultVariants().forEach((variant) => {
      this.variants.register(variant);
    });

    // Load default recipes
    defaultRecipes.forEach((recipe) => {
      this.recipes.register(recipe);
    });

    this.emit('defaults:loaded');
  }

  /**
   * Initialize with custom defaults
   */
  initialize(options: {
    themes?: Theme[];
    variants?: ComponentVariant[];
    recipes?: StyleRecipe[];
    profiles?: CustomizationProfile[];
    blueprints?: TemplateBlueprint[];
  }): void {
    // Register custom themes
    options.themes?.forEach((theme) => this.themes.register(theme));

    // Register custom variants
    options.variants?.forEach((variant) => this.variants.register(variant));

    // Register custom recipes
    options.recipes?.forEach((recipe) => this.recipes.register(recipe));

    // Register custom profiles
    options.profiles?.forEach((profile) => this.profiles.register(profile));

    // Register custom blueprints
    options.blueprints?.forEach((blueprint) => this.blueprints.register(blueprint));

    this.emit('initialized', options);
  }

  // ============================================================================
  // UNIFIED CUSTOMIZATION API
  // ============================================================================

  /**
   * Apply complete customization to a component
   */
  applyCustomization(options: {
    themeId?: string;
    variantIds?: string[];
    recipeIds?: string[];
    baseStyles?: Partial<BaseStyles>;
    overrides?: Partial<BaseStyles>;
  }): Partial<BaseStyles> {
    let styles: Partial<BaseStyles> = options.baseStyles || {};

    // Apply recipes first (foundational styles)
    if (options.recipeIds && options.recipeIds.length > 0) {
      const recipeStyles = this.recipes.applyMultiple(options.recipeIds);
      styles = this.mergeStyles(styles, recipeStyles);
    }

    // Apply variants (component-specific styles)
    if (options.variantIds && options.variantIds.length > 0) {
      const variantStyles = this.variants.applyVariants(options.variantIds);
      styles = this.mergeStyles(styles, variantStyles);
    }

    // Apply theme tokens if theme is specified
    if (options.themeId) {
      const tokens = this.themes.createTokenResolver(options.themeId);
      this.recipes.setThemeTokens(tokens);
    }

    // Apply final overrides
    if (options.overrides) {
      styles = this.mergeStyles(styles, options.overrides);
    }

    return styles;
  }

  /**
   * Create a complete customization profile from current state
   */
  captureCurrentState(name: string, description?: string): CustomizationProfile {
    const currentTheme = this.themes.getCurrent();
    if (!currentTheme) {
      throw new Error('No current theme set');
    }

    return this.profiles.create({
      name,
      description,
      theme: currentTheme,
      variants: this.variants.getAll(),
      recipes: this.recipes.getAll(),
      presets: [],
    });
  }

  /**
   * Apply a complete profile
   */
  applyProfile(profileId: string): void {
    const profile = this.profiles.get(profileId);
    if (!profile) {
      throw new Error(`Profile not found: ${profileId}`);
    }

    // Register theme
    this.themes.register(profile.theme);
    this.themes.setCurrentTheme(profile.theme.id);

    // Register variants
    profile.variants.forEach((variant) => {
      this.variants.register(variant);
    });

    // Register recipes
    profile.recipes.forEach((recipe) => {
      this.recipes.register(recipe);
    });

    this.emit('profile:applied', { profile });
  }

  // ============================================================================
  // QUICK ACTIONS
  // ============================================================================

  /**
   * Quick style builder with chaining
   */
  styleBuilder() {
    let styles: Partial<BaseStyles> = {};
    const manager = this;

    return {
      withRecipe(recipeId: string) {
        const recipeStyles = manager.recipes.apply(recipeId);
        styles = manager.mergeStyles(styles, recipeStyles);
        return this;
      },

      withVariant(variantId: string) {
        const variantStyles = manager.variants.applyVariants([variantId]);
        styles = manager.mergeStyles(styles, variantStyles);
        return this;
      },

      withOverrides(overrides: Partial<BaseStyles>) {
        styles = manager.mergeStyles(styles, overrides);
        return this;
      },

      build(): Partial<BaseStyles> {
        return styles;
      },
    };
  }

  /**
   * Get theme-aware recipe
   */
  getThemedRecipe(recipeId: string, themeId?: string): Partial<BaseStyles> {
    if (themeId) {
      const tokens = this.themes.createTokenResolver(themeId);
      this.recipes.setThemeTokens(tokens);
    }

    return this.recipes.apply(recipeId);
  }

  // ============================================================================
  // SEARCH & DISCOVERY
  // ============================================================================

  /**
   * Search across all customization resources
   */
  searchAll(query: string): {
    themes: Theme[];
    variants: ComponentVariant[];
    recipes: StyleRecipe[];
    profiles: CustomizationProfile[];
    blueprints: TemplateBlueprint[];
  } {
    return {
      themes: this.themes.getAll().filter((t) =>
        t.name.toLowerCase().includes(query.toLowerCase())
      ),
      variants: this.variants.getAll().filter((v) =>
        v.name.toLowerCase().includes(query.toLowerCase())
      ),
      recipes: this.recipes.search(query),
      profiles: this.profiles.search(query),
      blueprints: this.blueprints.search(query),
    };
  }

  /**
   * Get recommendations based on component type
   */
  getRecommendations(componentType: string): {
    variants: ComponentVariant[];
    recipes: StyleRecipe[];
  } {
    return {
      variants: this.variants.getByComponentType(componentType),
      recipes: this.recipes.getByCategory('interactive'),
    };
  }

  // ============================================================================
  // IMPORT/EXPORT
  // ============================================================================

  /**
   * Export entire customization state
   */
  exportAll(): string {
    const exportData = {
      themes: this.themes.getAll(),
      variants: this.variants.getAll(),
      recipes: this.recipes.getAll(),
      profiles: this.profiles.getAll(),
      blueprints: this.blueprints.getAll(),
      exportedAt: Date.now(),
      version: '1.0.0',
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Import entire customization state
   */
  importAll(json: string): void {
    const data = JSON.parse(json);

    // Import themes
    data.themes?.forEach((theme: Theme) => this.themes.register(theme));

    // Import variants
    data.variants?.forEach((variant: ComponentVariant) => this.variants.register(variant));

    // Import recipes
    data.recipes?.forEach((recipe: StyleRecipe) => this.recipes.register(recipe));

    // Import profiles
    data.profiles?.forEach((profile: CustomizationProfile) => this.profiles.register(profile));

    // Import blueprints
    data.blueprints?.forEach((blueprint: TemplateBlueprint) =>
      this.blueprints.register(blueprint)
    );

    this.emit('import:complete', { data });
  }

  // ============================================================================
  // UTILITIES
  // ============================================================================

  /**
   * Merge two style objects
   */
  private mergeStyles(
    base: Partial<BaseStyles>,
    override: Partial<BaseStyles>
  ): Partial<BaseStyles> {
    return { ...base, ...override };
  }

  /**
   * Setup event forwarding from sub-managers
   */
  private setupEventForwarding(): void {
    // Forward theme events
    this.themes.on('*', (event: string, data: any) => {
      this.emit(event, data);
    });

    // Forward variant events
    this.variants.on('*', (event: string, data: any) => {
      this.emit(event, data);
    });

    // Forward recipe events
    this.recipes.on('*', (event: string, data: any) => {
      this.emit(event, data);
    });

    // Forward profile events
    this.profiles.on('*', (event: string, data: any) => {
      this.emit(event, data);
    });

    // Forward blueprint events
    this.blueprints.on('*', (event: string, data: any) => {
      this.emit(event, data);
    });
  }

  /**
   * Get statistics about customization resources
   */
  getStats(): {
    themes: number;
    variants: number;
    recipes: number;
    profiles: number;
    blueprints: number;
  } {
    return {
      themes: this.themes.getAll().length,
      variants: this.variants.getAll().length,
      recipes: this.recipes.getAll().length,
      profiles: this.profiles.getAll().length,
      blueprints: this.blueprints.getAll().length,
    };
  }
}

export default CustomizationManager;
