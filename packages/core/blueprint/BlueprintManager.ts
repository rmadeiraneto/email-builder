/**
 * Blueprint Manager
 * Manages template blueprints and blueprint instantiation
 */

import type {
  TemplateBlueprint,
  BlueprintCategory,
  BlueprintInstantiationOptions,
  BlueprintInstantiationResult,
  BlueprintError,
} from '../types/blueprint.types';
import type { Template } from '../types/template.types';
import type { BaseComponent } from '../types/component.types';
import { EventEmitter } from '../services/EventEmitter';
import { StorageAdapter } from '../types/config.types';

export interface BlueprintManagerConfig {
  storage?: StorageAdapter;
}

export class BlueprintManager extends EventEmitter {
  private blueprints: Map<string, TemplateBlueprint> = new Map();
  private storage?: StorageAdapter;

  constructor(config: BlueprintManagerConfig = {}) {
    super();
    this.storage = config.storage;
  }

  // ============================================================================
  // BLUEPRINT MANAGEMENT
  // ============================================================================

  /**
   * Register a blueprint
   */
  register(blueprint: TemplateBlueprint): void {
    this.blueprints.set(blueprint.id, blueprint);
    this.emit('blueprint:registered', { blueprint });

    if (this.storage) {
      this.storage.set(`blueprint:${blueprint.id}`, blueprint);
    }
  }

  /**
   * Get a blueprint by ID
   */
  get(blueprintId: string): TemplateBlueprint | undefined {
    return this.blueprints.get(blueprintId);
  }

  /**
   * Get all blueprints
   */
  getAll(): TemplateBlueprint[] {
    return Array.from(this.blueprints.values());
  }

  /**
   * Get blueprints by category
   */
  getByCategory(category: BlueprintCategory): TemplateBlueprint[] {
    return this.getAll().filter((b) => b.category === category);
  }

  /**
   * Update a blueprint
   */
  update(
    blueprintId: string,
    updates: Partial<Omit<TemplateBlueprint, 'id'>>
  ): TemplateBlueprint {
    const blueprint = this.blueprints.get(blueprintId);
    if (!blueprint) {
      throw new Error(`Blueprint not found: ${blueprintId}`);
    }

    const updated: TemplateBlueprint = {
      ...blueprint,
      ...updates,
      metadata: {
        ...blueprint.metadata,
        ...updates.metadata,
        updatedAt: Date.now(),
      },
    };

    this.blueprints.set(blueprintId, updated);
    this.emit('blueprint:updated', { blueprint: updated });

    if (this.storage) {
      this.storage.set(`blueprint:${blueprintId}`, updated);
    }

    return updated;
  }

  /**
   * Delete a blueprint
   */
  delete(blueprintId: string): void {
    const blueprint = this.blueprints.get(blueprintId);
    if (!blueprint) {
      throw new Error(`Blueprint not found: ${blueprintId}`);
    }

    this.blueprints.delete(blueprintId);
    this.emit('blueprint:deleted', { blueprintId });

    if (this.storage) {
      this.storage.remove(`blueprint:${blueprintId}`);
    }
  }

  // ============================================================================
  // BLUEPRINT INSTANTIATION
  // ============================================================================

  /**
   * Create a template from a blueprint
   */
  instantiate(options: BlueprintInstantiationOptions): BlueprintInstantiationResult {
    const blueprint = this.blueprints.get(options.blueprintId);
    if (!blueprint) {
      return {
        success: false,
        errors: [
          {
            type: 'validation-failed',
            message: `Blueprint not found: ${options.blueprintId}`,
          },
        ],
      };
    }

    const errors: BlueprintError[] = [];
    const components: BaseComponent[] = [];

    try {
      // Build components from blueprint sections
      for (const section of blueprint.structure) {
        for (const blueprintComponent of section.components) {
          // Check if this component has a slot
          if (blueprintComponent.slotId && options.slotContent) {
            const slotContent = options.slotContent[blueprintComponent.slotId];
            if (slotContent) {
              // Use slot content
              const component: BaseComponent = {
                ...(blueprintComponent.componentData as BaseComponent),
                id: this.generateComponentId(),
                type: slotContent.componentType || blueprintComponent.type,
                content: slotContent.content || blueprintComponent.componentData.content || {},
                styles: slotContent.styles || blueprintComponent.componentData.styles || {},
                metadata: {
                  name: blueprintComponent.componentData.metadata?.name || 'Component',
                  description: blueprintComponent.componentData.metadata?.description,
                },
                createdAt: Date.now(),
                updatedAt: Date.now(),
                version: '1.0.0',
              };
              components.push(component);
            } else {
              // Check if slot is required
              const slot = blueprint.slots.find((s) => s.id === blueprintComponent.slotId);
              if (slot && slot.minComponents && slot.minComponents > 0) {
                errors.push({
                  type: 'missing-slot',
                  message: `Required slot not provided: ${slot.name}`,
                  slotId: slot.id,
                });
              }
            }
          } else {
            // Use default component from blueprint
            const component: BaseComponent = {
              ...(blueprintComponent.componentData as BaseComponent),
              id: this.generateComponentId(),
              createdAt: Date.now(),
              updatedAt: Date.now(),
              version: '1.0.0',
            };
            components.push(component);
          }
        }
      }

      if (errors.length > 0) {
        return { success: false, errors };
      }

      // Create the template
      const template: Template = {
        metadata: {
          id: this.generateTemplateId(),
          name: options.name,
          description: `Created from blueprint: ${blueprint.name}`,
          category: blueprint.category,
          version: '1.0.0',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        settings: {
          target: 'email',
          canvasDimensions: {
            width: blueprint.defaults.canvasWidth || 600,
            maxWidth: blueprint.defaults.canvasWidth || 600,
          },
          responsive: true,
          locale: 'en-US',
        },
        generalStyles: {
          fontFamily: 'Arial, sans-serif',
          fontSize: { value: 16, unit: 'px' },
          color: '#000000',
          backgroundColor: '#ffffff',
        },
        components,
        version: '1.0.0',
      };

      this.emit('blueprint:instantiated', { blueprint, template, options });

      return {
        success: true,
        template,
      };
    } catch (error) {
      return {
        success: false,
        errors: [
          {
            type: 'validation-failed',
            message: error instanceof Error ? error.message : 'Unknown error',
          },
        ],
      };
    }
  }

  // ============================================================================
  // UTILITIES
  // ============================================================================

  /**
   * Search blueprints
   */
  search(query: string): TemplateBlueprint[] {
    const lowerQuery = query.toLowerCase();
    return this.getAll().filter((blueprint) => {
      const nameMatch = blueprint.name.toLowerCase().includes(lowerQuery);
      const descMatch = blueprint.description?.toLowerCase().includes(lowerQuery);
      const tagMatch = blueprint.metadata.tags?.some((tag) =>
        tag.toLowerCase().includes(lowerQuery)
      );

      return nameMatch || descMatch || tagMatch;
    });
  }

  /**
   * Duplicate a blueprint
   */
  duplicate(blueprintId: string, newName: string): TemplateBlueprint {
    const original = this.blueprints.get(blueprintId);
    if (!original) {
      throw new Error(`Blueprint not found: ${blueprintId}`);
    }

    const duplicated: TemplateBlueprint = {
      ...JSON.parse(JSON.stringify(original)),
      id: this.generateBlueprintId(),
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

  /**
   * Generate blueprint ID
   */
  private generateBlueprintId(): string {
    return `blueprint-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate template ID
   */
  private generateTemplateId(): string {
    return `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate component ID
   */
  private generateComponentId(): string {
    return `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Import blueprints from JSON
   */
  import(json: string): TemplateBlueprint[] {
    const blueprints = JSON.parse(json) as TemplateBlueprint[];
    blueprints.forEach((b) => this.register(b));
    return blueprints;
  }

  /**
   * Export blueprints to JSON
   */
  export(blueprintIds?: string[]): string {
    const blueprints = blueprintIds
      ? blueprintIds
          .map((id) => this.blueprints.get(id))
          .filter((b): b is TemplateBlueprint => b !== undefined)
      : this.getAll();

    return JSON.stringify(blueprints, null, 2);
  }
}

export default BlueprintManager;
