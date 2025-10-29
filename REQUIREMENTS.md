# Email Builder - Requirements Document

## 1. Project Overview

### 1.1 Purpose
Build a reactive, framework-agnostic email/newsletter/webpage builder using a microfrontend architecture. The builder enables users to create responsive email and web content through an intuitive drag-and-drop interface.

### 1.2 Target Platforms
- Web applications (ReactJS, Next.js)
- Blazor applications
- Vanilla JavaScript environments

### 1.3 Architecture
Microfrontend architecture with framework-agnostic core and framework-specific adapters.

## 2. Core Features

### 2.1 Drag and Drop Interface
- **Canvas Area**: Visual workspace where users can arrange components
- **Component Palette**: Library of available components to drag into canvas
- **Reordering**: Users can drag and drop components on canvas to change their order
- **Top-level Selection Only**: Users can only select and customize complete components, not nested elements

### 2.2 Component System

#### 2.2.1 Standard Components
- **Header**:
  - One image
  - List of links/menu items
  - Multiple layouts (image top, right, or left)

- **Footer**:
  - Text fields
  - Social media icons (customizable with icon sets or custom images)

- **Hero**:
  - Image
  - Text
  - Button

- **Lists**:
  - Vertical and horizontal layouts
  - Default list item (image, title, description, button)
  - Customizable item types (images, buttons)
  - Different layout options for list items

- **Call to Action**:
  - Text
  - Button

#### 2.2.2 Base Components
- Button
- Text
- Image
- Separator
- Spacer

#### 2.2.3 Custom Components
- Users can create and save custom components
- Custom components appear in component palette
- Support for component composition

### 2.3 Component Customization

#### 2.3.1 Base Styles (All Components)
- Background color
- Border style
- Border color
- Border width
- Border radius
- Padding
- Margin

#### 2.3.2 Component-Specific Styles
- Layout options
- Internal spacing
- Horizontal alignment
- Vertical alignment
- Component-specific properties

#### 2.3.3 Style Presets
- Default preset per component
- User-created custom presets
- Preset preview before selection
- Preset management (create, edit, delete)

### 2.4 Sidebar Interface

#### 2.4.1 Component Selected State
Two tabs available:

**Content Tab**:
- Text editing via custom Lexical-based editor
- Image selection/upload
- Structure modifications (add, remove, reorder nested items)
- List item management with drag-and-drop

**Style Tab**:
- All visual styling options
- Excludes text styles handled by text editor
- Base styles
- Component-specific styles

#### 2.4.2 No Component Selected State
Two tabs available:

**Components Tab**:
- Component inventory in grid layout
- Organized by categories (accordions):
  - Navigation
  - Content
  - Base
  - Custom
- Style preset selection per component
- Preset preview modal

**General Styles Tab**:
- Canvas dimensions
- Canvas background
- Canvas border
- Default component background
- Default component border
- Typography styles:
  - General text
  - Paragraph
  - Heading 1, 2, 3, etc.
- Default link styles
- Default button styles

### 2.5 Text Editor (Lexical-based)

#### 2.5.1 Toolbar Features
- Bold
- Italic
- Strikethrough
- Underline
- Text alignment (left, center, right, justify)
- Text style (paragraph, h1, h2, h3)
- Font family
- Font color
- Font size
- Line height
- Link insertion/editing
- Undo/Redo

### 2.6 Template Management
- Save complete templates
- Load pre-existing templates
- Template versioning (future consideration)
- Template export/import

### 2.7 Preview Modes
- **Web Preview**: Desktop browser simulation
- **Mobile Preview**: Mobile device simulation
- **Email Preview**: Email client simulation
- Toggle between preview modes

### 2.8 Data Injection
- External data source integration
- Placeholder system for dynamic content
- Support for:
  - Individual fields
  - Events data
  - Order data
  - Lists
  - Full inventories

### 2.9 Responsive Design

#### 2.9.1 User Controls
- Component wrapping behavior
- Breakpoint configuration
- Device-specific margins
- Device-specific padding
- Visibility per device (show/hide)

#### 2.9.2 Default Behavior
- Mobile-first approach
- Automatic responsive behavior
- User can override defaults

## 3. Rendering Modes

### 3.1 Target Selection
Three rendering targets:
- **Web**: Full CSS support, modern features
- **Email**: Limited CSS, email client compatible
- **Hybrid**: Both web and email, with compatibility warnings

### 3.2 Email Client Compatibility
- Primary focus: Outlook 2016-365
- Table-based layouts where necessary
- Inline styles
- Limited CSS support
- Compatibility warnings for unsupported features

### 3.3 Compatibility Warnings
When in hybrid mode, display warnings for:
- Unsupported CSS properties (e.g., border-radius in Outlook)
- Layout limitations
- JavaScript restrictions
- Font support issues

## 4. Command/Event System

### 4.1 Architecture
- Event-driven architecture
- Command pattern implementation
- Observable/subscription model

### 4.2 Core Commands
- `save-template`: Save current template
- `load-template`: Load existing template
- `export-html`: Export as HTML
- `save-style-preset`: Save component style preset
- `delete-style-preset`: Delete style preset
- `add-component`: Add component to canvas
- `remove-component`: Remove component from canvas
- `update-component-content`: Update component content
- `update-component-style`: Update component styles
- `reorder-components`: Change component order
- `undo`: Undo last action
- `redo`: Redo last undone action
- `preview`: Trigger preview mode
- `inject-data`: Inject external data

### 4.3 Event Subscription
- Host application can subscribe to all commands
- Custom event handlers
- Event payload includes full context

## 5. Configuration System

### 5.1 Initial Configuration
```typescript
{
  target: 'web' | 'email' | 'hybrid',
  locale: string,
  storage: {
    method: 'local' | 'api' | 'custom',
    config: object
  },
  callbacks: {
    onSaveTemplate: (template) => void,
    onSaveStylePreset: (preset) => void,
    onExport: (html) => void,
    // ... other callbacks
  },
  initialState?: {
    template?: object,
    components?: object[],
    generalStyles?: object
  },
  features?: {
    customComponents: boolean,
    dataInjection: boolean,
    // ... feature flags
  }
}
```

### 5.2 Storage Customization
- Local storage adapter
- API adapter
- Custom adapter interface
- Async storage support

### 5.3 Localization
- All UI strings externalized
- Language pack system
- RTL support (future consideration)

## 6. Headless Services

### 6.1 HTML Generation Service
**Input**:
- HTML string
- CSS string

**Output**:
- Inlined HTML (CSS embedded in style attributes)

**Features**:
- CSS specificity handling
- Media query preservation
- Email client optimizations

### 6.2 Data Processing Service
**Input**:
- Template HTML
- Data object/context

**Output**:
- HTML with replaced placeholders

**Features**:
- Template syntax (e.g., `{{field}}`, `{{#each list}}`)
- Conditional rendering
- Loops for lists
- Nested data access
- Error handling for missing data

## 7. UI Component Library

### 7.1 Atomic Design Structure

#### Atoms
- Button
- Input
- Label
- Icon
- Checkbox
- Radio
- Switch
- Badge
- Tooltip

#### Molecules
- Text Editor (Lexical-based)
- Color Picker
- Accordion
- Dropdown
- Modal
- Tabs
- Form Field (label + input + error)
- Icon Button
- Slider
- Number Input

#### Organisms
- Component Palette
- Property Panel
- Preset Selector
- Style Editor
- Content Editor
- Toolbar

### 7.2 Multi-Framework Support
UI components built in three variants:
- **Vanilla JS**: Framework-agnostic base
- **Solid JS**: Main UI implementation
- **Blazor**: .NET integration

**Requirements**:
- Shared attributes/props
- Consistent API
- Maximum code reuse
- Common design tokens

## 8. Design System

### 8.1 Design Tokens Structure
```
tokens/
├── colors/
│   ├── brand.json
│   ├── semantic.json
│   ├── ui.json
│   └── syntax.json
├── typography/
│   ├── fonts.json
│   ├── sizes.json
│   ├── weights.json
│   └── line-heights.json
├── spacing/
│   └── scale.json
├── sizing/
│   └── scale.json
├── border/
│   ├── radius.json
│   └── width.json
├── shadow/
│   └── elevation.json
├── animation/
│   ├── duration.json
│   └── easing.json
└── breakpoints/
    └── devices.json
```

### 8.2 Token Format
- Use W3C Design Token format
- Compatible with Figma plugins
- Support for token aliases
- Semantic naming

### 8.3 Icon System
- **Library**: Remix Icons
- **Implementation Options**:
  1. Custom icon font (build-time generation)
  2. Remix Icons package
- Icon catalog for user selection
- Custom icon upload support

## 9. Technical Requirements

### 9.1 TypeScript
- Strict mode enabled
- Comprehensive type definitions
- Auto-documentation ready
- Exported type definitions

### 9.2 Documentation
- JSDoc comments on all public APIs
- TypeDoc configuration
- Component prop documentation
- Example usage in comments

### 9.3 Build System
- **Tool**: Vite
- **Features**:
  - Monorepo support
  - Tree shaking
  - Code splitting
  - Multiple output formats (ESM, UMD, CJS)
  - Development server with HMR
  - TypeScript compilation

### 9.4 Code Quality
- **Principles**: SOLID
- **Focus**: Single Responsibility Principle
- **Balance**: Reusability vs. ease of use
- **Testing**: Unit and integration tests
- **Linting**: ESLint + TypeScript ESLint
- **Formatting**: Prettier

## 10. Project Structure

```
email-builder/
├── packages/
│   ├── core/                    # Framework-agnostic core
│   │   ├── builder/
│   │   ├── commands/
│   │   ├── components/
│   │   ├── services/
│   │   ├── template/
│   │   └── types/
│   │
│   ├── tokens/                  # Design tokens
│   │   ├── colors/
│   │   ├── typography/
│   │   ├── spacing/
│   │   ├── animations/
│   │   └── sizes/
│   │
│   ├── ui-components/           # Vanilla JS UI components
│   │   ├── atoms/
│   │   ├── molecules/
│   │   └── organisms/
│   │
│   ├── ui-solid/                # Solid JS implementation
│   │   ├── canvas/
│   │   ├── sidebar/
│   │   ├── toolbar/
│   │   └── main.tsx
│   │
│   ├── adapters/                # Framework adapters
│   │   ├── react/
│   │   ├── next/
│   │   └── blazor/
│   │
│   ├── email-components/        # Email-specific components
│   │   ├── component-builder/
│   │   ├── standard/
│   │   └── templates/
│   │
│   ├── web-components/          # Web-specific components
│   │   ├── standard/
│   │   └── templates/
│   │
│   └── post-processing-services/
│       ├── inline-style/
│       └── data-processing/
│
├── apps/
│   ├── dev/                     # Development sandbox
│   ├── react-demo/
│   ├── next-demo/
│   └── blazor-demo/
│
├── tools/
│   ├── config/
│   ├── scripts/
│   └── testing/
│
└── docs/
```

## 11. Package Scope (Current Focus)

### 11.1 Current Iteration: UI Components Package
Focus on building the UI components library with three implementations:
- Vanilla JavaScript
- Solid JS
- Blazor

### 11.2 Deliverables
1. Complete design tokens system
2. Vanilla JS UI components (atoms, molecules, organisms)
3. Solid JS UI components
4. Blazor UI components
5. Shared component logic
6. Component documentation
7. Storybook/demo environment

### 11.3 Component Requirements
- Consistent API across all implementations
- Design token integration
- Full TypeScript support
- Accessibility (WCAG 2.1 AA)
- Keyboard navigation
- Screen reader support
- Theme support
- Responsive design

## 12. Future Considerations

### 12.1 Phase 2 Features
- Template marketplace
- Collaboration features (real-time editing)
- Version control
- A/B testing support
- Analytics integration
- Advanced data binding
- Component marketplace

### 12.2 Performance Optimization
- Virtual scrolling for large component lists
- Lazy loading of components
- Optimized rendering pipeline
- Web Workers for heavy processing

### 12.3 Additional Integrations
- CMS integrations
- Email service provider APIs
- Asset management systems
- Translation services

## 13. Success Criteria

### 13.1 Functional Requirements
- [ ] All standard components implemented
- [ ] Drag and drop working smoothly
- [ ] Style customization fully functional
- [ ] Template save/load working
- [ ] Preview modes accurate
- [ ] Email client compatibility validated
- [ ] Responsive design working on all devices

### 13.2 Non-Functional Requirements
- [ ] Bundle size < 500KB (gzipped)
- [ ] Initial load time < 2s
- [ ] Component render time < 16ms
- [ ] Accessibility score 100%
- [ ] Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- [ ] TypeScript coverage 100%
- [ ] Test coverage > 80%

### 13.3 Developer Experience
- [ ] Clear documentation
- [ ] Simple integration process
- [ ] Good TypeScript intellisense
- [ ] Helpful error messages
- [ ] Working examples for all frameworks
- [ ] Active support/maintenance

## 14. Constraints and Assumptions

### 14.1 Constraints
- Must support Outlook 2016-365
- Must work in all modern browsers (last 2 versions)
- Must be framework-agnostic at core
- Must be performant (see success criteria)

### 14.2 Assumptions
- Users have basic HTML/CSS knowledge
- Modern build tools available (Vite, Webpack, etc.)
- ES6+ JavaScript environment
- Users will provide their own backend for storage (or use local storage)

## 15. Glossary

- **Component**: Reusable building block (Header, Footer, Button, etc.)
- **Template**: Complete email/page layout with components
- **Preset**: Saved style configuration for a component
- **Canvas**: Visual editing area where components are placed
- **Sidebar**: Panel for editing component content and styles
- **Design Tokens**: Design system values (colors, spacing, etc.)
- **Adapter**: Framework-specific wrapper/integration layer
- **Headless Service**: Backend processing service without UI
