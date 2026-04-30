import { useState } from 'react';
import useSettingsStore from '../../store/useSettingsStore';

const SLIDES = [
  {
    emoji: '👋',
    title: 'Hoş Geldin!',
    subtitle: 'V-Taper Coach',
    desc: 'V-Taper Coach, sana özel bilimsel antrenman programları oluşturur. Hadi uygulamayı tanıyalım — 8 adımda her şeyi öğreneceksin.',
    color: '#14B8A6',
    bg: '#14B8A610',
    cta: 'İlk adım →',
  },
  {
    emoji: '🏋️',
    title: 'Antrenman Sekmesi',
    subtitle: 'Alt menü → 1. sekme',
    desc: 'Bugün hangi egzersizleri yapacağını görürsün. Her egzersizin yanındaki kutuya dokun — tamamlandı olarak işaretle. Set bitince dinlenme sayacı otomatik başlar.',
    color: '#14B8A6',
    bg: '#14B8A610',
    hint: 'Kartı genişletmek için egzersiz adına dokun.',
  },
  {
    emoji: '✅',
    title: 'Set Nasıl Kaydedilir?',
    subtitle: 'Egzersiz kartını aç → kaydet',
    desc: 'Egzersiz kartını aç → ağırlık ve tekrar gir → ✓ işaretle. Uygulama geçmiş verilerini hatırlar ve sana bir sonraki seans için ne kadar ağırlık yapman gerektiğini söyler.',
    color: '#3B82F6',
    bg: '#3B82F610',
    hint: 'RPE girerken: 10 = maksimum efor, 7-8 = ideal çalışma bölgesi.',
  },
  {
    emoji: '📊',
    title: 'İlerleme Sekmesi',
    subtitle: 'Alt menü → 2. sekme',
    desc: 'Kilo, vücut ölçüleri, güç rekorları ve haftalık özetin burada. Her hafta kilo girersen ilerleme grafiğin güncel kalır.',
    color: '#8B5CF6',
    bg: '#8B5CF610',
    hint: 'Rozetler ve başarılar da burada — hedeflerine ne kadar yakınsın görürsün.',
  },
  {
    emoji: '📋',
    title: 'Hazır Programlar',
    subtitle: 'Alt menü → 3. sekme → Hazır Programlar',
    desc: 'V-Taper, Hibrit Atlet, Bikini Fit ve 8 program daha mevcut. Seviyeni seç (Başlangıç / Orta / İleri) ve "Aktif Et" butonuna dokun.',
    color: '#F5A623',
    bg: '#F5A62310',
    hint: 'Program değiştirince antrenman geçmişin silinmez, güvende.',
  },
  {
    emoji: '✨',
    title: 'Kişisel Program Oluştur',
    subtitle: 'Programlar → "Kişisel Programım" sekmesi',
    desc: '4 soruyu yanıtla: hedefin, deneyimin, haftada kaç gün, ekipman. Uygulama sana özel bir program oluşturur — başka kimsenin programıyla aynı olmaz.',
    color: '#14B8A6',
    bg: '#14B8A610',
    hint: 'Programı beğenmezsen "Yeniden Oluştur" ile tekrar deneyebilirsin.',
  },
  {
    emoji: '💊',
    title: 'Supplement Rehberi',
    subtitle: 'Profil sekmesi → Supplement Rehberi',
    desc: 'Seviyene göre hangi takviyeleri alman gerektiğini, dozunu ve zamanlamasını görebilirsin. Başlangıç için sadece 3 temel takviye yeterli.',
    color: '#EC4899',
    bg: '#EC489910',
  },
  {
    emoji: '🚀',
    title: 'Hazırsın!',
    subtitle: 'Hadi başlayalım',
    desc: 'İlk antrenmanını başlatmak için alttaki Antrenman sekmesine dokun.',
    color: '#10B981',
    bg: '#10B98110',
    isLast: true,
    cta: 'Hadi Başlayalım 🚀',
  },
];

export default function AppTour() {
  const [step, setStep] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [direction, setDirection] = useState(1);
  const setTourShown = useSettingsStore((s) => s.setTourShown);

  const slide = SLIDES[step];

  function dismiss() {
    setTourShown(true);
  }

  function next() {
    if (slide.isLast) { dismiss(); return; }
    setDirection(1);
    setLeaving(true);
    setTimeout(() => {
      setStep((s) => s + 1);
      setLeaving(false);
    }, 200);
  }

  function prev() {
    if (step === 0) return;
    setDirection(-1);
    setLeaving(true);
    setTimeout(() => {
      setStep((s) => s - 1);
      setLeaving(false);
    }, 200);
  }

  const translateX = leaving
    ? direction > 0 ? '-20px' : '20px'
    : '0px';

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center px-5"
      style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(14px)' }}
    >
      {/* Skip button */}
      {!slide.isLast && (
        <button
          onClick={dismiss}
          className="absolute top-5 right-5 text-xs text-white/30 hover:text-white/60 transition-colors px-2 py-1"
        >
          Atla
        </button>
      )}

      {/* Step indicator */}
      <p
        className="text-xs font-semibold uppercase tracking-widest mb-4"
        style={{ color: slide.color + '99' }}
      >
        {step + 1} / {SLIDES.length}
      </p>

      {/* Card */}
      <div
        className="w-full max-w-sm rounded-3xl p-7 flex flex-col items-center text-center"
        style={{
          background: '#1A2840',
          border: `1px solid ${slide.color}35`,
          boxShadow: `0 0 40px ${slide.color}18`,
          opacity: leaving ? 0 : 1,
          transform: `translateX(${translateX}) scale(${leaving ? 0.97 : 1})`,
          transition: 'opacity 0.18s ease, transform 0.18s ease',
        }}
      >
        {/* Emoji icon */}
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-5"
          style={{
            background: slide.bg,
            border: `1px solid ${slide.color}40`,
          }}
        >
          {slide.emoji}
        </div>

        {/* Subtitle label */}
        <p
          className="text-xs font-bold uppercase tracking-widest mb-1.5"
          style={{ color: slide.color }}
        >
          {slide.subtitle}
        </p>

        {/* Title */}
        <h2 className="text-xl font-bold text-white mb-3">{slide.title}</h2>

        {/* Description */}
        <p className="text-sm text-white/60 leading-relaxed mb-4">{slide.desc}</p>

        {/* Hint chip */}
        {slide.hint && (
          <div
            className="text-xs text-white/50 rounded-xl px-3 py-2 leading-relaxed w-full text-left"
            style={{ backgroundColor: `${slide.color}12`, border: `1px solid ${slide.color}25` }}
          >
            <span style={{ color: slide.color }}>💡 </span>
            {slide.hint}
          </div>
        )}
      </div>

      {/* Progress dots */}
      <div className="flex items-center gap-1.5 mt-5 mb-4">
        {SLIDES.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === step ? 22 : 6,
              height: 6,
              background: i === step ? slide.color : 'rgba(255,255,255,0.15)',
            }}
          />
        ))}
      </div>

      {/* Navigation row */}
      <div className="flex items-center gap-3 w-full max-w-sm">
        {step > 0 && !slide.isLast && (
          <button
            onClick={prev}
            className="w-12 h-12 flex items-center justify-center rounded-xl text-white/50 transition-all active:scale-[0.96]"
            style={{ backgroundColor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)' }}
          >
            ←
          </button>
        )}
        <button
          onClick={next}
          className="flex-1 py-4 rounded-2xl text-sm font-bold text-white transition-all active:scale-[0.97]"
          style={{ background: `linear-gradient(135deg, ${slide.color}, ${slide.color}cc)` }}
        >
          {slide.cta || (slide.isLast ? 'Hadi Başlayalım 🚀' : 'İleri →')}
        </button>
      </div>
    </div>
  );
}
