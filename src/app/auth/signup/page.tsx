'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { TreePine, Mail, Lock, User } from 'lucide-react'
import Link from 'next/link'

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '', username: '', full_name: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    // Auto-generate username from email on mobile (only email+password shown)
    const username = form.username || form.email.split('@')[0].replace(/[^a-z0-9]/gi, '').toLowerCase().slice(0,20) || 'camper'
    const full_name = form.full_name || form.email.split('@')[0]
    const { data, error: signupError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { username, full_name } }
    })
    if (signupError) { setError(signupError.message); setLoading(false); return }
    if (data.user) {
      await supabase.from('profiles').upsert({ id: data.user.id, username, full_name })
    }
    setSuccess(true)
    setLoading(false)
  }

  if (success) return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-green-900 to-emerald-800 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
        <div className="text-5xl mb-4">🏕️</div>
        <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">You're in!</h2>
        <p className="text-gray-500 text-sm mb-6">Check your email to confirm, then come explore the community.</p>
        <Link href="/auth/login" className="bg-green-700 text-white px-6 py-3 rounded-xl font-semibold text-sm">Sign in →</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-green-900 to-emerald-800 flex items-center justify-center px-4 py-8">

      {/* ── MOBILE: minimal — email + password only, social proof up top ── */}
      <div className="sm:hidden bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="bg-gradient-to-r from-green-700 to-emerald-600 px-6 py-5 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <TreePine className="text-white" size={20} />
            <span className="font-bold text-white text-lg">CamperWatch</span>
          </div>
          {/* Social proof on mobile */}
          <div className="flex items-center justify-center gap-3 mt-2">
            {['⚠️ Bear alerts', '✅ Site availability', '📍 Near me'].map(s => (
              <span key={s} className="text-[10px] text-green-200 font-medium whitespace-nowrap">{s}</span>
            ))}
          </div>
        </div>
        <div className="p-5">
          <h1 className="text-base font-bold text-gray-900 text-center mb-1">Join free — get campsite alerts</h1>
          <p className="text-gray-400 text-xs text-center mb-4">Real-time updates from real campers</p>
          <form onSubmit={handleSignup} className="space-y-3">
            <input type="email" placeholder="Email address" value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-green-500" required />
            <input type="password" placeholder="Password (min 8 chars)" value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-green-500" required minLength={8} />
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full bg-green-700 text-white py-3.5 rounded-2xl font-bold text-base disabled:opacity-50">
              {loading ? 'Creating account...' : 'Create free account →'}
            </button>
          </form>
          <p className="text-[10px] text-gray-400 text-center mt-3">No credit card · No spam · Cancel anytime</p>
          <p className="text-center text-sm text-gray-500 mt-3">
            Already a member?{' '}
            <Link href="/auth/login" className="text-green-700 font-semibold">Sign in</Link>
          </p>
        </div>
      </div>

      {/* ── DESKTOP: full form + benefit list ── */}
      <div className="hidden sm:flex gap-10 items-start w-full max-w-3xl">
        {/* Benefits panel */}
        <div className="flex-1 text-white pt-4">
          <div className="flex items-center gap-2 mb-6">
            <TreePine size={24} className="text-amber-400" />
            <span className="font-bold text-xl">CamperWatch</span>
          </div>
          <h2 className="text-2xl font-bold mb-2 leading-tight">Join the community<br/><span className="text-green-300">real campers trust.</span></h2>
          <p className="text-green-200 text-sm mb-8">Get the intel no website gives you — from people who were just there.</p>
          <div className="space-y-4">
            {[
              { icon: '⚠️', title: 'Live condition alerts', desc: 'Bear sightings, fire restrictions, road closures — before you drive 3 hours.' },
              { icon: '💬', title: 'Ask real questions', desc: '"Is site #14 shaded?" — someone who stayed last week will answer.' },
              { icon: '📍', title: 'Find sites near you now', desc: 'Available tonight, pet-friendly, within 50 miles — one tap.' },
              { icon: '🏕', title: 'Log your trips', desc: 'Track where you\'ve been, share trip reports, build your camping record.' },
            ].map(b => (
              <div key={b.icon} className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">{b.icon}</span>
                <div>
                  <div className="text-sm font-semibold text-white">{b.title}</div>
                  <div className="text-xs text-green-300 leading-relaxed">{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-2xl w-80 flex-shrink-0 p-7">
          <h1 className="text-xl font-bold text-gray-900 text-center mb-1">Join the community</h1>
          <p className="text-gray-400 text-sm text-center mb-5">Share tips, photos, connect with real campers</p>
          <form onSubmit={handleSignup} className="space-y-3.5">
            {[
              { key: 'full_name', placeholder: 'Full name', icon: User, type: 'text' },
              { key: 'username', placeholder: 'Username (e.g. tahoe_dan)', icon: User, type: 'text' },
              { key: 'email', placeholder: 'Email address', icon: Mail, type: 'email' },
              { key: 'password', placeholder: 'Password (min 8 chars)', icon: Lock, type: 'password' },
            ].map(({ key, placeholder, icon: Icon, type }) => (
              <div key={key} className="relative">
                <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={type} placeholder={placeholder} value={(form as any)[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-600" required />
              </div>
            ))}
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-50">
              {loading ? 'Creating account...' : 'Create free account'}
            </button>
          </form>
          <p className="text-[10px] text-gray-400 text-center mt-3">No credit card required · Free forever</p>
          <p className="text-center text-sm text-gray-500 mt-3">
            Already a member?{' '}
            <Link href="/auth/login" className="text-green-700 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
export const dynamic = 'force-dynamic'
