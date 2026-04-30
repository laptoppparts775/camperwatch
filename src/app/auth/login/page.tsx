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
          <button onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 border-2 border-gray-100 rounded-2xl py-3 text-sm font-medium hover:bg-gray-50 transition-colors mb-4">
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
            </svg>
            Continue with Google
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gray-100" /><span className="text-xs text-gray-300">or</span><div className="flex-1 h-px bg-gray-100" />
          </div>
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
