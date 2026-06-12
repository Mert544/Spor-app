import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useGamificationStore from '../../store/useGamificationStore';
import useWorkoutStore from '../../store/useWorkoutStore';
import useProgressStore from '../../store/useProgressStore';
import useSettingsStore from '../../store/useSettingsStore';
import useCustomProgramStore from '../../store/useCustomProgramStore';
import { ALL_PROGRAMS, getTodayDayIndex, parseProgramId } from '../../data/program';
import { SlideUp, FadeIn } from '../UI/AnimatedCard.jsx';

function StreakWidget() {
  const { streak, longestStreak, getStreakMessage, getLevelProgress } = useGamificationStore();
  const levelProgress = getLevelProgress();
  const message = getStreakMessage();

  return (
    <FadeIn>
      <div className="bg-gradient-to-br from-[#14B8A6]/20 to-[#8B5CF6]/20 border border-[#14B8A6]/30 rounded-2xl p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="text-4xl">
              {streak >= 30 ? '💎' : streak >= 7 ? '🔥' : streak >= 1 ? '⚡' : '🎯'}
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{streak}</p>
              <p className="text-xs text-white/60">Gün Seri</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-[#14B8A6]">Lv.{levelProgress.level}</p>
            <p className="text-xs text-white/40">En iyi: {longestStreak}</p>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="mb-2">
          <div className="flex justify-between text-xs text-white/50 mb-1">
            <span>{message}</span>
            <span>{levelProgress.current}/{levelProgress.required} XP</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] rounded-full transition-all duration-500"
              style={{ width: `${levelProgress.percentage}%` }}
            />
          </div>
        </div>

        {streak === 0 && (
          <p className="text-xs text-white/50 text-center mt-2">
            💡 Bugün antrenman yaparak seriyi başlat!
          </p>
        )}
      </div>
    </FadeIn>
  );
}

function DailyQuests() {
  const { dailyQuests, questsWaterML, questsSteps, completeQuest, getDailyQuestProgress, resetDailyQuests } = useGamificationStore();

  useEffect(() => {
    resetDailyQuests();
  }, []);

  const progress = getDailyQuestProgress();
  const quests = [
    {
      id: 'workout',
      title: 'Bugünkü Antrenman',
      icon: '🏋️',
      completed: dailyQuests.workout,
      onClick: () => completeQuest('workout'),
    },
    {
      id: 'water',
      title: 'Su Hedefi',
      icon: '💧',
      completed: dailyQuests.water,
      subtitle: `${Math.min(questsWaterML, 3000)}/3000ml`,
      onClick: () => {},
    },
    {
      id: 'step',
      title: 'Adım Hedefi',
      icon: '🚶',
      completed: dailyQuests.step,
      subtitle: `${Math.min(questsSteps, 10000).toLocaleString()}/10,000`,
      onClick: () => {},
    },
    {
      id: 'stretch',
      title: 'Esneme/Rahatlama',
      icon: '🧘',
      completed: dailyQuests.stretch,
      onClick: () => completeQuest('stretch'),
    },
  ];

  return (
    <SlideUp delay={0.1}>
      <div className="bg-bg-card border border-white/10 rounded-2xl p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">📋 Günlük Görevler</h3>
          <span className="text-xs text-[#14B8A6] font-medium">
            {progress.completed}/{progress.total} tamamlandı
          </span>
        </div>

        <div className="space-y-2">
          {quests.map((quest) => (
            <div
              key={quest.id}
              onClick={quest.onClick}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                quest.completed
                  ? 'bg-[#10B981]/10 border border-[#10B981]/20'
                  : 'bg-white/5 border border-white/5 hover:border-white/10 cursor-pointer'
              }`}
            >
              <span className="text-xl">{quest.completed ? '✅' : quest.icon}</span>
              <div className="flex-1">
                <p className={`text-sm font-medium ${quest.completed ? 'text-white/50 line-through' : 'text-white'}`}>
                  {quest.title}
                </p>
                {quest.subtitle && (
                  <p className="text-xs text-white/40">{quest.subtitle}</p>
                )}
              </div>
              {quest.completed && (
                <span className="text-xs text-[#10B981] font-medium">+20 XP</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </SlideUp>
  );
}

function WeeklyProgress() {
  const { logs } = useWorkoutStore();
  const today = new Date();
  const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
  const weekDays = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    const dayLogs = logs[dateStr];
    const hasWorkout = dayLogs && Object.values(dayLogs).some(exLogs =>
      Object.values(exLogs).some(s => s?.done)
    );
    weekDays.push({
      day: date.toLocaleDateString('tr-TR', { weekday: 'short' }).slice(0, 2),
      date: dateStr,
      hasWorkout,
      isToday: dateStr === new Date().toISOString().split('T')[0],
    });
  }

  const activeDays = weekDays.filter(d => d.hasWorkout).length;

  return (
    <SlideUp delay={0.15}>
      <div className="bg-bg-card border border-white/10 rounded-2xl p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">📊 Bu Hafta</h3>
          <span className="text-xs text-white/50">{activeDays}/7 gün aktif</span>
        </div>

        <div className="flex justify-between gap-2">
          {weekDays.map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all ${
                  day.hasWorkout
                    ? 'bg-[#14B8A6] text-white'
                    : day.isToday
                      ? 'bg-white/10 border border-[#14B8A6]/50 text-white'
                      : 'bg-white/5 text-white/40'
                }`}
              >
                {day.hasWorkout ? '✓' : day.day}
              </div>
            </div>
          ))}
        </div>

        {activeDays === 0 && (
          <p className="text-xs text-white/40 text-center mt-3">
            💡 Bugün başlayarak haftayı tamamla!
          </p>
        )}
      </div>
    </SlideUp>
  );
}

function QuickStats() {
  const { totalWorkouts, totalVolume, prCount, achievements } = useGamificationStore();
  const stats = [
    { label: 'Toplam Antrenman', value: totalWorkouts || '—', icon: '🏋️' },
    { label: 'Toplam Hacim', value: totalVolume > 0 ? `${Math.round(totalVolume / 1000)}k kg` : '—', icon: '💪' },
    { label: 'PR Sayısı', value: prCount || '—', icon: '🏆' },
    { label: 'Rozetler', value: achievements.length || '0', icon: '🏅' },
  ];

  return (
    <SlideUp delay={0.2}>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-bg-card border border-white/10 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <span>{stat.icon}</span>
              <span className="text-xs text-white/50">{stat.label}</span>
            </div>
            <p className="text-lg font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>
    </SlideUp>
  );
}

function TodayWorkout() {
  const logs = useWorkoutStore(s => s.logs);
  const activeProgram = useSettingsStore(s => s.activeProgram);
  const customPrograms = useCustomProgramStore(s => s.programs);

  const { isCustom, resolvedId } = parseProgramId(activeProgram);
  const programData = isCustom
    ? (customPrograms[resolvedId] || ALL_PROGRAMS['vtaper_orta'])
    : (ALL_PROGRAMS[resolvedId] || ALL_PROGRAMS['vtaper_orta']);

  const dayIndex = Math.min(getTodayDayIndex(), programData.days.length - 1);
  const dayKey = programData.days[dayIndex];
  const dayData = programData.program[dayKey] || {};
  const exercises = dayData.exercises || [];
  const isRestDay = exercises.length === 0 || /dinlenme/i.test(dayKey);
  const accentColor = dayData.color || '#14B8A6';

  // Gün adı: "Pzt - PUSH A" → "PUSH A"
  const dayLabel = dayKey?.includes(' - ') ? dayKey.split(' - ')[1] : dayKey;

  const today = new Date().toISOString().split('T')[0];
  const todayLogs = logs[today] || {};
  // Swap edilmiş egzersizler `${id}~slug` ID'siyle loglanır — ikisini de say
  const completedExercises = exercises.filter(ex =>
    Object.entries(todayLogs).some(([logId, exLogs]) =>
      (logId === ex.id || logId.startsWith(`${ex.id}~`)) &&
      Object.values(exLogs).some(s => s?.done)
    )
  ).length;
  const totalExercises = exercises.length;
  const allDone = totalExercises > 0 && completedExercises === totalExercises;

  if (isRestDay) {
    return (
      <SlideUp delay={0.25}>
        <Link to="/antrenman">
          <div className="bg-bg-card border border-white/10 rounded-2xl p-4 mb-4 hover:border-white/20 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl">
                🧘
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-white">{dayLabel || 'Dinlenme Günü'}</h3>
                <p className="text-xs text-white/50">
                  {dayData.subtitle || 'Toparlanma günü — hafif yürüyüş ve esneme iyi gelir'}
                </p>
              </div>
              <div className="text-white/30">→</div>
            </div>
          </div>
        </Link>
      </SlideUp>
    );
  }

  return (
    <SlideUp delay={0.25}>
      <Link to="/antrenman">
        <div
          className="bg-bg-card rounded-2xl p-4 mb-4 transition-all"
          style={{ border: `1px solid ${accentColor}4d` }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ backgroundColor: `${accentColor}20` }}
              >
                {allDone ? '✅' : dayData.emoji || '💪'}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Bugün: {dayLabel}</h3>
                <p className="text-xs text-white/50">
                  {dayData.subtitle && <span>{dayData.subtitle} · </span>}
                  {allDone
                    ? 'Tamamlandı 🎉'
                    : completedExercises > 0
                      ? `${completedExercises}/${totalExercises} egzersiz`
                      : `${totalExercises} egzersiz seni bekliyor`}
                </p>
              </div>
            </div>
            <div style={{ color: accentColor }}>→</div>
          </div>

          {completedExercises > 0 && (
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${(completedExercises / totalExercises) * 100}%`,
                  backgroundColor: accentColor,
                }}
              />
            </div>
          )}
        </div>
      </Link>
    </SlideUp>
  );
}

function RecentAchievements() {
  const { achievements, getRecentAchievements } = useGamificationStore();
  const recent = getRecentAchievements();

  if (recent.length === 0) return null;

  return (
    <SlideUp delay={0.3}>
      <div className="bg-bg-card border border-white/10 rounded-2xl p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">🏅 Son Başarılar</h3>
          <Link to="/analytics" className="text-xs text-[#14B8A6]">Tümünü gör</Link>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-1">
          {recent.map((achievement) => (
            <div
              key={achievement.id}
              className="flex-shrink-0 flex flex-col items-center gap-1 p-3 bg-white/5 rounded-xl min-w-[80px]"
            >
              <span className="text-2xl">{achievement.icon}</span>
              <span className="text-xs text-white/70 text-center">{achievement.title}</span>
            </div>
          ))}
        </div>
      </div>
    </SlideUp>
  );
}

const QUOTES = [
  { text: '"Vazgeçmek, başarısızlığın en büyük kaybıdır."', author: 'Henry Ford' },
  { text: '"Güç, dışarıda değil içinde."', author: 'Anonim' },
  { text: '"Her gün bir adım ileri."', author: 'Anonim' },
  { text: '"Disiplin, özgürlüğün sessiz ortağıdır."', author: 'Jim Rohn' },
  { text: '"Antrenmanın en zor kısmı salona gitmektir."', author: 'Anonim' },
  { text: '"Bugün yaptığın seçim, yarınki halini belirler."', author: 'Anonim' },
  { text: '"Kıyaslanman gereken tek kişi, dünkü sensin."', author: 'Anonim' },
];

function MotivationalQuote() {
  // Gün bazında sabit söz — her render'da değişmesin
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const quote = QUOTES[dayOfYear % QUOTES.length];

  return (
    <FadeIn delay={0.35}>
      <div className="bg-gradient-to-r from-[#8B5CF6]/10 to-[#E94560]/10 border border-white/10 rounded-2xl p-4 mb-4">
        <p className="text-sm text-white/80 italic mb-1">{quote.text}</p>
        <p className="text-xs text-white/40">— {quote.author}</p>
      </div>
    </FadeIn>
  );
}

export default function Dashboard() {
  const { resetDailyQuests } = useGamificationStore();
  const user = useSettingsStore(s => s.user);

  useEffect(() => {
    resetDailyQuests();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 6 ? 'İyi geceler' : hour < 12 ? 'Günaydın' : hour < 18 ? 'Merhaba' : 'İyi akşamlar';

  return (
    <div className="flex-1 overflow-y-auto p-4 pb-24">
      <SlideUp>
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-white">
            {greeting}{user?.name ? `, ${user.name}` : ''}! 👋
          </h1>
          <p className="text-sm text-white/50">Bugün neler yapacaksın?</p>
        </div>
      </SlideUp>

      <StreakWidget />
      <DailyQuests />
      <TodayWorkout />
      <WeeklyProgress />
      <QuickStats />
      <RecentAchievements />
      <MotivationalQuote />

      {/* Quick Actions */}
      <SlideUp delay={0.4}>
        <h3 className="text-sm font-semibold text-white/50 mb-3">Hızlı Erişim</h3>
        <div className="grid grid-cols-4 gap-2 mb-4">
          <Link
            to="/challenges"
            className="bg-bg-card border border-white/10 rounded-xl p-3 text-center hover:border-[#14B8A6]/30 transition-all"
          >
            <span className="text-xl mb-1 block">🏆</span>
            <span className="text-xs text-white/70">Challenge</span>
          </Link>
          <Link
            to="/leaderboard"
            className="bg-bg-card border border-white/10 rounded-xl p-3 text-center hover:border-[#14B8A6]/30 transition-all"
          >
            <span className="text-xl mb-1 block">🏅</span>
            <span className="text-xs text-white/70">Sıralama</span>
          </Link>
          <Link
            to="/beslenme"
            className="bg-bg-card border border-white/10 rounded-xl p-3 text-center hover:border-[#14B8A6]/30 transition-all"
          >
            <span className="text-xl mb-1 block">🥗</span>
            <span className="text-xs text-white/70">Beslenme</span>
          </Link>
          <Link
            to="/programlar"
            className="bg-bg-card border border-white/10 rounded-xl p-3 text-center hover:border-[#14B8A6]/30 transition-all"
          >
            <span className="text-xl mb-1 block">📋</span>
            <span className="text-xs text-white/70">Programlar</span>
          </Link>
        </div>
      </SlideUp>
    </div>
  );
}
