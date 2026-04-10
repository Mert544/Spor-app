// V-Taper Coach — Tam Program Datası
// 6 günlük Push/Pull split, 12 haftalık program

export const DAYS = [
  "Pzt - PUSH A",
  "Sal - PULL A",
  "Çar - OMUZ+KOL",
  "Per - PUSH B",
  "Cum - PULL B",
  "Cmt - BACAK",
];

// JS getDay(): 0=Pazar, 1=Pazartesi...6=Cumartesi
// DAYS[0] = Pazartesi (index 1 → 0)
export const DAY_INDEX_MAP = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5 };

export const PROGRAM = {
  "Pzt - PUSH A": {
    color: "#E94560",
    emoji: "🔴",
    subtitle: "Ağır Göğüs + Triseps + Lateral Delt",
    morning: "Zone 2 Kürek Ergometresi — 30 dk",
    exercises: [
      {
        id: "pa1",
        name: "Smith İncline Press (30°)",
        sets: 4,
        reps: "5-6",
        tempo: "2:1:X:0",
        rpe: "8-9",
        rest: 180,
        muscle: "Göğüs",
        note: "ME tarzı — Hf1-3: İncline, Hf5-7: Flat, Hf9-11: Close-Grip",
        superset: null,
      },
      {
        id: "pa2",
        name: "Smith Flat Bench Press",
        sets: 3,
        reps: "8-10",
        tempo: "3:1:1:0",
        rpe: "8",
        rest: 90,
        muscle: "Göğüs",
        note: "Süperset ↔ Lateral Raise",
        superset: "pa3",
      },
      {
        id: "pa3",
        name: "DB Lateral Raise (3sn ecc)",
        sets: 3,
        reps: "12-15",
        tempo: "3:1:1:0",
        rpe: "8-9",
        rest: 90,
        muscle: "Lat.Delt",
        note: "15-20kg, katı form, 3sn iniş",
        superset: "pa2",
      },
      {
        id: "pa4",
        name: "Cable Fly (low-to-high)",
        sets: 3,
        reps: "12-15",
        tempo: "2:2:1:0",
        rpe: "8",
        rest: 75,
        muscle: "Göğüs",
        note: "Üst göğüs — 2sn stretch duraklama",
        superset: "pa5",
      },
      {
        id: "pa5",
        name: "Cable Cross-Body Lateral Raise",
        sets: 3,
        reps: "12-15",
        tempo: "2:1:2:0",
        rpe: "9",
        rest: 75,
        muscle: "Lat.Delt",
        note: "Yaslanarak stretch pozisyon — kablo avantajı",
        superset: "pa4",
      },
      {
        id: "pa6",
        name: "Dips (öne eğik, göğüs vurgusu)",
        sets: 3,
        reps: "8-12",
        tempo: "2:1:1:0",
        rpe: "8",
        rest: 60,
        muscle: "Göğüs+Tri",
        note: "95kg BW = ağır yük",
        superset: "pa7",
      },
      {
        id: "pa7",
        name: "Cable Face Pull + Dış Rotasyon",
        sets: 3,
        reps: "15-20",
        tempo: "2:1:1:0",
        rpe: "7-8",
        rest: 60,
        muscle: "Arka Delt",
        note: "Omuz sağlığı — her push günü zorunlu",
        superset: "pa6",
      },
      {
        id: "pa8",
        name: "Cable OH Tricep Extension (ip)",
        sets: 3,
        reps: "12-15",
        tempo: "3:1:2:0",
        rpe: "8-9",
        rest: 60,
        muscle: "Triseps",
        note: "Uzun baş stretch — overhead > pushdown (Maeo 2023)",
        superset: "pa9",
      },
      {
        id: "pa9",
        name: "Cable Pushdown (düz bar)",
        sets: 2,
        reps: "12-15",
        tempo: "2:1:2:0",
        rpe: "8",
        rest: 60,
        muscle: "Triseps",
        note: "Lateral + medial baş",
        superset: "pa8",
      },
      {
        id: "pa10",
        name: "DB Lateral Raise — Myo-Rep",
        sets: 1,
        reps: "15+4+4+3",
        tempo: "2:0:1:0",
        rpe: "9-10",
        rest: 15,
        muscle: "Lat.Delt",
        note: "≈3 efektif set — seans sonu finişer",
        technique: "myorep",
      },
    ],
  },

  "Sal - PULL A": {
    color: "#3B82F6",
    emoji: "🔵",
    subtitle: "Ağır Sırt + Biseps + Arka Delt",
    morning: "Zone 2 Kürek Ergometresi — 30 dk",
    exercises: [
      {
        id: "pb1",
        name: "Weighted Pull-Up",
        sets: 4,
        reps: "3-5",
        tempo: "2:1:X:0",
        rpe: "8-9",
        rest: 180,
        muscle: "Sırt",
        note: "ME — Hf1-3: Geniş Tutuş, Hf5-7: Close-Grip, Hf9-11: Nötr",
        superset: null,
      },
      {
        id: "pb2",
        name: "Chest-Supported DB Row",
        sets: 3,
        reps: "8-10",
        tempo: "3:2:1:0",
        rpe: "8",
        rest: 90,
        muscle: "Sırt",
        note: "Süperset ↔ Cable Pullover",
        superset: "pb3",
      },
      {
        id: "pb3",
        name: "Cable Pullover",
        sets: 3,
        reps: "12-15",
        tempo: "2:2:1:0",
        rpe: "8-9",
        rest: 90,
        muscle: "Latissimus",
        note: "Lat stretch — düz kol, hafif açı",
        superset: "pb2",
      },
      {
        id: "pb4",
        name: "Cable Curl (EZ veya düz bar)",
        sets: 4,
        reps: "10-12",
        tempo: "3:1:2:0",
        rpe: "8",
        rest: 75,
        muscle: "Biseps",
        note: "Bükülmüş pozisyonda tam kasılma",
        superset: null,
      },
      {
        id: "pb5",
        name: "Incline DB Curl (45°)",
        sets: 3,
        reps: "10-12",
        tempo: "3:1:1:0",
        rpe: "8-9",
        rest: 75,
        muscle: "Biseps",
        note: "Uzun baş stretch — inkline açısı önemli",
        superset: "pb6",
      },
      {
        id: "pb6",
        name: "Cable Bayrak Curl (Cross-body)",
        sets: 3,
        reps: "12-15",
        tempo: "3:1:1:0",
        rpe: "9",
        rest: 75,
        muscle: "Biseps",
        note: "Kısa baş vurgusu",
        superset: "pb5",
      },
      {
        id: "pb7",
        name: "Cable Rope Facepull",
        sets: 3,
        reps: "15-20",
        tempo: "2:1:2:0",
        rpe: "7-8",
        rest: 60,
        muscle: "Arka Delt",
        note: "Dış rotasyon ile bitir",
        superset: "pb8",
      },
      {
        id: "pb8",
        name: "Bent-over DB Rear Delt Fly",
        sets: 3,
        reps: "15-20",
        tempo: "2:1:2:0",
        rpe: "8",
        rest: 60,
        muscle: "Arka Delt",
        note: "Hafif dirsek bükülmesi, kontrollü",
        superset: "pb7",
      },
      {
        id: "pb9",
        name: "DB Hammer Curl — Myo-Rep",
        sets: 1,
        reps: "15+4+4+3",
        tempo: "2:0:1:0",
        rpe: "9-10",
        rest: 15,
        muscle: "Biseps",
        note: "Brakialis + biseps — finişer",
        technique: "myorep",
      },
    ],
  },

  "Çar - OMUZ+KOL": {
    color: "#F5A623",
    emoji: "🟡",
    subtitle: "Omuz Uzmanlaşma + Kol Hacmi",
    morning: "Zone 2 Koşu Bandı — 30 dk",
    exercises: [
      {
        id: "pc1",
        name: "Smith OHP (Oturur)",
        sets: 4,
        reps: "5-6",
        tempo: "2:1:X:0",
        rpe: "8-9",
        rest: 180,
        muscle: "Omuz",
        note: "ME — Progresif Overload odağı",
        superset: null,
      },
      {
        id: "pc2",
        name: "DB Lateral Raise (oturur)",
        sets: 4,
        reps: "12-15",
        tempo: "3:1:1:0",
        rpe: "9",
        rest: 90,
        muscle: "Lat.Delt",
        note: "V-taper için kritik — çok önemli",
        superset: "pc3",
      },
      {
        id: "pc3",
        name: "Cable Rear Delt Row",
        sets: 4,
        reps: "12-15",
        tempo: "2:1:2:0",
        rpe: "8-9",
        rest: 90,
        muscle: "Arka Delt",
        note: "Dirsekler omuz hizasında",
        superset: "pc2",
      },
      {
        id: "pc4",
        name: "Cable OH Tricep Extension",
        sets: 4,
        reps: "10-12",
        tempo: "3:1:2:0",
        rpe: "8-9",
        rest: 75,
        muscle: "Triseps",
        note: "Uzun baş dominant — overhead pozisyon",
        superset: "pc5",
      },
      {
        id: "pc5",
        name: "EZ Bar Curl (Kablolu)",
        sets: 4,
        reps: "10-12",
        tempo: "3:1:2:0",
        rpe: "8",
        rest: 75,
        muscle: "Biseps",
        note: "Sabit dirsek, tam ROM",
        superset: "pc4",
      },
      {
        id: "pc6",
        name: "DB Shrug (omuz sıkıştırma)",
        sets: 3,
        reps: "12-15",
        tempo: "2:2:1:0",
        rpe: "8",
        rest: 60,
        muscle: "Trapez",
        note: "Üst trapez — 2sn hold üstte",
        superset: "pc7",
      },
      {
        id: "pc7",
        name: "Cable Bayrak Curl",
        sets: 3,
        reps: "12-15",
        tempo: "3:1:1:0",
        rpe: "9",
        rest: 60,
        muscle: "Biseps",
        note: "Kısa baş vurgusu",
        superset: "pc6",
      },
      {
        id: "pc8",
        name: "Lateral Raise Myo-Rep",
        sets: 1,
        reps: "15+4+4+3",
        tempo: "2:0:1:0",
        rpe: "9-10",
        rest: 15,
        muscle: "Lat.Delt",
        note: "Omuz finişer",
        technique: "myorep",
      },
      {
        id: "pc9",
        name: "Triseps Myo-Rep (pushdown)",
        sets: 1,
        reps: "15+4+4+3",
        tempo: "2:0:1:0",
        rpe: "9-10",
        rest: 15,
        muscle: "Triseps",
        note: "Kol finişer",
        technique: "myorep",
      },
    ],
  },

  "Per - PUSH B": {
    color: "#EC4899",
    emoji: "🩷",
    subtitle: "Hipertrofi Odaklı Göğüs + Triseps + Lateral",
    morning: "Zone 2 Bisiklet — 30 dk",
    exercises: [
      {
        id: "pd1",
        name: "Smith Flat Bench (Hipertrofi)",
        sets: 4,
        reps: "8-10",
        tempo: "3:1:1:0",
        rpe: "8",
        rest: 120,
        muscle: "Göğüs",
        note: "Hız değil hacim odağı",
        superset: null,
      },
      {
        id: "pd2",
        name: "DB Incline Fly",
        sets: 3,
        reps: "12-15",
        tempo: "3:2:1:0",
        rpe: "8-9",
        rest: 90,
        muscle: "Göğüs",
        note: "Stretch pozisyonda duraklama",
        superset: "pd3",
      },
      {
        id: "pd3",
        name: "Cable Lateral Raise",
        sets: 3,
        reps: "15-20",
        tempo: "2:1:2:0",
        rpe: "8-9",
        rest: 90,
        muscle: "Lat.Delt",
        note: "Kablo avantaj eğrisi — sürekli gerilim",
        superset: "pd2",
      },
      {
        id: "pd4",
        name: "Cable Fly (mid)",
        sets: 3,
        reps: "12-15",
        tempo: "2:2:1:0",
        rpe: "8",
        rest: 75,
        muscle: "Göğüs",
        note: "Orta göğüs — nötr açı",
        superset: "pd5",
      },
      {
        id: "pd5",
        name: "DB Lateral Raise",
        sets: 3,
        reps: "12-15",
        tempo: "2:1:1:0",
        rpe: "8",
        rest: 75,
        muscle: "Lat.Delt",
        note: "Hafif öne eğim",
        superset: "pd4",
      },
      {
        id: "pd6",
        name: "Dips (BW veya ağırlıklı)",
        sets: 3,
        reps: "8-12",
        tempo: "2:1:1:0",
        rpe: "8",
        rest: 60,
        muscle: "Göğüs+Tri",
        note: "Hafta ilerledikçe ağırlık ekle",
        superset: "pd7",
      },
      {
        id: "pd7",
        name: "Cable Face Pull",
        sets: 3,
        reps: "15-20",
        tempo: "2:1:2:0",
        rpe: "7-8",
        rest: 60,
        muscle: "Arka Delt",
        note: "Omuz sağlığı — zorunlu",
        superset: "pd6",
      },
      {
        id: "pd8",
        name: "Skullcrusher (DB)",
        sets: 3,
        reps: "10-12",
        tempo: "3:1:1:0",
        rpe: "8-9",
        rest: 60,
        muscle: "Triseps",
        note: "Uzun baş + lateral baş",
        superset: "pd9",
      },
      {
        id: "pd9",
        name: "Cable Pushdown (ip)",
        sets: 2,
        reps: "12-15",
        tempo: "2:1:2:0",
        rpe: "8",
        rest: 60,
        muscle: "Triseps",
        note: "Medial baş finişer",
        superset: "pd8",
      },
      {
        id: "pd10",
        name: "Lat Raise Myo-Rep",
        sets: 1,
        reps: "15+4+4+3",
        tempo: "2:0:1:0",
        rpe: "9-10",
        rest: 15,
        muscle: "Lat.Delt",
        note: "Seans sonu omuz finişer",
        technique: "myorep",
      },
    ],
  },

  "Cum - PULL B": {
    color: "#14B8A6",
    emoji: "🟢",
    subtitle: "Hipertrofi Odaklı Sırt + Biseps",
    morning: "Zone 2 Kürek Ergometresi — 30 dk",
    exercises: [
      {
        id: "pe1",
        name: "Neutral Grip Pull-Up",
        sets: 4,
        reps: "6-8",
        tempo: "3:1:1:0",
        rpe: "8",
        rest: 120,
        muscle: "Sırt",
        note: "Hacim odağı — tam ROM",
        superset: null,
      },
      {
        id: "pe2",
        name: "DB One-Arm Row",
        sets: 3,
        reps: "10-12",
        tempo: "3:2:1:0",
        rpe: "8",
        rest: 90,
        muscle: "Sırt",
        note: "Her taraf ayrı — tam kasılma",
        superset: "pe3",
      },
      {
        id: "pe3",
        name: "Lat Pulldown (cable geniş)",
        sets: 3,
        reps: "12-15",
        tempo: "3:1:1:0",
        rpe: "8-9",
        rest: 90,
        muscle: "Latissimus",
        note: "Geniş tutuş, dirsekler yanlarda",
        superset: "pe2",
      },
      {
        id: "pe4",
        name: "DB Preacher Curl",
        sets: 3,
        reps: "10-12",
        tempo: "3:1:2:0",
        rpe: "8-9",
        rest: 75,
        muscle: "Biseps",
        note: "Kısa baş dominant — destekli",
        superset: "pe5",
      },
      {
        id: "pe5",
        name: "Cable Hammer Curl",
        sets: 3,
        reps: "12-15",
        tempo: "3:1:1:0",
        rpe: "8",
        rest: 75,
        muscle: "Biseps",
        note: "Brakialis vurgusu",
        superset: "pe4",
      },
      {
        id: "pe6",
        name: "Seated Cable Row",
        sets: 3,
        reps: "10-12",
        tempo: "3:2:1:0",
        rpe: "8",
        rest: 60,
        muscle: "Sırt",
        note: "Orta sırt — kürek kemikleri çekilmeli",
        superset: "pe7",
      },
      {
        id: "pe7",
        name: "Cable Rope Rear Delt Pull",
        sets: 3,
        reps: "15-20",
        tempo: "2:1:2:0",
        rpe: "8",
        rest: 60,
        muscle: "Arka Delt",
        note: "Dirsekler omuz hizasında, geniş çek",
        superset: "pe6",
      },
      {
        id: "pe8",
        name: "Biseps Myo-Rep (kablo)",
        sets: 1,
        reps: "15+4+4+3",
        tempo: "2:0:1:0",
        rpe: "9-10",
        rest: 15,
        muscle: "Biseps",
        note: "Kablo curl — finişer",
        technique: "myorep",
      },
    ],
  },

  "Cmt - BACAK": {
    color: "#10B981",
    emoji: "🟩",
    subtitle: "Kuadriseps + Hamstring + Kalça",
    morning: "Aktif Dinlenme veya Mobilite",
    exercises: [
      {
        id: "pf1",
        name: "Smith Squat",
        sets: 4,
        reps: "5-6",
        tempo: "3:1:X:0",
        rpe: "8-9",
        rest: 180,
        muscle: "Kuadriseps",
        note: "ME — Hf1-3: Geniş duruş, Hf5-7: Dar duruş, Hf9-11: Box squat",
        superset: null,
      },
      {
        id: "pf2",
        name: "DB Romanian Deadlift",
        sets: 3,
        reps: "8-10",
        tempo: "3:2:1:0",
        rpe: "8",
        rest: 120,
        muscle: "Hamstring",
        note: "Uzun eksen gerdirme — ROM önemli",
        superset: null,
      },
      {
        id: "pf3",
        name: "Leg Press",
        sets: 3,
        reps: "12-15",
        tempo: "3:1:1:0",
        rpe: "8",
        rest: 90,
        muscle: "Kuadriseps",
        note: "Ayaklar geniş ve ortalı",
        superset: "pf4",
      },
      {
        id: "pf4",
        name: "Nordic Curl veya Leg Curl",
        sets: 3,
        reps: "8-12",
        tempo: "3:1:1:0",
        rpe: "8-9",
        rest: 90,
        muscle: "Hamstring",
        note: "Nordic yapabiliyorsan tercih et",
        superset: "pf3",
      },
      {
        id: "pf5",
        name: "Walking Lunge (DB)",
        sets: 3,
        reps: "12 adım/bacak",
        tempo: "2:1:1:0",
        rpe: "8",
        rest: 75,
        muscle: "Kuad+Kalça",
        note: "Denge ve tek taraflı güç",
        superset: null,
      },
      {
        id: "pf6",
        name: "Hip Thrust (Smith)",
        sets: 3,
        reps: "12-15",
        tempo: "2:1:2:0",
        rpe: "8",
        rest: 75,
        muscle: "Kalça",
        note: "Üstte sıkıştır — 1sn hold",
        superset: "pf7",
      },
      {
        id: "pf7",
        name: "Cable Abduction",
        sets: 3,
        reps: "15-20",
        tempo: "2:1:2:0",
        rpe: "8",
        rest: 75,
        muscle: "Kalça",
        note: "Kalça zorlanması — dik dur",
        superset: "pf6",
      },
      {
        id: "pf8",
        name: "Calf Raise (Smith)",
        sets: 4,
        reps: "15-20",
        tempo: "2:2:1:0",
        rpe: "8",
        rest: 60,
        muscle: "Baldır",
        note: "Tam ROM — altta stretch, üstte kasılma",
        superset: null,
      },
      {
        id: "pf9",
        name: "Hanging Leg Raise",
        sets: 3,
        reps: "10-15",
        tempo: "2:1:1:0",
        rpe: "8",
        rest: 60,
        muscle: "Karın",
        note: "Sallanmadan, kontrollü",
        superset: "pf10",
      },
      {
        id: "pf10",
        name: "Cable Crunch",
        sets: 3,
        reps: "15-20",
        tempo: "2:1:2:0",
        rpe: "8",
        rest: 60,
        muscle: "Karın",
        note: "Kablo — progresif yük mümkün",
        superset: "pf9",
      },
    ],
  },
};

export const PHASES = {
  1: { name: "Birikim", weeks: [1, 2, 3, 4], deload: 4, rpeMax: 8 },
  2: { name: "Yoğunlaştırma", weeks: [5, 6, 7, 8], deload: 8, rpeMax: 10 },
  3: { name: "Gerçekleştirme", weeks: [9, 10, 11, 12], deload: 11, rpeMax: 9 },
};

export const VOLUME_TARGETS = {
  "Lat.Delt": { min: 20, max: 37, label: "Lateral Delt" },
  Göğüs: { min: 14, max: 24, label: "Göğüs" },
  Sırt: { min: 14, max: 24, label: "Sırt" },
  Biseps: { min: 11, max: 27, label: "Biseps" },
  Triseps: { min: 10, max: 22, label: "Triseps" },
  "Arka Delt": { min: 9, max: 23, label: "Arka Delt" },
  Kuadriseps: { min: 12, max: 20, label: "Kuadriseps" },
  Hamstring: { min: 10, max: 20, label: "Hamstring" },
};

// Bugünün gün indeksini döndür (DAYS array index)
export function getTodayDayIndex() {
  const day = new Date().getDay(); // 0=Sun, 1=Mon...6=Sat
  return DAY_INDEX_MAP[day] ?? 0; // default Pazartesi
}

// Haftadan faz hesapla
export function getPhaseFromWeek(week) {
  for (const [phase, data] of Object.entries(PHASES)) {
    if (data.weeks.includes(week)) return parseInt(phase);
  }
  return 1;
}

// ─────────────────────────────────────────────
// DÖVÜŞ SPORLARI KUVVET PROGRAMI
// Patlayıcı kuvvet, kavrama gücü, fonksiyonel dayanıklılık
// ─────────────────────────────────────────────
export const COMBAT_STRENGTH_DAYS = [
  "Pzt - PATLAYICI ÜST",
  "Sal - ÇEKİŞ + KAVRAMA",
  "Çar - KOR + FONKSİYONEL",
  "Per - BACAK GÜCÜ",
  "Cum - DAYANIKLILIK DEVRESİ",
  "Cmt - BOYUN + KOR",
];

export const COMBAT_STRENGTH_PROGRAM = {
  "Pzt - PATLAYICI ÜST": {
    color: "#FF6B35",
    emoji: "⚡",
    subtitle: "Patlayıcı Üst Vücut + Omuz Stabilitesi",
    morning: "5 dk mobilite ısınma — eklem hareketleri",
    exercises: [
      { id: "ka1", name: "Smith Press (Patlayıcı)", sets: 5, reps: "3", tempo: "2:0:X:0", rpe: "7-8", rest: 180, muscle: "Göğüs", note: "Hafif ağırlık — maksimum hız, konsantrik çok hızlı", superset: null },
      { id: "ka2", name: "Patlayıcı Pull-Up", sets: 5, reps: "3", tempo: "2:0:X:0", rpe: "7-8", rest: 180, muscle: "Sırt", note: "Çıkışta patlayıcı — en üste çabuk çek", superset: null },
      { id: "ka3", name: "DB Push Press (Ayakta)", sets: 4, reps: "5", tempo: "1:0:X:0", rpe: "8", rest: 120, muscle: "Omuz", note: "Bacaktan yardım al — spor spesifik güç aktarımı", superset: null },
      { id: "ka4", name: "Cable Row (Patlayıcı)", sets: 4, reps: "6", tempo: "1:0:X:0", rpe: "7", rest: 90, muscle: "Sırt", note: "Çekişte patlayıcı — yavaş bırak", superset: "ka5" },
      { id: "ka5", name: "Band Pull-Apart", sets: 4, reps: "25", tempo: "1:0:1:0", rpe: "6", rest: 90, muscle: "Arka Delt", note: "Omuz stabilitesi — her push seansında zorunlu", superset: "ka4" },
      { id: "ka6", name: "Cable Face Pull", sets: 3, reps: "15-20", tempo: "2:1:1:0", rpe: "7", rest: 60, muscle: "Arka Delt", note: "Rotator cuff koruması", superset: null },
    ],
  },

  "Sal - ÇEKİŞ + KAVRAMA": {
    color: "#7B2FBE",
    emoji: "✊",
    subtitle: "Grip Kuvveti + Ağır Çekiş + Sırt Dominantı",
    morning: "Zone 2 Kürek — 20 dk",
    exercises: [
      { id: "kb1", name: "Weighted Pull-Up", sets: 5, reps: "3-5", tempo: "2:1:X:0", rpe: "8-9", rest: 180, muscle: "Sırt", note: "Dövüş için kritik — ağırlık ekle, az tekrar", superset: null },
      { id: "kb2", name: "Towel Pull-Up (Havlulu)", sets: 3, reps: "max", tempo: "2:1:X:0", rpe: "8", rest: 120, muscle: "Kavrama+Sırt", note: "Havluyu pull-up bara sar — kavrama dayanıklılığı", superset: null },
      { id: "kb3", name: "DB Farmer's Hold", sets: 4, reps: "30 sn", tempo: "-", rpe: "8", rest: 60, muscle: "Kavrama", note: "20 kg DB her elde — tutma dayanıklılığı", superset: null },
      { id: "kb4", name: "DB One-Arm Row", sets: 4, reps: "8", tempo: "3:2:1:0", rpe: "8", rest: 90, muscle: "Sırt", note: "Ağır, tam ROM — 2sn kasılma zirvede", superset: null },
      { id: "kb5", name: "Cable Curl (Kavrama Odaklı)", sets: 3, reps: "12", tempo: "3:1:2:0", rpe: "8", rest: 75, muscle: "Biseps", note: "Sıkı kavrama — underhand güç geliştirme", superset: "kb6" },
      { id: "kb6", name: "DB Wrist Curl + Extension", sets: 3, reps: "20", tempo: "2:1:2:0", rpe: "7", rest: 75, muscle: "Kavrama", note: "Bilek fleksörü + ekstansörü — çift yönlü kavrama", superset: "kb5" },
    ],
  },

  "Çar - KOR + FONKSİYONEL": {
    color: "#FF4500",
    emoji: "🔄",
    subtitle: "Rotasyonel Güç + Kor Stabilitesi",
    morning: "Zone 2 Koşu Bandı — 20 dk",
    exercises: [
      { id: "kc1", name: "Cable Woodchop (Çapraz)", sets: 4, reps: "12/taraf", tempo: "2:0:1:0", rpe: "8", rest: 75, muscle: "Kor", note: "Dövüş rotasyonu — kalçadan döndür, kor aktif", superset: null },
      { id: "kc2", name: "Hanging Leg Raise", sets: 4, reps: "12-15", tempo: "2:1:1:0", rpe: "8", rest: 60, muscle: "Karın", note: "Pull-up bara as — yavaş ve kontrollü", superset: null },
      { id: "kc3", name: "Cable Anti-Rotation Press", sets: 3, reps: "12/taraf", tempo: "2:2:1:0", rpe: "7-8", rest: 60, muscle: "Kor", note: "Dönme direnci — dövüşçü için kritik stabilite", superset: null },
      { id: "kc4", name: "DB Turkish Get-Up", sets: 3, reps: "5/taraf", tempo: "yavaş", rpe: "7", rest: 90, muscle: "Fonksiyonel", note: "Tam vücut — yerden kalkma hareketi, dövüşe özgü", superset: null },
      { id: "kc5", name: "Plank (Ağırlıklı)", sets: 3, reps: "45-60 sn", tempo: "-", rpe: "8", rest: 60, muscle: "Kor", note: "Sırtına plak koy ya da ağırlıklı yelek", superset: "kc6" },
      { id: "kc6", name: "Band Hip Circle", sets: 3, reps: "20/taraf", tempo: "1:0:1:0", rpe: "6", rest: 60, muscle: "Kalça", note: "Direnç bandı dizde — kalça stabilitesi", superset: "kc5" },
    ],
  },

  "Per - BACAK GÜCÜ": {
    color: "#1DB954",
    emoji: "🦵",
    subtitle: "Patlayıcı Alt Vücut + Hamstring Kuvveti",
    morning: "Zone 2 Bisiklet — 20 dk",
    exercises: [
      { id: "kd1", name: "Smith Squat (Patlayıcı)", sets: 5, reps: "3", tempo: "3:1:X:0", rpe: "8", rest: 180, muscle: "Kuadriseps", note: "%60-70 1RM — inişte yavaş, çıkışta patlayıcı", superset: null },
      { id: "kd2", name: "DB Romanian Deadlift", sets: 4, reps: "8", tempo: "3:2:1:0", rpe: "8", rest: 120, muscle: "Hamstring", note: "Hamstring gerdirme — dövüşçü için esneklik+kuvvet", superset: null },
      { id: "kd3", name: "Walking Lunge (DB)", sets: 3, reps: "10/bacak", tempo: "2:1:1:0", rpe: "8", rest: 90, muscle: "Kuad+Kalça", note: "Denge ve tek taraflı güç", superset: null },
      { id: "kd4", name: "Hip Thrust Smith (Patlayıcı)", sets: 4, reps: "8", tempo: "1:1:X:0", rpe: "8", rest: 90, muscle: "Kalça", note: "Kalça ekstansiyonu gücü — taklama ve kaldırma", superset: null },
      { id: "kd5", name: "Nordic Curl", sets: 3, reps: "5-8", tempo: "3:1:0:0", rpe: "8-9", rest: 90, muscle: "Hamstring", note: "Pull-up bardan nordik — yaralanma önleme", superset: null },
      { id: "kd6", name: "Single-Leg Calf Raise (Smith)", sets: 4, reps: "15/bacak", tempo: "2:2:1:0", rpe: "8", rest: 60, muscle: "Baldır", note: "Tek bacak — patlama ve denge", superset: null },
    ],
  },

  "Cum - DAYANIKLILIK DEVRESİ": {
    color: "#FF8C00",
    emoji: "🔥",
    subtitle: "Yüksek Yoğunluk Devre + Kardiyovasküler",
    morning: null,
    exercises: [
      { id: "ke1", name: "Kürek Ergometresi Sprint", sets: 4, reps: "250m", tempo: "-", rpe: "9", rest: 120, muscle: "Kardiyovasküler", note: "Her seferde max efor — süreyi not et", superset: null },
      { id: "ke2", name: "Pull-Up (Max Tekrar)", sets: 4, reps: "max", tempo: "2:0:1:0", rpe: "9", rest: 90, muscle: "Sırt", note: "Yorgunlukta çekiş dayanıklılığı", superset: null },
      { id: "ke3", name: "DB Thruster (Squat+Press)", sets: 4, reps: "10", tempo: "2:0:1:0", rpe: "8-9", rest: 75, muscle: "Full Body", note: "Tam vücut — dövüşçü kondisyonu", superset: "ke4" },
      { id: "ke4", name: "Cable Row (Hızlı)", sets: 4, reps: "15", tempo: "1:0:1:0", rpe: "8", rest: 75, muscle: "Sırt", note: "Yorgunluğa rağmen form koru", superset: "ke3" },
      { id: "ke5", name: "Bisiklet Sprint", sets: 4, reps: "30 sn", tempo: "-", rpe: "9-10", rest: 90, muscle: "Kardiyovasküler", note: "Max güç — anaerob kapasite", superset: null },
    ],
  },

  "Cmt - BOYUN + KOR": {
    color: "#4169E1",
    emoji: "🧠",
    subtitle: "Boyun Kuvveti + Kor + Aktif Dinlenme",
    morning: "Mobilite devresi — 15 dk",
    exercises: [
      { id: "kf1", name: "Band Boyun Fleksiyonu", sets: 3, reps: "20", tempo: "2:1:2:0", rpe: "7", rest: 45, muscle: "Boyun", note: "Direnç bandı alnınıza — öne eğilme", superset: "kf2" },
      { id: "kf2", name: "Band Boyun Ekstansiyonu", sets: 3, reps: "20", tempo: "2:1:2:0", rpe: "7", rest: 45, muscle: "Boyun", note: "Bant başın arkasında — geriye itiş", superset: "kf1" },
      { id: "kf3", name: "Cable Woodchop", sets: 3, reps: "15/taraf", tempo: "2:0:1:0", rpe: "7", rest: 60, muscle: "Kor", note: "Hafif ağırlık — yüksek tekrar, kondisyon odağı", superset: null },
      { id: "kf4", name: "Hanging Knee Raise", sets: 3, reps: "15", tempo: "2:1:1:0", rpe: "7", rest: 60, muscle: "Karın", note: "Diz bükük versiyon — daha kolay ama etkili", superset: null },
      { id: "kf5", name: "DB Farmer's Carry", sets: 3, reps: "30 sn", tempo: "-", rpe: "7", rest: 60, muscle: "Kavrama", note: "Düz yürüyüş — kavrama aktif tut", superset: null },
    ],
  },
};

// ─────────────────────────────────────────────
// DÖVÜŞ SPORLARI KONDİSYON PROGRAMI
// Aerobik kapasite, devre antrenmanı, HIIT
// ─────────────────────────────────────────────
export const COMBAT_CONDITIONING_DAYS = [
  "Pzt - HIIT ÜST",
  "Sal - KUVVETLİ DAYANIKLILIK",
  "Çar - AEROBİK KAPASİTE",
  "Per - HIIT ALT",
  "Cum - DEVRE ANTRENMANI",
  "Cmt - AKTİF DİNLENME",
];

export const COMBAT_CONDITIONING_PROGRAM = {
  "Pzt - HIIT ÜST": {
    color: "#E94560",
    emoji: "💥",
    subtitle: "Yüksek Yoğunluk Üst Vücut + Kürek",
    morning: null,
    exercises: [
      { id: "da1", name: "Kürek Ergometresi Interval", sets: 5, reps: "1 dk", tempo: "-", rpe: "9", rest: 60, muscle: "Kardiyovasküler", note: "1 dk max — 1 dk dinlenme, 5 tur", superset: null },
      { id: "da2", name: "Pull-Up (Max Tekrar)", sets: 3, reps: "max", tempo: "2:0:1:0", rpe: "8", rest: 60, muscle: "Sırt", note: "Yorgunluğa rağmen devam", superset: "da3" },
      { id: "da3", name: "Push-Up (Max Tekrar)", sets: 3, reps: "max", tempo: "1:0:1:0", rpe: "8", rest: 60, muscle: "Göğüs", note: "Süperset ile pull-up — üst vücut devresi", superset: "da2" },
      { id: "da4", name: "Cable Row (Hızlı)", sets: 3, reps: "15", tempo: "1:0:1:0", rpe: "8", rest: 45, muscle: "Sırt", note: "Form yeterli — hız odağı", superset: "da5" },
      { id: "da5", name: "DB Thruster", sets: 3, reps: "12", tempo: "2:0:1:0", rpe: "8-9", rest: 45, muscle: "Full Body", note: "Squat + overhead press — kondisyon hareketi", superset: "da4" },
    ],
  },

  "Sal - KUVVETLİ DAYANIKLILIK": {
    color: "#3B82F6",
    emoji: "💪",
    subtitle: "Orta Ağırlık + Yüksek Hacim",
    morning: "Zone 2 Kürek — 15 dk",
    exercises: [
      { id: "db1", name: "Smith Press (Orta)", sets: 4, reps: "10", tempo: "2:1:1:0", rpe: "7-8", rest: 75, muscle: "Göğüs", note: "Orta ağırlık — dayanıklılık seti", superset: null },
      { id: "db2", name: "Pull-Up", sets: 4, reps: "8", tempo: "2:1:1:0", rpe: "8", rest: 75, muscle: "Sırt", note: "Tam ROM — her tekrar kontrollü", superset: null },
      { id: "db3", name: "DB Row", sets: 4, reps: "10/taraf", tempo: "2:1:1:0", rpe: "8", rest: 60, muscle: "Sırt", note: "Dövüşçü sırtı — her taraf eşit", superset: "db4" },
      { id: "db4", name: "Cable Lateral Raise", sets: 4, reps: "20", tempo: "2:0:1:0", rpe: "8", rest: 60, muscle: "Lat.Delt", note: "Yüksek tekrar — omuz dayanıklılığı", superset: "db3" },
      { id: "db5", name: "Tricep Pushdown", sets: 3, reps: "15", tempo: "2:1:1:0", rpe: "7-8", rest: 45, muscle: "Triseps", note: "İtme dayanıklılığı", superset: "db6" },
      { id: "db6", name: "Cable Curl", sets: 3, reps: "15", tempo: "2:1:2:0", rpe: "7-8", rest: 45, muscle: "Biseps", note: "Çekme dayanıklılığı", superset: "db5" },
    ],
  },

  "Çar - AEROBİK KAPASİTE": {
    color: "#14B8A6",
    emoji: "🫀",
    subtitle: "Zone 2 Kardiyovasküler Kapasite Günü",
    morning: null,
    exercises: [
      { id: "dc1", name: "Kürek Ergometresi (Zone 2)", sets: 1, reps: "25 dk", tempo: "-", rpe: "6-7", rest: 0, muscle: "Kardiyovasküler", note: "Nefes kontrolü — konuşabildiğin yoğunluk", superset: null },
      { id: "dc2", name: "Koşu Bandı Interval", sets: 5, reps: "2 dk / 1 dk", tempo: "-", rpe: "8/5", rest: 0, muscle: "Kardiyovasküler", note: "2 dk hızlı + 1 dk yavaş — 5 tur", superset: null },
      { id: "dc3", name: "Bisiklet (Soğuma)", sets: 1, reps: "10 dk", tempo: "-", rpe: "4-5", rest: 0, muscle: "Kardiyovasküler", note: "Düşük yoğunluk — aktif toparlanma", superset: null },
    ],
  },

  "Per - HIIT ALT": {
    color: "#10B981",
    emoji: "⚡",
    subtitle: "Bisiklet Sprint + Alt Vücut Kuvveti",
    morning: "5 dk mobilite ısınma",
    exercises: [
      { id: "dd1", name: "Bisiklet Sprint", sets: 6, reps: "30 sn", tempo: "-", rpe: "9-10", rest: 90, muscle: "Kardiyovasküler", note: "Her seferinde max güç — anaerob kapasite", superset: null },
      { id: "dd2", name: "Smith Squat (Orta)", sets: 4, reps: "10", tempo: "2:1:1:0", rpe: "8", rest: 90, muscle: "Kuadriseps", note: "Yorgunlukta squat — dövüş dayanıklılığı", superset: null },
      { id: "dd3", name: "DB Lunge (Yürüyüş)", sets: 3, reps: "12/bacak", tempo: "2:1:1:0", rpe: "8", rest: 75, muscle: "Kuad+Kalça", note: "Denge ve koordinasyon", superset: null },
      { id: "dd4", name: "Hip Thrust Smith", sets: 3, reps: "15", tempo: "2:1:1:0", rpe: "8", rest: 60, muscle: "Kalça", note: "Kalça gücü — fırlatma ve kaldırma için", superset: null },
      { id: "dd5", name: "Calf Raise (Smith)", sets: 3, reps: "20", tempo: "2:2:1:0", rpe: "7", rest: 45, muscle: "Baldır", note: "Ayak dayanıklılığı", superset: null },
    ],
  },

  "Cum - DEVRE ANTRENMANI": {
    color: "#F5A623",
    emoji: "🔁",
    subtitle: "Full Body Devre — 4 Tur",
    morning: null,
    exercises: [
      { id: "de1", name: "Pull-Up (Devre)", sets: 4, reps: "max (min 5)", tempo: "2:0:1:0", rpe: "8-9", rest: 15, muscle: "Sırt", note: "Devre A — 15sn geçiş, tur sonunda 60sn dinlenme", superset: "de2" },
      { id: "de2", name: "Push-Up (Devre)", sets: 4, reps: "max (min 10)", tempo: "1:0:1:0", rpe: "8-9", rest: 15, muscle: "Göğüs", note: "Hemen pull-up sonrası", superset: "de3" },
      { id: "de3", name: "DB Goblet Squat (Devre)", sets: 4, reps: "15", tempo: "2:1:1:0", rpe: "8", rest: 15, muscle: "Kuadriseps", note: "DB göğüse yakın tut", superset: "de4" },
      { id: "de4", name: "Cable Row (Devre)", sets: 4, reps: "15", tempo: "1:0:1:0", rpe: "8", rest: 15, muscle: "Sırt", note: "Hızlı geçiş", superset: "de5" },
      { id: "de5", name: "Plank (Devre)", sets: 4, reps: "30 sn", tempo: "-", rpe: "8", rest: 60, muscle: "Kor", note: "Tur sonu — 60sn dinlenme sonrası tekrar başla", superset: null },
    ],
  },

  "Cmt - AKTİF DİNLENME": {
    color: "#8B5CF6",
    emoji: "🧘",
    subtitle: "Aktif Toparlanma + Mobilite",
    morning: null,
    exercises: [
      { id: "df1", name: "Koşu Bandı (Yürüyüş)", sets: 1, reps: "20 dk", tempo: "-", rpe: "4-5", rest: 0, muscle: "Kardiyovasküler", note: "Düşük yoğunluk — %50 max kalp atışı", superset: null },
      { id: "df2", name: "Band Shoulder Circle", sets: 2, reps: "20/yön", tempo: "1:1:1:0", rpe: "5", rest: 45, muscle: "Omuz", note: "Omuz mobilite — her iki yön", superset: null },
      { id: "df3", name: "Band Pull-Apart", sets: 2, reps: "25", tempo: "1:0:1:0", rpe: "5", rest: 45, muscle: "Arka Delt", note: "Omuz sağlığı bakımı", superset: null },
      { id: "df4", name: "Hanging Stretch", sets: 3, reps: "30 sn", tempo: "-", rpe: "3", rest: 30, muscle: "Sırt", note: "Pull-up bara asıl — omurga dekompresyonu", superset: null },
      { id: "df5", name: "DB Goblet Squat (Derin)", sets: 2, reps: "10", tempo: "3:3:1:0", rpe: "4", rest: 45, muscle: "Kuadriseps", note: "Kalça mobilite — çok yavaş, derine in", superset: null },
    ],
  },
};

// ─────────────────────────────────────────────
// GENEL KUVVET — Upper/Lower Split, 4 gün
// %80-90 1RM, 3-5 tekrar, 3-5 dk dinlenme (NSCA)
// ─────────────────────────────────────────────
export const GENERAL_STRENGTH_DAYS = [
  "Pzt - ÜST KUVVET A",
  "Sal - ALT KUVVET A",
  "Per - ÜST HACİM B",
  "Cum - ALT HACİM B",
];

export const GENERAL_STRENGTH_PROGRAM = {
  "Pzt - ÜST KUVVET A": {
    color: "#3B82F6", emoji: "🔵",
    subtitle: "Ağır Üst Vücut — İtiş + Çekiş Kuvveti",
    morning: "5 dk eklem ısınması — omuz, dirsek, bilek çevrimleri",
    exercises: [
      { id: "gs_a1", name: "Smith Bench Press (Duraklamalı)", sets: 5, reps: "3-4", tempo: "2:2:X:1", rpe: "8-9", rest: 240, muscle: "Göğüs", note: "%85 1RM — göğüste 2sn durakla, patlayıcı çık. Hf1-4 lineer yük artır.", superset: null },
      { id: "gs_a2", name: "Weighted Pull-Up", sets: 5, reps: "3-4", tempo: "2:1:X:0", rpe: "8-9", rest: 240, muscle: "Sırt", note: "Bele plak/bant ekle. Push ile simetrik ağırlık günü.", superset: null },
      { id: "gs_a3", name: "Smith Overhead Press (Ayakta)", sets: 4, reps: "4-5", tempo: "2:1:X:0", rpe: "8", rest: 180, muscle: "Omuz", note: "Ayakta — kor aktif, lumbar aşırı açılmasın.", superset: null },
      { id: "gs_a4", name: "Cable Row (Ağır, Tek Kol)", sets: 4, reps: "5-6", tempo: "2:2:1:0", rpe: "8", rest: 180, muscle: "Sırt", note: "Her kol ayrı — asimetrik kuvvet farkını kapatır.", superset: null },
      { id: "gs_a5", name: "Dips (Ağırlıklı)", sets: 3, reps: "5-6", tempo: "3:1:X:0", rpe: "8", rest: 120, muscle: "Göğüs+Tri", note: "BW + ekstra ağırlık. Triseps yardımcı kuvvet.", superset: "gs_a6" },
      { id: "gs_a6", name: "Cable Face Pull + Dış Rot.", sets: 3, reps: "15", tempo: "2:2:1:0", rpe: "6", rest: 120, muscle: "Arka Delt", note: "Süperset — rotator cuff koruma, zorunlu.", superset: "gs_a5" },
    ],
  },
  "Sal - ALT KUVVET A": {
    color: "#10B981", emoji: "🟢",
    subtitle: "Ağır Alt Vücut — Squat + Hamstring Kuvveti",
    morning: "5 dk mobilite — kalça, ayak bileği, torasik",
    exercises: [
      { id: "gs_b1", name: "Smith Squat (Duraklamalı)", sets: 5, reps: "3-4", tempo: "3:2:X:0", rpe: "8-9", rest: 240, muscle: "Kuadriseps", note: "%85 1RM — dipte 2sn durakla. Hafta hafta +2.5kg.", superset: null },
      { id: "gs_b2", name: "DB Romanian Deadlift", sets: 4, reps: "5-6", tempo: "3:2:1:0", rpe: "8-9", rest: 180, muscle: "Hamstring", note: "20kg DB — kalça itişiyle indir, hamstring tam gersin.", superset: null },
      { id: "gs_b3", name: "Hip Thrust Smith (Ağır)", sets: 4, reps: "5-6", tempo: "1:2:X:0", rpe: "8", rest: 180, muscle: "Kalça", note: "Üstte 2sn sıkı kal. Kalça ekstansiyonu kuvveti.", superset: null },
      { id: "gs_b4", name: "Nordic Curl (Negatif)", sets: 3, reps: "4-6", tempo: "4:0:0:0", rpe: "8-9", rest: 120, muscle: "Hamstring", note: "Pull-up bardan — 4sn yavaş düşüş. Yaralanma önleme.", superset: null },
      { id: "gs_b5", name: "Smith Single-Leg Calf Raise", sets: 4, reps: "8/bacak", tempo: "2:3:1:0", rpe: "8", rest: 90, muscle: "Baldır", note: "Üstte 3sn tut. Asimetri tespiti ve patlama gücü.", superset: null },
      { id: "gs_b6", name: "Hanging Leg Raise", sets: 3, reps: "8-10", tempo: "2:1:2:0", rpe: "8", rest: 90, muscle: "Karın", note: "Kor güç tamamlayıcı.", superset: null },
    ],
  },
  "Per - ÜST HACİM B": {
    color: "#8B5CF6", emoji: "🟣",
    subtitle: "Hacim Üst Vücut — 6-10 Tekrar, Hipertrofi Odağı",
    morning: "Zone 2 Kürek — 15 dk hafif",
    exercises: [
      { id: "gs_c1", name: "Smith Incline Press (30°)", sets: 4, reps: "6-8", tempo: "3:1:1:0", rpe: "8", rest: 120, muscle: "Göğüs", note: "Pazartesiden farklı açı — üst göğüs vurgusu.", superset: null },
      { id: "gs_c2", name: "Pull-Up (Geniş Tutuş)", sets: 4, reps: "6-8", tempo: "2:1:1:0", rpe: "8", rest: 120, muscle: "Sırt", note: "BW — lateral genişlik için.", superset: null },
      { id: "gs_c3", name: "DB One-Arm Row", sets: 3, reps: "8-10/taraf", tempo: "2:2:1:0", rpe: "8", rest: 90, muscle: "Sırt", note: "20kg DB — kürek kemiği tam çek, 2sn tut.", superset: "gs_c4" },
      { id: "gs_c4", name: "Cable Fly (Orta)", sets: 3, reps: "10-12", tempo: "2:2:1:0", rpe: "8", rest: 90, muscle: "Göğüs", note: "Süperset — göğüs iç hat geliştirme.", superset: "gs_c3" },
      { id: "gs_c5", name: "DB Lateral Raise (3sn İniş)", sets: 4, reps: "10-12", tempo: "1:0:3:0", rpe: "8-9", rest: 75, muscle: "Lat.Delt", note: "Yavaş eksantrik — omuz genişliği için en etkili.", superset: "gs_c6" },
      { id: "gs_c6", name: "Cable Curl (Yavaş Eks.)", sets: 4, reps: "10-12", tempo: "2:1:3:0", rpe: "8", rest: 75, muscle: "Biseps", note: "Süperset — ön kol kuvveti tamamlayıcı.", superset: "gs_c5" },
      { id: "gs_c7", name: "Overhead Cable Tricep Ext.", sets: 3, reps: "12-15", tempo: "2:1:2:0", rpe: "7-8", rest: 60, muscle: "Triseps", note: "Uzun baş tam uzunlukta. İtme kuvveti destek.", superset: null },
    ],
  },
  "Cum - ALT HACİM B": {
    color: "#F5A623", emoji: "🟡",
    subtitle: "Hacim Alt Vücut — 8-12 Tekrar, Kas Geliştirme",
    morning: "Zone 2 Bisiklet — 15 dk hafif",
    exercises: [
      { id: "gs_d1", name: "Smith Squat (Ön / Goblet)", sets: 4, reps: "8-10", tempo: "3:1:1:0", rpe: "7-8", rest: 120, muscle: "Kuadriseps", note: "Ön squat — kor ve kuadriseps vurgusu. Salı'dan farklı stimulus.", superset: null },
      { id: "gs_d2", name: "DB Bulgarian Split Squat", sets: 3, reps: "10/bacak", tempo: "3:1:1:0", rpe: "8", rest: 90, muscle: "Kuad+Kalça", note: "Arka ayak yüksekte — tek taraflı kuvvet ve denge.", superset: null },
      { id: "gs_d3", name: "Hip Thrust Smith (Orta)", sets: 4, reps: "12-15", tempo: "2:2:1:0", rpe: "8", rest: 90, muscle: "Kalça", note: "Salı'dan hafif, yüksek tekrar — kalça hipertrofi.", superset: null },
      { id: "gs_d4", name: "Walking Lunge (DB)", sets: 3, reps: "12/bacak", tempo: "2:1:1:0", rpe: "8", rest: 75, muscle: "Kuad+Kalça", note: "20kg DB — denge ve koordinasyon, fonksiyonel güç.", superset: null },
      { id: "gs_d5", name: "Cable Woodchop", sets: 3, reps: "12/taraf", tempo: "2:0:1:0", rpe: "7", rest: 75, muscle: "Kor", note: "Rotasyonel kor kuvveti — tüm sporlar için temel.", superset: "gs_d6" },
      { id: "gs_d6", name: "Plank (Ağırlıklı)", sets: 3, reps: "45 sn", tempo: "-", rpe: "7-8", rest: 75, muscle: "Kor", note: "Süperset — sırtına plak koy. Kor dayanıklılık.", superset: "gs_d5" },
    ],
  },
};

// ─────────────────────────────────────────────
// KUVVET DAYANIKLILIĞI — Push/Pull/Full, 5 gün
// %50-75 1RM, 8-20 tekrar, 30-90 sn dinlenme
// ─────────────────────────────────────────────
export const STRENGTH_ENDURANCE_DAYS = [
  "Pzt - PUSH DAYANIKLILIK",
  "Sal - PULL DAYANIKLILIK",
  "Çar - ALT + KOR",
  "Per - FULL DEVRE",
  "Cum - KARDİYO + ÜST",
];

export const STRENGTH_ENDURANCE_PROGRAM = {
  "Pzt - PUSH DAYANIKLILIK": {
    color: "#E94560", emoji: "🔴",
    subtitle: "İtiş Kasları — Yüksek Hacim, Kısa Dinlenme",
    morning: null,
    exercises: [
      { id: "se_a1", name: "Smith Bench Press (Orta)", sets: 4, reps: "10-12", tempo: "2:1:1:0", rpe: "7-8", rest: 75, muscle: "Göğüs", note: "%65-70 1RM — yorgunluğa rağmen form koru. Kuvvet dayanıklılığı temeli.", superset: "se_a2" },
      { id: "se_a2", name: "DB Lateral Raise", sets: 4, reps: "15-20", tempo: "2:0:2:0", rpe: "8", rest: 75, muscle: "Lat.Delt", note: "Süperset — dinlenme süresini kısalt, omuz dayanıklılığı.", superset: "se_a1" },
      { id: "se_a3", name: "Smith Incline Press", sets: 3, reps: "12-15", tempo: "2:1:1:0", rpe: "8", rest: 60, muscle: "Göğüs", note: "Üst göğüs hacim — kısa dinlenme adaptasyonu.", superset: "se_a4" },
      { id: "se_a4", name: "Cable Face Pull", sets: 3, reps: "20", tempo: "2:1:1:0", rpe: "7", rest: 60, muscle: "Arka Delt", note: "Süperset — postür ve omuz sağlığı, yorgunlukta da zorunlu.", superset: "se_a3" },
      { id: "se_a5", name: "Dips (BW)", sets: 3, reps: "12-15", tempo: "2:1:1:0", rpe: "8", rest: 60, muscle: "Göğüs+Tri", note: "Vücut ağırlığı — yüksek tekrar dayanıklılığı.", superset: "se_a6" },
      { id: "se_a6", name: "Overhead Cable Tricep Ext.", sets: 3, reps: "15-20", tempo: "2:1:2:0", rpe: "7-8", rest: 60, muscle: "Triseps", note: "Süperset — triseps dayanıklılık tamamlayıcı.", superset: "se_a5" },
    ],
  },
  "Sal - PULL DAYANIKLILIK": {
    color: "#3B82F6", emoji: "🔵",
    subtitle: "Çekiş Kasları — Sırt + Biseps Dayanıklılığı",
    morning: "Zone 2 Kürek — 15 dk",
    exercises: [
      { id: "se_b1", name: "Pull-Up (BW)", sets: 4, reps: "8-12", tempo: "2:1:1:0", rpe: "8", rest: 75, muscle: "Sırt", note: "Yorgunlukta bile form koru. Çekiş dayanıklılığı dövüş sporları için kritik.", superset: "se_b2" },
      { id: "se_b2", name: "Cable Row (Hızlı)", sets: 4, reps: "15", tempo: "1:1:1:0", rpe: "8", rest: 75, muscle: "Sırt", note: "Süperset — sırt pompalanır, aerobik-anaerobik geçiş.", superset: "se_b1" },
      { id: "se_b3", name: "DB One-Arm Row", sets: 3, reps: "12-15/taraf", tempo: "2:1:1:0", rpe: "8", rest: 60, muscle: "Sırt", note: "Orta ağırlık yüksek tekrar — kas dayanıklılığı.", superset: "se_b4" },
      { id: "se_b4", name: "Band Pull-Apart", sets: 3, reps: "25-30", tempo: "1:0:1:0", rpe: "6", rest: 60, muscle: "Arka Delt", note: "Süperset — omuz sağlığı, her çekiş seansında zorunlu.", superset: "se_b3" },
      { id: "se_b5", name: "Cable Curl (Yüksek Tekrar)", sets: 3, reps: "15-20", tempo: "2:1:2:0", rpe: "8", rest: 60, muscle: "Biseps", note: "Çekiş dayanıklılığı tamamlayıcı — kavrama da yorulur.", superset: "se_b6" },
      { id: "se_b6", name: "DB Farmer's Hold", sets: 3, reps: "30 sn", tempo: "-", rpe: "8", rest: 60, muscle: "Kavrama", note: "Süperset — kavrama dayanıklılığı her spor için temel.", superset: "se_b5" },
    ],
  },
  "Çar - ALT + KOR": {
    color: "#10B981", emoji: "🟢",
    subtitle: "Alt Vücut + Kor Dayanıklılığı",
    morning: "Zone 2 Bisiklet — 20 dk",
    exercises: [
      { id: "se_c1", name: "Smith Squat (Orta)", sets: 4, reps: "12-15", tempo: "2:1:1:0", rpe: "8", rest: 90, muscle: "Kuadriseps", note: "%60 1RM — yüksek tekrar kas dayanıklılığı. Bacak pompası hedef.", superset: null },
      { id: "se_c2", name: "DB Lunge (Yürüyüş)", sets: 3, reps: "12/bacak", tempo: "2:0:1:0", rpe: "8", rest: 75, muscle: "Kuad+Kalça", note: "Kontinü hareket — aerobik-anaerobik geçiş.", superset: null },
      { id: "se_c3", name: "Hip Thrust Smith (Yüksek Tekrar)", sets: 3, reps: "15-20", tempo: "1:1:1:0", rpe: "8", rest: 75, muscle: "Kalça", note: "Daha hafif ağırlık, daha fazla tekrar — kalça dayanıklılığı.", superset: "se_c4" },
      { id: "se_c4", name: "Hanging Leg Raise", sets: 3, reps: "12-15", tempo: "2:1:1:0", rpe: "8", rest: 75, muscle: "Karın", note: "Süperset — bacak yorgunken kor çalış.", superset: "se_c3" },
      { id: "se_c5", name: "Cable Woodchop", sets: 3, reps: "15/taraf", tempo: "2:0:1:0", rpe: "7", rest: 60, muscle: "Kor", note: "Rotasyonel dayanıklılık — her yönde güç.", superset: "se_c6" },
      { id: "se_c6", name: "Plank", sets: 3, reps: "45-60 sn", tempo: "-", rpe: "8", rest: 60, muscle: "Kor", note: "Süperset — statik dayanıklılık.", superset: "se_c5" },
    ],
  },
  "Per - FULL DEVRE": {
    color: "#F5A623", emoji: "🟡",
    subtitle: "Tam Vücut Devre — 4 Tur, 15 sn Geçiş",
    morning: null,
    exercises: [
      { id: "se_d1", name: "Pull-Up (Devre)", sets: 4, reps: "max (min 5)", tempo: "2:0:1:0", rpe: "8-9", rest: 15, muscle: "Sırt", note: "15sn geçiş, tur sonu 75sn dinlenme. Maksimum tekrar — dur, devam et.", superset: "se_d2" },
      { id: "se_d2", name: "Smith Press (Devre)", sets: 4, reps: "12", tempo: "1:0:1:0", rpe: "8", rest: 15, muscle: "Göğüs", note: "Hemen pull-up sonrası — üst vücut tam yorgunluğu.", superset: "se_d3" },
      { id: "se_d3", name: "DB Goblet Squat (Devre)", sets: 4, reps: "15", tempo: "2:1:1:0", rpe: "8", rest: 15, muscle: "Kuadriseps", note: "Alt vücuda geçiş — aerobik kapasite zorlanır.", superset: "se_d4" },
      { id: "se_d4", name: "Cable Row (Devre)", sets: 4, reps: "15", tempo: "1:0:1:0", rpe: "8", rest: 15, muscle: "Sırt", note: "Sırt dayanıklılığı — yorgunlukta çekiş.", superset: "se_d5" },
      { id: "se_d5", name: "Kürek Ergometresi (Devre)", sets: 4, reps: "45 sn", tempo: "-", rpe: "8-9", rest: 75, muscle: "Kardiyovasküler", note: "Tur sonu — 75sn dinlenme, yeni tura başla.", superset: null },
    ],
  },
  "Cum - KARDİYO + ÜST": {
    color: "#8B5CF6", emoji: "🟣",
    subtitle: "Kardiyo İnterval + Üst Vücut Dayanıklılığı",
    morning: null,
    exercises: [
      { id: "se_e1", name: "Kürek Ergometresi (500m Tekrar)", sets: 4, reps: "500m", tempo: "-", rpe: "8-9", rest: 120, muscle: "Kardiyovasküler", note: "Her 500m'de süreyi not et — dayanıklılık ilerlemesini izle.", superset: null },
      { id: "se_e2", name: "Push-Up (Max Tekrar)", sets: 3, reps: "max", tempo: "1:0:1:0", rpe: "8-9", rest: 60, muscle: "Göğüs", note: "Kürek sonrası yorgunlukta — kuvvet dayanıklılığı testi.", superset: "se_e3" },
      { id: "se_e3", name: "Pull-Up (Max Tekrar)", sets: 3, reps: "max", tempo: "2:0:1:0", rpe: "8-9", rest: 60, muscle: "Sırt", note: "Süperset — tam üst vücut dayanıklılık testi.", superset: "se_e2" },
      { id: "se_e4", name: "Bisiklet Sprint", sets: 4, reps: "30 sn", tempo: "-", rpe: "9-10", rest: 90, muscle: "Kardiyovasküler", note: "Max anaerob güç — anaerobik kapasite geliştirme.", superset: null },
      { id: "se_e5", name: "DB Thruster (Squat+Press)", sets: 3, reps: "10", tempo: "2:0:1:0", rpe: "8-9", rest: 60, muscle: "Full Body", note: "Kondisyon finişörü — tüm vücut yorgunluk adaptasyonu.", superset: null },
    ],
  },
};

// ─────────────────────────────────────────────
// DAYANIKLILIK — Polarize Model, 6 gün
// %60-75 zaman Zone 2, HIIT günleri, kürek/bisiklet/koşu
// ─────────────────────────────────────────────
export const ENDURANCE_DAYS = [
  "Pzt - ZONE 2 + ÜST",
  "Sal - HIIT + ALT",
  "Çar - UZUN AEROBİK",
  "Per - KUVVET DEVRESİ",
  "Cum - HIIT + ÜST",
  "Cmt - AKTİF DİNLENME",
];

export const ENDURANCE_PROGRAM = {
  "Pzt - ZONE 2 + ÜST": {
    color: "#14B8A6", emoji: "🫀",
    subtitle: "Aerobik Temel + Hafif Üst Vücut",
    morning: null,
    exercises: [
      { id: "en_a1", name: "Kürek Ergometresi (Zone 2)", sets: 1, reps: "25 dk", tempo: "-", rpe: "6-7", rest: 0, muscle: "Kardiyovasküler", note: "Konuşabildiğin yoğunluk. Kalp atışı 130-150. Mitokondri gelişimi için temel.", superset: null },
      { id: "en_a2", name: "Pull-Up (Hafif, Kontrollü)", sets: 3, reps: "8-10", tempo: "3:1:2:0", rpe: "6-7", rest: 90, muscle: "Sırt", note: "Zone 2 sonrası hafif kuvvet — aerobik-kuvvet concurrent training.", superset: "en_a3" },
      { id: "en_a3", name: "Smith Bench Press (Hafif)", sets: 3, reps: "12-15", tempo: "2:1:1:0", rpe: "6-7", rest: 90, muscle: "Göğüs", note: "Süperset — %50 1RM. Düşük yoğunluk kardiyo + düşük yoğunluk kuvvet bir arada.", superset: "en_a2" },
      { id: "en_a4", name: "DB Lateral Raise", sets: 3, reps: "20", tempo: "2:0:2:0", rpe: "6", rest: 60, muscle: "Lat.Delt", note: "Hafif ağırlık — omuz dayanıklılık bakımı.", superset: "en_a5" },
      { id: "en_a5", name: "Cable Face Pull", sets: 3, reps: "20", tempo: "2:1:1:0", rpe: "6", rest: 60, muscle: "Arka Delt", note: "Süperset — postür ve rotator cuff dayanıklılığı.", superset: "en_a4" },
      { id: "en_a6", name: "Koşu Bandı (Soğuma Zone 1)", sets: 1, reps: "10 dk", tempo: "-", rpe: "4-5", rest: 0, muscle: "Kardiyovasküler", note: "Aktif toparlanma — kalp atışını yavaşça düşür.", superset: null },
    ],
  },
  "Sal - HIIT + ALT": {
    color: "#E94560", emoji: "💥",
    subtitle: "Yüksek Yoğunluk İnterval + Alt Vücut",
    morning: "5 dk dinamik ısınma",
    exercises: [
      { id: "en_b1", name: "Bisiklet Sprint (Wingate)", sets: 6, reps: "30 sn", tempo: "-", rpe: "9-10", rest: 90, muscle: "Kardiyovasküler", note: "Max anaerob güç. VO2max ve anaerobik kapasite geliştirme — polarize modelin yüksek zonu.", superset: null },
      { id: "en_b2", name: "Smith Squat (Orta)", sets: 3, reps: "12", tempo: "2:1:1:0", rpe: "7-8", rest: 90, muscle: "Kuadriseps", note: "Yorgunlukta bacak — concurrent dayanıklılık adaptasyonu.", superset: null },
      { id: "en_b3", name: "DB Romanian Deadlift", sets: 3, reps: "12", tempo: "3:1:1:0", rpe: "7-8", rest: 75, muscle: "Hamstring", note: "Hamstring aerobik kapasitesi — uzun setler.", superset: "en_b4" },
      { id: "en_b4", name: "Hip Thrust Smith", sets: 3, reps: "15", tempo: "1:1:1:0", rpe: "7-8", rest: 75, muscle: "Kalça", note: "Süperset — kalça-hamstring dayanıklılık birlikte.", superset: "en_b3" },
      { id: "en_b5", name: "Hanging Leg Raise", sets: 3, reps: "15", tempo: "2:1:1:0", rpe: "7", rest: 60, muscle: "Karın", note: "Kor dayanıklılık tamamlayıcı.", superset: null },
    ],
  },
  "Çar - UZUN AEROBİK": {
    color: "#3B82F6", emoji: "🔄",
    subtitle: "Uzun Süreli Zone 2 — Mitokondri Gelişimi",
    morning: null,
    exercises: [
      { id: "en_c1", name: "Kürek Ergometresi (Zone 2)", sets: 1, reps: "20 dk", tempo: "-", rpe: "6-7", rest: 0, muscle: "Kardiyovasküler", note: "Hafta 1-4: 20dk → Hafta 5-8: 30dk → Hafta 9-12: 40dk. Lineer progresyon.", superset: null },
      { id: "en_c2", name: "Koşu Bandı İnterval", sets: 5, reps: "2dk hızlı / 1dk yavaş", tempo: "-", rpe: "7/4", rest: 0, muscle: "Kardiyovasküler", note: "Kürek sonrası — farklı kas grupları, sürekli aerobik uyarı.", superset: null },
      { id: "en_c3", name: "Bisiklet (Aktif Dinlenme)", sets: 1, reps: "10 dk", tempo: "-", rpe: "4-5", rest: 0, muscle: "Kardiyovasküler", note: "Zone 1 — laktik asidin temizlenmesi, kalp atışı düşürme.", superset: null },
    ],
  },
  "Per - KUVVET DEVRESİ": {
    color: "#10B981", emoji: "🔁",
    subtitle: "Full Body Aerobik Güç Devresi — 5 Tur",
    morning: null,
    exercises: [
      { id: "en_d1", name: "Kürek Ergometresi (250m)", sets: 5, reps: "250m", tempo: "-", rpe: "8-9", rest: 30, muscle: "Kardiyovasküler", note: "Kısa sprint — 30sn geçiş, hemen kuvvete geç. Aerobik güç (VO2max eşiği).", superset: "en_d2" },
      { id: "en_d2", name: "Pull-Up (Devre)", sets: 5, reps: "max (min 5)", tempo: "2:0:1:0", rpe: "8-9", rest: 30, muscle: "Sırt", note: "Kürek sonrası hemen — kardiyovasküler yorgunlukta kuvvet.", superset: "en_d3" },
      { id: "en_d3", name: "DB Thruster", sets: 5, reps: "10", tempo: "2:0:1:0", rpe: "8-9", rest: 30, muscle: "Full Body", note: "Tam vücut güç-dayanıklılık. Squat + press kombine.", superset: "en_d4" },
      { id: "en_d4", name: "Cable Row (Hızlı)", sets: 5, reps: "15", tempo: "1:0:1:0", rpe: "8", rest: 30, muscle: "Sırt", note: "Yorgunlukta çekiş dayanıklılığı.", superset: "en_d5" },
      { id: "en_d5", name: "Plank", sets: 5, reps: "30 sn", tempo: "-", rpe: "7-8", rest: 90, muscle: "Kor", note: "Tur sonu — 90sn tam dinlenme sonraki tura hazırlık.", superset: null },
    ],
  },
  "Cum - HIIT + ÜST": {
    color: "#F5A623", emoji: "⚡",
    subtitle: "Yüksek Yoğunluk Kürek + Üst Vücut Dayanıklılığı",
    morning: null,
    exercises: [
      { id: "en_e1", name: "Kürek Ergometresi (1 dk ON/OFF)", sets: 5, reps: "1 dk max", tempo: "-", rpe: "9", rest: 60, muscle: "Kardiyovasküler", note: "1dk max — 1dk tam dinlenme. Aerobik güç üst sınırı (polarize Z3).", superset: null },
      { id: "en_e2", name: "Push-Up (Max Tekrar)", sets: 4, reps: "max", tempo: "1:0:1:0", rpe: "8-9", rest: 60, muscle: "Göğüs", note: "Kürek sonrası yorgunlukta push dayanıklılığı.", superset: "en_e3" },
      { id: "en_e3", name: "Pull-Up (Max Tekrar)", sets: 4, reps: "max", tempo: "2:0:1:0", rpe: "8-9", rest: 60, muscle: "Sırt", note: "Süperset — üst vücut tam yorgunluk dayanıklılığı.", superset: "en_e2" },
      { id: "en_e4", name: "Koşu Bandı Sprint", sets: 4, reps: "45 sn", tempo: "-", rpe: "9-10", rest: 90, muscle: "Kardiyovasküler", note: "Max hız — anaerobik kapasite ve laktik eşik.", superset: null },
      { id: "en_e5", name: "Band Pull-Apart + Omuz Çevrimi", sets: 2, reps: "20", tempo: "1:0:1:0", rpe: "5", rest: 45, muscle: "Omuz", note: "Soğuma — omuz sağlığı bakımı, her yoğun seansın sonu.", superset: null },
    ],
  },
  "Cmt - AKTİF DİNLENME": {
    color: "#8B5CF6", emoji: "🧘",
    subtitle: "Aktif Toparlanma + Mobilite — Düşük Yoğunluk",
    morning: null,
    exercises: [
      { id: "en_f1", name: "Yürüyüş (Koşu Bandı / Açık)", sets: 1, reps: "20-30 dk", tempo: "-", rpe: "3-4", rest: 0, muscle: "Kardiyovasküler", note: "Zone 1 — %50 max kalp atışı. Laktik asit temizleme, parasempatik aktivasyon.", superset: null },
      { id: "en_f2", name: "Hanging Stretch", sets: 3, reps: "40 sn", tempo: "-", rpe: "2", rest: 30, muscle: "Sırt", note: "Pull-up bara asıl — omurga dekompresyonu, sırt kasları gevşeme.", superset: null },
      { id: "en_f3", name: "Band Shoulder Circle", sets: 2, reps: "20/yön", tempo: "1:1:1:0", rpe: "3", rest: 45, muscle: "Omuz", note: "Omuz mobilite — yoğun haftanın ardından eklem sağlığı.", superset: "en_f4" },
      { id: "en_f4", name: "Band Pull-Apart", sets: 2, reps: "25", tempo: "1:0:1:0", rpe: "4", rest: 45, muscle: "Arka Delt", note: "Süperset — postür kasları aktivasyonu, oturgan hayat zararlarını önler.", superset: "en_f3" },
      { id: "en_f5", name: "DB Goblet Squat (Derin, Yavaş)", sets: 2, reps: "10", tempo: "4:4:1:0", rpe: "3", rest: 60, muscle: "Kuadriseps", note: "Kalça mobilite — çok yavaş, tam derinliğe in. Eklem sağlığı.", superset: null },
    ],
  },
};

// ─────────────────────────────────────────────
// CROSSFIT STİLİ — Mevcut Ekipmanla, 5 gün
// AMRAP / EMOM / For Time formatları
// Smith, Cable, Pull-up/Dips, DB 5-20kg, Kürek/Bisiklet/Koşu
// ─────────────────────────────────────────────
export const CROSSFIT_DAYS = [
  "Pzt - KUVVET + AMRAP",
  "Sal - EMOM + ALT",
  "Çar - BENCHMARK WOD",
  "Per - HERO WOD",
  "Cum - KARIŞIK MODAL",
];

export const CROSSFIT_PROGRAM = {
  "Pzt - KUVVET + AMRAP": {
    color: "#EF4444", emoji: "🔴",
    subtitle: "Kuvvet Blok (15 dk) → AMRAP 20 dk",
    morning: "5 dk dinamik ısınma + 3 tur: 5 inchworm, 10 pull-apart, 10 squat",
    exercises: [
      { id: "cf_a1", name: "Smith Press (Kuvvet Blok)", sets: 5, reps: "3", tempo: "2:1:X:0", rpe: "8-9", rest: 180, muscle: "Göğüs", note: "15 dk kuvvet blok — her set ağırlaş. AMRAP öncesi CNS aktivasyonu.", superset: null },
      { id: "cf_a2", name: "Weighted Pull-Up (Kuvvet Blok)", sets: 5, reps: "3", tempo: "2:1:X:0", rpe: "8-9", rest: 180, muscle: "Sırt", note: "Smith ile aynı kuvvet blok. Push-pull denge.", superset: null },
      { id: "cf_a3", name: "AMRAP 20 dk: Pull-Up", sets: 99, reps: "5", tempo: "-", rpe: "8-9", rest: 0, muscle: "Sırt", note: "AMRAP: 5 Pull-Up → 10 Push-Up → 15 DB Squat → tekrar. Tur sayısını not et. Her hafta geç.", superset: "cf_a4" },
      { id: "cf_a4", name: "AMRAP 20 dk: Push-Up", sets: 99, reps: "10", tempo: "-", rpe: "8-9", rest: 0, muscle: "Göğüs", note: "AMRAP devam — yorgunlukta form koru, rep kalitesi önce.", superset: "cf_a5" },
      { id: "cf_a5", name: "AMRAP 20 dk: DB Goblet Squat", sets: 99, reps: "15", tempo: "-", rpe: "8", rest: 0, muscle: "Kuadriseps", note: "Devre tamamlanınca başa dön. Toplam tur + kısmi rep kaydet.", superset: null },
    ],
  },
  "Sal - EMOM + ALT": {
    color: "#F97316", emoji: "🟠",
    subtitle: "EMOM 16 dk + Alt Vücut Kuvveti",
    morning: "3 tur: 10 bant pull-apart, 10 goblet squat, 200m yürüyüş",
    exercises: [
      { id: "cf_b1", name: "EMOM 16 dk: Kürek (Tek/çift dk)", sets: 16, reps: "tekli: 200m / çiftli: 10 push-up", tempo: "-", rpe: "8-9", rest: 0, muscle: "Kardiyovasküler", note: "Tek dakikalar: 200m kürek sprint. Çift dakikalar: 10 push-up. Her dakika başında başla — dinlenme kalan süre.", superset: null },
      { id: "cf_b2", name: "Smith Squat (Ağır)", sets: 4, reps: "5", tempo: "3:1:X:0", rpe: "8-9", rest: 180, muscle: "Kuadriseps", note: "EMOM sonrası ağır squat blok. Bacak kuvveti — her haftada +2.5kg.", superset: null },
      { id: "cf_b3", name: "DB Romanian Deadlift", sets: 3, reps: "8", tempo: "3:2:1:0", rpe: "8", rest: 120, muscle: "Hamstring", note: "20kg DB — posterior zincir kuvveti.", superset: "cf_b4" },
      { id: "cf_b4", name: "Hip Thrust Smith", sets: 3, reps: "10", tempo: "1:2:X:0", rpe: "8", rest: 120, muscle: "Kalça", note: "Süperset — kalça gücü ve posterior zincir.", superset: "cf_b3" },
      { id: "cf_b5", name: "Nordic Curl", sets: 3, reps: "5", tempo: "4:0:0:0", rpe: "8-9", rest: 90, muscle: "Hamstring", note: "Hamstring yaralanma önleme — yavaş negatif.", superset: null },
    ],
  },
  "Çar - BENCHMARK WOD": {
    color: "#EAB308", emoji: "🟡",
    subtitle: "Benchmark WOD — Süre Kaydı Tut, Haftalık Karşılaştır",
    morning: "5 dk mobilite + ısınma seti",
    exercises: [
      { id: "cf_c1", name: "For Time: Kürek (500m)", sets: 1, reps: "500m", tempo: "-", rpe: "9-10", rest: 0, muscle: "Kardiyovasküler", note: "MAX hız 500m — süreyi kaydet. Bu benchmark — haftalık iyileşmeyi izle.", superset: null },
      { id: "cf_c2", name: "For Time: Pull-Up (21-15-9)", sets: 3, reps: "21 / 15 / 9", tempo: "-", rpe: "9", rest: 0, muscle: "Sırt", note: "Klasik CrossFit formatı: 21 pull-up → 21 thruster → 15 pull-up → 15 thruster → 9 pull-up → 9 thruster. Toplam süre = benchmark.", superset: "cf_c3" },
      { id: "cf_c3", name: "For Time: DB Thruster (21-15-9)", sets: 3, reps: "21 / 15 / 9", tempo: "-", rpe: "9", rest: 0, muscle: "Full Body", note: "Fran benzeri WOD — DB ile adapte. 10kg DB her elde. Benchmark süreyi not et.", superset: null },
      { id: "cf_c4", name: "For Time: Dips (50 tekrar)", sets: 1, reps: "50 (bölünebilir)", tempo: "-", rpe: "8-9", rest: 0, muscle: "Göğüs+Tri", note: "50 dips — istediğin sette böl ama dur. Toplam süre kaydet.", superset: null },
      { id: "cf_c5", name: "For Time: Bisiklet Sprint (1 km)", sets: 1, reps: "1 km", tempo: "-", rpe: "9-10", rest: 0, muscle: "Kardiyovasküler", note: "Finişör — max güç 1km. Süre kaydet.", superset: null },
    ],
  },
  "Per - HERO WOD": {
    color: "#8B5CF6", emoji: "🟣",
    subtitle: "Hero WOD Formatı — Uzun, Ağır, Tam Vücut",
    morning: "10 dk mobilite + kapsamlı ısınma",
    exercises: [
      { id: "cf_d1", name: "Cindy (20 dk AMRAP)", sets: 99, reps: "5+10+15", tempo: "-", rpe: "8-9", rest: 0, muscle: "Full Body", note: "20 dk AMRAP: 5 Pull-Up + 10 Push-Up + 15 Air Squat. CrossFit'in en klasik benchmark'ı. Tur sayısını kaydet.", superset: null },
      { id: "cf_d2", name: "EMOM 10 dk: Smith Squat", sets: 10, reps: "3", tempo: "3:1:X:0", rpe: "8", rest: 0, muscle: "Kuadriseps", note: "Cindy sonrası ağır squat EMOM — yorgunlukta kuvvet dayanıklılığı. %70 1RM.", superset: null },
      { id: "cf_d3", name: "EMOM 10 dk: Kürek Sprint", sets: 10, reps: "200m", tempo: "-", rpe: "8-9", rest: 0, muscle: "Kardiyovasküler", note: "Her dk 200m kürek — kalan süre dinlenme. Süreler tutarlı olmalı.", superset: null },
      { id: "cf_d4", name: "Kor Devresi: Hanging Leg Raise", sets: 3, reps: "15", tempo: "2:1:1:0", rpe: "8", rest: 30, muscle: "Karın", note: "→ 45sn Plank → 15 Cable Woodchop/taraf. 30sn geçiş.", superset: "cf_d5" },
      { id: "cf_d5", name: "Kor Devresi: Plank + Woodchop", sets: 3, reps: "45sn + 15/taraf", tempo: "-", rpe: "8", rest: 60, muscle: "Kor", note: "Süperset devam — Hero WOD finişörü.", superset: null },
    ],
  },
  "Cum - KARIŞIK MODAL": {
    color: "#14B8A6", emoji: "🔄",
    subtitle: "Mixed Modal — Kardiyo + Kuvvet + Kor Karışımı",
    morning: null,
    exercises: [
      { id: "cf_e1", name: "3 Tur For Time: Kürek 500m", sets: 3, reps: "500m", tempo: "-", rpe: "9", rest: 0, muscle: "Kardiyovasküler", note: "3 tur for time: 500m kürek → 15 pull-up → 20 push-up → 500m kürek → ... Toplam süre benchmark.", superset: "cf_e2" },
      { id: "cf_e2", name: "3 Tur For Time: Pull-Up + Push-Up", sets: 3, reps: "15 + 20", tempo: "-", rpe: "9", rest: 0, muscle: "Sırt+Göğüs", note: "Kürek ile dönüşümlü — dur. Toplam süre kaydet.", superset: null },
      { id: "cf_e3", name: "EMOM 12 dk: DB Thruster", sets: 12, reps: "tekli: 10 thruster / çiftli: 10 burpee", tempo: "-", rpe: "8-9", rest: 0, muscle: "Full Body", note: "Tek dk: 10 DB thruster (10kg). Çift dk: 10 push-up + squat jump. Her dk başında başla.", superset: null },
      { id: "cf_e4", name: "Bisiklet Tabata (8 tur)", sets: 8, reps: "20sn ON / 10sn OFF", tempo: "-", rpe: "9-10", rest: 0, muscle: "Kardiyovasküler", note: "Tabata protokolü — 20sn max bisiklet, 10sn dur, 8 tekrar = 4 dk. VO2max zirve stimülusu.", superset: null },
      { id: "cf_e5", name: "Soğuma: Band + Hanging Stretch", sets: 2, reps: "20 + 30sn", tempo: "-", rpe: "3", rest: 45, muscle: "Omuz+Sırt", note: "Band pull-apart + pull-up bara asılı ger. Zorunlu soğuma.", superset: null },
    ],
  },
};

// ─────────────────────────────────────────────
// PROGRAM KATEGORİLERİ — meta veri
// ─────────────────────────────────────────────
export const PROGRAM_LIBRARY = [
  { id: "vtaper",              name: "V-Taper",           emoji: "💎", color: "#E94560", description: "Yağ yakma + kas hipertrofisi — estetik vücut", baseDays: DAYS,                    baseProgram: PROGRAM },
  { id: "genel_kuvvet",        name: "Genel Kuvvet",       emoji: "🏋️", color: "#3B82F6", description: "Upper/Lower split, lineer periodizasyon, 4 gün", baseDays: GENERAL_STRENGTH_DAYS,   baseProgram: GENERAL_STRENGTH_PROGRAM },
  { id: "kuvvet_dayanikliligi",name: "Kuvvet Dayanıklılığı",emoji: "⚙️", color: "#10B981", description: "Yüksek hacim, süperset, kısa dinlenme, 5 gün", baseDays: STRENGTH_ENDURANCE_DAYS, baseProgram: STRENGTH_ENDURANCE_PROGRAM },
  { id: "dayaniklilik",        name: "Dayanıklılık",       emoji: "🫀", color: "#14B8A6", description: "Polarize model, Zone 2 + HIIT, 6 gün",            baseDays: ENDURANCE_DAYS,          baseProgram: ENDURANCE_PROGRAM },
  { id: "crossfit",            name: "CrossFit Stili",     emoji: "🏅", color: "#EF4444", description: "AMRAP, EMOM, For Time — mevcut ekipmanla, 5 gün",  baseDays: CROSSFIT_DAYS,           baseProgram: CROSSFIT_PROGRAM },
  { id: "dovus_kuvvet",        name: "Dövüş Kuvveti",      emoji: "⚡", color: "#FF6B35", description: "Patlayıcı güç, kavrama, fonksiyonel kuvvet",       baseDays: COMBAT_STRENGTH_DAYS,    baseProgram: COMBAT_STRENGTH_PROGRAM },
  { id: "dovus_kondisyon",     name: "Dövüş Kondisyonu",   emoji: "🔥", color: "#FF8C00", description: "Aerobik kapasite, HIIT, devre antrenmanı",         baseDays: COMBAT_CONDITIONING_DAYS,baseProgram: COMBAT_CONDITIONING_PROGRAM },
];

// ─────────────────────────────────────────────
// SEVİYE AYARLARI
// ─────────────────────────────────────────────
export const LEVEL_CONFIG = {
  kolay: {
    label: "Başlangıç",
    emoji: "🟢",
    description: "0–6 ay · forma ve temele odaklan",
    setsMod:  (s) => Math.max(2, Math.floor(s * 0.6)),
    restMod:  (r) => Math.round(r * 1.5),
    maxExercises: 4,
    maxDays: 99,
    removeSuperset: true,
    notePrefix: "[Başlangıç] Hafif ağırlıkla başla, formaya odaklan. ",
  },
  orta: {
    label: "Orta",
    emoji: "🟡",
    description: "1–2 yıl · program tam haliyle",
    setsMod:  (s) => s,
    restMod:  (r) => r,
    maxExercises: 99,
    maxDays: 99,
    removeSuperset: false,
    notePrefix: "",
  },
  zor: {
    label: "İleri",
    emoji: "🔴",
    description: "2+ yıl · maksimum yoğunluk",
    setsMod:  (s) => s + 1,
    restMod:  (r) => Math.max(30, Math.round(r * 0.75)),
    maxExercises: 99,
    maxDays: 99,
    removeSuperset: false,
    notePrefix: "[İleri] +1 set, kısa dinlenme, RPE sınırına götür. ",
  },
};

// ─────────────────────────────────────────────
// OTOMATİK SEVİYE DÖNÜŞTÜRÜCÜ
// ─────────────────────────────────────────────
function applyDifficulty(lib, level) {
  const cfg = LEVEL_CONFIG[level];
  const days = lib.baseDays.slice(0, cfg.maxDays);
  const program = {};
  days.forEach((day) => {
    const d = lib.baseProgram[day];
    if (!d) return;
    const exercises = d.exercises.slice(0, cfg.maxExercises).map((ex) => ({
      ...ex,
      id: `${ex.id}_${level[0]}`,
      sets: cfg.setsMod(ex.sets),
      rest: cfg.restMod(ex.rest),
      superset: cfg.removeSuperset ? null : ex.superset,
      note: cfg.notePrefix + ex.note,
    }));
    program[day] = { ...d, exercises };
  });
  return { days, program };
}

// ─────────────────────────────────────────────
// TÜM PROGRAMLAR — programatik üretim
// 7 kategori × 3 seviye = 21 program
// ─────────────────────────────────────────────
export const ALL_PROGRAMS = {};
PROGRAM_LIBRARY.forEach((lib) => {
  ["kolay", "orta", "zor"].forEach((level) => {
    const key = `${lib.id}_${level}`;
    const { days, program } = applyDifficulty(lib, level);
    ALL_PROGRAMS[key] = {
      id: key,
      category: lib.id,
      level,
      name: lib.name,
      emoji: lib.emoji,
      color: lib.color,
      description: lib.description,
      days,
      program,
    };
  });
});
