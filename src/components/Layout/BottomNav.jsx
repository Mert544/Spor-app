import { NavLink } from 'react-router-dom';

const tabs = [
  { to: '/antrenman', icon: '💪', label: 'Antrenman' },
  { to: '/ilerleme', icon: '📊', label: 'İlerleme' },
  { to: '/programlar', icon: '🗂️', label: 'Programlar' },
  { to: '/profil', icon: '⚙️', label: 'Profil' },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-bg-dark border-t border-white/10 pb-safe z-40">
      <div className="flex">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-0.5 py-2 text-xs transition-colors ${
                isActive ? 'text-accent-red' : 'text-white/40 hover:text-white/70'
              }`
            }
          >
            <span className="text-xl leading-none">{tab.icon}</span>
            <span className="font-medium">{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
