/**
 * Event system types
 */

/**
 * Builder event types
 */
export enum BuilderEvent {
  INITIALIZED = 'builder:initialized',
  STATE_CHANGED = 'builder:state-changed',
  COMPONENT_ADDED = 'builder:component-added',
  COMPONENT_REMOVED = 'builder:component-removed',
  COMPONENT_UPDATED = 'builder:component-updated',
  COMPONENTS_REORDERED = 'builder:components-reordered',
  TEMPLATE_SAVED = 'builder:template-saved',
  TEMPLATE_LOADED = 'builder:template-loaded',
  TEMPLATE_EXPORTED = 'builder:template-exported',
  PRESET_SAVED = 'builder:preset-saved',
  PRESET_DELETED = 'builder:preset-deleted',
  DATA_INJECTED = 'builder:data-injected',
  UNDO = 'builder:undo',
  REDO = 'builder:redo',
  ERROR = 'builder:error',
}

/**
 * Event listener function
 */
export type EventListener<TData = unknown> = (data: TData) => void;

/**
 * Event subscription
 */
export interface EventSubscription {
  /**
   * Unsubscribes from the event
   */
  unsubscribe(): void;
}

/**
 * Event emitter interface
 */
export interface EventEmitter {
  /**
   * Subscribes to an event
   *
   * @param event - Event name
   * @param listener - Event listener function
   * @returns Subscription object
   */
  on<TData = unknown>(event: string, listener: EventListener<TData>): EventSubscription;

  /**
   * Subscribes to an event once (auto-unsubscribes after first call)
   *
   * @param event - Event name
   * @param listener - Event listener function
   * @returns Subscription object
   */
  once<TData = unknown>(event: string, listener: EventListener<TData>): EventSubscription;

  /**
   * Emits an event
   *
   * @param event - Event name
   * @param data - Event data
   */
  emit<TData = unknown>(event: string, data?: TData): void;

  /**
   * Removes all listeners for an event
   *
   * @param event - Event name (optional, removes all if not provided)
   */
  off(event?: string): void;

  /**
   * Gets the number of listeners for an event
   *
   * @param event - Event name
   * @returns Number of listeners
   */
  listenerCount(event: string): number;
}
