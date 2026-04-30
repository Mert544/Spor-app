# Autonomous Development System

Hermes + Clawbot otonom çoklu-ajan geliştirme sistemi.

## Mimari

```
┌──────────────┐          ┌──────────────┐
│   HERMES     │◄────────►│   CLAWBOT    │
│  (Strategist)│  JSON    │  (Builder)   │
│              │  Msgs    │              │
└──────┬───────┘          └──────┬───────┘
       │                         │
       ▼                         ▼
┌──────────────┐          ┌──────────────┐
│  Task Queue  │          │  Work Queue  │
│  (RabbitMQ)  │          │  (Redis)     │
└──────────────┘          └──────────────┘
```

## Bileşenler

### Hermes (Strategist)
- **analyzer.py** — Codebase analizörü
- **planner.py** — Görev planlayıcı
- **reviewer.py** — Kod kalite denetleyicisi
- **self_improvement.py** — Self-improvement loop
- **strategist.py** — Ana koordinatör

### Clawbot (Builder)
- **builder.py** — Kod yazma + commit
- **tester.py** — Test çalıştırıcı
- **deployer.py** — Deploy orchestrator
- **fixer.py** — Hata düzeltici

### Shared
- **message_bus.py** — Ajanlar arası iletişim
- **memory.py** — Kısa + uzun süreli hafıza
- **security.py** — Güvenlik katmanı

## Kurulum

```bash
# Development (in-memory)
cd autonomous-system
pip install -r requirements.txt
python main.py

# Production (Docker + Redis + PostgreSQL)
cd autonomous-system/docker
docker-compose up -d
```

## Konfigürasyon

`config/agents.yaml` dosyasından ayarları değiştirin.

## Test

```bash
cd autonomous-system
pip install pytest pytest-asyncio
pytest tests/ -v
```

## Monitoring

- Prometheus: http://localhost:9090
- Grafana: http://localhost:3000 (admin/admin)
