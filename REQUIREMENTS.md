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

## 17. Glossary

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
