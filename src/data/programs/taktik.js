// ─────────────────────────────────────────────────────────────────────────────
// TAKTİK ATLET PROGRAMI
// Kaynak: NSCA TSAC-F Framework, Mountain Tactical Institute (MTI),
//         Joel Jamieson Enerji Sistemleri (8weeksout.com),
//         Brad Nindl / Duncan French taktik performans araştırması,
//         PMC12133949 (SOF fitness profili, 2025)
//
// Temel prensipler:
//  • "Combat Chassis" önceliği: bacak + kalça + kor
//  • Relatif kuvvet hedefleri: Deadlift 2×BW · Pull-up +%25BW · Squat 1.5×BW
//  • Jamieson enerji sistemi: Alaktik(PCr) → Glikolitik → Aerobik
//  • Yük taşıma protokolü: haftada 1 × progressif rucking (MTI standardı)
//  • FMS ekranı + yaralanma önleme (>95% askeri yaralanma MSK kaynaklı)
// ─────────────────────────────────────────────────────────────────────────────

export const TAKTIK_ATLET_DAYS = [
  "Pzt - OPERATOR GÜÇ",
  "Sal - ALAKTİK GÜÇ",
  "Çar - AEROBİK BAZI",
  "Per - İŞ KAPASİTESİ",
  "Cum - YÜK TAŞIMA",
  "Cmt - HAREKET KALİTESİ",
];

export const TAKTIK_ATLET_PROGRAM = {
  // ── PAZARTESİ ───────────────────────────────────────────────────────────────
  "Pzt - OPERATOR GÜÇ": {
    color: "#1e40af", emoji: "🎯",
    subtitle: "Relatif Kuvvet · Combat Chassis · Yük Taşıma Temeli",
    morning: "Zone 2 Kürek — 20 dk · KAH 130-145 · Kardiyovasküler baz",
    exercises: [
      { id: "ta1", name: "Smith Deadlift (Ağır)", sets: 5, reps: "3-5", tempo: "2:1:X:1", rpe: "8-9", rest: 180, muscle: "Hamstring", note: "TAKTİK HEDEF: 2×BW (94kg = ~188kg hedef). Yerden çek, belden ilerlet. 'Combat chassis' temel kuvvet hareketi — MTI standardı.", superset: null },
      { id: "ta2", name: "Weighted Pull-Up", sets: 5, reps: "4-6", tempo: "2:1:X:0", rpe: "8-9", rest: 150, muscle: "Sırt", note: "TAKTİK HEDEF: +%25 BW (94kg × 0.25 = +23.5kg). NSCA elite: 8.2 tekrar +12.6kg yelek. Üstünlük = operasyonel değer.", superset: null },
      { id: "ta3", name: "DB Farmer's Walk", sets: 5, reps: "40 sn / 35m", tempo: "-", rpe: "8", rest: 75, muscle: "Kavrama", note: "Her elde 2×20kg DB — yük taşıma temel kalıbı. Kavrama + kor + ayak bileği stabilite. NSCA TSAC: loaded carry taktik atlette zorunlu.", superset: null },
      { id: "ta4", name: "Smith Squat (Taktik)", sets: 4, reps: "5-6", tempo: "3:1:X:0", rpe: "8", rest: 120, muscle: "Kuadriseps", note: "Rucking + merdiven tırmanma için relatif bacak kuvveti. MTI: squat 1.5×BW taktik orta standart.", superset: null },
      { id: "ta5", name: "Cable Row (Ağır)", sets: 3, reps: "6-8", tempo: "3:2:1:0", rpe: "8", rest: 90, muscle: "Sırt", note: "Orta sırt kuvveti — uzun süre ağır çanta/yelek taşımada postür korunması", superset: "ta6" },
      { id: "ta6", name: "Band Pull-Apart + Facepull", sets: 3, reps: "25+15", tempo: "1:1:1:0", rpe: "5", rest: 90, muscle: "Arka Delt", note: "Rotator cuff bakımı — her ağır çekiş seansının zorunlu karşı hareketi", superset: "ta5" },
    ],
  },

  // ── SALI ────────────────────────────────────────────────────────────────────
  "Sal - ALAKTİK GÜÇ": {
    color: "#dc2626", emoji: "💥",
    subtitle: "PCr Sistemi — Maksimal Güç Geliştirme (8-10 sn / tam dinlenme)",
    morning: null,
    exercises: [
      { id: "tb1", name: "Koşu Bandı Sprint (8-10 sn MAX)", sets: 8, reps: "8-10 sn", tempo: "MAX HIZ", rpe: "9-10", rest: 90, muscle: "Kardiyovasküler", note: "Jamieson alaktik güç protokolü: 8-10sn maksimal → 90sn TAM dinlenme. PCr tam resenez. 8 set. Yarı yoğunlukta YASAKLI — ya maks ya dinlenme.", superset: null },
      { id: "tb2", name: "Explosive Push-Up (Patlayıcı)", sets: 5, reps: "4-5", tempo: "0:0:X:0", rpe: "8-9", rest: 120, muscle: "Göğüs", note: "Her tekrar maksimal hız — eller yerden kalkmalı. Taktik: zemine kapanıp kalkma, savaş pozisyonu değişimi. PAP ilkesi.", superset: null },
      { id: "tb3", name: "Explosive Pull-Up (Patlayıcı)", sets: 5, reps: "4-5", tempo: "0:0:X:0", rpe: "8-9", rest: 120, muscle: "Sırt", note: "Patlayıcı çekiş — çene çubuğun üstüne hızla. Hedef: atılama, engel aşma, çekme senaryoları.", superset: null },
      { id: "tb4", name: "DB Jump Squat", sets: 4, reps: "5", tempo: "2:0:X:0", rpe: "8", rest: 90, muscle: "Kuadriseps", note: "Hafif DB (10-12kg her elde) — iniş yavaş, çıkış maksimal patlama. Alt vücut alaktik güç.", superset: null },
      { id: "tb5", name: "DB Swing (Rus Tarzı)", sets: 4, reps: "10", tempo: "1:0:X:0", rpe: "7-8", rest: 60, muscle: "Kalça", note: "Kalça sarkaç hareketi — gluteal güç zinciri, posterior chain explosive output. Taktik hız tabanı.", superset: null },
    ],
  },

  // ── ÇARŞAMBA ────────────────────────────────────────────────────────────────
  "Çar - AEROBİK BAZI": {
    color: "#059669", emoji: "🫀",
    subtitle: "Jamieson Kardiyak Çıktı Metodu — Zone 2 Aerobik Kapasite",
    morning: null,
    exercises: [
      { id: "tc1", name: "Kürek Ergometresi Zone 2", sets: 1, reps: "30-40 dk", tempo: "-", rpe: "5-6", rest: 0, muscle: "Kardiyovasküler", note: "Jamieson Kardiyak Çıktı Metodu: KAH 130-150, konuşabilecek kadar yavaş. Sol ventrikül eksantrik hipertrofisi = kalıcı aerobik baz. Taktik: uzun operasyonlarda dayanıklılık.", superset: null },
      { id: "tc2", name: "Bisiklet Zone 2 (Alternatif)", sets: 1, reps: "35-45 dk", tempo: "-", rpe: "5-6", rest: 0, muscle: "Kardiyovasküler", note: "Kürek yoksa bisiklet — interferans minimal, eklem dostu aerobik kapasite.", superset: null },
      { id: "tc3", name: "DB Goblet Squat (Mobilite Odaklı)", sets: 2, reps: "10", tempo: "5:3:1:0", rpe: "3", rest: 60, muscle: "Kuadriseps", note: "Aerobik günde aktif eklem bakımı — kalça mobilite, ağırlık yok / 8kg. Sıkı değil derin.", superset: "tc4" },
      { id: "tc4", name: "Band Hip Circle", sets: 2, reps: "15/yön", tempo: "2:0:2:0", rpe: "3", rest: 60, muscle: "Kalça", note: "Kalça stabilite + abduktör aktivasyon — rucking yaralanmalarının %40'ı kalça kökenli.", superset: "tc3" },
    ],
  },

  // ── PERŞEMBE ────────────────────────────────────────────────────────────────
  "Per - İŞ KAPASİTESİ": {
    color: "#d97706", emoji: "🔥",
    subtitle: "Glikolitik Devre — 30-90 sn Çalışma Aralıkları",
    morning: null,
    exercises: [
      { id: "td1", name: "Kürek Sprint (60-90 sn)", sets: 5, reps: "60-90 sn MAX", tempo: "-", rpe: "9", rest: 180, muscle: "Kardiyovasküler", note: "Jamieson laktik kapasite: 60-90sn tam güç → 1:2 çalışma:dinlenme. Tampon kapasite gelişimi. Taktik: savaş manevraları, koşu gereksinimleri.", superset: null },
      { id: "td2", name: "DB Thruster Devresi", sets: 4, reps: "15", tempo: "2:0:1:0", rpe: "8-9", rest: 90, muscle: "Full Body", note: "DB squat + press kombine — tam vücut glikolitik yük. Her elde 12-15kg. 'Work capacity' taktik işlevselliğin çekirdeği.", superset: "td3" },
      { id: "td3", name: "Pull-Up + Push-Up Devre", sets: 4, reps: "8 pull + 15 push", tempo: "1:0:1:0", rpe: "8-9", rest: 90, muscle: "Sırt+Göğüs", note: "Yorgunlukta kalistenik dayanıklılık — taktik standardı (NSCA: 2dk push-up ~60, pull-up ~8)", superset: "td2" },
      { id: "td4", name: "DB One-Arm Row (Hızlı)", sets: 3, reps: "20", tempo: "1:0:1:0", rpe: "8", rest: 60, muscle: "Sırt", note: "Yüksek tekrar çekiş dayanıklılığı — yorgunlukta sırt kuvveti", superset: "td5" },
      { id: "td5", name: "DB Farmer's Walk (Kısa, Ağır)", sets: 4, reps: "30 sn", tempo: "-", rpe: "8", rest: 60, muscle: "Kavrama", note: "Glikolitik kavrama dayanıklılığı — kısa ama ağır. Devre arası aktif dinlenme.", superset: "td4" },
    ],
  },

  // ── CUMA ────────────────────────────────────────────────────────────────────
  "Cum - YÜK TAŞIMA": {
    color: "#7c3aed", emoji: "🎒",
    subtitle: "Rucking + Ağırlıklı Taşıma · MTI Yük Protokolü",
    morning: null,
    exercises: [
      { id: "te1", name: "Sırt Çantası Yürüyüş (Koşu Bandı)", sets: 1, reps: "25-35 dk", tempo: "-", rpe: "6-7", rest: 0, muscle: "Kardiyovasküler", note: "MTI RUCKING PROTOKOLÜ: Koşu bandına 10-15kg çanta tak, %8-10 eğim, 5-6 km/s yürüyüş. Her hafta %10 yük artış — MAX 25kg. Rucking koşudan farklı: bağ dokusu + eklem adaptasyonu.", superset: null },
      { id: "te2", name: "DB Farmer's Walk (Ağır + Uzun)", sets: 5, reps: "50 sn / 40m", tempo: "-", rpe: "8", rest: 75, muscle: "Kavrama", note: "Her elde 2×20kg — taktik 'son mil' taşıma simülasyonu. NSCA: loaded carry aerobik + kuvvet entegrasyonu. Rucking'i tamamlayan.", superset: null },
      { id: "te3", name: "DB Goblet Carry (Göğüs Taşıma)", sets: 3, reps: "30 sn", tempo: "-", rpe: "7-8", rest: 60, muscle: "Kor", note: "DB göğüste — yaralı taşıma simülasyonu. Anti-fleksiyon kor + kalça stabilitesi. MTI operasyonel fonksiyonel hareket.", superset: null },
      { id: "te4", name: "DB Step-Up (Yüksek, Tek Bacak)", sets: 4, reps: "12/bacak", tempo: "2:1:1:0", rpe: "8", rest: 75, muscle: "Kuad+Kalça", note: "Merdiven tırmanma + tepecik tırmanma simülasyonu. Yüksek step (diz hizası). MTI: 'combat chassis' tek taraflı güç.", superset: "te5" },
      { id: "te5", name: "Weighted Pull-Up (Yelek Simülasyonu)", sets: 3, reps: "6-8", tempo: "2:1:1:0", rpe: "8", rest: 90, muscle: "Sırt", note: "Bant veya ağırlıkla — ekipman/zırh ağırlığını simüle. Taşımalı kuvvet standartı.", superset: "te4" },
    ],
  },

  // ── CUMARTESİ ───────────────────────────────────────────────────────────────
  "Cmt - HAREKET KALİTESİ": {
    color: "#0891b2", emoji: "🔍",
    subtitle: "FMS Bazlı Mobilite · Yaralanma Önleme · Toparlanma",
    morning: null,
    exercises: [
      { id: "tf1", name: "Nordic Curl (Hamstring Yaralanma Önleme)", sets: 3, reps: "5-6", tempo: "4:0:0:1", rpe: "7-8", rest: 90, muscle: "Hamstring", note: "Petersen 2011: Nordic curl hamstring yaralanma riskini %70 azaltır. Askeri MSK yaralanmalarının %95+ — önlenebilir. Pull-up bardan yapabilirsin.", superset: null },
      { id: "tf2", name: "Single-Leg RDL (Y-Balance Testi Hareketi)", sets: 3, reps: "8/bacak", tempo: "3:1:1:0", rpe: "6", rest: 60, muscle: "Hamstring", note: "Y-Balance testi tabanı — anterior reach asimetrisi <4cm hedef. 2.3-3.7× daha az yaralanma riski. Denge + hamstring = taktik temel.", superset: "tf3" },
      { id: "tf3", name: "Deep Squat Mobilite (Yavaş Goblet)", sets: 3, reps: "8", tempo: "6:4:1:0", rpe: "3", rest: 60, muscle: "Kuadriseps", note: "FMS derin squat ekranı geliştirme — çok yavaş in, dirsekler dizlere yaslan. Rucking kalça sağlığı.", superset: "tf2" },
      { id: "tf4", name: "Band Hip Circle + Clamshell", sets: 3, reps: "15/yön + 20", tempo: "2:0:2:0", rpe: "4", rest: 45, muscle: "Kalça", note: "Kalça abduktör + dış rotatör — yük taşıma yaralanmalarının %40'ı bu kasların zayıflığından. Direnç bandı.", superset: "tf5" },
      { id: "tf5", name: "Rotator Cuff Kompleksi (Band)", sets: 3, reps: "15+15+15", tempo: "2:1:2:0", rpe: "4", rest: 45, muscle: "Omuz", note: "Band pull-apart + dış rotasyon + facepull kombinasyonu. Taşıma + silah tutma omuz sağlığı.", superset: "tf4" },
      { id: "tf6", name: "Hanging Decompression + Omurga Traksiyon", sets: 3, reps: "45 sn", tempo: "-", rpe: "2", rest: 30, muscle: "Sırt", note: "Pull-up barına asıl — omurga dekompresyonu. Rucking + ağır yük sonrası intervertebral disk baskısını azaltır.", superset: null },
      { id: "tf7", name: "Hip 90/90 Stretch (Kalça Rotasyon)", sets: 2, reps: "5/taraf", tempo: "yavaş", rpe: "2", rest: 60, muscle: "Kalça", note: "Yerde her iki kalça 90° — kalça iç + dış rotasyon. FMS rotasyonel mobilite standardı. Operasyonel hız için temel.", superset: null },
    ],
  },
};
