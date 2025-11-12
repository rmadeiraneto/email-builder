/**
 * EventEmitter tests
 */

import { describe, it, expect, vi } from 'vitest';
import { EventEmitter } from './EventEmitter';

describe('EventEmitter', () => {
  describe('on()', () => {
    it('should register event listener', async () => {
      const emitter = new EventEmitter();
      const listener = vi.fn();

      emitter.on('test', listener);
      emitter.emit('test', { data: 'value' });

      // Wait for microtask to complete
      await new Promise(resolve => queueMicrotask(resolve));

      expect(listener).toHaveBeenCalledWith({ data: 'value' });
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should register multiple listeners for same event', async () => {
      const emitter = new EventEmitter();
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      emitter.on('test', listener1);
      emitter.on('test', listener2);
      emitter.emit('test', { data: 'value' });

      // Wait for microtask to complete
      await new Promise(resolve => queueMicrotask(resolve));

      expect(listener1).toHaveBeenCalledWith({ data: 'value' });
      expect(listener2).toHaveBeenCalledWith({ data: 'value' });
    });

    it('should return subscription with unsubscribe method', () => {
      const emitter = new EventEmitter();
      const listener = vi.fn();

      const subscription = emitter.on('test', listener);
      expect(subscription).toHaveProperty('unsubscribe');
      expect(typeof subscription.unsubscribe).toBe('function');
    });

    it('should allow unsubscribing', async () => {
      const emitter = new EventEmitter();
      const listener = vi.fn();

      const subscription = emitter.on('test', listener);
      emitter.emit('test', { data: 'first' });

      // Wait for microtask to complete
      await new Promise(resolve => queueMicrotask(resolve));

      subscription.unsubscribe();
      emitter.emit('test', { data: 'second' });

      // Wait for microtask to complete
      await new Promise(resolve => queueMicrotask(resolve));

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith({ data: 'first' });
    });
  });

  describe('once()', () => {
    it('should register event listener that fires once', async () => {
      const emitter = new EventEmitter();
      const listener = vi.fn();

      emitter.once('test', listener);
      emitter.emit('test', { data: 'first' });

      // Wait for microtask to complete
      await new Promise(resolve => queueMicrotask(resolve));

      emitter.emit('test', { data: 'second' });

      // Wait for microtask to complete
      await new Promise(resolve => queueMicrotask(resolve));

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith({ data: 'first' });
    });

    it('should allow manual unsubscribe before event fires', () => {
      const emitter = new EventEmitter();
      const listener = vi.fn();

      const subscription = emitter.once('test', listener);
      subscription.unsubscribe();
      emitter.emit('test', { data: 'value' });

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('emit()', () => {
    it('should emit event with data', async () => {
      const emitter = new EventEmitter();
      const listener = vi.fn();

      emitter.on('test', listener);
      emitter.emit('test', { data: 'value' });

      // Wait for microtask to complete
      await new Promise(resolve => queueMicrotask(resolve));

      expect(listener).toHaveBeenCalledWith({ data: 'value' });
    });

    it('should emit event without data', async () => {
      const emitter = new EventEmitter();
      const listener = vi.fn();

      emitter.on('test', listener);
      emitter.emit('test');

      // Wait for microtask to complete
      await new Promise(resolve => queueMicrotask(resolve));

      expect(listener).toHaveBeenCalledWith(undefined);
    });

    it('should not throw if no listeners registered', () => {
      const emitter = new EventEmitter();
      expect(() => emitter.emit('test', { data: 'value' })).not.toThrow();
    });

    it('should catch errors in listeners and continue', async () => {
      const emitter = new EventEmitter();
      const errorListener = vi.fn(() => {
        throw new Error('Listener error');
      });
      const successListener = vi.fn();
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      emitter.on('test', errorListener);
      emitter.on('test', successListener);
      emitter.emit('test', { data: 'value' });

      // Wait for microtask to complete
      await new Promise(resolve => queueMicrotask(resolve));

      expect(errorListener).toHaveBeenCalled();
      expect(successListener).toHaveBeenCalled();
      expect(consoleError).toHaveBeenCalled();

      consoleError.mockRestore();
    });
  });

  describe('off()', () => {
    it('should remove all listeners for specific event', () => {
      const emitter = new EventEmitter();
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      emitter.on('test', listener1);
      emitter.on('test', listener2);
      emitter.off('test');
      emitter.emit('test', { data: 'value' });

      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).not.toHaveBeenCalled();
    });

    it('should remove all listeners for all events', () => {
      const emitter = new EventEmitter();
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      emitter.on('event1', listener1);
      emitter.on('event2', listener2);
      emitter.off();

      emitter.emit('event1', { data: 'value1' });
      emitter.emit('event2', { data: 'value2' });

      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).not.toHaveBeenCalled();
    });
  });

  describe('listenerCount()', () => {
    it('should return number of listeners for event', () => {
      const emitter = new EventEmitter();

      expect(emitter.listenerCount('test')).toBe(0);

      emitter.on('test', vi.fn());
      expect(emitter.listenerCount('test')).toBe(1);

      emitter.on('test', vi.fn());
      expect(emitter.listenerCount('test')).toBe(2);
    });

    it('should return 0 for unregistered event', () => {
      const emitter = new EventEmitter();
      expect(emitter.listenerCount('nonexistent')).toBe(0);
    });

    it('should update count after unsubscribe', () => {
      const emitter = new EventEmitter();
      const subscription = emitter.on('test', vi.fn());

      expect(emitter.listenerCount('test')).toBe(1);

      subscription.unsubscribe();
      expect(emitter.listenerCount('test')).toBe(0);
    });
  });
});
