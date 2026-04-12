import { useState, useEffect } from 'react';
import generateProgram from '../../utils/programGenerator';
import useCustomProgramStore from '../../store/useCustomProgramStore';
import useSettingsStore from '../../store/useSettingsStore';

// ─── Step data ─────────────────────────────────────────────────────────────

const GOAL_OPTIONS = [
  { value: 'hypertrophy', emoji: '💪', label: 'Kas Kazan',           desc: 'Kas kütlesi ve hacim artışı' },
  { value: 'fat_loss',    emoji: '🔥', label: 'Yağ Yak & Sıkılaş',  desc: 'Yağ yakımı, form ve tonus' },
  { value: 'strength',    emoji: '🏋️', label: 'Güçlen',              desc: 'Maksimum kuvvet gelişimi' },
  { value: 'athletic',    emoji: '⚡', label: 'Atletik Performans',   desc: 'Güç, hız ve çeviklik' },
  { value: 'fitness',     emoji: '🫀', label: 'Genel Fitness',        desc: 'Sağlıklı, aktif yaşam' },
];

const EXPERIENCE_OPTIONS = [
  { value: 'beginner',     dot: '🟢', label: 'Yeni Başlayan', desc: '0–12 ay, form ve temel gelişim' },
  { value: 'intermediate', dot: '🟡', label: 'Orta',          desc: '1–3 yıl, sağlam program takip edebilir' },
  { value: 'advanced',     dot: '🔴', label: 'İleri',         desc: '3+ yıl, yüksek yoğunluğa hazır' },
];

const DAY_OPTIONS = [
  { value: 3, label: '3 Gün', desc: 'Haftada 3 antrenman' },
  { value: 4, label: '4 Gün', desc: 'Haftada 4 antrenman' },
  { value: 5, label: '5 Gün', desc: 'Haftada 5 antrenman' },
  { value: 6, label: '6 Gün', desc: 'Haftada 6 antrenman' },
];

const EQUIPMENT_OPTIONS = [
  { value: 'full_gym',   emoji: '🏋️', label: 'Tam Donanımlı Salon', desc: 'Smith, kablo, tüm makineler' },
  { value: 'minimal',    emoji: '🏠', label: 'Ev + Bazı Ekipman',   desc: 'Dumbbell, bant, pullup bar' },
  { value: 'bodyweight', emoji: '🌿', label: 'Minimal / Vücut Ağırlığı', desc: 'Ekipsiz veya minimal' },
];

const GOAL_COLORS = {
  hypertrophy: '#14B8A6',
  strength:    '#E94560',
  fat_loss:    '#F59E0B',
  athletic:    '#8B5CF6',
  fitness:     '#10B981',
};

const EXPERIENCE_LABELS = {
  beginner:     'Yeni Başlayan',
  intermediate: 'Orta Seviye',
  advanced:     'İleri Seviye',
};

const GOAL_LABELS = {
  hypertrophy: 'Kas Kazan',
  strength:    'Güçlen',
  fat_loss:    'Yağ Yak',
  athletic:    'Atletik',
  fitness:     'Genel Fitness',
};

// ─── Sub-components ────────────────────────────────────────────────────────

function OptionCard({ selected, onClick, children, accentColor }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-4 rounded-2xl border text-left transition-all active:scale-[0.97]"
      style={
        selected
          ? {
              borderColor: accentColor || '#14B8A6',
              backgroundColor: `${accentColor || '#14B8A6'}18`,
              boxShadow: `0 0 0 1px ${accentColor || '#14B8A6'}40`,
            }
          : {
              borderColor: 'rgba(255,255,255,0.08)',
              backgroundColor: '#1E293B',
            }
      }
    >
      {children}
    </button>
  );
}

// ─── Main wizard ────────────────────────────────────────────────────────────

export default function ProgramWizard({ onClose, onComplete }) {
  const { user } = useSettingsStore();
  const { addProgram } = useCustomProgramStore();

  const [step, setStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back

  const [goal, setGoal] = useState(null);
  const [experience, setExperience] = useState(null);
  const [days, setDays] = useState(null);
  const [equipment, setEquipment] = useState(null);

  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(null);

  const totalSteps = 5; // 0-4

  // Auto-generate when reaching step 4
  useEffect(() => {
    if (step === 4 && !generated) {
      setGenerating(true);
      const timer = setTimeout(() => {
        const prog = generateProgram({
          goal,
          experience,
          days,
          equipment,
          gender: user?.gender || null,
          name: user?.name || null,
        });
        setGenerated(prog);
        setGenerating(false);
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [step, generated, goal, experience, days, equipment, user]);

  function advanceTo(nextStep) {
    setDirection(1);
    setAnimating(true);
    setTimeout(() => {
      setStep(nextStep);
      setAnimating(false);
    }, 200);
  }

  function goBack() {
    if (step === 0 || step === 4) return;
    setDirection(-1);
    setAnimating(true);
    setTimeout(() => {
      setStep((s) => s - 1);
      setAnimating(false);
    }, 200);
  }

  function selectAndAdvance(setter, value) {
    setter(value);
    setTimeout(() => advanceTo(step + 1), 280);
  }

  function handleUseProgram() {
    if (!generated) return;
    addProgram(generated);
    onComplete(generated);
  }

  function handleRetry() {
    setGenerated(null);
    setGenerating(false);
    setDirection(-1);
    setAnimating(true);
    setTimeout(() => {
      setStep(0);
      setGoal(null);
      setExperience(null);
      setDays(null);
      setEquipment(null);
      setAnimating(false);
    }, 200);
  }

  const progress = step === 4 ? 100 : Math.round((step / 4) * 100);
  const accentColor = goal ? GOAL_COLORS[goal] : '#14B8A6';

  const contentStyle = {
    opacity: animating ? 0 : 1,
    transform: animating
      ? `translateX(${direction > 0 ? '18px' : '-18px'})`
      : 'translateX(0)',
    transition: 'opacity 0.18s ease, transform 0.18s ease',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ backgroundColor: '#0F172A' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-safe pt-4 pb-3">
        <button
          onClick={step > 0 && step < 4 ? goBack : undefined}
          className="w-10 h-10 flex items-center justify-center rounded-xl transition-all"
          style={{
            backgroundColor: step > 0 && step < 4 ? 'rgba(255,255,255,0.06)' : 'transparent',
            color: step > 0 && step < 4 ? 'rgba(255,255,255,0.7)' : 'transparent',
            pointerEvents: step > 0 && step < 4 ? 'auto' : 'none',
          }}
        >
          <span className="text-lg">←</span>
        </button>

        <div className="flex-1 mx-3">
          <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, backgroundColor: accentColor }}
            />
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/6 text-white/50 text-lg"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-8" style={contentStyle}>

        {/* Step 0 — Goal */}
        {step === 0 && (
          <div>
            <p className="text-xs text-white/40 mb-1 mt-2">Adım 1 / 4</p>
            <h2 className="text-xl font-bold text-white mb-1">Hedefin ne?</h2>
            <p className="text-sm text-white/50 mb-5">Programın bu hedefe göre şekillenecek.</p>
            <div className="space-y-3">
              {GOAL_OPTIONS.map((opt) => (
                <OptionCard
                  key={opt.value}
                  selected={goal === opt.value}
                  onClick={() => selectAndAdvance(setGoal, opt.value)}
                  accentColor={GOAL_COLORS[opt.value]}
                >
                  <span className="text-2xl w-9 text-center flex-shrink-0">{opt.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">{opt.label}</p>
                    <p className="text-xs text-white/45 mt-0.5">{opt.desc}</p>
                  </div>
                  {goal === opt.value && (
                    <span style={{ color: GOAL_COLORS[opt.value] }} className="text-lg flex-shrink-0">✓</span>
                  )}
                </OptionCard>
              ))}
            </div>
          </div>
        )}

        {/* Step 1 — Experience */}
        {step === 1 && (
          <div>
            <p className="text-xs text-white/40 mb-1 mt-2">Adım 2 / 4</p>
            <h2 className="text-xl font-bold text-white mb-1">Deneyim seviyesi?</h2>
            <p className="text-sm text-white/50 mb-5">Ağırlık ve yoğunluk buna göre ayarlanır.</p>
            <div className="space-y-3">
              {EXPERIENCE_OPTIONS.map((opt) => (
                <OptionCard
                  key={opt.value}
                  selected={experience === opt.value}
                  onClick={() => selectAndAdvance(setExperience, opt.value)}
                  accentColor={accentColor}
                >
                  <span className="text-2xl w-9 text-center flex-shrink-0">{opt.dot}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">{opt.label}</p>
                    <p className="text-xs text-white/45 mt-0.5">{opt.desc}</p>
                  </div>
                  {experience === opt.value && (
                    <span style={{ color: accentColor }} className="text-lg flex-shrink-0">✓</span>
                  )}
                </OptionCard>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 — Days */}
        {step === 2 && (
          <div>
            <p className="text-xs text-white/40 mb-1 mt-2">Adım 3 / 4</p>
            <h2 className="text-xl font-bold text-white mb-1">Haftada kaç gün?</h2>
            <p className="text-sm text-white/50 mb-5">Gerçekçi seç — az ama düzenli, çoktan iyidir.</p>
            <div className="grid grid-cols-2 gap-3">
              {DAY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => selectAndAdvance(setDays, opt.value)}
                  className="flex flex-col items-center justify-center py-5 rounded-2xl border transition-all active:scale-[0.97]"
                  style={
                    days === opt.value
                      ? {
                          borderColor: accentColor,
                          backgroundColor: `${accentColor}18`,
                          boxShadow: `0 0 0 1px ${accentColor}40`,
                        }
                      : {
                          borderColor: 'rgba(255,255,255,0.08)',
                          backgroundColor: '#1E293B',
                        }
                  }
                >
                  <span
                    className="text-3xl font-bold mb-1"
                    style={{ color: days === opt.value ? accentColor : 'white' }}
                  >
                    {opt.value}
                  </span>
                  <span className="text-xs text-white/50">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3 — Equipment */}
        {step === 3 && (
          <div>
            <p className="text-xs text-white/40 mb-1 mt-2">Adım 4 / 4</p>
            <h2 className="text-xl font-bold text-white mb-1">Ekipman durumu?</h2>
            <p className="text-sm text-white/50 mb-5">Egzersizler buna göre seçilir.</p>
            <div className="space-y-3">
              {EQUIPMENT_OPTIONS.map((opt) => (
                <OptionCard
                  key={opt.value}
                  selected={equipment === opt.value}
                  onClick={() => selectAndAdvance(setEquipment, opt.value)}
                  accentColor={accentColor}
                >
                  <span className="text-2xl w-9 text-center flex-shrink-0">{opt.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">{opt.label}</p>
                    <p className="text-xs text-white/45 mt-0.5">{opt.desc}</p>
                  </div>
                  {equipment === opt.value && (
                    <span style={{ color: accentColor }} className="text-lg flex-shrink-0">✓</span>
                  )}
                </OptionCard>
              ))}
            </div>
          </div>
        )}

        {/* Step 4 — Result */}
        {step === 4 && (
          <div className="pt-2">
            {generating ? (
              <div className="flex flex-col items-center justify-center py-20 gap-5">
                <div
                  className="w-14 h-14 rounded-full border-2 border-t-transparent animate-spin"
                  style={{ borderColor: `${accentColor}60`, borderTopColor: accentColor }}
                />
                <div className="text-center">
                  <p className="text-white font-semibold text-base">Programın hazırlanıyor...</p>
                  <p className="text-white/40 text-sm mt-1">Hedeflerine özel egzersizler seçiliyor</p>
                </div>
              </div>
            ) : generated ? (
              <div>
                {/* Hero card */}
                <div
                  className="rounded-2xl p-5 mb-5 text-center"
                  style={{
                    background: `linear-gradient(135deg, ${accentColor}15, ${accentColor}28)`,
                    border: `1px solid ${accentColor}35`,
                  }}
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3"
                    style={{ backgroundColor: `${accentColor}22` }}
                  >
                    {generated.emoji}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{generated.name}</h3>
                  <p className="text-sm text-white/50">{generated.subtitle}</p>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 mb-5">
                  {[
                    { label: 'Gün / Hafta', value: `${days}` },
                    {
                      label: 'Ortalama Egzersiz',
                      value: `~${Math.round(
                        Object.values(generated.program).reduce(
                          (sum, d) => sum + (d.exercises?.length || 0), 0
                        ) / Object.keys(generated.program).length
                      )}`,
                    },
                    { label: 'Seviye', value: EXPERIENCE_LABELS[experience]?.split(' ')[0] },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-xl p-3 text-center"
                      style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      <p className="text-lg font-bold text-white">{s.value}</p>
                      <p className="text-xs text-white/40 mt-0.5 leading-tight">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Day list */}
                <div className="mb-5">
                  <p className="text-xs text-white/40 uppercase tracking-wide mb-2">Program Günleri</p>
                  <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                    {generated.days.map((dayName, i) => {
                      const day = generated.program[dayName];
                      return (
                        <div
                          key={dayName}
                          className="flex items-center gap-3 px-4 py-3"
                          style={{
                            borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                            backgroundColor: '#1E293B',
                          }}
                        >
                          <span className="text-lg w-7 text-center flex-shrink-0">{day?.emoji || '💪'}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{dayName}</p>
                            <p className="text-xs text-white/40 truncate">{day?.subtitle}</p>
                          </div>
                          <span className="text-xs text-white/30 flex-shrink-0">
                            {day?.exercises?.length || 0} egz.
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Goal badge */}
                <div className="flex items-center gap-2 mb-6">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                  >
                    {GOAL_LABELS[goal]}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-white/50">
                    {EXPERIENCE_LABELS[experience]}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-white/50">
                    {generated.mesocycle?.durationWeeks} Hafta
                  </span>
                </div>

                {/* CTA */}
                <button
                  onClick={handleUseProgram}
                  className="w-full py-4 rounded-2xl font-bold text-white text-base mb-3 transition-all active:scale-[0.98]"
                  style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}bb)` }}
                >
                  Bu Programı Kullan
                </button>
                <button
                  onClick={handleRetry}
                  className="w-full py-3.5 rounded-2xl font-semibold text-white/50 text-sm border border-white/10 bg-white/3 transition-all active:scale-[0.98]"
                >
                  Yeniden Dene
                </button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
