# Email Builder Translation Framework Analysis

## Overview
The email builder is a monorepo project using SolidJS for the UI layer with a framework-agnostic core. It's designed for building email/newsletter/webpage templates with a plugin-based architecture.

**Key Finding**: There is already a `locale` configuration field in the builder, indicating translation support was planned.

---

## 1. PROJECT ARCHITECTURE

### Packages Structure
```
packages/
├── core/          - Framework-agnostic core logic (factories, builders, services)
├── ui-solid/      - SolidJS UI implementation (main UI components)
├── ui-components/ - Base UI components library
└── tokens/        - Design tokens (colors, typography, spacing)

apps/
└── dev/           - Development sandbox application
```

### Main Entry Point
- **Builder Class**: `/packages/core/builder/Builder.ts`
  - Accepts `BuilderConfig` with `locale: string` field
  - Initializes component registry, template manager, preset manager
  - Exports through `/packages/core/src/index.ts`

- **UI Initialization**: `/apps/dev/src/pages/Builder.tsx`
  - Uses `BuilderProvider` context
  - Renders main UI components (Canvas, Sidebar, Toolbar)

---

## 2. MAIN COMPONENT STRUCTURE

### Page-Level Components (UI Solid Package)

1. **TemplateToolbar** (`/packages/ui-solid/src/toolbar/TemplateToolbar.tsx`)
   - Top toolbar with action buttons
   - **Translatable Elements**:
     - Button labels: "New", "Save", "Load", "Undo", "Redo", "Export", "Preview", "Check", "Test", "Settings", "Test Mode"
     - Tooltips/titles (140+ total translatable strings across all UI)

2. **ComponentPalette** (`/packages/ui-solid/src/sidebar/ComponentPalette.tsx`)
   - Sidebar component list with search and category filtering
   - **Translatable Elements**:
     - Search placeholder: "Search components..."
     - Category filter buttons: "All" (plus dynamic component categories)
     - Empty state messages
     - Component metadata from definitions (name, description)

3. **PropertyPanel** (`/packages/ui-solid/src/sidebar/PropertyPanel.tsx`)
   - Main property editor with 800+ hardcoded label strings
   - **Translatable Elements**:
     - Tab labels: "Content", "Style", "Components", "General Styles"
     - Section headers: "General Settings", "Canvas Dimensions", "Canvas Appearance", "Default Component Styles", "Typography", "Default Link Styles", "Default Button Styles", "Style Presets", "Content", "Styles", "Settings"
     - Property labels (200+ labels across all component types)
     - Placeholders: "Enter button text", "https://example.com", "Company logo", etc.
     - Descriptions: "Canvas width in pixels (email: typically 600px)"
     - Modal titles: "Save Style Preset"
     - Form labels: "Preset Name *", "Description (Optional)"
     - Button labels: "Apply", "Preview", "Save Preset", "Manage", "Cancel"

4. **CanvasSettings** (`/packages/ui-solid/src/sidebar/CanvasSettings.tsx`)
   - Canvas-level configuration with defined settings array
   - **Translatable Elements**:
     - Labels: "Canvas Width", "Max Width", "Background Color", "Enable Responsive Design", etc.
     - Section names: "dimensions", "appearance", "responsive"
     - Descriptions for each setting

5. **TemplateCanvas** (`/packages/ui-solid/src/canvas/TemplateCanvas.tsx`)
   - Renders email template with components
   - Visual feedback system with:
     - Off-screen indicators
     - Property indicators
     - Region highlights
     - Measurement overlays

### Modal Components

1. **NewTemplateModal** - Template creation dialog
2. **TemplatePickerModal** - Template selection
3. **PreviewModal** - Template preview
4. **EmailTestingSettingsModal** - Testing configuration
5. **TestConfigModal** - Test configuration
6. **CompatibilityReportModal** - Compatibility results
7. **PresetManager** - Preset management interface
8. **PresetPreview** - Preset preview dialog

---

## 3. ELEMENT TYPES AND PROPERTIES

### Component Types (Defined in Core)
Located in `/packages/core/components/definitions/`:

#### Base Components
- **Button**: Text, Link URL, Background Color, Text Color, Border Radius, Padding
- **Text**: HTML Content, Font Family, Font Size, Font Weight, Text Color, Text Align
- **Image**: Image URL, Alt Text, Width, Height, Alignment
- **Separator**: Height, Color, Style (Solid/Dashed/Dotted)
- **Spacer**: Height

#### Email Components
- **Header**: Layout, Logo URL, Logo Alt Text, Background Color, Link Colors, Padding
- **Footer**: Copyright Text, Background Color, Text Color, Font Size, Social Icon Color, Padding
- **Hero**: Layout, Image URL, Heading, Description, Button Text, Button URL, Background Color, Heading Color, Heading Size, Content Alignment
- **List**: Orientation, Item Layout, Columns, Background Color, Item Background, Title Color, Title Size
- **Call-to-Action**: Layout, Heading, Description, Primary Button, Secondary Button, Background Color, Heading Color

### Property Definition Structure
Each property has:
- `key`: Dot notation path (e.g., "content.text")
- `label`: Display name (translatable)
- `type`: "text", "number", "color", "select", "radio", "url", "textarea", "richtext"
- `section`: "content", "styles", "settings"
- `placeholder`: Optional input hint (translatable)
- `description`: Optional helper text (translatable)
- `options`: Array with `{ label, value }` pairs (labels translatable)

### Component Metadata
From component definitions:
- `name`: "Button", "Header", "Footer", etc. (translatable)
- `description`: "A clickable button component" (translatable)
- `icon`: Icon class reference
- `category`: ComponentCategory enum
- `tags`: Array of searchable tags

---

## 4. PROPERTY PANEL LABELS (200+ Translatable Strings)

### Canvas Settings Labels
```
Canvas Width, Max Width, Canvas Background, Canvas Border,
Default Component Background, Default Component Border
```

### Typography Labels
```
Body Font Family, Body Font Size, Body Text Color, Body Line Height,
Paragraph Font Size, Paragraph Color, Paragraph Line Height,
H1 Font Size, H1 Color, H1 Weight,
H2 Font Size, H2 Color, H2 Weight,
H3 Font Size, H3 Color, H3 Weight,
Link Color, Link Hover Color,
Button Background, Button Text Color, Button Border Radius, Button Padding
```

### Component Property Labels (button)
```
Button Text, Link URL, Background Color, Text Color, Border Radius, Padding
```

### Component Property Labels (text)
```
Text Content, Font Family, Font Size, Font Weight, Text Color, Text Align
```

### Component Property Labels (image)
```
Image URL, Alt Text, Width, Height, Alignment
```

### And many more... (see PropertyPanel.tsx lines 18-742 for complete list)

### Select/Radio Options (Translatable Labels)
```
Font options: Arial, Georgia, Helvetica, Times New Roman, Verdana
Weight options: Normal, Bold, 300, 400, 500, 600, 700
Alignment options: Left, Center, Right
Style options: Solid, Dashed, Dotted
Layout options: Image Background, Image Left, Image Right, Image Top, etc.
```

---

## 5. TOOLBAR ITEMS (80+ Translatable Strings)

### Button Labels
```
New, Save, Load, Undo, Redo, Export, Preview, Check, Test, Settings, Test Mode
```

### Tooltips/Titles
```
Create new template, Save template, Load template,
Undo, Redo,
Export template, Preview template,
Check Email Compatibility, Test in Email Clients, Email Testing Settings,
Toggle Test Mode (adds test attributes for automation)
```

### Aria Labels
All buttons have `aria-label` attributes for accessibility

---

## 6. MODAL DIALOGS (30+ Translatable Strings)

### Preset Manager Modal
```
Title: "Save Style Preset"
Labels: "Preset Name *", "Description (Optional)"
Buttons: "Save Preset", "Cancel"
```

### Template Picker
```
Modal titles, button labels, filter options
```

### Email Testing Settings
```
Configuration labels, help text, button labels
```

---

## 7. SIDEBAR SECTIONS (50+ Labels)

### General Tab
```
Tab: "Components"
Tab: "General Styles"
Empty states: "Component Palette", "No Template"
Sections: "Canvas Dimensions", "Canvas Appearance", "Default Component Styles", 
          "Typography", "Default Link Styles", "Default Button Styles"
```

### Component Selected Tab
```
Tab: "Content"
Tab: "Style"
Section: "Style Presets"
Buttons: "Apply", "Preview", "Save Preset", "Manage"
```

---

## 8. COMPONENT DEFINITIONS AS TRANSLATION SOURCES

Located in `/packages/core/components/definitions/`:

### base-components.definitions.ts
- Button definition with 3 presets: "Primary", "Secondary", "Success"
- Text, Image, Separator, Spacer definitions

### email-components.definitions.ts
- Header definition with presets: "Centered", "Left Aligned", "With Background"
- Footer, Hero, List, CTA definitions
- Each preset has translatable `name` and `description`

### Each ComponentDefinition includes:
```typescript
{
  type: ComponentType.BUTTON,
  metadata: {
    name: 'Button',           // Translatable
    description: '...',        // Translatable
    icon: 'ri-link',
    category: ComponentCategory.BASE,
    tags: ['button', 'cta', 'action'],
  },
  defaultContent: {...},
  defaultStyles: {...},
  presets: [
    {
      id: 'button-primary',
      name: 'Primary',         // Translatable
      description: '...',      // Translatable
      styles: {...},
      isCustom: false,
    }
  ]
}
```

---

## 9. EXISTING CONFIGURATION & EXTENSION POINTS

### Builder Configuration (Accepts locale)
```typescript
interface BuilderConfig {
  target?: 'email' | 'page';
  locale?: string;  // Already supported!
  storage?: StorageConfig;
  callbacks?: BuilderCallbacks;
  features?: FeatureFlags;
  debug?: boolean;
  customization?: CustomizationConfig;
}
```

### Component Registry
- Location: `/packages/core/components/ComponentRegistry.ts`
- Supports dynamic component registration
- Extensible plugin system for custom components

### Customization System
- Location: `/packages/core/customization/`
- Allows overriding component definitions and behaviors

### Data Injection System
- Location: `/packages/core/data-injection/`
- Variable picker component for dynamic content
- Plugin architecture for custom data sources

---

## 10. CONSUMER USAGE PATTERN

### Typical Usage (from apps/dev)
```typescript
// 1. Initialize Builder with locale config
const builder = new Builder({
  target: 'email',
  locale: 'en-US',  // Future: support other locales
  storage: { method: 'local' },
  callbacks: { onSaveTemplate: handleSave }
});

// 2. Provide to context
<BuilderProvider builder={builder}>
  <Builder />  // Main UI component
</BuilderProvider>

// 3. Use UI Components
<TemplateToolbar {...props} />
<ComponentPalette components={definitions} />
<PropertyPanel selectedComponent={component} />
<TemplateCanvas template={template} />
```

---

## 11. WHERE TRANSLATIONS WILL BE NEEDED

### Priority 1 (Core UI)
1. **PropertyPanel.tsx** (800+ strings)
   - All label definitions in GENERAL_STYLES_DEFINITIONS
   - All label definitions in PROPERTY_DEFINITIONS (per component type)
   - Section headers
   - Placeholder text
   - Description text
   - Button labels

2. **TemplateToolbar.tsx** (30+ strings)
   - Button labels
   - Tooltips/aria-labels
   - Title attributes

3. **ComponentPalette.tsx** (10+ strings)
   - Search placeholder
   - Category filter labels
   - Empty state messages

4. **CanvasSettings.tsx** (20+ strings)
   - Canvas setting labels
   - Descriptions

### Priority 2 (Component Definitions)
1. **base-components.definitions.ts** (50+ strings)
   - Component names
   - Component descriptions
   - Preset names and descriptions

2. **email-components.definitions.ts** (80+ strings)
   - Component names
   - Component descriptions
   - Preset names and descriptions

### Priority 3 (Modal Dialogs)
1. **Modal titles** (10+ strings)
2. **Form labels** (20+ strings)
3. **Button labels** (15+ strings)
4. **Messages** (error, empty state, confirmation)

### Priority 4 (Helper Text)
1. Tooltips and title attributes (140+ total)
2. Aria-labels for accessibility (100+ strings)
3. Placeholder text (60+ strings)
4. Description text (50+ strings)

---

## 12. TOTAL TRANSLATABLE STRING ESTIMATE

- **Property labels**: 800+ (main translation volume)
- **Component metadata**: 200+
- **UI labels & buttons**: 150+
- **Tooltips & aria-labels**: 140+
- **Placeholder text**: 60+
- **Section headers**: 30+
- **Modal content**: 50+
- **Error/empty states**: 20+

**Total**: ~1,500+ user-facing translatable strings

---

## 13. KEY EXTENSION POINTS FOR TRANSLATION FRAMEWORK

### 1. Builder Configuration
```typescript
locale: string;  // Already exists
translations?: Record<string, Record<string, string>>;  // Add this
translationLoader?: (locale: string) => Promise<Record<string, string>>;  // Add this
```

### 2. Property Definitions
Need to externalize labels from object definitions:
```typescript
// Current:
{ label: 'Canvas Width', key: '...' }

// Future:
{ labelKey: 'property.canvas.width', key: '...' }
```

### 3. Component Definition Names
```typescript
metadata: {
  nameKey: 'component.button.name',     // 'Button'
  descriptionKey: 'component.button.desc',  // 'A clickable button...'
  tags: ['button', 'cta', 'action'],
}

presets: [{
  nameKey: 'preset.button.primary.name',  // 'Primary'
  descriptionKey: 'preset.button.primary.desc',
}]
```

### 4. Context for UI Components
```typescript
<LocalizationProvider locale="en-US" messages={translations}>
  <BuilderProvider builder={builder}>
    <App />
  </BuilderProvider>
</LocalizationProvider>
```

### 5. Hook/Helper Functions
```typescript
// In components:
const t = useTranslation();
label = t('property.canvas.width');
```

---

## 14. IMPLEMENTATION RECOMMENDATIONS

### Phase 1: Foundation
1. Create translation key naming convention
2. Extract all hardcoded strings from PropertyPanel.tsx
3. Create translation files structure (en, es, fr, de, pt, ja, zh, etc.)
4. Build translation context and hooks

### Phase 2: Core UI
1. Update PropertyPanel to use translation keys
2. Update TemplateToolbar with translations
3. Update ComponentPalette with translations
4. Create translation loader mechanism

### Phase 3: Component Definitions
1. Create parallel key structure for component definitions
2. Update component registry to support translated metadata
3. Create preset translation system

### Phase 4: Polish
1. Translate error messages and validation text
2. Add RTL language support detection
3. Add translation completeness checker
4. Create translation guide for contributors

---

## 15. CONFIGURATION INITIALIZATION PATTERN

Current builder initialization:
```typescript
const builder = new Builder({
  target: 'email',
  locale: 'en-US',
  storage: { method: 'local' },
  callbacks: { onSaveTemplate: (template) => {...} },
  features: { /* feature flags */ }
});

await builder.initialize();
```

Recommended translation-aware initialization:
```typescript
const translations = await import(`./translations/${locale}.json`);

const builder = new Builder({
  target: 'email',
  locale: 'en-US',
  translations: translations.default,
  // OR
  translationLoader: (locale) => 
    import(`./translations/${locale}.json`)
      .then(m => m.default),
  storage: { method: 'local' },
  callbacks: { onSaveTemplate: (template) => {...} }
});
```

---

## SUMMARY TABLE: Translatable String Locations

| Location | File Path | Count | Type |
|----------|-----------|-------|------|
| Property Panel | `ui-solid/src/sidebar/PropertyPanel.tsx` | 800+ | Labels, placeholders, descriptions |
| Toolbar | `ui-solid/src/toolbar/TemplateToolbar.tsx` | 30+ | Button labels, tooltips |
| Component Palette | `ui-solid/src/sidebar/ComponentPalette.tsx` | 10+ | Search, categories, empty states |
| Canvas Settings | `ui-solid/src/sidebar/CanvasSettings.tsx` | 20+ | Labels, descriptions |
| Component Definitions | `core/components/definitions/*.ts` | 200+ | Names, descriptions, presets |
| Modal Dialogs | `ui-solid/src/modals/*.tsx` + app modals | 50+ | Titles, labels, buttons |
| Visual Feedback | `ui-solid/src/visual-feedback/*.tsx` | 20+ | Indicators, announcements |
| **TOTAL** | | **~1,500+** | |

---

## EXISTING FRAMEWORK INTEGRATION POINTS

1. **Builder.ts** - Already accepts `locale` configuration
2. **TemplateManager** - Template schema includes locale
3. **LocalStorageAdapter** - Can store translations
4. **EventEmitter** - Can emit locale change events
5. **ComponentRegistry** - Extensible registration system
6. **CustomizationSystem** - Allows overrides

All these existing systems can be leveraged to implement the translation framework.
