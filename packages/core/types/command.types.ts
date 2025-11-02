/**
 * Command pattern types
 */

/**
 * Command type identifiers
 */
export enum CommandType {
  ADD_COMPONENT = 'ADD_COMPONENT',
  REMOVE_COMPONENT = 'REMOVE_COMPONENT',
  UPDATE_COMPONENT_CONTENT = 'UPDATE_COMPONENT_CONTENT',
  UPDATE_COMPONENT_STYLE = 'UPDATE_COMPONENT_STYLE',
  REORDER_COMPONENTS = 'REORDER_COMPONENTS',
  SAVE_TEMPLATE = 'SAVE_TEMPLATE',
  LOAD_TEMPLATE = 'LOAD_TEMPLATE',
  EXPORT_HTML = 'EXPORT_HTML',
  CREATE_PRESET = 'CREATE_PRESET',
  UPDATE_PRESET = 'UPDATE_PRESET',
  DELETE_PRESET = 'DELETE_PRESET',
  APPLY_PRESET = 'APPLY_PRESET',
  SAVE_STYLE_PRESET = 'SAVE_STYLE_PRESET',
  DELETE_STYLE_PRESET = 'DELETE_STYLE_PRESET',
  INJECT_DATA = 'INJECT_DATA',
  UNDO = 'UNDO',
  REDO = 'REDO',
  PREVIEW = 'PREVIEW',
}

/**
 * Base command interface
 *
 * All commands must implement this interface
 */
export interface Command<TPayload = unknown> {
  /**
   * Command type identifier
   */
  type: CommandType;

  /**
   * Command payload
   */
  payload: TPayload;

  /**
   * Timestamp when command was created
   */
  timestamp: number;

  /**
   * Command ID for tracking
   */
  id: string;
}

/**
 * Command execution result
 */
export interface CommandResult<TData = unknown> {
  /**
   * Whether the command succeeded
   */
  success: boolean;

  /**
   * Result data (if successful)
   */
  data?: TData;

  /**
   * Error (if failed)
   */
  error?: Error;

  /**
   * Command that was executed
   */
  command: Command;
}

/**
 * Command handler function
 */
export type CommandHandler<TPayload = unknown, TResult = unknown> = (
  payload: TPayload
) => Promise<CommandResult<TResult>> | CommandResult<TResult>;

/**
 * Undoable command interface
 *
 * Commands that can be undone/redone should implement this
 */
export interface UndoableCommand<TPayload = unknown> extends Command<TPayload> {
  /**
   * Executes the command
   */
  execute(): Promise<void> | void;

  /**
   * Undoes the command
   */
  undo(): Promise<void> | void;

  /**
   * Whether this command can be undone
   */
  canUndo(): boolean;
}

/**
 * Command history entry
 */
export interface CommandHistoryEntry {
  /**
   * The command
   */
  command: Command;

  /**
   * Previous state (for undo)
   */
  previousState?: unknown;

  /**
   * New state (for redo)
   */
  newState?: unknown;

  /**
   * Timestamp
   */
  timestamp: number;
}
