/**
 * V-Taper Coach — One-Time Managed Agent Setup
 *
 * Run once: node scripts/setup-agent.mjs
 * Then add the printed IDs to .env and Vercel environment variables.
 */
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Sen Mert'in kişisel antrenman ve beslenme koçusun. Türkçe konuş. Kısa, net ve motive edici cevaplar ver.

Mert hakkında:
- Boy: 186 cm, Başlangıç kilo: 94-95 kg → Hedef: 87-88 kg (V-taper vücut)
- Ev salonu: Smith machine (90 kg), kablo sistemi, pull-up/dips istasyonu, 5-20 kg dumbbell seti, 2 direnç bandı, kürek makinesi, bisiklet, koşu bandı
- Beslenme: El porsiyonu yöntemi (kalori saymıyor), günlük 8-10 avuç içi protein hedefi
- Antrenman programı: 6 günlük V-taper split (Push A/B, Pull A/B, Omuz+Kol, Bacak)
- Faz 1 (hf1-4): Birikim — hacim oluşturma
- Faz 2 (hf5-8): Yoğunlaştırma — yoğunluk artırma
- Faz 3 (hf9-12): Gerçekleştirme — zirve performans
- RPE 7-9 arası çalışıyor, tempo odaklı (3-1-2-1 gibi)

Görevlerin:
1. Antrenman tekniği ve form tavsiyeleri
2. Beslenme rehberliği (el porsiyonu bazlı)
3. Toparlanma ve uyku önerileri
4. Motivasyon ve zihinsel destek
5. Program ayarlamaları (RPE, set/tekrar)
6. İlerleme değerlendirmesi

Cevap tarzı:
- Kısa ve öz (2-4 cümle ideal)
- Somut öneriler, soyut tavsiyelerden kaçın
- Gerçekçi ama pozitif ve motive edici
- Gerektiğinde emoji kullan ama abartma`;

async function main() {
  console.log('V-Taper Coach Managed Agent kurulumu başlatılıyor...\n');

  // 1. Create environment
  console.log('1. Environment oluşturuluyor...');
  const env = await client.beta.environments.create({
    name: 'vtaper-coach-env',
    config: { type: 'cloud', networking: { type: 'unrestricted' } },
  });
  console.log(`   ✓ ENV_ID=${env.id}\n`);

  // 2. Create agent
  console.log('2. Agent oluşturuluyor...');
  const agent = await client.beta.agents.create({
    name: 'V-Taper Coach',
    model: 'claude-opus-4-6',
    system: SYSTEM_PROMPT,
  });
  console.log(`   ✓ AGENT_ID=${agent.id}\n`);

  console.log('='.repeat(50));
  console.log('✅ Kurulum tamamlandı! Aşağıdaki değerleri .env dosyasına ekle:\n');
  console.log(`ANTHROPIC_API_KEY=${process.env.ANTHROPIC_API_KEY || 'sk-ant-...'}`);
  console.log(`AGENT_ID=${agent.id}`);
  console.log(`ENV_ID=${env.id}`);
  console.log('\nVercel Dashboard > Settings > Environment Variables bölümüne de ekle.');
}

main().catch(err => {
  console.error('Hata:', err.message);
  process.exit(1);
});
