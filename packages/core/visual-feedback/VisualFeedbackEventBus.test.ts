/**
 * VisualFeedbackEventBus tests
 *
 * Tests for the asynchronous event bus used in the visual feedback system.
 * This test suite verifies the critical asynchronous behavior that prevents
 * infinite recursion in Solid.js reactive contexts.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { visualFeedbackEventBus } from './VisualFeedbackEventBus';
import type { VisualFeedbackEvent } from './VisualFeedbackEventBus';

// Helper to wait for async event emissions (setTimeout-based)
const waitForEmit = () => new Promise(resolve => setTimeout(resolve, 10));

describe('VisualFeedbackEventBus', () => {
  // Clean up after each test
  afterEach(() => {
    visualFeedbackEventBus.clear();
  });

  describe('on()', () => {
    it('should register event listener', async () => {
      const handler = vi.fn();

      visualFeedbackEventBus.on('property:hover', handler);
      visualFeedbackEventBus.emit({
        type: 'property:hover',
        propertyPath: 'styles.padding',
        componentId: 'comp-1',
      });

      // Wait for setTimeout to complete
      await waitForEmit();

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith({
        type: 'property:hover',
        propertyPath: 'styles.padding',
        componentId: 'comp-1',
      });
    });

    it('should register multiple listeners for same event type', async () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      visualFeedbackEventBus.on('property:hover', handler1);
      visualFeedbackEventBus.on('property:hover', handler2);

      visualFeedbackEventBus.emit({
        type: 'property:hover',
        propertyPath: 'styles.padding',
        componentId: 'comp-1',
      });

      await waitForEmit();

      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(1);
    });

    it('should register listeners for different event types independently', async () => {
      const hoverHandler = vi.fn();
      const editStartHandler = vi.fn();

      visualFeedbackEventBus.on('property:hover', hoverHandler);
      visualFeedbackEventBus.on('property:edit:start', editStartHandler);

      visualFeedbackEventBus.emit({
        type: 'property:hover',
        propertyPath: 'styles.padding',
        componentId: 'comp-1',
      });

      await waitForEmit();

      expect(hoverHandler).toHaveBeenCalledTimes(1);
      expect(editStartHandler).not.toHaveBeenCalled();
    });

    it('should return unsubscribe function', () => {
      const handler = vi.fn();
      const unsubscribe = visualFeedbackEventBus.on('property:hover', handler);

      expect(typeof unsubscribe).toBe('function');
    });

    it('should allow unsubscribing', async () => {
      const handler = vi.fn();

      const unsubscribe = visualFeedbackEventBus.on('property:hover', handler);

      visualFeedbackEventBus.emit({
        type: 'property:hover',
        propertyPath: 'styles.padding',
        componentId: 'comp-1',
      });

      await waitForEmit();

      expect(handler).toHaveBeenCalledTimes(1);

      // Unsubscribe and emit again
      unsubscribe();

      visualFeedbackEventBus.emit({
        type: 'property:hover',
        propertyPath: 'styles.margin',
        componentId: 'comp-2',
      });

      await waitForEmit();

      // Should still be called only once (from before unsubscribe)
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  describe('emit()', () => {
    it('should emit event to all registered handlers', async () => {
      const handler = vi.fn();

      visualFeedbackEventBus.on('property:edit:start', handler);

      const event: VisualFeedbackEvent = {
        type: 'property:edit:start',
        propertyPath: 'styles.padding',
        componentId: 'comp-1',
        currentValue: '10px',
        isEditing: true,
      };

      visualFeedbackEventBus.emit(event);

      await waitForEmit();

      expect(handler).toHaveBeenCalledWith(event);
    });

    it('should execute handlers asynchronously', async () => {
      const handler = vi.fn();
      let emitCompleted = false;

      visualFeedbackEventBus.on('property:hover', handler);

      visualFeedbackEventBus.emit({
        type: 'property:hover',
        propertyPath: 'styles.padding',
        componentId: 'comp-1',
      });

      // Handler should NOT have been called yet (asynchronous)
      expect(handler).not.toHaveBeenCalled();
      emitCompleted = true;

      // Wait for microtask
      await waitForEmit();

      // Now handler should have been called
      expect(handler).toHaveBeenCalledTimes(1);
      expect(emitCompleted).toBe(true);
    });

    it('should not throw if no handlers registered', () => {
      expect(() => {
        visualFeedbackEventBus.emit({
          type: 'property:hover',
          propertyPath: 'styles.padding',
          componentId: 'comp-1',
        });
      }).not.toThrow();
    });

    it('should catch errors in handlers and continue', async () => {
      const errorHandler = vi.fn(() => {
        throw new Error('Handler error');
      });
      const successHandler = vi.fn();
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      visualFeedbackEventBus.on('property:hover', errorHandler);
      visualFeedbackEventBus.on('property:hover', successHandler);

      visualFeedbackEventBus.emit({
        type: 'property:hover',
        propertyPath: 'styles.padding',
        componentId: 'comp-1',
      });

      await waitForEmit();

      // Both handlers should have been called
      expect(errorHandler).toHaveBeenCalled();
      expect(successHandler).toHaveBeenCalled();

      // Error should have been logged
      expect(consoleError).toHaveBeenCalled();
      expect(consoleError).toHaveBeenCalledWith(
        expect.stringContaining('[VisualFeedbackEventBus]'),
        expect.any(Error)
      );

      consoleError.mockRestore();
    });

    it('should emit all event types correctly', async () => {
      const hoverHandler = vi.fn();
      const unhoverHandler = vi.fn();
      const editStartHandler = vi.fn();
      const editEndHandler = vi.fn();

      visualFeedbackEventBus.on('property:hover', hoverHandler);
      visualFeedbackEventBus.on('property:unhover', unhoverHandler);
      visualFeedbackEventBus.on('property:edit:start', editStartHandler);
      visualFeedbackEventBus.on('property:edit:end', editEndHandler);

      // Emit all event types
      visualFeedbackEventBus.emit({ type: 'property:hover', propertyPath: 'test' });
      visualFeedbackEventBus.emit({ type: 'property:unhover', propertyPath: 'test' });
      visualFeedbackEventBus.emit({ type: 'property:edit:start', propertyPath: 'test' });
      visualFeedbackEventBus.emit({ type: 'property:edit:end', propertyPath: 'test' });

      await waitForEmit();

      expect(hoverHandler).toHaveBeenCalledTimes(1);
      expect(unhoverHandler).toHaveBeenCalledTimes(1);
      expect(editStartHandler).toHaveBeenCalledTimes(1);
      expect(editEndHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('off()', () => {
    it('should remove all handlers for specific event type', async () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      visualFeedbackEventBus.on('property:hover', handler1);
      visualFeedbackEventBus.on('property:hover', handler2);

      // Remove all handlers for this event type
      visualFeedbackEventBus.off('property:hover');

      visualFeedbackEventBus.emit({
        type: 'property:hover',
        propertyPath: 'styles.padding',
        componentId: 'comp-1',
      });

      await waitForEmit();

      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).not.toHaveBeenCalled();
    });

    it('should not affect handlers for other event types', async () => {
      const hoverHandler = vi.fn();
      const editHandler = vi.fn();

      visualFeedbackEventBus.on('property:hover', hoverHandler);
      visualFeedbackEventBus.on('property:edit:start', editHandler);

      // Remove only hover handlers
      visualFeedbackEventBus.off('property:hover');

      visualFeedbackEventBus.emit({
        type: 'property:hover',
        propertyPath: 'styles.padding',
        componentId: 'comp-1',
      });

      visualFeedbackEventBus.emit({
        type: 'property:edit:start',
        propertyPath: 'styles.padding',
        componentId: 'comp-1',
      });

      await waitForEmit();

      expect(hoverHandler).not.toHaveBeenCalled();
      expect(editHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('clear()', () => {
    it('should remove all handlers for all event types', async () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      const handler3 = vi.fn();

      visualFeedbackEventBus.on('property:hover', handler1);
      visualFeedbackEventBus.on('property:unhover', handler2);
      visualFeedbackEventBus.on('property:edit:start', handler3);

      // Clear all handlers
      visualFeedbackEventBus.clear();

      visualFeedbackEventBus.emit({ type: 'property:hover', propertyPath: 'test' });
      visualFeedbackEventBus.emit({ type: 'property:unhover', propertyPath: 'test' });
      visualFeedbackEventBus.emit({ type: 'property:edit:start', propertyPath: 'test' });

      await waitForEmit();

      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).not.toHaveBeenCalled();
      expect(handler3).not.toHaveBeenCalled();
    });
  });

  describe('Async behavior (critical for Solid.js)', () => {
    it('should break synchronous call chain', async () => {
      const executionOrder: string[] = [];

      visualFeedbackEventBus.on('property:hover', () => {
        executionOrder.push('handler');
      });

      executionOrder.push('before-emit');
      visualFeedbackEventBus.emit({
        type: 'property:hover',
        propertyPath: 'test',
      });
      executionOrder.push('after-emit');

      // Handler should NOT have executed yet
      expect(executionOrder).toEqual(['before-emit', 'after-emit']);

      await waitForEmit();

      // Now handler should have executed
      expect(executionOrder).toEqual(['before-emit', 'after-emit', 'handler']);
    });

    it('should allow reactive updates to complete before handlers run', async () => {
      let signalValue = 'initial';
      const signalUpdates: string[] = [];

      visualFeedbackEventBus.on('property:hover', () => {
        // This simulates reading a signal after it's been updated
        signalUpdates.push(signalValue);
      });

      // Simulate: emit from event handler + signal update
      signalValue = 'updated';
      visualFeedbackEventBus.emit({
        type: 'property:hover',
        propertyPath: 'test',
      });
      signalValue = 'final';

      // Handler hasn't run yet, so signalUpdates is still empty
      expect(signalUpdates).toEqual([]);

      await waitForEmit();

      // Handler runs with final signal value
      expect(signalUpdates).toEqual(['final']);
    });

    it('should prevent re-entrant calls from causing recursion', async () => {
      let callCount = 0;

      visualFeedbackEventBus.on('property:hover', () => {
        callCount++;

        // Simulate what caused the original bug: handler emits another event
        // With debouncing, duplicate events within 50ms will be ignored
        visualFeedbackEventBus.emit({
          type: 'property:hover',
          propertyPath: 'test',
        });
      });

      visualFeedbackEventBus.emit({
        type: 'property:hover',
        propertyPath: 'test',
      });

      // Wait for setTimeout to complete
      await waitForEmit();

      // Should have been called only once due to debouncing (preventing infinite recursion)
      expect(callCount).toBe(1);
    });

    it('should handle rapid successive emits correctly', async () => {
      const callOrder: string[] = [];

      visualFeedbackEventBus.on('property:hover', (event) => {
        callOrder.push(event.componentId as string);
      });

      // Emit multiple events in rapid succession
      for (let i = 0; i < 5; i++) {
        visualFeedbackEventBus.emit({
          type: 'property:hover',
          propertyPath: 'test',
          componentId: String(i),
        });
      }

      // No handlers should have executed yet
      expect(callOrder).toEqual([]);

      await waitForEmit();

      // All handlers should have executed in order
      expect(callOrder).toEqual(['0', '1', '2', '3', '4']);
    });
  });

  describe('Event data integrity', () => {
    it('should preserve all event properties', async () => {
      const handler = vi.fn();

      visualFeedbackEventBus.on('property:edit:start', handler);

      const event: VisualFeedbackEvent = {
        type: 'property:edit:start',
        propertyPath: 'styles.padding.top',
        componentId: 'button-123',
        currentValue: '20px',
        propertyType: 'number',
        isEditing: true,
      };

      visualFeedbackEventBus.emit(event);

      await waitForEmit();

      expect(handler).toHaveBeenCalledWith(event);
      expect(handler.mock.calls[0][0]).toEqual(event);
    });

    it('should handle events with minimal properties', async () => {
      const handler = vi.fn();

      visualFeedbackEventBus.on('property:unhover', handler);

      const event: VisualFeedbackEvent = {
        type: 'property:unhover',
        propertyPath: 'styles.padding',
      };

      visualFeedbackEventBus.emit(event);

      await waitForEmit();

      expect(handler).toHaveBeenCalledWith(event);
    });

    it('should handle complex property paths', async () => {
      const handler = vi.fn();

      visualFeedbackEventBus.on('property:hover', handler);

      visualFeedbackEventBus.emit({
        type: 'property:hover',
        propertyPath: 'styles.nested.deeply.property.value',
        componentId: 'comp-1',
      });

      await waitForEmit();

      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          propertyPath: 'styles.nested.deeply.property.value',
        })
      );
    });
  });

  describe('Memory management', () => {
    it('should not leak memory when subscribing and unsubscribing', async () => {
      const handlers: Array<() => void> = [];
      const unsubscribers: Array<() => void> = [];

      // Subscribe many handlers
      for (let i = 0; i < 100; i++) {
        const handler = vi.fn();
        handlers.push(handler);
        unsubscribers.push(visualFeedbackEventBus.on('property:hover', handler));
      }

      // Emit event
      visualFeedbackEventBus.emit({
        type: 'property:hover',
        propertyPath: 'test',
      });

      await waitForEmit();

      // All handlers should have been called
      handlers.forEach(handler => {
        expect(handler).toHaveBeenCalledTimes(1);
      });

      // Unsubscribe all
      unsubscribers.forEach(unsubscribe => unsubscribe());

      // Clear call counts
      handlers.forEach(handler => handler.mockClear());

      // Emit again
      visualFeedbackEventBus.emit({
        type: 'property:hover',
        propertyPath: 'test',
      });

      await waitForEmit();

      // No handlers should have been called
      handlers.forEach(handler => {
        expect(handler).not.toHaveBeenCalled();
      });
    });
  });
});
