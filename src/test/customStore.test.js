import { describe, it, expect, beforeEach } from 'vitest';
import useCustomStore from '../store/useCustomStore';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('useCustomStore', () => {
  beforeEach(() => {
    useCustomStore.setState({ dayExercises: {} });
  });

  it('adds exercise to a date', () => {
    useCustomStore.getState().addExercise('2026-04-01', { name: 'Face Pull', muscle: 'Omuz', sets: 3, reps: '15' });
    const exs = useCustomStore.getState().getExercises('2026-04-01');
    expect(exs).toHaveLength(1);
    expect(exs[0].name).toBe('Face Pull');
    expect(exs[0].muscle).toBe('Omuz');
  });

  it('adds multiple exercises to same date', async () => {
    useCustomStore.getState().addExercise('2026-04-01', { name: 'A', sets: 1 });
    await sleep(5);
    useCustomStore.getState().addExercise('2026-04-01', { name: 'B', sets: 1 });
    expect(useCustomStore.getState().getExercises('2026-04-01')).toHaveLength(2);
  });

  it('returns empty array for date without exercises', () => {
    expect(useCustomStore.getState().getExercises('2026-04-01')).toEqual([]);
  });

  it('removes exercise by id', async () => {
    useCustomStore.getState().addExercise('2026-04-01', { name: 'A', sets: 1 });
    await sleep(5);
    useCustomStore.getState().addExercise('2026-04-01', { name: 'B', sets: 1 });
    const idToRemove = useCustomStore.getState().getExercises('2026-04-01')[0].id;
    useCustomStore.getState().removeExercise('2026-04-01', idToRemove);
    expect(useCustomStore.getState().getExercises('2026-04-01')).toHaveLength(1);
  });

  it('assigns unique ids to exercises', async () => {
    useCustomStore.getState().addExercise('2026-04-01', { name: 'A', sets: 1 });
    await sleep(5);
    useCustomStore.getState().addExercise('2026-04-01', { name: 'B', sets: 1 });
    const exs = useCustomStore.getState().getExercises('2026-04-01');
    expect(exs[0].id).not.toBe(exs[1].id);
    expect(exs[0].id).toMatch(/^custom_/);
  });
});
