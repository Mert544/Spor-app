// ExercisePicker — Searchable modal to pick exercises + touch drag-drop reorder
import { useState, useMemo, useCallback, useRef } from 'react';
import { ALL_PROGRAMS } from '../../data/program';

const MUSCLE_COLOR = {
  'Göğüs': '#E94560', 'Sırt': '#3B82F6', 'Omuz': '#F5A623',
  'Trisep': '#EC4899', 'Triseps': '#EC4899',
  'Bisep': '#8B5CF6', 'Biseps': '#8B5CF6',
  'Bacak': '#10B981', 'Kuadriseps': '#10B981', 'Hamstring': '#F97316',
  'Kor': '#14B8A6', 'Karın': '#14B8A6',
  'Kalça': '#10B981', 'Baldır': '#6B7280',
};
function mc(muscle) { return MUSCLE_COLOR[muscle] || '#ffffff50'; }

function buildLibrary() {
  const seen = new Set();
  const list = [];
  Object.values(ALL_PROGRAMS).forEach(prog => {
    Object.values(prog.program || {}).forEach(day => {
      (day.exercises || []).forEach(ex => {
        const key = ex.name?.trim().toLowerCase();
        if (!key || seen.has(key)) return;
        seen.add(key);
        list.push({
          name:   ex.name,
          muscle: ex.muscle || 'Diğer',
          sets:   ex.sets   || 3,
          reps:   ex.reps   || '8-12',
          rpe:    ex.rpe    || '8',
          rest:   ex.rest   || 90,
          note:   ex.note   || '',
        });
      });
    });
  });
  return list.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
}

const LIBRARY = buildLibrary();
const ALL_MUSCLES = ['Tümü', ...new Set(LIBRARY.map(e => e.muscle))].sort((a, b) =>
  a === 'Tümü' ? -1 : a.localeCompare(b, 'tr')
);

function useDragReorder(items, setItems, onReorder) {
  const drag = useRef(null);
  const startY = useRef(0);

  const onTouchStart = useCallback((e, id) => {
    const t = e.touches[0];
    startY.current = t.clientY;
    drag.current = { id, startIdx: items.findIndex(i => i.id === id) };
  }, [items]);

  const onTouchMove = useCallback((e) => {
    if (!drag.current) return;
    const t = e.touches[0];
    const delta = t.clientY - startY.current;
    const itemH = 58;
    const idx = items.findIndex(i => i.id === drag.current.id);
    const newIdx = Math.max(0, Math.min(items.length - 1, idx + Math.round(delta / itemH)));
    if (newIdx !== idx) {
      const copy = [...items];
      const [moved] = copy.splice(idx, 1);
      copy.splice(newIdx, 0, moved);
      setItems(copy);
      startY.current = t.clientY;
    }
  }, [items, setItems]);

  const onTouchEnd = useCallback(() => {
    if (drag.current) onReorder(items);
    drag.current = null;
  }, [items, onReorder]);

  return { onTouchStart, onTouchMove, onTouchEnd };
}

export default function ExercisePicker({ onSelect, onClose, onReorder, items: reorderableItems }) {
  const [search, setSearch] = useState('');
  const [muscle, setMuscle] = useState('Tümü');
  const [localItems, setLocalItems] = useState(reorderableItems || []);
  const isReorder = !!onReorder;

  const { onTouchStart, onTouchMove, onTouchEnd } = useDragReorder(
    localItems, setLocalItems,
    useCallback((items) => onReorder?.(items), [onReorder])
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return LIBRARY.filter(ex => {
      const matchQ = !q || ex.name.toLowerCase().includes(q) || ex.muscle.toLowerCase().includes(q);
      const matchM = muscle === 'Tümü' || ex.muscle === muscle;
      return matchQ && matchM;
    });
  }, [search, muscle]);

  const handleSelect = useCallback((ex) => {
    if (isReorder) {
      const newItem = { ...ex, id: `pick_${Date.now()}_${Math.random().toString(36).slice(2, 6)}` };
      const next = [...localItems, newItem];
      setLocalItems(next);
      onReorder(next);
    } else {
      onSelect(ex);
    }
  }, [isReorder, localItems, onReorder, onSelect]);

  const handleRemove = useCallback((id) => {
    const next = localItems.filter(i => i.id !== id);
    setLocalItems(next);
    onReorder(next);
  }, [localItems, onReorder]);

  return (
    <div className="fixed inset-0 z-[60] bg-bg flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8 bg-bg shrink-0">
        <button onClick={onClose}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 text-white/60 text-lg"
          aria-label="Kapat">
          ✕
        </button>
        <h2 className="text-base font-semibold text-white flex-1">
          {isReorder ? 'Egzersizleri Sırala' : 'Egzersiz Seç'}
        </h2>
        <span className="text-xs text-white/30">
          {isReorder ? localItems.length : filtered.length}
          {isReorder ? ' egzersiz' : ' sonuç'}
        </span>
      </div>

      {/* Reorderable current items */}
      {isReorder && localItems.length > 0 && (
        <div
          className="px-4 py-2 border-b border-[#14B8A6]/20 bg-[#14B8A6]/5 shrink-0"
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <p className="text-xs text-[#14B8A6]/60 mb-2">Sürükle-bırak ile sırala, basılı tut</p>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {localItems.map((ex) => {
              const color = mc(ex.muscle);
              return (
                <div key={ex.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-card border border-white/10 active:scale-[0.98] transition-transform"
                  onTouchStart={(e) => onTouchStart(e, ex.id)}
                >
                  <span className="text-white/20 text-sm shrink-0 cursor-grab" aria-hidden="true">⠿</span>
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                  <span className="text-xs text-white/80 flex-1 truncate">{ex.name}</span>
                  <span className="text-xs text-white/30">{ex.sets}×{ex.reps}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleRemove(ex.id); }}
                    className="w-6 h-6 flex items-center justify-center rounded-full bg-[#E94560]/20 text-[#E94560] text-xs"
                    aria-label={`${ex.name} kaldır`}
                  >✕</button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="px-4 py-3 border-b border-white/6 bg-bg shrink-0">
        <input
          autoFocus
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Egzersiz ara…"
          className="w-full bg-bg-card rounded-xl px-4 py-2.5 text-sm text-white
                     placeholder:text-white/30 border border-white/10
                     focus:border-[#14B8A6]/50 outline-none"
        />
      </div>

      {/* Muscle filter pills */}
      <div className="flex gap-1.5 px-4 py-2.5 overflow-x-auto scrollbar-hide border-b border-white/6 bg-bg shrink-0">
        {ALL_MUSCLES.map(m => {
          const active = muscle === m;
          const color = m === 'Tümü' ? '#14B8A6' : mc(m);
          return (
            <button key={m} onClick={() => setMuscle(m)}
              className="shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all"
              style={active
                ? { backgroundColor: color + '25', color, border: `1px solid ${color}50` }
                : { backgroundColor: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }
              }>
              {m}
            </button>
          );
        })}
      </div>

      {/* Exercise list */}
      <div className="flex-1 overflow-y-auto pb-8">
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-white/30 text-sm">Egzersiz bulunamadı.</p>
            <p className="text-white/30 text-xs mt-1">Arama terimini değiştir.</p>
          </div>
        )}

        {filtered.map((ex, i) => {
          const color = mc(ex.muscle);
          return (
            <button key={i} onClick={() => handleSelect(ex)}
              className="w-full flex items-center gap-3 px-4 py-3 border-b border-white/5
                         hover:bg-white/3 active:bg-white/5 transition-colors text-left">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{ex.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs" style={{ color }}>{ex.muscle}</span>
                  <span className="text-xs text-white/30">·</span>
                  <span className="text-xs text-white/40">{ex.sets}×{ex.reps}</span>
                  {ex.rpe && <span className="text-xs text-white/30">RPE {ex.rpe}</span>}
                </div>
              </div>
              <span className="text-white/30 text-sm shrink-0">{isReorder ? '+' : '›'}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}