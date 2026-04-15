import { useEffect } from 'react';
import useChallengeStore, { CHALLENGES } from '../../store/useChallengeStore';
import useGamificationStore from '../../store/useGamificationStore';
import { SlideUp, FadeIn } from '../UI/AnimatedCard.jsx';

function ChallengeCard({ challenge, progress, percentage, timeRemaining, onStart }) {
  const isActive = progress > 0;
  const isCompleted = percentage >= 100;

  const tierColors = {
    bronze: { bg: 'from-amber-700/20 to-amber-900/20', border: 'border-amber-600/30', text: 'text-amber-500' },
    silver: { bg: 'from-gray-400/20 to-gray-600/20', border: 'border-gray-400/30', text: 'text-gray-300' },
    gold: { bg: 'from-yellow-500/20 to-yellow-700/20', border: 'border-yellow-500/30', text: 'text-yellow-500' },
  };

  const colors = tierColors[challenge.tier] || tierColors.bronze;

  return (
    <div className={`bg-bg-card border rounded-2xl p-4 mb-3 ${isActive ? colors.border : 'border-white/10'}`}>
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
          isCompleted ? 'bg-[#10B981]/20' : isActive ? `${colors.bg} border ${colors.border}` : 'bg-white/5'
        }`}>
          {isCompleted ? '✅' : challenge.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className={`font-semibold text-white ${isCompleted ? 'line-through opacity-50' : ''}`}>
              {challenge.title}
            </h3>
            <span className={`text-xs ${colors.text}`}>{challenge.tier.toUpperCase()}</span>
          </div>
          <p className="text-xs text-white/50 mt-0.5">{challenge.description}</p>
        </div>
      </div>

      {isActive && !isCompleted && (
        <>
          <div className="mb-2">
            <div className="flex justify-between text-xs text-white/50 mb-1">
              <span>{progress.toLocaleString()} / {challenge.goal.toLocaleString()} {challenge.unit}</span>
              <span>{percentage}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  challenge.tier === 'gold' ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                  challenge.tier === 'silver' ? 'bg-gradient-to-r from-gray-400 to-gray-300' :
                  'bg-gradient-to-r from-amber-600 to-amber-400'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
          {timeRemaining && (
            <p className="text-xs text-white/40">⏰ {timeRemaining}</p>
          )}
        </>
      )}

      {isCompleted && (
        <div className="flex items-center gap-2 text-[#10B981]">
          <span>✅</span>
          <span className="text-sm font-medium">Tamamlandı!</span>
          <span className="text-xs">+{challenge.xpReward} XP</span>
        </div>
      )}

      {!isActive && !isCompleted && (
        <button
          onClick={() => onStart(challenge.id)}
          className="w-full py-2.5 bg-[#14B8A6]/10 border border-[#14B8A6]/30 rounded-xl text-sm font-medium text-[#14B8A6] hover:bg-[#14B8A6]/20 transition-colors"
        >
          Başla
        </button>
      )}
    </div>
  );
}

function ActiveChallengeCard({ challenge, onClick }) {
  const { getChallengeById, getTimeRemaining, challengeProgress } = useChallengeStore();
  const fullChallenge = getChallengeById(challenge);
  if (!fullChallenge) return null;

  const progress = challengeProgress[challenge]?.current || 0;
  const percentage = Math.min(100, Math.round((progress / fullChallenge.goal) * 100));
  const timeRemaining = getTimeRemaining(challenge);

  return (
    <div
      onClick={onClick}
      className="bg-bg-card border border-[#14B8A6]/30 rounded-2xl p-4 mb-3 cursor-pointer hover:border-[#14B8A6]/50 transition-all"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#14B8A6]/20 to-[#8B5CF6]/20 flex items-center justify-center text-3xl">
          {fullChallenge.icon}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-white">{fullChallenge.title}</h3>
          <p className="text-xs text-white/50">{fullChallenge.description}</p>
        </div>
      </div>

      <div className="mb-2">
        <div className="flex justify-between text-xs text-white/50 mb-1">
          <span>{progress.toLocaleString()} / {fullChallenge.goal.toLocaleString()} {fullChallenge.unit}</span>
          <span className="text-[#14B8A6] font-medium">{percentage}%</span>
        </div>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-white/40">⏰ {timeRemaining}</span>
        <span className="text-xs text-[#14B8A6]">+{fullChallenge.xpReward} XP</span>
      </div>
    </div>
  );
}

function CompletedChallengeCard({ challenge }) {
  const fullChallenge = CHALLENGES.find(c => c.id === challenge);
  if (!fullChallenge) return null;

  return (
    <div className="bg-bg-card border border-[#10B981]/20 rounded-xl p-3 flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-[#10B981]/10 flex items-center justify-center text-xl">
        {fullChallenge.icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-white/70">{fullChallenge.title}</p>
        <p className="text-xs text-[#10B981]">Tamamlandı ✓</p>
      </div>
      <span className="text-xs text-white/40">+{fullChallenge.xpReward}</span>
    </div>
  );
}

export default function ChallengePage() {
  const {
    activeChallenges,
    completedChallenges,
    getActiveChallenges,
    getAvailableChallenges,
    getCompletedChallenges,
    startChallenge,
    addProgress,
    resetWeeklyChallenges,
  } = useChallengeStore();

  const { addXP, xp } = useGamificationStore();

  useEffect(() => {
    resetWeeklyChallenges();
  }, []);

  const activeList = getActiveChallenges();
  const availableList = getAvailableChallenges();
  const completedList = getCompletedChallenges();

  const handleStartChallenge = (challengeId) => {
    startChallenge(challengeId);
  };

  const stats = {
    active: activeList.length,
    completed: completedList.length,
    totalXP: completedList.reduce((sum, id) => {
      const c = CHALLENGES.find(ch => ch.id === id);
      return sum + (c?.xpReward || 0);
    }, 0),
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 pb-20">
      <SlideUp>
        <h1 className="text-2xl font-bold text-white mb-4">🏆 Challenge'lar</h1>
      </SlideUp>

      {/* Stats */}
      <SlideUp delay={0.05}>
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-bg-card border border-white/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-[#14B8A6]">{stats.active}</p>
            <p className="text-xs text-white/50">Aktif</p>
          </div>
          <div className="bg-bg-card border border-white/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-[#10B981]">{stats.completed}</p>
            <p className="text-xs text-white/50">Tamamlandı</p>
          </div>
          <div className="bg-bg-card border border-white/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-yellow-500">{stats.totalXP}</p>
            <p className="text-xs text-white/50">XP Kazanıldı</p>
          </div>
        </div>
      </SlideUp>

      {/* Active Challenges */}
      {activeList.length > 0 && (
        <div className="mb-6">
          <SlideUp delay={0.1}>
            <h2 className="text-lg font-semibold text-white mb-3">🔥 Aktif Challenge'lar</h2>
          </SlideUp>
          {activeList.map((challenge) => (
            <FadeIn key={challenge.id} delay={0.15}>
              <ActiveChallengeCard
                challenge={challenge.id}
                onClick={() => {}}
              />
            </FadeIn>
          ))}
        </div>
      )}

      {/* Available Challenges */}
      {availableList.length > 0 && (
        <div className="mb-6">
          <SlideUp delay={0.2}>
            <h2 className="text-lg font-semibold text-white mb-3">✨ Başlayabileceklerin</h2>
          </SlideUp>
          {availableList.map((challenge) => (
            <FadeIn key={challenge.id} delay={0.25}>
              <ChallengeCard
                challenge={challenge}
                progress={0}
                percentage={0}
                timeRemaining={null}
                onStart={handleStartChallenge}
              />
            </FadeIn>
          ))}
        </div>
      )}

      {/* Completed Challenges */}
      {completedList.length > 0 && (
        <div className="mb-6">
          <SlideUp delay={0.3}>
            <h2 className="text-lg font-semibold text-white mb-3">✅ Tamamlananlar</h2>
          </SlideUp>
          <div className="space-y-2">
            {completedList.map((id) => (
              <FadeIn key={id} delay={0.35}>
                <CompletedChallengeCard challenge={id} />
              </FadeIn>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {activeList.length === 0 && availableList.length === 0 && (
        <FadeIn>
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-lg font-semibold text-white mb-2">Tüm Challenge'ları Tamamladın!</h3>
            <p className="text-sm text-white/50">Yeni challenge'lar için takipte kal.</p>
          </div>
        </FadeIn>
      )}
    </div>
  );
}
