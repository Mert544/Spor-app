import { describe, it, expect } from 'vitest';
import { ACHIEVEMENTS } from '../store/useAchievementStore';

// Plain JS store factory for testing (no React hooks)
function createTestStore() {
  let state = {
    unlocked: [],
    stats: {
      totalWorkouts: 0,
      maxStreak: 0,
      maxSessionVolume: 0,
      totalPRs: 0,
      customProgramsCreated: 0,
      weightEntries: 0,
      earlyWorkouts: 0,
      lateWorkouts: 0,
    },
    lastChecked: null,
  };

  function checkAchievements() {
    const newlyUnlocked = [];
    for (const ach of ACHIEVEMENTS) {
      if (!state.unlocked.includes(ach.id) && ach.condition(state.stats)) {
        newlyUnlocked.push(ach);
      }
    }
    if (newlyUnlocked.length > 0) {
      state = {
        ...state,
        unlocked: [...state.unlocked, ...newlyUnlocked.map((a) => a.id)],
        lastChecked: Date.now(),
      };
    }
    return newlyUnlocked;
  }

  function updateStats(patch) {
    state = {
      ...state,
      stats: { ...state.stats, ...patch },
    };
    return checkAchievements();
  }

  return {
    getState: () => state,
    checkAchievements,
    updateStats,
    recordWorkout(sessionVolume = 0, hour = new Date().getHours()) {
      const patch = {
        totalWorkouts: state.stats.totalWorkouts + 1,
        maxSessionVolume: Math.max(state.stats.maxSessionVolume, sessionVolume),
      };
      if (hour < 7) patch.earlyWorkouts = state.stats.earlyWorkouts + 1;
      if (hour >= 22) patch.lateWorkouts = state.stats.lateWorkouts + 1;
      return updateStats(patch);
    },
    recordStreak(streak) {
      if (streak > state.stats.maxStreak) {
        return updateStats({ maxStreak: streak });
      }
      return [];
    },
    recordPR() {
      return updateStats({ totalPRs: state.stats.totalPRs + 1 });
    },
    recordProgramCreated() {
      return updateStats({ customProgramsCreated: state.stats.customProgramsCreated + 1 });
    },
    recordWeightEntry() {
      return updateStats({ weightEntries: state.stats.weightEntries + 1 });
    },
    getProgress(achievementId) {
      const ach = ACHIEVEMENTS.find((a) => a.id === achievementId);
      if (!ach) return 0;
      const s = state.stats;
      if (achievementId === 'first_workout') return Math.min(s.totalWorkouts / 1, 1);
      if (achievementId === 'week_warrior') return Math.min(s.maxStreak / 7, 1);
      if (achievementId === 'month_master') return Math.min(s.maxStreak / 30, 1);
      if (achievementId === 'volume_king') return Math.min(s.maxSessionVolume / 10000, 1);
      if (achievementId === 'pr_breaker') return Math.min(s.totalPRs / 1, 1);
      if (achievementId === 'pr_legend') return Math.min(s.totalPRs / 10, 1);
      if (achievementId === 'program_creator') return Math.min(s.customProgramsCreated / 1, 1);
      if (achievementId === 'program_master') return Math.min(s.customProgramsCreated / 5, 1);
      if (achievementId === 'weight_tracker') return Math.min(s.weightEntries / 30, 1);
      if (achievementId === 'early_bird') return Math.min(s.earlyWorkouts / 1, 1);
      if (achievementId === 'night_owl') return Math.min(s.lateWorkouts / 1, 1);
      if (achievementId === 'consistent') return Math.min(s.totalWorkouts / 50, 1);
      if (achievementId === 'legend') return Math.min(s.totalWorkouts / 100, 1);
      return 0;
    },
  };
}

describe('useAchievementStore', () => {
  let store;

  function freshStore() {
    store = createTestStore();
  }

  it('starts with no unlocked achievements', () => {
    freshStore();
    expect(store.getState().unlocked).toEqual([]);
  });

  it('starts with zero stats', () => {
    freshStore();
    expect(store.getState().stats).toEqual({
      totalWorkouts: 0,
      maxStreak: 0,
      maxSessionVolume: 0,
      totalPRs: 0,
      customProgramsCreated: 0,
      weightEntries: 0,
      earlyWorkouts: 0,
      lateWorkouts: 0,
    });
  });

  describe('recordWorkout', () => {
    it('unlocks first_workout on first workout', () => {
      freshStore();
      const newAch = store.recordWorkout();
      expect(newAch.map((a) => a.id)).toContain('first_workout');
      expect(store.getState().unlocked).toContain('first_workout');
      expect(store.getState().stats.totalWorkouts).toBe(1);
    });

    it('does not duplicate first_workout', () => {
      freshStore();
      store.recordWorkout();
      const newAch = store.recordWorkout();
      expect(newAch.map((a) => a.id)).not.toContain('first_workout');
      expect(store.getState().stats.totalWorkouts).toBe(2);
    });

    it('unlocks early_bird for hour < 7', () => {
      freshStore();
      const newAch = store.recordWorkout(0, 5);
      expect(newAch.map((a) => a.id)).toContain('early_bird');
      expect(store.getState().stats.earlyWorkouts).toBe(1);
    });

    it('unlocks night_owl for hour >= 22', () => {
      freshStore();
      const newAch = store.recordWorkout(0, 22);
      expect(newAch.map((a) => a.id)).toContain('night_owl');
      expect(store.getState().stats.lateWorkouts).toBe(1);
    });

    it('does not unlock early_bird or night_owl for normal hours', () => {
      freshStore();
      const newAch = store.recordWorkout(0, 12);
      expect(newAch.map((a) => a.id)).not.toContain('early_bird');
      expect(newAch.map((a) => a.id)).not.toContain('night_owl');
    });

    it('tracks maxSessionVolume correctly', () => {
      freshStore();
      store.recordWorkout(5000);
      store.recordWorkout(8000);
      expect(store.getState().stats.maxSessionVolume).toBe(8000);
      store.recordWorkout(3000);
      expect(store.getState().stats.maxSessionVolume).toBe(8000);
    });

    it('unlocks volume_king at 10000 kg', () => {
      freshStore();
      const newAch = store.recordWorkout(10000);
      expect(newAch.map((a) => a.id)).toContain('volume_king');
    });

    it('unlocks consistent at 50 workouts', () => {
      freshStore();
      for (let i = 0; i < 49; i++) store.recordWorkout();
      expect(store.getState().unlocked).not.toContain('consistent');
      const newAch = store.recordWorkout();
      expect(newAch.map((a) => a.id)).toContain('consistent');
      expect(store.getState().stats.totalWorkouts).toBe(50);
    });

    it('unlocks legend at 100 workouts', () => {
      freshStore();
      for (let i = 0; i < 99; i++) store.recordWorkout();
      expect(store.getState().unlocked).not.toContain('legend');
      const newAch = store.recordWorkout();
      expect(newAch.map((a) => a.id)).toContain('legend');
      expect(store.getState().stats.totalWorkouts).toBe(100);
    });
  });

  describe('recordStreak', () => {
    it('unlocks week_warrior at 7 days', () => {
      freshStore();
      store.recordStreak(5);
      expect(store.getState().unlocked).not.toContain('week_warrior');
      const newAch = store.recordStreak(7);
      expect(newAch.map((a) => a.id)).toContain('week_warrior');
      expect(store.getState().stats.maxStreak).toBe(7);
    });

    it('unlocks month_master at 30 days', () => {
      freshStore();
      store.recordStreak(7); // week_warrior önce
      store.recordStreak(29);
      expect(store.getState().unlocked).not.toContain('month_master');
      const newAch = store.recordStreak(30);
      expect(newAch.map((a) => a.id)).toContain('month_master');
      expect(store.getState().stats.maxStreak).toBe(30);
    });

    it('does not trigger for same or lower streak', () => {
      freshStore();
      store.recordStreak(10);
      const newAch = store.recordStreak(8);
      expect(newAch).toEqual([]);
    });
  });

  describe('recordPR', () => {
    it('unlocks pr_breaker on first PR', () => {
      freshStore();
      const newAch = store.recordPR();
      expect(newAch.map((a) => a.id)).toContain('pr_breaker');
      expect(store.getState().stats.totalPRs).toBe(1);
    });

    it('unlocks pr_legend at 10 PRs', () => {
      freshStore();
      for (let i = 0; i < 9; i++) store.recordPR();
      expect(store.getState().unlocked).not.toContain('pr_legend');
      const newAch = store.recordPR();
      expect(newAch.map((a) => a.id)).toContain('pr_legend');
      expect(store.getState().stats.totalPRs).toBe(10);
    });
  });

  describe('recordProgramCreated', () => {
    it('unlocks program_creator on first program', () => {
      freshStore();
      const newAch = store.recordProgramCreated();
      expect(newAch.map((a) => a.id)).toContain('program_creator');
      expect(store.getState().stats.customProgramsCreated).toBe(1);
    });

    it('unlocks program_master at 5 programs', () => {
      freshStore();
      for (let i = 0; i < 4; i++) store.recordProgramCreated();
      expect(store.getState().unlocked).not.toContain('program_master');
      const newAch = store.recordProgramCreated();
      expect(newAch.map((a) => a.id)).toContain('program_master');
      expect(store.getState().stats.customProgramsCreated).toBe(5);
    });
  });

  describe('recordWeightEntry', () => {
    it('unlocks weight_tracker at 30 entries', () => {
      freshStore();
      for (let i = 0; i < 29; i++) store.recordWeightEntry();
      expect(store.getState().unlocked).not.toContain('weight_tracker');
      const newAch = store.recordWeightEntry();
      expect(newAch.map((a) => a.id)).toContain('weight_tracker');
      expect(store.getState().stats.weightEntries).toBe(30);
    });
  });

  describe('checkAchievements', () => {
    it('returns empty array when nothing new', () => {
      freshStore();
      const result = store.checkAchievements();
      expect(result).toEqual([]);
    });

    it('returns multiple achievements at once', () => {
      freshStore();
      const newAch = store.updateStats({ totalWorkouts: 50, maxSessionVolume: 10000 });
      const ids = newAch.map((a) => a.id);
      expect(ids).toContain('first_workout');
      expect(ids).toContain('volume_king');
      expect(ids).toContain('consistent');
      expect(store.getState().unlocked).toContain('first_workout');
      expect(store.getState().unlocked).toContain('volume_king');
      expect(store.getState().unlocked).toContain('consistent');
    });
  });

  describe('getProgress', () => {
    it('returns 0 for untouched achievements', () => {
      freshStore();
      expect(store.getProgress('first_workout')).toBe(0);
      expect(store.getProgress('consistent')).toBe(0);
    });

    it('returns correct progress for partial achievements', () => {
      freshStore();
      store.updateStats({ totalWorkouts: 25 });
      expect(store.getProgress('consistent')).toBe(0.5);
      expect(store.getProgress('legend')).toBe(0.25);
    });

    it('caps progress at 1', () => {
      freshStore();
      store.updateStats({ totalWorkouts: 200 });
      expect(store.getProgress('legend')).toBe(1);
    });
  });

  describe('updateStats', () => {
    it('patches multiple stats at once', () => {
      freshStore();
      store.updateStats({ totalWorkouts: 5, maxStreak: 3 });
      expect(store.getState().stats.totalWorkouts).toBe(5);
      expect(store.getState().stats.maxStreak).toBe(3);
    });

    it('does not reset other stats', () => {
      freshStore();
      store.recordWorkout(5000);
      store.updateStats({ maxStreak: 10 });
      expect(store.getState().stats.maxSessionVolume).toBe(5000);
      expect(store.getState().stats.totalWorkouts).toBe(1);
      expect(store.getState().stats.maxStreak).toBe(10);
    });
  });

  describe('all achievements', () => {
    it('has 13 achievements defined', () => {
      expect(ACHIEVEMENTS.length).toBe(13);
    });

    it('each achievement has required fields', () => {
      for (const ach of ACHIEVEMENTS) {
        expect(ach.id).toBeDefined();
        expect(ach.title).toBeDefined();
        expect(ach.description).toBeDefined();
        expect(ach.emoji).toBeDefined();
        expect(ach.color).toBeDefined();
        expect(typeof ach.condition).toBe('function');
      }
    });

    it('all achievement ids are unique', () => {
      const ids = ACHIEVEMENTS.map((a) => a.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });
});
