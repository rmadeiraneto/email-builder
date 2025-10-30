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
} from '../types';
import { EventEmitter } from '../services/EventEmitter';
import { CommandManager } from '../commands/CommandManager';
import { BuilderEvent } from '../types';

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
  private initialized: boolean = false;
  private state: Record<string, unknown> = {};

  constructor(config: BuilderConfig) {
    this.config = this.normalizeConfig(config);
    this.eventEmitter = new EventEmitter();
    this.commandManager = new CommandManager(this.eventEmitter);
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
