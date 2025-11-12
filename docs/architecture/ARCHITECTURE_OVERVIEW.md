# Email Builder Architecture Overview

## 1. Current Component Structure

### Component Definition (Core Types)
**Location:** `/packages/core/types/component.types.ts`

Components are defined using these key interfaces:

```typescript
interface BaseComponent<TContent, TStyles> {
  id: string;                           // Unique component ID
  type: ComponentType | string;         // Component type enum
  metadata: ComponentMetadata;          // Display name, description, icon, category
  styles: TStyles;                      // Extended BaseStyles
  content: TContent;                    // Component-specific content
  children?: BaseComponent[];           // For container components
  parentId?: string;                    // For nested components
  visibility?: ResponsiveVisibility;    // Device visibility
  createdAt: number;                    // Timestamp
  updatedAt: number;                    // Timestamp
  version: string;                      // Version for compatibility
}

interface ComponentDefinition {
  type: ComponentType | string;
  metadata: ComponentMetadata;
  defaultContent: Record<string, unknown>;
  defaultStyles: BaseStyles;
  contentSchema?: Record<string, unknown>;
  presets?: ComponentPreset[];           // ← IMPORTANT: Presets already in definition
  create: () => BaseComponent;
  validate?: (component: BaseComponent) => ValidationResult;
  render?: (component: BaseComponent) => string;
}

interface ComponentPreset {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  styles: BaseStyles;
  isCustom?: boolean;
  createdAt?: number;
}
```

### Component Types
- **Base:** button, text, image, separator, spacer
- **Email/Navigation:** header, footer
- **Content:** hero, list, call_to_action (cta)
- **Custom:** any custom component type

### Component Categories
```typescript
enum ComponentCategory {
  BASE = 'base',
  NAVIGATION = 'navigation',
  CONTENT = 'content',
  CUSTOM = 'custom',
}
```

## 2. Current Styling Implementation

### BaseStyles Interface
**Location:** `/packages/core/types/component.types.ts`

All components inherit this styling structure:

```typescript
interface BaseStyles {
  backgroundColor?: string;           // Hex, RGB, RGBA
  backgroundImage?: string;
  border?: Border;                    // With width, style, color, radius
  padding?: Spacing;                  // Top, right, bottom, left
  margin?: Spacing;
  width?: CSSValue;                   // Value + unit (px, rem, em, %, etc.)
  height?: CSSValue;
  horizontalAlign?: HorizontalAlign;  // left | center | right | justify
  verticalAlign?: VerticalAlign;      // top | middle | bottom
  customClasses?: string[];           // For custom CSS
  customStyles?: Record<string, string>; // For advanced users
}

// Supporting structures
interface CSSValue {
  value: number | 'auto';
  unit: CSSUnit;  // 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw' | 'auto'
}

interface Spacing {
  top: CSSValue;
  right: CSSValue;
  bottom: CSSValue;
  left: CSSValue;
}

interface Border {
  width: CSSValue;
  style: 'none' | 'solid' | 'dashed' | 'dotted' | 'double';
  color: string;
  radius?: BorderRadius;
}
```

### Component-Specific Styles
Components extend BaseStyles with specific properties:
- **Button:** hoverBackgroundColor, variant
- **Text:** fontFamily, fontSize, fontWeight, color, textAlign, lineHeight
- **Image:** width, height, alignment
- **Header/Footer:** linkStyles, padding, backgroundColor
- **Hero/List:** headingStyles, contentAlign, itemBackgroundColor

## 3. Existing Preset-Related Code

### In ComponentRegistry
**Location:** `/packages/core/components/ComponentRegistry.ts`

The registry already has preset management methods:

```typescript
class ComponentRegistry {
  private presets: Map<string, Map<string, ComponentPreset>>;
  
  // Preset methods:
  getPresets(type: ComponentType | string): ComponentPreset[]
  getPreset(type: ComponentType | string, presetId: string): ComponentPreset | undefined
  addPreset(type: ComponentType | string, preset: ComponentPreset): void
  removePreset(type: ComponentType | string, presetId: string): boolean
  updatePreset(type: string, presetId: string, updates: Partial<ComponentPreset>): void
  createWithPreset(type: string, presetId: string): BaseComponent
  
  // Events
  PRESET_ADDED = 'preset:added'
  PRESET_REMOVED = 'preset:removed'
}
```

### Preset Architecture
- Presets are stored per component type: `Map<componentType, Map<presetId, preset>>`
- Presets can be registered when components are registered
- Components can be created from presets using `createWithPreset()`
- Registry emits events when presets are added/removed

## 4. ComponentPalette Implementation

**Location:** `/packages/ui-solid/src/sidebar/ComponentPalette.tsx`

Features:
- Displays all available components from ComponentDefinition[]
- Search filtering by name, description, tags
- Category filtering
- Drag-and-drop support for adding components to canvas
- Shows component metadata (name, description, icon)

Structure:
```typescript
interface ComponentPaletteProps {
  components: ComponentDefinition[];
  onComponentDragStart?: (definition: ComponentDefinition, event: DragEvent) => void;
}

// Filtering:
- By category (all | specific category)
- By search query (name/description/tags)
- Displays filtered components as draggable items
```

Current limitations:
- No preset selection in palette
- No visual preset preview
- No way to apply presets from the palette

## 5. PropertyPanel Implementation

**Location:** `/packages/ui-solid/src/sidebar/PropertyPanel.tsx`

### Property Definitions
```typescript
interface PropertyDefinition {
  key: string;                    // Dot-notation path (e.g., "styles.backgroundColor")
  label: string;                  // Display label
  type: PropertyEditorType;       // text | textarea | number | color | select | radio | url
  section: 'content' | 'styles' | 'settings';
  options?: Array<{label, value}>;
  min?: number;
  max?: number;
  placeholder?: string;
  description?: string;
}
```

### Hard-Coded Property Definitions
Currently defined as a large constant `PROPERTY_DEFINITIONS` with mappings for:
- button, text, image, separator, spacer
- header, footer, hero, list, call_to_action

Each component type has 5-20+ property definitions.

### Editor Types Supported
- **Text/URL:** input fields
- **Textarea:** multi-line text
- **Number:** input with min/max validation
- **Color:** color picker + hex input
- **Select:** dropdown with options
- **Radio:** radio button group

### Current Flow
1. Component selected → PropertyPanel receives selectedComponent
2. PropertyPanel looks up properties in PROPERTY_DEFINITIONS[componentType]
3. Groups properties by section (content, styles, settings)
4. Renders appropriate editor for each property type
5. Changes update component via onPropertyChange callback
6. Uses dot-notation helper functions for nested property access

## 6. Storage Patterns Used

### LocalStorageAdapter
**Location:** `/packages/core/services/LocalStorageAdapter.ts`

```typescript
interface StorageAdapter {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
}

class LocalStorageAdapter implements StorageAdapter {
  // Uses browser localStorage for persistence
  // Serializes/deserializes JSON
}
```

### TemplateStorage
**Location:** `/packages/core/template/TemplateStorage.ts`

- Stores complete template objects with key prefix
- Used by TemplateManager for CRUD operations
- Abstracts storage adapter for flexibility

### Template Persistence
Templates are stored with structure:
```typescript
interface Template {
  metadata: TemplateMetadata;
  settings: TemplateSettings;
  generalStyles: GeneralStyles;
  components: BaseComponent[];
}
```

### No Preset Storage Layer Currently
- Presets are stored in ComponentRegistry (memory)
- No persistence layer for user-created presets
- Presets defined in component definitions are static

## 7. Overall Architecture

### Core Package (`/packages/core`)

```
Core/
├── builder/
│   └── Builder.ts              # Main orchestrator class
├── components/
│   ├── ComponentRegistry.ts     # Component & preset management
│   ├── definitions/
│   │   ├── base-components.definitions.ts
│   │   ├── email-components.definitions.ts
│   │   └── registry-init.ts
│   └── factories/
│       ├── base-components.factories.ts
│       └── email-components.factories.ts
├── commands/
│   ├── CommandManager.ts
│   ├── TemplateAddComponentCommand.ts
│   ├── TemplateUpdateComponentCommand.ts
│   ├── TemplateRemoveComponentCommand.ts
│   └── ... other commands
├── template/
│   ├── TemplateManager.ts       # High-level template operations
│   ├── TemplateStorage.ts       # Persistence
│   ├── TemplateValidator.ts
│   ├── ComponentTreeBuilder.ts
│   └── TemplateComposer.ts
├── services/
│   ├── EventEmitter.ts          # Event system
│   └── LocalStorageAdapter.ts   # Storage implementation
└── types/
    ├── component.types.ts       # All component interfaces
    ├── template.types.ts        # Template structures
    ├── config.types.ts          # Configuration
    ├── command.types.ts
    └── event.types.ts
```

### UI Package (`/packages/ui-solid`)

```
UI-Solid/
├── sidebar/
│   ├── ComponentPalette.tsx     # Component library display
│   ├── PropertyPanel.tsx        # Property editor
│   ├── CanvasSettings.tsx       # Canvas-level settings
│   └── *.types.ts              # Type definitions
├── canvas/
│   ├── TemplateCanvas.tsx       # Main editing canvas
│   ├── ComponentRenderer.tsx    # Component rendering
│   └── index.ts
└── toolbar/
    ├── TemplateToolbar.tsx      # Action buttons
    └── TemplateToolbar.types.ts
```

### Application (`/apps/dev`)

```
App/
├── src/
│   ├── pages/
│   │   ├── Builder.tsx          # Main builder page
│   │   └── Styleguide.tsx
│   ├── context/
│   │   └── BuilderContext.tsx   # Global state & actions
│   └── components/
│       └── modals/              # UI dialogs
```

## 8. Key Services & Managers

### Builder (Main Orchestrator)
**Location:** `/packages/core/builder/Builder.ts`

Coordinates:
- ComponentRegistry
- TemplateManager
- CommandManager
- EventEmitter
- StorageAdapter

### ComponentRegistry
**Location:** `/packages/core/components/ComponentRegistry.ts`

Manages:
- Component definitions (register, unregister, get, filter)
- Presets per component type
- Component creation
- Component validation
- Event emission

### TemplateManager
**Location:** `/packages/core/template/TemplateManager.ts`

Manages:
- Template CRUD operations
- Current template state
- Template validation
- Component tree operations

### CommandManager
**Location:** `/packages/core/commands/CommandManager.ts`

Manages:
- Command execution queue
- Undo/redo history
- Command validation

### BuilderContext (React Context)
**Location:** `/apps/dev/src/context/BuilderContext.tsx`

Provides:
- Global builder state
- Action methods for common operations
- Component definitions
- State reactivity via createStore

## 9. What Would Be Needed for PresetManager

### Current Gaps
1. **No preset persistence** - Presets only exist in-memory
2. **No user preset creation UI** - Users can't create/save custom presets
3. **No preset sharing** - No way to export/import presets
4. **No preset categories** - All presets are flat
5. **No preset application UI** - ComponentPalette can't show/apply presets
6. **Limited preset storage** - Only in ComponentRegistry, not in templates

### What PresetManager Would Need
```typescript
class PresetManager {
  // Storage
  - Persist presets to localStorage/API
  - Load presets on initialization
  - Manage preset versions
  
  // Operations
  - createPreset(name, description, styles, component)
  - updatePreset(id, updates)
  - deletePreset(id)
  - duplicatePreset(id)
  - applyPreset(component, presetId)
  - getPresetsByComponent(type)
  - getPresetsByCategory(category)
  
  // Search & Filter
  - searchPresets(query)
  - filterByCategory
  - filterByComponent
  - filterByCustom
  
  // Events
  - PRESET_CREATED
  - PRESET_UPDATED
  - PRESET_DELETED
  - PRESET_APPLIED
  
  // Validation
  - validatePreset(preset)
  - validatePresetName(name)
}
```

### UI Components Needed
1. **PresetSelector** - Dropdown to choose presets
2. **PresetPreview** - Shows preset visuals
3. **PresetManager** - Create/edit/delete presets
4. **PresetExporter** - Export to JSON
5. **PresetImporter** - Import from JSON
6. **PresetButton** - Quick apply preset button

### Integration Points
1. **PropertyPanel** - Show "Apply Preset" button
2. **ComponentPalette** - Show preset badges/indicators
3. **CanvasSettings** - Save canvas presets
4. **TemplateToolbar** - Manage/import/export presets

## 10. Event System

### EventEmitter
**Location:** `/packages/core/services/EventEmitter.ts`

Used throughout for:
- Registry events (COMPONENT_REGISTERED, PRESET_ADDED, PRESET_REMOVED)
- Builder events (INITIALIZED, ERROR, STATE_CHANGED)
- Command events
- Template events

### Event Types
```typescript
enum BuilderEvent {
  INITIALIZED = 'builder:initialized',
  ERROR = 'builder:error',
  STATE_CHANGED = 'builder:state:changed',
}

enum RegistryEvent {
  COMPONENT_REGISTERED = 'component:registered',
  PRESET_ADDED = 'preset:added',
  PRESET_REMOVED = 'preset:removed',
}
```

## 11. Data Flow Example

### Adding a Component with Preset
```
1. User drags component from palette
2. TemplateCanvas.handleDrop()
3. BuilderContext.addComponent()
4. TemplateAddComponentCommand created & executed
5. CommandManager processes command
6. Template state updated
7. BuilderContext emits STATE_CHANGED
8. UI re-renders with new component

For preset:
1. User selects preset from dropdown
2. PropertyPanel.applyPreset(presetId)
3. ComponentRegistry.createWithPreset(type, presetId)
4. New component created with preset styles applied
5. TemplateUpdateComponentCommand updates component
6. Styles merged with component styles
7. Canvas re-renders
```

### Updating Component Property
```
1. User changes property in PropertyPanel
2. PropertyPanel.handlePropertyChange()
3. BuilderContext.updateComponentProperty()
4. TemplateUpdateComponentCommand created
5. PropertyPanel uses dot-notation to set nested values
6. setNestedValue(component, 'styles.backgroundColor', '#ff0000')
7. CommandManager executes command
8. Template state updated
9. TemplateCanvas re-renders with new styles
```

## Summary

The architecture is well-structured with:
- Clear separation of concerns (core/UI/app)
- Event-driven system for state changes
- Command pattern for undo/redo
- Component registry with built-in preset support
- Type-safe throughout with TypeScript
- Storage abstraction for flexibility

The main gaps are:
- No persistence layer for user-created presets
- No UI for preset management
- PropertyPanel is hardcoded rather than driven by definitions
- No preset-aware component creation

A PresetManager service would fit naturally into the existing architecture, integrating with ComponentRegistry and TemplateManager.
