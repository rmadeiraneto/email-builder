# Next Session Task: Complete Phase 2 Integration

**Status**: Phase 2 is ~75% complete - Foundation is ready, needs integration
**Estimated Time**: 2-3 hours
**Priority**: HIGH 🔴

---

## 🎯 What Needs to Be Done

### Task 1: Integrate Compatibility Indicators (1-2 hours)

**Goal**: Add CompatibilityIcon to PropertyPanel component

**Steps**:
1. Locate PropertyPanel component (`packages/ui-solid/src/properties/` or similar)
2. Import CompatibilityIcon and CompatibilityModal
3. Add CompatibilityService to component props/context
4. Add CompatibilityIcon next to each property control
5. Add modal state management (open/close)
6. Wire up onClick handlers
7. Test in browser

**Example Integration**:
```tsx
import { CompatibilityIcon, CompatibilityModal } from '../compatibility';
import { useBuilder } from '@/context/BuilderContext';

// In PropertyPanel component
const compatService = builder.getCompatibilityService();
const [showModal, setShowModal] = createSignal(false);
const [selectedProperty, setSelectedProperty] = createSignal('');

// Next to each property control
<CompatibilityIcon
  property="border-radius"
  compatibilityService={compatService}
  onClick={() => {
    setSelectedProperty('border-radius');
    setShowModal(true);
  }}
/>

// Modal at component root
<CompatibilityModal
  property={selectedProperty()}
  compatibilityService={compatService}
  isOpen={showModal()}
  onClose={() => setShowModal(false)}
/>
```

---

### Task 2: Implement Tips Display (1-2 hours)

**Goal**: Show helpful tips based on user actions

**Steps**:
1. Add tips state to BuilderContext:
   - `dismissedTips: string[]`
   - `loadDismissedTips()` from localStorage
   - `dismissTip(id)` and save to localStorage
   - `getActiveTips(trigger)` filter by trigger & not dismissed
2. Display TipBanner components in strategic locations:
   - Top of Builder when email mode selected (TipTrigger.EMAIL_MODE)
   - Before export in export modal (TipTrigger.EXPORT)
   - When using properties with poor support (TipTrigger.POOR_COMPATIBILITY)
3. Test all triggers

**Example Integration**:
```tsx
// In BuilderContext.tsx
const [dismissedTips, setDismissedTips] = createSignal<string[]>([]);

const loadDismissedTips = () => {
  const saved = localStorage.getItem('dismissed-tips');
  if (saved) {
    setDismissedTips(JSON.parse(saved));
  }
};

const dismissTip = (tipId: string) => {
  const updated = [...dismissedTips(), tipId];
  setDismissedTips(updated);
  localStorage.setItem('dismissed-tips', JSON.stringify(updated));
};

// In Builder.tsx or relevant component
import { getTipsByTrigger, TipTrigger } from '@email-builder/core/tips';
import { TipBanner } from '@email-builder/ui-solid/tips';

const emailModeTips = getTipsByTrigger(TipTrigger.EMAIL_MODE)
  .filter(tip => !dismissedTips().includes(tip.id));

<For each={emailModeTips}>
  {(tip) => (
    <TipBanner tip={tip} onDismiss={dismissTip} />
  )}
</For>
```

---

### Task 3: Testing & Polish (30 min)

**Checklist**:
- [ ] All compatibility icons display correctly
- [ ] Modal opens/closes properly
- [ ] Support data is accurate
- [ ] Tips display on correct triggers
- [ ] Tips can be dismissed
- [ ] Dismissed tips stay dismissed (localStorage)
- [ ] No console errors
- [ ] Responsive design works
- [ ] Accessibility (keyboard navigation, ARIA)

---

## ✅ What's Already Done

See **SESSION_SUMMARY.md** for full details. In summary:

**Priority 1: Compatibility Data System** ✅ COMPLETE
- Type system, database, service all implemented
- 20+ CSS properties, 19 email clients
- Integrated into Builder class

**Priority 2: Compatibility UI Components** ✅ MOSTLY COMPLETE
- CompatibilityIcon component ✅
- CompatibilityModal component ✅
- Just needs integration into PropertyPanel ⚠️

**Priority 3: Tips System** ✅ COMPLETE
- 25+ tips covering all aspects
- TipBanner component ready
- Just needs display logic ⚠️

**Total Files Created**: 16 files, ~3,500 lines of code
**Dev Server**: Running smoothly, no errors

---

## 📂 Key Files to Work With

**For Compatibility Integration**:
- `packages/ui-solid/src/compatibility/` - Components ready to use
- `packages/core/compatibility/` - Service and data
- Find: `packages/ui-solid/src/properties/PropertyPanel.*` (or similar)
- Update: Add icons to property controls

**For Tips Integration**:
- `packages/ui-solid/src/tips/TipBanner.tsx` - Component ready
- `packages/core/tips/` - Tips data and utilities
- Update: `apps/dev/src/context/BuilderContext.tsx` - Add tips state
- Update: `apps/dev/src/pages/Builder.tsx` - Display tips

---

## 🚀 After This Session

Phase 2 will be 100% complete! Next up:
- **Phase 3**: Pre-Export Compatibility Checker (2-4 hours)
- **Phase 4**: Email Client Support Matrix (2 hours)

---

**Quick Start**: Just run `pnpm dev` and start with Task 1!
