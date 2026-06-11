import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Egzersiz değiştirme (swap) — program reçetesi (set/tekrar/RPE/dinlenme)
// korunur, sadece egzersiz değişir. Günlük bazlı değil kalıcıdır:
// anahtar = `${programId}|${dayKey}|${exerciseId}`, değer = alternatif adı.
// Loglar swap'lı egzersiz için ayrı id altında tutulur (geçmiş karışmaz).

const useSwapStore = create(
  persist(
    (set, get) => ({
      swaps: {},

      setSwap: (key, altName) =>
        set((s) => ({ swaps: { ...s.swaps, [key]: altName } })),

      clearSwap: (key) =>
        set((s) => {
          const { [key]: _, ...rest } = s.swaps;
          return { swaps: rest };
        }),

      getSwap: (key) => get().swaps[key] ?? null,
    }),
    { name: 'vtaper-swaps' }
  )
);

// "DB Flat Bench Press" → "dbflatbenchpress" — swap'lı log id'si üretiminde
export function swapSlug(name) {
  return String(name).toLowerCase().replace(/[^a-z0-9çğıöşü]+/g, '');
}

// Programdaki egzersize varsa swap'ı uygula. origId korunur ki superset
// eşleştirmesi ve geri alma orijinal id üzerinden çalışsın.
export function applySwap(ex, swaps, programId, dayKey) {
  const swapKey = `${programId}|${dayKey}|${ex.id}`;
  const alt = swaps[swapKey];
  if (!alt) return { ...ex, swapKey };
  return {
    ...ex,
    swapKey,
    origId: ex.id,
    originalName: ex.name,
    id: `${ex.id}~${swapSlug(alt)}`,
    name: alt,
  };
}

export default useSwapStore;
