import { NavLink } from 'react-router-dom';

// Inline SVG icons — crisp, professional, no emoji rendering variance
const Icons = {
  Workout: ({ active }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 6.5h1M16.5 6.5h1M6.5 17.5h1M16.5 17.5h1" />
      <path d="M3 12h18M7.5 6.5v11M16.5 6.5v11" />
      <rect x="2" y="10.5" width="3" height="3" rx="1" />
      <rect x="19" y="10.5" width="3" height="3" rx="1" />
    </svg>
  ),
  Progress: ({ active }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  Programs: ({ active }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  Profile: ({ active }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  ),
};

const tabs = [
  { to: '/antrenman', Icon: Icons.Workout, label: 'Antrenman' },
  { to: '/ilerleme',  Icon: Icons.Progress, label: 'İlerleme' },
  { to: '/programlar', Icon: Icons.Programs, label: 'Programlar' },
  { to: '/profil',    Icon: Icons.Profile,  label: 'Profil' },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto pb-safe z-40"
      style={{ background: 'linear-gradient(0deg, #0a0f1a 85%, #0a0f1a00 100%)' }}>
      {/* Thin separator line */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />
      <div className="flex pt-1 pb-2">
        {tabs.map(({ to, Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-0.5 py-2 transition-colors ${
                isActive ? 'text-accent-red' : 'text-white/35 hover:text-white/60'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <Icon active={isActive} />
                  {/* Active dot indicator */}
                  {isActive && (
                    <span
                      className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ backgroundColor: '#E94560' }}
                    />
                  )}
                </div>
                <span className={`text-xs font-medium ${isActive ? 'text-accent-red' : ''}`}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
