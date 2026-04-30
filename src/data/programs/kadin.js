// Kadın Programları
// 1. Bikini Fit  — Glute + Shoulder estetik (Bret Contreras "Strong Curves" çerçevesi)
// 2. Güç & Şekil — Kuvvet + hipertrofi (4 gün Upper/Lower split)

// ─────────────────────────────────────────────
// BİKİNİ FİT — 5 gün
// ─────────────────────────────────────────────
export const BIKINI_FIT_DAYS = [
  "Pzt-GLUTE&HAMSTRING",
  "Sal-ÜST KUVVET",
  "Çar-TAM BACAK",
  "Per-OMUZ & KOL",
  "Cum-GLUTE PUMP",
];

export const BIKINI_FIT_PROGRAM = {
  "Pzt-GLUTE&HAMSTRING": {
    color: "#EC4899",
    emoji: "🍑",
    subtitle: "Kalça & Hamstring — haftanın en ağır kalça günü",
    exercises: [
      { id: "ka1", name: "Smith Hip Thrust", sets: 4, reps: "10-12", tempo: "1-0-2-1", rpe: "8", rest: 90, muscle: "Kalça", note: "Omuzlar düz bankın üst kenarına. Sırt düz, çene göğse. Tepe noktasında glut'ları sıkıştır 1 saniye. Kuvvet egzersizlerin kraliçesi." },
      { id: "ka2", name: "Smith Romanian Deadlift", sets: 3, reps: "10-12", tempo: "3-0-1-0", rpe: "7-8", rest: 75, muscle: "Hamstring", note: "Kalça geri git, sırt düz kal. Hamstring gerimi hisset. Dizler hafif bükülü." },
      { id: "ka3", name: "Nordic Curl", sets: 3, reps: "5-8", tempo: "4-0-1-0", rpe: "8", rest: 75, muscle: "Hamstring", note: "Ayaklar sabit, vücut öne kontrollü düş. Hamstring yaralanmasını %70 azaltır (Petersen 2011). Zor gelirse dirseklerle destekle." },
      { id: "ka4", name: "Tek Bacak Smith Hip Thrust", sets: 3, reps: "10-12 (her bacak)", tempo: "1-0-2-1", rpe: "7", rest: 60, muscle: "Kalça", note: "Bir bacak havada — denge güçlüğü daha fazla glut aktivasyonu sağlar. Kalçada simetri.", superset: "ka5" },
      { id: "ka5", name: "Band Hip Abduction (oturarak)", sets: 3, reps: "20-25", tempo: "1-0-1-0", rpe: "6", rest: 60, muscle: "Kalça Dış", note: "Diziüstü bant. Glut medius — diz çökmesini önler, kalça genişliğine katkı.", superset: null },
      { id: "ka6", name: "Cable Kickback", sets: 3, reps: "15-20 (her bacak)", tempo: "1-0-2-0", rpe: "7", rest: 45, muscle: "Kalça", note: "Bacak geriye-yukarı at, tepe noktasında dur. Bel değil kalça çalışıyor — gövde sabit." },
      { id: "ka7", name: "Dead Bug", sets: 3, reps: "10 (her taraf)", tempo: "2-0-2-0", rpe: "6", rest: 45, muscle: "Kor", note: "Sırt tamamen yerde. Karşı kol-bacak uzat, bel zeminden kalkmadan. Core stabilitesi." },
    ],
  },

  "Sal-ÜST KUVVET": {
    color: "#3B82F6",
    emoji: "💪",
    subtitle: "Üst Kuvvet — göğüs, sırt, omuz temeli",
    exercises: [
      { id: "kb1", name: "Smith Bench Press", sets: 4, reps: "8-10", tempo: "2-1-1-0", rpe: "7-8", rest: 90, muscle: "Göğüs", note: "Kürek kemiklerini masaya basarak dur. Geniş omuz çerçevesi için önemli. Ağırlığı serbest seç." },
      { id: "kb2", name: "Lat Pulldown (geniş tutuş)", sets: 4, reps: "10-12", tempo: "2-1-2-0", rpe: "7-8", rest: 75, muscle: "Sırt", note: "Göğüse çek, dirsekler arka-aşağı. V-taper silüeti için kadın atletlerde öncelikli." },
      { id: "kb3", name: "DB Arnold Press", sets: 3, reps: "10-12", tempo: "2-0-2-0", rpe: "7", rest: 60, muscle: "Omuz", note: "Avuç içi sana bakarken başla, bask ederken döndür. Tüm deltoid başlarını aktive eder." },
      { id: "kb4", name: "Cable Row (dar tutuş)", sets: 3, reps: "12-15", tempo: "2-0-2-0", rpe: "7", rest: 60, muscle: "Sırt", note: "Dirsekler gövdeye yakın, skapula retraksiyon. Postür + sırt kalınlığı.", superset: "kb5" },
      { id: "kb5", name: "DB Lateral Raise", sets: 3, reps: "15-20", tempo: "2-0-1-0", rpe: "6-7", rest: 60, muscle: "Omuz", note: "Parmak uca yönelsin (küçük parmak yukarı). Hafif ağırlık, yüksek tekrar — omuz genişliği.", superset: null },
      { id: "kb6", name: "Face Pull (band veya kablo)", sets: 3, reps: "15-20", tempo: "1-2-2-0", rpe: "6", rest: 45, muscle: "Omuz Arka", note: "Dış rotasyon — arka deltoid + rotator cuff. Postür düzeltme, yaralanma önleme." },
      { id: "kb7", name: "Plank + Kalça Kaldırma", sets: 3, reps: "30-45sn + 10 kalça", tempo: "-", rpe: "6", rest: 45, muscle: "Kor", note: "Plank sonunda kalçaları yavaşça yukarı kaldır (pike). Core + omuz stabilitesi." },
    ],
  },

  "Çar-TAM BACAK": {
    color: "#8B5CF6",
    emoji: "🦵",
    subtitle: "Tam Bacak — quad dominant, simetrik gelişim",
    exercises: [
      { id: "kc1", name: "Smith Goblet Squat (geniş duruş)", sets: 4, reps: "10-12", tempo: "3-1-1-0", rpe: "7-8", rest: 90, muscle: "Bacak", note: "Geniş duruş, parmaklar dışa. Inner thigh + glut aktivasyonu. Derin squat hedefle." },
      { id: "kc2", name: "DB Bulgarian Split Squat", sets: 3, reps: "10-12 (her bacak)", tempo: "3-0-1-0", rpe: "8", rest: 75, muscle: "Bacak+Kalça", note: "Arka ayak bankta. Ön bacak tüm yükü alıyor — diz öne geçebilir. Stretch-mediated hypertrophy." },
      { id: "kc3", name: "Smith Sumo Squat", sets: 3, reps: "12-15", tempo: "2-0-2-0", rpe: "7", rest: 60, muscle: "İç Bacak+Kalça", note: "Çok geniş duruş, parmaklar 45°. Adductor + glut medius hedef. İç bacak şekillenmesi.", superset: "kc4" },
      { id: "kc4", name: "Band Lateral Walk", sets: 3, reps: "15 adım her yön", tempo: "1-0-1-0", rpe: "6", rest: 60, muscle: "Kalça Dış", note: "Diz seviyesinde bant. Glut medius aktivasyonu. Diz valgusunu önler.", superset: null },
      { id: "kc5", name: "DB Step-Up", sets: 3, reps: "12-15 (her bacak)", tempo: "2-0-1-0", rpe: "7", rest: 60, muscle: "Bacak+Kalça", note: "Yüksek basamak tercih et — daha fazla glut. Her adımda tam duruş." },
      { id: "kc6", name: "Standing Calf Raise", sets: 3, reps: "20-25", tempo: "2-2-1-0", rpe: "7", rest: 45, muscle: "Baldır", note: "Tepe noktada 2sn dur. Tam hareket açısı — topuk aşağıdan başla." },
      { id: "kc7", name: "Hollow Hold", sets: 3, reps: "20-30sn", tempo: "-", rpe: "6-7", rest: 45, muscle: "Kor", note: "Bel yerde, kollar kulaklara yakın, bacaklar açıda. Tüm kor aktivasyonu." },
    ],
  },

  "Per-OMUZ & KOL": {
    color: "#F5A623",
    emoji: "💛",
    subtitle: "Omuz & Kol — V-şekli için omuz genişliği + kol tonu",
    exercises: [
      { id: "kd1", name: "DB OHP (oturarak)", sets: 4, reps: "8-10", tempo: "2-0-2-0", rpe: "8", rest: 90, muscle: "Omuz", note: "Oturarak daha izole. Sırt destekli olmak forma yardımcı olur. Omuz gelişiminin temeli." },
      { id: "kd2", name: "DB Lateral Raise (tekli kablo)", sets: 4, reps: "12-15", tempo: "2-0-2-0", rpe: "7", rest: 60, muscle: "Omuz", note: "Kablo ile sürekli gerilim. Omuz genişliği için en etkili izolasyon. Hafif ağırlık." },
      { id: "kd3", name: "DB Rear Delt Fly", sets: 3, reps: "15-20", tempo: "2-0-2-0", rpe: "6-7", rest: 45, muscle: "Omuz Arka", note: "Öne eğil, kollar yanlara. Arka deltoid + üst trapez. Postür ve 3D omuz görünümü.", superset: "kd4" },
      { id: "kd4", name: "Band Face Pull", sets: 3, reps: "15-20", tempo: "1-2-2-0", rpe: "6", rest: 45, muscle: "Omuz Arka", note: "Dış rotasyon ile bitir — her antrenmanda rotator cuff korunmalı.", superset: null },
      { id: "kd5", name: "DB Zottman Curl", sets: 3, reps: "10-12", tempo: "2-0-1-2", rpe: "7", rest: 60, muscle: "Bisep+Ön Kol", note: "Yukarıda regular curl, aşağıda reverse curl. Tüm bisep + brakioradialis. İki-bir hamlede.", superset: "kd6" },
      { id: "kd6", name: "Tricep Rope Pushdown", sets: 3, reps: "12-15", tempo: "2-0-2-0", rpe: "7", rest: 60, muscle: "Trisep", note: "Dirsekler sabit, el bileği nötral. Kol tonu için trisep bisepten büyük (üçte iki).", superset: null },
      { id: "kd7", name: "DB Hammer Curl", sets: 3, reps: "12-15", tempo: "2-0-1-0", rpe: "6-7", rest: 45, muscle: "Bisep+Ön Kol", note: "Nötral tutuş. Brakialis + brakioradialis. Kol görünümüne derinlik katar." },
    ],
  },

  "Cum-GLUTE PUMP": {
    color: "#10B981",
    emoji: "🔥",
    subtitle: "Glute Pump — yüksek hacim, kan akışı, kas hissi",
    exercises: [
      { id: "ke1", name: "Smith Hip Thrust (hafif-yüksek tekrar)", sets: 4, reps: "18-25", tempo: "1-1-1-1", rpe: "6-7", rest: 60, muscle: "Kalça", note: "Pazartesiden %30 az ağırlık. Tempo ve sıkıştırmaya odaklan. Pump hissi hedef." },
      { id: "ke2", name: "Cable Kickback", sets: 4, reps: "20 (her bacak)", tempo: "1-1-2-0", rpe: "6-7", rest: 45, muscle: "Kalça", note: "Yavaş kontrolle. Tepe noktada 1sn dur. Glut max tam kontraksiyonu.", superset: "ke3" },
      { id: "ke3", name: "Band Hip Abduction (ayakta)", sets: 4, reps: "25-30", tempo: "1-0-1-0", rpe: "6", rest: 45, muscle: "Kalça Dış", note: "Ayakta bant — glut medius. Denge + dış kalça şekillenmesi.", superset: null },
      { id: "ke4", name: "Frog Pump", sets: 4, reps: "25-30", tempo: "1-1-1-0", rpe: "6", rest: 45, muscle: "Kalça", note: "Sırt üstü, ayak tabanları birleşik (kurbağa), kalça iter. Düşük yük/yüksek tekrar — pump.", superset: "ke5" },
      { id: "ke5", name: "DB Glute Bridge", sets: 4, reps: "20", tempo: "1-2-1-0", rpe: "6", rest: 45, muscle: "Kalça", note: "DB karnın üstünde. Tepe noktada 2sn sıkıştır. Hip thrust öncüsü.", superset: null },
      { id: "ke6", name: "Plank Hold", sets: 3, reps: "45-60sn", tempo: "-", rpe: "6", rest: 45, muscle: "Kor", note: "Kalçalar ne yukarı ne aşağı. Gövde tam düz — foto çek, kontrol et." },
    ],
  },
};

// ─────────────────────────────────────────────
// GÜÇ & ŞEKİL — 4 gün (Upper/Lower split)
// Strong Curves (Bret Contreras) metodolojisi
// ─────────────────────────────────────────────
export const GUC_SEKIL_DAYS = [
  "Pzt-ALT KUVVET",
  "Sal-ÜST KUVVET",
  "Per-ALT HACİM",
  "Cum-ÜST HACİM",
];

export const GUC_SEKIL_PROGRAM = {
  "Pzt-ALT KUVVET": {
    color: "#E94560",
    emoji: "🏋️",
    subtitle: "Alt Kuvvet — ağır compound, kuvvet bazı",
    exercises: [
      { id: "ga1", name: "Smith Back Squat", sets: 4, reps: "5-6", tempo: "3-1-1-0", rpe: "8-9", rest: 120, muscle: "Bacak+Kalça", note: "Kuvvet günü — ağır. Hareket açısı tam: kalçalar diz hizasının altına. Sırt düz, göğüs yukarı." },
      { id: "ga2", name: "Smith Hip Thrust (ağır)", sets: 4, reps: "6-8", tempo: "1-1-2-1", rpe: "8-9", rest: 120, muscle: "Kalça", note: "Squat ile aynı ağırlık hedeflenir zamanla. Tepe noktada 1sn glut sıkıştırma zorunlu." },
      { id: "ga3", name: "Smith Romanian Deadlift", sets: 3, reps: "6-8", tempo: "3-0-1-0", rpe: "8", rest: 90, muscle: "Hamstring", note: "Ağırlığı kademeli artır. Hamstring tam gerilimi = hareket kalitesi. Sırt hiç yuvarlamamalı." },
      { id: "ga4", name: "DB Bulgarian Split Squat", sets: 3, reps: "8-10 (her bacak)", tempo: "3-0-1-0", rpe: "8", rest: 75, muscle: "Bacak+Kalça", note: "DB ağırlığı hafif zorlu hissetmeli. Simetri kontrolü — zayıf bacaktan başla." },
      { id: "ga5", name: "Nordic Curl", sets: 3, reps: "4-6", tempo: "5-0-1-0", rpe: "8-9", rest: 75, muscle: "Hamstring", note: "Kadınlarda hamstring yaralanması erkeklerden 2-4× daha sık — Nordic zorunlu. Kontrollü in." },
      { id: "ga6", name: "DB Farmer's Walk", sets: 3, reps: "30-40 metre", tempo: "-", rpe: "7", rest: 60, muscle: "Full Body", note: "Kavrama + core + trapez. Omurga sıkıştırma gücü. Metabolik son." },
    ],
  },

  "Sal-ÜST KUVVET": {
    color: "#3B82F6",
    emoji: "💪",
    subtitle: "Üst Kuvvet — bench, pull-up, press ağırlık günü",
    exercises: [
      { id: "gb1", name: "Smith Bench Press (ağır)", sets: 4, reps: "5-6", tempo: "2-1-1-0", rpe: "8-9", rest: 120, muscle: "Göğüs", note: "Kuvvet odaklı — ağır. Kürek kemikleri sabitleyin, kalça bankta. Progressif overload hedef." },
      { id: "gb2", name: "Pull-Up veya Assisted Pull-Up", sets: 4, reps: "5-8", tempo: "2-1-2-0", rpe: "8", rest: 90, muscle: "Sırt", note: "Ağırlıklı veya assisted. Lat aktivasyonu için en etkili çekim. Dirsek tam ekstansiyon başla." },
      { id: "gb3", name: "DB OHP (ayakta)", sets: 4, reps: "6-8", tempo: "2-0-2-0", rpe: "8", rest: 90, muscle: "Omuz", note: "Core aktif — gövde sabit. Omuz güçlenmesi + kol-omuz estetik kazanımı." },
      { id: "gb4", name: "Cable Row (ağır)", sets: 4, reps: "8-10", tempo: "2-0-2-0", rpe: "8", rest: 75, muscle: "Sırt", note: "Skapula tam retraksiyon. Üst sırt kuvveti = postür + V-şekli." },
      { id: "gb5", name: "DB Row (tek kol)", sets: 3, reps: "8-10 (her taraf)", tempo: "2-0-2-0", rpe: "8", rest: 60, muscle: "Sırt", note: "Banka destekle, ağır DB. Sırt kalınlığı ve simetri. Kürek kemiği hareketine odaklan." },
      { id: "gb6", name: "Dips (destekli veya paralel)", sets: 3, reps: "8-10", tempo: "2-1-1-0", rpe: "7-8", rest: 60, muscle: "Trisep+Göğüs", note: "Göğüs dipse: öne eğil. Trisep dipse: dik dur. Kol tonu + göğüs alt çizgisi." },
    ],
  },

  "Per-ALT HACİM": {
    color: "#EC4899",
    emoji: "🍑",
    subtitle: "Alt Hacim — orta ağırlık, yüksek tekrar, pump",
    exercises: [
      { id: "gc1", name: "Smith Squat (orta ağırlık)", sets: 4, reps: "10-12", tempo: "3-1-1-0", rpe: "7", rest: 75, muscle: "Bacak+Kalça", note: "Pazartesiden %20 az ağırlık. Hacim adaptasyonu — daha fazla kan akışı. Kas kaybetmeden yorgun hisset." },
      { id: "gc2", name: "Smith Hip Thrust (orta)", sets: 4, reps: "12-15", tempo: "1-1-2-1", rpe: "7-8", rest: 75, muscle: "Kalça", note: "Pazartesiden %15-20 az. Her tekrarda tam sıkıştırma. Hacim = kas büyümesi sinyali." },
      { id: "gc3", name: "DB Walking Lunge", sets: 3, reps: "12-15 (her bacak)", tempo: "2-0-1-0", rpe: "7", rest: 60, muscle: "Bacak+Kalça", note: "Geniş adım, ön diz 90°. Dinamik denge + tüm alt kuvvet kasları aktif.", superset: "gc4" },
      { id: "gc4", name: "Band Hip Abduction (oturarak)", sets: 3, reps: "25-30", tempo: "1-0-1-0", rpe: "6", rest: 60, muscle: "Kalça Dış", note: "Superset — dinlenmeden geç. Glut medius + outer sweep.", superset: null },
      { id: "gc5", name: "DB Single-Leg RDL", sets: 3, reps: "10-12 (her bacak)", tempo: "3-0-1-0", rpe: "7", rest: 60, muscle: "Hamstring+Kalça", note: "Denge + hamstring. Omurga nötral, kalça menteşe gibi. Düşerse hafif ağırlık al." },
      { id: "gc6", name: "Cable Kickback", sets: 3, reps: "15-20 (her bacak)", tempo: "1-1-2-0", rpe: "6-7", rest: 45, muscle: "Kalça", note: "Izolasyon finisher. Glut max kontraksiyon kalitesi. Ağırlık değil his." },
      { id: "gc7", name: "Hollow Hold", sets: 3, reps: "20-30sn", tempo: "-", rpe: "6", rest: 45, muscle: "Kor", note: "Antiextension core. Fonksiyonel güç — kalça kaldırmada karın desteği." },
    ],
  },

  "Cum-ÜST HACİM": {
    color: "#F5A623",
    emoji: "✨",
    subtitle: "Üst Hacim — omuz, sırt, kol şekillendirme",
    exercises: [
      { id: "gd1", name: "DB Incline Press", sets: 4, reps: "10-12", tempo: "2-1-1-0", rpe: "7-8", rest: 75, muscle: "Göğüs Üst", note: "45° yatakta. Üst göğüs ve omuz bileşimi. Köprücük kemiği hattı gelişimi." },
      { id: "gd2", name: "Lat Pulldown (nötral tutuş)", sets: 4, reps: "10-12", tempo: "2-1-2-0", rpe: "7-8", rest: 75, muscle: "Sırt", note: "Nötral (çekiç) tutuş lat aktivasyonunu artırır. Bükülmüş bilek yok — sıkı kavra." },
      { id: "gd3", name: "DB Lateral Raise", sets: 4, reps: "15-20", tempo: "2-0-1-0", rpe: "6-7", rest: 60, muscle: "Omuz", note: "Hafif ağırlık, yüksek tekrar. Omuz genişliği = V-taper kadın versiyonu. Haftalık en önemli izolasyon.", superset: "gd4" },
      { id: "gd4", name: "Rear Delt Fly", sets: 4, reps: "15-20", tempo: "2-0-2-0", rpe: "6-7", rest: 60, muscle: "Omuz Arka", note: "Öne eğil, hafif DB. Arka deltoid + romboid. 3 boyutlu omuz.", superset: null },
      { id: "gd5", name: "DB Curl (çift)", sets: 3, reps: "12-15", tempo: "2-0-1-0", rpe: "7", rest: 60, muscle: "Bisep", note: "Tam hareket açısı — omuz nötral. Bisep zirvesinde sıkıştır.", superset: "gd6" },
      { id: "gd6", name: "Skull Crusher (DB)", sets: 3, reps: "12-15", tempo: "2-0-1-0", rpe: "7", rest: 60, muscle: "Trisep", note: "DB alın üstüne indir. Dirsekler sabit. Kol tonunun %60'ı trisepten.", superset: null },
      { id: "gd7", name: "Face Pull", sets: 3, reps: "15-20", tempo: "1-2-2-0", rpe: "6", rest: 45, muscle: "Omuz Arka", note: "Her üst antrenmanı kapatır. Rotator cuff koruma + postür. Zorunlu finisher." },
    ],
  },
};
