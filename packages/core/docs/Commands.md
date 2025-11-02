# Command System Guide

The Email Builder uses the **Command Pattern** to encapsulate all operations as executable, undoable commands. This enables powerful features like undo/redo, command history, and transactional operations.

## Table of Contents

- [Overview](#overview)
- [Core Concepts](#core-concepts)
- [Command Types](#command-types)
- [Using Commands](#using-commands)
- [Built-in Commands](#built-in-commands)
- [Creating Custom Commands](#creating-custom-commands)
- [Command Manager](#command-manager)
- [Undo/Redo](#undoredo)
- [Command History](#command-history)
- [Best Practices](#best-practices)
- [Advanced Patterns](#advanced-patterns)

## Overview

The Command Pattern provides:

- **Undo/Redo** - All operations can be reversed and replayed
- **Command History** - Track all changes to templates
- **Atomic Operations** - Commands execute as single units
- **Type Safety** - Strongly typed payloads and results
- **Extensibility** - Easy to create custom commands
- **Event Integration** - Commands emit events for reactive UIs

## Core Concepts

### Command Interface

Every command implements the `Command` interface:

```typescript
interface Command<TPayload = unknown> {
  type: CommandType;        // Command type identifier
  payload: TPayload;        // Command data
  timestamp: number;        // When created
  id: string;              // Unique identifier
}
```

### Undoable Command Interface

Commands that support undo/redo implement `UndoableCommand`:

```typescript
interface UndoableCommand<TPayload = unknown> extends Command<TPayload> {
  execute(): Promise<void> | void;  // Execute the command
  undo(): Promise<void> | void;     // Reverse the command
  canUndo(): boolean;               // Check if undoable
}
```

### Command Result

Commands return a `CommandResult`:

```typescript
interface CommandResult<TData = unknown> {
  success: boolean;    // Whether command succeeded
  data?: TData;       // Result data (if successful)
  error?: Error;      // Error (if failed)
  command: Command;   // The executed command
}
```

## Command Types

All commands are identified by their type:

```typescript
enum CommandType {
  // Component operations
  ADD_COMPONENT = 'ADD_COMPONENT',
  REMOVE_COMPONENT = 'REMOVE_COMPONENT',
  UPDATE_COMPONENT_CONTENT = 'UPDATE_COMPONENT_CONTENT',
  UPDATE_COMPONENT_STYLE = 'UPDATE_COMPONENT_STYLE',
  REORDER_COMPONENTS = 'REORDER_COMPONENTS',

  // Template operations
  SAVE_TEMPLATE = 'SAVE_TEMPLATE',
  LOAD_TEMPLATE = 'LOAD_TEMPLATE',
  EXPORT_HTML = 'EXPORT_HTML',

  // Style operations
  SAVE_STYLE_PRESET = 'SAVE_STYLE_PRESET',
  DELETE_STYLE_PRESET = 'DELETE_STYLE_PRESET',

  // Data operations
  INJECT_DATA = 'INJECT_DATA',

  // History operations
  UNDO = 'UNDO',
  REDO = 'REDO',

  // Preview
  PREVIEW = 'PREVIEW'
}
```

## Using Commands

### Basic Command Execution

```typescript
import { Builder, TemplateAddComponentCommand } from '@email-builder/core';

// Create builder
const builder = new Builder({
  target: 'email',
  storage: { method: 'local' }
});

await builder.initialize();

// Create and execute command
const command = new TemplateAddComponentCommand({
  templateId: template.id,
  component: {
    type: 'text',
    content: 'Hello World',
    style: {
      fontSize: '16px',
      color: '#333333'
    }
  }
});

const result = await builder.executeCommand(command);

if (result.success) {
  console.log('Component added successfully');
} else {
  console.error('Failed to add component:', result.error);
}
```

### Command with Error Handling

```typescript
try {
  const result = await builder.executeCommand(command);

  if (!result.success) {
    throw result.error;
  }

  console.log('Command succeeded:', result.data);
} catch (error) {
  console.error('Command execution failed:', error);
  // Handle error appropriately
}
```

## Built-in Commands

### Template Commands

#### TemplateAddComponentCommand

Adds a component to a template:

```typescript
import { TemplateAddComponentCommand } from '@email-builder/core';

const command = new TemplateAddComponentCommand({
  templateId: template.id,
  component: {
    type: 'button',
    content: 'Click Me',
    style: {
      backgroundColor: '#007bff',
      color: '#ffffff'
    }
  },
  position: 0 // Optional: Insert at specific position
});

await builder.executeCommand(command);
```

#### TemplateUpdateComponentCommand

Updates an existing component:

```typescript
import { TemplateUpdateComponentCommand } from '@email-builder/core';

const command = new TemplateUpdateComponentCommand({
  templateId: template.id,
  componentId: 'component-123',
  updates: {
    content: 'Updated Content',
    style: {
      fontSize: '18px'
    }
  }
});

await builder.executeCommand(command);
```

#### TemplateRemoveComponentCommand

Removes a component from a template:

```typescript
import { TemplateRemoveComponentCommand } from '@email-builder/core';

const command = new TemplateRemoveComponentCommand({
  templateId: template.id,
  componentId: 'component-123'
});

await builder.executeCommand(command);
```

#### TemplateReorderComponentCommand

Changes component position:

```typescript
import { TemplateReorderComponentCommand } from '@email-builder/core';

const command = new TemplateReorderComponentCommand({
  templateId: template.id,
  componentId: 'component-123',
  newPosition: 2 // Move to index 2
});

await builder.executeCommand(command);
```

#### TemplateDuplicateComponentCommand

Duplicates an existing component:

```typescript
import { TemplateDuplicateComponentCommand } from '@email-builder/core';

const command = new TemplateDuplicateComponentCommand({
  templateId: template.id,
  componentId: 'component-123'
});

const result = await builder.executeCommand(command);
console.log('Duplicated component:', result.data);
```

### Legacy Commands

These commands work with the builder state directly:

#### AddComponentCommand

```typescript
import { AddComponentCommand } from '@email-builder/core';

const command = new AddComponentCommand({
  type: 'text',
  content: 'Hello',
  style: {}
});

await builder.executeCommand(command);
```

#### UpdateComponentContentCommand

```typescript
import { UpdateComponentContentCommand } from '@email-builder/core';

const command = new UpdateComponentContentCommand({
  componentId: 'component-123',
  content: 'New content'
});

await builder.executeCommand(command);
```

#### UpdateComponentStyleCommand

```typescript
import { UpdateComponentStyleCommand } from '@email-builder/core';

const command = new UpdateComponentStyleCommand({
  componentId: 'component-123',
  style: {
    fontSize: '20px',
    fontWeight: 'bold'
  }
});

await builder.executeCommand(command);
```

## Creating Custom Commands

### Basic Custom Command

```typescript
import { Command, CommandType, CommandResult } from '@email-builder/core';

interface MyCommandPayload {
  data: string;
}

class MyCustomCommand implements Command<MyCommandPayload> {
  type = CommandType.CUSTOM;
  timestamp = Date.now();
  id = crypto.randomUUID();
  payload: MyCommandPayload;

  constructor(payload: MyCommandPayload) {
    this.payload = payload;
  }
}
```

### Undoable Custom Command

```typescript
import { UndoableCommand, CommandType } from '@email-builder/core';

interface SendEmailPayload {
  to: string;
  subject: string;
  body: string;
}

class SendEmailCommand implements UndoableCommand<SendEmailPayload> {
  type = CommandType.CUSTOM;
  timestamp = Date.now();
  id = crypto.randomUUID();
  payload: SendEmailPayload;

  private emailId?: string;

  constructor(payload: SendEmailPayload) {
    this.payload = payload;
  }

  async execute(): Promise<void> {
    // Send email via API
    const response = await fetch('/api/emails', {
      method: 'POST',
      body: JSON.stringify(this.payload)
    });

    const data = await response.json();
    this.emailId = data.id;

    console.log('Email sent:', this.emailId);
  }

  async undo(): Promise<void> {
    // Cancel/recall email
    if (this.emailId) {
      await fetch(`/api/emails/${this.emailId}/cancel`, {
        method: 'POST'
      });
      console.log('Email cancelled:', this.emailId);
    }
  }

  canUndo(): boolean {
    return this.emailId !== undefined;
  }
}

// Usage
const command = new SendEmailCommand({
  to: 'user@example.com',
  subject: 'Welcome',
  body: 'Hello!'
});

await builder.executeCommand(command);
```

### Command with State Management

```typescript
import { UndoableCommand, CommandType } from '@email-builder/core';

interface ToggleFeaturePayload {
  featureName: string;
}

class ToggleFeatureCommand implements UndoableCommand<ToggleFeaturePayload> {
  type = CommandType.CUSTOM;
  timestamp = Date.now();
  id = crypto.randomUUID();
  payload: ToggleFeaturePayload;

  private previousState: boolean = false;

  constructor(
    payload: ToggleFeaturePayload,
    private getFeatureState: (name: string) => boolean,
    private setFeatureState: (name: string, enabled: boolean) => void
  ) {
    this.payload = payload;
  }

  execute(): void {
    // Store previous state for undo
    this.previousState = this.getFeatureState(this.payload.featureName);

    // Toggle feature
    this.setFeatureState(this.payload.featureName, !this.previousState);
  }

  undo(): void {
    // Restore previous state
    this.setFeatureState(this.payload.featureName, this.previousState);
  }

  canUndo(): boolean {
    return true;
  }
}
```

## Command Manager

The `CommandManager` handles command execution and history:

```typescript
// Get command manager from builder
const commandManager = builder.getCommandManager();

// Execute command
await commandManager.execute(command);

// Undo/Redo
await commandManager.undo();
await commandManager.redo();

// Check availability
if (commandManager.canUndo()) {
  await commandManager.undo();
}

// Get history
const history = commandManager.getHistory();
console.log('Command count:', history.length);

// Get current index
const index = commandManager.getCurrentIndex();
console.log('Current position:', index);

// Clear history
commandManager.clearHistory();
```

### Direct CommandManager Usage

```typescript
import { CommandManager, EventEmitter } from '@email-builder/core';

const eventEmitter = new EventEmitter();
const commandManager = new CommandManager(eventEmitter, 100); // 100 commands max

// Execute commands
await commandManager.execute(command1);
await commandManager.execute(command2);
await commandManager.execute(command3);

// Undo twice
await commandManager.undo();
await commandManager.undo();

// Redo once
await commandManager.redo();
```

## Undo/Redo

### Basic Undo/Redo

```typescript
// Check if undo is available
if (builder.canUndo()) {
  await builder.undo();
}

// Check if redo is available
if (builder.canRedo()) {
  await builder.redo();
}
```

### Keyboard Shortcuts Integration

```typescript
document.addEventListener('keydown', async (e) => {
  // Ctrl+Z / Cmd+Z - Undo
  if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
    e.preventDefault();
    if (builder.canUndo()) {
      await builder.undo();
    }
  }

  // Ctrl+Shift+Z / Cmd+Shift+Z - Redo
  if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
    e.preventDefault();
    if (builder.canRedo()) {
      await builder.redo();
    }
  }

  // Ctrl+Y / Cmd+Y - Redo (alternative)
  if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
    e.preventDefault();
    if (builder.canRedo()) {
      await builder.redo();
    }
  }
});
```

### UI Integration

```typescript
// React example
function UndoRedoButtons() {
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    const updateButtons = () => {
      setCanUndo(builder.canUndo());
      setCanRedo(builder.canRedo());
    };

    // Update on command execution
    const sub1 = builder.on(BuilderEvent.COMMAND_EXECUTED, updateButtons);
    const sub2 = builder.on(BuilderEvent.UNDO, updateButtons);
    const sub3 = builder.on(BuilderEvent.REDO, updateButtons);

    updateButtons();

    return () => {
      sub1.unsubscribe();
      sub2.unsubscribe();
      sub3.unsubscribe();
    };
  }, []);

  return (
    <div>
      <button
        disabled={!canUndo}
        onClick={() => builder.undo()}
      >
        Undo
      </button>
      <button
        disabled={!canRedo}
        onClick={() => builder.redo()}
      >
        Redo
      </button>
    </div>
  );
}
```

## Command History

### Viewing History

```typescript
const commandManager = builder.getCommandManager();
const history = commandManager.getHistory();

history.forEach((entry, index) => {
  console.log(`${index}: ${entry.command.type} at ${new Date(entry.timestamp)}`);
});
```

### History with Details

```typescript
const history = commandManager.getHistory();
const currentIndex = commandManager.getCurrentIndex();

console.log('Command History:');
history.forEach((entry, index) => {
  const isCurrent = index === currentIndex;
  const status = index <= currentIndex ? '✓' : '○';
  const pointer = isCurrent ? '→' : ' ';

  console.log(
    `${pointer} ${status} ${entry.command.type}`,
    entry.command.payload
  );
});
```

### History UI Component

```typescript
// React example
function CommandHistory() {
  const [history, setHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  useEffect(() => {
    const updateHistory = () => {
      const commandManager = builder.getCommandManager();
      setHistory(commandManager.getHistory());
      setCurrentIndex(commandManager.getCurrentIndex());
    };

    const sub1 = builder.on(BuilderEvent.COMMAND_EXECUTED, updateHistory);
    const sub2 = builder.on(BuilderEvent.UNDO, updateHistory);
    const sub3 = builder.on(BuilderEvent.REDO, updateHistory);

    updateHistory();

    return () => {
      sub1.unsubscribe();
      sub2.unsubscribe();
      sub3.unsubscribe();
    };
  }, []);

  return (
    <div className="command-history">
      <h3>History</h3>
      <ul>
        {history.map((entry, index) => (
          <li
            key={entry.command.id}
            className={index === currentIndex ? 'current' : ''}
          >
            {entry.command.type}
            <small>{new Date(entry.timestamp).toLocaleTimeString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Best Practices

### 1. Always Use Commands for State Changes

```typescript
// Bad: Direct state mutation
template.components.push(newComponent);

// Good: Use command
await builder.executeCommand(
  new TemplateAddComponentCommand({
    templateId: template.id,
    component: newComponent
  })
);
```

### 2. Store Previous State for Undo

```typescript
class MyCommand implements UndoableCommand {
  private previousState: any;

  execute() {
    // Store state BEFORE making changes
    this.previousState = deepClone(currentState);

    // Make changes
    currentState.value = this.payload.newValue;
  }

  undo() {
    // Restore previous state
    currentState = deepClone(this.previousState);
  }

  canUndo() {
    return this.previousState !== undefined;
  }
}
```

### 3. Use Specific Command Types

```typescript
// Bad: Generic command type
const command = {
  type: 'UPDATE',
  payload: { ... }
};

// Good: Specific command class
const command = new TemplateUpdateComponentCommand({
  templateId: template.id,
  componentId: component.id,
  updates: { content: 'New content' }
});
```

### 4. Handle Command Errors

```typescript
const result = await builder.executeCommand(command);

if (!result.success) {
  // Show error to user
  showNotification({
    type: 'error',
    message: `Failed to ${command.type}: ${result.error?.message}`
  });

  // Log for debugging
  console.error('Command failed:', result.error);
}
```

### 5. Limit History Size

```typescript
// Create command manager with limited history
const commandManager = new CommandManager(
  eventEmitter,
  50 // Keep only last 50 commands
);
```

### 6. Clear History When Appropriate

```typescript
// Clear history when loading new template
builder.on(BuilderEvent.TEMPLATE_LOADED, () => {
  const commandManager = builder.getCommandManager();
  commandManager.clearHistory();
});
```

### 7. Make Commands Atomic

```typescript
// Bad: Command that makes multiple separate changes
class BadCommand implements UndoableCommand {
  execute() {
    updateComponent1();
    updateComponent2();
    updateComponent3();
  }
}

// Good: Command that makes a single logical change
class GoodCommand implements UndoableCommand {
  execute() {
    updateAllComponentsAtomically();
  }
}
```

## Advanced Patterns

### Command Composition

Execute multiple commands as a single operation:

```typescript
class CompositeCommand implements UndoableCommand {
  type = CommandType.CUSTOM;
  timestamp = Date.now();
  id = crypto.randomUUID();
  payload = {};

  constructor(private commands: UndoableCommand[]) {}

  async execute(): Promise<void> {
    for (const command of this.commands) {
      await command.execute();
    }
  }

  async undo(): Promise<void> {
    // Undo in reverse order
    for (let i = this.commands.length - 1; i >= 0; i--) {
      await this.commands[i].undo();
    }
  }

  canUndo(): boolean {
    return this.commands.every(cmd => cmd.canUndo());
  }
}

// Usage
const composite = new CompositeCommand([
  new TemplateAddComponentCommand({ ... }),
  new TemplateUpdateComponentCommand({ ... }),
  new TemplateReorderComponentCommand({ ... })
]);

await builder.executeCommand(composite);
```

### Command Middleware

Intercept and modify commands before execution:

```typescript
class CommandMiddleware {
  async execute(command: Command, next: () => Promise<CommandResult>) {
    console.log('Before:', command.type);

    const result = await next();

    console.log('After:', result.success);

    return result;
  }
}
```

### Optimistic Updates

Execute command optimistically and rollback on failure:

```typescript
async function optimisticUpdate(command: UndoableCommand) {
  // Execute locally
  await command.execute();

  try {
    // Sync to server
    await api.syncCommand(command);
  } catch (error) {
    // Rollback on failure
    await command.undo();
    throw error;
  }
}
```

### Command Batching

Batch multiple commands for performance:

```typescript
class CommandBatcher {
  private batch: Command[] = [];
  private timeout: number | null = null;

  add(command: Command) {
    this.batch.push(command);

    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => this.flush(), 100);
  }

  async flush() {
    if (this.batch.length === 0) return;

    const commands = [...this.batch];
    this.batch = [];

    for (const command of commands) {
      await builder.executeCommand(command);
    }
  }
}
```

### Command Serialization

Serialize commands for storage or network transfer:

```typescript
function serializeCommand(command: Command): string {
  return JSON.stringify({
    type: command.type,
    payload: command.payload,
    timestamp: command.timestamp,
    id: command.id
  });
}

function deserializeCommand(json: string): Command {
  const data = JSON.parse(json);

  // Reconstruct command based on type
  switch (data.type) {
    case CommandType.ADD_COMPONENT:
      return new TemplateAddComponentCommand(data.payload);
    // ... other command types
    default:
      throw new Error(`Unknown command type: ${data.type}`);
  }
}
```

## Related Documentation

- [Builder Guide](./Builder.md) - Builder class usage and patterns
- [README](../README.md) - Package overview and quick start

## Support

For issues and questions:
- GitHub Issues: https://github.com/rmadeiraneto/email-builder/issues
- Documentation: https://github.com/rmadeiraneto/email-builder
