# V-Taper Coach — Agent Development Guide

Bu proje, **Apex Debug** ve **Apex Orchestrator** agent'lerini geliştirme sürecinde aktif olarak kullanır.

---

## 🧠 Apex Agent Entegrasyonu

### Kurulum

#### 1. apex-debug (Statik Analiz)

```bash
# Repoyu klonla (aynı dizin seviyesinde veya başka bir yerde)
cd ../apex-debug  # veya istediğiniz konum
pip install -e .

# V-Taper Coach içinde kontrol et
cd ../"SPOR UYGULAMA"
npm run audit
```

#### 2. Apex Orchestrator (Fraktal Kod İstihbaratı)

```bash
cd ../Apex-orchestrator  # veya istediğiniz konum
pip install -e ".[dev]"

# V-Taper Coach içinde kontrol et
cd ../"SPOR UYGULAMA"
npm run apex:scan
```

---

## 🚀 Kullanım

### Hızlı Komutlar

| Komut | Açıklama |
|-------|----------|
| `npm run audit` | Statik analiz çalıştır |
| `npm run audit:watch` | Dosya değişikliklerini izle ve otomatik analiz et |
| `npm run audit:fix` | Güvenli otomatik düzeltmeleri uygula |
| `npm run apex:scan` | Fraktal proje taraması yap |
| `npm run apex:deep` | Derinlemesine analiz + yama önerileri (supervised) |
| `npm run apex:verify` | Proje profili + test çalıştır |

### Detaylı Kullanım

#### apex-debug ile Güvenlik ve Kalite Denetimi

```bash
# Temel analiz
node scripts/apex-debug-audit.js

# Sadece değişen satırları analiz et (PR için)
node scripts/apex-debug-audit.js --diff

# SARIF formatında rapor al (GitHub Security tabı için)
node scripts/apex-debug-audit.js --output sarif

# İzleme modu
node scripts/apex-debug-audit.js --watch
```

#### Apex Orchestrator ile Fraktal Analiz

```bash
# Proje genel tarama
python scripts/apex-orchestrator-scan.py --plan=project_scan

# Belirli bir hedefe odaklan
python scripts/apex-orchestrator-scan.py --plan=focused_branch --goal="refactor auth flow"

# Otonom düzeltme önerileri (supervised = her adımda onay ister)
python scripts/apex-orchestrator-scan.py --plan=semantic_patch_loop --mode=supervised

# Fraktal 5-Whys analizi ile
python scripts/apex-orchestrator-scan.py --plan=project_scan --fractal --max-depth=5
```

---

## 🏗️ Mimari Entegrasyon

### CI/CD Pipeline'ları

Projede iki GitHub Actions workflow'u tanımlıdır:

#### `.github/workflows/apex-debug.yml`
- Her PR ve push'ta çalışır
- `src/` dizininde statik analiz yapar
- SARIF raporu üretir (GitHub Security tabına yüklenir)
- PR'larda otomatik yorum bırakır

#### `.github/workflows/apex-orchestrator.yml`
- Haftalık (Pazartesi 02:00) ve manuel tetikleme ile çalışır
- Fraktal kod istihbaratı üretir
- Markdown/JSON raporları artifact olarak kaydeder
- 3 mod destekler: `report` | `supervised` | `autonomous`

### Script Dosyaları

| Dosya | Dil | Amaç |
|-------|-----|------|
| `scripts/apex-debug-audit.js` | Node.js | apex-debug wrapper |
| `scripts/apex-orchestrator-scan.py` | Python | Apex Orchestrator wrapper |

### Environment Variables

| Değişken | Açıklama |
|----------|----------|
| `APEX_DEBUG_PATH` | apex-debug kurulum dizini |
| `APEX_ORCHESTRATOR_PATH` | Apex Orchestrator kurulum dizini |
| `APEX_USE_FRACTAL` | Fraktal analizi zorla (1 = aktif) |

---

## 🎯 Geliştirme Workflow'u

### Önerilen Akış

1. **Kod yaz** → `npm run dev` ile test et
2. **Statik analiz** → `npm run audit` ile kontrol et
3. **Build al** → `npm run build` ile üretim kontrolü
4. **Deep scan** → `npm run apex:deep` ile mimari analiz (haftalık)
5. **Commit & PR** → CI otomatik analiz çalıştırır
6. **Review** → Apex raporlarını incele

### Agent'leri IDE'de Kullanma

#### VS Code Görevleri (`.vscode/tasks.json`)

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "apex: audit",
      "type": "shell",
      "command": "npm run audit",
      "group": "test"
    },
    {
      "label": "apex: deep scan",
      "type": "shell",
      "command": "npm run apex:deep",
      "group": "test"
    }
  ]
}
```

---

## 📊 Raporlar ve Çıktılar

### apex-debug Çıktıları

- Terminal: Renkli tablo formatında bulgular
- `report.sarif`: GitHub Code Scanning uyumlu
- `report.md`: Markdown raporu
- `report.json`: JSON formatında ham veri

### Apex Orchestrator Çıktıları

- `.apex/fractal-report.md`: Fraktal analiz raporu
- `.apex/security-report.json`: Güvenlik bulguları
- `.apex/agent_learning.json`: Agent öğrenme verisi
- `.apex/telemetry.json`: Token kullanım telemetrisi

---

## 🛡️ Güvenlik Politikası

1. **AST-first**: apex-debug AST tabanlı analiz yapar, regex'e düşmez
2. **Zero API calls**: Her iki agent de offline çalışır, bulut gerektirmez
3. **Deterministic**: Aynı kod her zaman aynı sonucu verir
4. **Scope limits**: `src/` dışındaki dosyalara dokunulmaz
5. **Human review**: `supervised` modda her değişiklik onay ister

---

## 🔧 Sorun Giderme

### "apex-debug not found" hatası

```bash
# Çözüm 1: Ortam değişkeni ayarla
export APEX_DEBUG_PATH=/path/to/apex-debug

# Çözüm 2: Aynı dizin seviyesinde klonla
cd ..
git clone <apex-debug-repo-url>
cd "SPOR UYGULAMA"
npm run audit
```

### "Apex Orchestrator not found" hatası

```bash
# Çözüm 1: Ortam değişkeni ayarla
export APEX_ORCHESTRATOR_PATH=/path/to/Apex-orchestrator

# Çözüm 2: Python path'e ekle
export PYTHONPATH=/path/to/Apex-orchestrator:$PYTHONPATH
```

### Windows'ta Python script çalışmıyor

```powershell
# PowerShell'de
$env:APEX_DEBUG_PATH = "C:\path\to\apex-debug"
npm run audit
```

---

## 📚 Kaynaklar

- [apex-debug README](../apex-debug/README.md)
- [Apex Orchestrator AGENTS.md](../Apex-orchestrator/AGENTS.md)
- [Apex Orchestrator README](../Apex-orchestrator/README.md)

---

## 🤝 Katkıda Bulunma

Agent entegrasyonunu geliştirmek istersen:

1. Yeni script'ler `scripts/` dizinine ekle
2. Workflow'ları `.github/workflows/` dizinine ekle
3. Bu dosyayı güncelle
4. Build ve test et: `npm run build && npm run audit`
