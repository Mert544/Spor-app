import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import useGamificationStore from '../../store/useGamificationStore';
import useWorkoutStore from '../../store/useWorkoutStore';
import useProgressStore from '../../store/useProgressStore';
import useSettingsStore from '../../store/useSettingsStore';
import useNutritionStore from '../../store/useNutritionStore';
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
  const { dailyQuests, questsWaterML, questsSteps, completeQuest, addWater, addSteps, getDailyQuestProgress, resetDailyQuests } = useGamificationStore();
  const nutritionAddWater = useNutritionStore(s => s.addWater);
  const [showWaterPicker, setShowWaterPicker] = useState(false);
  const [showStepInput, setShowStepInput] = useState(false);
  const [stepInput, setStepInput] = useState('');

  useEffect(() => {
    resetDailyQuests();
  }, []);

  const progress = getDailyQuestProgress();

  const waterOptions = [
    { label: '250ml', value: 250 },
    { label: '500ml', value: 500 },
    { label: '750ml', value: 750 },
    { label: '1L', value: 1000 },
  ];

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
      progress: Math.min(questsWaterML / 3000, 1),
      onClick: () => !dailyQuests.water && setShowWaterPicker(v => !v),
    },
    {
      id: 'step',
      title: 'Adım Hedefi',
      icon: '🚶',
      completed: dailyQuests.step,
      subtitle: `${Math.min(questsSteps, 10000).toLocaleString()}/10,000`,
      progress: Math.min(questsSteps / 10000, 1),
      onClick: () => !dailyQuests.step && setShowStepInput(v => !v),
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
          <h3 className="text-sm font-semibold text-white">Günlük Görevler</h3>
          <span className="text-xs text-[#14B8A6] font-medium">
            {progress.completed}/{progress.total} tamamlandı
          </span>
        </div>

        <div className="space-y-2">
          {quests.map((quest) => (
            <div key={quest.id}>
              <div
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
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#14B8A6] rounded-full transition-all duration-300"
                          style={{ width: `${(quest.progress || 0) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-white/40 flex-shrink-0">{quest.subtitle}</p>
                    </div>
                  )}
                </div>
                {quest.completed && (
                  <span className="text-xs text-[#10B981] font-medium">+20 XP</span>
                )}
              </div>

              {quest.id === 'water' && showWaterPicker && !dailyQuests.water && (
                <div className="flex gap-2 mt-2 ml-10">
                  {waterOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        addWater(opt.value);
                        nutritionAddWater(new Date().toISOString().split('T')[0], opt.value);
                        setShowWaterPicker(false);
                      }}
                      className="flex-1 py-2 rounded-lg text-xs font-medium bg-[#14B8A6]/10 text-[#14B8A6] border border-[#14B8A6]/20 hover:bg-[#14B8A6]/20 transition-all"
                    >
                      +{opt.label}
                    </button>
                  ))}
                </div>
              )}

              {quest.id === 'step' && showStepInput && !dailyQuests.step && (
                <div className="flex gap-2 mt-2 ml-10">
                  {[1000, 2500, 5000, 10000].map((val) => (
                    <button
                      key={val}
                      onClick={() => { addSteps(val); setShowStepInput(false); }}
                      className="flex-1 py-2 rounded-lg text-xs font-medium bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20 hover:bg-[#8B5CF6]/20 transition-all"
                    >
                      +{val >= 1000 ? `${val / 1000}k` : val}
                    </button>
                  ))}
                </div>
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
    { label: 'Toplam Antrenman', value: totalWorkouts || '—', icon: '🏋️', link: '/ilerleme' },
    { label: 'Toplam Hacim', value: totalVolume > 0 ? `${Math.round(totalVolume / 1000)}k kg` : '—', icon: '💪', link: '/ilerleme' },
    { label: 'PR Sayısı', value: prCount || '—', icon: '🏆', link: '/ilerleme' },
    { label: 'Rozetler', value: achievements.length || '0', icon: '🏅', link: '/ilerleme' },
  ];

  return (
    <SlideUp delay={0.2}>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {stats.map((stat, i) => (
          <Link key={i} to={stat.link}>
            <div className="bg-bg-card border border-white/10 rounded-xl p-3 hover:border-[#14B8A6]/30 transition-all">
              <div className="flex items-center gap-2 mb-1">
                <span>{stat.icon}</span>
                <span className="text-xs text-white/50">{stat.label}</span>
              </div>
              <p className="text-lg font-bold text-white">{stat.value}</p>
            </div>
          </Link>
        ))}
      </div>
    </SlideUp>
  );
}

function TodayWorkout() {
  const { logs } = useWorkoutStore();
  const today = new Date().toISOString().split('T')[0];
  const todayLogs = logs[today] || {};
  const completedExercises = Object.values(todayLogs).filter(exLogs =>
    Object.values(exLogs).some(s => s?.done)
  ).length;
  const totalExercises = Object.keys(todayLogs).length || 5;

  return (
    <SlideUp delay={0.25}>
      <Link to="/antenman">
        <div className="bg-bg-card border border-[#14B8A6]/30 rounded-2xl p-4 mb-4 hover:border-[#14B8A6]/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#14B8A6]/20 flex items-center justify-center text-2xl">
                💪
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Bugünkü Antrenman</h3>
                <p className="text-xs text-white/50">
                  {completedExercises > 0 ? `${completedExercises}/${totalExercises} egzersiz` : 'Başlamak için tıkla'}
                </p>
              </div>
            </div>
            <div className="text-[#14B8A6]">
              →
            </div>
          </div>

          {completedExercises > 0 && (
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#14B8A6] rounded-full transition-all"
                style={{ width: `${(completedExercises / totalExercises) * 100}%` }}
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

function MotivationalQuote() {
  const quotes = [
    { text: '"Vazgeçmek, başarısızlığın en büyük kaybıdır."', author: 'Henry Ford' },
    { text: '"Güç, dışarıda değil içinde."', author: 'Marcus Aurelius' },
    { text: '"Her gün bir adım ileri."', author: 'Anonim' },
    { text: '"Disiplin, özgürlüğün sessiz ortağıdır."', author: 'Jim Rohn' },
    { text: '"Dün yapmaya cesaret edemediğin şeyi bugün yap."', author: 'Wayne Dyer' },
    { text: '"Bedenin, aklının bıraktığı yerden çok sonra devam edebilir."', author: 'David Goggins' },
    { text: '"Küçük adımlar, büyük mesafeler kat eder."', author: 'Anonim' },
    { text: '"Başarı, her gün tekrarlanan küçük çabaların toplamıdır."', author: 'Robert Collier' },
    { text: '"Acı geçicidir, vazgeçmek sonsuzdur."', author: 'Lance Armstrong' },
    { text: '"En zor antrenman, kapıdan çıkmaktır."', author: 'Anonim' },
    { text: '"Bugünün ağrısı, yarının gücüdür."', author: 'Jay Cutler' },
    { text: '"Limitler sadece senin kafanda."', author: 'Arnold Schwarzenegger' },
  ];

  const todayIndex = useMemo(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    return dayOfYear % quotes.length;
  }, []);

  const quote = quotes[todayIndex];

  return (
    <FadeIn delay={0.35}>
      <div className="bg-gradient-to-r from-[#8B5CF6]/10 to-[#E94560]/10 border border-white/10 rounded-2xl p-4 mb-4">
        <p className="text-sm text-white/80 italic mb-1">{quote.text}</p>
        <p className="text-xs text-white/40">— {quote.author}</p>
      </div>
    </FadeIn>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 6) return 'İyi geceler';
  if (hour < 12) return 'Günaydın';
  if (hour < 18) return 'İyi günler';
  return 'İyi akşamlar';
}

function getSubGreeting() {
  const hour = new Date().getHours();
  if (hour < 6) return 'Erken saatte motivasyon tam!';
  if (hour < 12) return 'Bugünkü antrenmanına hazır mısın?';
  if (hour < 18) return 'Bugün neler yapacaksın?';
  return 'Akşam antrenmanı zamanı!';
}

export default function Dashboard() {
  const { resetDailyQuests } = useGamificationStore();
  const userName = useSettingsStore(s => s.user?.name);

  useEffect(() => {
    resetDailyQuests();
  }, []);

  const greeting = getGreeting();
  const subGreeting = getSubGreeting();

  return (
    <div className="flex-1 overflow-y-auto p-4 pb-24">
      <SlideUp>
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-white">
            {greeting}{userName ? `, ${userName}` : ''}!
          </h1>
          <p className="text-sm text-white/50">{subGreeting}</p>
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
            to="/ilerleme"
            className="bg-bg-card border border-white/10 rounded-xl p-3 text-center hover:border-[#14B8A6]/30 transition-all"
          >
            <span className="text-xl mb-1 block">📊</span>
            <span className="text-xs text-white/70">İlerleme</span>
          </Link>
        </div>
      </SlideUp>
    </div>
  );
}
