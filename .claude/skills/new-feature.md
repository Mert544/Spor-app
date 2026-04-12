# New Feature — Spor-App

Add a new feature to V-Taper Coach. Follows the app's architecture and design system.

## Before You Start

Read these files to understand the current state:
- `src/App.jsx` — routes and navigation
- `src/components/Layout/BottomNav.jsx` — navigation tabs
- `src/store/` — available Zustand stores
- The component most similar to what you're building

## Feature Types

### New Page
1. Create component at `src/components/<Section>/<PageName>.jsx`
2. Add route in `src/App.jsx`: `<Route path="/path" element={<PageName />} />`
3. If it needs a nav tab, add to `BottomNav.jsx` (max 5 tabs)
4. Add `page-enter` class to root div for transition animation

### New Card/Widget (for existing page)
1. Create at `src/components/<Section>/<CardName>.jsx`
2. Import and place in parent page
3. Follow card pattern: `bg-bg-card rounded-2xl p-4 card-glow`

### New Store
1. Create at `src/store/use<Name>Store.js`
2. Use `zustand` with `persist` middleware (key: `vtaper-<name>`)
3. Export as default

## Design Rules
- Dark theme: `bg-bg` base, `bg-bg-card` for cards
- Mobile-first: safe area padding at bottom (`pb-safe`)
- Touch targets minimum 44px height/width
- Color accents from tailwind.config.js palette only
- No external UI component libraries
- Turkish UI text throughout

## Store Access Pattern
```js
// Always merge custom programs with static ones:
import ALL_PROGRAMS from '@/data/program';
import useCustomProgramStore from '@/store/useCustomProgramStore';
const customPrograms = useCustomProgramStore(s => s.programs);
const allPrograms = useMemo(() => ({ ...ALL_PROGRAMS, ...customPrograms }), [customPrograms]);
```

## After Implementation
1. Test on mobile viewport (375px width)
2. Verify no console errors
3. Check that existing features still work
4. Commit with descriptive message
