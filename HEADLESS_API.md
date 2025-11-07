# Headless API Documentation

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Core Concepts](#core-concepts)
4. [API Reference](#api-reference)
   - [Builder](#builder)
   - [TemplateManager](#templatemanager)
   - [ComponentRegistry](#componentregistry)
   - [CommandManager](#commandmanager)
   - [EventEmitter](#eventemitter)
   - [TemplateExporter](#templateexporter)
   - [EmailExportService](#emailexportservice)
5. [Event System](#event-system)
6. [Command Pattern](#command-pattern)
7. [Storage Adapters](#storage-adapters)
8. [TypeScript Types](#typescript-types)
9. [Examples](#examples)
10. [Troubleshooting](#troubleshooting)

---

## Overview

The Email Builder Headless API provides a programmatic interface for building, managing, and exporting email templates without requiring a UI. This enables:

- **Server-side email generation** in Node.js environments
- **Batch template processing** for multiple templates
- **REST/GraphQL API endpoints** for template management
- **CLI tools** for email building and automation
- **Template migration scripts** for data transformation
- **Automated testing workflows** for template validation

### Key Features

- ✅ **UI-Independent**: Works in Node.js and browser environments
- ✅ **Event-Driven**: Subscribe to all builder operations
- ✅ **Undo/Redo**: Full command pattern with history
- ✅ **Type-Safe**: Complete TypeScript definitions
- ✅ **Storage Agnostic**: Use localStorage, custom APIs, or any storage
- ✅ **Email-Optimized**: Built-in email client compatibility

---

## Getting Started

### Installation

```bash
npm install @email-builder/core
```

### Basic Usage

```typescript
import { Builder } from '@email-builder/core';

// 1. Create and initialize the builder
const builder = new Builder({
  target: 'email',
  storage: {
    method: 'local',
    keyPrefix: 'my-app'
  }
});

await builder.initialize();

// 2. Create a new template
const template = await builder.createTemplate({
  name: 'Welcome Email',
  description: 'Welcome email for new users',
  settings: {
    target: 'email',
    locale: 'en-US',
    canvasDimensions: { width: 600 }
  }
});

// 3. Add components programmatically
const registry = builder.getComponentRegistry();
const textComponent = registry.create('text');
textComponent.content.text = 'Hello, World!';

// 4. Update the template
const templateManager = builder.getTemplateManager();
await templateManager.update(template.metadata.id, {
  components: [textComponent]
});

// 5. Export to HTML
const exporter = new TemplateExporter();
const result = exporter.export(template, {
  format: 'html',
  inlineStyles: true,
  prettyPrint: true
});

console.log(result.html);
```

---

## Core Concepts

### Builder Architecture

The Email Builder uses a modular architecture:

```
Builder (Main Entry Point)
  ├── TemplateManager (Template CRUD)
  ├── ComponentRegistry (Component Management)
  ├── CommandManager (Undo/Redo)
  ├── EventEmitter (Event System)
  ├── PresetManager (Style Presets)
  ├── CompatibilityService (Email Client Compatibility)
  └── StorageAdapter (Data Persistence)
```

### Component Structure

Every component has:
- **id**: Unique identifier
- **type**: Component type (button, text, image, etc.)
- **content**: Component-specific data
- **styles**: Visual styling properties
- **metadata**: Component metadata (name, description, category)

### Template Structure

Templates contain:
- **metadata**: Name, description, version, timestamps
- **settings**: Canvas dimensions, locale, target
- **generalStyles**: Global styling defaults
- **components**: Array of component instances
- **componentTree**: Hierarchical component structure

---

## API Reference

### Builder

The main entry point for all headless operations.

#### Constructor

```typescript
constructor(config: BuilderConfig)
```

**Parameters:**

- `config.target`: `'email' | 'web' | 'hybrid'` - Output target
- `config.storage`: Storage configuration
  - `method`: `'local' | 'api' | 'custom'`
  - `keyPrefix`: Storage key prefix (default: 'email-builder')
  - `adapter`: Custom storage adapter (for method='custom')
  - `apiEndpoint`: API endpoint URL (for method='api')
- `config.locale`: UI locale (default: 'en-US')
- `config.features`: Feature flags
  - `customComponents`: Enable custom components (default: true)
  - `dataInjection`: Enable data injection (default: true)
  - `templateVersioning`: Enable versioning (default: false)
  - `undoRedo`: Enable undo/redo (default: true)
  - `autoSave`: Enable auto-save (default: false)
- `config.callbacks`: Event callbacks
  - `onSaveTemplate`: Called when template is saved
  - `onError`: Called on errors
  - `onStateChange`: Called on state changes
- `config.debug`: Enable debug logging (default: false)
- `config.initialTemplate`: Initial template to load

**Example:**

```typescript
const builder = new Builder({
  target: 'email',
  storage: {
    method: 'local',
    keyPrefix: 'my-app-emails'
  },
  features: {
    undoRedo: true,
    autoSave: false
  },
  callbacks: {
    onSaveTemplate: (template) => {
      console.log(`Saved: ${template.metadata.name}`);
    },
    onError: (error) => {
      console.error('Builder error:', error);
    }
  },
  debug: true
});
```

#### Methods

##### initialize()

Initialize the builder. Must be called before any other operations.

```typescript
async initialize(): Promise<void>
```

**Example:**

```typescript
await builder.initialize();
console.log('Builder initialized:', builder.isInitialized());
```

---

##### createTemplate()

Create a new template.

```typescript
async createTemplate(options: CreateTemplateOptions): Promise<Template>
```

**Parameters:**

```typescript
interface CreateTemplateOptions {
  name: string;
  description?: string;
  author?: string;
  category?: string;
  tags?: string[];
  settings: TemplateSettings;
  generalStyles?: GeneralStyles;
  components?: BaseComponent[];
}
```

**Example:**

```typescript
const template = await builder.createTemplate({
  name: 'Product Launch',
  description: 'Email template for product launches',
  author: 'marketing@company.com',
  category: 'marketing',
  tags: ['product', 'announcement'],
  settings: {
    target: 'email',
    locale: 'en-US',
    canvasDimensions: { width: 600, maxWidth: 600 }
  },
  generalStyles: {
    canvasBackgroundColor: '#f5f5f5',
    typography: {
      bodyText: {
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        color: '#333333'
      }
    }
  }
});

console.log(`Created template: ${template.metadata.id}`);
```

---

##### loadTemplate()

Load an existing template from storage.

```typescript
async loadTemplate(templateId: string): Promise<Template>
```

**Example:**

```typescript
const template = await builder.loadTemplate('tpl_1699564321_abc123');
console.log(`Loaded: ${template.metadata.name}`);
```

---

##### saveTemplate()

Save the current template.

```typescript
async saveTemplate(template: Template): Promise<void>
```

**Example:**

```typescript
// Modify template
template.metadata.name = 'Updated Name';
template.components.push(newComponent);

// Save changes
await builder.saveTemplate(template);
```

---

##### deleteTemplate()

Delete a template from storage.

```typescript
async deleteTemplate(templateId: string): Promise<void>
```

**Example:**

```typescript
await builder.deleteTemplate('tpl_1699564321_abc123');
console.log('Template deleted');
```

---

##### listTemplates()

List all templates.

```typescript
async listTemplates(): Promise<TemplateListItem[]>
```

**Returns:** Array of template metadata (id, name, description, timestamps)

**Example:**

```typescript
const templates = await builder.listTemplates();
templates.forEach(t => {
  console.log(`${t.name} (${t.id}) - Updated: ${new Date(t.updatedAt)}`);
});
```

---

##### getCurrentTemplate()

Get the currently loaded template.

```typescript
getCurrentTemplate(): Template | null
```

**Example:**

```typescript
const current = builder.getCurrentTemplate();
if (current) {
  console.log(`Current template: ${current.metadata.name}`);
}
```

---

##### executeCommand()

Execute a command with undo/redo support.

```typescript
async executeCommand<TPayload, TResult>(
  command: Command<TPayload>
): Promise<CommandResult<TResult>>
```

**Example:**

```typescript
import { TemplateAddComponentCommand } from '@email-builder/core';

const command = new TemplateAddComponentCommand(
  templateManager,
  template.metadata.id,
  newComponent
);

const result = await builder.executeCommand(command);
if (result.success) {
  console.log('Component added successfully');
}
```

---

##### undo() / redo()

Undo or redo the last command.

```typescript
async undo(): Promise<boolean>
async redo(): Promise<boolean>
```

**Example:**

```typescript
// Undo last action
if (builder.canUndo()) {
  await builder.undo();
  console.log('Undone');
}

// Redo
if (builder.canRedo()) {
  await builder.redo();
  console.log('Redone');
}
```

---

##### on() / once()

Subscribe to builder events.

```typescript
on<TData>(event: string, listener: (data: TData) => void): EventSubscription
once<TData>(event: string, listener: (data: TData) => void): EventSubscription
```

**Example:**

```typescript
// Subscribe to all template creations
const subscription = builder.on('template:created', (data) => {
  console.log('New template created:', data.template.metadata.name);
});

// Unsubscribe later
subscription.unsubscribe();

// Subscribe once
builder.once('builder:initialized', (data) => {
  console.log('Builder initialized with config:', data.config);
});
```

---

##### getTemplateManager()

Get the template manager instance.

```typescript
getTemplateManager(): TemplateManager
```

**Example:**

```typescript
const templateManager = builder.getTemplateManager();
const templates = await templateManager.search({
  category: 'marketing',
  tags: ['product']
});
```

---

##### getComponentRegistry()

Get the component registry instance.

```typescript
getComponentRegistry(): ComponentRegistry
```

**Example:**

```typescript
const registry = builder.getComponentRegistry();
const buttonComponent = registry.create('button');
```

---

##### getPresetManager()

Get the preset manager instance.

```typescript
getPresetManager(): PresetManager
```

**Example:**

```typescript
const presetManager = builder.getPresetManager();
const presets = presetManager.listPresets('button');
console.log(`Found ${presets.length} button presets`);
```

---

##### getCompatibilityService()

Get the compatibility service for email client checks.

```typescript
getCompatibilityService(): CompatibilityService
```

**Example:**

```typescript
const compatibility = builder.getCompatibilityService();
const stats = compatibility.getPropertyStatistics('border-radius');
console.log(`border-radius support: ${stats.supportScore}%`);
```

---

##### checkCompatibility()

Check template for email compatibility issues.

```typescript
checkCompatibility(): CompatibilityReport
```

**Returns:** Detailed report with issues grouped by severity

**Example:**

```typescript
const report = builder.checkCompatibility();

console.log(`Overall score: ${report.overallScore}/100`);
console.log(`Critical issues: ${report.issues.critical.length}`);
console.log(`Safe to export: ${report.safeToExport}`);

if (!report.safeToExport) {
  report.issues.critical.forEach(issue => {
    console.log(`❌ ${issue.message}`);
    console.log(`   Fix: ${issue.suggestedFix}`);
  });
}
```

---

##### destroy()

Clean up resources and destroy the builder.

```typescript
destroy(): void
```

**Example:**

```typescript
// When done
builder.destroy();
```

---

### TemplateManager

Manages template lifecycle (CRUD operations, validation, duplication).

#### Methods

##### create()

Create a new template.

```typescript
async create(options: CreateTemplateOptions): Promise<Template>
```

##### load()

Load a template from storage.

```typescript
async load(templateId: string): Promise<Template>
```

##### update()

Update an existing template.

```typescript
async update(
  templateId: string,
  options: UpdateTemplateOptions
): Promise<Template>
```

**Parameters:**

```typescript
interface UpdateTemplateOptions {
  metadata?: Partial<Omit<TemplateMetadata, 'id' | 'createdAt'>>;
  settings?: Partial<TemplateSettings>;
  generalStyles?: Partial<GeneralStyles>;
  components?: BaseComponent[];
}
```

**Example:**

```typescript
const templateManager = builder.getTemplateManager();

// Update template metadata and components
await templateManager.update('tpl_123', {
  metadata: {
    name: 'New Name',
    description: 'Updated description',
    tags: ['new', 'tags']
  },
  components: updatedComponents
});
```

---

##### delete()

Delete a template.

```typescript
async delete(templateId: string): Promise<void>
```

---

##### list()

List all templates.

```typescript
async list(): Promise<TemplateListItem[]>
```

---

##### search()

Search templates with filters.

```typescript
async search(criteria: {
  tags?: string[];
  category?: string;
  target?: string;
  searchTerm?: string;
}): Promise<TemplateListItem[]>
```

**Example:**

```typescript
// Find all marketing emails with "welcome" in name
const results = await templateManager.search({
  category: 'marketing',
  tags: ['welcome'],
  target: 'email',
  searchTerm: 'welcome'
});
```

---

##### validate()

Validate a template.

```typescript
validate(template: Template): TemplateValidationResult
```

**Returns:**

```typescript
interface TemplateValidationResult {
  valid: boolean;
  errors?: Array<{
    field: string;
    message: string;
    severity: 'error' | 'warning';
  }>;
}
```

**Example:**

```typescript
const validation = templateManager.validate(template);

if (!validation.valid) {
  console.log('Validation errors:');
  validation.errors?.forEach(err => {
    console.log(`  [${err.severity}] ${err.field}: ${err.message}`);
  });
}
```

---

##### duplicate()

Duplicate an existing template.

```typescript
async duplicate(templateId: string, newName?: string): Promise<Template>
```

**Example:**

```typescript
const duplicated = await templateManager.duplicate(
  'tpl_123',
  'Copy of Original Template'
);
console.log(`Duplicated as: ${duplicated.metadata.id}`);
```

---

##### getCurrentTemplate()

Get the currently loaded template.

```typescript
getCurrentTemplate(): Template | null
```

---

##### on() / off()

Subscribe to template events.

```typescript
on(event: TemplateManagerEvent, callback: (data: unknown) => void): void
off(event: TemplateManagerEvent, callback: (data: unknown) => void): void
```

**Events:**
- `template:created`
- `template:updated`
- `template:deleted`
- `template:loaded`
- `template:validated`

**Example:**

```typescript
templateManager.on('template:updated', (data) => {
  console.log('Template updated:', data.template.metadata.name);
});
```

---

### ComponentRegistry

Manages component definitions, creation, and presets.

#### Methods

##### register()

Register a custom component definition.

```typescript
register(definition: ComponentDefinition): void
```

**Example:**

```typescript
const registry = builder.getComponentRegistry();

registry.register({
  type: 'custom-banner',
  metadata: {
    name: 'Custom Banner',
    description: 'A custom promotional banner',
    category: 'email',
    icon: '🎉',
    tags: ['custom', 'banner']
  },
  create: () => ({
    id: crypto.randomUUID(),
    type: 'custom-banner',
    content: {
      title: 'Special Offer!',
      description: 'Limited time only',
      imageUrl: '',
      ctaText: 'Shop Now',
      ctaUrl: '#'
    },
    styles: {
      backgroundColor: '#ff6b35',
      padding: { top: 20, right: 20, bottom: 20, left: 20 }
    },
    metadata: {
      name: 'Custom Banner',
      category: 'email'
    },
    createdAt: Date.now(),
    updatedAt: Date.now()
  }),
  validate: (component) => {
    const errors = [];
    if (!component.content.title) {
      errors.push('Title is required');
    }
    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined
    };
  }
});
```

---

##### get()

Get a component definition by type.

```typescript
get(type: ComponentType | string): ComponentDefinition | undefined
```

---

##### has()

Check if a component type is registered.

```typescript
has(type: ComponentType | string): boolean
```

---

##### getAll()

Get all registered component definitions.

```typescript
getAll(): ComponentDefinition[]
```

---

##### getByCategory()

Get components by category.

```typescript
getByCategory(category: ComponentCategory): ComponentDefinition[]
```

**Example:**

```typescript
const emailComponents = registry.getByCategory('email');
console.log(`Found ${emailComponents.length} email components`);
```

---

##### filter()

Search and filter components.

```typescript
filter(filter: ComponentFilter): ComponentDefinition[]
```

**Parameters:**

```typescript
interface ComponentFilter {
  category?: ComponentCategory;
  tags?: string[];
  searchTerm?: string;
  customOnly?: boolean;
}
```

**Example:**

```typescript
// Find all custom components with "banner" tag
const banners = registry.filter({
  customOnly: true,
  tags: ['banner']
});

// Search by name
const searchResults = registry.filter({
  searchTerm: 'button'
});
```

---

##### create()

Create a new component instance.

```typescript
create(type: ComponentType | string): BaseComponent
```

**Example:**

```typescript
const button = registry.create('button');
button.content.text = 'Click Me';
button.content.href = 'https://example.com';
button.styles.backgroundColor = '#007bff';
```

---

##### createWithPreset()

Create a component with a preset applied.

```typescript
createWithPreset(type: ComponentType | string, presetId: string): BaseComponent
```

**Example:**

```typescript
const primaryButton = registry.createWithPreset('button', 'primary');
// Button already has primary preset styles applied
```

---

##### validate()

Validate a component.

```typescript
validate(component: BaseComponent): ValidationResult
```

**Returns:**

```typescript
interface ValidationResult {
  valid: boolean;
  errors?: string[];
}
```

---

##### getPresets()

Get all presets for a component type.

```typescript
getPresets(type: ComponentType | string): ComponentPreset[]
```

---

##### addPreset()

Add a preset to a component type.

```typescript
addPreset(type: ComponentType | string, preset: ComponentPreset): void
```

**Example:**

```typescript
registry.addPreset('button', {
  id: 'danger',
  name: 'Danger Button',
  description: 'Red button for destructive actions',
  componentType: 'button',
  styles: {
    backgroundColor: '#dc3545',
    color: '#ffffff',
    border: {
      width: { value: 1, unit: 'px' },
      style: 'solid',
      color: '#dc3545'
    }
  },
  isDefault: false
});
```

---

##### on() / off()

Subscribe to registry events.

```typescript
on<T>(event: RegistryEvent | string, listener: (data: T) => void): EventSubscription
off(event?: string): void
```

**Events:**
- `component:registered`
- `component:unregistered`
- `preset:added`
- `preset:removed`

---

### CommandManager

Manages command execution and undo/redo history.

#### Methods

##### execute()

Execute a command.

```typescript
async execute<TPayload, TResult>(
  command: Command<TPayload>
): Promise<CommandResult<TResult>>
```

---

##### undo()

Undo the last command.

```typescript
async undo(): Promise<boolean>
```

---

##### redo()

Redo the next command.

```typescript
async redo(): Promise<boolean>
```

---

##### canUndo() / canRedo()

Check if undo/redo is available.

```typescript
canUndo(): boolean
canRedo(): boolean
```

---

##### getHistory()

Get command history.

```typescript
getHistory(): ReadonlyArray<CommandHistoryEntry>
```

**Example:**

```typescript
const commandManager = builder.getCommandManager();
const history = commandManager.getHistory();

console.log('Command history:');
history.forEach((entry, index) => {
  console.log(`  ${index + 1}. ${entry.command.type} at ${new Date(entry.timestamp)}`);
});
```

---

##### clearHistory()

Clear command history.

```typescript
clearHistory(): void
```

---

### EventEmitter

Implements pub/sub pattern for builder events.

#### Methods

##### on()

Subscribe to an event.

```typescript
on<TData>(event: string, listener: (data: TData) => void): EventSubscription
```

**Returns:** Subscription object with `unsubscribe()` method

---

##### once()

Subscribe to an event once.

```typescript
once<TData>(event: string, listener: (data: TData) => void): EventSubscription
```

---

##### emit()

Emit an event.

```typescript
emit<TData>(event: string, data?: TData): void
```

---

##### off()

Unsubscribe from events.

```typescript
off(event?: string, listener?: EventListener): void
```

**Example:**

```typescript
// Unsubscribe from all events
eventEmitter.off();

// Unsubscribe from specific event
eventEmitter.off('template:created');

// Unsubscribe specific listener
eventEmitter.off('template:created', myListener);
```

---

##### listenerCount()

Get number of listeners for an event.

```typescript
listenerCount(event: string): number
```

---

### TemplateExporter

Exports templates to HTML and JSON formats.

#### Methods

##### export()

Export a template.

```typescript
export(template: Template, options: TemplateExportOptions): ExportResult
```

**Parameters:**

```typescript
interface TemplateExportOptions {
  format: 'html' | 'json' | 'both';
  inlineStyles?: boolean;
  minify?: boolean;
  prettyPrint?: boolean;
  includeComments?: boolean;
}
```

**Returns:**

```typescript
interface ExportResult {
  html?: string;
  json?: string;
  format: 'html' | 'json' | 'both';
}
```

**Example:**

```typescript
import { TemplateExporter } from '@email-builder/core';

const exporter = new TemplateExporter();

// Export to HTML with inline styles
const htmlResult = exporter.export(template, {
  format: 'html',
  inlineStyles: true,
  prettyPrint: true,
  includeComments: false
});

console.log(htmlResult.html);

// Export to JSON
const jsonResult = exporter.export(template, {
  format: 'json',
  prettyPrint: true
});

console.log(jsonResult.json);

// Export to both formats
const bothResult = exporter.export(template, {
  format: 'both',
  inlineStyles: true,
  prettyPrint: true
});

console.log('HTML:', bothResult.html);
console.log('JSON:', bothResult.json);
```

---

### EmailExportService

Converts builder HTML to email-safe HTML with optimizations for email clients.

#### Methods

##### export()

Export HTML with email optimizations.

```typescript
export(html: string, options?: EmailExportOptions): EmailExportResult
```

**Parameters:**

```typescript
interface EmailExportOptions {
  inlineCSS?: boolean;              // Inline CSS styles (default: true)
  useTableLayout?: boolean;         // Convert to table-based layout (default: true)
  addOutlookFixes?: boolean;        // Add Outlook conditional comments (default: true)
  removeIncompatibleCSS?: boolean;  // Remove email-incompatible CSS (default: true)
  optimizeStructure?: boolean;      // Optimize HTML structure (default: true)
  doctype?: string;                 // Custom DOCTYPE
  charset?: string;                 // Character set (default: 'utf-8')
  clientOptimizations?: {           // Client-specific optimizations
    gmail?: boolean;
    outlook?: boolean;
    ios?: boolean;
    yahoo?: boolean;
  };
  maxWidth?: number;                // Max width in pixels (default: 600)
  minify?: boolean;                 // Minify output (default: false)
}
```

**Returns:**

```typescript
interface EmailExportResult {
  html: string;                     // Email-optimized HTML
  warnings: EmailExportWarning[];   // Warnings about potential issues
  statistics: {
    inlinedRules: number;
    convertedElements: number;
    removedProperties: number;
  };
}
```

**Example:**

```typescript
import { EmailExportService } from '@email-builder/core';

const emailExporter = new EmailExportService();

// Get builder HTML
const builderHTML = exporter.export(template, {
  format: 'html',
  inlineStyles: false
}).html;

// Convert to email-safe HTML
const result = emailExporter.export(builderHTML, {
  inlineCSS: true,
  useTableLayout: true,
  addOutlookFixes: true,
  removeIncompatibleCSS: true,
  clientOptimizations: {
    gmail: true,
    outlook: true,
    ios: true
  },
  maxWidth: 600
});

console.log('Email-optimized HTML:', result.html);
console.log('Warnings:', result.warnings);
console.log('Statistics:', result.statistics);

// Check for warnings
if (result.warnings.length > 0) {
  console.log('⚠️ Warnings:');
  result.warnings.forEach(warning => {
    console.log(`  ${warning.severity}: ${warning.message}`);
  });
}
```

**Features:**

1. **CSS Inlining**: Converts `<style>` tags to inline styles
2. **Table Layout**: Converts div-based layouts to table-based layouts
3. **Outlook Fixes**: Adds MSO conditional comments and fixes
4. **Incompatible CSS Removal**: Removes flexbox, grid, position, animations, etc.
5. **Client Optimizations**: Gmail anti-link styles, iOS fixes, etc.

---

## Event System

The Email Builder uses an event-driven architecture. All major operations emit events that you can subscribe to.

### Builder Events

```typescript
enum BuilderEvent {
  INITIALIZED = 'builder:initialized',
  STATE_CHANGED = 'builder:state-changed',
  ERROR = 'builder:error',
  UNDO = 'builder:undo',
  REDO = 'builder:redo'
}
```

### Template Events

```typescript
enum TemplateManagerEvent {
  TEMPLATE_CREATED = 'template:created',
  TEMPLATE_UPDATED = 'template:updated',
  TEMPLATE_DELETED = 'template:deleted',
  TEMPLATE_LOADED = 'template:loaded',
  TEMPLATE_VALIDATED = 'template:validated'
}
```

### Registry Events

```typescript
enum RegistryEvent {
  COMPONENT_REGISTERED = 'component:registered',
  COMPONENT_UNREGISTERED = 'component:unregistered',
  PRESET_ADDED = 'preset:added',
  PRESET_REMOVED = 'preset:removed'
}
```

### Event Subscription Example

```typescript
// Subscribe to multiple events
const subscriptions = [];

// Builder initialization
subscriptions.push(
  builder.on('builder:initialized', (data) => {
    console.log('✅ Builder ready');
  })
);

// Template operations
const templateManager = builder.getTemplateManager();
subscriptions.push(
  templateManager.on('template:created', (data) => {
    console.log(`📝 Template created: ${data.template.metadata.name}`);
  })
);

subscriptions.push(
  templateManager.on('template:updated', (data) => {
    console.log(`💾 Template updated: ${data.template.metadata.name}`);
  })
);

// Errors
subscriptions.push(
  builder.on('builder:error', (error) => {
    console.error('❌ Error:', error.message);
  })
);

// Cleanup: unsubscribe from all
function cleanup() {
  subscriptions.forEach(sub => sub.unsubscribe());
}
```

---

## Command Pattern

The builder uses the Command Pattern for undo/redo functionality. All state-changing operations should be implemented as commands.

### Available Commands

- `TemplateAddComponentCommand` - Add component to template
- `TemplateRemoveComponentCommand` - Remove component from template
- `TemplateUpdateComponentCommand` - Update component properties
- `TemplateReorderComponentCommand` - Reorder components
- `TemplateDuplicateComponentCommand` - Duplicate a component
- `SaveTemplateCommand` - Save template
- `LoadTemplateCommand` - Load template
- `ExportTemplateCommand` - Export template
- `ApplyPresetCommand` - Apply preset to component
- `CreatePresetCommand` - Create new preset
- `UpdatePresetCommand` - Update preset
- `DeletePresetCommand` - Delete preset

### Creating Custom Commands

```typescript
import { UndoableCommand } from '@email-builder/core';

class CustomCommand implements UndoableCommand {
  type = 'custom:operation';
  canUndo = true;
  payload: any;

  private previousState: any;

  constructor(payload: any) {
    this.payload = payload;
  }

  async execute(): Promise<void> {
    // Save state for undo
    this.previousState = getCurrentState();

    // Perform operation
    performOperation(this.payload);
  }

  async undo(): Promise<void> {
    // Restore previous state
    restoreState(this.previousState);
  }
}

// Use the command
const command = new CustomCommand({ data: 'value' });
await builder.executeCommand(command);

// Can be undone
await builder.undo();
```

---

## Storage Adapters

The builder supports multiple storage backends through adapters.

### LocalStorage Adapter

Built-in adapter for browser localStorage.

```typescript
const builder = new Builder({
  storage: {
    method: 'local',
    keyPrefix: 'my-app'
  }
});
```

### Custom Storage Adapter

Implement the `StorageAdapter` interface for custom storage.

```typescript
import { StorageAdapter } from '@email-builder/core';

class DatabaseAdapter implements StorageAdapter {
  async get(key: string): Promise<string | null> {
    const result = await db.collection('templates').findOne({ key });
    return result ? result.value : null;
  }

  async set(key: string, value: string): Promise<void> {
    await db.collection('templates').updateOne(
      { key },
      { $set: { key, value, updatedAt: new Date() } },
      { upsert: true }
    );
  }

  async delete(key: string): Promise<void> {
    await db.collection('templates').deleteOne({ key });
  }

  async list(): Promise<string[]> {
    const docs = await db.collection('templates').find({}).toArray();
    return docs.map(doc => doc.key);
  }

  async clear(): Promise<void> {
    await db.collection('templates').deleteMany({});
  }
}

// Use custom adapter
const builder = new Builder({
  storage: {
    method: 'custom',
    adapter: new DatabaseAdapter()
  }
});
```

---

## TypeScript Types

### Core Types

```typescript
import type {
  // Builder
  BuilderConfig,
  BuilderCallbacks,
  FeatureFlags,

  // Template
  Template,
  TemplateMetadata,
  TemplateSettings,
  GeneralStyles,
  TemplateListItem,

  // Component
  BaseComponent,
  ComponentDefinition,
  ComponentType,
  ComponentCategory,
  ComponentPreset,
  BaseStyles,

  // Command
  Command,
  CommandResult,
  UndoableCommand,

  // Storage
  StorageAdapter,
  StorageConfig,

  // Events
  EventSubscription,
  EventListener,

  // Export
  TemplateExportOptions,
  ExportResult,
  EmailExportOptions,
  EmailExportResult
} from '@email-builder/core';
```

### Type Examples

```typescript
// Creating type-safe components
const createEmailTemplate = (name: string): Template => {
  const template: Template = {
    metadata: {
      id: crypto.randomUUID(),
      name,
      version: '1.0.0',
      createdAt: Date.now(),
      updatedAt: Date.now()
    },
    settings: {
      target: 'email',
      locale: 'en-US',
      canvasDimensions: { width: 600 }
    },
    generalStyles: {},
    components: [],
    dataInjection: { enabled: false },
    customData: {}
  };

  return template;
};

// Type-safe component creation
const createButton = (): BaseComponent => {
  const button: BaseComponent = {
    id: crypto.randomUUID(),
    type: 'button',
    content: {
      text: 'Click Me',
      href: '#'
    },
    styles: {
      backgroundColor: '#007bff',
      color: '#ffffff',
      padding: {
        top: { value: 10, unit: 'px' },
        right: { value: 20, unit: 'px' },
        bottom: { value: 10, unit: 'px' },
        left: { value: 20, unit: 'px' }
      }
    },
    metadata: {
      name: 'Button',
      category: 'base'
    },
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  return button;
};
```

---

## Examples

See the `/examples` directory for complete, working examples:

1. **Server-side Email Generation** (`examples/01-server-side-generation/`)
   - Node.js script for generating emails
   - Batch processing multiple recipients
   - Email service integration

2. **Batch Template Processing** (`examples/02-batch-processing/`)
   - Process multiple templates at once
   - Bulk export and optimization
   - Progress tracking

3. **REST API Endpoint** (`examples/03-rest-api/`)
   - Express.js API for template management
   - CRUD operations via HTTP
   - Authentication and authorization

4. **CLI Tool** (`examples/04-cli-tool/`)
   - Command-line interface for email building
   - Interactive template creation
   - Export and validation commands

5. **Template Migration Script** (`examples/05-template-migration/`)
   - Migrate templates from old format
   - Data transformation and validation
   - Bulk import/export

---

## Troubleshooting

### Common Issues

#### Builder not initialized

```typescript
// ❌ Wrong
const builder = new Builder(config);
await builder.createTemplate(options); // Error: Builder not initialized

// ✅ Correct
const builder = new Builder(config);
await builder.initialize(); // Initialize first!
await builder.createTemplate(options);
```

#### Storage errors in Node.js

```typescript
// ❌ Wrong - localStorage not available in Node.js
const builder = new Builder({
  storage: { method: 'local' }
});

// ✅ Correct - Use custom adapter
import { MemoryStorageAdapter } from './adapters/MemoryStorageAdapter';

const builder = new Builder({
  storage: {
    method: 'custom',
    adapter: new MemoryStorageAdapter()
  }
});
```

#### TypeScript errors

```typescript
// ❌ Wrong - Missing required fields
const template: Template = {
  metadata: { name: 'Test' } // Error: missing required fields
};

// ✅ Correct - All required fields
const template: Template = {
  metadata: {
    id: crypto.randomUUID(),
    name: 'Test',
    version: '1.0.0',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  settings: {
    target: 'email',
    locale: 'en-US'
  },
  generalStyles: {},
  components: [],
  dataInjection: { enabled: false },
  customData: {}
};
```

#### Email export issues

```typescript
// ❌ Wrong - Builder HTML not email-safe
const result = exporter.export(template, { format: 'html' });
sendEmail(result.html); // May break in email clients

// ✅ Correct - Use EmailExportService
const builderHTML = exporter.export(template, { format: 'html' }).html;
const emailResult = emailExporter.export(builderHTML, {
  inlineCSS: true,
  useTableLayout: true,
  addOutlookFixes: true
});
sendEmail(emailResult.html); // Email-safe!
```

### Debug Mode

Enable debug mode for detailed logging:

```typescript
const builder = new Builder({
  debug: true,
  callbacks: {
    onError: (error) => {
      console.error('Builder error:', error);
      console.trace(); // Stack trace
    }
  }
});
```

### Validation

Always validate templates before export:

```typescript
const templateManager = builder.getTemplateManager();
const validation = templateManager.validate(template);

if (!validation.valid) {
  console.error('Validation errors:', validation.errors);
  throw new Error('Template validation failed');
}

// Check email compatibility
const compatReport = builder.checkCompatibility();
if (!compatReport.safeToExport) {
  console.warn('Compatibility issues found:', compatReport.issues);
}
```

### Memory Management

Clean up resources when done:

```typescript
// Unsubscribe from events
subscription.unsubscribe();

// Clear command history if needed
const commandManager = builder.getCommandManager();
commandManager.clearHistory();

// Destroy builder
builder.destroy();
```

---

## Additional Resources

- **Examples Directory**: `/examples` - Complete working examples
- **API Types**: `packages/core/types/` - Full TypeScript definitions
- **Component Definitions**: `packages/core/components/definitions/` - Built-in components
- **Tests**: `packages/core/**/*.test.ts` - Unit tests with usage examples

---

## Support

For issues, questions, or contributions:

- GitHub Issues: https://github.com/your-org/email-builder/issues
- Documentation: https://docs.email-builder.dev
- Examples: https://github.com/your-org/email-builder/tree/main/examples

---

*Last updated: November 2025*
