# Visual Property Feedback System

> **Status**: 🟢 MEDIUM PRIORITY - UX enhancement
> **Reference**: REQUIREMENTS.md Section 16
> **Estimated Time**: 24-32 hours
> **Progress**: 0% Complete

## Overview

Transform property editing from abstract form fields to visual, interactive feedback directly on the canvas. When users hover over or edit properties in the PropertyPanel, they see immediate visual indicators on the canvas showing what that property controls—dramatically improving discoverability and understanding.

**Inspiration**: Figma, Webflow, Framer design tools

---

## Core Concept

### The Problem
Users editing properties in a PropertyPanel often don't know what effect each property will have until they change it. Properties like "padding," "margin," "border-radius" are abstract concepts that require mental translation.

### The Solution
Show visual feedback on the canvas as users interact with properties:
- **Hover State**: Hovering over "padding" property highlights the padding area in green
- **Active Editing**: Changing padding value shows measurement lines with exact pixel values
- **Animations**: Smooth transitions as property values change
- **Non-Visual Properties**: Special indicators for properties that don't have visual representations (e.g., "alt text" shows tooltip on image)

---

## User Experience Flow

### Example 1: Editing Button Padding

1. User hovers over "Padding" label in PropertyPanel
   - Button on canvas: Green semi-transparent overlay appears over padding area
   - Measurement lines appear showing padding dimensions (e.g., "16px" on each side)

2. User clicks into padding input field (focused)
   - Overlay becomes more opaque
   - Measurement lines stay visible
   - Other UI fades slightly to focus attention

3. User changes padding from 16px to 24px
   - Padding area smoothly animates to new size
   - Measurement labels update in real-time
   - Button size changes with smooth animation

4. User moves to next property (blur)
   - Overlay fades out
   - Measurement lines fade out
   - Normal UI returns

### Example 2: Editing Border Radius

1. User hovers over "Border Radius" in PropertyPanel
   - Corner radius highlights appear (small circles at corners)
   - Radius value appears near each corner (e.g., "8px")

2. User adjusts radius with slider (0px → 20px)
   - Corners smoothly animate from square to rounded
   - Radius indicators update in real-time
   - Preview matches final result exactly

### Example 3: Editing Image Alt Text (Non-Visual)

1. User hovers over "Alt Text" field
   - Small info icon appears over image on canvas
   - Tooltip bubble shows current alt text value
   - Visual indicator that this property is for accessibility

---

## Implementation Phases

## Phase 1: Core Infrastructure (4-5 hours)

### 1.1 Type Definitions & Configuration
**Time**: 1 hour

**Files to Create**:
- `packages/core/visual-feedback/visual-feedback.types.ts`

**Type Definitions**:
```typescript
interface VisualFeedbackConfig {
  enabled: boolean;
  animationDuration: number; // ms
  animationEasing: string; // CSS easing function
  overlayColors: {
    padding: string;
    margin: string;
    border: string;
    content: string;
  };
  respectReducedMotion: boolean;
}

interface PropertyVisualMapping {
  propertyPath: string; // e.g., "padding", "border.width"
  visualizationType: 'overlay' | 'measurement' | 'highlight' | 'indicator';
  overlayConfig?: OverlayConfig;
  measurementConfig?: MeasurementConfig;
}

interface OverlayConfig {
  color: string;
  opacity: number;
  blendMode: string;
  region: 'padding' | 'margin' | 'border' | 'content' | 'custom';
}

interface MeasurementConfig {
  showDimensions: boolean;
  showLabels: boolean;
  lineColor: string;
  labelBackgroundColor: string;
  labelTextColor: string;
}
```

---

### 1.2 Property Mapping System
**Time**: 1.5 hours

**Files to Create**:
- `packages/core/visual-feedback/PropertyMappingRegistry.ts`

**Default Mappings**:
```typescript
const DEFAULT_PROPERTY_MAPPINGS: PropertyVisualMapping[] = [
  // Spacing Properties
  {
    propertyPath: 'padding',
    visualizationType: 'overlay',
    overlayConfig: {
      color: '#10b981', // green
      opacity: 0.2,
      region: 'padding'
    }
  },
  {
    propertyPath: 'margin',
    visualizationType: 'overlay',
    overlayConfig: {
      color: '#f59e0b', // orange
      opacity: 0.2,
      region: 'margin'
    }
  },

  // Border Properties
  {
    propertyPath: 'border',
    visualizationType: 'highlight',
    overlayConfig: {
      color: '#3b82f6', // blue
      opacity: 0.6,
      region: 'border'
    }
  },

  // Dimension Properties
  {
    propertyPath: 'width',
    visualizationType: 'measurement',
    measurementConfig: {
      showDimensions: true,
      showLabels: true,
      lineColor: '#8b5cf6', // purple
      labelBackgroundColor: '#8b5cf6',
      labelTextColor: '#ffffff'
    }
  },

  // ... more mappings for all properties
];
```

**Registry API**:
```typescript
class PropertyMappingRegistry {
  registerMapping(componentType: string, mapping: PropertyVisualMapping): void;
  getMapping(componentType: string, propertyPath: string): PropertyVisualMapping | null;
  getMappingsForComponent(componentType: string): PropertyVisualMapping[];
  overrideMapping(componentType: string, propertyPath: string, mapping: PropertyVisualMapping): void;
}
```

---

### 1.3 Animation Controller
**Time**: 1.5-2 hours

**Files to Create**:
- `packages/core/visual-feedback/AnimationController.ts`

**Responsibilities**:
- Manage Web Animations API
- Queue animations (prevent conflicts)
- Handle interruptions (smooth transitions to new target)
- Respect `prefers-reduced-motion`
- Apply easing curves

**API**:
```typescript
class AnimationController {
  animate(element: HTMLElement, keyframes: Keyframe[], options: KeyframeAnimationOptions): Animation;
  interrupt(element: HTMLElement, newAnimation: Animation): void;
  cancelAll(element: HTMLElement): void;
  respectsReducedMotion(): boolean;
}
```

**Example Usage**:
```typescript
// Animate padding change
const animation = animationController.animate(
  buttonElement,
  [
    { padding: '16px' },
    { padding: '24px' }
  ],
  {
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }
);
```

---

## Phase 2: Overlay System (5-6 hours)

### 2.1 Overlay Manager Service
**Time**: 2-3 hours

**Files to Create**:
- `packages/core/visual-feedback/OverlayManager.ts`

**Responsibilities**:
- Create, update, destroy overlay elements
- Calculate positions based on canvas element bounds
- Manage z-index and layering
- Handle viewport clipping (overlays outside viewport)
- Coordinate multiple overlays (don't overlap)

**API**:
```typescript
class OverlayManager {
  createOverlay(targetElement: HTMLElement, config: OverlayConfig): OverlayInstance;
  updateOverlay(overlayId: string, config: Partial<OverlayConfig>): void;
  destroyOverlay(overlayId: string): void;
  destroyAll(): void;

  // Position calculation
  calculatePosition(targetElement: HTMLElement): BoundingBox;
  isInViewport(position: BoundingBox): boolean;
}

interface OverlayInstance {
  id: string;
  element: HTMLElement;
  config: OverlayConfig;
  targetElement: HTMLElement;
  destroy(): void;
  update(config: Partial<OverlayConfig>): void;
}
```

**Implementation Notes**:
- Overlays are absolutely positioned divs
- Use `getBoundingClientRect()` for positioning
- Update positions on scroll/resize
- Use `pointer-events: none` to avoid interfering with canvas interactions

---

### 2.2 Measurement Line Renderer
**Time**: 2 hours

**Files to Create**:
- `packages/ui-solid/src/visual-feedback/MeasurementOverlay.tsx`

**Component**:
```tsx
interface MeasurementOverlayProps {
  targetElement: HTMLElement;
  dimension: 'width' | 'height' | 'padding' | 'margin';
  value: number; // pixels
  unit: string; // 'px', 'rem', etc.
  color: string;
  position: 'top' | 'right' | 'bottom' | 'left' | 'center';
}

const MeasurementOverlay: Component<MeasurementOverlayProps> = (props) => {
  // SVG-based measurement lines (Figma-style)
  return (
    <svg class={styles.measurementOverlay}>
      <line x1={...} y1={...} x2={...} y2={...} stroke={props.color} />
      <line x1={...} y1={...} x2={...} y2={...} stroke={props.color} /> {/* bracket caps */}
      <text x={...} y={...}>{props.value}{props.unit}</text>
    </svg>
  );
};
```

**Visual Design**:
- Line with bracket caps on each end (├─────┤)
- Label in center with background pill
- Intelligent positioning (avoid overlaps)
- Responsive to zoom level

---

### 2.3 Region Highlight Renderer
**Time**: 1 hour

**Files to Create**:
- `packages/ui-solid/src/visual-feedback/RegionHighlight.tsx`

**Component**:
```tsx
interface RegionHighlightProps {
  targetElement: HTMLElement;
  region: 'padding' | 'margin' | 'border' | 'content';
  color: string;
  opacity: number;
}

const RegionHighlight: Component<RegionHighlightProps> = (props) => {
  // Semi-transparent div overlay
  return (
    <div
      class={styles.regionHighlight}
      style={{
        background: props.color,
        opacity: props.opacity,
        position: 'absolute',
        top: ...,
        left: ...,
        width: ...,
        height: ...
      }}
    />
  );
};
```

**Visual Design**:
- Semi-transparent colored overlay
- Animated fade in/out
- Respects border-radius of target element

---

## Phase 3: Property Control Integration (3-4 hours)

### 3.1 PropertyPanel Event Emission
**Time**: 1.5 hours

**Files to Modify**:
- `packages/ui-solid/src/property-panel/PropertyPanel.tsx`

**Implementation**:
Add hover and focus event handlers to all property inputs:

```tsx
// For each property input
<InputNumber
  label="Padding"
  value={props.component.padding}
  onChange={handlePaddingChange}
  onFocus={() => emitPropertyEditStart('padding')}
  onBlur={() => emitPropertyEditEnd('padding')}
  onMouseEnter={() => emitPropertyHover('padding')}
  onMouseLeave={() => emitPropertyHoverEnd('padding')}
/>
```

**Events to Emit**:
- `property:hover:start` - User hovers over property label/input
- `property:hover:end` - User stops hovering
- `property:edit:start` - User focuses input (starts editing)
- `property:edit:end` - User blurs input (stops editing)
- `property:change` - User changes value (real-time)

**Event Payload**:
```typescript
interface PropertyEventPayload {
  componentId: string;
  propertyPath: string;
  propertyType: string; // 'padding', 'border', etc.
  currentValue: any;
  newValue?: any; // for change events
}
```

---

### 3.2 Event Bus Integration
**Time**: 1 hour

**Files to Modify**:
- `packages/core/events/EventBus.ts` (if not exists, create)

**Implementation**:
```typescript
// Wire PropertyPanel events to OverlayManager
eventBus.on('property:hover:start', (payload: PropertyEventPayload) => {
  const mapping = propertyMappingRegistry.getMapping(
    payload.componentType,
    payload.propertyPath
  );

  if (mapping) {
    visualFeedbackService.showFeedback(payload.componentId, mapping);
  }
});

eventBus.on('property:hover:end', (payload: PropertyEventPayload) => {
  visualFeedbackService.hideFeedback(payload.componentId);
});

eventBus.on('property:edit:start', (payload: PropertyEventPayload) => {
  visualFeedbackService.enterEditMode(payload.componentId, payload.propertyPath);
});

eventBus.on('property:change', (payload: PropertyEventPayload) => {
  visualFeedbackService.updateFeedback(
    payload.componentId,
    payload.propertyPath,
    payload.newValue
  );
});
```

---

### 3.3 Canvas Component Coordination
**Time**: 1.5 hours

**Files to Modify**:
- `packages/ui-solid/src/canvas/TemplateCanvas.tsx`

**Implementation**:
```tsx
const TemplateCanvas: Component = () => {
  // Subscribe to visual feedback events
  const [activeOverlays, setActiveOverlays] = createSignal<OverlayInstance[]>([]);

  onMount(() => {
    visualFeedbackService.on('overlay:created', (overlay) => {
      setActiveOverlays([...activeOverlays(), overlay]);
    });

    visualFeedbackService.on('overlay:destroyed', (overlayId) => {
      setActiveOverlays(activeOverlays().filter(o => o.id !== overlayId));
    });
  });

  return (
    <div class={styles.canvas}>
      {/* Rendered components */}
      <For each={props.components}>
        {(component) => <ComponentRenderer component={component} />}
      </For>

      {/* Visual feedback overlays */}
      <For each={activeOverlays()}>
        {(overlay) => <OverlayRenderer overlay={overlay} />}
      </For>
    </div>
  );
};
```

---

## Phase 4: Advanced Features (4-6 hours)

### 4.1 Property Change Animations
**Time**: 2-3 hours

**Description**: Smooth animations when property values change.

**Examples**:
- Padding increases: Component smoothly expands
- Color changes: Fade from old color to new color
- Border-radius changes: Corners smoothly round
- Font-size changes: Text smoothly scales

**Implementation**:
- Use Web Animations API for performance
- Keyframe generation based on property type
- Easing curves for natural motion
- Interruption handling (user changes mind mid-animation)

---

### 4.2 Non-Visual Property Indicators
**Time**: 1-2 hours

**Description**: Visual cues for properties that don't have direct visual representations.

**Examples**:
- Alt Text (image): Shows tooltip with alt text on hover
- Link URL: Shows small link icon + tooltip with URL
- ARIA labels: Shows accessibility icon
- SEO metadata: Shows info icon with metadata preview

**Implementation**:
- Icon indicators positioned on component
- Tooltip popover on hover
- Color-coded by category (accessibility=green, SEO=blue, etc.)

---

### 4.3 Multi-Property Coordination
**Time**: 1-2 hours

**Description**: Coordinate feedback when multiple properties are related.

**Examples**:
- Editing padding while margin is also set: Show both overlays simultaneously
- Editing border width and color: Update border preview in real-time
- Editing width and height together: Show both dimension lines

**Implementation**:
- Overlay stacking with proper z-index
- Color differentiation (padding=green, margin=orange)
- Smart positioning (avoid label overlaps)

---

### 4.4 Keyboard Shortcuts
**Time**: 1 hour

**Description**: Quick toggle for visual feedback mode.

**Shortcuts**:
- `V` key: Toggle visual feedback on/off
- `Shift + V`: Enter "measurement mode" (show all dimensions)
- `ESC`: Exit visual feedback mode

**Implementation**:
- Global keyboard event listener
- State management for feedback mode
- Visual indicator when mode is active

---

## Visual Feedback Mapping Reference

### Spacing Properties
| Property | Visualization | Color | Notes |
|----------|--------------|-------|-------|
| `padding` | Overlay | Green (#10b981) | Inner spacing |
| `margin` | Overlay | Orange (#f59e0b) | Outer spacing |
| `gap` | Measurement lines | Purple (#8b5cf6) | Flex/grid gap |

### Border Properties
| Property | Visualization | Color | Notes |
|----------|--------------|-------|-------|
| `border.width` | Highlight + measurement | Blue (#3b82f6) | Border thickness |
| `border.color` | Highlight | Border color | Shows border edge |
| `border.radius` | Corner indicators | Blue (#3b82f6) | Corner circles with values |

### Dimension Properties
| Property | Visualization | Color | Notes |
|----------|--------------|-------|-------|
| `width` | Measurement lines (horizontal) | Purple (#8b5cf6) | Left-right lines |
| `height` | Measurement lines (vertical) | Purple (#8b5cf6) | Top-bottom lines |
| `maxWidth` | Measurement lines (dashed) | Purple (#8b5cf6) | Max constraint indicator |

### Color Properties
| Property | Visualization | Color | Notes |
|----------|--------------|-------|-------|
| `backgroundColor` | Full overlay | Property color | Semi-transparent |
| `textColor` | Text highlight | Property color | Highlight text content |
| `borderColor` | Border highlight | Property color | Highlight border edge |

### Typography Properties
| Property | Visualization | Color | Notes |
|----------|--------------|-------|-------|
| `fontSize` | Text highlight + label | Teal (#14b8a6) | Shows size in px/rem |
| `lineHeight` | Line indicators | Teal (#14b8a6) | Shows line spacing |
| `letterSpacing` | Character gap indicators | Teal (#14b8a6) | Shows spacing between letters |

### Non-Visual Properties
| Property | Visualization | Indicator | Notes |
|----------|--------------|-----------|-------|
| `alt` | Info icon + tooltip | Blue info icon | Accessibility |
| `link` | Link icon + tooltip | Blue link icon | Shows URL |
| `ariaLabel` | Accessibility icon | Green a11y icon | WCAG compliance |

---

## Testing Strategy

### Visual Testing
- [ ] Screenshot tests for each property type
- [ ] Animation smoothness tests
- [ ] Overlay positioning accuracy tests
- [ ] Multi-overlay coordination tests

### Performance Testing
- [ ] Measure overlay render time (target: <16ms)
- [ ] Test with 10+ simultaneous overlays
- [ ] Test on low-end devices
- [ ] Memory leak detection (create/destroy cycles)

### Accessibility Testing
- [ ] Screen reader announcement for visual feedback
- [ ] Keyboard navigation support
- [ ] High contrast mode compatibility
- [ ] Reduced motion respect

### Browser Compatibility
- [ ] Chrome/Edge (primary)
- [ ] Firefox
- [ ] Safari
- [ ] Test with different zoom levels (50% - 200%)

---

## Success Criteria

- [ ] Hovering over any property shows visual feedback on canvas
- [ ] Editing properties shows real-time visual updates
- [ ] Animations are smooth (60fps)
- [ ] Overlays position correctly even when canvas is scrolled/zoomed
- [ ] Respects `prefers-reduced-motion` setting
- [ ] No performance degradation (< 100ms from hover to overlay visible)
- [ ] Users report improved understanding of property effects
- [ ] Reduction in "undo" operations (users make correct changes first try)

---

## Dependencies

- ✅ PropertyPanel implementation (complete)
- ✅ TemplateCanvas implementation (complete)
- ✅ Component rendering system (complete)
- ❌ Event bus system (needs creation or enhancement)
- ❌ Web Animations API integration
- ❌ SVG rendering utilities

---

## Notes

- **Inspired by Figma**: Figma's property feedback is the gold standard
- **Performance Critical**: Overlays must render at 60fps for smooth UX
- **Progressive Enhancement**: Start with simple overlays, add advanced features later
- **User Toggle**: Allow users to disable visual feedback if preferred
- **Mobile Considerations**: Visual feedback may need different approach on touch devices
- **Canvas Transform**: Must account for canvas zoom/pan when positioning overlays

---

_Last Updated: November 17, 2025_
