-- V-Taper Coach Analytics Tables Migration
-- Run this in Supabase SQL Editor to create analytics infrastructure

-- ─────────────────────────────────────────────────────────────────────────────
-- User Analytics Events
-- Tracks user actions for retention and engagement analysis
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.user_analytics (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  event_type text not null,
  event_data jsonb default '{}',
  created_at timestamptz default now()
);

create index if not exists idx_user_analytics_user_id on public.user_analytics(user_id);
create index if not exists idx_user_analytics_event_type on public.user_analytics(event_type);
create index if not exists idx_user_analytics_created_at on public.user_analytics(created_at);

-- Event types:
-- 'workout_complete', 'program_switch', 'feature_used', 'page_view',
-- 'subscription_start', 'subscription_cancel', 'app_open', 'app_close',
-- 'streak_milestone', 'weight_log', 'coach_message_sent'

-- ─────────────────────────────────────────────────────────────────────────────
-- Subscriptions Table
-- Tracks Stripe subscription status and history
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text unique,
  stripe_price_id text,
  tier text check (tier in ('free', 'premium', 'coach')),
  status text check (status in ('active', 'canceled', 'past_due', 'trialing', 'incomplete')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_subscriptions_user_id on public.subscriptions(user_id);
create index if not exists idx_subscriptions_stripe_customer on public.subscriptions(stripe_customer_id);
create index if not exists idx_subscriptions_status on public.subscriptions(status);

-- ─────────────────────────────────────────────────────────────────────────────
-- User Retention Metrics (Daily Aggregated)
-- Pre-aggregated daily metrics for dashboard performance
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.retention_metrics (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  date date not null,
  dau boolean default false,
  workouts_completed integer default 0,
  total_volume numeric default 0,
  active_minutes integer default 0,
  created_at timestamptz default now(),
  unique(user_id, date)
);

create index if not exists idx_retention_metrics_user_date on public.retention_metrics(user_id, date);

-- ─────────────────────────────────────────────────────────────────────────────
-- Feature Usage Tracking
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.feature_usage (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  feature_name text not null,
  usage_count integer default 1,
  last_used timestamptz default now(),
  created_at timestamptz default now()
);

create index if not exists idx_feature_usage_user on public.feature_usage(user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- Push Notification Subscriptions
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.push_subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  endpoint text not null,
  keys jsonb not null,
  created_at timestamptz default now()
);

create index if not exists idx_push_subscriptions_user on public.push_subscriptions(user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- Functions
-- ─────────────────────────────────────────────────────────────────────────────

-- Function to log analytics event
create or replace function public.log_analytics_event(
  p_user_id uuid,
  p_event_type text,
  p_event_data jsonb default '{}'
)
returns uuid as $$
declare
  v_event_id uuid;
begin
  insert into public.user_analytics (user_id, event_type, event_data)
  values (p_user_id, p_event_type, p_event_data)
  returning id into v_event_id;
  return v_event_id;
end;
$$ language plpgsql security definer;

-- Function to update retention metrics
create or replace function public.update_retention_metrics(
  p_user_id uuid,
  p_date date,
  p_workouts integer default 0,
  p_volume numeric default 0,
  p_minutes integer default 0
)
returns void as $$
begin
  insert into public.retention_metrics (user_id, date, dau, workouts_completed, total_volume, active_minutes)
  values (p_user_id, p_date, true, p_workouts, p_volume, p_minutes)
  on conflict (user_id, date)
  do update set
    dau = true,
    workouts_completed = retention_metrics.workouts_completed + p_workouts,
    total_volume = retention_metrics.total_volume + p_volume,
    active_minutes = retention_metrics.active_minutes + p_minutes;
end;
$$ language plpgsql security definer;

-- Trigger to auto-update updated_at
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.update_updated_at();
