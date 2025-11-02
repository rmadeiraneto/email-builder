# @email-builder/core

Framework-agnostic core functionality for the Email Builder. This package provides the foundational logic for building, managing, and exporting email templates programmatically.

## Features

- **Builder API** - Main interface for creating and managing email templates
- **Command Pattern** - Undo/redo support for all template operations
- **Component Registry** - Type-safe component definitions and factories
- **Template Management** - Save, load, version, and export templates
- **Storage Adapters** - LocalStorage and custom storage support
- **Event System** - Subscribe to builder lifecycle events
- **Framework Agnostic** - Works with any JavaScript framework or vanilla JS

## Installation

```bash
npm install @email-builder/core
# or
pnpm add @email-builder/core
# or
yarn add @email-builder/core
```

## Quick Start

```typescript
import { Builder, ComponentRegistry } from '@email-builder/core';

// Create a new builder instance
const builder = new Builder({
  target: 'email',
  storage: {
    method: 'local',
    keyPrefix: 'my-app-'
  }
});

// Initialize the builder
await builder.initialize();

// Get the template manager
const templateManager = builder.getTemplateManager();

// Create a new template
const template = await templateManager.createTemplate({
  name: 'My First Template',
  description: 'A simple welcome email'
});

// Add a text component to the template
const textComponent = {
  type: 'text',
  content: 'Welcome to our newsletter!',
  style: {
    fontSize: '16px',
    color: '#333333'
  }
};

await templateManager.addComponent(template.id, textComponent);

// Save the template
await templateManager.saveTemplate(template);

// Export to HTML
const html = await templateManager.exportTemplate(template.id, 'html');
console.log(html);
```

## Core Concepts

### Builder

The `Builder` class is the main entry point for the email builder. It coordinates all functionality including commands, components, templates, and storage.

```typescript
import { Builder } from '@email-builder/core';

const builder = new Builder({
  // Required: Target platform
  target: 'email', // or 'web'

  // Optional: Storage configuration
  storage: {
    method: 'local',      // 'local' | 'api' | 'custom'
    keyPrefix: 'my-app-', // Prefix for storage keys
  },

  // Optional: Feature flags
  features: {
    undoRedo: true,
    customComponents: true,
    templateVersioning: true
  },

  // Optional: Event callbacks
  callbacks: {
    onSaveTemplate: (template) => {
      console.log('Template saved:', template.name);
    },
    onLoadTemplate: (template) => {
      console.log('Template loaded:', template.name);
    }
  },

  // Optional: Initial template to load
  initialTemplate: existingTemplate,

  // Optional: Locale for internationalization
  locale: 'en-US',

  // Optional: Debug mode
  debug: false
});

// Always initialize before using
await builder.initialize();
```

### Command System

The builder uses the Command Pattern for all operations, enabling undo/redo functionality.

```typescript
import {
  TemplateAddComponentCommand,
  TemplateUpdateComponentCommand,
  TemplateRemoveComponentCommand
} from '@email-builder/core';

// Get command manager
const commandManager = builder.getCommandManager();

// Execute a command
const addCommand = new TemplateAddComponentCommand({
  templateId: template.id,
  component: {
    type: 'button',
    content: 'Click Me',
    style: { backgroundColor: '#007bff' }
  }
});

await builder.executeCommand(addCommand);

// Undo the last command
if (commandManager.canUndo()) {
  await commandManager.undo();
}

// Redo
if (commandManager.canRedo()) {
  await commandManager.redo();
}

// Get history
const history = commandManager.getHistory();
console.log('Command history:', history);

// Clear history
commandManager.clearHistory();
```

### Component Registry

The Component Registry manages component definitions and provides type-safe component creation.

```typescript
import { ComponentRegistry } from '@email-builder/core';

// Get the registry from the builder
const registry = builder.getComponentRegistry();

// Get all available components
const allComponents = registry.getAllComponents();

// Filter components by category
const layoutComponents = registry.getComponentsByCategory('layout');

// Get components for specific target
const emailComponents = registry.getComponentsByTarget('email');

// Get a specific component definition
const buttonDef = registry.getComponent('button');
console.log(buttonDef.defaultProps);

// Search components
const searchResults = registry.searchComponents('text');

// Check if component exists
if (registry.hasComponent('custom-header')) {
  // Component exists
}

// Register a custom component
registry.registerComponent({
  type: 'custom-cta',
  name: 'Custom CTA',
  category: 'content',
  targets: ['email', 'web'],
  description: 'A custom call-to-action component',
  icon: 'mouse-pointer',
  defaultProps: {
    content: 'Get Started',
    style: {
      backgroundColor: '#28a745',
      color: '#ffffff',
      padding: '12px 24px'
    }
  },
  render: (props) => {
    return `<a href="${props.href}" style="...">${props.content}</a>`;
  }
});
```

### Template Management

Create, save, load, and export templates with the Template Manager.

```typescript
const templateManager = builder.getTemplateManager();

// Create a new template
const template = await templateManager.createTemplate({
  name: 'Newsletter Template',
  description: 'Monthly newsletter layout',
  tags: ['newsletter', 'monthly']
});

// Add components
await templateManager.addComponent(template.id, {
  type: 'text',
  content: 'Hello World'
});

// Update a component
await templateManager.updateComponent(template.id, componentId, {
  content: 'Updated content'
});

// Remove a component
await templateManager.removeComponent(template.id, componentId);

// Reorder components
await templateManager.reorderComponent(
  template.id,
  componentId,
  newIndex
);

// Duplicate a component
const duplicatedComponent = await templateManager.duplicateComponent(
  template.id,
  componentId
);

// Save template
await templateManager.saveTemplate(template);

// Load template
const loadedTemplate = await templateManager.loadTemplate(templateId);

// List all templates
const templates = await templateManager.listTemplates();

// Delete template
await templateManager.deleteTemplate(templateId);

// Export template
const html = await templateManager.exportTemplate(templateId, 'html');
const json = await templateManager.exportTemplate(templateId, 'json');
```

### Template Versioning

Track changes and revert to previous versions.

```typescript
// Enable versioning (enabled by default)
const template = await templateManager.createTemplate({
  name: 'Versioned Template',
  enableVersioning: true
});

// Make some changes (automatically creates versions)
await templateManager.addComponent(template.id, component1);
await templateManager.addComponent(template.id, component2);

// Get version history
const versions = await templateManager.getVersionHistory(template.id);

// Revert to a specific version
await templateManager.revertToVersion(template.id, versions[1].versionId);

// Compare versions
const diff = await templateManager.compareVersions(
  template.id,
  versionId1,
  versionId2
);
```

### Event System

Subscribe to builder events to react to changes.

```typescript
import { BuilderEvent } from '@email-builder/core';

// Subscribe to initialization
builder.on(BuilderEvent.INITIALIZED, (data) => {
  console.log('Builder initialized with config:', data.config);
});

// Subscribe to command execution
builder.on(BuilderEvent.COMMAND_EXECUTED, (data) => {
  console.log('Command executed:', data.command.type);
});

// Subscribe to undo
builder.on(BuilderEvent.COMMAND_UNDONE, (data) => {
  console.log('Command undone:', data.command.type);
});

// Subscribe to redo
builder.on(BuilderEvent.COMMAND_REDONE, (data) => {
  console.log('Command redone:', data.command.type);
});

// Subscribe to template events
builder.on(BuilderEvent.TEMPLATE_SAVED, (template) => {
  console.log('Template saved:', template.name);
});

builder.on(BuilderEvent.TEMPLATE_LOADED, (template) => {
  console.log('Template loaded:', template.name);
});

// Unsubscribe from events
const subscription = builder.on(BuilderEvent.INITIALIZED, handler);
subscription.unsubscribe();
```

## Advanced Usage

### Custom Storage Adapter

Implement your own storage adapter for custom backends:

```typescript
import { StorageAdapter } from '@email-builder/core';

class CustomStorageAdapter implements StorageAdapter {
  async get(key: string): Promise<string | null> {
    // Fetch from your API
    const response = await fetch(`/api/storage/${key}`);
    return response.ok ? await response.text() : null;
  }

  async set(key: string, value: string): Promise<void> {
    // Save to your API
    await fetch(`/api/storage/${key}`, {
      method: 'PUT',
      body: value
    });
  }

  async remove(key: string): Promise<void> {
    // Delete from your API
    await fetch(`/api/storage/${key}`, {
      method: 'DELETE'
    });
  }

  async clear(): Promise<void> {
    // Clear all data
    await fetch('/api/storage', {
      method: 'DELETE'
    });
  }

  async getAllKeys(): Promise<string[]> {
    // Get all keys
    const response = await fetch('/api/storage/keys');
    return await response.json();
  }
}

// Use custom adapter
const builder = new Builder({
  target: 'email',
  storage: {
    method: 'custom',
    adapter: new CustomStorageAdapter()
  }
});
```

### Custom Commands

Create custom commands for specific operations:

```typescript
import { Command, CommandResult, CommandType } from '@email-builder/core';

class CustomCommand implements Command {
  type = CommandType.CUSTOM;
  timestamp = Date.now();
  id = crypto.randomUUID();
  payload: { customData: string };

  constructor(data: string) {
    this.payload = { customData: data };
  }

  async execute(): Promise<CommandResult> {
    try {
      // Perform custom operation
      console.log('Executing custom command:', this.payload.customData);

      return {
        success: true,
        data: { result: 'Custom operation completed' }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async undo(): Promise<CommandResult> {
    // Implement undo logic
    return { success: true };
  }

  canUndo(): boolean {
    return true;
  }
}

// Execute custom command
const customCommand = new CustomCommand('my data');
await builder.executeCommand(customCommand);
```

### Working with Canvas Settings

Configure canvas appearance and behavior:

```typescript
const template = await templateManager.createTemplate({
  name: 'Custom Canvas',
  canvas: {
    width: '600px',
    maxWidth: '100%',
    backgroundColor: '#f5f5f5',
    padding: '20px'
  }
});

// Update canvas settings
await templateManager.updateTemplate(template.id, {
  canvas: {
    ...template.canvas,
    backgroundColor: '#ffffff'
  }
});
```

### Exporting Templates

Export templates in different formats:

```typescript
// Export as HTML (for emails)
const html = await templateManager.exportTemplate(templateId, 'html');

// Export as JSON (for storage/backup)
const json = await templateManager.exportTemplate(templateId, 'json');
const templateData = JSON.parse(json);

// Export with inlined styles (for email clients)
const inlinedHtml = await templateManager.exportTemplate(templateId, 'html', {
  inlineStyles: true
});

// Export with data placeholders replaced
const personalizedHtml = await templateManager.exportTemplate(
  templateId,
  'html',
  {
    data: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com'
    }
  }
);
```

## API Reference

### Builder Methods

- `initialize(): Promise<void>` - Initialize the builder
- `executeCommand(command: Command): Promise<CommandResult>` - Execute a command
- `getCommandManager(): CommandManager` - Get the command manager
- `getComponentRegistry(): ComponentRegistry` - Get the component registry
- `getTemplateManager(): TemplateManager` - Get the template manager
- `on(event: BuilderEvent, handler: Function): EventSubscription` - Subscribe to events
- `getConfig(): BuilderConfig` - Get the current configuration
- `getState(): Record<string, unknown>` - Get the current state
- `isInitialized(): boolean` - Check if builder is initialized
- `destroy(): void` - Clean up and destroy the builder

### TemplateManager Methods

- `createTemplate(options: CreateTemplateOptions): Promise<Template>` - Create a new template
- `saveTemplate(template: Template): Promise<void>` - Save a template
- `loadTemplate(id: string): Promise<Template>` - Load a template
- `listTemplates(): Promise<TemplateListItem[]>` - List all templates
- `deleteTemplate(id: string): Promise<void>` - Delete a template
- `addComponent(templateId: string, component: ComponentData): Promise<void>` - Add a component
- `updateComponent(templateId: string, componentId: string, updates: Partial<ComponentData>): Promise<void>` - Update a component
- `removeComponent(templateId: string, componentId: string): Promise<void>` - Remove a component
- `reorderComponent(templateId: string, componentId: string, newIndex: number): Promise<void>` - Reorder a component
- `duplicateComponent(templateId: string, componentId: string): Promise<ComponentData>` - Duplicate a component
- `exportTemplate(templateId: string, format: 'html' | 'json', options?: ExportOptions): Promise<string>` - Export a template

### CommandManager Methods

- `execute(command: Command): Promise<CommandResult>` - Execute a command
- `undo(): Promise<CommandResult>` - Undo the last command
- `redo(): Promise<CommandResult>` - Redo the last undone command
- `canUndo(): boolean` - Check if undo is available
- `canRedo(): boolean` - Check if redo is available
- `getHistory(): Command[]` - Get command history
- `clearHistory(): void` - Clear command history

### ComponentRegistry Methods

- `registerComponent(definition: ComponentDefinition): void` - Register a component
- `unregisterComponent(type: string): void` - Unregister a component
- `getComponent(type: string): ComponentDefinition` - Get a component definition
- `hasComponent(type: string): boolean` - Check if component exists
- `getAllComponents(): ComponentDefinition[]` - Get all components
- `getComponentsByCategory(category: string): ComponentDefinition[]` - Filter by category
- `getComponentsByTarget(target: 'email' | 'web'): ComponentDefinition[]` - Filter by target
- `searchComponents(query: string): ComponentDefinition[]` - Search components

## TypeScript Support

This package is written in TypeScript and includes full type definitions:

```typescript
import type {
  Builder,
  BuilderConfig,
  Template,
  ComponentData,
  Command,
  CommandResult,
  BuilderEvent,
  ComponentDefinition
} from '@email-builder/core';
```

## Testing

The core package includes comprehensive tests (325 passing tests with 100% coverage):

```bash
cd packages/core
npm test
```

## Examples

See the [dev app](../../apps/dev) for a complete working example of the builder in action.

## Related Packages

- [@email-builder/ui-solid](../ui-solid) - Solid JS UI components
- [@email-builder/ui-components](../ui-components) - Vanilla JS UI components
- [@email-builder/tokens](../tokens) - Design tokens

## License

MIT
