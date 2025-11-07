/**
 * Customization Profile System Types
 * Save and apply complete customization configurations
 */

import type { Theme } from './theme.types';
import type { ComponentVariant } from './variant.types';
import type { StyleRecipe } from './recipe.types';
import type { ComponentPreset } from './component.types';

// ============================================================================
// CUSTOMIZATION PROFILE
// ============================================================================

/**
 * A complete customization configuration that can be saved and applied
 */
export interface CustomizationProfile {
  id: string;
  name: string;
  description?: string;
  author?: string;
  version: string;

  /** Theme configuration */
  theme: Theme;

  /** Component variants */
  variants: ComponentVariant[];

  /** Style recipes */
  recipes: StyleRecipe[];

  /** Component presets */
  presets: ComponentPreset[];

  /** Global style defaults */
  globalStyles?: GlobalStyleDefaults;

  /** Template blueprints */
  blueprints?: TemplateBlueprintReference[];

  /** Profile metadata */
  metadata: ProfileMetadata;
}

export interface ProfileMetadata {
  category?: ProfileCategory;
  tags?: string[];
  thumbnail?: string;
  isPremium?: boolean;
  isPublic?: boolean;
  downloads?: number;
  rating?: number;
  createdAt: number;
  updatedAt: number;
}

export type ProfileCategory =
  | 'business'
  | 'ecommerce'
  | 'newsletter'
  | 'transactional'
  | 'marketing'
  | 'educational'
  | 'nonprofit'
  | 'agency'
  | 'custom';

// ============================================================================
// GLOBAL STYLE DEFAULTS
// ============================================================================

/**
 * Default styles applied to all components
 */
export interface GlobalStyleDefaults {
  /** Default background color for containers */
  backgroundColor?: string;

  /** Default text color */
  textColor?: string;

  /** Default font family */
  fontFamily?: string;

  /** Default font size */
  fontSize?: string;

  /** Default line height */
  lineHeight?: number;

  /** Default border radius */
  borderRadius?: string;

  /** Default padding */
  padding?: string;

  /** Default margin */
  margin?: string;

  /** Custom defaults */
  custom?: Record<string, unknown>;
}

// ============================================================================
// TEMPLATE BLUEPRINT REFERENCE
// ============================================================================

export interface TemplateBlueprintReference {
  blueprintId: string;
  name: string;
  category?: string;
}

// ============================================================================
// PROFILE APPLICATION
// ============================================================================

/**
 * Options for applying a profile
 */
export interface ProfileApplicationOptions {
  /** Apply theme */
  applyTheme?: boolean;

  /** Apply variants */
  applyVariants?: boolean;

  /** Apply recipes */
  applyRecipes?: boolean;

  /** Apply presets */
  applyPresets?: boolean;

  /** Apply global styles */
  applyGlobalStyles?: boolean;

  /** Merge with existing configuration */
  mergeWithExisting?: boolean;

  /** Override strategy for conflicts */
  conflictStrategy?: 'keep-existing' | 'use-new' | 'prompt';
}

/**
 * Result of applying a profile
 */
export interface ProfileApplicationResult {
  success: boolean;
  appliedComponents: string[];
  skippedComponents: string[];
  conflicts?: ProfileConflict[];
  errors?: Error[];
}

export interface ProfileConflict {
  type: 'theme' | 'variant' | 'recipe' | 'preset';
  existingId: string;
  newId: string;
  resolution: 'kept-existing' | 'used-new' | 'merged';
}

// ============================================================================
// PROFILE SHARING
// ============================================================================

/**
 * Export format for sharing profiles
 */
export interface ProfileExportData {
  profile: CustomizationProfile;
  format: 'json' | 'compressed';
  checksum?: string;
  exportedAt: number;
}

/**
 * Profile import options
 */
export interface ProfileImportOptions {
  validateChecksum?: boolean;
  autoApply?: boolean;
  applicationOptions?: ProfileApplicationOptions;
}

// ============================================================================
// PROFILE TEMPLATES
// ============================================================================

/**
 * Pre-built profile templates
 */
export type BuiltInProfile =
  | 'minimal'
  | 'modern'
  | 'classic'
  | 'bold'
  | 'elegant'
  | 'playful'
  | 'corporate'
  | 'startup'
  | 'ecommerce'
  | 'newsletter'
  | 'transactional';

/**
 * Profile template definition
 */
export interface ProfileTemplate {
  id: BuiltInProfile;
  name: string;
  description: string;
  thumbnail: string;
  generate: () => CustomizationProfile;
}

export default CustomizationProfile;
