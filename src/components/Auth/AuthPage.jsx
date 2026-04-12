import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import useAuthStore from '../../store/useAuthStore';
import { pushAllData } from '../../utils/syncEngine';

// mode: 'signin' | 'signup' | 'forgot'
export default function AuthPage() {
  const [mode, setMode]         = useState('signin');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [success, setSuccess]   = useState(null);

  const { setSession, setGuest } = useAuthStore();

  function switchMode(m) {
    setMode(m);
    setError(null);
    setSuccess(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // ── Şifremi Unuttum ───────────────────────────────────────────────
      if (mode === 'forgot') {
        if (!email.trim()) return;
        const { error: err } = await supabase.auth.resetPasswordForEmail(
          email.trim(),
          { redirectTo: `${window.location.origin}` }
        );
        if (err) throw err;
        setSuccess('Şifre sıfırlama bağlantısı e-posta adresine gönderildi.');
        return;
      }

      // ── Kayıt Ol ──────────────────────────────────────────────────────
      if (mode === 'signup') {
        const { data, error: err } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });
        if (err) throw err;
        if (data.session) {
          await pushAllData(data.session.user.id);
          setSession(data.session);
        } else {
          setSuccess('Doğrulama e-postası gönderildi. Gelen kutunu kontrol et.');
        }
        return;
      }

      // ── Giriş Yap ─────────────────────────────────────────────────────
      const { data, error: err } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (err) throw err;
      setSession(data.session);

    } catch (err) {
      const msg = err.message || '';
      setError(
        msg.includes('Invalid login credentials')   ? 'E-posta veya şifre hatalı.' :
        msg.includes('User already registered')      ? 'Bu e-posta zaten kayıtlı. Giriş yap.' :
        msg.includes('Password should be')           ? 'Şifre en az 6 karakter olmalı.' :
        msg.includes('Email not confirmed')          ? 'E-postanı doğrulamadın. Gelen kutunu kontrol et.' :
        msg.includes('For security purposes')        ? 'Çok fazla deneme. Biraz bekle.' :
        msg || 'Bir hata oluştu.'
      );
    } finally {
      setLoading(false);
    }
  }

  const isForgot = mode === 'forgot';
  const canSubmit = isForgot
    ? email.trim().length > 3
    : email.trim().length > 3 && password.length >= 6;

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-6">
      {/* Branding */}
      <div className="mb-8 text-center">
        <div
          className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl"
          style={{ background: 'linear-gradient(135deg,#14B8A620,#14B8A640)', border: '1px solid #14B8A630' }}
        >
          💪
        </div>
        <h1 className="text-2xl font-bold text-white">V-Taper Coach</h1>
        <p className="text-sm text-white/40 mt-1">
          {isForgot ? 'Şifre sıfırla' : 'Antrenmanını bulutla yedekle'}
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-bg-card rounded-3xl p-6 border border-white/6">

        {/* Mode toggle (only sign in / sign up) */}
        {!isForgot && (
          <div className="flex rounded-xl overflow-hidden mb-5 bg-bg-dark">
            {[{ id: 'signin', label: 'Giriş Yap' }, { id: 'signup', label: 'Kayıt Ol' }].map(m => (
              <button
                key={m.id}
                onClick={() => switchMode(m.id)}
                className="flex-1 py-2 text-sm font-semibold transition-all"
                style={mode === m.id
                  ? { backgroundColor: '#14B8A6', color: '#fff', borderRadius: 10 }
                  : { color: 'rgba(255,255,255,0.35)' }
                }
              >
                {m.label}
              </button>
            ))}
          </div>
        )}

        {/* Back button in forgot mode */}
        {isForgot && (
          <button
            onClick={() => switchMode('signin')}
            className="flex items-center gap-1.5 text-xs text-white/40 mb-4 hover:text-white/60 transition-colors"
          >
            ← Giriş ekranına dön
          </button>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-white/40 mb-1 block">E-posta</label>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="ad@örnek.com"
              className="w-full bg-bg-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-white
                         placeholder:text-white/20 focus:outline-none focus:border-[#14B8A6]/50"
            />
          </div>

          {!isForgot && (
            <div>
              <label className="text-xs text-white/40 mb-1 block">Şifre</label>
              <input
                type="password"
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={mode === 'signup' ? 'En az 6 karakter' : '••••••••'}
                className="w-full bg-bg-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-white
                           placeholder:text-white/20 focus:outline-none focus:border-[#14B8A6]/50"
              />
              {/* Şifremi unuttum link */}
              {mode === 'signin' && (
                <button
                  type="button"
                  onClick={() => switchMode('forgot')}
                  className="text-xs text-white/30 hover:text-[#14B8A6] transition-colors mt-1.5 ml-1"
                >
                  Şifremi unuttum
                </button>
              )}
            </div>
          )}

          {/* Error / success */}
          {error   && <p className="text-xs text-[#E94560] bg-[#E94560]/10 rounded-xl px-3 py-2">{error}</p>}
          {success && <p className="text-xs text-[#14B8A6] bg-[#14B8A6]/10 rounded-xl px-3 py-2">{success}</p>}

          <button
            type="submit"
            disabled={loading || !canSubmit}
            className="w-full py-3 rounded-2xl text-sm font-bold transition-all mt-1"
            style={{
              backgroundColor: (loading || !canSubmit) ? '#1e293b' : '#14B8A6',
              color:           (loading || !canSubmit) ? 'rgba(255,255,255,0.25)' : '#fff',
            }}
          >
            {loading
              ? <span className="inline-block w-4 h-4 border-2 border-white/20 border-t-white/70 rounded-full animate-spin" />
              : isForgot        ? 'Sıfırlama Bağlantısı Gönder'
              : mode === 'signup' ? 'Kayıt Ol & Senkronize Et'
              : 'Giriş Yap'
            }
          </button>
        </form>

        {/* Divider + Guest (only on sign in / sign up) */}
        {!isForgot && (
          <>
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-white/8" />
              <span className="text-xs text-white/25">veya</span>
              <div className="flex-1 h-px bg-white/8" />
            </div>
            <button
              onClick={setGuest}
              className="w-full py-3 rounded-2xl text-sm font-medium border border-white/10 text-white/50
                         hover:border-white/20 hover:text-white/70 transition-all"
            >
              Misafir olarak devam et
            </button>
            <p className="text-xs text-white/20 text-center mt-2">Veriler yalnızca bu cihazda saklanır</p>
          </>
        )}
      </div>
    </div>
  );
}
