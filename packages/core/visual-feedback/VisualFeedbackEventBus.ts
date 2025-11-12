/**
 * Visual Feedback Event Bus
 *
 * Global event emitter for visual feedback events, decoupled from component props.
 * This prevents infinite recursion by avoiding reactive prop changes.
 */

export type VisualFeedbackEventType =
  | 'property:hover'
  | 'property:unhover'
  | 'property:edit:start'
  | 'property:edit:end';

export interface VisualFeedbackEvent {
  type: VisualFeedbackEventType;
  propertyPath: string;
  componentId?: string;
  currentValue?: any;
  propertyType?: string;
  isEditing?: boolean;
}

type EventHandler = (event: VisualFeedbackEvent) => void;

/**
 * Global singleton event bus for visual feedback
 */
class VisualFeedbackEventBus {
  private handlers: Map<VisualFeedbackEventType, Set<EventHandler>> = new Map();
  private lastEmittedEvent: { type: VisualFeedbackEventType; propertyPath: string; componentId?: string; timestamp: number } | null = null;
  private readonly DEBOUNCE_MS = 50; // Prevent duplicate events within 50ms
  /**
   * Subscribe to an event type
   */
  on(eventType: VisualFeedbackEventType, handler: EventHandler): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }

    this.handlers.get(eventType)!.add(handler);

    // Return unsubscribe function
    return () => {
      this.handlers.get(eventType)?.delete(handler);
    };
  }

  /**
   * Emit an event to all registered handlers
   * Handlers are called asynchronously to avoid interfering with Solid.js reactivity
   * Debouncing prevents duplicate events from creating infinite loops
   */
  emit(event: VisualFeedbackEvent): void {
    const handlers = this.handlers.get(event.type);
    if (!handlers || handlers.size === 0) {
      return;
    }

    // Debounce duplicate events to prevent infinite loops
    const now = Date.now();

    // Debug logging to understand what's happening
    const eventKey = `${event.type}:${event.propertyPath}:${event.componentId}`;
    console.log(`[VisualFeedbackEventBus] emit() called - ${eventKey}`);

    if (
      this.lastEmittedEvent &&
      this.lastEmittedEvent.type === event.type &&
      this.lastEmittedEvent.propertyPath === event.propertyPath &&
      this.lastEmittedEvent.componentId === event.componentId &&
      now - this.lastEmittedEvent.timestamp < this.DEBOUNCE_MS
    ) {
      // Skip duplicate event within debounce window
      console.log(`[VisualFeedbackEventBus] DEBOUNCED (skipped) - ${eventKey}, time since last: ${now - this.lastEmittedEvent.timestamp}ms`);
      return;
    }

    console.log(`[VisualFeedbackEventBus] EMITTING - ${eventKey}`);

    // Update last emitted event
    this.lastEmittedEvent = {
      type: event.type,
      propertyPath: event.propertyPath,
      componentId: event.componentId,
      timestamp: now,
    };

    // Use setTimeout to schedule in a new task, completely breaking out of Solid.js reactive batching
    // This prevents infinite recursion when handlers update signals that trigger re-renders
    setTimeout(() => {
      console.log(`[VisualFeedbackEventBus] Handler executing - ${eventKey}`);
      handlers.forEach(handler => {
        try {
          handler(event);
        } catch (error) {
          console.error(`[VisualFeedbackEventBus] Error in handler for ${event.type}:`, error);
        }
      });
      console.log(`[VisualFeedbackEventBus] Handler completed - ${eventKey}`);
    }, 0);
  }

  /**
   * Remove all handlers for an event type
   */
  off(eventType: VisualFeedbackEventType): void {
    this.handlers.delete(eventType);
  }

  /**
   * Clear all handlers
   */
  clear(): void {
    this.handlers.clear();
    this.lastEmittedEvent = null;
  }
}

// Export singleton instance
export const visualFeedbackEventBus = new VisualFeedbackEventBus();
