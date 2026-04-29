import { describe, it, expect } from 'vitest';

// Plain JS store factory mimicking useCustomProgramStore logic
function createTestStore() {
  let state = {
    programs: {},
    weeklyProgress: {},
  };

  function getState() { return state; }

  function set(updater) {
    if (typeof updater === 'function') {
      state = { ...state, ...updater(state) };
    } else {
      state = { ...state, ...updater };
    }
  }

  function get() { return { ...state, getState, set, get }; }

  return {
    getState,
    addProgram(program) {
      set((s) => ({
        programs: { ...s.programs, [program.id]: { ...program, mesocycleWeek: 1 } },
      }));
    },
    updateProgram(id, updates) {
      set((s) => ({
        programs: { ...s.programs, [id]: { ...s.programs[id], ...updates } },
      }));
    },
    deleteProgram(id) {
      set((s) => {
        const { [id]: _, ...rest } = s.programs;
        return { programs: rest };
      });
    },
    getProgram(id) {
      return state.programs[id] ?? null;
    },
    listPrograms() {
      return Object.values(state.programs);
    },
    getMesocycleWeek(id) {
      return state.programs[id]?.mesocycleWeek ?? 1;
    },
    setMesocycleWeek(id, week) {
      set((s) => ({
        programs: { ...s.programs, [id]: { ...s.programs[id], mesocycleWeek: week } },
      }));
    },
    incrementMesocycleWeek(id) {
      const program = state.programs[id];
      if (!program) return;
      const maxWeek = program.mesocycle?.durationWeeks ?? 6;
      const current = program.mesocycleWeek ?? 1;
      if (current < maxWeek) {
        this.setMesocycleWeek(id, current + 1);
      }
    },
    startNewMesocycle(id) {
      const program = state.programs[id];
      if (!program) return;
      const oldLandmarks = program.volumeLandmarks || {};
      const newLandmarks = {};
      Object.entries(oldLandmarks).forEach(([muscle, { mev, mav, mrv }]) => {
        const nudge = Math.round((mav - mev) * 0.15);
        newLandmarks[muscle] = {
          mev: Math.min(mev + nudge, mav),
          mav: Math.min(mav + nudge, mrv),
          mrv,
        };
      });
      set((s) => ({
        programs: {
          ...s.programs,
          [id]: {
            ...s.programs[id],
            mesocycleWeek: 1,
            volumeLandmarks: newLandmarks,
            previousMesocycles: [
              ...(s.programs[id].previousMesocycles || []),
              {
                completedAt: Date.now(),
                durationWeeks: s.programs[id].mesocycle?.durationWeeks ?? 6,
                landmarks: oldLandmarks,
              },
            ],
          },
        },
      }));
    },
    markDayComplete(id, dayIndex, totalDays) {
      const wp = state.weeklyProgress[id] || {
        completedDayIndices: [],
        currentWeek: state.programs[id]?.mesocycleWeek ?? 1,
      };
      if (wp.completedDayIndices.includes(dayIndex)) return;
      const nextIndices = [...wp.completedDayIndices, dayIndex];
      const maxWeek = state.programs[id]?.mesocycle?.durationWeeks ?? 6;
      let nextWeek = wp.currentWeek;
      if (nextIndices.length >= totalDays && nextWeek < maxWeek) {
        nextWeek += 1;
        nextIndices.length = 0;
      }
      set((s) => ({
        weeklyProgress: {
          ...s.weeklyProgress,
          [id]: { completedDayIndices: nextIndices, currentWeek: nextWeek },
        },
        programs: {
          ...s.programs,
          [id]: { ...s.programs[id], mesocycleWeek: nextWeek },
        },
      }));
    },
    getWeeklyProgress(id) {
      return state.weeklyProgress[id] || {
        completedDayIndices: [],
        currentWeek: state.programs[id]?.mesocycleWeek ?? 1,
      };
    },
  };
}

function makeProgram(overrides = {}) {
  return {
    id: `custom_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    name: 'Test Program',
    emoji: '💪',
    color: '#E94560',
    description: 'Test description',
    days: ['Pzt', 'Sal'],
    program: {
      Pzt: { exercises: [{ id: 'ex1', name: 'Bench', sets: 3, reps: '8-10' }] },
      Sal: { exercises: [{ id: 'ex2', name: 'Squat', sets: 3, reps: '8-10' }] },
    },
    mesocycle: { durationWeeks: 6, phases: [] },
    ...overrides,
  };
}

describe('useCustomProgramStore', () => {
  let store;

  function freshStore() {
    store = createTestStore();
  }

  describe('addProgram', () => {
    it('adds a program with mesocycleWeek set to 1', () => {
      freshStore();
      const p = makeProgram();
      store.addProgram(p);
      expect(store.getState().programs[p.id]).toBeDefined();
      expect(store.getState().programs[p.id].mesocycleWeek).toBe(1);
      expect(store.getState().programs[p.id].name).toBe('Test Program');
    });

    it('stores multiple programs independently', () => {
      freshStore();
      const p1 = makeProgram({ name: 'P1' });
      const p2 = makeProgram({ name: 'P2' });
      store.addProgram(p1);
      store.addProgram(p2);
      expect(store.listPrograms().length).toBe(2);
      expect(store.getProgram(p1.id).name).toBe('P1');
      expect(store.getProgram(p2.id).name).toBe('P2');
    });
  });

  describe('getProgram', () => {
    it('returns null for unknown id', () => {
      freshStore();
      expect(store.getProgram('nonexistent')).toBeNull();
    });

    it('returns the correct program', () => {
      freshStore();
      const p = makeProgram();
      store.addProgram(p);
      expect(store.getProgram(p.id).id).toBe(p.id);
    });
  });

  describe('listPrograms', () => {
    it('returns empty array when no programs', () => {
      freshStore();
      expect(store.listPrograms()).toEqual([]);
    });

    it('returns all programs as array', () => {
      freshStore();
      store.addProgram(makeProgram());
      store.addProgram(makeProgram());
      expect(store.listPrograms().length).toBe(2);
    });
  });

  describe('updateProgram', () => {
    it('updates program fields', () => {
      freshStore();
      const p = makeProgram();
      store.addProgram(p);
      store.updateProgram(p.id, { name: 'Updated', description: 'New desc' });
      const updated = store.getProgram(p.id);
      expect(updated.name).toBe('Updated');
      expect(updated.description).toBe('New desc');
      expect(updated.emoji).toBe('💪'); // unchanged
    });

    it('does not affect other programs', () => {
      freshStore();
      const p1 = makeProgram({ name: 'P1' });
      const p2 = makeProgram({ name: 'P2' });
      store.addProgram(p1);
      store.addProgram(p2);
      store.updateProgram(p1.id, { name: 'Updated' });
      expect(store.getProgram(p2.id).name).toBe('P2');
    });
  });

  describe('deleteProgram', () => {
    it('removes the program', () => {
      freshStore();
      const p = makeProgram();
      store.addProgram(p);
      store.deleteProgram(p.id);
      expect(store.getProgram(p.id)).toBeNull();
      expect(store.listPrograms().length).toBe(0);
    });

    it('does not affect other programs', () => {
      freshStore();
      const p1 = makeProgram();
      const p2 = makeProgram();
      store.addProgram(p1);
      store.addProgram(p2);
      store.deleteProgram(p1.id);
      expect(store.getProgram(p2.id)).toBeDefined();
      expect(store.listPrograms().length).toBe(1);
    });
  });

  describe('getMesocycleWeek / setMesocycleWeek', () => {
    it('defaults to 1', () => {
      freshStore();
      const p = makeProgram();
      store.addProgram(p);
      expect(store.getMesocycleWeek(p.id)).toBe(1);
    });

    it('sets and gets mesocycle week', () => {
      freshStore();
      const p = makeProgram();
      store.addProgram(p);
      store.setMesocycleWeek(p.id, 3);
      expect(store.getMesocycleWeek(p.id)).toBe(3);
    });
  });

  describe('incrementMesocycleWeek', () => {
    it('increments week within max', () => {
      freshStore();
      const p = makeProgram({ mesocycle: { durationWeeks: 4 } });
      store.addProgram(p);
      store.incrementMesocycleWeek(p.id);
      expect(store.getMesocycleWeek(p.id)).toBe(2);
    });

    it('does not exceed durationWeeks', () => {
      freshStore();
      const p = makeProgram({ mesocycle: { durationWeeks: 2 } });
      store.addProgram(p);
      store.setMesocycleWeek(p.id, 2);
      store.incrementMesocycleWeek(p.id);
      expect(store.getMesocycleWeek(p.id)).toBe(2);
    });

    it('does nothing for unknown program', () => {
      freshStore();
      store.incrementMesocycleWeek('unknown');
      expect(store.getState().programs).toEqual({});
    });
  });

  describe('startNewMesocycle', () => {
    it('resets mesocycleWeek to 1', () => {
      freshStore();
      const p = makeProgram({
        mesocycle: { durationWeeks: 6 },
        volumeLandmarks: {
          Göğüs: { mev: 10, mav: 20, mrv: 30 },
        },
      });
      store.addProgram(p);
      store.setMesocycleWeek(p.id, 6);
      store.startNewMesocycle(p.id);
      expect(store.getMesocycleWeek(p.id)).toBe(1);
    });

    it('bumps volume landmarks by 15% of MAV-MEV', () => {
      freshStore();
      const p = makeProgram({
        mesocycle: { durationWeeks: 6 },
        volumeLandmarks: {
          Göğüs: { mev: 10, mav: 20, mrv: 30 },
        },
      });
      store.addProgram(p);
      store.startNewMesocycle(p.id);
      const landmarks = store.getProgram(p.id).volumeLandmarks;
      expect(landmarks.Göğüs.mev).toBe(12); // 10 + round(0.15 * 10)
      expect(landmarks.Göğüs.mav).toBe(22); // 20 + round(0.15 * 10)
      expect(landmarks.Göğüs.mrv).toBe(30); // unchanged
    });

    it('caps mev at mav and mav at mrv', () => {
      freshStore();
      const p = makeProgram({
        mesocycle: { durationWeeks: 6 },
        volumeLandmarks: {
          Göğüs: { mev: 10, mav: 20, mrv: 20 },
        },
      });
      store.addProgram(p);
      store.startNewMesocycle(p.id);
      const landmarks = store.getProgram(p.id).volumeLandmarks;
      // nudge = round(0.15 * (20-10)) = round(1.5) = 2
      // mev = 10 + 2 = 12 (not capped, < mav=22)
      // mav = 20 + 2 = 22, capped at mrv=20
      expect(landmarks.Göğüs.mev).toBe(12);
      expect(landmarks.Göğüs.mav).toBe(20); // capped at mrv
      expect(landmarks.Göğüs.mrv).toBe(20);
    });

    it('records previous mesocycle in history', () => {
      freshStore();
      const p = makeProgram({
        mesocycle: { durationWeeks: 6 },
        volumeLandmarks: {
          Göğüs: { mev: 10, mav: 20, mrv: 30 },
        },
      });
      store.addProgram(p);
      store.setMesocycleWeek(p.id, 6);
      store.startNewMesocycle(p.id);
      const history = store.getProgram(p.id).previousMesocycles;
      expect(history.length).toBe(1);
      expect(history[0].durationWeeks).toBe(6);
      expect(history[0].landmarks).toEqual({ Göğüs: { mev: 10, mav: 20, mrv: 30 } });
      expect(history[0].completedAt).toBeGreaterThan(0);
    });

    it('does nothing for unknown program', () => {
      freshStore();
      store.startNewMesocycle('unknown');
      expect(store.getState().programs).toEqual({});
    });
  });

  describe('markDayComplete', () => {
    it('tracks completed day index', () => {
      freshStore();
      const p = makeProgram({ mesocycle: { durationWeeks: 4 } });
      store.addProgram(p);
      store.markDayComplete(p.id, 0, 3);
      const wp = store.getWeeklyProgress(p.id);
      expect(wp.completedDayIndices).toContain(0);
      expect(wp.currentWeek).toBe(1);
    });

    it('does not double-count same day', () => {
      freshStore();
      const p = makeProgram({ mesocycle: { durationWeeks: 4 } });
      store.addProgram(p);
      store.markDayComplete(p.id, 0, 3);
      store.markDayComplete(p.id, 0, 3);
      const wp = store.getWeeklyProgress(p.id);
      expect(wp.completedDayIndices.length).toBe(1);
    });

    it('advances week when all days completed', () => {
      freshStore();
      const p = makeProgram({ mesocycle: { durationWeeks: 4 } });
      store.addProgram(p);
      store.markDayComplete(p.id, 0, 2);
      store.markDayComplete(p.id, 1, 2);
      const wp = store.getWeeklyProgress(p.id);
      expect(wp.currentWeek).toBe(2);
      expect(wp.completedDayIndices.length).toBe(0); // reset for new week
      expect(store.getMesocycleWeek(p.id)).toBe(2);
    });

    it('does not advance past max week', () => {
      freshStore();
      const p = makeProgram({ mesocycle: { durationWeeks: 2 } });
      store.addProgram(p);
      store.setMesocycleWeek(p.id, 2);
      store.markDayComplete(p.id, 0, 1);
      const wp = store.getWeeklyProgress(p.id);
      expect(wp.currentWeek).toBe(2); // stayed at max
    });

    it('tracks multiple programs independently', () => {
      freshStore();
      const p1 = makeProgram({ mesocycle: { durationWeeks: 4 } });
      const p2 = makeProgram({ mesocycle: { durationWeeks: 4 } });
      store.addProgram(p1);
      store.addProgram(p2);
      store.markDayComplete(p1.id, 0, 3);
      store.markDayComplete(p2.id, 1, 3);
      expect(store.getWeeklyProgress(p1.id).completedDayIndices).toEqual([0]);
      expect(store.getWeeklyProgress(p2.id).completedDayIndices).toEqual([1]);
    });
  });

  describe('getWeeklyProgress', () => {
    it('returns default for unknown program', () => {
      freshStore();
      const wp = store.getWeeklyProgress('unknown');
      expect(wp.completedDayIndices).toEqual([]);
      expect(wp.currentWeek).toBe(1);
    });

    it('returns stored progress', () => {
      freshStore();
      const p = makeProgram({ mesocycle: { durationWeeks: 4 } });
      store.addProgram(p);
      store.markDayComplete(p.id, 0, 3);
      const wp = store.getWeeklyProgress(p.id);
      expect(wp.completedDayIndices).toEqual([0]);
      expect(wp.currentWeek).toBe(1);
    });
  });
});
