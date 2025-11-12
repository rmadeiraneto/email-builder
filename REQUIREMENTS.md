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

### 3.4 Email Testing Integration

#### 3.4.1 External Testing Service Configuration
Users can configure external email testing services to validate rendering across email clients:

**Supported Services**:
- Litmus
- Email on Acid
- Testi@
- Custom API endpoints

**Configuration Requirements**:
- API endpoint URL
- Authentication method (API key, OAuth, Bearer token)
- Test settings (email clients to test)
- Configuration validation
- Connection testing

**Configuration UI**:
- Settings modal/page for API configuration
- Secure credential storage
- Connection status indicator
- Test connection button
- Service-specific configuration options

#### 3.4.2 Test Execution Workflow
**User Flow**:
1. User configures testing service in settings
2. User builds template in builder
3. User clicks "Test in Email Clients" button
4. Builder exports HTML with email optimizations
5. Builder sends HTML to configured testing service API
6. Testing service creates test in user's account
7. User receives confirmation with link to view results

**Technical Requirements**:
- Automatic HTML export with inline styles
- API client abstraction for multiple services
- Error handling and user feedback
- Test history tracking (optional)
- Progress indicators during API calls

**Export Optimizations for Testing**:
- CSS inlining
- Table-based layout conversion
- Outlook conditional comments
- Remove unsupported CSS properties
- Email-safe HTML structure

#### 3.4.3 In-Builder Compatibility Guidance

**Component Property Support Indicators**:
For every style property in the PropertyPanel sidebar, display email client compatibility information:

**Information Display**:
- Compatibility icon/badge next to each property control
- Click icon to open compatibility modal
- Modal shows support across major email clients:
  - Outlook 2016-2021 (Windows)
  - Outlook 365 (Windows)
  - Outlook.com (Webmail)
  - Gmail (Webmail, iOS, Android)
  - Apple Mail (macOS, iOS)
  - Yahoo Mail
  - Other popular clients

**Compatibility Data**:
- Green checkmark: Fully supported
- Yellow warning: Partial support or requires fallback
- Red cross: Not supported
- Gray: Unknown/not tested

**Data Source**:
- Based on caniemail.com data
- Regularly updated compatibility matrix
- Stored locally with periodic updates
- Fallback to built-in compatibility data

**Example Properties to Track**:
- `border-radius` (limited Outlook support)
- `box-shadow` (no Outlook support)
- `background-image` (limited support)
- `flexbox` (no email client support)
- `grid` (no email client support)
- `position: absolute` (limited support)
- Custom fonts (varies by client)
- CSS animations (no support)

#### 3.4.4 Best Practices and Tips System

**In-Builder Guidance**:
Display contextual tips and warnings to help users create email-compatible templates:

**Tip Categories**:

1. **General Email Best Practices**:
   - Use table-based layouts for maximum compatibility
   - Keep email width between 600-650px
   - Use inline styles instead of CSS classes
   - Test across multiple email clients before sending
   - Use web-safe fonts or provide fallbacks
   - Optimize images for email (size and format)

2. **Component-Specific Tips**:
   - **Images**: "Always include alt text for accessibility and when images are blocked"
   - **Buttons**: "Use bulletproof button patterns for Outlook compatibility"
   - **Backgrounds**: "Outlook 2016+ doesn't support background images - provide solid color fallback"
   - **Spacing**: "Use padding and margins carefully - they render inconsistently across clients"

3. **Layout Warnings**:
   - Warn when using CSS Grid or Flexbox (not supported in email)
   - Suggest alternatives for unsupported layouts
   - Highlight properties that won't work in target mode

**Tip Display Methods**:
- Info icons with tooltips
- Warning banners when incompatible features are used
- Onboarding/tutorial for first-time users
- Help panel with searchable tips
- "Did you know?" occasional tips

**Tip Triggers**:
- When user selects "Email" or "Hybrid" rendering mode
- When user adds a property with poor email support
- When exporting template
- When running email client tests

#### 3.4.5 Compatibility Checker

**Pre-Export Validation**:
Before exporting or testing, run compatibility check:

**Checks**:
- Scan template for email-incompatible CSS
- Check for unsupported HTML elements
- Validate image sizes and formats
- Check for missing alt text
- Identify accessibility issues
- Verify table structure
- Check for inline styles vs. classes

**Report Format**:
- Critical issues (will break in email clients)
- Warnings (might not work in some clients)
- Best practice suggestions
- Fix suggestions with auto-fix option where possible

**Auto-Fix Options**:
- Convert classes to inline styles
- Replace flexbox/grid with table layouts
- Add Outlook conditional comments
- Add missing alt text placeholders
- Optimize image sizes

### 3.5 Email Client Support Matrix

**Target Email Clients** (Priority Order):

**Tier 1 - Must Support**:
1. Outlook 2016-2021 (Windows)
2. Outlook 365 (Windows, Web)
3. Gmail (Webmail, iOS, Android)
4. Apple Mail (macOS, iOS, iPadOS)

**Tier 2 - Should Support**:
5. Yahoo Mail (Webmail, iOS, Android)
6. Outlook.com (Webmail)
7. AOL Mail
8. Samsung Email (Android)

**Tier 3 - Nice to Have**:
9. Thunderbird
10. Windows Mail
11. Fastmail
12. ProtonMail

**Testing Coverage**:
- Tier 1: Test every release
- Tier 2: Test major releases
- Tier 3: Test quarterly or on demand

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

## 15. AI Agent Testing & Automation

### 15.1 Purpose
Enable automated UI testing through AI agents (e.g., Claude with computer use, Playwright, Puppeteer) by making the interface semantically rich, predictable, and machine-testable. This ensures quality through automated testing and enables AI agents to perform complex UI interaction tests.

### 15.2 Core Requirements

#### 15.2.1 Test Mode System
**Requirement**: UI must support a "test mode" that adds testing attributes without polluting production HTML or impacting performance.

**Features**:
- Global test mode toggle (enabled/disabled)
- Test attributes only present when test mode is active
- Zero performance impact in production mode
- Configurable via environment variables or UI toggle
- Persistent preference storage (localStorage)

**Test Mode Indicators**:
- Visual indicator in UI when test mode is active
- Toolbar button to toggle test mode
- `data-test-mode="true"` attribute on root element when active

#### 15.2.2 Semantic HTML & Test Attributes
**Requirement**: All interactive elements must have predictable, semantic test attributes.

**Mandatory Attributes** (when test mode enabled):
- `data-testid`: Unique identifier for element selection
  - Format: `component-type-identifier` (e.g., `button-primary-save`, `panel-properties`)
  - Must be unique within the component scope
  - Use kebab-case naming

- `data-action`: Describes the action performed by interactive elements
  - Format: `verb-noun` (e.g., `create-component`, `delete-template`, `save-preset`)
  - Applied to buttons, links, and interactive elements
  - Must be descriptive and predictable

- `data-state-*`: Exposes component state for validation
  - Dynamic attributes reflecting current state
  - Examples: `data-state-loading`, `data-state-modified`, `data-state-error`
  - Boolean values as strings ("true"/"false")
  - Updated reactively as state changes

**ARIA Attributes** (always present):
- `aria-label`: Accessible label for screen readers and AI agents
- `role`: Semantic role for complex widgets
- `aria-live`: For dynamic content updates
- `aria-expanded`: For collapsible sections
- `aria-selected`: For selectable items

#### 15.2.3 Standardized Naming Conventions
**Requirement**: Consistent, predictable naming patterns across the entire UI.

**Test ID Patterns**:
```typescript
// Buttons
`button-{variant}-{action}` // e.g., button-primary-save, button-icon-close

// Panels/Regions
`panel-{name}` // e.g., panel-properties, panel-components

// Inputs
`input-{property-name}` // e.g., input-backgroundColor, input-fontSize

// Lists
`list-{type}` // e.g., list-components, list-templates

// List Items
`item-{type}-{id}` // e.g., item-component-button-123, item-template-456

// Modals
`modal-{name}` // e.g., modal-preset-preview, modal-test-config

// Canvas Elements
`canvas-{element}` // e.g., canvas-drop-zone, canvas-component-123
```

**Action Patterns**:
```typescript
// CRUD Operations
create-{resource}  // create-template, create-preset
update-{resource}  // update-component, update-style
delete-{resource}  // delete-template, delete-preset
save-{resource}    // save-template, save-preset

// Navigation
open-{target}      // open-modal, open-panel
close-{target}     // close-modal, close-panel
toggle-{feature}   // toggle-test-mode, toggle-section

// Canvas Operations
add-component
remove-component
select-component
reorder-components
duplicate-component

// Preview & Export
preview-{mode}     // preview-web, preview-mobile, preview-email
export-{format}    // export-html, export-json
test-template
```

**State Attribute Patterns**:
```typescript
data-state-loading="true|false"
data-state-modified="true|false"
data-state-error="true|false"
data-state-empty="true|false"
data-state-expanded="true|false"
data-state-selected="true|false"
data-state-disabled="true|false"
data-state-visible="true|false"
```

#### 15.2.4 State Exposure API
**Requirement**: Expose internal application state for AI agent validation and testing.

**Test API** (available when `import.meta.env.MODE === 'test'`):
```typescript
window.__TEST_API__ = {
  // State inspection
  getBuilderState: () => BuilderState,
  getSelectedComponent: () => Component | null,
  getComponents: () => Component[],
  getTemplate: () => Template | null,
  getCanvasSettings: () => CanvasSettings,
  
  // Validation helpers
  canUndo: () => boolean,
  canRedo: () => boolean,
  hasUnsavedChanges: () => boolean,
  isModified: () => boolean,
  
  // Async operation helpers
  waitForStable: () => Promise<void>,
  waitForOperation: (operationId: string) => Promise<void>,
  
  // Test utilities
  getComponentById: (id: string) => Component | null,
  getTestIdElement: (testId: string) => HTMLElement | null,
  getAllTestIds: () => string[],
}
```

#### 15.2.5 Operation Result Indicators
**Requirement**: Provide clear, machine-readable success/failure indicators for all operations.

**Result Indicator Element**:
```html
<div
  data-testid="operation-result"
  data-result-status="success | error | pending"
  data-result-message="Human readable message"
  data-operation-type="save-template | create-preset | etc"
  role="status"
  aria-live="polite"
>
  {message}
</div>
```

**Error Format** (structured JSON in error boundaries):
```typescript
{
  code: 'ERROR_CODE',
  message: 'Human readable error message',
  details: {
    /* context-specific details */
  },
  timestamp: number,
  severity: 'critical' | 'warning' | 'info'
}
```

#### 15.2.6 Test Scenarios Support
**Requirement**: UI must support common automated testing scenarios.

**Required Test Scenarios**:
1. **Create and save template**
   - Add components to canvas
   - Edit component properties
   - Save template with name
   - Verify template saved successfully

2. **Load and modify template**
   - Load existing template
   - Modify component styles
   - Verify changes reflected
   - Save changes

3. **Apply and manage presets**
   - Select component
   - Apply style preset
   - Verify styles applied
   - Create custom preset from component

4. **Export and preview**
   - Generate HTML export
   - Switch preview modes
   - Verify rendering in each mode

5. **Undo/Redo operations**
   - Perform actions
   - Undo actions
   - Redo actions
   - Verify state changes

6. **Drag and drop**
   - Drag component from palette
   - Drop on canvas
   - Reorder components
   - Verify final order

### 15.3 Implementation Requirements

#### 15.3.1 Test Mode Manager
**Service**: `TestModeManager` singleton

**Responsibilities**:
- Maintain test mode state
- Enable/disable test mode
- Persist test mode preference
- Notify components of test mode changes

**API**:
```typescript
class TestModeManager {
  enable(): void
  disable(): void
  isEnabled(): boolean
  toggle(): void
  onChange(callback: (enabled: boolean) => void): void
}
```

#### 15.3.2 Test Attribute Helpers
**Utilities**: Helper functions for conditional test attributes

**Functions**:
```typescript
// Get test ID attribute if test mode is enabled
getTestId(id: string): { 'data-testid'?: string }

// Get action attribute if test mode is enabled
getTestAction(action: string): { 'data-action'?: string }

// Get state attributes if test mode is enabled
getTestState(state: Record<string, any>): Record<string, string>

// Get all test attributes at once
getTestAttributes(attrs: {
  testId?: string,
  action?: string,
  state?: Record<string, any>
}): Record<string, string>
```

#### 15.3.3 Component Integration Pattern
**Pattern**: Consistent integration of test attributes in all components

**Example**:
```tsx
import { getTestId, getTestAction, getTestState } from '@/utils/testAttributes';

function ComponentPalette() {
  return (
    <div
      {...getTestId('panel-components')}
      {...getTestState({
        empty: components.length === 0,
        loading: isLoading()
      })}
      role="region"
      aria-label="Component Palette"
    >
      {components.map(component => (
        <button
          {...getTestId(`component-${component.type}`)}
          {...getTestAction('add-component')}
          draggable="true"
          aria-label={`Add ${component.name}`}
        >
          {component.name}
        </button>
      ))}
    </div>
  );
}
```

#### 15.3.4 Build-Time Optimization (Optional)
**Tool**: Babel/SWC plugin to strip test attributes in production

**Configuration**:
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    stripTestAttributes(), // Remove in production builds
    // ...other plugins
  ]
});
```

### 15.4 Testing Tools Compatibility

#### 15.4.1 Supported Testing Frameworks
- Playwright
- Puppeteer
- Selenium WebDriver
- Cypress
- AI agents with computer use (Claude, etc.)

#### 15.4.2 Selector Strategies
**Preferred Selectors** (in order of preference):
1. `data-testid` attributes
2. `data-action` attributes
3. ARIA labels and roles
4. Semantic HTML elements

**Avoid**:
- CSS class selectors (change frequently)
- XPath with deep nesting
- Text content selectors (i18n issues)

### 15.5 Documentation Requirements

#### 15.5.1 Test Attribute Catalog
Maintain a comprehensive catalog of all test IDs and actions used in the application.

**Format**:
```markdown
## Button Components

| Test ID | Action | Description |
|---------|--------|-------------|
| button-primary-save | save-template | Save current template |
| button-icon-close | close-modal | Close active modal |
```

#### 15.5.2 Test Scenario Documentation
Document all supported test scenarios with example code.

**Format**:
```typescript
/**
 * Test Scenario: Create and Save Template
 * 
 * Steps:
 * 1. Enable test mode
 * 2. Click "New Template" button
 * 3. Drag component to canvas
 * 4. Edit component properties
 * 5. Save template
 * 6. Verify success
 */
async function testCreateTemplate() {
  // Enable test mode
  await click('[data-action="toggle-test-mode"]');
  
  // Create new template
  await click('[data-action="create-template"]');
  
  // Add button component
  await dragAndDrop(
    '[data-testid="component-button"]',
    '[data-testid="canvas-drop-zone"]'
  );
  
  // Verify component added
  const state = await getTestState();
  assert(state.componentCount === 1);
  
  // Save template
  await fill('[data-testid="input-templateName"]', 'Test Template');
  await click('[data-action="save-template"]');
  
  // Verify success
  const result = await getAttribute('[data-testid="operation-result"]', 'data-result-status');
  assert(result === 'success');
}
```

### 15.6 Success Criteria

#### 15.6.1 Functional Requirements
- [ ] Test mode can be toggled on/off
- [ ] All interactive elements have test attributes when test mode is enabled
- [ ] No test attributes present in production builds
- [ ] Test API available in test mode
- [ ] All operations expose success/failure status
- [ ] Consistent naming across all components

#### 15.6.2 Coverage Requirements
- [ ] 100% of buttons have test IDs and actions
- [ ] 100% of inputs have test IDs
- [ ] 100% of modals have test IDs
- [ ] All stateful components expose state via data attributes
- [ ] All CRUD operations have result indicators

#### 15.6.3 Performance Requirements
- [ ] Zero performance impact when test mode is disabled
- [ ] No increase in production bundle size
- [ ] Test attribute helpers have negligible overhead (<1ms)

#### 15.6.4 Documentation Requirements
- [ ] Complete test attribute catalog
- [ ] Test scenario examples for all major workflows
- [ ] Integration guide for test frameworks
- [ ] AI agent testing guide with examples

## 16. Visual Property Feedback System

### 16.1 Purpose
Provide immediate, intuitive visual feedback when users interact with property controls, creating a direct connection between UI controls and their effects on the canvas. This enhances the user experience by making the builder more discoverable and delightful to use.

### 16.2 Core Behavior

#### 16.2.1 Hover State - Preview
When a user hovers over any property input control:
- **Visual Indicators**: Display measurement lines and visual overlays showing which parts of the component will be affected
- **Style**: Design tool aesthetic (Figma-style red measurement lines)
- **Scope**: Show indicators for all affected elements currently visible in the viewport
- **Non-visual Properties**: For properties without visual representation (alt text, URLs), show a subtle indicator with property name near the component for 1 second (configurable duration)

#### 16.2.2 Active Editing State - Feedback
When a user is actively editing a property value:
- **Enhanced Indicators**: Show measurement lines plus pixel/value labels
- **Real-time Updates**: Update visual indicators instantly as value changes
- **Performance Optimization**: For rapid changes (dragging sliders, holding increment buttons):
  - Update instantly without animation during interaction
  - Apply animation on interaction end if needed
  - Implement debouncing if performance issues occur

#### 16.2.3 Value Change - Animation
When a property value changes:
- **Animation Duration**: Quick, snappy animations (150-200ms default)
- **Duration Configuration**: Different durations per property type (all configurable):
  - Spacing properties: 150ms default
  - Color properties: 200ms default
  - Layout properties: 180ms default
  - Typography properties: 150ms default
- **Easing**: Use easing curves (ease-out default, configurable per property type)
- **Implementation**: Web Animations API for native, performant animations
- **Scope**: All properties that can be visually animated

#### 16.2.4 Animation Behavior
- **Continuous Changes**: If animation is running and value changes again, smoothly transition from current position to new target (no restart)
- **Interruption Handling**: Cancel previous animation and start new one from current state
- **Reduced Motion**: Automatically respect browser's `prefers-reduced-motion` setting (can be overridden via configuration)

### 16.3 Visual Design

#### 16.3.1 Highlight Overlays
- **Rendering Method**: Separate overlay layer on top of canvas (non-intrusive)
- **Color Scheme**: Different shades of a single accent color
  - Lighter shades for hover state
  - Darker/more saturated for active editing state
  - Color variations to distinguish multiple simultaneous highlights
- **Viewport Constraints**: Only highlight elements currently visible in viewport

#### 16.3.2 Measurement Indicators
- **Spacing Properties** (padding, margin, gaps):
  - Figma-style measurement lines with pixel values
  - Red lines (or configurable color) with dimension labels
  - Brackets/caps on line ends
  - Value labels positioned intelligently to avoid overlap
- **Size Properties** (width, height):
  - Dimension lines along edges
  - Pixel values displayed
- **Color Properties**:
  - Subtle outline or glow on affected elements
- **Typography Properties**:
  - Highlight text content with property indicator

#### 16.3.3 Off-Screen Indicators
When affected elements are outside viewport:
- Display directional indicator/arrow showing that elements off-screen will be affected
- Show count if multiple elements affected
- Position indicator at canvas edge pointing in direction of off-screen elements

#### 16.3.4 Non-Visual Property Indicators
For properties without visual representation:
- Display floating label near component
- Show property name and new value
- Auto-dismiss after configurable duration (1 second default)
- Subtle, non-intrusive styling

### 16.4 Scope & Coverage

#### 16.4.1 Property Types Supporting Animation
- **Layout & Spacing**: padding, margin, gap, width, height, max-width, max-height
- **Typography**: font-size, line-height, letter-spacing
- **Colors**: color, background-color, border-color
- **Borders**: border-width, border-radius
- **Visual Effects**: opacity, box-shadow, text-shadow (where supported)
- **Positioning**: top, left, right, bottom (for positioned elements)

#### 16.4.2 Property Types with Visual Indicators Only
- **Content**: text, alt text, URLs (show property name indicator)
- **Structural**: layout type, component type (show indicator)
- **Conditional**: visibility, display (highlight affected element)

#### 16.4.3 Multiple Element Handling
When a property affects multiple elements:
- Highlight all affected elements visible in viewport
- Animate all affected elements simultaneously
- For general styles affecting many elements, prioritize visible ones
- Show off-screen indicator if some elements are outside viewport

### 16.5 Configuration System

#### 16.5.1 Builder Configuration
```typescript
interface VisualFeedbackConfig {
  // Global enable/disable
  enabled: boolean; // default: true

  // Animation configuration
  animations: {
    enabled: boolean; // default: true
    durations: {
      spacing: number; // default: 150
      color: number; // default: 200
      layout: number; // default: 180
      typography: number; // default: 150
      default: number; // default: 200
    };
    easing: {
      spacing: string; // default: 'ease-out'
      color: string; // default: 'ease-in-out'
      layout: string; // default: 'ease-out'
      typography: string; // default: 'ease-out'
      default: string; // default: 'ease-out'
    };
  };

  // Highlight configuration
  highlights: {
    enabled: boolean; // default: true
    color: string; // default: theme accent color
    opacity: number; // default: 0.8
    showValues: boolean; // default: true
  };

  // Non-visual property indicators
  propertyIndicators: {
    enabled: boolean; // default: true
    duration: number; // default: 1000 (ms)
    position: 'near-component' | 'fixed-top' | 'fixed-bottom'; // default: 'near-component'
  };

  // Accessibility
  respectReducedMotion: boolean; // default: true

  // Performance
  performance: {
    debounceDelay: number; // default: 16 (ms) - for rapid changes
    maxSimultaneousAnimations: number; // default: 10
  };
}
```

#### 16.5.2 Configuration Override
- Host application provides configuration via Builder initialization
- All configuration values have sensible defaults
- Individual settings can be overridden without providing full configuration object
- Configuration can be updated at runtime via Builder API

### 16.6 Technical Architecture

#### 16.6.1 Property-to-Visual Mapping
- **Default Mapping**: Predefined configuration mapping property names to visual targets
- **Override Mechanism**: PropertyPanel can pass explicit mapping information for complex cases
- **Mapping Structure**:
  ```typescript
  interface PropertyVisualMapping {
    propertyPath: string; // e.g., 'content.padding'
    visualTarget: {
      type: 'spacing' | 'size' | 'color' | 'border' | 'text' | 'indicator';
      selector?: string; // CSS selector for target elements
      region?: 'padding' | 'margin' | 'content' | 'border' | 'all';
      measurementType?: 'horizontal' | 'vertical' | 'both';
    };
  }
  ```

#### 16.6.2 Component Integration
- **Component Definitions**: Each component type defines its property mappings
- **Custom Components**: Automatically inherit mapping system
- **Base Components**: Standard mappings apply automatically
- **Compound Components**: Mappings cascade to child components

#### 16.6.3 Overlay Management
- **OverlayManager Service**: Centralized service for managing highlight overlays
  - Create/destroy overlays
  - Update overlay positions
  - Handle viewport changes
  - Manage z-index and layering
- **Overlay Types**:
  - Measurement lines (spacing, sizing)
  - Region highlights (padding, margin areas)
  - Element outlines (borders, glows)
  - Property indicators (floating labels)

#### 16.6.4 Animation Controller
- **AnimationController Service**: Manages all property change animations
  - Queue and prioritize animations
  - Handle animation interruptions
  - Apply easing curves
  - Respect performance constraints
  - Integrate with Web Animations API
- **Animation Registry**: Track active animations per element/property
- **Performance Monitoring**: Detect performance issues and apply fallbacks

#### 16.6.5 Event System Integration
- **Property Hover Events**: Emitted from property controls
- **Property Edit Events**: Emitted during active editing
- **Property Change Events**: Emitted when value changes
- **Canvas Events**: Subscribe to scroll, zoom, resize for overlay updates

### 16.7 Modularity & Extensibility

#### 16.7.1 Custom Component Support
- System automatically works with any component following standard interface
- No manual configuration required from custom component creators
- Standard property types map automatically
- Custom properties can define optional visual hints in component definition

#### 16.7.2 Plugin Architecture
- Visual feedback system implemented as modular plugin
- Can be disabled entirely if not needed
- Other plugins can register custom visual feedback behaviors
- Extensible mapping system for custom property types

#### 16.7.3 Framework Agnostic
- Core logic in framework-agnostic code
- UI overlay rendering abstracted
- Animation system uses native Web APIs
- Easy integration with React, Solid, Blazor adapters

### 16.8 User Experience

#### 16.8.1 Learning & Discovery
- Immediate visual feedback helps users understand property effects
- Reduces trial-and-error in customization
- Makes complex spacing and layout properties more intuitive
- Enhances perceived polish and quality of the builder

#### 16.8.2 Performance Perception
- Quick animations make the UI feel responsive
- Smooth transitions feel professional and refined
- Real-time feedback during editing feels direct and connected

#### 16.8.3 Accessibility
- Respects `prefers-reduced-motion` by default
- All feedback is supplementary (not required for functionality)
- Keyboard users receive same feedback as mouse users
- Screen readers receive appropriate ARIA updates for property changes

### 16.9 Success Criteria

#### 16.9.1 Functional Requirements
- [ ] Hover on any property control shows visual indicator on canvas
- [ ] Active editing shows enhanced indicators with values
- [ ] Property changes animate smoothly within configured duration
- [ ] All animatable properties support animation
- [ ] Non-visual properties show temporary indicator
- [ ] Multiple affected elements highlight simultaneously
- [ ] Off-screen indicators appear when elements are outside viewport
- [ ] Configuration system allows full customization
- [ ] Respects `prefers-reduced-motion` setting

#### 16.9.2 Performance Requirements
- [ ] Smooth 60fps animation performance
- [ ] No janky or stuttering animations
- [ ] Debouncing works correctly for rapid changes
- [ ] No memory leaks from overlay management
- [ ] Efficient overlay rendering (minimal repaints)
- [ ] Graceful performance degradation under load

#### 16.9.3 User Experience Requirements
- [ ] Visual feedback feels immediate and responsive
- [ ] Animations feel polished and professional
- [ ] Measurement indicators are clear and readable
- [ ] No visual clutter or confusion
- [ ] Works seamlessly with existing drag-and-drop
- [ ] Compatible with all component types

#### 16.9.4 Code Quality Requirements
- [ ] Modular, reusable architecture
- [ ] TypeScript strict mode compliant
- [ ] Comprehensive unit tests
- [ ] Well-documented API
- [ ] Easy to extend for custom properties
- [ ] Works with custom component builder (future)

## 17. Mobile Development Mode

### 17.1 Purpose
Enable users to create device-specific customizations for their templates with granular control over layout, styling, and behavior across different screen sizes. Users can switch to a dedicated mobile editing mode to customize how components render on mobile devices while maintaining a desktop-first inheritance model.

### 17.2 Problem Statement
Default responsive behaviors don't fit every user's needs. For example:
- Should a horizontal list wrap into rows on mobile or remain side-by-side?
- Should mobile spacing increase or decrease compared to desktop?
- Should certain components be hidden on specific devices?

Users need explicit control over mobile presentation without managing two separate templates.

### 17.3 Core Architecture

#### 17.3.1 Inheritance Model
**Desktop-First with Mobile Overrides**

- Desktop mode defines the base styles and layout
- Mobile mode provides an override layer
- Mobile properties inherit from desktop by default
- Clearing a mobile override returns to inherited desktop value
- No property duplication - only overridden values stored in mobile data

**Example:**
```typescript
component: {
  id: "button1",
  type: "button",
  styles: {
    desktop: {
      padding: "20px",
      backgroundColor: "#0066cc",
      fontSize: "16px"
    },
    mobile: {
      padding: "16px"  // Only override - fontSize and backgroundColor inherited
    }
  }
}
```

#### 17.3.2 Data Structure

**Component Styles:**
```typescript
interface ComponentStyles {
  desktop: StyleProperties;
  mobile?: Partial<StyleProperties>;  // Only overrides stored
  // Future: tablet?: Partial<StyleProperties>;
}
```

**Component Order:**
```typescript
interface Template {
  componentOrder: {
    desktop: string[];  // Array of component IDs
    mobile?: string[];  // Mobile-specific order (if different)
  };
  components: {
    [id: string]: Component;
  };
}
```

**Component Visibility:**
```typescript
interface ComponentVisibility {
  desktop: boolean;  // Default true
  mobile?: boolean;  // Override visibility for mobile
}
```

#### 17.3.3 Property Scope
**Only CSS-controllable properties can be overridden for mobile.**

**Overridable (via media queries):**
- Layout properties: padding, margin, width, height, max-width, display, flex properties
- Typography: font-size, line-height, letter-spacing, text-align
- Colors: color, background-color, border-color
- Borders: border-width, border-radius, border-style
- Visual effects: opacity, box-shadow (email-compatible properties only)
- Positioning: position, top, left, right, bottom (web mode only)

**Locked (cannot override):**
- Content: text, image URLs, link URLs, alt text
- Structure: number of nested items, component types
- Technical: IDs, keys, data binding references
- Accessibility: ARIA labels (same across devices)

**Blacklist Approach:** Maintain a blacklist of non-overridable properties rather than whitelist for easier extensibility.

### 17.4 User Interface

#### 17.4.1 Mode Switcher

**Location & Behavior:**
- Positioned above the center of the canvas (between toolbar and canvas)
- Sticky positioning: has natural position but sticks to top when scrolling
- Sticks below main toolbar (maintains UI hierarchy)
- Visual style: Toggle switch (Desktop ⟷ Mobile)

**Mode States:**
- **Desktop Mode** (default): Edit desktop base styles and layout
- **Mobile Mode**: Edit mobile overrides and layout

**Mode Switching Behavior:**
- Selected component remains selected when switching modes
- Canvas scroll position preserved
- PropertyPanel state (tabs, expanded sections) maintained
- Smooth transition animation (canvas width + background color/border change)
- Preload mobile data on hover (anticipatory loading)
- Show skeleton loading if data not yet loaded (graceful fallback)

**Default State:**
- Templates always open in Desktop mode
- Mobile mode is not persisted across sessions
- Consistent starting point for all editing sessions

#### 17.4.2 Canvas Behavior

**Desktop Mode Canvas:**
- Standard desktop width (from BreakpointManager or canvas settings)
- All components visible and editable
- Standard canvas background and styling
- Component dragging enabled from palette

**Mobile Mode Canvas:**
- Resized to mobile breakpoint width (from BreakpointManager, configurable)
- Vertical scrolling (height remains flexible)
- Visual distinction: different background color or border (configurable)
- Component dragging from palette disabled (structure locked)
- Hidden components displayed as ghosted/grayed out
- Mobile indicator badge (📱) on component selection outline when component has overrides

**Hidden Component Interaction:**
- Ghosted/grayed out appearance with reduced opacity
- Click reveals tooltip/popover: "Hidden in mobile" with quick "Show" button
- Can still be selected and edited (visibility can be toggled via PropertyPanel)

#### 17.4.3 Mobile Layout Manager

**Trigger:** Appears in sidebar when in Mobile Dev Mode with no component selected

**Replaces:** Components tab and General Styles tab (sidebar shows only Layout Manager)

**Purpose:** Manage mobile-specific component order and visibility

**UI Elements:**
- List of all template components
- Each item shows:
  - Component name
  - Drag handle for reordering
  - Visibility toggle (show/hide in mobile)
- Clean, minimal design - no thumbnails, icons, or badges
- Drag-and-drop to reorder components
- Reordering changes mobile component order only (desktop order unchanged)

**"Apply Mobile-Optimized Defaults" Button:**
- Appears in Mobile Layout Manager
- Applies comprehensive mobile optimizations:
  - Reduce padding/margin by configured percentage
  - Adjust font sizes for mobile readability
  - Enable wrapping on horizontal lists
  - Apply component-type-specific mobile behaviors
  - Set sensible mobile layouts
- Single undo-able command
- Can be applied anytime (not just first switch)

**First-Time Prompt:**
When user first switches to Mobile Dev Mode on a template:
- Modal prompt: "Apply mobile-optimized defaults to this template?"
- Two options:
  - "Apply Defaults" - Run comprehensive optimization
  - "Start from Desktop" - All mobile values inherit from desktop
- Fallback button remains in Mobile Layout Manager for later application

#### 17.4.4 PropertyPanel Integration

**When Component Selected in Mobile Dev Mode:**

**Content Tab:**
- Content editing disabled (content locked across devices)
- Show informational message: "Content is shared across all devices"

**Style Tab:**
- All CSS-controllable properties editable
- Inherited properties show chain icon (🔗) next to value
  - Example: "16px 🔗" indicates inherited from desktop
- Overridden properties show no indicator (clean display)
- Each property has small "X" or reset icon to clear override
- "Mobile Behavior" section for component-specific mobile controls
  - Lists: Mobile Layout dropdown (Wrap | Horizontal | Vertical)
  - Headers: Mobile navigation style (web mode only)
  - Other component-type-specific controls
- Global "Reset All Mobile Overrides" button at bottom of panel

**Property Reset Options:**

**Individual Property Reset:**
- Small "X" icon next to each overridden property
- Click to clear override and return to inherited value
- Single property-level control

**Global Reset:**
- "Reset All Mobile Overrides" button in PropertyPanel
- Opens confirmation dialog with two paths:
  1. **Quick Reset**: "Reset All" button - instant with single confirmation
  2. **Selective Reset**: "Choose What to Reset" button
     - Opens hierarchical selection UI with accordions:
       ```
       ☑ Header ⌄
         ☑ Styles ⌄
           ☑ Layout
           ☑ Spacing
           ☑ Typography
         ☐ Visibility
         ☐ Order
       ☑ Hero ⌄
         ☑ Styles ⌄
           ...
       ```
     - Bulk selection at any level (component, category, or individual property)
     - Preview of what will be reset before confirming

#### 17.4.5 Mobile vs Desktop Diff View

**Purpose:** Audit all mobile customizations in one view

**Access:** Button in main toolbar (🔍 "Show Differences" or similar)

**Presentation:**
- **Desktop screens**: Slides in as additional sidebar panel (PropertyPanel remains visible)
- **Mobile/tablet screens**: Replaces PropertyPanel temporarily

**Content:**
- Expandable hierarchical list showing all differences:
  ```
  ☐ Component Order (2 components reordered) ⌄
    • Hero moved from position 2 to position 1
    • Header moved from position 1 to position 2

  ☐ Hidden Components (1 component) ⌄
    • Sidebar component hidden in mobile

  ☐ Header (3 properties overridden) ⌄
    • Padding: 20px → 16px
    • Font Size: 24px → 20px
    • Layout: Horizontal → Stacked

  ☐ Hero (5 properties overridden) ⌄
    ...
  ```
- Starts collapsed (component-level summary)
- Click to expand and see property-level detail
- Color-coded badges for override categories
- Quick action buttons per component (Reset Component Overrides)

### 17.5 Component-Specific Mobile Controls

#### 17.5.1 Target Mode Awareness
Configuration: `target: 'web' | 'email' | 'hybrid'` (set at builder initialization)

**Email Mode:**
- Hide JavaScript-dependent controls (hamburger menus, interactive animations)
- Show only email-safe mobile behaviors
- Provide email-specific alternatives (stacked layouts vs interactive navigation)

**Web Mode:**
- Show all modern interaction controls
- Enable advanced CSS features (transforms, animations)
- Full JavaScript-powered behaviors available

**Hybrid Mode:**
- Show all controls
- Add warnings on email-incompatible features
- User can choose to use features understanding email limitations

#### 17.5.2 Component Types with Mobile-Specific Controls

**List Component:**
- "Mobile Layout" dropdown in Mobile Behavior section:
  - **Wrap**: Horizontal list wraps to multiple rows
  - **Horizontal**: Force side-by-side (scroll if needed)
  - **Vertical**: Stack items vertically

**Header Component:**
- "Mobile Navigation" dropdown (web mode only):
  - **Stacked**: Stack logo and navigation vertically
  - **Inline**: Keep horizontal (reduced spacing)
  - **Hidden**: Hide navigation, show logo only

**Extensibility:**
- Start with List and Header (layout-critical)
- Add more component-specific controls iteratively
- System designed to easily add mobile behaviors to any component type

### 17.6 Features

#### 17.6.1 Component Reordering

**Scope:** Top-level components only (canvas direct children)

**Desktop Mode:**
- Drag and drop components on canvas to reorder
- Changes desktop component order
- Reflected in `componentOrder.desktop` array

**Mobile Mode:**
- Reordering disabled on canvas (structure locked)
- Use Mobile Layout Manager in sidebar
- Drag and drop to reorder components in list
- Changes mobile component order only
- Reflected in `componentOrder.mobile` array
- If `componentOrder.mobile` is undefined, inherits desktop order

**Nested Components:**
- Cannot reorder nested items via canvas in any mode
- Reordering nested items happens through PropertyPanel
- Example: List items reordered through List component properties
- Consistent with existing architecture (top-level canvas interaction only)

#### 17.6.2 Component Visibility

**Per-Device Visibility Control:**
- Each component has visibility settings: `{ desktop: boolean, mobile: boolean }`
- Default: `{ desktop: true, mobile: true }` (visible everywhere)
- User can toggle visibility independently per device

**UI Controls:**
- Mobile Layout Manager: Visibility toggle per component
- PropertyPanel: Visibility settings in component properties

**Canvas Display:**
- Hidden components in current mode: ghosted/grayed with reduced opacity
- Hover tooltip: "Hidden in [device]"
- Click shows popover with quick "Show" button
- Can still select and edit hidden components

**Export Behavior:**
- Hidden components use `display: none` in media queries
- Also include `aria-hidden="true"` for accessibility
- Component HTML still present in export (CSS controls visibility)

#### 17.6.3 Property Overrides

**Override Mechanism:**
- In Mobile Dev Mode, editing a property creates/updates mobile override
- Override stored in `styles.mobile[propertyName]`
- Desktop value remains in `styles.desktop[propertyName]`

**Inheritance Resolution:**
Simple fallback:
1. Check `styles.mobile[propertyName]`
2. If undefined, use `styles.desktop[propertyName]`
3. If both undefined, use component type default

**Visual Indicators:**
- Inherited values: chain icon (🔗) next to value
- Overridden values: no indicator (standard display)
- Both appear in PropertyPanel inputs

**Reset Mechanism:**
- Per-property reset: "X" icon next to input
- Sets `styles.mobile[propertyName] = undefined`
- Value immediately updates to inherited desktop value
- Single undo-able action

#### 17.6.4 Mobile-Optimized Defaults

**Purpose:** Provide comprehensive mobile optimization as starting point

**Scope:** Opinionated and comprehensive (not just token changes)

**Default Transformation Rules:**
- Reduce padding by 50% (configurable)
- Reduce margin by 50% (configurable)
- Reduce font sizes by 10% (configurable)
- Enable wrapping on horizontal lists
- Stack headers vertically
- Make CTA buttons full-width
- Increase touch target sizes (min 44px)
- Component-type-specific optimizations

**Configuration:**
```typescript
mobileDefaults: {
  enabled: boolean;  // Enable/disable feature
  paddingReduction: number;  // 0.5 = 50% reduction
  marginReduction: number;
  fontSizeReduction: number;  // 0.9 = 10% reduction
  autoWrapHorizontalLists: boolean;
  componentSpecific: {
    [componentType: string]: {
      // Component-type-specific default overrides
    };
  };
};
```

**Application Behavior:**
- First-time prompt when entering Mobile Dev Mode
- User can choose to apply or skip
- Fallback button in Mobile Layout Manager for later application
- Single undo-able command (one entry in history)
- Can be re-applied anytime (overwrites existing mobile overrides)
- Users can inspect, modify, or revert the applied defaults

#### 17.6.5 Canvas Settings Overrides

**Scope:** Canvas settings also support mobile overrides

**Overridable Settings:**
- Canvas width / max-width
- Canvas background color
- Canvas padding
- Default typography (body text, headings)
- Default spacing (component gaps)

**Configuration:** Specify which canvas settings can be overridden

**UI Location:** General Styles tab when no component selected (Mobile Dev Mode)

#### 17.6.6 Nested Component Overrides

**Scope:** Nested components fully support mobile overrides

**Example:** List with 3 items - each item can have different mobile padding

**Mechanism:**
- Nested components have same `styles: { desktop, mobile }` structure
- Edited through PropertyPanel (not canvas)
- Full inheritance model applies at all nesting levels

**Limit:** No structural changes to nested items (add/remove/reorder happens in PropertyPanel for both modes)

### 17.7 Validation & Warnings

#### 17.7.1 Warning System

**Severity Levels:**
- **Info**: Helpful tips and suggestions (blue)
- **Warning**: Potential issues, but not blocking (yellow)
- **Critical**: Serious problems that may break layout (red)

**Display:**
- Immediate inline warnings (banners)
- Accumulated warnings in dedicated "Validation" panel (toggle open)
- Both systems work together (immediate feedback + comprehensive audit)

**Warning Types:**
- All components hidden in mobile
- Font size too small (< 14px for body text)
- Touch targets too small (< 44px for interactive elements)
- Padding/margin causing layout overflow
- Conflicting CSS properties
- Email-incompatible properties used (in email/hybrid mode)

**User Action:**
- Warnings are informational only (Option A: show but allow)
- User can proceed with export/test despite warnings
- Warnings do not block any actions

#### 17.7.2 Validation Panel

**Purpose:** Comprehensive validation report for mobile customizations

**Access:** Toggle button in toolbar or Mobile Layout Manager

**Content:**
- All validation warnings grouped by severity
- Component-level grouping
- Quick fix suggestions where applicable
- Link to documentation for each warning type
- "Fix All" button for auto-fixable issues (if applicable)

### 17.8 Export Behavior

#### 17.8.1 HTML Generation Strategy

**Default Export Mode: Desktop-First with Media Queries**

**Desktop Styles (Base):**
- Inline styles in HTML for maximum email client compatibility
- Desktop values applied as inline `style` attributes
- Example: `<div style="padding: 20px; background: #fff;">`

**Mobile Overrides (Media Queries):**
- Embedded in `<style>` tag within `<head>`
- Uses `@media (max-width: Xpx)` queries
- Only includes overridden properties
- Example:
  ```css
  @media (max-width: 768px) {
    #component-1 { padding: 16px; }
  }
  ```

**Component Order:**
- HTML elements exported in mobile order if `componentOrder.mobile` exists
- Desktop order used as fallback
- OR use CSS `order` property in flexbox layouts (web mode only)

**Component Visibility:**
- Hidden components include inline `display: block` (desktop default)
- Media query adds `display: none` for mobile
- Include `aria-hidden="true"` when hidden

**Email Client Compatibility:**
- **Outlook 2016-2021 (Windows Desktop)**:
  - Sees inline desktop styles (no media query support)
  - Desktop users get desktop version ✓
- **Outlook Mobile (iOS/Android)**:
  - Modern WebKit with media query support
  - Mobile users get mobile version ✓
- **Gmail, Apple Mail, Yahoo, etc.**:
  - Full media query support ✓

**Export Modes (Configurable):**
- **Hybrid** (default): Inline desktop + media queries for mobile
- **Web**: Modern CSS with media queries, flexbox, grid
- **Email-only**: Ultra-safe Outlook-focused (no responsive, just desktop)

#### 17.8.2 Export Configuration

```typescript
export: {
  mode: 'hybrid' | 'web' | 'email-only';
  mobileBreakpoint: number;  // From BreakpointManager
  inlineStyles: boolean;  // Inline desktop styles
  generateMediaQueries: boolean;  // Generate mobile media queries
  includeResponsive: boolean;  // Include mobile overrides in export
};
```

**Export from Mobile Dev Mode:**
- Always exports complete responsive HTML (both desktop + mobile)
- Current editing mode doesn't affect export content (only editing context)
- Export button behavior identical in both modes

### 17.9 Command Pattern & Undo/Redo

#### 17.9.1 Mode-Aware Commands

**Command Structure:**
All commands include `mode` parameter:
```typescript
interface Command {
  execute(): void;
  undo(): void;
  mode: 'desktop' | 'mobile';
}
```

**Example Commands:**
- `UpdateComponentStyleCommand`: Updates desktop or mobile styles based on mode
- `ReorderComponentsCommand`: Updates desktop or mobile order based on mode
- `ToggleComponentVisibilityCommand`: Updates visibility for specific mode
- `ApplyMobileDefaultsCommand`: Bulk application of mobile defaults

**Command Execution:**
- Command checks `mode` property
- Modifies appropriate data structure (`styles.desktop` vs `styles.mobile`)
- Stores original values for undo

#### 17.9.2 Separate Undo/Redo Stacks

**Implementation:**
- Desktop mode maintains its own command history
- Mobile mode maintains its own command history
- Switching modes does not clear history
- Each mode preserves its undo/redo stack

**Behavior:**
- In Desktop mode: Undo/Redo affects desktop changes only
- In Mobile mode: Undo/Redo affects mobile changes only
- Switching modes: Cannot undo across mode boundary
- Clear mental model: Each mode is its own editing session

**Example Scenario:**
1. Desktop mode: Change button padding to 20px
2. Switch to Mobile mode
3. Mobile mode: Change mobile padding to 16px
4. Undo in Mobile mode → Reverts mobile padding change (back to inherited 20px)
5. Switch to Desktop mode
6. Undo in Desktop mode → Reverts desktop padding change

### 17.10 Performance Optimizations

#### 17.10.1 Lazy Loading

**Mobile Data Loading:**
- Mobile overrides not loaded on initial template open
- Preload triggered on mode switcher hover (anticipatory loading)
- If not preloaded, load on mode switch with skeleton UI
- Subsequent switches use cached data

**Benefits:**
- Faster initial template load
- Reduced memory usage for desktop-only editing
- Smooth user experience with preloading

#### 17.10.2 Virtual Rendering

**Large Templates (50+ components):**
- Virtual scrolling in Mobile Layout Manager
- Virtual rendering on canvas for off-screen components
- Render only visible components + buffer
- Improves performance with many components

#### 17.10.3 Optimized Updates

**Property Changes:**
- Debounce property updates during rapid changes (default 16ms)
- Batch render mobile overrides
- Avoid unnecessary re-renders
- Performance monitoring for complex templates

**Optional Performance Mode:**
- Configurable performance mode for complex templates
- Reduces visual effects and animations
- Prioritizes responsiveness over polish

### 17.11 Keyboard Shortcuts

**Mode Switching:**
- `Ctrl/Cmd + M`: Toggle between Desktop and Mobile Dev Mode

**Mobile Dev Mode Shortcuts:**
- `Ctrl/Cmd + R`: Reset selected property override to desktop value
- `Ctrl/Cmd + L`: Open Mobile Layout Manager (when no component selected)
- `Ctrl/Cmd + Shift + R`: Open global reset dialog
- `Ctrl/Cmd + D`: Duplicate component (copies mobile overrides too)

**Standard Shortcuts (work in both modes):**
- `Ctrl/Cmd + Z`: Undo (mode-specific)
- `Ctrl/Cmd + Shift + Z` or `Ctrl/Cmd + Y`: Redo (mode-specific)
- `Delete`: Delete selected component
- `Esc`: Deselect component

### 17.12 Configuration System

#### 17.12.1 Builder Initialization Configuration

```typescript
interface MobileDevModeConfig {
  // Feature toggle
  enabled: boolean;  // Enable/disable Mobile Dev Mode entirely

  // Breakpoints
  breakpoints: {
    mobile: number;  // Mobile breakpoint width (default: 375)
    tablet?: number;  // Future: tablet breakpoint
    // Extensible for custom breakpoints
  };

  // Mode switcher
  modeSwitcher: {
    sticky: boolean;  // Enable sticky positioning (default: true)
    showLabels: boolean;  // Show "Desktop" / "Mobile" labels (default: true)
  };

  // Canvas appearance
  canvas: {
    mobileBackgroundColor?: string;  // Canvas background in mobile mode
    mobileBorderColor?: string;  // Canvas border in mobile mode
    transitionDuration: number;  // Mode switch animation duration (ms)
  };

  // Mobile-optimized defaults
  mobileDefaults: {
    enabled: boolean;  // Enable defaults feature
    showPromptOnFirstSwitch: boolean;  // Show prompt first time
    transformations: {
      paddingReduction: number;  // 0.5 = reduce by 50%
      marginReduction: number;
      fontSizeReduction: number;  // 0.9 = reduce by 10%
      autoWrapHorizontalLists: boolean;
      stackHeadersVertically: boolean;
      fullWidthButtons: boolean;
      minTouchTargetSize: number;  // Minimum touch target (px)
    };
    componentSpecific: {
      [componentType: string]: Partial<StyleProperties>;
    };
  };

  // Property overrides
  propertyBlacklist: string[];  // Properties that cannot be overridden
  canvasSettingsOverridable: string[];  // Canvas settings that can be overridden

  // Component-specific mobile controls
  componentMobileControls: {
    [componentType: string]: {
      enabled: boolean;
      controls: MobileControlDefinition[];
    };
  };

  // Validation
  validation: {
    enabled: boolean;
    rules: ValidationRule[];
    showInlineWarnings: boolean;
    showValidationPanel: boolean;
  };

  // Export
  export: {
    defaultMode: 'hybrid' | 'web' | 'email-only';
    mobileBreakpoint: number;  // Media query breakpoint
    inlineStyles: boolean;
    generateMediaQueries: boolean;
  };

  // Performance
  performance: {
    lazyLoadMobileData: boolean;
    preloadOnHover: boolean;
    virtualRendering: boolean;
    virtualRenderingThreshold: number;  // Component count threshold
    debounceDelay: number;  // Property update debounce (ms)
  };

  // Target mode awareness
  targetMode: 'web' | 'email' | 'hybrid';
}
```

#### 17.12.2 Default Configuration

Sensible defaults provided for all configuration options. Integrators can override any subset without providing full configuration object.

#### 17.12.3 Runtime Configuration Updates

- Configuration can be updated at runtime via Builder API
- `builder.updateConfig({ mobileDevMode: { ... } })`
- Useful for dynamic feature toggling or user preferences

### 17.13 Integration with Existing Features

#### 17.13.1 Style Presets System

**Behavior:**
- Applying a preset sets desktop values only
- Mobile overrides start as inherited (no mobile values in preset)
- User must manually customize mobile after applying preset

**Rationale:**
- Keeps presets simple and focused
- Desktop-first approach (preset is the base)
- User explicitly controls mobile customization

#### 17.13.2 Preview System

**Relationship:**
- PreviewModal remains separate from Mobile Dev Mode
- Preview is for viewing, Dev Mode is for editing
- Preview shows final rendered output (Canvas HTML → Preview HTML transformation)

**Preview from Mobile Dev Mode:**
- Preview button available in both modes
- Shows appropriate preview based on current mode:
  - Desktop mode → Web/Email preview (desktop rendering)
  - Mobile mode → Mobile preview (mobile rendering)
- Preview uses exported HTML (with media queries, email-safe)

#### 17.13.3 Email Testing Integration

**Testing from Mobile Dev Mode:**
- "Test in Email Clients" button available in both modes
- Default behavior: Test responsive version (with media queries)
- Configuration option: `emailTesting.mobileTestMode`
  - `'responsive'` (default): Single test with media queries
  - `'desktop-only'`: Test only desktop version
  - `'mobile-only'`: Test only mobile version
  - `'separate'`: Test both as separate campaigns (if service supports)

#### 17.13.4 Data Injection System

**Current State:**
- Content is locked across devices (no mobile-specific content)
- Template variables (`{{variable}}`) resolve identically in both modes

**Future Consideration:**
- Conditional content feature (device-specific content)
- Would require extending data injection syntax
- Example: `{{#if mobile}}Mobile content{{else}}Desktop content{{/if}}`
- Architecture designed to accommodate this future enhancement

#### 17.13.5 Visual Property Feedback System

**Behavior in Mobile Dev Mode:**
- Visual feedback (measurement overlays, highlights) shown on mobile canvas
- Uses mobile values for feedback display
- Hover on property → show mobile dimensions/spacing
- Consistent with editing context (show what you're editing)

#### 17.13.6 Compatibility System

**Integration:**
- Compatibility indicators work in both modes
- Show same email client compatibility data
- Mobile-specific properties (like wrap behavior) have their own compatibility data
- Warnings adjust based on properties used in each mode

#### 17.13.7 Custom Components

**Automatic Support:**
- Custom components automatically support mobile overrides
- Same `styles: { desktop, mobile }` structure applies
- No manual configuration needed from custom component creators
- Mobile-specific controls can be optionally added per component type

**Configuration:**
- Custom components can define mobile-specific control definitions
- Optional: specify default mobile transformations for component type

### 17.14 Extensibility

#### 17.14.1 Additional Breakpoints

**Design for Future:**
- System designed to support multiple breakpoints (tablet, custom)
- Data structure supports: `styles: { desktop, tablet, mobile, custom1, custom2 }`
- Mode switcher can expand: Desktop | Tablet | Mobile
- Configuration allows defining custom breakpoint names and widths

**Initial Implementation:**
- Desktop + Mobile only
- Foundation for additional breakpoints in place

#### 17.14.2 Custom Property Types

**Extensibility:**
- Property blacklist allows adding non-overridable properties
- Component-specific mobile controls can be added dynamically
- System supports custom property definitions beyond standard CSS

#### 17.14.3 Advanced Features (Future)

**Conditional Content:**
- Device-specific content (beyond just styling)
- Would extend data injection system
- Architecture accommodates future enhancement

**Device Preview Frames:**
- Optional device frame/bezel around canvas
- Multiple device presets (iPhone, Android, iPad)
- Currently simple resize, but extensible

**AI-Powered Optimization:**
- Analyze desktop layout and suggest mobile optimizations
- Auto-generate mobile overrides using ML
- Foundation in place with mobile defaults system

### 17.15 Error Handling

#### 17.15.1 Corrupted Data Recovery

**Error Types:**
- Invalid mobile override data
- Corrupted component order arrays
- Missing component references in mobile order

**Recovery Strategy:**
- Fall back to desktop values (Option D: fallback + notification)
- Attempt auto-fix where possible:
  - Remove invalid component IDs from mobile order
  - Sanitize invalid CSS values
  - Merge corrupt style objects
- Show error notification with details
- Allow user to continue editing (non-blocking)

**Logging:**
- Log all data errors for debugging
- Provide export of problematic template data
- Help users report issues with full context

#### 17.15.2 Invalid Layout States

**Detection:**
- All components hidden in mobile (Warning, not blocking)
- Component order references non-existent components (Auto-fix)
- Circular dependencies in nested overrides (Should not occur, but detect)

**Handling:**
- Show appropriate warning severity
- Provide "Fix" actions where applicable
- Allow user to proceed (trust user intent)

### 17.16 Accessibility

#### 17.16.1 Standard Accessibility

**Mode Switcher:**
- Keyboard accessible (Tab to focus, Enter/Space to toggle)
- ARIA labels: "Switch to Mobile Development Mode" / "Switch to Desktop Mode"
- Focus management on mode switch

**Mobile Layout Manager:**
- Keyboard navigation for component list
- Drag and drop accessible via keyboard (Space to grab, Arrow keys to move, Space to drop)
- Screen reader announces reorder actions

**PropertyPanel:**
- All controls keyboard accessible
- Chain icon for inherited properties has accessible label
- Reset buttons have clear ARIA labels

**Canvas:**
- Hidden components have appropriate ARIA attributes
- Mode changes announced to screen readers
- Focus management maintained across mode switches

#### 17.16.2 Mode-Specific Announcements

**For Now (Option A):**
- Apply standard accessibility patterns (same as desktop mode)
- No enhanced mode-specific announcements initially

**Future Enhancement:**
- ARIA live regions announce mode switches
- Screen reader descriptions differentiate desktop vs mobile controls
- Enhanced announcements for mobile-specific actions

### 17.17 Documentation

#### 17.17.1 In-UI Documentation

**Minimal In-UI Hints:**
- Tooltips on mobile-specific controls explaining behavior
- Info icons linking to external documentation
- Onboarding tour for first-time Mobile Dev Mode users (optional)

**External Documentation:**
- Comprehensive mobile development guide
- Best practices for mobile email design
- Component-specific mobile optimization tips
- Video tutorials for key workflows

#### 17.17.2 Help Resources

**Contextual Help:**
- "?" icons on complex controls
- Links to relevant documentation sections
- Examples and common patterns

**External Resources:**
- Mobile email design best practices guide
- Email client compatibility information
- Troubleshooting guide for common issues

### 17.18 Testing

#### 17.18.1 Manual Testing Checklist

**Core Functionality:**
- [ ] Mode switching works (Desktop ⟷ Mobile)
- [ ] Canvas resizes and style changes on mode switch
- [ ] Component selection preserved across mode switches
- [ ] PropertyPanel shows inherited vs overridden properties correctly
- [ ] Property overrides save and load correctly
- [ ] Reset individual property works
- [ ] Reset all overrides works
- [ ] Mobile Layout Manager reordering works
- [ ] Component visibility toggle works
- [ ] Hidden components display as ghosted
- [ ] Mobile-optimized defaults apply correctly
- [ ] Diff view shows all changes accurately
- [ ] Export generates correct responsive HTML
- [ ] Undo/Redo works independently per mode

**UI/UX:**
- [ ] Mode switcher sticky behavior works
- [ ] Animations smooth (mode switch, property changes)
- [ ] Loading states show during lazy load
- [ ] Keyboard shortcuts work
- [ ] Accessibility: keyboard navigation works
- [ ] Validation warnings appear appropriately
- [ ] Mobile indicator badge appears on components with overrides

**Integration:**
- [ ] Email testing works from Mobile Dev Mode
- [ ] Preview shows correct mobile rendering
- [ ] Style presets don't interfere with mobile overrides
- [ ] Data injection resolves correctly in both modes
- [ ] Visual feedback shows mobile values in Mobile Dev Mode
- [ ] Compatibility indicators work in both modes

**Edge Cases:**
- [ ] Large templates (50+ components) perform well
- [ ] Nested component overrides work correctly
- [ ] Canvas settings overrides work
- [ ] Corrupted template data recovers gracefully
- [ ] All components hidden warning shows
- [ ] Invalid CSS values handled

#### 17.18.2 Automated Testing

**Unit Tests:**
- Property inheritance resolution
- Command pattern mode awareness
- Data structure serialization/deserialization
- Validation rule execution
- Mobile defaults transformation logic

**Integration Tests:**
- Mode switching workflow
- Property override CRUD operations
- Component reordering
- Export HTML generation with media queries
- Undo/Redo across mode switches

**E2E Tests:**
- Complete mobile customization workflow
- Apply defaults → customize → export → test
- Reset overrides workflow
- Diff view workflow

### 17.19 Success Criteria

#### 17.19.1 Functional Requirements
- [ ] Users can switch between Desktop and Mobile Dev Mode seamlessly
- [ ] All CSS-controllable properties support mobile overrides
- [ ] Component reordering works independently per mode
- [ ] Component visibility can be toggled per device
- [ ] Mobile-optimized defaults apply comprehensive optimizations
- [ ] Property inheritance works (clear override → inherit desktop value)
- [ ] Export generates desktop-first responsive HTML with media queries
- [ ] Undo/Redo works independently per mode
- [ ] Diff view shows all mobile customizations accurately
- [ ] Validation warnings help users avoid problematic configurations
- [ ] Mobile Layout Manager provides clean reordering interface
- [ ] Nested components support mobile overrides
- [ ] Canvas settings support mobile overrides

#### 17.19.2 User Experience Requirements
- [ ] Mode switching feels smooth and intuitive
- [ ] Inherited properties clearly indicated with chain icon
- [ ] Hidden components visible but ghosted on canvas
- [ ] Mobile indicator badge shows which components have overrides
- [ ] First-time prompt helps users get started with defaults
- [ ] Reset options provide both quick and granular control
- [ ] Keyboard shortcuts improve workflow efficiency
- [ ] Large templates remain performant (virtual rendering works)
- [ ] Visual feedback works correctly in Mobile Dev Mode

#### 17.19.3 Technical Requirements
- [ ] Data structure supports extensibility (additional breakpoints)
- [ ] Configuration system provides full control over feature
- [ ] Command pattern properly mode-aware
- [ ] Lazy loading reduces initial load time
- [ ] Export HTML compatible with all major email clients
- [ ] TypeScript strict mode compliant
- [ ] Comprehensive error handling and recovery
- [ ] No performance degradation with mobile overrides

#### 17.19.4 Integration Requirements
- [ ] Works with existing style preset system
- [ ] Works with existing preview system
- [ ] Works with existing email testing integration
- [ ] Works with existing data injection system
- [ ] Works with existing visual property feedback system
- [ ] Works with existing compatibility system
- [ ] Works with future custom components system

#### 17.19.5 Documentation Requirements
- [ ] Comprehensive feature documentation
- [ ] Configuration reference
- [ ] Best practices guide for mobile optimization
- [ ] Component-specific mobile behavior documentation
- [ ] API documentation for programmatic access
- [ ] Migration guide for existing templates

## 18. Enhanced Component Customization Properties

### 18.1 Overview

Based on analysis of leading email builders (Elastic Email, Mailchimp, SalesManago, Tabular, Stripo, Beefree), this section defines enhanced customization properties for existing components. **Priority is on making existing components more customizable** before adding new components.

### 18.1.1 Email-First Prioritization

**IMPORTANT**: Email component development is the **immediate priority** for production deployment. Web page builder features are planned for Q3 2026.

**Priority Framework**:
- **PHASE 1 - EMAIL CRITICAL**: Features with ✓ full/excellent email support that are essential for email marketing
- **PHASE 2 - EMAIL IMPORTANT**: Features with ✓ good email support that enhance email campaigns
- **PHASE 3 - WEB-FOCUSED**: Features with ✗ limited/no email support (web-only or requires fallbacks)

**Email Compatibility Legend**:
- ✓ **Good/Excellent** - Works across all major email clients including Outlook
- ⚠ **Limited** - Works in modern webmail clients (Gmail, Apple Mail) but limited in Outlook
- ✗ **Not Supported** - Web-only feature, requires email fallback strategy

All prioritization decisions in this document are based on email client compatibility first.

### 18.2 Cross-Component Property Enhancements

These properties should be available across **all components** where applicable:

#### 18.2.1 Advanced Spacing Controls

**Current State**: Basic padding control with unified values
**Enhancement**: Granular spacing control per side

**New Properties**:
- `styles.padding.top` - Top padding (CSSValue)
- `styles.padding.right` - Right padding (CSSValue)
- `styles.padding.bottom` - Bottom padding (CSSValue)
- `styles.padding.left` - Left padding (CSSValue)
- `styles.padding.lock` - Lock/unlock unified padding (boolean)
- `styles.margin.top` - Top margin (CSSValue)
- `styles.margin.right` - Right margin (CSSValue)
- `styles.margin.bottom` - Bottom margin (CSSValue)
- `styles.margin.left` - Left margin (CSSValue)
- `styles.margin.lock` - Lock/unlock unified margin (boolean)

**UI/UX**:
- Visual padding/margin editor with lock icon (like Figma)
- Click lock to apply value to all sides uniformly
- Unlock for individual side control
- Email compatibility: ✓ Full support

**Priority**: **HIGH** - Fundamental control expected in modern builders

---

#### 18.2.2 Enhanced Border Controls

**Current State**: Unified border properties
**Enhancement**: Per-side border control and advanced styling

**New Properties**:
- `styles.border.top` - Top border (width, style, color)
- `styles.border.right` - Right border
- `styles.border.bottom` - Bottom border
- `styles.border.left` - Left border
- `styles.border.lock` - Lock/unlock unified border (boolean)
- `styles.borderRadius.topLeft` - Top-left corner radius (CSSValue)
- `styles.borderRadius.topRight` - Top-right corner radius
- `styles.borderRadius.bottomRight` - Bottom-right corner radius
- `styles.borderRadius.bottomLeft` - Bottom-left corner radius
- `styles.borderRadius.lock` - Lock/unlock unified radius (boolean)

**Additional Border Styles**:
- `groove` - 3D grooved border
- `ridge` - 3D ridged border
- `inset` - 3D inset border
- `outset` - 3D outset border

**UI/UX**:
- Visual border editor showing all sides
- Individual corner radius controls
- Border style preview in dropdown

**Email Compatibility**:
- ✓ Basic border styles (solid, dashed, dotted, double)
- ⚠ 3D styles (groove, ridge, inset, outset) limited in Outlook
- ⚠ Individual corner radius limited in Outlook 2016-2021

**Priority**: **HIGH** - Requested feature for design flexibility

---

#### 18.2.3 Advanced Typography Controls

**Current State**: Basic font properties (family, size, weight, color)
**Enhancement**: Professional typography controls

**New Properties for All Text-Containing Components**:

**Character Spacing**:
- `styles.letterSpacing` - Space between characters (CSSValue with px, em, rem)
- `styles.wordSpacing` - Space between words (CSSValue)

**Text Effects**:
- `styles.textShadow` - Text shadow configuration
  - `offsetX` (CSSValue)
  - `offsetY` (CSSValue)
  - `blurRadius` (CSSValue)
  - `color` (string)
- `styles.textStroke` - Text outline (web mode only)
  - `width` (CSSValue)
  - `color` (string)

**Advanced Text Formatting**:
- `styles.textIndent` - First line indent (CSSValue)
- `styles.whiteSpace` - Whitespace handling (normal, nowrap, pre, pre-wrap)
- `styles.verticalAlign` - Vertical alignment (baseline, top, middle, bottom, sub, super)

**Web Typography** (Web mode only):
- `styles.fontVariant` - Font variant (normal, small-caps)
- `styles.fontStretch` - Font stretch (normal, condensed, expanded, etc.)
- `styles.textRendering` - Text rendering optimization (auto, optimizeSpeed, optimizeLegibility, geometricPrecision)

**Email Compatibility**:
- ✓ Letter-spacing: Good support (Outlook 2016+ partial)
- ⚠ Text shadow: Limited (no Outlook Windows desktop support)
- ✗ Text stroke: Web only
- ✓ Text indent: Good support
- ✓ Vertical align: Good support

**Priority**: **MEDIUM** - Professional typography is important for brand consistency

---

#### 18.2.4 Advanced Color Controls

**Current State**: Simple color pickers
**Enhancement**: Advanced color options with transparency

**New Properties**:
- `styles.opacity` - Element opacity (0-1 or 0-100%)
- Color format support:
  - Hex: `#RRGGBB`
  - Hex with alpha: `#RRGGBBAA`
  - RGB: `rgb(r, g, b)`
  - RGBA: `rgba(r, g, b, a)`
  - HSL: `hsl(h, s%, l%)`
  - HSLA: `hsla(h, s%, l%, a)`

**Gradient Support** (Web mode only):
- `styles.backgroundGradient` - Gradient configuration
  - `type` - linear, radial, conic
  - `angle` - Gradient angle for linear
  - `stops` - Array of color stops with position

**UI/UX**:
- Color picker with opacity slider
- Gradient builder interface (visual editor)
- Recent/saved colors palette
- Brand color palette integration

**Email Compatibility**:
- ⚠ Opacity: Limited in Outlook (some support via filters)
- ✗ Gradients: Very limited (use fallback solid colors)

**Priority**: **MEDIUM** - Opacity is important, gradients are nice-to-have

---

#### 18.2.5 Shadow Effects

**Current State**: No shadow support
**Enhancement**: Box shadow for depth and emphasis

**New Properties**:
- `styles.boxShadow` - Box shadow configuration (array for multiple shadows)
  - `offsetX` (CSSValue)
  - `offsetY` (CSSValue)
  - `blurRadius` (CSSValue)
  - `spreadRadius` (CSSValue)
  - `color` (string with alpha support)
  - `inset` (boolean)

**Preset Shadow Options**:
- None (default)
- Subtle - Small soft shadow
- Medium - Standard card shadow
- Large - Elevated card shadow
- Extra Large - Modal/dialog shadow
- Custom - User-defined values

**UI/UX**:
- Shadow preset selector
- Visual shadow editor with live preview
- Multiple shadow layers support

**Email Compatibility**:
- ✗ Box shadow: Not supported in Outlook Windows desktop
- ✓ Good support in Gmail, Apple Mail, Yahoo, webmail clients
- Provide fallback: Solid border or no shadow

**Priority**: **LOW** - Nice visual enhancement but limited email support

---

#### 18.2.6 Size & Dimension Controls

**Current State**: Basic width/height
**Enhancement**: Advanced sizing options

**New Properties**:
- `styles.minWidth` - Minimum width (CSSValue)
- `styles.maxWidth` - Maximum width (CSSValue)
- `styles.minHeight` - Minimum height (CSSValue)
- `styles.maxHeight` - Maximum height (CSSValue)
- `styles.aspectRatio` - Aspect ratio (e.g., "16:9", "4:3", "1:1")

**Box Sizing**:
- `styles.boxSizing` - Box sizing model (content-box, border-box)

**Email Compatibility**:
- ✓ Min/max width: Good support
- ⚠ Min/max height: Limited in some email clients
- ✗ Aspect ratio: CSS property too new for email

**Priority**: **MEDIUM** - Max-width especially important for responsive emails

---

#### 18.2.7 Conditional Visibility

**Current State**: Device visibility (desktop/mobile) via Mobile Dev Mode
**Enhancement**: Additional visibility conditions

**New Properties**:
- `content.visibilityConditions` - Array of visibility rules
  - `type` - device, breakpoint, data-condition
  - `rule` - Specific condition (e.g., "mobile", ">768px", "{{user.premium}}")
  - `show` - Show (true) or hide (false) when condition met

**Use Cases**:
- Show content only for premium users
- Display based on user preferences
- Conditional content for A/B testing
- Show/hide based on custom data fields

**Email Compatibility**:
- ✓ Device-based: Media queries supported
- ⚠ Data-based: Requires server-side processing before send

**Priority**: **LOW** - Advanced feature, implement after core enhancements

---

### 18.3 Component-Specific Property Enhancements

#### 18.3.1 Button Component Enhancements

**Current Properties**: 18 properties (content + styles)
**New Properties**: +12 properties

**Icon Enhancements**:
- `content.iconSize` - Icon size (CSSValue, default inherits font size)
- `content.iconColor` - Icon color override (separate from text color)
- `content.iconHoverColor` - Icon hover color

**Advanced Styling**:
- `styles.minWidth` - Minimum button width (for consistency)
- `styles.maxWidth` - Maximum button width (prevent stretching)
- `styles.textTransform` - Text transform (none, uppercase, lowercase, capitalize)
- `styles.letterSpacing` - Button text letter spacing
- `styles.boxShadow` - Button shadow (array of shadows)
- `styles.hoverBoxShadow` - Hover shadow effect
- `styles.transition` - Transition timing (duration, easing) for hover effects

**Full Width Option**:
- `styles.fullWidth` - Make button full width of container (boolean)
- `styles.fullWidthMobile` - Full width on mobile only (boolean)

**Advanced States** (Web mode only):
- `styles.activeBackgroundColor` - Active/pressed state background
- `styles.activeBorderColor` - Active/pressed state border
- `styles.disabledOpacity` - Disabled state opacity

**Email Compatibility**:
- ✓ Min/max width: Good support
- ✓ Text transform, letter spacing: Good support
- ✗ Box shadow: Limited (Outlook Windows)
- ⚠ Hover effects: Limited interactivity in email
- **Solution**: Use "bulletproof button" pattern for maximum compatibility

**New Presets**:
- Ghost (outlined with transparent background)
- Pill (fully rounded corners)
- Gradient (web mode only)
- 3D Raised (with shadow)

**Priority**: **HIGH** - Buttons are critical CTA elements

---

#### 18.3.2 Text Component Enhancements

**Current Properties**: 12 properties
**New Properties**: +8 properties

**Advanced Typography**:
- `styles.textIndent` - First line indent
- `styles.textShadow` - Text shadow effect
- `styles.wordSpacing` - Space between words
- `styles.whiteSpace` - Whitespace handling
- `styles.overflow` - Text overflow behavior (visible, hidden, ellipsis)
- `styles.textOverflow` - Text overflow style (clip, ellipsis)
- `styles.maxLines` - Maximum number of lines (with ellipsis)

**List Styling** (when content type is list):
- `styles.listStyleType` - List marker type (disc, circle, square, decimal, etc.)
- `styles.listStylePosition` - List marker position (inside, outside)

**Drop Cap** (Web mode only):
- `content.enableDropCap` - Enable drop cap on first letter
- `styles.dropCapSize` - Drop cap size multiplier
- `styles.dropCapColor` - Drop cap color

**Email Compatibility**:
- ✓ Text indent, word spacing: Good support
- ⚠ Text shadow: Limited (no Outlook Windows)
- ✗ Text overflow ellipsis: Very limited in email
- ✓ List styling: Good support

**Priority**: **MEDIUM** - Text component is heavily used

---

#### 18.3.3 Image Component Enhancements

**Current Properties**: 14 properties
**New Properties**: +15 properties

**Advanced Image Properties**:
- `content.caption` - Image caption text (displayed below image)
- `content.loading` - Loading strategy (lazy, eager, auto)
- `content.decoding` - Decoding hint (async, sync, auto)
- `content.srcset` - Responsive image sources (array of {url, descriptor})
- `content.sizes` - Sizes attribute for responsive images

**Image Styling**:
- `styles.filter` - CSS filters (grayscale, blur, brightness, contrast, etc.)
  - `grayscale` (0-100%)
  - `blur` (px)
  - `brightness` (0-200%)
  - `contrast` (0-200%)
  - `saturate` (0-200%)
  - `sepia` (0-100%)
  - `hueRotate` (0-360deg)
- `styles.boxShadow` - Image shadow
- `styles.border` - Image border (per-side support)
- `styles.borderRadius` - Corner rounding (per-corner support)
- `styles.opacity` - Image opacity

**Image Effects** (Web mode only):
- `styles.transform` - Image transforms (rotate, scale, skew)
- `styles.clipPath` - Custom clipping paths (circle, polygon, etc.)
- `styles.mixBlendMode` - Blend mode with background

**Overlay Support**:
- `content.overlay` - Image overlay configuration
  - `enabled` (boolean)
  - `color` (color with alpha)
  - `opacity` (0-1)
  - `blendMode` (multiply, overlay, darken, lighten, etc.)

**Caption Styling**:
- `styles.captionFontFamily` - Caption font
- `styles.captionFontSize` - Caption size
- `styles.captionColor` - Caption color
- `styles.captionAlign` - Caption alignment

**Email Compatibility**:
- ✓ Alt text, lazy loading: Good support
- ⚠ Srcset: Limited (some modern clients)
- ✗ CSS filters: Not supported in email
- ⚠ Border radius: Limited in Outlook 2016-2021
- ✓ Caption via table structure: Good support

**Priority**: **HIGH** - Images are core content elements

---

#### 18.3.4 Header Component Enhancements

**Current Properties**: 12 properties
**New Properties**: +10 properties

**Logo/Image Enhancements**:
- `content.image.caption` - Logo/image alt text (accessibility)
- `content.image.retina` - Retina/2x image URL
- `styles.imageBorder` - Logo border styling
- `styles.imageBorderRadius` - Logo border radius
- `styles.imageBoxShadow` - Logo shadow

**Navigation Enhancements**:
- `content.navigationAlignment` - Navigation alignment (left, center, right, space-between)
- `styles.navigationPadding` - Padding around navigation area
- `styles.navigationBackgroundColor` - Navigation background (separate from header)
- `styles.linkActiveColor` - Active link color
- `styles.linkUnderlineStyle` - Link underline (none, always, hover-only)
- `styles.linkUnderlineThickness` - Underline thickness
- `styles.mobileBehavior` - Mobile navigation behavior (stack, inline, hamburger, hidden)

**Sticky Header** (Web mode only):
- `content.sticky` - Enable sticky header (boolean)
- `styles.stickyOffset` - Offset from top when sticky

**Divider/Border**:
- `content.showDivider` - Show bottom divider (boolean)
- `styles.dividerColor` - Divider color
- `styles.dividerThickness` - Divider thickness
- `styles.dividerStyle` - Divider style (solid, dashed, dotted)

**Email Compatibility**:
- ✓ Logo, navigation links: Full support
- ✗ Sticky header: Web only
- ✗ Hamburger menu: Web only (use stacked for email)
- ✓ Divider: Full support

**New Layouts**:
- **logo-left-nav-right**: Logo left, navigation right (common pattern)
- **logo-center-nav-below**: Centered logo, navigation below
- **full-width-background**: Header with full-width colored background

**Priority**: **HIGH** - Header customization is critical for branding

---

#### 18.3.5 Footer Component Enhancements

**Current Properties**: 13 properties
**New Properties**: +12 properties

**Layout Options**:
- `content.layout` - Footer layout (single-column, two-column, three-column, four-column)
- `content.alignment` - Footer content alignment (left, center, right)

**Divider Support**:
- `content.showDivider` - Show top divider (boolean)
- `styles.dividerColor` - Divider color
- `styles.dividerThickness` - Divider thickness
- `styles.dividerStyle` - Divider style

**Social Link Enhancements**:
- `content.socialLinkStyle` - Social icon style (icon-only, icon-with-label, label-only)
- `styles.socialIconShape` - Icon shape (circle, square, rounded-square)
- `styles.socialIconBackground` - Icon background color
- `styles.socialIconBorder` - Icon border
- `styles.socialIconPadding` - Padding inside icon container

**Unsubscribe/Legal**:
- `content.unsubscribeText` - Unsubscribe link text (required for email compliance)
- `content.unsubscribeUrl` - Unsubscribe URL placeholder (e.g., `{{unsubscribe_url}}`)
- `styles.unsubscribeFontSize` - Unsubscribe text size
- `styles.unsubscribeColor` - Unsubscribe text color

**Multi-Column Footer**:
- `content.columns` - Array of footer columns
  - Each column: heading, links[], content
- `styles.columnGap` - Gap between columns
- `styles.columnAlignment` - Column content alignment

**Email Compatibility**:
- ✓ Multi-column layouts: Use table structure
- ✓ Social icons: Full support
- ✓ Unsubscribe link: Required, full support
- ⚠ Icon shapes: Use images for circle/rounded shapes

**Priority**: **HIGH** - Footer is required for email compliance

---

#### 18.3.6 Hero Component Enhancements

**Current Properties**: 14 properties
**New Properties**: +14 properties

**Background Enhancements**:
- `content.backgroundType` - Background type (color, image, gradient, video)
- `content.backgroundVideo` - Background video URL (web mode only)
- `content.backgroundVideoPoster` - Video poster image (fallback for email)
- `styles.backgroundPosition` - Background image position (top, center, bottom, custom)
- `styles.backgroundSize` - Background size (cover, contain, custom)
- `styles.backgroundRepeat` - Background repeat (no-repeat, repeat, repeat-x, repeat-y)
- `styles.backgroundAttachment` - Background attachment (scroll, fixed) - web only

**Overlay Enhancements**:
- `styles.overlayGradient` - Gradient overlay (instead of solid color)
- `styles.overlayBlur` - Background blur effect (web mode only)

**Content Positioning**:
- `styles.contentVerticalAlign` - Vertical alignment (top, center, bottom)
- `styles.contentHorizontalAlign` - Horizontal alignment (left, center, right)
- `styles.contentPadding` - Padding around content area
- `styles.minHeight` - Minimum hero height (CSSValue)

**CTA Button Enhancements**:
- `content.secondaryButton` - Optional secondary button
- `content.buttonLayout` - Button layout (stacked, horizontal)
- `styles.buttonGap` - Gap between buttons

**Parallax** (Web mode only):
- `content.parallax` - Enable parallax scrolling effect (boolean)
- `styles.parallaxSpeed` - Parallax scroll speed (0-1)

**Email Compatibility**:
- ✓ Background image: Good support (with VML for Outlook)
- ✗ Background video: Web only (use poster as fallback)
- ⚠ Overlay: Good support with opacity
- ✗ Parallax: Web only
- ✗ Background blur: Web only

**Priority**: **HIGH** - Hero is a primary conversion component

---

#### 18.3.7 List Component Enhancements

**Current Properties**: 17 properties
**New Properties**: +11 properties

**Grid Layout**:
- `content.gridColumns` - Number of columns for grid layout (1-6)
- `content.gridGap` - Gap between grid items (row and column)
- `styles.gridAutoFlow` - Grid auto flow (row, column, dense)

**Item Styling Enhancements**:
- `styles.itemBoxShadow` - Shadow on list items
- `styles.itemBorderRadius` - Item corner rounding
- `styles.itemHoverBackgroundColor` - Item hover background (web)
- `styles.itemHoverTransform` - Item hover transform (web, e.g., scale(1.05))

**Image Enhancements**:
- `styles.imageAspectRatio` - Enforce aspect ratio for item images
- `styles.imageObjectFit` - How image fits container (cover, contain, fill)
- `styles.imageBorderRadius` - Item image corner rounding

**Typography Control**:
- `styles.titleFontFamily` - Title font family override
- `styles.titleTextTransform` - Title text transform
- `styles.descriptionMaxLines` - Max lines before truncation (web)

**Carousel Mode** (Web mode only):
- `content.carouselMode` - Enable carousel/slider mode (boolean)
- `content.autoplay` - Autoplay carousel (boolean)
- `content.autoplayInterval` - Autoplay interval (ms)

**Email Compatibility**:
- ✓ Grid layout: Use table structure
- ⚠ Box shadow: Limited in Outlook
- ✗ Hover effects: Web only
- ✗ Carousel: Web only (display all items in email)
- ✓ Image aspect ratio: Via fixed dimensions

**Priority**: **HIGH** - List/grid components are very common

---

#### 18.3.8 Call to Action (CTA) Component Enhancements

**Current Properties**: 12 properties
**New Properties**: +10 properties

**Background Enhancements**:
- `content.backgroundType` - Background type (color, image, gradient)
- `content.backgroundImage` - Background image URL
- `styles.backgroundPosition` - Background position
- `styles.backgroundSize` - Background size
- `styles.backgroundOverlay` - Overlay configuration

**Border & Visual**:
- `styles.border` - CTA container border (per-side)
- `styles.borderRadius` - Corner rounding
- `styles.boxShadow` - Container shadow

**Icon Support**:
- `content.icon` - Icon above/beside heading
- `content.iconPosition` - Icon position (top, left, right)
- `styles.iconSize` - Icon size
- `styles.iconColor` - Icon color

**Button Arrangement**:
- `content.buttonStack` - Stack buttons vertically on mobile (boolean)
- `styles.buttonAlignment` - Button alignment (left, center, right)
- `styles.buttonFullWidthMobile` - Full-width buttons on mobile

**Countdown Timer** (Advanced):
- `content.showCountdown` - Enable countdown timer (boolean)
- `content.countdownEndDate` - End date/time for countdown
- `styles.countdownPosition` - Position (above-heading, below-heading, above-buttons)

**Email Compatibility**:
- ✓ Background image: Good support
- ⚠ Box shadow: Limited in Outlook
- ✗ Countdown timer: Requires dynamic images/external service
- ✓ Icons: Use image-based icons

**Priority**: **HIGH** - CTA is conversion-critical

---

#### 18.3.9 Separator Component Enhancements

**Current Properties**: 4 properties
**New Properties**: +8 properties

**Visual Enhancements**:
- `content.pattern` - Separator pattern (solid, dashed, dotted, double, wave, zigzag)
- `content.icon` - Optional icon in center of separator
- `styles.gradient` - Gradient separator (array of color stops)
- `styles.shadow` - Separator shadow effect

**Spacing**:
- `styles.marginTop` - Top margin
- `styles.marginBottom` - Bottom margin

**Decorative Styles**:
- `content.decorativeStyle` - Decorative separator style (none, dots, stars, custom)
- `content.symmetrical` - Symmetrical decorative pattern (boolean)

**Email Compatibility**:
- ✓ Basic styles: Full support
- ⚠ Wave, zigzag: Use SVG images or Unicode characters
- ✗ Gradient: Limited, use solid color fallback
- ✓ Icons: Image-based icons supported

**Priority**: **LOW** - Decorative enhancement, not critical

---

#### 18.3.10 Spacer Component Enhancements

**Current Properties**: 2 properties
**New Properties**: +3 properties

**Responsive Spacing**:
- `content.mobileHeight` - Height override for mobile
- `content.tabletHeight` - Height override for tablet (future)

**Visual Debug** (Builder only, not exported):
- `content.showGuides` - Show visual guides in builder (boolean)

**Email Compatibility**:
- ✓ Full support (simple empty table cell)

**Priority**: **LOW** - Component is simple and functional

---

### 18.4 Implementation Priority Matrix (Email-First)

| Component | Email Compat. | Priority | Complexity | Recommended Phase |
|-----------|---------------|----------|------------|-------------------|
| **Button** | ✓ Excellent | EMAIL CRITICAL | Medium | Phase 1 |
| **Image** | ✓ Excellent | EMAIL CRITICAL | Medium | Phase 1 |
| **Header** | ✓ Excellent | EMAIL CRITICAL | Medium | Phase 1 |
| **Footer** | ✓ Excellent | EMAIL CRITICAL | Medium | Phase 1 |
| **Hero** | ✓ Excellent | EMAIL CRITICAL | High | Phase 1 |
| **CTA** | ✓ Excellent | EMAIL CRITICAL | Medium | Phase 1 |
| **List** | ✓ Good | EMAIL IMPORTANT | High | Phase 2 |
| **Text** | ✓ Good | EMAIL IMPORTANT | Low | Phase 2 |
| **Separator** | ✓ Excellent | EMAIL IMPORTANT | Low | Phase 2 |
| **Spacer** | ✓ Excellent | EMAIL IMPORTANT | Low | Phase 2 |

**Cross-Component Properties** (Email-First):
- **Spacing (per-side)**: ✓ Excellent support - **Phase 1 (EMAIL CRITICAL)**
- **Border (per-side)**: ✓ Excellent support - **Phase 1 (EMAIL CRITICAL)**
- **Typography** (letter-spacing, text-indent): ✓ Good support - **Phase 2 (EMAIL IMPORTANT)**
- **Typography** (text-shadow): ✗ No Outlook support - **Phase 3 (WEB-FOCUSED)**
- **Color/opacity**: ⚠ Limited Outlook support - **Phase 2 (EMAIL IMPORTANT, opacity only)**
- **Gradients**: ✗ Very limited - **Phase 3 (WEB-FOCUSED)**
- **Shadow effects**: ✗ No Outlook support - **Phase 3 (WEB-FOCUSED)**

---

## 19. New Out-of-the-Box Components

### 19.1 Overview

Based on market research, the following new components should be added to enhance the builder's capabilities. **These are lower priority than enhancing existing components.**

**Email-First Prioritization**: New components are prioritized based on email client compatibility and email marketing value. Components with excellent email support are prioritized for **immediate production deployment**. Web-only components are deferred to **Q3 2026**.

**NOTE**: Sections 19.2-19.4 below contain detailed component specifications grouped for organizational purposes. **For correct email-first phase assignments and implementation priorities, refer to Section 19.5 (Priority Summary) and Section 19.6 (Implementation Notes).**

### 19.2 Detailed Component Specifications

#### 19.2.1 Divider Component (Enhanced Separator)

**Purpose**: More advanced separator with decorative options

**Content Properties**:
- `content.type` - Divider type (line, dotted-line, stars, custom-image)
- `content.text` - Optional text in center
- `content.icon` - Optional icon in center
- `content.alignment` - Content alignment (left, center, right)

**Style Properties**:
- All separator properties plus:
- `styles.textStyles` - Styling for center text
- `styles.iconSize` - Icon size
- `styles.iconColor` - Icon color
- `styles.sidePadding` - Padding on left/right of center content

**Use Cases**:
- Section breaks with decorative elements
- "OR" dividers in forms/CTAs
- Chapter/section markers

**Email Compatibility**: ✓ Good (table-based structure)

**Priority**: **MEDIUM** - Nice enhancement but not critical

---

#### 19.2.2 Video Component

**Purpose**: Embed video content (with email fallback)

**Content Properties**:
- `content.videoUrl` - Video URL (YouTube, Vimeo, MP4, etc.)
- `content.posterImage` - Thumbnail/poster image (required for email)
- `content.platform` - Video platform (youtube, vimeo, html5, custom)
- `content.videoId` - Video ID for platform embeds
- `content.autoplay` - Autoplay video (web only)
- `content.controls` - Show video controls (boolean)
- `content.loop` - Loop video (boolean)
- `content.muted` - Mute by default (boolean)

**Style Properties**:
- `styles.width` - Video width
- `styles.height` - Video height
- `styles.aspectRatio` - Video aspect ratio (16:9, 4:3, 1:1, custom)
- `styles.borderRadius` - Corner rounding
- `styles.border` - Video border
- `styles.playButtonStyle` - Play button overlay style (icon, custom-image)
- `styles.playButtonSize` - Play button size
- `styles.playButtonColor` - Play button color

**Email Behavior**:
- Display poster image with play button overlay
- Link to video landing page (opens in browser)
- Optional: Animated GIF preview (first few seconds)

**Web Behavior**:
- Inline video player
- Lightbox modal option
- Full HTML5 video support

**Email Compatibility**:
- ✗ Inline video: Not supported
- ✓ Linked poster image: Full support
- ⚠ Animated GIF: Supported but large file size

**Priority**: **HIGH** - Video content is increasingly important

---

#### 19.2.3 Countdown Timer Component

**Purpose**: Urgency-driven countdown for promotions

**Content Properties**:
- `content.endDate` - Countdown end date/time
- `content.timezone` - Timezone for end date
- `content.completionText` - Text shown when timer expires
- `content.showDays` - Show days (boolean)
- `content.showHours` - Show hours (boolean)
- `content.showMinutes` - Show minutes (boolean)
- `content.showSeconds` - Show seconds (boolean)
- `content.labels` - Custom labels (days, hours, minutes, seconds)

**Style Properties**:
- `styles.layout` - Layout (horizontal, vertical, grid)
- `styles.digitFontFamily` - Font for numbers
- `styles.digitFontSize` - Number size
- `styles.digitColor` - Number color
- `styles.labelFontFamily` - Font for labels
- `styles.labelFontSize` - Label size
- `styles.labelColor` - Label color
- `styles.backgroundColor` - Digit background
- `styles.borderRadius` - Digit container rounding
- `styles.digitPadding` - Padding inside digit containers
- `styles.digitGap` - Gap between digit groups
- `styles.separator` - Separator between units (colon, dot, none, custom)

**Email Implementation**:
- Use external service (Countdown Mail, Sendtric, etc.)
- Generate dynamic image via API
- Image updates each time email is opened
- Fallback: Static expiration date text

**Web Implementation**:
- Live JavaScript countdown
- Real-time updates every second
- Smooth animations

**Email Compatibility**:
- ⚠ Dynamic countdown: Requires external service
- ✓ Static countdown image: Full support
- ✗ Live countdown: Web only

**Integration**:
- Configuration for external countdown service API
- Built-in integration with popular services
- Fallback to static text for unsupported scenarios

**Priority**: **HIGH** - Proven to increase conversions (up to 332% CTR boost)

---

#### 19.2.4 Social Proof Component

**Purpose**: Display trust indicators and social validation

**Content Properties**:
- `content.type` - Social proof type (testimonial, review, rating, statistic, logo-cloud)
- `content.message` - Social proof message
- `content.author` - Author name (for testimonials)
- `content.authorTitle` - Author title/role
- `content.authorImage` - Author photo URL
- `content.rating` - Star rating (0-5)
- `content.logo` - Company logo (for testimonials)
- `content.logos` - Array of logos (for logo cloud)
- `content.statistic` - Numeric statistic
- `content.statisticLabel` - Statistic label

**Style Properties**:
- `styles.layout` - Layout (card, inline, sidebar)
- `styles.backgroundColor` - Background color
- `styles.border` - Border styling
- `styles.borderRadius` - Corner rounding
- `styles.padding` - Internal padding
- `styles.authorImageSize` - Author image size
- `styles.authorImageShape` - Image shape (circle, square, rounded-square)
- `styles.starColor` - Star rating color
- `styles.starSize` - Star size
- `styles.quoteIcon` - Show quote icon (boolean)
- `styles.quoteIconColor` - Quote icon color

**Use Cases**:
- Customer testimonials
- Product reviews
- Trust badges
- Client logo displays
- Usage statistics ("Join 10,000+ customers")

**Email Compatibility**: ✓ Good (table-based structure with images)

**Priority**: **MEDIUM** - Valuable for trust-building

---

#### 19.3.2 Product Component

**Purpose**: Display product information (eCommerce focus)

**Content Properties**:
- `content.productId` - Product ID (for data injection)
- `content.productName` - Product name
- `content.productImage` - Product image URL
- `content.productPrice` - Product price
- `content.productOriginalPrice` - Original price (for sale display)
- `content.productDescription` - Product description
- `content.productRating` - Star rating
- `content.productReviewCount` - Number of reviews
- `content.productBadge` - Badge text (e.g., "Sale", "New", "Bestseller")
- `content.ctaText` - CTA button text
- `content.ctaUrl` - CTA button URL

**Style Properties**:
- `styles.layout` - Layout (image-left, image-right, image-top, image-background)
- `styles.imageWidth` - Product image width
- `styles.imageAspectRatio` - Image aspect ratio
- `styles.imageBorderRadius` - Image corner rounding
- `styles.backgroundColor` - Product card background
- `styles.border` - Card border
- `styles.borderRadius` - Card corner rounding
- `styles.padding` - Card padding
- `styles.titleStyles` - Product name styling
- `styles.priceStyles` - Price styling
- `styles.salePriceColor` - Sale price color
- `styles.badgeBackgroundColor` - Badge background
- `styles.badgeColor` - Badge text color
- `styles.badgePosition` - Badge position (top-left, top-right, bottom-left, bottom-right)

**Use Cases**:
- Promotional emails
- Product launches
- Abandoned cart emails
- Product recommendations

**Email Compatibility**: ✓ Good (table-based structure)

**Integration**:
- Support for dynamic product data injection
- Compatible with eCommerce platform APIs
- Template variables for product fields

**Priority**: **HIGH** - Critical for eCommerce use cases

---

#### 19.3.3 Accordion/Collapsible Component (Web Only)

**Purpose**: Expandable content sections

**Content Properties**:
- `content.items` - Array of accordion items
  - `title` - Item title
  - `content` - Item content (HTML)
  - `expanded` - Default expanded state
  - `icon` - Optional icon
- `content.allowMultiple` - Allow multiple items open (boolean)
- `content.defaultExpanded` - Default first item expanded (boolean)

**Style Properties**:
- `styles.itemBackgroundColor` - Item background
- `styles.itemHoverBackgroundColor` - Item hover background
- `styles.itemBorder` - Item border
- `styles.itemPadding` - Item padding
- `styles.itemGap` - Gap between items
- `styles.titleStyles` - Title text styling
- `styles.contentStyles` - Content text styling
- `styles.expandIcon` - Expand/collapse icon
- `styles.expandIconColor` - Icon color
- `styles.expandIconPosition` - Icon position (left, right)

**Email Compatibility**:
- ✗ Interactive accordion: Web only
- **Email Fallback**: Display all items expanded (no interactivity)

**Priority**: **LOW** - Web-specific feature

---

#### 19.3.4 Columns/Grid Component

**Purpose**: Custom multi-column layouts

**Content Properties**:
- `content.columnCount` - Number of columns (2-6)
- `content.columns` - Array of column definitions
  - Each column contains nested components
- `content.stackOnMobile` - Stack columns on mobile (boolean)

**Style Properties**:
- `styles.columnGap` - Gap between columns
- `styles.columnWidths` - Array of column widths (% or px)
- `styles.verticalAlign` - Vertical alignment (top, middle, bottom)
- `styles.backgroundColor` - Container background
- `styles.padding` - Container padding

**Use Cases**:
- Multi-column layouts
- Side-by-side content
- Magazine-style layouts
- Feature comparisons

**Email Compatibility**: ✓ Good (nested table structure)

**Priority**: **MEDIUM** - Useful for advanced layouts

---

#### 19.3.5 Icon List Component

**Purpose**: List with icons instead of bullets

**Content Properties**:
- `content.items` - Array of list items
  - `icon` - Icon name or image URL
  - `text` - Item text
  - `link` - Optional link URL
- `content.layout` - Layout (vertical, horizontal, grid)

**Style Properties**:
- `styles.iconSize` - Icon size
- `styles.iconColor` - Icon color
- `styles.itemGap` - Gap between items
- `styles.iconTextGap` - Gap between icon and text
- `styles.textStyles` - Text styling
- `styles.iconPosition` - Icon position (left, right, top)
- `styles.iconBackgroundColor` - Icon background (for circular/square icons)
- `styles.iconShape` - Icon container shape (none, circle, square, rounded-square)

**Use Cases**:
- Feature lists
- Benefits/advantages
- Step-by-step instructions
- Contact information

**Email Compatibility**: ✓ Good (table-based with images)

**Priority**: **MEDIUM** - Common use case

---

### 19.4 Phase 3 - Web-Focused Components (Q3 2026)

#### 19.4.1 Progress Bar Component

**Purpose**: Visual progress indicators

**Content Properties**:
- `content.progress` - Progress value (0-100)
- `content.label` - Progress label text
- `content.showPercentage` - Show percentage (boolean)

**Style Properties**:
- `styles.height` - Bar height
- `styles.backgroundColor` - Background color (unfilled)
- `styles.fillColor` - Fill color (progress)
- `styles.borderRadius` - Bar corner rounding
- `styles.border` - Bar border
- `styles.labelPosition` - Label position (above, below, inside)
- `styles.labelStyles` - Label text styling

**Use Cases**:
- Fundraising campaigns
- Goal tracking
- Profile completion
- Survey progress

**Email Compatibility**: ✓ Good (table-based visual)

**Priority**: **LOW** - Niche use case

---

#### 19.4.2 Table Component

**Purpose**: Data tables

**Content Properties**:
- `content.headers` - Array of header cells
- `content.rows` - Array of row data (array of arrays)
- `content.showHeader` - Show header row (boolean)
- `content.showFooter` - Show footer row (boolean)
- `content.footerData` - Footer row data

**Style Properties**:
- `styles.headerBackgroundColor` - Header background
- `styles.headerTextColor` - Header text color
- `styles.rowBackgroundColor` - Row background
- `styles.alternateRowColor` - Alternate row background
- `styles.cellPadding` - Cell padding
- `styles.cellBorder` - Cell borders
- `styles.textAlign` - Cell text alignment
- `styles.fontSize` - Table font size
- `styles.responsive` - Responsive table mode (scroll, stack, collapse)

**Use Cases**:
- Pricing tables
- Feature comparisons
- Order summaries
- Data reports

**Email Compatibility**: ✓ Excellent (native table structure)

**Priority**: **MEDIUM** - Useful for transactional emails

---

#### 19.4.3 Form Component (Web Only)

**Purpose**: Inline forms for data collection

**Content Properties**:
- `content.fields` - Array of form fields
  - `type` - Field type (text, email, tel, select, checkbox, radio)
  - `label` - Field label
  - `placeholder` - Placeholder text
  - `required` - Required field (boolean)
  - `options` - Options for select/radio/checkbox
- `content.submitButtonText` - Submit button text
- `content.successMessage` - Success message
- `content.errorMessage` - Error message

**Style Properties**:
- All standard form styling
- Field borders, backgrounds, focus states
- Button styling
- Validation styling

**Email Compatibility**:
- ✗ Interactive forms: Web only
- **Email Alternative**: Link to web form/landing page

**Priority**: **LOW** - Web-specific, requires backend

---

### 19.5 New Component Priority Summary (Email-First)

| Component | Email Support | Priority | Complexity | Phase | Email Use Cases |
|-----------|---------------|----------|------------|-------|----------------|
| **Countdown Timer** | ✓ Good (external service) | EMAIL CRITICAL | High | Phase 1 | Promotions, flash sales, urgency |
| **Product** | ✓ Excellent | EMAIL CRITICAL | Medium | Phase 1 | eCommerce, abandoned cart, recommendations |
| **Table** | ✓ Excellent | EMAIL CRITICAL | Medium | Phase 1 | Pricing, order summaries, feature comparison |
| **Social Proof** | ✓ Excellent | EMAIL IMPORTANT | Low | Phase 2 | Testimonials, reviews, trust building |
| **Icon List** | ✓ Excellent | EMAIL IMPORTANT | Low | Phase 2 | Features, benefits, contact info |
| **Columns/Grid** | ✓ Excellent | EMAIL IMPORTANT | Medium | Phase 2 | Multi-column layouts, side-by-side content |
| **Divider** | ✓ Excellent | EMAIL IMPORTANT | Low | Phase 2 | Section breaks, visual separators |
| **Progress Bar** | ✓ Good | EMAIL IMPORTANT | Low | Phase 2 | Fundraising, goal tracking, gamification |
| **Video** | ⚠ Limited (poster only) | WEB-FOCUSED | Medium | Phase 3 | Web pages, fallback to linked poster |
| **Accordion** | ✗ Web only (fallback) | WEB-FOCUSED | Medium | Phase 3 | Web FAQs, email shows all expanded |
| **Form** | ✗ Web only | WEB-FOCUSED | High | Phase 3 | Web pages only, email links to landing page |

**Note**: Email production launch is **immediate priority**. Web page builder features (Phase 3 items with ✗ or ⚠) are planned for **Q3 2026**.

---

### 19.6 Implementation Notes (Email-First Strategy)

**Phase 1 Focus** (Immediate - Email Production):
1. **Email-Critical Cross-Component Properties**: Per-side spacing, per-side borders
2. **Email-Critical Component Enhancements**: Button, Image, Header, Footer, Hero, CTA
3. **Email-Critical New Components**: Countdown Timer, Product, Table

**Phase 2 Focus** (Short-term - Email Enhancements):
1. **Email-Important Component Enhancements**: Text, List, Separator, Spacer
2. **Email-Important Properties**: Advanced typography (letter-spacing, text-indent), size controls, opacity
3. **Email-Important New Components**: Social Proof, Icon List, Columns/Grid, Divider, Progress Bar

**Phase 3 Focus** (Long-term - Web Features, Q3 2026):
1. **Web-Only/Limited Email Support**: Video (poster fallback), shadow effects, gradients, text-shadow, CSS filters
2. **Web-Only Components**: Accordion, Form
3. **Web-Only Enhancements**: Carousel mode, parallax effects, hover states

**Email Compatibility Strategy**:
- All Phase 1 & 2 components must work perfectly in Outlook 2016+ (VML for backgrounds where needed)
- Phase 3 features require graceful email fallbacks (display poster, show all items, link to web form)
- Table-based layouts for maximum email client compatibility
- Inline styles as default, media queries for responsive behavior

---

## 20. Existing Feature Parity Requirements

### 20.1 Overview

This section documents **all features from the existing email builder** that must be maintained in the new version. These are **mandatory requirements** for feature parity - the new builder cannot ship without these capabilities.

**Sections 18-19** document enhancements and new features beyond the current baseline. **Section 20** documents the baseline that must be preserved.

**Implementation Priority**: All features in this section are **PHASE 1 - FEATURE PARITY CRITICAL**. These must be implemented before any enhancements from Sections 18-19.

---

### 20.2 Common Features & Patterns

These patterns are used consistently across all components:

#### 20.2.1 Border System

**Border Properties** (available on most components):
- `styles.border.width` - Border width (CSSValue with units: px, em, rem, pt)
- `styles.border.color` - Border color (with empty/reset option)
- `styles.border.style` - Border style dropdown:
  - `none`
  - `solid`
  - `dashed`
  - `dotted`
  - `double`
  - `groove`
  - `ridge`
  - `inset`
  - `outset`
- `styles.border.radius` - Toggleable section with 4 corner controls:
  - `topLeft` (CSSValue)
  - `topRight` (CSSValue)
  - `bottomRight` (CSSValue)
  - `bottomLeft` (CSSValue)

**UI Requirements**:
- Border radius section can be collapsed/expanded
- Each corner has independent input with unit selector
- Color picker includes "empty color" option (inherit/default)
- Reset button returns to component default

---

#### 20.2.2 Margin System

**Margin Properties** (available on all components):
- `styles.marginMode` - "fit-to-container" or "with-margins"
- `styles.margin.left` - Left margin (CSSValue with changeable units)
- `styles.margin.right` - Right margin (CSSValue)
- `styles.margin.top` - Top margin (CSSValue)
- `styles.margin.bottom` - Bottom margin (CSSValue)

**Optional Margin Colors** (for visual debugging):
- `styles.margin.leftColor` - Left margin background color
- `styles.margin.rightColor` - Right margin background color
- `styles.margin.topColor` - Top margin background color
- `styles.margin.bottomColor` - Bottom margin background color

**UI Requirements**:
- Toggle between "Fit to container" and "With margins" mode
- When "Fit to container": margin inputs disabled
- When "With margins": show individual margin controls
- Optional: Linked inputs toggle (all margins change together)
- Unit selector per margin (px, %, em, rem, pt)
- Margin colors are optional/advanced feature

---

#### 20.2.3 Spacing System

**Spacing Properties** (component-specific):
- `styles.verticalSpacing` - Vertical spacing between child elements (CSSValue)
- `styles.horizontalSpacing` - Horizontal spacing between child elements (CSSValue)
- Component-specific spacing (e.g., `styles.spaceBetweenItems` for lists)

---

#### 20.2.4 Rich Text Editor

**All rich text fields** support comprehensive editing:

**Text Formatting**:
- Bold, Italic, Underline, Strikethrough
- Subscript, Superscript

**Text Styling**:
- Font family (dropdown with web-safe + web fonts marked with *)
- Font size (dropdown + manual input)
- Font weight (100-900, normal, bold)
- Line height (number or CSSValue)
- Text color (color picker)
- Background color (color picker with empty option)

**Alignment**:
- Left align, Center align, Right align, Justify

**Lists**:
- Ordered lists (numbered: 1, 2, 3...)
- Unordered lists (bulleted: •)

**Headings**:
- H1, H2, H3, H4, H5, H6
- Paragraph (normal text)

**Links**:
- Insert hyperlink
- Edit hyperlink
- Remove hyperlink
- Link URL input
- Link target (same window, new window)

**Code**:
- Inline code (monospace styling)
- Code blocks (multi-line code with syntax)

**Editor State**:
- Must preserve Lexical editor state for re-editing
- Export to HTML for rendering
- Import from HTML for loading templates

**UI Requirements**:
- Toolbar with all formatting options visible
- Keyboard shortcuts for common operations
- Real-time preview in editor
- Paste from Word/Google Docs support (clean HTML)

---

#### 20.2.5 Color Picker

**All color inputs** support:

**Color Formats**:
- Visual color picker (hue/saturation grid)
- Hex code input (#RRGGBB, #RRGGBBAA)
- RGB input (r, g, b values)
- HSL input (h, s, l values)
- Alpha/opacity slider (0-100% or 0-1)

**Swatches**:
- Recently used colors (last 10-20 colors)
- Brand colors (configurable palette)
- Default color suggestions

**Special Options**:
- "Empty color" option (use inherited/default color)
- Reset button (return to component default)
- Eyedropper tool (sample color from canvas - web only)

**UI Requirements**:
- Compact color preview swatch
- Click to open full picker modal/popover
- Hex input for quick manual entry
- Alpha slider visible when supported

---

#### 20.2.6 Unit System

**All numeric inputs** support multiple units:

**Supported Units**:
- `px` - Pixels
- `%` - Percentage
- `em` - Relative to font size
- `rem` - Relative to root font size
- `pt` - Points (72pt = 1 inch)
- `auto` - Automatic sizing (for width/height only)

**UI Requirements**:
- Numeric input field with increment/decrement buttons
- Unit dropdown adjacent to input
- Slider for supported properties (0-100% range, 0-600px range, etc.)
- Slider + input sync (changing either updates both)
- Keyboard entry supported (type "20px" or "50%")

---

#### 20.2.7 Display Toggles

**All optional content sections** have display toggles:

**Implementation**:
- `content.showX` - Boolean flag for each optional element
- Examples: `showImage`, `showButton`, `showTitle`, `showDescription`, `showNavigation`, etc.

**UI Requirements**:
- Toggle switch (on/off) for each optional section
- When off: section grayed out in editor but still editable
- When off: section not included in export
- Visual indicator in content tab (eye icon with slash)

---

#### 20.2.8 Drag & Drop Reordering

**All list-based content** supports reordering:

**Applies To**:
- Navigation links
- Footer links
- Social media icons
- List items
- Any array of repeated content

**UI Requirements**:
- Drag handle icon on each item
- Visual feedback during drag (ghost/preview)
- Drop zones highlighted
- Order automatically saved
- Keyboard-accessible alternative (move up/down buttons)

---

#### 20.2.9 Image Upload/URL

**All image inputs** support dual input methods:

**Upload**:
- File picker (click to browse)
- Drag & drop image file
- Supported formats: JPG, PNG, GIF, SVG
- Image preview after upload
- File size limit warning (configurable)

**URL**:
- Text input for image URL
- URL validation
- External image preview
- HTTP/HTTPS support

**UI Requirements**:
- Tabbed interface: "Upload" tab and "URL" tab
- Current image preview thumbnail
- Remove image button
- Alt text input (required for accessibility)

---

#### 20.2.10 Linked Inputs

**Margin and padding inputs** support linking:

**Behavior**:
- Link icon/button between inputs
- When linked: changing one input updates all
- When unlinked: each input independent
- Link state persists until user toggles

**UI Requirements**:
- Chain link icon (linked) or broken link icon (unlinked)
- Visual connection lines between inputs (optional)
- Click to toggle link state

---

#### 20.2.11 Toggleable Sections

**Complex property groups** can be collapsed/expanded:

**Examples**:
- Border radius (4 corners)
- Margin controls (4 sides)
- Advanced options

**UI Requirements**:
- Section header with chevron icon (▼/▶)
- Click header to toggle collapse/expand
- State persists during editing session
- Collapsed sections show summary (e.g., "Radius: 5px")

---

### 20.3 Header Component (Existing Features)

#### 20.3.1 Style Tab

**Layout**:
- `content.layout` - Image position:
  - `image-left` - Image on left, links on right
  - `image-top` - Image on top, links below

**Background**:
- `styles.backgroundColor` - Background color (with empty color option)

**Margins**:
- `styles.marginMode` - "fit-to-container" or "with-margins"
- `styles.margin.left`, `.right`, `.top`, `.bottom` - Individual margins (CSSValue with units)

**Border**:
- `styles.border.width` - Border width (CSSValue)
- `styles.border.color` - Border color (with empty/reset option)
- `styles.border.style` - Border style (none, solid, dashed, dotted, double, groove, ridge, inset, outset)
- `styles.border.radius.topLeft`, `.topRight`, `.bottomRight`, `.bottomLeft` - Corner radius (toggleable section)

**Spacing**:
- `styles.verticalSpacing` - Vertical spacing between image and links (CSSValue)
- `styles.horizontalSpacing` - Horizontal spacing between links (CSSValue)
- `styles.navigationBarWidth` - Navigation bar width (% of container)
- Alternative: `styles.spacingBetweenLinks` - Toggle between bar width or spacing between individual links

**Image**:
- `styles.image.width` - Image width (% slider, 0-100%)
- `styles.image.alignment` - Image alignment (left, center, right)
- `styles.image.border.width` - Image border width (CSSValue)
- `styles.image.border.style` - Image border style
- `styles.image.border.color` - Image border color
- `styles.image.border.radius` - Image border radius (toggleable section with 4 corners)

**Links**:
- `styles.links.width` - Link width (CSSValue or auto)
- `styles.links.alignment` - Links alignment (left, center, right)
- `styles.links.fontFamily` - Font family (web safe fonts + web fonts*)
- `styles.links.fontWeight` - Font weight (100-900, normal, bold)
- `styles.links.letterSpacing` - Letter spacing (CSSValue)
- `styles.links.color` - Text color
- `styles.links.backgroundColor` - Background color
- `styles.links.border.width` - Link border width
- `styles.links.border.style` - Link border style
- `styles.links.border.color` - Link border color
- `styles.links.border.radius` - Link border radius (toggleable with 4 corners)

#### 20.3.2 Content Tab

**Image**:
- `content.image.file` - Image upload
- `content.image.url` - Image URL input
- `content.image.alt` - Alt text (required)
- `content.showImage` - Display toggle

**Links List**:
- `content.links` - Array of link objects:
  - `text` - Link text (rich text editor)
  - `url` - Link URL
  - `show` - Display toggle
  - `order` - Order index (for drag & drop)
- Actions:
  - Add new link
  - Reorder links (drag & drop)
  - Remove link
  - Toggle link visibility

---

### 20.4 Footer Component (Existing Features)

#### 20.4.1 Style Tab

**Layout**:
- `content.layout` - Layout variant selection (multiple pre-defined layouts)

**Background**:
- `styles.backgroundColor` - Background color

**Margins**:
- `styles.marginMode` - "fit-to-container" or "with-margins"
- `styles.margin.left`, `.right`, `.top`, `.bottom` - Individual margins (CSSValue)

**Border**:
- `styles.border.width`, `.style`, `.color` - Border properties
- `styles.border.radius` - Border radius (4 corners)

**Spacing**:
- `styles.verticalSpacing` - Vertical spacing between sections (CSSValue)
- `styles.horizontalSpacing` - Horizontal spacing between elements (CSSValue)

**Title**:
- `styles.title.color` - Title text color
- `styles.title.alignment` - Text alignment (left, center, right)

**Description**:
- `styles.description.color` - Description text color
- `styles.description.alignment` - Text alignment (left, center, right)

**Social Network List**:
- `styles.socialList.alignment` - Horizontal alignment (left, center, right) - for horizontal layout
- `styles.socialList.verticalAlignment` - Vertical alignment (top, middle, bottom) - for vertical layout
- `styles.socialList.itemSpacing` - Space between social icons (CSSValue)
- `styles.socialList.margin.left`, `.right`, `.top`, `.bottom` - List container margins
- `styles.socialList.iconSize` - Icon size (width in px)
- `styles.socialList.wrapOnMobile` - Wrap long icon lists on mobile (toggle, >7 icons)

**Links**:
- `styles.links.alignment` - Links text alignment (left, center, right)
- `styles.links.color` - Links text color

#### 20.4.2 Content Tab

**Title**:
- `content.title` - Title text (rich text editor)
- `content.showTitle` - Display toggle

**Description**:
- `content.description` - Description text (rich text editor)
- `content.showDescription` - Display toggle

**Social Networks**:
- `content.socialNetworks` - Array of social network objects:
  - `icon` - Icon selection (facebook, twitter, instagram, linkedin, youtube, etc.)
  - `url` - Social profile URL
  - `show` - Display toggle
  - `order` - Order index
- Actions:
  - Add new social network
  - Reorder (drag & drop)
  - Remove
  - Toggle visibility

**Links**:
- `content.links` - Links text (rich text editor with multiple links)
- `content.showLinks` - Display toggle

---

### 20.5 Hero Component (Existing Features)

#### 20.5.1 Style Tab

**Background**:
- `styles.backgroundColor` - Background color

**Margins**:
- `styles.marginMode` - "fit-to-container" or "with-margins"
- `styles.margin.left`, `.right`, `.top`, `.bottom` - Individual margins (CSSValue)

**Border**:
- `styles.border.width`, `.style`, `.color`, `.radius` - Full border configuration (4 corners)

**Spacing**:
- `styles.spaceBetweenElements` - Vertical spacing between hero sections (CSSValue)

**Image**:
- `styles.image.width` - Image width (% slider, 0-100%)
- `styles.image.alignment` - Image alignment (left, center, right)
- `styles.image.border.width`, `.style`, `.color` - Image border
- `styles.image.border.radius` - Image border radius (toggleable with 4 corners)

**Heading**:
- `styles.heading.color` - Heading text color
- `styles.heading.alignment` - Text alignment (left, center, right)

**Text**:
- `styles.text.color` - Text color
- `styles.text.alignment` - Text alignment (left, center, right)

**Button**:
- `styles.button.width` - Width (auto or custom with unit)
- `styles.button.alignment` - Alignment (left, center, right)
- `styles.button.height` - Height (auto or custom with unit)
- `styles.button.fontFamily` - Font family (web safe + web fonts*)
- `styles.button.fontWeight` - Font weight
- `styles.button.color` - Text color
- `styles.button.backgroundColor` - Background color
- `styles.button.border.width`, `.style`, `.color` - Border properties
- `styles.button.border.radius` - Border radius (toggleable with 4 corners)
- `styles.button.forceOutlookBorderRadius` - Force Outlook border-radius support (toggle)
- `styles.button.outlookButtonWidth` - Outlook button width for border-radius (CSSValue)

#### 20.5.2 Content Tab

**Image**:
- `content.image.file` - Image upload
- `content.image.url` - Image URL
- `content.image.alt` - Alt text
- `content.showImage` - Display toggle

**Title**:
- `content.title` - Title text (rich text editor)
- `content.showTitle` - Display toggle

**Text**:
- `content.text` - Text content (rich text editor)
- `content.showText` - Display toggle

**Button**:
- `content.button.text` - Button text (rich text editor)
- `content.button.url` - Button URL
- `content.showButton` - Display toggle

---

### 20.6 Call to Action Component (Existing Features)

#### 20.6.1 Style Tab

**Background**:
- `styles.backgroundColor` - Background color

**Margins**:
- `styles.marginMode` - "fit-to-container" or "with-margins"
- `styles.margin.left`, `.right`, `.top`, `.bottom` - Individual margins (CSSValue)

**Border**:
- `styles.border.width`, `.style`, `.color`, `.radius` - Full border configuration (4 corners)

**Spacing**:
- `styles.spaceBetweenElements` - Vertical spacing between text and button (CSSValue)

**Text**:
- `styles.text.color` - Text color
- `styles.text.alignment` - Text alignment (left, center, right)

**Button**:
- `styles.button.width` - Width (auto or custom with unit)
- `styles.button.alignment` - Alignment (left, center, right)
- `styles.button.height` - Height (auto or custom)
- `styles.button.fontFamily` - Font family
- `styles.button.fontWeight` - Font weight
- `styles.button.color` - Text color
- `styles.button.backgroundColor` - Background color
- `styles.button.border.width`, `.style`, `.color` - Border properties
- `styles.button.border.radius` - Border radius (toggleable with 4 corners)
- `styles.button.forceOutlookBorderRadius` - Force Outlook border-radius (toggle)
- `styles.button.outlookButtonWidth` - Outlook button width for border-radius

#### 20.6.2 Content Tab

**Text**:
- `content.text` - Text content (rich text editor)
- `content.showText` - Display toggle

**Button**:
- `content.button.text` - Button text (rich text editor)
- `content.button.url` - Button URL
- `content.showButton` - Display toggle

---

### 20.7 Duo Panel Component (Existing Features)

**Purpose**: Side-by-side comparison component (e.g., sports matchups, product comparisons)

#### 20.7.1 Style Tab

**Layout**:
- `content.layout` - Layout selection:
  - `left-side` - Items side by side
  - `top` - Items stacked vertically

**Margins**:
- **Panel Margins**:
  - `styles.margin.left`, `.right`, `.top`, `.bottom` - Panel container margins
- **Image Margins** (per item):
  - `styles.imageMargin.left`, `.right`, `.top`, `.bottom` - Margins around images
- **Text Margins** (per item):
  - `styles.textMargin.left`, `.right`, `.top`, `.bottom` - Margins around text labels

**Background**:
- `styles.backgroundColor` - Panel background color
- `styles.itemsBackgroundColor` - Individual items background color

**Border**:
- `styles.border.width`, `.style`, `.color`, `.radius` - Full border configuration (4 corners)

**Image**:
- `styles.image.size` - Image size (0-600px slider)
- `styles.image.border.radius` - Image border radius (4 corners independently)

#### 20.7.2 Content Tab

**Delimiter**:
- `content.delimiter.vs` - VS Separator text (rich text editor, e.g., "VS", "vs", "-")
- `content.delimiter.score` - Score Separator text (rich text editor, only visible in Top layout)
- `content.showDelimiter` - Display toggle

**Item A**:
- `content.itemA.label` - Primary label (rich text editor, e.g., team name, product name)
- `content.itemA.image.file` - Image upload
- `content.itemA.image.url` - Image URL
- `content.itemA.image.alt` - Alt text
- `content.showItemA` - Display toggle

**Item B**:
- `content.itemB.label` - Primary label (rich text editor)
- `content.itemB.image.file` - Image upload
- `content.itemB.image.url` - Image URL
- `content.itemB.image.alt` - Alt text
- `content.showItemB` - Display toggle

**Use Cases**:
- Sports matchups (Team A vs Team B)
- Product comparisons (Product A vs Product B)
- Before/After comparisons
- Choice presentations (Option A vs Option B)

---

### 20.8 Spaced Text Component (Existing Features)

**Purpose**: Left-right justified text layout (e.g., label-value pairs, key-value displays)

#### 20.8.1 Style Tab

**Background**:
- `styles.backgroundColor` - Background color

**Margins**:
- `styles.marginMode` - "fit-to-container" or "with-margins"
- `styles.margin.left`, `.right`, `.top`, `.bottom` - Individual margins (CSSValue)

**Border**:
- `styles.border.width`, `.style`, `.color`, `.radius` - Full border configuration (4 corners)

**Spacing**:
- `styles.spaceBetweenElements` - Spacing between left and right text (CSSValue)

**Vertical Alignment**:
- `styles.verticalAlignment` - Vertical alignment (top, middle, bottom)

**Table Layout**:
- `styles.tableLayout` - Table layout options:
  - `auto` - Automatic column widths
  - `fixed` - Fixed column widths (50/50 split)
  - Custom percentages

#### 20.8.2 Content Tab

**Left Text**:
- `content.leftText` - Left-aligned text (rich text editor)
- Default alignment: left

**Right Text**:
- `content.rightText` - Right-aligned text (rich text editor)
- Default alignment: right

**Use Cases**:
- Label-value pairs (Name: John Doe, Email: john@example.com)
- Price displays (Product name | $99.99)
- Date-time displays (Event | March 15, 2024)
- Two-column content layouts

---

### 20.9 List Component (Existing Features)

#### 20.9.1 Style Tab

**Layout**:
- `content.layout` - Image placement:
  - `left-side` - Image on left, content on right
  - `top` - Image on top, content below

**Background**:
- `styles.backgroundColor` - Component background color
- `styles.itemsBackgroundColor` - Individual items background color

**Margins**:
- **List Container Margins**:
  - `styles.marginMode` - "fit-to-container" or "with-margins"
  - `styles.margin.left`, `.right`, `.top`, `.bottom` - Container margins (CSSValue)
  - Optional: `styles.margin.leftColor`, `.rightColor`, `.topColor`, `.bottomColor` - Margin colors per side
- **Items' Element Margins** (per element within each item):
  - `styles.titleMargin.left`, `.right`, `.top`, `.bottom` - Title margins
  - `styles.descriptionMargin.left`, `.right`, `.top`, `.bottom` - Description margins
  - `styles.buttonMargin.left`, `.right`, `.top`, `.bottom` - Button margins
  - `styles.imageMargin.left`, `.right`, `.top`, `.bottom` - Image margins

**Border**:
- `styles.border.width`, `.style`, `.color`, `.radius` - Full border configuration (4 corners)

**Spacing**:
- `styles.spaceBetweenItems` - Space between list items (CSSValue)
- `styles.verticalSpacing` - Vertical spacing between elements within item (CSSValue)
- `styles.horizontalSpacing` - Horizontal spacing between image and content (CSSValue)
- `styles.itemSize` - Item size (0-600px slider with auto toggle)

**Image**:
- `styles.image.contentRatio` - Image/Content ratio (0-100% slider)
  - 0% = minimal image, 100% content
  - 50% = equal split
  - 100% = full width image, minimal content
- `styles.image.alignment` - Image alignment (left, center, right)
- `styles.image.border.radius` - Image border radius (toggleable with 4 corners)

**Alignment**:
- `styles.items.horizontalAlignment` - Items' horizontal alignment (left, center, right)
- `styles.items.verticalAlignment` - Items' vertical alignment (top, middle, bottom)

**Button**:
- `styles.button.backgroundColor` - Background color
- `styles.button.width` - Width (with unit)
- `styles.button.alignment` - Alignment (left, center, right)
- `styles.button.textAlignment` - Text alignment within button
- `styles.button.height` - Height (auto or custom)
- `styles.button.fontFamily` - Font family
- `styles.button.fontWeight` - Font weight
- `styles.button.color` - Text color
- `styles.button.border.width`, `.style`, `.color` - Border properties
- `styles.button.border.radius` - Border radius (toggleable with 4 corners)

**Advanced** (only visible when mobile optimized):
- `styles.wrapList` - Wrap list items on mobile (toggle)
- `styles.wrapListItemsElements` - Wrap elements within list items (toggle)

#### 20.9.2 Content Tab

**Items List**:
- `content.items` - Array of list item objects:
  - `title` - Item title (rich text editor)
  - `description` - Item description (rich text editor)
  - `button.text` - Button text (rich text editor)
  - `button.url` - Button URL
  - `image.file` - Image upload
  - `image.url` - Image URL
  - `image.alt` - Alt text
  - `showTitle` - Title display toggle
  - `showDescription` - Description display toggle
  - `showButton` - Button display toggle
  - `showImage` - Image display toggle
  - `order` - Order index
- Actions:
  - Add new item
  - Reorder items (drag & drop)
  - Remove item
  - Toggle individual element visibility per item

---

### 20.10 Links List Component (Existing Features)

**Purpose**: Standalone component for displaying a list of links (e.g., navigation, quick links, footer links)

#### 20.10.1 Style Tab

**Links** (same styling as Header Links):
- `styles.links.width` - Link width (CSSValue or auto)
- `styles.links.alignment` - Links alignment (left, center, right)
- `styles.links.fontFamily` - Font family (web safe fonts + web fonts*)
- `styles.links.fontWeight` - Font weight
- `styles.links.letterSpacing` - Letter spacing (CSSValue)
- `styles.links.color` - Text color
- `styles.links.backgroundColor` - Background color
- `styles.links.border.width`, `.style`, `.color` - Border properties
- `styles.links.border.radius` - Border radius (toggleable with 4 corners)

**Margins**:
- `styles.marginMode` - "fit-to-container" or "with-margins"
- `styles.margin.left`, `.right`, `.top`, `.bottom` - Individual margins

**Spacing**:
- `styles.spaceBetweenLinks` - Space between individual links (CSSValue)

#### 20.10.2 Content Tab

**Links**:
- `content.links` - Array of link objects:
  - `text` - Link text (plain text or rich text)
  - `url` - Link URL
  - `show` - Display toggle
  - `order` - Order index
- Actions:
  - Add new link
  - Reorder links (drag & drop)
  - Remove link
  - Toggle link visibility

---

### 20.11 Code Component (Existing Features)

**Purpose**: Custom HTML/CSS injection for advanced users

#### 20.11.1 Style Tab

**Background**:
- `styles.backgroundColor` - Background color

**Margins**:
- `styles.marginMode` - "fit-to-container" or "with-margins"
- `styles.margin.left`, `.right`, `.top`, `.bottom` - Individual margins (CSSValue)

**Border**:
- `styles.border.width`, `.style`, `.color`, `.radius` - Full border configuration (4 corners)

#### 20.11.2 Content Tab

**Code Editor**:
- `content.html` - Custom HTML code (code editor with syntax highlighting)
- `content.css` - Custom CSS code (code editor with syntax highlighting)

**UI Requirements**:
- Syntax highlighting for HTML/CSS
- Line numbers
- Auto-indentation
- Code validation warnings (non-blocking)
- Preview button to test rendering
- Warning message about email client compatibility

**Email Rendering**:
- Inline CSS automatically
- Validate against email-safe HTML
- Warn about unsupported tags/properties
- Option to bypass warnings (advanced users)

---

### 20.12 Feature Parity Summary

#### 20.12.1 Component Count

**Existing Components** (must maintain):
1. Header
2. Footer
3. Hero
4. Call to Action
5. Duo Panel
6. Spaced Text
7. List
8. Links List
9. Code

**Total: 9 components** (plus base components like Button, Text, Image, Separator, Spacer from Section 2.2.2)

#### 20.12.2 Critical Features

**Must-Have UI Patterns**:
- ✓ Fit to container vs With margins toggle
- ✓ Linked inputs for margins/padding
- ✓ Toggleable sections (border radius, advanced options)
- ✓ Per-corner border radius controls
- ✓ Rich text editor with full formatting toolbar
- ✓ Drag & drop reordering for all lists
- ✓ Display toggles for all optional content
- ✓ Image upload + URL dual input
- ✓ Color picker with empty/reset options
- ✓ Unit selectors for all measurements
- ✓ Web fonts marked with asterisk

**Must-Have Component Features**:
- ✓ Per-element margins within list items (title, description, button, image margins)
- ✓ Force Outlook border-radius option for buttons
- ✓ Image/Content ratio slider for List component
- ✓ Vertical and horizontal spacing controls
- ✓ Wrap list options for mobile
- ✓ Margin colors for visual debugging
- ✓ Table layout options for Spaced Text
- ✓ Social network icon size and wrapping for Footer
- ✓ Navigation bar width or spacing toggle for Header

**Must-Have Styling Options**:
- ✓ All 9 border styles (none, solid, dashed, dotted, double, groove, ridge, inset, outset)
- ✓ Font weight full range (100-900)
- ✓ Letter spacing for typography
- ✓ Button height control (auto or custom)
- ✓ Button text alignment within button
- ✓ Vertical alignment (top, middle, bottom)
- ✓ Background color on text (rich text editor)
- ✓ Line height control in rich text editor
- ✓ Code blocks and subscript/superscript in rich text

#### 20.12.3 Implementation Priority

**ALL features in Section 20 are PHASE 1 - FEATURE PARITY CRITICAL**.

These must be implemented **before** any enhancements from Sections 18-19. Without these features, we don't have parity with the existing builder.

**Recommended Implementation Order**:
1. Common systems (Section 20.2): Border, Margin, Spacing, Rich Text Editor, Color Picker
2. Existing components (Sections 20.3-20.11) in order of usage frequency
3. Verify complete feature parity before moving to enhancements

---

## 21. Glossary

- **Component**: Reusable building block (Header, Footer, Button, etc.)
- **Template**: Complete email/page layout with components
- **Preset**: Saved style configuration for a component
- **Canvas**: Visual editing area where components are placed
- **Sidebar**: Panel for editing component content and styles
- **Design Tokens**: Design system values (colors, spacing, etc.)
- **Adapter**: Framework-specific wrapper/integration layer
- **Headless Service**: Backend processing service without UI
- **Test Mode**: Application state where test attributes are injected for automated testing
- **Test ID**: Unique identifier (`data-testid`) used for element selection in tests
- **Test Action**: Semantic label (`data-action`) describing what an element does
- **Test API**: JavaScript API exposed for programmatic state inspection during testing
- **Desktop Mode**: Base editing mode where desktop/default styles are defined
- **Mobile Dev Mode**: Responsive editing mode where mobile-specific overrides are created
- **Mobile Override**: Device-specific value that supersedes the desktop value on mobile devices
- **Inheritance**: When a mobile property has no override, it inherits the desktop value
- **Mobile Layout Manager**: Sidebar panel for reordering and managing component visibility in mobile mode
- **Diff View**: Audit panel showing all mobile customizations compared to desktop
- **Per-Side Control**: Ability to set different values for top, right, bottom, left (padding, margin, border)
- **CSSValue**: Object containing numeric value and unit (px, rem, em, %, etc.)
- **Email Compatibility**: Level of support across email clients (✓ Good, ⚠ Limited, ✗ Not supported)
