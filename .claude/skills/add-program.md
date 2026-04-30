# Add Workout Program

Add a new workout program to the V-Taper Coach app's `ALL_PROGRAMS` static library.

## Steps

1. **Read** `src/data/program.js` to understand the existing program structure
2. **Ask** for program details if not provided:
   - Program name (Turkish)
   - Target (hypertrophy / strength / general fitness)
   - Days per week (3-6)
   - Target gender (male / female / unisex)
   - Difficulty (kolay / orta / zor)
3. **Research** the scientific basis for the program structure using available sources
4. **Create** the program object following the exact data shape:

```js
programKey: {
  id: 'programKey',
  name: 'Program Adı',
  emoji: '💪',
  color: '#HEX',
  subtitle: 'Kısa açıklama',
  targetGender: 'male' | 'female' | 'unisex',
  days: ['GUN_1', 'GUN_2', ...],
  program: {
    GUN_1: {
      color: '#HEX',
      emoji: '🏋️',
      subtitle: 'Gün açıklaması',
      exercises: [
        {
          id: 'exercise_id',
          name: 'Egzersiz Adı',
          muscle: 'Kas grubu',
          sets: 4,
          reps: '8-12',
          rpe: '8',
          rest: 90,
          note: 'Teknik notu (isteğe bağlı)'
        }
      ]
    }
  }
}
```

5. **Check** for ID collisions with existing programs
6. **Add** the program to `ALL_PROGRAMS` at `src/data/program.js`
7. **Add** a `targetGender` field if missing from existing adjacent programs
8. **Verify** the DayBasisCard in `src/components/Workout/DayBasisCard.jsx` has a matching entry for any new day types

## Quality Checklist
- [ ] 6-12 exercises per day (not more)
- [ ] All exercises have realistic set/rep/RPE targets
- [ ] Rest periods: T1=180s, T2=90-120s, T3=60-90s
- [ ] Exercise IDs are unique within the program
- [ ] Turkish exercise names where available
- [ ] Scientific rationale documented in a comment above the program object
