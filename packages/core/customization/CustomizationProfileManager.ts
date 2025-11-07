/**
 * Customization Profile Manager
 * Manages complete customization configurations
 */

import type {
  CustomizationProfile,
  ProfileApplicationOptions,
  ProfileApplicationResult,
  ProfileExportData,
  ProfileImportOptions,
  ProfileCategory,
} from '../types/customization-profile.types';
import type { Theme } from '../types/theme.types';
import type { ComponentVariant } from '../types/variant.types';
import type { StyleRecipe } from '../types/recipe.types';
import type { ComponentPreset } from '../types/component.types';
import { EventEmitter } from '../services/EventEmitter';
import { StorageAdapter } from '../types/config.types';

export interface CustomizationProfileManagerConfig {
  storage?: StorageAdapter;
}

export class CustomizationProfileManager extends EventEmitter {
  private profiles: Map<string, CustomizationProfile> = new Map();
  private storage?: StorageAdapter;
  private currentProfile: CustomizationProfile | null = null;

  constructor(config: CustomizationProfileManagerConfig = {}) {
    super();
    this.storage = config.storage;
  }

  // ============================================================================
  // PROFILE MANAGEMENT
  // ============================================================================

  /**
   * Create a new customization profile
   */
  create(options: {
    name: string;
    description?: string;
    author?: string;
    category?: ProfileCategory;
    theme: Theme;
    variants?: ComponentVariant[];
    recipes?: StyleRecipe[];
    presets?: ComponentPreset[];
  }): CustomizationProfile {
    const profile: CustomizationProfile = {
      id: this.generateProfileId(),
      name: options.name,
      description: options.description,
      author: options.author,
      version: '1.0.0',
      theme: options.theme,
      variants: options.variants || [],
      recipes: options.recipes || [],
      presets: options.presets || [],
      metadata: {
        category: options.category,
        tags: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    };

    this.register(profile);
    return profile;
  }

  /**
   * Register a profile
   */
  register(profile: CustomizationProfile): void {
    this.profiles.set(profile.id, profile);
    this.emit('profile:registered', { profile });

    if (this.storage) {
      this.storage.set(`customization-profile:${profile.id}`, profile);
    }
  }

  /**
   * Get a profile by ID
   */
  get(profileId: string): CustomizationProfile | undefined {
    return this.profiles.get(profileId);
  }

  /**
   * Get all profiles
   */
  getAll(): CustomizationProfile[] {
    return Array.from(this.profiles.values());
  }

  /**
   * Get profiles by category
   */
  getByCategory(category: ProfileCategory): CustomizationProfile[] {
    return this.getAll().filter((p) => p.metadata.category === category);
  }

  /**
   * Update a profile
   */
  update(
    profileId: string,
    updates: Partial<Omit<CustomizationProfile, 'id' | 'metadata'>>
  ): CustomizationProfile {
    const profile = this.profiles.get(profileId);
    if (!profile) {
      throw new Error(`Profile not found: ${profileId}`);
    }

    const updated: CustomizationProfile = {
      ...profile,
      ...updates,
      metadata: {
        ...profile.metadata,
        updatedAt: Date.now(),
      },
    };

    this.profiles.set(profileId, updated);
    this.emit('profile:updated', { profile: updated });

    if (this.storage) {
      this.storage.set(`customization-profile:${profileId}`, updated);
    }

    return updated;
  }

  /**
   * Delete a profile
   */
  delete(profileId: string): void {
    const profile = this.profiles.get(profileId);
    if (!profile) {
      throw new Error(`Profile not found: ${profileId}`);
    }

    this.profiles.delete(profileId);
    this.emit('profile:deleted', { profileId });

    if (this.storage) {
      this.storage.remove(`customization-profile:${profileId}`);
    }

    if (this.currentProfile?.id === profileId) {
      this.currentProfile = null;
    }
  }

  /**
   * Get current active profile
   */
  getCurrent(): CustomizationProfile | null {
    return this.currentProfile;
  }

  /**
   * Set current active profile
   */
  setCurrent(profileId: string): void {
    const profile = this.profiles.get(profileId);
    if (!profile) {
      throw new Error(`Profile not found: ${profileId}`);
    }

    this.currentProfile = profile;
    this.emit('profile:current-changed', { profile });

    if (this.storage) {
      this.storage.set('current-profile-id', profileId);
    }
  }

  // ============================================================================
  // PROFILE APPLICATION
  // ============================================================================

  /**
   * Apply a profile
   */
  apply(
    profileId: string,
    options: ProfileApplicationOptions = {}
  ): ProfileApplicationResult {
    const profile = this.profiles.get(profileId);
    if (!profile) {
      throw new Error(`Profile not found: ${profileId}`);
    }

    const result: ProfileApplicationResult = {
      success: true,
      appliedComponents: [],
      skippedComponents: [],
      conflicts: [],
      errors: [],
    };

    try {
      // Set as current profile
      this.setCurrent(profileId);

      // Emit application event
      this.emit('profile:applied', { profile, options, result });
    } catch (error) {
      result.success = false;
      result.errors = [error as Error];
    }

    return result;
  }

  // ============================================================================
  // IMPORT/EXPORT
  // ============================================================================

  /**
   * Export a profile
   */
  export(profileId: string, format: 'json' | 'compressed' = 'json'): ProfileExportData {
    const profile = this.profiles.get(profileId);
    if (!profile) {
      throw new Error(`Profile not found: ${profileId}`);
    }

    const exportData: ProfileExportData = {
      profile,
      format,
      exportedAt: Date.now(),
    };

    // Generate checksum if needed
    if (format === 'compressed') {
      const json = JSON.stringify(profile);
      exportData.checksum = this.generateChecksum(json);
    }

    return exportData;
  }

  /**
   * Export profile to JSON string
   */
  exportToJSON(profileId: string): string {
    const exportData = this.export(profileId);
    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Import a profile
   */
  import(exportData: ProfileExportData, options: ProfileImportOptions = {}): CustomizationProfile {
    const { profile } = exportData;

    // Validate checksum if requested
    if (options.validateChecksum && exportData.checksum) {
      const json = JSON.stringify(profile);
      const checksum = this.generateChecksum(json);
      if (checksum !== exportData.checksum) {
        throw new Error('Invalid checksum. Profile data may be corrupted.');
      }
    }

    // Register the profile
    this.register(profile);

    // Auto-apply if requested
    if (options.autoApply) {
      this.apply(profile.id, options.applicationOptions);
    }

    return profile;
  }

  /**
   * Import from JSON string
   */
  importFromJSON(json: string, options: ProfileImportOptions = {}): CustomizationProfile {
    const exportData = JSON.parse(json) as ProfileExportData;
    return this.import(exportData, options);
  }

  // ============================================================================
  // UTILITIES
  // ============================================================================

  /**
   * Generate profile ID
   */
  private generateProfileId(): string {
    return `profile-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate checksum for data integrity
   */
  private generateChecksum(data: string): string {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(36);
  }

  /**
   * Search profiles
   */
  search(query: string): CustomizationProfile[] {
    const lowerQuery = query.toLowerCase();
    return this.getAll().filter((profile) => {
      const nameMatch = profile.name.toLowerCase().includes(lowerQuery);
      const descMatch = profile.description?.toLowerCase().includes(lowerQuery);
      const authorMatch = profile.author?.toLowerCase().includes(lowerQuery);
      const tagMatch = profile.metadata.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery));

      return nameMatch || descMatch || authorMatch || tagMatch;
    });
  }

  /**
   * Duplicate a profile
   */
  duplicate(profileId: string, newName: string): CustomizationProfile {
    const original = this.profiles.get(profileId);
    if (!original) {
      throw new Error(`Profile not found: ${profileId}`);
    }

    const duplicated: CustomizationProfile = {
      ...JSON.parse(JSON.stringify(original)),
      id: this.generateProfileId(),
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
}

export default CustomizationProfileManager;
