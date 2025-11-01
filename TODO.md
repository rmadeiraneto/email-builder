# Email Builder - TODO

> **Note**: For completed work and project history, see [PROGRESS.md](./PROGRESS.md)

---

## 🔧 Core System Improvements Needed

**Priority: High**
- [ ] Install dependencies in packages/core (`npm install`)
- [ ] Run and verify all tests pass
- [ ] Fix Math.random() security issue (use crypto.randomUUID())
- [ ] Replace deprecated String.substr() with slice()
- [ ] Add main package README with examples
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

### Template Builder UI 🚧 IN PROGRESS
- Phase 1: Foundation ✅ COMPLETE
- Phase 2: Core Functionality 🚧 IN PROGRESS
  - ✅ Create New Template
  - ✅ Drag-and-Drop
  - ✅ Property Panel
  - ✅ Component Deletion
  - ✅ Template Toolbar
  - ⏳ Component Reordering
  - ⏳ Template Operations (Save/Load/Delete)

---

## ⭐ NEXT SESSION PRIORITIES

### 1. **Component Reordering** - Drag to reorder on canvas
**Goal:** Allow users to change component order via drag-and-drop

**Tasks:**
- [ ] Add drag handles to components on canvas
- [ ] Implement drag-and-drop reordering within canvas
- [ ] Update template component array order
- [ ] Visual feedback for drop position (insertion indicator)
- [ ] Prevent reordering during property editing

### 2. **Template Operations** - Save/Load/Delete templates
**Goal:** Make templates persistent and manageable

**Tasks:**
- [ ] Implement save template to LocalStorage via TemplateManager
- [ ] Create TemplatePickerModal component
- [ ] Display list of saved templates with metadata
- [ ] Wire up template loading
- [ ] Add delete template functionality
- [ ] Template metadata editing (name, description)
- [ ] Add search/filter to template picker

### 3. **Component Rendering** - Actual HTML preview
**Goal:** Show actual rendered components instead of JSON

**Tasks:**
- [ ] Create component renderer for each type
- [ ] Implement HTML generation from component data
- [ ] Add styles for rendered components
- [ ] Support for all component properties
- [ ] Handle nested components (email components)

---

## 📋 IMMEDIATE NEXT STEPS (Priority Order)

### 1. Component Reordering
- Add drag handles to components on canvas
- Implement drag-and-drop reordering within canvas
- Update template component array order
- Visual feedback for drop position (insertion indicator)

### 2. Template Picker Modal
- Create TemplatePickerModal component
- Display list of saved templates with metadata
- Show template preview/thumbnail
- Wire up to BuilderContext.loadTemplate()
- Add search/filter functionality

### 3. Component Rendering
- Create component renderer for each type
- Implement HTML generation from component data
- Add iframe preview for isolated rendering
- Support responsive preview modes (mobile/tablet/desktop)

### 4. Undo/Redo Implementation
- Integrate with Builder's command pattern
- Track state changes as commands
- Test undo/redo for all operations
- Add keyboard shortcuts (Ctrl+Z, Ctrl+Y)

### 5. Component Duplication
- Add duplicate button to component overlay
- Clone component with new ID
- Insert after original component
- Keyboard shortcut (Ctrl+D)

### 6. Canvas Settings
- Add canvas settings panel
- Configure width, max-width, background color
- Set padding and margins
- Preview changes in real-time

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
- [ ] Can reorder components on canvas
- [ ] Can save template to LocalStorage
- [ ] Can load saved templates
- [ ] Can delete saved templates
- [ ] Can undo/redo changes
- [ ] Can export template to HTML
- [ ] Can export template to JSON
- [ ] Can duplicate components

### Component Rendering
- [ ] Button renders correctly with all properties
- [ ] Text renders correctly with all properties
- [ ] Image renders correctly with all properties
- [ ] Separator renders correctly with all properties
- [ ] Spacer renders correctly with all properties
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
1. **TypeScript Build Errors**
   - Fix SCSS module type declarations
   - Fix Template.canvas property (doesn't exist in type)
   - Re-enable DTS plugin for production builds

2. **Component Selection Visual Feedback**
   - Add visual selection indicator on canvas
   - Highlight selected component border
   - Show selection in component tree (future)

### Medium Priority
3. **Design Token Integration**
   - Tokens imported via relative path - should use package alias
   - Add CSS export to tokens package.json

4. **LinkedInputs Edge Case**
   - 1 failing test in auto alpha input detection
   - Non-critical functionality
   - Can be addressed in future iteration

---

## 🎯 Success Metrics

Track progress with these milestones:

- [x] Phase 1: Foundation complete (UI layout, context, canvas, palette)
- [x] Phase 2A: Basic editing (drag-drop, property panel, delete)
- [ ] Phase 2B: Advanced editing (reorder, duplicate, undo/redo) ← **NEXT TARGET**
- [ ] Phase 3: Template management (save/load/delete)
- [ ] Phase 4: Component rendering (actual HTML preview)
- [ ] Phase 5: Full undo/redo working
- [ ] Phase 6: Canvas settings and customization
- [ ] Phase 7: Ready for user testing

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
