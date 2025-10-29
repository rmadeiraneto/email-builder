# Email Builder - Development Guidelines

This document contains coding standards, best practices, architectural decisions, and conventions for the Email Builder project.

## Table of Contents
1. [Project Architecture](#project-architecture)
2. [Technology Stack](#technology-stack)
3. [Styling Guidelines](#styling-guidelines)
4. [TypeScript Conventions](#typescript-conventions)
5. [Component Architecture](#component-architecture)
6. [File Structure & Naming](#file-structure--naming)
7. [Design Tokens](#design-tokens)
8. [Documentation Standards](#documentation-standards)
9. [Testing Standards](#testing-standards)
10. [Git Workflow](#git-workflow)
11. [Code Quality](#code-quality)

---

## Project Architecture

### Microfrontend Architecture
- **Core Principle**: Framework-agnostic core with framework-specific adapters
- **Separation of Concerns**: Business logic in core, UI in implementations
- **Communication**: Event-driven architecture using Command pattern
- **Modularity**: Each package is independently testable and deployable

### Monorepo Structure
- Use **pnpm workspaces** for package management
- Each package has its own `package.json`
- Shared dependencies declared at root level
- Build tools (Vite) configured for monorepo

### Package Dependencies
```
core (no framework dependencies)
  ↓
tokens (design system)
  ↓
ui-components (vanilla JS)
  ↓
ui-solid / adapters (framework implementations)
```

---

## Technology Stack

### Core Technologies
- **Build Tool**: Vite
- **Language**: TypeScript (strict mode)
- **Package Manager**: pnpm
- **Monorepo Tool**: pnpm workspaces

### UI Frameworks
- **Primary UI**: Solid JS
- **Alternative**: Vanilla JS (web components)
- **Enterprise**: Blazor
- **Adapters**: React, Next.js

### Styling
- **CSS Modules**: Scss for presentational components
- **Utility Classes**: Tailwind CSS for containers
- **Methodology**: BEM for custom classes
- **Design Tokens**: W3C Design Token format

### Libraries
- **Text Editor**: Lexical
- **Icons**: Remix Icons
- **Documentation**: TypeDoc
- **Testing**: Vitest + Testing Library

---

## Styling Guidelines

### The Golden Rule: No Mixing
**NEVER mix CSS Modules/BEM with utility classes in the same component.**

### When to Use CSS Modules + BEM

**Use for:**
- Presentational components (buttons, inputs, cards)
- Complex components with internal structure
- Highly reusable UI components
- Components in `ui-components/` package

**Structure:**
```scss
// button.module.scss
.button {
  // Base styles

  &--primary {
    // Modifier
  }

  &--large {
    // Size modifier
  }

  &__icon {
    // Element
  }
}
```

**Usage:**
```tsx
import styles from './button.module.scss';

<button className={styles.button}>
  <span className={styles.button__icon}>Icon</span>
  Label
</button>
```

**BEM Naming Convention:**
```
.block {}
.block__element {}
.block--modifier {}
.block__element--modifier {}
```

### When to Use Tailwind Utility Classes

**Use for:**
- Container components
- Layout components
- One-off spacing adjustments
- Components without `.module.scss` file

**Example:**
```tsx
// Container component - Tailwind only
<div className="flex gap-4 p-6 bg-white rounded-lg shadow-md">
  <ComponentWithBEM />
  <ComponentWithBEM />
</div>
```

### SCSS Best Practices

**File Structure:**
```scss
// 1. Imports
@use '@tokens/colors' as colors;
@use '@tokens/spacing' as spacing;

// 2. Component styles
.component {
  // Layout
  display: flex;

  // Positioning
  position: relative;

  // Box model
  padding: spacing.$md;
  margin: spacing.$sm;

  // Typography
  font-size: typography.$base;

  // Visual
  background: colors.$primary;
  border-radius: spacing.$radius-md;

  // Animation
  transition: all 0.2s ease;
}
```

**Nesting Rules:**
- Maximum nesting depth: 3 levels
- Use `&` for modifiers and pseudo-classes
- Avoid deep nesting (creates specificity issues)

**Example:**
```scss
.card {
  // Base styles

  &__header {
    // Element styles

    &--highlighted {
      // Element modifier
    }
  }

  &:hover {
    // Pseudo-class
  }

  &--large {
    // Modifier
  }
}
```

### Design Token Integration

**Always use design tokens, never hardcode values:**

```scss
// ❌ Bad
.button {
  padding: 12px 24px;
  background: #3b82f6;
  border-radius: 8px;
}

// ✅ Good
@use '@tokens/spacing' as spacing;
@use '@tokens/colors' as colors;
@use '@tokens/border' as border;

.button {
  padding: spacing.$button-padding-y spacing.$button-padding-x;
  background: colors.$primary-500;
  border-radius: border.$radius-md;
}
```

### Responsive Design

**Mobile-First Approach:**
```scss
.component {
  // Mobile styles (default)
  padding: spacing.$sm;

  // Tablet and up
  @media (min-width: breakpoints.$tablet) {
    padding: spacing.$md;
  }

  // Desktop and up
  @media (min-width: breakpoints.$desktop) {
    padding: spacing.$lg;
  }
}
```

**Tailwind Responsive:**
```tsx
<div className="p-4 md:p-6 lg:p-8">
  {/* Mobile: p-4, Tablet: p-6, Desktop: p-8 */}
</div>
```

---

## TypeScript Conventions

### Strict Configuration
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### Type Organization

**Location:**
- Shared types: `packages/core/types/`
- Package-specific types: `{package}/types/`
- Component types: Co-located with component

**Structure:**
```typescript
// types/component.types.ts
export interface ButtonProps {
  /**
   * The button variant
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'ghost';

  /**
   * The button size
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Click handler
   */
  onClick?: (event: MouseEvent) => void;

  /**
   * Button is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Button content
   */
  children: ComponentChildren;
}

export type ButtonVariant = ButtonProps['variant'];
export type ButtonSize = ButtonProps['size'];
```

### Naming Conventions

**Interfaces:**
```typescript
// Props interface
interface ButtonProps {}

// State interface
interface ButtonState {}

// Component-specific types
interface ButtonConfig {}

// Event types
interface ButtonClickEvent {}
```

**Types:**
```typescript
// Union types
type ButtonVariant = 'primary' | 'secondary' | 'ghost';

// Utility types
type PartialButtonProps = Partial<ButtonProps>;
type RequiredButtonProps = Required<ButtonProps>;

// Function types
type ButtonClickHandler = (event: MouseEvent) => void;
```

**Enums (use sparingly):**
```typescript
// Prefer union types over enums
type Status = 'pending' | 'success' | 'error';

// Use enums only for related constants with logic
enum ComponentType {
  Header = 'header',
  Footer = 'footer',
  Hero = 'hero'
}
```

### Generic Types

**Component Props:**
```typescript
interface SelectProps<T> {
  options: T[];
  value: T;
  onChange: (value: T) => void;
  renderOption: (option: T) => string;
}
```

**Utility Types:**
```typescript
// Deep partial
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Extract component props
type ComponentProps<T> = T extends ComponentType<infer P> ? P : never;
```

### Type Guards

```typescript
function isButtonElement(element: HTMLElement): element is HTMLButtonElement {
  return element.tagName === 'BUTTON';
}

function hasProperty<T, K extends string>(
  obj: T,
  key: K
): obj is T & Record<K, unknown> {
  return key in obj;
}
```

### Documentation in Types

**Always document:**
- Public interfaces
- Complex types
- Function signatures
- Type parameters

```typescript
/**
 * Configuration for the email builder
 *
 * @example
 * ```ts
 * const config: BuilderConfig = {
 *   target: 'email',
 *   locale: 'en-US',
 *   storage: {
 *     method: 'local'
 *   }
 * };
 * ```
 */
export interface BuilderConfig {
  /**
   * Rendering target
   * - `web`: Full CSS support
   * - `email`: Email client compatible
   * - `hybrid`: Both with warnings
   */
  target: 'web' | 'email' | 'hybrid';

  /**
   * Locale code (BCP 47)
   * @default 'en-US'
   */
  locale?: string;

  /**
   * Storage configuration
   */
  storage: StorageConfig;
}
```

---

## Component Architecture

### SOLID Principles

#### Single Responsibility Principle (SRP)
Each component has one reason to change.

```tsx
// ❌ Bad - Multiple responsibilities
function UserProfileCard({ user }) {
  const [data, setData] = useState(null);

  // Data fetching
  useEffect(() => {
    fetch(`/api/users/${user.id}`)
      .then(res => res.json())
      .then(setData);
  }, [user.id]);

  // Rendering
  return (
    <div>
      <img src={data?.avatar} />
      <h2>{data?.name}</h2>
      <p>{data?.bio}</p>
    </div>
  );
}

// ✅ Good - Separated concerns
// 1. Data fetching hook
function useUser(userId: string) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(setData);
  }, [userId]);

  return data;
}

// 2. Presentation component
function UserProfileCard({ user }) {
  return (
    <div>
      <img src={user.avatar} />
      <h2>{user.name}</h2>
      <p>{user.bio}</p>
    </div>
  );
}

// 3. Container component
function UserProfileContainer({ userId }) {
  const user = useUser(userId);
  return user ? <UserProfileCard user={user} /> : <Loading />;
}
```

#### Open/Closed Principle (OCP)
Open for extension, closed for modification.

```tsx
// ❌ Bad - Requires modification to add types
function Button({ type, ...props }) {
  if (type === 'primary') return <button className="btn-primary" {...props} />;
  if (type === 'secondary') return <button className="btn-secondary" {...props} />;
  if (type === 'ghost') return <button className="btn-ghost" {...props} />;
}

// ✅ Good - Uses composition
interface ButtonProps {
  variant?: ButtonVariant;
  className?: string;
  children: ComponentChildren;
}

function Button({ variant = 'primary', className, children }: ButtonProps) {
  const variantClass = styles[`button--${variant}`];
  return (
    <button className={`${styles.button} ${variantClass} ${className}`}>
      {children}
    </button>
  );
}
```

#### Dependency Inversion Principle (DIP)
Depend on abstractions, not concretions.

```typescript
// ❌ Bad - Direct dependency
class TemplateManager {
  private storage = new LocalStorage();

  save(template: Template) {
    this.storage.set('template', template);
  }
}

// ✅ Good - Depends on interface
interface StorageAdapter {
  get(key: string): Promise<unknown>;
  set(key: string, value: unknown): Promise<void>;
}

class TemplateManager {
  constructor(private storage: StorageAdapter) {}

  async save(template: Template) {
    await this.storage.set('template', template);
  }
}
```

### Component Structure

#### Vanilla JS Components
```typescript
// button.ts
import styles from './button.module.scss';
import type { ButtonProps } from './button.types';

/**
 * Button component
 *
 * @example
 * ```ts
 * const button = new Button({
 *   variant: 'primary',
 *   onClick: () => console.log('clicked')
 * });
 * document.body.appendChild(button.render());
 * ```
 */
export class Button {
  private props: ButtonProps;
  private element: HTMLButtonElement;

  constructor(props: ButtonProps) {
    this.props = props;
    this.element = this.createButton();
    this.attachEventListeners();
  }

  private createButton(): HTMLButtonElement {
    const button = document.createElement('button');
    button.className = this.getClassNames();
    button.textContent = this.props.children as string;
    button.disabled = this.props.disabled ?? false;
    return button;
  }

  private getClassNames(): string {
    const { variant = 'primary', size = 'medium' } = this.props;
    return `${styles.button} ${styles[`button--${variant}`]} ${styles[`button--${size}`]}`;
  }

  private attachEventListeners(): void {
    if (this.props.onClick) {
      this.element.addEventListener('click', this.props.onClick);
    }
  }

  public render(): HTMLElement {
    return this.element;
  }

  public update(props: Partial<ButtonProps>): void {
    this.props = { ...this.props, ...props };
    this.element.className = this.getClassNames();
    if (props.children !== undefined) {
      this.element.textContent = props.children as string;
    }
    if (props.disabled !== undefined) {
      this.element.disabled = props.disabled;
    }
  }

  public destroy(): void {
    this.element.remove();
  }
}
```

#### Solid JS Components
```tsx
// Button.tsx
import { Component, JSX, splitProps } from 'solid-js';
import styles from './button.module.scss';
import type { ButtonProps } from './button.types';

/**
 * Button component
 *
 * @example
 * ```tsx
 * <Button variant="primary" onClick={() => console.log('clicked')}>
 *   Click me
 * </Button>
 * ```
 */
export const Button: Component<ButtonProps> = (props) => {
  const [local, others] = splitProps(props, ['variant', 'size', 'children', 'class']);

  const classes = () => {
    const variant = local.variant ?? 'primary';
    const size = local.size ?? 'medium';
    return `${styles.button} ${styles[`button--${variant}`]} ${styles[`button--${size}`]} ${local.class ?? ''}`;
  };

  return (
    <button class={classes()} {...others}>
      {local.children}
    </button>
  );
};
```

### Component Composition

**Compound Components:**
```tsx
// Accordion.tsx
interface AccordionProps {
  children: JSX.Element;
}

interface AccordionItemProps {
  title: string;
  children: JSX.Element;
}

export function Accordion({ children }: AccordionProps) {
  return <div class={styles.accordion}>{children}</div>;
}

Accordion.Item = function AccordionItem({ title, children }: AccordionItemProps) {
  const [open, setOpen] = createSignal(false);

  return (
    <div class={styles.accordion__item}>
      <button
        class={styles.accordion__trigger}
        onClick={() => setOpen(!open())}
      >
        {title}
      </button>
      {open() && (
        <div class={styles.accordion__content}>
          {children}
        </div>
      )}
    </div>
  );
};

// Usage
<Accordion>
  <Accordion.Item title="Section 1">Content 1</Accordion.Item>
  <Accordion.Item title="Section 2">Content 2</Accordion.Item>
</Accordion>
```

**Render Props:**
```tsx
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => JSX.Element;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return (
    <ul class={styles.list}>
      <For each={items}>
        {(item, index) => (
          <li class={styles.list__item}>
            {renderItem(item, index())}
          </li>
        )}
      </For>
    </ul>
  );
}

// Usage
<List
  items={users}
  renderItem={(user) => <UserCard user={user} />}
/>
```

---

## File Structure & Naming

### Naming Conventions

**Files:**
```
PascalCase for components:     Button.tsx, UserProfile.tsx
kebab-case for utilities:      format-date.ts, parse-json.ts
kebab-case for styles:         button.module.scss, user-profile.module.scss
lowercase for types:           button.types.ts, user.types.ts
lowercase for tests:           button.test.ts, user.test.ts
```

**Directories:**
```
kebab-case:                    ui-components/, email-components/
lowercase for simple names:    core/, types/, utils/
```

**Variables & Functions:**
```typescript
// camelCase for variables and functions
const userName = 'John';
function getUserName() {}

// PascalCase for components and classes
class UserManager {}
const Button = () => {};

// UPPER_SNAKE_CASE for constants
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = 'https://api.example.com';

// camelCase for component props
interface ButtonProps {
  onClick: () => void;
  isDisabled: boolean;
  className?: string;
}
```

### Component File Structure

**Simple Component:**
```
button/
├── Button.tsx              # Component implementation
├── button.module.scss      # Styles
├── button.types.ts         # Type definitions
├── button.test.ts          # Tests
└── index.ts                # Public exports
```

**Complex Component:**
```
text-editor/
├── TextEditor.tsx              # Main component
├── text-editor.module.scss     # Styles
├── text-editor.types.ts        # Type definitions
├── text-editor.test.ts         # Tests
├── components/                 # Sub-components
│   ├── Toolbar.tsx
│   ├── toolbar.module.scss
│   ├── FormatButton.tsx
│   └── format-button.module.scss
├── hooks/                      # Custom hooks
│   ├── use-editor-state.ts
│   └── use-toolbar-items.ts
├── utils/                      # Utilities
│   ├── format-text.ts
│   └── parse-selection.ts
└── index.ts                    # Public exports
```

**Index File:**
```typescript
// index.ts - Public API
export { Button } from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './button.types';
```

### Package Structure

```
packages/ui-components/
├── src/
│   ├── atoms/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── button.module.scss
│   │   │   ├── button.types.ts
│   │   │   ├── button.test.ts
│   │   │   └── index.ts
│   │   ├── Input/
│   │   └── index.ts               # Export all atoms
│   │
│   ├── molecules/
│   │   ├── TextEditor/
│   │   ├── ColorPicker/
│   │   └── index.ts               # Export all molecules
│   │
│   ├── organisms/
│   │   ├── ComponentPalette/
│   │   ├── PropertyPanel/
│   │   └── index.ts               # Export all organisms
│   │
│   ├── utils/                     # Shared utilities
│   │   ├── dom.ts
│   │   ├── format.ts
│   │   └── index.ts
│   │
│   ├── hooks/                     # Shared hooks (Solid JS)
│   │   ├── use-media-query.ts
│   │   ├── use-click-outside.ts
│   │   └── index.ts
│   │
│   ├── types/                     # Shared types
│   │   ├── common.types.ts
│   │   ├── component.types.ts
│   │   └── index.ts
│   │
│   └── index.ts                   # Main package entry
│
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Design Tokens

### Token Structure

**Format:** W3C Design Tokens Community Group specification

```json
{
  "color": {
    "brand": {
      "$type": "color",
      "primary": {
        "50": { "$value": "#eff6ff" },
        "100": { "$value": "#dbeafe" },
        "500": { "$value": "#3b82f6" },
        "900": { "$value": "#1e3a8a" }
      }
    },
    "semantic": {
      "$type": "color",
      "success": { "$value": "{color.green.500}" },
      "error": { "$value": "{color.red.500}" },
      "warning": { "$value": "{color.yellow.500}" }
    }
  },
  "spacing": {
    "$type": "dimension",
    "xs": { "$value": "0.25rem" },
    "sm": { "$value": "0.5rem" },
    "md": { "$value": "1rem" },
    "lg": { "$value": "1.5rem" },
    "xl": { "$value": "2rem" }
  },
  "typography": {
    "font-family": {
      "$type": "fontFamily",
      "sans": { "$value": ["Inter", "system-ui", "sans-serif"] },
      "mono": { "$value": ["JetBrains Mono", "monospace"] }
    },
    "font-size": {
      "$type": "dimension",
      "xs": { "$value": "0.75rem" },
      "sm": { "$value": "0.875rem" },
      "base": { "$value": "1rem" },
      "lg": { "$value": "1.125rem" },
      "xl": { "$value": "1.25rem" }
    }
  }
}
```

### Token Organization

```
packages/tokens/
├── src/
│   ├── colors/
│   │   ├── brand.json          # Brand colors
│   │   ├── semantic.json       # Semantic colors (success, error, etc.)
│   │   ├── ui.json             # UI colors (backgrounds, borders)
│   │   └── syntax.json         # Code syntax highlighting
│   │
│   ├── typography/
│   │   ├── fonts.json          # Font families
│   │   ├── sizes.json          # Font sizes
│   │   ├── weights.json        # Font weights
│   │   ├── line-heights.json   # Line heights
│   │   └── letter-spacing.json # Letter spacing
│   │
│   ├── spacing/
│   │   └── scale.json          # Spacing scale
│   │
│   ├── sizing/
│   │   └── scale.json          # Size scale
│   │
│   ├── border/
│   │   ├── radius.json         # Border radius
│   │   └── width.json          # Border width
│   │
│   ├── shadow/
│   │   └── elevation.json      # Box shadows
│   │
│   ├── animation/
│   │   ├── duration.json       # Animation durations
│   │   └── easing.json         # Easing functions
│   │
│   └── breakpoints/
│       └── devices.json        # Responsive breakpoints
│
├── build/                      # Generated files
│   ├── css/
│   │   └── variables.css       # CSS custom properties
│   ├── scss/
│   │   └── _variables.scss     # SCSS variables
│   ├── js/
│   │   └── tokens.js           # JavaScript export
│   └── ts/
│       └── tokens.ts           # TypeScript export
│
├── scripts/
│   └── build-tokens.js         # Build script
│
├── package.json
└── README.md
```

### Using Tokens in SCSS

```scss
// Import tokens
@use '@tokens/colors' as colors;
@use '@tokens/spacing' as spacing;
@use '@tokens/typography' as typography;

.component {
  // Colors
  background-color: colors.$brand-primary-500;
  color: colors.$semantic-success;

  // Spacing
  padding: spacing.$md;
  margin-bottom: spacing.$lg;

  // Typography
  font-family: typography.$font-family-sans;
  font-size: typography.$font-size-base;
  line-height: typography.$line-height-normal;
}
```

### Using Tokens in JavaScript/TypeScript

```typescript
import { colors, spacing, typography } from '@tokens';

const styles = {
  backgroundColor: colors.brand.primary[500],
  padding: spacing.md,
  fontFamily: typography.fontFamily.sans,
  fontSize: typography.fontSize.base
};
```

---

## Documentation Standards

### Component Documentation

```typescript
/**
 * Button component for user interactions
 *
 * Supports multiple variants, sizes, and states. Can be used with icons
 * and custom content.
 *
 * @example
 * Basic usage:
 * ```tsx
 * <Button variant="primary" onClick={handleClick}>
 *   Click me
 * </Button>
 * ```
 *
 * @example
 * With icon:
 * ```tsx
 * <Button variant="secondary" size="large">
 *   <Icon name="star" />
 *   Favorite
 * </Button>
 * ```
 *
 * @see {@link https://docs.example.com/components/button | Documentation}
 */
export interface ButtonProps {
  /**
   * Visual style variant
   *
   * - `primary`: Main call-to-action
   * - `secondary`: Secondary actions
   * - `ghost`: Minimal emphasis
   *
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'ghost';

  /**
   * Size of the button
   *
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Disabled state
   *
   * When true, button cannot be interacted with and appears dimmed.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Click event handler
   *
   * @param event - Mouse event from the click
   */
  onClick?: (event: MouseEvent) => void;

  /**
   * Button content
   *
   * Can be text, elements, or components.
   */
  children: ComponentChildren;
}
```

### Function Documentation

```typescript
/**
 * Formats a date according to the specified format and locale
 *
 * @param date - Date to format
 * @param format - Format string (e.g., 'YYYY-MM-DD', 'MM/DD/YYYY')
 * @param locale - Locale code (e.g., 'en-US', 'fr-FR')
 * @returns Formatted date string
 *
 * @throws {Error} If date is invalid
 *
 * @example
 * ```ts
 * formatDate(new Date(), 'YYYY-MM-DD', 'en-US');
 * // => '2024-03-15'
 * ```
 *
 * @see {@link https://date-fns.org/docs/format | date-fns format}
 */
export function formatDate(
  date: Date,
  format: string,
  locale: string = 'en-US'
): string {
  // Implementation
}
```

### Class Documentation

```typescript
/**
 * Manages email template operations
 *
 * Handles template creation, loading, saving, and validation.
 * Uses the provided storage adapter for persistence.
 *
 * @example
 * ```ts
 * const manager = new TemplateManager(storageAdapter);
 * const template = await manager.load('my-template');
 * await manager.save(template);
 * ```
 */
export class TemplateManager {
  /**
   * Creates a new TemplateManager instance
   *
   * @param storage - Storage adapter for persistence
   * @param validator - Optional template validator
   */
  constructor(
    private storage: StorageAdapter,
    private validator?: TemplateValidator
  ) {}

  /**
   * Loads a template by ID
   *
   * @param id - Template identifier
   * @returns Promise resolving to the template
   * @throws {TemplateNotFoundError} If template doesn't exist
   */
  async load(id: string): Promise<Template> {
    // Implementation
  }
}
```

### Package README Structure

```markdown
# Package Name

Brief description of the package.

## Installation

\`\`\`bash
pnpm add @email-builder/package-name
\`\`\`

## Usage

Basic usage example.

\`\`\`typescript
import { Component } from '@email-builder/package-name';
\`\`\`

## API Reference

Link to generated TypeDoc documentation.

## Examples

### Example 1
Description and code.

### Example 2
Description and code.

## Contributing

Link to contribution guidelines.

## License

MIT
```

---

## Testing Standards

### Testing Philosophy
- **Unit Tests**: Test individual functions and components in isolation
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test complete user flows
- **Coverage Goal**: > 80%

### Test Structure

```typescript
// button.test.ts
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/solid';
import { Button } from './Button';

describe('Button', () => {
  describe('rendering', () => {
    it('renders with default props', () => {
      const { getByRole } = render(() => <Button>Click me</Button>);
      const button = getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Click me');
    });

    it('renders with custom variant', () => {
      const { getByRole } = render(() => (
        <Button variant="secondary">Click me</Button>
      ));
      const button = getByRole('button');
      expect(button).toHaveClass('button--secondary');
    });
  });

  describe('interactions', () => {
    it('calls onClick handler when clicked', () => {
      const handleClick = vi.fn();
      const { getByRole } = render(() => (
        <Button onClick={handleClick}>Click me</Button>
      ));

      fireEvent.click(getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', () => {
      const handleClick = vi.fn();
      const { getByRole } = render(() => (
        <Button onClick={handleClick} disabled>Click me</Button>
      ));

      fireEvent.click(getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('is keyboard accessible', () => {
      const handleClick = vi.fn();
      const { getByRole } = render(() => (
        <Button onClick={handleClick}>Click me</Button>
      ));

      const button = getByRole('button');
      button.focus();
      fireEvent.keyDown(button, { key: 'Enter' });
      expect(handleClick).toHaveBeenCalled();
    });
  });
});
```

### Test Naming

```typescript
// Pattern: "should [expected behavior] when [condition]"

it('should render error message when validation fails', () => {});
it('should disable submit button when form is invalid', () => {});
it('should call onSave with template data when save button is clicked', () => {});
```

### Mocking

```typescript
// Mock functions
const mockFn = vi.fn();
const mockFnWithReturn = vi.fn(() => 'return value');

// Mock modules
vi.mock('./module', () => ({
  function: vi.fn(),
  Class: vi.fn()
}));

// Mock timers
vi.useFakeTimers();
vi.advanceTimersByTime(1000);
vi.useRealTimers();
```

---

## Git Workflow

### Branch Naming

```
main                    # Production-ready code
develop                 # Integration branch

feature/[ticket]-description
  feature/EB-123-add-text-editor
  feature/EB-124-style-presets

fix/[ticket]-description
  fix/EB-125-button-hover-state
  fix/EB-126-mobile-layout

refactor/description
  refactor/component-architecture
  refactor/type-definitions

docs/description
  docs/api-reference
  docs/component-guidelines

chore/description
  chore/update-dependencies
  chore/configure-ci
```

### Commit Messages

**IMPORTANT: This project follows [Conventional Commits](https://www.conventionalcommits.org/) specification and atomic commit principles.**

#### Atomic Commits
- Each commit should represent a single, logical change
- One commit = one purpose (e.g., don't mix feature addition with refactoring)
- Commits should be self-contained and not break the build
- Makes git history clean, reviewable, and easy to revert if needed
- If you need to use "and" in your commit message, it's probably not atomic

**Good Atomic Commits:**
```
✅ feat(button): add ghost variant
✅ test(button): add tests for ghost variant
✅ docs(button): update button documentation
```

**Bad Non-Atomic Commits:**
```
❌ feat(button): add ghost variant, update docs, and add tests
❌ fix(button): fix hover state and refactor styling logic
```

#### Conventional Commits Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type (Required):**
- `feat`: New feature for the user
- `fix`: Bug fix for the user
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `docs`: Documentation only changes
- `style`: Changes that don't affect code meaning (whitespace, formatting)
- `test`: Adding or updating tests
- `perf`: Performance improvements
- `build`: Changes to build system or dependencies
- `ci`: Changes to CI configuration files and scripts
- `chore`: Other changes that don't modify src or test files
- `revert`: Reverts a previous commit

**Scope (Optional but Recommended):**
- Package or module name (e.g., `button`, `text-editor`, `tokens`)
- Area of codebase (e.g., `core`, `ui`, `types`)

**Subject (Required):**
- Use imperative, present tense: "add" not "added" or "adds"
- Don't capitalize first letter
- No period at the end
- Maximum 50 characters
- Be specific and descriptive

**Body (Optional):**
- Use when commit needs explanation beyond subject
- Explain "what" and "why", not "how"
- Wrap at 72 characters
- Separate from subject with blank line

**Footer (Optional):**
- Reference issues and PRs
- Note breaking changes
- Keywords: `Closes`, `Fixes`, `Refs`, `BREAKING CHANGE`

#### Examples

**Simple feature:**
```
feat(button): add ghost variant

Adds a new ghost variant to the Button component with minimal
visual emphasis for tertiary actions.

Closes #123
```

**Bug fix:**
```
fix(text-editor): resolve toolbar position on scroll

The toolbar was not maintaining its position when the editor
was scrolled. Added sticky positioning with proper z-index
to ensure it stays visible above content.

Fixes #124
```

**Refactoring:**
```
refactor(types): organize component type definitions

Moved all component types to dedicated .types.ts files for
better organization and auto-documentation generation.
This improves maintainability and makes TypeDoc output cleaner.
```

**Breaking change:**
```
feat(core)!: change builder config API

BREAKING CHANGE: The builder configuration API has changed.
`target` is now required and `storage.method` has been renamed
to `storage.adapter`.

Migration guide:
- Add `target` to your config
- Rename `storage.method` to `storage.adapter`

Closes #125
```

**Documentation:**
```
docs(readme): add installation instructions
```

**Multiple files, one logical change:**
```
feat(color-picker): add color picker component

Implements a new color picker molecule component with:
- Predefined color palette
- Custom color input
- Opacity slider
- Recent colors history

Closes #126
```

#### Commit Message Checklist
- [ ] Follows Conventional Commits format
- [ ] Type is appropriate and correct
- [ ] Scope is specific and clear
- [ ] Subject uses imperative mood
- [ ] Subject is under 50 characters
- [ ] Body explains what and why (if needed)
- [ ] References related issues/PRs
- [ ] Commit is atomic (single logical change)
- [ ] Build passes after this commit

### Pull Request Template

```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Refactoring
- [ ] Documentation
- [ ] Other (please describe)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] No new warnings

## Screenshots (if applicable)

## Related Issues
Closes #123
```

---

## Code Quality

### ESLint Configuration

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:solid/typescript",
    "prettier"
  ],
  "rules": {
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "no-debugger": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-unused-vars": ["error", {
      "argsIgnorePattern": "^_"
    }]
  }
}
```

### Prettier Configuration

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### Code Review Checklist

**Functionality:**
- [ ] Code works as intended
- [ ] Edge cases handled
- [ ] Error handling implemented
- [ ] No console.log or debugger statements

**Code Quality:**
- [ ] Follows SOLID principles
- [ ] No code duplication
- [ ] Functions are small and focused
- [ ] Clear variable and function names
- [ ] Comments explain "why", not "what"

**TypeScript:**
- [ ] No `any` types
- [ ] All types properly defined
- [ ] Generic types used appropriately
- [ ] Type guards where needed

**Styling:**
- [ ] Follows CSS Modules + BEM or Tailwind guideline
- [ ] No mixing of styling approaches
- [ ] Uses design tokens
- [ ] Responsive design implemented

**Testing:**
- [ ] Unit tests added
- [ ] Edge cases tested
- [ ] All tests passing
- [ ] Coverage maintained/improved

**Documentation:**
- [ ] JSDoc comments added
- [ ] README updated if needed
- [ ] Examples provided
- [ ] API changes documented

---

## Performance Guidelines

### Bundle Size
- Keep individual components < 10KB (gzipped)
- Use code splitting for large features
- Lazy load non-critical components

### Rendering Performance
- Use `memo` for expensive computations
- Avoid unnecessary re-renders
- Use virtual scrolling for long lists

### Optimization Techniques

```typescript
// 1. Memoization
const expensiveValue = createMemo(() => {
  return computeExpensiveValue(props.data);
});

// 2. Lazy loading
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// 3. Debouncing
const debouncedSearch = debounce((value: string) => {
  performSearch(value);
}, 300);

// 4. Virtual scrolling
<VirtualList
  items={items}
  itemHeight={50}
  renderItem={(item) => <ListItem item={item} />}
/>
```

---

## Accessibility Guidelines

### WCAG 2.1 AA Compliance

**Keyboard Navigation:**
- All interactive elements accessible via keyboard
- Visible focus indicators
- Logical tab order

**Screen Readers:**
- Semantic HTML elements
- ARIA labels where needed
- Alt text for images
- Proper heading hierarchy

**Color Contrast:**
- Minimum 4.5:1 for normal text
- Minimum 3:1 for large text
- Don't rely solely on color

```tsx
// Example: Accessible button
<button
  type="button"
  aria-label="Close dialog"
  onClick={handleClose}
  class={styles.button}
>
  <Icon name="close" aria-hidden="true" />
  <span class="sr-only">Close</span>
</button>
```

---

## Icon System

### Using Remix Icons

**Option 1: Icon Font (Recommended)**
```typescript
// Generate custom icon font from selected icons
import { Icon } from '@ui-components';

<Icon name="arrow-right" size="24" />
```

**Option 2: Remix Icons Package**
```typescript
import { RiArrowRightLine } from 'remix-icons-solid';

<RiArrowRightLine size={24} />
```

### Icon Component

```tsx
// Icon.tsx
interface IconProps {
  /**
   * Icon name from Remix Icons
   */
  name: string;

  /**
   * Icon size in pixels
   * @default 24
   */
  size?: number;

  /**
   * Icon color (uses currentColor if not specified)
   */
  color?: string;

  /**
   * Additional CSS class
   */
  class?: string;
}

export const Icon: Component<IconProps> = (props) => {
  return (
    <i
      class={`ri-${props.name} ${props.class ?? ''}`}
      style={{
        'font-size': `${props.size ?? 24}px`,
        color: props.color
      }}
    />
  );
};
```

---

## Final Notes

### When in Doubt
1. Follow SOLID principles
2. Keep components small and focused
3. Use design tokens
4. Document thoroughly
5. Write tests
6. Ask for code review

### Resources
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Solid JS Guide](https://www.solidjs.com/docs/latest)
- [BEM Methodology](https://getbem.com/)
- [W3C Design Tokens](https://design-tokens.github.io/community-group/format/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Remix Icons](https://remixicon.com/)

### Continuous Improvement
This document is living and should be updated as the project evolves. Suggest improvements via pull requests.
