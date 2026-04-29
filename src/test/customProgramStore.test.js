import { describe, it, expect, beforeEach } from 'vitest';
import useCustomProgramStore from '../store/useCustomProgramStore';

describe('useCustomProgramStore', () => {
  beforeEach(() => {
    useCustomProgramStore.setState({ programs: {}, weeklyProgress: {} });
  });

  it('adds a program with default mesocycle week 1', () => {
    useCustomProgramStore.getState().addProgram({
      id: 'custom_123',
      name: 'Test Program',
      emoji: '💪',
      color: '#14B8A6',
    });
    const p = useCustomProgramStore.getState().getProgram('custom_123');
    expect(p.name).toBe('Test Program');
    expect(p.mesocycleWeek).toBe(1);
  });

  it('updates a program', () => {
    useCustomProgramStore.getState().addProgram({ id: 'custom_123', name: 'Old' });
    useCustomProgramStore.getState().updateProgram('custom_123', { name: 'New' });
    expect(useCustomProgramStore.getState().getProgram('custom_123').name).toBe('New');
  });

  it('deletes a program', () => {
    useCustomProgramStore.getState().addProgram({ id: 'custom_123', name: 'Test' });
    useCustomProgramStore.getState().deleteProgram('custom_123');
    expect(useCustomProgramStore.getState().getProgram('custom_123')).toBeNull();
  });

  it('lists all programs', () => {
    useCustomProgramStore.getState().addProgram({ id: 'p1', name: 'A' });
    useCustomProgramStore.getState().addProgram({ id: 'p2', name: 'B' });
    expect(useCustomProgramStore.getState().listPrograms()).toHaveLength(2);
  });

  it('increments mesocycle week', () => {
    useCustomProgramStore.getState().addProgram({
      id: 'p1', name: 'Test', mesocycle: { durationWeeks: 6 },
    });
    useCustomProgramStore.getState().incrementMesocycleWeek('p1');
    expect(useCustomProgramStore.getState().getMesocycleWeek('p1')).toBe(2);
  });

  it('does not increment past max week', () => {
    useCustomProgramStore.getState().addProgram({
      id: 'p1', name: 'Test', mesocycle: { durationWeeks: 2 }, mesocycleWeek: 2,
    });
    useCustomProgramStore.getState().incrementMesocycleWeek('p1');
    expect(useCustomProgramStore.getState().getMesocycleWeek('p1')).toBe(2);
  });

  it('starts new mesocycle and resets week', () => {
    useCustomProgramStore.getState().addProgram({
      id: 'p1', name: 'Test', mesocycle: { durationWeeks: 6 }, mesocycleWeek: 6,
      volumeLandmarks: { chest: { mev: 10, mav: 20, mrv: 30 } },
    });
    useCustomProgramStore.getState().startNewMesocycle('p1');
    expect(useCustomProgramStore.getState().getMesocycleWeek('p1')).toBe(1);
  });

  it('markDayComplete increments weekly progress', () => {
    useCustomProgramStore.getState().addProgram({
      id: 'p1', name: 'Test', mesocycle: { durationWeeks: 6 },
    });
    useCustomProgramStore.getState().markDayComplete('p1', 0, 3);
    const wp = useCustomProgramStore.getState().getWeeklyProgress('p1');
    expect(wp.completedDayIndices).toContain(0);
  });

  it('markDayComplete advances week when all days done', () => {
    useCustomProgramStore.getState().addProgram({
      id: 'p1', name: 'Test', mesocycle: { durationWeeks: 6 },
    });
    useCustomProgramStore.getState().markDayComplete('p1', 0, 2);
    useCustomProgramStore.getState().markDayComplete('p1', 1, 2);
    expect(useCustomProgramStore.getState().getMesocycleWeek('p1')).toBe(2);
  });

  it('markDayComplete ignores duplicate day', () => {
    useCustomProgramStore.getState().addProgram({
      id: 'p1', name: 'Test', mesocycle: { durationWeeks: 6 },
    });
    useCustomProgramStore.getState().markDayComplete('p1', 0, 3);
    useCustomProgramStore.getState().markDayComplete('p1', 0, 3);
    const wp = useCustomProgramStore.getState().getWeeklyProgress('p1');
    expect(wp.completedDayIndices).toHaveLength(1);
  });
});
