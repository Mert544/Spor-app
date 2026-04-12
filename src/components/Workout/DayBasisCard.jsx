import { useState } from 'react';

// ─── Scientific basis per day type ─────────────────────────────────
// Matched by keyword scan on dayKey string
const BASIS_MAP = [
  {
    match: ['PUSH A', 'PUSH_A'],
    framework: 'Maksimal Efor (ME) Push Günü',
    color: '#E94560',
    principle: 'DUP — Günlük Dalgalı Periodizasyon · Ağır stimulus + lateral delt hacim',
    rationale: 'Düşük tekrar / yüksek ağırlık (4-6 tekrar) miyofibriler hipertrofiyi ve kuvvet adaptasyonunu önceliklendirir. Lateral deltoid, omuz/bel oranını (V-Taper Skoru / Adonis Index) doğrudan belirler — göğüs antrenmanı ile aynı seanste birleştirilmesi CNS yükünü çift istemez.',
    refs: ['Schoenfeld 2010 · Hypertrophy mechanisms', 'Zourdos 2016 · DUP superiority', 'Israetel & Hoffman · RP Strength volume landmarks'],
  },
  {
    match: ['PUSH B', 'PUSH_B'],
    framework: 'Dinamik Efor (DE) Push Günü',
    color: '#E94560',
    principle: 'DUP — Push A\'dan %20-30 düşük ağırlık, +2-4 tekrar aralığı · Hacim odaklı',
    rationale: 'Aynı haftada hem ağır (ME) hem hacimli (DE) stimulus, kas hipertrofisi için sinyal kademesini katlar. Rhea 2002: doğrusal olmayan periyodizasyon, lineer programlamaya kıyasla kuvvette %28 daha büyük artış sağlar. İkinci push günü kümülatif set hacmini karşılar.',
    refs: ['Rhea 2002 · Nonlinear periodization', 'Kramer 2004 · Weekly volume distribution', 'RP Strength · MEV → MAV wave loading'],
  },
  {
    match: ['PULL A', 'PULL_A'],
    framework: 'Lat Genişliği Öncelikli Çekiş Günü',
    color: '#3B82F6',
    principle: 'Dikey çekiş dominant · Barfiks latissimus dorsi\'yi en etkin aktive eden egzersizdir',
    rationale: 'Lehman 2004: geniş tutuş barfiks, lat EMG aktivasyonunu dar tutuştan %30 artırır. Latissimus dorsi, V-taper silüetinin temel kasıdır — omuzdan bele daralma görünümünü bel inceliğinden daha fazla belirler. Ağırlık eklenerek progresif aşırı yükleme zorunludur.',
    refs: ['Lehman 2004 · Grip width lat activation', 'Signorile 2002 · Pull-up EMG analysis', 'Contreras · Lat width vs. waist reduction'],
  },
  {
    match: ['PULL B', 'PULL_B'],
    framework: 'Horizontal Çekiş (Sırt Kalınlığı) Günü',
    color: '#3B82F6',
    principle: 'Row dominant · Skapular retraksiyon + mid-trapezius kalınlaşması',
    rationale: 'Kürek hareketi (row), sırt kalınlığını derinlemesine oluşturur. Skapula retraksiyonu rotator cuff kaslarını kuvvetlendirir, omuz impingement riskini düşürür. Pull A\'dan farklı uyarım bölgesi: erector spinae + mid-trap + rhomboid aktif.',
    refs: ['McGill · Scapular stability and shoulder health', 'Fenwick 2009 · Row variations EMG', 'Neumann 2010 · Biomechanics of rowing'],
  },
  {
    match: ['OMUZ', 'KOL', 'SHOULDER'],
    framework: 'Omuz Hacim + Kol İzolasyon Günü',
    color: '#F5A623',
    principle: 'Üçüncü gün mikrodinlenimi · Göğüs-sırt günlerine göre düşük CNS yükü',
    rationale: 'Arnold press, deltoidal başların tamamını tek harekette aktive eder (Campos et al. 2004: tüm deltoid aktivasyon). Kol kasları (bisep + trisep) bu günde "ücretsiz hacim" alır — kalan toparlanma kapasitesi kol büyümesine yönlendirilir. Üst vücut frekansı haftada 2→3\'e çıkar.',
    refs: ['Campos 2004 · Arnold press deltoid activation', 'Schoenfeld 2016 · Frequency and hypertrophy', 'Bompa · Concurrent specialization week'],
  },
  {
    match: ['BACAK', 'LEG', 'SQUAT'],
    framework: 'Tam Alt Vücut — Quad + Posterior Chain + Unilateral',
    color: '#10B981',
    principle: 'Squat (quad), Deadlift (posterior chain), Split Squat (unilateral) üçgeni',
    rationale: 'Squat ve deadlift, vücuttaki toplam kas kütlesinin büyük bölümünü aktive eder → GH ve IGF-1 sistemik artışı. Unilateral çalışma (Bulgarian split squat) sağ-sol asimetriyi giderir ve her taraftaki bağımsız adaptasyonu sağlar. McGill: nötral omurga pozisyonu yük altında spinal riski minimize eder.',
    refs: ['Schoenfeld 2011 · Lower body training optimization', 'McGill · Spine mechanics in squatting', 'Petersen 2011 · Nordic hamstring (-70% hamstring injury)'],
  },
  {
    match: ['GLUTE', 'KALİÇA', 'KALÇA'],
    framework: 'Bret Contreras "Strong Curves" — Kalça Dominant',
    color: '#EC4899',
    principle: 'Hip thrust birincil kaldırıcı · Glut max EMG — squat\'tan %25 daha fazla',
    rationale: 'Contreras et al. 2011: hip thrust, back squat\'a kıyasla gluteus maximus EMG aktivasyonunu %25 artırır. Kalça kasları, östrojen reseptörü yoğunluğu nedeniyle kadın atletlerde lokomotor merkez konumundadır. Haftada 2-3 kalça günü (Bikini Fit programında) RP Strength MRV\'ye ulaşmak için zorunludur.',
    refs: ['Contreras 2011 · Hip thrust vs squat glute EMG', 'Bret Contreras · Strong Curves methodology', 'Petersen 2011 · Nordic curl hamstring injury prevention'],
  },
  {
    match: ['ÜST KUVVET', 'ÜST HAC', 'UPPER'],
    framework: 'Wilson 2012 Interferans Minimizasyonu — Concurrent Training',
    color: '#3B82F6',
    principle: 'Sabah Zone 2 bisiklet (koşu değil) → PM kuvvet (6+ saat aralık)',
    rationale: 'Wilson 2012 ve Murach & Bagley 2016: cycling aero + strength concurrent training, AMPK-mTOR interferansını koşuya göre anlamlı düzeyde azaltır. Bisiklet eksentrik yük içermez → kas hasarı minimal → kuvvet seansına hazırlık optimum. 6 saatlik aralık, AMPK aktivasyonunun düşmesine yeter.',
    refs: ['Wilson 2012 · Concurrent training interference', 'Murach & Bagley 2016 · Molecular interference mechanisms', 'Hawley 2009 · AMPK-mTOR cross-talk'],
  },
  {
    match: ['ALT KUVVET', 'ALT HAC', 'LOWER'],
    framework: 'Upper/Lower Split — Frekans 2x / kasGrubu',
    color: '#10B981',
    principle: 'Alt vücut haftada 2 kez — kuvvet günü + hacim günü ayrımı',
    rationale: 'Schoenfeld 2016 meta-analizi: aynı haftalık hacimde haftada 2 kez antrenman, haftada 1 kezden %33 daha fazla hipertrofi sağlar. ALT KUVVET: ağır compound (squat/deadlift, düşük tekrar). ALT HACİM: orta ağırlık, yüksek TUT (tempo).',
    refs: ['Schoenfeld 2016 · Frequency meta-analysis', 'Krieger 2010 · Sets and frequency', 'Contreras · Hip-dominant vs quad-dominant days'],
  },
  {
    match: ['AEROBİK KAPASİTE', 'AEROB', 'ZONE 2'],
    framework: 'Maffetone Zone 2 — Aerobik Kapasite Günü',
    color: '#14B8A6',
    principle: 'Maksimal aerobik fonksiyon (MAF) 180-yaş kalp atışı — mitokondri yoğunluğu',
    rationale: 'Maffetone protokolü: 180-yaş formülü VO2max\'ın %65-75\'ine karşılık gelir (Zone 2). Bu bölgede yağ oksidasyonu ve mitokondriyal biogenesis (PGC-1α upregulation) maksimumda. Uzun dönemde VO2max artışı ve laktat eşiği gelişimi. Kuvvet antrenmanını destekler, interferans minimal.',
    refs: ['Maffetone · 180-formula and MAF method', 'Holloszy & Coyle 1984 · Mitochondrial adaptations', 'Gibala 2012 · Zone 2 vs HIIT for endurance base'],
  },
  {
    match: ['INTERVAL', 'HIIT', 'ALAKTİK'],
    framework: 'Alaktik Güç Sistemi — Fosfajen Gelişimi',
    color: '#F5A623',
    principle: 'Maksimal efor (<10sn) + tam toparlanma · ATP-PCr sistemi',
    rationale: 'Joel Jamieson (8 Weeks Out): alaktik güç geliştirme, fosfajen sistemi kapasitesini artırır. <10 saniye maksimal sprint/çalışma + 2-5 dakika tam toparlanma. Bu yapı laktat birikimine izin vermez → özgün fosfajen adaptasyonu. VO2max\'tan bağımsız güç sistemi.',
    refs: ['Jamieson 2009 · 8 Weeks Out alactic power', 'Gastin 2001 · Energy system contributions', 'Bompa · Periodization of alactic power'],
  },
  {
    match: ['OPERATOR', 'YÜK TAŞIMA', 'RUCKING'],
    framework: 'NSCA TSAC-F — Görev Odaklı Kuvvet',
    color: '#F5A623',
    principle: 'Göreve özgü kuvvet: DL 2×BW hedefi, pull-up +25%BW, loaded carry kapasitesi',
    rationale: 'MTI (Mountain Tactical Institute) araştırması: operasyonel görev başarısını en iyi öngören iki değişken relative strength (BW başına kuvvet) ve VO2max. Yük taşıma (rucking): Birgeneau et al. → her 4.5kg yük, %5 harcanan enerji artışı. Fonksiyonel kuvvet izometrik kuvvetten farklıdır.',
    refs: ['NSCA TSAC-F Tactical Strength & Conditioning', 'MTI · Relative strength in operational tasks', 'Birgeneau · Load carriage energy expenditure'],
  },
  {
    match: ['HAREKET KALİTESİ', 'FMS', 'MOBİLİTE'],
    framework: 'FMS + Jamieson Aerobik Güç — Aktif Toparlanma Günü',
    color: '#14B8A6',
    principle: 'Hareket kalitesi + aerobik güç birleşimi · Düşük CNS yükü, yüksek toparlanma verimi',
    rationale: 'Cook & Burton FMS: fonksiyonel hareket taraması yaralanmaları öngörür. Hareket kısıtlamaları ortadan kalkınca güç transferi artar. Aerobik güç (VO2max\'ın %80-90): laktat tampon kapasitesi geliştirir. Haftanın son günü bu bileşimi kullanmak kümülatif yorgunluğu tazer.',
    refs: ['Cook & Burton · FMS methodology', 'Jamieson · Aerobic power development', 'Bompa · Recovery week structure'],
  },
  {
    match: ['DİNLENME', 'AKTİF', 'REST', 'RECOVERY'],
    framework: 'Aktif Toparlanma — Parasempatik Dominans',
    color: '#14B8A6',
    principle: 'Düşük yoğunluklu aktivite → kan akışı → toparlanma hızlanması',
    rationale: 'Pasif dinlenme yerine aktif toparlanma (yürüyüş, yüzme, yoga): laktat temizleme hızını artırır, kas içi glikojen yenilenmesini destekler. Parasempatik sistem aktivasyonu (HRV artışı) bir sonraki yüksek yoğunluklu seans için hazırlığı optimize eder.',
    refs: ['Barnett 2006 · Active vs passive recovery', 'Bompa · Recovery week in periodization', 'HRV4Training · Parasympathetic dominance'],
  },
  {
    match: ['PUMP', 'VEN', 'METABOL'],
    framework: 'Metabolik Stres Günü — Sarkoplazma Hipertrofisi',
    color: '#10B981',
    principle: 'Düşük ağırlık / yüksek tekrar / kısa dinlenme → metabolik birikme',
    rationale: 'Schoenfeld 2013: metabolik stres (laktat + hidrojen iyonu + fosfat birikimi) sarkoplazma hipertrofisini ve Satellit hücre aktivasyonunu tetikler. Haftanın sonunda (kümülatif yorgunluk düşük) pump günü; TUT (tempo 2-1-2) ile kas üzerinde sürekli gerilim yüksek tutulur.',
    refs: ['Schoenfeld 2013 · Metabolic stress and hypertrophy', 'Burd 2012 · Low load high rep training', 'Mitchell 2012 · Mechanical tension vs metabolic stress'],
  },
];

function getBasis(dayKey) {
  if (!dayKey) return null;
  const upper = dayKey.toUpperCase();
  for (const b of BASIS_MAP) {
    if (b.match.some(kw => upper.includes(kw))) return b;
  }
  return null;
}

export default function DayBasisCard({ dayKey, accentColor }) {
  const [open, setOpen] = useState(false);
  const basis = getBasis(dayKey);
  if (!basis) return null;

  const color = accentColor || basis.color;

  return (
    <div
      className="mx-4 mb-3 rounded-xl overflow-hidden transition-all"
      style={{
        backgroundColor: open ? `${color}08` : 'transparent',
        border: `1px solid ${open ? color + '25' : 'rgba(255,255,255,0.07)'}`,
      }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color }}>📐</span>
          <span className="text-xs font-semibold text-white/50">
            {open ? basis.framework : 'Bilimsel Temel'}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {!open && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: color + '18', color: color }}
            >
              {basis.refs.length} kaynak
            </span>
          )}
          <span className="text-white/30 text-xs">{open ? '▲' : '▼'}</span>
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-white/5">
          {/* Principle */}
          <div
            className="mt-3 px-3 py-2.5 rounded-xl"
            style={{ backgroundColor: color + '12', border: `1px solid ${color}20` }}
          >
            <p className="text-xs font-semibold leading-snug" style={{ color }}>
              {basis.principle}
            </p>
          </div>

          {/* Rationale */}
          <p className="text-xs text-white/50 leading-relaxed px-1">
            {basis.rationale}
          </p>

          {/* References */}
          <div className="space-y-1">
            <p className="text-xs text-white/30 uppercase tracking-wider font-semibold px-1">
              Kaynaklar
            </p>
            {basis.refs.map((r, i) => (
              <div
                key={i}
                className="flex items-start gap-2 px-1"
              >
                <span className="text-white/30 text-xs mt-0.5 flex-shrink-0">{i + 1}.</span>
                <p className="text-xs text-white/40 leading-snug">{r}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
