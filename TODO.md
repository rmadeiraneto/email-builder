# Email Builder - TODO

## UI Component Migration

### ✅ Completed
- [x] Phase 1: Infrastructure & documentation
- [x] Phase 2: Vite aliases for datatalks-utils and datatalks-ui

### 🔄 In Progress
- [x] Install external dependencies (lodash-es, @floating-ui/dom, color2k, alwan, lexical)
- [x] Test alias imports work correctly
- [x] Round 1: Migrate Modal component

### 📋 Pending

#### Phase 3: Component Migration (4 Rounds)

**Round 1: Core Molecules** (Week 1)
- [x] Modal (with @floating-ui/dom) - ✅ Complete with 27 tests
- [ ] Dropdown
- [ ] Tabs
- [ ] Accordion

**Round 2: Form Components** (Week 2)
- [ ] InputLabel
- [ ] InputNumber
- [ ] RadioButtonGroup
- [ ] LinkedInputs
- [ ] EditableField

**Round 3: Complex Components** (Week 3)
- [ ] TextEditor (Lexical)
- [ ] CodeEditor
- [ ] ColorPicker (Alwan)
- [ ] GridSelector

**Round 4: Utility Components** (Week 4)
- [ ] Alert, Popup, Floater, Tooltip
- [ ] Remaining atoms/molecules

#### Phase 4: Base/Adapter Pattern Refactor
- [ ] Extract framework-agnostic base layer
- [ ] Create Vanilla JS adapters
- [ ] Create Solid JS adapters
- [ ] Document adapter pattern

## Token Optimization Notes

### Work Efficiently
- Read only necessary files
- Use targeted edits
- Create concise documentation
- Batch related changes
- Use TODO tracking instead of long planning docs

### Code Structure Optimizations
- CSS Modules eliminate prefix boilerplate
- Design tokens reduce hardcoded values
- Shared utilities reduce duplication
- TypeScript reduces runtime checks

### Priority System
1. **Critical**: Needed for MVP
2. **High**: Core functionality
3. **Medium**: Enhanced UX
4. **Low**: Nice-to-have

## Next Session
Continue Round 1: Core Molecules migration

1. **Dropdown Component**
   - Copy from `C:\Users\Work\Documents\GitHub\email-builder\src\js\DataTalksUI\Dropdown\_dropdown.js`
   - Copy styles from `C:\Users\Work\Documents\GitHub\email-builder\src\sass\components\_dropdown.scss`
   - Convert to TypeScript with CSS Modules
   - Create comprehensive tests
   - Target: Same quality as Modal (27 tests, all passing)

2. **Tabs Component**
   - Copy from `C:\Users\Work\Documents\GitHub\email-builder\src\js\DataTalksUI\_Tabs.js` and `_TabItem.js`
   - Copy styles from `C:\Users\Work\Documents\GitHub\email-builder\src\sass\components\_tabs.scss`
   - Convert to TypeScript with CSS Modules
   - Test active state management and content switching

3. **Accordion Component**
   - Copy from `C:\Users\Work\Documents\GitHub\email-builder\src\js\DataTalksUI\_accordion.js`
   - Copy styles from `C:\Users\Work\Documents\GitHub\email-builder\src\sass\components\_accordion.scss`
   - Convert to TypeScript with CSS Modules
   - Test single/multiple expand modes

**Note**: Follow Modal component pattern as template for consistency
