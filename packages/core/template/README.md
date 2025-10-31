# Template Management System

Comprehensive template management utilities for the Email Builder core package.

## Overview

The template management system provides three major enhancement areas:

1. **Template Composition** - Fluent API and factory functions for easy template creation
2. **Template Versioning & Migration** - Semantic versioning and migration system
3. **Template Constraints & Policies** - Validation rules and policies for quality assurance

---

## 1. Template Composition

### TemplateComposer

A fluent API for building templates programmatically.

#### Basic Usage

```typescript
import { TemplateComposer } from '@email-builder/core';

const template = new TemplateComposer({
  target: 'email',
  name: 'Welcome Email',
  description: 'Welcome new users',
  author: 'Your Company',
  tags: ['welcome', 'onboarding'],
})
  .setCanvasWidth(600)
  .setBackgroundColor('#f5f5f5')
  .addComponent(headerComponent)
  .addComponent(heroComponent)
  .addComponent(footerComponent)
  .build();
```

#### Available Methods

**Canvas Settings:**
- `setCanvasWidth(width: number)` - Set canvas width
- `setCanvasMaxWidth(maxWidth: number)` - Set canvas max width
- `setBackgroundColor(color: string)` - Set background color
- `setBackgroundImage(url: string)` - Set background image
- `setCanvasBorder(border: string)` - Set canvas border

**Styling:**
- `setDefaultComponentBackground(color: string)` - Set default component background
- `setTypography(type, preset)` - Set typography presets
- `setLocale(locale: string)` - Set locale (e.g., 'en-US', 'pt-BR')

**Components:**
- `addComponent(component: BaseComponent)` - Add single component
- `addComponents(components: BaseComponent[])` - Add multiple components

**Features:**
- `enableRTL(enabled: boolean)` - Enable/disable RTL support
- `enableResponsive(enabled: boolean)` - Enable/disable responsive design
- `enableDataInjection(enabled: boolean)` - Enable/disable data injection
- `addPlaceholders(placeholders: Record<string, string>)` - Add data placeholders
- `setCustomData(key: string, value: unknown)` - Set custom metadata

### Factory Functions

Quick template creation functions.

#### createTemplate

```typescript
import { createTemplate, createButton } from '@email-builder/core';

const template = createTemplate({
  target: 'email',
  name: 'Newsletter',
  components: [
    createButton({
      content: {
        text: 'Read More',
        link: { href: 'https://example.com' }
      }
    }),
  ],
});
```

#### createEmptyEmailTemplate

```typescript
import { createEmptyEmailTemplate } from '@email-builder/core';

const template = createEmptyEmailTemplate('My Email Template');
// Creates an empty email template with standard 600px width
```

#### createEmptyWebTemplate

```typescript
import { createEmptyWebTemplate } from '@email-builder/core';

const template = createEmptyWebTemplate('My Web Page');
// Creates an empty web template with 1200px width
```

#### cloneTemplate

```typescript
import { cloneTemplate } from '@email-builder/core';

const clone = cloneTemplate(originalTemplate, 'New Template Name');
// Creates a deep copy with new ID and name
```

#### mergeTemplates

```typescript
import { mergeTemplates } from '@email-builder/core';

const merged = mergeTemplates('Combined Template', [template1, template2], {
  preferGeneralStyles: 0, // Use styles from first template
});
// Combines multiple templates into one
```

---

## 2. Template Versioning & Migration

### TemplateVersionManager

Manages semantic versioning for templates.

#### Version Comparison

```typescript
import { TemplateVersionManager } from '@email-builder/core';

// Parse version strings
const version = TemplateVersionManager.parseVersion('1.2.3');
// { major: 1, minor: 2, patch: 3 }

// Compare versions
TemplateVersionManager.compareVersions('2.0.0', '1.9.9'); // 'greater'
TemplateVersionManager.isGreaterThan('2.0.0', '1.0.0'); // true
TemplateVersionManager.areCompatible('1.5.0', '1.2.3'); // true (same major)
```

#### Version Incrementing

```typescript
// Increment versions
TemplateVersionManager.incrementMajor('1.5.8'); // '2.0.0' (breaking changes)
TemplateVersionManager.incrementMinor('1.5.8'); // '1.6.0' (new features)
TemplateVersionManager.incrementPatch('1.5.8'); // '1.5.9' (bug fixes)
```

#### Version Analysis

```typescript
// Get version difference
const diff = TemplateVersionManager.getVersionDiff('1.0.0', '2.5.3');
// { type: 'major', difference: 2 }
```

### TemplateMigrationManager

Handles template migrations between versions.

#### Registering Migrations

```typescript
import { TemplateMigrationManager, type Migration } from '@email-builder/core';

const manager = new TemplateMigrationManager();

const migration: Migration = {
  fromVersion: '1.0.0',
  toVersion: '1.1.0',
  description: 'Add responsive visibility to components',
  migrate: (template) => ({
    ...template,
    components: template.components.map((comp) => ({
      ...comp,
      visibility: comp.visibility || {
        desktop: true,
        tablet: true,
        mobile: true,
      },
    })),
  }),
};

manager.registerMigration(migration);
```

#### Migrating Templates

```typescript
// Check if migration is needed
if (needsMigration(template, '2.0.0')) {
  // Migrate template
  const migrated = manager.migrate(template, '2.0.0');
  // Migration applied, version updated
}

// Check if migration is possible
if (manager.canMigrate('1.0.0', '2.0.0')) {
  // Migration path exists
}
```

#### Version History

```typescript
import { addVersionHistory, getVersionHistory } from '@email-builder/core';

// Add version history entry
let template = addVersionHistory(template, 'Added new hero section');

// Get version history
const history = getVersionHistory(template);
// [{ version: '1.0.0', timestamp: 1234567890, description: '...' }]
```

---

## 3. Template Constraints & Policies

### TemplateConstraintsManager

Validates templates against constraints and policies.

#### Using Built-in Constraints

```typescript
import { createDefaultConstraintsManager } from '@email-builder/core';

const manager = createDefaultConstraintsManager();

// Validate against all enabled constraints
const result = manager.validateAll(template);

if (!result.valid) {
  result.violations.forEach((violation) => {
    console.error(`${violation.severity}: ${violation.message}`);
  });
}
```

#### Using Policies

```typescript
// Validate against specific policy
const result = manager.validatePolicy(template, 'email-best-practices');

if (!result.valid) {
  console.log('Template does not meet email best practices');
}
```

### Built-in Constraints

#### Performance Constraints

**maxComponentsConstraint**
- Ensures template doesn't exceed 100 components
- Severity: ERROR

**maxNestingDepthConstraint**
- Ensures components aren't nested more than 5 levels deep
- Severity: WARNING

#### Accessibility Constraints

**imageAltTextConstraint**
- Ensures all images have alt text
- Severity: WARNING

**linkTextConstraint**
- Ensures links have descriptive text (not generic "click here")
- Severity: WARNING

**colorContrastConstraint**
- Basic check for color contrast issues
- Severity: INFO

#### Email Constraints

**emailWidthConstraint**
- Ensures email templates are ≤650px wide
- Severity: ERROR

**minComponentsConstraint**
- Ensures template has at least 1 component
- Severity: WARNING

### Built-in Policies

#### emailBestPracticesPolicy
Standard constraints for email templates:
- Email width limit
- Image alt text
- Link text quality
- Maximum components

#### accessibilityPolicyA
WCAG 2.1 Level A requirements:
- Image alt text
- Link text
- Color contrast

#### performancePolicy
Performance optimization constraints:
- Maximum components
- Maximum nesting depth

#### strictPolicy
All constraints enabled for comprehensive validation

### Creating Custom Constraints

```typescript
import { TemplateConstraintsManager, ConstraintSeverity } from '@email-builder/core';

const manager = new TemplateConstraintsManager();

const customConstraint = {
  id: 'custom-rule',
  name: 'Custom Rule',
  description: 'Ensures template meets custom requirements',
  severity: ConstraintSeverity.ERROR,
  enabled: true,
  validate: (template) => {
    const violations = [];

    // Your validation logic
    if (template.components.length === 0) {
      violations.push({
        constraintId: 'custom-rule',
        severity: ConstraintSeverity.ERROR,
        message: 'Template must have components',
        suggestion: 'Add at least one component',
      });
    }

    return violations;
  },
};

manager.registerConstraint(customConstraint);
```

### Creating Custom Policies

```typescript
const customPolicy = {
  id: 'my-policy',
  name: 'My Custom Policy',
  description: 'Custom validation policy',
  constraints: [customConstraint, imageAltTextConstraint],
};

manager.registerPolicy(customPolicy);

// Use the policy
const result = manager.validatePolicy(template, 'my-policy');
```

---

## Complete Example

Here's a complete example combining all three systems:

```typescript
import {
  TemplateComposer,
  TemplateMigrationManager,
  createDefaultConstraintsManager,
  addVersionHistory,
  createButton,
  createImage,
} from '@email-builder/core';

// 1. Create a template using the composer
const template = new TemplateComposer({
  target: 'email',
  name: 'Product Launch',
  description: 'Announce new product',
  author: 'Marketing Team',
  category: 'marketing',
  tags: ['product', 'launch'],
  width: 600,
})
  .setBackgroundColor('#f5f5f5')
  .setLocale('en-US')
  .enableResponsive(true)
  .addComponents([
    createImage({
      content: {
        src: 'https://example.com/hero.jpg',
        alt: 'New Product Hero Image',
      },
    }),
    createButton({
      content: {
        text: 'Learn More About Our Product',
        link: { href: 'https://example.com/product' },
      },
    }),
  ])
  .build();

// 2. Add version history
let versionedTemplate = addVersionHistory(template, 'Initial version');

// 3. Validate with constraints
const constraintsManager = createDefaultConstraintsManager();
const validationResult = constraintsManager.validatePolicy(
  versionedTemplate,
  'email-best-practices'
);

if (!validationResult.valid) {
  console.error('Template validation failed');
  validationResult.violations.forEach((v) => {
    console.error(`- ${v.message}`);
  });
} else {
  console.log('Template validated successfully!');
}

// 4. Set up migrations for future versions
const migrationManager = new TemplateMigrationManager();
migrationManager.registerMigration({
  fromVersion: '1.0.0',
  toVersion: '1.1.0',
  description: 'Add responsive visibility',
  migrate: (t) => ({
    ...t,
    components: t.components.map((c) => ({
      ...c,
      visibility: c.visibility || {
        desktop: true,
        tablet: true,
        mobile: true,
      },
    })),
  }),
});

// Later, when loading old templates
if (needsMigration(loadedTemplate, '1.1.0')) {
  const migrated = migrationManager.migrate(loadedTemplate, '1.1.0');
  // Use migrated template
}
```

---

## API Reference

### Template Composition
- `TemplateComposer` - Main builder class
- `createTemplate()` - Quick template creation
- `createEmptyEmailTemplate()` - Empty email template
- `createEmptyWebTemplate()` - Empty web template
- `cloneTemplate()` - Clone template
- `mergeTemplates()` - Merge multiple templates

### Template Versioning
- `TemplateVersionManager` - Version management utilities
- `TemplateMigrationManager` - Migration management
- `needsMigration()` - Check if migration needed
- `getVersionHistory()` - Get version history
- `addVersionHistory()` - Add version history entry

### Template Constraints
- `TemplateConstraintsManager` - Constraint management
- `createDefaultConstraintsManager()` - Manager with built-in constraints
- Built-in constraints: `maxComponentsConstraint`, `imageAltTextConstraint`, etc.
- Built-in policies: `emailBestPracticesPolicy`, `accessibilityPolicyA`, etc.

---

## Testing

All features are fully tested with 96 passing tests:
- TemplateComposer: 30 tests
- TemplateVersioning: 42 tests
- TemplateConstraints: 24 tests

Run tests:
```bash
npm test -- TemplateComposer TemplateVersioning TemplateConstraints
```

---

## TypeScript Support

All modules are fully typed with comprehensive TypeScript definitions. Import types:

```typescript
import type {
  TemplateComposerOptions,
  Version,
  Migration,
  TemplateConstraint,
  TemplatePolicy,
  ConstraintViolation,
} from '@email-builder/core';
```
