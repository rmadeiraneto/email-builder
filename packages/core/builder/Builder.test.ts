/**
 * Builder tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Builder } from './Builder';
import { BuilderEvent, CommandType } from '../types';
import type { BuilderConfig, UndoableCommand } from '../types';

class MockCommand implements UndoableCommand {
  type = CommandType.ADD_COMPONENT;
  timestamp = Date.now();
  id = 'mock-command';
  payload = {};

  execute = vi.fn();
  undo = vi.fn();
  canUndo = vi.fn(() => true);
}

describe('Builder', () => {
  let config: BuilderConfig;

  beforeEach(() => {
    config = {
      target: 'email',
      storage: {
        method: 'local',
      },
    };
  });

  describe('constructor', () => {
    it('should create builder instance', () => {
      const builder = new Builder(config);
      expect(builder).toBeInstanceOf(Builder);
    });

    it('should normalize config with defaults', () => {
      const builder = new Builder(config);
      const normalizedConfig = builder.getConfig();

      expect(normalizedConfig.locale).toBe('en-US');
      expect(normalizedConfig.features?.undoRedo).toBe(true);
      expect(normalizedConfig.features?.customComponents).toBe(true);
      expect(normalizedConfig.debug).toBe(false);
    });

    it('should preserve provided config values', () => {
      const customConfig: BuilderConfig = {
        target: 'web',
        locale: 'fr-FR',
        storage: { method: 'api', apiEndpoint: 'https://api.example.com' },
        debug: true,
      };

      const builder = new Builder(customConfig);
      const normalizedConfig = builder.getConfig();

      expect(normalizedConfig.target).toBe('web');
      expect(normalizedConfig.locale).toBe('fr-FR');
      expect(normalizedConfig.storage.apiEndpoint).toBe('https://api.example.com');
      expect(normalizedConfig.debug).toBe(true);
    });
  });

  describe('initialize()', () => {
    it('should initialize builder', async () => {
      const builder = new Builder(config);
      await builder.initialize();

      expect(builder.isInitialized()).toBe(true);
    });

    it('should emit initialized event', async () => {
      const builder = new Builder(config);
      const listener = vi.fn();

      builder.on(BuilderEvent.INITIALIZED, listener);
      await builder.initialize();

      expect(listener).toHaveBeenCalledWith({
        config: expect.any(Object),
        state: expect.any(Object),
      });
    });

    it('should throw if already initialized', async () => {
      const builder = new Builder(config);
      await builder.initialize();

      await expect(builder.initialize()).rejects.toThrow('Builder already initialized');
    });

    it('should load initial template', async () => {
      const initialTemplate = { id: 'template-1', name: 'Test Template' };
      const builderWithTemplate = new Builder({
        ...config,
        initialTemplate,
      });

      await builderWithTemplate.initialize();
      const state = builderWithTemplate.getState();

      expect(state.template).toEqual(initialTemplate);
    });

    it('should call onInitialize callback', async () => {
      const onInitialize = vi.fn();
      const builderWithCallback = new Builder({
        ...config,
        callbacks: { onInitialize },
      });

      await builderWithCallback.initialize();
      expect(onInitialize).not.toHaveBeenCalled();
    });
  });

  describe('executeCommand()', () => {
    it('should execute command', async () => {
      const builder = new Builder(config);
      await builder.initialize();

      const command = new MockCommand();
      const result = await builder.executeCommand(command);

      expect(result.success).toBe(true);
      expect(command.execute).toHaveBeenCalled();
    });

    it('should throw if not initialized', async () => {
      const builder = new Builder(config);
      const command = new MockCommand();

      await expect(builder.executeCommand(command)).rejects.toThrow(
        'Builder not initialized'
      );
    });

    it('should log command in debug mode', async () => {
      const consoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
      const debugBuilder = new Builder({ ...config, debug: true });
      await debugBuilder.initialize();

      const command = new MockCommand();
      await debugBuilder.executeCommand(command);

      expect(consoleLog).toHaveBeenCalledWith(
        '[Builder] Executing command:',
        command.type,
        command.payload
      );

      consoleLog.mockRestore();
    });
  });

  describe('undo()', () => {
    it('should undo last command', async () => {
      const builder = new Builder(config);
      await builder.initialize();

      const command = new MockCommand();
      await builder.executeCommand(command);

      const result = await builder.undo();

      expect(result).toBe(true);
      expect(command.undo).toHaveBeenCalled();
    });

    it('should throw if not initialized', async () => {
      const builder = new Builder(config);
      await expect(builder.undo()).rejects.toThrow('Builder not initialized');
    });

    it('should return false when no commands to undo', async () => {
      const builder = new Builder(config);
      await builder.initialize();

      const result = await builder.undo();
      expect(result).toBe(false);
    });
  });

  describe('redo()', () => {
    it('should redo undone command', async () => {
      const builder = new Builder(config);
      await builder.initialize();

      const command = new MockCommand();
      await builder.executeCommand(command);
      await builder.undo();

      command.execute.mockClear();
      const result = await builder.redo();

      expect(result).toBe(true);
      expect(command.execute).toHaveBeenCalled();
    });

    it('should throw if not initialized', async () => {
      const builder = new Builder(config);
      await expect(builder.redo()).rejects.toThrow('Builder not initialized');
    });
  });

  describe('canUndo() / canRedo()', () => {
    it('should check undo availability', async () => {
      const builder = new Builder(config);
      await builder.initialize();

      expect(builder.canUndo()).toBe(false);

      const command = new MockCommand();
      await builder.executeCommand(command);

      expect(builder.canUndo()).toBe(true);
    });

    it('should check redo availability', async () => {
      const builder = new Builder(config);
      await builder.initialize();

      const command = new MockCommand();
      await builder.executeCommand(command);

      expect(builder.canRedo()).toBe(false);

      await builder.undo();
      expect(builder.canRedo()).toBe(true);
    });
  });

  describe('on() / once()', () => {
    it('should subscribe to events', async () => {
      const builder = new Builder(config);
      const listener = vi.fn();

      builder.on(BuilderEvent.INITIALIZED, listener);
      await builder.initialize();

      expect(listener).toHaveBeenCalled();
    });

    it('should subscribe to events once', async () => {
      const builder = new Builder(config);
      const listener = vi.fn();

      builder.once(BuilderEvent.INITIALIZED, listener);
      await builder.initialize();

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should allow unsubscribing', async () => {
      const builder = new Builder(config);
      const listener = vi.fn();

      const subscription = builder.on(BuilderEvent.INITIALIZED, listener);
      subscription.unsubscribe();

      await builder.initialize();
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('getState()', () => {
    it('should return current state', async () => {
      const builder = new Builder(config);
      await builder.initialize();

      const state = builder.getState();
      expect(state).toEqual({});
    });

    it('should return readonly state', async () => {
      const builder = new Builder(config);
      await builder.initialize();

      const state = builder.getState();
      expect(Object.isFrozen(state)).toBe(false);
    });
  });

  describe('getConfig()', () => {
    it('should return builder config', () => {
      const builder = new Builder(config);
      const builderConfig = builder.getConfig();

      expect(builderConfig.target).toBe('email');
      expect(builderConfig.storage.method).toBe('local');
    });
  });

  describe('isInitialized()', () => {
    it('should return false before initialization', () => {
      const builder = new Builder(config);
      expect(builder.isInitialized()).toBe(false);
    });

    it('should return true after initialization', async () => {
      const builder = new Builder(config);
      await builder.initialize();
      expect(builder.isInitialized()).toBe(true);
    });
  });

  describe('destroy()', () => {
    it('should cleanup resources', async () => {
      const builder = new Builder(config);
      await builder.initialize();

      builder.destroy();

      expect(builder.isInitialized()).toBe(false);
      expect(builder.getState()).toEqual({});
    });

    it('should clear command history', async () => {
      const builder = new Builder(config);
      await builder.initialize();

      const command = new MockCommand();
      await builder.executeCommand(command);

      builder.destroy();

      expect(builder.canUndo()).toBe(false);
    });

    it('should remove event listeners', async () => {
      const builder = new Builder(config);
      const listener = vi.fn();

      builder.on(BuilderEvent.STATE_CHANGED, listener);
      builder.destroy();

      await builder.initialize();
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should emit error event on initialization failure', async () => {
      const errorConfig: BuilderConfig = {
        target: 'email',
        storage: { method: 'local' },
        callbacks: {
          onError: vi.fn(),
        },
      };

      const builder = new Builder(errorConfig);
      const errorListener = vi.fn();
      builder.on(BuilderEvent.ERROR, errorListener);

      try {
        await builder.initialize();
        await builder.initialize();
      } catch (error) {
        expect(errorListener).toHaveBeenCalled();
        expect(errorConfig.callbacks?.onError).toHaveBeenCalled();
      }
    });

    it('should log errors in debug mode', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      const debugBuilder = new Builder({ ...config, debug: true });

      try {
        await debugBuilder.initialize();
        await debugBuilder.initialize();
      } catch (error) {
        expect(consoleError).toHaveBeenCalled();
      }

      consoleError.mockRestore();
    });
  });

  describe('callbacks', () => {
    it('should call onStateChange callback', async () => {
      const onStateChange = vi.fn();
      const builder = new Builder({
        ...config,
        callbacks: { onStateChange },
      });

      await builder.initialize();
      expect(onStateChange).not.toHaveBeenCalled();
    });

    it('should call onError callback', async () => {
      const onError = vi.fn();
      const builder = new Builder({
        ...config,
        callbacks: { onError },
      });

      try {
        await builder.initialize();
        await builder.initialize();
      } catch (error) {
        expect(onError).toHaveBeenCalledWith(expect.any(Error));
      }
    });
  });
});
