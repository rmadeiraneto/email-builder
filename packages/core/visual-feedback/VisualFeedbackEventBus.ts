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
   * Emit an event
   */
  emit(event: VisualFeedbackEvent): void {
    const handlers = this.handlers.get(event.type);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(event);
        } catch (error) {
          console.error(`[VisualFeedbackEventBus] Error in handler for ${event.type}:`, error);
        }
      });
    }
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
  }
}

// Export singleton instance
export const visualFeedbackEventBus = new VisualFeedbackEventBus();
