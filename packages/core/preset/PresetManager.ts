/**
 * Preset Manager
 *
 * Core service for preset CRUD operations and lifecycle management
 */

import type {
  ComponentPreset,
  ComponentType,
  BaseComponent,
  BaseStyles,
} from '../types/component.types';
import type { PresetListItem } from '../types/preset.types';
import type { ComponentRegistry } from '../components/ComponentRegistry';
import { PresetStorage } from './PresetStorage';
import { EventEmitter } from '../services/EventEmitter';

/**
 * Preset Manager Error
 */
export class PresetManagerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PresetManagerError';
  }
}

/**
 * Preset Manager events
 */
export enum PresetManagerEvent {
  PRESET_CREATED = 'preset:created',
  PRESET_UPDATED = 'preset:updated',
  PRESET_DELETED = 'preset:deleted',
  PRESET_APPLIED = 'preset:applied',
}

/**
 * Preset creation options
 */
export interface CreatePresetOptions {
  componentType: ComponentType;
  name: string;
  description?: string | undefined;
  thumbnail?: string | undefined;
  styles: BaseStyles;
  isCustom?: boolean | undefined;
}

/**
 * Preset update options
 */
export interface UpdatePresetOptions {
  name?: string | undefined;
  description?: string | undefined;
  thumbnail?: string | undefined;
  styles?: BaseStyles | undefined;
}

/**
 * Preset Manager Service
 *
 * Provides high-level preset management operations
 */
export class PresetManager {
  private storage: PresetStorage;
  private registry: ComponentRegistry;
  private eventEmitter: EventEmitter;

  constructor(storage: PresetStorage, registry: ComponentRegistry) {
    this.storage = storage;
    this.registry = registry;
    this.eventEmitter = new EventEmitter();
  }

  /**
   * Create new preset
   *
   * @param options - Preset creation options
   * @returns Created preset
   * @throws {PresetManagerError} If creation fails
   */
  async create(options: CreatePresetOptions): Promise<ComponentPreset> {
    try {
      const preset: ComponentPreset = {
        id: this.generateId(),
        name: options.name,
        description: options.description,
        thumbnail: options.thumbnail,
        styles: options.styles,
        isCustom: options.isCustom ?? true,
        createdAt: Date.now(),
      };

      // Add to registry (in-memory)
      this.registry.addPreset(options.componentType, preset);

      // Save to storage (persistence)
      await this.storage.save(options.componentType, preset);

      // Emit event
      this.eventEmitter.emit(PresetManagerEvent.PRESET_CREATED, {
        componentType: options.componentType,
        preset,
      });

      return preset;
    } catch (error) {
      throw new PresetManagerError(
        `Failed to create preset: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Load preset from storage
   *
   * @param componentType - Component type
   * @param presetId - Preset ID to load
   * @returns Loaded preset
   * @throws {PresetManagerError} If load fails
   */
  async load(componentType: ComponentType, presetId: string): Promise<ComponentPreset> {
    try {
      return await this.storage.load(componentType, presetId);
    } catch (error) {
      throw new PresetManagerError(
        `Failed to load preset: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Update preset
   *
   * @param componentType - Component type
   * @param presetId - Preset ID to update
   * @param options - Update options
   * @returns Updated preset
   * @throws {PresetManagerError} If update fails
   */
  async update(
    componentType: ComponentType,
    presetId: string,
    options: UpdatePresetOptions
  ): Promise<ComponentPreset> {
    try {
      // Load existing preset
      const preset = await this.storage.load(componentType, presetId);

      // Apply updates
      const updatedPreset: ComponentPreset = {
        id: preset.id, // ID cannot be changed
        name: options.name ?? preset.name,
        description: options.description !== undefined ? options.description : preset.description,
        thumbnail: options.thumbnail !== undefined ? options.thumbnail : preset.thumbnail,
        styles: options.styles ? { ...preset.styles, ...options.styles } : preset.styles,
        isCustom: preset.isCustom,
        createdAt: preset.createdAt, // createdAt cannot be changed
      };

      // Update in registry (in-memory)
      this.registry.updatePreset(componentType, presetId, updatedPreset);

      // Save to storage (persistence)
      await this.storage.save(componentType, updatedPreset);

      // Emit event
      this.eventEmitter.emit(PresetManagerEvent.PRESET_UPDATED, {
        componentType,
        preset: updatedPreset,
      });

      return updatedPreset;
    } catch (error) {
      throw new PresetManagerError(
        `Failed to update preset: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Delete preset
   *
   * @param componentType - Component type
   * @param presetId - Preset ID to delete
   * @throws {PresetManagerError} If delete fails
   */
  async delete(componentType: ComponentType, presetId: string): Promise<void> {
    try {
      // Remove from registry (in-memory)
      this.registry.removePreset(componentType, presetId);

      // Remove from storage (persistence)
      await this.storage.delete(componentType, presetId);

      // Emit event
      this.eventEmitter.emit(PresetManagerEvent.PRESET_DELETED, {
        componentType,
        presetId,
      });
    } catch (error) {
      throw new PresetManagerError(
        `Failed to delete preset: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Apply preset to component
   *
   * @param component - Component to apply preset to
   * @param componentType - Component type
   * @param presetId - Preset ID to apply
   * @returns Component with preset applied
   * @throws {PresetManagerError} If apply fails
   */
  async apply(
    component: BaseComponent,
    componentType: ComponentType,
    presetId: string
  ): Promise<BaseComponent> {
    try {
      // Get preset from registry or load from storage
      let preset = this.registry.getPreset(componentType, presetId);

      if (!preset) {
        preset = await this.storage.load(componentType, presetId);
      }

      // Apply preset styles to component
      const updatedComponent: BaseComponent = {
        ...component,
        styles: {
          ...component.styles,
          ...preset.styles,
        },
      };

      // Emit event
      this.eventEmitter.emit(PresetManagerEvent.PRESET_APPLIED, {
        componentType,
        presetId,
        componentId: component.id,
      });

      return updatedComponent;
    } catch (error) {
      throw new PresetManagerError(
        `Failed to apply preset: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * List all presets for a component type
   *
   * @param componentType - Component type to filter by (optional)
   * @returns Array of preset list items
   */
  async list(componentType?: ComponentType): Promise<PresetListItem[]> {
    return this.storage.list(componentType);
  }

  /**
   * Search presets
   *
   * @param criteria - Search criteria
   * @returns Filtered preset list items
   */
  async search(criteria: {
    componentType?: ComponentType;
    searchTerm?: string;
    isCustom?: boolean;
  }): Promise<PresetListItem[]> {
    return this.storage.search(criteria);
  }

  /**
   * Get preset metadata
   *
   * @param componentType - Component type
   * @param presetId - Preset ID
   * @returns Preset list item or null
   */
  async getMetadata(
    componentType: ComponentType,
    presetId: string
  ): Promise<PresetListItem | null> {
    return this.storage.getMetadata(componentType, presetId);
  }

  /**
   * Duplicate preset
   *
   * @param componentType - Component type
   * @param presetId - Preset ID to duplicate
   * @param newName - Name for duplicated preset
   * @returns Duplicated preset
   * @throws {PresetManagerError} If duplication fails
   */
  async duplicate(
    componentType: ComponentType,
    presetId: string,
    newName?: string
  ): Promise<ComponentPreset> {
    try {
      const original = await this.storage.load(componentType, presetId);

      const duplicated: ComponentPreset = {
        ...original,
        id: this.generateId(),
        name: newName || `${original.name} (Copy)`,
        isCustom: true, // Duplicates are always custom
        createdAt: Date.now(),
      };

      // Add to registry (in-memory)
      this.registry.addPreset(componentType, duplicated);

      // Save to storage (persistence)
      await this.storage.save(componentType, duplicated);

      // Emit event
      this.eventEmitter.emit(PresetManagerEvent.PRESET_CREATED, {
        componentType,
        preset: duplicated,
      });

      return duplicated;
    } catch (error) {
      throw new PresetManagerError(
        `Failed to duplicate preset: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Load all presets from storage into registry
   *
   * This should be called on initialization to restore presets
   *
   * @throws {PresetManagerError} If loading fails
   */
  async loadAllFromStorage(): Promise<void> {
    try {
      const allPresets = await this.storage.list();

      // Group presets by component type
      const presetsByType = new Map<ComponentType, ComponentPreset[]>();

      for (const item of allPresets) {
        const preset = await this.storage.load(item.componentType, item.id);
        const presets = presetsByType.get(item.componentType) || [];
        presets.push(preset);
        presetsByType.set(item.componentType, presets);
      }

      // Add all presets to registry
      for (const [componentType, presets] of presetsByType.entries()) {
        for (const preset of presets) {
          this.registry.addPreset(componentType, preset);
        }
      }
    } catch (error) {
      throw new PresetManagerError(
        `Failed to load presets from storage: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Export preset as JSON
   *
   * @param componentType - Component type
   * @param presetId - Preset ID to export
   * @returns JSON string
   * @throws {PresetManagerError} If export fails
   */
  async exportAsJSON(componentType: ComponentType, presetId: string): Promise<string> {
    try {
      const preset = await this.storage.load(componentType, presetId);
      return this.storage.exportAsJSON(componentType, preset);
    } catch (error) {
      throw new PresetManagerError(
        `Failed to export preset: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Import preset from JSON
   *
   * @param jsonString - JSON string to import
   * @returns Imported preset
   * @throws {PresetManagerError} If import fails
   */
  async importFromJSON(jsonString: string): Promise<ComponentPreset> {
    try {
      const { componentType, preset } = this.storage.importFromJSON(jsonString);

      // Generate new ID to avoid conflicts
      const importedPreset: ComponentPreset = {
        ...preset,
        id: this.generateId(),
        isCustom: true,
        createdAt: Date.now(),
      };

      // Add to registry (in-memory)
      this.registry.addPreset(componentType, importedPreset);

      // Save to storage (persistence)
      await this.storage.save(componentType, importedPreset);

      // Emit event
      this.eventEmitter.emit(PresetManagerEvent.PRESET_CREATED, {
        componentType,
        preset: importedPreset,
      });

      return importedPreset;
    } catch (error) {
      throw new PresetManagerError(
        `Failed to import preset: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Create preset from component's current styles
   *
   * @param component - Component to create preset from
   * @param componentType - Component type
   * @param name - Preset name
   * @param description - Preset description
   * @returns Created preset
   * @throws {PresetManagerError} If creation fails
   */
  async createFromComponent(
    component: BaseComponent,
    componentType: ComponentType,
    name: string,
    description?: string
  ): Promise<ComponentPreset> {
    try {
      return await this.create({
        componentType,
        name,
        description,
        styles: component.styles,
        isCustom: true,
      });
    } catch (error) {
      throw new PresetManagerError(
        `Failed to create preset from component: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Subscribe to preset events
   *
   * @param event - Event name
   * @param callback - Event callback
   * @returns Event subscription with unsubscribe method
   */
  on(event: PresetManagerEvent, callback: (data: unknown) => void) {
    return this.eventEmitter.on(event, callback);
  }

  /**
   * Unsubscribe from preset events
   *
   * @param event - Event name (optional, clears all if not specified)
   */
  off(event?: PresetManagerEvent): void {
    this.eventEmitter.off(event);
  }

  /**
   * Generate unique preset ID using crypto.randomUUID for security
   */
  private generateId(): string {
    // Use crypto.randomUUID for cryptographically secure random IDs
    const uuid = crypto.randomUUID().slice(0, 9);
    return `pst_${Date.now()}_${uuid}`;
  }
}
