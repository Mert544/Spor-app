import { useState } from 'react';
import useSettingsStore from '../../store/useSettingsStore';

const SLIDES = [
  {
    emoji: '👋',
    title: 'Hoş Geldin!',
    subtitle: 'Sana özel antrenman asistanın',
    desc: 'V-Taper Coach, seni adım adım daha güçlü, daha sağlıklı yapar. Uygulama süper basit — 4 sekme, her biri ayrı bir iş yapar.',
    color: '#14B8A6',
    bg: '#14B8A610',
  },
  {
    emoji: '🏋️',
    title: 'Antrenman',
    subtitle: 'Alt menü → 1. sekme',
    desc: 'Bugün hangi egzersizleri yapacağını buradan görürsün. Her seti bitirince yanındaki kutucuğa dokun.',
    color: '#14B8A6',
    bg: '#14B8A610',
    hint: 'Seti tamamladın mı? ✓ işaretle, geç.',
  },
  {
    emoji: '📊',
    title: 'İlerleme',
    subtitle: 'Alt menü → 2. sekme',
    desc: 'Kilonu, ölçülerini ve güç gelişimini buradan takip edersin. Geçen haftaya göre ne kadar değiştin görebilirsin.',
    color: '#3B82F6',
    bg: '#3B82F610',
    hint: 'Her hafta kilo girmek yeterli.',
  },
  {
    emoji: '📋',
    title: 'Programlar',
    subtitle: 'Alt menü → 3. sekme',
    desc: 'Sana özel program oluşturabilir ya da hazır programlardan birini seçebilirsin. Başlangıç için hazır programlar idealdir.',
    color: '#8B5CF6',
    bg: '#8B5CF610',
    hint: '"Kişisel" sekmesinden wizard\'ı dene.',
  },
  {
    emoji: '✨',
    title: 'Hazırsın!',
    subtitle: 'Hadi başlayalım',
    desc: 'İlk antrenmanını başlatmak için alttaki Antrenman sekmesine dokun. Takılırsan Profil → Yardım\'a bakabilirsin.',
    color: '#10B981',
    bg: '#10B98110',
    isLast: true,
  },
];

export default function AppTour() {
  const [step, setStep] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const setTourShown = useSettingsStore(s => s.setTourShown);

  const slide = SLIDES[step];

  function next() {
    if (slide.isLast) { dismiss(); return; }
    setLeaving(true);
    setTimeout(() => { setStep(s => s + 1); setLeaving(false); }, 220);
  }

  function dismiss() {
    setTourShown(true);
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center px-6"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}>

      {/* Skip */}
      {!slide.isLast && (
        <button
          onClick={dismiss}
          className="absolute top-5 right-5 text-xs text-white/30 hover:text-white/60 transition-colors"
        >
          Atla
        </button>
      )}

      {/* Card */}
      <div
        className="w-full max-w-sm rounded-3xl p-8 flex flex-col items-center text-center transition-all duration-220"
        style={{
          background: '#1E293B',
          border: `1px solid ${slide.color}30`,
          opacity: leaving ? 0 : 1,
          transform: leaving ? 'scale(0.97)' : 'scale(1)',
        }}
      >
        {/* Emoji */}
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-5"
          style={{ background: slide.bg, border: `1px solid ${slide.color}40` }}
        >
          {slide.emoji}
        </div>

        {/* Subtitle */}
        <p className="text-xs font-semibold uppercase tracking-widest mb-1"
          style={{ color: slide.color }}>
          {slide.subtitle}
        </p>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white mb-3">{slide.title}</h2>

        {/* Description */}
        <p className="text-sm text-white/60 leading-relaxed mb-4">{slide.desc}</p>

        {/* Hint chip */}
        {slide.hint && (
          <div className="text-xs text-white/40 bg-white/5 rounded-xl px-3 py-2 mb-2">
            💡 {slide.hint}
          </div>
        )}
      </div>

      {/* Progress dots */}
      <div className="flex items-center gap-2 mt-5 mb-4">
        {SLIDES.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === step ? 20 : 6,
              height: 6,
              background: i === step ? '#14B8A6' : 'rgba(255,255,255,0.15)',
            }}
          />
        ))}
      </div>

      {/* CTA button */}
      <button
        onClick={next}
        className="w-full max-w-sm py-4 rounded-2xl text-sm font-bold transition-all"
        style={{ background: slide.color, color: '#fff' }}
      >
        {slide.isLast ? 'Hadi Başlayalım 🚀' : 'İleri →'}
      </button>
    </div>
  );
}
