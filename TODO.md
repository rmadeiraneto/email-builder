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

### 2. Style Presets System 🎨
**Priority: High** - Core requirement from REQUIREMENTS.md §2.3.3

- [ ] Create PresetManager for managing style presets
- [ ] Implement preset storage (LocalStorage/API)
- [ ] Add preset UI in ComponentPalette
- [ ] Default preset per component type
- [ ] Create custom presets functionality
- [ ] Preset preview modal before selection
- [ ] Preset management UI (create, edit, delete)
- [ ] Apply preset to component

### 3. Content Tab Enhancement 📝
**Priority: High** - Currently only Style tab exists

- [ ] Implement Content/Style tabs in PropertyPanel (REQUIREMENTS.md §2.4.1)
- [ ] **Content Tab** features:
  - [ ] Rich text editing for text components
  - [ ] Image selection/upload interface
  - [ ] Structure modifications (add, remove nested items)
  - [ ] List item management with drag-and-drop
- [ ] **Style Tab** (refactor existing PropertyPanel)
  - [ ] Move all visual styling to this tab
  - [ ] Base styles (background, border, padding, margin) (REQUIREMENTS.md §2.3.1)
  - [ ] Component-specific styles (REQUIREMENTS.md §2.3.2)

### 4. General Styles Tab 🎨
**Priority: Medium** - REQUIREMENTS.md §2.4.2

When no component is selected, show "General Styles" tab:
- [ ] Canvas dimensions
- [ ] Canvas background
- [ ] Canvas border
- [ ] Default component background
- [ ] Default component border
- [ ] Typography styles:
  - [ ] General text
  - [ ] Paragraph
  - [ ] Heading 1, 2, 3, etc.
- [ ] Default link styles
- [ ] Default button styles

### 5. Text Editor Integration (Lexical) 📝
**Priority: Medium** - REQUIREMENTS.md §2.5

- [ ] Integrate Lexical editor for rich text editing
- [ ] Toolbar features:
  - [ ] Bold, Italic, Strikethrough, Underline
  - [ ] Text alignment (left, center, right, justify)
  - [ ] Text style (paragraph, h1, h2, h3)
  - [ ] Font family selector
  - [ ] Font color picker
  - [ ] Font size
  - [ ] Line height
  - [ ] Link insertion/editing
  - [ ] Undo/Redo (integrate with Builder undo/redo)

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
