import useWorkoutStore from '../../store/useWorkoutStore';
import useProgressStore from '../../store/useProgressStore';

const CATEGORIES = [
  {
    id: 'baslangic', label: 'Başlangıç', emoji: '🌱', color: '#14B8A6',
    badges: [
      { id: 'first_log',     icon: '👟', name: 'İlk Adım',       desc: 'İlk seti kaydet',          metric: 'totalSets',          threshold: 1 },
      { id: 'first_day',     icon: '📅', name: 'İlk Gün',        desc: 'İlk antrenman günü',       metric: 'totalDays',          threshold: 1 },
      { id: 'weight_first',  icon: '⚖️', name: 'Kilo Takibi',    desc: 'İlk kilonu kaydet',        metric: 'weightEntries',      threshold: 1 },
      { id: 'measure_first', icon: '📏', name: 'Ölçüm Başladı',  desc: 'İlk ölçümünü kaydet',     metric: 'measurementEntries', threshold: 1 },
    ]
  },
  {
    id: 'setler', label: 'Set Dağları', emoji: '💪', color: '#3B82F6',
    badges: [
      { id: 'sets_10',   icon: '💪', name: '10 Set',            desc: '10 set tamamla',   metric: 'totalSets', threshold: 10   },
      { id: 'sets_50',   icon: '🏋️', name: '50 Set',            desc: '50 set tamamla',   metric: 'totalSets', threshold: 50   },
      { id: 'sets_200',  icon: '🔩', name: '200 Set',           desc: '200 set tamamla',  metric: 'totalSets', threshold: 200  },
      { id: 'sets_500',  icon: '🏆', name: '500 Set Ustası',    desc: '500 set tamamla',  metric: 'totalSets', threshold: 500  },
      { id: 'sets_1000', icon: '💎', name: '1000 Set Efsanesi', desc: '1000 set tamamla', metric: 'totalSets', threshold: 1000 },
      { id: 'sets_2000', icon: '👑', name: '2000 Set Tanrısı',  desc: '2000 set tamamla', metric: 'totalSets', threshold: 2000 },
    ]
  },
  {
    id: 'sureklilik', label: 'Demir Disiplin', emoji: '📅', color: '#8B5CF6',
    badges: [
      { id: 'days_5',   icon: '⚡', name: 'Ritim',           desc: '5 antrenman günü',   metric: 'totalDays', threshold: 5   },
      { id: 'days_20',  icon: '🔥', name: 'Demir Düzeni',    desc: '20 antrenman günü',  metric: 'totalDays', threshold: 20  },
      { id: 'days_50',  icon: '🎖️', name: '50 Gün Savaşçı', desc: '50 antrenman günü',  metric: 'totalDays', threshold: 50  },
      { id: 'days_100', icon: '🏅', name: '100 Gün',         desc: '100 antrenman günü', metric: 'totalDays', threshold: 100 },
      { id: 'days_200', icon: '🌋', name: '200 Gün Titan',   desc: '200 antrenman günü', metric: 'totalDays', threshold: 200 },
    ]
  },
  {
    id: 'seri', label: 'Kesintisiz Seri', emoji: '🔥', color: '#E94560',
    badges: [
      { id: 'streak_3',  icon: '⚡', name: '3 Günlük Seri',  desc: '3 gün üst üste',  metric: 'streak', threshold: 3  },
      { id: 'streak_7',  icon: '🔥', name: '7 Gün Serisi',   desc: '7 gün üst üste',  metric: 'streak', threshold: 7  },
      { id: 'streak_14', icon: '💥', name: 'İki Hafta Alev', desc: '14 gün üst üste', metric: 'streak', threshold: 14 },
      { id: 'streak_30', icon: '🌋', name: 'Aylık Yanardağ', desc: '30 gün üst üste', metric: 'streak', threshold: 30 },
      { id: 'streak_60', icon: '☀️', name: '2 Aylık Güneş',  desc: '60 gün üst üste', metric: 'streak', threshold: 60 },
    ]
  },
  {
    id: 'hacim_seans', label: 'Seans Gücü', emoji: '⚡', color: '#F5A623',
    badges: [
      { id: 'vol_1t',  icon: '🔩', name: '1 Ton Seans',   desc: 'Seansta 1.000 kg',  metric: 'maxSessionVolume', threshold: 1000  },
      { id: 'vol_5t',  icon: '🏗️', name: '5 Ton Seans',   desc: 'Seansta 5.000 kg',  metric: 'maxSessionVolume', threshold: 5000  },
      { id: 'vol_10t', icon: '🚀', name: '10 Ton Seans',  desc: 'Seansta 10.000 kg', metric: 'maxSessionVolume', threshold: 10000 },
      { id: 'vol_20t', icon: '💥', name: '20 Ton Seans',  desc: 'Seansta 20.000 kg', metric: 'maxSessionVolume', threshold: 20000 },
    ]
  },
  {
    id: 'hacim_toplam', label: 'Kümülatif Hacim', emoji: '🏋️', color: '#EC4899',
    badges: [
      { id: 'tvol_10t',  icon: '💪', name: '10 Ton Biriken',  desc: 'Toplam 10.000 kg kaldır',  metric: 'totalVolume', threshold: 10000  },
      { id: 'tvol_50t',  icon: '🏋️', name: '50 Ton Biriken',  desc: 'Toplam 50.000 kg kaldır',  metric: 'totalVolume', threshold: 50000  },
      { id: 'tvol_100t', icon: '🔩', name: '100 Ton Biriken', desc: 'Toplam 100.000 kg kaldır', metric: 'totalVolume', threshold: 100000 },
      { id: 'tvol_250t', icon: '🌟', name: '250 Ton Titan',   desc: 'Toplam 250.000 kg kaldır', metric: 'totalVolume', threshold: 250000 },
      { id: 'tvol_500t', icon: '💎', name: '500 Ton Efsane',  desc: 'Toplam 500.000 kg kaldır', metric: 'totalVolume', threshold: 500000 },
    ]
  },
  {
    id: 'kilo', label: 'Vücut Dönüşümü', emoji: '⚖️', color: '#10B981',
    badges: [
      { id: 'weight_7',   icon: '📉', name: '7 Gün Kilo',    desc: '7 farklı günde kilo',  metric: 'weightEntries',  threshold: 7  },
      { id: 'weight_30',  icon: '📊', name: '30 Gün Kilo',   desc: '30 farklı günde kilo', metric: 'weightEntries',  threshold: 30 },
      { id: 'weight_1kg', icon: '🎯', name: '1 kg Fark',     desc: '1 kg ilerleme',        metric: 'weightProgress', threshold: 1  },
      { id: 'weight_3kg', icon: '📈', name: '3 kg Fark',     desc: '3 kg ilerleme',        metric: 'weightProgress', threshold: 3  },
      { id: 'weight_5kg', icon: '🏅', name: '5 kg Hedef',    desc: '5 kg ilerleme',        metric: 'weightProgress', threshold: 5  },
      { id: 'weight_7kg', icon: '🏆', name: '7 kg Dönüşüm', desc: '7 kg ilerleme',        metric: 'weightProgress', threshold: 7  },
    ]
  },
  {
    id: 'hafta', label: 'Program Yolculuğu', emoji: '🗓️', color: '#6366F1',
    badges: [
      { id: 'week_2',  icon: '🌱', name: 'Hafta 2',       desc: '2. haftaya ulaş',  metric: 'currentWeek', threshold: 2  },
      { id: 'week_4',  icon: '⚡', name: 'Hafta 4',       desc: '4. haftaya ulaş',  metric: 'currentWeek', threshold: 4  },
      { id: 'week_8',  icon: '🔥', name: 'Faz 2 Kapısı', desc: '8. haftaya ulaş',  metric: 'currentWeek', threshold: 8  },
      { id: 'week_12', icon: '🏆', name: 'Faz 3 Doruk',  desc: '12. haftaya ulaş', metric: 'currentWeek', threshold: 12 },
      { id: 'week_16', icon: '💎', name: '16 Hafta',      desc: '16. haftaya ulaş', metric: 'currentWeek', threshold: 16 },
    ]
  },
];

function computeStats(logs, weights, startWeight, measurements, currentWeek) {
  let totalSets = 0, totalDays = 0, maxSessionVolume = 0, totalVolume = 0;
  let streak = 0;
  const today = new Date();

  for (const [, dayLogs] of Object.entries(logs)) {
    let dayDone = false, dayVol = 0;
    for (const exLogs of Object.values(dayLogs)) {
      for (const s of Object.values(exLogs)) {
        if (s?.done) {
          totalSets++;
          dayDone = true;
          if (s.weight && s.reps) {
            const vol = Number(s.weight) * parseInt(s.reps);
            dayVol += vol;
            totalVolume += vol;
          }
        }
      }
    }
    if (dayDone) totalDays++;
    if (dayVol > maxSessionVolume) maxSessionVolume = dayVol;
  }

  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const ds = d.toISOString().split('T')[0];
    const dl = logs[ds];
    const active = dl && Object.values(dl).some(ex => Object.values(ex).some(s => s?.done));
    if (active) streak++;
    else if (i > 0) break;
  }

  const weightEntries = Object.keys(weights).length;
  const latestWeight = Object.entries(weights).sort(([a], [b]) => b.localeCompare(a))[0]?.[1];
  const weightProgress = startWeight && latestWeight ? Math.abs(startWeight - latestWeight) : 0;
  const measurementEntries = Object.keys(measurements).length;

  return { totalSets, totalDays, streak, weightEntries, weightProgress, maxSessionVolume, totalVolume, measurementEntries, currentWeek };
}

function fmtVal(val, threshold) {
  if (!val || val <= 0) return null;
  const fmt = (n) => n >= 100000 ? `${(n / 1000).toFixed(0)}k` : n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n % 1 !== 0 ? n.toFixed(1) : String(n);
  return `${fmt(val)}/${fmt(threshold)}`;
}

function fmtVolume(v) {
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M kg`;
  if (v >= 1000) return `${(v / 1000).toFixed(1)}t`;
  return `${v} kg`;
}

export default function AchievementBadges() {
  const { logs } = useWorkoutStore();
  const { weights, measurements, startWeight, currentWeek } = useProgressStore();
  const stats = computeStats(logs, weights, startWeight, measurements || {}, currentWeek);

  const totalBadges = CATEGORIES.reduce((a, c) => a + c.badges.length, 0);
  const unlockedCount = CATEGORIES.reduce(
    (a, c) => a + c.badges.filter(b => stats[b.metric] >= b.threshold).length,
    0
  );

  return (
    <div className="space-y-5">
      {/* Summary header */}
      <div className="grid grid-cols-5 gap-1.5">
        <MiniStat label="Rozet" value={`${unlockedCount}/${totalBadges}`} color="#F5A623" />
        <MiniStat label="Set" value={stats.totalSets} color="#14B8A6" />
        <MiniStat label="Gün" value={stats.totalDays} color="#8B5CF6" />
        <MiniStat label="Hacim" value={fmtVolume(stats.totalVolume)} color="#EC4899" />
        <MiniStat label="Seri" value={`${stats.streak}g`} color="#E94560" />
      </div>

      {/* Category sections */}
      {CATEGORIES.map(cat => (
        <CategorySection key={cat.id} category={cat} stats={stats} />
      ))}
    </div>
  );
}

function CategorySection({ category, stats }) {
  const earned = category.badges.filter(b => (stats[b.metric] ?? 0) >= b.threshold);
  const next = category.badges.find(b => (stats[b.metric] ?? 0) < b.threshold);
  const pct = next ? Math.min(((stats[next.metric] ?? 0) / next.threshold) * 100, 100) : 100;

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm">{category.emoji}</span>
        <p className="text-xs font-semibold text-white/50 uppercase tracking-wider flex-1">{category.label}</p>
        <span
          className="text-xs font-bold"
          style={{ color: earned.length === category.badges.length ? category.color : 'rgba(255,255,255,0.25)' }}
        >
          {earned.length}/{category.badges.length}
        </span>
      </div>

      {next && (
        <div className="mb-2.5 flex items-center gap-2">
          <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${isNaN(pct) ? 0 : pct}%`, backgroundColor: category.color }}
            />
          </div>
          <span className="text-xs text-white/25 whitespace-nowrap min-w-max">{next.name} →</span>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2">
        {category.badges.map(b => (
          <BadgeCard
            key={b.id}
            badge={b}
            earned={(stats[b.metric] ?? 0) >= b.threshold}
            color={category.color}
            current={stats[b.metric] ?? 0}
          />
        ))}
      </div>
    </div>
  );
}

function BadgeCard({ badge, earned, color, current }) {
  const progressStr = !earned && current > 0 ? fmtVal(current, badge.threshold) : null;

  return (
    <div
      className="rounded-2xl p-3 flex flex-col items-center gap-1 text-center transition-all"
      style={{
        backgroundColor: earned ? `${color}14` : 'rgba(255,255,255,0.025)',
        border: `1px solid ${earned ? color + '35' : 'rgba(255,255,255,0.06)'}`,
      }}
    >
      <span
        className="text-xl leading-none"
        style={{ filter: earned ? 'none' : 'grayscale(100%) opacity(0.2)' }}
      >
        {badge.icon}
      </span>
      <p
        className="text-xs font-bold leading-tight mt-0.5"
        style={{ color: earned ? color : 'rgba(255,255,255,0.2)' }}
      >
        {badge.name}
      </p>
      <p className="text-xs leading-tight" style={{ color: earned ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.15)' }}>
        {progressStr || badge.desc}
      </p>
    </div>
  );
}

function MiniStat({ label, value, color }) {
  return (
    <div className="bg-bg-card rounded-xl p-2.5 text-center">
      <p className="text-sm font-bold leading-tight" style={{ color }}>{value}</p>
      <p className="text-xs text-white/35 mt-0.5">{label}</p>
    </div>
  );
}
