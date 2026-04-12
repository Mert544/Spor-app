import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ── Supplement data ─────────────────────────────────────────────────────────
const SUPPS = [
  // ── Başlangıç ──────────────────────────────────────────────────────────────
  {
    level: 'beginner',
    emoji: '💧',
    name: 'Kreatin Monohidrat',
    tag: 'Kas Gücü',
    tagColor: '#14B8A6',
    benefit: 'Kuvveti %5–15 artırır, kas hacmini destekler',
    desc: 'Spor biliminin en çok araştırılmış takviyesi. Kaslarındaki fosfokreatin depolarını doldurarak ağır setlerde daha fazla tekrar yapmanı sağlar. Uzun vadede kas kütlesine de katkısı vardır.',
    dose: '5g / gün',
    timing: 'Her gün (antrenman sonrası ideal)',
    note: 'Yükleme fazına gerek yok. Su içmeyi artır.',
    stars: 3,
    color: '#14B8A6',
  },
  {
    level: 'beginner',
    emoji: '🥛',
    name: 'Whey Protein',
    tag: 'Toparlanma',
    tagColor: '#F59E0B',
    benefit: 'Günlük protein hedefini kolayca karşılar',
    desc: 'Antrenman sonrası kas onarımı için protein şart. Yemeklerden yeterli protein alamıyorsan whey en pratik çözüm. Hedef: vücut ağırlığının her kg\'ı için 1.6–2.2g protein.',
    dose: '25–30g / öğün',
    timing: 'Antrenman sonrası 30–60 dk içinde',
    note: 'Süt alerjin varsa Whey İzolat veya bitki bazlı tercih et.',
    stars: 3,
    color: '#F59E0B',
  },
  {
    level: 'beginner',
    emoji: '💊',
    name: 'Multivitamin',
    tag: 'Genel Sağlık',
    tagColor: '#10B981',
    benefit: 'Eksik mikro besinleri tamamlar, bağışıklığı destekler',
    desc: 'Çeşitli beslenseniz bile bazı vitaminler (D3, B12, Çinko) yeterince alınamayabilir. İyi bir multivitamin bu boşlukları kapatır ve genel enerji seviyeni destekler.',
    dose: '1 tablet / gün',
    timing: 'Sabah kahvaltıyla (yağda çözünen vitaminler için)',
    note: 'Ucuz markalar yerine kaliteli markalar tercih et.',
    stars: 2,
    color: '#10B981',
  },

  // ── Orta ───────────────────────────────────────────────────────────────────
  {
    level: 'intermediate',
    emoji: '☕',
    name: 'Kafein',
    tag: 'Performans',
    tagColor: '#8B5CF6',
    benefit: 'Güç çıktısını %3–5 artırır, yorgunluğu geciktirir',
    desc: 'En etkili legal ergojenik yardımcı. Sinir sistemini uyararak hem kuvvet hem dayanıklılık performansını artırır. Zamanla tolerans gelişir, bu yüzden her gün kullanmaktan kaçın.',
    dose: '200–400mg',
    timing: 'Antrenman 30–45 dk öncesi',
    note: 'Uyku sorunun varsa saat 14:00\'ten sonra alma. Hafta 3-4 gün kullan.',
    stars: 3,
    color: '#8B5CF6',
  },
  {
    level: 'intermediate',
    emoji: '🐟',
    name: 'Omega-3 (Balık Yağı)',
    tag: 'Toparlanma',
    tagColor: '#F59E0B',
    benefit: 'İnflamasyonu azaltır, eklem sağlığını korur',
    desc: 'Yoğun antrenman inflamasyonu artırır. Omega-3 (EPA+DHA) bu inflamasyonu dengeleyerek daha hızlı toparlanmanı sağlar. Aynı zamanda kalp ve beyin sağlığını da destekler.',
    dose: '2–3g EPA+DHA / gün',
    timing: 'Yemeklerle (mide rahatsızlığını önler)',
    note: 'Balık yağı kapsülü yerine sıvı form daha ekonomik olabilir.',
    stars: 3,
    color: '#F59E0B',
  },
  {
    level: 'intermediate',
    emoji: '🌙',
    name: 'Magnezyum (Bisglisinat)',
    tag: 'Uyku & Toparlanma',
    tagColor: '#F59E0B',
    benefit: 'Uyku kalitesini artırır, kas kramplarını önler',
    desc: 'Pek çok kişide magnezyum eksikliği var ve bunun farkında değiller. Kas kasılması, uyku düzeni ve 300+ enzim reaksiyonunda rol oynar. Bisglisinat formu en iyi emilen türdür.',
    dose: '300–400mg',
    timing: 'Yatmadan 30–60 dk önce',
    note: 'Magnezyum oksit ucuz ama emilimi düşük. Bisglisinat veya malat tercih et.',
    stars: 2,
    color: '#6366F1',
  },

  // ── İleri ──────────────────────────────────────────────────────────────────
  {
    level: 'advanced',
    emoji: '🔥',
    name: 'Beta-Alanin',
    tag: 'Dayanıklılık',
    tagColor: '#E94560',
    benefit: 'Kas yanmasını geciktirir, yüksek tekrarlarda daha uzun sürer',
    desc: 'Karnosin sentezini artırarak kaslardaki asit birikimini tamponlar. 15–20 tekrarlı setlerde veya kondisyon antrenmanlarında en çok fark edilir. Ciltte karıncalanma hissi normaldir.',
    dose: '3.2–6.4g / gün',
    timing: 'Antrenman öncesi veya eşit bölerek gün içinde',
    note: 'Karıncalanma hissini azaltmak için küçük dozlara böl (0.8–1.6g).',
    stars: 3,
    color: '#E94560',
  },
  {
    level: 'advanced',
    emoji: '💉',
    name: 'Sitrulin Malat',
    tag: 'Kan Akışı & Pump',
    tagColor: '#8B5CF6',
    benefit: 'Nitrik oksit artışıyla kan akışını ve pump\'ı güçlendirir',
    desc: 'L-arginin\'den daha etkili bir yolla nitrik oksit üretimini artırır. Kas içi kan akışı artar, egzersiz kapasitesi yükselir. Aynı zamanda toparlanma süresini kısaltır.',
    dose: '6–8g',
    timing: 'Antrenman 45–60 dk öncesi',
    note: 'Pre-workout içindeyse ayrıca almana gerek yok. Etiket kontrolü yap.',
    stars: 2,
    color: '#8B5CF6',
  },
  {
    level: 'advanced',
    emoji: '🌿',
    name: 'Ashwagandha (KSM-66)',
    tag: 'Adaptoji & Kortizol',
    tagColor: '#10B981',
    benefit: 'Kortizolü düşürür, stres adaptasyonunu ve uykuyu iyileştirir',
    desc: 'Adaptojenik bir bitki olan Ashwagandha, kronik stres ve yoğun antrenmanın yükselttiği kortizol seviyesini dengeler. Uzun vadeli kullanımda uyku kalitesi, enerji ve kas gücü üzerine olumlu etkileri gözlemlenmiştir.',
    dose: '600mg / gün (KSM-66 veya Sensoril standartize)',
    timing: 'Yemeklerle veya yatmadan önce',
    note: 'Efekt birikimli — en az 4–8 haftada hissedilir.',
    stars: 2,
    color: '#10B981',
  },
];

const LEVELS = [
  { id: 'beginner',     label: 'Başlangıç', emoji: '🟢', desc: '0–1 yıl deneyim' },
  { id: 'intermediate', label: 'Orta',       emoji: '🟡', desc: '1–3 yıl deneyim' },
  { id: 'advanced',     label: 'İleri',      emoji: '🔴', desc: '3+ yıl deneyim' },
];

function StarRating({ count }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3].map(i => (
        <div key={i} className="w-2 h-2 rounded-full"
          style={{ background: i <= count ? '#14B8A6' : 'rgba(255,255,255,0.12)' }} />
      ))}
      <span className="text-[10px] text-white/30 ml-1">
        {count === 3 ? 'Güçlü kanıt' : count === 2 ? 'İyi kanıt' : 'Sınırlı kanıt'}
      </span>
    </div>
  );
}

function SuppCard({ s }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-2xl p-4 mb-3 cursor-pointer transition-all"
      style={{
        background: '#1E293B',
        border: `1px solid ${open ? s.color + '50' : 'rgba(255,255,255,0.06)'}`,
      }}
      onClick={() => setOpen(o => !o)}
    >
      {/* Header row */}
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: s.color + '18', border: `1px solid ${s.color}30` }}>
          {s.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-white">{s.name}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
              style={{ background: s.tagColor + '20', color: s.tagColor }}>
              {s.tag}
            </span>
          </div>
          <p className="text-xs text-white/50 mt-0.5 leading-snug">{s.benefit}</p>
        </div>
        <span className="text-white/30 text-sm flex-shrink-0 mt-1">{open ? '▲' : '▼'}</span>
      </div>

      {/* Expanded */}
      {open && (
        <div className="mt-3 pt-3 border-t border-white/6 space-y-3">
          <p className="text-xs text-white/60 leading-relaxed">{s.desc}</p>

          {/* Dose + timing */}
          <div className="flex gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-white/5 rounded-xl px-3 py-1.5">
              <span className="text-[10px] text-white/40">Doz</span>
              <span className="text-xs font-semibold text-white">{s.dose}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 rounded-xl px-3 py-1.5">
              <span className="text-[10px] text-white/40">Zaman</span>
              <span className="text-xs font-semibold text-white">{s.timing}</span>
            </div>
          </div>

          {/* Note */}
          <div className="text-xs text-white/40 bg-white/4 rounded-xl px-3 py-2">
            💡 {s.note}
          </div>

          {/* Evidence */}
          <StarRating count={s.stars} />
        </div>
      )}
    </div>
  );
}

export default function SupplementGuide() {
  const navigate = useNavigate();
  const [level, setLevel] = useState('beginner');

  // Cumulative: intermediate sees beginner too, advanced sees all
  const visible = SUPPS.filter(s => {
    if (level === 'beginner')     return s.level === 'beginner';
    if (level === 'intermediate') return s.level === 'beginner' || s.level === 'intermediate';
    return true;
  });

  const extras = visible.filter(s => s.level !== 'beginner' && level !== 'beginner');
  const base   = visible.filter(s => s.level === 'beginner');

  return (
    <div className="min-h-screen bg-bg pb-32">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-bg pt-14 pb-3 px-4 border-b border-white/6">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors mb-3">
          ← Geri
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
            style={{ background: '#14B8A615', border: '1px solid #14B8A630' }}>
            💊
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Supplement Rehberi</h1>
            <p className="text-xs text-white/40">Seviyene göre öneriler</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4">
        {/* Disclaimer */}
        <div className="text-xs text-white/30 bg-white/4 rounded-xl px-3 py-2.5 mb-4 leading-relaxed">
          ⚠️ Supplementler yemeklerin yerini almaz. Önce beslenme, uyku ve antrenman düzenini otur — sonra takviye düşün.
        </div>

        {/* Level selector */}
        <div className="flex gap-2 mb-5">
          {LEVELS.map(l => (
            <button
              key={l.id}
              onClick={() => setLevel(l.id)}
              className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all"
              style={level === l.id
                ? { background: '#14B8A6', color: '#fff' }
                : { background: '#1E293B', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }
              }
            >
              {l.emoji} {l.label}
            </button>
          ))}
        </div>

        {/* Level description */}
        <p className="text-xs text-white/30 mb-4 text-center">
          {LEVELS.find(l => l.id === level)?.desc} — {
            level === 'beginner' ? '3 temel supplement' :
            level === 'intermediate' ? '6 supplement (temel + ek)' :
            '9 supplement (temel + ek + ileri)'
          }
        </p>

        {/* Base supps */}
        <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
          Temel (her seviye)
        </p>
        {base.map(s => <SuppCard key={s.name} s={s} />)}

        {/* Extra supps */}
        {extras.length > 0 && (
          <>
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mt-4 mb-2">
              {level === 'intermediate' ? 'Orta Seviye Eklemeleri' : 'İleri Seviye Eklemeleri'}
            </p>
            {extras.map(s => <SuppCard key={s.name} s={s} />)}
          </>
        )}

        {/* Stack summary */}
        <div className="mt-5 p-4 rounded-2xl"
          style={{ background: '#14B8A610', border: '1px solid #14B8A625' }}>
          <p className="text-xs font-bold text-[#14B8A6] mb-2">
            📋 {LEVELS.find(l => l.id === level)?.label} Seviye Stack Özeti
          </p>
          {visible.map(s => (
            <div key={s.name} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
              <span className="text-xs text-white/70">{s.emoji} {s.name}</span>
              <span className="text-[11px] text-white/40">{s.dose}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
