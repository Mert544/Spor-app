# TDZ Error Analysis: "Cannot access 'P' before initialization"

## 1. Root Cause Analysis

### What is the Temporal Dead Zone (TDZ)?
In JavaScript, variables declared with `const` and `let` exist in a "Temporal Dead Zone" from the start of their containing block until the declaration is executed. Accessing them during this zone throws a ReferenceError.

### Why it happens in minified production code:

**The specific issue in CoachPage.jsx:**

```javascript
// Line 549 - showWidgets uses displayMessages
const showWidgets = displayMessages.length <= 2;

// Lines 540-546 - State declarations
const [history, setHistory] = useState([]);
const [displayMessages, setDisplayMessages] = useState([  // ← Line 541
  { role: 'assistant', text: `Merhaba ${userName}! ...` },
]);
```

**The Problem:**
1. During minification, variable names are shortened (e.g., `showWidgets` → `P`)
2. The minifier may reorder code for optimization
3. In React's strict mode or concurrent rendering, the component may be invoked multiple times
4. If `showWidgets` calculation runs before `displayMessages` is fully initialized, TDZ error occurs

## 2. Common Culprits in React/Vite Apps

| Pattern | Risk Level | Description |
|---------|------------|-------------|
| **Derived state before declaration** | HIGH | Using `const derived = state.value` when `state` is declared below |
| **Circular hooks dependencies** | HIGH | Hook A uses Hook B which uses Hook A |
| **useMemo accessing uninitialized state** | MEDIUM | useMemo callback references state declared after it |
| **Hoisted functions accessing let/const** | MEDIUM | Function declarations hoisted but accessing TDZ variables |
| **Lazy loading with circular imports** | HIGH | Component A imports B, B imports A |

## 3. Debugging Strategy

### Method 1: Source Maps Analysis
```bash
# Build with source maps
npm run build -- --sourcemap

# Analyze the source map to find 'P' mapping
npx source-map-explorer dist/assets/CoachPage-*.js
```

### Method 2: Pattern Search in Original Code
Look for these patterns in CoachPage.jsx:
- Variables used before their declaration line
- Functions referencing state/props before they're declared
- useMemo/useCallback with dependencies declared after

### Method 3: Binary Search Debugging
1. Comment out half of the component
2. Build and test
3. Continue narrowing down until finding the problematic line

## 4. The Fix

The issue is line 549 where `showWidgets` references `displayMessages`:

```javascript
// BEFORE (problematic):
const [displayMessages, setDisplayMessages] = useState([...]);
// ... other states ...
const showWidgets = displayMessages.length <= 2;  // ← TDZ risk
```

```javascript
// AFTER (safe):
// Move showWidgets to useMemo or calculate during render
const showWidgets = useMemo(() => displayMessages.length <= 2, [displayMessages]);
// Or simply inline the check where needed
```

## 5. Prevention Best Practices

1. **Declare state at the top**: All useState/useRef hooks first
2. **Use useMemo for derived values**: Don't calculate derived state immediately after
3. **Avoid hoisted function expressions**: Use const/let for functions
4. **Enable ESLint rule**: `no-use-before-define`
5. **Test with React StrictMode**: Catches these issues in development
6. **Avoid circular dependencies**: Use dependency injection or restructure modules

## 6. Immediate Action

Apply the fix to CoachPage.jsx:
- Move `showWidgets` calculation into useMemo
- Ensure all state is declared before any derived calculations
- Test in production build locally before deploying
