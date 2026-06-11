// Egzersiz Kütüphanesi — 100+ egzersizlik havuzu gezilebilir hale getirir:
// arama + kas/tier/ekipman filtreleri, detayda reçete/tempo/video/alternatifler.
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X, Play } from 'lucide-react';
import { EXERCISE_POOL } from '../../data/exercisePool';
import { getVideoUrl } from '../../data/videos';
import { getAlternatives } from '../../data/exerciseAlternatives';
import { explainTempo } from '../Workout/ExerciseCard';

const MUSCLE_COLOR = {
  'Göğüs': '#E94560', 'Sırt': '#3B82F6', 'Omuz': '#F5A623',
  'Trisep': '#EC4899', 'Triseps': '#EC4899',
  'Bisep': '#8B5CF6', 'Biseps': '#8B5CF6',
  'Bacak': '#10B981', 'Kuadriseps': '#10B981', 'Hamstring': '#F97316',
  'Kor': '#14B8A6', 'Karın': '#14B8A6',
  'Kalça': '#10B981', 'Baldır': '#6B7280',
};
const mc = (m) => MUSCLE_COLOR[m] || '#94A3B8';

const TIER_INFO = {
  T1: { label: 'T1', desc: 'Ana compound', color: '#E94560' },
  T2: { label: 'T2', desc: 'İkincil', color: '#F5A623' },
  T3: { label: 'T3', desc: 'İzolasyon', color: '#14B8A6' },
};

const EQUIPMENT_LABEL = {
  full_gym: 'Salon',
  minimal: 'Minimal',
  bodyweight: 'Vücut Ağırlığı',
};

const PATTERN_LABEL = {
  push_h: 'Yatay İtiş', push_v: 'Dikey İtiş',
  pull_h: 'Yatay Çekiş', pull_v: 'Dikey Çekiş',
  squat: 'Squat', hinge: 'Kalça Menteşesi', lunge: 'Lunge',
  core: 'Kor', carry: 'Taşıma', cardio: 'Kardiyo', full_body: 'Tam Vücut',
  isolation_arm: 'Kol İzolasyonu', isolation_shoulder: 'Omuz İzolasyonu',
  isolation_leg: 'Bacak İzolasyonu', isolation_glute: 'Kalça İzolasyonu',
  isolation_trap: 'Trapez İzolasyonu',
};

const GOAL_LABEL = {
  hypertrophy: 'Hipertrofi', strength: 'Kuvvet',
  fat_loss: 'Yağ Yakımı', endurance: 'Dayanıklılık', athletic: 'Atletik',
};

const LEVEL_LABEL = { beginner: 'Başlangıç', intermediate: 'Orta', advanced: 'İleri' };

function DetailSheet({ ex, onClose }) {
  const tempoText = explainTempo(ex.tempo);
  const alternatives = getAlternatives(ex.name);
  const tier = TIER_INFO[ex.tier];

  return (
    <div className="fixed inset-0 z-[70] bg-black/60 flex items-end justify-center" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-bg-card rounded-t-3xl border-t border-white/10 max-h-[85vh] overflow-y-auto pb-safe"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-bg-card pt-3 pb-2 px-4 border-b border-white/[0.06]">
          <div className="w-10 h-1 rounded-full bg-white/15 mx-auto mb-3" />
          <div className="flex items-start gap-3">
            <span className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: mc(ex.muscle) }} />
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold text-white leading-tight">{ex.name}</h2>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-xs" style={{ color: mc(ex.muscle) }}>{ex.muscle}</span>
                {tier && (
                  <span className="text-xs px-1.5 py-0.5 rounded font-bold"
                    style={{ backgroundColor: tier.color + '20', color: tier.color }}>
                    {tier.label} · {tier.desc}
                  </span>
                )}
                <span className="text-xs px-1.5 py-0.5 rounded bg-white/5 text-white/50">
                  {EQUIPMENT_LABEL[ex.equipment] || ex.equipment}
                </span>
                {ex.pattern && PATTERN_LABEL[ex.pattern] && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-white/5 text-white/50">
                    {PATTERN_LABEL[ex.pattern]}
                  </span>
                )}
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/5 text-white/50 flex items-center justify-center flex-shrink-0">
              <X size={15} />
            </button>
          </div>
        </div>

        <div className="px-4 py-4 space-y-4">
          {/* Reçete */}
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wide mb-2">Önerilen Reçete</p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'Set', value: ex.sets },
                { label: 'Tekrar', value: ex.reps },
                { label: 'RPE', value: ex.rpe || '-' },
                { label: 'Dinlenme', value: ex.rest ? `${ex.rest}sn` : '-' },
              ].map((s) => (
                <div key={s.label} className="rounded-xl py-2 px-1 text-center bg-white/[0.04] border border-white/[0.06]">
                  <p className="text-sm font-bold text-white">{s.value}</p>
                  <p className="text-[10px] text-white/40 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
            {tempoText && (
              <p className="text-xs text-white/40 mt-2 px-1">
                Tempo <span className="font-mono text-white/60">{ex.tempo}</span> — {tempoText}
              </p>
            )}
          </div>

          {/* Uygunluk */}
          {(ex.goals?.length > 0 || ex.levels?.length > 0) && (
            <div>
              <p className="text-xs text-white/40 uppercase tracking-wide mb-2">Uygunluk</p>
              <div className="flex flex-wrap gap-1.5">
                {(ex.goals || []).map((g) => (
                  <span key={g} className="text-xs px-2 py-0.5 rounded-full bg-[#14B8A6]/10 text-[#14B8A6] border border-[#14B8A6]/20">
                    {GOAL_LABEL[g] || g}
                  </span>
                ))}
                {(ex.levels || []).map((l) => (
                  <span key={l} className="text-xs px-2 py-0.5 rounded-full bg-white/[0.04] text-white/50 border border-white/[0.06]">
                    {LEVEL_LABEL[l] || l}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Alternatifler */}
          {alternatives.length > 0 && (
            <div>
              <p className="text-xs text-white/40 uppercase tracking-wide mb-2">Alternatifler</p>
              <div className="space-y-1">
                {alternatives.map((alt, i) => (
                  <div key={i} className="text-xs text-white/60 px-1 py-0.5 flex items-center gap-1.5">
                    <span className="text-white/30">•</span> {alt}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Video */}
          <a
            href={getVideoUrl(ex.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold text-white transition-all active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #E94560, #E94560bb)' }}
          >
            <Play size={15} /> Form Videosunu İzle
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ExerciseLibraryPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [muscle, setMuscle] = useState('Tümü');
  const [tier, setTier] = useState('Tümü');
  const [equipment, setEquipment] = useState('Tümü');
  const [detail, setDetail] = useState(null);

  const muscles = useMemo(
    () => ['Tümü', ...new Set(EXERCISE_POOL.map((e) => e.muscle))].sort((a, b) =>
      a === 'Tümü' ? -1 : b === 'Tümü' ? 1 : a.localeCompare(b, 'tr')),
    []
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return EXERCISE_POOL.filter((ex) => {
      if (q && !ex.name.toLowerCase().includes(q) && !ex.muscle.toLowerCase().includes(q)) return false;
      if (muscle !== 'Tümü' && ex.muscle !== muscle) return false;
      if (tier !== 'Tümü' && ex.tier !== tier) return false;
      if (equipment !== 'Tümü' && ex.equipment !== equipment) return false;
      return true;
    }).sort((a, b) => (a.tier || 'T9').localeCompare(b.tier || 'T9') || a.name.localeCompare(b.name, 'tr'));
  }, [search, muscle, tier, equipment]);

  const pill = (active, color = '#14B8A6') => active
    ? { backgroundColor: color + '25', color, border: `1px solid ${color}50` }
    : { backgroundColor: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' };

  return (
    <div className="flex-1 overflow-y-auto pb-32 scrollbar-hide">
      {detail && <DetailSheet ex={detail} onClose={() => setDetail(null)} />}

      <div className="px-4 pt-4">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 text-white/60 flex-shrink-0"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">Egzersiz Kütüphanesi</h1>
            <p className="text-xs text-white/40">{filtered.length} / {EXERCISE_POOL.length} egzersiz</p>
          </div>
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Egzersiz ara…"
          className="w-full bg-bg-card rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30
                     border border-white/10 focus:border-[#14B8A6]/50 outline-none mb-2.5"
        />

        {/* Kas filtresi */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-2">
          {muscles.map((m) => (
            <button key={m} onClick={() => setMuscle(m)}
              className="shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all"
              style={pill(muscle === m, m === 'Tümü' ? '#14B8A6' : mc(m))}>
              {m}
            </button>
          ))}
        </div>

        {/* Tier + ekipman filtresi */}
        <div className="flex gap-1.5 pb-3 flex-wrap">
          {['Tümü', 'T1', 'T2', 'T3'].map((t) => (
            <button key={t} onClick={() => setTier(t)}
              className="px-2.5 py-1 rounded-full text-xs font-medium transition-all"
              style={pill(tier === t, TIER_INFO[t]?.color || '#14B8A6')}>
              {t === 'Tümü' ? 'Tüm Tier' : `${t} · ${TIER_INFO[t].desc}`}
            </button>
          ))}
          {Object.entries(EQUIPMENT_LABEL).map(([k, label]) => (
            <button key={k} onClick={() => setEquipment(equipment === k ? 'Tümü' : k)}
              className="px-2.5 py-1 rounded-full text-xs font-medium transition-all"
              style={pill(equipment === k, '#8B5CF6')}>
              {label}
            </button>
          ))}
        </div>

        {/* Liste */}
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-white/40 text-sm">Egzersiz bulunamadı.</p>
            <p className="text-white/25 text-xs mt-1">Filtreleri sadeleştirmeyi dene.</p>
          </div>
        )}
        <div className="space-y-1.5">
          {filtered.map((ex) => {
            const tierMeta = TIER_INFO[ex.tier];
            return (
              <button
                key={ex.id}
                onClick={() => setDetail(ex)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-bg-card border border-white/[0.06]
                           text-left transition-all active:scale-[0.99]"
              >
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: mc(ex.muscle) }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{ex.name}</p>
                  <p className="text-xs text-white/40 mt-0.5">
                    {ex.muscle} · {ex.sets}×{ex.reps}{ex.rpe && ex.rpe !== '-' ? ` · RPE ${ex.rpe}` : ''}
                  </p>
                </div>
                {tierMeta && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0"
                    style={{ backgroundColor: tierMeta.color + '20', color: tierMeta.color }}>
                    {tierMeta.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
