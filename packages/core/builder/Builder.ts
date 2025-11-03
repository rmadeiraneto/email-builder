/**
 * Email Builder
 *
 * Main builder class that coordinates all builder functionality
 *
 * @example
 * ```ts
 * const builder = new Builder({
 *   target: 'email',
 *   storage: {
 *     method: 'local'
 *   },
 *   callbacks: {
 *     onSaveTemplate: (template) => console.log('Saved', template)
 *   }
 * });
 *
 * await builder.initialize();
 * ```
 */

import type {
  BuilderConfig,
  EventSubscription,
  Command,
  CommandResult,
  StorageConfig,
  FeatureFlags,
  BuilderCallbacks,
  StorageAdapter,
} from '../types';
import type {
  Template,
  TemplateListItem,
} from '../types/template.types';
import { EventEmitter } from '../services/EventEmitter';
import { CommandManager } from '../commands/CommandManager';
import { BuilderEvent } from '../types';
import { LocalStorageAdapter } from '../services/LocalStorageAdapter';
import { TemplateStorage } from '../template/TemplateStorage';
import { TemplateManager, type CreateTemplateOptions } from '../template/TemplateManager';
import { ComponentRegistry } from '../components/ComponentRegistry';
import { createDefaultRegistry } from '../components/definitions/registry-init';
import { PresetStorage } from '../preset/PresetStorage';
import { PresetManager } from '../preset/PresetManager';
import { CompatibilityService } from '../compatibility';

interface NormalizedConfig extends BuilderConfig {
  locale: string;
  features: Required<FeatureFlags>;
  callbacks: BuilderCallbacks;
  debug: boolean;
  storage: Required<Pick<StorageConfig, 'method' | 'keyPrefix'>> & Omit<StorageConfig, 'method' | 'keyPrefix'>;
}

export class Builder {
  private config: NormalizedConfig;
  private eventEmitter: EventEmitter;
  private commandManager: CommandManager;
  private componentRegistry: ComponentRegistry;
  private templateManager: TemplateManager;
  private presetManager: PresetManager;
  private compatibilityService: CompatibilityService;
  private storageAdapter: StorageAdapter;
  private initialized: boolean = false;
  private state: Record<string, unknown> = {};

  constructor(config: BuilderConfig) {
    this.config = this.normalizeConfig(config);
    this.eventEmitter = new EventEmitter();
    this.commandManager = new CommandManager(this.eventEmitter);

    // Initialize component registry with default components
    this.componentRegistry = createDefaultRegistry();

    // Initialize storage adapter
    this.storageAdapter = this.createStorageAdapter();

    // Initialize template manager
    const templateStorage = new TemplateStorage(
      this.storageAdapter,
      this.config.storage.keyPrefix
    );
    this.templateManager = new TemplateManager(templateStorage, this.componentRegistry);

    // Initialize preset manager
    const presetStorage = new PresetStorage(
      this.storageAdapter,
      this.config.storage.keyPrefix
    );
    this.presetManager = new PresetManager(presetStorage, this.componentRegistry);

    // Initialize compatibility service
    this.compatibilityService = new CompatibilityService();
  }

  /**
   * Initializes the builder
   */
  public async initialize(): Promise<void> {
    try {
      if (this.initialized) {
        throw new Error('Builder already initialized');
      }

      if (this.config.initialTemplate) {
        this.state['template'] = this.config.initialTemplate;
      }

      // Load presets from storage into registry
      await this.presetManager.loadAllFromStorage();

      this.initialized = true;
      this.eventEmitter.emit(BuilderEvent.INITIALIZED, {
        config: this.config,
        state: this.state,
      });

      if (this.config.debug) {
        console.log('[Builder] Initialized with config:', this.config);
      }
    } catch (error) {
      this.handleError(error as Error);
      throw error;
    }
  }

  /**
   * Executes a command
   */
  public async executeCommand<TPayload = unknown, TResult = unknown>(
    command: Command<TPayload>
  ): Promise<CommandResult<TResult>> {
    this.ensureInitialized();

    if (this.config.debug) {
      console.log('[Builder] Executing command:', command.type, command.payload);
    }

    return this.commandManager.execute<TPayload, TResult>(command);
  }

  /**
   * Undoes the last command
   */
  public async undo(): Promise<boolean> {
    this.ensureInitialized();
    return this.commandManager.undo();
  }

  /**
   * Redoes the next command
   */
  public async redo(): Promise<boolean> {
    this.ensureInitialized();
    return this.commandManager.redo();
  }

  /**
   * Checks if undo is available
   */
  public canUndo(): boolean {
    return this.commandManager.canUndo();
  }

  /**
   * Checks if redo is available
   */
  public canRedo(): boolean {
    return this.commandManager.canRedo();
  }

  /**
   * Subscribes to an event
   */
  public on<TData = unknown>(event: string, listener: (data: TData) => void): EventSubscription {
    return this.eventEmitter.on(event, listener);
  }

  /**
   * Subscribes to an event once
   */
  public once<TData = unknown>(event: string, listener: (data: TData) => void): EventSubscription {
    return this.eventEmitter.once(event, listener);
  }

  /**
   * Gets the current builder state
   */
  public getState(): Readonly<Record<string, unknown>> {
    return { ...this.state };
  }

  /**
   * Gets the builder configuration
   */
  public getConfig(): Readonly<NormalizedConfig> {
    return { ...this.config };
  }

  /**
   * Checks if builder is initialized
   */
  public isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Gets the component registry
   */
  public getComponentRegistry(): ComponentRegistry {
    return this.componentRegistry;
  }

  /**
   * Gets the template manager
   */
  public getTemplateManager(): TemplateManager {
    return this.templateManager;
  }

  /**
   * Gets the preset manager
   */
  public getPresetManager(): PresetManager {
    return this.presetManager;
  }

  /**
   * Gets the compatibility service
   *
   * Provides access to email client compatibility data and utilities
   * for checking CSS property support across different email clients.
   *
   * @example
   * ```ts
   * const compatService = builder.getCompatibilityService();
   * const stats = compatService.getPropertyStatistics('border-radius');
   * console.log(`Support score: ${stats.supportScore}%`);
   * ```
   */
  public getCompatibilityService(): CompatibilityService {
    return this.compatibilityService;
  }

  /**
   * Creates a new template
   */
  public async createTemplate(options: CreateTemplateOptions): Promise<Template> {
    this.ensureInitialized();
    return this.templateManager.create(options);
  }

  /**
   * Loads a template
   */
  public async loadTemplate(templateId: string): Promise<Template> {
    this.ensureInitialized();
    return this.templateManager.load(templateId);
  }

  /**
   * Saves the current template
   */
  public async saveTemplate(template: Template): Promise<void> {
    this.ensureInitialized();
    await this.templateManager.update(template.metadata.id, {
      metadata: {
        name: template.metadata.name,
        ...(template.metadata.description !== undefined && { description: template.metadata.description }),
        ...(template.metadata.author !== undefined && { author: template.metadata.author }),
        ...(template.metadata.category !== undefined && { category: template.metadata.category }),
        ...(template.metadata.tags !== undefined && { tags: template.metadata.tags }),
        ...(template.metadata.thumbnail !== undefined && { thumbnail: template.metadata.thumbnail }),
        version: template.metadata.version,
        updatedAt: Date.now(),
      },
      settings: template.settings,
      generalStyles: template.generalStyles,
      components: template.components,
    });

    if (this.config.callbacks?.onSaveTemplate) {
      this.config.callbacks.onSaveTemplate(template);
    }
  }

  /**
   * Deletes a template
   */
  public async deleteTemplate(templateId: string): Promise<void> {
    this.ensureInitialized();
    return this.templateManager.delete(templateId);
  }

  /**
   * Lists all templates
   */
  public async listTemplates(): Promise<TemplateListItem[]> {
    this.ensureInitialized();
    return this.templateManager.list();
  }

  /**
   * Gets the current template
   */
  public getCurrentTemplate(): Template | null {
    return this.templateManager.getCurrentTemplate();
  }

  /**
   * Destroys the builder and cleans up resources
   */
  public destroy(): void {
    this.eventEmitter.off();
    this.commandManager.clearHistory();
    this.initialized = false;
    this.state = {};

    if (this.config.debug) {
      console.log('[Builder] Destroyed');
    }
  }

  /**
   * Updates builder state
   */
  protected setState(updates: Record<string, unknown>): void {
    this.state = { ...this.state, ...updates };
    this.eventEmitter.emit(BuilderEvent.STATE_CHANGED, this.state);

    if (this.config.callbacks?.onStateChange) {
      this.config.callbacks.onStateChange(this.state);
    }
  }

  /**
   * Handles errors
   */
  private handleError(error: Error): void {
    this.eventEmitter.emit(BuilderEvent.ERROR, error);

    if (this.config.callbacks?.onError) {
      this.config.callbacks.onError(error);
    }

    if (this.config.debug) {
      console.error('[Builder] Error:', error);
    }
  }

  /**
   * Ensures builder is initialized
   */
  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error('Builder not initialized. Call initialize() first.');
    }
  }

  /**
   * Creates storage adapter based on configuration
   */
  private createStorageAdapter(): StorageAdapter {
    const { method, adapter } = this.config.storage;

    if (method === 'custom') {
      if (!adapter) {
        throw new Error('Custom storage adapter not provided');
      }
      return adapter;
    }

    if (method === 'local') {
      return new LocalStorageAdapter();
    }

    if (method === 'api') {
      // API adapter would be implemented here
      // For now, fall back to localStorage
      console.warn('API storage not implemented, falling back to localStorage');
      return new LocalStorageAdapter();
    }

    throw new Error(`Unsupported storage method: ${method}`);
  }

  /**
   * Normalizes configuration with defaults
   */
  private normalizeConfig(config: BuilderConfig): NormalizedConfig {
    const normalizedStorage: Required<Pick<StorageConfig, 'method' | 'keyPrefix'>> &
      Omit<StorageConfig, 'method' | 'keyPrefix'> = {
      method: config.storage.method,
      keyPrefix: config.storage.keyPrefix ?? 'email-builder',
    };

    if (config.storage.adapter !== undefined) {
      normalizedStorage.adapter = config.storage.adapter;
    }

    if (config.storage.apiEndpoint !== undefined) {
      normalizedStorage.apiEndpoint = config.storage.apiEndpoint;
    }

    const normalized: NormalizedConfig = {
      target: config.target,
      locale: config.locale ?? 'en-US',
      storage: normalizedStorage,
      features: {
        customComponents: config.features?.customComponents ?? true,
        dataInjection: config.features?.dataInjection ?? true,
        templateVersioning: config.features?.templateVersioning ?? false,
        undoRedo: config.features?.undoRedo ?? true,
        autoSave: config.features?.autoSave ?? false,
      },
      callbacks: config.callbacks ?? {},
      debug: config.debug ?? false,
    };

    if (config.initialTemplate !== undefined) {
      normalized.initialTemplate = config.initialTemplate;
    }

    return normalized;
  }
}
