# Vercel Proje Konsolidasyon Planı

## 📋 Mevcut Durum Analizi

| Öğe | "vtaper-coach" | "spor-app" |
|-----|---------------|-------------|
| **Amaç** | Ana proje (muhtemel) | Eski/Alternatif |
| **GitHub** | Mert544/Spor-app | Aynı repo |
| **Branch** | main | claude/v-taper-* |
| **Son Deploy** | ? | ? |

---

## 🎯 Konsolidasyon Stratejisi

### Seçenek A: "vtaper-coach" Ana Proje Olsun

**Avantajları:**
- Daha kısa, akılda kalıcı isim
- Marka ile uyumlu
- Professional görünüm

**Yapılacaklar:**
1. Vercel "spor-app" projesini sil
2. "vtaper-coach" tüm deploy'ları alsın
3. GitHub branch'ini main'e birleştir

---

### Seçenek B: "spor-app" Ana Proje Olsun

**Avantajları:**
- Mevcut tüm development burada
- Commit geçmişi korunur
- Daha fazla feature hazır

**Yapılacaklar:**
1. Vercel "vtaper-coach" projesini sil
2. "spor-app" production olarak kalır
3. Branch'leri merge et

---

## 📝 Önerilen Eylem Planı

### ADIM 1: Mevcut Durumu Kontrol Et
1. [vercel.com/dashboard](https://vercel.com/dashboard) aç
2. İki projenin URL'lerini karşılaştır:
   - vtaper-coach.vercel.app
   - spor-app.vercel.app
3. Hangisinin daha güncel olduğunu tespit et

### ADIM 2: Ana Projeyi Belirle
**Önerilen:** "vtaper-coach" → daha professional

### ADIM 3: GitHub'ı Birleştir
```bash
# main branch'e tüm değişiklikleri merge et
git checkout main
git merge claude/v-taper-coach-setup-RNzzY
git push origin main
```

### ADIM 4: Vercel'i Temizle
1. Silinecek projeyi seç
2. Settings → Delete Project
3. Tek proje kalana kadar bekle

---

## ⚠️ Önemli Uyarılar

| Dikkat Edilecek | Açıklama |
|----------------|----------|
| Environment Variables | Her iki projede aynı olmalı |
| Domain Ayarları | Custom domain varsa kontrol et |
| Preview Deployments | Otomatik oluşanları koru |
| Build Settings | Aynı kalmalı |

---

## 🚀 Hemen Yapılacaklar

1. **Vercel Dashboard aç**
2. **İki projenin URL'lerini test et**
3. **Hangisinin çalıştığını kontrol et**
4. **Karar ver: A mı B mi?**

**Sonra söyle, konsolidasyonu birlikte yapalım.**