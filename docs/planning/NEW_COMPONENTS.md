# New Out-of-the-Box Components

> **Status**: 🟡 HIGH PRIORITY - Production-critical components
> **Reference**: REQUIREMENTS.md Section 19
> **Estimated Time**: 40-60 hours
> **Progress**: 0% Complete

## Overview

Expand the component library with production-ready, professionally designed components that cover common email and web use cases. Email-first approach with phased rollout based on criticality.

---

## Phase 1: EMAIL CRITICAL Components

**Priority**: 🔴 CRITICAL
**Status**: 0% Complete
**Time**: 20-30 hours
**Target**: Q1 2026

### 1.1 Countdown Timer Component
**Status**: ❌ Not Started
**Priority**: HIGH (urgency marketing)
**Time**: 8-10 hours

**Use Cases**:
- Flash sale countdown
- Event registration deadline
- Product launch timer
- Limited offer expiration

**Requirements**:
- [ ] End date/time selector (datetime-local input)
- [ ] Timezone support (auto-detect or manual)
- [ ] Display format options:
  - [ ] Days, Hours, Minutes, Seconds
  - [ ] Days, Hours only
  - [ ] Hours, Minutes only
- [ ] Label customization ("Ends in:", "Time remaining:", etc.)
- [ ] Digit styling (background color, text color, padding, border-radius)
- [ ] Separator styling (colon, pipe, dots)
- [ ] Alignment (left, center, right)
- [ ] **Email-Safe Implementation**:
  - [ ] Static image generation (not JavaScript countdown)
  - [ ] Server-side rendering with timestamp
  - [ ] Image-based digits for consistency
  - [ ] Fallback text for clients that block images

**Technical Approach**:
- Server-side image generation (Canvas API or image library)
- Pre-render countdown at export time
- Optional: Dynamic update via AMP for Email (Gmail only)
- Fallback: Static "Ends on [date]" text

**Email Compatibility**:
- ✅ All clients (as static image)
- ✅ Gmail (with AMP for Email enhancement)

**Testing Requirements**:
- [ ] Test in all major email clients
- [ ] Verify image generation performance
- [ ] Test with various timezones
- [ ] Test expired countdown (past deadline)

---

### 1.2 Product Component
**Status**: ❌ Not Started
**Priority**: HIGH (e-commerce)
**Time**: 6-8 hours

**Use Cases**:
- Product showcase in promotional emails
- Catalog newsletters
- Abandoned cart reminders
- Product launch announcements

**Requirements**:
- [ ] Product image (ImageUpload)
- [ ] Product title (text, customizable font size/weight)
- [ ] Product description (rich text, optional)
- [ ] Price display:
  - [ ] Regular price
  - [ ] Sale price (with strikethrough on regular)
  - [ ] Discount badge ("20% OFF")
- [ ] Call-to-action button ("Buy Now", "View Product", etc.)
- [ ] Rating display (1-5 stars, optional)
- [ ] Badge/tag (NEW, SALE, LIMITED, etc.)
- [ ] Layout options:
  - [ ] Image on top, content below
  - [ ] Image on left, content on right (40/60, 50/50 ratios)
  - [ ] Image as background with content overlay
- [ ] Border and spacing controls (BorderEditor, SpacingEditor)

**Component Structure**:
```typescript
interface ProductProps {
  image: ImageData;
  title: string;
  description?: string;
  regularPrice: number;
  salePrice?: number;
  currency: string; // 'USD', 'EUR', 'GBP', etc.
  discountBadge?: string;
  buttonText: string;
  buttonLink: string;
  rating?: number; // 0-5
  badge?: string;
  layout: 'stacked' | 'horizontal-40-60' | 'horizontal-50-50' | 'background';
  // Plus all common styling properties
}
```

**Email Compatibility**: Excellent (table-based layout)

---

### 1.3 Table Component
**Status**: ❌ Not Started
**Priority**: HIGH (data display)
**Time**: 6-8 hours

**Use Cases**:
- Pricing comparison tables
- Feature comparison grids
- Order summaries (invoice-style)
- Schedule/agenda tables

**Requirements**:
- [ ] Dynamic column configuration (1-5 columns recommended)
- [ ] Dynamic row management (add/remove rows)
- [ ] Header row (optional, sticky option for web)
- [ ] Footer row (optional, for totals)
- [ ] Cell types:
  - [ ] Text (plain)
  - [ ] Number (right-aligned by default)
  - [ ] Currency (with symbol)
  - [ ] Boolean (checkmark/X icon)
  - [ ] Image (for product tables)
- [ ] Cell styling:
  - [ ] Background color per cell/row/column
  - [ ] Text alignment (left, center, right)
  - [ ] Padding controls
  - [ ] Border controls (per cell or unified)
- [ ] Responsive behavior:
  - [ ] Horizontal scroll on mobile
  - [ ] Stacked cards on mobile (transform table to card list)
  - [ ] Hide columns on mobile (mark optional columns)
- [ ] Zebra striping (alternating row colors)
- [ ] Hover effects (web only)

**Component Structure**:
```typescript
interface TableProps {
  columns: TableColumn[];
  rows: TableRow[];
  hasHeader: boolean;
  hasFooter: boolean;
  zebraStriping: boolean;
  mobileLayout: 'scroll' | 'cards' | 'hide-columns';
  // Styling properties
}

interface TableColumn {
  id: string;
  label: string;
  type: 'text' | 'number' | 'currency' | 'boolean' | 'image';
  width?: CSSValue;
  alignment?: 'left' | 'center' | 'right';
  hideOnMobile?: boolean;
}

interface TableRow {
  id: string;
  cells: { [columnId: string]: any };
  backgroundColor?: string;
}
```

**Email Compatibility**: Excellent (native <table> element)

**UI Considerations**:
- Table editor in PropertyPanel can be complex
- Consider modal/popup for table editing
- Visual grid editor with drag-to-resize columns
- Quick actions: Add row, Delete row, Sort rows

---

## Phase 2: EMAIL IMPORTANT Components

**Priority**: 🟡 HIGH
**Status**: 0% Complete
**Time**: 16-24 hours
**Target**: Q2 2026

### 2.1 Social Proof Component
**Status**: ❌ Not Started
**Time**: 4-5 hours

**Use Cases**:
- Customer testimonials
- Review highlights
- Trust badges
- Media mentions

**Requirements**:
- [ ] Quote/testimonial text (rich text)
- [ ] Author name
- [ ] Author title/company
- [ ] Author photo (optional, circular)
- [ ] Star rating (1-5 stars)
- [ ] Company logo (optional)
- [ ] Layout variants:
  - [ ] Quote-first (centered)
  - [ ] Author-first (profile card)
  - [ ] Side-by-side (photo left, quote right)

---

### 2.2 Icon List Component
**Status**: ❌ Not Started
**Time**: 4-5 hours

**Use Cases**:
- Feature lists with icons
- Benefits breakdown
- Step-by-step processes
- Checklist displays

**Requirements**:
- [ ] Array of list items (text + icon)
- [ ] Icon library integration (or image upload)
- [ ] Icon position (left, right, top)
- [ ] Icon size and color controls
- [ ] Text styling per item
- [ ] Spacing between items
- [ ] Numbered variant (1, 2, 3 instead of icons)

**Email Compatibility**:
- ✅ Image-based icons (excellent)
- ⚠️ Icon fonts (limited, Gmail blocks)

---

### 2.3 Columns/Grid Component
**Status**: ❌ Not Started
**Time**: 6-8 hours

**Use Cases**:
- Multi-column layouts
- Feature grids (2x2, 3x3)
- Product grids
- Image galleries

**Requirements**:
- [ ] 2, 3, or 4 column layouts
- [ ] Column content type: text, image, mixed
- [ ] Responsive stacking (columns become rows on mobile)
- [ ] Gap control (spacing between columns)
- [ ] Per-column alignment
- [ ] Email-safe table layout

---

### 2.4 Divider Component (Enhanced Separator)
**Status**: ⏳ Partial (basic Separator exists)
**Time**: 2-3 hours

**Use Cases**:
- Section breaks
- Visual rhythm
- Content separation

**Requirements**:
- [ ] Line style (solid, dashed, dotted, double, gradient)
- [ ] Line thickness
- [ ] Line color
- [ ] Width (full, 50%, 75%, custom)
- [ ] Alignment (left, center, right)
- [ ] Icon in center (optional, e.g., star, diamond)
- [ ] Text in center (optional, e.g., "OR", "• • •")

**Note**: Current Separator component is basic. This enhances it significantly.

---

### 2.5 Progress Bar Component
**Status**: ❌ Not Started
**Time**: 3-4 hours

**Use Cases**:
- Campaign goal tracking
- Donation progress
- Multi-step process indication
- Completion percentage

**Requirements**:
- [ ] Progress percentage (0-100%)
- [ ] Label (optional, "75% to goal!")
- [ ] Bar color (filled portion)
- [ ] Background color (empty portion)
- [ ] Height control
- [ ] Border-radius (rounded or square)
- [ ] Text display options:
  - [ ] Percentage inside bar
  - [ ] Percentage above bar
  - [ ] Custom text above/inside
- [ ] Animated variant (web only, CSS animation)

**Email Compatibility**: Excellent (table-based with colored cells)

---

## Phase 3: WEB-FOCUSED Components (Q3 2026)

**Priority**: 🟢 MEDIUM (deferred for email-first approach)
**Status**: 0% Complete
**Time**: 12-16 hours

### 3.1 Video Component
**Status**: ❌ Not Started
**Time**: 5-6 hours

**Use Cases**:
- Product demo videos
- Testimonial videos
- Tutorial/explainer content

**Requirements**:
- [ ] Video source (YouTube, Vimeo, self-hosted)
- [ ] Poster image (thumbnail with play button)
- [ ] Autoplay controls (web only)
- [ ] Email fallback: Image with link to video landing page

**Email Compatibility**: ❌ Poor (not supported)
- Solution: Render as image + link in email export

---

### 3.2 Accordion Component
**Status**: ❌ Not Started
**Time**: 4-5 hours

**Use Cases**:
- FAQ sections
- Collapsible content
- Long-form content organization

**Requirements**:
- [ ] Multiple accordion items
- [ ] Title and content per item
- [ ] Expand/collapse animation (web only)
- [ ] Open multiple vs. one-at-a-time mode

**Email Compatibility**: ❌ Not supported
- Solution: Render all items expanded in email export

---

### 3.3 Form Component
**Status**: ❌ Not Started
**Time**: 6-8 hours

**Use Cases**:
- Newsletter signup (web)
- Contact forms
- Survey forms
- Registration forms

**Requirements**:
- [ ] Input fields (text, email, phone, textarea)
- [ ] Validation rules
- [ ] Submit button
- [ ] Success/error messages
- [ ] Form action (API endpoint)

**Email Compatibility**: ❌ Limited (Gmail supports AMP forms only)
- Solution: Render as link to web form in email export

---

## Implementation Plan

### Phase 1: EMAIL CRITICAL (20-30 hours)
**Timeline**: Q1 2026
**Priority**: 🔴 CRITICAL

1. **Countdown Timer** (8-10 hours)
   - Week 1-2: Component implementation + image generation
   - Week 2: Email client testing

2. **Product Component** (6-8 hours)
   - Week 3: Component implementation
   - Week 3: E-commerce use case testing

3. **Table Component** (6-8 hours)
   - Week 4: Component implementation + grid editor UI
   - Week 4-5: Complex table testing

**Deliverables**:
- 3 production-ready components
- Email client compatibility verified
- Component Showcase examples
- Documentation with use cases

---

### Phase 2: EMAIL IMPORTANT (16-24 hours)
**Timeline**: Q2 2026
**Priority**: 🟡 HIGH

4. Social Proof Component (4-5 hours)
5. Icon List Component (4-5 hours)
6. Columns/Grid Component (6-8 hours)
7. Divider Component Enhancement (2-3 hours)
8. Progress Bar Component (3-4 hours)

**Deliverables**:
- 5 additional components
- Comprehensive use case examples
- Email + web compatibility testing

---

### Phase 3: WEB-FOCUSED (12-16 hours)
**Timeline**: Q3 2026
**Priority**: 🟢 MEDIUM

9. Video Component (5-6 hours)
10. Accordion Component (4-5 hours)
11. Form Component (6-8 hours)

**Deliverables**:
- 3 web-focused components
- Email fallback strategy documented
- Template type detection (email vs web)

---

## Component Development Checklist

For each component:
- [ ] TypeScript interface in `packages/core/types`
- [ ] Component factory in `packages/core/factories`
- [ ] Component definition in `packages/core/definitions`
- [ ] Component renderer in `packages/ui-solid/renderers`
- [ ] Property panel integration
- [ ] Unit tests (30+ tests per component)
- [ ] Email client compatibility tests
- [ ] Responsive behavior tests
- [ ] Export to HTML validation
- [ ] Component Showcase example
- [ ] Documentation (usage guide + use cases)
- [ ] Accessibility compliance (WCAG 2.1 AA)

---

## Success Criteria

**Phase 1 Complete**:
- [ ] Countdown Timer, Product, Table components fully functional
- [ ] Email compatibility verified in Outlook 2016+, Gmail, Apple Mail
- [ ] E-commerce templates possible with Product component
- [ ] Data tables render correctly in all clients
- [ ] Documentation complete with real-world examples

**Phase 2 Complete**:
- [ ] 5 additional components implemented
- [ ] Common email patterns covered (social proof, features, layouts)
- [ ] Component library expanded to 18+ components

**Phase 3 Complete**:
- [ ] Web-focused components available
- [ ] Email fallback strategy working seamlessly
- [ ] Template type detection (email vs web) functional

---

## Dependencies

- ✅ Core component system (complete)
- ✅ PropertyPanel integration framework (complete)
- ✅ Enhanced property editors (PHASE 0A-0C complete)
- ⏳ Image generation service (needed for Countdown Timer)
- ❌ Icon library integration (needed for Icon List)
- ❌ Template type detection system (needed for Phase 3)

---

## Testing Strategy

### Email Client Testing Matrix
Each component must be tested in:
- ✅ Gmail (web, iOS, Android)
- ✅ Apple Mail (macOS, iOS)
- ✅ Outlook 365 (web)
- ✅ Outlook 2016+ (Windows desktop)
- ⚠️ Outlook 2007-2013 (graceful degradation)
- ✅ Yahoo Mail
- ✅ AOL Mail

### Responsive Testing
- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

### Use Case Testing
- [ ] E-commerce scenarios (Product, Table, Countdown)
- [ ] Marketing campaigns (Social Proof, Progress Bar)
- [ ] Newsletter layouts (Columns, Divider)

---

## Notes

- **Email-First Strategy**: Phase 1-2 components are email-safe
- **Countdown Timer Complexity**: Image generation adds infrastructure requirement
- **Table Editor UX**: Consider dedicated table editor modal (not inline PropertyPanel)
- **Icon Library**: Need to decide: image-based (safe) vs icon fonts (limited)
- **Testing Investment**: Each component requires 2-4 hours of email client testing
- **Component Complexity**: Countdown Timer and Table are most complex (8-10 hours each)

---

_Last Updated: November 17, 2025_
