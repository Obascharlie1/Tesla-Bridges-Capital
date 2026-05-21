'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' })
  const [showPw,      setShowPw]      = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [terms,       setTerms]       = useState(false)
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState('')
  const [errors,      setErrors]      = useState<Record<string, string>>({})

  function update(field: string, value: string) {
    setForm(p => ({ ...p, [field]: value }))
    setErrors(p => ({ ...p, [field]: '' }))
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!form.fullName.trim())        e.fullName        = 'Full name is required.'
    if (!form.email.trim())           e.email           = 'Email is required.'
    if (form.password.length < 8)     e.password        = 'Password must be at least 8 characters.'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match.'
    if (!terms)                       e.terms           = 'You must accept the terms.'
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: authErr } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.fullName } },
    })

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
        <h1 className="text-2xl font-bold text-dark-base dark:text-white mb-1">Create account</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Start your investment journey today</p>
      </div>

      {error && (
        <div className="mb-5 px-4 py-3 bg-red-primary/10 border border-red-primary/30 text-red-primary text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-dark-base dark:text-white uppercase tracking-wider mb-2">Full Name</label>
          <input type="text" value={form.fullName} onChange={e => update('fullName', e.target.value)} placeholder="John Doe" autoComplete="name"
            className="w-full px-4 py-3 border border-light-border dark:border-dark-border bg-light-base dark:bg-dark-card text-dark-base dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:border-red-primary transition-colors" />
          {errors.fullName && <p className="mt-1 text-xs text-red-primary">{errors.fullName}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-dark-base dark:text-white uppercase tracking-wider mb-2">Email Address</label>
          <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="john@example.com" autoComplete="email"
            className="w-full px-4 py-3 border border-light-border dark:border-dark-border bg-light-base dark:bg-dark-card text-dark-base dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:border-red-primary transition-colors" />
          {errors.email && <p className="mt-1 text-xs text-red-primary">{errors.email}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-dark-base dark:text-white uppercase tracking-wider mb-2">Password</label>
          <div className="relative">
            <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => update('password', e.target.value)} placeholder="Min. 8 characters" autoComplete="new-password"
              className="w-full px-4 py-3 pr-11 border border-light-border dark:border-dark-border bg-light-base dark:bg-dark-card text-dark-base dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:border-red-primary transition-colors" />
            <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-primary">{errors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-semibold text-dark-base dark:text-white uppercase tracking-wider mb-2">Confirm Password</label>
          <div className="relative">
            <input type={showConfirm ? 'text' : 'password'} value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} placeholder="Re-enter password" autoComplete="new-password"
              className="w-full px-4 py-3 pr-11 border border-light-border dark:border-dark-border bg-light-base dark:bg-dark-card text-dark-base dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:border-red-primary transition-colors" />
            <button type="button" onClick={() => setShowConfirm(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="mt-1 text-xs text-red-primary">{errors.confirmPassword}</p>}
        </div>

        {/* Terms */}
        <div>
          <label className="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" checked={terms} onChange={e => { setTerms(e.target.checked); setErrors(p => ({ ...p, terms: '' })) }}
              className="mt-0.5 w-4 h-4 border border-light-border dark:border-dark-border bg-light-base dark:bg-dark-card accent-red-primary flex-shrink-0" />
            <span className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              I agree to the <Link href="#" className="text-red-primary hover:text-red-dim font-medium">Terms of Service</Link> and <Link href="#" className="text-red-primary hover:text-red-dim font-medium">Privacy Policy</Link>
            </span>
          </label>
          {errors.terms && <p className="mt-1 text-xs text-red-primary">{errors.terms}</p>}
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-red-primary hover:bg-red-dim disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 text-sm transition-colors flex items-center justify-center gap-2">
          {loading ? <><Loader2 size={16} className="animate-spin" /> Creating account…</> : <>Create Account <ArrowRight size={16} /></>}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-red-primary hover:text-red-dim font-medium transition-colors">Sign in</Link>
      </p>
    </div>
  )
}
