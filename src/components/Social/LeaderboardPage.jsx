import { useState } from 'react';
import useGamificationStore from '../../store/useGamificationStore';
import { SlideUp, FadeIn } from '../UI/AnimatedCard.jsx';

const MOCK_LEADERBOARD = [
  { rank: 1, name: 'Ahmet Y.', streak: 45, avatar: '👨‍🦱', level: 28 },
  { rank: 2, name: 'Elif K.', streak: 38, avatar: '👩‍🦰', level: 25 },
  { rank: 3, name: 'Murat T.', streak: 32, avatar: '👨‍🦳', level: 22 },
  { rank: 4, name: 'Zeynep A.', streak: 28, avatar: '👩', level: 20 },
  { rank: 5, name: 'Ali R.', streak: 25, avatar: '👨', level: 18 },
];

export default function LeaderboardPage() {
  const { level, streak, totalWorkouts, xp } = useGamificationStore();
  const [selectedPeriod, setSelectedPeriod] = useState('haftalık');
  const [selectedTab, setSelectedTab] = useState('seri');

  const currentUser = {
    rank: 12,
    name: 'Sen',
    streak: streak,
    avatar: '😊',
    level: level,
    workouts: totalWorkouts,
    xp: xp,
  };

  const getMedal = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return 'text-yellow-400';
    if (rank === 2) return 'text-gray-300';
    if (rank === 3) return 'text-amber-600';
    return 'text-white/50';
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 pb-20">
      <SlideUp>
        <h1 className="text-2xl font-bold text-white mb-4">🏆 Leaderboard</h1>
      </SlideUp>

      {/* Current User Card */}
      <SlideUp delay={0.05}>
        <div className="bg-gradient-to-br from-[#14B8A6]/20 to-[#8B5CF6]/20 border border-[#14B8A6]/30 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#14B8A6]/20 flex items-center justify-center text-3xl">
              {currentUser.avatar}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-white">{currentUser.name}</span>
                <span className="text-xs bg-[#14B8A6]/20 text-[#14B8A6] px-2 py-0.5 rounded-full">
                  Lv.{currentUser.level}
                </span>
              </div>
              <p className="text-sm text-white/60">Sıralama: #{currentUser.rank}</p>
              <div className="flex gap-4 mt-2">
                <span className="text-xs text-white/50">🔥 {currentUser.streak} gün seri</span>
                <span className="text-xs text-white/50">🏋️ {currentUser.workouts} antrenman</span>
              </div>
            </div>
          </div>
        </div>
      </SlideUp>

      {/* Tabs */}
      <SlideUp delay={0.1}>
        <div className="flex gap-2 mb-4">
          {[
            { id: 'seri', label: '🔥 Seri' },
            { id: 'hacim', label: '💪 Hacim' },
            { id: 'seviye', label: '⭐ Seviye' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                selectedTab === tab.id
                  ? 'bg-[#14B8A6] text-white'
                  : 'bg-bg-card text-white/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </SlideUp>

      {/* Period Selector */}
      <SlideUp delay={0.15}>
        <div className="flex gap-2 mb-4">
          {[
            { id: 'haftalık', label: 'Bu Hafta' },
            { id: 'aylik', label: 'Bu Ay' },
            { id: 'tum', label: 'Tüm Zamanlar' },
          ].map((period) => (
            <button
              key={period.id}
              onClick={() => setSelectedPeriod(period.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedPeriod === period.id
                  ? 'bg-white/10 text-white'
                  : 'text-white/40'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </SlideUp>

      {/* Leaderboard List */}
      <div className="space-y-2">
        {MOCK_LEADERBOARD.map((user, index) => (
          <FadeIn key={user.rank} delay={0.2 + index * 0.05}>
            <div className={`bg-bg-card border rounded-xl p-3 flex items-center gap-3 ${
              user.rank <= 3 ? 'border-yellow-500/30' : 'border-white/10'
            }`}>
              <div className={`w-8 h-8 flex items-center justify-center font-bold ${
                user.rank <= 3 ? 'text-lg' : 'text-sm'
              } ${getRankColor(user.rank)}`}>
                {getMedal(user.rank) || `#${user.rank}`}
              </div>

              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl">
                {user.avatar}
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-white/40">Lv.{user.level}</p>
              </div>

              <div className="text-right">
                <p className="text-sm font-semibold text-white">🔥 {user.streak}</p>
                <p className="text-xs text-white/40">gün seri</p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      {/* Your Position */}
      <FadeIn delay={0.5}>
        <div className="mt-4 bg-bg-card border border-[#14B8A6]/30 rounded-xl p-3 flex items-center gap-3">
          <div className={`w-8 h-8 flex items-center justify-center font-bold text-sm ${getRankColor(currentUser.rank)}`}>
            #{currentUser.rank}
          </div>

          <div className="w-10 h-10 rounded-xl bg-[#14B8A6]/20 flex items-center justify-center text-xl">
            {currentUser.avatar}
          </div>

          <div className="flex-1">
            <p className="text-sm font-medium text-white">{currentUser.name}</p>
            <p className="text-xs text-white/40">Sen</p>
          </div>

          <div className="text-right">
            <p className="text-sm font-semibold text-[#14B8A6]">🔥 {currentUser.streak}</p>
            <p className="text-xs text-white/40">gün seri</p>
          </div>
        </div>
      </FadeIn>

      {/* Motivation */}
      <FadeIn delay={0.55}>
        <div className="mt-6 text-center">
          <p className="text-sm text-white/50">
            💡 Üst sıralara çıkmak için her gün antrenman yapmaya devam et!
          </p>
        </div>
      </FadeIn>
    </div>
  );
}
