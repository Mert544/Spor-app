// Egzersiz alternatifleri — ekipman yoksa veya egzersiz değiştirmek istersen
export const ALTERNATIVES = {
  'Smith Flat Bench Press': ['DB Flat Bench Press', 'Push-Up (ayaklı)', 'Cable Chest Fly'],
  'Smith Flat Bench (Hipertrofi)': ['DB Flat Bench Press', 'Push-Up (ağırlıklı)', 'Pec Deck'],
  'Smith İncline Press (30°)': ['DB Incline Press', 'Cable Incline Press', 'Incline Push-Up'],
  'Dips (öne eğik, göğüs vurgusu)': ['Cable Crossover', 'DB Pullover', 'Decline Push-Up'],
  'Dips (BW veya ağırlıklı)': ['Tricep Bench Dips', 'Cable Pushdown', 'DB Skull Crusher'],
  'DB Incline Fly': ['Cable Fly (low-to-high)', 'Pec Deck', 'Resistance Band Fly'],
  'Cable Fly (low-to-high)': ['DB Incline Fly', 'Incline Cable Press', 'Band Chest Fly'],
  'Cable Fly (mid)': ['DB Flat Fly', 'Pec Deck', 'Band Crossover'],

  'Weighted Pull-Up': ['Lat Pulldown (cable geniş)', 'Band Assisted Pull-Up', 'Cable Pullover'],
  'Neutral Grip Pull-Up': ['Neutral Grip Lat Pulldown', 'Cable Row', 'DB One-Arm Row'],
  'Chest-Supported DB Row': ['Cable Seated Row', 'T-Bar Row', 'Resistance Band Row'],
  'DB One-Arm Row': ['Cable One-Arm Row', 'Chest-Supported DB Row', 'Machine Row'],
  'Lat Pulldown (cable geniş)': ['Weighted Pull-Up', 'Band Pulldown', 'Cable Pullover'],
  'Seated Cable Row': ['DB Row', 'Machine Row', 'Band Seated Row'],
  'Cable Pullover': ['DB Pullover', 'Straight-Arm Pushdown', 'Band Pullover'],

  'Smith OHP (Oturur)': ['DB OHP', 'Arnold Press', 'Machine Shoulder Press'],
  'DB Lateral Raise (3sn ecc)': ['Cable Lateral Raise', 'Band Lateral Raise', 'Upright Row'],
  'DB Lateral Raise (oturur)': ['Cable Lateral Raise', 'Band Lateral Raise', 'Machine Fly'],
  'DB Lateral Raise': ['Cable Lateral Raise', 'Band Lateral Raise', 'Upright Row'],
  'DB Lateral Raise — Myo-Rep': ['Cable Lateral Raise Myo-Rep', 'Band Lateral Raise', 'Machine Lateral Raise'],
  'Lateral Raise Myo-Rep': ['Cable Lateral Raise', 'DB Lateral Raise', 'Machine Lateral Raise'],
  'Cable Lateral Raise': ['DB Lateral Raise', 'Band Lateral Raise', 'Machine Lateral Raise'],
  'Cross-Body Lateral Raise': ['Single-Arm Cable Raise', 'Band Lateral Raise', 'DB Lateral Raise'],
  'Cable Cross-Body Lateral Raise': ['Single-Arm Cable Raise', 'DB Lateral Raise', 'Band Raise'],
  'Cable Face Pull': ['Band Face Pull', 'DB Rear Delt Fly', 'TRX Face Pull'],
  'Cable Face Pull + Dış Rotasyon': ['Band External Rotation', 'DB Rear Delt Fly', 'TRX Row'],
  'Cable Rope Facepull': ['Band Face Pull', 'DB Rear Delt Fly', 'Cable Rear Delt Row'],
  'Bent-over DB Rear Delt Fly': ['Cable Rear Delt Fly', 'Reverse Pec Deck', 'Band Pull-Apart'],
  'Cable Rear Delt Row': ['Bent-over DB Row', 'Reverse Pec Deck', 'Band Pull-Apart'],
  'DB Shrug (omuz sıkıştırma)': ['Barbell Shrug', 'Cable Shrug', 'Trap Bar Shrug'],

  'Cable OH Tricep Extension (ip)': ['DB OH Tricep Extension', 'EZ Bar OH Extension', 'Band OH Extension'],
  'Cable OH Tricep Extension': ['DB OH Tricep Extension', 'EZ Bar OH Extension', 'Band OH Extension'],
  'Cable Pushdown (düz bar)': ['Cable Pushdown (ip)', 'DB Kickback', 'Band Pushdown'],
  'Cable Pushdown (ip)': ['Cable Pushdown (düz bar)', 'DB Kickback', 'Tricep Dips'],
  'Skullcrusher (DB)': ['EZ Bar Skull Crusher', 'Cable OH Extension', 'Band Skull Crusher'],
  'Triseps Myo-Rep (pushdown)': ['DB Tricep Kickback Myo-Rep', 'Band Pushdown Myo-Rep'],

  'Cable Curl (EZ veya düz bar)': ['DB Curl', 'EZ Bar Curl', 'Band Curl'],
  'EZ Bar Curl (Kablolu)': ['DB Curl', 'EZ Bar Free Curl', 'Band Curl'],
  'Incline DB Curl (45°)': ['Cable Curl', 'Band Curl (açılı)', 'Spider Curl'],
  'Cable Bayrak Curl (Cross-body)': ['Single-Arm DB Curl', 'Cross-Body DB Curl', 'Band Curl'],
  'Cable Bayrak Curl': ['Cross-Body DB Curl', 'Cable Curl', 'Band Curl'],
  'DB Preacher Curl': ['Cable Preacher Curl', 'EZ Preacher Curl', 'Incline DB Curl'],
  'Cable Hammer Curl': ['DB Hammer Curl', 'Band Hammer Curl', 'Rope Curl'],
  'DB Hammer Curl — Myo-Rep': ['Cable Hammer Curl Myo-Rep', 'Band Hammer Curl', 'Rope Pushdown'],
  'Biseps Myo-Rep (kablo)': ['DB Curl Myo-Rep', 'Band Curl Myo-Rep'],
  'Lat Raise Myo-Rep': ['Cable Lateral Raise', 'DB Lateral Raise', 'Band Lateral Raise'],

  'Smith Squat': ['Goblet Squat', 'DB Squat', 'Leg Press', 'Hack Squat'],
  'Leg Press': ['Smith Squat', 'DB Squat', 'Bulgarian Split Squat'],
  'DB Romanian Deadlift': ['Cable RDL', 'Barbell RDL', 'Band RDL'],
  'Nordic Curl veya Leg Curl': ['Lying Leg Curl', 'Band Leg Curl', 'Glute-Ham Raise'],
  'Walking Lunge (DB)': ['Reverse Lunge', 'Bulgarian Split Squat', 'Step-Up'],
  'Hip Thrust (Smith)': ['Hip Thrust (DB)', 'Glute Bridge', 'Cable Kickback'],
  'Cable Abduction': ['Band Abduction', 'Side-Lying Clam', 'Machine Abduction'],
  'Calf Raise (Smith)': ['Standing DB Calf Raise', 'Seated Calf Raise', 'Band Calf Raise'],

  'Hanging Leg Raise': ['Lying Leg Raise', 'Dragon Flag', 'Band Crunch'],
  'Cable Crunch': ['Decline Crunch', 'Ab Wheel Rollout', 'Band Crunch'],
};

export function getAlternatives(exerciseName) {
  if (ALTERNATIVES[exerciseName]) return ALTERNATIVES[exerciseName];
  // Fuzzy match
  const key = Object.keys(ALTERNATIVES).find(k =>
    exerciseName.toLowerCase().includes(k.toLowerCase().split(' ')[0])
  );
  return key ? ALTERNATIVES[key] : [];
}
