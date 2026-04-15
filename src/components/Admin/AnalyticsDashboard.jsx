import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import useAuthStore from '../../store/useAuthStore';
import { getRetentionMetrics, getFeatureUsage, EVENT_TYPES } from '../../utils/analytics';
import { SlideUp } from '../UI/AnimatedCard.jsx';
import { TextSkeleton, CardSkeleton } from '../UI/Skeleton.jsx';

const COLORS = ['#14B8A6', '#3B82F6', '#8B5CF6', '#E94560', '#F59E0B'];

export default function AnalyticsDashboard() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [retentionData, setRetentionData] = useState([]);
  const [featureUsage, setFeatureUsage] = useState([]);
  const [summary, setSummary] = useState({
    totalWorkouts: 0,
    totalVolume: 0,
    activeDays: 0,
    currentStreak: 0,
  });

  useEffect(() => {
    loadAnalytics();
  }, [user?.id]);

  async function loadAnalytics() {
    if (!user?.id) return;

    setLoading(true);
    try {
      const [retention, features] = await Promise.all([
        getRetentionMetrics(user.id, 30),
        getFeatureUsage(user.id),
      ]);

      if (retention) {
        setRetentionData(retention);

        const totalWorkouts = retention.reduce((sum, d) => sum + (d.workouts_completed || 0), 0);
        const totalVolume = retention.reduce((sum, d) => sum + (d.total_volume || 0), 0);
        const activeDays = retention.filter(d => d.dau).length;

        let streak = 0;
        for (let i = retention.length - 1; i >= 0; i--) {
          if (retention[i].dau) streak++;
          else break;
        }

        setSummary({
          totalWorkouts,
          totalVolume: Math.round(totalVolume),
          activeDays,
          currentStreak: streak,
        });
      }

      if (features) {
        setFeatureUsage(features.map(f => ({
          name: formatFeatureName(f.feature_name),
          value: f.usage_count,
        })));
      }
    } catch (err) {
      console.error('[analytics] Failed to load:', err);
    } finally {
      setLoading(false);
    }
  }

  function formatFeatureName(name) {
    const names = {
      ai_coach: 'AI Koç',
      custom_programs: 'Özel Programlar',
      advanced_analytics: 'Analitik',
      form_videos: 'Form Videoları',
      meal_planning: 'Yemek Planı',
      progress_photos: 'Fotoğraflar',
      supplement_guide: 'Takviye Rehberi',
    };
    return names[name] || name;
  }

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  const chartData = retentionData.map(d => ({
    date: new Date(d.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
    workouts: d.workouts_completed || 0,
    volume: Math.round((d.total_volume || 0) / 1000),
  }));

  return (
    <div className="flex-1 overflow-y-auto p-4 pb-20">
      <SlideUp>
        <h1 className="text-2xl font-bold text-white mb-6">📊 Analitik</h1>
      </SlideUp>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <SlideUp delay={0.05}>
          <div className="bg-bg-card border border-white/10 rounded-2xl p-4">
            <p className="text-xs text-white/50 mb-1">Toplam Antrenman</p>
            <p className="text-2xl font-bold text-white">{summary.totalWorkouts}</p>
            <p className="text-xs text-[#14B8A6]">son 30 günde</p>
          </div>
        </SlideUp>

        <SlideUp delay={0.1}>
          <div className="bg-bg-card border border-white/10 rounded-2xl p-4">
            <p className="text-xs text-white/50 mb-1">Toplam Hacim</p>
            <p className="text-2xl font-bold text-white">{summary.totalVolume}kg</p>
            <p className="text-xs text-[#3B82F6]">kaldırılan ağırlık</p>
          </div>
        </SlideUp>

        <SlideUp delay={0.15}>
          <div className="bg-bg-card border border-white/10 rounded-2xl p-4">
            <p className="text-xs text-white/50 mb-1">Aktif Gün</p>
            <p className="text-2xl font-bold text-white">{summary.activeDays}</p>
            <p className="text-xs text-[#8B5CF6]">bu ay</p>
          </div>
        </SlideUp>

        <SlideUp delay={0.2}>
          <div className="bg-bg-card border border-white/10 rounded-2xl p-4">
            <p className="text-xs text-white/50 mb-1">Güncel Seri</p>
            <p className="text-2xl font-bold text-white">{summary.currentStreak}🔥</p>
            <p className="text-xs text-[#E94560]">gün üst üste</p>
          </div>
        </SlideUp>
      </div>

      {/* Workout Chart */}
      <SlideUp delay={0.25}>
        <div className="bg-bg-card border border-white/10 rounded-2xl p-4 mb-6">
          <h3 className="text-sm font-semibold text-white mb-4">Haftalık Antrenmanlar</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData}>
                <XAxis
                  dataKey="date"
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                  labelStyle={{ color: 'rgba(255,255,255,0.5)' }}
                />
                <Bar dataKey="workouts" fill="#14B8A6" radius={[4, 4, 0, 0]} name="Antrenman" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-40 text-white/30 text-sm">
              Henüz veri yok
            </div>
          )}
        </div>
      </SlideUp>

      {/* Feature Usage */}
      {featureUsage.length > 0 && (
        <SlideUp delay={0.3}>
          <div className="bg-bg-card border border-white/10 rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-white mb-4">Özellik Kullanımı</h3>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={120} height={120}>
                <PieChart>
                  <Pie
                    data={featureUsage}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                  >
                    {featureUsage.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {featureUsage.slice(0, 5).map((f, i) => (
                  <div key={f.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                    />
                    <span className="text-xs text-white/70 flex-1">{f.name}</span>
                    <span className="text-xs text-white/50">{f.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SlideUp>
      )}

      {/* Insights */}
      <SlideUp delay={0.35}>
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-white mb-3">💡 İstatistikler</h3>
          <div className="space-y-2">
            {summary.totalWorkouts > 0 && (
              <div className="bg-bg-card border border-white/10 rounded-xl p-3">
                <p className="text-xs text-white/70">
                  🎉 Son 30 günde <span className="text-[#14B8A6] font-semibold">{summary.totalWorkouts} antrenman</span> yaptın!
                  {summary.currentStreak >= 3 && ` Seri: ${summary.currentStreak} gün 🔥`}
                </p>
              </div>
            )}
            {summary.totalVolume > 0 && (
              <div className="bg-bg-card border border-white/10 rounded-xl p-3">
                <p className="text-xs text-white/70">
                  💪 Toplam <span className="text-[#3B82F6] font-semibold">{summary.totalVolume}kg</span> hacim kaldırdın.
                </p>
              </div>
            )}
            {summary.activeDays >= 20 && (
              <div className="bg-bg-card border border-white/10 rounded-xl p-3">
                <p className="text-xs text-white/70">
                  ⭐ Harika! Bu ayın <span className="text-[#8B5CF6] font-semibold">{Math.round((summary.activeDays / 30) * 100)}%</span> aktif geçirdin.
                </p>
              </div>
            )}
          </div>
        </div>
      </SlideUp>
    </div>
  );
}
