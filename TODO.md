# Email Builder - TODO

> **Note**: For completed work and project history, see [PROGRESS.md](./PROGRESS.md)

---

## 📊 Current Status

**Phase 7 Complete** ✅ - Template Builder UI is functional with core features implemented.

### What Works Now
- ✅ Create, save, load, and delete templates
- ✅ Drag and drop base components (Button, Text, Image, Separator, Spacer)
- ✅ Drag and drop email components (Header, Footer, Hero, List, CTA)
- ✅ Edit component properties in real-time
- ✅ Reorder components on canvas
- ✅ Undo/Redo with full command pattern integration
- ✅ Duplicate components (Ctrl+D)
- ✅ Export to HTML/JSON
- ✅ Canvas settings (width, background, etc.)

---

## 🎯 Next Priorities

### 1. Email Components Implementation ✅
**Priority: High** - Core requirement from REQUIREMENTS.md

- [x] Implement **Header** component (REQUIREMENTS.md §2.2.1)
  - [x] One image support
  - [x] List of links/menu items
  - [x] Multiple layouts (image top, right, or left)
  - [x] Property panel for Header
  - [x] Renderer for Header

- [x] Implement **Footer** component (REQUIREMENTS.md §2.2.1)
  - [x] Text fields
  - [x] Social media icons (customizable)
  - [x] Property panel for Footer
  - [x] Renderer for Footer

- [x] Implement **Hero** component (REQUIREMENTS.md §2.2.1)
  - [x] Image support
  - [x] Text content
  - [x] Button (CTA)
  - [x] Property panel for Hero
  - [x] Renderer for Hero

- [x] Implement **List** component (REQUIREMENTS.md §2.2.1)
  - [x] Vertical and horizontal layouts
  - [x] Default list item (image, title, description, button)
  - [x] Customizable item types
  - [x] Different layout options for list items
  - [x] Property panel for List
  - [x] Renderer for List

- [x] Implement **Call to Action** component (REQUIREMENTS.md §2.2.1)
  - [x] Text field
  - [x] Button
  - [x] Property panel for CTA
  - [x] Renderer for CTA

### 2. Style Presets System ✅ COMPLETE 🎨
**Priority: High** - Core requirement from REQUIREMENTS.md §2.3.3
**Status**: ✅ All phases complete - System fully functional and production-ready

#### Phase 1: Backend Integration ✅ COMPLETE
- [x] Create PresetManager for managing style presets
- [x] Implement preset storage (LocalStorage/API)
  - [x] PresetStorage with full CRUD operations
  - [x] LocalStorage persistence with checksum validation
  - [x] Import/export as JSON
  - [x] Batch operations support
- [x] PresetManager service with:
  - [x] High-level preset management API
  - [x] Integration with ComponentRegistry (in-memory caching)
  - [x] Event-driven architecture (create, update, delete, apply events)
  - [x] Methods to apply presets to components
  - [x] Create presets from existing component styles
- [x] Preset Commands with undo/redo support:
  - [x] CreatePresetCommand
  - [x] UpdatePresetCommand
  - [x] DeletePresetCommand
  - [x] ApplyPresetCommand
- [x] Type definitions (preset.types.ts):
  - [x] PresetSaveData - Serialization format
  - [x] PresetListItem - List/metadata format
  - [x] TypeScript strict mode compliant
- [x] Command type enum extensions
- [x] Component preset types updated (exactOptionalPropertyTypes)
- [x] **Builder Integration**:
  - [x] Added PresetManager to Builder class
  - [x] Exposed getPresetManager() method
  - [x] Auto-load presets on initialization
- [x] **BuilderContext Actions**:
  - [x] applyPreset action with undo/redo
  - [x] createPreset action
  - [x] updatePreset action
  - [x] deletePreset action
  - [x] listPresets action
- [x] **Default Presets** (30 total):
  - [x] Button (6 presets)
  - [x] Text (5 presets)
  - [x] Image (4 presets)
  - [x] Header (3 presets)
  - [x] Footer (3 presets)
  - [x] Hero (3 presets)
  - [x] List (3 presets)
  - [x] CTA (3 presets)

#### Phase 2: UI Layer ✅ COMPLETE
- [x] **PresetPreview Modal**:
  - [x] Modal component with preview functionality
  - [x] Shows preset metadata (name, description, type)
  - [x] Displays all style properties to be applied
  - [x] Apply and Cancel actions
  - [x] Integrated into PropertyPanel
- [x] **PresetManager Modal**:
  - [x] Full CRUD interface
  - [x] List presets grouped by component type
  - [x] Filter by component type
  - [x] Search by name/description
  - [x] Edit custom presets (inline editing)
  - [x] Delete custom presets with confirmation
  - [x] Duplicate presets
  - [x] Create new preset from scratch
  - [x] Export/Import fully functional
  - [x] Default vs Custom badges
  - [x] Empty states and error handling

#### Phase 3: Polish & Testing ✅ COMPLETE
- [x] Export/Import handlers fully wired
  - [x] exportPresets() in BuilderContext
  - [x] importPresets(file) in BuilderContext
  - [x] Export button in PresetManager modal
  - [x] Import button in PresetManager modal
  - [x] Conflict resolution for imported presets
  - [x] Full integration with PropertyPanel
- [x] Duplicate preset functionality
  - [x] duplicatePreset() in BuilderContext
  - [x] Uses PresetManager's duplicate method
  - [x] Proper style copying with "(Copy)" suffix
- [x] All CRUD operations tested and working
- [x] Undo/redo support verified for all operations
- [x] Bug fixes and UX improvements complete

#### 🎉 Complete Feature Set (11 features)
1. ✅ **Apply Preset** - Apply any preset to selected component
2. ✅ **Create Preset** - Save component styles as new preset
3. ✅ **Update Preset** - Edit custom preset name/description
4. ✅ **Delete Preset** - Remove custom presets with confirmation
5. ✅ **Duplicate Preset** - Copy any preset (default or custom)
6. ✅ **Preview Preset** - View preset details before applying
7. ✅ **Export Presets** - Export all custom presets as JSON
8. ✅ **Import Presets** - Import presets from JSON with conflict resolution
9. ✅ **Filter Presets** - Filter by component type
10. ✅ **Search Presets** - Search by name or description
11. ✅ **Undo/Redo Support** - All operations support full undo/redo

#### Optional Enhancement (Deferred)
- [ ] Add preset badges to ComponentPalette - Show preset count on component cards

### 3. Content Tab Enhancement ✅ COMPLETE 📝
**Priority: High** - REQUIREMENTS.md §2.4.1
**Status**: ✅ Tab navigation system implemented and functional

- [x] Implement Content/Style tabs in PropertyPanel ✅ COMPLETE
  - [x] Tab navigation UI with Content and Style tabs
  - [x] Tab state management using SolidJS signals
  - [x] Properties filtered by active tab (content vs styles)
  - [x] Clean, accessible UI with keyboard navigation
  - [x] ARIA attributes for accessibility
  - [x] Smooth transitions and visual feedback
  - [x] TypeScript type safety maintained

- [x] **Content Tab** ✅ COMPLETE:
  - [x] Text fields and content properties
  - [x] URLs and link properties
  - [x] Image sources
  - [x] Layout options
  - [x] Structural properties (add, remove nested items)
  
- [x] **Style Tab** ✅ COMPLETE:
  - [x] All visual styling in dedicated tab
  - [x] Base styles (background, border, padding, margin) (REQUIREMENTS.md §2.3.1)
  - [x] Component-specific styles (REQUIREMENTS.md §2.3.2)
  - [x] Style presets integration
  - [x] Color, font, and spacing controls

#### Advanced Content Features (Future Enhancement)
- [ ] Rich text editing for text components (Lexical integration)
- [ ] Image selection/upload interface
- [ ] List item management with drag-and-drop

### 4. General Styles Tab ✅ COMPLETE 🎨
**Priority: Medium** - REQUIREMENTS.md §2.4.2
**Status**: ✅ Dual-mode tab system with comprehensive canvas settings

When no component is selected, show "General Styles" tab:
- [x] Dual-mode tab system (Components/General Styles when no selection)
- [x] Canvas dimensions (width, max width)
- [x] Canvas background (color picker)
- [x] Canvas border (width, style, color, radius)
- [x] Default component background
- [x] Default component border
- [x] Typography styles:
  - [x] Body text (font family, size, color, line height)
  - [x] Paragraph (font size, color, line height)
  - [x] Heading 1 (font size, color, weight)
  - [x] Heading 2 (font size, color, weight)
  - [x] Heading 3 (font size, color, weight)
- [x] Default link styles (color, hover color)
- [x] Default button styles (background, text color, border radius, padding)
- [x] Nested property path support (e.g., generalStyles.typography.heading1)
- [x] Connected to updateCanvasSetting action
- [x] Auto-save to template state
- [x] 30+ general style controls organized by category

### 5. Text Editor Integration (Lexical) � IN PROGRESS �📝
**Priority: Medium** - REQUIREMENTS.md §2.5
**Status**: ~65% Complete - Core editor built, PropertyPanel integration remaining
**Estimated Time**: 2-3 hours remaining
**See**: [NEXT_TASK.md](./NEXT_TASK.md) for detailed implementation notes

#### Phase 1: Core Editor ✅ COMPLETE (5 hours)
- [x] Install Lexical packages (v0.38.2)
- [x] Create RichTextEditor component
- [x] Toolbar features implemented:
  - [x] Bold, Italic, Strikethrough, Underline
  - [x] Text alignment (left, center, right, justify)
  - [x] Text style (paragraph, h1, h2, h3)
  - [x] Undo/Redo (integrated with Lexical history)
- [x] TypeScript integration with strict mode
- [x] SolidJS integration using Lexical core API
- [x] Export from @email-builder/ui-solid package
- [x] Modern UI with Remix Icons
- [x] Triple content format (HTML, editor state JSON, plain text)

#### Phase 2: Integration 🔄 NEXT (2-3 hours)
- [ ] Integrate RichTextEditor into PropertyPanel
- [ ] Verify Text component factory property names
- [ ] Browser testing and bug fixes
- [ ] Polish and refinement

#### Deferred Features (Future Enhancement)
- [ ] Font family selector (available in Style tab)
- [ ] Font color picker (available in Style tab)
- [ ] Font size control (available in Style tab)
- [ ] Line height control (available in Style tab)
- [ ] Link insertion/editing UI
- [ ] Lists (ul/ol) UI support

### 6. Preview Modes 👁️
**Priority: Medium** - REQUIREMENTS.md §2.7

- [ ] Create PreviewModal component
- [ ] **Web Preview**: Desktop browser simulation
- [ ] **Mobile Preview**: Mobile device simulation
- [ ] **Email Preview**: Email client simulation
- [ ] Toggle between preview modes
- [ ] Responsive iframe rendering

### 7. Custom Components 🔧
**Priority: Low** - REQUIREMENTS.md §2.2.3

- [ ] Create custom component builder UI
- [ ] Save custom components to storage
- [ ] Display custom components in palette
- [ ] Component composition support
- [ ] Custom component editing
- [ ] Custom component deletion

---

## 🔨 Technical Improvements

### Code Quality
- [ ] Fix LinkedInputs edge case (1 failing test)
- [ ] Re-enable DTS plugin for production builds
- [ ] Add component tree view for hierarchy navigation
- [ ] Improve error messages across the UI
- [ ] Add loading states for async operations

### User Experience Testing
- [ ] Test drag-and-drop smoothness and responsiveness
- [ ] Verify all visual feedback during interactions
- [ ] Test all keyboard shortcuts
- [ ] Validate error messages are clear and helpful
- [ ] Check loading states display appropriately
- [ ] Verify empty states are clear and actionable

### Accessibility
- [ ] Full keyboard navigation audit
- [ ] Screen reader compatibility testing
- [ ] ARIA attributes validation
- [ ] Color contrast checking
- [ ] Focus management improvements

---

## 🚀 Future Features (Post-Core)

### Responsive Design (REQUIREMENTS.md §2.9)
- [ ] Component wrapping behavior controls
- [ ] Breakpoint configuration
- [ ] Device-specific margins
- [ ] Device-specific padding
- [ ] Visibility per device (show/hide)

### Email Client Compatibility (REQUIREMENTS.md §3)
- [ ] Target selection (Web, Email, Hybrid)
- [ ] Outlook 2016-365 compatibility mode
- [ ] Table-based layout generation
- [ ] Inline styles for email
- [ ] Compatibility warnings system

### Data Injection (REQUIREMENTS.md §2.8)
- [ ] External data source integration
- [ ] Placeholder system for dynamic content
- [ ] Support for individual fields, events, orders, lists, inventories

### Template Management Enhancements
- [ ] Template categories/tags
- [ ] Template thumbnails in picker
- [ ] Template versioning UI
- [ ] Template import/export (file system)
- [ ] Template sharing (URL export)

### Advanced Canvas Features
- [ ] Zoom in/out
- [ ] Grid/ruler overlay
- [ ] Snap to grid
- [ ] Component alignment helpers
- [ ] Component spacing helpers
- [ ] Multi-select and bulk operations
- [ ] Copy/paste components
- [ ] Component grouping
- [ ] Component locking

### Headless Services (REQUIREMENTS.md §6)
- [ ] HTML Generation Service (inline CSS)
- [ ] Data Processing Service (template variables)

### Localization (REQUIREMENTS.md §5.3)
- [ ] Externalize all UI strings
- [ ] Language pack system
- [ ] RTL support

---

## 📝 Development Standards

### Code Quality
- TypeScript with strict type checking
- CSS Modules with BEM methodology
- Comprehensive test coverage (target: 99%+)
- ESLint and Prettier for code formatting

### Component Standards
- Event-driven architecture
- Destroy/cleanup methods for all components
- Accessibility features (ARIA, keyboard navigation)
- Responsive design
- Loading states
- Error handling

### Documentation
- JSDoc comments for all public APIs
- Type definitions with comments
- README files with usage examples
- Architecture documentation

---

_For completed work and detailed progress history, see [PROGRESS.md](./PROGRESS.md)_
