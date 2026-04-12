import { useState, useEffect } from 'react';
import generateProgram from '../../utils/programGenerator';
import useCustomProgramStore from '../../store/useCustomProgramStore';
import useSettingsStore from '../../store/useSettingsStore';

// ─── Step data ─────────────────────────────────────────────────────────────

const GOAL_OPTIONS = [
  {
    value: 'hypertrophy',
    emoji: '💪',
    label: 'Kas Kazan',
    desc: 'Kas kütlesi ve hacim artışı',
    color: '#14B8A6',
  },
  {
    value: 'fat_loss',
    emoji: '🔥',
    label: 'Yağ Yak & Sıkılaş',
    desc: 'Yağ yakımı, form ve tonus',
    color: '#F59E0B',
  },
  {
    value: 'strength',
    emoji: '🏋️',
    label: 'Güçlen',
    desc: 'Maksimum kuvvet gelişimi',
    color: '#E94560',
  },
  {
    value: 'athletic',
    emoji: '⚡',
    label: 'Atletik Performans',
    desc: 'Güç, hız ve çeviklik',
    color: '#8B5CF6',
  },
  {
    value: 'fitness',
    emoji: '🫀',
    label: 'Genel Fitness',
    desc: 'Sağlıklı, aktif yaşam',
    color: '#10B981',
  },
];

const EXPERIENCE_OPTIONS = [
  {
    value: 'beginner',
    emoji: '🟢',
    label: 'Yeni Başlayan',
    desc: '0–12 ay · Temel hareketleri öğrenme aşamasında',
  },
  {
    value: 'intermediate',
    emoji: '🟡',
    label: 'Orta Seviye',
    desc: '1–3 yıl · Sağlam form, program takibi yapabiliyor',
  },
  {
    value: 'advanced',
    emoji: '🔴',
    label: 'İleri Seviye',
    desc: '3+ yıl · Yüksek yoğunluk ve periodizasyona hazır',
  },
];

const DAY_OPTIONS = [
  { value: 3, emoji: '3️⃣', label: '3 Gün / Hafta', desc: 'Full body splits, hızlı toparlanma' },
  { value: 4, emoji: '4️⃣', label: '4 Gün / Hafta', desc: 'Upper/lower split, ideal denge' },
  { value: 5, emoji: '5️⃣', label: '5 Gün / Hafta', desc: 'PPL + ek gün, orta-ileri seviye' },
  { value: 6, emoji: '6️⃣', label: '6 Gün / Hafta', desc: 'PPL x2, maksimum frekans' },
];

const EQUIPMENT_OPTIONS = [
  {
    value: 'full_gym',
    emoji: '🏋️',
    label: 'Tam Donanımlı Salon',
    desc: 'Smith, kablo makineleri, tüm serbest ağırlıklar',
  },
  {
    value: 'minimal',
    emoji: '🏠',
    label: 'Ev + Bazı Ekipman',
    desc: 'Dumbbell, direnç bandı, pullup bar',
  },
  {
    value: 'bodyweight',
    emoji: '🌿',
    label: 'Minimal / Vücut Ağırlığı',
    desc: 'Ekipsiz veya çok temel ekipman',
  },
];

const DURATION_OPTIONS = [
  {
    value: 'short',
    emoji: '⚡',
    label: '30–45 Dakika',
    desc: 'Yoğun ve kısa — az ama öz egzersizler',
  },
  {
    value: 'medium',
    emoji: '💪',
    label: '45–60 Dakika',
    desc: 'Standart seans — ideal hacim ve verim dengesi',
    recommended: true,
  },
  {
    value: 'long',
    emoji: '🔥',
    label: '60–90 Dakika',
    desc: 'Uzun seans — daha fazla egzersiz ve hacim',
  },
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

const SCIENTIFIC_NOTES = {
  hypertrophy: 'RP Strength protokolü: MEV→MAV haftalık hacim rampi ile kas hipertrofisi optimize edilir.',
  strength:    'Lineer periodizasyon: ağırlık arttıkça tekrar sayısı düşer, maksimal kuvvet gelişir.',
  fat_loss:    'Kalori açığında kas koruma: yüksek protein + hacim antrenmanı sinerjisi.',
  athletic:    'Patlayıcı güç + kondisyon: nöromüsküler adaptasyon ve iş kapasitesi birlikte gelişir.',
  fitness:     'Genel adaptasyon: kardiyovasküler ve kas gücü dengeli gelişim.',
};

const STEP_SUBTITLES = [
  'Hedefin programın tüm yapısını belirler — doğru hedef, doğru sonuç.',
  'Deneyim seviyesi, antrenman yoğunluğunu ve egzersiz seçimini belirler.',
  'Gerçekçi seç — az ama düzenli, çoktan iyidir.',
  'Egzersizler mevcut ekipmanına göre otomatik seçilir.',
  'Süre, seansın kaç egzersiz içereceğini belirler.',
];

// ─── OptionCard ─────────────────────────────────────────────────────────────

function OptionCard({ selected, onClick, emoji, label, desc, accentColor, recommended }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 py-4 px-4 rounded-2xl border text-left transition-all active:scale-[0.97] relative"
      style={
        selected
          ? {
              borderColor: accentColor || '#14B8A6',
              backgroundColor: `${accentColor || '#14B8A6'}14`,
              boxShadow: `inset 3px 0 0 ${accentColor || '#14B8A6'}, 0 0 0 1px ${accentColor || '#14B8A6'}30`,
            }
          : {
              borderColor: 'rgba(255,255,255,0.08)',
              backgroundColor: '#111c2d',
            }
      }
    >
      {/* Emoji circle */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
        style={{
          backgroundColor: selected
            ? `${accentColor || '#14B8A6'}22`
            : 'rgba(255,255,255,0.06)',
        }}
      >
        {emoji}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold text-white">{label}</p>
          {recommended && (
            <span
              className="text-xs px-1.5 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: '#14B8A620', color: '#14B8A6' }}
            >
              Önerilen
            </span>
          )}
        </div>
        <p className="text-xs text-white/50 mt-0.5 leading-relaxed">{desc}</p>
      </div>

      {/* Check */}
      {selected && (
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
          style={{ backgroundColor: accentColor || '#14B8A6' }}
        >
          ✓
        </div>
      )}
    </button>
  );
}

// ─── Main wizard ─────────────────────────────────────────────────────────────

export default function ProgramWizard({ onClose, onComplete }) {
  const { user } = useSettingsStore();
  const { addProgram } = useCustomProgramStore();

  const [step, setStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState(1);

  const [goal, setGoal] = useState(null);
  const [experience, setExperience] = useState(null);
  const [days, setDays] = useState(null);
  const [equipment, setEquipment] = useState(null);
  const [sessionDuration, setSessionDuration] = useState(null);

  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(null);

  const TOTAL_STEPS = 5; // steps 0-4 are questions, step 5 is result
  const RESULT_STEP = 5;

  // Auto-generate when reaching result step
  useEffect(() => {
    if (step === RESULT_STEP && !generated) {
      setGenerating(true);
      const timer = setTimeout(() => {
        const prog = generateProgram({
          goal,
          experience,
          days,
          equipment,
          sessionDuration: sessionDuration || 'medium',
          gender: user?.gender || null,
          name: user?.name || null,
        });
        setGenerated(prog);
        setGenerating(false);
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [step, generated, goal, experience, days, equipment, sessionDuration, user]);

  function advanceTo(nextStep) {
    setDirection(1);
    setAnimating(true);
    setTimeout(() => {
      setStep(nextStep);
      setAnimating(false);
    }, 200);
  }

  function goBack() {
    if (step === 0 || step === RESULT_STEP) return;
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
      setSessionDuration(null);
      setAnimating(false);
    }, 200);
  }

  // Progress bar: steps 0-4 are question steps (20% each), result = 100%
  const progress = step === RESULT_STEP ? 100 : Math.round((step / TOTAL_STEPS) * 100);
  const accentColor = goal ? GOAL_COLORS[goal] : '#14B8A6';

  const contentStyle = {
    opacity: animating ? 0 : 1,
    transform: animating
      ? `translateX(${direction > 0 ? '18px' : '-18px'})`
      : 'translateX(0)',
    transition: 'opacity 0.18s ease, transform 0.18s ease',
  };

  // Step label helpers
  const stepLabels = ['Hedef', 'Deneyim', 'Gün Sayısı', 'Ekipman', 'Süre'];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ backgroundColor: '#09111f' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-safe pt-4 pb-2">
        <button
          onClick={step > 0 && step < RESULT_STEP ? goBack : undefined}
          className="w-10 h-10 flex items-center justify-center rounded-xl transition-all"
          style={{
            backgroundColor:
              step > 0 && step < RESULT_STEP ? 'rgba(255,255,255,0.06)' : 'transparent',
            color:
              step > 0 && step < RESULT_STEP ? 'rgba(255,255,255,0.7)' : 'transparent',
            pointerEvents: step > 0 && step < RESULT_STEP ? 'auto' : 'none',
          }}
        >
          <span className="text-lg">←</span>
        </button>

        {/* Progress bar + step indicator */}
        <div className="flex-1 mx-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-white/40 font-medium">
              {step < RESULT_STEP ? `Adım ${step + 1} / ${TOTAL_STEPS}` : 'Tamamlandı'}
            </span>
            <span className="text-xs font-bold" style={{ color: accentColor }}>
              {progress}%
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, backgroundColor: accentColor }}
            />
          </div>
          {/* Step pills */}
          {step < RESULT_STEP && (
            <div className="flex gap-1 mt-1.5">
              {stepLabels.map((label, i) => (
                <div
                  key={i}
                  className="flex-1 h-0.5 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor:
                      i < step
                        ? accentColor
                        : i === step
                        ? `${accentColor}80`
                        : 'rgba(255,255,255,0.08)',
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-xl text-white/50 text-lg transition-all"
          style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-8" style={contentStyle}>

        {/* ── Step 0: Goal ─────────────────────────────────────── */}
        {step === 0 && (
          <div>
            <div className="mt-4 mb-5">
              <h2 className="text-2xl font-bold text-white mb-1.5">Hedefin ne?</h2>
              <p className="text-sm text-white/50 leading-relaxed">{STEP_SUBTITLES[0]}</p>
            </div>
            <div className="space-y-3">
              {GOAL_OPTIONS.map((opt) => (
                <OptionCard
                  key={opt.value}
                  selected={goal === opt.value}
                  onClick={() => selectAndAdvance(setGoal, opt.value)}
                  emoji={opt.emoji}
                  label={opt.label}
                  desc={opt.desc}
                  accentColor={opt.color}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Step 1: Experience ────────────────────────────────── */}
        {step === 1 && (
          <div>
            <div className="mt-4 mb-5">
              <h2 className="text-2xl font-bold text-white mb-1.5">Deneyim seviyesi?</h2>
              <p className="text-sm text-white/50 leading-relaxed">{STEP_SUBTITLES[1]}</p>
            </div>
            <div className="space-y-3">
              {EXPERIENCE_OPTIONS.map((opt) => (
                <OptionCard
                  key={opt.value}
                  selected={experience === opt.value}
                  onClick={() => selectAndAdvance(setExperience, opt.value)}
                  emoji={opt.emoji}
                  label={opt.label}
                  desc={opt.desc}
                  accentColor={accentColor}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Step 2: Days ─────────────────────────────────────── */}
        {step === 2 && (
          <div>
            <div className="mt-4 mb-5">
              <h2 className="text-2xl font-bold text-white mb-1.5">Haftada kaç gün?</h2>
              <p className="text-sm text-white/50 leading-relaxed">{STEP_SUBTITLES[2]}</p>
            </div>
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
                          backgroundColor: `${accentColor}14`,
                          boxShadow: `inset 0 0 0 1px ${accentColor}40`,
                        }
                      : {
                          borderColor: 'rgba(255,255,255,0.08)',
                          backgroundColor: '#111c2d',
                        }
                  }
                >
                  <span className="text-2xl mb-1">{opt.emoji}</span>
                  <span
                    className="text-3xl font-bold mb-0.5"
                    style={{ color: days === opt.value ? accentColor : 'white' }}
                  >
                    {opt.value}
                  </span>
                  <span className="text-xs text-white/40 text-center px-2 leading-snug">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 3: Equipment ─────────────────────────────────── */}
        {step === 3 && (
          <div>
            <div className="mt-4 mb-5">
              <h2 className="text-2xl font-bold text-white mb-1.5">Ekipman durumu?</h2>
              <p className="text-sm text-white/50 leading-relaxed">{STEP_SUBTITLES[3]}</p>
            </div>
            <div className="space-y-3">
              {EQUIPMENT_OPTIONS.map((opt) => (
                <OptionCard
                  key={opt.value}
                  selected={equipment === opt.value}
                  onClick={() => selectAndAdvance(setEquipment, opt.value)}
                  emoji={opt.emoji}
                  label={opt.label}
                  desc={opt.desc}
                  accentColor={accentColor}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Step 4: Session Duration ──────────────────────────── */}
        {step === 4 && (
          <div>
            <div className="mt-4 mb-5">
              <h2 className="text-2xl font-bold text-white mb-1.5">Seansın ne kadar sürsün?</h2>
              <p className="text-sm text-white/50 leading-relaxed">{STEP_SUBTITLES[4]}</p>
            </div>
            <div className="space-y-3">
              {DURATION_OPTIONS.map((opt) => (
                <OptionCard
                  key={opt.value}
                  selected={sessionDuration === opt.value}
                  onClick={() => selectAndAdvance(setSessionDuration, opt.value)}
                  emoji={opt.emoji}
                  label={opt.label}
                  desc={opt.desc}
                  accentColor={accentColor}
                  recommended={opt.recommended}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Step 5: Result ────────────────────────────────────── */}
        {step === RESULT_STEP && (
          <div className="pt-2">
            {generating ? (
              <div className="flex flex-col items-center justify-center py-20 gap-5">
                <div
                  className="w-16 h-16 rounded-full border-2 border-t-transparent animate-spin"
                  style={{ borderColor: `${accentColor}50`, borderTopColor: accentColor }}
                />
                <div className="text-center">
                  <p className="text-white font-bold text-lg">Programın hazırlanıyor...</p>
                  <p className="text-white/40 text-sm mt-1.5">Hedeflerine özel egzersizler seçiliyor</p>
                </div>
              </div>
            ) : generated ? (
              <div>
                {/* Hero card */}
                <div
                  className="rounded-2xl p-5 mb-4 text-center"
                  style={{
                    background: `linear-gradient(135deg, ${accentColor}12, ${accentColor}24)`,
                    border: `1px solid ${accentColor}30`,
                  }}
                >
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-3"
                    style={{ backgroundColor: `${accentColor}20` }}
                  >
                    {generated.emoji}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{generated.name}</h3>
                  <p className="text-sm text-white/50">{generated.subtitle}</p>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { label: 'Gün / Hafta', value: `${days}` },
                    {
                      label: 'Egzersiz/Gün',
                      value: `~${Math.round(
                        Object.values(generated.program).reduce(
                          (sum, d) => sum + (d.exercises?.length || 0), 0
                        ) / Math.max(1, Object.keys(generated.program).length)
                      )}`,
                    },
                    { label: 'Mesocycle', value: `${generated.mesocycle?.durationWeeks} Hft` },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-xl p-3 text-center"
                      style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      <p className="text-lg font-bold" style={{ color: accentColor }}>{s.value}</p>
                      <p className="text-xs text-white/40 mt-0.5 leading-tight">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Day list */}
                <div className="mb-4">
                  <p className="text-xs text-white/40 uppercase tracking-wide mb-2">Program Günleri</p>
                  <div
                    className="rounded-2xl overflow-hidden"
                    style={{ border: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    {generated.days.map((dayName, i) => {
                      const day = generated.program[dayName];
                      return (
                        <div
                          key={dayName}
                          className="flex items-center gap-3 px-4 py-3"
                          style={{
                            borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                            backgroundColor: '#111c2d',
                          }}
                        >
                          <span className="text-lg w-7 text-center flex-shrink-0">{day?.emoji || '💪'}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{dayName}</p>
                            <p className="text-xs text-white/40 truncate">{day?.subtitle}</p>
                          </div>
                          <span
                            className="text-xs flex-shrink-0 px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                          >
                            {day?.exercises?.length || 0} egz.
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Badges row */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                  >
                    {GOAL_LABELS[goal]}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-white/50">
                    {EXPERIENCE_LABELS[experience]}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-white/50">
                    {generated.mesocycle?.durationWeeks} Haftalık Mesocycle
                  </span>
                </div>

                {/* Scientific note */}
                {goal && SCIENTIFIC_NOTES[goal] && (
                  <div
                    className="rounded-xl px-4 py-3 mb-5 flex items-start gap-2"
                    style={{ backgroundColor: `${accentColor}0e`, border: `1px solid ${accentColor}25` }}
                  >
                    <span style={{ color: accentColor }} className="text-base flex-shrink-0">🔬</span>
                    <div>
                      <p className="text-xs font-semibold mb-0.5" style={{ color: accentColor }}>Bilimsel Temel</p>
                      <p className="text-xs text-white/50 leading-relaxed">{SCIENTIFIC_NOTES[goal]}</p>
                    </div>
                  </div>
                )}

                {/* CTA buttons */}
                <button
                  onClick={handleUseProgram}
                  className="w-full py-4 rounded-2xl font-bold text-white text-base mb-3 transition-all active:scale-[0.98]"
                  style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}bb)` }}
                >
                  Bu Programı Kullan
                </button>
                <button
                  onClick={handleRetry}
                  className="w-full py-3.5 rounded-2xl font-semibold text-white/50 text-sm transition-all active:scale-[0.98]"
                  style={{ border: '1px solid rgba(255,255,255,0.10)', backgroundColor: 'rgba(255,255,255,0.03)' }}
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
