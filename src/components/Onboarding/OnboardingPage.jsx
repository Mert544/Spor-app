import { useState } from 'react';
import useSettingsStore from '../../store/useSettingsStore';
import useProgressStore from '../../store/useProgressStore';
import useAchievementStore from '../../store/useAchievementStore';

// ─── Step definitions ───────────────────────────────────────────────
const INPUT_STEPS = [
  {
    id: 'name',
    title: 'Adın ne?',
    subtitle: 'Seni tanıyalım',
    label: 'İsim',
    placeholder: 'Adını gir',
    type: 'text',
    tip: null,
  },
  {
    id: 'height',
    title: 'Boyun kaç?',
    subtitle: 'Antrenman planı için',
    label: 'Boy (cm)',
    placeholder: '180',
    type: 'number',
    tip: 'Boy, enerji ihtiyacı hesabında kullanılır',
  },
  {
    id: 'weight',
    title: 'Mevcut kilonu gir',
    subtitle: 'Başlangıç noktanı belirleyelim',
    label: 'Kilo (kg)',
    placeholder: '85.0',
    type: 'number',
    tip: 'Bu, ilerleme grafiğinde başlangıç noktanı oluşturur',
  },
  {
    id: 'target',
    title: 'Hedef kilonu gir',
    subtitle: 'Nereye ulaşmak istiyorsun?',
    label: 'Hedef (kg)',
    placeholder: '78.0',
    type: 'number',
    tip: 'Gerçekçi bir hedef — haftada 0.5–1 kg kayıp ideal',
  },
];

// Total step count: welcome(0) + gender(1) + 4 inputs(2-5)
const TOTAL_STEPS = 6;

export default function OnboardingPage() {
  const { setOnboarded, setUser, setActiveProgram } = useSettingsStore();
  const { setStartWeight, addWeight } = useProgressStore();

  const [step, setStep] = useState(0);          // 0=welcome, 1=gender, 2..5=inputs
  const [gender, setGender] = useState(null);   // 'male' | 'female'
  const [values, setValues] = useState({ name: '', height: '', weight: '', target: '' });
  const [error, setError] = useState('');

  const inputIndex = step - 2;                  // maps step → INPUT_STEPS index
  const current = step >= 2 ? INPUT_STEPS[inputIndex] : null;

  // ─── Validation ────────────────────────────────────────────────────
  function validate() {
    if (!current) return '';
    const val = values[current.id]?.trim?.() ?? values[current.id];
    if (!val && val !== 0) return `${current.label} gerekiyor.`;
    if (current.type === 'number') {
      const n = parseFloat(val);
      if (isNaN(n) || n <= 0) return 'Geçerli bir değer gir.';
      if (current.id === 'height' && (n < 100 || n > 250)) return 'Boy 100–250 cm arasında olmalı.';
      if (current.id === 'weight' && (n < 30 || n > 300)) return 'Kilo 30–300 kg arasında olmalı.';
      if (current.id === 'target' && (n < 30 || n > 300)) return 'Hedef kilo 30–300 kg arasında olmalı.';
    }
    return '';
  }

  function advance() {
    if (step < TOTAL_STEPS - 1) setStep(s => s + 1);
    else finish();
  }

  function handleNext() {
    if (step === 0) { advance(); return; }
    if (step === 1) {
      if (!gender) { setError('Cinsiyet seçimi gerekiyor.'); return; }
      setError('');
      advance();
      return;
    }
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    advance();
  }

  function handleGenderSelect(g) {
    setGender(g);
    setError('');
    // Auto-advance after small delay so user sees selection
    setTimeout(() => {
      setStep(s => s + 1);
    }, 220);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleNext();
  }

  function finish() {
    const today = new Date().toISOString().split('T')[0];
    const cw = parseFloat(values.weight);
    const tw = parseFloat(values.target);

    setUser({ name: values.name.trim(), height: values.height.trim(), gender });
    setStartWeight(cw);
    addWeight(today, cw);
    useAchievementStore.getState().recordWeightEntry();
    useProgressStore.setState({ targetWeight: tw });
    setActiveProgram(gender === 'female' ? 'bikini_fit' : 'vtaper_orta');
    setOnboarded(true);
  }

  // ─── Progress ──────────────────────────────────────────────────────
  const progressPct = (step / (TOTAL_STEPS - 1)) * 100;

  // ─── Shared card wrapper ───────────────────────────────────────────
  return (
    <div className="min-h-screen bg-bg-dark flex flex-col max-w-lg mx-auto relative overflow-hidden">

      {/* Ambient gradient blob */}
      <div
        className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background: gender === 'female'
            ? 'radial-gradient(circle, #EC489920 0%, transparent 70%)'
            : 'radial-gradient(circle, #14B8A620 0%, transparent 70%)',
          transform: 'translate(30%, -30%)',
          transition: 'background 0.6s ease',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-60 h-60 rounded-full pointer-events-none"
        style={{
          background: gender === 'female'
            ? 'radial-gradient(circle, #8B5CF615 0%, transparent 70%)'
            : 'radial-gradient(circle, #3B82F615 0%, transparent 70%)',
          transform: 'translate(-30%, 30%)',
          transition: 'background 0.6s ease',
        }}
      />

      {/* Progress bar (top) */}
      {step > 0 && (
        <div className="relative z-10 px-6 pt-12">
          <div className="h-1 w-full bg-white/8 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressPct}%`,
                background: gender === 'female'
                  ? 'linear-gradient(90deg, #EC4899, #8B5CF6)'
                  : 'linear-gradient(90deg, #14B8A6, #3B82F6)',
              }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-xs text-white/30">{step}/{TOTAL_STEPS - 1}</span>
            {step > 1 && (
              <button
                onClick={() => { setStep(s => s - 1); setError(''); }}
                className="text-xs text-white/30 hover:text-white/60 transition-colors"
              >
                ← Geri
              </button>
            )}
          </div>
        </div>
      )}

      {/* ─── Step 0: Welcome ─────────────────────────────────────── */}
      {step === 0 && <WelcomeStep onNext={advance} />}

      {/* ─── Step 1: Gender selection ────────────────────────────── */}
      {step === 1 && (
        <GenderStep
          gender={gender}
          onSelect={handleGenderSelect}
          error={error}
        />
      )}

      {/* ─── Steps 2–5: Input fields ─────────────────────────────── */}
      {step >= 2 && current && (
        <div className="flex-1 flex flex-col justify-center px-6 relative z-10">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: gender === 'female' ? '#EC4899' : '#14B8A6' }}>
              {current.subtitle}
            </p>
            <h2 className="text-2xl font-black text-white leading-tight">{current.title}</h2>
            {current.tip && (
              <p className="text-sm text-white/40 mt-2 leading-relaxed">{current.tip}</p>
            )}
          </div>

          <div className="bg-bg-card rounded-2xl p-5 border border-white/6">
            <label className="block text-sm text-white/50 mb-2 font-medium">{current.label}</label>
            <input
              key={current.id}
              type={current.type}
              inputMode={current.type === 'number' ? 'decimal' : 'text'}
              value={values[current.id]}
              onChange={e => {
                setValues({ ...values, [current.id]: e.target.value });
                setError('');
              }}
              onKeyDown={handleKeyDown}
              placeholder={current.placeholder}
              autoFocus
              className="w-full bg-bg-dark border border-white/10 rounded-xl px-4 py-3.5 text-white text-xl placeholder-white/15 outline-none focus:border-accent-teal transition-colors"
              style={{
                borderColor: error ? '#E94560' : undefined,
              }}
            />
            {error && <p className="text-accent-red text-xs mt-2">{error}</p>}
          </div>

          <button
            onClick={handleNext}
            className="w-full mt-5 py-4 rounded-2xl font-bold text-white text-base transition-all active:scale-95"
            style={{
              background: gender === 'female'
                ? 'linear-gradient(135deg, #EC4899, #8B5CF6)'
                : 'linear-gradient(135deg, #14B8A6, #3B82F6)',
            }}
          >
            {step < TOTAL_STEPS - 1 ? 'Devam →' : 'Başlayalım →'}
          </button>
        </div>
      )}

      <p className="relative z-10 text-white/15 text-xs text-center pb-8 px-6 mt-auto">
        Tüm veriler yalnızca bu cihazda saklanır.
      </p>
    </div>
  );
}

// ─── Welcome step ───────────────────────────────────────────────────
function WelcomeStep({ onNext }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
      {/* Logo mark */}
      <div className="mb-8 text-center">
        <div
          className="w-24 h-24 rounded-3xl mx-auto mb-6 flex items-center justify-center text-5xl"
          style={{
            background: 'linear-gradient(135deg, #14B8A620 0%, #3B82F620 100%)',
            border: '1.5px solid rgba(20,184,166,0.2)',
            boxShadow: '0 0 40px rgba(20,184,166,0.12)',
          }}
        >
          💪
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">V-Taper Coach</h1>
        <p className="text-white/50 text-base mt-2 leading-relaxed">
          Bilime dayalı kişisel antrenman planın
        </p>
      </div>

      {/* Feature pills */}
      <div className="flex flex-col gap-2 w-full max-w-xs mb-10">
        {[
          { icon: '📊', label: 'RP Strength hacim metodolojisi' },
          { icon: '🧬', label: 'Araştırma tabanlı egzersiz seçimi' },
          { icon: '📈', label: 'Gerçek zamanlı ilerleme takibi' },
        ].map(f => (
          <div key={f.label}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
            style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="text-lg">{f.icon}</span>
            <span className="text-sm text-white/60">{f.label}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onNext}
        className="w-full max-w-xs py-4 rounded-2xl font-bold text-white text-base transition-all active:scale-95"
        style={{ background: 'linear-gradient(135deg, #14B8A6, #3B82F6)' }}
      >
        Başla →
      </button>
    </div>
  );
}

// ─── Gender selection step ──────────────────────────────────────────
function GenderStep({ gender, onSelect, error }) {
  return (
    <div className="flex-1 flex flex-col justify-center px-6 relative z-10">
      <div className="mb-8">
        <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">
          Program özelleştirmesi
        </p>
        <h2 className="text-2xl font-black text-white">Cinsiyetini seç</h2>
        <p className="text-sm text-white/40 mt-2">
          Program ve hacim hedefleri buna göre ayarlanır
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Male */}
        <button
          onClick={() => onSelect('male')}
          className="relative flex flex-col items-center gap-4 p-6 rounded-2xl transition-all active:scale-95"
          style={{
            backgroundColor: gender === 'male' ? 'rgba(20,184,166,0.12)' : 'rgba(255,255,255,0.03)',
            border: gender === 'male'
              ? '2px solid #14B8A6'
              : '2px solid rgba(255,255,255,0.08)',
            boxShadow: gender === 'male' ? '0 0 24px rgba(20,184,166,0.15)' : 'none',
          }}
        >
          {gender === 'male' && (
            <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-accent-teal flex items-center justify-center">
              <span className="text-white text-xs font-bold">✓</span>
            </div>
          )}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
            style={{
              background: 'linear-gradient(135deg, rgba(20,184,166,0.2), rgba(59,130,246,0.2))',
            }}
          >
            ⚡
          </div>
          <div className="text-center">
            <p className="text-lg font-black text-white">Erkek</p>
            <p className="text-xs text-white/40 mt-1 leading-tight">
              V-Taper · Hibrit<br />Taktik Atlet
            </p>
          </div>
        </button>

        {/* Female */}
        <button
          onClick={() => onSelect('female')}
          className="relative flex flex-col items-center gap-4 p-6 rounded-2xl transition-all active:scale-95"
          style={{
            backgroundColor: gender === 'female' ? 'rgba(236,72,153,0.12)' : 'rgba(255,255,255,0.03)',
            border: gender === 'female'
              ? '2px solid #EC4899'
              : '2px solid rgba(255,255,255,0.08)',
            boxShadow: gender === 'female' ? '0 0 24px rgba(236,72,153,0.15)' : 'none',
          }}
        >
          {gender === 'female' && (
            <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-accent-pink flex items-center justify-center">
              <span className="text-white text-xs font-bold">✓</span>
            </div>
          )}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
            style={{
              background: 'linear-gradient(135deg, rgba(236,72,153,0.2), rgba(139,92,246,0.2))',
            }}
          >
            🌸
          </div>
          <div className="text-center">
            <p className="text-lg font-black text-white">Kadın</p>
            <p className="text-xs text-white/40 mt-1 leading-tight">
              Bikini Fit<br />Güç & Şekil
            </p>
          </div>
        </button>
      </div>

      {error && <p className="text-accent-red text-xs mt-3 text-center">{error}</p>}

      <p className="text-white/30 text-xs text-center mt-5">
        Bu seçim sonradan Profil'den değiştirilebilir
      </p>
    </div>
  );
}
