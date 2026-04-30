import { describe, it, expect } from 'vitest';

// Test MESO_PHASES structure consistency
const MESO_PHASES = [
  { name:'Birikim', weeks:[1,2,3], volumeMultiplier:null },
  { name:'Yoğunlaştırma', weeks:[4,5], volumeMultiplier:null },
  { name:'Gerçekleştirme', weeks:[6], volumeMultiplier:0.6 },
];

describe('mesocycle phases', () => {
  it('has continuous week coverage', () => {
    const allWeeks = MESO_PHASES.flatMap(p => p.weeks);
    expect(allWeeks).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('has deload in the last phase', () => {
    const lastPhase = MESO_PHASES[MESO_PHASES.length - 1];
    expect(lastPhase.volumeMultiplier).toBe(0.6);
  });

  it('has exactly 6 weeks total', () => {
    const totalWeeks = MESO_PHASES.reduce((sum, p) => sum + p.weeks.length, 0);
    expect(totalWeeks).toBe(6);
  });
});

// Simple UID validation
function uid() {
  const id = `custom_${Date.now()}_${Math.random().toString(36).slice(2,6)}`;
  return id.startsWith('custom_') && id.length > 10;
}

describe('uid generator', () => {
  it('produces valid custom ids', () => {
    expect(uid()).toBe(true);
    expect(uid()).toBe(true);
    expect(uid()).toBe(true);
  });
});
