// exerciseTips.js — Form tips for exercises in Turkish

const EXERCISE_TIPS = {
  'Barbell Bench Press': [
    'Sırtını düz tut, omuzların geriye doğru kaysın',
    'Dirseklerin 45 derecelik açıyla gövdeye yakın kalsın',
    'Ağırlığı göğsüne değil, göğsünün alt kısmına indir',
    'Yukarı çıkarken nefes ver, indirirken nefes al',
  ],
  'Dumbbell Bench Press': [
    'Daha geniş hareket açısı için dirseklerini biraz aç',
    'Hareketin tepesinde dambılları birbirine yaklaştır',
    'Omuzların yatağa yaslanıp sıkı kalmasını sağla',
    'Kontrollü bir şekilde indir ve yükselt',
  ],
  'Incline Bench Press': [
    'Bench açısı 30-45 derece arası olsun, daha fazla omuzu yorar',
    'Üst göğüs kaslarını hedeflemek için tam yukarı çıkmadan dur',
    'Sırtın bench\'e tam temas etsin',
  ],
  'Chest Fly': [
    'Kol açısını hafif bükük tut, dirsek tam açılmasın',
    'Hareketin dibinde kasılma hissini hisset',
    'Ağırlık çok yüksek olmasın, form önemlidir',
    'Kontrollü indirme, patlayıcı yükseltme',
  ],
  'Push-up': [
    'Vücut tek bir düz çizgi oluştursun',
    'Eller omuz genişliğinden biraz daha açık',
    'Dirsekler 45 derece açıyla gövdeye yakın',
    'Göğüs yere değene kadar indir',
  ],
  'Cable Fly': [
    'Kollar hafif bükük, sabit açıda kalsın',
    'İki eli önünde birleştirirken üst göğsünü sık',
    'Hareketin tepesinde 1-2 saniye tut',
    'Ağırlık indirirken esnemeyi hisset',
  ],
  'Dip': [
    'Vücut hafif öne eğik olsun, alt göğüs kaslarını hedefle',
    'Dirsekler yanlara açılmasın, gövdeye yakın',
    'Tam yukarı çıkmadan dur, triseps kasılmasını hisset',
    'Omuzların yükselmemesine dikkat et',
  ],
  'Squat': [
    'Ayaklar omuz genişliğinden biraz daha açık',
    'Kalçayı geriye doğru it, sandalyeye oturuyorsun gibi',
    'Dizlerin ayak parmaklarıyla aynı doğrultuda olsun',
    'Sırt düz, göğüs açık ve baş önde',
  ],
  'Leg Press': [
    'Ayaklar platformun ortasında, omuz genişliğinde',
    'Kilitlenmeden önce dur, dizleri zorlama',
    'Hareketin tepesinde bacaklarını düzeltme',
    'Kalçanın bench\'ten kalkmamasına dikkat et',
  ],
  'Lunge': [
    'Öne adım atarken diz ayak bileğinin önüne geçmesin',
    'Arka bacak dizine yakın ancak yere değmesin',
    'Vücut dik kalsın, öne eğilme',
    'Hem önden hem arkadan eşit güç kullan',
  ],
  'Romanian Deadlift': [
    'Dizler hafif bükük, sabit kalsın',
    'Ağırlık bacaklara yakın kalsın',
    'Belini yuvarlatma, sırt düz kalsın',
    'Hamstring kasılmasını hissederek yukarı gel',
  ],
  'Leg Curl': [
    'Hareketin tepesinde kasılma hissini hisset',
    'Kontrollü bir şekilde indir',
    'Kalçanın makineden kalkmamasına dikkat et',
    'Nefes alarak yükselt, vererek indir',
  ],
  'Calf Raise': [
    'Tam yukarıya çık, kasılma hissini hisset',
    'Hareketin dibinde 1-2 saniye tut',
    'Ağırlık indirirken tam esnemeyi hisset',
    'Hareketin her aşamasında kontrollü ol',
  ],
  'Seated Calf Raise': [
    'Dizlerin tam yukarıya çıkmadan kilitlenmemesine dikkat et',
    'Bileklerin tam hareket açısını kullansın',
    'Kontrollü indirme, patlayıcı yükseltme',
  ],
  'Deadlift': [
    'Ayaklar omuz genişliğinde, ağırlığın ortasında',
    'Sırt düz, omuzlar geriye kaymış',
    'Kalkarken kalçayı önce it, sonra sırtı',
    'Ağırlığı bacaklarına yakın tut',
  ],
  'Barbell Row': [
    'Sırt 45 derece açıda, düz kalsın',
    'Kollar tam yukarıya çıktığında sırtı sık',
    'Hareketin tepesinde 1 saniye tut',
    'Omuzların yükselmemesine dikkat et',
  ],
  'Pull-up': [
    'Geniş kavrama daha çok arka sırtı hedefler',
    'Çene barın üzerine çıksın',
    'Dirsekler aşağı indirilirken tam açılsın',
    'Kontrollü indirme, patlayıcı yükseltme',
  ],
  'Lat Pulldown': [
    'Bar göğüsün üstüne, üst kısmına değil',
    'Hareketin tepesinde sırtı sık',
    'Dirsekler yanlara doğru, gövdeye yakın',
    'Ağırlığı yavaşça bırak, momentum kullanma',
  ],
  'Dumbbell Row': [
    'Destekleyici el dizin üzerine,
 destek tarafının ayağı bir adım öne',
    'Sırt düz kalsın, aşağı eğilme',
    'Tam yukarıya çıktığında kürek kemiğini sık',
  ],
  'Seated Cable Row': [
    'Sırt dik kalsın, sandalyeye yaslan',
    'Hareketin tepesinde sırtı sık',
    'Dirsekler gövdeye yakın kalsın',
    'Kontrollü hareket, momentum yok',
  ],
  'Face Pull': [
    'Hafif üstten tutuş, eller yukarı bakmalı',
    'Hareketin tepesinde arka deltayı sık',
    'Dirsekler göğüs seviyesine kadar yukarı',
    'Kontrollü indirme',
  ],
  'Lateral Raise': [
    'Dirsekler hafif bükük, sabit açıda kalsın',
    'Hareketin tepesinde 1-2 saniye tut',
    'Omuzların yükselmemesine dikkat et',
    'Hafif ağırlık, tam form',
  ],
  'Overhead Press': [
    'Dirsekler 45 derece açıda, gövdeye yakın',
    'Ağırlığı başın üstüne, değil de biraz arkaya',
    'Omuzların yükselmemesine dikkat et',
    'Göbek kaslarını sık, stabilize ol',
  ],
  'Arnold Press': [
    'Hareket başladığında avuçlar kendine bakar',
    'Yukarı çıkarken avuçlar dışa döner',
    'Tam yukarıya çıkmadan dur',
    'Hafif ağırlık, tam kontrol',
  ],
  'Bicep Curl': [
    'Dirsekler gövdeye sabitlensin',
    'Hareketin tepesinde biceps'ı sık',
    'Ağırlığı yavaşça indir, momentum yok',
    'Tam hareket açısını kullan',
  ],
  'Hammer Curl': [
    'Avuçlar birbirine bakar, nötr tutuş',
    'Dirsekler sabit, gövdeye yakın',
    'Hem brachialis hem biceps'ı hedefler',
    'Kontrollü hareket',
  ],
  'Tricep Pushdown': [
    'Dirsekler gövdeye sabit, yanlara açılmasın',
    'Hareketin tepesinde triseps'ı sık',
    'Tam yukarıya çıkmadan dur',
    'Ağırlığı yavaşça bırak',
  ],
  'Skullcrusher': [
    'Dirsekler sabit, gövdeye yakın',
    'Ağırlığı alnın üzerine değil, hafif arkasına indir',
    'Hareketin tepesinde triseps'ı sık',
    'Hafif ağırlık, tam form',
  ],
  'Overhead Tricep Extension': [
    'Dirsekler başın hizasında, sabit kalsın',
    'Ağırlığı arkaya doğru indir, ön kol uzasın',
    'Yukarı çıkarken tam uzanma',
    'Hafif ağırlık, tam kontrol',
  ],
  'Plank': [
    'Vücut tek bir düz çizgi oluştursun',
    'Karın kaslarını tamamen sık',
    'Kalçanın düşmemesine ve yükselmemesine dikkat et',
    'Nefes almayı unutma, ritmik nefes',
  ],
  'Russian Twist': [
    'Ayaklar yerde hafif yüksekte kalsın',
    'Elleri göğüs önünde birleştir',
    'Hareket yavaş ve kontrollü',
    'Beli yuvarlatma, sırt düz kalsın',
  ],
  'Hanging Leg Raise': [
    'Vücut sallanmasın, stabilize ol',
    'Bacakları yukarı çekerken belini yuvarlatma',
    'Hareketin tepesinde karın kaslarını sık',
    'Kontrollü indirme',
  ],
  'Crunch': [
    'Eller başının arkasında değil, göğüs üzerinde',
    'Sadece üst sırtını yükselt, belini kaldırma',
    'Hareketin tepesinde karın kaslarını sık',
    'Nefes vererek yükselt, alarak indir',
  ],
  'Leg Raise': [
    'Eller kalçanın altında, stabilize ol',
    'Bacakları 90 dereceye kadar yükselt',
    'Aşağı indirirken tam açılma, ama yere değmeme',
    'Karın kaslarını sürekli sık',
  ],
};

export function getExerciseFormTips(exerciseName) {
  return EXERCISE_TIPS[exerciseName] || [
    'Formu korumaya özen göster',
    'Uygun ısınma yap',
    'Kendine uygun ağırlığı seç',
    'Kontrollü hareket yap',
  ];
}

export default EXERCISE_TIPS;
