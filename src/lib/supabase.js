// Supabase client — gracefully degrades when env vars are not set.
// The app works fully offline/local when VITE_SUPABASE_URL is absent.
import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY;

// In production (Vercel), route Supabase requests through a same-origin proxy
// defined in vercel.json — this eliminates CORS preflight issues entirely.
// In development (Vite dev server), use the direct URL.
const clientUrl = import.meta.env.PROD
  ? `${window.location.origin}/supabase-proxy`
  : supabaseUrl;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseKey);

export const supabase = isSupabaseConfigured
  ? createClient(clientUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

/*
  ─── Supabase SQL schema ───────────────────────────────────────────────────
  Run this in your Supabase SQL editor (Dashboard → SQL Editor → New query):

  create table public.user_workout_logs (
    user_id uuid primary key references auth.users(id) on delete cascade,
    logs jsonb not null default '{}',
    exercise_notes jsonb not null default '{}',
    updated_at timestamptz default now()
  );

  create table public.user_progress (
    user_id uuid primary key references auth.users(id) on delete cascade,
    data jsonb not null default '{}',
    updated_at timestamptz default now()
  );

  create table public.user_programs (
    user_id uuid primary key references auth.users(id) on delete cascade,
    programs jsonb not null default '{}',
    updated_at timestamptz default now()
  );

  create table public.user_settings (
    user_id uuid primary key references auth.users(id) on delete cascade,
    data jsonb not null default '{}',
    updated_at timestamptz default now()
  );

  -- Row-level security: each user only sees their own rows
  alter table public.user_workout_logs  enable row level security;
  alter table public.user_progress      enable row level security;
  alter table public.user_programs      enable row level security;
  alter table public.user_settings      enable row level security;

  create policy "own_data" on public.user_workout_logs  for all using (auth.uid() = user_id);
  create policy "own_data" on public.user_progress      for all using (auth.uid() = user_id);
  create policy "own_data" on public.user_programs      for all using (auth.uid() = user_id);
  create policy "own_data" on public.user_settings      for all using (auth.uid() = user_id);
  ───────────────────────────────────────────────────────────────────────────
*/
