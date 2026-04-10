import useWorkoutStore from '../../store/useWorkoutStore';
import useProgressStore from '../../store/useProgressStore';

const BADGES = [
  // Başlangıç
  { id: 'first_log',    icon: '👟', name: 'İlk Adım',         desc: 'İlk seti kaydet',              color: '#14B8A6', check: (s) => s.totalSets >= 1 },
  { id: 'sets_10',      icon: '💪', name: '10 Set',            desc: '10 set tamamla',               color: '#3B82F6', check: (s) => s.totalSets >= 10 },
  { id: 'sets_50',      icon: '🏋️', name: '50 Set',            desc: '50 set tamamla',               color: '#8B5CF6', check: (s) => s.totalSets >= 50 },
  { id: 'sets_200',     icon: '🔩', name: '200 Set',           desc: '200 set tamamla',              color: '#F5A623', check: (s) => s.totalSets >= 200 },
  { id: 'sets_500',     icon: '🏆', name: '500 Set Ustası',    desc: '500 set tamamla',              color: '#E94560', check: (s) => s.totalSets >= 500 },
  { id: 'sets_1000',   icon: '💎', name: 'Bin Set Efsanesi', desc: '1000 set tamamla',             color: '#EC4899', check: (s) => s.totalSets >= 1000 },

  // Süreklilik
  { id: 'days_5',       icon: '⚡', name: 'Ritim',             desc: '5 antrenman günü',             color: '#F5A623', check: (s) => s.totalDays >= 5 },
  { id: 'days_20',      icon: '🔥', name: 'Demir Düzeni',      desc: '20 antrenman günü',            color: '#E94560', check: (s) => s.totalDays >= 20 },
  { id: 'days_50',      icon: '🎖️', name: '50 Gün Savaşçısı', desc: '50 antrenman günü',            color: '#8B5CF6', check: (s) => s.totalDays >= 50 },
  { id: 'streak_3',     icon: '⚡', name: '3 Günlük Seri',     desc: '3 gün üst üste',               color: '#14B8A6', check: (s) => s.streak >= 3 },
  { id: 'streak_7',     icon: '🔥', name: '7 Gün Serisi',      desc: '7 gün üst üste',               color: '#F5A623', check: (s) => s.streak >= 7 },
  { id: 'streak_14',    icon: '💥', name: 'İki Hafta Alev',    desc: '14 gün üst üste',              color: '#E94560', check: (s) => s.streak >= 14 },
  { id: 'streak_30',    icon: '🌋', name: 'Aylık Yanardağ',    desc: '30 gün üst üste',              color: '#EC4899', check: (s) => s.streak >= 30 },

  // Kilo
  { id: 'weight_log',   icon: '⚖️', name: 'Kilo Takibi',       desc: 'İlk kilonu kaydet',            color: '#3B82F6', check: (s) => s.weightEntries >= 1 },
  { id: 'weight_7',     icon: '📉', name: '7 Gün Kilo',        desc: '7 farklı günde kilo kaydet',   color: '#14B8A6', check: (s) => s.weightEntries >= 7 },
  { id: 'weight_1kg',   icon: '🎯', name: '1kg Fark',          desc: 'Başlangıçtan 1kg ilerleme',    color: '#10B981', check: (s) => s.weightProgress >= 1 },
  { id: 'weight_3kg',   icon: '📈', name: '3kg Fark',          desc: 'Başlangıçtan 3kg ilerleme',    color: '#10B981', check: (s) => s.weightProgress >= 3 },
  { id: 'weight_5kg',   icon: '🏅', name: '5kg Fark',          desc: 'Başlangıçtan 5kg ilerleme',    color: '#F5A623', check: (s) => s.weightProgress >= 5 },

  // Hacim
  { id: 'vol_1t',       icon: '🔩', name: '1 Ton Hacim',       desc: 'Tek seansta 1000kg kaldır',    color: '#3B82F6', check: (s) => s.maxSessionVolume >= 1000 },
  { id: 'vol_5t',       icon: '🏗️', name: '5 Ton Seans',       desc: 'Tek seansta 5000kg kaldır',    color: '#8B5CF6', check: (s) => s.maxSessionVolume >= 5000 },
];

function computeStats(logs, weights, startWeight) {
  let totalSets = 0, totalDays = 0, maxSessionVolume = 0;
  let streak = 0;
  const today = new Date();

  // Total sets & days
  for (const [date, dayLogs] of Object.entries(logs)) {
    let dayDone = false;
    let dayVol = 0;
    for (const exLogs of Object.values(dayLogs)) {
      for (const s of Object.values(exLogs)) {
        if (s?.done) {
          totalSets++;
          dayDone = true;
          if (s.weight && s.reps) dayVol += Number(s.weight) * parseInt(s.reps);
        }
      }
    }
    if (dayDone) totalDays++;
    if (dayVol > maxSessionVolume) maxSessionVolume = dayVol;
  }

  // Streak
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const ds = d.toISOString().split('T')[0];
    const dl = logs[ds];
    const active = dl && Object.values(dl).some(ex => Object.values(ex).some(s => s?.done));
    if (active) streak++;
    else if (i > 0) break;
  }

  // Weight progress
  const weightEntries = Object.keys(weights).length;
  const latestWeight = Object.entries(weights).sort(([a], [b]) => b.localeCompare(a))[0]?.[1];
  const weightProgress = startWeight && latestWeight ? Math.abs(startWeight - latestWeight) : 0;

  return { totalSets, totalDays, streak, weightEntries, weightProgress, maxSessionVolume };
}

export default function AchievementBadges() {
  const { logs } = useWorkoutStore();
  const { weights, startWeight } = useProgressStore();
  const stats = computeStats(logs, weights, startWeight);

  const unlocked = BADGES.filter(b => b.check(stats));
  const locked = BADGES.filter(b => !b.check(stats));

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-2">
        <MiniStat label="Kazanılan" value={`${unlocked.length}/${BADGES.length}`} color="#F5A623" />
        <MiniStat label="Toplam Set" value={stats.totalSets} color="#14B8A6" />
        <MiniStat label="Antrenman" value={`${stats.totalDays} gün`} color="#8B5CF6" />
      </div>

      {/* Unlocked */}
      {unlocked.length > 0 && (
        <>
          <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">Kazanılanlar ✓</p>
          <div className="grid grid-cols-3 gap-2">
            {unlocked.map(b => <BadgeCard key={b.id} badge={b} earned />)}
          </div>
        </>
      )}

      {/* Locked */}
      {locked.length > 0 && (
        <>
          <p className="text-xs font-semibold text-white/30 uppercase tracking-wider mt-2">Kilitli</p>
          <div className="grid grid-cols-3 gap-2">
            {locked.map(b => <BadgeCard key={b.id} badge={b} earned={false} />)}
          </div>
        </>
      )}
    </div>
  );
}

function BadgeCard({ badge, earned }) {
  return (
    <div
      className="rounded-2xl p-3 flex flex-col items-center gap-1 text-center"
      style={{
        backgroundColor: earned ? `${badge.color}18` : 'rgba(255,255,255,0.03)',
        border: `1px solid ${earned ? badge.color + '40' : 'rgba(255,255,255,0.06)'}`,
      }}
    >
      <span className="text-2xl" style={{ filter: earned ? 'none' : 'grayscale(100%) opacity(0.3)' }}>
        {badge.icon}
      </span>
      <p className="text-xs font-bold leading-tight" style={{ color: earned ? badge.color : 'rgba(255,255,255,0.2)' }}>
        {badge.name}
      </p>
      <p className="text-xs text-white/30 leading-tight">{badge.desc}</p>
    </div>
  );
}

function MiniStat({ label, value, color }) {
  return (
    <div className="bg-bg-card rounded-xl p-3 text-center">
      <p className="text-base font-bold" style={{ color }}>{value}</p>
      <p className="text-xs text-white/40 mt-0.5">{label}</p>
    </div>
  );
}
