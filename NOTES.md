# Project Notes

## Pending Items

### Existing Component Reference
The project will maintain the current app's visual style. Existing vanilla JS components should be provided as reference for:
- Visual style consistency
- Component structure inspiration
- Understanding the existing design language

**Action Required**: Provide existing vanilla JS components when available.

## Important Decisions

### Current Focus
Starting with the **UI Components package** (`packages/ui-components/`) with three implementations:
- Vanilla JavaScript
- Solid JS
- Blazor

### Build Strategy
1. Design tokens first (foundation for everything)
2. Atomic components (atoms → molecules → organisms)
3. Framework adapters
4. Integration with core builder logic

### Key Constraints
- Must support Outlook 2016-365 for email rendering
- Bundle size target: < 500KB gzipped
- Test coverage: > 80%
- WCAG 2.1 AA compliance mandatory

## Quick Reference

### Related Documents
- `REQUIREMENTS.md` - Complete feature and technical requirements
- `.claude/claude.md` - Coding standards and best practices
- `package.json` - Project dependencies and scripts (to be configured)

### Key Technologies
- **Build**: Vite + pnpm workspaces
- **Language**: TypeScript (strict mode)
- **Primary UI**: Solid JS
- **Text Editor**: Lexical
- **Icons**: Remix Icons
- **Styling**: CSS Modules (SCSS + BEM) and Tailwind CSS (no mixing!)
- **Tokens**: W3C Design Token format
- **Testing**: Vitest + Testing Library
- **Docs**: TypeDoc

## Next Steps
1. ✅ Requirements document created
2. ✅ Coding standards documented
3. ⏳ Set up monorepo structure (pnpm workspaces)
4. ⏳ Configure Vite build system
5. ⏳ Create design tokens package
6. ⏳ Build UI components (Vanilla JS, Solid JS, Blazor)
