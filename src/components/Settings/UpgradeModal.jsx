import { X } from 'lucide-react';
import { useState } from 'react';

export default function UpgradeModal({ isOpen, onClose, feature, onSubscribe }) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const featureInfo = {
    aiCoach: {
      title: 'AI Koç',
      description: 'Claude destekli kişisel antrenman koçunla 7/24 iletişim.',
      icon: '🤖',
      plan: 'premium',
    },
    customPrograms: {
      title: 'Özel Programlar',
      description: 'Kendi antrenman programlarını oluştur ve yönet.',
      icon: '📋',
      plan: 'premium',
    },
    advancedAnalytics: {
      title: 'Gelişmiş Analitik',
      description: 'Detaylı ilerleme grafları ve raporlar.',
      icon: '📊',
      plan: 'premium',
    },
    formVideos: {
      title: 'Form Videoları',
      description: 'Her egzersiz için profesyonel form videoları.',
      icon: '📹',
      plan: 'premium',
    },
    mealPlanning: {
      title: 'Yemek Planlama',
      description: 'Hedeflerine göre otomatik yemek planı.',
      icon: '🍽️',
      plan: 'premium',
    },
    oneOnOne: {
      title: '1:1 Koçluk',
      description: 'Haftalık kişisel koçluk ve değerlendirme.',
      icon: '👨‍🏫',
      plan: 'coach',
    },
  };

  const info = featureInfo[feature];

  const handleSubscribe = () => {
    setLoading(true);
    onSubscribe(info.plan);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-bg-card border border-white/10 rounded-3xl p-6 max-w-sm w-full">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#14B8A6]/20 to-[#8B5CF6]/20 flex items-center justify-center text-4xl mb-4">
          {info?.icon}
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-white mb-2">
          {info?.title}
        </h2>

        {/* Description */}
        <p className="text-sm text-white/60 mb-6">
          {info?.description}
        </p>

        {/* Price */}
        <div className="bg-white/5 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-white/50">Premium</p>
              <p className="text-2xl font-bold text-white">₺49/ay</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/50">Yıllık</p>
              <p className="text-lg font-bold text-[#14B8A6]">₺399</p>
            </div>
          </div>
          <p className="text-xs text-[#10B981] mt-2">
            %33 tasarruf etmek için yıllık seç
          </p>
        </div>

        {/* Subscribe Button */}
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="w-full py-3 rounded-xl text-sm font-semibold bg-[#14B8A6] text-white hover:bg-[#14B8A6]/80 transition-all"
        >
          {loading ? 'Yükleniyor...' : 'Premium\'a Geç'}
        </button>

        {/* Cancel */}
        <button
          onClick={onClose}
          disabled={loading}
          className="w-full py-2 text-xs text-white/40 hover:text-white/60 transition-colors"
        >
          İptal
        </button>
      </div>
    </div>
  );
}
