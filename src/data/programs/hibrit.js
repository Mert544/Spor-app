// ─────────────────────────────────────────────────────────────────────────────
// HİBRİT ATLET PROGRAMI
// Kaynak: Alex Viada "The Hybrid Athlete" (2015/2024), Nick Bare protokolü,
//         Wilson et al. 2012 meta-analizi (interferans etkisi modality bağımlı),
//         Coffey & Hawley 2017 (concurrent training), Seiler 2010 (polarize model)
//
// Temel prensipler:
//  • Sabah Zone 2 kardiyo (bisiklet/kürek) + akşam kuvvet → 6-8 saat ayrım
//  • Bisiklet tercih et: koşu ekzantrik kas hasarı = interferans (Wilson 2012)
//  • Polarize dağılım: %80 Zone 2 (130-150 KAH), %20 Zone 4-5 (interval)
//  • Kuvvette DUP: gün bazında rep range değişimi → nöromüsküler çeşitlilik
//  • Hedef standartlar: Squat 1.5×BW · Deadlift 2×BW · 5km sub-25dk
// ─────────────────────────────────────────────────────────────────────────────

export const HIBRIT_ATLET_DAYS = [
  "Pzt - ÜST KUVVET",
  "Sal - ALT KUVVET",
  "Çar - AEROBİK KAPASİTE",
  "Per - ÜST HACİM",
  "Cum - INTERVAL + KOR",
  "Cmt - UZUN AEROBİK",
  "Paz - AKTİF DİNLENME",
];

export const HIBRIT_ATLET_PROGRAM = {
  // ── PAZARTESİ ───────────────────────────────────────────────────────────────
  "Pzt - ÜST KUVVET": {
    color: "#E94560", emoji: "💪",
    subtitle: "Ağır Üst Kuvvet (Kuvvet Öncelikli) · AM: Zone 2 Bisiklet 30dk",
    morning: "Zone 2 Bisiklet — 30 dk · KAH 130-150 · Interferans yok (Wilson 2012: bisiklet ekzantrik hasar yaratmaz)",
    exercises: [
      { id: "ha1", name: "Smith Bench Press (Ağır)", sets: 4, reps: "4-5", tempo: "2:1:X:0", rpe: "8-9", rest: 180, muscle: "Göğüs", note: "ME seti — DUP Hf1-3: 4-5 tekrar, Hf5-7: 3-4 tekrar, Hf9-11: 2-3 tekrar. Kuvvet öncelikli.", superset: null },
      { id: "ha2", name: "Weighted Pull-Up", sets: 4, reps: "4-6", tempo: "2:1:X:0", rpe: "8-9", rest: 180, muscle: "Sırt", note: "Hibrit standart: +%25 BW eklentili çekiş. Bele plak veya bant takarak ağırlaştır.", superset: null },
      { id: "ha3", name: "DB Incline Press", sets: 3, reps: "6-8", tempo: "3:1:1:0", rpe: "8", rest: 120, muscle: "Göğüs", note: "Yardımcı hacim — üst göğüs", superset: "ha4" },
      { id: "ha4", name: "Cable Seated Row (Dar Tutuş)", sets: 3, reps: "6-8", tempo: "3:2:1:0", rpe: "8", rest: 120, muscle: "Sırt", note: "Orta sırt + rhomboid. Kürek kemiklerini tam çek.", superset: "ha3" },
      { id: "ha5", name: "Smith OHP (Oturur)", sets: 3, reps: "8-10", tempo: "2:1:1:0", rpe: "8", rest: 90, muscle: "Omuz", note: "Omuz güç bakımı — press standart için kritik", superset: "ha6" },
      { id: "ha6", name: "Cable Face Pull + Dış Rotasyon", sets: 3, reps: "15-20", tempo: "2:1:2:0", rpe: "6", rest: 90, muscle: "Arka Delt", note: "Rotator cuff sağlığı — her ağır press seansının zorunlu karşı hareketi", superset: "ha5" },
      { id: "ha7", name: "DB Lateral Raise", sets: 3, reps: "12-15", tempo: "2:1:2:0", rpe: "8-9", rest: 60, muscle: "Lat.Delt", note: "V-taper genişliği — hafif ağırlık, tam kontrol, 2sn iniş", superset: null },
    ],
  },

  // ── SALI ────────────────────────────────────────────────────────────────────
  "Sal - ALT KUVVET": {
    color: "#3B82F6", emoji: "🦵",
    subtitle: "Ağır Alt Kuvvet (Squat + Hinge) · AM: Zone 2 Kürek 30dk",
    morning: "Zone 2 Kürek Ergometresi — 30 dk · KAH 130-150 · Tam vücut aerobik baz",
    exercises: [
      { id: "hb1", name: "Smith Squat (Ağır)", sets: 4, reps: "4-5", tempo: "3:1:X:0", rpe: "8-9", rest: 180, muscle: "Kuadriseps", note: "Hibrit squat hedefi: 1.5×BW. Hf1-3: 4-5, Hf5-7: 3-4, Hf9-11: 2-3 tekrar. Tam derinlik.", superset: null },
      { id: "hb2", name: "DB Romanian Deadlift", sets: 4, reps: "6-8", tempo: "3:2:1:0", rpe: "8", rest: 150, muscle: "Hamstring", note: "Hibrit DL hedefi: 2×BW. Hamstring uzun eksen stretch — tam ROM.", superset: null },
      { id: "hb3", name: "DB Bulgarian Split Squat", sets: 3, reps: "8-10/bacak", tempo: "3:1:1:0", rpe: "8-9", rest: 90, muscle: "Kuad+Kalça", note: "Tek taraflı güç — koşu performansı için kritik. Arka ayak bench üzerinde.", superset: null },
      { id: "hb4", name: "Hip Thrust (Smith)", sets: 3, reps: "10-12", tempo: "2:1:2:0", rpe: "8", rest: 90, muscle: "Kalça", note: "Kalça ekstansiyonu gücü — koşu ve pedal verimliliği için", superset: "hb5" },
      { id: "hb5", name: "Nordic Curl", sets: 3, reps: "5-8", tempo: "4:0:0:0", rpe: "8-9", rest: 90, muscle: "Hamstring", note: "Yaralanma önleme — Petersen 2011: hamstring yaralanması riskini %70 azaltır. Pull-up bardan yapabilirsin.", superset: "hb4" },
      { id: "hb6", name: "Calf Raise Smith (Tek Bacak)", sets: 3, reps: "15/bacak", tempo: "2:2:1:0", rpe: "8", rest: 60, muscle: "Baldır", note: "Koşu ve bisiklet için baldır kuvveti + plantarfleksiyon gücü", superset: null },
    ],
  },

  // ── ÇARŞAMBA ────────────────────────────────────────────────────────────────
  "Çar - AEROBİK KAPASİTE": {
    color: "#14B8A6", emoji: "🫀",
    subtitle: "Zone 2 Aerobik Kapasite + Hafif Kuvvet Bakımı",
    morning: null,
    exercises: [
      { id: "hc1", name: "Bisiklet Zone 2 (Ana Seans)", sets: 1, reps: "35-45 dk", tempo: "-", rpe: "6-7", rest: 0, muscle: "Kardiyovasküler", note: "KAH 130-150 — konuşabilecek kadar yavaş. Mitokondri biogenezi + kardiyak yeniden şekillenme. İNTERFERANS YOK (bisiklet ekzantrik hasar vermez).", superset: null },
      { id: "hc2", name: "DB One-Arm Row (Bakım)", sets: 2, reps: "10-12", tempo: "3:1:1:0", rpe: "7", rest: 90, muscle: "Sırt", note: "Kuvvet bakımı — ağır günler arası toparlanmada kas sinyali canlı tutar", superset: "hc3" },
      { id: "hc3", name: "Smith Bench (Orta Yük)", sets: 2, reps: "10-12", tempo: "2:1:1:0", rpe: "7", rest: 90, muscle: "Göğüs", note: "Bakım hacmi — düşük yük, interferans riski minimal", superset: "hc2" },
      { id: "hc4", name: "Band Pull-Apart + Y-Raise", sets: 3, reps: "20+15", tempo: "1:1:1:0", rpe: "5", rest: 60, muscle: "Arka Delt", note: "Postür + rotator cuff — oturgun günün düzeltici hareketi", superset: null },
      { id: "hc5", name: "Hanging Leg Raise", sets: 3, reps: "12-15", tempo: "2:1:1:0", rpe: "7", rest: 60, muscle: "Karın", note: "Koşu için fonksiyonel kor — kalça fleksörü + abdominal entegrasyon", superset: "hc6" },
      { id: "hc6", name: "Dead Bug", sets: 3, reps: "8/taraf", tempo: "3:2:0:0", rpe: "6", rest: 60, muscle: "Kor", note: "Anti-ekstansiyon stabilite — koşu vuruşunda gövde sertliği için temel", superset: "hc5" },
    ],
  },

  // ── PERŞEMBE ────────────────────────────────────────────────────────────────
  "Per - ÜST HACİM": {
    color: "#EC4899", emoji: "📈",
    subtitle: "Üst Vücut Hipertrofi (Hacim) · AM: Zone 2 Bisiklet 30dk",
    morning: "Zone 2 Bisiklet — 30 dk · KAH 130-150 · PM antrenmanından 6-8 saat önce",
    exercises: [
      { id: "hd1", name: "Smith Incline Press (Hacim)", sets: 4, reps: "8-12", tempo: "3:1:1:0", rpe: "8", rest: 120, muscle: "Göğüs", note: "DUP: Pazartesi kuvvet, Perşembe hacim. Aynı kas farklı adaptasyon uyarısı.", superset: null },
      { id: "hd2", name: "Cable Lat Pulldown (Geniş)", sets: 4, reps: "10-12", tempo: "3:1:1:0", rpe: "8", rest: 120, muscle: "Latissimus", note: "Lat genişliği — geniş tutuş, dirsekler yanlarda aşağı çek", superset: null },
      { id: "hd3", name: "DB Lateral Raise (Oturur)", sets: 4, reps: "15-20", tempo: "2:1:2:0", rpe: "9", rest: 75, muscle: "Lat.Delt", note: "V-taper'ın kalbi — yüksek hacim lateral delt. 3sn eksantrik.", superset: "hd4" },
      { id: "hd4", name: "Cable Rear Delt Row", sets: 4, reps: "15-20", tempo: "2:1:2:0", rpe: "8", rest: 75, muscle: "Arka Delt", note: "Postür + omuz dengesi — ön/arka delt oranı", superset: "hd3" },
      { id: "hd5", name: "Dips (BW veya Ağırlıklı)", sets: 3, reps: "10-15", tempo: "2:1:1:0", rpe: "8", rest: 90, muscle: "Triseps", note: "Göğüs+triseps kombine — BW yeterince ağır (95kg)", superset: "hd6" },
      { id: "hd6", name: "DB Incline Curl", sets: 3, reps: "10-12", tempo: "3:1:1:0", rpe: "8-9", rest: 90, muscle: "Biseps", note: "Uzun baş stretch — 45° açı, tam serbest bırak", superset: "hd5" },
      { id: "hd7", name: "Cable OH Tricep Extension", sets: 3, reps: "12-15", tempo: "3:1:2:0", rpe: "8-9", rest: 75, muscle: "Triseps", note: "Uzun baş dominant — overhead > pushdown hipertrofi (Maeo 2023)", superset: "hd8" },
      { id: "hd8", name: "DB Hammer Curl", sets: 3, reps: "12-15", tempo: "2:1:1:0", rpe: "8", rest: 75, muscle: "Biseps", note: "Brakialis + brakioradialis — kol kalınlığı", superset: "hd7" },
    ],
  },

  // ── CUMA ────────────────────────────────────────────────────────────────────
  "Cum - INTERVAL + KOR": {
    color: "#F5A623", emoji: "⚡",
    subtitle: "Eşik Interval (Zone 4-5) + Fonksiyonel Kor",
    morning: null,
    exercises: [
      { id: "he1", name: "Bisiklet Interval (Zone 4-5)", sets: 5, reps: "3 dk ON / 3 dk OFF", tempo: "-", rpe: "8-9", rest: 180, muscle: "Kardiyovasküler", note: "Polarize modelin %20'lik yoğun tarafı — KAH >170, güçlü ayakla bas. Stöggl&Sperlich 2014: polarize model VO2max'ı %11.7 artırır.", superset: null },
      { id: "he2", name: "Explosive Push-Up", sets: 3, reps: "6-8", tempo: "1:0:X:0", rpe: "8", rest: 90, muscle: "Göğüs", note: "Güç bakımı — hızlı kuvvet, eller yerden kalksın. Hibrit atlet nöromüsküler güç korur.", superset: null },
      { id: "he3", name: "Pull-Up (Max Tekrar)", sets: 3, reps: "max", tempo: "2:0:1:0", rpe: "8-9", rest: 120, muscle: "Sırt", note: "Kuvvet bakımı — haftalık pull-up standardını koru", superset: null },
      { id: "he4", name: "Pallof Press (Anti-Rotasyon)", sets: 3, reps: "12/taraf", tempo: "2:2:1:0", rpe: "7", rest: 60, muscle: "Kor", note: "Koşu + bisiklet güç transferi için kritik kor stabilitesi", superset: "he5" },
      { id: "he5", name: "Cable Woodchop (Çapraz)", sets: 3, reps: "12/taraf", tempo: "2:0:1:0", rpe: "7-8", rest: 60, muscle: "Kor", note: "Rotasyonel güç — atletik transfer en yüksek kor hareketi", superset: "he4" },
      { id: "he6", name: "RKC Plank", sets: 3, reps: "25-30 sn", tempo: "-", rpe: "8-9", rest: 60, muscle: "Kor", note: "Standart plank değil — yumruklar, kalça sıkıştır, dizi düzleştir. Pavel Tsatsouline protokolü.", superset: null },
    ],
  },

  // ── CUMARTESİ ───────────────────────────────────────────────────────────────
  "Cmt - UZUN AEROBİK": {
    color: "#8B5CF6", emoji: "🏃",
    subtitle: "Uzun Zone 2 + Kuvvet Bakım Seti",
    morning: null,
    exercises: [
      { id: "hf1", name: "Kürek veya Bisiklet Zone 2 (Uzun)", sets: 1, reps: "45-60 dk", tempo: "-", rpe: "6-7", rest: 0, muscle: "Kardiyovasküler", note: "Haftalık en uzun aerobik seans — KAH 130-145. Mitokondri biogenezi için kritik. Seiler 2010: uzun düşük yoğunluklu seans adaptasyonun temel taşı.", superset: null },
      { id: "hf2", name: "Smith Squat (Bakım — Hafif)", sets: 2, reps: "5", tempo: "2:1:1:0", rpe: "7", rest: 120, muscle: "Kuadriseps", note: "Kuvvet bakımı — nöromüsküler sinyali canlı tut. Ağırlık düşür, RPE düşük.", superset: null },
      { id: "hf3", name: "Pull-Up (Bakım)", sets: 2, reps: "5", tempo: "2:1:1:0", rpe: "7", rest: 90, muscle: "Sırt", note: "Kuvvet bakımı — hafif, toparlanmayı bozmaz", superset: null },
      { id: "hf4", name: "DB Turkish Get-Up", sets: 2, reps: "3/taraf", tempo: "yavaş", rpe: "6", rest: 90, muscle: "Fonksiyonel", note: "Tam vücut mobilite + stabilite. Omuz sağlığı + hareket kalitesi kontrolü.", superset: null },
      { id: "hf5", name: "Köpük Rulo + Mobilite", sets: 1, reps: "10-15 dk", tempo: "-", rpe: "2", rest: 0, muscle: "Fonksiyonel", note: "Sırt + IT bandı + kuadriseps + baldır miyofasyal açılımı. Haftalık en iyi toparlanma yatırımı.", superset: null },
    ],
  },

  // ── PAZAR ───────────────────────────────────────────────────────────────────
  "Paz - AKTİF DİNLENME": {
    color: "#64748b", emoji: "🧘",
    subtitle: "Tam Dinlenme veya Hafif Yürüyüş · Parasempatik Toparlanma",
    morning: null,
    exercises: [
      { id: "hp1", name: "Yürüyüş (Açık Hava veya Koşu Bandı)", sets: 1, reps: "20-30 dk", tempo: "-", rpe: "3-4", rest: 0, muscle: "Kardiyovasküler", note: "Zone 1 — konuşabilecek kadar yavaş. Laktik asit temizleme, parasempatik aktivasyon.", superset: null },
      { id: "hp2", name: "Band Omuz Çevrimi + Dış Rotasyon", sets: 2, reps: "20/yön", tempo: "yavaş", rpe: "3", rest: 30, muscle: "Omuz", note: "Rotator cuff bakımı — haftanın en iyi omuz sağlığı yatırımı", superset: "hp3" },
      { id: "hp3", name: "Band Pull-Apart", sets: 2, reps: "25", tempo: "1:1:1:0", rpe: "3", rest: 30, muscle: "Arka Delt", note: "Postür kasları aktivasyonu", superset: "hp2" },
      { id: "hp4", name: "Derin Nefes + Köpük Rulo", sets: 1, reps: "10 dk", tempo: "-", rpe: "2", rest: 0, muscle: "Fonksiyonel", note: "Diyafragmatik nefes + kas gevşetme. Parasempatik sistem aktivasyonu.", superset: null },
    ],
  },
};
