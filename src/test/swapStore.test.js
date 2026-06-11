import { describe, it, expect, beforeEach } from 'vitest';
import useSwapStore, { applySwap, swapSlug } from '../store/useSwapStore';
import { explainTempo } from '../components/Workout/ExerciseCard';

describe('useSwapStore', () => {
  beforeEach(() => {
    useSwapStore.setState({ swaps: {} });
  });

  it('swap ekler ve geri alır', () => {
    useSwapStore.getState().setSwap('vtaper_orta|Pzt - PUSH A|pa2_o', 'DB Flat Bench Press');
    expect(useSwapStore.getState().getSwap('vtaper_orta|Pzt - PUSH A|pa2_o')).toBe('DB Flat Bench Press');
    useSwapStore.getState().clearSwap('vtaper_orta|Pzt - PUSH A|pa2_o');
    expect(useSwapStore.getState().getSwap('vtaper_orta|Pzt - PUSH A|pa2_o')).toBeNull();
  });
});

describe('applySwap', () => {
  const ex = { id: 'pa2_o', name: 'Smith Flat Bench Press', sets: 4, reps: '8-10', superset: 'pa3_o' };

  it('swap yoksa egzersizi swapKey ile aynen döndürür', () => {
    const out = applySwap(ex, {}, 'vtaper_orta', 'Pzt - PUSH A');
    expect(out.id).toBe('pa2_o');
    expect(out.name).toBe('Smith Flat Bench Press');
    expect(out.swapKey).toBe('vtaper_orta|Pzt - PUSH A|pa2_o');
    expect(out.origId).toBeUndefined();
  });

  it('swap varsa ad ve id değişir, reçete ve superset korunur', () => {
    const swaps = { 'vtaper_orta|Pzt - PUSH A|pa2_o': 'DB Flat Bench Press' };
    const out = applySwap(ex, swaps, 'vtaper_orta', 'Pzt - PUSH A');
    expect(out.name).toBe('DB Flat Bench Press');
    expect(out.origId).toBe('pa2_o');
    expect(out.originalName).toBe('Smith Flat Bench Press');
    expect(out.id).toBe(`pa2_o~${swapSlug('DB Flat Bench Press')}`);
    expect(out.sets).toBe(4);
    expect(out.superset).toBe('pa3_o');
  });

  it('swap id seviye son eki gibi soyulmaz (log geçmişi karışmaz)', () => {
    // useWorkoutStore.baseId /_(k|o|z)$/ soyar — swap id'si bu kalıba uymamalı
    const swaps = { 'k|d|pa2_o': 'DB Press' };
    const out = applySwap({ id: 'pa2_o', name: 'X' }, swaps, 'k', 'd');
    expect(/_(k|o|z)$/.test(out.id)).toBe(false);
  });
});

describe('explainTempo', () => {
  it('standart tempoyu açıklar', () => {
    expect(explainTempo('2:1:X:0')).toBe('2sn indir · 1sn altta bekle · patlayıcı kaldır · 0sn üstte bekle');
  });

  it('parse edilemeyen tempoda null döner', () => {
    expect(explainTempo('-')).toBeNull();
    expect(explainTempo('yavaş')).toBeNull();
    expect(explainTempo(null)).toBeNull();
  });
});
