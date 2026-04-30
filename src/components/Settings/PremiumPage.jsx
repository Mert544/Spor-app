import { useState } from 'react';
import useAuthStore, { SUBSCRIPTION_TIERS } from '../../store/useAuthStore';
import { PLANS } from '../../lib/stripe';

export default function PremiumPage() {
  const { subscriptionTier, subscriptionExpiry, isPremium, getTier } = useAuthStore();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const currentTier = getTier();
  const isExpired = subscriptionExpiry && new Date(subscriptionExpiry) < new Date();

  const handleSubscribe = async (plan) => {
    setLoading(true);
    try {
      // Create checkout session
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: plan.priceId,
          tier: plan.tier,
        }),
      });

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Ödeme başlatılamadı. Tekrar dene.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 pb-20">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">
          {isPremium ? '✨ Premium Üyeliğin' : '🚀 Premium\'a Yüksel'}
        </h1>
        <p className="text-sm text-white/60">
          {isPremium
            ? `Üyelik bitiş: ${formatDate(subscriptionExpiry)}`
            : 'Tüm özellikleri kilidini aç'}
        </p>
      </div>

      {/* Current Subscription Banner */}
      {isPremium && !isExpired && (
        <div className="bg-[#14B8A6]/10 border border-[#14B8A6]/30 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#14B8A6]/20 flex items-center justify-center text-2xl">
              👑
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-1">
                {currentTier.name} Üyelik Aktif
              </h3>
              <p className="text-xs text-white/60">
                {subscriptionExpiry && formatDate(subscriptionExpiry)}'e kadar geçerli
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Expiry Warning */}
      {isExpired && (
        <div className="bg-[#E94560]/10 border border-[#E94560]/30 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#E94560]/20 flex items-center justify-center text-2xl">
              ⚠️
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[#E94560] mb-1">Üyelik Sona Erdi</h3>
              <p className="text-xs text-white/60 mb-3">
                Premium özelliklere erişmek için yenilemen gerekiyor.
              </p>
              <button
                onClick={() => handleSubscribe(PLANS[1])}
                disabled={loading}
                className="w-full py-2 rounded-xl text-sm font-semibold bg-[#E94560] text-white"
              >
                Yenile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="space-y-4">
        {PLANS.map((plan, index) => (
          <div
            key={plan.id}
            className={`relative overflow-hidden rounded-2xl p-4 border transition-all ${
              plan.highlight
                ? 'border-[#14B8A6] bg-[#14B8A6]/5'
                : 'border-white/10 bg-bg-card'
            }`}
          >
            {/* Highlight Badge */}
            {plan.badge && (
              <div className="absolute top-0 right-0 bg-[#14B8A6] text-white text-xs px-3 py-1 rounded-bl-xl font-semibold">
                {plan.badge}
              </div>
            )}

            {/* Plan Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                <p className="text-xs text-white/60">
                  ₺{plan.price}/{plan.interval === 'month' ? 'ay' : 'yıl'}
                </p>
              </div>
              {subscriptionTier === plan.tier && !isExpired && (
                <div className="px-3 py-1 rounded-full bg-[#10B981]/20 text-[#10B981] text-xs font-semibold">
                  Aktif
                </div>
              )}
            </div>

            {/* Features */}
            <ul className="space-y-2 mb-4">
              {plan.features.map((feature, i) => {
                const isFeatureActive = isPremium && !isExpired;
                return (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-[#14B8A6] mt-0.5">
                      {isFeatureActive ? '✓' : '•'}
                    </span>
                    <span className={isFeatureActive ? 'text-white' : 'text-white/60'}>
                      {feature}
                    </span>
                  </li>
                );
              })}
            </ul>

            {/* Subscribe Button */}
            {subscriptionTier !== plan.tier && (
              <button
                onClick={() => handleSubscribe(plan)}
                disabled={loading}
                className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
                  plan.highlight
                    ? 'bg-[#14B8A6] text-white hover:bg-[#14B8A6]/80'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {loading ? 'Yükleniyor...' : 'Abone Ol'}
              </button>
            )}

            {/* Current Plan Indicator */}
            {subscriptionTier === plan.tier && !isExpired && (
              <div className="w-full py-3 rounded-xl text-sm font-semibold bg-white/5 text-white/60 text-center">
                Şu anki planın
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Feature Comparison */}
      <div className="mt-6">
        <h3 className="text-lg font-bold text-white mb-4 text-center">
          Özellik Karşılaştırma
        </h3>
        <div className="bg-bg-card border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-white/5">
                <th className="text-left p-3 text-white/60">Özellik</th>
                <th className="text-center p-3 text-white">Free</th>
                <th className="text-center p-3 text-[#14B8A6]">Premium</th>
                <th className="text-center p-3 text-[#8B5CF6]">Coach</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'AI Koç', free: '❌', premium: '✅', coach: '✅' },
                { name: 'Günlük mesaj', free: '-', premium: '20', coach: 'Sınırsız' },
                { name: 'Özel Programlar', free: '❌', premium: '✅', coach: '✅' },
                { name: 'Gelişmiş Analitik', free: '❌', premium: '✅', coach: '✅' },
                { name: 'Form Videoları', free: '❌', premium: '✅', coach: '✅' },
                { name: 'Yemek Planlama', free: '❌', premium: '✅', coach: '✅' },
                { name: '1:1 Koçluk', free: '❌', premium: '❌', coach: '✅' },
              ].map((row, i) => (
                <tr key={i} className="border-t border-white/5">
                  <td className="p-3 text-white/70">{row.name}</td>
                  <td className="p-3 text-center text-white/50">{row.free}</td>
                  <td className={`p-3 text-center ${i % 2 === 0 ? 'bg-[#14B8A6]/5' : ''}`}>
                    <span className="text-[#14B8A6]">{row.premium}</span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="text-[#8B5CF6]">{row.coach}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-6">
        <h3 className="text-lg font-bold text-white mb-4 text-center">
          Sık Sorulan Sorular
        </h3>
        <div className="space-y-3">
          {[
            {
              q: 'Premium\'a geçtim, özellikler hemen açılır mı?',
              a: 'Evet, ödeme başarılı olduğunda tüm özellikler anında aktif olur.',
            },
            {
              q: 'İstediğim zaman iptal edebilir miyim?',
              a: 'Evet, istediğiniz zaman aboneliğinizi iptal edebilirsiniz. Sözleşimizin süresi yoktur.',
            },
            {
              q: 'Coach planı nedir?',
              a: 'Coach planı, AI koçun yanında haftalık 1:1 koçluk desteği ve kişisel review\'ler içerir.',
            },
          ].map((faq, i) => (
            <div key={i} className="bg-bg-card border border-white/10 rounded-xl p-4">
              <details>
                <summary className="text-sm font-semibold text-white cursor-pointer">
                  {faq.q}
                </summary>
                <p className="text-xs text-white/60 mt-2">{faq.a}</p>
              </details>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
