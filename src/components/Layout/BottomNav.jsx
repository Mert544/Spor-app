import { NavLink } from 'react-router-dom';

// Inline SVG icons — crisp, professional, no emoji rendering variance
const Icons = {
  Workout: ({ active }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 6.5h1M16.5 6.5h1M6.5 17.5h1M16.5 17.5h1" />
      <path d="M3 12h18M7.5 6.5v11M16.5 6.5v11" />
      <rect x="2" y="10.5" width="3" height="3" rx="1" />
      <rect x="19" y="10.5" width="3" height="3" rx="1" />
    </svg>
  ),
  Progress: ({ active }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  Programs: ({ active }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  Analytics: ({ active }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  ),
  Profile: ({ active }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  ),
  Premium: ({ active }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 0-1.173-.056L7 8.277V5.5A2.5 2.5 0 0 0 4.5 3h-2A2.5 2.5 0 0 0 0 5.5v2.777l-1.915.48a2 2 0 0 0-1.173.056L12 3ZM6.5 13.5h11m-11 5a2.5 2.5 0 0 0 5 0v.5A2.5 2.5 0 0 0-5 0v-.5Zm0 4a2.5 2.5 0 0 0 5 0v.5A2.5 2.5 0 0 0-5 0v-.5Z" />
      <path d="M14.5 9.5a2.5 2.5 0 0 0-5 0" />
    </svg>
  ),
};

const ACTIVE_COLOR = '#14B8A6'; // teal — more premium than red for nav

const tabs = [
  { to: '/antenman', Icon: Icons.Workout,  label: 'Antrenman' },
  { to: '/ilerleme',  Icon: Icons.Progress, label: 'İlerleme' },
  { to: '/programlar', Icon: Icons.Programs, label: 'Programlar' },
  { to: '/analytics',  Icon: Icons.Analytics, label: 'Analitik' },
  { to: '/profil',    Icon: Icons.Profile,  label: 'Profil' },
];

export default function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto pb-safe z-40"
      style={{ background: 'linear-gradient(0deg, #09111f 75%, transparent 100%)' }}
    >
      {/* Hairline separator */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.05)' }} />

      <div className="flex px-2 pt-1 pb-2">
        {tabs.map(({ to, Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className="flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-xl transition-all"
          >
            {({ isActive }) => (
              <>
                {/* Icon container — pill background when active */}
                <div
                  className="flex items-center justify-center w-10 h-7 rounded-xl transition-all"
                  style={isActive
                    ? { backgroundColor: `${ACTIVE_COLOR}1a`, color: ACTIVE_COLOR }
                    : { color: 'rgba(255,255,255,0.3)' }
                  }
                >
                  <Icon active={isActive} />
                </div>
                <span
                  className="text-xs font-medium transition-colors"
                  style={{ color: isActive ? ACTIVE_COLOR : 'rgba(255,255,255,0.3)', fontSize: '10px' }}
                >
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
