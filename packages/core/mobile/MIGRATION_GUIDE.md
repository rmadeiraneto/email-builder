# Migration Guide: Adding Mobile Development Mode to Existing Templates

This guide helps you migrate existing email templates to support Mobile Development Mode.

## Overview

Mobile Development Mode adds new properties to templates and components:

- **Template**: `componentOrder`, `mobileDevMode` metadata
- **Component**: `mobileStyles`, `visibility`
- **Config**: `mobileDevMode` configuration

## Migration Strategies

### Strategy 1: Automatic Migration (Recommended)

Use the provided migration utility to automatically upgrade templates:

```typescript
import { migrateTemplateToMobileDevMode } from '@email-builder/core/mobile/migration';

// Migrate template
const migratedTemplate = migrateTemplateToMobileDevMode(oldTemplate);

// Save migrated template
await saveTemplate(migratedTemplate);
```

### Strategy 2: Manual Migration

If you need more control, manually add the required properties:

```typescript
function migrateTemplate(template: LegacyTemplate): Template {
  return {
    ...template,

    // Add component order
    componentOrder: {
      desktop: template.components
        .filter(c => !c.parentId)
        .map(c => c.id),
      // Mobile order initially matches desktop
      mobile: undefined  // Will inherit from desktop
    },

    // Add mobile dev mode metadata
    mobileDevMode: {
      defaultsApplied: false,
      hasEnteredMobileMode: false,
      overrides: []
    },

    // Components are already in template.components
    components: template.components.map(migrateComponent)
  };
}

function migrateComponent(component: LegacyComponent): Component {
  return {
    ...component,

    // Mobile styles initially empty (inherits from desktop)
    mobileStyles: undefined,

    // Visibility defaults to true on all devices
    visibility: {
      desktop: true,
      mobile: true  // Or undefined to inherit from desktop
    }
  };
}
```

## Migration Utility

Create a migration utility file:

```typescript
/**
 * migration.ts
 */

import type { Template, BaseComponent } from '../types';
import type { ComponentOrder, ComponentVisibility } from './mobile.types';

export interface MigrationOptions {
  /**
   * Preserve existing responsive config
   * If true, converts old responsive system to new mobile dev mode
   */
  preserveResponsiveConfig?: boolean;

  /**
   * Auto-detect component order from DOM order
   */
  autoDetectOrder?: boolean;

  /**
   * Initialize with mobile defaults
   */
  applyMobileDefaults?: boolean;
}

export function migrateTemplateToMobileDevMode(
  template: any,
  options: MigrationOptions = {}
): Template {
  const {
    preserveResponsiveConfig = true,
    autoDetectOrder = true,
    applyMobileDefaults = false
  } = options;

  // Get top-level components
  const topLevelComponents = template.components.filter((c: any) => !c.parentId);

  // Create desktop order
  const desktopOrder = autoDetectOrder
    ? topLevelComponents.map((c: any) => c.id)
    : template.componentOrder?.desktop || topLevelComponents.map((c: any) => c.id);

  // Migrate components
  const migratedComponents = template.components.map((component: any) =>
    migrateComponent(component, { preserveResponsiveConfig })
  );

  return {
    ...template,

    componentOrder: {
      desktop: desktopOrder,
      mobile: undefined  // Initially inherits from desktop
    },

    mobileDevMode: {
      defaultsApplied: applyMobileDefaults,
      defaultsAppliedAt: applyMobileDefaults ? Date.now() : undefined,
      hasEnteredMobileMode: false,
      overrides: []
    },

    components: migratedComponents
  };
}

export function migrateComponent(
  component: any,
  options: { preserveResponsiveConfig?: boolean } = {}
): BaseComponent {
  const { preserveResponsiveConfig = true } = options;

  // Convert old responsive config to new mobile styles
  let mobileStyles: any = undefined;

  if (preserveResponsiveConfig && component.responsive?.mobile) {
    mobileStyles = convertResponsiveToMobileStyles(component.responsive.mobile);
  }

  return {
    ...component,

    mobileStyles,

    visibility: {
      desktop: true,
      mobile: component.responsive?.mobile?.visible ?? true
    },

    // Keep old responsive config for backward compatibility
    // Can be removed after full migration
    responsive: preserveResponsiveConfig ? component.responsive : undefined
  };
}

function convertResponsiveToMobileStyles(responsiveConfig: any): any {
  // Convert old responsive format to new mobile styles
  const mobileStyles: any = {};

  if (responsiveConfig.styles) {
    Object.assign(mobileStyles, responsiveConfig.styles);
  }

  // Handle special responsive properties
  if (responsiveConfig.width) {
    mobileStyles.width = responsiveConfig.width;
  }

  if (responsiveConfig.padding) {
    mobileStyles.padding = responsiveConfig.padding;
  }

  return Object.keys(mobileStyles).length > 0 ? mobileStyles : undefined;
}
```

## Backward Compatibility

### Supporting Both Systems

During transition, support both old and new systems:

```typescript
function getComponentStyles(component: BaseComponent, mode: DeviceMode): Styles {
  // New system (Mobile Dev Mode)
  if (mode === DeviceMode.MOBILE && component.mobileStyles) {
    return { ...component.styles, ...component.mobileStyles };
  }

  // Old system (fallback for legacy templates)
  if (mode === DeviceMode.MOBILE && component.responsive?.mobile?.styles) {
    return { ...component.styles, ...component.responsive.mobile.styles };
  }

  // Default: desktop styles
  return component.styles;
}
```

### Feature Detection

Detect if template supports Mobile Dev Mode:

```typescript
export function supportsModileDevMode(template: any): boolean {
  return (
    template.mobileDevMode !== undefined &&
    template.componentOrder !== undefined
  );
}

export function getMigrationStatus(template: any): 'migrated' | 'partial' | 'not-migrated' {
  if (!template.mobileDevMode) {
    return 'not-migrated';
  }

  const componentsWithMobileStyles = template.components.filter(
    (c: any) => c.mobileStyles !== undefined
  ).length;

  if (componentsWithMobileStyles === 0) {
    return 'partial';
  }

  return 'migrated';
}
```

## Migration Checklist

Use this checklist when migrating templates:

- [ ] Add `template.componentOrder` with desktop order
- [ ] Add `template.mobileDevMode` metadata
- [ ] Add `component.mobileStyles` (can be undefined initially)
- [ ] Add `component.visibility` (can be undefined to inherit)
- [ ] Convert old `responsive` config to new format (if applicable)
- [ ] Update builder config to include `mobileDevMode` config
- [ ] Test mode switching works correctly
- [ ] Test property overrides work correctly
- [ ] Test component ordering works correctly
- [ ] Test export includes media queries
- [ ] Test validation runs without errors
- [ ] Update UI to show mobile controls
- [ ] Update documentation for users

## Database Schema Changes

If storing templates in a database, update schema:

```sql
-- Add mobile dev mode columns
ALTER TABLE templates
  ADD COLUMN component_order_desktop TEXT[],
  ADD COLUMN component_order_mobile TEXT[],
  ADD COLUMN mobile_defaults_applied BOOLEAN DEFAULT FALSE,
  ADD COLUMN mobile_defaults_applied_at TIMESTAMP,
  ADD COLUMN has_entered_mobile_mode BOOLEAN DEFAULT FALSE;

-- Add component mobile columns
ALTER TABLE components
  ADD COLUMN mobile_styles JSONB,
  ADD COLUMN visibility_desktop BOOLEAN DEFAULT TRUE,
  ADD COLUMN visibility_mobile BOOLEAN;

-- Create index for mobile queries
CREATE INDEX idx_components_mobile_styles ON components
  USING GIN (mobile_styles);
```

## Bulk Migration Script

For migrating many templates:

```typescript
async function bulkMigrateTemplates(templateIds: string[]) {
  const results = {
    success: 0,
    failed: 0,
    errors: [] as Array<{ templateId: string; error: string }>
  };

  for (const templateId of templateIds) {
    try {
      // Load template
      const template = await loadTemplate(templateId);

      // Check if already migrated
      if (supportsModileDevMode(template)) {
        console.log(`Template ${templateId} already migrated, skipping`);
        continue;
      }

      // Migrate
      const migrated = migrateTemplateToMobileDevMode(template);

      // Validate migration
      const valid = validateMigratedTemplate(migrated);

      if (!valid) {
        throw new Error('Migration validation failed');
      }

      // Save
      await saveTemplate(migrated);

      results.success++;
      console.log(`✓ Migrated template ${templateId}`);
    } catch (error) {
      results.failed++;
      results.errors.push({
        templateId,
        error: error.message
      });
      console.error(`✗ Failed to migrate template ${templateId}:`, error);
    }
  }

  return results;
}

function validateMigratedTemplate(template: Template): boolean {
  // Check required properties exist
  if (!template.componentOrder) return false;
  if (!template.mobileDevMode) return false;

  // Check component order includes all top-level components
  const topLevelIds = template.components
    .filter(c => !c.parentId)
    .map(c => c.id);

  const orderIds = template.componentOrder.desktop;

  if (orderIds.length !== topLevelIds.length) return false;
  if (!topLevelIds.every(id => orderIds.includes(id))) return false;

  return true;
}
```

## Rollback Strategy

If you need to rollback:

```typescript
function rollbackMigration(template: Template): LegacyTemplate {
  return {
    ...template,
    // Remove mobile dev mode properties
    componentOrder: undefined,
    mobileDevMode: undefined,

    // Clean components
    components: template.components.map(component => ({
      ...component,
      mobileStyles: undefined,
      visibility: undefined
    }))
  };
}
```

## Testing Migrated Templates

Test suite for validating migrations:

```typescript
describe('Template Migration', () => {
  it('should migrate template successfully', () => {
    const legacy = createLegacyTemplate();
    const migrated = migrateTemplateToMobileDevMode(legacy);

    expect(migrated.componentOrder).toBeDefined();
    expect(migrated.mobileDevMode).toBeDefined();
    expect(migrated.components[0].visibility).toBeDefined();
  });

  it('should preserve all components', () => {
    const legacy = createLegacyTemplate();
    const migrated = migrateTemplateToMobileDevMode(legacy);

    expect(migrated.components.length).toBe(legacy.components.length);
  });

  it('should create valid component order', () => {
    const legacy = createLegacyTemplate();
    const migrated = migrateTemplateToMobileDevMode(legacy);

    const topLevelIds = migrated.components
      .filter(c => !c.parentId)
      .map(c => c.id);

    expect(migrated.componentOrder.desktop.length).toBe(topLevelIds.length);
  });
});
```

## Common Issues

### Issue: Component Order Mismatch

**Problem**: Component order doesn't match visual order

**Solution**: Manually specify order during migration:

```typescript
const migrated = migrateTemplateToMobileDevMode(template, {
  autoDetectOrder: false
});

// Set custom order
migrated.componentOrder.desktop = ['header', 'content', 'footer'];
```

### Issue: Missing Mobile Styles

**Problem**: Old responsive config not converted

**Solution**: Manually convert responsive config:

```typescript
const migratedWithStyles = {
  ...migrated,
  components: migrated.components.map(c => ({
    ...c,
    mobileStyles: convertOldResponsiveConfig(c.responsive)
  }))
};
```

### Issue: Performance with Large Templates

**Problem**: Migration takes too long

**Solution**: Use batch processing:

```typescript
async function batchMigrate(templateIds: string[], batchSize = 10) {
  for (let i = 0; i < templateIds.length; i += batchSize) {
    const batch = templateIds.slice(i, i + batchSize);
    await Promise.all(batch.map(migrateTemplate));
    await delay(100); // Rate limiting
  }
}
```

## Support

For migration assistance:
- Check [README.md](./README.md) for API documentation
- Review [examples](./examples/) for integration patterns
- Open an issue for migration-specific problems

## Version Compatibility

- **v1.x templates**: Full backward compatibility, no migration needed
- **v2.x templates**: Automatic migration on first load
- **v3.x templates**: Native Mobile Dev Mode support
