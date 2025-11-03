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

## 15. Glossary

- **Component**: Reusable building block (Header, Footer, Button, etc.)
- **Template**: Complete email/page layout with components
- **Preset**: Saved style configuration for a component
- **Canvas**: Visual editing area where components are placed
- **Sidebar**: Panel for editing component content and styles
- **Design Tokens**: Design system values (colors, spacing, etc.)
- **Adapter**: Framework-specific wrapper/integration layer
- **Headless Service**: Backend processing service without UI
