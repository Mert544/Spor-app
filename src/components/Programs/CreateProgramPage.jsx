import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useCustomProgramStore from '../../store/useCustomProgramStore';
import ExercisePicker from './ExercisePicker';

const EMOJIS = ['💪','🏋️','⚡','🔥','💎','🎯','🛡️','⚔️','🏆','🥇','🐺','🦁','🦅','🐍','🦍','🤖','👽','🧬','🧠','🫀','🦵','👑','🌟','🎖️','🚀'];
const COLORS = ['#E94560','#3B82F6','#10B981','#F5A623','#8B5CF6','#EC4899','#14B8A6','#FF6B35','#1DB954','#F97316','#EF4444','#6366f1','#1d4ed8'];
const DAY_NAMES = ['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'];
const MESO_PHASES = [
  { name:'Birikim', weeks:[1,2,3], volumeMultiplier:null },
  { name:'Yoğunlaştırma', weeks:[4,5], volumeMultiplier:null },
  { name:'Gerçekleştirme', weeks:[6], volumeMultiplier:0.6 },
];

const uid = () => `custom_${Date.now()}_${Math.random().toString(36).slice(2,6)}`;
const emptyDay = (name) => ({ name, exercises:[] });
const cx = (...c) => c.filter(Boolean).join(' ');

// Shared input classes
const inp = "w-full bg-bg-dark border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-[#14B8A6]";
const inpSm = "w-full bg-bg-dark border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white text-center outline-none";
const btnBase = "w-full py-3.5 rounded-2xl text-sm font-bold text-white transition-all active:scale-[0.98] disabled:opacity-40";
const card = "bg-bg-card rounded-2xl border border-white/8";

export default function CreateProgramPage() {
  const nav = useNavigate();
  const { editId } = useParams();
  const { addProgram, updateProgram, getProgram } = useCustomProgramStore();

  const isEdit = !!editId;
  const existing = isEdit ? getProgram(editId) : null;

  const [name, setName] = useState(existing?.name || '');
  const [emoji, setEmoji] = useState(existing?.emoji || '💪');
  const [color, setColor] = useState(existing?.color || '#14B8A6');
  const [desc, setDesc] = useState(existing?.description || '');
  const [days, setDays] = useState([]);
  const [pickerDay, setPickerDay] = useState(null);
  const [editing, setEditing] = useState(null);
  const [showMeso, setShowMeso] = useState(false);
  const [mesoWeeks, setMesoWeeks] = useState(existing?.mesocycle?.durationWeeks || 6);
  const [dragOver, setDragOver] = useState(null); // { dayIndex, exIndex }

  useEffect(() => {
    if (existing) {
      setDays(Object.entries(existing.program || {}).map(([name, d]) => ({
        name,
        exercises: (d.exercises || []).map(ex => ({ ...ex, id: ex.id || uid() })),
      })));
      if (existing.mesocycle) setShowMeso(true);
    } else {
      setDays([emptyDay('Gün 1')]);
    }
  }, [existing]);

  // Day ops
  const addDay = () => setDays([...days, emptyDay(DAY_NAMES[days.length] || `Gün ${days.length+1}`)]);
  const rmDay = (i) => days.length > 1 && setDays(days.filter((_,j) => j !== i));
  const setDayName = (i, n) => setDays(days.map((d,j) => j===i ? { ...d, name:n } : d));

  // Exercise ops
  const addEx = (dayIdx, tpl) => {
    const ex = { ...tpl, id: uid(), sets: tpl.sets||3, reps: tpl.reps||'8-12', rpe: tpl.rpe||'8', rest: tpl.rest||90, note: tpl.note||'', muscle: tpl.muscle||'Diğer', superset: null };
    setDays(days.map((d,i) => i===dayIdx ? { ...d, exercises:[...d.exercises, ex] } : d));
    setPickerDay(null);
  };
  const rmEx = (di, ei) => {
    setDays(days.map((d,i) => i===di ? { ...d, exercises: d.exercises.filter((_,j) => j!==ei) } : d));
    if (editing?.dayIndex===di && editing?.exIndex===ei) setEditing(null);
  };
  const patchEx = (di, ei, p) => setDays(days.map((d,i) => i===di ? { ...d, exercises: d.exercises.map((ex,j) => j===ei ? { ...ex, ...p } : ex) } : d));

  const moveEx = (di, from, to) => {
    if (from === to) return;
    setDays(days.map((d, i) => {
      if (i !== di) return d;
      const exs = [...d.exercises];
      const [moved] = exs.splice(from, 1);
      exs.splice(to, 0, moved);
      return { ...d, exercises: exs };
    }));
  };

  // Save
  const handleSave = () => {
    if (!name.trim()) { alert('Program adı gerekiyor.'); return; }
    if (days.some(d => !d.name.trim())) { alert('Tüm günlerin bir adı olmalı.'); return; }

    const program = {};
    days.forEach(day => { program[day.name] = { color, emoji, subtitle: `${day.exercises.length} egzersiz`, exercises: day.exercises }; });

    const payload = {
      id: isEdit ? editId : uid(), name: name.trim(), emoji, color, description: desc.trim(),
      days: days.map(d => d.name), program,
      mesocycle: showMeso ? { durationWeeks: +mesoWeeks||6, phases: MESO_PHASES } : null,
    };

    isEdit ? updateProgram(editId, payload) : addProgram(payload);
    nav('/programlar');
  };

  const canSave = name.trim() && days.length && days.every(d => d.exercises.length);
  const activeBtn = (on) => on ? { backgroundColor: `${color}25`, color, border: `1px solid ${color}50` } : { backgroundColor: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' };
  const selBtn = (on) => on ? { backgroundColor: `${color}30`, border: `2px solid ${color}` } : { backgroundColor: 'rgba(255,255,255,0.04)', border: '2px solid transparent' };

  return (
    <div className="flex-1 overflow-y-auto pb-32 scrollbar-hide">
      <div className="px-4 pt-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => nav('/programlar')} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 text-white/60 text-lg">‹</button>
          <h1 className="text-xl font-bold text-white">{isEdit ? 'Programı Düzenle' : 'Yeni Program'}</h1>
        </div>

        {/* Meta Card */}
        <div className={`${card} p-4 mb-4 space-y-4`}>
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Program Bilgileri</p>
          <div>
            <label className="text-xs text-white/40 mb-1 block">Program Adı</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Örn: Yaz Kuvvet Programı" className={inp} />
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1 block">Açıklama</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Programın amacı..." rows={2} className={`${inp} resize-none`} />
          </div>
          <div>
            <label className="text-xs text-white/40 mb-2 block">Emoji</label>
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map(e => (
                <button key={e} onClick={() => setEmoji(e)} className="w-10 h-10 rounded-xl text-lg flex items-center justify-center transition-all" style={selBtn(emoji===e)}>{e}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-white/40 mb-2 block">Tema Rengi</label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map(c => (
                <button key={c} onClick={() => setColor(c)} className="w-8 h-8 rounded-lg transition-all" style={{ backgroundColor: c, border: color===c ? '2px solid #fff' : '2px solid transparent', transform: color===c ? 'scale(1.1)' : 'scale(1)' }} />
              ))}
            </div>
          </div>
        </div>

        {/* Mesocycle Toggle */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">Mesocycle</span>
            <span className="text-[10px] text-white/20">(opsiyonel)</span>
          </div>
          <button onClick={() => setShowMeso(v => !v)} className="text-xs px-3 py-1.5 rounded-full font-medium transition-all" style={activeBtn(showMeso)}>
            {showMeso ? 'Aktif' : 'Kapalı'}
          </button>
        </div>

        {showMeso && (
          <div className={`${card} p-4 mb-4`}>
            <p className="text-xs text-white/40 mb-2">Süre (hafta)</p>
            <div className="flex items-center gap-3">
              <input type="number" min={2} max={16} value={mesoWeeks} onChange={e => setMesoWeeks(Math.max(2, Math.min(16, +e.target.value||6)))} className="w-20 bg-bg-dark border border-white/10 rounded-xl px-3 py-2 text-sm text-white text-center outline-none focus:border-[#14B8A6]" />
              <input type="range" min={2} max={16} value={mesoWeeks} onChange={e => setMesoWeeks(+e.target.value)} className="flex-1 accent-[#14B8A6]" />
            </div>
            <p className="text-xs text-white/30 mt-2">Her hafta sonu hafta +1 butonuyla ilerlet. Son haftada deload.</p>
          </div>
        )}

        {/* Days */}
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">Antrenman Günleri ({days.length})</span>
          <button onClick={addDay} disabled={days.length>=7} className="text-xs px-3 py-1.5 rounded-full font-medium bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-all disabled:opacity-30">+ Gün Ekle</button>
        </div>

        <div className="space-y-4 mb-6">
          {days.map((day, di) => (
            <div key={di} className={`${card} overflow-hidden`}>
              <div className="flex items-center gap-2 p-3 border-b border-white/5">
                <input value={day.name} onChange={e => setDayName(di, e.target.value)} className="flex-1 bg-transparent text-sm font-bold text-white outline-none placeholder-white/20" placeholder="Gün adı" />
                <span className="text-xs text-white/30">{day.exercises.length} egzersiz</span>
                {days.length>1 && <button onClick={() => rmDay(di)} className="text-xs text-white/30 hover:text-[#E94560] px-2 py-1">Sil</button>}
              </div>

              <div className="divide-y divide-white/5">
                {day.exercises.map((ex, ei) => (
                  <div key={ex.id||ei}>
                    {dragOver?.dayIndex===di && dragOver?.exIndex===ei && (
                      <div className="h-0.5 mx-3 my-1 rounded-full" style={{ backgroundColor: color }} />
                    )}
                    <div
                      className="p-3 flex items-center gap-2"
                      draggable
                      onDragStart={e => { e.dataTransfer.setData('text/plain', String(ei)); e.dataTransfer.effectAllowed = 'move'; }}
                      onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setDragOver({ dayIndex: di, exIndex: ei }); }}
                      onDrop={e => {
                        e.preventDefault();
                        const from = +e.dataTransfer.getData('text/plain');
                        moveEx(di, from, ei);
                        setDragOver(null);
                      }}
                      onDragEnd={() => setDragOver(null)}
                    >
                      <span className="text-white/10 cursor-grab active:cursor-grabbing select-none text-xs leading-none px-0.5">⋮⋮</span>
                      {editing?.dayIndex===di && editing?.exIndex===ei ? (
                        <div className="flex-1 space-y-2">
                          <p className="text-xs font-semibold text-white/60">{ex.name}</p>
                          <div className="grid grid-cols-4 gap-2">
                            {['sets','reps','rpe','rest'].map(k => (
                              <div key={k}>
                                <label className="text-[10px] text-white/30 capitalize">{k==='rest'?'Dinlenme(sn)':k}</label>
                                <input type={k==='reps'||k==='rpe'?'text':'number'} value={ex[k]} onChange={e => patchEx(di, ei, { [k]: k==='reps'||k==='rpe' ? e.target.value : (+e.target.value||0) })} className={inpSm} />
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-2 pt-1">
                            <button onClick={() => setEditing(null)} className="flex-1 py-1.5 rounded-lg text-xs text-white/50 bg-bg-dark">Tamam</button>
                            <button onClick={() => rmEx(di, ei)} className="py-1.5 px-3 rounded-lg text-xs text-[#E94560] bg-[#E94560]/10">Kaldır</button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => setEditing({ dayIndex: di, exIndex: ei })} className="flex-1 flex items-center gap-3 text-left min-w-0">
                          <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{ex.name}</p>
                            <p className="text-xs text-white/40">{ex.sets}×{ex.reps} · RPE {ex.rpe} · {ex.rest}sn</p>
                          </div>
                          <span className="text-white/20 text-xs">Düzenle ›</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={() => setPickerDay(di)} className="w-full py-2.5 text-xs text-white/40 hover:text-[#14B8A6] hover:bg-[#14B8A6]/5 transition-colors border-t border-white/5">+ Egzersiz Ekle</button>
            </div>
          ))}
        </div>

        <button onClick={handleSave} disabled={!canSave} className={btnBase} style={{ background: canSave ? `linear-gradient(135deg, ${color}, ${color}cc)` : '#1e293b' }}>
          {isEdit ? 'Kaydet' : 'Programı Oluştur'}
        </button>
      </div>

      {pickerDay !== null && <ExercisePicker onSelect={ex => addEx(pickerDay, ex)} onClose={() => setPickerDay(null)} />}
    </div>
  );
}
