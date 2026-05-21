'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router   = useRouter()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: authErr } = await supabase.auth.signInWithPassword({ email, password })

    if (authErr) {
      setError(authErr.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="w-full max-w-sm">
      <div className="lg:hidden flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-red-primary flex items-center justify-center">
          <span className="text-white font-bold text-sm">Q</span>
        </div>
        <span className="font-bold text-dark-base dark:text-white text-base tracking-tight">QuantumVest</span>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark-base dark:text-white mb-1">Welcome back</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Sign in to your account to continue</p>
      </div>

      {error && (
        <div className="mb-5 px-4 py-3 bg-red-primary/10 border border-red-primary/30 text-red-primary text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-dark-base dark:text-white uppercase tracking-wider mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="john@example.com"
            autoComplete="email"
            required
            className="w-full px-4 py-3 border border-light-border dark:border-dark-border bg-light-base dark:bg-dark-card text-dark-base dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:border-red-primary transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-dark-base dark:text-white uppercase tracking-wider mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              className="w-full px-4 py-3 pr-11 border border-light-border dark:border-dark-border bg-light-base dark:bg-dark-card text-dark-base dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:border-red-primary transition-colors"
            />
            <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <Link href="/auth/forgot-password" className="text-xs text-red-primary hover:text-red-dim transition-colors font-medium">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-primary hover:bg-red-dim disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 text-sm transition-colors flex items-center justify-center gap-2"
        >
          {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in…</> : <>Sign In <ArrowRight size={16} /></>}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Don&apos;t have an account?{' '}
        <Link href="/auth/register" className="text-red-primary hover:text-red-dim font-medium transition-colors">
          Create account
        </Link>
      </p>
    </div>
  )
}
