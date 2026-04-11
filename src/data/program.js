// V-Taper Coach — Tam Program Datası
// 6 günlük Push/Pull split, 12 haftalık program
import { HIBRIT_ATLET_DAYS, HIBRIT_ATLET_PROGRAM } from './programs/hibrit.js';
import { TAKTIK_ATLET_DAYS, TAKTIK_ATLET_PROGRAM } from './programs/taktik.js';
import { BIKINI_FIT_DAYS, BIKINI_FIT_PROGRAM, GUC_SEKIL_DAYS, GUC_SEKIL_PROGRAM } from './programs/kadin.js';

export const DAYS = [
  "Pzt - PUSH A",
  "Sal - PULL A",
  "Çar - OMUZ+KOL",
  "Per - PUSH B",
  "Cum - PULL B",
  "Cmt - BACAK",
  "Paz - AKTİF DİNLENME",
];

// JS getDay(): 0=Pazar, 1=Pazartesi...6=Cumartesi
// DAYS[0] = Pazartesi (index 1 → 0), Pazar = DAYS[6]
export const DAY_INDEX_MAP = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 0: 6 };

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
      { id: "pc10", name: "DB Arnold Press", sets: 3, reps: "10-12", tempo: "2:1:1:0", rpe: "8", rest: 90, muscle: "Omuz", note: "Döndürme hareketi — ön + lateral + arka delt tümü aktif. Tam ROM. V-taper omuz genişliği için en kapsamlı egzersiz.", superset: "pc11" },
      { id: "pc11", name: "Cable Y-Raise (Alt Kablo)", sets: 3, reps: "12-15", tempo: "2:1:2:0", rpe: "8", rest: 90, muscle: "Omuz", note: "Alt kablo, kollar Y açısı — alt trapez + posterior kapsül. Omuz sağlığı + V-taper yüksekliği.", superset: "pc10" },
      { id: "pc12", name: "DB Zottman Curl", sets: 3, reps: "10-12", tempo: "3:1:2:0", rpe: "8", rest: 75, muscle: "Biseps", note: "Üste supinasyon curl → aşağı pronasyon — uzun + kısa baş + brakioradialis tek harekette. Bütün biseps için.", superset: "pc13" },
      { id: "pc13", name: "DB Lying Skull Crusher", sets: 3, reps: "12-15", tempo: "3:1:1:0", rpe: "8-9", rest: 75, muscle: "Triseps", note: "Uzun baş stretch — çubuğu alnın arkasına indir, germe pozisyonunda duraklama. Maeo 2023: overhead > pushdown hipertrofi.", superset: "pc12" },
      { id: "pc14", name: "DB Concentration Curl", sets: 3, reps: "10-12", tempo: "3:2:2:0", rpe: "8-9", rest: 60, muscle: "Biseps", note: "Dirsek dize yaslanmış — izole edilmiş, tam kasılma. Zirve kasılmada 2sn tut. Kısa baş tepe noktası.", superset: "pc15" },
      { id: "pc15", name: "Close-Grip Push-Up + DB Kickback", sets: 3, reps: "12 + 12", tempo: "2:1:1:0", rpe: "8", rest: 75, muscle: "Triseps", note: "Dar tutuş şınavı (lateral + medial baş) → hemen DB kickback (uzun baş). Triseps tam volüm.", superset: null },
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
        name: "Smith Hack Squat",
        sets: 3,
        reps: "10-12",
        tempo: "3:1:1:0",
        rpe: "8",
        rest: 90,
        muscle: "Kuadriseps",
        note: "Ayaklar önde, sırt Smith çubuğuna yaslı — VMO dominant, derin stretch pozisyonu. Pedrosa 2022: derin squat = %11 daha fazla kuad hipertrofi vs paralel",
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
      { id: "pf11", name: "Pallof Press (Kablo Anti-Rotasyon)", sets: 3, reps: "12/taraf", tempo: "2:2:1:0", rpe: "7-8", rest: 60, muscle: "Kor", note: "Kablo omuz hizasında — gövdeyi döndürmeye direniş. Stuart McGill: fonksiyonel kor kuvvetinin temeli. Atletik performans için kritik.", superset: "pf12" },
      { id: "pf12", name: "Cable Woodchop (Çapraz Çekiş)", sets: 3, reps: "12/taraf", tempo: "2:0:1:0", rpe: "8", rest: 60, muscle: "Kor", note: "Rotasyonel güç — kalçadan döndür, kor aktif. Atletik transfer en yüksek kor egzersizlerinden.", superset: "pf11" },
      { id: "pf13", name: "DB Bulgarian Split Squat", sets: 3, reps: "10/bacak", tempo: "3:1:1:0", rpe: "8-9", rest: 90, muscle: "Kuad+Kalça", note: "Arka ayak bench/kürsüye — tek bacak dominant, derin stretch. Stretch-mediated hipertrofi için ideal (%12+ daha fazla kuad büyümesi).", superset: null },
      { id: "pf14", name: "DB Step-Up (Yüksek)", sets: 3, reps: "12/bacak", tempo: "2:1:1:0", rpe: "8", rest: 75, muscle: "Kuad+Kalça", note: "Yüksek step (diz hizası) — unilateral güç + denge. MTI taktik atletler için temel fonksiyonel hareket.", superset: "pf15" },
      { id: "pf15", name: "Band Hip Thrust (Diz Bandı)", sets: 3, reps: "15-20", tempo: "2:1:2:0", rpe: "8", rest: 75, muscle: "Kalça", note: "Direnç bandını dizlere tak + kalça itiş — glute med + min aktivasyonu. Kalça abduktör güçlendirme.", superset: "pf14" },
      { id: "pf16", name: "Dead Bug", sets: 3, reps: "8/taraf", tempo: "3:2:1:0", rpe: "6-7", rest: 60, muscle: "Kor", note: "Sırt üstü, kol + karşı bacak uzat — anti-ekstansiyon kor stabilitesi. Bel sağlığı için en bilimsel kor egzersizi.", superset: "pf17" },
      { id: "pf17", name: "RKC Plank (Köklenmiş)", sets: 3, reps: "20-30 sn", tempo: "-", rpe: "8-9", rest: 60, muscle: "Kor", note: "Standart planktan çok daha zor: yumruklar, dirsekler öne, kalça sıkıştır, omuzlar sırt yönüne çek, diz düzleştir. Pavel Tsatsouline protokolü.", superset: "pf16" },
    ],
  },

  "Paz - AKTİF DİNLENME": {
    color: "#8B5CF6", emoji: "🧘",
    subtitle: "Aktif Toparlanma · Mobilite · Yaralanma Önleme",
    morning: null,
    exercises: [
      { id: "pg1", name: "Koşu Bandı Yürüyüş (Aktif Toparlanma)", sets: 1, reps: "20-25 dk", tempo: "-", rpe: "3-4", rest: 0, muscle: "Kardiyovasküler", note: "Zone 1 — %50 max KAH. Laktik asit temizleme, parasempatik aktivasyon. Konuşabilecek kadar yavaş.", superset: null },
      { id: "pg2", name: "Hanging Stretch + Traksiyon", sets: 3, reps: "45 sn", tempo: "-", rpe: "2", rest: 30, muscle: "Sırt", note: "Pull-up barına asıl — omurga dekompresyonu, latissimus gevşetme. Kol kaslarını bilinçli bırak.", superset: null },
      { id: "pg3", name: "Band Shoulder Circle (Dış Rotasyon)", sets: 3, reps: "15/yön", tempo: "2:1:2:0", rpe: "3", rest: 45, muscle: "Omuz", note: "Direnç bandıyla omuz çevrimi → dış rotasyon — rotator cuff sağlığı bakımı. Her ağır antrenman sonrası zorunlu.", superset: "pg4" },
      { id: "pg4", name: "Band Pull-Apart", sets: 3, reps: "25", tempo: "1:1:1:0", rpe: "3", rest: 45, muscle: "Arka Delt", note: "Postür kasları aktivasyonu — arka delt + rhomboid. Masa başı hayatının zararlarını tersine çevirir.", superset: "pg3" },
      { id: "pg5", name: "DB Goblet Squat (Derin Mobilite)", sets: 3, reps: "8", tempo: "5:3:1:0", rpe: "3", rest: 60, muscle: "Kuadriseps", note: "Kilo değil derinlik — kalça mobilite ve dirsekler dizlere yaslanmış. Çok yavaş in, eklem sağlığı odağı.", superset: null },
      { id: "pg6", name: "Hip 90/90 Stretch", sets: 2, reps: "5/taraf", tempo: "yavaş", rpe: "2", rest: 60, muscle: "Kalça", note: "Yerde otur, her iki kalça 90° — kalça iç/dış rotasyon esnekliği. Sporcuların en çok ihmal ettiği mobilite.", superset: "pg7" },
      { id: "pg7", name: "Köpük Rulo (Foam Roll) — Sırt+Bacak", sets: 1, reps: "3-4 dk", tempo: "-", rpe: "2", rest: 0, muscle: "Fonksiyonel", note: "Torakal omurga + IT bandı + kuadriseps + baldır. Her sıkı noktada 20-30sn dur. Miyofasyal açılım.", superset: null },
    ],
  },
};

export const PHASES = {
  1: {
    name: "Birikim",
    weeks: [1, 2, 3, 4],
    deload: 4,
    rpeMax: 8,
    focus: "MEV→MAV hacim birikimi. Hf1-3: her hafta seti +1 artır. Metabolik stres + kas hasarı adaptasyonu. Stretch vurgulu egzersizlerde tam ROM öğren.",
    deloadNote: "Hf4 DELOAD: Tüm set sayısını ×0.6 yap. Ağırlık aynı, RPE 6-7. Aktif toparlanma — pasif değil.",
  },
  2: {
    name: "Yoğunlaştırma",
    weeks: [5, 6, 7, 8],
    deload: 8,
    rpeMax: 10,
    focus: "MAV→MRV yoğunluk tırmanışı. Hf5-7: ağırlık artışı öncelikli, RPE 8-9+. Mekanik gerilim odağı — ağır + stretch. Bazı setler failure'a 1 tekrar kalana kadar git.",
    deloadNote: "Hf8 DELOAD: Ağırlığı %15 düşür, set sayısını koru. Toparlanma ve süperkompensasyon haftası.",
  },
  3: {
    name: "Gerçekleştirme",
    weeks: [9, 10, 11, 12],
    deload: 11,
    rpeMax: 9,
    focus: "MRV zirvesi + performans testi. Hf9-10: ME setlerinde RPE 9-10. Hf11 mini deload. Hf12: 1RM veya max tekrar testi — 12 haftalık ilerlemeyi ölç.",
    deloadNote: "Hf11 DELOAD: Hacim %50 düşür, en ağır 1-2 seti koru. Hf12 performans testine hazırlık.",
  },
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
    subtitle: "PAP Kompleks — Ağır Uyarı → 4-5 dk → Patlayıcı İfade",
    morning: "10 dk dinamik ısınma + 3 tur: 5 inchworm, 10 bant pull-apart, 5 squat",
    exercises: [
      { id: "ka1", name: "Smith Press (PAP Uyarı)", sets: 3, reps: "2-3", tempo: "2:1:X:0", rpe: "8-9", rest: 120, muscle: "Göğüs", note: "PAP UYARI SETİ — %87-90 1RM, ağır ve güçlü. Ka2'den ÖNCE 4-5 DK BEKLE (Robbins 2005: PAP penceresi 4-8 dk optimal). ME rotasyon: Hf1-3 Flat, Hf5-7 Incline, Hf9-11 Close-Grip.", superset: null },
      { id: "ka2", name: "Explosive Push-Up (PAP İfade)", sets: 4, reps: "4-5", tempo: "0:0:X:0", rpe: "8", rest: 120, muscle: "Göğüs", note: "PAP İFADE — ka1'den 4-5 DK SONRA başla! Her tekrar ELEKTRİK HIZI, eller yerden kalkmalı. Yorgunluk değil hız odağı. Tillin & Bishop 2009: PAP nöromüsküler güç havuzunu artırır.", superset: null },
      { id: "ka3", name: "Weighted Pull-Up (PAP Uyarı)", sets: 3, reps: "2-3", tempo: "2:1:X:0", rpe: "8-9", rest: 120, muscle: "Sırt", note: "PAP UYARI ÇEKİŞ — bele plak/bant ekle, 2-3 sert set. Ka4'ten ÖNCE 4-5 DK BEKLE. Dövüş için kritik çekiş kuvveti.", superset: null },
      { id: "ka4", name: "Explosive Pull-Up (PAP İfade)", sets: 4, reps: "4-5", tempo: "0:0:X:0", rpe: "8", rest: 120, muscle: "Sırt", note: "PAP İFADE — ka3'ten 4-5 DK SONRA başla! BW ile patlayıcı çıkış, çene barın üstüne. Gerçek nöromüsküler güç aktivasyonu.", superset: null },
      { id: "ka5", name: "DB Push Press (Ayakta)", sets: 3, reps: "5", tempo: "1:0:X:0", rpe: "8", rest: 90, muscle: "Omuz", note: "Bacaktan yardım al — kinetik zincir güç aktarımı. Dövüş overhead paterni (güreş fırlatma, boks straight).", superset: "ka6" },
      { id: "ka6", name: "Cable Face Pull + Band Pull-Apart", sets: 3, reps: "15+20", tempo: "2:1:1:0", rpe: "6-7", rest: 90, muscle: "Arka Delt", note: "Rotator cuff + arka delt aktif soğuma — her patlayıcı seansın ZORUNLU finişeri.", superset: "ka5" },
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
// Joel Jamieson Enerji Sistemi Çerçevesi
// Alaktik Güç → Laktik Kapasite → Aerobik Kapasite
// → Alaktik Kapasite → Aerobik Güç → Aktif Dinlenme
// ─────────────────────────────────────────────
export const COMBAT_CONDITIONING_DAYS = [
  "Pzt - ALAKTİK GÜÇ",
  "Sal - LAKTİK KAPASİTE",
  "Çar - AEROBİK KAPASİTE",
  "Per - ALAKTİK KAPASİTE",
  "Cum - AEROBİK GÜÇ",
  "Cmt - AKTİF DİNLENME",
];

export const COMBAT_CONDITIONING_PROGRAM = {
  "Pzt - ALAKTİK GÜÇ": {
    color: "#E94560",
    emoji: "⚡",
    subtitle: "Fosfokreatin Sistemi — 8-10sn Mutlak Max + 90sn Dinlenme",
    morning: null,
    exercises: [
      { id: "da1", name: "Bisiklet Sprint (Alaktik Güç)", sets: 10, reps: "8-10 sn MAX", tempo: "-", rpe: "10", rest: 90, muscle: "Kardiyovasküler", note: "MUTLAK MAX — tam fosfokreatin tükenmesi. 8-10sn'de KES, 90sn TAM dinlen. Jamieson: alaktik güç = en kısa, en yoğun. Güreş patlama anı / boks kombine sonu bu sistemdir. Hf1-4: 8 tur → Hf5-8: 10 tur → Hf9-12: 10 tur + %5 daha hızlı.", superset: null },
      { id: "da2", name: "Kürek Sprint (Alaktik Güç)", sets: 8, reps: "10 sn MAX", tempo: "-", rpe: "10", rest: 90, muscle: "Kardiyovasküler", note: "Bisikletten farklı motor patern — üst+alt vücut kombine alaktik güç. Her seferinde sanki maçın son 10 saniyesi gibi.", superset: null },
      { id: "da3", name: "Pull-Up (Kuvvet Destek)", sets: 3, reps: "max", tempo: "2:0:1:0", rpe: "8", rest: 60, muscle: "Sırt", note: "Alaktik seansın ardından kuvvet — nöromüsküler yorgunlukta çekiş kapasitesi testi.", superset: "da4" },
      { id: "da4", name: "Push-Up (Kuvvet Destek)", sets: 3, reps: "max", tempo: "1:0:1:0", rpe: "8", rest: 60, muscle: "Göğüs", note: "Süperset — üst vücut yorgunlukta kuvvet dayanıklılığı finişer.", superset: "da3" },
      { id: "da5", name: "Kor: Plank + Hollow Hold", sets: 3, reps: "30sn + 20sn", tempo: "-", rpe: "7", rest: 45, muscle: "Kor", note: "Dövüş kor stabilitesi — spinal nötr pozisyon dayanıklılığı.", superset: null },
    ],
  },

  "Sal - LAKTİK KAPASİTE": {
    color: "#3B82F6",
    emoji: "🔥",
    subtitle: "Glikolitik Sistem — 60-90sn Max + 1:2 Work:Rest Oranı",
    morning: "Zone 2 Kürek — 15 dk",
    exercises: [
      { id: "db1", name: "Kürek Sprint (Laktik Kapasite)", sets: 6, reps: "60 sn MAX", tempo: "-", rpe: "9-10", rest: 120, muscle: "Kardiyovasküler", note: "60sn ALL OUT → 120sn dinlenme (1:2 work:rest). Laktik tampon kapasitesi. Jamieson: boks %73-86 aerobik ama laktik anlarda bu sistem devreye girer — tampon kapasitesi olmadan çökürsün. Hf1-4: 5 tur → Hf5-12: 6-7 tur.", superset: null },
      { id: "db2", name: "Bisiklet Sprint (Laktik Kapasite)", sets: 4, reps: "90 sn MAX", tempo: "-", rpe: "9", rest: 180, muscle: "Kardiyovasküler", note: "90sn hard → 180sn dinlenme (1:2). Güreş mat dışı toparlanma simülasyonu. Laktik kapasite = defalarca yüksek yoğunluk sonrası toparlanma hızı.", superset: null },
      { id: "db3", name: "Smith Press (Kuvvet Destek)", sets: 4, reps: "10", tempo: "2:1:1:0", rpe: "7-8", rest: 75, muscle: "Göğüs", note: "Orta yoğunluk kuvvet — laktik seansın ortasında concurrent training adaptasyonu.", superset: null },
      { id: "db4", name: "Pull-Up", sets: 4, reps: "8", tempo: "2:1:1:0", rpe: "8", rest: 75, muscle: "Sırt", note: "Her tekrar kontrollü — çekiş dayanıklılığı.", superset: null },
      { id: "db5", name: "DB One-Arm Row", sets: 3, reps: "10/taraf", tempo: "2:1:1:0", rpe: "8", rest: 60, muscle: "Sırt", note: "Tek taraflı — asimetri kapatma.", superset: "db6" },
      { id: "db6", name: "Cable Lateral Raise", sets: 3, reps: "20", tempo: "2:0:1:0", rpe: "7-8", rest: 60, muscle: "Lat.Delt", note: "Süperset — omuz dayanıklılığı.", superset: "db5" },
    ],
  },

  "Çar - AEROBİK KAPASİTE": {
    color: "#14B8A6",
    emoji: "🫀",
    subtitle: "Zone 2 Aerobik Taban — Mitokondri Biogenezi + Yağ Oksidasyonu",
    morning: null,
    exercises: [
      { id: "dc1", name: "Kürek Ergometresi (Zone 2)", sets: 1, reps: "Hf1-4: 25dk → Hf5-8: 35dk → Hf9-12: 45dk", tempo: "-", rpe: "6-7", rest: 0, muscle: "Kardiyovasküler", note: "Konuşabildiğin yoğunluk. KAH 130-150. Jamieson: aerobik taban = tüm enerji sistemlerinin toparlanma motorudur. HIIT'ten ÖNCE inşa edilmeli. Mitokondri biogenezi için min 20 dk / seans gerekli.", superset: null },
      { id: "dc2", name: "Koşu Bandı (Zone 2 Interval)", sets: 5, reps: "2dk hızlı / 1dk yavaş", tempo: "-", rpe: "7/4", rest: 0, muscle: "Kardiyovasküler", note: "2dk orta tempo + 1dk yürüyüş — aerobik havuzda kalarak farklı kas grubu. Kürekten sonra koşu = tam vücut aerobik uyarı.", superset: null },
      { id: "dc3", name: "Bisiklet (Zone 1 Soğuma)", sets: 1, reps: "10 dk", tempo: "-", rpe: "4-5", rest: 0, muscle: "Kardiyovasküler", note: "Aktif laktat temizleme. KAH 100-120. Parasempatik aktivasyon — toparlanma kalitesini artırır.", superset: null },
    ],
  },

  "Per - ALAKTİK KAPASİTE": {
    color: "#10B981",
    emoji: "⚡",
    subtitle: "PCr Yeniden Sentez Kapasitesi — 12-15sn, 1:4 Work:Rest + Alt Vücut",
    morning: "5 dk mobilite ısınma",
    exercises: [
      { id: "dd1", name: "Bisiklet Sprint (Alaktik Kapasite)", sets: 12, reps: "12-15 sn MAX", tempo: "-", rpe: "9-10", rest: 48, muscle: "Kardiyovasküler", note: "12-15sn MAX → 48sn dinlenme (1:3-4 work:rest). Pazartesiden FARK: daha uzun eforbölümleri + daha az dinlenme = PCr yeniden sentez kapasitesi. Jamieson: güç değil kapasite. Maçın tüm turlarında patlayabilmek için bu gerekli.", superset: null },
      { id: "dd2", name: "Smith Squat (Patlayıcı)", sets: 5, reps: "3", tempo: "3:1:X:0", rpe: "8", rest: 180, muscle: "Kuadriseps", note: "%60-70 1RM — inişte yavaş, çıkışta PATLAYICI. Güreş taklama gücü, boks footwork. Alaktik sprint sonrası nöromüsküler aktivasyon artmıştır — PAP efekti.", superset: null },
      { id: "dd3", name: "DB Romanian Deadlift", sets: 4, reps: "8", tempo: "3:2:1:0", rpe: "8", rest: 120, muscle: "Hamstring", note: "Hamstring kuvvet + esneklik. Nordic ile kombine = güreş/boks hamstring yaralanma %70 azaltma (Petersen 2011).", superset: null },
      { id: "dd4", name: "Nordic Curl", sets: 3, reps: "5-8", tempo: "4:0:0:0", rpe: "8-9", rest: 90, muscle: "Hamstring", note: "Pull-up bardan — 4sn YAVAŞ düşüş. Dövüş sporlarında hamstring yaralanma #1 riski. Bu egzersiz %70 önler (Petersen 2011, Ekstrand 2012).", superset: null },
      { id: "dd5", name: "Hip Thrust Smith (Patlayıcı)", sets: 4, reps: "8", tempo: "1:1:X:0", rpe: "8", rest: 90, muscle: "Kalça", note: "Kalça ekstansiyonu gücü — güreşte fırlatma ve kaldırma için kritik.", superset: null },
      { id: "dd6", name: "Single-Leg Calf Raise (Smith)", sets: 3, reps: "15/bacak", tempo: "2:2:1:0", rpe: "7-8", rest: 60, muscle: "Baldır", note: "Tek bacak — asimetri tespiti ve ankle stabilitesi.", superset: null },
    ],
  },

  "Cum - AEROBİK GÜÇ": {
    color: "#F5A623",
    emoji: "🔄",
    subtitle: "VO2max Eşiği — 3dk İntervallar (1:1) + Full Body Devre",
    morning: null,
    exercises: [
      { id: "de1", name: "Kürek VO2max İnterval", sets: 4, reps: "3 dk HARD", tempo: "-", rpe: "8-9", rest: 180, muscle: "Kardiyovasküler", note: "3dk sert (RPE 8-9) → 3dk kolay (1:1 work:rest). Aerobik GÜÇ = VO2max eşiği stimülasyonu. Jamieson: aerobik kapasite (Çarşamba) temeli olmadan bu antrenman etkisiz olur. Hf1-4: 3 tur → Hf5-8: 4 tur → Hf9-12: 5 tur.", superset: null },
      { id: "de2", name: "Pull-Up (Devre)", sets: 4, reps: "max (min 5)", tempo: "2:0:1:0", rpe: "8-9", rest: 15, muscle: "Sırt", note: "VO2max intervallar arasında kuvvet devresi — yorgunlukta çekiş. 15sn geçiş.", superset: "de3" },
      { id: "de3", name: "Push-Up (Devre)", sets: 4, reps: "max (min 10)", tempo: "1:0:1:0", rpe: "8-9", rest: 15, muscle: "Göğüs", note: "Hemen pull-up sonrası — üst vücut oksidatif güç.", superset: "de4" },
      { id: "de4", name: "DB Goblet Squat (Devre)", sets: 4, reps: "15", tempo: "2:1:1:0", rpe: "8", rest: 15, muscle: "Kuadriseps", note: "Alt vücuda geç — kardiyovasküler stres sürer.", superset: "de5" },
      { id: "de5", name: "Cable Row (Devre)", sets: 4, reps: "15", tempo: "1:0:1:0", rpe: "8", rest: 60, muscle: "Sırt", note: "Tur sonu — 60sn tam dinlenme sonra yeni tura.", superset: null },
    ],
  },

  "Cmt - AKTİF DİNLENME": {
    color: "#8B5CF6",
    emoji: "🧘",
    subtitle: "Parasempatik Aktivasyon + Mobilite — Toparlanma Kalitesi",
    morning: null,
    exercises: [
      { id: "df1", name: "Koşu Bandı (Yürüyüş)", sets: 1, reps: "20 dk", tempo: "-", rpe: "4-5", rest: 0, muscle: "Kardiyovasküler", note: "Zone 1 — KAH %50 max. Laktik asit temizleme, parasempatik aktivasyon. Zorlamak toparlanmayı engeller.", superset: null },
      { id: "df2", name: "Band Shoulder Circle", sets: 2, reps: "20/yön", tempo: "1:1:1:0", rpe: "5", rest: 45, muscle: "Omuz", note: "Omuz mobilite bakımı — her iki yön.", superset: null },
      { id: "df3", name: "Band Pull-Apart", sets: 2, reps: "25", tempo: "1:0:1:0", rpe: "5", rest: 45, muscle: "Arka Delt", note: "Postür kasları aktivasyonu.", superset: null },
      { id: "df4", name: "Hanging Stretch", sets: 3, reps: "30 sn", tempo: "-", rpe: "3", rest: 30, muscle: "Sırt", note: "Pull-up bara asıl — omurga dekompresyonu. Tüm haftalık yükü serbest bırakır.", superset: null },
      { id: "df5", name: "DB Goblet Squat (Derin Mobilite)", sets: 2, reps: "10", tempo: "4:4:1:0", rpe: "4", rest: 45, muscle: "Kuadriseps", note: "Kalça mobilite — çok yavaş, tam derinliğe in. Egzersiz değil hareketlilik.", superset: null },
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
  { id: "vtaper",              name: "V-Taper",            emoji: "💎", color: "#E94560", targetGender: "male",   description: "6 gün Push/Pull split · Blok periodizasyon (Faz 1-2-3) · MEV→MRV hacim · Stretch-mediated hipertrofi · Myo-rep finişer", baseDays: DAYS,                    baseProgram: PROGRAM },
  { id: "genel_kuvvet",        name: "Genel Kuvvet",        emoji: "🏋️", color: "#3B82F6", targetGender: "all",    description: "Upper/Lower split 4 gün · Prilepin tablosuna göre yük · %85 1RM baza + hacim günü · Nordic curl + rotator cuff koruma", baseDays: GENERAL_STRENGTH_DAYS,   baseProgram: GENERAL_STRENGTH_PROGRAM },
  { id: "kuvvet_dayanikliligi",name: "Kuvvet Dayanıklılığı",emoji: "⚙️", color: "#10B981", targetGender: "all",    description: "5 gün Push/Pull/Full · %60-75 1RM yüksek tekrar · Laktik eşik adaptasyonu · Kısa dinlenme süperset sistemi", baseDays: STRENGTH_ENDURANCE_DAYS, baseProgram: STRENGTH_ENDURANCE_PROGRAM },
  { id: "dayaniklilik",        name: "Dayanıklılık",        emoji: "🫀", color: "#14B8A6", targetGender: "all",    description: "6 gün Polarize model · %80 Zone 2 + %20 VO2max · Mitokondri biogenezi · Concurrent training (kardiyo + hafif kuvvet)", baseDays: ENDURANCE_DAYS,          baseProgram: ENDURANCE_PROGRAM },
  { id: "crossfit",            name: "CrossFit Stili",      emoji: "🏅", color: "#EF4444", targetGender: "all",    description: "5 gün AMRAP / EMOM / For Time · Benchmark WOD sistemi · Mevcut ekipmanla adapte · Haftalık süre takibi", baseDays: CROSSFIT_DAYS,           baseProgram: CROSSFIT_PROGRAM },
  { id: "dovus_kuvvet",        name: "Dövüş Kuvveti",       emoji: "⚡", color: "#FF6B35", targetGender: "all",    description: "6 gün · PAP kompleks (ağır→patlayıcı, 4-6dk bekleme) · Kavrama + boyun kuvveti · Nordic curl yaralanma önleme · Phil Daru metodolojisi", baseDays: COMBAT_STRENGTH_DAYS,    baseProgram: COMBAT_STRENGTH_PROGRAM },
  { id: "dovus_kondisyon",     name: "Dövüş Kondisyonu",    emoji: "🔥", color: "#FF8C00", targetGender: "all",    description: "6 gün · Jamieson enerji sistemi: Alaktik Güç → Laktik Kapasite → Aerobik Kapasite → Alaktik Kapasite → Aerobik Güç", baseDays: COMBAT_CONDITIONING_DAYS,baseProgram: COMBAT_CONDITIONING_PROGRAM },
  { id: "hibrit_atlet",        name: "Hibrit Atlet",         emoji: "⚔️", color: "#6366f1", targetGender: "all",    description: "7 gün · Sabah Zone 2 bisiklet + akşam kuvvet (6-8h ayrım) · Interferans yok: bisiklet seçimi (Wilson 2012) · DUP kuvvet + polarize kardiyo · Hedef: Squat 1.5×BW + 5km sub-25dk", baseDays: HIBRIT_ATLET_DAYS, baseProgram: HIBRIT_ATLET_PROGRAM },
  { id: "taktik_atlet",        name: "Taktik Atlet",         emoji: "🎯", color: "#1d4ed8", targetGender: "all",    description: "6 gün · NSCA TSAC çerçevesi · Relatif kuvvet: DL 2×BW + Pull-up +%25BW · Jamieson enerji: Alaktik→Glikolitik→Aerobik · Rucking + yük taşıma · FMS yaralanma önleme", baseDays: TAKTIK_ATLET_DAYS,  baseProgram: TAKTIK_ATLET_PROGRAM },
  { id: "bikini_fit",          name: "Bikini Fit",            emoji: "🍑", color: "#EC4899", targetGender: "female", description: "5 gün · Glute + omuz estetik · Hip thrust ağırlıklı · Bret Contreras Strong Curves çerçevesi · Pump günü + kuvvet günü ayrımı", baseDays: BIKINI_FIT_DAYS,  baseProgram: BIKINI_FIT_PROGRAM },
  { id: "guc_sekil",           name: "Güç & Şekil",           emoji: "💪", color: "#8B5CF6", targetGender: "female", description: "4 gün Upper/Lower split · Compound kuvvet + hipertrofi hacmi · Nordic curl + farmer's walk · Progressif overload tabanlı kadın programı", baseDays: GUC_SEKIL_DAYS,   baseProgram: GUC_SEKIL_PROGRAM },
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
// 11 kategori × 3 seviye = 33 program (9 unisex, 1 erkek, 2 kadın)
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
