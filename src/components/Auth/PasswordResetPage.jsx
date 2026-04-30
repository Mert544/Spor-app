import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import useAuthStore from '../../store/useAuthStore';

export default function PasswordResetPage() {
  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [done, setDone]           = useState(false);
  const { setPasswordRecovery }   = useAuthStore();

  async function handleReset(e) {
    e.preventDefault();
    if (password.length < 6) { setError('Şifre en az 6 karakter olmalı.'); return; }
    if (password !== confirm)  { setError('Şifreler eşleşmiyor.'); return; }

    setLoading(true);
    setError(null);
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (err) { setError(err.message); return; }

    setDone(true);
    setTimeout(() => setPasswordRecovery(false), 2000);
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm bg-bg-card rounded-3xl p-6 border border-white/6">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center text-2xl"
            style={{ background: '#14B8A615', border: '1px solid #14B8A630' }}>
            🔑
          </div>
          <h2 className="text-lg font-bold text-white">Yeni Şifre Belirle</h2>
          <p className="text-xs text-white/40 mt-1">En az 6 karakter</p>
        </div>

        {done ? (
          <div className="text-center py-4">
            <p className="text-[#14B8A6] text-sm font-semibold">Şifren güncellendi!</p>
            <p className="text-xs text-white/40 mt-1">Yönlendiriliyorsun…</p>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-3">
            <div>
              <label className="text-xs text-white/40 mb-1 block">Yeni şifre</label>
              <input
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-bg-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-white
                           placeholder:text-white/20 focus:outline-none focus:border-[#14B8A6]/50"
              />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block">Şifreyi tekrarla</label>
              <input
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-bg-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-white
                           placeholder:text-white/20 focus:outline-none focus:border-[#14B8A6]/50"
              />
            </div>

            {error && <p className="text-xs text-[#E94560] bg-[#E94560]/10 rounded-xl px-3 py-2">{error}</p>}

            <button
              type="submit"
              disabled={loading || password.length < 6 || password !== confirm}
              className="w-full py-3 rounded-2xl text-sm font-bold transition-all"
              style={{
                backgroundColor: (loading || password.length < 6 || password !== confirm) ? '#1e293b' : '#14B8A6',
                color: (loading || password.length < 6 || password !== confirm) ? 'rgba(255,255,255,0.25)' : '#fff',
              }}
            >
              {loading
                ? <span className="inline-block w-4 h-4 border-2 border-white/20 border-t-white/70 rounded-full animate-spin" />
                : 'Şifreyi Güncelle'
              }
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
