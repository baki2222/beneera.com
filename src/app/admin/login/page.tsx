'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/lib/admin-auth-context';
import { Eye, EyeOff, Lock, Cog, ArrowLeft, Mail, Loader2, CheckCircle2 } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const { login, session } = useAdminAuth();
  const router = useRouter();

  if (session) {
    router.replace('/admin');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    if (result.success) {
      router.replace('/admin');
    } else {
      setError(result.error || 'Login failed');
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      await fetch('/api/admin/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });
      setForgotSent(true);
    } catch {}
    setForgotLoading(false);
  };

  const inputCls = "w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40 transition-all";

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-amber-500 rounded-2xl mb-4">
            <Cog className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-white">Beneera Admin</h1>
          <p className="text-sm text-zinc-500 mt-1">{showForgot ? 'Reset your password' : 'Sign in to manage your store'}</p>
        </div>

        {showForgot ? (
          /* Forgot Password Form */
          forgotSent ? (
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-500/10 rounded-xl">
                <CheckCircle2 className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-white font-medium">Check your email</p>
                <p className="text-xs text-zinc-500 mt-1">If an account exists for <strong className="text-zinc-400">{forgotEmail}</strong>, we&apos;ve sent a password reset link.</p>
              </div>
              <button onClick={() => { setShowForgot(false); setForgotSent(false); setForgotEmail(''); }}
                className="text-sm text-amber-400 hover:text-amber-300 flex items-center justify-center gap-1 mx-auto">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to login
              </button>
            </div>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <p className="text-sm text-zinc-400">Enter your admin email address and we&apos;ll send you a password reset link.</p>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Email</label>
                <input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)}
                  placeholder="admin@beneera.com" required className={inputCls} />
              </div>
              <button type="submit" disabled={forgotLoading}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-sm rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {forgotLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Mail className="h-4 w-4" /> Send Reset Link</>}
              </button>
              <button type="button" onClick={() => setShowForgot(false)}
                className="w-full text-sm text-zinc-500 hover:text-amber-400 flex items-center justify-center gap-1">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to login
              </button>
            </form>
          )
        ) : (
          /* Login Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@beneera.com" required className={inputCls} />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-zinc-400">Password</label>
                <button type="button" onClick={() => setShowForgot(true)} className="text-xs text-amber-400 hover:text-amber-300">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" required className={`${inputCls} pr-10`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? (
                <div className="h-4 w-4 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
              ) : (
                <><Lock className="h-4 w-4" /> Sign In</>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
