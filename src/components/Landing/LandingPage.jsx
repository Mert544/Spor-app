import { useNavigate } from 'react-router-dom';

const featureList = [
  { emoji: '📴', title: 'Tamamen Çevrimdışı', desc: 'İnternet olmadan antrenman yap, log kaydet. Verilerin cihazında kalır.' },
  { emoji: '🏋️', title: 'Özel Programlar', desc: 'Kendi programını oluştur, mesocycle planla, haftalık ilerlemeni takip et.' },
  { emoji: '📊', title: 'Detaylı Analiz', desc: 'Hacim, yoğunluk, PR ve ilerleme grafikleriyle gelişimini gör.' },
  { emoji: '🔔', title: 'Akıllı Hatırlatıcı', desc: 'Antrenman günlerinde otomatik bildirim, dinlenme zamanlayıcısı.' },
];

const plans = [
  {
    name: 'Ücretsiz',
    price: '₺0',
    features: ['Hazır program kütüphanesi', 'Günlük antrenman takibi', 'Temel ilerleme grafikleri', 'Dinlenme zamanlayıcısı'],
    accent: false,
  },
  {
    name: 'Premium',
    price: '₺49/ay',
    features: ['Sınırsız özel program', 'Mesocycle planlama', 'Program analizi & karşılaştırma', 'Detaylı progress raporları', 'Supplement rehberi'],
    accent: true,
  },
];

export default function LandingPage() {
  const nav = useNavigate();

  const start = () => {
    nav('/');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      {/* Hero */}
      <section className="px-6 pt-16 pb-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#14B8A6]/15 border border-[#14B8A6]/30 flex items-center justify-center text-3xl mx-auto mb-6">
          💪
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-3">
          V-Taper <span className="text-[#14B8A6]">Coach</span>
        </h1>
        <p className="text-sm text-white/50 max-w-xs mx-auto mb-8 leading-relaxed">
          Vücut geliştirme antrenmanlarını planla, takip et ve ilerle. Offline-first, veri gizliliği öncelikli.
        </p>
        <button
          onClick={start}
          className="px-8 py-3 rounded-xl bg-[#14B8A6] text-white text-sm font-bold shadow-lg shadow-[#14B8A6]/20 active:scale-[0.97] transition-transform"
        >
          Hemen Başla →
        </button>
      </section>

      {/* Features */}
      <section className="px-4 pb-12">
        <p className="text-xs font-semibold text-white/30 uppercase tracking-wider text-center mb-5">Özellikler</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
          {featureList.map((f) => (
            <div key={f.title} className="rounded-2xl border border-white/8 bg-[#1e293b] p-4 text-left">
              <div className="text-2xl mb-2">{f.emoji}</div>
              <p className="text-sm font-bold text-white mb-1">{f.title}</p>
              <p className="text-xs text-white/40 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="px-4 pb-12">
        <p className="text-xs font-semibold text-white/30 uppercase tracking-wider text-center mb-5">Fiyatlandırma</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
          {plans.map((p) => (
            <div key={p.name} className={`rounded-2xl border p-5 ${p.accent ? 'border-[#14B8A6]/40 bg-[#14B8A6]/8' : 'border-white/8 bg-[#1e293b]'}`}>
              <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${p.accent ? 'text-[#14B8A6]' : 'text-white/40'}`}>{p.name}</p>
              <p className="text-2xl font-extrabold text-white mb-4">{p.price}</p>
              <ul className="space-y-2">
                {p.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2 text-xs text-white/60">
                    <span className={p.accent ? 'text-[#14B8A6]' : 'text-white/30'}>✓</span>
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="px-6 pb-16 text-center">
        <div className="rounded-2xl border border-[#14B8A6]/20 bg-[#14B8A6]/5 p-6 max-w-lg mx-auto">
          <p className="text-sm font-bold text-white mb-1">Bugün başla, ücretsiz dene.</p>
          <p className="text-xs text-white/40 mb-4">Kredi kartı gerekmez. İstediğin zaman yükselt.</p>
          <button
            onClick={start}
            className="px-6 py-2.5 rounded-xl bg-[#14B8A6] text-white text-xs font-bold active:scale-[0.97] transition-transform"
          >
            Ücretsiz Başla
          </button>
        </div>
        <p className="text-[10px] text-white/20 mt-6">© 2026 V-Taper Coach</p>
      </section>
    </div>
  );
}
