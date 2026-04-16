import { useState, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useCustomProgramStore from '../../store/useCustomProgramStore';
import MesocycleView from './MesocycleView';
import ExercisePicker from './ExercisePicker';
import {
  MESOCYCLE_PRESETS,
  DEFAULT_VOLUME_LANDMARKS,
  PROGRESSION_RULES,
  generateSetRamp,
} from '../../utils/progressionEngine';

// ─── Constants ────────────────────────────────────────────────────────────

const EMOJIS = ['💪', '🏋️', '🔥', '⚡', '🎯', '🏆', '🌊', '🚀', '💥', '🦾', '🐺', '🦅'];
const COLORS  = ['#14B8A6', '#3B82F6', '#F5A623', '#E94560', '#8B5CF6', '#10B981', '#EC4899', '#F97316'];

const GOALS = [
  { id: 'hypertrophy', label: 'Hipertrofi',  desc: 'Kas büyümesi',       emoji: '💪' },
  { id: 'strength',    label: 'Kuvvet',       desc: 'Maksimal güç',       emoji: '🏋️' },
  { id: 'peaking',     label: 'Pik',          desc: 'Yarışma hazırlığı',  emoji: '🎯' },
  { id: 'general',     label: 'Genel',        desc: 'Fitness & kondisyon',emoji: '⚡' },
];

const DAY_TEMPLATES = [
  { key: 'GÖĞÜS', name: 'Göğüs & Ön Kol',   emoji: '💪', color: '#3B82F6', subtitle: 'İtme günü' },
  { key: 'SIRT',  name: 'Sırt & Arka Kol',  emoji: '🏋️', color: '#14B8A6', subtitle: 'Çekme günü' },
  { key: 'BACAK', name: 'Bacak',             emoji: '🦵', color: '#F5A623', subtitle: 'Squat günü' },
  { key: 'OMUZ',  name: 'Omuz & Kol',        emoji: '💥', color: '#8B5CF6', subtitle: 'İzolasyon günü' },
  { key: 'FULL',  name: 'Tam Vücut',         emoji: '⚡', color: '#10B981', subtitle: 'Full body' },
  { key: 'ÜST',   name: 'Üst Vücut',         emoji: '🔥', color: '#E94560', subtitle: 'Upper günü' },
  { key: 'ALT',   name: 'Alt Vücut',         emoji: '🏆', color: '#F97316', subtitle: 'Lower günü' },
  { key: 'CORE',  name: 'Core',              emoji: '🎯', color: '#EC4899', subtitle: 'Çekirdek günü' },
];

const PRESET_META = {
  rp_6week:     { label: '6 Hf RP Hipertrofi', badge: 'Önerilen', color: '#14B8A6' },
  rp_4week:     { label: '4 Hf RP Hipertrofi', badge: 'Kısa',     color: '#3B82F6' },
  dup_4week:    { label: '4 Hf DUP',           badge: 'Kuvvet+',  color: '#F5A623' },
  strength_531: { label: '4 Hf 5/3/1',         badge: 'Kuvvet',   color: '#E94560' },
};

const EX_DEFAULTS = {
  name: '', muscle: 'Göğüs', sets: 3, reps: '8-12', rpe: '8', rest: 90,
  tier: 'T2',
  progressionRule: { type: 'double_progression', params: { repRangeMin: 8, repRangeMax: 12, loadIncrement: 2.5 } },
};

const MUSCLES = Object.keys(DEFAULT_VOLUME_LANDMARKS);

// ─── Shared widgets ───────────────────────────────────────────────────────

function StepHeader({ step, total, title, subtitle }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-1.5 mb-2">
        {Array.from({ length: total }, (_, i) => (
          <div key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= step ? 'bg-[#14B8A6]' : 'bg-white/10'}`}
          />
        ))}
      </div>
      <p className="text-xs text-white/40">Adım {step + 1}/{total}</p>
      <h2 className="text-xl font-bold text-white mt-1">{title}</h2>
      {subtitle && <p className="text-sm text-white/50 mt-0.5">{subtitle}</p>}
    </div>
  );
}

function EmojiPicker({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {EMOJIS.map(e => (
        <button key={e} onClick={() => onChange(e)}
          className={`w-10 h-10 text-xl rounded-xl transition-all ${
            value === e
              ? 'bg-[#14B8A6]/20 ring-1 ring-[#14B8A6]'
              : 'bg-white/5 hover:bg-white/10'
          }`}>
          {e}
        </button>
      ))}
    </div>
  );
}

function ColorPicker({ value, onChange }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {COLORS.map(c => (
        <button key={c} onClick={() => onChange(c)}
          className={`w-8 h-8 rounded-full transition-all ${
            value === c ? 'ring-2 ring-white ring-offset-2 ring-offset-[#09111f] scale-110' : ''
          }`}
          style={{ backgroundColor: c }} />
      ))}
    </div>
  );
}

// ─── Step 0: Program Meta ─────────────────────────────────────────────────

function StepMeta({ form, onChange }) {
  return (
    <div className="space-y-5">
      <StepHeader step={0} total={4} title="Programını Tanıt" subtitle="İsim, görsel ve hedef belirle" />

      <div>
        <label className="text-xs text-white/50 uppercase tracking-wide mb-2 block">Program Adı</label>
        <input
          value={form.name}
          onChange={e => onChange('name', e.target.value)}
          placeholder="örn. Kütle Programım"
          className="w-full bg-bg rounded-xl px-4 py-3 text-white placeholder:text-white/30
                     border border-white/10 focus:border-[#14B8A6]/50 outline-none text-sm"
        />
      </div>

      <div>
        <label className="text-xs text-white/50 uppercase tracking-wide mb-2 block">İkon</label>
        <EmojiPicker value={form.emoji} onChange={v => onChange('emoji', v)} />
      </div>

      <div>
        <label className="text-xs text-white/50 uppercase tracking-wide mb-2 block">Renk</label>
        <ColorPicker value={form.color} onChange={v => onChange('color', v)} />
      </div>

      <div>
        <label className="text-xs text-white/50 uppercase tracking-wide mb-2 block">Hedef</label>
        <div className="grid grid-cols-2 gap-2">
          {GOALS.map(g => (
            <button key={g.id} onClick={() => onChange('goal', g.id)}
              className={`p-3 rounded-xl text-left transition-all border ${
                form.goal === g.id
                  ? 'border-[#14B8A6]/50 bg-[#14B8A6]/10'
                  : 'border-white/8 bg-bg-card'
              }`}>
              <div className="text-lg mb-0.5">{g.emoji}</div>
              <div className="text-sm font-semibold text-white">{g.label}</div>
              <div className="text-xs text-white/40">{g.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Step 1: Mesocycle ────────────────────────────────────────────────────

function StepMesocycle({ form, onChange }) {
  return (
    <div className="space-y-5">
      <StepHeader step={1} total={4} title="Mesocycle Yapısı" subtitle="Antrenman döngünü seç" />

      <div className="space-y-2">
        {Object.entries(MESOCYCLE_PRESETS).map(([key, preset]) => {
          const meta = PRESET_META[key] || { label: key, color: '#3B82F6' };
          const isSelected = JSON.stringify(form.mesocycle) === JSON.stringify(preset);
          return (
            <button key={key} onClick={() => onChange('mesocycle', preset)}
              className={`w-full p-4 rounded-xl text-left transition-all border ${
                isSelected ? 'border-[#14B8A6]/50 bg-[#14B8A6]/5' : 'border-white/8 bg-bg-card'
              }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-white">{meta.label}</span>
                {meta.badge && (
                  <span className="text-xs px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: meta.color + '22', color: meta.color }}>
                    {meta.badge}
                  </span>
                )}
              </div>
              <MesocycleView mesocycle={preset} compact />
            </button>
          );
        })}
      </div>

      {form.mesocycle && (
        <div className="bg-bg-card rounded-xl p-4 border border-white/8">
          <p className="text-xs text-white/50 mb-2">Seçili Döngü Önizlemesi</p>
          <MesocycleView mesocycle={form.mesocycle} />
        </div>
      )}
    </div>
  );
}

// ─── Step 2: Volume Landmarks ─────────────────────────────────────────────

function StepVolume({ form, onChange }) {
  const update = useCallback((muscle, field, value) => {
    onChange('volumeLandmarks', {
      ...form.volumeLandmarks,
      [muscle]: { ...form.volumeLandmarks[muscle], [field]: Number(value) || 0 },
    });
  }, [form.volumeLandmarks, onChange]);

  return (
    <div className="space-y-5">
      <StepHeader step={2} total={4} title="Hacim Hedefleri" subtitle="Kas grubu başına haftalık set (RP Strength)" />

      <div className="space-y-3">
        {MUSCLES.map(muscle => {
          const lm = form.volumeLandmarks[muscle] || { mev: 8, mav: 14, mrv: 20 };
          return (
            <div key={muscle} className="bg-bg-card rounded-xl p-3 border border-white/8">
              <p className="text-sm font-medium text-white mb-2">{muscle}</p>
              <div className="grid grid-cols-3 gap-2">
                {[['MEV', lm.mev, 'mev', '#10B981'], ['MAV', lm.mav, 'mav', '#14B8A6'], ['MRV', lm.mrv, 'mrv', '#E94560']].map(
                  ([label, val, key, color]) => (
                    <div key={key}>
                      <p className="text-xs mb-1 font-medium" style={{ color }}>{label}</p>
                      <input type="number" value={val}
                        onChange={e => update(muscle, key, e.target.value)}
                        className="w-full bg-bg rounded-lg px-2 py-1.5 text-sm text-white text-center
                                   border border-white/10 focus:border-[#14B8A6]/50 outline-none" />
                    </div>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Exercise Row ─────────────────────────────────────────────────────────

function ExerciseRow({ exercise, idx, onUpdate, onRemove, onPickFromLibrary }) {
  return (
    <div className="bg-bg rounded-xl p-3 border border-white/8 space-y-2">
      <div className="flex items-center gap-2">
        <input value={exercise.name} onChange={e => onUpdate(idx, 'name', e.target.value)}
          placeholder="Egzersiz adı"
          className="flex-1 bg-bg-card rounded-lg px-3 py-2 text-sm text-white
                     placeholder:text-white/30 border border-white/8 outline-none" />
        <button onClick={() => onPickFromLibrary(idx)}
          title="Kütüphaneden seç"
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#14B8A6]/10 text-[#14B8A6] text-sm shrink-0">
          ⊕
        </button>
        <button onClick={() => onRemove(idx)}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/10 text-red-400 shrink-0">
          ×
        </button>
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        {[['Sets', exercise.sets, 'sets', true], ['Tekrar', exercise.reps, 'reps', false],
          ['RPE', exercise.rpe, 'rpe', false], ['Dinlenme', exercise.rest, 'rest', true]].map(
          ([label, val, field, isNum]) => (
            <div key={field}>
              <p className="text-xs text-white/40 mb-1">{label}</p>
              <input value={val}
                onChange={e => onUpdate(idx, field, isNum ? Number(e.target.value) : e.target.value)}
                className="w-full bg-bg-card rounded-lg px-2 py-1.5 text-xs text-white text-center
                           border border-white/8 outline-none" />
            </div>
          )
        )}
      </div>

      <div className="flex gap-1.5">
        {['T1', 'T2', 'T3'].map(t => (
          <button key={t} onClick={() => onUpdate(idx, 'tier', t)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              exercise.tier === t ? 'bg-[#14B8A6]/20 text-[#14B8A6]' : 'bg-white/5 text-white/40'
            }`}>{t}</button>
        ))}
        <select value={exercise.progressionRule?.type}
          onChange={e => {
            const r = PROGRESSION_RULES.find(x => x.type === e.target.value);
            onUpdate(idx, 'progressionRule', { type: r.type, params: { ...r.defaultParams } });
          }}
          className="flex-1 bg-white/5 rounded-lg px-2 py-1 text-xs text-white/60 border border-white/8 outline-none">
          {PROGRESSION_RULES.map(r => <option key={r.type} value={r.type}>{r.label}</option>)}
        </select>
      </div>
    </div>
  );
}

// ─── Step 3: Days & Exercises ─────────────────────────────────────────────

function StepDays({ form, onChange }) {
  const [openDay, setOpenDay] = useState(null);
  const [pickerTarget, setPickerTarget] = useState(null); // { dayKey, exIdx }

  const addDay = useCallback((template) => {
    const count = form.days.filter(d => d.startsWith(template.key)).length;
    const dayKey = count > 0 ? `${template.key}_${count + 1}` : template.key;
    onChange('days', [...form.days, dayKey]);
    onChange('program', {
      ...form.program,
      [dayKey]: { color: template.color, emoji: template.emoji, subtitle: template.subtitle, exercises: [] },
    });
    setOpenDay(dayKey);
  }, [form.days, form.program, onChange]);

  const removeDay = useCallback((dayKey) => {
    const { [dayKey]: _, ...rest } = form.program;
    onChange('days', form.days.filter(d => d !== dayKey));
    onChange('program', rest);
    if (openDay === dayKey) setOpenDay(null);
  }, [form.days, form.program, openDay, onChange]);

  const updateExercises = useCallback((dayKey, exercises) => {
    onChange('program', { ...form.program, [dayKey]: { ...form.program[dayKey], exercises } });
  }, [form.program, onChange]);

  const addExercise = useCallback((dayKey) => {
    updateExercises(dayKey, [...(form.program[dayKey]?.exercises || []), { ...EX_DEFAULTS }]);
  }, [form.program, updateExercises]);

  const updateEx = useCallback((dayKey, idx, field, value) => {
    const exs = [...(form.program[dayKey]?.exercises || [])];
    exs[idx] = { ...exs[idx], [field]: value };
    updateExercises(dayKey, exs);
  }, [form.program, updateExercises]);

  const removeEx = useCallback((dayKey, idx) => {
    updateExercises(dayKey, form.program[dayKey]?.exercises.filter((_, i) => i !== idx) || []);
  }, [form.program, updateExercises]);

  return (
    <div className="space-y-5">
      <StepHeader step={3} total={4} title="Günler & Egzersizler" subtitle="Antrenman günleri ve egzersizleri düzenle" />

      {/* Day template picker */}
      <div>
        <p className="text-xs text-white/50 uppercase tracking-wide mb-2">Gün Ekle</p>
        <div className="flex flex-wrap gap-2">
          {DAY_TEMPLATES.map(t => (
            <button key={t.key} onClick={() => addDay(t)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium
                         bg-bg-card border border-white/8 hover:border-white/20 transition-all active:scale-95">
              <span>{t.emoji}</span>
              <span className="text-white/70">{t.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Days list */}
      <div className="space-y-2">
        {form.days.length === 0 && (
          <div className="py-10 text-center text-white/30 text-sm">
            Yukarıdan gün ekleyerek başla
          </div>
        )}

        {form.days.map((dayKey) => {
          const day = form.program[dayKey];
          if (!day) return null;
          const isOpen = openDay === dayKey;
          return (
            <div key={dayKey} className="bg-bg-card rounded-xl border border-white/8 overflow-hidden">
              {/* Day header */}
              <div className="flex items-center gap-3 p-3">
                <button className="flex items-center gap-3 flex-1 text-left"
                  onClick={() => setOpenDay(isOpen ? null : dayKey)}>
                  <span className="text-lg">{day.emoji}</span>
                  <div>
                    <p className="text-sm font-medium text-white">{day.subtitle || dayKey}</p>
                    <p className="text-xs text-white/40">{day.exercises?.length || 0} egzersiz</p>
                  </div>
                </button>
                <button onClick={() => removeDay(dayKey)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-500/10 text-red-400 text-sm">
                  ×
                </button>
                <button onClick={() => setOpenDay(isOpen ? null : dayKey)}
                  className="w-7 h-7 flex items-center justify-center text-white/30 text-xs">
                  {isOpen ? '▲' : '▼'}
                </button>
              </div>

              {/* Exercise list */}
              {isOpen && (
                <div className="px-3 pb-3 border-t border-white/8 pt-2 space-y-2">
                  {(day.exercises || []).map((ex, eIdx) => (
                    <ExerciseRow key={eIdx} exercise={ex} idx={eIdx}
                      onUpdate={(i, f, v) => updateEx(dayKey, i, f, v)}
                      onRemove={(i) => removeEx(dayKey, i)}
                      onPickFromLibrary={(i) => setPickerTarget({ dayKey, exIdx: i })} />
                  ))}
                  <div className="flex gap-2">
                    <button onClick={() => addExercise(dayKey)}
                      className="flex-1 py-2.5 rounded-xl text-sm text-[#14B8A6]
                                 bg-[#14B8A6]/8 border border-[#14B8A6]/20
                                 hover:bg-[#14B8A6]/15 transition-all">
                      + Egzersiz Ekle
                    </button>
                    <button onClick={() => {
                      addExercise(dayKey);
                      setPickerTarget({ dayKey, exIdx: (day.exercises || []).length });
                    }}
                      className="px-3 py-2.5 rounded-xl text-sm text-white/50
                                 bg-white/5 border border-white/8 hover:bg-white/8 transition-all">
                      Kütüphane
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Exercise picker modal */}
      {pickerTarget && (
        <ExercisePicker
          onClose={() => setPickerTarget(null)}
          onSelect={(picked) => {
            const { dayKey, exIdx } = pickerTarget;
            const exs = [...(form.program[dayKey]?.exercises || [])];
            const base = exs[exIdx] || { ...EX_DEFAULTS };
            exs[exIdx] = {
              ...base,
              name:   picked.name,
              muscle: picked.muscle,
              sets:   picked.sets,
              reps:   picked.reps,
              rpe:    picked.rpe,
              rest:   picked.rest,
            };
            onChange('program', { ...form.program, [dayKey]: { ...form.program[dayKey], exercises: exs } });
            setPickerTarget(null);
          }}
        />
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────

const INITIAL = {
  name: '', emoji: '💪', color: '#14B8A6', goal: 'hypertrophy',
  mesocycle: null,
  volumeLandmarks: { ...DEFAULT_VOLUME_LANDMARKS },
  days: [], program: {},
};

export default function CreateProgramPage() {
  const navigate = useNavigate();
  const { editId } = useParams();
  const { addProgram, updateProgram, programs } = useCustomProgramStore();
  const isEdit = !!editId;
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(() => {
    if (editId && programs[editId]) {
      const p = programs[editId];
      return {
        name:            p.name            || '',
        emoji:           p.emoji           || '💪',
        color:           p.color           || '#14B8A6',
        goal:            p.goal            || 'hypertrophy',
        mesocycle:       p.mesocycle       || null,
        volumeLandmarks: p.volumeLandmarks || { ...DEFAULT_VOLUME_LANDMARKS },
        days:            p.days            || [],
        program:         p.program         || {},
      };
    }
    return INITIAL;
  });

  const onChange = useCallback((field, value) => {
    setForm(f => ({ ...f, [field]: value }));
  }, []);

  const canNext = useMemo(() => {
    if (step === 0) return form.name.trim().length >= 2;
    if (step === 1) return !!form.mesocycle;
    if (step === 2) return true;
    if (step === 3) return form.days.length > 0;
    return false;
  }, [step, form.name, form.mesocycle, form.days]);

  const handleSave = useCallback(() => {
    const programId = isEdit ? editId : `custom_${Date.now()}`;
    const finalProgram = {};
    form.days.forEach((dayKey, dIdx) => {
      const day = form.program[dayKey];
      finalProgram[dayKey] = {
        ...day,
        exercises: (day?.exercises || []).map((ex, eIdx) => ({
          ...ex,
          id: ex.id || `cx_${programId}_${dIdx}_${eIdx}`,
          weeklySetRamp: generateSetRamp(ex.sets, form.mesocycle),
        })),
      };
    });

    const payload = {
      id: programId,
      name: form.name.trim(),
      emoji: form.emoji,
      color: form.color,
      subtitle: `${form.days.length} gün · ${form.goal}`,
      goal: form.goal,
      targetGender: 'unisex',
      days: form.days,
      program: finalProgram,
      mesocycle: form.mesocycle,
      volumeLandmarks: form.volumeLandmarks,
      isCustom: true,
      createdAt: isEdit ? (programs[editId]?.createdAt || Date.now()) : Date.now(),
    };

    if (isEdit) updateProgram(editId, payload);
    else addProgram(payload);
    navigate('/programlar');
  }, [form, isEdit, editId, addProgram, updateProgram, programs, navigate]);

  const STEP_LABELS = ['Bilgi', 'Mesocycle', 'Hacim', 'Günler'];
  const pageTitle = isEdit ? 'Programı Düzenle' : 'Program Oluştur';

  return (
    <div className="fixed inset-0 z-50 bg-bg overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-bg/95 backdrop-blur border-b border-white/8 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => step > 0 ? setStep(s => s - 1) : navigate(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 text-white/60 text-lg">
          ‹
        </button>
        <h1 className="text-base font-semibold text-white flex-1">{pageTitle}</h1>
        <span className="text-xs text-white/40">{STEP_LABELS[step]}</span>
        {form.name && <span className="text-lg">{form.emoji}</span>}
      </div>

      {/* Content */}
      <div className="px-4 pt-5 pb-36">
        {step === 0 && <StepMeta      form={form} onChange={onChange} />}
        {step === 1 && <StepMesocycle form={form} onChange={onChange} />}
        {step === 2 && <StepVolume    form={form} onChange={onChange} />}
        {step === 3 && <StepDays      form={form} onChange={onChange} />}
      </div>

      {/* Bottom CTA */}
      <div className="sticky bottom-0 px-4 py-4 pb-safe bg-bg/95 backdrop-blur border-t border-white/8">
        <button
          onClick={step < 3 ? () => setStep(s => s + 1) : handleSave}
          disabled={!canNext}
          className={`w-full py-3.5 rounded-2xl font-semibold text-sm transition-all ${
            canNext ? 'text-white active:scale-[0.98]' : 'text-white/30 bg-white/5 cursor-not-allowed'
          }`}
          style={canNext ? { background: 'linear-gradient(135deg, #14B8A6, #3B82F6)' } : {}}>
          {step < 3 ? 'Devam Et' : 'Programı Kaydet'}
        </button>
      </div>
    </div>
  );
}

// [autonomous-TASK-0027] Updated at 2026-04-16T21:42:57.868058

// [autonomous-TASK-0069] Updated at 2026-04-16T21:43:57.612482

// [autonomous-TASK-0111] Updated at 2026-04-16T21:44:57.910232

// [autonomous-TASK-0027] Updated at 2026-04-16T21:58:25.153445

// [autonomous-TASK-0027] Updated at 2026-04-16T21:58:25.361113

// [autonomous-TASK-0027] Updated at 2026-04-16T21:58:25.562690

// [autonomous-TASK-0069] Updated at 2026-04-16T22:01:52.592689

// [autonomous-TASK-0069] Updated at 2026-04-16T22:01:52.814641

// [autonomous-TASK-0069] Updated at 2026-04-16T22:01:53.032045

// [autonomous-TASK-0111] Updated at 2026-04-16T22:02:52.482411

// [autonomous-TASK-0111] Updated at 2026-04-16T22:02:52.702934

// [autonomous-TASK-0111] Updated at 2026-04-16T22:02:52.930465
