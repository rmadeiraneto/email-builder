# Next Task: Text Editor Integration (Lexical) - IN PROGRESS

## 📋 Task Overview

Implement Lexical-based rich text editor for Text components. This is a core requirement from REQUIREMENTS.md §2.5.

### **Priority**: MEDIUM 🟡

**Why**: Rich text editing significantly improves content creation capabilities, allowing users to format text directly in the builder.

**Status**: 🔄 IN PROGRESS - Core editor component complete, integration pending
**Estimated Time**: 2-3 hours remaining (6-8 hours total, ~5 hours completed)
**Dependencies**: ✅ PropertyPanel structure + Text component

---

## ✅ What's Done (Session 1)

### RichTextEditor Component Created

**New Files Created:**
- `packages/ui-solid/src/editors/RichTextEditor.tsx` - Main editor component
- `packages/ui-solid/src/editors/RichTextEditor.module.scss` - Editor styles
- `packages/ui-solid/src/editors/RichTextEditor.types.ts` - TypeScript types
- `packages/ui-solid/src/editors/index.ts` - Editor exports

**Lexical Packages Installed:**
- `lexical@0.38.2` - Core Lexical library
- `@lexical/history@0.38.2` - History/undo-redo support
- `@lexical/html@0.38.2` - HTML generation
- `@lexical/link@0.38.2` - Link support
- `@lexical/list@0.38.2` - List support
- `@lexical/rich-text@0.38.2` - Rich text features
- `@lexical/selection@0.38.2` - Selection utilities
- `@lexical/utils@0.38.2` - Utility functions
- `@lexical/react@0.38.2` - React bindings (for reference)

**Features Implemented:**
1. ✅ **Text Formatting** - Bold, Italic, Underline, Strikethrough
2. ✅ **Text Alignment** - Left, Center, Right, Justify
3. ✅ **Block Types** - Paragraph, H1, H2, H3
4. ✅ **Undo/Redo** - Full history support
5. ✅ **Content Persistence** - HTML and editor state (JSON) output
6. ✅ **TypeScript Integration** - Fully typed with strict mode
7. ✅ **SolidJS Integration** - Direct Lexical core API usage (no React wrapper)
8. ✅ **Toolbar UI** - Complete formatting toolbar with Remix Icons
9. ✅ **Responsive Design** - Clean, modern UI with proper styling

**Technical Details:**
- Used Lexical core API directly with SolidJS (no React adapter needed)
- Implemented `registerRichText()` and `registerHistory()` plugins
- Content output: HTML (`content.html`), plain text (`content.plainText`), editor state JSON (`content.editorState`)
- Real-time onChange callback with all three formats
- Toolbar state management with SolidJS signals
- Proper cleanup with `onCleanup()`
- Fixed all TypeScript compilation errors
- Exported from `@email-builder/ui-solid`

**User Experience:**
- Modern toolbar with icon buttons for formatting
- Visual feedback for active formats (highlighted buttons)
- Keyboard shortcuts work (Ctrl+B, Ctrl+I, Ctrl+U, Ctrl+Z, Ctrl+Y)
- Placeholder text support
- Disabled state support
- Smooth transitions and hover effects

---

## 🎯 What's Next (Session 2)

### 1. Integrate RichTextEditor into PropertyPanel ⚠️ **HIGH PRIORITY**

**Task**: Replace the simple textarea in PropertyPanel with RichTextEditor for Text components.

**Files to Modify:**
- `packages/ui-solid/src/sidebar/PropertyPanel.tsx`

**Changes Needed:**
```tsx
// Import RichTextEditor
import { RichTextEditor } from '../editors';

// In the property editor rendering section, replace textarea for text content:
// OLD: <textarea value={content.text} />
// NEW:
<RichTextEditor
  initialHtml={component.content.html}
  initialEditorState={component.content.editorState}
  onChange={(html, editorState, plainText) => {
    onPropertyChange(component.id, 'content.html', html);
    onPropertyChange(component.id, 'content.editorState', editorState);
    onPropertyChange(component.id, 'content.plainText', plainText);
  }}
  placeholder="Enter text content..."
/>
```

**Considerations:**
- Only show RichTextEditor for Text components (ComponentType.TEXT)
- Only show in Content tab, not Style tab
- Remove or update the `content.text` property definition in COMPONENT_PROPERTIES_MAP
- Update to use `content.html`, `content.editorState`, `content.plainText`

### 2. Update Text Component Factory ⚠️ **HIGH PRIORITY**

**Task**: Ensure Text component factory uses the correct property names.

**Files to Modify:**
- `packages/core/components/factories/base-components.factories.ts`

**Current Default Content** (line 294-298 in base-components.definitions.ts):
```ts
defaultContent: {
  type: 'paragraph',
  html: '<p>Enter your text here...</p>',
  plainText: 'Enter your text here...',
}
```

**What to Check:**
- Verify `createText()` factory function uses these property names
- Ensure no references to `content.text` (old property)
- Confirm `content.html`, `content.plainText`, and optional `content.editorState` are properly typed

### 3. Test in Browser ✅ **CRITICAL**

**Tasks:**
1. Start the dev server: `pnpm dev` (from root or apps/dev)
2. Open browser at `http://localhost:3001/`
3. **Add Text Component**:
   - Drag Text component to canvas
   - Verify it renders with default content
4. **Select Text Component**:
   - Click on Text component
   - PropertyPanel should show Content/Style tabs
5. **Test RichTextEditor in Content Tab**:
   - Should see RichTextEditor with toolbar
   - Type some text
   - Try formatting (bold, italic, underline, strikethrough)
   - Try alignment (left, center, right, justify)
   - Try block types (paragraph, h1, h2, h3)
   - Try undo/redo
6. **Verify Content Updates**:
   - Changes should reflect in the canvas immediately
   - Check if HTML is being rendered correctly
7. **Test Save/Load**:
   - Save the template
   - Reload page
   - Load the template
   - Verify text content and formatting are preserved

**Expected Issues to Watch For:**
- ❌ RichTextEditor doesn't appear (import/export issue)
- ❌ Formatting doesn't update canvas (onChange not wired correctly)
- ❌ Content doesn't persist (property names mismatch)
- ❌ TypeScript errors in browser console
- ❌ Styling issues (CSS modules not loading)

### 4. Bug Fixes and Polish (if needed)

**Potential Issues:**
- Editor height too small/large
- Toolbar wrapping on narrow screens
- Selection state not updating toolbar
- Block type changes not working properly
- HTML sanitization needed for security

---

## 📝 Implementation Notes

### Key Architectural Decisions Made

1. **No React Adapter**: Used Lexical core API directly with SolidJS instead of trying to wrap React components
2. **Triple Content Format**: Store HTML (for rendering), editor state (for editing), and plain text (for fallback/email)
3. **Property Names**: Use `content.html`, `content.editorState`, `content.plainText` (as designed in types)
4. **Version Consistency**: All Lexical packages at 0.38.2 (fixed version mismatch issues)
5. **Theme System**: Used CSS modules for styling Lexical editor elements
6. **SolidJS Signals**: Used `createSignal` for toolbar state management

### Deferred Features

These features were deprioritized for the initial implementation:

- **Font Family Selector** - Already available in Style tab
- **Font Color Picker** - Already available in Style tab
- **Font Size Control** - Already available in Style tab
- **Line Height Control** - Already available in Style tab
- **Link Insertion/Editing** - Can be added later (basic Lexical setup done)
- **Lists (ul/ol)** - Can be added later (ListNode already registered)

The Style tab already handles typography styling, so the editor focuses on content and inline formatting.

---

## 🐛 Known Issues

### Fixed Issues

1. ✅ **Lexical Version Mismatch** - Fixed by updating `lexical` to 0.38.2
2. ✅ **Missing @lexical/history** - Added to dependencies
3. ✅ **TypeScript exactOptionalPropertyTypes** - Fixed theme properties with `|| ''`
4. ✅ **BaseSelection.hasFormat** - Fixed by checking `$isRangeSelection()` first
5. ✅ **Null editor assertions** - Fixed with `editor!` assertions

### Outstanding Issues

None in the RichTextEditor component itself. Integration issues will be discovered during testing.

---

## 🚀 Next Session Checklist

Start the next session by:

1. ✅ Check this file (NEXT_TASK.md)
2. ⬜ Integrate RichTextEditor into PropertyPanel
3. ⬜ Verify Text component factory property names
4. ⬜ Start dev server and test in browser
5. ⬜ Fix any bugs discovered during testing
6. ⬜ Update TODO.md to mark Text Editor Integration as complete
7. ⬜ Update NEXT_TASK.md with next priority (Preview Modes or Custom Components)

---

## 📊 Progress Summary

**Text Editor Integration: ~65% Complete** 🔵🔵🔵🔵🔵🔵⚪⚪⚪⚪

**Phase 1: Core Editor** ✅ COMPLETE (5 hours)
- Lexical packages installed and configured
- RichTextEditor component built with full formatting toolbar
- TypeScript errors fixed
- Exported from ui-solid package

**Phase 2: Integration** 🔄 NEXT (2-3 hours)
- PropertyPanel integration
- Text component factory verification
- Browser testing and bug fixes
- Polish and refinement

**Phase 3: Future Enhancements** ⏸️ DEFERRED
- Link insertion/editing UI
- List support (ul/ol) UI
- Image insertion
- Tables
- Advanced formatting options

---

## 🎓 What I Learned

**Lexical Integration with SolidJS:**
- Lexical's React bindings don't work with Solid - use core API directly
- `registerRichText()` and `registerHistory()` are framework-agnostic
- Lexical uses $-prefixed functions for editor state mutations
- `$isRangeSelection()` type guard is essential for selection operations

**SolidJS Patterns:**
- `onMount` and `onCleanup` for editor lifecycle
- `createSignal` for toolbar state
- Editor ref with `let editorRef: HTMLDivElement | undefined`

**Version Management:**
- All Lexical packages must be the same version to avoid type conflicts
- Use exact versions (0.38.2) not ranges (^0.38.1) for peer dependencies

---

## 📚 Resources

- [Lexical Documentation](https://lexical.dev/)
- [Lexical GitHub](https://github.com/facebook/lexical)
- [SolidJS Documentation](https://www.solidjs.com/)
- [Remix Icons](https://remixicon.com/) (used for toolbar icons)

---

**Last Updated**: 2025-11-03 (Session 1 Complete)
**Next Update**: After PropertyPanel integration and browser testing
