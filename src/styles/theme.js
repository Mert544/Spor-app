// Theme configuration for V-Taper Coach
// Supports light/dark mode with smooth transitions

export const THEMES = {
  dark: {
    bg: '#0f172a',
    bgCard: '#1e293b',
    bgCardHover: '#334155',
    bgInput: '#1e293b',
    text: '#ffffff',
    textMuted: 'rgba(255, 255, 255, 0.6)',
    textMutedLight: 'rgba(255, 255, 255, 0.3)',
    primary: '#14B8A6',
    primaryHover: '#0d9488',
    accent: '#E94560',
    accentHover: '#d63d52',
    border: 'rgba(255, 255, 255, 0.1)',
    borderHover: 'rgba(255, 255, 255, 0.2)',
    shadow: 'rgba(0, 0, 0, 0.3)',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#E94560',
    gradient: 'linear-gradient(135deg, #14B8A6 0%, #0d9488 100%)',
    surface: '#1e293b',
  },
  light: {
    bg: '#f8fafc',
    bgCard: '#ffffff',
    bgCardHover: '#f1f5f9',
    bgInput: '#ffffff',
    text: '#0f172a',
    textMuted: 'rgba(15, 23, 42, 0.6)',
    textMutedLight: 'rgba(15, 23, 42, 0.3)',
    primary: '#0d9488',
    primaryHover: '#0c7e70',
    accent: '#e11d48',
    accentHover: '#be123c',
    border: 'rgba(15, 23, 42, 0.1)',
    borderHover: 'rgba(15, 23, 42, 0.2)',
    shadow: 'rgba(0, 0, 0, 0.1)',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#e11d48',
    gradient: 'linear-gradient(135deg, #0d9488 0%, #0c7e70 100%)',
    surface: '#ffffff',
  },
};

export const THEME_NAMES = {
  dark: 'Karanlık',
  light: 'Aydınlık',
};

// System theme detection
export function getSystemTheme() {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Apply theme to document
export function applyTheme(themeName) {
  const theme = THEMES[themeName] || THEMES.dark;

  // Set CSS variables
  const root = document.documentElement;

  // Color variables
  root.style.setProperty('--color-bg', theme.bg);
  root.style.setProperty('--color-bg-card', theme.bgCard);
  root.style.setProperty('--color-bg-card-hover', theme.bgCardHover);
  root.style.setProperty('--color-bg-input', theme.bgInput);
  root.style.setProperty('--color-text', theme.text);
  root.style.setProperty('--color-text-muted', theme.textMuted);
  root.style.setProperty('--color-text-muted-light', theme.textMutedLight);
  root.style.setProperty('--color-primary', theme.primary);
  root.style.setProperty('--color-primary-hover', theme.primaryHover);
  root.style.setProperty('--color-accent', theme.accent);
  root.style.setProperty('--color-accent-hover', theme.accentHover);
  root.style.setProperty('--color-border', theme.border);
  root.style.setProperty('--color-border-hover', theme.borderHover);
  root.style.setProperty('--color-success', theme.success);
  root.style.setProperty('--color-warning', theme.warning);
  root.style.setProperty('--color-error', theme.error);
  root.style.setProperty('--color-gradient', theme.gradient);

  // Store theme preference
  localStorage.setItem('theme', themeName);
}

// Load saved theme or use system
export function loadTheme() {
  const saved = localStorage.getItem('theme');
  if (saved && THEMES[saved]) {
    return saved;
  }
  return getSystemTheme();
}

// CSS variable helper components
export const ThemeVars = () => `
  :root {
    --color-bg: var(--color-bg, #0f172a);
    --color-bg-card: var(--color-bg-card, #1e293b);
    --color-bg-card-hover: var(--color-bg-card-hover, #334155);
    --color-bg-input: var(--color-bg-input, #1e293b);
    --color-text: var(--color-text, #ffffff);
    --color-text-muted: var(--color-text-muted, rgba(255,255,255,0.6));
    --color-text-muted-light: var(--color-text-muted-light, rgba(255,255,255,0.3));
    --color-primary: var(--color-primary, #14B8A6);
    --color-primary-hover: var(--color-primary-hover, #0d9488);
    --color-accent: var(--color-accent, #E94560);
    --color-accent-hover: var(--color-accent-hover, #d63d52);
    --color-border: var(--color-border, rgba(255,255,255,0.1));
    --color-border-hover: var(--color-border-hover, rgba(255,255,255,0.2));
    --color-success: var(--color-success, #10B981);
    --color-warning: var(--color-warning, #F59E0B);
    --color-error: var(--color-error, #E94560);
    --color-gradient: var(--color-gradient, linear-gradient(135deg, #14B8A6 0%, #0d9488 100%));
  }
`;
