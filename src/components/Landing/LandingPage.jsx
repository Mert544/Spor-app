import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SlideUp, FadeIn } from '../UI/AnimatedCard.jsx';

const FEATURES = [
  {
    icon: '🤖',
    title: 'AI Koç',
    description: 'Claude destekli kişisel antrenman koçun 7/24 yanında.',
  },
  {
    icon: '📋',
    title: 'Özel Programlar',
    description: 'Hedeflerine göre kişiselleştirilmiş antrenman programları oluştur.',
  },
  {
    icon: '📊',
    title: 'Detaylı Analitik',
    description: 'İlerlemini grafikler ve istatistiklerle takip et.',
  },
  {
    icon: '💾',
    title: 'Offline Destek',
    description: 'İnternet olmadan da antrenman logla, sonra senkronize et.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Ahmet Y.',
    text: '3 ayda 8 kilo yağ kaybettim! AI koç programları harika.',
    avatar: '👨‍🦱',
  },
  {
    name: 'Elif K.',
    text: 'V-Taper sayesinde ilk kez düzenli antrenman yapabiliyorum.',
    avatar: '👩‍🦰',
  },
  {
    name: 'Murat T.',
    text: 'Program oluşturma özelliği çok kullanışlı. Teşekkürler!',
    avatar: '👨‍🦳',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#14B8A6]/10 to-transparent" />
        <div className="relative px-6 pt-20 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-extrabold text-white mb-4">
              V-Taper <span className="text-[#14B8A6]">Coach</span>
            </h1>
            <p className="text-lg text-white/60 mb-8 max-w-md mx-auto">
              Yapay zeka destekli kişisel antrenman uygulaması. Hedeflerine ulaş, formunu geliştir.
            </p>
            <Link
              to="/antenman"
              className="inline-block px-8 py-4 bg-[#14B8A6] text-white font-bold rounded-2xl hover:bg-[#14B8A6]/80 transition-colors"
            >
              Hemen Başla - Ücretsiz
            </Link>
          </motion.div>

          {/* Hero Image/Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12 relative mx-auto max-w-xs"
          >
            <div className="bg-bg-card border border-white/10 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#14B8A6]/20 flex items-center justify-center text-2xl">
                  💪
                </div>
                <div>
                  <p className="font-semibold text-white">Bugünkü Antrenman</p>
                  <p className="text-xs text-white/50">Göğüs & Triceps</p>
                </div>
              </div>
              <div className="space-y-2">
                {['Bench Press', 'Incline Dumbbell', 'Cable Fly'].map((ex, i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-3 flex items-center justify-between">
                    <span className="text-sm text-white/80">{ex}</span>
                    <span className="text-xs text-[#14B8A6]">4×12</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16">
        <SlideUp>
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Neden V-Taper Coach?
          </h2>
        </SlideUp>
        <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
          {FEATURES.map((feature, i) => (
            <SlideUp key={i} delay={i * 0.1}>
              <div className="bg-bg-card border border-white/10 rounded-2xl p-4 h-full">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                <p className="text-xs text-white/50">{feature.description}</p>
              </div>
            </SlideUp>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-16 bg-gradient-to-b from-transparent to-[#14B8A6]/5">
        <SlideUp>
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Kullanıcılarımız Diyor ki
          </h2>
        </SlideUp>
        <div className="space-y-4 max-w-md mx-auto">
          {TESTIMONIALS.map((t, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="bg-bg-card border border-white/10 rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl">
                    {t.avatar}
                  </div>
                  <span className="font-semibold text-white">{t.name}</span>
                </div>
                <p className="text-sm text-white/60">{t.text}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="px-6 py-16">
        <SlideUp>
          <h2 className="text-2xl font-bold text-white text-center mb-4">
            Premium Özellikler
          </h2>
          <p className="text-white/50 text-center mb-8 text-sm">
            Tüm özellikleri açmak için Premium'a geç
          </p>
        </SlideUp>
        <div className="bg-bg-card border border-[#14B8A6]/30 rounded-2xl p-6 max-w-md mx-auto">
          <div className="text-center mb-6">
            <span className="text-4xl font-bold text-white">₺49</span>
            <span className="text-white/50">/ay</span>
          </div>
          <ul className="space-y-3 mb-6">
            {[
              'AI Koç tam erişim (20 mesaj/gün)',
              'Sınırsız özel program',
              'Gelişmiş analitik',
              'Form videoları',
              'Yemek planlama',
            ].map((f, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-white/70">
                <span className="text-[#14B8A6]">✓</span>
                {f}
              </li>
            ))}
          </ul>
          <Link
            to="/premium"
            className="block w-full py-3 bg-[#14B8A6] text-white font-semibold rounded-xl text-center hover:bg-[#14B8A6]/80 transition-colors"
          >
            Premium'a Geç
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">
          Hazır mısın?
        </h2>
        <p className="text-white/50 mb-6">
          Ücretsiz başla, hedeflerine ulaş
        </p>
        <Link
          to="/antenman"
          className="inline-block px-8 py-4 bg-white text-[#0f172a] font-bold rounded-2xl hover:bg-white/90 transition-colors"
        >
          Hemen Başla
        </Link>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-white/10">
        <div className="text-center text-white/30 text-xs">
          <p>V-Taper Coach © 2026</p>
          <p className="mt-2">
            <Link to="/premium" className="hover:text-white/50 transition-colors">Premium</Link>
            {' · '}
            <Link to="/profil" className="hover:text-white/50 transition-colors">Profil</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
