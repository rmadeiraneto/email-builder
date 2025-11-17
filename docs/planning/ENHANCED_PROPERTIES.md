# Enhanced Component Customization Properties

> **Status**: 🟡 HIGH PRIORITY - Email-first approach
> **Reference**: REQUIREMENTS.md Section 18
> **Estimated Time**: 30-50 hours
> **Progress**: 20% Complete (PHASE 0A & 0C done)

## Overview

Comprehensive property enhancement system with email-first prioritization. The goal is to provide professional-grade customization while maintaining maximum email client compatibility (especially Outlook 2016+).

---

## Implementation Status

### ✅ PHASE 0A: Foundation Complete (Nov 12-14, 2025)
- [x] CSSValueInput - CSS measurement input with unit selector
- [x] BorderEditor - Complete border configuration (width, style, color, radius)
- [x] SpacingEditor - 4-sided spacing editor (padding/margin)
- [x] DisplayToggle - Show/hide toggle with visual indicators
- [x] ImageUpload - Dual-input image selector with preview
- [x] RichTextEditor enhancements - Lists, code blocks, links, super/subscript
- [x] ColorPicker enhancements - Mode switcher, swatches, transparency
- [x] ListEditor - Drag-and-drop reordering

### ✅ PHASE 0C: PropertyPanel Integration Complete (Nov 17, 2025)
- [x] All 8 components integrated into PropertyPanel
- [x] Property definitions updated for 10 component types
- [x] Property validation implemented
- [x] Undo/redo compatibility verified

### ⏳ PHASE 0D: Documentation & Examples (Next - 4-6 hours)
- [ ] Add all enhanced components to ComponentShowcase
- [ ] Create PROPERTY_EDITORS.md usage guide
- [ ] (Optional) Storybook stories for visual testing

---

## Phase 1: EMAIL CRITICAL Properties

**Priority**: 🔴 CRITICAL
**Status**: 40% Complete
**Time Remaining**: 12-18 hours
**Target Email Clients**: Outlook 2016+, Gmail, Apple Mail

### 1.1 Per-Side Spacing Controls ✅ PARTIALLY COMPLETE
**Status**: ✅ SpacingEditor implemented, needs component integration
**Time Remaining**: 3-4 hours

**Current State**:
- [x] SpacingEditor component created (232 lines)
- [x] Integrated into PropertyPanel for padding
- [ ] Need to add margin support for all components
- [ ] Need to add per-side controls (not just unified padding)

**Components Requiring Update**:
- [ ] Button: Add margin controls (top, right, bottom, left)
- [ ] Image: Add margin controls
- [ ] Separator: Add margin controls
- [ ] Header: Add margin controls (separate from padding)
- [ ] Footer: Add margin controls
- [ ] Hero: Add margin controls
- [ ] List: Add margin controls + per-item margins
- [ ] CTA: Add margin controls

**Technical Approach**:
- Use `<table>` with cellpadding/cellspacing for Outlook compatibility
- Fall back to CSS margin for modern clients
- Export as VML for maximum compatibility

---

### 1.2 Per-Side Border Controls ✅ PARTIALLY COMPLETE
**Status**: ✅ BorderEditor implemented, needs enhancement
**Time Remaining**: 4-6 hours

**Current State**:
- [x] BorderEditor component created (441 lines)
- [x] Integrated into PropertyPanel for all components
- [x] Supports unified border (all sides same)
- [ ] Need to add per-side border controls (top, right, bottom, left)

**Enhancement Requirements**:
- [ ] Add "Link Borders" toggle (similar to spacing)
- [ ] When unlinked, show 4 independent border controls
- [ ] Each side: width, style, color (radius stays unified)
- [ ] Update Border type in core to support per-side definitions
- [ ] Email-safe export (<table border>, border-collapse)

**Components Already Using BorderEditor**:
- Button, Image, Separator, Header, Footer, Hero, List, CTA, Section

---

### 1.3 Background Images with Fallback Colors ❌ NOT STARTED
**Status**: ❌ Not Started
**Priority**: HIGH
**Time**: 6-8 hours

**Description**: Add background image support with solid color fallback for Outlook 2016+ (which doesn't support background-image CSS).

**Requirements**:
- [ ] Add BackgroundImageEditor component
  - [ ] Image URL input (with ImageUpload integration)
  - [ ] Fallback color picker
  - [ ] Position controls (center, top, bottom, left, right)
  - [ ] Size controls (cover, contain, auto)
  - [ ] Repeat toggle (repeat, no-repeat)
- [ ] VML-based background image for Outlook
- [ ] Graceful degradation to fallback color
- [ ] Update core types: BackgroundImage interface
- [ ] Integration into PropertyPanel

**Components to Update**:
- Section (primary use case)
- Header
- Footer
- Hero
- CTA

**Technical Reference**: VML background image approach
```html
<!--[if gte mso 9]>
<v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false">
  <v:fill type="tile" src="image.jpg" color="#fallback" />
  <v:textbox inset="0,0,0,0">
<![endif]-->
  <!-- Content here -->
<!--[if gte mso 9]>
  </v:textbox>
</v:rect>
<![endif]-->
```

---

### 1.4 Line Height Controls ✅ TYPE EXISTS, NEEDS UI
**Status**: ⏳ Partial (type exists in BaseStyles, no UI)
**Time**: 2-3 hours

**Current State**:
- [x] `lineHeight` property exists in BaseStyles type
- [ ] No UI control in PropertyPanel
- [ ] Not exported to HTML/CSS

**Requirements**:
- [ ] Add LineHeightInput component (or use CSSValueInput with unitless option)
- [ ] Support unitless values (1.2, 1.5, 2.0) - preferred for email
- [ ] Support pixel values (16px, 20px, 24px)
- [ ] Support percentage values (120%, 150%)
- [ ] Min value: 1.0 (for readability)
- [ ] Max value: 3.0
- [ ] Default: 1.5
- [ ] Add to RichTextEditor toolbar
- [ ] Integration into PropertyPanel for Text components

**Components to Update**:
- Text (primary)
- Button (for button text)
- Header (for navigation links)
- Footer (for footer text)
- All components with text content

**Email Compatibility**: Excellent (supported in all clients)

---

## Phase 2: EMAIL IMPORTANT Properties

**Priority**: 🟡 HIGH
**Status**: 0% Complete
**Time**: 12-18 hours
**Target Email Clients**: Modern clients (Gmail, Apple Mail, Outlook 365)

### 2.1 Letter Spacing ❌ NOT STARTED
**Status**: ❌ Not Started
**Time**: 2-3 hours

**Description**: Control spacing between letters (tracking in print design terms).

**Requirements**:
- [ ] Add LetterSpacingInput component (use CSSValueInput)
- [ ] Support: px, em values
- [ ] Range: -2px to 10px
- [ ] Default: 0 (normal)
- [ ] Add to RichTextEditor toolbar
- [ ] Integration into PropertyPanel for Text components

**Components to Update**: Text, Button, Header, Footer (all text-containing components)

**Email Compatibility**:
- ✅ Gmail, Apple Mail, Outlook 365
- ⚠️ Outlook 2016-2019 (partial support)
- ❌ Outlook 2007-2013 (not supported)

---

### 2.2 Text Transform ❌ NOT STARTED
**Status**: ❌ Not Started
**Time**: 1-2 hours

**Description**: Uppercase, lowercase, capitalize transformations.

**Requirements**:
- [ ] Add TextTransformSelect component (dropdown)
- [ ] Options: none, uppercase, lowercase, capitalize
- [ ] Add to RichTextEditor toolbar
- [ ] Integration into PropertyPanel

**Components to Update**: Text, Button, Header, Footer

**Email Compatibility**: Good (supported in most clients)

---

### 2.3 Font Weight Selector (100-900) ❌ NOT STARTED
**Status**: ❌ Not Started
**Time**: 2-3 hours

**Description**: Granular font weight control beyond just bold/normal.

**Requirements**:
- [ ] Add FontWeightSelect component
- [ ] Options: 100, 200, 300, 400 (normal), 500, 600, 700 (bold), 800, 900
- [ ] Visual preview of each weight
- [ ] Add to RichTextEditor toolbar
- [ ] Replace existing bold toggle with weight selector

**Components to Update**: Text, Button, Header, Footer, all text components

**Email Compatibility**:
- ✅ Gmail, Apple Mail
- ⚠️ Outlook (depends on font family, many system fonts only have 400/700)
- Recommendation: Limit to 400, 600, 700 for email templates

---

### 2.4 Text Decoration ❌ NOT STARTED
**Status**: ❌ Not Started
**Time**: 1-2 hours

**Description**: Underline, overline, line-through.

**Requirements**:
- [ ] Add TextDecorationSelect component
- [ ] Options: none, underline, overline, line-through
- [ ] Support combination (underline + overline)
- [ ] Add to RichTextEditor toolbar

**Components to Update**: Text, links (all text content)

**Email Compatibility**: Excellent (all clients)

---

### 2.5 Width/Height Controls for Images ✅ PARTIALLY COMPLETE
**Status**: ✅ CSSValueInput used, needs constraints
**Time**: 2-3 hours

**Current State**:
- [x] Image width/height use CSSValueInput
- [ ] Need to add constraints (max-width, max-height)
- [ ] Need to add aspect ratio lock toggle
- [ ] Need to add "Original Size" quick action

**Requirements**:
- [ ] Max dimensions for email safety (600px width recommended)
- [ ] Aspect ratio lock toggle (link icon)
- [ ] "Reset to Original" button
- [ ] Warning for images >600px in email templates
- [ ] Support for responsive images (max-width: 100%)

**Components to Update**: Image, Hero (image section), List (item images)

---

### 2.6 Alignment Controls Enhancement ❌ NOT STARTED
**Status**: ❌ Not Started
**Time**: 2-3 hours

**Description**: Comprehensive alignment controls for all content types.

**Requirements**:
- [ ] Add AlignmentControl component (visual button group)
- [ ] Options: left, center, right, justify (text), stretch (images/buttons)
- [ ] Visual icons for each alignment
- [ ] Vertical alignment for flex/table layouts
- [ ] Integration with email-safe alignment (table-based)

**Components to Update**: All components

---

### 2.7 Link Styling Controls ❌ NOT STARTED
**Status**: ❌ Not Started
**Time**: 3-4 hours

**Description**: Comprehensive link appearance controls.

**Requirements**:
- [ ] Add LinkStyleEditor component
- [ ] Color picker (normal state)
- [ ] Hover color picker (with preview)
- [ ] Underline toggle (default: on for accessibility)
- [ ] Font weight for links
- [ ] Background color for links (button-style links)
- [ ] Padding for link buttons
- [ ] Add to RichTextEditor link dialog

**Components to Update**: Text (with links), RichTextEditor, Footer (links list)

**Email Compatibility**:
- ✅ Normal color: Excellent
- ⚠️ Hover color: Not supported in many email clients (desktop only)
- Recommendation: Style links to look clickable without relying on hover

---

## Phase 3: WEB-FOCUSED Properties (Q3 2026)

**Priority**: 🟢 MEDIUM (deferred for email-first approach)
**Status**: 0% Complete
**Time**: 16-24 hours

### 3.1 Box Shadow ❌ NOT STARTED
**Email Compatibility**: ❌ Poor (not supported in Outlook)

### 3.2 Gradient Backgrounds ❌ NOT STARTED
**Email Compatibility**: ⚠️ Partial (VML possible but complex)

### 3.3 CSS Filters ❌ NOT STARTED
**Email Compatibility**: ❌ Poor

### 3.4 Transforms & Animations ❌ NOT STARTED
**Email Compatibility**: ❌ Not supported in email

### 3.5 Custom Fonts (Web Fonts) ❌ NOT STARTED
**Email Compatibility**: ⚠️ Partial (Gmail, Apple Mail only)

---

## Implementation Roadmap

### Immediate Next Steps (After PHASE 0D)
1. **Complete Per-Side Spacing** (3-4 hours)
   - Add margin controls to all components
   - Update SpacingEditor for independent side controls

2. **Complete Per-Side Borders** (4-6 hours)
   - Enhance BorderEditor with per-side controls
   - Update core Border type

3. **Background Images** (6-8 hours)
   - Create BackgroundImageEditor component
   - VML implementation for Outlook

4. **Line Height UI** (2-3 hours)
   - Add line height control to PropertyPanel
   - RichTextEditor integration

**Total Phase 1 Completion**: 15-21 hours

### Medium-Term (Phase 2)
5. Letter Spacing (2-3 hours)
6. Text Transform (1-2 hours)
7. Font Weight Selector (2-3 hours)
8. Text Decoration (1-2 hours)
9. Image Constraints (2-3 hours)
10. Alignment Enhancement (2-3 hours)
11. Link Styling (3-4 hours)

**Total Phase 2**: 13-20 hours

### Long-Term (Phase 3 - Q3 2026)
12-16. Web-focused properties (box shadow, gradients, filters, transforms, web fonts)

**Total Phase 3**: 16-24 hours

---

## Testing Strategy

### Email Compatibility Testing
Each property must be tested in:
- ✅ Gmail (web, iOS, Android)
- ✅ Apple Mail (macOS, iOS)
- ✅ Outlook 365 (web)
- ✅ Outlook 2016+ (Windows desktop)
- ⚠️ Outlook 2007-2013 (legacy, graceful degradation)

### Testing Checklist
For each property:
- [ ] Unit tests for component logic
- [ ] Integration tests with PropertyPanel
- [ ] Visual regression tests (Storybook)
- [ ] Email client rendering tests (Litmus/Email on Acid)
- [ ] Export HTML validation
- [ ] Undo/redo functionality
- [ ] Mobile responsive behavior

---

## Success Criteria

**Phase 1 Complete**:
- [ ] Per-side spacing and borders fully functional
- [ ] Background images with VML fallback working in Outlook
- [ ] Line height control in all text components
- [ ] All Phase 1 properties tested in target email clients
- [ ] Documentation updated

**Phase 2 Complete**:
- [ ] All typography controls implemented
- [ ] Image dimension constraints functional
- [ ] Link styling comprehensive
- [ ] All Phase 2 properties tested

**Phase 3 Complete**:
- [ ] Web-focused properties implemented
- [ ] Graceful degradation for email templates
- [ ] Template type detection (email vs web) determines available properties

---

## Dependencies

- ✅ PHASE 0A: Component Implementation (Complete)
- ✅ PHASE 0C: PropertyPanel Integration (Complete)
- ⏳ PHASE 0D: Documentation & Examples (Next)
- ❌ VML Email Generation System (needed for Phase 1.3)

---

## Notes

- **Email-First Strategy**: Phase 1 properties are critical for professional email templates
- **Outlook Compatibility**: VML is required for background images and advanced borders
- **Progressive Enhancement**: Phase 3 properties should detect template type and disable for email templates
- **Testing Investment**: Each property requires 1-2 hours of email client testing
- **Documentation**: Each property needs usage examples and email compatibility notes

---

_Last Updated: November 17, 2025_
