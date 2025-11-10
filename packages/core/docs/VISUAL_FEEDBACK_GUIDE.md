# Visual Feedback System - User Guide

A comprehensive guide to understanding and using the visual feedback features in the Email Builder.

## What is Visual Feedback?

The Visual Feedback System creates an intuitive, Figma-like experience when you edit email component properties. As you hover over or edit property controls (like padding, color, or font size), you see visual indicators directly on the canvas showing exactly what will change.

## Key Features

### 🎯 **Instant Visual Connection**
See exactly which parts of your email will be affected by each property change.

### 📏 **Measurement Overlays**
Hover over spacing or size properties to see Figma-style measurement lines with pixel values.

### 🎨 **Color-Coded Highlights**
Different property types show different colored highlights:
- **Padding** - Green semi-transparent overlay
- **Margin** - Orange semi-transparent overlay
- **Border** - Purple outline
- **Content Area** - Light blue highlight

### ✨ **Smooth Animations**
Watch properties animate smoothly as you change values, making it easy to see the before and after.

### ♿ **Accessible**
Automatically respects your browser's motion sensitivity settings (`prefers-reduced-motion`).

---

## How to Use

### Basic Property Editing

1. **Select a Component**
   - Click on any component in the canvas to select it
   - The Property Panel on the right will show all editable properties

2. **Hover Over Properties**
   - Move your mouse over any property control (input, slider, color picker)
   - Watch the canvas highlight the affected area
   - For spacing/size properties, see measurement lines with pixel values

3. **Edit Properties**
   - Click into any property to start editing
   - The highlight changes from hover state to active edit state
   - Type a new value or use the controls
   - Press Enter or click outside to apply

4. **Watch the Animation**
   - When you change a value, watch it smoothly animate on the canvas
   - This helps you see the transition and judge the final result

### Visual Feedback Types

#### Measurement Lines (Spacing & Size)

When you hover over these properties, you'll see Figma-style measurement lines:

- **Padding Properties** (`padding`, `padding-top`, `padding-right`, etc.)
  - Shows green overlay with measurement lines
  - Displays the distance from content to border

- **Margin Properties** (`margin`, `margin-top`, `margin-right`, etc.)
  - Shows orange overlay with measurement lines
  - Displays the distance from border to neighboring elements

- **Size Properties** (`width`, `height`, `max-width`, etc.)
  - Shows measurement lines along edges
  - Displays the total dimension in pixels

**Example Properties:**
- `Padding: 24px` → Shows 24px measurement on all sides
- `Margin Top: 16px` → Shows 16px measurement above element
- `Width: 200px` → Shows 200px horizontal measurement

#### Region Highlights (Visual Properties)

When you hover over visual properties, you'll see color-coded highlights:

- **Color Properties** (`color`, `background-color`, `border-color`)
  - Highlights the affected region
  - Shows current color value

- **Border Properties** (`border`, `border-width`, `border-radius`)
  - Purple outline showing border area
  - Measurement of border width

- **Typography Properties** (`font-size`, `line-height`, `letter-spacing`)
  - Highlights text content
  - Shows affected text region

**Example Properties:**
- `Background Color: #FF0000` → Highlights background area
- `Border Width: 2px` → Shows 2px border outline
- `Font Size: 16px` → Highlights text content

#### Property Indicators (Non-Visual Properties)

For properties that don't have visual representation on the canvas:

- Shows floating label near the component
- Displays property name and value
- Auto-dismisses after 3 seconds

**Example Properties:**
- `Component Type: Button`
- `Link URL: https://example.com`
- `Alt Text: Company Logo`

---

## Property Types & Visual Feedback

### Spacing Properties

**Properties:**
- `padding`, `padding-top`, `padding-right`, `padding-bottom`, `padding-left`
- `margin`, `margin-top`, `margin-right`, `margin-bottom`, `margin-left`
- `gap`

**Visual Feedback:**
- Green overlay for padding
- Orange overlay for margin
- Measurement lines with pixel values
- Animates smoothly on change

**Animation Duration:** 150ms

---

### Size Properties

**Properties:**
- `width`, `height`
- `max-width`, `max-height`, `min-width`, `min-height`

**Visual Feedback:**
- Measurement lines along edges
- Pixel value labels
- Shows dimension changes

**Animation Duration:** 150ms

---

### Color Properties

**Properties:**
- `color` (text color)
- `background-color`
- `border-color`

**Visual Feedback:**
- Highlights affected region
- Shows current color
- Smooth color transition animations

**Animation Duration:** 200ms

---

### Border Properties

**Properties:**
- `border`, `border-width`, `border-style`, `border-color`
- `border-radius`, `border-top-left-radius`, etc.

**Visual Feedback:**
- Purple border outline
- Measurement of border width
- Border radius visualization

**Animation Duration:** 180ms

---

### Typography Properties

**Properties:**
- `font-size`
- `font-weight`
- `line-height`
- `letter-spacing`
- `text-align`

**Visual Feedback:**
- Highlights text content
- Shows affected text region
- Smooth text property transitions

**Animation Duration:** 150ms

---

### Effect Properties

**Properties:**
- `opacity`
- `box-shadow`
- `text-shadow`

**Visual Feedback:**
- Highlights element with effect
- Shows effect region
- Smooth effect transitions

**Animation Duration:** 200ms

---

## Tips & Tricks

### 1. **Quick Property Discovery**

Hover over different properties to quickly understand what they control without actually changing values.

### 2. **Compare Before & After**

1. Note the current value
2. Hover to see current state
3. Edit the value
4. Watch the smooth animation
5. Judge if you like the result

### 3. **Fine-Tune Spacing**

Use the visual feedback to perfect spacing:
1. Hover over padding
2. See measurement lines
3. Adjust until measurements look balanced
4. Use consistent values (e.g., 16px, 24px, 32px)

### 4. **Visual Rhythm**

Create visual rhythm by:
1. Checking margin/padding measurements
2. Using consistent spacing scale
3. Watching animations to feel the flow

### 5. **Color Harmony**

When choosing colors:
1. Hover to see affected area
2. Try different colors
3. Watch smooth transitions
4. Compare with nearby elements

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| **Tab** | Move to next property |
| **Shift + Tab** | Move to previous property |
| **Enter** | Apply property value |
| **Escape** | Cancel property edit |
| **↑/↓ Arrows** | Increment/decrement numeric values |

---

## Accessibility Features

### Reduced Motion Support

If you have motion sensitivity:

1. **System Setting:**
   - Windows: Settings → Ease of Access → Display → Simplify and personalize Windows → Show animations
   - macOS: System Preferences → Accessibility → Display → Reduce motion
   - Linux: Varies by desktop environment

2. **Browser Setting:**
   - Chrome/Edge: Settings → Accessibility → Prefers reduced motion
   - Firefox: about:config → ui.prefersReducedMotion

**What Changes:**
- Animations are disabled (instant property changes)
- Visual overlays still appear
- Measurements still show
- No performance impact

### Keyboard Navigation

All visual feedback works with keyboard navigation:
- Tab through properties to trigger hover states
- Use arrow keys in number inputs to see live changes
- Screen readers announce property changes

### High Contrast

Visual feedback adapts to high contrast modes:
- Measurement lines use system colors
- Overlays maintain sufficient contrast
- Labels remain readable

---

## Troubleshooting

### "Visual feedback isn't showing"

**Check:**
1. Is a component selected?
2. Are you hovering over a property control?
3. Is the canvas visible?

**Solution:** Click on a component and hover over any property in the right panel.

---

### "Animations are too fast/slow"

**Note:** Animation speeds are optimized for usability:
- Spacing: 150ms (quick)
- Colors: 200ms (smooth)
- Layout: 180ms (balanced)

These timings provide the best user experience and cannot be customized in the UI.

---

### "I prefer no animations"

**Solution:** Enable "Reduce motion" in your system settings (see Accessibility Features above).

---

### "Overlays are blocking my view"

**Behavior:** Overlays are semi-transparent and designed to enhance, not obstruct.

**Tips:**
- Move your mouse away to clear hover overlays
- Click outside a property to end edit mode
- Overlays auto-clear when you finish editing

---

### "Performance seems slow"

**Possible Causes:**
- Too many simultaneous animations
- Very complex templates
- Older hardware

**Solutions:**
- The system automatically limits simultaneous animations
- Overlays are hardware-accelerated for performance
- Enable "Reduce motion" for instant feedback without animations

---

## Examples

### Example 1: Adjusting Button Padding

1. **Select the Button** component on canvas
2. **Hover over "Padding"** in the Property Panel
   - See green overlay showing padding area
   - Measurement lines show current padding (e.g., 16px)
3. **Click to edit** - overlay turns bright green (active state)
4. **Type "24"** - watch padding smoothly animate from 16px to 24px
5. **Press Enter** or click away to finish

**Result:** Button now has 24px padding, and you saw exactly how it changed!

---

### Example 2: Choosing Background Color

1. **Select any component**
2. **Hover over "Background Color"**
   - See highlight showing background area
3. **Click the color picker**
4. **Select different colors** - watch background smoothly transition
5. **Choose your favorite** - smooth fade to final color

**Result:** Perfect color choice with live preview!

---

### Example 3: Setting Component Width

1. **Select a component**
2. **Hover over "Width"**
   - See horizontal measurement lines
   - Current width displayed (e.g., 200px)
3. **Edit to "300"**
4. **Watch width animate** from 200px to 300px
5. **See measurement update** to 300px

**Result:** Component resized with visual confirmation!

---

## Best Practices

### ✅ Do

- **Hover before editing** to understand what a property controls
- **Watch animations** to judge the final result
- **Use consistent values** (e.g., 8px, 16px, 24px, 32px)
- **Compare side-by-side** by noting measurements
- **Take your time** - visual feedback helps you make better decisions

### ❌ Don't

- **Rapid-fire edits** - give animations time to complete
- **Ignore measurements** - they help maintain consistency
- **Forget to check canvas** - always verify on the actual component
- **Skip hover preview** - it saves time by showing you what will change

---

## Frequently Asked Questions

### Q: Can I disable visual feedback?

**A:** Yes, but it's not recommended. Visual feedback dramatically improves usability. However, you can enable "Reduce motion" in your system settings to disable animations while keeping overlays.

### Q: Why don't all properties show visual feedback?

**A:** Some properties (like URLs, alt text, component type) don't have visual representation on the canvas. These show property indicators instead.

### Q: Can I customize highlight colors?

**A:** Currently, colors are optimized for usability and cannot be customized in the UI. The default colors (green for padding, orange for margin, purple for border) follow industry standards.

### Q: Does visual feedback work on mobile?

**A:** The Email Builder is optimized for desktop use. Visual feedback works best with mouse hover interactions.

### Q: Why do some properties animate and others don't?

**A:** All visual properties animate. If you have "Reduce motion" enabled in your system settings, animations are disabled for accessibility.

---

## Learn More

- **Video Tutorials:** [Coming soon]
- **Interactive Demo:** [Try the demo](https://example.com/demo)
- **Developer Docs:** [API Documentation](./VISUAL_FEEDBACK_API.md)
- **Report Issues:** [GitHub Issues](https://github.com/rmadeiraneto/email-builder/issues)
- **Community Forum:** [Discuss](https://github.com/rmadeiraneto/email-builder/discussions)

---

**Last Updated:** November 2025  
**Version:** 1.0.0  
**Made with ❤️ by the Email Builder Team**
