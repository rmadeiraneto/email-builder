# Email Builder Customization System

A comprehensive, multi-layered customization system that enables users to create highly customized email templates with ease.

## 🎨 Overview

The Customization System provides five powerful layers of customization:

1. **Theme Engine** - Global design tokens (colors, typography, spacing)
2. **Component Variants** - Multiple style variations for each component
3. **Style Recipes** - Composable, reusable style combinations
4. **Customization Profiles** - Complete design configurations that can be saved and shared
5. **Template Blueprints** - Pre-built, customizable layout structures

## 🚀 Quick Start

```typescript
import { CustomizationManager } from '@email-builder/core';

// Initialize with default themes, variants, and recipes
const customization = new CustomizationManager({
  loadDefaults: true,
});

// Apply customization to a button
const buttonStyles = customization.applyCustomization({
  themeId: 'modern',
  variantIds: ['button-primary', 'button-lg'],
  recipeIds: ['shadow-md', 'rounded'],
});
```

## 📚 Table of Contents

- [Theme Engine](#theme-engine)
- [Component Variants](#component-variants)
- [Style Recipes](#style-recipes)
- [Customization Profiles](#customization-profiles)
- [Template Blueprints](#template-blueprints)
- [API Reference](#api-reference)
- [Examples](#examples)

---

## 🎨 Theme Engine

The Theme Engine provides a comprehensive design token system for consistent styling across your email templates.

### Features

- **Color Palettes**: Primary, secondary, accent, neutral, and semantic colors with 10-shade scales
- **Typography System**: Font families, sizes, weights, line heights, and letter spacing
- **Spacing Scale**: Harmonious spacing values (0-64)
- **Border Radius**: Consistent corner radius values
- **Shadow Scale**: Box shadow definitions for elevation
- **Theme Tokens**: Programmatic access to theme values

### Available Themes

- **Modern** - Clean, contemporary design with bold colors
- **Minimal** - Minimalist design with subtle colors and ample whitespace
- **Bold** - Eye-catching design with vibrant colors and strong typography
- **Elegant** - Sophisticated design with refined colors and classic typography

### Usage

```typescript
// Get all themes
const themes = customization.themes.getAll();

// Set active theme
customization.themes.setCurrentTheme('modern');

// Create a custom theme
const myTheme = customization.themes.create({
  name: 'My Brand Theme',
  category: 'business',
});

// Update theme colors
customization.themes.update(myTheme.id, {
  colors: {
    primary: {
      500: '#ff6b6b',
      // ... other shades
    },
  },
});

// Use theme tokens
const tokens = customization.themes.createTokenResolver('modern');
const primaryColor = tokens.color('primary.500');
const spacing = tokens.spacing(4);
```

### Theme Structure

```typescript
interface Theme {
  id: string;
  name: string;
  colors: ColorPalette;
  typography: TypographyConfig;
  spacing: SpacingScale;
  radius: RadiusScale;
  shadows: ShadowScale;
}
```

---

## 🎭 Component Variants

Component Variants provide pre-defined style variations for components, organized by category.

### Variant Categories

- **Style**: Visual style (primary, secondary, outline, ghost)
- **Size**: Size variations (small, medium, large)
- **Intent**: Semantic intent (success, warning, danger, info)
- **Layout**: Layout variations (horizontal, vertical)
- **Theme**: Theme-specific variants

### Available Variants

#### Button Variants
- **Style**: Primary, Secondary, Outline, Ghost, Gradient
- **Size**: Small, Medium, Large
- **Intent**: Success, Warning, Danger

#### Text Variants
- Heading 1-3
- Body, Body Large
- Caption, Label

#### Image Variants
- Default, Rounded, Circle, Bordered

#### Container Variants
- Default, Card, Panel, Highlight

### Usage

```typescript
// Get variants for a component type
const buttonVariants = customization.variants.getByComponentType('BUTTON');

// Apply a single variant
const styles = customization.variants.applyVariants(['button-primary']);

// Combine multiple variants
const largePrimaryButton = customization.variants.applyVariants([
  'button-primary',
  'button-lg',
]);

// Create a custom variant
const customVariant = customization.variants.create({
  name: 'Neon Button',
  category: 'style',
  componentType: 'BUTTON',
  styles: {
    backgroundColor: '#00ff00',
    customStyles: {
      boxShadow: '0 0 20px #00ff00',
    },
  },
});
```

---

## 🧩 Style Recipes

Style Recipes are composable, reusable style combinations that can be mixed and matched.

### Recipe Categories

- **Surface**: Card, Panel, Well, Elevated
- **Spacing**: Compact, Comfortable, Spacious
- **Decorative**: Rounded, Bordered, Outlined, Shadows
- **Interactive**: Clickable, Hoverable
- **Layout**: Centered, Stack
- **Color**: Primary, Secondary, Muted, Subtle

### Usage

```typescript
// Get all recipes
const recipes = customization.recipes.getAll();

// Apply a single recipe
const cardStyles = customization.recipes.apply('card');

// Compose multiple recipes
const fancyCard = customization.recipes.applyMultiple([
  'card',
  'shadow-lg',
  'rounded',
  'spacious',
]);

// Create a custom recipe
const customRecipe = customization.recipes.create({
  name: 'Featured Section',
  category: 'surface',
  styles: {
    backgroundColor: '#fffbeb',
    border: {
      width: { value: 2, unit: 'px' },
      style: 'dashed',
      color: '#fbbf24',
    },
  },
});

// Recipe with inheritance
const extendedRecipe = customization.recipes.create({
  name: 'Super Card',
  category: 'surface',
  extends: 'card', // Inherits from card recipe
  styles: {
    // Additional styles
  },
});
```

### Fluent Style Builder

```typescript
const buttonStyles = customization
  .styleBuilder()
  .withRecipe('clickable')
  .withVariant('button-primary')
  .withVariant('button-lg')
  .withOverrides({
    customStyles: {
      textTransform: 'uppercase',
    },
  })
  .build();
```

---

## 📦 Customization Profiles

Customization Profiles are complete design configurations that can be saved, shared, and applied.

### Features

- Save entire customization state (theme + variants + recipes + presets)
- Export/import profiles as JSON
- Apply profiles to quickly switch designs
- Share profiles across projects
- Version control for profiles

### Usage

```typescript
// Create a profile
const profile = customization.profiles.create({
  name: 'E-commerce Pro',
  description: 'Professional e-commerce email templates',
  category: 'ecommerce',
  theme: customization.themes.get('modern')!,
  variants: customization.variants.getAll(),
  recipes: customization.recipes.getAll(),
});

// Export profile
const json = customization.profiles.exportToJSON(profile.id);

// Import profile
const imported = customization.profiles.importFromJSON(json);

// Apply profile
customization.profiles.setCurrent(profile.id);
customization.applyProfile(profile.id);

// Capture current state as profile
const currentProfile = customization.captureCurrentState(
  'My Campaign',
  'Current customization snapshot'
);
```

---

## 📐 Template Blueprints

Template Blueprints are pre-built layout structures with customizable slots.

### Blueprint Categories

- **Welcome**: Welcome emails, onboarding
- **Promotional**: Sales, product launches
- **Transactional**: Order confirmations, receipts
- **Newsletter**: Regular newsletters, digests
- **Event**: Invitations, webinars
- **E-commerce**: Abandoned cart, recommendations

### Blueprint Structure

```typescript
interface TemplateBlueprint {
  id: string;
  name: string;
  category: BlueprintCategory;
  structure: BlueprintSection[];
  slots: BlueprintSlot[];
  defaults: BlueprintDefaults;
}
```

### Usage

```typescript
// Register a blueprint
customization.blueprints.register(welcomeBlueprint);

// Get blueprints by category
const welcomeBlueprints = customization.blueprints.getByCategory('welcome');

// Instantiate a template from blueprint
const result = customization.blueprints.instantiate({
  blueprintId: 'welcome-simple',
  name: 'My Welcome Email',
  slotContent: {
    logo: {
      componentType: 'IMAGE',
      content: { url: 'logo.png', alt: 'Logo' },
    },
    headline: {
      componentType: 'TEXT',
      content: { text: 'Welcome!' },
    },
  },
});

if (result.success) {
  const template = result.template;
  // Use the template
}
```

---

## 🔧 API Reference

### CustomizationManager

Central hub for all customization functionality.

```typescript
class CustomizationManager {
  // Sub-managers
  themes: ThemeManager;
  variants: VariantManager;
  recipes: RecipeManager;
  profiles: CustomizationProfileManager;
  blueprints: BlueprintManager;

  // Unified API
  applyCustomization(options): BaseStyles;
  styleBuilder(): StyleBuilder;
  captureCurrentState(name, description): CustomizationProfile;
  applyProfile(profileId): void;

  // Search & Discovery
  searchAll(query): SearchResults;
  getRecommendations(componentType): Recommendations;

  // Import/Export
  exportAll(): string;
  importAll(json): void;

  // Statistics
  getStats(): Stats;
}
```

### ThemeManager

```typescript
class ThemeManager {
  register(theme): void;
  get(themeId): Theme | undefined;
  getAll(): Theme[];
  setCurrentTheme(themeId): void;
  getCurrent(): Theme | null;
  update(themeId, updates): Theme;
  delete(themeId): void;
  create(options): Theme;
  duplicate(themeId, newName): Theme;
  createTokenResolver(themeId): ThemeTokens;
  export(themeId): string;
  import(json): Theme;
}
```

### VariantManager

```typescript
class VariantManager {
  register(variant): void;
  get(variantId): ComponentVariant | undefined;
  getAll(): ComponentVariant[];
  getByComponentType(componentType): ComponentVariant[];
  getByCategory(category): ComponentVariant[];
  update(variantId, updates): ComponentVariant;
  delete(variantId): void;
  create(options): ComponentVariant;
  applyVariants(variantIds): BaseStyles;
  createCollection(componentType, variants): VariantCollection;
}
```

### RecipeManager

```typescript
class RecipeManager {
  register(recipe): void;
  get(recipeId): StyleRecipe | undefined;
  getAll(): StyleRecipe[];
  getByCategory(category): StyleRecipe[];
  update(recipeId, updates): StyleRecipe;
  delete(recipeId): void;
  create(options): StyleRecipe;
  apply(recipeId, variant?): BaseStyles;
  applyMultiple(recipeIds): BaseStyles;
  search(query): StyleRecipe[];
}
```

---

## 💡 Examples

### Example 1: Create a Marketing Email Button

```typescript
const ctaButton = customization.applyCustomization({
  themeId: 'bold',
  variantIds: ['button-primary', 'button-lg'],
  recipeIds: ['shadow-lg', 'rounded-full'],
  overrides: {
    customStyles: {
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
    },
  },
});
```

### Example 2: Create a Card with Custom Styling

```typescript
const productCard = customization
  .styleBuilder()
  .withRecipe('card')
  .withRecipe('spacious')
  .withRecipe('shadow-md')
  .withOverrides({
    backgroundColor: '#f0f9ff',
    border: {
      color: '#3b82f6',
    },
  })
  .build();
```

### Example 3: Theme-Based Component

```typescript
customization.themes.setCurrentTheme('elegant');

const themedButton = customization.applyCustomization({
  themeId: 'elegant',
  variantIds: ['button-primary'],
});
```

### Example 4: Create and Share a Profile

```typescript
// Create profile
const profile = customization.captureCurrentState(
  'Holiday Campaign 2024',
  'Festive email template design'
);

// Export
const json = customization.profiles.exportToJSON(profile.id);

// Share with team (save to file, database, etc.)
localStorage.setItem('holiday-profile', json);

// Import on another machine
const imported = customization.profiles.importFromJSON(json);
customization.applyProfile(imported.id);
```

---

## 🎯 Best Practices

### 1. Start with Themes

Always set a base theme before applying other customizations:

```typescript
customization.themes.setCurrentTheme('modern');
```

### 2. Layer Your Customizations

Apply customizations in order of specificity:
1. Recipes (foundational)
2. Variants (component-specific)
3. Overrides (final touches)

### 3. Use the Style Builder

For complex styles, use the fluent style builder:

```typescript
const styles = customization
  .styleBuilder()
  .withRecipe('card')
  .withVariant('button-primary')
  .withOverrides({ /* custom */ })
  .build();
```

### 4. Save Profiles

Save your customization state as profiles for reuse:

```typescript
const profile = customization.captureCurrentState('My Design');
```

### 5. Leverage Blueprints

Use blueprints for common email layouts:

```typescript
const template = customization.blueprints.instantiate({
  blueprintId: 'welcome-simple',
  // ...
});
```

---

## 🔄 Migration Guide

If you're upgrading from the old preset system:

### Before (Old System)

```typescript
// Old way
const preset = componentRegistry.getPreset('BUTTON', 'primary');
componentRegistry.applyPreset(component.id, preset.id);
```

### After (New System)

```typescript
// New way - more powerful!
const styles = customization.applyCustomization({
  themeId: 'modern',
  variantIds: ['button-primary'],
  recipeIds: ['shadow-md'],
});
```

---

## 📦 Package Structure

```
packages/core/
├── types/
│   ├── theme.types.ts
│   ├── variant.types.ts
│   ├── recipe.types.ts
│   ├── customization-profile.types.ts
│   └── blueprint.types.ts
├── theme/
│   ├── ThemeManager.ts
│   └── default-themes.ts
├── variant/
│   ├── VariantManager.ts
│   └── default-variants.ts
├── recipe/
│   ├── RecipeManager.ts
│   └── default-recipes.ts
├── customization/
│   ├── CustomizationManager.ts
│   └── CustomizationProfileManager.ts
├── blueprint/
│   └── BlueprintManager.ts
└── examples/
    └── customization-system-examples.ts
```

---

## 🤝 Contributing

To add new themes, variants, or recipes:

1. Create your customization using the managers
2. Test thoroughly with different components
3. Export to JSON
4. Add to the appropriate default collection

---

## 📄 License

Same as the main email-builder project.

---

## 🚀 Future Enhancements

- [ ] Visual theme editor UI
- [ ] AI-powered style suggestions
- [ ] Theme marketplace
- [ ] Real-time collaboration on profiles
- [ ] A/B testing for customizations
- [ ] Accessibility-focused themes
- [ ] Dark mode support
- [ ] Animation/transition system

---

## 📞 Support

For questions or issues with the customization system:
- Check the examples in `/packages/core/examples/customization-system-examples.ts`
- Review this documentation
- Open an issue on GitHub

---

**Happy Customizing! 🎨**
