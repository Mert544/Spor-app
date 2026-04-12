// MesocycleView — Visual timeline of a mesocycle's phases
// Used in CreateProgramPage (preview) and potentially ProgramsPage

const PHASE_COLORS = {
  Birikim:        { bg: '#14B8A6', text: '#14B8A6' },
  Yoğunlaştırma:  { bg: '#F5A623', text: '#F5A623' },
  Deload:         { bg: '#8B5CF6', text: '#8B5CF6' },
  default:        { bg: '#3B82F6', text: '#3B82F6' },
};

function getPhaseColor(phaseName) {
  for (const [key, val] of Object.entries(PHASE_COLORS)) {
    if (phaseName?.includes(key)) return val;
  }
  return PHASE_COLORS.default;
}

export default function MesocycleView({ mesocycle, compact = false }) {
  if (!mesocycle?.phases?.length) return null;

  const { durationWeeks = 6, phases } = mesocycle;
  const weeks = Array.from({ length: durationWeeks }, (_, i) => i + 1);

  // Map week → phase
  const weekPhase = {};
  phases.forEach((phase) => {
    (phase.weeks ?? []).forEach((w) => { weekPhase[w] = phase; });
  });

  if (compact) {
    // Compact view: small colored pills showing phase durations
    return (
      <div className="flex items-center gap-1 flex-wrap">
        {phases.map((phase, i) => {
          const { bg } = getPhaseColor(phase.name);
          return (
            <div key={i}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
              style={{ backgroundColor: bg + '20', color: bg, border: `1px solid ${bg}30` }}
            >
              <span>{phase.weeks?.length ?? 1}hf</span>
              <span className="text-white/50">{phase.name}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div>
      {/* Week columns */}
      <div className="flex gap-1 mb-2">
        {weeks.map((w) => {
          const phase = weekPhase[w];
          const { bg } = phase ? getPhaseColor(phase.name) : { bg: '#fff' };
          const isDeload = !!phase?.volumeMultiplier;

          return (
            <div key={w} className="flex-1 flex flex-col items-center gap-1">
              {/* Bar */}
              <div
                className="w-full rounded-md"
                style={{
                  height: isDeload ? 20 : 36,
                  backgroundColor: bg + (isDeload ? '30' : '40'),
                  border: `1px solid ${bg}50`,
                }}
              />
              <span className="text-xs text-white/40">{w}</span>
            </div>
          );
        })}
      </div>

      {/* Phase legend */}
      <div className="flex flex-wrap gap-2 mt-1">
        {phases.map((phase, i) => {
          const { bg } = getPhaseColor(phase.name);
          const isDeload = !!phase?.volumeMultiplier;
          return (
            <div key={i} className="flex items-center gap-1.5">
              <div
                className="w-3 h-2 rounded-sm"
                style={{
                  backgroundColor: bg + (isDeload ? '30' : '40'),
                  border: `1px solid ${bg}50`,
                }}
              />
              <span className="text-xs text-white/40">
                {phase.name}
                {phase.rpeMax ? ` ≤RPE${phase.rpeMax}` : ''}
                {isDeload ? ' (×40%)' : ''}
              </span>
            </div>
          );
        })}
      </div>

      {/* Week labels row (shows phase name under each block) */}
      <div className="flex gap-1 mt-2">
        {weeks.map((w) => {
          const phase = weekPhase[w];
          if (!phase) return <div key={w} className="flex-1" />;

          // Only label first week of each phase
          const isFirst = phase.weeks?.[0] === w;
          if (!isFirst) return <div key={w} className="flex-1" />;

          const { text } = getPhaseColor(phase.name);
          const span = phase.weeks?.length ?? 1;

          return (
            <div
              key={w}
              className="flex items-center justify-center text-xs font-semibold"
              style={{
                flex: span,
                color: text,
                fontSize: '10px',
              }}
            >
              {phase.name}
            </div>
          );
        })}
      </div>
    </div>
  );
}
