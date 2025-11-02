# Email Builder Architecture - Complete Summary

## Quick Navigation

### Core Package Structure
```
packages/core/
├── builder/
│   ├── Builder.ts                    # Main orchestrator (line 53-385)
│   └── index.ts                      # Exports
├── components/
│   ├── ComponentRegistry.ts          # Registry with preset support (line 52-435)
│   ├── definitions/
│   │   ├── base-components.definitions.ts    # Component definitions
│   │   ├── email-components.definitions.ts   # Email components
│   │   └── registry-init.ts                  # Initialization
│   └── factories/
│       ├── base-components.factories.ts
│       └── email-components.factories.ts
├── commands/
│   ├── CommandManager.ts             # Command execution & undo/redo
│   ├── TemplateAddComponentCommand.ts
│   ├── TemplateUpdateComponentCommand.ts
│   └── ... (10+ more commands)
├── template/
│   ├── TemplateManager.ts            # Template CRUD operations
│   ├── TemplateStorage.ts            # Persistence layer
│   ├── TemplateValidator.ts
│   ├── ComponentTreeBuilder.ts
│   └── TemplateComposer.ts
├── services/
│   ├── EventEmitter.ts               # Event system (pub/sub)
│   └── LocalStorageAdapter.ts        # Storage abstraction
├── types/
│   ├── component.types.ts            # BaseComponent, ComponentPreset (line 1-377)
│   ├── template.types.ts             # Template, TemplateMetadata
│   ├── config.types.ts               # BuilderConfig, StorageAdapter
│   ├── command.types.ts
│   └── event.types.ts
└── constants/
    └── index.ts
```

### UI Package Structure
```
packages/ui-solid/src/
├── sidebar/
│   ├── ComponentPalette.tsx          # Component library UI (line 1-156)
│   ├── PropertyPanel.tsx             # Property editor (line 1-797)
│   ├── PropertyPanel.types.ts        # Property definitions (line 1-96)
│   ├── CanvasSettings.tsx            # Canvas settings UI
│   └── CanvasSettings.types.ts
├── canvas/
│   ├── TemplateCanvas.tsx            # Main canvas component (line 1-100+)
│   ├── ComponentRenderer.tsx         # Component rendering
│   └── index.ts
└── toolbar/
    ├── TemplateToolbar.tsx
    └── TemplateToolbar.types.ts
```

### App Structure
```
apps/dev/src/
├── pages/
│   ├── Builder.tsx                   # Main builder page (line 1-120+)
│   └── Styleguide.tsx
├── context/
│   └── BuilderContext.tsx            # Global state & actions (line 1-150+)
└── components/
    └── modals/
        ├── NewTemplateModal.tsx
        └── TemplatePickerModal.tsx
```

## Key Types and Interfaces

### Component Types
**File:** `/packages/core/types/component.types.ts`

```typescript
// Main component structure
interface BaseComponent {
  id: string
  type: ComponentType | string
  metadata: ComponentMetadata
  styles: BaseStyles
  content: Record<string, unknown>
  children?: BaseComponent[]
  parentId?: string
  visibility?: ResponsiveVisibility
  createdAt: number
  updatedAt: number
  version: string
}

// Component registration
interface ComponentDefinition {
  type: ComponentType | string
  metadata: ComponentMetadata
  defaultContent: Record<string, unknown>
  defaultStyles: BaseStyles
  contentSchema?: Record<string, unknown>
  presets?: ComponentPreset[]  // ← Preset support already in definition
  create: () => BaseComponent
  validate?: (component: BaseComponent) => ValidationResult
  render?: (component: BaseComponent) => string
}

// Style presets
interface ComponentPreset {
  id: string
  name: string
  description?: string
  thumbnail?: string
  styles: BaseStyles
  isCustom?: boolean
  createdAt?: number
}

// Common styles for all components
interface BaseStyles {
  backgroundColor?: string
  backgroundImage?: string
  border?: Border
  padding?: Spacing
  margin?: Spacing
  width?: CSSValue
  height?: CSSValue
  horizontalAlign?: HorizontalAlign
  verticalAlign?: VerticalAlign
  customClasses?: string[]
  customStyles?: Record<string, string>
}
```

### Template Types
**File:** `/packages/core/types/template.types.ts`

```typescript
interface Template {
  metadata: TemplateMetadata
  settings: TemplateSettings
  generalStyles: GeneralStyles
  components: BaseComponent[]
}

interface TemplateMetadata {
  id: string
  name: string
  description?: string
  author?: string
  category?: string
  tags?: string[]
  version: string
  createdAt: number
  updatedAt: number
}
```

### Configuration Types
**File:** `/packages/core/types/config.types.ts`

```typescript
interface StorageAdapter {
  get<T>(key: string): Promise<T | null>
  set<T>(key: string, value: T): Promise<void>
  remove(key: string): Promise<void>
  clear(): Promise<void>
}

interface BuilderConfig {
  target: 'email' | 'web' | 'hybrid'
  locale?: string
  storage: StorageConfig
  features?: FeatureFlags
  callbacks?: BuilderCallbacks
  debug?: boolean
}
```

## Key Classes and Their Methods

### Builder
**File:** `/packages/core/builder/Builder.ts` (lines 53-385)

Main orchestrator class that coordinates all services:

```typescript
class Builder {
  constructor(config: BuilderConfig)
  
  async initialize(): Promise<void>
  async executeCommand<TPayload, TResult>(
    command: Command<TPayload>
  ): Promise<CommandResult<TResult>>
  
  async undo(): Promise<boolean>
  async redo(): Promise<boolean>
  
  on<TData>(event: string, listener: (data: TData) => void): EventSubscription
  once<TData>(event: string, listener: (data: TData) => void): EventSubscription
  
  getState(): Readonly<Record<string, unknown>>
  getConfig(): Readonly<NormalizedConfig>
  isInitialized(): boolean
  
  getComponentRegistry(): ComponentRegistry
  getTemplateManager(): TemplateManager
  
  async createTemplate(options: CreateTemplateOptions): Promise<Template>
  async loadTemplate(templateId: string): Promise<Template>
  async saveTemplate(template: Template): Promise<void>
  async deleteTemplate(templateId: string): Promise<void>
  async listTemplates(): Promise<TemplateListItem[]>
  
  getCurrentTemplate(): Template | null
  destroy(): void
}
```

### ComponentRegistry
**File:** `/packages/core/components/ComponentRegistry.ts` (lines 52-435)

Manages component definitions and presets:

```typescript
class ComponentRegistry {
  register(definition: ComponentDefinition): void
  registerMany(definitions: ComponentDefinition[]): void
  unregister(type: ComponentType | string): boolean
  
  get(type: ComponentType | string): ComponentDefinition | undefined
  has(type: ComponentType | string): boolean
  getTypes(): string[]
  getAll(): ComponentDefinition[]
  getByCategory(category: ComponentCategory): ComponentDefinition[]
  filter(filter: ComponentFilter): ComponentDefinition[]
  
  create(type: ComponentType | string): BaseComponent
  createWithPreset(type: ComponentType | string, presetId: string): BaseComponent
  validate(component: BaseComponent): ValidationResult
  
  // Preset management
  getPresets(type: ComponentType | string): ComponentPreset[]
  getPreset(type: ComponentType | string, presetId: string): ComponentPreset | undefined
  addPreset(type: ComponentType | string, preset: ComponentPreset): void
  removePreset(type: ComponentType | string, presetId: string): boolean
  updatePreset(
    type: ComponentType | string,
    presetId: string,
    updates: Partial<ComponentPreset>
  ): void
  
  on<T>(event: RegistryEvent | string, listener: (data: T) => void)
  off(event?: string)
}

enum RegistryEvent {
  COMPONENT_REGISTERED = 'component:registered'
  COMPONENT_UNREGISTERED = 'component:unregistered'
  PRESET_ADDED = 'preset:added'
  PRESET_REMOVED = 'preset:removed'
}
```

### TemplateManager
**File:** `/packages/core/template/TemplateManager.ts`

Manages template operations and composition:

```typescript
class TemplateManager {
  constructor(storage: TemplateStorage, registry: ComponentRegistry)
  
  async create(options: CreateTemplateOptions): Promise<Template>
  async load(templateId: string): Promise<Template>
  async update(templateId: string, updates: UpdateTemplateOptions): Promise<void>
  async delete(templateId: string): Promise<void>
  async list(): Promise<TemplateListItem[]>
  
  getCurrentTemplate(): Template | null
  
  on<T>(event: TemplateManagerEvent | string, listener: (data: T) => void)
}
```

### CommandManager
**File:** `/packages/core/commands/CommandManager.ts`

Executes commands with undo/redo support:

```typescript
class CommandManager {
  async execute<TPayload, TResult>(
    command: Command<TPayload>
  ): Promise<CommandResult<TResult>>
  
  async undo(): Promise<boolean>
  async redo(): Promise<boolean>
  
  canUndo(): boolean
  canRedo(): boolean
  
  clearHistory(): void
}
```

## UI Components

### ComponentPalette
**File:** `/packages/ui-solid/src/sidebar/ComponentPalette.tsx` (lines 1-156)

Displays available components for drag-and-drop:

```typescript
interface ComponentPaletteProps {
  components: ComponentDefinition[]
  onComponentDragStart?: (definition: ComponentDefinition, event: DragEvent) => void
}

// Features:
// - Search by name, description, tags
// - Filter by category
// - Drag-and-drop to add components
```

### PropertyPanel
**File:** `/packages/ui-solid/src/sidebar/PropertyPanel.tsx` (lines 1-797)

Edits selected component properties:

```typescript
interface PropertyPanelProps {
  selectedComponent: BaseComponent | null
  onPropertyChange: (componentId: string, property: string, value: any) => void
  onDelete?: (componentId: string) => void
  class?: string
}

// Hard-coded PROPERTY_DEFINITIONS constant (lines 12-508)
// Maps component types to their editable properties
// Supports: text, textarea, number, color, select, radio, url
```

### TemplateCanvas
**File:** `/packages/ui-solid/src/canvas/TemplateCanvas.tsx` (lines 1-100+)

Main editing canvas where components are rendered and selected:

```typescript
interface TemplateCanvasProps {
  template: Template | null
  selectedComponentId: string | null
  onComponentSelect?: (id: string | null) => void
  onComponentAdd?: (component: BaseComponent, index?: number) => void
  onDrop?: (event: DragEvent) => void
  onComponentReorder?: (componentId: string, newIndex: number) => void
}

// Features:
// - Drag and drop components
// - Select components to edit
// - Reorder components
```

### CanvasSettings
**File:** `/packages/ui-solid/src/sidebar/CanvasSettings.tsx`

Edits canvas-level settings like dimensions and background color.

## Storage Architecture

### LocalStorageAdapter
**File:** `/packages/core/services/LocalStorageAdapter.ts`

```typescript
class LocalStorageAdapter implements StorageAdapter {
  async get<T>(key: string): Promise<T | null>
  async set<T>(key: string, value: T): Promise<void>
  async remove(key: string): Promise<void>
  async clear(): Promise<void>
}
```

### TemplateStorage
**File:** `/packages/core/template/TemplateStorage.ts`

Uses StorageAdapter to persist templates:

```typescript
class TemplateStorage {
  async get(id: string): Promise<Template | null>
  async save(template: Template): Promise<void>
  async delete(id: string): Promise<void>
  async list(): Promise<TemplateMetadata[]>
}

// Key format: "{keyPrefix}:template:{id}"
// Stores complete Template objects with JSON serialization
```

## State Management

### BuilderContext
**File:** `/apps/dev/src/context/BuilderContext.tsx` (lines 1-150+)

Global state using Solid.js createStore:

```typescript
interface BuilderState {
  template: Template | null
  selectedComponentId: string | null
  draggedComponent: BaseComponent | null
  canUndo: boolean
  canRedo: boolean
  isInitialized: boolean
}

interface BuilderContextValue {
  builder: Builder
  state: BuilderState
  componentDefinitions: ComponentDefinition[]
  actions: {
    setTemplate: (template: Template | null) => void
    selectComponent: (id: string | null) => void
    addComponent: (component: BaseComponent) => Promise<void>
    updateComponentProperty: (componentId: string, propertyPath: string, value: any) => Promise<void>
    updateCanvasSetting: (settingPath: string, value: any) => void
    deleteComponent: (componentId: string) => Promise<void>
    duplicateComponent: (componentId: string) => Promise<void>
    reorderComponent: (componentId: string, newIndex: number) => Promise<void>
    undo: () => Promise<void>
    redo: () => Promise<void>
    createTemplate: (name: string, type?: 'email' | 'web') => Promise<void>
    saveTemplate: () => Promise<void>
    loadTemplate: (id: string) => Promise<void>
    exportTemplate: (format: 'html' | 'json') => Promise<void>
  }
}
```

## Event System

### EventEmitter
**File:** `/packages/core/services/EventEmitter.ts`

Simple pub/sub event system:

```typescript
class EventEmitter {
  on<T>(event: string, listener: (data: T) => void): EventSubscription
  once<T>(event: string, listener: (data: T) => void): EventSubscription
  off(event?: string): void
  emit<T>(event: string, data: T): void
}
```

### Key Events

**RegistryEvent** (ComponentRegistry events):
```typescript
COMPONENT_REGISTERED = 'component:registered'
COMPONENT_UNREGISTERED = 'component:unregistered'
PRESET_ADDED = 'preset:added'
PRESET_REMOVED = 'preset:removed'
```

**BuilderEvent** (Builder events):
```typescript
INITIALIZED = 'builder:initialized'
ERROR = 'builder:error'
STATE_CHANGED = 'builder:state:changed'
```

## Data Flow Patterns

### Property Editing
```
PropertyPanel input change
  ↓
handlePropertyChange(componentId, propertyPath, value)
  ↓
setNestedValue(component, propertyPath, value) [dot notation]
  ↓
BuilderContext.updateComponentProperty()
  ↓
TemplateUpdateComponentCommand created & executed
  ↓
CommandManager.execute()
  ↓
Template state updated
  ↓
UI re-renders with new component properties
```

### Component Creation with Preset
```
User drags component from palette
  ↓
ComponentPalette.handleDragStart() → drag data: {type, category}
  ↓
TemplateCanvas.handleDrop()
  ↓
ComponentDefinition lookup
  ↓
ComponentRegistry.create(type) OR
ComponentRegistry.createWithPreset(type, presetId)
  ↓
BuilderContext.addComponent(instance)
  ↓
TemplateAddComponentCommand
  ↓
Template.components array updated
  ↓
Canvas re-renders
```

### Template Persistence
```
BuilderContext.saveTemplate()
  ↓
TemplateManager.update(id, updates)
  ↓
TemplateStorage.save(template)
  ↓
StorageAdapter.set(key, serializedTemplate)
  ↓
LocalStorageAdapter.set() → localStorage.setItem()
  ↓
onSaveTemplate callback
```

## Critical Implementation Details

### Dot Notation Property Access
**File:** `/packages/ui-solid/src/sidebar/PropertyPanel.tsx` (lines 513-528)

```typescript
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

function setNestedValue(obj: any, path: string, value: any): void {
  const keys = path.split('.')
  const lastKey = keys.pop()!
  const target = keys.reduce((current, key) => {
    if (!current[key]) current[key] = {}
    return current[key]
  }, obj)
  target[lastKey] = value
}
```

Used to access nested properties like `styles.backgroundColor` directly.

### Component Property Definitions
**File:** `/packages/ui-solid/src/sidebar/PropertyPanel.tsx` (lines 12-508)

Hard-coded mapping of component types to editable properties:

```typescript
const PROPERTY_DEFINITIONS: ComponentPropertyMap = {
  button: [
    { key: 'content.text', label: 'Button Text', type: 'text', section: 'content' },
    { key: 'styles.backgroundColor', label: 'Background Color', type: 'color', section: 'styles' },
    // ... 5+ more properties
  ],
  text: [ /* ... */ ],
  // ... more components (10+ total)
}
```

### Command Pattern for Undo/Redo
All state changes go through Command objects:

```typescript
const command = new TemplateUpdateComponentCommand(
  { componentId, propertyPath, value },
  () => state.template,
  (updated) => setState('template', updated)
)
await builder.executeCommand(command)
```

This enables:
- Automatic undo/redo
- Command history
- Reversible operations

## Summary of Key Patterns

1. **Service Orchestration**: Builder coordinates ComponentRegistry, TemplateManager, CommandManager
2. **Event-Driven**: EventEmitter for loose coupling between services
3. **Command Pattern**: All state changes through commands for undo/redo
4. **Storage Abstraction**: StorageAdapter allows different persistence implementations
5. **Type Safety**: Comprehensive TypeScript types throughout
6. **Reactive State**: Solid.js createStore for fine-grained reactivity
7. **Dot Notation Property Access**: Enables flexible nested property editing

## What Needs to Be Added for Complete Preset System

1. **PresetManager Service** - Persistent preset management with CRUD operations
2. **PresetStorage** - Similar to TemplateStorage but for presets
3. **Preset UI Components** - Selector, preview, manager components
4. **Integration** - PropertyPanel, ComponentPalette, CanvasSettings updates
5. **Import/Export** - JSON-based preset sharing
6. **Preset Commands** - Commands for preset operations (undo/redo support)

All of these would follow existing patterns and integrate naturally into the architecture.

