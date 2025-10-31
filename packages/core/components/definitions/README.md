# Component Definitions

This module provides `ComponentDefinition` objects for all default components and utilities for integrating them with the `ComponentRegistry`.

## Overview

Component definitions are structured objects that describe how components should be created, validated, and managed. Each definition includes:

- **Type**: The unique component type identifier
- **Metadata**: Name, description, icon, category, and tags
- **Default Content**: Default content structure for new instances
- **Default Styles**: Default styling for new instances
- **Create Function**: Factory function to create new component instances
- **Validate Function**: Optional validation logic for the component

## Usage

### Creating a Pre-configured Registry

The easiest way to get started is to use `createDefaultRegistry()`:

```typescript
import { createDefaultRegistry } from '@email-builder/core';

// Create a registry with all default components registered
const registry = createDefaultRegistry();

// Create components
const button = registry.create('button');
const hero = registry.create('hero');

// Validate components
const validation = registry.validate(button);
console.log(validation.valid); // true

// Get all registered component types
const types = registry.getTypes();
console.log(types); // ['button', 'text', 'image', ...]
```

### Registering Components Manually

If you want more control, you can register components manually:

```typescript
import { ComponentRegistry, registerDefaultComponents } from '@email-builder/core';

// Create an empty registry
const registry = new ComponentRegistry();

// Register all default components
registerDefaultComponents(registry);

// Or register specific definitions
import { buttonDefinition, textDefinition } from '@email-builder/core';

const customRegistry = new ComponentRegistry();
customRegistry.register(buttonDefinition);
customRegistry.register(textDefinition);
```

### Getting All Component Definitions

You can also access all component definitions directly:

```typescript
import { getAllComponentDefinitions } from '@email-builder/core';

const definitions = getAllComponentDefinitions();

definitions.forEach(def => {
  console.log(`${def.metadata.name} (${def.type})`);
  console.log(`Category: ${def.metadata.category}`);
  console.log(`Tags: ${def.metadata.tags.join(', ')}`);
});
```

## Available Components

### Base Components

- **Button**: A clickable button component
- **Text**: A text content component
- **Image**: An image component
- **Separator**: A horizontal or vertical separator line
- **Spacer**: A flexible spacing component

### Email Components

- **Header**: A header component with logo and navigation
- **Footer**: A footer component with text and social links
- **Hero**: A hero section with image, heading, and CTA
- **List**: A list of items with images, titles, and descriptions
- **Call to Action**: A call-to-action section with buttons

## Component Definitions Structure

Each component definition follows this structure:

```typescript
interface ComponentDefinition {
  type: ComponentType | string;
  metadata: ComponentMetadata;
  defaultContent: Record<string, unknown>;
  defaultStyles: BaseStyles;
  create: () => BaseComponent;
  validate?: (component: BaseComponent) => ValidationResult;
  render?: (component: BaseComponent) => string;
  contentSchema?: Record<string, unknown>;
  presets?: ComponentPreset[];
}
```

## Validation

All component definitions include validation functions that check for required fields and proper structure:

```typescript
import { createDefaultRegistry, ComponentType } from '@email-builder/core';

const registry = createDefaultRegistry();

// Create a component
const button = registry.create(ComponentType.BUTTON);

// Validate it
const result = registry.validate(button);

if (!result.valid) {
  console.error('Validation errors:', result.errors);
}
```

## Extending with Custom Components

You can add your own custom component definitions to the registry:

```typescript
import { ComponentRegistry, createDefaultRegistry } from '@email-builder/core';
import type { ComponentDefinition } from '@email-builder/core';

// Start with default components
const registry = createDefaultRegistry();

// Define a custom component
const customDefinition: ComponentDefinition = {
  type: 'custom-widget',
  metadata: {
    name: 'Custom Widget',
    description: 'My custom component',
    icon: 'ri-widget',
    category: 'custom',
    tags: ['custom', 'widget'],
  },
  defaultContent: {
    text: 'Custom content',
  },
  defaultStyles: {
    backgroundColor: '#fff',
  },
  create: () => ({
    id: `custom-${Date.now()}`,
    type: 'custom-widget',
    metadata: { /* ... */ },
    content: { text: 'Custom content' },
    styles: { backgroundColor: '#fff' },
    visibility: { desktop: true, mobile: true },
    createdAt: Date.now(),
    updatedAt: Date.now(),
    version: '1.0.0',
  }),
};

// Register the custom component
registry.register(customDefinition);

// Use it
const custom = registry.create('custom-widget');
```

## API Reference

### `createDefaultRegistry()`

Creates a new `ComponentRegistry` instance with all default components registered.

**Returns**: `ComponentRegistry`

### `registerDefaultComponents(registry)`

Registers all default components in an existing registry.

**Parameters**:
- `registry`: `ComponentRegistry` - The registry to populate

**Returns**: `ComponentRegistry` - The same registry instance

### `getAllComponentDefinitions()`

Gets an array of all default component definitions.

**Returns**: `ComponentDefinition[]` - Array of all component definitions
