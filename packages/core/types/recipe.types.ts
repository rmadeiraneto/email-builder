/**
 * Style Recipe System Types
 * Composable, reusable style combinations
 */

import type { BaseStyles } from './component.types';

// ============================================================================
// STYLE RECIPE
// ============================================================================

/**
 * A style recipe is a named collection of style properties
 * that can be composed and reused across components
 */
export interface StyleRecipe {
  id: string;
  name: string;
  description?: string;

  /** Category for organization */
  category: RecipeCategory;

  /** The actual style definitions */
  styles: Partial<BaseStyles>;

  /** Recipe metadata */
  metadata: RecipeMetadata;

  /** Parent recipe for inheritance */
  extends?: string;

  /** Variants of this recipe */
  variants?: Record<string, Partial<BaseStyles>>;
}

export type RecipeCategory =
  | 'layout' // Layout patterns (flex, grid, etc.)
  | 'surface' // Surface styles (cards, panels)
  | 'interactive' // Interactive elements (buttons, links)
  | 'decorative' // Decorative styles (borders, shadows)
  | 'typography' // Text styles
  | 'spacing' // Spacing patterns
  | 'color' // Color combinations
  | 'utility' // Utility styles
  | 'custom';

export interface RecipeMetadata {
  tags?: string[];
  thumbnail?: string;
  isBuiltIn?: boolean;
  author?: string;
  createdAt: number;
  updatedAt: number;
}

// ============================================================================
// RECIPE COMPOSITION
// ============================================================================

/**
 * Compose multiple recipes together
 */
export interface RecipeComposition {
  id: string;
  name: string;
  description?: string;

  /** Recipes to compose in order */
  recipes: RecipeReference[];

  /** Merge strategy */
  mergeStrategy: MergeStrategy;

  /** Final overrides */
  overrides?: Partial<BaseStyles>;
}

export interface RecipeReference {
  recipeId: string;
  variant?: string; // Optional variant to use
  priority?: number; // For conflict resolution
}

export type MergeStrategy =
  | 'override' // Later recipes override earlier ones
  | 'merge' // Shallow merge
  | 'deep-merge' // Deep merge all properties
  | 'custom'; // Custom merge function

// ============================================================================
// BUILT-IN RECIPES
// ============================================================================

/**
 * Common recipe patterns
 */
export type BuiltInRecipe =
  // Surface recipes
  | 'card'
  | 'panel'
  | 'well'
  | 'bordered'
  | 'elevated'
  | 'flat'
  | 'outlined'
  | 'filled'
  // Interactive recipes
  | 'button-base'
  | 'link'
  | 'hoverable'
  | 'clickable'
  // Layout recipes
  | 'centered'
  | 'flex-row'
  | 'flex-column'
  | 'grid'
  | 'stack'
  // Spacing recipes
  | 'compact'
  | 'comfortable'
  | 'spacious'
  | 'dense'
  // Typography recipes
  | 'heading'
  | 'body'
  | 'caption'
  | 'label'
  | 'display'
  // Color recipes
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'muted'
  | 'subtle'
  // Utility recipes
  | 'shadow-sm'
  | 'shadow-md'
  | 'shadow-lg'
  | 'rounded'
  | 'rounded-full'
  | 'truncate'
  | 'reset';

// ============================================================================
// RECIPE APPLICATION
// ============================================================================

/**
 * Apply recipes to a component
 */
export interface RecipeApplication {
  componentId: string;
  recipeIds: string[];
  overrides?: Partial<BaseStyles>;
}

/**
 * Recipe layer for fine-grained control
 */
export interface RecipeLayer {
  id: string;
  recipeId: string;
  variant?: string;
  enabled: boolean;
  order: number;
}

// ============================================================================
// RECIPE TOKENS
// ============================================================================

/**
 * Dynamic recipe tokens that reference theme values
 */
export interface RecipeToken {
  type: 'color' | 'spacing' | 'fontSize' | 'fontWeight' | 'radius' | 'shadow';
  path: string; // e.g., 'primary.500', 'spacing.4'
}

/**
 * Recipe with dynamic token references
 */
export interface DynamicRecipe extends Omit<StyleRecipe, 'styles'> {
  styles: Record<string, string | number | RecipeToken>;
}

export default StyleRecipe;
