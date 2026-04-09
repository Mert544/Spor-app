import { useState } from 'react';
import useSettingsStore from '../../store/useSettingsStore';
import useProgressStore from '../../store/useProgressStore';

const STEPS = [
  { id: 'name', title: 'Merhaba!', subtitle: 'Seni tanıyalım', label: 'Adın ne?', placeholder: 'Adını gir', type: 'text' },
  { id: 'height', title: 'Boy', subtitle: 'Antrenman planı için', label: 'Boyun kaç cm?', placeholder: '180', type: 'number' },
  { id: 'weight', title: 'Mevcut Kilo', subtitle: 'Başlangıç noktanı belirleyelim', label: 'Şu anki kilonu gir (kg)', placeholder: '85.0', type: 'number' },
  { id: 'target', title: 'Hedef Kilo', subtitle: 'Nereye ulaşmak istiyorsun?', label: 'Hedef kilonu gir (kg)', placeholder: '78.0', type: 'number' },
];

export default function OnboardingPage() {
  const { setOnboarded, setUser } = useSettingsStore();
  const { setStartWeight, addWeight, addMeasurement } = useProgressStore();
  const progressState = useProgressStore.getState();

  const [step, setStep] = useState(0);
  const [values, setValues] = useState({ name: '', height: '', weight: '', target: '' });
  const [error, setError] = useState('');

  const current = STEPS[step];

  function validate() {
    const val = values[current.id].trim();
    if (!val) return 'Bu alan boş bırakılamaz.';
    if (current.type === 'number') {
      const n = parseFloat(val);
      if (isNaN(n) || n <= 0) return 'Geçerli bir sayı gir.';
      if (current.id === 'height' && (n < 100 || n > 250)) return 'Boy 100-250 cm arasında olmalı.';
      if (current.id === 'weight' && (n < 30 || n > 300)) return 'Geçerli bir kilo gir.';
      if (current.id === 'target' && (n < 30 || n > 300)) return 'Geçerli bir hedef kilo gir.';
    }
    return '';
  }

  function handleNext() {
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      finish();
    }
  }

  function finish() {
    const today = new Date().toISOString().split('T')[0];
    const cw = parseFloat(values.weight);
    const tw = parseFloat(values.target);

    setUser({ name: values.name.trim(), height: values.height.trim() });
    setStartWeight(cw);
    addWeight(today, cw);
    useProgressStore.setState({ targetWeight: tw });
    setOnboarded(true);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleNext();
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-6 max-w-lg mx-auto">
      {/* Logo / Header */}
      <div className="text-center mb-10">
        <div className="text-5xl mb-3">💪</div>
        <h1 className="text-2xl font-bold text-white">V-Taper Coach</h1>
        <p className="text-white/40 text-sm mt-1">Kişisel antrenman asistanın</p>
      </div>

      {/* Card */}
      <div className="w-full bg-bg-card rounded-3xl p-6 shadow-xl">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-6">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: i === step ? '24px' : '8px',
                backgroundColor: i <= step ? '#14B8A6' : 'rgba(255,255,255,0.15)',
              }}
            />
          ))}
        </div>

        {/* Step content */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-accent-teal uppercase tracking-wider mb-1">
            {current.subtitle}
          </p>
          <h2 className="text-xl font-bold text-white mb-4">{current.title}</h2>

          <label className="block text-sm text-white/60 mb-2">{current.label}</label>
          <input
            key={current.id}
            type={current.type}
            inputMode={current.type === 'number' ? 'decimal' : 'text'}
            value={values[current.id]}
            onChange={(e) => {
              setValues({ ...values, [current.id]: e.target.value });
              setError('');
            }}
            onKeyDown={handleKeyDown}
            placeholder={current.placeholder}
            autoFocus
            className="w-full bg-bg-dark border border-white/10 rounded-xl px-4 py-3 text-white text-lg placeholder-white/20 outline-none focus:border-accent-teal transition-colors"
          />
          {error && <p className="text-accent-red text-xs mt-2">{error}</p>}
        </div>

        {/* Button */}
        <button
          onClick={handleNext}
          className="w-full py-3.5 rounded-xl font-bold text-white text-base transition-all active:scale-95"
          style={{ backgroundColor: '#14B8A6' }}
        >
          {step < STEPS.length - 1 ? 'Devam Et' : 'Başla!'}
        </button>

        {/* Back */}
        {step > 0 && (
          <button
            onClick={() => { setStep(step - 1); setError(''); }}
            className="w-full mt-3 py-2 text-white/40 text-sm hover:text-white/60 transition-colors"
          >
            Geri
          </button>
        )}
      </div>

      <p className="text-white/20 text-xs mt-6">Veriler sadece cihazında saklanır.</p>
    </div>
  );
}
