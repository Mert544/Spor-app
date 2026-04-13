import { Moon, Sun, Monitor } from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { applyTheme, loadTheme, THEMES, THEME_NAMES } from '../../styles/theme';
import { useEffect } from 'react';

export default function ThemeToggle({ className = '' }) {
  const { theme: savedTheme, setTheme, getCurrentTheme } = useSettingsStore();

  const currentTheme = getCurrentTheme();

  useEffect(() => {
    // Apply saved theme on mount
    const themeToApply = savedTheme === 'system' ? undefined : savedTheme;
    if (themeToApply) {
      applyTheme(themeToApply);
    }

    // Listen for system theme changes if using system theme
    if (savedTheme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme(loadTheme());
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [savedTheme]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);

    // Apply theme immediately
    if (newTheme !== 'system') {
      applyTheme(newTheme);
    } else {
      const systemTheme = loadTheme();
      applyTheme(systemTheme);
    }
  };

  const themes = [
    { value: 'dark', name: THEME_NAMES.dark, icon: Moon },
    { value: 'light', name: THEME_NAMES.light, icon: Sun },
    { value: 'system', name: 'Otomatik', icon: Monitor },
  ];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {themes.map((t) => {
        const Icon = t.icon;
        const isActive = savedTheme === t.value;

        return (
          <button
            key={t.value}
            onClick={() => handleThemeChange(t.value)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all ${
              isActive
                ? 'bg-[#14B8A6] text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80'
            }`}
            title={t.name}
          >
            <Icon size={16} />
            <span className="hidden sm:inline">{t.name}</span>
          </button>
        );
      })}
    </div>
  );
}
