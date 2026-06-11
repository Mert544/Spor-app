import { describe, it, expect, beforeEach } from 'vitest';
import useProgressStore from '../store/useProgressStore';

describe('useProgressStore', () => {
  beforeEach(() => {
    useProgressStore.setState({
      weights: {},
      measurements: {},
      weeklyCheckIns: {},
      currentWeek: 1,
      startWeight: null,
      targetWeight: null,
      startDate: new Date().toISOString().split('T')[0],
    });
  });

  it('adds and retrieves weight entries', () => {
    useProgressStore.getState().addWeight('2026-04-01', 85.5);
    useProgressStore.getState().addWeight('2026-04-02', 85.2);
    expect(useProgressStore.getState().weights['2026-04-01']).toBe(85.5);
    expect(useProgressStore.getState().weights['2026-04-02']).toBe(85.2);
  });

  it('parses weight as float', () => {
    useProgressStore.getState().addWeight('2026-04-01', '82.5');
    expect(useProgressStore.getState().weights['2026-04-01']).toBe(82.5);
  });

  it('adds measurements', () => {
    useProgressStore.getState().addMeasurement('2026-04-01', { waist: 88, chest: 105 });
    expect(useProgressStore.getState().measurements['2026-04-01']).toEqual({ waist: 88, chest: 105 });
  });

  it('adds weekly check-in', () => {
    useProgressStore.getState().addCheckIn(1, { energy: 8, sleep: 7 });
    expect(useProgressStore.getState().weeklyCheckIns[1]).toEqual({ energy: 8, sleep: 7 });
  });

  it('sets current week', () => {
    useProgressStore.getState().setCurrentWeek('5');
    expect(useProgressStore.getState().currentWeek).toBe(5);
  });

  it('getRecentWeights returns sorted entries', () => {
    useProgressStore.getState().addWeight('2026-04-01', 85);
    useProgressStore.getState().addWeight('2026-04-03', 84);
    useProgressStore.getState().addWeight('2026-04-02', 84.5);
    const recent = useProgressStore.getState().getRecentWeights(30);
    expect(recent).toHaveLength(3);
    expect(recent[0].date).toBe('2026-04-01');
    expect(recent[2].date).toBe('2026-04-03');
  });

  it('getWeeklyAverage calculates correctly', () => {
    useProgressStore.getState().addWeight('2026-04-01', 80);
    useProgressStore.getState().addWeight('2026-04-02', 82);
    useProgressStore.getState().addWeight('2026-04-03', 81);
    expect(useProgressStore.getState().getWeeklyAverage()).toBe(81);
  });

  it('getWeeklyAverage returns null when no data', () => {
    expect(useProgressStore.getState().getWeeklyAverage()).toBeNull();
  });

  it('getTodayWeight returns todays weight', () => {
    const today = new Date().toISOString().split('T')[0];
    useProgressStore.getState().addWeight(today, 77.5);
    expect(useProgressStore.getState().getTodayWeight()).toBe(77.5);
  });

  it('getTotalChange calculates from start weight', () => {
    useProgressStore.getState().setStartWeight(90);
    useProgressStore.getState().addWeight('2026-04-01', 88);
    useProgressStore.getState().addWeight('2026-04-05', 87);
    expect(useProgressStore.getState().getTotalChange()).toBe(-3);
  });

  it('getTotalChange returns null without start weight', () => {
    useProgressStore.getState().addWeight('2026-04-01', 88);
    expect(useProgressStore.getState().getTotalChange()).toBeNull();
  });

  it('getTotalChange returns null without any weight', () => {
    useProgressStore.getState().setStartWeight(90);
    expect(useProgressStore.getState().getTotalChange()).toBeNull();
  });
});
