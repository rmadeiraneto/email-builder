/**
 * Command manager
 *
 * Manages command execution, history, and undo/redo functionality
 */

import type {
  Command,
  CommandResult,
  CommandHistoryEntry,
  UndoableCommand,
} from '../types';
import { EventEmitter } from '../services/EventEmitter';
import { BuilderEvent } from '../types';

export class CommandManager {
  private history: CommandHistoryEntry[] = [];
  private currentIndex: number = -1;
  private maxHistorySize: number;
  private eventEmitter: EventEmitter;

  constructor(eventEmitter: EventEmitter, maxHistorySize: number = 50) {
    this.eventEmitter = eventEmitter;
    this.maxHistorySize = maxHistorySize;
  }

  /**
   * Executes a command
   */
  public async execute<TPayload = unknown, TResult = unknown>(
    command: Command<TPayload>
  ): Promise<CommandResult<TResult>> {
    try {
      const result: CommandResult<TResult> = {
        success: true,
        command,
      };

      if (this.isUndoableCommand(command)) {
        await command.execute();
        this.addToHistory({
          command,
          timestamp: Date.now(),
        });
      }

      return result;
    } catch (error) {
      this.eventEmitter.emit(BuilderEvent.ERROR, error);
      return {
        success: false,
        error: error as Error,
        command,
      };
    }
  }

  /**
   * Undoes the last command
   */
  public async undo(): Promise<boolean> {
    if (!this.canUndo()) {
      return false;
    }

    const entry = this.history[this.currentIndex];
    if (!entry) {
      return false;
    }

    const command = entry.command;

    if (this.isUndoableCommand(command)) {
      try {
        await command.undo();
        this.currentIndex--;
        this.eventEmitter.emit(BuilderEvent.UNDO, { command });
        return true;
      } catch (error) {
        this.eventEmitter.emit(BuilderEvent.ERROR, error);
        return false;
      }
    }

    return false;
  }

  /**
   * Redoes the next command
   */
  public async redo(): Promise<boolean> {
    if (!this.canRedo()) {
      return false;
    }

    const entry = this.history[this.currentIndex + 1];
    if (!entry) {
      return false;
    }

    const command = entry.command;

    if (this.isUndoableCommand(command)) {
      try {
        await command.execute();
        this.currentIndex++;
        this.eventEmitter.emit(BuilderEvent.REDO, { command });
        return true;
      } catch (error) {
        this.eventEmitter.emit(BuilderEvent.ERROR, error);
        return false;
      }
    }

    return false;
  }

  /**
   * Checks if undo is possible
   */
  public canUndo(): boolean {
    return this.currentIndex >= 0;
  }

  /**
   * Checks if redo is possible
   */
  public canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }

  /**
   * Clears command history
   */
  public clearHistory(): void {
    this.history = [];
    this.currentIndex = -1;
  }

  /**
   * Gets command history
   */
  public getHistory(): ReadonlyArray<CommandHistoryEntry> {
    return [...this.history];
  }

  /**
   * Gets current history index
   */
  public getCurrentIndex(): number {
    return this.currentIndex;
  }

  /**
   * Adds a command to history
   */
  private addToHistory(entry: CommandHistoryEntry): void {
    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1);
    }

    this.history.push(entry);
    this.currentIndex++;

    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
      this.currentIndex--;
    }
  }

  /**
   * Type guard to check if command is undoable
   */
  private isUndoableCommand(command: Command): command is UndoableCommand {
    return (
      'execute' in command &&
      'undo' in command &&
      'canUndo' in command &&
      typeof (command as UndoableCommand).execute === 'function' &&
      typeof (command as UndoableCommand).undo === 'function'
    );
  }
}
