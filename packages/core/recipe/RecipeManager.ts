/**
 * Recipe Manager
 * Manages style recipes and recipe composition
 */

import type {
  StyleRecipe,
  RecipeComposition,
  RecipeReference,
  MergeStrategy,
  RecipeCategory,
  RecipeToken,
  DynamicRecipe,
} from '../types/recipe.types';
import type { BaseStyles } from '../types/component.types';
import type { ThemeTokens } from '../types/theme.types';
import { EventEmitter } from '../services/EventEmitter';
import { StorageAdapter } from '../types/config.types';

export interface RecipeManagerConfig {
  storage?: StorageAdapter;
  themeTokens?: ThemeTokens;
}

export class RecipeManager extends EventEmitter {
  private recipes: Map<string, StyleRecipe> = new Map();
  private compositions: Map<string, RecipeComposition> = new Map();
  private storage?: StorageAdapter;
  private themeTokens?: ThemeTokens;

  constructor(config: RecipeManagerConfig = {}) {
    super();
    this.storage = config.storage;
    this.themeTokens = config.themeTokens;
  }

  // ============================================================================
  // RECIPE MANAGEMENT
  // ============================================================================

  /**
   * Register a recipe
   */
  register(recipe: StyleRecipe): void {
    this.recipes.set(recipe.id, recipe);
    this.emit('recipe:registered', { recipe });

    if (this.storage) {
      this.storage.set(`recipe:${recipe.id}`, recipe);
    }
  }

  /**
   * Get a recipe by ID
   */
  get(recipeId: string): StyleRecipe | undefined {
    return this.recipes.get(recipeId);
  }

  /**
   * Get all recipes
   */
  getAll(): StyleRecipe[] {
    return Array.from(this.recipes.values());
  }

  /**
   * Get recipes by category
   */
  getByCategory(category: RecipeCategory): StyleRecipe[] {
    return this.getAll().filter((r) => r.category === category);
  }

  /**
   * Update a recipe
   */
  update(recipeId: string, updates: Partial<Omit<StyleRecipe, 'id'>>): StyleRecipe {
    const recipe = this.recipes.get(recipeId);
    if (!recipe) {
      throw new Error(`Recipe not found: ${recipeId}`);
    }

    const updated: StyleRecipe = {
      ...recipe,
      ...updates,
      metadata: {
        ...recipe.metadata,
        ...updates.metadata,
        updatedAt: Date.now(),
      },
    };

    this.recipes.set(recipeId, updated);
    this.emit('recipe:updated', { recipe: updated });

    if (this.storage) {
      this.storage.set(`recipe:${recipeId}`, updated);
    }

    return updated;
  }

  /**
   * Delete a recipe
   */
  delete(recipeId: string): void {
    const recipe = this.recipes.get(recipeId);
    if (!recipe) {
      throw new Error(`Recipe not found: ${recipeId}`);
    }

    this.recipes.delete(recipeId);
    this.emit('recipe:deleted', { recipeId });

    if (this.storage) {
      this.storage.remove(`recipe:${recipeId}`);
    }
  }

  /**
   * Create a new recipe
   */
  create(options: {
    name: string;
    description?: string;
    category: RecipeCategory;
    styles: Partial<BaseStyles>;
    extends?: string;
  }): StyleRecipe {
    const recipe: StyleRecipe = {
      id: this.generateRecipeId(),
      name: options.name,
      description: options.description,
      category: options.category,
      styles: options.styles,
      extends: options.extends,
      metadata: {
        isBuiltIn: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    };

    this.register(recipe);
    return recipe;
  }

  /**
   * Create a recipe from an existing component
   */
  createFromComponent(
    name: string,
    category: RecipeCategory,
    componentStyles: Partial<BaseStyles>
  ): StyleRecipe {
    return this.create({
      name,
      category,
      styles: componentStyles,
    });
  }

  // ============================================================================
  // RECIPE APPLICATION
  // ============================================================================

  /**
   * Apply a recipe to get its styles
   */
  apply(recipeId: string, variant?: string): Partial<BaseStyles> {
    const recipe = this.recipes.get(recipeId);
    if (!recipe) {
      throw new Error(`Recipe not found: ${recipeId}`);
    }

    let styles = { ...recipe.styles };

    // Apply inheritance if recipe extends another
    if (recipe.extends) {
      const parentStyles = this.apply(recipe.extends);
      styles = this.mergeStyles([parentStyles, styles]);
    }

    // Apply variant if specified
    if (variant && recipe.variants && recipe.variants[variant]) {
      styles = this.mergeStyles([styles, recipe.variants[variant]]);
    }

    return styles;
  }

  /**
   * Apply multiple recipes
   */
  applyMultiple(recipeIds: string[]): Partial<BaseStyles> {
    const styleArray = recipeIds.map((id) => this.apply(id));
    return this.mergeStyles(styleArray);
  }

  // ============================================================================
  // RECIPE COMPOSITION
  // ============================================================================

  /**
   * Create a composition
   */
  createComposition(composition: RecipeComposition): void {
    this.compositions.set(composition.id, composition);
    this.emit('composition:created', { composition });

    if (this.storage) {
      this.storage.set(`recipe-composition:${composition.id}`, composition);
    }
  }

  /**
   * Get a composition
   */
  getComposition(compositionId: string): RecipeComposition | undefined {
    return this.compositions.get(compositionId);
  }

  /**
   * Apply a composition
   */
  applyComposition(compositionId: string): Partial<BaseStyles> {
    const composition = this.compositions.get(compositionId);
    if (!composition) {
      throw new Error(`Composition not found: ${compositionId}`);
    }

    // Sort recipes by priority if specified
    const sortedRefs = [...composition.recipes].sort((a, b) => {
      return (a.priority || 0) - (b.priority || 0);
    });

    // Collect styles from all recipes
    const styleArray = sortedRefs.map((ref) => {
      return this.apply(ref.recipeId, ref.variant);
    });

    // Merge based on strategy
    let merged: Partial<BaseStyles>;
    switch (composition.mergeStrategy) {
      case 'override':
        merged = this.mergeStyles(styleArray);
        break;
      case 'merge':
        merged = this.mergeStyles(styleArray);
        break;
      case 'deep-merge':
        merged = this.deepMergeStyles(styleArray);
        break;
      default:
        merged = this.mergeStyles(styleArray);
    }

    // Apply final overrides
    if (composition.overrides) {
      merged = this.mergeStyles([merged, composition.overrides]);
    }

    return merged;
  }

  // ============================================================================
  // RECIPE VARIANTS
  // ============================================================================

  /**
   * Add a variant to a recipe
   */
  addVariant(recipeId: string, variantName: string, styles: Partial<BaseStyles>): void {
    const recipe = this.recipes.get(recipeId);
    if (!recipe) {
      throw new Error(`Recipe not found: ${recipeId}`);
    }

    if (!recipe.variants) {
      recipe.variants = {};
    }

    recipe.variants[variantName] = styles;
    this.recipes.set(recipeId, recipe);
    this.emit('recipe:variant-added', { recipeId, variantName });

    if (this.storage) {
      this.storage.set(`recipe:${recipeId}`, recipe);
    }
  }

  /**
   * Remove a variant from a recipe
   */
  removeVariant(recipeId: string, variantName: string): void {
    const recipe = this.recipes.get(recipeId);
    if (!recipe) {
      throw new Error(`Recipe not found: ${recipeId}`);
    }

    if (recipe.variants) {
      delete recipe.variants[variantName];
      this.recipes.set(recipeId, recipe);
      this.emit('recipe:variant-removed', { recipeId, variantName });

      if (this.storage) {
        this.storage.set(`recipe:${recipeId}`, recipe);
      }
    }
  }

  // ============================================================================
  // DYNAMIC RECIPES (Theme Token Support)
  // ============================================================================

  /**
   * Set theme tokens for resolving dynamic recipes
   */
  setThemeTokens(tokens: ThemeTokens): void {
    this.themeTokens = tokens;
  }

  /**
   * Resolve a dynamic recipe with theme tokens
   */
  resolveDynamicRecipe(recipe: DynamicRecipe): StyleRecipe {
    if (!this.themeTokens) {
      throw new Error('Theme tokens not set. Cannot resolve dynamic recipe.');
    }

    const resolvedStyles: Partial<BaseStyles> = {};

    for (const [key, value] of Object.entries(recipe.styles)) {
      if (this.isRecipeToken(value)) {
        const token = value as RecipeToken;
        resolvedStyles[key as keyof BaseStyles] = this.resolveToken(token) as any;
      } else {
        resolvedStyles[key as keyof BaseStyles] = value as any;
      }
    }

    return {
      ...recipe,
      styles: resolvedStyles,
    };
  }

  /**
   * Check if a value is a recipe token
   */
  private isRecipeToken(value: any): boolean {
    return value && typeof value === 'object' && 'type' in value && 'path' in value;
  }

  /**
   * Resolve a token using theme tokens
   */
  private resolveToken(token: RecipeToken): string | number | object {
    if (!this.themeTokens) {
      throw new Error('Theme tokens not available');
    }

    switch (token.type) {
      case 'color':
        return this.themeTokens.color(token.path);
      case 'spacing':
        const spacingKey = token.path as any;
        return this.themeTokens.spacing(spacingKey);
      case 'fontSize':
        const sizeKey = token.path as any;
        return this.themeTokens.fontSize(sizeKey);
      case 'fontWeight':
        const weightKey = token.path as any;
        return this.themeTokens.fontWeight(weightKey);
      case 'radius':
        const radiusKey = token.path as any;
        return this.themeTokens.radius(radiusKey);
      case 'shadow':
        const shadowKey = token.path as any;
        return this.themeTokens.shadow(shadowKey);
      default:
        throw new Error(`Unknown token type: ${token.type}`);
    }
  }

  // ============================================================================
  // STYLE MERGING
  // ============================================================================

  /**
   * Merge multiple style objects (shallow merge)
   */
  private mergeStyles(styleArray: Partial<BaseStyles>[]): Partial<BaseStyles> {
    return styleArray.reduce((acc, styles) => {
      return { ...acc, ...styles };
    }, {});
  }

  /**
   * Deep merge multiple style objects
   */
  private deepMergeStyles(styleArray: Partial<BaseStyles>[]): Partial<BaseStyles> {
    return styleArray.reduce((acc, styles) => {
      const merged = { ...acc };

      for (const key in styles) {
        const value = styles[key as keyof BaseStyles];
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          merged[key as keyof BaseStyles] = {
            ...(acc[key as keyof BaseStyles] as any),
            ...(value as any),
          };
        } else {
          merged[key as keyof BaseStyles] = value as any;
        }
      }

      return merged;
    }, {});
  }

  // ============================================================================
  // UTILITIES
  // ============================================================================

  /**
   * Generate unique recipe ID
   */
  private generateRecipeId(): string {
    return `recipe-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Search recipes by name or tags
   */
  search(query: string): StyleRecipe[] {
    const lowerQuery = query.toLowerCase();
    return this.getAll().filter((recipe) => {
      const nameMatch = recipe.name.toLowerCase().includes(lowerQuery);
      const descMatch = recipe.description?.toLowerCase().includes(lowerQuery);
      const tagMatch = recipe.metadata.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery));

      return nameMatch || descMatch || tagMatch;
    });
  }

  /**
   * Import recipes from JSON
   */
  import(json: string): StyleRecipe[] {
    const recipes = JSON.parse(json) as StyleRecipe[];
    recipes.forEach((r) => this.register(r));
    return recipes;
  }

  /**
   * Export recipes to JSON
   */
  export(recipeIds?: string[]): string {
    const recipes = recipeIds
      ? recipeIds.map((id) => this.recipes.get(id)).filter((r): r is StyleRecipe => r !== undefined)
      : this.getAll();

    return JSON.stringify(recipes, null, 2);
  }
}

export default RecipeManager;
