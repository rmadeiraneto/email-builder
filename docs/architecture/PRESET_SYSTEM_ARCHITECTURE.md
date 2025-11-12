# Email Builder: Component Preset System Deep Dive

## Overview

The email builder has a sophisticated component system with built-in preset support, but the preset layer is incomplete. This document provides a comprehensive view of how everything fits together and what's needed for a complete preset management system.

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                     Application Layer (apps/dev)                │
│  BuilderContext, Builder Page, UI Modals                       │
└─────────────────────────────────────────────────────────────────┘
                            ↓↑
┌─────────────────────────────────────────────────────────────────┐
│                      UI Layer (packages/ui-solid)               │
│  TemplateCanvas, PropertyPanel, ComponentPalette,              │
│  CanvasSettings, TemplateToolbar                               │
└─────────────────────────────────────────────────────────────────┘
                            ↓↑
┌─────────────────────────────────────────────────────────────────┐
│                     Core Service Layer                          │
│                  (packages/core/services)                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Builder (Orchestrator)                                   │  │
│  │  - Coordinates all services                             │  │
│  │  - Manages builder state & lifecycle                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            ↓                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ ComponentRegistry (Component & Preset Management)        │  │
│  │  - Registers component definitions                      │  │
│  │  - Manages presets per component type                   │  │
│  │  - Creates components (with or without presets)         │  │
│  │  - Validates components                                 │  │
│  │  - Event emission                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ TemplateManager (Template Operations)                    │  │
│  │  - CRUD operations for templates                        │  │
│  │  - Template composition                                 │  │
│  │  - Template validation                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ CommandManager (Undo/Redo)                              │  │
│  │  - Command execution                                    │  │
│  │  - Undo/redo history                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ TemplateStorage (Persistence)                           │  │
│  │  - Uses StorageAdapter abstraction                      │  │
│  │  - Manages template serialization                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ EventEmitter (Event System)                             │  │
│  │  - Pub/sub event management                             │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                            ↓↑
┌─────────────────────────────────────────────────────────────────┐
│                    Type/Data Layer                              │
│            (packages/core/types, definitions)                   │
│  BaseComponent, ComponentDefinition, ComponentPreset,          │
│  Template, TemplateMetadata, BaseStyles                        │
└─────────────────────────────────────────────────────────────────┘
                            ↓↑
┌─────────────────────────────────────────────────────────────────┐
│                   Storage/Persistence                           │
│      LocalStorageAdapter (with fallback to memory)             │
└─────────────────────────────────────────────────────────────────┘
```

## Component System

### Component Lifecycle

```
ComponentDefinition (Factory)
    ↓
    create() → BaseComponent instance
    ↓
    apply preset (optional) → merge styles
    ↓
    add to template
    ↓
    edit properties
    ↓
    save template (persists to storage)
```

### Component Properties

Each component has three main areas:

1. **Identity**
   - id: unique identifier (UUID)
   - type: ComponentType or custom string
   - metadata: name, description, icon, category, tags

2. **Content**
   - Component-specific data (text, link, image URL, etc.)
   - Varies by component type

3. **Styles**
   - BaseStyles (common to all)
   - Component-specific extended styles

### Style Preset Model

```typescript
ComponentPreset {
  id: string                    // Unique within component type
  name: string                  // Display name: "Professional Blue"
  description?: string          // "Deep blue with white text"
  thumbnail?: string           // Preview image URL
  styles: BaseStyles           // Complete style configuration
  isCustom?: boolean           // User-created vs predefined
  createdAt?: number           // Timestamp
}
```

Presets contain **only styles**, not content. They're applied on top of component defaults.

## ComponentRegistry Deep Dive

### Storage Structure

```typescript
ComponentRegistry {
  definitions: Map<string, ComponentDefinition>
    ├── "button" → ComponentDefinition
    ├── "text" → ComponentDefinition
    ├── "image" → ComponentDefinition
    └── ...

  presets: Map<componentType, Map<presetId, preset>>
    ├── "button" → Map
    │   ├── "preset-1" → ComponentPreset
    │   ├── "preset-2" → ComponentPreset
    │   └── ...
    ├── "text" → Map
    │   ├── "preset-1" → ComponentPreset
    │   └── ...
    └── ...
}
```

### Key Methods

```typescript
// Component management
register(definition)           // Register a component
registerMany(definitions)      // Register multiple
create(type)                   // Create instance with defaults
validate(component)            // Validate component

// Preset management
getPresets(type)              // Get all presets for component
getPreset(type, id)           // Get specific preset
addPreset(type, preset)       // Add new preset
removePreset(type, id)        // Remove preset
updatePreset(type, id, updates)  // Update preset
createWithPreset(type, id)    // Create component with preset applied

// Search
filter(options)               // Filter components by category/tags/search
getByCategory(category)       // Get components in category
getAll()                      // Get all components
```

### Event Emission

```typescript
COMPONENT_REGISTERED  // When component type registered
COMPONENT_UNREGISTERED // When component type removed
PRESET_ADDED          // When preset added to registry
PRESET_REMOVED        // When preset removed from registry
```

## Storage and Persistence

### Current Implementation

1. **Presets in Memory Only**
   - ComponentRegistry stores presets in-memory
   - Presets are loaded from ComponentDefinition.presets
   - No persistence of user-created presets

2. **Templates Persisted**
   - TemplateStorage saves complete templates
   - Templates include all components with their current styles
   - Uses StorageAdapter abstraction (currently LocalStorageAdapter)

### Storage Adapter Pattern

```typescript
interface StorageAdapter {
  get<T>(key): Promise<T | null>
  set<T>(key, value): Promise<void>
  remove(key): Promise<void>
  clear(): Promise<void>
}

LocalStorageAdapter implements StorageAdapter {
  // Uses browser localStorage
  // JSON serialization
}
```

### TemplateStorage

```typescript
class TemplateStorage {
  // Key format: "{keyPrefix}:template:{id}"
  // Stores complete Template objects
  
  async get(id: string)
  async save(template: Template)
  async delete(id: string)
  async list(): Promise<TemplateMetadata[]>
}
```

## Property Editing System

### PropertyPanel Component

Location: `/packages/ui-solid/src/sidebar/PropertyPanel.tsx`

Currently uses a **hard-coded constant** `PROPERTY_DEFINITIONS`:

```typescript
const PROPERTY_DEFINITIONS: ComponentPropertyMap = {
  button: [
    { key: 'content.text', label: 'Button Text', type: 'text', section: 'content' },
    { key: 'styles.backgroundColor', label: 'Background Color', type: 'color', section: 'styles' },
    // ... more properties
  ],
  text: [
    // ... text-specific properties
  ],
  // ... more components
}
```

### Property Editor Types

```typescript
type PropertyEditorType = 
  | 'text'     // Single line text input
  | 'textarea' // Multi-line text
  | 'number'   // Number input with min/max
  | 'color'    // Color picker
  | 'select'   // Dropdown
  | 'radio'    // Radio buttons
  | 'url'      // URL input (validated)
```

### Property Definition Structure

```typescript
interface PropertyDefinition {
  key: string                  // Dot notation: "styles.backgroundColor"
  label: string               // "Background Color"
  type: PropertyEditorType
  section: 'content' | 'styles' | 'settings'
  options?: Array<{label, value}>
  min?: number
  max?: number
  placeholder?: string
  description?: string
}
```

### Dot Notation Helpers

```typescript
// Get nested value from object
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

// Set nested value in object
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

## ComponentPalette System

### Purpose

Display available components for dragging onto canvas with:
- Search filtering
- Category filtering
- Drag-and-drop support

### Current Implementation

```typescript
interface ComponentPaletteProps {
  components: ComponentDefinition[]
  onComponentDragStart?: (definition: ComponentDefinition, event: DragEvent) => void
}
```

### Filtering

```typescript
// By category
filteredComponents = components.filter(c => c.metadata.category === selectedCategory)

// By search
filteredComponents = components.filter(c =>
  c.metadata.name.includes(query) ||
  c.metadata.description?.includes(query) ||
  c.metadata.tags?.some(tag => tag.includes(query))
)
```

### Drag Data

When dragging a component to canvas:

```json
{
  "type": "button",
  "category": "base"
}
```

The application then:
1. Looks up ComponentDefinition
2. Calls `registry.create(type)` to instantiate
3. Adds to template.components

## Data Flow: Complete Picture

### User Flow: Add Button Component

```
1. ComponentPalette shows "Button" component
2. User drags Button to TemplateCanvas
3. TemplateCanvas.handleDrop() triggers
4. Extracts type from drag data: "button"
5. Finds ComponentDefinition from definitions array
6. Creates instance: registry.create("button")
   └─ Returns: Button instance with default styles
7. Calls BuilderContext.addComponent(instance)
8. BuilderContext creates TemplateAddComponentCommand
9. CommandManager executes command
   └─ Command updates template.components array
10. Template state updates
11. TemplateCanvas re-renders with new component
12. User can now click to select and edit
```

### User Flow: Apply Preset

```
1. Component selected in PropertyPanel
2. User clicks "Apply Preset: Professional Blue"
3. PropertyPanel calls applyPreset("preset-professional-blue")
4. Looks up preset from ComponentRegistry
5. Merges preset.styles into component.styles
6. Creates TemplateUpdateComponentCommand
7. CommandManager executes
8. Component updated with new styles
9. Canvas re-renders
```

### User Flow: Edit Property

```
1. Component selected
2. PropertyPanel displays properties for component type
3. User changes "Background Color" field
4. PropertyPanel.handlePropertyChange() triggered
5. Uses setNestedValue() to update component:
   setNestedValue(component, "styles.backgroundColor", "#ff0000")
6. Creates TemplateUpdateComponentCommand
7. CommandManager executes
8. Component.styles.backgroundColor = "#ff0000"
9. Template state updates
10. Canvas re-renders with new color
```

### User Flow: Save Template

```
1. User clicks "Save"
2. BuilderContext.saveTemplate() called
3. TemplateManager.update() called
4. TemplateStorage.save(template) called
5. StorageAdapter.set(key, serializedTemplate)
6. LocalStorageAdapter stores in browser localStorage
7. Template persists across sessions
8. onSaveTemplate callback fired
```

## State Management

### BuilderState (Global)

```typescript
interface BuilderState {
  template: Template | null
  selectedComponentId: string | null
  draggedComponent: BaseComponent | null
  canUndo: boolean
  canRedo: boolean
  isInitialized: boolean
}
```

### Template Structure

```typescript
interface Template {
  metadata: TemplateMetadata {
    id: string
    name: string
    description?: string
    author?: string
    tags?: string[]
    category?: string
    version: string
    createdAt: number
    updatedAt: number
  }
  settings: TemplateSettings {
    canvasDimensions: CanvasDimensions
    responsiveBreakpoints?: ResponsiveBreakpoints
  }
  generalStyles: GeneralStyles {
    canvasBackgroundColor?: string
    defaultFontFamily?: string
    defaultFontSize?: CSSValue
  }
  components: BaseComponent[]
}
```

## Command Pattern

All state-changing operations use Commands for undo/redo:

```typescript
// Example: TemplateAddComponentCommand
new TemplateAddComponentCommand(
  { component },
  () => state.template,
  (updated) => setState('template', updated)
)
```

Benefits:
- Automatic undo/redo support
- Command history tracking
- Easy to add new operations
- Reversible state changes

## Integration Points for Preset System

### ComponentRegistry
Already supports presets, but:
- No persistence of user-created presets
- Only loads presets from definitions

### TemplateManager
Could extend to:
- Store presets with templates
- Load presets when template loads
- Validate presets with component definitions

### PropertyPanel
Could extend to:
- Show preset selector dropdown
- Show preset preview
- Show "Apply Preset" button

### ComponentPalette
Could extend to:
- Show preset indicators on components
- Allow preset selection when adding
- Show preset thumbnails

### BuilderContext
Could add:
- getPresets(componentType)
- applyPreset(componentId, presetId)
- createPreset(componentId, name, description)
- savePreset(preset)
- deletePreset(componentType, presetId)

## Recommended PresetManager Service

```typescript
class PresetManager {
  constructor(
    private storage: StorageAdapter,
    private registry: ComponentRegistry,
    private eventEmitter: EventEmitter
  ) {}

  // CRUD
  async createPreset(
    componentType: string,
    name: string,
    styles: BaseStyles,
    description?: string
  ): Promise<ComponentPreset>

  async updatePreset(
    componentType: string,
    presetId: string,
    updates: Partial<ComponentPreset>
  ): Promise<void>

  async deletePreset(componentType: string, presetId: string): Promise<void>

  // Retrieval
  async getPresets(componentType: string): Promise<ComponentPreset[]>
  async getPreset(componentType: string, id: string): Promise<ComponentPreset | null>
  
  // Search & Filter
  async searchPresets(query: string): Promise<ComponentPreset[]>
  async getCustomPresets(): Promise<ComponentPreset[]>

  // Application
  applyPresetToComponent(
    component: BaseComponent,
    presetId: string
  ): BaseComponent

  // Import/Export
  async exportPresets(componentType?: string): Promise<string>
  async importPresets(json: string): Promise<void>

  // Events
  private eventEmitter emits:
    - PRESET_CREATED
    - PRESET_UPDATED
    - PRESET_DELETED
    - PRESET_IMPORTED
}
```

