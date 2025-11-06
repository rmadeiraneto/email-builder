/**
 * Event emitter implementation
 *
 * Provides pub/sub pattern for builder events
 */

import type { EventEmitter as IEventEmitter, EventListener, EventSubscription } from '../types';

export class EventEmitter implements IEventEmitter {
  private listeners: Map<string, Set<EventListener>>;

  constructor() {
    this.listeners = new Map();
  }

  public on<TData = unknown>(event: string, listener: EventListener<TData>): EventSubscription {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    const listeners = this.listeners.get(event)!;
    listeners.add(listener as EventListener);

    return {
      unsubscribe: () => {
        listeners.delete(listener as EventListener);
        if (listeners.size === 0) {
          this.listeners.delete(event);
        }
      },
    };
  }

  public once<TData = unknown>(event: string, listener: EventListener<TData>): EventSubscription {
    const wrappedListener: EventListener<TData> = (data) => {
      listener(data);
      subscription.unsubscribe();
    };

    const subscription = this.on(event, wrappedListener);
    return subscription;
  }

  public emit<TData = unknown>(event: string, data?: TData): void {
    const listeners = this.listeners.get(event);
    if (!listeners || listeners.size === 0) {
      return;
    }

    listeners.forEach((listener) => {
      try {
        listener(data);
      } catch (error) {
        console.error(`Error in event listener for "${event}":`, error);
      }
    });
  }

  public off(event?: string, listener?: EventListener): void {
    if (!event) {
      this.listeners.clear();
      return;
    }

    if (!listener) {
      this.listeners.delete(event);
      return;
    }

    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.delete(listener);
      if (listeners.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  public listenerCount(event: string): number {
    const listeners = this.listeners.get(event);
    return listeners ? listeners.size : 0;
  }
}
