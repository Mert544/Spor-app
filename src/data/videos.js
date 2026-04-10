// Egzersiz adı → YouTube arama URL'si
// Her egzersiz için en iyi demo videosu otomatik üste çıkar
const BASE = 'https://www.youtube.com/results?search_query=';

const VIDEO_MAP = {
  // ── BENCH / PRESS ──────────────────────────────
  'Smith Bench Press (Duraklamalı)':     BASE + 'smith+machine+bench+press+pause+form',
  'Smith Bench Press (Hafif)':           BASE + 'smith+machine+bench+press+form',
  'Smith Bench Press (Orta)':            BASE + 'smith+machine+bench+press+form',
  'Smith Flat Bench Press':              BASE + 'smith+machine+bench+press+form',
  'Smith Flat Bench (Hipertrofi)':       BASE + 'smith+machine+bench+press+hypertrophy',
  'Smith Incline Press (30°)':           BASE + 'smith+machine+incline+bench+press+30+degrees',
  'Smith İncline Press (30°)':           BASE + 'smith+machine+incline+bench+press+30+degrees',
  'Smith Incline Press':                 BASE + 'smith+machine+incline+bench+press+form',
  'Smith Press (Kuvvet Blok)':           BASE + 'smith+machine+bench+press+strength+form',
  'Smith Press (Patlayıcı)':             BASE + 'smith+machine+bench+press+explosive+form',
  'Smith Press (Orta)':                  BASE + 'smith+machine+bench+press+form',
  'Smith Press (Devre)':                 BASE + 'smith+machine+bench+press+circuit',
  'Smith Overhead Press (Ayakta)':       BASE + 'smith+machine+overhead+press+standing+form',
  'Smith OHP (Oturur)':                  BASE + 'smith+machine+seated+overhead+press+form',
  'DB Push Press (Ayakta)':             BASE + 'dumbbell+push+press+exercise+form',

  // ── PULL-UP / ÇEKİŞ ───────────────────────────
  'Pull-Up':                            BASE + 'pull+up+proper+form+tutorial',
  'Pull-Up (BW)':                       BASE + 'pull+up+proper+form+tutorial',
  'Pull-Up (Devre)':                    BASE + 'pull+up+circuit+training+form',
  'Pull-Up (Geniş Tutuş)':             BASE + 'wide+grip+pull+up+form',
  'Pull-Up (Hafif, Kontrollü)':         BASE + 'pull+up+controlled+form',
  'Pull-Up (Max Tekrar)':              BASE + 'pull+up+max+reps+technique',
  'Weighted Pull-Up':                   BASE + 'weighted+pull+up+form+tutorial',
  'Weighted Pull-Up (Kuvvet Blok)':     BASE + 'weighted+pull+up+strength+form',
  'Patlayıcı Pull-Up':                  BASE + 'explosive+pull+up+plyometric+form',
  'Towel Pull-Up (Havlulu)':            BASE + 'towel+pull+up+grip+strength',
  'Neutral Grip Pull-Up':               BASE + 'neutral+grip+pull+up+form',
  'Lat Pulldown (cable geniş)':         BASE + 'lat+pulldown+wide+grip+proper+form',

  // ── ROW ────────────────────────────────────────
  'Cable Row (Ağır, Tek Kol)':          BASE + 'single+arm+cable+row+form',
  'Cable Row (Hızlı)':                  BASE + 'cable+seated+row+form+tutorial',
  'Cable Row (Patlayıcı)':              BASE + 'explosive+cable+row+form',
  'Cable Row (Devre)':                  BASE + 'cable+row+circuit+form',
  'Seated Cable Row':                   BASE + 'seated+cable+row+proper+form',
  'Cable Rear Delt Row':                BASE + 'cable+rear+delt+row+form',
  'DB One-Arm Row':                     BASE + 'one+arm+dumbbell+row+proper+form',
  'DB Row':                             BASE + 'dumbbell+row+proper+form',
  'Chest-Supported DB Row':             BASE + 'chest+supported+dumbbell+row+form',
  'Bent-over DB Rear Delt Fly':         BASE + 'bent+over+rear+delt+fly+dumbbell',

  // ── LATERAL RAISE / DELT ──────────────────────
  'DB Lateral Raise':                   BASE + 'dumbbell+lateral+raise+proper+form',
  'DB Lateral Raise (3sn ecc)':         BASE + 'dumbbell+lateral+raise+slow+eccentric+form',
  'DB Lateral Raise (3sn İniş)':        BASE + 'dumbbell+lateral+raise+slow+eccentric+form',
  'DB Lateral Raise (oturur)':          BASE + 'seated+dumbbell+lateral+raise+form',
  'DB Lateral Raise — Myo-Rep':         BASE + 'dumbbell+lateral+raise+myo+rep+set',
  'Lat Raise Myo-Rep':                  BASE + 'lateral+raise+myo+rep+training',
  'Lateral Raise Myo-Rep':              BASE + 'lateral+raise+myo+rep+training',
  'Cable Lateral Raise':                BASE + 'cable+lateral+raise+proper+form',
  'Cable Cross-Body Lateral Raise':     BASE + 'cable+cross+body+lateral+raise+form',
  'Cable Rope Rear Delt Pull':          BASE + 'cable+rope+rear+delt+pull+form',
  'Cable Rope Facepull':                BASE + 'cable+rope+face+pull+form',

  // ── FACE PULL ─────────────────────────────────
  'Cable Face Pull':                    BASE + 'cable+face+pull+proper+form',
  'Cable Face Pull + Dış Rot.':         BASE + 'cable+face+pull+external+rotation+form',
  'Cable Face Pull + Dış Rotasyon':     BASE + 'cable+face+pull+external+rotation+form',

  // ── CABLE FLY ─────────────────────────────────
  'Cable Fly (low-to-high)':            BASE + 'cable+fly+low+to+high+form',
  'Cable Fly (Orta)':                   BASE + 'cable+crossover+fly+chest+form',
  'Cable Fly (mid)':                    BASE + 'cable+crossover+fly+chest+form',
  'DB Incline Fly':                     BASE + 'dumbbell+incline+fly+chest+form',

  // ── DIPS ───────────────────────────────────────
  'Dips (öne eğik, göğüs vurgusu)':    BASE + 'chest+dips+forward+lean+proper+form',
  'Dips (Ağırlıklı)':                  BASE + 'weighted+dips+proper+form+tutorial',
  'Dips (BW)':                          BASE + 'bodyweight+dips+proper+form',
  'Dips (BW veya ağırlıklı)':          BASE + 'dips+bodyweight+weighted+form',
  'Dips (Devre)':                       BASE + 'dips+circuit+training+form',

  // ── SQUAT ─────────────────────────────────────
  'Smith Squat (Duraklamalı)':          BASE + 'smith+machine+squat+pause+form',
  'Smith Squat (Ağır)':                 BASE + 'smith+machine+squat+heavy+form',
  'Smith Squat (Orta)':                 BASE + 'smith+machine+squat+form+tutorial',
  'Smith Squat (Patlayıcı)':            BASE + 'smith+machine+squat+explosive+form',
  'Smith Squat (Ön / Goblet)':          BASE + 'smith+machine+front+squat+form',
  'Smith Squat':                        BASE + 'smith+machine+squat+form+tutorial',
  'DB Goblet Squat (Derin)':            BASE + 'goblet+squat+dumbbell+deep+form',
  'DB Goblet Squat (Derin, Yavaş)':     BASE + 'goblet+squat+slow+deep+form',
  'DB Goblet Squat (Devre)':            BASE + 'goblet+squat+circuit+form',

  // ── LUNGE / SPLIT ─────────────────────────────
  'Walking Lunge (DB)':                 BASE + 'walking+lunge+dumbbell+proper+form',
  'DB Lunge (Yürüyüş)':                 BASE + 'walking+lunge+dumbbell+form',
  'DB Bulgarian Split Squat':           BASE + 'bulgarian+split+squat+dumbbell+form',

  // ── HIP HINGE ─────────────────────────────────
  'DB Romanian Deadlift':               BASE + 'dumbbell+romanian+deadlift+proper+form',
  'Hip Thrust Smith':                   BASE + 'smith+machine+hip+thrust+proper+form',
  'Hip Thrust Smith (Ağır)':            BASE + 'smith+machine+hip+thrust+heavy+form',
  'Hip Thrust Smith (Orta)':            BASE + 'smith+machine+hip+thrust+form',
  'Hip Thrust Smith (Patlayıcı)':       BASE + 'smith+machine+hip+thrust+explosive+form',
  'Hip Thrust Smith (Yüksek Tekrar)':   BASE + 'hip+thrust+high+reps+form',
  'Hip Thrust (Smith)':                 BASE + 'smith+machine+hip+thrust+proper+form',

  // ── NORDIC / LEG CURL ─────────────────────────
  'Nordic Curl':                        BASE + 'nordic+hamstring+curl+how+to+form',
  'Nordic Curl (Negatif)':              BASE + 'nordic+curl+eccentric+how+to+form',
  'Nordic Curl veya Leg Curl':          BASE + 'nordic+hamstring+curl+form',

  // ── CALF ──────────────────────────────────────
  'Calf Raise (Smith)':                 BASE + 'smith+machine+calf+raise+form',
  'Smith Single-Leg Calf Raise':        BASE + 'single+leg+calf+raise+smith+machine+form',
  'Single-Leg Calf Raise (Smith)':      BASE + 'single+leg+calf+raise+smith+form',

  // ── KOR / ABS ─────────────────────────────────
  'Hanging Leg Raise':                  BASE + 'hanging+leg+raise+proper+form+abs',
  'Hanging Knee Raise':                 BASE + 'hanging+knee+raise+abs+form',
  'Plank':                              BASE + 'plank+exercise+proper+form',
  'Plank (Ağırlıklı)':                  BASE + 'weighted+plank+exercise+form',
  'Plank (Devre)':                      BASE + 'plank+circuit+form',
  'Cable Woodchop':                     BASE + 'cable+woodchop+exercise+proper+form',
  'Cable Woodchop (Çapraz)':            BASE + 'cable+chop+rotational+core+exercise+form',
  'Cable Anti-Rotation Press':          BASE + 'pallof+press+cable+anti+rotation+form',
  'Cable Crunch':                       BASE + 'cable+crunch+abs+proper+form',
  'Cable Pullover':                     BASE + 'cable+pullover+exercise+form',

  // ── BİSEPS / TRİSEPS ──────────────────────────
  'Cable Curl':                         BASE + 'cable+bicep+curl+proper+form',
  'Cable Curl (EZ veya düz bar)':       BASE + 'cable+curl+ez+bar+form',
  'Cable Curl (Kavrama Odaklı)':        BASE + 'cable+curl+grip+strength+form',
  'Cable Curl (Yavaş Eks.)':            BASE + 'cable+curl+slow+eccentric+form',
  'Cable Curl (Yüksek Tekrar)':         BASE + 'cable+curl+high+reps+endurance',
  'Cable Hammer Curl':                  BASE + 'cable+hammer+curl+form',
  'Cable Bayrak Curl':                  BASE + 'cable+bayrak+curl+form',
  'Cable Bayrak Curl (Cross-body)':     BASE + 'cable+cross+body+curl+form',
  'EZ Bar Curl (Kablolu)':              BASE + 'cable+ez+bar+curl+form',
  'Incline DB Curl (45°)':              BASE + 'incline+dumbbell+curl+45+degree+form',
  'DB Preacher Curl':                   BASE + 'dumbbell+preacher+curl+form',
  'DB Hammer Curl — Myo-Rep':           BASE + 'dumbbell+hammer+curl+myo+rep',
  'Biseps Myo-Rep (kablo)':             BASE + 'cable+bicep+curl+myo+rep+set',
  'Overhead Cable Tricep Ext.':         BASE + 'overhead+cable+tricep+extension+form',
  'Cable OH Tricep Extension':          BASE + 'overhead+cable+tricep+extension+form',
  'Cable OH Tricep Extension (ip)':     BASE + 'overhead+cable+rope+tricep+extension',
  'Cable Pushdown (düz bar)':           BASE + 'cable+tricep+pushdown+straight+bar+form',
  'Cable Pushdown (ip)':                BASE + 'cable+rope+tricep+pushdown+form',
  'Tricep Pushdown':                    BASE + 'tricep+pushdown+cable+proper+form',
  'Skullcrusher (DB)':                  BASE + 'dumbbell+skull+crusher+form',
  'Triseps Myo-Rep (pushdown)':         BASE + 'tricep+pushdown+myo+rep+set',

  // ── OMUZ / BOYUN ──────────────────────────────
  'Band Pull-Apart':                    BASE + 'band+pull+apart+exercise+form',
  'Band Shoulder Circle':               BASE + 'band+shoulder+circle+mobility',
  'Band Hip Circle':                    BASE + 'resistance+band+hip+circle+glute',
  'Band Boyun Fleksiyonu':              BASE + 'neck+flexion+resistance+band+exercise',
  'Band Boyun Ekstansiyonu':            BASE + 'neck+extension+resistance+band+exercise',
  'DB Shrug (omuz sıkıştırma)':        BASE + 'dumbbell+shrug+proper+form+trap',
  'Cable Abduction':                    BASE + 'cable+hip+abduction+exercise+form',

  // ── FONKSİYONEL ───────────────────────────────
  'DB Turkish Get-Up':                  BASE + 'turkish+get+up+dumbbell+how+to+form',
  'DB Thruster':                        BASE + 'dumbbell+thruster+squat+press+form',
  'DB Thruster (Squat+Press)':          BASE + 'dumbbell+thruster+exercise+form',
  'DB Farmer\'s Hold':                  BASE + 'farmer+hold+dumbbell+grip+strength',
  'DB Farmer\'s Carry':                 BASE + 'farmer+carry+dumbbell+exercise+form',
  'DB Wrist Curl + Extension':          BASE + 'wrist+curl+extension+dumbbell+form',

  // ── KARDİYO ───────────────────────────────────
  'Kürek Ergometresi (Zone 2)':         BASE + 'rowing+machine+technique+zone+2',
  'Kürek Ergometresi Sprint':           BASE + 'rowing+machine+sprint+technique',
  'Kürek Ergometresi Interval':         BASE + 'rowing+machine+interval+training+technique',
  'Kürek Ergometresi (500m Tekrar)':    BASE + 'concept2+rowing+500m+technique',
  'Kürek Ergometresi (250m)':           BASE + 'concept2+rowing+250m+sprint+form',
  'Kürek Ergometresi (Devre)':          BASE + 'rowing+machine+circuit+form',
  'Kürek Ergometresi (1 dk ON/OFF)':    BASE + 'rowing+machine+interval+1+minute+form',
  'Bisiklet Sprint':                    BASE + 'stationary+bike+sprint+technique',
  'Bisiklet Sprint (Wingate)':          BASE + 'wingate+test+bike+sprint+technique',
  'Bisiklet Tabata (8 tur)':            BASE + 'tabata+stationary+bike+protocol',
  'Koşu Bandı İnterval':                BASE + 'treadmill+interval+training+technique',
  'Koşu Bandı Interval':                BASE + 'treadmill+interval+training+technique',
  'Koşu Bandı Sprint':                  BASE + 'treadmill+sprint+running+form',
  'Hanging Stretch':                    BASE + 'dead+hang+spinal+decompression+benefits',
};

export function getVideoUrl(exerciseName) {
  // Exact match
  if (VIDEO_MAP[exerciseName]) return VIDEO_MAP[exerciseName];
  // Partial match — find closest key
  const key = Object.keys(VIDEO_MAP).find(k =>
    exerciseName.toLowerCase().includes(k.toLowerCase()) ||
    k.toLowerCase().includes(exerciseName.toLowerCase())
  );
  if (key) return VIDEO_MAP[key];
  // Fallback: generic YouTube search
  const query = encodeURIComponent(exerciseName + ' exercise proper form tutorial');
  return `https://www.youtube.com/results?search_query=${query}`;
}

export default VIDEO_MAP;
