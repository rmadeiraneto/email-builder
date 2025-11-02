# Email Builder - TODO

> **Note**: For completed work and project history, see [PROGRESS.md](./PROGRESS.md)

---

## 🔧 Core System Improvements Needed

**Priority: High**
- [x] Install dependencies in packages/core (`npm install`)
- [x] Run and verify all tests pass (325/325 passing)
- [x] Fix Math.random() security issue (use crypto.randomUUID())
- [x] Replace deprecated String.substr() with slice() (no instances found)
- [x] Add main package README with examples
- [ ] Add Builder usage documentation
- [ ] Add Command system documentation

**Priority: Medium**
- [ ] Extract hard-coded values to constants (e.g., email width limit)
- [ ] Create more specific custom error types
- [ ] Add performance optimizations (tree caching)
- [ ] Improve async error handling consistency

---

## 📊 Project Status Overview

### Core System ✅ COMPLETE
- 13,092 lines of production code
- 1,889 tests (100% passing)
- 3 PRs merged (#1, #2, #3)

### UI Component Migration ✅ COMPLETE
- 24 components migrated
- 1,009 tests (99.9% passing)
- 1 known edge case (LinkedInputs - non-critical)

### Template Builder UI ✅ CORE COMPLETE
- Phase 1: Foundation ✅ COMPLETE
- Phase 2: Core Functionality ✅ COMPLETE
  - ✅ Create New Template
  - ✅ Drag-and-Drop
  - ✅ Property Panel
  - ✅ Component Deletion
  - ✅ Template Toolbar
  - ✅ Component Reordering
  - ✅ Template Operations (Save/Load/Delete)

---

## ⭐ NEXT SESSION PRIORITIES

### 1. **Component Reordering** ✅ COMPLETE
**Goal:** Allow users to change component order via drag-and-drop

**Tasks:**
- [x] Add drag handles to components on canvas
- [x] Implement drag-and-drop reordering within canvas
- [x] Update template component array order
- [x] Visual feedback for drop position (insertion indicator)
- [x] Prevent reordering during property editing

### 2. **Template Operations** ✅ COMPLETE
**Goal:** Make templates persistent and manageable

**Tasks:**
- [x] Implement save template to LocalStorage via TemplateManager
- [x] Create TemplatePickerModal component
- [x] Display list of saved templates with metadata
- [x] Wire up template loading
- [x] Add delete template functionality
- [x] Template metadata editing (name, description)
- [x] Add search/filter to template picker

### 3. **Component Rendering** ✅ BASE COMPONENTS COMPLETE
**Goal:** Show actual rendered components instead of JSON

**Tasks:**
- [x] Create component renderer for each type
- [x] Implement HTML generation from component data
- [x] Add styles for rendered components
- [x] Support for all component properties
- [ ] Handle nested components (email components - future)

---

## 📋 IMMEDIATE NEXT STEPS (Priority Order)

### All Core Features Complete! ✅

The following features have been successfully implemented:

### 1. Component Reordering ✅ COMPLETE
- [x] Add drag handles to components on canvas
- [x] Implement drag-and-drop reordering within canvas
- [x] Update template component array order
- [x] Visual feedback for drop position (insertion indicator)

### 2. Template Picker Modal ✅ COMPLETE
- [x] Create TemplatePickerModal component
- [x] Display list of saved templates with metadata
- [x] Show template preview/thumbnail
- [x] Wire up to BuilderContext.loadTemplate()
- [x] Add search/filter functionality

### 3. Component Rendering ✅ BASE COMPONENTS COMPLETE
- [x] Create component renderer for each type
- [x] Implement HTML generation from component data
- [ ] Add iframe preview for isolated rendering (future)
- [ ] Support responsive preview modes (mobile/tablet/desktop) (future)
- [ ] Email component renderers (Header, Footer, Hero, List, CTA - future)

### 4. Undo/Redo Implementation ✅ COMPLETE
- [x] Integrate with Builder's command pattern
- [x] Track state changes as commands
- [x] Test undo/redo for all operations
- [x] Add keyboard shortcuts (Ctrl+Z, Ctrl+Y, Ctrl+Shift+Z)

### 5. Component Duplication ✅ COMPLETE
- [x] Clone component with new ID
- [x] Insert after original component
- [x] Keyboard shortcut (Ctrl+D)
- [x] Integration with undo/redo

### 6. Canvas Settings ✅ COMPLETE
- [x] Add canvas settings panel
- [x] Configure width, max-width, background color
- [x] Preview changes in real-time

---

## ✅ Testing Checklist

### Basic Functionality
- [x] Can create a new template
- [x] Can drag components from palette to canvas
- [x] Components appear on canvas after drop
- [x] Can select components on canvas
- [x] Can edit component properties in property panel
- [x] Properties update in real-time
- [x] Can delete components with button
- [x] Can delete components with keyboard shortcuts (Delete/Backspace)

### Advanced Functionality
- [x] Can reorder components on canvas
- [x] Can save template to LocalStorage
- [x] Can load saved templates
- [x] Can delete saved templates
- [x] Can undo/redo changes (fully integrated with command pattern)
- [x] Can export template to HTML
- [x] Can export template to JSON
- [x] Can duplicate components (Ctrl+D)

### Component Rendering
- [x] Button renders correctly with all properties
- [x] Text renders correctly with all properties
- [x] Image renders correctly with all properties
- [x] Separator renders correctly with all properties
- [x] Spacer renders correctly with all properties
- [ ] Email components render correctly

### User Experience
- [ ] Drag-and-drop is smooth and responsive
- [ ] Visual feedback during interactions
- [ ] Keyboard shortcuts work correctly
- [ ] Error messages are clear and helpful
- [ ] Loading states are shown appropriately
- [ ] Empty states are clear and actionable

---

## 🐛 Known Issues to Fix

### High Priority
1. ~~**TypeScript Build Errors**~~ ✅ FIXED
   - ✅ Fixed SCSS module type declarations
   - ✅ Fixed Template.canvas property references
   - ✅ TypeScript builds cleanly (ui-solid package)
   - [ ] Re-enable DTS plugin for production builds (optional)

2. ~~**Component Selection Visual Feedback**~~ ✅ FIXED
   - ✅ Visual selection indicator on canvas (border highlight)
   - ✅ Highlight selected component border with box-shadow
   - ✅ Component overlay visible when selected
   - [ ] Show selection in component tree (future enhancement)

### Medium Priority
3. ~~**Design Token Integration**~~ ✅ FIXED
   - ✅ Added W3C Design Tokens parser to build script
   - ✅ SCSS and CSS variables now generate properly
   - ✅ Package alias `@email-builder/tokens` working for TypeScript
   - ✅ CSS/SCSS exports available in package.json

4. **LinkedInputs Edge Case**
   - 1 failing test in auto alpha input detection
   - Non-critical functionality
   - Can be addressed in future iteration

---

## 🎯 Success Metrics

Track progress with these milestones:

- [x] Phase 1: Foundation complete (UI layout, context, canvas, palette)
- [x] Phase 2A: Basic editing (drag-drop, property panel, delete)
- [x] Phase 2B: Advanced editing (reorder complete, duplicate complete)
- [x] Phase 3: Template management (save/load/delete complete)
- [x] Phase 4: Component rendering (actual HTML preview for base components)
- [x] Phase 5: Full undo/redo integration ✅ COMPLETE
- [x] Phase 6: Canvas settings and customization ✅ COMPLETE
- [x] Phase 7: Ready for user testing ✅ COMPLETE

---

## 🏗️ Architecture Overview

### Current Architecture
```
BuilderContext (State Management)
    ↓
Builder Page (Main Layout)
    ├── TemplateToolbar (Actions: new, save, load, undo, redo, export)
    ├── ComponentPalette (Component Library: search, filter, drag)
    ├── TemplateCanvas (Visual Editor: drop, select, render)
    └── PropertyPanel (Property Editor: edit, delete)
```

### Data Flow
```
User Action → Component Event → BuilderContext Action → Builder Core → State Update → UI Re-render
```

### Key Integration Points
- Use `builder.getTemplateManager()` for template operations
- Use `builder.executeCommand()` for undo/redo operations
- Use component factories from `ComponentRegistry`
- Update `BuilderContext` state after operations

---

## 🚀 Future Enhancements (Post-MVP)

### Phase 4+: Advanced Features
- [ ] Component duplication (clone with Ctrl+D)
- [ ] Component tree view (hierarchy navigation)
- [ ] Multi-select and bulk operations
- [ ] Copy/paste components
- [ ] Component grouping
- [ ] Component locking (prevent editing)
- [ ] Component visibility toggle
- [ ] Component search on canvas

### Phase 5+: Template Management
- [ ] Template categories/tags
- [ ] Template search and filtering
- [ ] Template thumbnails/previews
- [ ] Template versioning UI
- [ ] Template import/export (file system)
- [ ] Template sharing (URL export)

### Phase 6+: Canvas Improvements
- [ ] Zoom in/out
- [ ] Responsive preview modes (mobile/tablet/desktop)
- [ ] Grid/ruler overlay
- [ ] Snap to grid
- [ ] Component alignment helpers
- [ ] Component spacing helpers

### Phase 7+: Advanced Property Editing
- [ ] Bulk property editing (multi-select)
- [ ] Property presets (save/load property sets)
- [ ] Property animation (transitions)
- [ ] Custom CSS support
- [ ] Conditional styling
- [ ] Responsive property values

---

## 📝 Development Standards

### Code Quality
- TypeScript with strict type checking
- CSS Modules with BEM methodology
- Comprehensive test coverage (99%+ pass rate)
- ESLint and Prettier for code formatting

### Component Standards
- Event-driven architecture
- Destroy/cleanup methods
- Accessibility features (ARIA, keyboard navigation)
- Responsive design
- Loading states
- Error handling

### Documentation Standards
- Inline JSDoc comments for public APIs
- Type definitions with comments
- README files with usage examples
- Architecture documentation

---

## 💡 Token Optimization Tips

### Work Efficiently
- Read only necessary files
- Use targeted edits
- Create concise documentation
- Batch related changes
- Use TODO tracking for planning

### Code Structure
- CSS Modules eliminate boilerplate
- Design tokens reduce hardcoded values
- Shared utilities reduce duplication
- TypeScript reduces runtime checks

---

_For completed work and detailed progress history, see [PROGRESS.md](./PROGRESS.md)_
