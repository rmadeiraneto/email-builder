# Sass Legacy JS API Migration Strategy

## Executive Summary

This document outlines the strategy for migrating from Sass's deprecated Legacy JS API to the modern JS API. The legacy API (using `render` and `renderSync`) is deprecated as of Dart Sass 1.45.0 and will be completely removed in Dart Sass 2.0.0.

**Current Status**: ✅ **Already Compatible**

Our project uses **Vite 5.4.21** as the build tool, which handles Sass compilation internally. We do not directly use the Sass JS API in our codebase.

## Key Migration Points from Sass Documentation

### 1. API Changes

- **Legacy**: `sass.render()` and `sass.renderSync()` with callbacks
- **Modern**: `sass.compile()`, `sass.compileAsync()`, `sass.compileString()`, `sass.compileStringAsync()` with promises

### 2. Importers

- **Legacy**: Single function returning `{file: path}` or `{contents: string}`
- **Modern**: Two methods - `canonicalize()` and `load()` for better module resolution

### 3. Custom Functions

- **Legacy**: Separate JS argument per Sass argument + `done` callback
- **Modern**: Single array argument + promise return for async

### 4. Bundler Integration

- **Webpack**: Set `api: "modern"` or `api: "modern-compiler"` in sass-loader options
- **Vite**: Uses modern API by default in Vite 6, configurable via `api: "modern"` in Vite 5.4+

## Current Architecture Analysis

### Build Tool Stack

```text
Vite 5.4.21 (workspace root)
├── packages/ui-components/vite.config.ts
├── packages/ui-solid/vite.config.ts
├── packages/core/vite.config.ts
└── apps/dev/vite.config.ts
```

### Sass Usage Patterns

1. **SCSS Modules** (40+ files)
   - Component-level `.module.scss` files
   - Compiled automatically by Vite
   - Using CSS Modules pattern

2. **Design Tokens**
   - Source: `packages/tokens/src/**/*.json`
   - Output: `packages/tokens/build/scss/_variables.scss`
   - Generator: Style Dictionary (not Sass API)

3. **Vite Configuration** (scss preprocessor options)

   ```typescript
   css: {
     preprocessorOptions: {
       scss: {
         additionalData: `@use "@tokens" as tokens;\n`,
       },
     },
   }
   ```

### Direct Sass API Usage

**Finding**: ✅ **NONE DETECTED**

- No `require('sass')` or `import sass from 'sass'`
- No direct calls to `sass.render()`, `sass.renderSync()`, `sass.compile()`, etc.
- All Sass compilation is delegated to Vite's internal handling

## Migration Strategy

### Phase 1: Verification & Documentation ✅ COMPLETE

- [x] Audit codebase for direct Sass API usage
- [x] Verify Vite version and configuration
- [x] Document current architecture
- [x] Confirm compatibility status

### Phase 2: Vite Configuration Update (RECOMMENDED)

Even though Vite 5.4.21 may use the modern API internally, explicitly configure it to ensure future compatibility and silence any warnings.

#### Action Items

##### 2.1. Update All Vite Configs

Add explicit modern API configuration to all `vite.config.ts` files:

```typescript
// Before
css: {
  preprocessorOptions: {
    scss: {
      additionalData: `@use "@tokens" as tokens;\n`,
    },
  },
}

// After
css: {
  preprocessorOptions: {
    scss: {
      api: 'modern', // or 'modern-compiler' for better performance
      additionalData: `@use "@tokens" as tokens;\n`,
    },
  },
}
```

**Files to update:**

- `c:\Users\Work\Documents\GitHub\personal\email-builder\apps\dev\vite.config.ts`
- `c:\Users\Work\Documents\GitHub\personal\email-builder\packages\ui-components\vite.config.ts`
- `c:\Users\Work\Documents\GitHub\personal\email-builder\packages\ui-solid\vite.config.ts`

##### 2.2. Verify Sass Version

Check current Sass version in `pnpm-lock.yaml`:

```yaml
sass@1.93.2  # Current version detected
```

This is a recent version that fully supports the modern API.

##### 2.3. Test Build Pipeline

After configuration updates:

```bash
# Clean build
pnpm clean

# Rebuild tokens
pnpm build:tokens

# Full build
pnpm build

# Test dev mode
pnpm dev
```

### Phase 3: Vite 6 Migration (RECOMMENDED FOR LONG-TERM)

Vite 6 was released and uses the modern Sass API by default, providing better performance and eliminating the need for explicit `api` configuration.

#### 3.1. Pre-Migration Checklist

Before upgrading to Vite 6:

- [ ] Ensure all dependencies are compatible with Vite 6
- [ ] Review [Vite 6 migration guide](https://vite.dev/guide/migration)
- [ ] Test in a separate branch
- [ ] Back up current configuration

#### 3.2. Update Package Dependencies

```json
// Root package.json
{
  "devDependencies": {
    "vite": "^6.0.0",
    "sass-embedded": "^1.80.0"  // Recommended for best performance
  }
}
```

**Why sass-embedded?**

- Up to 10x faster than the regular `sass` package
- Uses native Dart Sass compiler
- Recommended by Vite documentation
- Better memory management

#### 3.3. Update Vite Configurations for Vite 6

Vite 6 automatically uses the modern Sass API, so you can remove explicit `api` configuration:

```typescript
// Before (Vite 5)
css: {
  preprocessorOptions: {
    scss: {
      api: 'modern-compiler',
      additionalData: `@use "@tokens" as tokens;\n`,
    },
  },
}

// After (Vite 6)
css: {
  preprocessorOptions: {
    scss: {
      // No need to specify 'api' - modern is default
      additionalData: `@use "@tokens" as tokens;\n`,
    },
  },
}
```

#### 3.4. Migration Steps

1. **Install sass-embedded**

   ```bash
   pnpm add -D -w sass-embedded
   pnpm remove -w sass
   ```

2. **Update Vite**

   ```bash
   pnpm update vite@latest
   ```

3. **Update all vite.config.ts files**

   Remove the `api` property from scss preprocessor options in:
   - `apps/dev/vite.config.ts`
   - `packages/ui-components/vite.config.ts`
   - `packages/ui-solid/vite.config.ts`

4. **Test the migration**

   ```bash
   # Clean all caches
   pnpm clean
   
   # Rebuild
   pnpm build:tokens
   pnpm build
   
   # Test dev server
   pnpm dev
   ```

5. **Verify performance improvements**

   Compare build times before and after:

   ```bash
   # Time the build
   time pnpm build
   ```

#### 3.5. Vite 6 Sass Configuration Options

With Vite 6, you can leverage additional modern Sass features:

```typescript
css: {
  preprocessorOptions: {
    scss: {
      // Sass string options (modern API)
      // https://sass-lang.com/documentation/js-api/interfaces/stringoptions/
      
      // Use modern @use and @forward
      loadPaths: ['./src/styles', './packages/tokens/build/scss'],
      
      // Custom importers for advanced module resolution
      importers: [
        {
          canonicalize(url) {
            // Custom URL resolution
            if (url.startsWith('~')) {
              return new URL(`node_modules/${url.slice(1)}`, 'file:///');
            }
            return null;
          },
          load(canonicalUrl) {
            // Custom file loading logic
            return {
              contents: '/* custom sass */',
              syntax: 'scss',
            };
          },
        },
      ],
      
      // Additional data injection
      additionalData: `@use "@tokens" as tokens;\n`,
    },
  },
  
  // Optional: Enable CSS preprocessor workers for better performance
  preprocessorMaxWorkers: true,
}
```

#### 3.6. Breaking Changes to Watch For

**Vite 6 Changes:**

1. **Default to modern Sass API**
   - Legacy API will emit warnings
   - No backward compatibility for `render`/`renderSync`

2. **sass-embedded preferred**
   - Regular `sass` package still works but slower
   - Vite will use `sass-embedded` if available

3. **Updated import resolution**
   - Better alignment with Sass module system
   - May affect custom importers

**Migration Validation:**

```typescript
// Add this to test modern API is being used
console.log('Sass compiler:', process.env.VITE_SASS_COMPILER || 'sass-embedded');
```

#### 3.7. Rollback Plan for Vite 6

If issues occur:

1. **Revert to Vite 5**

   ```bash
   pnpm add -D -w vite@5.4.21
   pnpm install
   ```

2. **Keep sass-embedded**

   `sass-embedded` works with both Vite 5 and 6, so you can keep it installed.

3. **Restore api configuration**

   Add back `api: 'modern-compiler'` in Vite 5 configs if needed.

#### 4.1. Pin Sass Version

To avoid unexpected breaking changes, consider pinning the Sass version:

```json
// Root package.json
{
  "devDependencies": {
    "sass-embedded": "~1.80.0"  // Pin to minor version (recommended)
  }
}
```

**Versioning Strategy:**

- `~1.80.0` - Allow patch updates only (safest)
- `^1.80.0` - Allow minor updates (balanced)
- `latest` - Always use latest (risky)

#### 4.2. Monitor Deprecation Warnings

During development, watch for any Sass deprecation warnings:

- Check terminal output during `pnpm dev`
- Review build logs during `pnpm build`
- If warnings appear, add to `silenceDeprecations` temporarily while fixing

### Phase 5: CI/CD Verification

#### 5.1. Update Build Pipeline

Ensure CI/CD doesn't suppress warnings that might indicate legacy API usage:

```yaml
# Example GitHub Actions workflow
- name: Build
  run: pnpm build
  env:
    NODE_OPTIONS: "--max-old-space-size=4096"
    # Don't silence Sass warnings in CI
```

#### 5.2. Add Sass Version Check

Add a pre-build check to ensure compatible Sass version:

```json
// package.json scripts
{
  "scripts": {
    "prebuild": "node -e \"console.log('Sass version:', require('sass').info)\"",
    "build": "pnpm --recursive --stream build"
  }
}
```

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Breaking changes from Sass 2.0 | Medium | High | Pin Sass version, test thoroughly |
| Vite bundler incompatibility | Low | Medium | Explicit modern API config |
| Build performance regression | Low | Low | Use 'modern-compiler' option |
| Dev server hot reload issues | Low | Medium | Test extensively in dev mode |

## Rollback Plan

If issues arise after configuration changes:

1. **Immediate Rollback**

   ```bash
   git revert <commit-hash>
   pnpm install
   pnpm build
   ```

2. **Temporary Silence Warnings**

   ```typescript
   css: {
     preprocessorOptions: {
       scss: {
         silenceDeprecations: ['legacy-js-api'],
         additionalData: `@use "@tokens" as tokens;\n`,
       },
     },
   }
   ```

3. **Pin to Older Vite Version** (last resort)

   ```json
   {
     "devDependencies": {
       "vite": "5.4.21"
     }
   }
   ```

## Implementation Checklist

- [ ] Review and approve this migration strategy
- [ ] Create feature branch: `chore/sass-modern-api`
- [ ] Update all Vite configs with `api: 'modern-compiler'`
- [ ] Run full test suite
- [ ] Verify dev server functionality
- [ ] Test production build
- [ ] Update documentation
- [ ] Create PR and request review
- [ ] Monitor first production deployment
- [ ] Update this document with lessons learned

## Benefits of Modern API

1. **Performance**: The modern compiler API is faster and more efficient
2. **Better Error Messages**: Improved error reporting and stack traces
3. **Consistent Module Resolution**: Better handling of `@use` and `@forward`
4. **Promise-based**: Modern async/await patterns instead of callbacks
5. **Future-proof**: Ensures compatibility with Sass 2.0 and beyond
6. **Smaller Bundle Size**: Modern API has less overhead

## References

- [Sass Breaking Change: Legacy JS API](https://sass-lang.com/documentation/breaking-changes/legacy-js-api/)
- [Sass JS API Documentation](https://sass-lang.com/documentation/js-api/)
- [Vite CSS Preprocessors Configuration](https://vitejs.dev/config/shared-options.html#css-preprocessoroptions)
- [Webpack sass-loader API option](https://webpack.js.org/loaders/sass-loader/#api)

## Timeline

| Phase | Duration | Priority |
|-------|----------|----------|
| Phase 1: Verification | ✅ Complete | High |
| Phase 2: Vite Config Update | 1-2 hours | High |
| Phase 3: Vite 6 Migration | 2-4 hours | High (Long-term) |
| Phase 4: Pin Sass Version | 30 minutes | Medium |
| Phase 5: CI/CD Verification | 1 hour | Medium |

**Recommended Approach**: Two-stage migration

**Stage 1 (Immediate)**: Phase 2 - Add modern API configuration to Vite 5

- Duration: 1-2 hours
- Risk: Very Low
- Impact: Future-proofs current setup

**Stage 2 (Within 3-6 months)**: Phase 3 - Upgrade to Vite 6

- Duration: 2-4 hours
- Risk: Low
- Impact: Performance improvement + simplified configuration

**Total Estimated Effort**: 4-8 hours including testing and documentation

## Conclusion

Our project is in an excellent position regarding the Sass legacy API deprecation:

1. **No Direct Sass API Usage** - All compilation is handled by Vite
2. **Clear Migration Path** - Two-stage approach minimizes risk
3. **Performance Gains Available** - Vite 6 + sass-embedded can significantly improve build times
4. **Future-Proof Strategy** - Both stages prepare for Sass 2.0

### Recommended Action Plan

**Immediate (This Week):**

- Implement Phase 2: Add `api: 'modern-compiler'` to Vite 5 configs
- Test thoroughly in dev and production builds
- No breaking changes, minimal risk

**Near-Term (Next Quarter):**

- Plan Phase 3: Vite 6 migration
- Install sass-embedded for performance boost
- Simplify configurations by removing explicit api option
- Benefit from Vite 6's improved features

This two-stage approach ensures a smooth, low-risk migration while positioning the project for optimal performance and future Sass compatibility.
