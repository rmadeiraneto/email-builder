# Design Tokens - Migration Guide

**Last Updated**: November 5, 2025
**Status**: Production Ready ✅
**Coverage**: 40/40 SCSS files (100%)

---

## Table of Contents

1. [Introduction](#introduction)
2. [Quick Start](#quick-start)
3. [Token Categories](#token-categories)
4. [Migration Patterns](#migration-patterns)
5. [Best Practices](#best-practices)
6. [Common Pitfalls](#common-pitfalls)
7. [Examples](#examples)
8. [Reference](#reference)

---

## Introduction

The Email Builder project uses a centralized design token system based on the [W3C Design Tokens Community Group specification](https://design-tokens.github.io/community-group/format/). All design values (colors, spacing, typography, etc.) are defined once in JSON files and automatically compiled to SCSS variables, CSS custom properties, and TypeScript exports.

### Benefits

- **Consistency**: Single source of truth for all design values
- **Maintainability**: Change a value once, update everywhere
- **Type Safety**: TypeScript exports provide autocomplete and type checking
- **Theming**: Easy to create theme variations
- **Documentation**: Tokens are self-documenting with descriptions

### Token Package Location

```
packages/tokens/
├── src/                    # Token definitions (JSON)
│   ├── colors/
│   ├── spacing/
│   ├── typography/
│   ├── border/
│   ├── shadow/
│   ├── animation/
│   ├── breakpoints/
│   ├── sizing/
│   └── components/
├── build/                  # Generated files (do not edit)
│   ├── scss/_variables.scss
│   ├── css/variables.css
│   ├── js/tokens.js
│   └── ts/tokens.ts
└── scripts/
    └── build-tokens.js     # Build script
```

---

## Quick Start

### Using Tokens in SCSS

Design tokens are automatically imported via Vite configuration. No manual imports needed!

```scss
/**
 * Component Styles
 * Design tokens are automatically imported via Vite configuration
 */

.my-component {
  // Colors
  background-color: tokens.$color-ui-background-primary;
  color: tokens.$color-ui-text-primary;
  border-color: tokens.$color-ui-border-base;

  // Spacing
  padding: tokens.$spacing-4;
  margin-bottom: tokens.$spacing-2;
  gap: tokens.$spacing-3;

  // Typography
  font-size: tokens.$typography-font-size-base;
  font-weight: tokens.$typography-font-weight-medium;
  line-height: tokens.$typography-line-height-normal;

  // Borders
  border-radius: tokens.$border-radius-md;
  border-width: tokens.$border-width-base;

  // Animation
  transition: all tokens.$animation-duration-normal tokens.$animation-easing-ease;

  // Sizing
  width: tokens.$sizing-64;
  height: tokens.$sizing-12;
}
```

### Using Tokens in TypeScript/JavaScript

```typescript
import { colors, spacing, typography } from '@email-builder/tokens';

const styles = {
  backgroundColor: colors.ui.background.primary,
  padding: spacing['4'],
  fontSize: typography.fontSize.base,
};
```

---

## Token Categories

### 1. Colors

**Location**: `packages/tokens/src/colors/`

#### Brand Colors
```scss
$color-brand-primary-50    // Lightest blue
$color-brand-primary-500   // Primary blue
$color-brand-primary-900   // Darkest blue

$color-brand-secondary-*   // Purple scale
$color-brand-accent-*      // Pink/Magenta scale
```

#### Semantic Colors
```scss
$color-semantic-success-base   // #10b981 (green)
$color-semantic-error-base     // #ef4444 (red)
$color-semantic-warning-base   // #f59e0b (orange)
$color-semantic-info-base      // #3b82f6 (blue)
```

#### UI Colors
```scss
// Backgrounds
$color-ui-background-primary    // #ffffff (white)
$color-ui-background-secondary  // #f9fafb (light gray)
$color-ui-background-tertiary   // #f3f4f6 (medium gray)
$color-ui-background-inverse    // #111827 (dark)
$color-ui-background-overlay    // rgba(0, 0, 0, 0.5)

// Text
$color-ui-text-primary          // #111827 (dark gray)
$color-ui-text-secondary        // #6b7280 (medium gray)
$color-ui-text-tertiary         // #9ca3af (light gray)
$color-ui-text-inverse          // #ffffff (white)

// Borders
$color-ui-border-base           // #e5e7eb
$color-ui-border-strong         // #d1d5db
$color-ui-border-focus          // #3b82f6 (blue)

// Interactive
$color-ui-interactive-default   // #3b82f6
$color-ui-interactive-hover     // #2563eb
$color-ui-interactive-active    // #1d4ed8
```

#### Neutral Scale
```scss
$color-neutral-50    // Lightest
$color-neutral-500   // Medium
$color-neutral-900   // Darkest
```

### 2. Spacing

**Location**: `packages/tokens/src/spacing/scale.json`

```scss
$spacing-0      // 0
$spacing-0-5    // 0.125rem (2px)
$spacing-1      // 0.25rem (4px)
$spacing-1-5    // 0.375rem (6px)
$spacing-2      // 0.5rem (8px)
$spacing-2-5    // 0.625rem (10px)
$spacing-3      // 0.75rem (12px)
$spacing-3-5    // 0.875rem (14px)
$spacing-4      // 1rem (16px)
$spacing-5      // 1.25rem (20px)
$spacing-6      // 1.5rem (24px)
$spacing-8      // 2rem (32px)
$spacing-10     // 2.5rem (40px)
$spacing-12     // 3rem (48px)
$spacing-16     // 4rem (64px)
$spacing-20     // 5rem (80px)
$spacing-24     // 6rem (96px)
```

### 3. Typography

**Location**: `packages/tokens/src/typography/`

#### Font Families
```scss
$typography-font-family-sans   // Inter, system-ui, sans-serif
$typography-font-family-mono   // JetBrains Mono, monospace
```

#### Font Sizes
```scss
$typography-font-size-xs       // 0.75rem (12px)
$typography-font-size-sm       // 0.875rem (14px)
$typography-font-size-base     // 1rem (16px)
$typography-font-size-lg       // 1.125rem (18px)
$typography-font-size-xl       // 1.25rem (20px)
$typography-font-size-2xl      // 1.5rem (24px)
$typography-font-size-3xl      // 1.875rem (30px)
$typography-font-size-4xl      // 2.25rem (36px)
```

#### Font Weights
```scss
$typography-font-weight-light      // 300
$typography-font-weight-normal     // 400
$typography-font-weight-medium     // 500
$typography-font-weight-semibold   // 600
$typography-font-weight-bold       // 700
```

#### Line Heights
```scss
$typography-line-height-tight      // 1.25
$typography-line-height-snug       // 1.375
$typography-line-height-normal     // 1.5
$typography-line-height-relaxed    // 1.625
$typography-line-height-loose      // 2
```

### 4. Borders

**Location**: `packages/tokens/src/border/`

#### Border Radius
```scss
$border-radius-none    // 0
$border-radius-sm      // 0.125rem (2px)
$border-radius-base    // 0.25rem (4px)
$border-radius-md      // 0.375rem (6px)
$border-radius-lg      // 0.5rem (8px)
$border-radius-xl      // 0.75rem (12px)
$border-radius-2xl     // 1rem (16px)
$border-radius-3xl     // 1.5rem (24px)
$border-radius-full    // 9999px (fully rounded)
```

#### Border Width
```scss
$border-width-0        // 0
$border-width-base     // 1px
$border-width-2        // 2px
$border-width-4        // 4px
$border-width-8        // 8px
```

### 5. Shadows

**Location**: `packages/tokens/src/shadow/elevation.json`

```scss
$shadow-sm      // Small shadow
$shadow-base    // Base shadow
$shadow-md      // Medium shadow
$shadow-lg      // Large shadow
$shadow-xl      // Extra large shadow
$shadow-2xl     // 2X large shadow
$shadow-inner   // Inner shadow
$shadow-none    // No shadow
```

**Note**: Shadow tokens currently output `[object Object]` in SCSS due to a build system limitation. Use hardcoded shadows for now or use component-specific shadow tokens.

### 6. Animation

**Location**: `packages/tokens/src/animation/`

#### Duration
```scss
$animation-duration-instant    // 0ms
$animation-duration-fast       // 100ms
$animation-duration-normal     // 200ms
$animation-duration-slow       // 300ms
$animation-duration-slower     // 500ms
$animation-duration-slowest    // 700ms
```

#### Easing
```scss
$animation-easing-linear           // linear
$animation-easing-ease             // ease
$animation-easing-ease-in          // ease-in
$animation-easing-ease-out         // ease-out
$animation-easing-ease-in-out      // ease-in-out
$animation-easing-ease-in-cubic    // cubic-bezier(0.32,0,0.67,0)
$animation-easing-ease-out-cubic   // cubic-bezier(0.33,1,0.68,1)
// ... and more
```

### 7. Sizing

**Location**: `packages/tokens/src/sizing/scale.json`

```scss
$sizing-0       // 0
$sizing-1       // 0.25rem (4px)
$sizing-2       // 0.5rem (8px)
$sizing-3       // 0.75rem (12px)
$sizing-4       // 1rem (16px)
$sizing-5       // 1.25rem (20px)
$sizing-6       // 1.5rem (24px)
$sizing-7       // 1.75rem (28px)
$sizing-8       // 2rem (32px)
$sizing-9       // 2.25rem (36px)
$sizing-10      // 2.5rem (40px)
$sizing-12      // 3rem (48px)
$sizing-16      // 4rem (64px)
$sizing-20      // 5rem (80px)
$sizing-24      // 6rem (96px)
$sizing-32      // 8rem (128px)
$sizing-40      // 10rem (160px)
$sizing-48      // 12rem (192px)
$sizing-56      // 14rem (224px)
$sizing-64      // 16rem (256px)
```

### 8. Component Tokens

**Location**: `packages/tokens/src/components/`

Component-specific tokens for consistent styling across the application.

#### Button
```scss
$component-button-padding-x-sm
$component-button-padding-y-sm
$component-button-border-radius-sm
$component-button-font-size-sm
$component-button-background-primary
$component-button-background-primary-hover
$component-button-text-primary
// ... and more
```

#### Modal
```scss
$component-modal-backdrop
$component-modal-background
$component-modal-padding
$component-modal-border-radius
$component-modal-max-width-sm
$component-modal-max-width-md
$component-modal-max-width-lg
```

#### Input
```scss
$component-input-background
$component-input-border
$component-input-text
$component-input-padding-x
$component-input-padding-y
$component-input-height
$component-input-border-radius
$component-input-focus-border
```

---

## Migration Patterns

### Before & After Examples

#### ❌ Before (Hardcoded Values)

```scss
.button {
  padding: 12px 24px;
  background-color: #3b82f6;
  color: #ffffff;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background-color: #2563eb;
  }

  &:disabled {
    background-color: #e5e7eb;
    color: #9ca3af;
    opacity: 0.6;
  }
}
```

#### ✅ After (Using Tokens)

```scss
/**
 * Button Component Styles
 * Design tokens are automatically imported via Vite configuration
 */

.button {
  padding: tokens.$spacing-3 tokens.$spacing-6;
  background-color: tokens.$color-brand-primary-500;
  color: tokens.$color-ui-text-inverse;
  border-radius: tokens.$border-radius-lg;
  font-size: tokens.$typography-font-size-sm;
  font-weight: tokens.$typography-font-weight-medium;
  transition: all tokens.$animation-duration-normal tokens.$animation-easing-ease;

  &:hover {
    background-color: tokens.$color-brand-primary-600;
  }

  &:disabled {
    background-color: tokens.$color-ui-interactive-disabled;
    color: tokens.$color-ui-text-tertiary;
    opacity: 0.6; // CSS property value, not a token
  }
}
```

### Step-by-Step Migration Process

1. **Identify hardcoded values** in your SCSS file
2. **Find the appropriate token** from the token categories
3. **Replace the value** with `tokens.$token-name`
4. **Test visually** to ensure no regressions
5. **Commit changes** with descriptive message

### Token Selection Decision Tree

```
Is it a color?
├─ Yes → Use $color-* tokens
│  ├─ UI element? → $color-ui-*
│  ├─ Brand color? → $color-brand-*
│  └─ Semantic? → $color-semantic-*
│
Is it spacing (padding, margin, gap)?
└─ Yes → Use $spacing-* tokens

Is it a dimension (width, height)?
└─ Yes → Use $sizing-* tokens

Is it typography?
├─ Font size? → $typography-font-size-*
├─ Font weight? → $typography-font-weight-*
├─ Line height? → $typography-line-height-*
└─ Font family? → $typography-font-family-*

Is it a border?
├─ Radius? → $border-radius-*
└─ Width? → $border-width-*

Is it animation?
├─ Duration? → $animation-duration-*
└─ Easing? → $animation-easing-*
```

---

## Best Practices

### DO ✅

1. **Always use tokens for design values**
   ```scss
   // ✅ Good
   padding: tokens.$spacing-4;
   color: tokens.$color-ui-text-primary;
   ```

2. **Use semantic color tokens when possible**
   ```scss
   // ✅ Good - semantic
   color: tokens.$color-semantic-error-base;

   // ⚠️ OK but less semantic
   color: tokens.$color-brand-primary-500;
   ```

3. **Use component tokens for component-specific styles**
   ```scss
   // ✅ Good
   padding: tokens.$component-button-padding-y tokens.$component-button-padding-x;
   ```

4. **Keep CSS property values as-is**
   ```scss
   // ✅ Good - opacity is a CSS property value
   opacity: 0;
   opacity: 0.6;
   opacity: 1;

   // ✅ Good - display values
   display: flex;
   display: block;
   display: none;
   ```

5. **Document token usage at file top**
   ```scss
   /**
    * Component Styles
    * Design tokens are automatically imported via Vite configuration
    */
   ```

### DON'T ❌

1. **Don't manually import tokens in SCSS**
   ```scss
   // ❌ Bad - not needed with Vite auto-import
   @use '@tokens/colors' as colors;

   // ✅ Good - tokens are auto-imported
   color: tokens.$color-ui-text-primary;
   ```

2. **Don't hardcode design values**
   ```scss
   // ❌ Bad
   padding: 16px;
   color: #3b82f6;
   font-size: 14px;

   // ✅ Good
   padding: tokens.$spacing-4;
   color: tokens.$color-brand-primary-500;
   font-size: tokens.$typography-font-size-sm;
   ```

3. **Don't create token-like custom properties**
   ```scss
   // ❌ Bad - creates duplicate system
   --my-primary-color: #3b82f6;
   color: var(--my-primary-color);

   // ✅ Good - use existing tokens
   color: tokens.$color-brand-primary-500;
   ```

4. **Don't use tokens for component-specific values**
   ```scss
   // ❌ Bad - context-specific overlay
   background: tokens.$color-ui-background-overlay;

   // ✅ Good - intentional variation
   background: rgba(0, 0, 0, 0.2);
   ```

### When NOT to Use Tokens

Some values are **intentionally hardcoded** and should NOT be tokenized:

1. **CSS property values**
   ```scss
   opacity: 0;      // Fully transparent
   opacity: 0.6;    // Disabled state
   opacity: 1;      // Fully opaque
   ```

2. **Context-specific overlays**
   ```scss
   // Different overlay darkness for different contexts
   .dark-overlay { background: rgba(0, 0, 0, 0.8); }
   .light-overlay { background: rgba(0, 0, 0, 0.2); }
   .hover-overlay { background: rgba(255, 255, 255, 0.1); }
   ```

3. **Component-specific magic numbers**
   ```scss
   // Specific to this component's design
   transform: translateY(-2px);
   z-index: 1000;
   ```

4. **Box shadows (temporarily)**
   ```scss
   // Token system currently outputs [object Object]
   // Use hardcoded values until build system is fixed
   box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
   ```

---

## Common Pitfalls

### 1. Using Wrong Token Type

❌ **Wrong**:
```scss
// Using spacing for font size
font-size: tokens.$spacing-4; // 16px but semantically wrong
```

✅ **Correct**:
```scss
// Using typography token
font-size: tokens.$typography-font-size-base; // 16px and semantically correct
```

### 2. Over-tokenizing

❌ **Wrong**:
```scss
// Trying to tokenize everything
z-index: tokens.$z-index-modal; // No z-index tokens exist
cursor: tokens.$cursor-pointer;  // No cursor tokens exist
```

✅ **Correct**:
```scss
// Use tokens where they exist, CSS values elsewhere
z-index: 1000;
cursor: pointer;
```

### 3. Mixing Token Systems

❌ **Wrong**:
```scss
// Mixing tokens with custom properties
padding: var(--spacing-4); // Don't use CSS custom properties
color: tokens.$color-primary; // Wrong token name
```

✅ **Correct**:
```scss
// Consistent token usage
padding: tokens.$spacing-4;
color: tokens.$color-brand-primary-500;
```

### 4. Ignoring Semantic Tokens

❌ **Wrong**:
```scss
// Using brand colors for semantic meaning
.error { color: tokens.$color-brand-primary-500; } // Primary is blue!
```

✅ **Correct**:
```scss
// Using semantic tokens
.error { color: tokens.$color-semantic-error-base; } // Correct red color
```

---

## Examples

### Complete Component Example

```scss
/**
 * Card Component Styles
 * Design tokens are automatically imported via Vite configuration
 *
 * A versatile card component with multiple variants.
 */

.card {
  // Layout
  display: flex;
  flex-direction: column;

  // Box model
  padding: tokens.$spacing-6;
  margin-bottom: tokens.$spacing-4;

  // Visual
  background-color: tokens.$color-ui-background-primary;
  border: tokens.$border-width-base solid tokens.$color-ui-border-base;
  border-radius: tokens.$border-radius-lg;

  // Animation
  transition: all tokens.$animation-duration-normal tokens.$animation-easing-ease;

  // Hover state
  &:hover {
    border-color: tokens.$color-ui-border-strong;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); // Hardcoded until shadow tokens work
  }

  // Card header
  &__header {
    padding-bottom: tokens.$spacing-4;
    margin-bottom: tokens.$spacing-4;
    border-bottom: tokens.$border-width-base solid tokens.$color-ui-border-subtle;
  }

  // Card title
  &__title {
    font-size: tokens.$typography-font-size-lg;
    font-weight: tokens.$typography-font-weight-semibold;
    color: tokens.$color-ui-text-primary;
    line-height: tokens.$typography-line-height-tight;
  }

  // Card content
  &__content {
    font-size: tokens.$typography-font-size-base;
    color: tokens.$color-ui-text-secondary;
    line-height: tokens.$typography-line-height-relaxed;
  }

  // Card footer
  &__footer {
    padding-top: tokens.$spacing-4;
    margin-top: tokens.$spacing-4;
    border-top: tokens.$border-width-base solid tokens.$color-ui-border-subtle;
  }

  // Variant: Elevated
  &--elevated {
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  }

  // Variant: Interactive
  &--interactive {
    cursor: pointer;

    &:hover {
      background-color: tokens.$color-ui-background-secondary;
      transform: translateY(-2px); // Magic number for this component
    }

    &:active {
      transform: translateY(0);
    }
  }

  // State: Disabled
  &--disabled {
    opacity: 0.6; // CSS property value
    pointer-events: none;
  }
}
```

### Responsive Design with Tokens

```scss
.responsive-grid {
  display: grid;
  gap: tokens.$spacing-4;
  padding: tokens.$spacing-4;

  // Mobile (default)
  grid-template-columns: 1fr;

  // Tablet
  @media (min-width: tokens.$breakpoint-md) {
    gap: tokens.$spacing-6;
    padding: tokens.$spacing-6;
    grid-template-columns: repeat(2, 1fr);
  }

  // Desktop
  @media (min-width: tokens.$breakpoint-lg) {
    gap: tokens.$spacing-8;
    padding: tokens.$spacing-8;
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### Form Elements

```scss
.form-group {
  margin-bottom: tokens.$spacing-6;

  &__label {
    display: block;
    margin-bottom: tokens.$spacing-2;
    font-size: tokens.$typography-font-size-sm;
    font-weight: tokens.$typography-font-weight-medium;
    color: tokens.$color-ui-text-primary;
  }

  &__input {
    width: 100%;
    padding: tokens.$spacing-2 tokens.$spacing-3;
    font-size: tokens.$typography-font-size-base;
    color: tokens.$color-ui-text-primary;
    background-color: tokens.$color-ui-background-primary;
    border: tokens.$border-width-base solid tokens.$color-ui-border-base;
    border-radius: tokens.$border-radius-base;
    transition: border-color tokens.$animation-duration-normal tokens.$animation-easing-ease;

    &:focus {
      outline: none;
      border-color: tokens.$color-ui-border-focus;
    }

    &:disabled {
      background-color: tokens.$color-ui-background-tertiary;
      color: tokens.$color-ui-text-disabled;
      opacity: 0.6;
      cursor: not-allowed;
    }

    &::placeholder {
      color: tokens.$color-ui-text-tertiary;
    }
  }

  &__hint {
    margin-top: tokens.$spacing-1-5;
    font-size: tokens.$typography-font-size-xs;
    color: tokens.$color-ui-text-tertiary;
  }

  &__error {
    margin-top: tokens.$spacing-1-5;
    font-size: tokens.$typography-font-size-xs;
    color: tokens.$color-semantic-error-base;
  }
}
```

---

## Reference

### Adding New Tokens

1. **Edit the appropriate JSON file** in `packages/tokens/src/`
2. **Follow the W3C format**:
   ```json
   {
     "category": {
       "$type": "color",
       "new-token": {
         "$value": "#hexcode",
         "$description": "Description of when to use this token"
       }
     }
   }
   ```
3. **Rebuild tokens**:
   ```bash
   cd packages/tokens
   pnpm build
   ```
4. **Use the new token**:
   ```scss
   color: tokens.$category-new-token;
   ```

### Token Naming Convention

Tokens follow a hierarchical naming pattern:

```
$[category]-[subcategory]-[variant]-[state]

Examples:
$color-ui-background-primary
$color-brand-primary-500
$typography-font-size-base
$spacing-4
$component-button-background-primary-hover
```

### Build Process

The token build process:

1. Reads JSON files from `src/`
2. Validates against W3C spec
3. Generates SCSS variables in `build/scss/_variables.scss`
4. Generates CSS custom properties in `build/css/variables.css`
5. Generates TypeScript exports in `build/ts/tokens.ts`
6. Generates JavaScript exports in `build/js/tokens.js`

### Vite Auto-Import Configuration

Tokens are automatically imported in all SCSS files via Vite configuration:

```typescript
// vite.config.ts
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use '@email-builder/tokens/build/scss/variables' as tokens;`,
      },
    },
  },
});
```

### IDE Support

For VSCode autocomplete and IntelliSense:

1. Install "SCSS IntelliSense" extension
2. Tokens will autocomplete with `tokens.$`
3. Hover over tokens to see their values

### Further Reading

- [W3C Design Tokens Specification](https://design-tokens.github.io/community-group/format/)
- [Component Development Guidelines](./CLAUDE.md#design-tokens)
- [Token Package README](./packages/tokens/README.md)
- [SCSS Best Practices](./CLAUDE.md#styling-guidelines)

---

**Questions or Issues?**

- Check existing token files in `packages/tokens/src/`
- Review this guide's examples
- Consult the [CLAUDE.md](./CLAUDE.md) development guidelines
- Open an issue if tokens are missing or incorrect
