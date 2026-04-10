import { useState } from 'react';
import WeeklyCheckIn from './WeeklyCheckIn';
import useProgressStore from '../../store/useProgressStore';
import useWorkoutStore from '../../store/useWorkoutStore';
import useSettingsStore from '../../store/useSettingsStore';
import { PHASES, getPhaseFromWeek } from '../../data/program';

export default function ProfilePage() {
  const { currentWeek, setCurrentWeek, startWeight, targetWeight, setStartWeight, addWeight } = useProgressStore();
  const { user, setUser } = useSettingsStore();
  const workoutStore = useWorkoutStore();
  const [showReset, setShowReset] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editValues, setEditValues] = useState({ name: '', height: '', startWeight: '', targetWeight: '' });

  const phase = getPhaseFromWeek(currentWeek);
  const phaseData = PHASES[phase];

  function startEdit() {
    setEditValues({
      name: user?.name || '',
      height: user?.height || '',
      startWeight: startWeight || '',
      targetWeight: targetWeight || '',
    });
    setEditing(true);
  }

  function saveEdit() {
    const sw = parseFloat(editValues.startWeight);
    const tw = parseFloat(editValues.targetWeight);
    setUser({ name: editValues.name.trim(), height: editValues.height.trim() });
    if (sw > 0) {
      setStartWeight(sw);
      const today = new Date().toISOString().split('T')[0];
      addWeight(today, sw);
    }
    if (tw > 0) useProgressStore.setState({ targetWeight: tw });
    setEditing(false);
  }

  function handleExport() {
    const ps = useProgressStore.getState();
    const data = {
      exportedAt: new Date().toISOString(),
      progress: {
        weights: ps.weights,
        measurements: ps.measurements,
        weeklyCheckIns: ps.weeklyCheckIns,
        currentWeek: ps.currentWeek,
        startWeight: ps.startWeight,
        targetWeight: ps.targetWeight,
      },
      workoutLogs: workoutStore.logs,
      exerciseNotes: useWorkoutStore.getState().exerciseNotes,
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
    window.location.reload();
  }

  return (
    <div className="flex-1 overflow-y-auto pb-32 scrollbar-hide">
      <div className="px-4 pt-4">
        <h1 className="text-xl font-bold text-white mb-4">Profil</h1>

        {/* User card */}
        <div className="bg-bg-card rounded-2xl p-4 mb-4">
          {editing ? (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-accent-teal uppercase tracking-wider mb-2">Bilgileri Düzenle</p>
              <EditField label="Ad" value={editValues.name} onChange={v => setEditValues(p => ({ ...p, name: v }))} placeholder="Adını gir" />
              <EditField label="Boy (cm)" value={editValues.height} onChange={v => setEditValues(p => ({ ...p, height: v }))} placeholder="180" type="number" />
              <EditField label="Başlangıç Kilo (kg)" value={editValues.startWeight} onChange={v => setEditValues(p => ({ ...p, startWeight: v }))} placeholder="85.0" type="number" />
              <EditField label="Hedef Kilo (kg)" value={editValues.targetWeight} onChange={v => setEditValues(p => ({ ...p, targetWeight: v }))} placeholder="78.0" type="number" />
              <div className="flex gap-2 pt-1">
                <button onClick={() => setEditing(false)} className="flex-1 py-2.5 rounded-xl text-sm text-white/50 bg-bg-dark">İptal</button>
                <button onClick={saveEdit} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-accent-teal">Kaydet</button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-14 rounded-full bg-accent-teal flex items-center justify-center text-2xl">
                  💪
                </div>
                <div className="flex-1">
                  <p className="text-lg font-bold text-white">{user?.name || 'Sporcu'}</p>
                  <p className="text-xs text-white/40">{user?.height ? `${user.height} cm · ` : ''}V-Taper Programı</p>
                </div>
                <button onClick={startEdit} className="text-xs text-accent-teal px-2 py-1 rounded-lg border border-accent-teal/30">
                  Düzenle
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <InfoCell label="Başlangıç" value={startWeight ? `${startWeight} kg` : '—'} />
                <InfoCell label="Hedef" value={targetWeight ? `${targetWeight} kg` : '—'} color="#E94560" />
                <InfoCell
                  label="Fark"
                  value={startWeight && targetWeight
                    ? `${(startWeight - targetWeight) > 0 ? '-' : '+'}${Math.abs(startWeight - targetWeight).toFixed(1)} kg`
                    : '—'}
                  color="#10B981"
                />
              </div>
            </>
          )}
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

function EditField({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <p className="text-xs text-white/40 mb-1">{label}</p>
      <input
        type={type}
        inputMode={type === 'number' ? 'decimal' : 'text'}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-bg-dark border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 outline-none focus:border-accent-teal transition-colors"
      />
    </div>
  );
}
