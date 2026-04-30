'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { TreePine, Mail, ArrowRight, CheckCircle, Sparkles } from 'lucide-react'

import { Suspense } from 'react'

function LoginPageInner() {
  const router = useRouter()
  const params = useSearchParams()
  const redirect = params.get('redirect') || '/'
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'magic' | 'password'>('magic')
  const [password, setPassword] = useState('')

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}` }
    })
    setLoading(false)
    if (error) setError(error.message)
    else setSent(true)
  }

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) setError(error.message)
    else router.push(redirect)
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}` }
    })
  }

  if (sent) return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-green-900 to-emerald-800 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Check your email</h1>
        <p className="text-gray-500 text-sm mb-1">We sent a magic link to</p>
        <p className="font-semibold text-gray-900 mb-4">{email}</p>
        <p className="text-gray-400 text-xs mb-6">Tap the link in your email to sign in instantly. No password needed.</p>
        <button onClick={() => setSent(false)} className="text-green-700 text-sm font-medium hover:underline">Use a different email</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-green-900 to-emerald-800 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="bg-gradient-to-r from-green-700 to-emerald-600 px-8 py-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <TreePine className="text-white" size={24} />
            <span className="font-bold text-white text-xl">CamperWatch</span>
          </div>
          <p className="text-green-100 text-sm">The community for real campers</p>
        </div>
        <div className="p-7">
          <h1 className="text-lg font-bold text-gray-900 text-center mb-1">Welcome back</h1>
          <p className="text-gray-400 text-sm text-center mb-5">Sign in to your account</p>
          {/* Google OAuth — re-enable once configured in Supabase dashboard */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
            <button onClick={() => setMode('magic')} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors ${mode === 'magic' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>
              <Sparkles size={13} /> Magic Link
            </button>
            <button onClick={() => setMode('password')} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors ${mode === 'password' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>
              <Mail size={13} /> Password
            </button>
          </div>
          {mode === 'magic' ? (
            <form onSubmit={handleMagicLink} className="space-y-3">
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <button type="submit" disabled={loading || !email}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-40 flex items-center justify-center gap-2">
                {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Sparkles size={15} /> Send Magic Link</>}
              </button>
              <p className="text-xs text-gray-400 text-center">One tap in your email — no password needed</p>
            </form>
          ) : (
            <form onSubmit={handlePassword} className="space-y-3">
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-40 flex items-center justify-center gap-2">
                {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Sign In <ArrowRight size={15} /></>}
              </button>
            </form>
          )}
          <p className="text-center text-sm text-gray-400 mt-5">
            New here?{' '}
            <Link href={`/auth/signup?redirect=${encodeURIComponent(redirect)}`} className="text-green-700 font-semibold hover:underline">Join free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
export default function LoginPage() {
  return <Suspense fallback={<div className="min-h-screen bg-green-950" />}><LoginPageInner /></Suspense>
}
export const dynamic = 'force-dynamic'
