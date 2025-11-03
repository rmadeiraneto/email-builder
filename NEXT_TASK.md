# Next Task: General Styles Tab

## 📋 Task Overview

Implement Components/General Styles tabs in the PropertyPanel when no component is selected. This is a core requirement from REQUIREMENTS.md §2.4.2.

### **Priority**: HIGH 🔴

**Why**: Provides users with centralized control over canvas-level settings and default styles, improving template consistency and customization capabilities.

**Status**: ✅ COMPLETE - General Styles Tab Fully Functional
**Estimated Time**: 0 hours remaining - Implementation complete
**Dependencies**: ✅ PropertyPanel structure + Tab navigation + Template state management

---

## ✅ What's Done

### Implementation Complete

**Files Modified:**
- `packages/ui-solid/src/sidebar/PropertyPanel.tsx` - Added General Styles definitions and UI
- `packages/ui-solid/src/sidebar/PropertyPanel.types.ts` - Added template and onGeneralStyleChange props
- `apps/dev/src/pages/Builder.tsx` - Integrated PropertyPanel with template and removed separate CanvasSettings

**Features Implemented:**
1. ✅ Dual-mode tab system:
   - Component selected: Content/Style tabs
   - No component selected: Components/General Styles tabs
2. ✅ Components Tab - Shows informative message directing users to component palette
3. ✅ General Styles Tab with comprehensive controls:
   - Canvas Dimensions (width, max width)
   - Canvas Appearance (background color, border)
   - Default Component Styles (background, border)
   - Typography (body, paragraph, H1, H2, H3)
   - Default Link Styles (color, hover color)
   - Default Button Styles (background, text color, radius, padding)
4. ✅ Grouped property sections for better organization
5. ✅ Template-aware rendering with proper fallback states
6. ✅ Full TypeScript type safety
7. ✅ Integrated with existing Canvas Settings functionality

**Technical Details:**
- Added `GENERAL_STYLES_DEFINITIONS` array with 30+ style properties
- Tab states: `ComponentTabType = 'content' | 'style'` and `GeneralTabType = 'components' | 'general-styles'`
- New props: `template?: Template | null` and `onGeneralStyleChange?: (property: string, value: any) => void`
- Property grouping by category: dimensions, canvasAppearance, defaultComponents, typography, links, buttons
- Reused existing property editor components for consistency
- Properly handles nested property paths (e.g., `generalStyles.typography.heading1.styles.fontSize`)
- Connected to `updateCanvasSetting` action in BuilderContext

**User Experience:**
- When no component selected, see "General Settings" header with two tabs
- Components tab shows helpful guidance
- General Styles tab shows organized sections:
  - Canvas Dimensions
  - Canvas Appearance
  - Default Component Styles
  - Typography (all heading levels + body/paragraph)
  - Default Link Styles
  - Default Button Styles
- Tab switches instantly with reactive updates
- All changes immediately update the template
- Consistent UI with component property editing

**Dev Server Status:**
- ✅ Running successfully at http://localhost:3001/
- ✅ HMR updates working correctly
- ✅ No TypeScript errors in PropertyPanel
- ⚠️ Pre-existing TypeScript errors in PresetManager/PresetPreview (not related to this change)

---

## 🎯 What's Next

The next priority tasks from TODO.md are:

### 1. Text Editor Integration (Lexical) (Medium Priority)
**REQUIREMENTS.md §2.5** - Integrate Lexical editor for rich text editing:
- Toolbar features: Bold, Italic, Underline, Strikethrough
- Text alignment and style (paragraph, h1, h2, h3)
- Font family, color, size, line height
- Link insertion/editing
- Undo/Redo integration with Builder

### 2. Preview Modes (Medium Priority)
**REQUIREMENTS.md §2.7** - Create preview functionality:
- Web Preview: Desktop browser simulation
- Mobile Preview: Mobile device simulation
- Email Preview: Email client simulation
- Toggle between preview modes

### 3. Custom Components (Low Priority)
**REQUIREMENTS.md §2.2.3** - Custom component builder:
- Create custom component UI
- Save/load custom components
- Display in palette
- Component composition support

### 4. Data Injection (Low Priority)
**REQUIREMENTS.md §2.8** - External data source integration:
- Placeholder system for dynamic content
- Support for individual fields, events, orders, lists
- Data binding UI

---

## 📝 Testing Checklist

✅ **Completed Testing:**
- [x] Tab switching works for both modes (component/general)
- [x] Components tab shows proper guidance
- [x] General Styles tab shows all property sections
- [x] Canvas dimensions can be edited
- [x] Canvas appearance settings work
- [x] Typography controls update properly
- [x] Link and button default styles are editable
- [x] No console errors or warnings
- [x] HMR updates work correctly
- [x] TypeScript compiles without errors in PropertyPanel
- [x] Removed separate CanvasSettings component successfully

---

## 🚀 Recommendation

**Next Task: Text Editor Integration (Lexical)**

This is a high-impact feature that will significantly improve content editing capabilities. It involves:
1. Installing and configuring Lexical
2. Creating a rich text editor component
3. Implementing toolbar with formatting options
4. Integrating with PropertyPanel Content tab
5. Handling state management and undo/redo

**Estimated Time**: 6-8 hours
**Complexity**: High (new library integration)
**Impact**: Very High (core content editing feature)

Alternatively, **Preview Modes** (4-5 hours, Medium complexity) could be a good next step to allow users to see how their templates will look on different devices.

---

## 📊 Progress Summary

**Phase 7 Complete** ✅ - Template Builder UI with core features
**Style Presets System** ✅ - All 11 features complete
**Content/Style Tabs** ✅ - Tab navigation implemented for components
**General Styles Tab** ✅ - Canvas and default styles fully editable

**Next Up**: Text Editor Integration → Preview Modes → Custom Components → Data Injection
