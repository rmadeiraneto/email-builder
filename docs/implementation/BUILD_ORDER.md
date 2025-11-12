# Build Order Guide

## Why Build Order Matters

The email-builder is a monorepo where packages depend on each other. Before running the dev app, you must build packages in the correct order so their exports are available.

## Quick Start

```bash
# Install all dependencies
pnpm install

# Build all packages in correct order
pnpm build

# Run the dev app
pnpm dev
```

## Detailed Build Order

If you need to build packages individually:

```bash
# 1. Build tokens (no dependencies)
pnpm --filter "@email-builder/tokens" build

# 2. Build core (depends on tokens)
pnpm --filter "@email-builder/core" build

# 3. Build ui-components (depends on tokens)
pnpm --filter "@email-builder/ui-components" build

# 4. Build ui-solid (depends on core, ui-components, tokens)
pnpm --filter "@email-builder/ui-solid" build

# Now you can run the dev app
pnpm dev
```

## Troubleshooting

### Error: "Failed to resolve import"
This means a package hasn't been built yet. Run `pnpm build` to build all packages.

### Error: "Can't find stylesheet to import"
The tokens package needs to be built first. Run:
```bash
pnpm --filter "@email-builder/tokens" build
```

### Starting Fresh
If you're having persistent issues:
```bash
# Remove all build artifacts and node_modules
rm -rf node_modules packages/*/node_modules packages/*/dist apps/*/node_modules

# Reinstall and rebuild
pnpm install
pnpm build
```

## Development Workflow

### First Time Setup
```bash
pnpm install
pnpm build
pnpm dev
```

### When Modifying a Package
If you modify a package that others depend on, rebuild it:
```bash
# Example: Modified ui-components
pnpm --filter "@email-builder/ui-components" build

# If ui-solid uses ui-components, rebuild it too
pnpm --filter "@email-builder/ui-solid" build

# Then restart dev server
pnpm dev
```

### When Adding New Components
After adding new SolidJS components:
```bash
# Rebuild ui-solid
pnpm --filter "@email-builder/ui-solid" build

# Restart dev server
pnpm dev
```
