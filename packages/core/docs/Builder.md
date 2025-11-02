# Builder Usage Guide

The `Builder` class is the main entry point for the Email Builder core package. It coordinates all functionality including command execution, component management, template operations, and event handling.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Configuration](#configuration)
- [Core Methods](#core-methods)
- [Event System](#event-system)
- [Storage Adapters](#storage-adapters)
- [Advanced Patterns](#advanced-patterns)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)

## Overview

The Builder class provides:

- **Centralized state management** for templates and components
- **Command execution** with undo/redo support
- **Component registry** access for type-safe component operations
- **Template management** for CRUD operations
- **Event system** for reactive updates
- **Storage abstraction** for persistence
- **Type safety** through TypeScript

## Installation

```bash
npm install @email-builder/core
```

```typescript
import { Builder } from '@email-builder/core';
```

## Basic Usage

### Creating and Initializing a Builder

```typescript
import { Builder } from '@email-builder/core';

// Create builder instance
const builder = new Builder({
  target: 'email',
  storage: {
    method: 'local',
    keyPrefix: 'my-app-'
  }
});

// Initialize before use (required)
await builder.initialize();

// Check initialization status
console.log(builder.isInitialized()); // true
```

### Complete Example

```typescript
import { Builder } from '@email-builder/core';

async function main() {
  // 1. Create and initialize builder
  const builder = new Builder({
    target: 'email',
    storage: { method: 'local' },
    debug: true
  });

  await builder.initialize();

  // 2. Create a new template
  const template = await builder.createTemplate({
    name: 'Welcome Email',
    description: 'Welcome new users'
  });

  // 3. Get managers
  const templateManager = builder.getTemplateManager();
  const registry = builder.getComponentRegistry();

  // 4. Add components
  const buttonComponent = registry.getComponent('button');
  await templateManager.addComponent(template.id, {
    type: 'button',
    content: 'Get Started',
    style: buttonComponent.defaultProps.style
  });

  // 5. Save template
  await builder.saveTemplate(template);

  // 6. Export to HTML
  const html = await templateManager.exportTemplate(template.id, 'html');
  console.log(html);
}

main();
```

## Configuration

### BuilderConfig Interface

```typescript
interface BuilderConfig {
  // Required: Target platform
  target: 'email' | 'web' | 'hybrid';

  // Required: Storage configuration
  storage: StorageConfig;

  // Optional: Locale for internationalization
  locale?: string; // Default: 'en-US'

  // Optional: Feature flags
  features?: FeatureFlags;

  // Optional: Event callbacks
  callbacks?: BuilderCallbacks;

  // Optional: Initial template to load
  initialTemplate?: Template;

  // Optional: Enable debug logging
  debug?: boolean; // Default: false
}
```

### Target Options

```typescript
// Email: Limited CSS, email client compatible
const emailBuilder = new Builder({
  target: 'email',
  storage: { method: 'local' }
});

// Web: Full CSS support, modern features
const webBuilder = new Builder({
  target: 'web',
  storage: { method: 'local' }
});

// Hybrid: Both web and email with compatibility warnings
const hybridBuilder = new Builder({
  target: 'hybrid',
  storage: { method: 'local' }
});
```

### Storage Configuration

```typescript
// Local storage (browser localStorage)
const localBuilder = new Builder({
  target: 'email',
  storage: {
    method: 'local',
    keyPrefix: 'my-app-' // Optional prefix
  }
});

// API storage (remote backend)
const apiBuilder = new Builder({
  target: 'email',
  storage: {
    method: 'api',
    apiEndpoint: 'https://api.example.com/templates',
    keyPrefix: 'user-123-'
  }
});

// Custom storage adapter (see Storage Adapters section)
const customBuilder = new Builder({
  target: 'email',
  storage: {
    method: 'custom',
    adapter: new MyCustomAdapter()
  }
});
```

### Feature Flags

```typescript
const builder = new Builder({
  target: 'email',
  storage: { method: 'local' },
  features: {
    undoRedo: true,           // Enable undo/redo (default: true)
    customComponents: true,    // Allow custom components (default: true)
    templateVersioning: false, // Enable version history (default: false)
    dataInjection: true,       // Allow data placeholders (default: true)
    autoSave: false           // Auto-save changes (default: false)
  }
});
```

### Callbacks

```typescript
const builder = new Builder({
  target: 'email',
  storage: { method: 'local' },
  callbacks: {
    onSaveTemplate: async (template) => {
      console.log('Template saved:', template.metadata.name);
      // Sync to backend, analytics, etc.
    },
    onLoadTemplate: async (templateId) => {
      console.log('Template loaded:', templateId);
    },
    onExport: async (html) => {
      console.log('Template exported, size:', html.length);
    },
    onError: (error) => {
      console.error('Builder error:', error);
      // Send to error tracking service
    },
    onStateChange: (state) => {
      console.log('State changed:', state);
    }
  }
});
```

## Core Methods

### Initialization

```typescript
// Initialize builder (required before use)
await builder.initialize();

// Check if initialized
if (builder.isInitialized()) {
  // Ready to use
}
```

### Template Operations

```typescript
// Create new template
const template = await builder.createTemplate({
  name: 'My Template',
  description: 'Template description',
  tags: ['newsletter', 'marketing']
});

// Load existing template
const loadedTemplate = await builder.loadTemplate('template-id');

// Save template
await builder.saveTemplate(template);

// Delete template
await builder.deleteTemplate('template-id');

// List all templates
const templateManager = builder.getTemplateManager();
const templates = await templateManager.listTemplates();
```

### Command Execution

```typescript
import {
  TemplateAddComponentCommand,
  TemplateUpdateComponentCommand
} from '@email-builder/core';

// Execute a command
const addCommand = new TemplateAddComponentCommand({
  templateId: template.id,
  component: {
    type: 'text',
    content: 'Hello World'
  }
});

await builder.executeCommand(addCommand);

// Undo/Redo
if (builder.canUndo()) {
  await builder.undo();
}

if (builder.canRedo()) {
  await builder.redo();
}
```

### Component Registry Access

```typescript
// Get component registry
const registry = builder.getComponentRegistry();

// Get all components
const allComponents = registry.getAllComponents();

// Get component by type
const buttonDef = registry.getComponent('button');

// Filter components
const emailComponents = registry.getComponentsByTarget('email');
const layoutComponents = registry.getComponentsByCategory('layout');

// Search components
const results = registry.searchComponents('text');

// Register custom component
registry.registerComponent({
  type: 'custom-cta',
  name: 'Custom CTA',
  category: 'content',
  targets: ['email', 'web'],
  icon: 'mouse-pointer',
  defaultProps: {
    content: 'Click Here',
    style: {
      backgroundColor: '#007bff',
      color: '#ffffff'
    }
  }
});
```

### Template Manager Access

```typescript
// Get template manager
const templateManager = builder.getTemplateManager();

// Add component to template
await templateManager.addComponent(template.id, {
  type: 'button',
  content: 'Click Me'
});

// Update component
await templateManager.updateComponent(
  template.id,
  componentId,
  { content: 'Updated Text' }
);

// Remove component
await templateManager.removeComponent(template.id, componentId);

// Reorder component
await templateManager.reorderComponent(template.id, componentId, newIndex);

// Duplicate component
const duplicated = await templateManager.duplicateComponent(
  template.id,
  componentId
);

// Export template
const html = await templateManager.exportTemplate(template.id, 'html');
const json = await templateManager.exportTemplate(template.id, 'json');
```

### State and Configuration

```typescript
// Get current state
const state = builder.getState();
console.log(state);

// Get configuration
const config = builder.getConfig();
console.log(config.target, config.locale);
```

## Event System

### Available Events

```typescript
import { BuilderEvent } from '@email-builder/core';

// BuilderEvent enum values:
BuilderEvent.INITIALIZED      // Builder initialized
BuilderEvent.COMMAND_EXECUTED // Command executed
BuilderEvent.COMMAND_UNDONE   // Command undone
BuilderEvent.COMMAND_REDONE   // Command redone
BuilderEvent.TEMPLATE_SAVED   // Template saved
BuilderEvent.TEMPLATE_LOADED  // Template loaded
BuilderEvent.ERROR            // Error occurred
BuilderEvent.UNDO             // Undo performed
BuilderEvent.REDO             // Redo performed
```

### Subscribing to Events

```typescript
// Subscribe to an event
const subscription = builder.on(BuilderEvent.INITIALIZED, (data) => {
  console.log('Builder initialized:', data.config);
});

// Subscribe once (auto-unsubscribes after first call)
builder.once(BuilderEvent.TEMPLATE_SAVED, (template) => {
  console.log('First template saved:', template.metadata.name);
});

// Unsubscribe
subscription.unsubscribe();
```

### Event Examples

```typescript
// Listen for command execution
builder.on(BuilderEvent.COMMAND_EXECUTED, (data) => {
  console.log('Command executed:', data.command.type);
  // Update UI, trigger analytics, etc.
});

// Listen for undo/redo
builder.on(BuilderEvent.UNDO, (data) => {
  console.log('Undid command:', data.command.type);
});

builder.on(BuilderEvent.REDO, (data) => {
  console.log('Redid command:', data.command.type);
});

// Listen for errors
builder.on(BuilderEvent.ERROR, (error) => {
  console.error('Builder error:', error.message);
  // Show error notification to user
});

// Listen for template operations
builder.on(BuilderEvent.TEMPLATE_SAVED, (template) => {
  console.log('Template saved:', template.metadata.name);
});

builder.on(BuilderEvent.TEMPLATE_LOADED, (template) => {
  console.log('Template loaded:', template.metadata.name);
});
```

## Storage Adapters

### Using LocalStorage

```typescript
const builder = new Builder({
  target: 'email',
  storage: {
    method: 'local',
    keyPrefix: 'my-app-'
  }
});
```

### Using API Storage

```typescript
const builder = new Builder({
  target: 'email',
  storage: {
    method: 'api',
    apiEndpoint: 'https://api.example.com/templates',
    keyPrefix: 'user-123-'
  }
});
```

### Custom Storage Adapter

Implement the `StorageAdapter` interface for custom storage:

```typescript
import { StorageAdapter } from '@email-builder/core';

class DatabaseAdapter implements StorageAdapter {
  async get<T>(key: string): Promise<T | null> {
    const result = await db.query(
      'SELECT value FROM storage WHERE key = ?',
      [key]
    );
    return result.length > 0 ? JSON.parse(result[0].value) : null;
  }

  async set<T>(key: string, value: T): Promise<void> {
    await db.query(
      'INSERT INTO storage (key, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = ?',
      [key, JSON.stringify(value), JSON.stringify(value)]
    );
  }

  async remove(key: string): Promise<void> {
    await db.query('DELETE FROM storage WHERE key = ?', [key]);
  }

  async clear(): Promise<void> {
    await db.query('DELETE FROM storage');
  }
}

// Use custom adapter
const builder = new Builder({
  target: 'email',
  storage: {
    method: 'custom',
    adapter: new DatabaseAdapter()
  }
});
```

## Advanced Patterns

### Builder Lifecycle Management

```typescript
class EmailBuilderService {
  private builder: Builder | null = null;

  async initialize(userId: string) {
    this.builder = new Builder({
      target: 'email',
      storage: {
        method: 'local',
        keyPrefix: `user-${userId}-`
      },
      callbacks: {
        onSaveTemplate: async (template) => {
          await this.syncToBackend(template);
        },
        onError: (error) => {
          this.handleError(error);
        }
      }
    });

    await this.builder.initialize();
    return this.builder;
  }

  getBuilder(): Builder {
    if (!this.builder || !this.builder.isInitialized()) {
      throw new Error('Builder not initialized');
    }
    return this.builder;
  }

  async destroy() {
    if (this.builder) {
      this.builder.destroy();
      this.builder = null;
    }
  }

  private async syncToBackend(template: any) {
    // Implement backend sync
  }

  private handleError(error: Error) {
    // Implement error handling
  }
}
```

### Loading Initial Template

```typescript
// Load existing template on initialization
const existingTemplate = await fetchTemplateFromAPI('template-123');

const builder = new Builder({
  target: 'email',
  storage: { method: 'local' },
  initialTemplate: existingTemplate
});

await builder.initialize();

// Template is now loaded and ready
const state = builder.getState();
console.log(state.template); // existingTemplate
```

### Multi-tenant Support

```typescript
class MultiTenantBuilder {
  private builders = new Map<string, Builder>();

  async getBuilderForTenant(tenantId: string): Promise<Builder> {
    if (this.builders.has(tenantId)) {
      return this.builders.get(tenantId)!;
    }

    const builder = new Builder({
      target: 'email',
      storage: {
        method: 'api',
        apiEndpoint: `https://api.example.com/tenants/${tenantId}/templates`,
        keyPrefix: `tenant-${tenantId}-`
      }
    });

    await builder.initialize();
    this.builders.set(tenantId, builder);
    return builder;
  }

  async destroyTenantBuilder(tenantId: string) {
    const builder = this.builders.get(tenantId);
    if (builder) {
      builder.destroy();
      this.builders.delete(tenantId);
    }
  }

  async destroyAll() {
    for (const [tenantId, builder] of this.builders) {
      builder.destroy();
    }
    this.builders.clear();
  }
}
```

### Debug Mode

```typescript
const builder = new Builder({
  target: 'email',
  storage: { method: 'local' },
  debug: true // Enable debug logging
});

// All operations will log to console:
// [Builder] Initialized with config: {...}
// [Builder] Executing command: ADD_COMPONENT {...}
// [Builder] Template saved: template-123
```

## Error Handling

### Try-Catch Pattern

```typescript
try {
  await builder.initialize();
  const template = await builder.createTemplate({
    name: 'My Template'
  });
} catch (error) {
  console.error('Failed to create template:', error);
  // Handle error appropriately
}
```

### Error Event Handler

```typescript
builder.on(BuilderEvent.ERROR, (error) => {
  // Global error handler
  console.error('Builder error:', error);

  // Show user notification
  showNotification({
    type: 'error',
    message: error.message
  });

  // Send to error tracking
  sendToSentry(error);
});
```

### Command Error Handling

```typescript
const result = await builder.executeCommand(command);

if (!result.success) {
  console.error('Command failed:', result.error);
  // Handle command failure
} else {
  console.log('Command succeeded:', result.data);
}
```

## Best Practices

### 1. Always Initialize

```typescript
// Bad: Using builder before initialization
const builder = new Builder(config);
builder.createTemplate({ name: 'Test' }); // Will throw error

// Good: Initialize first
const builder = new Builder(config);
await builder.initialize();
builder.createTemplate({ name: 'Test' }); // Works correctly
```

### 2. Use Event Handlers for Side Effects

```typescript
// Good: Use callbacks for side effects
const builder = new Builder({
  target: 'email',
  storage: { method: 'local' },
  callbacks: {
    onSaveTemplate: async (template) => {
      await analytics.track('template_saved', {
        templateId: template.metadata.id,
        name: template.metadata.name
      });
    }
  }
});
```

### 3. Clean Up Subscriptions

```typescript
// Store subscriptions
const subscriptions: EventSubscription[] = [];

subscriptions.push(
  builder.on(BuilderEvent.TEMPLATE_SAVED, handleSave)
);

subscriptions.push(
  builder.on(BuilderEvent.ERROR, handleError)
);

// Clean up when done
function cleanup() {
  subscriptions.forEach(sub => sub.unsubscribe());
}
```

### 4. Use Type Safety

```typescript
// Good: Type-safe command execution
import type { TemplateAddComponentPayload } from '@email-builder/core';

const payload: TemplateAddComponentPayload = {
  templateId: template.id,
  component: {
    type: 'button',
    content: 'Click Me'
  }
};

await builder.executeCommand(
  new TemplateAddComponentCommand(payload)
);
```

### 5. Check Before Undo/Redo

```typescript
// Good: Check availability first
if (builder.canUndo()) {
  await builder.undo();
}

if (builder.canRedo()) {
  await builder.redo();
}
```

### 6. Use Feature Flags

```typescript
// Good: Configure features based on user tier
const builder = new Builder({
  target: 'email',
  storage: { method: 'local' },
  features: {
    undoRedo: user.tier !== 'free',
    templateVersioning: user.tier === 'enterprise',
    customComponents: user.tier !== 'free'
  }
});
```

### 7. Namespace Storage Keys

```typescript
// Good: Use prefixes to avoid collisions
const builder = new Builder({
  target: 'email',
  storage: {
    method: 'local',
    keyPrefix: `${appName}-${userId}-`
  }
});
```

## API Reference

### Constructor

```typescript
constructor(config: BuilderConfig)
```

### Methods

| Method | Return Type | Description |
|--------|------------|-------------|
| `initialize()` | `Promise<void>` | Initialize the builder |
| `isInitialized()` | `boolean` | Check if initialized |
| `executeCommand(command)` | `Promise<CommandResult>` | Execute a command |
| `undo()` | `Promise<boolean>` | Undo last command |
| `redo()` | `Promise<boolean>` | Redo next command |
| `canUndo()` | `boolean` | Check if undo available |
| `canRedo()` | `boolean` | Check if redo available |
| `on(event, handler)` | `EventSubscription` | Subscribe to event |
| `once(event, handler)` | `EventSubscription` | Subscribe once |
| `getState()` | `Record<string, unknown>` | Get current state |
| `getConfig()` | `BuilderConfig` | Get configuration |
| `getComponentRegistry()` | `ComponentRegistry` | Get component registry |
| `getTemplateManager()` | `TemplateManager` | Get template manager |
| `getCommandManager()` | `CommandManager` | Get command manager |
| `createTemplate(options)` | `Promise<Template>` | Create new template |
| `loadTemplate(id)` | `Promise<Template>` | Load template |
| `saveTemplate(template)` | `Promise<void>` | Save template |
| `deleteTemplate(id)` | `Promise<void>` | Delete template |
| `destroy()` | `void` | Clean up and destroy |

## Related Documentation

- [Command System Guide](./Commands.md) - Detailed command pattern documentation
- [README](../README.md) - Package overview and quick start

## Support

For issues and questions:
- GitHub Issues: https://github.com/rmadeiraneto/email-builder/issues
- Documentation: https://github.com/rmadeiraneto/email-builder
