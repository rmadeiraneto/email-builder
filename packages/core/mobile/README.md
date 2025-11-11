# Mobile Development Mode

A comprehensive system for creating device-specific customizations in email templates with desktop-first inheritance.

## Overview

Mobile Development Mode allows users to customize how their email templates display on mobile devices with granular control over:

- **Component Styling**: Override individual style properties for mobile
- **Component Ordering**: Reorder top-level components on mobile
- **Component Visibility**: Show/hide components per device
- **Mobile-Optimized Defaults**: Auto-apply opinionated mobile transformations
- **Validation**: Real-time validation with warnings and suggestions
- **Export**: Generate HTML/CSS with media queries for email client compatibility

## Architecture

### Desktop-First Inheritance Model

Mobile customizations inherit from desktop by default:

```typescript
// Desktop styles (base)
component.styles = {
  padding: '32px',
  fontSize: '16px',
  width: '600px'
}

// Mobile overrides (only what's different)
component.mobileStyles = {
  padding: '16px',  // 50% reduction
  width: '100%'     // Full width on mobile
  // fontSize inherits from desktop (16px)
}
```

### Core Services

1. **ModeManager** - Mode switching, state management, property inheritance
2. **PropertyOverrideManager** - Set/clear/query property overrides
3. **MobileLayoutManager** - Component ordering and visibility
4. **ModeSwitcher** - UI logic for mode toggle with animations
5. **KeyboardShortcutsManager** - Keyboard shortcuts (Cmd+D, etc.)
6. **PropertyPanelIntegration** - Property panel mobile controls
7. **DiffCalculator** - Calculate differences between desktop/mobile
8. **CanvasRenderer** - Mode-aware component rendering
9. **CanvasManager** - Canvas state and transitions
10. **MobileDefaultsApplicator** - Auto-apply mobile optimizations
11. **MobileExportService** - Export HTML/CSS with media queries
12. **ValidationService** - Validate customizations with warnings
13. **PerformanceOptimizer** - Performance utilities (debounce, virtual rendering, etc.)

## Usage

### Basic Setup

```typescript
import {
  ModeManager,
  PropertyOverrideManager,
  MobileLayoutManager,
  DEFAULT_MOBILE_DEV_MODE_CONFIG
} from '@email-builder/core/mobile';

// Initialize services
const modeManager = new ModeManager({
  eventEmitter,
  config: DEFAULT_MOBILE_DEV_MODE_CONFIG,
  desktopCommandManager,
  mobileCommandManager
});

const overrideManager = new PropertyOverrideManager({
  eventEmitter,
  config: DEFAULT_MOBILE_DEV_MODE_CONFIG,
  template
});

const layoutManager = new MobileLayoutManager({
  eventEmitter,
  template
});
```

### Switching Modes

```typescript
// Switch to mobile mode
await modeManager.switchMode(DeviceMode.MOBILE, {
  selectedComponentId: 'component-123',
  scrollPosition: { x: 0, y: 0 }
});

// Check current mode
if (modeManager.isMobileMode()) {
  console.log('Currently in mobile mode');
}
```

### Setting Property Overrides

```typescript
// Set a mobile override
const result = overrideManager.setOverride(
  'component-123',
  'styles.padding',
  '16px'
);

if (result.success) {
  console.log('Override set successfully');
}

// Clear override (reset to desktop)
overrideManager.clearOverride('component-123', 'styles.padding');

// Clear all overrides for component
overrideManager.clearComponentOverrides('component-123');
```

### Component Ordering

```typescript
// Get layout items for UI
const items = layoutManager.getLayoutItems();
// Returns: [{ id, type, name, visibleOnMobile, desktopPosition, mobilePosition, ... }]

// Reorder components
layoutManager.reorderComponents(['comp-2', 'comp-1', 'comp-3']);

// Move component from index to index
layoutManager.moveComponent(0, 2);

// Reset to desktop order
layoutManager.resetToDesktopOrder();
```

### Component Visibility

```typescript
// Set visibility
layoutManager.setComponentVisibility('component-123', false);

// Toggle visibility
layoutManager.toggleComponentVisibility('component-123');

// Check visibility
const visible = modeManager.isComponentVisible(component);
```

### Mobile Defaults

```typescript
const defaultsApplicator = new MobileDefaultsApplicator({
  eventEmitter,
  overrideManager,
  modeManager,
  config,
  template
});

// Check if should prompt user
if (defaultsApplicator.shouldPrompt()) {
  defaultsApplicator.showPrompt(); // Emits event for UI
}

// Apply defaults
const result = await defaultsApplicator.applyDefaults();
console.log(`Applied defaults to ${result.componentsAffected} components`);
console.log(`Changed ${result.propertiesChanged} properties`);
```

### Validation

```typescript
const validationService = new ValidationService({
  eventEmitter,
  modeManager,
  config
});

// Validate template
const result = validationService.validate(template);

if (!result.isValid) {
  console.log(`Found ${result.totalIssues} issues:`);
  console.log(`- ${result.issuesBySeverity.critical.length} critical`);
  console.log(`- ${result.issuesBySeverity.warning.length} warnings`);
  console.log(`- ${result.issuesBySeverity.info.length} info`);
}

// Get issues for specific component
const componentIssues = validationService.getComponentIssues(
  'component-123',
  result.issues
);
```

### Export

```typescript
const exportService = new MobileExportService({
  modeManager,
  layoutManager,
  config
});

// Export with media queries (hybrid mode)
const result = exportService.exportTemplate(template, {
  mode: ExportMode.HYBRID,
  mobileBreakpoint: 768,
  inlineStyles: true,
  generateMediaQueries: true
});

console.log(result.html);  // Final HTML with inline styles + media queries
console.log(`Exported ${result.stats.componentsExported} components`);
console.log(`${result.stats.mobileOverrides} mobile overrides`);
```

## Keyboard Shortcuts

Default shortcuts (configurable):

- **Cmd+D / Ctrl+D**: Toggle device mode
- **Cmd+Shift+L**: Open layout manager (mobile only)
- **Cmd+Shift+D**: Open diff view (mobile only)
- **Cmd+Shift+R**: Reset mobile overrides (mobile only)
- **Cmd+Z**: Undo (mode-specific history)
- **Cmd+Shift+Z**: Redo (mode-specific history)

```typescript
const shortcutsManager = new KeyboardShortcutsManager({
  eventEmitter,
  getCurrentMode: () => modeManager.getCurrentMode()
});

// Enable shortcuts
shortcutsManager.enable();

// Listen for shortcut events
eventEmitter.on(KeyboardShortcutEvent.SHORTCUT_TRIGGERED, (event) => {
  console.log(`Shortcut triggered: ${event.action}`);
});
```

## Configuration

```typescript
const config: MobileDevModeConfig = {
  enabled: true,

  breakpoints: {
    mobile: 375,  // Mobile width in pixels
  },

  modeSwitcher: {
    sticky: true,
    showLabels: true,
    customLabels: {
      desktop: 'Desktop',
      mobile: 'Mobile'
    }
  },

  canvas: {
    mobileBackgroundColor: '#f5f5f5',
    mobileBorderColor: '#e0e0e0',
    transitionDuration: 300  // Animation duration in ms
  },

  mobileDefaults: {
    enabled: true,
    showPromptOnFirstSwitch: true,
    transformations: {
      paddingReduction: 0.5,        // 50% reduction
      marginReduction: 0.5,         // 50% reduction
      fontSizeReduction: 0.9,       // 10% reduction
      autoWrapHorizontalLists: true,
      stackHeadersVertically: true,
      fullWidthButtons: true,
      minTouchTargetSize: 44        // Pixels
    },
    componentSpecific: {
      'button': {
        width: '100%',
        minHeight: '44px'
      }
    }
  },

  propertyOverrides: {
    blacklist: [
      // Content properties
      'content.text',
      'content.html',
      'content.imageUrl',
      // Structure properties
      'children',
      // Technical properties
      'id',
      'type',
      'metadata'
    ],
    canvasSettingsOverridable: [
      'width',
      'maxWidth',
      'backgroundColor',
      'padding'
    ]
  },

  validation: {
    enabled: true,
    rules: [],  // Use default rules
    showInlineWarnings: true,
    showValidationPanel: false
  },

  export: {
    defaultMode: 'hybrid',
    mobileBreakpoint: 768,
    inlineStyles: true,
    generateMediaQueries: true
  },

  performance: {
    lazyLoadMobileData: true,
    preloadOnHover: true,
    virtualRendering: true,
    virtualRenderingThreshold: 50,
    debounceDelay: 16
  },

  targetMode: 'hybrid'  // 'web' | 'email' | 'hybrid'
};
```

## Email Client Compatibility

### Export Strategy

Mobile Dev Mode uses a **hybrid export strategy** for maximum compatibility:

1. **Desktop styles inline** - Works in all email clients including Outlook 2016-2021
2. **Mobile overrides in media queries** - Works in modern clients (Gmail, Apple Mail, Outlook.com)

### Client Support

| Client | Desktop Styles | Mobile Overrides | Component Order | Visibility |
|--------|---------------|------------------|-----------------|------------|
| Outlook 2016-2021 | ✅ Yes | ❌ No | ❌ No | ✅ Via inline display:none |
| Gmail | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| Apple Mail | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| Outlook.com | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| Yahoo Mail | ✅ Yes | ⚠️ Partial | ✅ Yes | ✅ Yes |
| Other modern clients | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |

**Result**: Desktop users (including Outlook 2016-2021) see the desktop design, while mobile users with modern clients get the optimized mobile experience.

## Performance Optimizations

### Debouncing

```typescript
const optimizer = new PerformanceOptimizer({ config });

// Debounce property updates
const debouncedUpdate = optimizer.debounce((componentId, property, value) => {
  overrideManager.setOverride(componentId, property, value);
}, 16);

// User drags slider rapidly
debouncedUpdate('comp-1', 'styles.padding', '8px');
debouncedUpdate('comp-1', 'styles.padding', '12px');
debouncedUpdate('comp-1', 'styles.padding', '16px');
// Only last call executes after 16ms
```

### Virtual Rendering

```typescript
const virtualHelper = optimizer.getVirtualHelper();

// Check if should use virtual rendering
if (virtualHelper.shouldUseVirtualRendering(components.length)) {
  // Get visible range
  const { start, end } = virtualHelper.getVisibleRange(
    scrollTop,
    itemHeight,
    containerHeight,
    components.length
  );

  // Only render visible components
  const visibleComponents = components.slice(start, end);
}
```

### Batch Processing

```typescript
const batchProcessor = optimizer.getBatchProcessor();

// Add multiple updates to batch
for (const component of components) {
  batchProcessor.add(() => {
    applyMobileDefault(component);
  });
}

// Processes in batches of 10, yielding to main thread
```

## Events

All services emit events for UI synchronization:

```typescript
// Mode switch events
eventEmitter.on('mobile:mode-switch-start', (event) => {
  console.log(`Switching from ${event.fromMode} to ${event.toMode}`);
});

eventEmitter.on('mobile:mode-switch-complete', (event) => {
  console.log(`Mode switch complete`);
});

// Property override events
eventEmitter.on('mobile:property-override-set', (event) => {
  console.log(`Set override: ${event.propertyPath} = ${event.value}`);
});

// Layout events
eventEmitter.on('mobile-layout:order-changed', (event) => {
  console.log(`Order changed:`, event.newOrder);
});

// Validation events
eventEmitter.on('validation:issue-found', (event) => {
  console.log(`Validation issue: ${event.issue.message}`);
});
```

## Best Practices

### 1. Always Use Mode-Aware Operations

```typescript
// ✅ Good: Check current mode
if (modeManager.isMobileMode()) {
  // Apply mobile-specific logic
}

// ❌ Bad: Assume mode
applyMobileStyles(component);
```

### 2. Preserve User Context on Mode Switch

```typescript
// ✅ Good: Pass current state
await modeManager.switchMode(DeviceMode.MOBILE, {
  selectedComponentId: currentSelection,
  scrollPosition: canvasScrollPosition
});

// ❌ Bad: Lose user context
await modeManager.switchMode(DeviceMode.MOBILE);
```

### 3. Use Separate Command History Per Mode

```typescript
// ✅ Good: Get active command manager
const commandManager = modeManager.getActiveCommandManager();
commandManager.undo();  // Undoes in current mode only

// ❌ Bad: Use global undo
globalCommandManager.undo();  // Might undo wrong mode
```

### 4. Validate Before Export

```typescript
// ✅ Good: Validate first
const validationResult = validationService.validate(template);
if (validationResult.isValid) {
  const exportResult = exportService.exportTemplate(template);
}

// ❌ Bad: Export without validation
const exportResult = exportService.exportTemplate(template);
```

### 5. Apply Mobile Defaults on First Entry

```typescript
// ✅ Good: Prompt user
eventEmitter.on('mobile:first-entry', () => {
  if (defaultsApplicator.shouldPrompt()) {
    showDefaultsPromptDialog();
  }
});

// ❌ Bad: Always apply without asking
eventEmitter.on('mobile:first-entry', () => {
  defaultsApplicator.applyDefaults();
});
```

## Type Definitions

All types are fully documented with TSDoc comments. Import from:

```typescript
import type {
  DeviceMode,
  MobileDevModeConfig,
  ComponentOrder,
  ComponentVisibility,
  ResponsiveStyles,
  ValidationRule,
  ValidationIssue,
  DiffResult,
  // ... and many more
} from '@email-builder/core/mobile';
```

## Framework Integration

Mobile Development Mode is framework-agnostic. The core package provides all business logic, while UI components are implemented per framework:

- **React**: `@email-builder/react-mobile`
- **Vue**: `@email-builder/vue-mobile`
- **Svelte**: `@email-builder/svelte-mobile`

Each framework package provides UI components that consume the core services.

## Testing

Example test setup:

```typescript
import { ModeManager, DeviceMode } from '@email-builder/core/mobile';

describe('ModeManager', () => {
  it('should switch modes', async () => {
    const modeManager = new ModeManager({ eventEmitter, config });

    expect(modeManager.getCurrentMode()).toBe(DeviceMode.DESKTOP);

    await modeManager.switchMode(DeviceMode.MOBILE);

    expect(modeManager.getCurrentMode()).toBe(DeviceMode.MOBILE);
  });
});
```

## License

MIT

## Contributing

See [CONTRIBUTING.md](../../../CONTRIBUTING.md) for details.
