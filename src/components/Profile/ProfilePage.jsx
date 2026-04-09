import { useState } from 'react';
import WeeklyCheckIn from './WeeklyCheckIn';
import useProgressStore from '../../store/useProgressStore';
import useWorkoutStore from '../../store/useWorkoutStore';
import useSettingsStore from '../../store/useSettingsStore';
import { PHASES, getPhaseFromWeek } from '../../data/program';

export default function ProfilePage() {
  const { currentWeek, setCurrentWeek, startWeight, targetWeight } = useProgressStore();
  const { clearCoachSession } = useSettingsStore();
  const progressStore = useProgressStore();
  const workoutStore = useWorkoutStore();
  const [showReset, setShowReset] = useState(false);

  const phase = getPhaseFromWeek(currentWeek);
  const phaseData = PHASES[phase];

  function handleExport() {
    const data = {
      exportedAt: new Date().toISOString(),
      progress: progressStore,
      workoutLogs: workoutStore.logs,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vtaper-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleReset() {
    localStorage.removeItem('vtaper-workout-logs');
    localStorage.removeItem('vtaper-progress');
    localStorage.removeItem('vtaper-settings');
    clearCoachSession();
    window.location.reload();
  }

  return (
    <div className="flex-1 overflow-y-auto pb-32 scrollbar-hide">
      <div className="px-4 pt-4">
        <h1 className="text-xl font-bold text-white mb-4">Profil</h1>

        {/* User card */}
        <div className="bg-bg-card rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-14 h-14 rounded-full bg-accent-teal flex items-center justify-center text-2xl">
              💪
            </div>
            <div>
              <p className="text-lg font-bold text-white">Mert</p>
              <p className="text-xs text-white/40">186 cm · V-Taper Programı</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <InfoCell label="Başlangıç" value={`${startWeight} kg`} />
            <InfoCell label="Hedef" value={`${targetWeight} kg`} color="#E94560" />
            <InfoCell label="Fark" value={`-${(startWeight - targetWeight).toFixed(1)} kg`} color="#10B981" />
          </div>
        </div>

        {/* Week selector */}
        <div className="bg-bg-card rounded-2xl p-4 mb-4">
          <p className="text-xs font-semibold text-white/50 mb-3 uppercase tracking-wider">Aktif Hafta</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {Array.from({ length: 12 }, (_, i) => i + 1).map(w => (
              <button
                key={w}
                onClick={() => setCurrentWeek(w)}
                className="w-9 h-9 rounded-xl text-sm font-semibold transition-all"
                style={w === currentWeek
                  ? { backgroundColor: '#14B8A6', color: '#fff' }
                  : { backgroundColor: '#0a0f1a', color: 'rgba(255,255,255,0.4)' }
                }
              >
                {w}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Hafta {currentWeek}</p>
              <p className="text-xs text-white/40">{phaseData?.name}</p>
            </div>
            <div
              className="px-3 py-1 rounded-full text-xs font-bold"
              style={{ backgroundColor: `${['#14B8A6', '#F5A623', '#E94560'][phase - 1]}22`, color: ['#14B8A6', '#F5A623', '#E94560'][phase - 1] }}
            >
              Faz {phase}
            </div>
          </div>
        </div>

        {/* Weekly check-in */}
        <div className="mb-4">
          <WeeklyCheckIn week={currentWeek} />
        </div>

        {/* Actions */}
        <div className="space-y-2 mb-4">
          <button
            onClick={handleExport}
            className="w-full bg-bg-card border border-white/10 text-white font-medium py-3 rounded-xl text-sm text-left px-4 flex items-center gap-3"
          >
            <span className="text-lg">📤</span>
            <span>Veriyi Dışa Aktar (JSON)</span>
          </button>
        </div>

        {/* Danger zone */}
        <div className="bg-bg-card rounded-2xl p-4 border border-accent-red/20">
          <p className="text-xs font-semibold text-accent-red mb-3 uppercase tracking-wider">Tehlikeli Bölge</p>
          {!showReset ? (
            <button
              onClick={() => setShowReset(true)}
              className="w-full py-2.5 rounded-xl text-sm font-medium text-accent-red border border-accent-red/30"
            >
              Tüm Verileri Sıfırla
            </button>
          ) : (
            <div>
              <p className="text-xs text-white/60 mb-3">Bu işlem geri alınamaz. Tüm antrenman verilerin silinecek.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowReset(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-bg-dark text-white/60"
                >
                  İptal
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-accent-red text-white"
                >
                  Evet, Sıfırla
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-white/20 text-xs mt-6 mb-2">V-Taper Coach v1.0</p>
      </div>
    </div>
  );
}

function InfoCell({ label, value, color }) {
  return (
    <div className="bg-bg-dark rounded-xl p-2.5 text-center">
      <p className="text-xs text-white/40 mb-0.5">{label}</p>
      <p className="text-sm font-bold" style={{ color: color || 'rgba(255,255,255,0.8)' }}>{value}</p>
    </div>
  );
}
