/**
 * Customization System - Public API
 *
 * A comprehensive customization system for the email builder that includes:
 * - Theme Engine with design tokens
 * - Component Variants for style variations
 * - Style Recipes for composable patterns
 * - Customization Profiles for complete configurations
 * - Template Blueprints for reusable layouts
 */

// Main Manager
export { CustomizationManager } from './CustomizationManager';
export { CustomizationProfileManager } from './CustomizationProfileManager';

// Theme System
export { ThemeManager } from '../theme/ThemeManager';
export { defaultThemes, modernTheme, minimalTheme, boldTheme, elegantTheme, getDefaultTheme } from '../theme/default-themes';

// Variant System
export { VariantManager } from '../variant/VariantManager';
export { defaultVariants, getAllDefaultVariants, buttonVariants, textVariants, imageVariants } from '../variant/default-variants';

// Recipe System
export { RecipeManager } from '../recipe/RecipeManager';
export { defaultRecipes, getDefaultRecipe } from '../recipe/default-recipes';

// Blueprint System
export { BlueprintManager } from '../blueprint/BlueprintManager';

// Type Exports
export type {
  Theme,
  ThemeTokens,
  ThemeOverride,
  ThemeVariant,
  ColorPalette,
  ColorScale,
  TypographyConfig,
  SpacingScale,
  RadiusScale,
  ShadowScale,
} from '../types/theme.types';

export type {
  ComponentVariant,
  VariantCollection,
  VariantApplication,
  VariantComposition,
  VariantCategory,
  ButtonVariant,
  ButtonSize,
  IntentVariant,
  TextVariant,
  ContainerVariant,
  ImageVariant,
} from '../types/variant.types';

export type {
  StyleRecipe,
  RecipeComposition,
  RecipeReference,
  MergeStrategy,
  RecipeCategory,
  RecipeToken,
  DynamicRecipe,
  BuiltInRecipe,
} from '../types/recipe.types';

export type {
  CustomizationProfile,
  ProfileMetadata,
  ProfileCategory,
  ProfileApplicationOptions,
  ProfileApplicationResult,
  ProfileExportData,
  ProfileImportOptions,
  BuiltInProfile,
} from '../types/customization-profile.types';

export type {
  TemplateBlueprint,
  BlueprintCategory,
  BlueprintSection,
  BlueprintSlot,
  BlueprintInstantiationOptions,
  BlueprintInstantiationResult,
  BuiltInBlueprint,
} from '../types/blueprint.types';

// Re-export for convenience
export type { CustomizationManagerConfig } from './CustomizationManager';
