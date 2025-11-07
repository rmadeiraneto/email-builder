/**
 * Variant Manager
 * Manages component style variants and variant composition
 */

import type {
  ComponentVariant,
  VariantCollection,
  VariantApplication,
  VariantComposition,
  VariantCategory,
} from '../types/variant.types';
import type { BaseStyles } from '../types/component.types';
import { EventEmitter } from '../services/EventEmitter';
import { StorageAdapter } from '../types/config.types';

export interface VariantManagerConfig {
  storage?: StorageAdapter;
}

export class VariantManager extends EventEmitter {
  private variants: Map<string, ComponentVariant> = new Map();
  private collections: Map<string, VariantCollection> = new Map();
  private compositions: Map<string, VariantComposition> = new Map();
  private storage?: StorageAdapter;

  constructor(config: VariantManagerConfig = {}) {
    super();
    this.storage = config.storage;
  }

  // ============================================================================
  // VARIANT MANAGEMENT
  // ============================================================================

  /**
   * Register a component variant
   */
  register(variant: ComponentVariant): void {
    this.variants.set(variant.id, variant);
    this.emit('variant:registered', { variant });

    if (this.storage) {
      this.storage.set(`variant:${variant.id}`, variant);
    }
  }

  /**
   * Get a variant by ID
   */
  get(variantId: string): ComponentVariant | undefined {
    return this.variants.get(variantId);
  }

  /**
   * Get all variants
   */
  getAll(): ComponentVariant[] {
    return Array.from(this.variants.values());
  }

  /**
   * Get variants by component type
   */
  getByComponentType(componentType: string): ComponentVariant[] {
    const collection = this.collections.get(componentType);
    if (!collection) return [];

    return collection.variants.filter((v) => this.variants.has(v.id)).map((v) => v);
  }

  /**
   * Get variants by category
   */
  getByCategory(category: VariantCategory): ComponentVariant[] {
    return this.getAll().filter((v) => v.category === category);
  }

  /**
   * Update a variant
   */
  update(variantId: string, updates: Partial<Omit<ComponentVariant, 'id'>>): ComponentVariant {
    const variant = this.variants.get(variantId);
    if (!variant) {
      throw new Error(`Variant not found: ${variantId}`);
    }

    const updated: ComponentVariant = {
      ...variant,
      ...updates,
      metadata: {
        ...variant.metadata,
        ...updates.metadata,
      },
    };

    this.variants.set(variantId, updated);
    this.emit('variant:updated', { variant: updated });

    if (this.storage) {
      this.storage.set(`variant:${variantId}`, updated);
    }

    return updated;
  }

  /**
   * Delete a variant
   */
  delete(variantId: string): void {
    const variant = this.variants.get(variantId);
    if (!variant) {
      throw new Error(`Variant not found: ${variantId}`);
    }

    this.variants.delete(variantId);
    this.emit('variant:deleted', { variantId });

    if (this.storage) {
      this.storage.remove(`variant:${variantId}`);
    }
  }

  /**
   * Create a new variant
   */
  create(options: {
    name: string;
    description?: string;
    category: VariantCategory;
    componentType: string;
    styles: Partial<BaseStyles>;
    content?: Record<string, unknown>;
  }): ComponentVariant {
    const variant: ComponentVariant = {
      id: this.generateVariantId(),
      name: options.name,
      description: options.description,
      category: options.category,
      styles: options.styles,
      content: options.content,
      metadata: {
        createdAt: Date.now(),
      },
    };

    this.register(variant);

    // Add to component collection
    this.addToCollection(options.componentType, variant);

    return variant;
  }

  // ============================================================================
  // VARIANT COLLECTIONS
  // ============================================================================

  /**
   * Create or update a variant collection for a component type
   */
  createCollection(componentType: string, variants: ComponentVariant[] = []): VariantCollection {
    const collection: VariantCollection = {
      componentType,
      variants,
      defaultVariantId: variants.find((v) => v.metadata?.isDefault)?.id,
    };

    this.collections.set(componentType, collection);
    this.emit('collection:created', { collection });

    return collection;
  }

  /**
   * Add variant to a collection
   */
  addToCollection(componentType: string, variant: ComponentVariant): void {
    let collection = this.collections.get(componentType);

    if (!collection) {
      collection = this.createCollection(componentType);
    }

    // Check if variant already exists in collection
    if (!collection.variants.find((v) => v.id === variant.id)) {
      collection.variants.push(variant);
      this.collections.set(componentType, collection);
      this.emit('collection:updated', { collection });
    }
  }

  /**
   * Remove variant from collection
   */
  removeFromCollection(componentType: string, variantId: string): void {
    const collection = this.collections.get(componentType);
    if (!collection) return;

    collection.variants = collection.variants.filter((v) => v.id !== variantId);
    this.collections.set(componentType, collection);
    this.emit('collection:updated', { collection });
  }

  /**
   * Set default variant for a component type
   */
  setDefaultVariant(componentType: string, variantId: string): void {
    const collection = this.collections.get(componentType);
    if (!collection) {
      throw new Error(`Collection not found: ${componentType}`);
    }

    const variant = collection.variants.find((v) => v.id === variantId);
    if (!variant) {
      throw new Error(`Variant not found in collection: ${variantId}`);
    }

    collection.defaultVariantId = variantId;
    this.collections.set(componentType, collection);
    this.emit('collection:default-changed', { componentType, variantId });
  }

  // ============================================================================
  // VARIANT APPLICATION
  // ============================================================================

  /**
   * Apply variant(s) to get merged styles
   */
  applyVariants(variantIds: string[]): Partial<BaseStyles> {
    const variants = variantIds
      .map((id) => this.variants.get(id))
      .filter((v): v is ComponentVariant => v !== undefined);

    if (variants.length === 0) {
      return {};
    }

    // Merge styles from all variants in order
    return this.mergeStyles(variants.map((v) => v.styles));
  }

  /**
   * Apply variant application
   */
  applyVariantApplication(application: VariantApplication): Partial<BaseStyles> {
    const variantStyles = this.applyVariants(application.variantIds);

    if (application.overrides) {
      return this.mergeStyles([variantStyles, application.overrides]);
    }

    return variantStyles;
  }

  // ============================================================================
  // VARIANT COMPOSITION
  // ============================================================================

  /**
   * Create a variant composition
   */
  createComposition(composition: VariantComposition): void {
    this.compositions.set(composition.id, composition);
    this.emit('composition:created', { composition });

    if (this.storage) {
      this.storage.set(`composition:${composition.id}`, composition);
    }
  }

  /**
   * Get a composition
   */
  getComposition(compositionId: string): VariantComposition | undefined {
    return this.compositions.get(compositionId);
  }

  /**
   * Apply a composition to get merged styles
   */
  applyComposition(compositionId: string): Partial<BaseStyles> {
    const composition = this.compositions.get(compositionId);
    if (!composition) {
      throw new Error(`Composition not found: ${compositionId}`);
    }

    const variants = composition.variantIds
      .map((id) => this.variants.get(id))
      .filter((v): v is ComponentVariant => v !== undefined);

    let merged: Partial<BaseStyles> = {};

    switch (composition.mergeStrategy) {
      case 'override':
        merged = this.mergeStyles(variants.map((v) => v.styles));
        break;
      case 'merge':
        merged = this.mergeStyles(variants.map((v) => v.styles));
        break;
      case 'deep-merge':
        merged = this.deepMergeStyles(variants.map((v) => v.styles));
        break;
      default:
        merged = this.mergeStyles(variants.map((v) => v.styles));
    }

    return merged;
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
   * Generate unique variant ID
   */
  private generateVariantId(): string {
    return `variant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Import variants from JSON
   */
  import(json: string): ComponentVariant[] {
    const variants = JSON.parse(json) as ComponentVariant[];
    variants.forEach((v) => this.register(v));
    return variants;
  }

  /**
   * Export variants to JSON
   */
  export(variantIds?: string[]): string {
    const variants = variantIds
      ? variantIds.map((id) => this.variants.get(id)).filter((v): v is ComponentVariant => v !== undefined)
      : this.getAll();

    return JSON.stringify(variants, null, 2);
  }
}

export default VariantManager;
