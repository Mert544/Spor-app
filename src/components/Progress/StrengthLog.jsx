import useWorkoutStore from '../../store/useWorkoutStore';

const KEY_EXERCISES = [
  { id: 'pa2', name: 'Smith Bench', muscle: 'Göğüs' },
  { id: 'pb1', name: 'Pull-Up', muscle: 'Sırt' },
  { id: 'pc2', name: 'OHP', muscle: 'Omuz' },
  { id: 'pa6', name: 'Dips', muscle: 'Trisep' },
  { id: 'pb3', name: 'Cable Row', muscle: 'Sırt' },
];

const MUSCLE_COLOR = {
  'Göğüs': '#E94560', 'Sırt': '#3B82F6', 'Omuz': '#F5A623',
  'Trisep': '#EC4899', 'Bisep': '#8B5CF6',
};

export default function StrengthLog() {
  const { logs } = useWorkoutStore();

  function getBest(exerciseId) {
    let best = null;
    Object.values(logs).forEach(dayLogs => {
      const exLogs = dayLogs[exerciseId] || {};
      Object.values(exLogs).forEach(s => {
        if (s.done && s.weight) {
          const w = Number(s.weight);
          if (!best || w > best) best = w;
        }
      });
    });
    return best;
  }

  return (
    <div className="space-y-2">
      {KEY_EXERCISES.map(ex => {
        const best = getBest(ex.id);
        const color = MUSCLE_COLOR[ex.muscle] || '#fff';
        return (
          <div key={ex.id} className="flex items-center gap-3 bg-bg-dark rounded-xl px-4 py-3">
            <div
              className="w-1.5 h-10 rounded-full flex-shrink-0"
              style={{ backgroundColor: color }}
            />
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">{ex.name}</p>
              <p className="text-xs text-white/40">{ex.muscle}</p>
            </div>
            <div className="text-right">
              {best ? (
                <p className="text-lg font-bold" style={{ color }}>{best} kg</p>
              ) : (
                <p className="text-white/20 text-sm">—</p>
              )}
              <p className="text-xs text-white/30">en iyi set</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
