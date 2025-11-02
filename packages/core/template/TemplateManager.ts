/**
 * Template Manager
 *
 * Core service for template CRUD operations and lifecycle management
 */

import {
  TemplateNotFoundError,
  ComponentNotFoundError,
  ValidationError,
  StorageError,
} from '../errors';
import type {
  Template,
  TemplateMetadata,
  TemplateSettings,
  GeneralStyles,
  TemplateListItem,
  TemplateValidationResult,
} from '../types/template.types';
import type { BaseComponent } from '../types/component.types';
import type { ComponentRegistry } from '../components/ComponentRegistry';
import { TemplateStorage } from './TemplateStorage';
import { TemplateValidator } from './TemplateValidator';
import { ComponentTreeBuilder } from './ComponentTreeBuilder';
import { EventEmitter } from '../services/EventEmitter';

/**
 * Template Manager events
 */
export enum TemplateManagerEvent {
  TEMPLATE_CREATED = 'template:created',
  TEMPLATE_UPDATED = 'template:updated',
  TEMPLATE_DELETED = 'template:deleted',
  TEMPLATE_LOADED = 'template:loaded',
  TEMPLATE_VALIDATED = 'template:validated',
}

/**
 * Template creation options
 */
export interface CreateTemplateOptions {
  name: string;
  description?: string;
  author?: string;
  category?: string;
  tags?: string[];
  settings: TemplateSettings;
  generalStyles?: GeneralStyles;
  components?: BaseComponent[];
}

/**
 * Template update options
 */
export interface UpdateTemplateOptions {
  metadata?: Partial<Omit<TemplateMetadata, 'id' | 'createdAt'>>;
  settings?: Partial<TemplateSettings>;
  generalStyles?: Partial<GeneralStyles>;
  components?: BaseComponent[];
}

/**
 * Template Manager Service
 *
 * Provides high-level template management operations
 */
export class TemplateManager {
  private storage: TemplateStorage;
  private validator: TemplateValidator;
  private treeBuilder: ComponentTreeBuilder;
  private eventEmitter: EventEmitter;
  private registry: ComponentRegistry;
  private currentTemplate: Template | null = null;

  constructor(storage: TemplateStorage, registry: ComponentRegistry) {
    this.storage = storage;
    this.registry = registry;
    this.validator = new TemplateValidator(registry);
    this.treeBuilder = new ComponentTreeBuilder();
    this.eventEmitter = new EventEmitter();
  }

  /**
   * Create new template
   *
   * @param options - Template creation options
   * @returns Created template
   * @throws {TemplateManagerError} If creation fails
   */
  async create(options: CreateTemplateOptions): Promise<Template> {
    try {
      const now = Date.now();
      const templateId = this.generateId();

      const template: Template = {
        metadata: {
          id: templateId,
          name: options.name,
          description: options.description,
          author: options.author,
          category: options.category,
          tags: options.tags,
          thumbnail: undefined,
          version: '1.0.0',
          createdAt: now,
          updatedAt: now,
        },
        settings: options.settings,
        generalStyles: options.generalStyles || {},
        components: options.components || [],
        componentTree: undefined,
        dataInjection: {
          enabled: false,
        },
        customData: {},
      };

      // Build component tree if components are provided
      if (template.components.length > 0) {
        template.componentTree = this.treeBuilder.buildTree(template.components);
      }

      // Validate template
      const validation = this.validator.validate(template);
      if (!validation.valid) {
        const errors = validation.errors
          .filter((e) => e.severity === 'error')
          .map((e) => ({ field: e.field || 'unknown', message: e.message }));
        throw new ValidationError(
          `Template validation failed: ${errors.map(e => e.message).join(', ')}`,
          errors
        );
      }

      // Save template
      await this.storage.save(template);

      // Set as current template
      this.currentTemplate = template;

      // Emit event
      this.eventEmitter.emit(TemplateManagerEvent.TEMPLATE_CREATED, {
        template,
      });

      return template;
    } catch (error) {
      if (error instanceof TemplateManagerError) {
        throw error;
      }
      throw new TemplateManagerError(
        `Failed to create template: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Load template from storage
   *
   * @param templateId - Template ID to load
   * @returns Loaded template
   * @throws {TemplateManagerError} If load fails
   */
  async load(templateId: string): Promise<Template> {
    try {
      const template = await this.storage.load(templateId);

      // Rebuild component tree if missing
      if (!template.componentTree && template.components.length > 0) {
        template.componentTree = this.treeBuilder.buildTree(template.components);
      }

      // Set as current template
      this.currentTemplate = template;

      // Emit event
      this.eventEmitter.emit(TemplateManagerEvent.TEMPLATE_LOADED, {
        template,
      });

      return template;
    } catch (error) {
      throw new TemplateManagerError(
        `Failed to load template: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Update template
   *
   * @param templateId - Template ID to update
   * @param options - Update options
   * @returns Updated template
   * @throws {TemplateManagerError} If update fails
   */
  async update(
    templateId: string,
    options: UpdateTemplateOptions
  ): Promise<Template> {
    try {
      // Load existing template
      const template = await this.storage.load(templateId);

      // Apply updates
      if (options.metadata) {
        template.metadata = {
          ...template.metadata,
          ...options.metadata,
          id: template.metadata.id, // ID cannot be changed
          createdAt: template.metadata.createdAt, // createdAt cannot be changed
          updatedAt: Date.now(),
        };
      }

      if (options.settings) {
        template.settings = {
          ...template.settings,
          ...options.settings,
        };
      }

      if (options.generalStyles) {
        template.generalStyles = {
          ...template.generalStyles,
          ...options.generalStyles,
        };
      }

      if (options.components) {
        template.components = options.components;
        // Rebuild component tree
        template.componentTree = this.treeBuilder.buildTree(options.components);
      }

      // Update version if metadata changed
      if (options.metadata || options.settings || options.generalStyles) {
        template.metadata.version = this.incrementVersion(
          template.metadata.version
        );
      }

      // Validate updated template
      const validation = this.validator.validate(template);
      if (!validation.valid) {
        const errors = validation.errors
          .filter((e) => e.severity === 'error')
          .map((e) => e.message);
        throw new TemplateManagerError(
          `Template validation failed: ${errors.join(', ')}`
        );
      }

      // Save updated template
      await this.storage.save(template);

      // Update current template if it's the same
      if (this.currentTemplate?.metadata.id === templateId) {
        this.currentTemplate = template;
      }

      // Emit event
      this.eventEmitter.emit(TemplateManagerEvent.TEMPLATE_UPDATED, {
        template,
      });

      return template;
    } catch (error) {
      if (error instanceof TemplateManagerError) {
        throw error;
      }
      throw new TemplateManagerError(
        `Failed to update template: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Delete template
   *
   * @param templateId - Template ID to delete
   * @throws {TemplateManagerError} If delete fails
   */
  async delete(templateId: string): Promise<void> {
    try {
      await this.storage.delete(templateId);

      // Clear current template if it's the one being deleted
      if (this.currentTemplate?.metadata.id === templateId) {
        this.currentTemplate = null;
      }

      // Emit event
      this.eventEmitter.emit(TemplateManagerEvent.TEMPLATE_DELETED, {
        templateId,
      });
    } catch (error) {
      throw new TemplateManagerError(
        `Failed to delete template: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Validate template
   *
   * @param template - Template to validate
   * @returns Validation result
   */
  validate(template: Template): TemplateValidationResult {
    const result = this.validator.validate(template);

    this.eventEmitter.emit(TemplateManagerEvent.TEMPLATE_VALIDATED, {
      template,
      result,
    });

    return result;
  }

  /**
   * List all templates
   *
   * @returns Array of template list items
   */
  async list(): Promise<TemplateListItem[]> {
    return this.storage.list();
  }

  /**
   * Search templates
   *
   * @param criteria - Search criteria
   * @returns Filtered template list items
   */
  async search(criteria: {
    tags?: string[];
    category?: string;
    target?: string;
    searchTerm?: string;
  }): Promise<TemplateListItem[]> {
    return this.storage.search(criteria);
  }

  /**
   * Get template metadata
   *
   * @param templateId - Template ID
   * @returns Template list item or null
   */
  async getMetadata(templateId: string): Promise<TemplateListItem | null> {
    return this.storage.getMetadata(templateId);
  }

  /**
   * Duplicate template
   *
   * @param templateId - Template ID to duplicate
   * @param newName - Name for duplicated template
   * @returns Duplicated template
   * @throws {TemplateManagerError} If duplication fails
   */
  async duplicate(templateId: string, newName?: string): Promise<Template> {
    try {
      const original = await this.storage.load(templateId);

      const now = Date.now();
      const newId = this.generateId();

      const duplicated: Template = {
        ...original,
        metadata: {
          ...original.metadata,
          id: newId,
          name: newName || `${original.metadata.name} (Copy)`,
          createdAt: now,
          updatedAt: now,
          version: '1.0.0',
        },
      };

      // Save duplicated template
      await this.storage.save(duplicated);

      // Emit event
      this.eventEmitter.emit(TemplateManagerEvent.TEMPLATE_CREATED, {
        template: duplicated,
      });

      return duplicated;
    } catch (error) {
      throw new TemplateManagerError(
        `Failed to duplicate template: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get current template
   *
   * @returns Current template or null
   */
  getCurrentTemplate(): Template | null {
    return this.currentTemplate;
  }

  /**
   * Set current template
   *
   * @param template - Template to set as current
   */
  setCurrentTemplate(template: Template): void {
    this.currentTemplate = template;
  }

  /**
   * Clear current template
   */
  clearCurrentTemplate(): void {
    this.currentTemplate = null;
  }

  /**
   * Subscribe to template events
   *
   * @param event - Event name
   * @param callback - Event callback
   */
  on(event: TemplateManagerEvent, callback: (data: unknown) => void): void {
    this.eventEmitter.on(event, callback);
  }

  /**
   * Unsubscribe from template events
   *
   * @param event - Event name
   * @param callback - Event callback
   */
  off(event: TemplateManagerEvent, callback: (data: unknown) => void): void {
    this.eventEmitter.off(event, callback);
  }

  /**
   * Generate unique template ID using crypto.randomUUID for security
   */
  private generateId(): string {
    // Use crypto.randomUUID for cryptographically secure random IDs
    const uuid = crypto.randomUUID().slice(0, 9);
    return `tpl_${Date.now()}_${uuid}`;
  }

  /**
   * Increment semantic version
   */
  private incrementVersion(version: string): string {
    const parts = version.split('.');
    if (parts.length !== 3) {
      return '1.0.1';
    }

    const [major, minor, patch] = parts.map(Number);
    return `${major}.${minor}.${patch + 1}`;
  }
}
