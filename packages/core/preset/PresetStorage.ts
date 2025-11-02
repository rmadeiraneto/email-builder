/**
 * Preset Storage Service
 *
 * Handles preset persistence using configured storage adapters
 */

import type {
  ComponentPreset,
  ComponentType,
} from '../types/component.types';
import type { PresetSaveData, PresetListItem } from '../types/preset.types';
import type { StorageAdapter } from '../types/config.types';

/**
 * Storage error types
 */
export class PresetStorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PresetStorageError';
  }
}

/**
 * Preset Storage Service
 *
 * Provides persistence layer for component style presets using configured storage adapters
 */
export class PresetStorage {
  private adapter: StorageAdapter;
  private keyPrefix: string;

  constructor(adapter: StorageAdapter, keyPrefix = 'email-builder') {
    this.adapter = adapter;
    this.keyPrefix = keyPrefix;
  }

  /**
   * Save preset to storage
   *
   * @param componentType - Component type this preset belongs to
   * @param preset - Preset to save
   * @returns Promise resolving when save is complete
   * @throws {PresetStorageError} If save fails
   */
  async save(componentType: ComponentType, preset: ComponentPreset): Promise<void> {
    try {
      const saveData: PresetSaveData = {
        componentType,
        preset: {
          ...preset,
          createdAt: preset.createdAt || Date.now(),
        },
        savedAt: Date.now(),
        checksum: this.generateChecksum(preset),
      };

      const key = this.getPresetKey(componentType, preset.id);
      await this.adapter.set(key, saveData);

      // Update preset list metadata
      await this.updatePresetList(componentType, preset);
    } catch (error) {
      throw new PresetStorageError(
        `Failed to save preset ${preset.id} for ${componentType}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Load preset from storage
   *
   * @param componentType - Component type
   * @param presetId - Preset ID to load
   * @returns Promise resolving to preset data
   * @throws {PresetStorageError} If preset not found or load fails
   */
  async load(componentType: ComponentType, presetId: string): Promise<ComponentPreset> {
    try {
      const key = this.getPresetKey(componentType, presetId);
      const saveData = await this.adapter.get<PresetSaveData>(key);

      if (!saveData) {
        throw new PresetStorageError(
          `Preset not found: ${presetId} for ${componentType}`
        );
      }

      // Validate checksum if present
      if (saveData.checksum) {
        const currentChecksum = this.generateChecksum(saveData.preset);
        if (currentChecksum !== saveData.checksum) {
          console.warn(
            `Preset ${presetId} checksum mismatch. Data may be corrupted.`
          );
        }
      }

      return saveData.preset;
    } catch (error) {
      if (error instanceof PresetStorageError) {
        throw error;
      }
      throw new PresetStorageError(
        `Failed to load preset ${presetId} for ${componentType}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Delete preset from storage
   *
   * @param componentType - Component type
   * @param presetId - Preset ID to delete
   * @returns Promise resolving when delete is complete
   * @throws {PresetStorageError} If delete fails
   */
  async delete(componentType: ComponentType, presetId: string): Promise<void> {
    try {
      const key = this.getPresetKey(componentType, presetId);
      await this.adapter.remove(key);

      // Remove from preset list
      await this.removeFromPresetList(componentType, presetId);
    } catch (error) {
      throw new PresetStorageError(
        `Failed to delete preset ${presetId} for ${componentType}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Check if preset exists in storage
   *
   * @param componentType - Component type
   * @param presetId - Preset ID to check
   * @returns Promise resolving to true if preset exists
   */
  async exists(componentType: ComponentType, presetId: string): Promise<boolean> {
    try {
      const key = this.getPresetKey(componentType, presetId);
      const data = await this.adapter.get(key);
      return data !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * List all presets for a component type
   *
   * @param componentType - Component type to filter by (optional)
   * @returns Promise resolving to array of preset list items
   */
  async list(componentType?: ComponentType): Promise<PresetListItem[]> {
    try {
      const key = this.getListKey();
      const list = await this.adapter.get<PresetListItem[]>(key);
      const allPresets = list || [];

      // Filter by component type if specified
      if (componentType) {
        return allPresets.filter((item) => item.componentType === componentType);
      }

      return allPresets;
    } catch (error) {
      console.warn('Failed to load preset list:', error);
      return [];
    }
  }

  /**
   * Search presets by criteria
   *
   * @param criteria - Search criteria
   * @returns Promise resolving to filtered preset list items
   */
  async search(criteria: {
    componentType?: ComponentType;
    searchTerm?: string;
    isCustom?: boolean;
  }): Promise<PresetListItem[]> {
    const list = await this.list(criteria.componentType);

    return list.filter((item) => {
      // Filter by custom flag
      if (criteria.isCustom !== undefined && item.isCustom !== criteria.isCustom) {
        return false;
      }

      // Filter by search term
      if (criteria.searchTerm) {
        const term = criteria.searchTerm.toLowerCase();
        const nameMatch = item.name.toLowerCase().includes(term);
        const descMatch = item.description?.toLowerCase().includes(term);

        if (!nameMatch && !descMatch) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Get preset metadata without loading full preset
   *
   * @param componentType - Component type
   * @param presetId - Preset ID
   * @returns Promise resolving to preset list item or null
   */
  async getMetadata(
    componentType: ComponentType,
    presetId: string
  ): Promise<PresetListItem | null> {
    const list = await this.list(componentType);
    return list.find((item) => item.id === presetId) || null;
  }

  /**
   * Clear all presets for a component type (or all presets)
   *
   * @param componentType - Component type to clear (optional, clears all if not specified)
   * @returns Promise resolving when clear is complete
   * @throws {PresetStorageError} If clear fails
   */
  async clear(componentType?: ComponentType): Promise<void> {
    try {
      // Get presets to delete
      const list = await this.list(componentType);

      // Delete each preset
      await Promise.all(
        list.map((item) => this.delete(item.componentType, item.id))
      );

      // If clearing all, also clear the main list
      if (!componentType) {
        const listKey = this.getListKey();
        await this.adapter.remove(listKey);
      }
    } catch (error) {
      throw new PresetStorageError(
        `Failed to clear presets${componentType ? ` for ${componentType}` : ''}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Export preset as JSON string
   *
   * @param preset - Preset to export
   * @param componentType - Component type
   * @param prettyPrint - Whether to format JSON with indentation
   * @returns JSON string
   */
  exportAsJSON(
    componentType: ComponentType,
    preset: ComponentPreset,
    prettyPrint = true
  ): string {
    const saveData: PresetSaveData = {
      componentType,
      preset,
      savedAt: Date.now(),
      checksum: this.generateChecksum(preset),
    };

    return JSON.stringify(saveData, null, prettyPrint ? 2 : 0);
  }

  /**
   * Import preset from JSON string
   *
   * @param jsonString - JSON string to import
   * @returns Imported preset with component type
   * @throws {PresetStorageError} If import fails
   */
  importFromJSON(jsonString: string): {
    componentType: ComponentType;
    preset: ComponentPreset;
  } {
    try {
      const saveData = JSON.parse(jsonString) as PresetSaveData;

      if (!saveData.preset) {
        throw new Error('Invalid preset data: missing preset property');
      }

      if (!saveData.componentType) {
        throw new Error('Invalid preset data: missing componentType property');
      }

      // Validate checksum if present
      if (saveData.checksum) {
        const currentChecksum = this.generateChecksum(saveData.preset);
        if (currentChecksum !== saveData.checksum) {
          console.warn('Preset checksum mismatch. Data may be corrupted.');
        }
      }

      return {
        componentType: saveData.componentType,
        preset: saveData.preset,
      };
    } catch (error) {
      throw new PresetStorageError(
        `Failed to import preset from JSON: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Export all presets for a component type as JSON
   *
   * @param componentType - Component type
   * @param prettyPrint - Whether to format JSON with indentation
   * @returns JSON string with array of presets
   */
  async exportAllAsJSON(
    componentType: ComponentType,
    prettyPrint = true
  ): Promise<string> {
    const list = await this.list(componentType);
    const presets = await Promise.all(
      list.map((item) => this.load(item.componentType, item.id))
    );

    const exportData = presets.map((preset) => ({
      componentType,
      preset,
      savedAt: Date.now(),
      checksum: this.generateChecksum(preset),
    }));

    return JSON.stringify(exportData, null, prettyPrint ? 2 : 0);
  }

  /**
   * Import multiple presets from JSON
   *
   * @param jsonString - JSON string with array of presets
   * @returns Array of imported presets with component types
   * @throws {PresetStorageError} If import fails
   */
  importManyFromJSON(jsonString: string): Array<{
    componentType: ComponentType;
    preset: ComponentPreset;
  }> {
    try {
      const saveDataArray = JSON.parse(jsonString) as PresetSaveData[];

      if (!Array.isArray(saveDataArray)) {
        throw new Error('Invalid preset data: expected array');
      }

      return saveDataArray.map((saveData) => {
        if (!saveData.preset || !saveData.componentType) {
          throw new Error('Invalid preset data in array');
        }

        // Validate checksum if present
        if (saveData.checksum) {
          const currentChecksum = this.generateChecksum(saveData.preset);
          if (currentChecksum !== saveData.checksum) {
            console.warn(
              `Preset ${saveData.preset.id} checksum mismatch. Data may be corrupted.`
            );
          }
        }

        return {
          componentType: saveData.componentType,
          preset: saveData.preset,
        };
      });
    } catch (error) {
      throw new PresetStorageError(
        `Failed to import presets from JSON: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Update preset list metadata
   */
  private async updatePresetList(
    componentType: ComponentType,
    preset: ComponentPreset
  ): Promise<void> {
    const list = await this.list();

    // Remove existing entry if present
    const filteredList = list.filter((item) => item.id !== preset.id);

    // Create list item from preset
    const listItem: PresetListItem = {
      id: preset.id,
      componentType,
      name: preset.name,
      description: preset.description,
      thumbnail: preset.thumbnail,
      updatedAt: Date.now(),
      isCustom: preset.isCustom,
    };

    // Add to list
    filteredList.push(listItem);

    // Sort by updatedAt (most recent first)
    filteredList.sort((a, b) => b.updatedAt - a.updatedAt);

    // Save updated list
    const key = this.getListKey();
    await this.adapter.set(key, filteredList);
  }

  /**
   * Remove preset from list
   */
  private async removeFromPresetList(
    _componentType: ComponentType,
    presetId: string
  ): Promise<void> {
    const list = await this.list();
    const filteredList = list.filter((item) => item.id !== presetId);

    const key = this.getListKey();
    await this.adapter.set(key, filteredList);
  }

  /**
   * Generate storage key for preset
   */
  private getPresetKey(componentType: ComponentType, presetId: string): string {
    return `${this.keyPrefix}:preset:${componentType}:${presetId}`;
  }

  /**
   * Generate storage key for preset list
   */
  private getListKey(): string {
    return `${this.keyPrefix}:presets:list`;
  }

  /**
   * Generate checksum for preset data integrity
   *
   * Simple implementation using JSON string length and hash
   */
  private generateChecksum(preset: ComponentPreset): string {
    const str = JSON.stringify(preset);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return `${str.length}-${hash}`;
  }
}
