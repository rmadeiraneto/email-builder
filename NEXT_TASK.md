# Next Task: Style Presets UI Implementation

## 📋 Task Overview

Complete the Style Presets System by implementing the UI layer. The backend infrastructure (PresetStorage, PresetManager, Commands) is complete and ready. Now we need to expose this functionality to users through the UI.

### **Priority**: HIGH 🔴

**Why**: This is a core requirement (REQUIREMENTS.md §2.3.3) and the infrastructure is already built. Completing the UI will deliver a fully functional preset system.

**Status**: Phase 1 Complete ✅ - Ready for Phase 2 UI Implementation
**Estimated Time**: 4-7 hours remaining (Phase 2 & 3)
**Dependencies**: ✅ All backend infrastructure complete + Builder integration complete

---

## 🎉 Phase 1 Complete Summary

### ✅ What's Already Done (Commit: e312e42)

**1. Builder Integration:**
- ✅ PresetManager initialized in Builder constructor
- ✅ `getPresetManager()` getter method added
- ✅ Presets automatically load from storage on initialization

**2. BuilderContext Preset Actions:**
- ✅ `applyPreset(componentId, presetId)` - Apply preset with undo/redo
- ✅ `createPreset(componentId, name, description)` - Create from styles
- ✅ `updatePreset(componentType, presetId, updates)` - Update preset
- ✅ `deletePreset(componentType, presetId)` - Delete preset
- ✅ `listPresets(componentType)` - Get all presets for type

**3. Default Presets (30 total):**
- ✅ Button (6): Primary, Secondary, Success, Danger, Warning, Link
- ✅ Text (5): Heading 1, Heading 2, Heading 3, Paragraph, Small Text
- ✅ Image (4): Full Width, Thumbnail, Avatar, Banner
- ✅ Header (3): Centered, Left Aligned, With Background
- ✅ Footer (3): Simple, Social, Detailed
- ✅ Hero (3): Bold, Minimal, Image Focus
- ✅ List (3): Compact, Spacious, Grid
- ✅ CTA (3): Bold, Subtle, Boxed

### 🎯 What's Next: Phase 2 - UI Implementation

**Focus**: Build the user-facing components to interact with the preset system

**Starting Point**: Deliverable #1 - Preset Selector in PropertyPanel

---

## 🎯 Deliverables

### **1. Preset Selector in PropertyPanel** ✅ COMPLETE
**File**: `packages/ui-solid/src/sidebar/PropertyPanel.tsx`
**Priority**: Highest
**Time Estimate**: 1-2 hours
**Status**: ✅ **COMPLETE** - Fully implemented and ready for testing

#### Requirements (REQUIREMENTS.md §2.3.3)
- Add a "Presets" section at the top of the Style tab
- Dropdown to select from available presets for the selected component type
- "Apply Preset" button to merge preset styles into component
- Visual indicator showing which preset is currently applied (if any)
- "Save as Preset" button to create preset from current component styles

#### Features
- Load presets from PresetManager for the selected component type
- Apply preset using ApplyPresetCommand (for undo/redo support)
- Create preset using CreatePresetCommand
- Filter presets by component type automatically

#### UI Design
```
┌─────────────────────────────────────┐
│ Style Presets                     ▼ │
├─────────────────────────────────────┤
│ [Preset Dropdown ▼]  [Apply]  [+]  │
│                                     │
│ Current: Professional Blue          │
└─────────────────────────────────────┘
```

#### Implementation Steps
1. Import PresetManager from Builder instance
2. Add state for selected preset ID
3. Load presets using `presetManager.list(componentType)`
4. Add preset dropdown UI above existing property sections
5. Implement apply handler using ApplyPresetCommand
6. Implement save handler using CreatePresetCommand
7. Add modal for preset creation (name + description inputs)

#### Acceptance Criteria ✅ ALL COMPLETE
- [x] User can see available presets for selected component
- [x] User can select a preset from dropdown
- [x] Clicking "Apply" updates component with preset styles
- [x] Clicking "+ Save Preset" opens modal to save current styles as preset
- [x] Preset description shown when preset selected
- [x] All operations support undo/redo via commands

#### Available Backend Support
✅ **BuilderContext Actions Ready:**
- `applyPreset(componentId, presetId)` - Applies preset with undo/redo
- `createPreset(componentId, name, description)` - Creates new preset
- `listPresets(componentType)` - Gets all presets for type

✅ **30 Default Presets Available:**
- Button: 6 presets (Primary, Secondary, Success, Danger, Warning, Link)
- Text: 5 presets (H1, H2, H3, Paragraph, Small)
- Image: 4 presets (Full Width, Thumbnail, Avatar, Banner)
- Header: 3 presets (Centered, Left Aligned, With Background)
- Footer: 3 presets (Simple, Social, Detailed)
- Hero: 3 presets (Bold, Minimal, Image Focus)
- List: 3 presets (Compact, Spacious, Grid)
- CTA: 3 presets (Bold, Subtle, Boxed)

---

### **2. Default Presets for Component Definitions** ✅ COMPLETE
**Files**: `packages/core/components/definitions/*.definitions.ts`
**Priority**: High
**Time Estimate**: 1 hour
**Status**: ✅ Complete - 30 presets added across 8 component types

#### Requirements (REQUIREMENTS.md §2.3.3)
- Add default presets to each component definition
- At least 2-3 presets per component type
- Cover common use cases (Primary, Secondary, Success, Warning, etc.)

#### Example Implementation
```typescript
// In base-components.definitions.ts - Button component
presets: [
  {
    id: 'button-primary',
    name: 'Primary',
    description: 'Primary action button with bold styling',
    styles: {
      backgroundColor: '#0066CC',
      border: {
        width: { value: 0, unit: 'px' },
        style: 'none',
        color: 'transparent',
        radius: {
          topLeft: { value: 8, unit: 'px' },
          topRight: { value: 8, unit: 'px' },
          bottomRight: { value: 8, unit: 'px' },
          bottomLeft: { value: 8, unit: 'px' },
        }
      },
      padding: {
        top: { value: 12, unit: 'px' },
        right: { value: 24, unit: 'px' },
        bottom: { value: 12, unit: 'px' },
        left: { value: 24, unit: 'px' },
      }
    },
    isCustom: false,
  },
  {
    id: 'button-secondary',
    name: 'Secondary',
    description: 'Secondary action button with outline',
    styles: {
      backgroundColor: 'transparent',
      border: {
        width: { value: 2, unit: 'px' },
        style: 'solid',
        color: '#0066CC',
        radius: {
          topLeft: { value: 8, unit: 'px' },
          topRight: { value: 8, unit: 'px' },
          bottomRight: { value: 8, unit: 'px' },
          bottomLeft: { value: 8, unit: 'px' },
        }
      },
      padding: {
        top: { value: 12, unit: 'px' },
        right: { value: 24, unit: 'px' },
        bottom: { value: 12, unit: 'px' },
        left: { value: 24, unit: 'px' },
      }
    },
    isCustom: false,
  },
  {
    id: 'button-success',
    name: 'Success',
    description: 'Success action button in green',
    styles: {
      backgroundColor: '#28A745',
      border: {
        width: { value: 0, unit: 'px' },
        style: 'none',
        color: 'transparent',
        radius: {
          topLeft: { value: 8, unit: 'px' },
          topRight: { value: 8, unit: 'px' },
          bottomRight: { value: 8, unit: 'px' },
          bottomLeft: { value: 8, unit: 'px' },
        }
      },
      padding: {
        top: { value: 12, unit: 'px' },
        right: { value: 24, unit: 'px' },
        bottom: { value: 12, unit: 'px' },
        left: { value: 24, unit: 'px' },
      }
    },
    isCustom: false,
  }
]
```

#### Components to Add Presets To
- **Button**: Primary, Secondary, Success, Danger, Warning, Link
- **Text**: Heading 1, Heading 2, Heading 3, Paragraph, Small
- **Image**: Full Width, Thumbnail, Avatar, Banner
- **Header**: Centered, Left Aligned, With Background
- **Footer**: Simple, Social, Detailed
- **Hero**: Bold, Minimal, Image Focus
- **List**: Compact, Spacious, Grid
- **CTA**: Bold, Subtle, Boxed

#### Acceptance Criteria
- [ ] Each base component has 3+ default presets
- [ ] Each email component has 2+ default presets
- [ ] Presets have descriptive names and descriptions
- [ ] Presets use consistent naming patterns
- [ ] All presets are marked as `isCustom: false`

---

### **3. PresetPreview Modal Component**
**File**: `packages/ui-solid/src/modals/PresetPreview.tsx` (new)
**Priority**: High
**Time Estimate**: 2-3 hours

#### Requirements (REQUIREMENTS.md §2.3.3)
- Modal that shows preset preview before selection
- Visual representation of the preset styles
- Preset metadata (name, description)
- "Apply" and "Cancel" buttons
- Triggered when user hovers or clicks info icon on preset

#### Features
- Render a sample component with the preset applied
- Show style properties that will be applied
- Allow user to apply without closing PropertyPanel

#### UI Design
```
┌────────────────────────────────────────┐
│  Preset Preview                    [×] │
├────────────────────────────────────────┤
│                                        │
│  Professional Blue Button              │
│  ──────────────────────────────        │
│                                        │
│  [Sample Button Rendered]             │
│                                        │
│  Description:                          │
│  Deep blue background with white       │
│  text and rounded corners              │
│                                        │
│  Styles Applied:                       │
│  • Background: #0066CC                 │
│  • Color: #FFFFFF                      │
│  • Border Radius: 8px                  │
│  • Padding: 12px 24px                  │
│                                        │
│         [Cancel]    [Apply Preset]     │
└────────────────────────────────────────┘
```

#### Component Props
```typescript
interface PresetPreviewProps {
  preset: ComponentPreset;
  componentType: ComponentType;
  isOpen: boolean;
  onClose: () => void;
  onApply: (presetId: string) => void;
}
```

#### Acceptance Criteria
- [ ] Modal opens when info icon clicked on preset
- [ ] Shows component preview with preset applied
- [ ] Lists all style properties being applied
- [ ] "Apply" button triggers onApply callback
- [ ] "Cancel" button closes modal
- [ ] Accessible with keyboard navigation
- [ ] Proper focus management

---

### **4. PresetManager Modal Component**
**File**: `packages/ui-solid/src/modals/PresetManager.tsx` (new)
**Priority**: Medium
**Time Estimate**: 3-4 hours

#### Requirements (REQUIREMENTS.md §2.3.3)
- Full CRUD interface for presets
- List all presets grouped by component type
- Create new preset
- Edit existing preset
- Delete preset
- Duplicate preset

#### Features
- Filter by component type
- Search presets by name
- Show custom vs. default presets
- Export/Import presets as JSON
- Uses CreatePresetCommand, UpdatePresetCommand, DeletePresetCommand

#### UI Design
```
┌─────────────────────────────────────────────────┐
│  Preset Manager                             [×] │
├─────────────────────────────────────────────────┤
│  [Filter: All ▼]  [Search...]  [+ New Preset]  │
├─────────────────────────────────────────────────┤
│                                                 │
│  Button Presets (3)                           ▼│
│  ├─ Professional Blue       [Edit] [Delete]    │
│  ├─ Success Green           [Edit] [Delete]    │
│  └─ Danger Red              [Edit] [Delete]    │
│                                                 │
│  Text Presets (2)                             ▼│
│  ├─ Heading Large           [Edit] [Delete]    │
│  └─ Body Text               [Edit] [Delete]    │
│                                                 │
│                      [Import]  [Export]  [Close]│
└─────────────────────────────────────────────────┘
```

#### Component Props
```typescript
interface PresetManagerProps {
  isOpen: boolean;
  onClose: () => void;
  initialComponentType?: ComponentType;
}
```

#### Sub-components Needed
1. **PresetList** - Lists presets by component type
2. **PresetEditor** - Form to create/edit preset
3. **PresetDeleteConfirm** - Confirmation dialog for delete

#### Acceptance Criteria
- [ ] Modal accessible from toolbar or PropertyPanel
- [ ] Can filter presets by component type
- [ ] Can search presets by name/description
- [ ] Can create new preset with name, description, styles
- [ ] Can edit existing custom preset
- [ ] Can delete custom preset (with confirmation)
- [ ] Can duplicate any preset
- [ ] Can export presets as JSON
- [ ] Can import presets from JSON
- [ ] All operations use commands (undo/redo support)
- [ ] Real-time updates when presets change

---

### **5. Preset Indicators in ComponentPalette**
**File**: `packages/ui-solid/src/sidebar/ComponentPalette.tsx`
**Priority**: Low (Polish)
**Time Estimate**: 1 hour

#### Requirements (REQUIREMENTS.md §2.4.2)
- Show badge/indicator on components that have presets available
- Count of available presets per component
- Optional: Preset quick-select dropdown on hover

#### UI Design
```
┌──────────────────────────┐
│  Button              [3] │ ← Badge showing 3 presets
│  [Button Icon]           │
└──────────────────────────┘
```

#### Implementation
- Add preset count to component card
- Style badge with theme colors
- Make badge clickable to open preset selector (optional)

#### Acceptance Criteria
- [ ] Badge shows correct preset count per component
- [ ] Badge only appears if component has presets
- [ ] Badge is visually consistent with design system
- [ ] Badge doesn't interfere with drag-and-drop

---

## 🔧 Technical Implementation Details

### Integration with Builder

#### 1. Access PresetManager in BuilderContext
```typescript
// In BuilderContext.tsx
import { PresetManager } from '@email-builder/core/preset';

// Add to context
const presetManager = builder.getPresetManager(); // Need to add this method to Builder

// Add preset actions
const actions = {
  // ... existing actions
  
  applyPreset: async (componentId: string, presetId: string) => {
    const component = state.template?.components.find(c => c.id === componentId);
    if (!component) return;
    
    const command = new ApplyPresetCommand(
      { componentId, componentType: component.type, presetId },
      presetManager,
      (id) => state.template?.components.find(c => c.id === id),
      (updated) => {
        // Update component in template
        setState('template', 'components', (comps) =>
          comps.map(c => c.id === updated.id ? updated : c)
        );
      }
    );
    
    await builder.executeCommand(command);
    updateUndoRedoState();
  },
  
  createPreset: async (componentId: string, name: string, description?: string) => {
    const component = state.template?.components.find(c => c.id === componentId);
    if (!component) return;
    
    const command = new CreatePresetCommand(
      {
        componentType: component.type,
        name,
        description,
        styles: component.styles,
        isCustom: true,
      },
      presetManager
    );
    
    await builder.executeCommand(command);
  },
  
  updatePreset: async (componentType: ComponentType, presetId: string, updates: UpdatePresetOptions) => {
    const command = new UpdatePresetCommand(
      { componentType, presetId, updates },
      presetManager
    );
    
    await builder.executeCommand(command);
  },
  
  deletePreset: async (componentType: ComponentType, presetId: string) => {
    const command = new DeletePresetCommand(
      { componentType, presetId },
      presetManager
    );
    
    await builder.executeCommand(command);
  },
};
```

#### 2. Update Builder to Expose PresetManager
```typescript
// In packages/core/builder/Builder.ts

export class Builder {
  private presetManager: PresetManager;
  
  constructor(config: BuilderConfig) {
    // ... existing code
    
    // Initialize PresetManager
    const presetStorage = new PresetStorage(this.storage, this.config.storage.keyPrefix);
    this.presetManager = new PresetManager(presetStorage, this.registry);
    
    // Load presets from storage
    await this.presetManager.loadAllFromStorage();
  }
  
  public getPresetManager(): PresetManager {
    return this.presetManager;
  }
}
```

### Component Structure

```
packages/ui-solid/src/
├── sidebar/
│   ├── PropertyPanel.tsx          # Update: Add preset selector
│   ├── PropertyPanel.module.scss  # Update: Add preset styles
│   └── ComponentPalette.tsx       # Update: Add preset badges
│
├── modals/
│   ├── PresetPreview.tsx          # New: Preset preview modal
│   ├── PresetPreview.module.scss  # New: Preview styles
│   ├── PresetManager.tsx          # New: Preset management modal
│   ├── PresetManager.module.scss  # New: Manager styles
│   └── index.ts                   # Update: Export new modals
│
└── components/
    ├── PresetSelector/            # New: Reusable preset selector
    │   ├── PresetSelector.tsx
    │   ├── PresetSelector.module.scss
    │   └── index.ts
    │
    └── PresetEditor/              # New: Preset edit form
        ├── PresetEditor.tsx
        ├── PresetEditor.module.scss
        └── index.ts
```

---

## ✅ Overall Acceptance Criteria

### Functional Requirements
- [ ] User can view available presets for any component type
- [ ] User can apply preset and see immediate visual change
- [ ] User can create new preset from component's current styles
- [ ] User can preview preset before applying
- [ ] User can manage all presets (create, edit, delete, duplicate)
- [ ] User can export/import presets as JSON
- [ ] Each component type has default presets
- [ ] All preset operations support undo/redo
- [ ] Presets persist across browser sessions

### Non-Functional Requirements
- [ ] Preset operations are fast (<100ms for apply)
- [ ] UI is responsive and intuitive
- [ ] No console errors or warnings
- [ ] Accessible with keyboard navigation
- [ ] Works in all supported browsers
- [ ] TypeScript types are correct and complete

### Testing Requirements
- [ ] Unit tests for new components
- [ ] Integration tests for preset lifecycle
- [ ] Manual testing of all user workflows
- [ ] Undo/redo testing for all operations

---

## 📦 Implementation Order

### Phase 1: Core Functionality ✅ COMPLETE (3-4 hours)
1. ✅ Update Builder to expose PresetManager
2. ✅ Add preset actions to BuilderContext
3. ✅ Add default presets to component definitions (30 presets across 8 components)
4. ⏭️ Implement PresetSelector in PropertyPanel → **START HERE**

**What's Complete:**
- Builder.ts: PresetManager initialization and getter
- BuilderContext.tsx: 5 preset actions (apply, create, update, delete, list)
- Component definitions: 30 professional default presets
- All backend infrastructure ready and tested

### Phase 2: Preview & Management (3-4 hours) ⏳ CURRENT FOCUS
4. ✅ Implement PresetSelector in PropertyPanel - **COMPLETE**
5. ⬜ Create PresetPreview modal
6. ⬜ Create PresetManager modal
7. ⬜ Implement preset CRUD operations in UI

### Phase 3: Polish (1-2 hours)
8. ⬜ Add preset badges to ComponentPalette
9. ⬜ Test all workflows end-to-end
10. ⬜ Fix bugs and improve UX

**Total Estimated Time**: 8-11 hours (3-4 hours complete, 4-7 hours remaining)

---

## 🎨 Design System Integration

### Use Existing Components
- `Button` from ui-components
- `Modal` from ui-components
- `Dropdown/Select` from ui-components
- `Input` from ui-components
- `Badge` from ui-components
- CSS Modules with BEM for styling
- Remix Icons for UI icons

### Color Palette
- Primary: `#0066CC`
- Success: `#28A745`
- Danger: `#DC3545`
- Warning: `#FFC107`
- Secondary: `#6C757D`

### Spacing Scale
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px

---

## 📝 Testing Strategy

### Unit Tests
```typescript
// PresetSelector.test.tsx
describe('PresetSelector', () => {
  it('renders presets for component type', () => {});
  it('applies preset when Apply clicked', () => {});
  it('creates preset when Save clicked', () => {});
  it('shows current preset indicator', () => {});
});

// PresetManager.test.tsx
describe('PresetManager', () => {
  it('lists all presets by component type', () => {});
  it('filters presets by component type', () => {});
  it('searches presets by name', () => {});
  it('creates new preset', () => {});
  it('edits existing preset', () => {});
  it('deletes preset with confirmation', () => {});
  it('exports presets as JSON', () => {});
  it('imports presets from JSON', () => {});
});
```

### Integration Tests
```typescript
// preset-lifecycle.test.ts
describe('Preset System Integration', () => {
  it('completes full preset lifecycle', async () => {
    // 1. Create preset from component
    // 2. Apply preset to different component
    // 3. Update preset
    // 4. Undo/redo operations
    // 5. Delete preset
  });
  
  it('persists presets across sessions', () => {
    // 1. Create preset
    // 2. Reload page
    // 3. Verify preset still exists
  });
});
```

### Manual Testing Checklist
- [ ] Can create preset from component styles
- [ ] Can apply preset to component
- [ ] Can see preset preview
- [ ] Can edit preset name and description
- [ ] Can delete preset (custom only)
- [ ] Can duplicate preset
- [ ] Can export single preset
- [ ] Can export all presets
- [ ] Can import preset(s)
- [ ] Undo/redo works for all operations
- [ ] Presets persist after page reload
- [ ] No memory leaks during heavy usage

---

## 🚀 Getting Started

### Step 1: Update Core Builder
```bash
# Edit packages/core/builder/Builder.ts
# Add PresetManager initialization and getter
```

### Step 2: Update BuilderContext
```bash
# Edit apps/dev/src/context/BuilderContext.tsx
# Add preset actions
```

### Step 3: Add Default Presets
```bash
# Edit packages/core/components/definitions/base-components.definitions.ts
# Add presets array to each component
```

### Step 4: Implement PropertyPanel Preset Selector
```bash
# Edit packages/ui-solid/src/sidebar/PropertyPanel.tsx
# Add preset section at top of Style tab
```

### Step 5: Test & Iterate
```bash
# Start dev server
pnpm dev

# Test preset application
# Create custom preset
# Verify undo/redo
```

---

## 📚 Resources

### Backend Infrastructure (Already Complete)
- ✅ `packages/core/preset/PresetStorage.ts` - Persistence layer
- ✅ `packages/core/preset/PresetManager.ts` - High-level API
- ✅ `packages/core/commands/CreatePresetCommand.ts` - Create command
- ✅ `packages/core/commands/UpdatePresetCommand.ts` - Update command
- ✅ `packages/core/commands/DeletePresetCommand.ts` - Delete command
- ✅ `packages/core/commands/ApplyPresetCommand.ts` - Apply command
- ✅ `packages/core/types/preset.types.ts` - Type definitions

### Documentation
- `REQUIREMENTS.md` §2.3.3 - Style Presets requirements
- `REQUIREMENTS.md` §2.4.2 - Preset selection in Component Palette
- `ARCHITECTURE_OVERVIEW.md` - System architecture
- `PRESET_SYSTEM_ARCHITECTURE.md` - Preset system deep dive

---

## ❓ Questions & Decisions

### Q1: Should presets include content or only styles?
**Decision**: Only styles (as per ComponentPreset type definition)
- Presets are style configurations only
- Content is component-specific and user-defined

### Q2: Can users edit default presets?
**Decision**: No, only duplicate then edit
- Default presets (`isCustom: false`) are read-only
- Users can duplicate and customize

### Q3: Should we auto-apply preset when component is created?
**Decision**: No, use component defaults
- Presets are opt-in, not automatic
- Users can set default preset preference (future feature)

### Q4: How to handle preset compatibility across component versions?
**Decision**: Defer to future (not in scope)
- Current version: No compatibility checks
- Future: Add version field to presets

---

## 🎯 Success Metrics

After completion, users should be able to:
1. ✅ Apply a preset in < 3 clicks
2. ✅ Create a preset in < 5 clicks
3. ✅ Find desired preset in < 5 seconds
4. ✅ Understand what preset does before applying (preview)
5. ✅ Manage all presets from one interface
6. ✅ Share presets via export/import

Developer metrics:
1. ✅ All TypeScript compiles without errors
2. ✅ All tests pass
3. ✅ No console warnings/errors
4. ✅ Code follows project standards

---

**Ready to start? Begin with Phase 1, Step 1: Update Builder to expose PresetManager** 🚀
