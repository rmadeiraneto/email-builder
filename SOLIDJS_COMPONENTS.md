# SolidJS Components

This document describes the new SolidJS component architecture created to provide reactive versions of the existing vanilla JS class components.

## Architecture Overview

The component architecture follows a **shared foundation** approach where:

1. **Type definitions** are shared between vanilla JS and SolidJS components
2. **SCSS modules** are shared between both implementations
3. **Utility functions** provide common logic (class names, ARIA attributes, etc.)
4. **Components** are implemented twice:
   - Vanilla JS class components in `packages/ui-components`
   - SolidJS reactive components in `packages/ui-solid`

## Package Structure

```
packages/
├── ui-components/              # Vanilla JS class components
│   └── src/
│       ├── atoms/              # Basic components (Button, Input, Label, Icon)
│       ├── molecules/          # Complex components (Modal, Dropdown, Tabs, etc.)
│       ├── utils/              # ✨ NEW: Shared utilities
│       │   ├── classNames.ts   # Class name generation
│       │   ├── aria.ts         # ARIA attribute helpers
│       │   └── props.ts        # Prop manipulation utilities
│       └── types/
│
└── ui-solid/                   # SolidJS components
    └── src/
        ├── atoms/              # ✨ NEW: SolidJS atom components
        │   ├── Button/
        │   ├── Input/
        │   ├── Label/
        │   └── Icon/
        ├── molecules/          # ✨ NEW: SolidJS molecule components
        │   ├── Modal/
        │   ├── Dropdown/
        │   ├── Tabs/
        │   ├── Tooltip/
        │   ├── Accordion/
        │   └── Alert/
        ├── canvas/             # Existing canvas components
        ├── sidebar/            # Existing sidebar components
        └── toolbar/            # Existing toolbar components
```

## Created Components

### Atoms (Basic Components)

#### Button
**Location:** `packages/ui-solid/src/atoms/Button/Button.tsx`

Reactive button component with variants, sizes, and icon support.

```tsx
import { Button } from '@email-builder/ui-solid/atoms';

<Button variant="primary" size="medium" icon="star" onClick={() => console.log('clicked')}>
  Click me
</Button>
```

**Features:**
- Variants: primary, secondary, ghost
- Sizes: small, medium, large
- Icon positioning (left/right)
- Full width option
- Disabled state

#### Input
**Location:** `packages/ui-solid/src/atoms/Input/Input.tsx`

Reactive input component with validation states.

```tsx
import { Input } from '@email-builder/ui-solid/atoms';

<Input
  type="email"
  placeholder="Enter email"
  validationState="error"
  onInput={(e) => console.log(e.currentTarget.value)}
/>
```

**Features:**
- Types: text, email, password, number, tel, url, search
- Sizes: small, medium, large
- Validation states: default, error, success, warning
- ARIA support
- Full width option

#### Label
**Location:** `packages/ui-solid/src/atoms/Label/Label.tsx`

Simple label component for form inputs.

```tsx
import { Label } from '@email-builder/ui-solid/atoms';

<Label htmlFor="email-input" required>
  Email Address
</Label>
```

**Features:**
- Required field indicator
- Associated with input via `htmlFor`

#### Icon
**Location:** `packages/ui-solid/src/atoms/Icon/Icon.tsx`

Remix Icon display component.

```tsx
import { Icon } from '@email-builder/ui-solid/atoms';

<Icon name="star-fill" size={24} color="#f59e0b" ariaLabel="Favorite" />
```

**Features:**
- Size variants: small (16px), medium (24px), large (32px), or custom pixels
- Custom colors
- Clickable icons
- ARIA accessibility

### Molecules (Complex Components)

#### Modal
**Location:** `packages/ui-solid/src/molecules/Modal/Modal.tsx`

Flexible modal dialog with positioning support.

```tsx
import { Modal } from '@email-builder/ui-solid/molecules';
import { createSignal } from 'solid-js';

const [isOpen, setIsOpen] = createSignal(false);

<Modal isOpen={isOpen()} onClose={() => setIsOpen(false)}>
  <div>Modal content here</div>
</Modal>
```

**Features:**
- Floating-UI positioning
- Backdrop click to close
- Custom placement
- Open/close callbacks

#### Dropdown
**Location:** `packages/ui-solid/src/molecules/Dropdown/Dropdown.tsx`

Dropdown menu with floating positioning.

```tsx
import { Dropdown, type DropdownItem } from '@email-builder/ui-solid/molecules';
import { createSignal } from 'solid-js';

const items: DropdownItem[] = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
];

const [selected, setSelected] = createSignal<DropdownItem | null>(null);

<Dropdown
  items={items}
  selectedItem={selected()}
  onChange={(item) => setSelected(item)}
  placeholder="Select an option"
/>
```

**Features:**
- Floating-UI positioning
- Size variants: sm, md, lg
- Disabled items
- Click outside to close
- Custom placement

#### Tabs
**Location:** `packages/ui-solid/src/molecules/Tabs/Tabs.tsx`

Tab navigation component.

```tsx
import { Tabs, type TabItem } from '@email-builder/ui-solid/molecules';
import { createSignal } from 'solid-js';

const items: TabItem[] = [
  { label: 'Tab 1', content: <div>Content 1</div> },
  { label: 'Tab 2', content: <div>Content 2</div> },
];

const [activeIndex, setActiveIndex] = createSignal(0);

<Tabs
  items={items}
  activeIndex={activeIndex()}
  onTabChange={(index) => setActiveIndex(index)}
/>
```

**Features:**
- Controlled/uncontrolled modes
- Disabled tabs
- Custom tab and pane classes
- ARIA accessibility

#### Tooltip
**Location:** `packages/ui-solid/src/molecules/Tooltip/Tooltip.tsx`

Hover tooltip with positioning.

```tsx
import { Tooltip } from '@email-builder/ui-solid/molecules';

<Tooltip content="This is a tooltip" placement="top" delay={200}>
  <button>Hover me</button>
</Tooltip>
```

**Features:**
- Floating-UI positioning
- Configurable delay
- Multiple placements
- Hover and focus triggers

#### Accordion
**Location:** `packages/ui-solid/src/molecules/Accordion/Accordion.tsx`

Expandable/collapsible content container.

```tsx
import { Accordion } from '@email-builder/ui-solid/molecules';

<Accordion title="Click to expand" variant="primary" startOpen={false}>
  <div>Accordion content here</div>
</Accordion>
```

**Features:**
- Color variants: default, primary, secondary
- Custom icons
- Open/close callbacks
- Start open option

#### Alert
**Location:** `packages/ui-solid/src/molecules/Alert/Alert.tsx`

Alert messages with severity levels.

```tsx
import { Alert } from '@email-builder/ui-solid/molecules';

<Alert variant="error" closable onClose={() => console.log('closed')}>
  An error occurred!
</Alert>
```

**Features:**
- Variants: info, success, warning, error
- Closable option
- Default icons for each variant
- Custom icons

## Shared Utilities

### Class Name Utilities
**Location:** `packages/ui-components/src/utils/classNames.ts`

```ts
import { classNames, getComponentClasses } from '@email-builder/ui-components/utils';

// Simple class name joining
const classes = classNames('base', isActive && 'active', undefined, 'final');
// Returns: 'base active final'

// Component class generation with modifiers
const classes = getComponentClasses(
  styles,
  'button',
  { primary: true, disabled: false, 'full-width': true },
  'custom-class'
);
// Returns: 'button button--primary button--full-width custom-class'
```

### ARIA Utilities
**Location:** `packages/ui-components/src/utils/aria.ts`

```ts
import { setAriaAttribute, getAriaProps, getValidationAriaProps } from '@email-builder/ui-components/utils';

// Set ARIA attribute on DOM element
setAriaAttribute(button, 'disabled', true);

// Get ARIA props for SolidJS components
const ariaProps = getAriaProps({
  ariaLabel: 'Close',
  ariaDisabled: true,
});
// Returns: { 'aria-label': 'Close', 'aria-disabled': 'true' }

// Get validation ARIA props
const validationProps = getValidationAriaProps('error', true, 'error-message');
// Returns: { 'aria-invalid': 'true', 'aria-required': 'true', 'aria-describedby': 'error-message' }
```

### Prop Utilities
**Location:** `packages/ui-components/src/utils/props.ts`

```ts
import { mergeProps, pickDefined, pickEventHandlers } from '@email-builder/ui-components/utils';

// Merge default props with provided props
const merged = mergeProps(
  { variant: 'primary', size: 'medium' },
  { variant: 'secondary' }
);
// Returns: { variant: 'secondary', size: 'medium' }

// Pick only defined values
const defined = pickDefined({ a: 1, b: undefined, c: null });
// Returns: { a: 1, c: null }

// Pick only event handlers
const handlers = pickEventHandlers({ onClick: fn, variant: 'primary', onBlur: fn });
// Returns: { onClick: fn, onBlur: fn }
```

## Usage in Projects

### Using in ui-solid Package

The SolidJS components are now available for use in the existing ui-solid package:

```tsx
// Import atoms
import { Button, Input, Label, Icon } from '@email-builder/ui-solid/atoms';

// Import molecules
import { Modal, Dropdown, Tabs, Tooltip, Accordion, Alert } from '@email-builder/ui-solid/molecules';

// Or import from main package
import { Button, Modal, Tabs } from '@email-builder/ui-solid';
```

### Using in Dev App

Add the components to your dev app:

```tsx
import { Button, Input } from '@email-builder/ui-solid/atoms';
import { Modal, Tabs } from '@email-builder/ui-solid/molecules';

function App() {
  const [isModalOpen, setIsModalOpen] = createSignal(false);

  return (
    <div>
      <Button variant="primary" onClick={() => setIsModalOpen(true)}>
        Open Modal
      </Button>

      <Modal isOpen={isModalOpen()} onClose={() => setIsModalOpen(false)}>
        <div>
          <h2>Modal Title</h2>
          <Input placeholder="Enter something..." />
        </div>
      </Modal>
    </div>
  );
}
```

## Component Reusability Strategy

Both vanilla JS class components and SolidJS components share:

1. **Type Definitions**: Import from `@email-builder/ui-components/atoms` or `/molecules`
2. **SCSS Modules**: Import directly from `@email-builder/ui-components/src/atoms/*/...module.scss`
3. **Utility Functions**: Import from `@email-builder/ui-components/utils`

This approach ensures:
- ✅ Single source of truth for types
- ✅ Single source of truth for styles
- ✅ Single source of truth for utility logic
- ✅ Easy maintenance (update once, affects both implementations)
- ✅ Consistency between vanilla and reactive components

## Future Additions

To add more SolidJS components:

1. **Create the component file**:
   ```tsx
   // packages/ui-solid/src/[atoms|molecules]/ComponentName/ComponentName.tsx
   ```

2. **Reuse existing types** from `@email-builder/ui-components`

3. **Reuse existing styles** from `@email-builder/ui-components/src/...`

4. **Use shared utilities** from `@email-builder/ui-components/utils`

5. **Export from barrel files**:
   ```ts
   // packages/ui-solid/src/[atoms|molecules]/index.ts
   export * from './ComponentName';
   ```

## Testing

To test the components:

```bash
# Build ui-components first (includes utilities)
cd packages/ui-components
npm run build

# Build ui-solid (includes new SolidJS components)
cd packages/ui-solid
npm run build

# Run type checking
npm run typecheck
```

## Dependencies

The following dependencies were added:

- **ui-solid**: `@floating-ui/dom` ^1.6.0 (for Modal, Dropdown, Tooltip positioning)

## Benefits

1. **Code Reuse**: Types, styles, and utilities are shared between implementations
2. **Consistency**: Both vanilla and SolidJS components behave identically
3. **Maintainability**: Changes to shared code affect both implementations
4. **Flexibility**: Can use vanilla components in non-framework contexts, SolidJS components in reactive apps
5. **Progressive Enhancement**: Existing vanilla components continue to work, new SolidJS components provide modern reactive patterns
6. **Type Safety**: Full TypeScript support across both implementations

## Next Steps

1. **Install dependencies**: Run `npm install` in the root to install `@floating-ui/dom`
2. **Build packages**: Build `ui-components` first, then `ui-solid`
3. **Update vanilla components**: Optionally refactor existing vanilla JS components to use the new shared utilities
4. **Create additional components**: Add more SolidJS versions of the remaining 20+ molecule components
5. **Integration testing**: Test components in the dev app
6. **Documentation**: Add Storybook or similar for component showcase
