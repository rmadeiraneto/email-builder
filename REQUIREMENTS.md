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

## 18. Glossary

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
