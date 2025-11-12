/**
 * CommandManager tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CommandManager } from './CommandManager';
import { EventEmitter } from '../services/EventEmitter';
import { BuilderEvent, CommandType } from '../types';
import type { UndoableCommand } from '../types';

const waitForEmit = () => new Promise(resolve => setTimeout(resolve, 10));

class MockCommand implements UndoableCommand {
  type = CommandType.ADD_COMPONENT;
  timestamp = Date.now();
  id = 'mock-command';
  payload = {};

  execute = vi.fn();
  undo = vi.fn();
  canUndo = vi.fn(() => true);
}

describe('CommandManager', () => {
  let eventEmitter: EventEmitter;
  let commandManager: CommandManager;

  beforeEach(() => {
    eventEmitter = new EventEmitter();
    commandManager = new CommandManager(eventEmitter);
  });

  describe('execute()', () => {
    it('should execute undoable command', async () => {
      const command = new MockCommand();

      const result = await commandManager.execute(command);

      expect(command.execute).toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.command).toBe(command);
    });

    it('should add command to history', async () => {
      const command = new MockCommand();

      await commandManager.execute(command);

      expect(commandManager.canUndo()).toBe(true);
      expect(commandManager.getCurrentIndex()).toBe(0);
    });

    it('should handle command execution error', async () => {
      const command = new MockCommand();
      const error = new Error('Execution failed');
      command.execute.mockRejectedValue(error);

      const errorListener = vi.fn();
      eventEmitter.on(BuilderEvent.ERROR, errorListener);

      const result = await commandManager.execute(command);
      await waitForEmit();

      expect(result.success).toBe(false);
      expect(result.error).toBe(error);
      expect(errorListener).toHaveBeenCalledWith(error);
    });

    it('should not add failed command to history', async () => {
      const command = new MockCommand();
      command.execute.mockRejectedValue(new Error('Execution failed'));

      await commandManager.execute(command);

      expect(commandManager.canUndo()).toBe(false);
    });
  });

  describe('undo()', () => {
    it('should undo last command', async () => {
      const command = new MockCommand();
      await commandManager.execute(command);

      const result = await commandManager.undo();

      expect(result).toBe(true);
      expect(command.undo).toHaveBeenCalled();
    });

    it('should emit undo event', async () => {
      const command = new MockCommand();
      await commandManager.execute(command);

      const undoListener = vi.fn();
      eventEmitter.on(BuilderEvent.UNDO, undoListener);

      await commandManager.undo();
      await waitForEmit();

      expect(undoListener).toHaveBeenCalledWith({ command });
    });

    it('should return false when no commands to undo', async () => {
      const result = await commandManager.undo();
      expect(result).toBe(false);
    });

    it('should handle undo error', async () => {
      const command = new MockCommand();
      const error = new Error('Undo failed');
      command.undo.mockRejectedValue(error);

      await commandManager.execute(command);

      const errorListener = vi.fn();
      eventEmitter.on(BuilderEvent.ERROR, errorListener);

      const result = await commandManager.undo();
      await waitForEmit();

      expect(result).toBe(false);
      expect(errorListener).toHaveBeenCalledWith(error);
    });

    it('should update current index after undo', async () => {
      const command = new MockCommand();
      await commandManager.execute(command);
      expect(commandManager.getCurrentIndex()).toBe(0);

      await commandManager.undo();
      expect(commandManager.getCurrentIndex()).toBe(-1);
    });
  });

  describe('redo()', () => {
    it('should redo undone command', async () => {
      const command = new MockCommand();
      await commandManager.execute(command);
      await commandManager.undo();

      command.execute.mockClear();
      const result = await commandManager.redo();

      expect(result).toBe(true);
      expect(command.execute).toHaveBeenCalled();
    });

    it('should emit redo event', async () => {
      const command = new MockCommand();
      await commandManager.execute(command);
      await commandManager.undo();

      const redoListener = vi.fn();
      eventEmitter.on(BuilderEvent.REDO, redoListener);

      await commandManager.redo();
      await waitForEmit();

      expect(redoListener).toHaveBeenCalledWith({ command });
    });

    it('should return false when no commands to redo', async () => {
      const result = await commandManager.redo();
      expect(result).toBe(false);
    });

    it('should handle redo error', async () => {
      const command = new MockCommand();
      await commandManager.execute(command);
      await commandManager.undo();

      const error = new Error('Redo failed');
      command.execute.mockRejectedValue(error);

      const errorListener = vi.fn();
      eventEmitter.on(BuilderEvent.ERROR, errorListener);

      const result = await commandManager.redo();
      await waitForEmit();

      expect(result).toBe(false);
      expect(errorListener).toHaveBeenCalledWith(error);
    });

    it('should update current index after redo', async () => {
      const command = new MockCommand();
      await commandManager.execute(command);
      await commandManager.undo();
      expect(commandManager.getCurrentIndex()).toBe(-1);

      await commandManager.redo();
      expect(commandManager.getCurrentIndex()).toBe(0);
    });
  });

  describe('canUndo()', () => {
    it('should return false initially', () => {
      expect(commandManager.canUndo()).toBe(false);
    });

    it('should return true after executing command', async () => {
      const command = new MockCommand();
      await commandManager.execute(command);
      expect(commandManager.canUndo()).toBe(true);
    });

    it('should return false after undoing all commands', async () => {
      const command = new MockCommand();
      await commandManager.execute(command);
      await commandManager.undo();
      expect(commandManager.canUndo()).toBe(false);
    });
  });

  describe('canRedo()', () => {
    it('should return false initially', () => {
      expect(commandManager.canRedo()).toBe(false);
    });

    it('should return false after executing command', async () => {
      const command = new MockCommand();
      await commandManager.execute(command);
      expect(commandManager.canRedo()).toBe(false);
    });

    it('should return true after undoing command', async () => {
      const command = new MockCommand();
      await commandManager.execute(command);
      await commandManager.undo();
      expect(commandManager.canRedo()).toBe(true);
    });
  });

  describe('clearHistory()', () => {
    it('should clear all history', async () => {
      const command = new MockCommand();
      await commandManager.execute(command);

      commandManager.clearHistory();

      expect(commandManager.canUndo()).toBe(false);
      expect(commandManager.canRedo()).toBe(false);
      expect(commandManager.getCurrentIndex()).toBe(-1);
      expect(commandManager.getHistory()).toHaveLength(0);
    });
  });

  describe('getHistory()', () => {
    it('should return command history', async () => {
      const command1 = new MockCommand();
      const command2 = new MockCommand();

      await commandManager.execute(command1);
      await commandManager.execute(command2);

      const history = commandManager.getHistory();
      expect(history).toHaveLength(2);
      expect(history[0]?.command).toBe(command1);
      expect(history[1]?.command).toBe(command2);
    });

    it('should return readonly array', async () => {
      const command = new MockCommand();
      await commandManager.execute(command);

      const history = commandManager.getHistory();
      expect(Array.isArray(history)).toBe(true);
    });
  });

  describe('history management', () => {
    it('should limit history size', async () => {
      const smallManager = new CommandManager(eventEmitter, 2);

      const command1 = new MockCommand();
      const command2 = new MockCommand();
      const command3 = new MockCommand();

      await smallManager.execute(command1);
      await smallManager.execute(command2);
      await smallManager.execute(command3);

      expect(smallManager.getHistory()).toHaveLength(2);
      expect(smallManager.getHistory()[0]?.command).toBe(command2);
      expect(smallManager.getHistory()[1]?.command).toBe(command3);
    });

    it('should clear future history on new command after undo', async () => {
      const command1 = new MockCommand();
      const command2 = new MockCommand();
      const command3 = new MockCommand();

      await commandManager.execute(command1);
      await commandManager.execute(command2);
      await commandManager.undo();
      await commandManager.execute(command3);

      const history = commandManager.getHistory();
      expect(history).toHaveLength(2);
      expect(history[0]?.command).toBe(command1);
      expect(history[1]?.command).toBe(command3);
    });
  });
});
