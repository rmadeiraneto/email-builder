# Next Task: AI Agent Testing Infrastructure - Phase 1# Next Task: TypeScript Strict Mode Compliance 🎯



**Status**: Ready to Start  ## 📋 Current Status

**Priority**: High  

**Estimated Time**: 3-4 hours  ### 🎯 **ACTIVE TASK** - TypeScript Strict Mode Compliance

**Date**: November 6, 2025**Priority**: HIGH 🟡

**Status**: Phase 1 Complete (Critical Fixes), Phase 2 Pending

## 🎯 Goal**Started**: 2025-11-05

**Estimated Time**: 2-4 hours remaining

Implement the foundation for AI agent testable UI by creating a test mode system that conditionally adds testing attributes without polluting production HTML or impacting performance.**Branch**: `dev`



## 📋 What We're Building### ✅ **RECENTLY COMPLETED** - TypeScript Strict Mode Compliance Fixes (Nov 6, 2025)

**Status**: ✅ Major Type Safety Issues Resolved

### Phase 1: Test Mode Infrastructure**Time Spent**: ~2 hours

**Achievement**: Fixed BaseStyles type definitions, component definitions, and service implementations

We need to create three core pieces:

**What Was Delivered**:

1. **TestModeManager** - Singleton service to manage test mode state

2. **Test Attribute Helpers** - Utility functions for conditional test attributes  1. ✅ **BaseStyles Type Definition Extensions** (packages/core/types/component.types.ts):

3. **Test API** - Programmatic interface for state inspection during tests   - Added typography properties: `textAlign`, `lineHeight`

   - Added component styling: `variant`

## 🔨 Implementation Steps   - Added Footer component properties: `socialIconSize`, `socialIconGap`, `socialIconColor`, `socialIconHoverColor`

   - Added Email component properties: `contentMaxWidth`, `contentAlign`

### Step 1: Create TestModeManager (45-60 minutes)   - Added CTA component: `buttonGap`

   - Added List component: `itemPadding`, `imageMaxWidth`, `imageMaxHeight`

**File**: `packages/core/config/TestModeManager.ts`   - Added interaction states: `hoverBackgroundColor`, `hoverColor`, `linkHoverColor`

   - Added navigation properties: `navigationGap`, `sectionGap`

```typescript   - Added linkStyles configuration: `fontSize`, `fontWeight`

/**

 * Manages test mode state for conditional test attribute injection2. ✅ **Component Definition Fixes**:

 *    - Fixed List component: `itemBackgroundColor` → `backgroundColor`

 * Test mode allows automated testing tools (AI agents, Playwright, etc.)   - Fixed lineHeight: Changed from `CSSValue` with empty unit to string value

 * to identify and interact with UI elements without polluting production HTML.

 */3. ✅ **EmailExportService.ts Type Safety**:

class TestModeManager {   - Added null checks for regex match groups (could be undefined)

  private static instance: TestModeManager;   - Fixed `string | undefined` type issues with proper guards

  private _enabled: boolean = false;

  private callbacks: Array<(enabled: boolean) => void> = [];4. ✅ **TemplateComposer.ts Type Safety**:

   - Added null check for `baseTemplate`

  /**   - Added proper type checking for TypographyPreset values

   * Get singleton instance   - Fixed optional chaining for `preferredTemplate.generalStyles`

   */

  static getInstance(): TestModeManager {5. ✅ **TemplateExporter.ts Type Safety**:

    if (!TestModeManager.instance) {   - Added fallback for `map[char]` lookup (could return undefined)

      TestModeManager.instance = new TestModeManager();

    }6. ✅ **TemplateManager.ts Cleanup**:

    return TestModeManager.instance;   - Removed explicit `componentTree: undefined` (incompatible with exactOptionalPropertyTypes)

  }   - Removed unused registry instance variable

   - Added proper validation for version number parsing

  /**

   * Enable test mode7. ✅ **EventEmitter.ts Enhancement**:

   * - Adds data-test-mode="true" to document root   - Updated `off()` method to support removing specific listeners

   * - Persists preference to localStorage

   * - Notifies all listeners8. ✅ **TemplateValidator.ts Cleanup**:

   */   - Removed unused imports (BaseComponent, ValidationResult)

  enable(): void {

    this._enabled = true;**Previous Session (Nov 5, 2025)**:

    

    if (typeof document !== 'undefined') {1. ✅ **Fixed Duplicate `EmailClient` Export Conflict**:

      document.documentElement.setAttribute('data-test-mode', 'true');   - **Problem**: Both compatibility and email-testing modules exported `EmailClient`

    }   - **Solution**: Renamed compatibility module's type to `EmailClientId`

       - **Rationale**: More semantic - represents IDs (strings) not objects (interfaces)

    if (typeof localStorage !== 'undefined') {   - **Impact**: Eliminates TS2308 module export ambiguity error

      localStorage.setItem('test-mode-enabled', 'true');   - **Files Changed**:

    }     * `packages/core/compatibility/compatibility.types.ts` - Type renamed

         * `packages/core/compatibility/CompatibilityService.ts` - All references updated

    this.notifyCallbacks();     * `packages/core/compatibility/index.ts` - Export updated

  }

2. ✅ **Fixed `BaseComponent` Property Access Errors**:

  /**   - **Problem**: CompatibilityChecker accessed non-existent `component.props`

   * Disable test mode   - **Solution**: Changed to `component.content` (actual BaseComponent interface property)

   * - Removes data-test-mode attribute   - **Impact**: Eliminates 3 TS2339 property does not exist errors

   * - Persists preference to localStorage   - **Methods Fixed**:

   * - Notifies all listeners     * `checkImage()` - line 371

   */     * `checkAccessibility()` - line 441

  disable(): void {     * `checkContent()` - line 465

    this._enabled = false;   - **Files Changed**: `packages/core/compatibility/CompatibilityChecker.ts`

    

    if (typeof document !== 'undefined') {**Development Environment**:

      document.documentElement.removeAttribute('data-test-mode');- Dev server runs successfully on http://localhost:3001

    }- SCSS compilation works (only Sass deprecation warnings, non-blocking)

    - No build-breaking errors

    if (typeof localStorage !== 'undefined') {

      localStorage.setItem('test-mode-enabled', 'false');**Commit**: `fix(core): resolve TypeScript strict mode compliance issues` (pending)

    }

    ---

    this.notifyCallbacks();

  }## 🚀 Current Task: Phase 2 - Complete TypeScript Strict Mode Compliance



  /**### 📋 Overview

   * Toggle test mode on/off

   */**Goal**: Resolve all remaining TypeScript strict mode errors to achieve 100% type safety across the codebase.

  toggle(): void {

    if (this._enabled) {**Why This Matters**:

      this.disable();- ✅ **Type Safety**: Catch errors at compile-time, not runtime

    } else {- ✅ **Developer Experience**: Better IDE autocomplete and refactoring

      this.enable();- ✅ **Production Readiness**: Required for production builds

    }- ✅ **Code Quality**: Enforces explicit type definitions

  }- ✅ **Maintainability**: Easier to understand and modify code



  /****Current Status**: ~150 TypeScript errors remaining (pre-existing, not introduced by recent work)

   * Check if test mode is currently enabled**Estimated Time**: 2-4 hours

   */

  isEnabled(): boolean {---

    return this._enabled;

  }### Priority 1: Fix Component Definition Type Errors (1-2 hours) 🔧



  /****Goal**: Resolve `exactOptionalPropertyTypes` and content type compatibility issues

   * Subscribe to test mode changes

   * @param callback - Function called when test mode changes**Error Categories**:

   * @returns Unsubscribe function1. **Content Type Compatibility** (~40 errors)

   */   - Issue: Component-specific content types don't satisfy `Record<string, unknown>`

  onChange(callback: (enabled: boolean) => void): () => void {   - Affected: ButtonComponent, TextComponent, ImageComponent, SeparatorComponent, SpacerComponent, HeaderComponent, FooterComponent, HeroComponent, ListComponent, CTAComponent

    this.callbacks.push(callback);   - Solution: Add index signature to content types OR use type assertions

    

    // Return unsubscribe function2. **ValidationResult Return Types** (~10 errors)

    return () => {   - Issue: Validation functions return `{ valid: boolean; errors: string[] | undefined }`

      const index = this.callbacks.indexOf(callback);   - Expected: `ValidationResult` with `errors: string[]` (no undefined)

      if (index > -1) {   - Solution: Return `errors: []` instead of `undefined`

        this.callbacks.splice(index, 1);

      }**Tasks**:

    };

  }1. **Fix Content Type Definitions** (45 min)

   ```typescript

  /**   // Option 1: Add index signature to all content types

   * Load test mode preference from localStorage   export interface ButtonContent {

   */     text: string;

  loadPreference(): void {     link: string;

    if (typeof localStorage === 'undefined') return;     [key: string]: unknown; // Add this line

       }

    const stored = localStorage.getItem('test-mode-enabled');

    if (stored === 'true') {   // Option 2: Use type assertion in factory (less ideal)

      this.enable();   validate: (component: BaseComponent) => {

    }     const typed = component as ButtonComponent;

  }     // ...

   }

  /**   ```

   * Initialize test mode based on environment

   * - Checks import.meta.env.MODE2. **Fix ValidationResult Return Types** (30 min)

   * - Checks localStorage preference   - Update all validate functions to return `errors: []` not `undefined`

   */   - Ensure consistent return type across all component definitions

  initialize(): void {   - Files to update:

    // Auto-enable in test environment     * `packages/core/components/definitions/base-components.definitions.ts`

    if (typeof import.meta !== 'undefined' && import.meta.env?.MODE === 'test') {     * `packages/core/components/definitions/email-components.definitions.ts`

      this.enable();

      return;3. **Test Changes** (15 min)

    }   - Run `pnpm typecheck` to verify fixes

       - Ensure no new errors introduced

    // Load saved preference

    this.loadPreference();---

  }

### Priority 2: Extend BaseStyles Interface (30-45 min) 🎨

  private notifyCallbacks(): void {

    this.callbacks.forEach(callback => callback(this._enabled));**Goal**: Add missing properties that are currently used in component definitions

  }

}**Missing Properties**:

1. **fontFamily** (used in Button and Text components)

// Export singleton instance   - Error: `TS2353: Object literal may only specify known properties`

export const TestMode = TestModeManager.getInstance();   - Location: `base-components.definitions.ts` lines 65, 300

```

2. **objectFit** (used in Image component)

**File**: `packages/core/config/index.ts`   - Error: `TS2353: Object literal may only specify known properties`

   - Location: `base-components.definitions.ts` line 430

```typescript

// Add to existing exports3. **linkStyles** (used in Header component)

export { TestMode } from './TestModeManager';   - Error: `TS2353: Object literal may only specify known properties`

```   - Location: `email-components.definitions.ts` line 53



**Tests**: `packages/core/config/TestModeManager.test.ts`4. **textStyles** (used in Footer component)

   - Error: `TS2353: Object literal may only specify known properties`

```typescript   - Location: `email-components.definitions.ts` line 162

import { describe, it, expect, beforeEach, vi } from 'vitest';

import { TestMode } from './TestModeManager';**Tasks**:



describe('TestModeManager', () => {1. **Update BaseStyles Interface** (20 min)

  beforeEach(() => {   - File: `packages/core/types/component.types.ts`

    // Reset test mode before each test   - Add missing properties with appropriate types:

    TestMode.disable();     ```typescript

    localStorage.clear();     export interface BaseStyles {

  });       // ... existing properties ...

       fontFamily?: string;

  describe('enable/disable', () => {       objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';

    it('should enable test mode', () => {       linkStyles?: {

      TestMode.enable();         color?: string;

      expect(TestMode.isEnabled()).toBe(true);         textDecoration?: string;

    });         hover?: {

           color?: string;

    it('should disable test mode', () => {           textDecoration?: string;

      TestMode.enable();         };

      TestMode.disable();       };

      expect(TestMode.isEnabled()).toBe(false);       textStyles?: {

    });         fontSize?: string;

         lineHeight?: string;

    it('should add data-test-mode attribute when enabled', () => {         color?: string;

      TestMode.enable();       };

      expect(document.documentElement.getAttribute('data-test-mode')).toBe('true');     }

    });     ```



    it('should remove data-test-mode attribute when disabled', () => {2. **Verify Usage** (15 min)

      TestMode.enable();   - Check all usages of these properties in component definitions

      TestMode.disable();   - Ensure types match actual usage patterns

      expect(document.documentElement.hasAttribute('data-test-mode')).toBe(false);   - Run `pnpm typecheck` to verify fixes

    });

---

    it('should persist preference to localStorage', () => {

      TestMode.enable();### Priority 3: Fix CompatibilityChecker Property Access (30-45 min) 🔍

      expect(localStorage.getItem('test-mode-enabled')).toBe('true');

      **Goal**: Fix property access from index signatures using bracket notation

      TestMode.disable();

      expect(localStorage.getItem('test-mode-enabled')).toBe('false');**Error Pattern**:

    });- Error: `TS4111: Property 'X' comes from an index signature, so it must be accessed with ['X']`

  });- Affected: ~15 property accesses in CompatibilityChecker



  describe('toggle', () => {**Tasks**:

    it('should toggle test mode on', () => {

      TestMode.toggle();1. **Fix Property Access Syntax** (30 min)

      expect(TestMode.isEnabled()).toBe(true);   - File: `packages/core/compatibility/CompatibilityChecker.ts`

    });   - Change dot notation to bracket notation:

     ```typescript

    it('should toggle test mode off', () => {     // Before

      TestMode.enable();     if (!props.alt || props.alt.trim() === '') { }

      TestMode.toggle();

      expect(TestMode.isEnabled()).toBe(false);     // After

    });     if (!props['alt'] || (typeof props['alt'] === 'string' && props['alt'].trim() === '')) { }

  });     ```

   - Add type guards for string methods:

  describe('onChange', () => {     * Line 374: `props.alt` → `props['alt']` with type check

    it('should notify callbacks when test mode changes', () => {     * Line 389: `props.width` → `props['width']`

      const callback = vi.fn();     * Line 403: `props.height` → `props['height']`

      TestMode.onChange(callback);     * Line 418: `props.src` → `props['src']` with type check

           * Line 444: `props.text` and `props.children`

      TestMode.enable();     * Line 468: `props.content`

      expect(callback).toHaveBeenCalledWith(true);

      2. **Add Type Guards** (15 min)

      TestMode.disable();   - Create helper function for type-safe property access:

      expect(callback).toHaveBeenCalledWith(false);     ```typescript

    });     private getStringProp(obj: Record<string, unknown>, key: string): string | undefined {

       const value = obj[key];

    it('should allow unsubscribing', () => {       return typeof value === 'string' ? value : undefined;

      const callback = vi.fn();     }

      const unsubscribe = TestMode.onChange(callback);     ```

      

      unsubscribe();---

      TestMode.enable();

      ### Priority 4: Fix Template-Related Type Errors (30-45 min) 📄

      expect(callback).not.toHaveBeenCalled();

    });**Goal**: Resolve template metadata and utility type errors

  });

**Error Categories**:

  describe('loadPreference', () => {1. **Template Metadata Optional Properties** (~5 errors)

    it('should load enabled preference from localStorage', () => {   - Issue: `Type 'string | undefined' is not assignable to type 'string'`

      localStorage.setItem('test-mode-enabled', 'true');   - Files: TemplateComposer.ts, TemplateManager.ts, TemplateStorage.ts

      TestMode.loadPreference();

      expect(TestMode.isEnabled()).toBe(true);2. **Template Utility Errors** (~10 errors)

    });   - Possibly undefined template access

   - Missing property checks

    it('should not enable if localStorage has false', () => {

      localStorage.setItem('test-mode-enabled', 'false');**Tasks**:

      TestMode.loadPreference();

      expect(TestMode.isEnabled()).toBe(false);1. **Fix Template Metadata** (20 min)

    });   - Add proper undefined handling or update interface to allow undefined

  });   - Use nullish coalescing operator where appropriate

});

```2. **Add Null Checks** (15 min)

   - Add guards for potentially undefined templates

### Step 2: Create Test Attribute Helpers (45-60 minutes)   - Fix property access chains



**File**: `packages/core/utils/testAttributes.ts`3. **Test Changes** (10 min)

   - Run `pnpm typecheck`

```typescript   - Verify template operations still work

import { TestMode } from '../config/TestModeManager';

---

/**

 * Get test ID attribute if test mode is enabled### Priority 5: Fix EmailExportService Warnings (15-20 min) ⚠️

 * 

 * @param id - Unique test identifier (e.g., 'button-primary-save', 'panel-properties')**Goal**: Clean up unused variable warnings

 * @returns Object with data-testid attribute or empty object

 * **Warnings**:

 * @example- Line 329: `match` and `styleAttr` declared but never read

 * ```tsx- Line 374: `match` declared but never read

 * <button {...getTestId('button-save')}>Save</button>- Line 416: `match` declared but never read

 * // When test mode enabled: <button data-testid="button-save">Save</button>- Line 425: Property access issue with `width`

 * // When test mode disabled: <button>Save</button>

 * ```**Tasks**:

 */

export function getTestId(id: string): { 'data-testid'?: string } {1. **Remove Unused Variables** (10 min)

  if (!id) return {};   - Remove or prefix with underscore: `_match`, `_styleAttr`

  return TestMode.isEnabled() ? { 'data-testid': id } : {};

}2. **Fix Property Access** (5 min)

   - Line 425: Use bracket notation for `width` property

/**

 * Get action attribute if test mode is enabled---

 * 

 * @param action - Action identifier (e.g., 'save-template', 'delete-component')## ✅ Success Criteria

 * @returns Object with data-action attribute or empty object

 * After completing this task, the codebase should:

 * @example- ✅ Pass `pnpm typecheck` with ZERO errors

 * ```tsx- ✅ Maintain full TypeScript strict mode compliance

 * <button {...getTestAction('save-template')}>Save</button>- ✅ Have proper type safety across all modules

 * // When test mode enabled: <button data-action="save-template">Save</button>- ✅ Be production-build ready

 * ```- ✅ Have consistent type patterns throughout

 */

export function getTestAction(action: string): { 'data-action'?: string } {---

  if (!action) return {};

  return TestMode.isEnabled() ? { 'data-action': action } : {};## 🔄 Progress Tracking

}

**Phase 1: Critical Fixes** ✅ 100% Complete (Nov 5, 2025)

/**- Duplicate EmailClient export: ✅ DONE

 * Get state attributes if test mode is enabled- BaseComponent.props access: ✅ DONE

 * - Dev server verification: ✅ DONE

 * @param state - State object with boolean/string/number values

 * @returns Object with data-state-* attributes or empty object**Phase 2: Remaining Type Errors** ⬜ 0% Complete

 * - Component definition errors: ⬜ Not Started (~40 errors)

 * @example- BaseStyles extensions: ⬜ Not Started (~4 errors)

 * ```tsx- CompatibilityChecker property access: ⬜ Not Started (~15 errors)

 * <div {...getTestState({ loading: true, modified: false, count: 5 })}>- Template-related errors: ⬜ Not Started (~15 errors)

 *   Content- EmailExportService warnings: ⬜ Not Started (~5 warnings)

 * </div>

 * // When test mode enabled:**Total Progress**: 10% (2 critical issues resolved, ~150 errors remaining)

 * // <div data-state-loading="true" data-state-modified="false" data-state-count="5">

 * ```---

 */

export function getTestState(state: Record<string, any>): Record<string, string> {## 📊 Error Breakdown

  if (!TestMode.isEnabled()) return {};

  ### By File:

  return Object.entries(state).reduce((acc, [key, value]) => {1. **base-components.definitions.ts**: ~30 errors

    acc[`data-state-${key}`] = String(value);2. **email-components.definitions.ts**: ~25 errors

    return acc;3. **CompatibilityChecker.ts**: ~15 errors

  }, {} as Record<string, string>);4. **Template files**: ~15 errors

}5. **EmailExportService.ts**: ~5 warnings

6. **Other files**: ~10 errors

/**

 * Get all test attributes at once### By Category:

 * 1. **exactOptionalPropertyTypes**: ~40 errors

 * @param attrs - Object with testId, action, and/or state2. **Missing BaseStyles properties**: ~4 errors

 * @returns Combined test attributes or empty object3. **Index signature access**: ~15 errors

 * 4. **Template undefined handling**: ~15 errors

 * @example5. **Unused variables**: ~5 warnings

 * ```tsx6. **Other type mismatches**: ~10 errors

 * <button

 *   {...getTestAttributes({---

 *     testId: 'button-save',

 *     action: 'save-template',## 🚀 Next Steps After TypeScript Compliance

 *     state: { disabled: false, loading: true }

 *   })}After completing TypeScript strict mode compliance, recommended next priorities are:

 * >

 *   Save### Option 1: User Experience Testing (2-3 hours)

 * </button>**Why**: Validate current features work smoothly with proper type safety

 * ```- Interactive testing (drag-and-drop, modals, keyboard shortcuts)

 */- Visual feedback & UI polish

export function getTestAttributes(attrs: {- Accessibility testing

  testId?: string;- Performance validation

  action?: string;

  state?: Record<string, any>;### Option 2: Production Build Configuration (1-2 hours)

}): Record<string, string> {**Why**: Prepare for deployment

  if (!TestMode.isEnabled()) return {};- Re-enable DTS plugin

  - Optimize bundle sizes

  return {- Configure CI/CD type checking

    ...getTestId(attrs.testId || ''),- Add pre-commit type check hooks

    ...getTestAction(attrs.action || ''),

    ...getTestState(attrs.state || {})### Option 3: Continue Development on Next Feature

  };**Why**: Build on solid type-safe foundation

}- Custom Components system

```- Theme system implementation

- Advanced canvas features

**File**: `packages/core/utils/index.ts`

---

```typescript

// Add to existing exports## 📝 Development Notes

export {

  getTestId,### Key Decisions

  getTestAction,

  getTestState,**Why Fix Types Now?**

  getTestAttributes- Blocks production builds

} from './testAttributes';- Catches runtime errors at compile-time

```- Improves developer experience

- Establishes code quality baseline

**Tests**: `packages/core/utils/testAttributes.test.ts`

**Type Safety vs Speed?**

```typescript- Choose type safety - pays dividends long-term

import { describe, it, expect, beforeEach } from 'vitest';- Strict mode catches subtle bugs

import { TestMode } from '../config/TestModeManager';- Better IDE support and refactoring

import { getTestId, getTestAction, getTestState, getTestAttributes } from './testAttributes';

**Approach for Content Types**

describe('testAttributes', () => {- Prefer index signatures for flexibility

  beforeEach(() => {- Allows future property additions

    TestMode.disable();- Maintains backward compatibility

  });

### Technical Debt Addressed

  describe('getTestId', () => {- ✅ Duplicate export naming conflict

    it('should return empty object when test mode is disabled', () => {- ✅ Incorrect BaseComponent API usage

      expect(getTestId('button-save')).toEqual({});- 🔄 Component type system cleanup (in progress)

    });- 🔄 Strict mode compliance (in progress)



    it('should return data-testid when test mode is enabled', () => {---

      TestMode.enable();

      expect(getTestId('button-save')).toEqual({ 'data-testid': 'button-save' });## 📚 Resources

    });

- [TypeScript exactOptionalPropertyTypes](https://www.typescriptlang.org/tsconfig#exactOptionalPropertyTypes)

    it('should return empty object for empty string', () => {- [TypeScript Index Signatures](https://www.typescriptlang.org/docs/handbook/2/objects.html#index-signatures)

      TestMode.enable();- [TypeScript Type Guards](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)

      expect(getTestId('')).toEqual({});- [TypeScript Strict Mode](https://www.typescriptlang.org/tsconfig#strict)

    });

  });---



  describe('getTestAction', () => {**Last Updated**: 2025-11-05

    it('should return empty object when test mode is disabled', () => {**Status**: 🔧 Phase 1 Complete (Critical Fixes), Phase 2 Ready to Start

      expect(getTestAction('save-template')).toEqual({});**Previous Milestone**: ✅ Design Token Integration (100% Complete)

    });**Next Milestone**: TypeScript Strict Mode Compliance → Custom Components system


    it('should return data-action when test mode is enabled', () => {
      TestMode.enable();
      expect(getTestAction('save-template')).toEqual({ 'data-action': 'save-template' });
    });
  });

  describe('getTestState', () => {
    it('should return empty object when test mode is disabled', () => {
      expect(getTestState({ loading: true })).toEqual({});
    });

    it('should convert state to data-state-* attributes', () => {
      TestMode.enable();
      const result = getTestState({ loading: true, modified: false, count: 5 });
      
      expect(result).toEqual({
        'data-state-loading': 'true',
        'data-state-modified': 'false',
        'data-state-count': '5'
      });
    });
  });

  describe('getTestAttributes', () => {
    it('should return empty object when test mode is disabled', () => {
      const result = getTestAttributes({
        testId: 'button-save',
        action: 'save-template',
        state: { loading: true }
      });
      
      expect(result).toEqual({});
    });

    it('should combine all attributes when test mode is enabled', () => {
      TestMode.enable();
      const result = getTestAttributes({
        testId: 'button-save',
        action: 'save-template',
        state: { loading: true, modified: false }
      });
      
      expect(result).toEqual({
        'data-testid': 'button-save',
        'data-action': 'save-template',
        'data-state-loading': 'true',
        'data-state-modified': 'false'
      });
    });
  });
});
```

### Step 3: Create Test API (45-60 minutes)

**File**: `packages/core/config/TestAPI.ts`

```typescript
import type { Builder } from '../builder/Builder';

/**
 * Test API interface for programmatic state inspection
 * 
 * Available as window.__TEST_API__ when test mode is active
 */
export interface TestAPI {
  /** Get complete builder state */
  getBuilderState: () => any;
  
  /** Get currently selected component */
  getSelectedComponent: () => any;
  
  /** Get all components */
  getComponents: () => any[];
  
  /** Get current template */
  getTemplate: () => any;
  
  /** Get canvas settings */
  getCanvasSettings: () => any;
  
  /** Check if undo is available */
  canUndo: () => boolean;
  
  /** Check if redo is available */
  canRedo: () => boolean;
  
  /** Check if there are unsaved changes */
  hasUnsavedChanges: () => boolean;
  
  /** Wait for pending operations to complete */
  waitForStable: () => Promise<void>;
  
  /** Get component by ID */
  getComponentById: (id: string) => any;
  
  /** Query element by test ID */
  getTestIdElement: (testId: string) => HTMLElement | null;
  
  /** Get all test IDs in document */
  getAllTestIds: () => string[];
}

/**
 * Initialize test API and expose on window
 * Only available when import.meta.env.MODE === 'test'
 * 
 * @param builder - Builder instance to expose
 */
export function initializeTestAPI(builder: Builder): void {
  // Only expose in test mode
  if (typeof import.meta !== 'undefined' && import.meta.env?.MODE !== 'test') {
    return;
  }
  
  const testAPI: TestAPI = {
    getBuilderState: () => ({
      selectedComponent: builder.getSelectedComponent(),
      componentCount: builder.getComponents().length,
      canUndo: builder.canUndo(),
      canRedo: builder.canRedo(),
      template: builder.getCurrentTemplate(),
      canvasSettings: builder.getCanvasSettings()
    }),
    
    getSelectedComponent: () => builder.getSelectedComponent(),
    
    getComponents: () => builder.getComponents(),
    
    getTemplate: () => builder.getCurrentTemplate(),
    
    getCanvasSettings: () => builder.getCanvasSettings(),
    
    canUndo: () => builder.canUndo(),
    
    canRedo: () => builder.canRedo(),
    
    hasUnsavedChanges: () => {
      // Implement based on builder state
      return false; // Placeholder
    },
    
    waitForStable: () => new Promise(resolve => {
      // Wait for pending operations to complete
      // This is a simple timeout, could be more sophisticated
      setTimeout(resolve, 100);
    }),
    
    getComponentById: (id: string) => {
      const components = builder.getComponents();
      return components.find(c => c.id === id) || null;
    },
    
    getTestIdElement: (testId: string) => {
      return document.querySelector(`[data-testid="${testId}"]`);
    },
    
    getAllTestIds: () => {
      const elements = document.querySelectorAll('[data-testid]');
      return Array.from(elements)
        .map(el => el.getAttribute('data-testid'))
        .filter((id): id is string => id !== null);
    }
  };
  
  // Expose on window
  (window as any).__TEST_API__ = testAPI;
  
  console.log('✅ Test API initialized - Available as window.__TEST_API__');
}

/**
 * Type declaration for global window object
 */
declare global {
  interface Window {
    __TEST_API__?: TestAPI;
  }
}
```

**File**: `packages/core/config/index.ts`

```typescript
// Add to existing exports
export { initializeTestAPI } from './TestAPI';
export type { TestAPI } from './TestAPI';
```

### Step 4: Initialize in Builder (15 minutes)

**File**: `packages/core/builder/Builder.ts`

```typescript
// Add imports at top
import { TestMode } from '../config/TestModeManager';
import { initializeTestAPI } from '../config/TestAPI';

// In Builder constructor
constructor(config: BuilderConfig) {
  // ... existing initialization ...
  
  // Initialize test mode
  TestMode.initialize();
  
  // Initialize test API
  initializeTestAPI(this);
}
```

### Step 5: Run Tests (15 minutes)

```bash
# Run tests for new modules
pnpm --filter @email-builder/core test

# Verify all tests pass
```

## ✅ Completion Checklist

- [ ] `TestModeManager.ts` created with all methods
- [ ] `TestModeManager.test.ts` created with full coverage
- [ ] Test mode can be enabled/disabled
- [ ] Test mode persists to localStorage
- [ ] `testAttributes.ts` created with helper functions
- [ ] `testAttributes.test.ts` created with full coverage
- [ ] Helpers return empty objects when test mode disabled
- [ ] Helpers return attributes when test mode enabled
- [ ] `TestAPI.ts` created with state inspection methods
- [ ] Test API only initializes in test mode
- [ ] Builder initializes test mode on construction
- [ ] Builder initializes test API
- [ ] All tests passing
- [ ] No TypeScript errors

## 🎯 Success Criteria

1. **Test mode can be toggled** - Enable/disable programmatically
2. **Attributes are conditional** - Only present when test mode is enabled
3. **Zero production impact** - No attributes or overhead when disabled
4. **Persistence works** - Preference saved and loaded from localStorage
5. **Test API accessible** - `window.__TEST_API__` available in test mode
6. **All tests pass** - 100% test coverage for new code

## 📝 Next Steps

After completing Phase 1, we'll move to:

**Phase 2**: Component Integration (4-6 hours)
- Add test attributes to all UI components
- Use helper functions in every component
- Add state exposure to stateful components

**Phase 3**: UI Toggle & Integration (2-3 hours)
- Add test mode toggle button to toolbar
- Integrate with BuilderContext
- Add operation result indicators

## 🚨 Important Notes

- **Don't skip tests** - Write tests as you build
- **Run tests frequently** - Catch issues early
- **Follow naming conventions** - Use kebab-case for test IDs
- **Document as you go** - Add JSDoc comments
- **Check TypeScript** - Ensure no type errors

## 💡 Tips

- Use the test helpers in a component to verify they work
- Check that localStorage persistence works in browser
- Verify `window.__TEST_API__` is accessible in console
- Test that attributes disappear when test mode is off
- Make sure `data-test-mode` attribute updates on root element

## 🎉 You're Done When...

- All tests are green ✅
- TypeScript compiles without errors ✅
- Test mode can be toggled in browser console ✅
- `localStorage` stores the preference ✅
- `window.__TEST_API__` is available ✅
- Helper functions work correctly ✅

Ready to start? Let's build Phase 1! 🚀
