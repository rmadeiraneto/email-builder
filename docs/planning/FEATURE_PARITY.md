# Feature Parity Requirements

> **Status**: 🔴 CRITICAL PRIORITY - Must complete before production
> **Reference**: REQUIREMENTS.md Section 20
> **Estimated Time**: 40-60 hours
> **Progress**: 0% Complete

## Overview

The existing email builder has 9 additional components and numerous UI patterns that are not yet in the new builder. These features must be implemented to achieve feature parity before the new builder can replace the existing one.

---

## 1. Missing Components (9 Total)

### 1.1 Duo Panel Component
**Status**: ❌ Not Started
**Priority**: HIGH
**Time**: 4-6 hours

**Description**: Side-by-side comparison panels for before/after, features comparison, or dual content display.

**Requirements**:
- [ ] Two configurable panels (left/right)
- [ ] Adjustable panel width ratio (50/50, 60/40, 70/30)
- [ ] Per-panel background colors
- [ ] Per-panel padding controls
- [ ] Border between panels (optional)
- [ ] Responsive stacking on mobile
- [ ] Content alignment within each panel

**Email Client Support**: Outlook 2016+ (table-based layout)

---

### 1.2 Spaced Text Component
**Status**: ❌ Not Started
**Priority**: HIGH
**Time**: 3-4 hours

**Description**: Left-right justified text with automatic spacing (e.g., "Price: $99" with price on right).

**Requirements**:
- [ ] Left text field (label)
- [ ] Right text field (value)
- [ ] Font size, color, weight controls for each side
- [ ] Vertical alignment options (top, middle, bottom)
- [ ] Separator character (optional, e.g., dots or line)
- [ ] Table layout option for Outlook compatibility
- [ ] Mobile stacking behavior

**Email Client Support**: Outlook 2016+ (table-based with 100% width)

---

### 1.3 Links List Component
**Status**: ❌ Not Started
**Priority**: MEDIUM
**Time**: 3-4 hours

**Description**: Standalone list of links (no descriptions), often used in footers or navigation.

**Requirements**:
- [ ] Array of links (text + URL)
- [ ] Separator character (|, •, -, etc.)
- [ ] Inline or stacked layout
- [ ] Link color, hover color
- [ ] Font size, weight controls
- [ ] Alignment (left, center, right)

**Email Client Support**: All clients (simple anchor tags)

---

### 1.4 Code Component (Custom HTML/CSS Injection)
**Status**: ❌ Not Started
**Priority**: LOW (Advanced users only)
**Time**: 6-8 hours

**Description**: Allows advanced users to inject custom HTML/CSS code for special effects or custom components.

**Requirements**:
- [ ] HTML input field (code editor)
- [ ] CSS input field (inline or <style> tag)
- [ ] Preview mode with iframe isolation
- [ ] Validation warnings for email-unsafe code
- [ ] Compatibility warnings
- [ ] "Advanced mode" toggle to hide from basic users
- [ ] XSS protection and sanitization

**Email Client Support**: Varies (user responsibility)

**Note**: This is a power-user feature and should be clearly marked as "advanced" with warnings about email client compatibility.

---

### 1.5-1.9 Additional Component Variants
**Status**: ❌ Not Started
**Priority**: MEDIUM
**Time**: 15-20 hours (combined)

These are variations or enhancements to existing components:
- Button Group (multiple buttons in a row)
- Image Gallery (grid of images with lightbox)
- Testimonial Card (quote with author photo/name)
- Pricing Table (multi-column comparison)
- Event Details (date/time/location formatting)

**Detailed requirements to be documented after initial 4 components are complete.**

---

## 2. Missing UI Patterns

### 2.1 "Fit to Container" vs "With Margins" Toggle
**Status**: ❌ Not Started
**Priority**: HIGH
**Time**: 2-3 hours

**Description**: Global toggle for whether components stretch full-width or have container margins.

**Requirements**:
- [ ] Add toggle to Canvas Settings panel
- [ ] Apply max-width constraint when "With Margins" selected
- [ ] Default: 600px max-width with center alignment
- [ ] Update component renderer to respect setting
- [ ] Export with appropriate wrapper styles

**Affected Components**: All components

---

### 2.2 Per-Element Margins Within List Items
**Status**: ❌ Not Started
**Priority**: HIGH
**Time**: 3-4 hours

**Description**: Fine-grained margin control for title, description, button, and image within List component items.

**Requirements**:
- [ ] Add margin controls to List component property panel
- [ ] Separate controls for: title-margin, description-margin, button-margin, image-margin
- [ ] Support top/bottom margins independently
- [ ] Apply to all list items uniformly
- [ ] Update ListItemRenderer to apply margins

**Affected Components**: List

---

### 2.3 Force Outlook Border-Radius Option for Buttons
**Status**: ❌ Not Started
**Priority**: MEDIUM
**Time**: 2 hours

**Description**: VML-based border-radius for Outlook 2016+ (since border-radius not natively supported).

**Requirements**:
- [ ] Add "Force Outlook Border-Radius" checkbox to Button properties
- [ ] Generate VML code for rounded corners when enabled
- [ ] Add compatibility warning about file size increase
- [ ] Test in Outlook 2016, 2019, 365
- [ ] Document limitations (max-width required)

**Affected Components**: Button, CTA

**Technical Reference**: https://backgrounds.cm/ for VML approach

---

### 2.4 Image/Content Ratio Slider for List Component
**Status**: ❌ Not Started
**Priority**: MEDIUM
**Time**: 2-3 hours

**Description**: Control the width ratio between image and content in horizontal List items.

**Requirements**:
- [ ] Add slider control: 20/80, 30/70, 40/60, 50/50
- [ ] Apply to horizontal layout only (not stacked)
- [ ] Update table-based layout for email compatibility
- [ ] Responsive override for mobile (always stack)

**Affected Components**: List

---

### 2.5 Margin Colors for Visual Debugging
**Status**: ❌ Not Started
**Priority**: LOW
**Time**: 2 hours

**Description**: Development mode feature to visualize margins/padding with colored overlays.

**Requirements**:
- [ ] Add "Show Margins" toggle to Canvas Settings
- [ ] Render semi-transparent colored overlays for padding (green), margin (orange)
- [ ] Only active in builder mode (not in export)
- [ ] Update TemplateCanvas to show overlays

**Affected Components**: All (canvas rendering)

---

### 2.6 Table Layout Options for Spaced Text
**Status**: ❌ Not Started
**Priority**: MEDIUM
**Time**: 2 hours

**Description**: Force table-based layout for maximum Outlook compatibility in Spaced Text component.

**Requirements**:
- [ ] Add "Use Table Layout" checkbox to Spaced Text properties
- [ ] Generate <table> structure when enabled
- [ ] Default: enabled for email templates, disabled for web templates
- [ ] Ensure 100% width and proper cell alignment

**Affected Components**: Spaced Text

---

### 2.7 Social Network Icon Wrapping for Footer
**Status**: ❌ Not Started
**Priority**: MEDIUM
**Time**: 2-3 hours

**Description**: Control whether social icons wrap to multiple lines or stay inline with scrolling.

**Requirements**:
- [ ] Add "Wrap Icons" toggle to Footer properties
- [ ] Apply flex-wrap: wrap when enabled
- [ ] Add configurable icon spacing (gap)
- [ ] Test in email clients with 5+ icons

**Affected Components**: Footer

---

### 2.8 Navigation Bar Width Toggle for Header
**Status**: ❌ Not Started
**Priority**: MEDIUM
**Time**: 2 hours

**Description**: Control whether header navigation takes full width or is constrained to content width.

**Requirements**:
- [ ] Add "Full Width Navigation" toggle to Header properties
- [ ] Apply max-width constraint when disabled
- [ ] Center navigation when constrained
- [ ] Email-safe table layout for navigation items

**Affected Components**: Header

---

## 3. Missing Rich Text Editor Features

### 3.1 Additional Text Formatting Options
**Status**: ❌ Not Started
**Priority**: MEDIUM
**Time**: 6-8 hours

**Description**: Expand RichTextEditor with additional formatting options that exist in the old builder.

**Requirements**:
- [x] Subscript, Superscript (COMPLETE - added in PHASE 0A)
- [x] Ordered/unordered lists (COMPLETE - added in PHASE 0A)
- [ ] Headings (H1-H6) with semantic HTML
- [ ] Background color on text (highlight effect)
- [x] Code blocks (COMPLETE - added in PHASE 0A)
- [ ] Font weight selector (100-900) instead of just bold toggle
- [ ] Letter spacing control
- [ ] Line height control (already in BaseStyles but not in UI)

**Affected Components**: RichTextEditor, Text, all components with text content

**Note**: Some features already implemented in PHASE 0A (subscript/superscript, lists, code blocks). This task focuses on remaining items.

---

## 4. Implementation Plan

### Phase 1: Critical Components (12-16 hours)
**Priority**: 🔴 CRITICAL
1. Duo Panel Component
2. Spaced Text Component
3. "Fit to Container" toggle
4. Per-Element Margins in List

### Phase 2: Important UI Patterns (8-12 hours)
**Priority**: 🟡 HIGH
5. Links List Component
6. Force Outlook Border-Radius
7. Image/Content Ratio Slider
8. Social Icon Wrapping

### Phase 3: Enhancement Features (10-14 hours)
**Priority**: 🟢 MEDIUM
9. Navigation Bar Width Toggle
10. Table Layout Options for Spaced Text
11. Rich Text Editor enhancements (H1-H6, background color, font weight)

### Phase 4: Advanced Features (10-14 hours)
**Priority**: 🔵 LOW
12. Code Component (Custom HTML/CSS)
13. Margin Colors (Debug Mode)
14. Additional Component Variants (5 components)

---

## 5. Testing Requirements

Each feature must include:
- [ ] Unit tests (component logic)
- [ ] Integration tests (builder UI)
- [ ] Email client compatibility tests (Litmus/Email on Acid)
- [ ] Responsive behavior tests (mobile/tablet)
- [ ] Accessibility tests (WCAG 2.1 AA)
- [ ] Export verification (HTML output)

---

## 6. Success Criteria

- [ ] All 9 missing components implemented and tested
- [ ] All 8 UI patterns implemented and tested
- [ ] Rich Text Editor feature parity achieved
- [ ] Email client compatibility verified (Outlook 2016+, Gmail, Apple Mail)
- [ ] Documentation updated with new components
- [ ] Component Showcase updated with examples
- [ ] Users can replicate all templates from old builder in new builder

---

## 7. Dependencies

- ✅ PropertyPanel integration complete (PHASE 0C)
- ✅ Email compatibility system complete
- ✅ Mobile development mode complete
- ⏳ PHASE 0D: Documentation & Examples (next session)

---

## 8. Notes

- This is the **blocker for production deployment**
- Estimated 40-60 hours total development time
- Recommended to tackle in 4 phases over 2-3 weeks
- Some features (Code Component, Debug Mode) can be deferred to post-launch
- Focus on email-critical components first (Phase 1-2)

---

_Last Updated: November 17, 2025_
