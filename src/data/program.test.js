import { describe, it, expect } from 'vitest';
import {
  ALL_PROGRAMS,
  PROGRAM_LIBRARY,
  LEVEL_CONFIG,
  LIBRARY_MESOCYCLE,
  parseProgramId,
  getPhaseFromWeek,
} from './program';

describe('ALL_PROGRAMS', () => {
  it('11 kategori × 3 seviye = 33 program üretir', () => {
    expect(Object.keys(ALL_PROGRAMS)).toHaveLength(PROGRAM_LIBRARY.length * 3);
  });

  it('her program id, category ve level taşır', () => {
    Object.entries(ALL_PROGRAMS).forEach(([key, prog]) => {
      expect(prog.id).toBe(key);
      expect(['kolay', 'orta', 'zor']).toContain(prog.level);
      expect(prog.days.length).toBeGreaterThan(0);
    });
  });

  it('superset referansları aynı gün içinde çözülür (seviye son eki dahil)', () => {
    Object.values(ALL_PROGRAMS).forEach((prog) => {
      Object.values(prog.program).forEach((day) => {
        const ids = new Set(day.exercises.map((e) => e.id));
        day.exercises.forEach((e) => {
          if (e.superset) expect(ids.has(e.superset)).toBe(true);
        });
      });
    });
  });

  it('kolay seviyede superset kaldırılır ve set sayısı azalır', () => {
    const kolay = ALL_PROGRAMS['vtaper_kolay'];
    const orta = ALL_PROGRAMS['vtaper_orta'];
    Object.values(kolay.program).forEach((day) => {
      day.exercises.forEach((e) => expect(e.superset).toBeNull());
    });
    const firstDay = orta.days[0];
    const ortaSets = orta.program[firstDay].exercises[0].sets;
    const kolaySets = kolay.program[firstDay].exercises[0].sets;
    expect(kolaySets).toBeLessThanOrEqual(ortaSets);
  });

  it('zor seviyede set sayısı +1 olur', () => {
    const orta = ALL_PROGRAMS['vtaper_orta'];
    const zor = ALL_PROGRAMS['vtaper_zor'];
    const firstDay = orta.days[0];
    expect(zor.program[firstDay].exercises[0].sets).toBe(
      orta.program[firstDay].exercises[0].sets + 1
    );
  });
});

describe('parseProgramId', () => {
  it('kategori id\'sini orta seviyeye çözer', () => {
    expect(parseProgramId('vtaper')).toEqual({
      category: 'vtaper', level: 'orta', resolvedId: 'vtaper_orta', isCustom: false,
    });
  });

  it('tam id\'yi olduğu gibi bırakır', () => {
    expect(parseProgramId('genel_kuvvet_zor')).toEqual({
      category: 'genel_kuvvet', level: 'zor', resolvedId: 'genel_kuvvet_zor', isCustom: false,
    });
  });

  it('custom ve personal id\'leri custom olarak işaretler', () => {
    expect(parseProgramId('custom_123').isCustom).toBe(true);
    expect(parseProgramId('personal_abc').isCustom).toBe(true);
    expect(parseProgramId('custom_123').resolvedId).toBe('custom_123');
  });

  it('null/bilinmeyen id vtaper_orta\'ya düşer', () => {
    expect(parseProgramId(null).resolvedId).toBe('vtaper_orta');
    expect(parseProgramId('olmayan_program').resolvedId).toBe('vtaper_orta');
  });
});

describe('LIBRARY_MESOCYCLE', () => {
  it('12 haftanın tamamını boşluksuz kapsar', () => {
    const weeks = LIBRARY_MESOCYCLE.phases.flatMap((p) => p.weeks).sort((a, b) => a - b);
    expect(weeks).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  it('deload fazları volumeMultiplier taşır', () => {
    const deloads = LIBRARY_MESOCYCLE.phases.filter((p) => p.name === 'Deload');
    expect(deloads.length).toBe(3);
    deloads.forEach((d) => expect(d.volumeMultiplier).toBeGreaterThan(0));
  });
});

describe('getPhaseFromWeek', () => {
  it('haftaları doğru faza eşler', () => {
    expect(getPhaseFromWeek(1)).toBe(1);
    expect(getPhaseFromWeek(5)).toBe(2);
    expect(getPhaseFromWeek(12)).toBe(3);
  });
});
