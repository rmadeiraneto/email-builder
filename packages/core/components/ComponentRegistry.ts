/**
 * Component Registry
 *
 * Manages component definitions, creation, and presets
 */

import type {
  BaseComponent,
  ComponentDefinition,
  ComponentType,
  ComponentCategory,
  ComponentPreset,
  ValidationResult,
} from '../types';
import { EventEmitter } from '../services/EventEmitter';

/**
 * Registry events
 */
export enum RegistryEvent {
  COMPONENT_REGISTERED = 'component:registered',
  COMPONENT_UNREGISTERED = 'component:unregistered',
  PRESET_ADDED = 'preset:added',
  PRESET_REMOVED = 'preset:removed',
}

/**
 * Registry error types
 */
export class RegistryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RegistryError';
  }
}

/**
 * Component filter options
 */
export interface ComponentFilter {
  category?: ComponentCategory;
  tags?: string[];
  searchTerm?: string;
  customOnly?: boolean;
}

/**
 * Component Registry
 *
 * Central registry for managing component definitions
 */
export class ComponentRegistry {
  private definitions: Map<string, ComponentDefinition> = new Map();
  private presets: Map<string, Map<string, ComponentPreset>> = new Map(); // componentType -> presetId -> preset
  private eventEmitter: EventEmitter;

  constructor() {
    this.eventEmitter = new EventEmitter();
  }

  /**
   * Registers a component definition
   *
   * @param definition - Component definition to register
   * @throws {RegistryError} If component type is already registered
   */
  public register(definition: ComponentDefinition): void {
    if (this.definitions.has(definition.type)) {
      throw new RegistryError(`Component type "${definition.type}" is already registered`);
    }

    this.definitions.set(definition.type, definition);

    // Initialize presets map for this component
    if (definition.presets && definition.presets.length > 0) {
      const presetsMap = new Map<string, ComponentPreset>();
      definition.presets.forEach((preset) => {
        presetsMap.set(preset.id, preset);
      });
      this.presets.set(definition.type, presetsMap);
    }

    this.eventEmitter.emit(RegistryEvent.COMPONENT_REGISTERED, {
      type: definition.type,
      definition,
    });
  }

  /**
   * Registers multiple component definitions
   *
   * @param definitions - Array of component definitions
   */
  public registerMany(definitions: ComponentDefinition[]): void {
    definitions.forEach((def) => this.register(def));
  }

  /**
   * Unregisters a component definition
   *
   * @param type - Component type to unregister
   * @returns True if component was unregistered, false if not found
   */
  public unregister(type: ComponentType | string): boolean {
    const existed = this.definitions.delete(type);

    if (existed) {
      this.presets.delete(type);
      this.eventEmitter.emit(RegistryEvent.COMPONENT_UNREGISTERED, { type });
    }

    return existed;
  }

  /**
   * Gets a component definition
   *
   * @param type - Component type
   * @returns Component definition or undefined if not found
   */
  public get(type: ComponentType | string): ComponentDefinition | undefined {
    return this.definitions.get(type);
  }

  /**
   * Checks if a component type is registered
   *
   * @param type - Component type
   * @returns True if registered
   */
  public has(type: ComponentType | string): boolean {
    return this.definitions.has(type);
  }

  /**
   * Gets all registered component types
   *
   * @returns Array of component types
   */
  public getTypes(): string[] {
    return Array.from(this.definitions.keys());
  }

  /**
   * Gets all component definitions
   *
   * @returns Array of component definitions
   */
  public getAll(): ComponentDefinition[] {
    return Array.from(this.definitions.values());
  }

  /**
   * Gets components by category
   *
   * @param category - Component category
   * @returns Array of component definitions
   */
  public getByCategory(category: ComponentCategory): ComponentDefinition[] {
    return Array.from(this.definitions.values()).filter(
      (def) => def.metadata.category === category
    );
  }

  /**
   * Searches and filters components
   *
   * @param filter - Filter options
   * @returns Array of matching component definitions
   */
  public filter(filter: ComponentFilter): ComponentDefinition[] {
    let results = Array.from(this.definitions.values());

    // Filter by category
    if (filter.category) {
      results = results.filter((def) => def.metadata.category === filter.category);
    }

    // Filter by custom only
    if (filter.customOnly) {
      results = results.filter((def) => def.metadata.isCustom === true);
    }

    // Filter by tags
    if (filter.tags && filter.tags.length > 0) {
      results = results.filter((def) => {
        const defTags = def.metadata.tags || [];
        return filter.tags!.some((tag) => defTags.includes(tag));
      });
    }

    // Search by term (name, description, tags)
    if (filter.searchTerm) {
      const term = filter.searchTerm.toLowerCase();
      results = results.filter((def) => {
        const nameMatch = def.metadata.name.toLowerCase().includes(term);
        const descMatch = def.metadata.description?.toLowerCase().includes(term) || false;
        const tagMatch = def.metadata.tags?.some((tag) => tag.toLowerCase().includes(term)) || false;
        return nameMatch || descMatch || tagMatch;
      });
    }

    return results;
  }

  /**
   * Creates a component instance
   *
   * @param type - Component type
   * @returns New component instance
   * @throws {RegistryError} If component type is not registered
   */
  public create(type: ComponentType | string): BaseComponent {
    const definition = this.definitions.get(type);

    if (!definition) {
      throw new RegistryError(`Component type "${type}" is not registered`);
    }

    return definition.create();
  }

  /**
   * Creates a component instance with a preset applied
   *
   * @param type - Component type
   * @param presetId - Preset ID
   * @returns New component instance with preset applied
   * @throws {RegistryError} If component type or preset is not found
   */
  public createWithPreset(type: ComponentType | string, presetId: string): BaseComponent {
    const component = this.create(type);
    const preset = this.getPreset(type, presetId);

    if (!preset) {
      throw new RegistryError(`Preset "${presetId}" not found for component type "${type}"`);
    }

    // Apply preset styles
    component.styles = { ...component.styles, ...preset.styles };
    component.updatedAt = Date.now();

    return component;
  }

  /**
   * Validates a component
   *
   * @param component - Component to validate
   * @returns Validation result
   */
  public validate(component: BaseComponent): ValidationResult {
    const definition = this.definitions.get(component.type);

    if (!definition) {
      return {
        valid: false,
        errors: [`Component type "${component.type}" is not registered`],
      };
    }

    // Use custom validation if provided
    if (definition.validate) {
      return definition.validate(component);
    }

    // Default validation (basic checks)
    const errors: string[] = [];

    if (!component.id) {
      errors.push('Component ID is required');
    }

    if (!component.type) {
      errors.push('Component type is required');
    }

    if (!component.metadata) {
      errors.push('Component metadata is required');
    }

    const result: ValidationResult = {
      valid: errors.length === 0,
    };

    if (errors.length > 0) {
      result.errors = errors;
    }

    return result;
  }

  /**
   * Gets all presets for a component type
   *
   * @param type - Component type
   * @returns Array of presets
   */
  public getPresets(type: ComponentType | string): ComponentPreset[] {
    const presetsMap = this.presets.get(type);
    return presetsMap ? Array.from(presetsMap.values()) : [];
  }

  /**
   * Gets a specific preset
   *
   * @param type - Component type
   * @param presetId - Preset ID
   * @returns Preset or undefined if not found
   */
  public getPreset(type: ComponentType | string, presetId: string): ComponentPreset | undefined {
    const presetsMap = this.presets.get(type);
    return presetsMap?.get(presetId);
  }

  /**
   * Adds a preset to a component type
   *
   * @param type - Component type
   * @param preset - Preset to add
   * @throws {RegistryError} If component type is not registered or preset already exists
   */
  public addPreset(type: ComponentType | string, preset: ComponentPreset): void {
    if (!this.definitions.has(type)) {
      throw new RegistryError(`Component type "${type}" is not registered`);
    }

    let presetsMap = this.presets.get(type);

    if (!presetsMap) {
      presetsMap = new Map();
      this.presets.set(type, presetsMap);
    }

    if (presetsMap.has(preset.id)) {
      throw new RegistryError(
        `Preset "${preset.id}" already exists for component type "${type}"`
      );
    }

    presetsMap.set(preset.id, preset);

    this.eventEmitter.emit(RegistryEvent.PRESET_ADDED, {
      type,
      preset,
    });
  }

  /**
   * Removes a preset
   *
   * @param type - Component type
   * @param presetId - Preset ID
   * @returns True if preset was removed, false if not found
   */
  public removePreset(type: ComponentType | string, presetId: string): boolean {
    const presetsMap = this.presets.get(type);

    if (!presetsMap) {
      return false;
    }

    const existed = presetsMap.delete(presetId);

    if (existed) {
      this.eventEmitter.emit(RegistryEvent.PRESET_REMOVED, {
        type,
        presetId,
      });
    }

    return existed;
  }

  /**
   * Updates a preset
   *
   * @param type - Component type
   * @param presetId - Preset ID
   * @param updates - Partial preset updates
   * @throws {RegistryError} If preset is not found
   */
  public updatePreset(
    type: ComponentType | string,
    presetId: string,
    updates: Partial<ComponentPreset>
  ): void {
    const presetsMap = this.presets.get(type);
    const preset = presetsMap?.get(presetId);

    if (!preset) {
      throw new RegistryError(`Preset "${presetId}" not found for component type "${type}"`);
    }

    const updatedPreset = { ...preset, ...updates };
    presetsMap!.set(presetId, updatedPreset);
  }

  /**
   * Gets the total number of registered components
   *
   * @returns Number of registered components
   */
  public count(): number {
    return this.definitions.size;
  }

  /**
   * Clears all registered components and presets
   */
  public clear(): void {
    this.definitions.clear();
    this.presets.clear();
  }

  /**
   * Subscribes to registry events
   *
   * @param event - Event name
   * @param listener - Event listener
   * @returns Subscription object with unsubscribe method
   */
  public on<T = unknown>(event: RegistryEvent | string, listener: (data: T) => void) {
    return this.eventEmitter.on(event, listener);
  }

  /**
   * Unsubscribes from all events or specific event
   *
   * @param event - Optional event name
   */
  public off(event?: string) {
    this.eventEmitter.off(event);
  }
}
