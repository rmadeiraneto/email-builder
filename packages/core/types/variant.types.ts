/**
 * Component Variant System Types
 * Define multiple style variations for components
 */

import type { BaseStyles } from './component.types';

// ============================================================================
// VARIANT CONFIGURATION
// ============================================================================

/**
 * Component variant definition
 */
export interface ComponentVariant {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;

  /** Variant category */
  category: VariantCategory;

  /** Style overrides */
  styles: Partial<BaseStyles>;

  /** Content defaults */
  content?: Record<string, unknown>;

  /** Metadata */
  metadata?: VariantMetadata;
}

export type VariantCategory =
  | 'style' // Visual style (e.g., primary, secondary)
  | 'size' // Size variant (e.g., small, medium, large)
  | 'intent' // Semantic intent (e.g., success, warning, danger)
  | 'layout' // Layout variation (e.g., horizontal, vertical)
  | 'theme' // Theme-specific variant
  | 'custom'; // Custom category

export interface VariantMetadata {
  tags?: string[];
  isPremium?: boolean;
  isDefault?: boolean;
  group?: string; // Group related variants
  order?: number;
  createdAt?: number;
}

// ============================================================================
// VARIANT COLLECTIONS
// ============================================================================

/**
 * Collection of variants for a component type
 */
export interface VariantCollection {
  componentType: string;
  variants: ComponentVariant[];
  defaultVariantId?: string;
}

// ============================================================================
// STYLE VARIANTS (PREDEFINED)
// ============================================================================

/**
 * Button style variants
 */
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'link'
  | 'gradient'
  | 'elevated';

/**
 * Button size variants
 */
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Semantic intent variants
 */
export type IntentVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

/**
 * Text variants
 */
export type TextVariant =
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'heading4'
  | 'heading5'
  | 'heading6'
  | 'body'
  | 'bodyLarge'
  | 'bodySmall'
  | 'caption'
  | 'label'
  | 'overline';

/**
 * Container variants
 */
export type ContainerVariant =
  | 'default'
  | 'card'
  | 'panel'
  | 'section'
  | 'highlight'
  | 'bordered'
  | 'elevated';

/**
 * Image variants
 */
export type ImageVariant =
  | 'default'
  | 'rounded'
  | 'circle'
  | 'thumbnail'
  | 'cover'
  | 'contain'
  | 'hero';

// ============================================================================
// VARIANT APPLICATION
// ============================================================================

/**
 * Variant application configuration
 */
export interface VariantApplication {
  componentId: string;
  variantIds: string[]; // Multiple variants can be applied
  overrides?: Partial<BaseStyles>; // Additional overrides
}

/**
 * Variant composition - combine multiple variants
 */
export interface VariantComposition {
  id: string;
  name: string;
  description?: string;
  variantIds: string[];
  mergeStrategy: 'override' | 'merge' | 'deep-merge';
}

// ============================================================================
// VARIANT PRESETS
// ============================================================================

/**
 * Preset that combines component + variants
 */
export interface VariantPreset {
  id: string;
  name: string;
  description?: string;
  componentType: string;
  variantIds: string[];
  styles?: Partial<BaseStyles>;
  content?: Record<string, unknown>;
  thumbnail?: string;
}

export default ComponentVariant;
