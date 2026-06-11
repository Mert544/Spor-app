import { describe, it, expect, beforeEach } from 'vitest';
import useWorkoutStore from '../store/useWorkoutStore';

describe('useWorkoutStore', () => {
  beforeEach(() => {
    useWorkoutStore.setState({ logs: {}, exerciseNotes: {} });
  });

  it('logs a set and retrieves it', () => {
    useWorkoutStore.getState().logSet('2026-04-01', 'bench_press', 0, { weight: 80, reps: 10, done: true });
    const exLogs = useWorkoutStore.getState().getExerciseLogs('2026-04-01', 'bench_press');
    expect(exLogs[0].weight).toBe(80);
    expect(exLogs[0].reps).toBe(10);
    expect(exLogs[0].done).toBe(true);
  });

  it('marks exercise complete when all sets done', () => {
    useWorkoutStore.getState().logSet('2026-04-01', 'squat', 0, { done: true });
    useWorkoutStore.getState().logSet('2026-04-01', 'squat', 1, { done: true });
    useWorkoutStore.getState().logSet('2026-04-01', 'squat', 2, { done: true });
    expect(useWorkoutStore.getState().isExerciseComplete('2026-04-01', 'squat', 3)).toBe(true);
  });

  it('does not mark exercise complete with partial sets', () => {
    useWorkoutStore.getState().logSet('2026-04-01', 'squat', 0, { done: true });
    expect(useWorkoutStore.getState().isExerciseComplete('2026-04-01', 'squat', 3)).toBe(false);
  });

  it('calculates day progress correctly', () => {
    useWorkoutStore.getState().logSet('2026-04-01', 'ex1', 0, { done: true });
    useWorkoutStore.getState().logSet('2026-04-01', 'ex2', 0, { done: true });
    const progress = useWorkoutStore.getState().getDayProgress('2026-04-01', [{ id: 'ex1', sets: 1 }, { id: 'ex2', sets: 1 }, { id: 'ex3', sets: 1 }]);
    expect(progress.completed).toBe(2);
    expect(progress.total).toBe(3);
  });

  it('gets previous weight from earlier date', () => {
    useWorkoutStore.getState().logSet('2026-03-01', 'bench_press', 0, { weight: 70, done: true });
    useWorkoutStore.getState().logSet('2026-04-01', 'bench_press', 0, { weight: 80, done: true });
    expect(useWorkoutStore.getState().getPreviousWeight('bench_press', 0)).toBe(80);
  });

  it('returns null for previous weight if no prior logs', () => {
    expect(useWorkoutStore.getState().getPreviousWeight('bench_press', 0)).toBeNull();
  });

  it('calculates personal record correctly', () => {
    useWorkoutStore.getState().logSet('2026-04-01', 'bench_press', 0, { weight: 80, reps: 5, done: true });
    useWorkoutStore.getState().logSet('2026-04-02', 'bench_press', 0, { weight: 85, reps: 3, done: true });
    const pr = useWorkoutStore.getState().getPersonalRecord('bench_press');
    expect(pr.weight).toBe(85);
    expect(pr.reps).toBe(3);
  });

  it('calculates streak correctly', () => {
    const today = new Date().toISOString().split('T')[0];
    useWorkoutStore.getState().logSet(today, 'ex1', 0, { done: true });
    expect(useWorkoutStore.getState().getStreak()).toBe(1);
  });

  it('returns zero streak with no activity', () => {
    expect(useWorkoutStore.getState().getStreak()).toBe(0);
  });

  it('gets logged dates', () => {
    useWorkoutStore.getState().logSet('2026-04-01', 'ex1', 0, { done: true });
    useWorkoutStore.getState().logSet('2026-04-02', 'ex1', 0, { done: false }); // not done, should not count
    const dates = useWorkoutStore.getState().getLoggedDates();
    expect(dates).toContain('2026-04-01');
    expect(dates).not.toContain('2026-04-02');
  });

  it('calculates session volume', () => {
    useWorkoutStore.getState().logSet('2026-04-01', 'ex1', 0, { weight: 100, reps: 10, done: true });
    useWorkoutStore.getState().logSet('2026-04-01', 'ex1', 1, { weight: 100, reps: 10, done: true });
    const vol = useWorkoutStore.getState().getSessionVolume('2026-04-01', [{ id: 'ex1' }]);
    expect(vol.totalVolume).toBe(2000);
    expect(vol.totalSets).toBe(2);
  });

  it('stores exercise notes', () => {
    useWorkoutStore.getState().setExerciseNote('bench_press', 'Focus on form');
    expect(useWorkoutStore.getState().exerciseNotes['bench_press']).toBe('Focus on form');
  });
});
