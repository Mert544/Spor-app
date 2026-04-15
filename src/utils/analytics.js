// Analytics tracking utility
// Logs events to Supabase for retention and engagement analysis

import { supabase, isSupabaseConfigured } from '../lib/supabase';

const EVENT_TYPES = {
  WORKOUT_COMPLETE: 'workout_complete',
  PROGRAM_SWITCH: 'program_switch',
  FEATURE_USED: 'feature_used',
  PAGE_VIEW: 'page_view',
  SUBSCRIPTION_START: 'subscription_start',
  SUBSCRIPTION_CANCEL: 'subscription_cancel',
  APP_OPEN: 'app_open',
  APP_CLOSE: 'app_close',
  STREAK_MILESTONE: 'streak_milestone',
  WEIGHT_LOG: 'weight_log',
  COACH_MESSAGE_SENT: 'coach_message_sent',
};

const FEATURES = {
  AI_COACH: 'ai_coach',
  CUSTOM_PROGRAMS: 'custom_programs',
  ADVANCED_ANALYTICS: 'advanced_analytics',
  FORM_VIDEOS: 'form_videos',
  MEAL_PLANNING: 'meal_planning',
  PROGRESS_PHOTOS: 'progress_photos',
  SUPPLEMENT_GUIDE: 'supplement_guide',
};

export async function logEvent(userId, eventType, eventData = {}) {
  if (!isSupabaseConfigured || !supabase || !userId) return null;

  try {
    const { data, error } = await supabase
      .from('user_analytics')
      .insert({
        user_id: userId,
        event_type: eventType,
        event_data: eventData,
      })
      .select('id')
      .single();

    if (error) {
      console.warn('[analytics] Failed to log event:', error);
      return null;
    }
    return data?.id;
  } catch (err) {
    console.warn('[analytics] Error logging event:', err);
    return null;
  }
}

export async function logFeatureUsage(userId, featureName) {
  if (!isSupabaseConfigured || !supabase || !userId) return;

  try {
    await supabase.rpc('log_feature_usage', {
      p_user_id: userId,
      p_feature: featureName,
    });
  } catch (err) {
    const { data, error } = await supabase
      .from('feature_usage')
      .select('id, usage_count')
      .eq('user_id', userId)
      .eq('feature_name', featureName)
      .maybeSingle();

    if (data) {
      await supabase
        .from('feature_usage')
        .update({
          usage_count: data.usage_count + 1,
          last_used: new Date().toISOString(),
        })
        .eq('id', data.id);
    } else {
      await supabase
        .from('feature_usage')
        .insert({
          user_id: userId,
          feature_name: featureName,
          usage_count: 1,
        });
    }
  }
}

export async function updateRetentionMetrics(userId, metrics = {}) {
  if (!isSupabaseConfigured || !supabase || !userId) return;

  const today = new Date().toISOString().split('T')[0];

  try {
    await supabase.rpc('update_retention_metrics', {
      p_user_id: userId,
      p_date: today,
      p_workouts: metrics.workoutsCompleted || 0,
      p_volume: metrics.totalVolume || 0,
      p_minutes: metrics.activeMinutes || 0,
    });
  } catch (err) {
    console.warn('[analytics] Failed to update retention metrics:', err);
  }
}

export async function getUserAnalytics(userId, options = {}) {
  if (!isSupabaseConfigured || !supabase || !userId) return null;

  const { days = 30, eventType = null } = options;

  let query = supabase
    .from('user_analytics')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
    .order('created_at', { ascending: false });

  if (eventType) {
    query = query.eq('event_type', eventType);
  }

  const { data, error } = await query;

  if (error) {
    console.warn('[analytics] Failed to fetch analytics:', error);
    return null;
  }

  return data;
}

export async function getRetentionMetrics(userId, days = 30) {
  if (!isSupabaseConfigured || !supabase || !userId) return null;

  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('retention_metrics')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate)
    .order('date', { ascending: true });

  if (error) {
    console.warn('[analytics] Failed to fetch retention metrics:', error);
    return null;
  }

  return data;
}

export async function getFeatureUsage(userId) {
  if (!isSupabaseConfigured || !supabase || !userId) return [];

  const { data, error } = await supabase
    .from('feature_usage')
    .select('*')
    .eq('user_id', userId)
    .order('last_used', { ascending: false });

  if (error) {
    console.warn('[analytics] Failed to fetch feature usage:', error);
    return [];
  }

  return data;
}

export async function getSubscriptionStatus(userId) {
  if (!isSupabaseConfigured || !supabase || !userId) return null;

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.warn('[analytics] Failed to fetch subscription:', error);
    return null;
  }

  return data;
}

export { EVENT_TYPES, FEATURES };
