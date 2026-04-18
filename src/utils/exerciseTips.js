// exerciseTips.js — Form tips for exercises in Turkish

const EXERCISE_TIPS = {
  'Barbell Bench Press': [
    'Sirtini duz tut, omuzlari geriye dogru kaysin',
    'Dirseklerin 45 derecelik aciyla govdeye yakin kalsin',
    'Agriligı gogse degil, gogsun alt kismina indir',
    'Yukari cikarken nefes ver, indirirken nefes al',
  ],
  'Dumbbell Bench Press': [
    'Daha genis hareket acisi icin dirseklerini biraz ac',
    'Hareketin tepesinde dambillari birbirine yaklastir',
    'Omuzlarin yataga yaslanip sikı kalmasini sagla',
    'Kontrollu bir sekilde indir ve yukselt',
  ],
  'Incline Bench Press': [
    'Bench acisi 30-45 derece arasi olsun, daha fazla omuzu yorar',
    'Ust gogs kaslarini hedeflemek icin tam yukari cikmadan dur',
    'Sirtin benche tam temas etsin',
  ],
  'Chest Fly': [
    'Kol acisini hafif bukul tut, dirsek tam acilmasin',
    'Hareketin dibinde kasilma hissini hisset',
    'Agrilik cok yuksek olmasin, form onemlidir',
    'Kontrollu indirme, patlayici yukseltme',
  ],
  'Push-up': [
    'Vucut tek bir duz cizgi olustursun',
    'Eller omuz genisliginden biraz daha acik',
    'Dirsekler 45 derece aciyla govdeye yakin',
    'Gogs yere deyene kadar indir',
  ],
  'Cable Fly': [
    'Kollar hafif bukul, sabit acida kalsin',
    'Iki eli onunde birlestirirken ust gogsu sik',
    'Hareketin tepesinde 1-2 saniye tut',
    'Agrilik indirirken esnemeyi hisset',
  ],
  'Dip': [
    'Vucut hafif one egik olsun, alt gogs kaslarini hedefle',
    'Dirsekler yanlara acilmasin, govdeye yakin',
    'Tam yukari cikmadan dur, triseps kasilmasini hisset',
    'Omuzlarin yukselmemesine dikkat et',
  ],
  'Squat': [
    'Ayaklar omuz genisliginden biraz daha acik',
    'Kalcayi geriye dogru it, sandalyeye oturuyormus gibi',
    'Dizlerin ayak parmaklariyla ayni dogultuda olsun',
    'Sirt duz, gogus acik ve bas onde',
  ],
  'Leg Press': [
    'Ayaklar platformun ortasinda, omuz genisliginde',
    'Kilitlenmeden once dur, dizleri zorlama',
    'Hareketin tepesinde bacaklarini duzeltme',
    'Kalcanin benchten kalkmamasina dikkat et',
  ],
  'Lunge': [
    'One adim atarken diz ayak bileginin onune gecmesin',
    'Arka bacak dizine yakin ancak yere degmesin',
    'Vucut dik kalsin, one egilme',
    'Hem onden hem arkadan esit guc kullan',
  ],
  'Romanian Deadlift': [
    'Dizler hafif bukul, sabit kalsin',
    'Agrilik bacaklara yakin kalsin',
    'Belini yuvarlatma, sirt duz kalsin',
    'Hamstring kasilmasini hissederek yukari gel',
  ],
  'Leg Curl': [
    'Hareketin tepesinde kasilma hissini hisset',
    'Kontrollu bir sekilde indir',
    'Kalcanin makineden kalkmamasina dikkat et',
    'Nefes alarak yukselt, vererek indir',
  ],
  'Calf Raise': [
    'Tam yukariya cik, kasilma hissini hisset',
    'Hareketin dibinde 1-2 saniye tut',
    'Agrilik indirirken tam esnemeyi hisset',
    'Hareketin her asamasinda kontrollu ol',
  ],
  'Seated Calf Raise': [
    'Dizlerin tam yukariya cikmadan kilitlenmemesine dikkat et',
    'Bileklerin tam hareket acisini kullansin',
    'Kontrollu indirme, patlayici yukseltme',
  ],
  'Deadlift': [
    'Ayaklar omuz genisliginde, agriligin ortasinda',
    'Sirt duz, omuzlar geriye kaymis',
    'Kalkarken kalcayi once it, sonra sirti',
    'Agriliki bacaklarina yakin tut',
  ],
  'Barbell Row': [
    'Sirt 45 derece acida, duz kalsin',
    'Kollar tam yukariya ciktiginda sirti sik',
    'Hareketin tepesinde 1 saniye tut',
    'Omuzlarin yukselmemesine dikkat et',
  ],
  'Pull-up': [
    'Genis kavrama daha cok arka sirti hedefler',
    'Cene barin uzerine ciksin',
    'Dirsekler asagi indirilirken tam acilsin',
    'Kontrollu indirme, patlayici yukseltme',
  ],
  'Lat Pulldown': [
    'Bar gogsun ustune, ust kismina degil',
    'Hareketin tepesinde sirti sik',
    'Dirsekler yanlara dogru, govdeye yakin',
    'Agriliki yavasca birak, momentum kullanma',
  ],
  'Dumbbell Row': [
    'Destekleyici el dizin uzerine, destek tarafinin ayagi bir adim one',
    'Sirt duz kalsin, asagi egilme',
    'Tam yukariya ciktiginda kurek kemigini sik',
  ],
  'Seated Cable Row': [
    'Sirt dik kalsin, sandalyeye yaslan',
    'Hareketin tepesinde sirti sik',
    'Dirsekler govdeye yakin kalsin',
    'Kontrollu hareket, momentum yok',
  ],
  'Face Pull': [
    'Hafif ustten tutus, eller yukarı bakmali',
    'Hareketin tepesinde arka deltayi sik',
    'Dirsekler gogs seviyesine kadar yukari',
    'Kontrollu indirme',
  ],
  'Lateral Raise': [
    'Dirsekler hafif bukul, sabit acida kalsin',
    'Hareketin tepesinde 1-2 saniye tut',
    'Omuzlarin yukselmemesine dikkat et',
    'Hafif agrilik, tam form',
  ],
  'Overhead Press': [
    'Dirsekler 45 derece acida, govdeye yakin',
    'Agriliki basin ustune, degil de biraz arkaya',
    'Omuzlarin yukselmemesine dikkat et',
    'Gobek kaslarini sik, stabilize ol',
  ],
  'Arnold Press': [
    'Hareket basladiginda avuclar kendine bakar',
    'Yukari cikarken avuclar disa doner',
    'Tam yukariya cikmadan dur',
    'Hafif agrilik, tam kontrol',
  ],
  'Bicep Curl': [
    'Dirsekler govdeye sabitlensin',
    'Hareketin tepesinde bicepsi sik',
    'Agriligı yavasca indir, momentum yok',
    'Tam hareket acisini kullan',
  ],
  'Hammer Curl': [
    'Avuclar birbirine bakar, norl tutus',
    'Dirsekler sabit, govdeye yakin',
    'Hem brachialis hem bicepsi hedefler',
    'Kontrollu hareket',
  ],
  'Tricep Pushdown': [
    'Dirsekler govdeye sabit, yanlara acilmasin',
    'Hareketin tepesinde trisepsi sik',
    'Tam yukariya cikmadan dur',
    'Agriligı yavasca birak',
  ],
  'Skullcrusher': [
    'Dirsekler sabit, govdeye yakin',
    'Agriligı alnin uzerine degil, hafif arkasina indir',
    'Hareketin tepesinde trisepsi sik',
    'Hafif agrilik, tam form',
  ],
  'Overhead Tricep Extension': [
    'Dirsekler basin hizasinda, sabit kalsin',
    'Agrilik arkaya dogru indir, on kol uzasin',
    'Yukari cikarken tam uzanma',
    'Hafif agrilik, tam kontrol',
  ],
  'Plank': [
    'Vucut tek bir duz cizgi olustursun',
    'Karn kaslarini tamamen sik',
    'Kalcanin dussmemesine ve yukselmemesine dikkat et',
    'Nefes almayi unutma, ritmik nefes',
  ],
  'Russian Twist': [
    'Ayaklar yerde hafif yuksekte kalsin',
    'Elleri gogs onunde birlestir',
    'Hareket yavas ve kontrollu',
    'Beli yuvarlatma, sirt duz kalsin',
  ],
  'Hanging Leg Raise': [
    'Vucut sallanmasin, stabilize ol',
    'Bacaklari yukari cekerken belini yuvarlatma',
    'Hareketin tepesinde karn kaslarini sik',
    'Kontrollu indirme',
  ],
  'Crunch': [
    'Eller basinin arkasinda degil, gogs uzerinde',
    'Sadece ust sirtini yukselt, belini kaldirma',
    'Hareketin tepesinde karn kaslarini sik',
    'Nefes vererek yukselt, alarak indir',
  ],
  'Leg Raise': [
    'Eller kalcanin altinda, stabilize ol',
    'Bacaklari 90 dereceye kadar yukselt',
    'Asagi indirirken tam acilma, ama yere degmeme',
    'Karn kaslarini surekli sik',
  ],
};

export function getExerciseFormTips(exerciseName) {
  return EXERCISE_TIPS[exerciseName] || [
    'Formu korumaya ozen goster',
    'Uygun isinma yap',
    'Kendine uygun agriligi sec',
    'Kontrollu hareket yap',
  ];
}

export default EXERCISE_TIPS;