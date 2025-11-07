# Responsive Design System

> **Status**: Foundation Complete 🎉
> **Version**: 1.0.0
> **Last Updated**: November 2025

The Email Builder includes a comprehensive responsive design system that allows templates to adapt to different screen sizes and devices. This system provides device-specific property controls, breakpoint management, and responsive preview capabilities.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Core Components](#core-components)
4. [Breakpoint System](#breakpoint-system)
5. [Responsive Properties](#responsive-properties)
6. [UI Components](#ui-components)
7. [Usage Examples](#usage-examples)
8. [API Reference](#api-reference)
9. [Best Practices](#best-practices)
10. [Migration Guide](#migration-guide)

---

## Overview

### What's Implemented (Phase 1 & 2)

✅ **Phase 1: Breakpoint System** (Complete)
- Standard breakpoint definitions (mobile, tablet, desktop)
- BreakpointManager service for device detection and media query generation
- Breakpoint configuration in Canvas Settings UI
- Template structure support for device-specific settings

✅ **Phase 2: Responsive Components** (Foundation)
- Device-specific property types (`ResponsivePropertyValue`, `ResponsiveStyles`)
- DeviceTabSelector component for switching between devices
- ResponsivePropertyEditor component for editing device-specific values
- Integration points in BaseComponent interface

### What's Planned (Phase 3 & Beyond)

🔄 **Phase 3: Preview & Export** (Planned)
- PreviewModal device simulation enhancements
- Media query generation for web export
- Email-safe responsive output
- Component testing framework

🔄 **Phase 4: Full Integration** (Planned)
- PropertyPanel device tabs integration
- Component renderer responsive support
- Complete UI/UX implementation
- Production testing

---

## Architecture

### System Design

The responsive design system follows a layered architecture:

```
┌─────────────────────────────────────────────┐
│          UI Layer (SolidJS)                  │
│  - DeviceTabSelector                        │
│  - ResponsivePropertyEditor                 │
│  - CanvasSettings                          │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│       Core Services (TypeScript)             │
│  - BreakpointManager                        │
│  - Template System                          │
│  - Component Registry                       │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│      Type System (TypeScript)                │
│  - ResponsivePropertyValue<T>               │
│  - ResponsiveStyles                         │
│  - ComponentResponsiveConfig                │
└─────────────────────────────────────────────┘
```

### Key Principles

1. **Mobile-First by Default**: Base styles represent desktop, with mobile/tablet overrides
2. **Optional Overrides**: Device-specific values are optional - inherit from desktop by default
3. **Type Safety**: Full TypeScript support with strict mode compliance
4. **Framework Agnostic**: Core logic independent of UI framework
5. **Backward Compatible**: Existing templates work without changes

---

## Core Components

### 1. BreakpointManager

The `BreakpointManager` class manages responsive breakpoints and provides utilities for:

- Device detection based on viewport width
- Media query generation
- Responsive value resolution
- Breakpoint configuration

```typescript
import { BreakpointManager, DeviceType } from '@email-builder/core';

const breakpointManager = new BreakpointManager();

// Detect device from width
const device = breakpointManager.detectDevice(768); // DeviceType.TABLET

// Generate media query
const query = breakpointManager.generateMediaQuery(
  DeviceType.MOBILE,
  BreakpointStrategy.MOBILE_FIRST
);
// "@media (min-width: 0px)"

// Resolve responsive value
const fontSize = breakpointManager.resolveValue(
  { mobile: 14, desktop: 16 },
  DeviceType.MOBILE,
  16
);
// 14
```

### 2. Type System

#### ResponsivePropertyValue<T>

Generic type for device-specific property values:

```typescript
export interface ResponsivePropertyValue<T = any> {
  mobile?: T;
  tablet?: T;
  desktop?: T;
}
```

#### ResponsiveStyles

Device-specific style overrides:

```typescript
export interface ResponsiveStyles {
  padding?: ResponsiveSpacing;
  margin?: ResponsiveSpacing;
  fontSize?: ResponsivePropertyValue<CSSValue>;
  width?: ResponsivePropertyValue<CSSValue>;
  height?: ResponsivePropertyValue<CSSValue>;
  textAlign?: ResponsivePropertyValue<'left' | 'center' | 'right' | 'justify'>;
  display?: ResponsivePropertyValue<'block' | 'inline' | 'inline-block' | 'flex' | 'grid' | 'none'>;
}
```

#### ComponentResponsiveConfig

Complete responsive configuration for a component:

```typescript
export interface ComponentResponsiveConfig {
  enabled: boolean;
  visibility: ResponsiveVisibility;
  styles: ResponsiveStyles;
}
```

---

## Breakpoint System

### Default Breakpoints

The system includes three standard breakpoints:

| Device  | Min Width | Max Width | Viewport (Preview) |
|---------|-----------|-----------|-------------------|
| Mobile  | 0px       | 767px     | 375×667           |
| Tablet  | 768px     | 1023px    | 768×1024          |
| Desktop | 1024px    | ∞         | 1200×800          |

### Custom Breakpoints

You can customize breakpoints via the `BreakpointManager`:

```typescript
import { BreakpointManager, DeviceType } from '@email-builder/core';

const breakpointManager = new BreakpointManager({
  [DeviceType.MOBILE]: {
    device: DeviceType.MOBILE,
    minWidth: 0,
    maxWidth: 639,
    label: 'Mobile',
    icon: 'ri-smartphone-line',
    viewportDimensions: { width: 375, height: 667 },
  },
  [DeviceType.TABLET]: {
    device: DeviceType.TABLET,
    minWidth: 640,
    maxWidth: 1023,
    label: 'Tablet',
    icon: 'ri-tablet-line',
    viewportDimensions: { width: 768, height: 1024 },
  },
});
```

### Canvas Settings Configuration

Users can configure breakpoints via the Canvas Settings UI:

1. Enable responsive design checkbox
2. Set mobile breakpoint (default: 767px)
3. Set tablet breakpoint (default: 1023px)
4. Set desktop breakpoint (default: 1024px)

---

## Responsive Properties

### How It Works

1. **Base Value**: Desktop/default value stored in component.styles
2. **Device Overrides**: Stored in component.responsive.styles
3. **Inheritance**: Mobile and tablet inherit from desktop if not specified
4. **Reset**: Can reset device-specific values to inherit from desktop

### Supported Properties

The following properties support device-specific values:

**Layout**:
- `padding` (top, right, bottom, left)
- `margin` (top, right, bottom, left)
- `width`
- `height`

**Typography**:
- `fontSize`
- `textAlign`

**Display**:
- `display`

### Future Properties (Planned)

- `lineHeight`
- `fontWeight`
- `letterSpacing`
- `gap` (for flex/grid layouts)
- `gridTemplateColumns`
- `flexDirection`

---

## UI Components

### DeviceTabSelector

Tab-based selector for switching between device views:

```tsx
import { DeviceTabSelector } from '@email-builder/ui-solid/responsive';
import { DeviceType } from '@email-builder/core';

<DeviceTabSelector
  activeDevice={activeDevice()}
  onDeviceChange={setActiveDevice}
  enabled={template.settings.responsive}
/>
```

**Features**:
- Three device tabs (Mobile, Tablet, Desktop)
- Visual active state
- Disabled state when responsive mode is off
- Keyboard navigation support
- Responsive icons (hide labels on mobile)

### ResponsivePropertyEditor

Wrapper for editing device-specific property values:

```tsx
import { ResponsivePropertyEditor } from '@email-builder/ui-solid/responsive';

<ResponsivePropertyEditor
  label="Font Size"
  value={component.responsive?.styles?.fontSize}
  defaultValue={{ value: 16, unit: 'px' }}
  activeDevice={activeDevice()}
  responsiveEnabled={template.settings.responsive}
  onChange={(value) => updateComponentResponsiveProperty('fontSize', value)}
  renderEditor={(currentValue, onChange) => (
    <input
      type="number"
      value={currentValue.value}
      onInput={(e) => onChange({ value: parseInt(e.target.value), unit: 'px' })}
    />
  )}
  description="Font size for this device"
/>
```

**Features**:
- Shows current value for active device
- "Reset" button to clear device override
- Override indicator when device has custom value
- Supports any value type via renderEditor prop
- Automatic inheritance from desktop value

---

## Usage Examples

### Example 1: Enable Responsive Mode

```typescript
import { Builder } from '@email-builder/core';

const builder = new Builder({
  target: 'email',
  storage: { method: 'local' },
});

await builder.initialize();

// Enable responsive mode
const template = builder.getTemplateManager().getCurrentTemplate();
template.settings.responsive = true;

// Configure breakpoints
template.settings.breakpoints = {
  mobile: 767,
  tablet: 1023,
  desktop: 1024,
};

await builder.getTemplateManager().save(template);
```

### Example 2: Set Device-Specific Padding

```typescript
import { DeviceType } from '@email-builder/core';

// Get a component
const component = template.components[0];

// Enable responsive for this component
component.responsive = {
  enabled: true,
  visibility: { mobile: true, tablet: true, desktop: true },
  styles: {
    padding: {
      top: {
        mobile: { value: 8, unit: 'px' },
        tablet: { value: 12, unit: 'px' },
        desktop: { value: 16, unit: 'px' },
      },
      right: {
        mobile: { value: 8, unit: 'px' },
        desktop: { value: 16, unit: 'px' },
      },
      bottom: {
        mobile: { value: 8, unit: 'px' },
        desktop: { value: 16, unit: 'px' },
      },
      left: {
        mobile: { value: 8, unit: 'px' },
        desktop: { value: 16, unit: 'px' },
      },
    },
  },
};
```

### Example 3: Hide Component on Mobile

```typescript
component.responsive = {
  enabled: true,
  visibility: {
    mobile: false,  // Hidden on mobile
    tablet: true,   // Visible on tablet
    desktop: true,  // Visible on desktop
  },
  styles: {},
};
```

### Example 4: Responsive Font Sizes

```typescript
component.responsive = {
  enabled: true,
  visibility: { mobile: true, tablet: true, desktop: true },
  styles: {
    fontSize: {
      mobile: { value: 14, unit: 'px' },
      tablet: { value: 16, unit: 'px' },
      desktop: { value: 18, unit: 'px' },
    },
  },
};
```

---

## API Reference

### BreakpointManager

#### Constructor

```typescript
constructor(customBreakpoints?: Partial<Record<DeviceType, BreakpointDefinition>>)
```

#### Methods

**getBreakpoint(device: DeviceType): BreakpointDefinition**

Get breakpoint definition for a specific device.

**getAllBreakpoints(): Record<DeviceType, BreakpointDefinition>**

Get all breakpoint definitions.

**updateBreakpoint(device: DeviceType, breakpoint: BreakpointDefinition): void**

Update a breakpoint definition.

**detectDevice(width: number): DeviceType**

Detect device type based on viewport width.

**generateMediaQuery(device: DeviceType, strategy: BreakpointStrategy): string**

Generate media query string for a specific device.

**resolveValue<T>(responsiveValue, device, defaultValue): T**

Resolve a responsive value for a specific device with fallback logic.

**getViewportDimensions(device: DeviceType): { width: number; height: number }**

Get viewport dimensions for a specific device (for preview).

### Helper Functions

**getDefaultResponsiveVisibility(): ResponsiveVisibility**

Returns default visibility (all devices visible).

**getDefaultResponsiveConfig(): ComponentResponsiveConfig**

Returns default responsive configuration.

**isVisibleOnDevice(visibility, device): boolean**

Check if a component is visible on a specific device.

**getResponsiveValue<T>(responsiveValue, device, defaultValue): T**

Get the responsive value for a specific device with fallback.

---

## Best Practices

### 1. Mobile-First Approach

Always design for desktop first, then add mobile/tablet overrides:

```typescript
// ✅ Good: Desktop is default, mobile overrides
component.styles.fontSize = { value: 18, unit: 'px' }; // Desktop
component.responsive.styles.fontSize = {
  mobile: { value: 14, unit: 'px' },  // Mobile override
};

// ❌ Avoid: Setting all three separately
component.responsive.styles.fontSize = {
  mobile: { value: 14, unit: 'px' },
  tablet: { value: 16, unit: 'px' },
  desktop: { value: 18, unit: 'px' },
};
```

### 2. Use Visibility Wisely

Only hide components when necessary:

```typescript
// ✅ Good: Hide decorative elements on mobile
if (component.type === 'separator') {
  component.responsive.visibility.mobile = false;
}

// ❌ Avoid: Hiding critical content
if (component.type === 'cta') {
  component.responsive.visibility.mobile = false; // Bad: Users can't see CTA!
}
```

### 3. Test on Multiple Devices

Always test responsive templates on actual devices:

- iPhone (375×667)
- iPad (768×1024)
- Desktop (1200×800)

### 4. Email Client Considerations

Not all email clients support media queries. Use email-safe responsive techniques:

- Fluid layouts (max-width: 100%)
- Table-based structures for Outlook
- Inline styles for critical CSS
- Conditional comments for MSO

### 5. Performance

Minimize the number of responsive overrides:

```typescript
// ✅ Good: Only override what's needed
component.responsive.styles.padding = {
  top: { mobile: { value: 8, unit: 'px' } }  // Only mobile top padding
};

// ❌ Avoid: Overriding everything
component.responsive.styles.padding = {
  top: { mobile: {...}, tablet: {...}, desktop: {...} },
  right: { mobile: {...}, tablet: {...}, desktop: {...} },
  // ... too many overrides
};
```

---

## Migration Guide

### For Existing Templates

Existing templates will continue to work without changes. To enable responsive features:

1. **Enable Responsive Mode**:
   ```typescript
   template.settings.responsive = true;
   ```

2. **Add Responsive Config to Components** (optional):
   ```typescript
   component.responsive = getDefaultResponsiveConfig();
   ```

3. **Set Device-Specific Values** (optional):
   ```typescript
   component.responsive.styles.fontSize = {
     mobile: { value: 14, unit: 'px' },
   };
   ```

### For New Templates

New templates should be created with responsive mode enabled by default:

```typescript
const template = await builder.getTemplateManager().create({
  name: 'My Responsive Template',
  settings: {
    target: 'hybrid',
    responsive: true,
    breakpoints: {
      mobile: 767,
      tablet: 1023,
      desktop: 1024,
    },
    canvasDimensions: {
      width: 600,
      maxWidth: 1200,
    },
    locale: 'en',
  },
  generalStyles: {},
  components: [],
});
```

---

## Roadmap

### Phase 3: Preview & Export (Next)

- [ ] Update PreviewModal with device simulation
- [ ] Add responsive preview switcher (mobile/tablet/desktop buttons)
- [ ] Generate media queries for web export
- [ ] Email-safe responsive output
- [ ] Responsive export validation

### Phase 4: Full Integration

- [ ] Complete PropertyPanel integration with device tabs
- [ ] Update all component renderers to use responsive properties
- [ ] Add responsive property controls for all supported properties
- [ ] Comprehensive testing across all components

### Future Enhancements

- [ ] Orientation support (portrait/landscape)
- [ ] Custom breakpoint management UI
- [ ] Responsive image loading (srcset)
- [ ] Responsive typography scale
- [ ] Container queries support
- [ ] Responsive spacing system
- [ ] Accessibility improvements for responsive UI

---

## Support

For questions, issues, or feature requests:

- 📖 **Documentation**: See [HEADLESS_API.md](./HEADLESS_API.md) for programmatic usage
- 🐛 **Issues**: [GitHub Issues](https://github.com/anthropics/email-builder/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/anthropics/email-builder/discussions)

---

## License

MIT License - See [LICENSE](./LICENSE) for details

---

**Status**: Foundation Complete - Phase 1 & 2 ✅
**Next**: Phase 3 - Preview & Export Integration
**Last Updated**: November 2025
