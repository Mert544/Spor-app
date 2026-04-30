// V-Taper Coach — Personal Program Generator
// Generates a complete CustomProgram from a user profile

import { EXERCISE_POOL } from '../data/exercisePool';

// ─── Goal → visual ────────────────────────────────────────────────────────
const GOAL_META = {
  hypertrophy: { emoji: '💪', color: '#14B8A6', label: 'Kas Kazan' },
  strength:    { emoji: '🏋️', color: '#E94560', label: 'Güçlen' },
  fat_loss:    { emoji: '🔥', color: '#F59E0B', label: 'Yağ Yak' },
  athletic:    { emoji: '⚡', color: '#8B5CF6', label: 'Atletik' },
  fitness:     { emoji: '🫀', color: '#10B981', label: 'Genel Fitness' },
};

// ─── Parameters by goal + experience ─────────────────────────────────────
const PARAMS = {
  hypertrophy: {
    beginner:     { sets: 3, repsT1: '10-12', repsT2: '12-15', repsT3: '15-20', rpe: '6-7', restMult: 1.2 },
    intermediate: { sets: 4, repsT1: '8-10',  repsT2: '10-12', repsT3: '12-15', rpe: '7-8', restMult: 1.0 },
    advanced:     { sets: 4, repsT1: '6-8',   repsT2: '8-12',  repsT3: '12-15', rpe: '8-9', restMult: 0.85 },
  },
  strength: {
    beginner:     { sets: 3, repsT1: '6-8',   repsT2: '8-10',  repsT3: '12-15', rpe: '6-7', restMult: 1.5 },
    intermediate: { sets: 4, repsT1: '4-6',   repsT2: '6-8',   repsT3: '10-12', rpe: '7-8', restMult: 1.3 },
    advanced:     { sets: 5, repsT1: '2-4',   repsT2: '4-6',   repsT3: '8-10',  rpe: '8-9', restMult: 1.2 },
  },
  fat_loss: {
    beginner:     { sets: 3, repsT1: '12-15', repsT2: '15-20', repsT3: '20+',   rpe: '6-7', restMult: 0.8 },
    intermediate: { sets: 3, repsT1: '10-15', repsT2: '12-20', repsT3: '15-20', rpe: '7-8', restMult: 0.7 },
    advanced:     { sets: 4, repsT1: '10-12', repsT2: '12-15', repsT3: '15-20', rpe: '8-9', restMult: 0.65 },
  },
  athletic: {
    beginner:     { sets: 3, repsT1: '6-8',   repsT2: '8-12',  repsT3: '12-15', rpe: '6-8', restMult: 1.2 },
    intermediate: { sets: 4, repsT1: '4-6',   repsT2: '6-10',  repsT3: '10-15', rpe: '7-9', restMult: 1.0 },
    advanced:     { sets: 4, repsT1: '3-5',   repsT2: '5-8',   repsT3: '8-12',  rpe: '8-9', restMult: 0.9 },
  },
  fitness: {
    beginner:     { sets: 3, repsT1: '10-12', repsT2: '12-15', repsT3: '15-20', rpe: '5-7', restMult: 1.0 },
    intermediate: { sets: 3, repsT1: '8-12',  repsT2: '10-15', repsT3: '12-20', rpe: '6-8', restMult: 0.9 },
    advanced:     { sets: 4, repsT1: '8-10',  repsT2: '10-12', repsT3: '12-15', rpe: '7-8', restMult: 0.8 },
  },
};

// ─── Day structure templates ──────────────────────────────────────────────
const DAY_TEMPLATES = {
  3: {
    hypertrophy: ['Full Body A', 'Full Body B', 'Full Body C'],
    fat_loss:    ['Full Body A', 'Full Body B', 'Full Body C'],
    fitness:     ['Full Body A', 'Full Body B', 'Full Body C'],
    strength:    ['Kuvvet A', 'Kuvvet B', 'Kuvvet C'],
    athletic:    ['Güç+Üst', 'Kardiyovasküler+Kor', 'Güç+Alt'],
  },
  4: {
    hypertrophy: ['Üst A', 'Alt A', 'Üst B', 'Alt B'],
    strength:    ['Üst Kuvvet', 'Alt Kuvvet', 'Üst Hacim', 'Alt Hacim'],
    fat_loss:    ['Üst Devre', 'Alt Devre', 'Full Body', 'Kardiyovasküler+Kor'],
    athletic:    ['Push+Kor', 'Pull+Kardiyovasküler', 'Alt Kuvvet', 'Full Body'],
    fitness:     ['Push+Kor', 'Pull+Kardiyovasküler', 'Alt Kuvvet', 'Full Body'],
  },
  5: {
    hypertrophy: ['Push', 'Pull', 'Bacak', 'Üst Hacim', 'Bacak Hacim'],
    strength:    ['Üst Kuvvet A', 'Alt Kuvvet A', 'Üst Hacim', 'Alt Hacim', 'Full Body'],
    fat_loss:    ['Push Devre', 'Pull Devre', 'Alt Devre', 'Kardiyovasküler+Kor', 'Full Body'],
    fitness:     ['Push Devre', 'Pull Devre', 'Alt Devre', 'Kardiyovasküler+Kor', 'Full Body'],
    athletic:    ['Patlayıcı Üst', 'Alt Kuvvet', 'Aerobik Baz', 'İş Kapasitesi', 'Full Body'],
  },
  6: {
    hypertrophy: ['Push A', 'Pull A', 'Bacak A', 'Push B', 'Pull B', 'Bacak B'],
    strength:    ['Üst A', 'Alt A', 'Patlayıcı+Fonksiyonel', 'Üst B', 'Alt B', 'Aktif Dinlenme'],
    athletic:    ['Üst A', 'Alt A', 'Patlayıcı+Fonksiyonel', 'Üst B', 'Alt B', 'Aktif Dinlenme'],
    fat_loss:    ['Push', 'Pull', 'Alt', 'Kardiyovasküler', 'Full Body', 'Aktif Dinlenme'],
    fitness:     ['Push', 'Pull', 'Alt', 'Kardiyovasküler', 'Full Body', 'Aktif Dinlenme'],
  },
};

// ─── Day content: which muscle slots go in each day type ─────────────────
// Each slot: [muscle, preferredTier, fallbackTier?]
const DAY_CONTENT = {
  'Full Body A': [
    { muscle: 'Göğüs', tier: 'T1' },
    { muscle: 'Sırt', tier: 'T1' },
    { muscle: 'Kuadriseps', tier: 'T1' },
    { muscle: 'Omuz', tier: 'T2' },
    { muscle: 'Kor', tier: 'T3' },
  ],
  'Full Body B': [
    { muscle: 'Sırt', tier: 'T1' },
    { muscle: 'Göğüs', tier: 'T2' },
    { muscle: 'Hamstring', tier: 'T1' },
    { muscle: 'Kalça', tier: 'T2' },
    { muscle: 'Biseps', tier: 'T3' },
    { muscle: 'Kor', tier: 'T3' },
  ],
  'Full Body C': [
    { muscle: 'Kuadriseps', tier: 'T1' },
    { muscle: 'Göğüs', tier: 'T2' },
    { muscle: 'Sırt', tier: 'T2' },
    { muscle: 'Triseps', tier: 'T3' },
    { muscle: 'Biseps', tier: 'T3' },
  ],
  'Kuvvet A': [
    { muscle: 'Göğüs', tier: 'T1' },
    { muscle: 'Sırt', tier: 'T1' },
    { muscle: 'Omuz', tier: 'T2' },
    { muscle: 'Triseps', tier: 'T3' },
  ],
  'Kuvvet B': [
    { muscle: 'Kuadriseps', tier: 'T1' },
    { muscle: 'Hamstring', tier: 'T1' },
    { muscle: 'Kalça', tier: 'T2' },
    { muscle: 'Kor', tier: 'T3' },
  ],
  'Kuvvet C': [
    { muscle: 'Göğüs', tier: 'T1' },
    { muscle: 'Sırt', tier: 'T1' },
    { muscle: 'Kuadriseps', tier: 'T2' },
    { muscle: 'Biseps', tier: 'T3' },
    { muscle: 'Triseps', tier: 'T3' },
  ],
  'Güç+Üst': [
    { muscle: 'Göğüs', tier: 'T1' },
    { muscle: 'Sırt', tier: 'T1' },
    { muscle: 'Omuz', tier: 'T2' },
    { muscle: 'Triseps', tier: 'T3' },
    { muscle: 'Biseps', tier: 'T3' },
  ],
  'Güç+Alt': [
    { muscle: 'Kuadriseps', tier: 'T1' },
    { muscle: 'Hamstring', tier: 'T1' },
    { muscle: 'Kalça', tier: 'T2' },
    { muscle: 'Kor', tier: 'T3' },
  ],
  'Push': [
    { muscle: 'Göğüs', tier: 'T1' },
    { muscle: 'Omuz', tier: 'T2' },
    { muscle: 'Triseps', tier: 'T3' },
    { muscle: 'Triseps', tier: 'T3' },
  ],
  'Pull': [
    { muscle: 'Sırt', tier: 'T1' },
    { muscle: 'Sırt', tier: 'T2' },
    { muscle: 'Biseps', tier: 'T2' },
    { muscle: 'Arka Delt', tier: 'T3' },
  ],
  'Bacak': [
    { muscle: 'Kuadriseps', tier: 'T1' },
    { muscle: 'Hamstring', tier: 'T1' },
    { muscle: 'Kalça', tier: 'T2' },
    { muscle: 'Baldır', tier: 'T3' },
    { muscle: 'Kor', tier: 'T3' },
  ],
  'Üst': [
    { muscle: 'Göğüs', tier: 'T1' },
    { muscle: 'Sırt', tier: 'T1' },
    { muscle: 'Omuz', tier: 'T2' },
    { muscle: 'Biseps', tier: 'T3' },
    { muscle: 'Triseps', tier: 'T3' },
  ],
  'Alt': [
    { muscle: 'Kuadriseps', tier: 'T1' },
    { muscle: 'Hamstring', tier: 'T1' },
    { muscle: 'Kalça', tier: 'T2' },
    { muscle: 'Kor', tier: 'T3' },
  ],
  'Üst A': [
    { muscle: 'Göğüs', tier: 'T1' },
    { muscle: 'Sırt', tier: 'T1' },
    { muscle: 'Omuz', tier: 'T2' },
    { muscle: 'Biseps', tier: 'T3' },
    { muscle: 'Triseps', tier: 'T3' },
  ],
  'Alt A': [
    { muscle: 'Kuadriseps', tier: 'T1' },
    { muscle: 'Hamstring', tier: 'T1' },
    { muscle: 'Kalça', tier: 'T2' },
    { muscle: 'Kor', tier: 'T3' },
  ],
  'Üst B': [
    { muscle: 'Göğüs', tier: 'T2' },
    { muscle: 'Sırt', tier: 'T2' },
    { muscle: 'Omuz', tier: 'T2' },
    { muscle: 'Biseps', tier: 'T3' },
    { muscle: 'Triseps', tier: 'T3' },
  ],
  'Alt B': [
    { muscle: 'Kuadriseps', tier: 'T2' },
    { muscle: 'Hamstring', tier: 'T1' },
    { muscle: 'Kalça', tier: 'T2' },
    { muscle: 'Kor', tier: 'T3' },
  ],
  'Üst Kuvvet': [
    { muscle: 'Göğüs', tier: 'T1' },
    { muscle: 'Sırt', tier: 'T1' },
    { muscle: 'Omuz', tier: 'T1' },
    { muscle: 'Triseps', tier: 'T3' },
  ],
  'Alt Kuvvet': [
    { muscle: 'Kuadriseps', tier: 'T1' },
    { muscle: 'Hamstring', tier: 'T1' },
    { muscle: 'Kalça', tier: 'T2' },
    { muscle: 'Kor', tier: 'T3' },
  ],
  'Üst Hacim': [
    { muscle: 'Göğüs', tier: 'T2' },
    { muscle: 'Sırt', tier: 'T2' },
    { muscle: 'Omuz', tier: 'T2' },
    { muscle: 'Biseps', tier: 'T3' },
    { muscle: 'Triseps', tier: 'T3' },
  ],
  'Alt Hacim': [
    { muscle: 'Kuadriseps', tier: 'T2' },
    { muscle: 'Hamstring', tier: 'T1' },
    { muscle: 'Kalça', tier: 'T2' },
    { muscle: 'Baldır', tier: 'T3' },
    { muscle: 'Kor', tier: 'T3' },
  ],
  'Üst Devre': [
    { muscle: 'Göğüs', tier: 'T1' },
    { muscle: 'Sırt', tier: 'T1' },
    { muscle: 'Omuz', tier: 'T2' },
    { muscle: 'Triseps', tier: 'T3' },
    { muscle: 'Biseps', tier: 'T3' },
  ],
  'Alt Devre': [
    { muscle: 'Kuadriseps', tier: 'T1' },
    { muscle: 'Hamstring', tier: 'T1' },
    { muscle: 'Kalça', tier: 'T2' },
    { muscle: 'Baldır', tier: 'T3' },
    { muscle: 'Kor', tier: 'T3' },
  ],
  'Push+Kor': [
    { muscle: 'Göğüs', tier: 'T1' },
    { muscle: 'Omuz', tier: 'T2' },
    { muscle: 'Triseps', tier: 'T3' },
    { muscle: 'Kor', tier: 'T3' },
  ],
  'Pull+Kardiyovasküler': [
    { muscle: 'Sırt', tier: 'T1' },
    { muscle: 'Sırt', tier: 'T2' },
    { muscle: 'Biseps', tier: 'T3' },
    { muscle: 'Kardiyovasküler', tier: 'T3' },
  ],
  'Full Body': [
    { muscle: 'Göğüs', tier: 'T1' },
    { muscle: 'Sırt', tier: 'T1' },
    { muscle: 'Kuadriseps', tier: 'T2' },
    { muscle: 'Omuz', tier: 'T2' },
    { muscle: 'Kor', tier: 'T3' },
  ],
  'Kardiyovasküler+Kor': [
    { muscle: 'Kardiyovasküler', tier: 'T3' },
    { muscle: 'Kardiyovasküler', tier: 'T3' },
    { muscle: 'Kor', tier: 'T3' },
    { muscle: 'Kor', tier: 'T3' },
    { muscle: 'Kor', tier: 'T3' },
  ],
  'Push A': [
    { muscle: 'Göğüs', tier: 'T1' },
    { muscle: 'Omuz', tier: 'T1' },
    { muscle: 'Triseps', tier: 'T2' },
    { muscle: 'Triseps', tier: 'T3' },
    { muscle: 'Lat.Delt', tier: 'T3' },
  ],
  'Pull A': [
    { muscle: 'Sırt', tier: 'T1' },
    { muscle: 'Sırt', tier: 'T2' },
    { muscle: 'Biseps', tier: 'T2' },
    { muscle: 'Arka Delt', tier: 'T3' },
  ],
  'Bacak A': [
    { muscle: 'Kuadriseps', tier: 'T1' },
    { muscle: 'Hamstring', tier: 'T1' },
    { muscle: 'Kalça', tier: 'T2' },
    { muscle: 'Baldır', tier: 'T3' },
    { muscle: 'Kor', tier: 'T3' },
  ],
  'Push B': [
    { muscle: 'Göğüs', tier: 'T2' },
    { muscle: 'Omuz', tier: 'T2' },
    { muscle: 'Göğüs', tier: 'T3' },
    { muscle: 'Triseps', tier: 'T3' },
  ],
  'Pull B': [
    { muscle: 'Sırt', tier: 'T1' },
    { muscle: 'Sırt', tier: 'T2' },
    { muscle: 'Biseps', tier: 'T3' },
    { muscle: 'Arka Delt', tier: 'T3' },
  ],
  'Bacak B': [
    { muscle: 'Kuadriseps', tier: 'T2' },
    { muscle: 'Hamstring', tier: 'T1' },
    { muscle: 'Kalça', tier: 'T2' },
    { muscle: 'Baldır', tier: 'T3' },
    { muscle: 'Kor', tier: 'T3' },
  ],
  'Üst Kuvvet A': [
    { muscle: 'Göğüs', tier: 'T1' },
    { muscle: 'Sırt', tier: 'T1' },
    { muscle: 'Omuz', tier: 'T1' },
    { muscle: 'Triseps', tier: 'T3' },
  ],
  'Alt Kuvvet A': [
    { muscle: 'Kuadriseps', tier: 'T1' },
    { muscle: 'Hamstring', tier: 'T1' },
    { muscle: 'Kalça', tier: 'T2' },
    { muscle: 'Kor', tier: 'T3' },
  ],
  'Push Devre': [
    { muscle: 'Göğüs', tier: 'T1' },
    { muscle: 'Omuz', tier: 'T2' },
    { muscle: 'Triseps', tier: 'T3' },
    { muscle: 'Kor', tier: 'T3' },
  ],
  'Pull Devre': [
    { muscle: 'Sırt', tier: 'T1' },
    { muscle: 'Sırt', tier: 'T2' },
    { muscle: 'Biseps', tier: 'T3' },
    { muscle: 'Arka Delt', tier: 'T3' },
  ],
  'Alt Devre': [
    { muscle: 'Kuadriseps', tier: 'T1' },
    { muscle: 'Hamstring', tier: 'T1' },
    { muscle: 'Kalça', tier: 'T2' },
    { muscle: 'Kor', tier: 'T3' },
  ],
  'Patlayıcı Üst': [
    { muscle: 'Göğüs', tier: 'T1' },
    { muscle: 'Sırt', tier: 'T1' },
    { muscle: 'Omuz', tier: 'T2' },
    { muscle: 'Triseps', tier: 'T3' },
    { muscle: 'Biseps', tier: 'T3' },
  ],
  'Aerobik Baz': [
    { muscle: 'Kardiyovasküler', tier: 'T3' },
    { muscle: 'Kardiyovasküler', tier: 'T3' },
    { muscle: 'Kor', tier: 'T3' },
    { muscle: 'Kor', tier: 'T3' },
  ],
  'İş Kapasitesi': [
    { muscle: 'Kuadriseps', tier: 'T2' },
    { muscle: 'Göğüs', tier: 'T2' },
    { muscle: 'Sırt', tier: 'T2' },
    { muscle: 'Kardiyovasküler', tier: 'T3' },
    { muscle: 'Kor', tier: 'T3' },
  ],
  'Patlayıcı+Fonksiyonel': [
    { muscle: 'Kuadriseps', tier: 'T1' },
    { muscle: 'Göğüs', tier: 'T2' },
    { muscle: 'Sırt', tier: 'T2' },
    { muscle: 'Kor', tier: 'T3' },
    { muscle: 'Kardiyovasküler', tier: 'T3' },
  ],
  'Aktif Dinlenme': [
    { muscle: 'Kardiyovasküler', tier: 'T3' },
    { muscle: 'Kor', tier: 'T3' },
    { muscle: 'Kor', tier: 'T3' },
  ],
  'Kardiyovasküler': [
    { muscle: 'Kardiyovasküler', tier: 'T3' },
    { muscle: 'Kardiyovasküler', tier: 'T3' },
    { muscle: 'Kor', tier: 'T3' },
    { muscle: 'Kor', tier: 'T3' },
  ],
};

// ─── Day subtitles ─────────────────────────────────────────────────────────
const DAY_SUBTITLES = {
  'Full Body A': 'Göğüs + Sırt + Bacak + Omuz',
  'Full Body B': 'Sırt + Hamstring + Kalça + Kol',
  'Full Body C': 'Kuadriseps + Göğüs + Sırt + Kol',
  'Kuvvet A': 'Göğüs + Sırt + Omuz',
  'Kuvvet B': 'Bacak + Kalça + Kor',
  'Kuvvet C': 'Full Body Kuvvet',
  'Güç+Üst': 'Patlayıcı Üst Vücut',
  'Güç+Alt': 'Patlayıcı Alt Vücut',
  'Push': 'Göğüs + Omuz + Triseps',
  'Pull': 'Sırt + Biseps + Arka Delt',
  'Bacak': 'Kuadriseps + Hamstring + Kalça',
  'Üst': 'Göğüs + Sırt + Omuz + Kol',
  'Alt': 'Kuadriseps + Hamstring + Kalça + Kor',
  'Üst A': 'Ağır Üst Vücut',
  'Alt A': 'Ağır Alt Vücut',
  'Üst B': 'Hacim Üst Vücut',
  'Alt B': 'Hacim Alt Vücut',
  'Üst Kuvvet': 'Üst Kuvvet Günü',
  'Alt Kuvvet': 'Alt Kuvvet Günü',
  'Üst Hacim': 'Üst Hacim Günü',
  'Alt Hacim': 'Alt Hacim Günü',
  'Üst Devre': 'Üst Yoğunluk Devresi',
  'Alt Devre': 'Alt Yoğunluk Devresi',
  'Push+Kor': 'Göğüs + Omuz + Kor',
  'Pull+Kardiyovasküler': 'Sırt + Kol + Kardiyo',
  'Full Body': 'Tüm Vücut Günü',
  'Kardiyovasküler+Kor': 'Kardiyo + Kor Çalışması',
  'Push A': 'İtme A — Ağır',
  'Pull A': 'Çekme A — Ağır',
  'Bacak A': 'Bacak A — Ağır',
  'Push B': 'İtme B — Hacim',
  'Pull B': 'Çekme B — Hacim',
  'Bacak B': 'Bacak B — Hacim',
  'Üst Kuvvet A': 'Üst Kuvvet A',
  'Alt Kuvvet A': 'Alt Kuvvet A',
  'Push Devre': 'İtme Yoğunluk',
  'Pull Devre': 'Çekme Yoğunluk',
  'Alt Devre': 'Alt Yoğunluk',
  'Patlayıcı Üst': 'Patlayıcı Üst Vücut',
  'Aerobik Baz': 'Aerobik Baz + Kor',
  'İş Kapasitesi': 'İş Kapasitesi Günü',
  'Patlayıcı+Fonksiyonel': 'Patlayıcı + Fonksiyonel',
  'Aktif Dinlenme': 'Hafif Kardiyo + Esneklik',
  'Kardiyovasküler': 'Kardiyo + Kor',
  'Bacak Hacim': 'Bacak Hacim Günü',
};

// ─── Day emojis ────────────────────────────────────────────────────────────
const DAY_EMOJIS = {
  'Push': '🔴', 'Push A': '🔴', 'Push B': '🔴', 'Push Devre': '🔴', 'Push+Kor': '🔴',
  'Pull': '🔵', 'Pull A': '🔵', 'Pull B': '🔵', 'Pull Devre': '🔵', 'Pull+Kardiyovasküler': '🔵',
  'Bacak': '🟢', 'Bacak A': '🟢', 'Bacak B': '🟢', 'Bacak Hacim': '🟢',
  'Alt': '🟢', 'Alt A': '🟢', 'Alt B': '🟢', 'Alt Devre': '🟢',
  'Alt Kuvvet': '🟢', 'Alt Kuvvet A': '🟢', 'Alt Hacim': '🟢',
  'Üst': '🟠', 'Üst A': '🟠', 'Üst B': '🟠',
  'Üst Kuvvet': '🟠', 'Üst Kuvvet A': '🟠', 'Üst Hacim': '🟠', 'Üst Devre': '🟠',
  'Full Body': '⚪', 'Full Body A': '⚪', 'Full Body B': '⚪', 'Full Body C': '⚪',
  'Kardiyovasküler': '🩵', 'Kardiyovasküler+Kor': '🩵', 'Aerobik Baz': '🩵',
  'Aktif Dinlenme': '🧘', 'Patlayıcı+Fonksiyonel': '🟡',
  'Kuvvet A': '🔴', 'Kuvvet B': '🟢', 'Kuvvet C': '🟠',
  'Güç+Üst': '🟠', 'Güç+Alt': '🟢',
  'Patlayıcı Üst': '🔴', 'İş Kapasitesi': '🟡',
};

// ─── Progression rule by experience ────────────────────────────────────────
const PROGRESSION_RULE = {
  beginner: {
    type: 'linear_progression',
    params: { incrementKg: 2.5, sessionsBeforeIncrease: 1 },
  },
  intermediate: {
    type: 'double_progression',
    params: { repRangeMin: 8, repRangeMax: 12, incrementKg: 2.5 },
  },
  advanced: {
    type: 'rpe_autoregulate',
    params: { targetRpe: 8, adjustmentKg: 2.5 },
  },
};

// ─── Equipment fallback chain ───────────────────────────────────────────────
// full_gym can use full_gym + minimal + bodyweight
// minimal can use minimal + bodyweight
// bodyweight can only use bodyweight
function equipmentAllowed(exerciseEquipment, profileEquipment) {
  if (profileEquipment === 'full_gym') return true;
  if (profileEquipment === 'minimal') return exerciseEquipment === 'minimal' || exerciseEquipment === 'bodyweight';
  return exerciseEquipment === 'bodyweight';
}

// ─── Pick one exercise for a muscle + tier slot ─────────────────────────────
const usedIds = new Set();

function pickExercise(muscle, tier, goal, experience, equipment, usedInDay) {
  const pool = EXERCISE_POOL.filter((ex) => {
    if (ex.muscle !== muscle) return false;
    if (ex.tier !== tier) return false;
    if (!ex.goals.includes(goal)) return false;
    if (!ex.levels.includes(experience)) return false;
    if (!equipmentAllowed(ex.equipment, equipment)) return false;
    if (usedInDay.has(ex.id)) return false;
    return true;
  });

  if (pool.length === 0) {
    // Fallback 1: relax goal filter
    const relaxGoal = EXERCISE_POOL.filter((ex) => {
      if (ex.muscle !== muscle) return false;
      if (ex.tier !== tier) return false;
      if (!ex.levels.includes(experience)) return false;
      if (!equipmentAllowed(ex.equipment, equipment)) return false;
      if (usedInDay.has(ex.id)) return false;
      return true;
    });
    if (relaxGoal.length > 0) return relaxGoal[0];

    // Fallback 2: relax tier to adjacent
    const adjacentTier = tier === 'T1' ? 'T2' : tier === 'T3' ? 'T2' : 'T2';
    const relaxTier = EXERCISE_POOL.filter((ex) => {
      if (ex.muscle !== muscle) return false;
      if (ex.tier !== adjacentTier) return false;
      if (!equipmentAllowed(ex.equipment, equipment)) return false;
      if (usedInDay.has(ex.id)) return false;
      return true;
    });
    if (relaxTier.length > 0) return relaxTier[0];

    return null;
  }

  // Rotate through pool to avoid same exercise every session
  // Prefer exercises not globally used yet
  const fresh = pool.filter((ex) => !usedIds.has(ex.id));
  return fresh.length > 0 ? fresh[0] : pool[0];
}

// ─── Apply PARAMS to a raw exercise ────────────────────────────────────────
function applyParams(exercise, params) {
  if (!exercise) return null;
  const tierReps =
    exercise.tier === 'T1' ? params.repsT1 :
    exercise.tier === 'T2' ? params.repsT2 :
    params.repsT3;

  return {
    ...exercise,
    sets: params.sets,
    reps: tierReps,
    rpe: params.rpe,
    rest: Math.round((exercise.rest || 90) * params.restMult),
  };
}

// ─── Build exercises for a single day ──────────────────────────────────────
function buildDayExercises(dayName, goal, experience, equipment, params, dayIdx, maxExOverride) {
  const slots = DAY_CONTENT[dayName] || DAY_CONTENT['Full Body A'];
  const experienceMax = experience === 'beginner' ? 4 : 6;
  const maxEx = maxExOverride != null ? Math.min(maxExOverride, experienceMax) : experienceMax;
  const limitedSlots = slots.slice(0, maxEx);

  const usedInDay = new Set();
  const exercises = [];

  limitedSlots.forEach((slot, eIdx) => {
    const raw = pickExercise(slot.muscle, slot.tier, goal, experience, equipment, usedInDay);
    if (!raw) return;

    usedInDay.add(raw.id);
    usedIds.add(raw.id);

    const applied = applyParams(raw, params);
    exercises.push({
      id: `px_${dayIdx}_${eIdx}`,
      name: applied.name,
      muscle: applied.muscle,
      tier: applied.tier,
      sets: applied.sets,
      reps: applied.reps,
      rpe: applied.rpe,
      rest: applied.rest,
      tempo: applied.tempo,
      progressionRule: PROGRESSION_RULE[experience],
    });
  });

  return exercises;
}

// ─── Main generator ────────────────────────────────────────────────────────
export function generateProgram(profile) {
  const { goal, experience, days, equipment, sessionDuration, gender, name } = profile;

  // Reset used IDs for this generation
  usedIds.clear();

  const meta = GOAL_META[goal] || GOAL_META.fitness;
  const params = (PARAMS[goal] || PARAMS.fitness)[experience] || PARAMS.fitness.intermediate;
  const progressionType = PROGRESSION_RULE[experience]?.type || 'double_progression';

  // Max exercises per day based on session duration
  const durationMaxMap = { short: 4, medium: 5, long: 7 };
  const durationMax = sessionDuration ? (durationMaxMap[sessionDuration] ?? 5) : null;

  // Resolve day names
  const templates = DAY_TEMPLATES[days] || DAY_TEMPLATES[4];
  const dayNames = templates[goal] || templates[Object.keys(templates)[0]];

  // Build program object
  const program = {};
  dayNames.forEach((dayName, dayIdx) => {
    const exercises = buildDayExercises(dayName, goal, experience, equipment, params, dayIdx, durationMax);
    program[dayName] = {
      color: meta.color,
      emoji: DAY_EMOJIS[dayName] || meta.emoji,
      subtitle: DAY_SUBTITLES[dayName] || dayName,
      exercises,
    };
  });

  // Mesocycle phases
  const durationWeeks = experience === 'beginner' ? 8 : 12;
  const midpoint = Math.floor(durationWeeks / 2);
  const phases = [
    {
      name: 'Temel Faz',
      weeks: Array.from({ length: midpoint }, (_, i) => i + 1),
      rpeTarget: params.rpe,
    },
    {
      name: 'İlerleme Fazı',
      weeks: Array.from({ length: durationWeeks - midpoint - 1 }, (_, i) => i + midpoint + 1),
      rpeTarget: params.rpe,
    },
    {
      name: 'Deload',
      weeks: [durationWeeks],
      volumeMultiplier: 0.6,
      rpeTarget: '5-6',
    },
  ];

  const programName = name ? `${name}'in Programı` : 'Kişisel Program';
  const id = `personal_${Date.now()}`;

  return {
    id,
    name: programName,
    emoji: meta.emoji,
    color: meta.color,
    subtitle: `${meta.label} · ${days} Gün/Hafta`,
    isCustom: true,
    isPersonal: true,
    profile: { goal, experience, days, equipment, sessionDuration: sessionDuration || 'medium', gender: gender || null },
    mesocycle: {
      durationWeeks,
      goal,
      phases,
    },
    days: dayNames,
    program,
    volumeLandmarks: {},
    createdAt: Date.now(),
  };
}

export default generateProgram;
