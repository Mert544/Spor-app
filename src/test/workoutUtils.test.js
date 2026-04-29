import { describe, it, expect } from 'vitest';

// Recreate the e1rm logic from useWorkoutStore for isolated testing
function e1rm(weight, reps) {
  const w = parseFloat(weight), r = parseInt(reps);
  if (!w || !r || r < 1) return 0;
  return r === 1 ? w : Math.round(w * (1 + r / 30));
}

function baseId(id) {
  return id.replace(/_(k|o|z)$/, '');
}

describe('e1rm calculator', () => {
  it('returns weight for single rep', () => {
    expect(e1rm(100, 1)).toBe(100);
  });

  it('calculates estimated 1RM for 5 reps', () => {
    // 100 * (1 + 5/30) = 100 * 1.166... = 116.6 → 117
    expect(e1rm(100, 5)).toBe(117);
  });

  it('calculates estimated 1RM for 10 reps', () => {
    // 80 * (1 + 10/30) = 80 * 1.333... = 106.6 → 107
    expect(e1rm(80, 10)).toBe(107);
  });

  it('returns 0 for invalid input', () => {
    expect(e1rm(0, 5)).toBe(0);
    expect(e1rm(100, 0)).toBe(0);
    expect(e1rm('', 5)).toBe(0);
    expect(e1rm(100, '')).toBe(0);
  });
});

describe('baseId stripper', () => {
  it('strips level suffixes', () => {
    expect(baseId('pa1_o')).toBe('pa1');
    expect(baseId('pa1_k')).toBe('pa1');
    expect(baseId('pa1_z')).toBe('pa1');
  });

  it('leaves id unchanged without suffix', () => {
    expect(baseId('custom_123')).toBe('custom_123');
    expect(baseId('bench_press')).toBe('bench_press');
  });
});
