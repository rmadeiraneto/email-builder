# @email-builder/tokens

Design tokens for the email builder, following the W3C Design Token format.

## Installation

```bash
pnpm add @email-builder/tokens
```

## Usage

### TypeScript/JavaScript

```typescript
import { colors, spacing, typography } from '@email-builder/tokens';

const buttonStyles = {
  backgroundColor: colors.brand.primary[500],
  padding: `${spacing.md} ${spacing.lg}`,
  fontFamily: typography.fontFamily.sans,
};
```

### SCSS

```scss
@use '@email-builder/tokens/scss' as tokens;

.button {
  background-color: tokens.$brand-primary-500;
  padding: tokens.$spacing-md tokens.$spacing-lg;
  font-family: tokens.$font-family-sans;
}
```

### CSS

```css
@import '@email-builder/tokens/css';

.button {
  background-color: var(--color-brand-primary-500);
  padding: var(--spacing-md) var(--spacing-lg);
  font-family: var(--font-family-sans);
}
```

## Token Structure

- **colors/** - Brand, semantic, UI, and syntax colors
- **typography/** - Font families, sizes, weights, line heights
- **spacing/** - Spacing scale
- **sizing/** - Size scale
- **border/** - Border radius and width
- **shadow/** - Box shadows and elevation
- **animation/** - Duration and easing
- **breakpoints/** - Responsive breakpoints

## Building

```bash
pnpm build
```

This will generate tokens in multiple formats:
- `build/css/` - CSS custom properties
- `build/scss/` - SCSS variables
- `build/js/` - JavaScript/TypeScript modules
- `build/ts/` - TypeScript type definitions
