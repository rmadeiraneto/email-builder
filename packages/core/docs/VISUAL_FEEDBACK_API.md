# Visual Feedback System - API Documentation

The Visual Feedback System provides Figma-style visual overlays and animations when users edit component properties, creating an intuitive connection between property controls and their effects on the canvas.

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Architecture](#architecture)
4. [API Reference](#api-reference)
5. [Configuration](#configuration)
6. [Event Handling](#event-handling)
7. [Custom Mappings](#custom-mappings)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

---

## Overview

### Key Features

- ✅ **Figma-Style Overlays**: Measurement lines, region highlights, and visual indicators
- ✅ **Smooth Animations**: Property changes animate using Web Animations API
- ✅ **Accessibility**: Respects `prefers-reduced-motion` setting
- ✅ **Performance**: Optimized overlay management and animation queueing
- ✅ **Flexible Configuration**: Customize colors, durations, easing, and more
- ✅ **Type-Safe**: Full TypeScript support with comprehensive types

### System Components

1. **VisualFeedbackManager** - Main orchestrator
2. **PropertyMappingRegistry** - Maps properties to visual feedback
3. **AnimationController** - Manages property change animations
4. **OverlayManager** - Handles overlay lifecycle and positioning

---

## Quick Start

### Basic Setup

```typescript
import { createVisualFeedbackManager } from '@email-builder/core';

// Get canvas element
const canvasElement = document.getElementById('email-canvas');

// Create manager with default config
const visualFeedback = createVisualFeedbackManager(canvasElement);

// Handle property hover
visualFeedback.handlePropertyHover({
  propertyPath: 'styles.padding',
  componentId: 'button-1',
  mapping: paddingMapping,
  mode: 'hover',
  currentValue: '16px',
});

// Handle property change (triggers animation)
visualFeedback.handlePropertyChange({
  componentId: 'button-1',
  propertyPath: 'styles.padding',
  oldValue: '16px',
  newValue: '24px',
  propertyType: 'spacing',
});

// Cleanup
visualFeedback.destroy();
```

### With Custom Configuration

```typescript
import {
  createVisualFeedbackManager,
  DEFAULT_VISUAL_FEEDBACK_CONFIG,
} from '@email-builder/core';

const customConfig = {
  ...DEFAULT_VISUAL_FEEDBACK_CONFIG,
  animations: {
    ...DEFAULT_VISUAL_FEEDBACK_CONFIG.animations,
    durations: {
      ...DEFAULT_VISUAL_FEEDBACK_CONFIG.animations.durations,
      spacing: 200, // Custom duration for spacing properties
    },
  },
  highlights: {
    ...DEFAULT_VISUAL_FEEDBACK_CONFIG.highlights,
    color: '#00FF00', // Custom highlight color
  },
};

const manager = createVisualFeedbackManager(canvasElement, customConfig);
```

---

## Architecture

### Component Hierarchy

```
VisualFeedbackManager (Orchestrator)
├── PropertyMappingRegistry (Mappings)
├── AnimationController (Animations)
│   ├── Web Animations API Integration
│   └── Performance Monitoring
└── OverlayManager (Overlays)
    ├── MeasurementOverlay (UI Component)
    ├── RegionHighlight (UI Component)
    ├── PropertyIndicator (UI Component)
    └── OffScreenIndicator (UI Component)
```

### Data Flow

```
User Action (hover/edit property)
        ↓
PropertyPanel emits event
        ↓
BuilderContext receives event
        ↓
VisualFeedbackManager handles event
        ↓
╔═══════════════╦════════════════════╗
║ Hover Events  ║  Change Events     ║
║       ↓       ║        ↓           ║
║ OverlayManager║ AnimationController║
╚═══════════════╩════════════════════╝
        ↓                 ↓
   Show Visual       Animate Change
    Feedback         on Canvas
```

---

## API Reference

### VisualFeedbackManager

#### Constructor

```typescript
new VisualFeedbackManager(options: VisualFeedbackManagerConfig)
```

**Parameters:**
- `options.config` - Complete visual feedback configuration
- `options.canvasElement` - HTMLElement for the canvas

**Example:**
```typescript
const manager = new VisualFeedbackManager({
  config: DEFAULT_VISUAL_FEEDBACK_CONFIG,
  canvasElement: document.getElementById('canvas'),
});
```

#### Methods

##### `handlePropertyHover(event: PropertyHoverEvent): void`

Handles property hover/unhover events to show/hide visual overlays.

**Parameters:**
```typescript
{
  propertyPath: string;        // e.g., 'styles.padding'
  componentId?: string;        // Component ID or undefined for general styles
  mapping: PropertyVisualMapping;  // Property-to-visual mapping
  mode: 'hover' | 'active' | 'off';  // Interaction mode
  currentValue?: any;          // Current property value
}
```

**Example:**
```typescript
// Show overlay on hover
manager.handlePropertyHover({
  propertyPath: 'styles.padding',
  componentId: 'button-1',
  mapping: registry.getMapping('button', 'styles.padding'),
  mode: 'hover',
  currentValue: '16px',
});

// Hide overlay on unhover
manager.handlePropertyHover({
  propertyPath: 'styles.padding',
  componentId: 'button-1',
  mapping: {} as any, // Not needed for 'off' mode
  mode: 'off',
  currentValue: undefined,
});
```

##### `handlePropertyEdit(event: PropertyEditEvent): void`

Handles property edit start/end events.

**Parameters:**
```typescript
{
  propertyPath: string;
  componentId?: string;
  oldValue: any;  // undefined = edit starting, otherwise edit ending
  newValue: any;
  mapping: PropertyVisualMapping;
}
```

**Example:**
```typescript
// Edit started
manager.handlePropertyEdit({
  propertyPath: 'styles.padding',
  componentId: 'button-1',
  oldValue: undefined,  // Indicates edit starting
  newValue: '24px',
  mapping: paddingMapping,
});

// Edit ended
manager.handlePropertyEdit({
  propertyPath: 'styles.padding',
  componentId: 'button-1',
  oldValue: '24px',  // Non-undefined indicates edit ending
  newValue: undefined,
  mapping: paddingMapping,
});
```

##### `handlePropertyChange(event: PropertyChangeEvent): void`

Handles property value changes to trigger animations.

**Parameters:**
```typescript
{
  componentId: string;
  propertyPath: string;
  oldValue: any;
  newValue: any;
  propertyType: PropertyType;  // 'spacing' | 'size' | 'color' | 'border' | etc.
}
```

**Example:**
```typescript
manager.handlePropertyChange({
  componentId: 'button-1',
  propertyPath: 'styles.padding',
  oldValue: '16px',
  newValue: '24px',
  propertyType: 'spacing',
});
```

##### `setEnabled(enabled: boolean): void`

Enables or disables the entire visual feedback system.

**Example:**
```typescript
manager.setEnabled(false);  // Disable
manager.setEnabled(true);   // Enable
```

##### `isEnabled(): boolean`

Returns whether the system is currently enabled.

**Example:**
```typescript
if (manager.isEnabled()) {
  // System is active
}
```

##### `updateConfig(newConfig: Partial<VisualFeedbackConfig>): void`

Updates the configuration dynamically.

**Example:**
```typescript
manager.updateConfig({
  animations: {
    ...manager.getConfig().animations,
    enabled: false,  // Disable animations only
  },
});
```

##### `getConfig(): VisualFeedbackConfig`

Returns the current configuration.

**Example:**
```typescript
const config = manager.getConfig();
console.log('Animation duration:', config.animations.durations.spacing);
```

##### `getPerformanceStats(): PerformanceStats`

Returns performance statistics.

**Example:**
```typescript
const stats = manager.getPerformanceStats();
console.log('Active overlays:', stats.activeOverlays);
console.log('Active animations:', stats.activeAnimations);
```

##### `clearAllOverlays(): void`

Clears all active overlays immediately.

**Example:**
```typescript
manager.clearAllOverlays();
```

##### `destroy(): void`

Cleans up and destroys the manager. Call this when unmounting.

**Example:**
```typescript
useEffect(() => {
  const manager = createVisualFeedbackManager(canvasElement);
  
  return () => {
    manager.destroy();  // Cleanup
  };
}, [canvasElement]);
```

---

## Configuration

### VisualFeedbackConfig

Complete configuration object structure:

```typescript
interface VisualFeedbackConfig {
  /** Global enable/disable */
  enabled: boolean;

  /** Animation configuration */
  animations: AnimationConfig;

  /** Highlight overlay configuration */
  highlights: HighlightConfig;

  /** Property indicator configuration */
  propertyIndicators: PropertyIndicatorConfig;

  /** Respect browser's prefers-reduced-motion setting */
  respectReducedMotion: boolean;

  /** Performance configuration */
  performance: PerformanceConfig;
}
```

### AnimationConfig

```typescript
interface AnimationConfig {
  enabled: boolean;

  /** Animation durations in milliseconds */
  durations: {
    spacing: number;      // Default: 150ms
    color: number;        // Default: 200ms
    layout: number;       // Default: 180ms
    typography: number;   // Default: 150ms
    border: number;       // Default: 180ms
    effect: number;       // Default: 200ms
    default: number;      // Default: 200ms
  };

  /** Easing functions */
  easing: {
    spacing: string;      // Default: 'ease-out'
    color: string;        // Default: 'ease-in-out'
    layout: string;       // Default: 'ease-out'
    typography: string;   // Default: 'ease-out'
    border: string;       // Default: 'ease-out'
    effect: string;       // Default: 'ease-in-out'
    default: string;      // Default: 'ease-out'
  };
}
```

### HighlightConfig

```typescript
interface HighlightConfig {
  enabled: boolean;
  color: string;        // Highlight color (default: '#FF0000')
  opacity: number;      // Opacity 0-1 (default: 0.8)
  showValues: boolean;  // Show pixel values on measurements (default: true)
}
```

### PerformanceConfig

```typescript
interface PerformanceConfig {
  debounceDelay: number;              // Debounce rapid changes (default: 16ms)
  maxSimultaneousAnimations: number;  // Max concurrent animations (default: 10)
  enableMonitoring: boolean;          // Enable performance monitoring (default: true)
}
```

### Default Configuration

```typescript
import { DEFAULT_VISUAL_FEEDBACK_CONFIG } from '@email-builder/core';

// Use as-is or customize
const config = {
  ...DEFAULT_VISUAL_FEEDBACK_CONFIG,
  animations: {
    ...DEFAULT_VISUAL_FEEDBACK_CONFIG.animations,
    durations: {
      ...DEFAULT_VISUAL_FEEDBACK_CONFIG.animations.durations,
      spacing: 300,  // Slower spacing animations
    },
  },
};
```

---

## Event Handling

### Integration with PropertyPanel

```typescript
// In your PropertyPanel or BuilderContext
import { VisualFeedbackManager } from '@email-builder/core';

const [visualFeedback, setVisualFeedback] = useState<VisualFeedbackManager | null>(null);

// Initialize on mount
useEffect(() => {
  const canvas = document.getElementById('canvas');
  if (canvas) {
    const manager = createVisualFeedbackManager(canvas);
    setVisualFeedback(manager);
    
    return () => manager.destroy();
  }
}, []);

// Property hover handler
const handlePropertyHover = (propertyPath: string, value: any) => {
  if (!visualFeedback) return;
  
  const mapping = registry.getMapping(componentType, propertyPath);
  if (!mapping) return;
  
  visualFeedback.handlePropertyHover({
    propertyPath,
    componentId: selectedComponentId,
    mapping,
    mode: 'hover',
    currentValue: value,
  });
};

// Property unhover handler
const handlePropertyUnhover = (propertyPath: string) => {
  if (!visualFeedback) return;
  
  visualFeedback.handlePropertyHover({
    propertyPath,
    componentId: undefined,
    mapping: {} as any,
    mode: 'off',
    currentValue: undefined,
  });
};

// Property change handler
const handlePropertyChange = (propertyPath: string, oldValue: any, newValue: any) => {
  if (!visualFeedback) return;
  
  visualFeedback.handlePropertyChange({
    componentId: selectedComponentId,
    propertyPath,
    oldValue,
    newValue,
    propertyType: determinePropertyType(propertyPath),
  });
};
```

---

## Custom Mappings

### PropertyMappingRegistry

Get the singleton registry:

```typescript
import { getPropertyMappingRegistry } from '@email-builder/core';

const registry = getPropertyMappingRegistry();
```

### Register Custom Mapping

```typescript
registry.registerMapping({
  propertyPath: 'styles.customProperty',
  componentType: 'myComponent',
  visualTarget: {
    type: 'spacing',  // or 'size', 'color', 'border', etc.
    region: 'padding',  // optional
    measurementType: 'both',  // optional
  },
  description: 'Custom property mapping',
});
```

### Get Mapping

```typescript
const mapping = registry.getMapping('button', 'styles.padding');
if (mapping) {
  // Use mapping
}
```

### Property Types

Available property types for mappings:

- `spacing` - padding, margin, gap
- `size` - width, height, max-width, max-height
- `color` - color, background-color, border-color
- `border` - border-width, border-radius, border-style
- `typography` - font-size, line-height, letter-spacing
- `effect` - opacity, box-shadow, text-shadow
- `position` - top, left, right, bottom
- `layout` - display, flex, grid properties
- `content` - text, alt text, URLs
- `structural` - component type, layout type
- `default` - fallback for unknown types

---

## Best Practices

### 1. Cleanup Resources

Always destroy the manager when unmounting:

```typescript
useEffect(() => {
  const manager = createVisualFeedbackManager(canvas);
  
  return () => {
    manager.destroy();  // Essential for cleanup
  };
}, [canvas]);
```

### 2. Check Enabled State

Check if the system is enabled before handling events:

```typescript
if (!manager.isEnabled()) return;
```

### 3. Handle Missing Elements Gracefully

The system handles missing elements internally, but you should still validate:

```typescript
if (!canvasElement) {
  console.warn('Canvas element not found');
  return;
}
```

### 4. Performance Optimization

For rapid property changes, the system includes built-in debouncing. No additional throttling needed.

### 5. Accessibility

Always respect user preferences:

```typescript
const config = {
  ...DEFAULT_VISUAL_FEEDBACK_CONFIG,
  respectReducedMotion: true,  // Respect prefers-reduced-motion
};
```

### 6. Error Handling

Wrap event handlers in try-catch if needed:

```typescript
try {
  manager.handlePropertyHover(event);
} catch (error) {
  console.error('Visual feedback error:', error);
}
```

---

## Troubleshooting

### Overlays Not Showing

**Possible causes:**
1. System is disabled: `manager.isEnabled()` returns `false`
2. Highlights disabled: `config.highlights.enabled` is `false`
3. Component element not found: Check `data-component-id` attribute
4. Invalid mapping: Verify mapping exists in registry

**Solution:**
```typescript
// Enable system
manager.setEnabled(true);

// Check config
const config = manager.getConfig();
console.log('Highlights enabled:', config.highlights.enabled);

// Verify element
const element = document.querySelector(`[data-component-id="${id}"]`);
console.log('Element found:', !!element);

// Check mapping
const mapping = registry.getMapping(type, propertyPath);
console.log('Mapping found:', !!mapping);
```

### Animations Not Working

**Possible causes:**
1. Animations disabled in config
2. `prefers-reduced-motion` is active
3. Element not found on canvas
4. Web Animations API not supported

**Solution:**
```typescript
// Check animation config
const config = manager.getConfig();
console.log('Animations enabled:', config.animations.enabled);

// Check reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
console.log('Reduced motion:', prefersReducedMotion);

// Check browser support
console.log('Animate supported:', 'animate' in HTMLElement.prototype);
```

### Performance Issues

**Symptoms:**
- Slow overlay updates
- Janky animations
- High CPU usage

**Solutions:**
1. Reduce max simultaneous animations:
```typescript
manager.updateConfig({
  performance: {
    ...config.performance,
    maxSimultaneousAnimations: 5,
  },
});
```

2. Increase debounce delay:
```typescript
manager.updateConfig({
  performance: {
    ...config.performance,
    debounceDelay: 50,  // Higher delay = better performance
  },
});
```

3. Check performance stats:
```typescript
const stats = manager.getPerformanceStats();
if (stats.activeOverlays > 10) {
  console.warn('Too many overlays active');
}
```

### Memory Leaks

**Symptoms:**
- Increasing memory usage over time
- Browser slowdown

**Solution:**
Always call `destroy()` when component unmounts:

```typescript
useEffect(() => {
  const manager = createVisualFeedbackManager(canvas);
  
  return () => {
    manager.destroy();  // CRITICAL!
  };
}, []);
```

---

## Examples

### Complete React Integration

```typescript
import { useEffect, useState } from 'react';
import {
  createVisualFeedbackManager,
  getPropertyMappingRegistry,
  type VisualFeedbackManager,
  type PropertyType,
} from '@email-builder/core';

function EmailBuilder() {
  const [manager, setManager] = useState<VisualFeedbackManager | null>(null);
  const registry = getPropertyMappingRegistry();

  // Initialize
  useEffect(() => {
    const canvas = document.getElementById('canvas');
    if (canvas) {
      const vfManager = createVisualFeedbackManager(canvas);
      setManager(vfManager);
      
      return () => vfManager.destroy();
    }
  }, []);

  // Property hover
  const handlePropertyHover = (path: string, value: any) => {
    if (!manager) return;
    
    const mapping = registry.getMapping('button', path);
    if (!mapping) return;
    
    manager.handlePropertyHover({
      propertyPath: path,
      componentId: 'button-1',
      mapping,
      mode: 'hover',
      currentValue: value,
    });
  };

  // Property change
  const handlePropertyChange = (path: string, oldVal: any, newVal: any) => {
    if (!manager) return;
    
    manager.handlePropertyChange({
      componentId: 'button-1',
      propertyPath: path,
      oldValue: oldVal,
      newValue: newVal,
      propertyType: getPropertyType(path),
    });
  };

  return (
    <div>
      <PropertyPanel
        onPropertyHover={handlePropertyHover}
        onPropertyChange={handlePropertyChange}
      />
      <Canvas id="canvas" />
    </div>
  );
}

function getPropertyType(path: string): PropertyType {
  if (path.includes('padding') || path.includes('margin')) return 'spacing';
  if (path.includes('width') || path.includes('height')) return 'size';
  if (path.includes('color')) return 'color';
  return 'default';
}
```

### Complete SolidJS Integration

```typescript
import { createSignal, createEffect, onCleanup } from 'solid-js';
import { createVisualFeedbackManager } from '@email-builder/core';

function EmailBuilder() {
  const [manager, setManager] = createSignal(null);

  createEffect(() => {
    const canvas = document.getElementById('canvas');
    if (canvas) {
      const vfManager = createVisualFeedbackManager(canvas);
      setManager(vfManager);
      
      onCleanup(() => vfManager.destroy());
    }
  });

  const handleHover = (path, value) => {
    const m = manager();
    if (!m) return;
    
    // Handle hover event
    m.handlePropertyHover({
      propertyPath: path,
      componentId: 'button-1',
      mapping: getMapping(path),
      mode: 'hover',
      currentValue: value,
    });
  };

  return (
    <div>
      <PropertyPanel onHover={handleHover} />
      <Canvas id="canvas" />
    </div>
  );
}
```

---

## Additional Resources

- [Visual Feedback User Guide](./VISUAL_FEEDBACK_GUIDE.md)
- [Property Mapping Registry Documentation](./PROPERTY_MAPPING_REGISTRY.md)
- [Animation Controller Documentation](./ANIMATION_CONTROLLER.md)
- [Overlay Manager Documentation](./OVERLAY_MANAGER.md)
- [GitHub Repository](https://github.com/rmadeiraneto/email-builder)
- [Report Issues](https://github.com/rmadeiraneto/email-builder/issues)

---

**Last Updated:** November 2025  
**Version:** 1.0.0  
**Status:** Production Ready ✅
