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
    const { data, error: signupError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { username: form.username, full_name: form.full_name } }
    })
    if (signupError) { setError(signupError.message); setLoading(false); return }
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id, username: form.username, full_name: form.full_name
      })
    }
    setSuccess(true)
    setLoading(false)
  }

  if (success) return (
    <div className="min-h-screen bg-gradient-to-br from-forest-900 via-forest-800 to-tahoe-blue flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
        <div className="text-5xl mb-4">🏕️</div>
        <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">Welcome to the community!</h2>
        <p className="text-gray-500 text-sm mb-6">Check your email to confirm your account, then come back and explore.</p>
        <Link href="/auth/login" className="bg-green-700 text-white px-6 py-3 rounded-xl font-semibold text-sm">Back to Sign In</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-900 via-forest-800 to-tahoe-blue flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="flex items-center justify-center gap-2 mb-6">
          <TreePine className="text-green-700" size={28} />
          <span className="font-display text-2xl font-bold text-gray-900">CamperWatch</span>
        </div>
        <h1 className="text-xl font-semibold text-gray-900 text-center mb-1">Join the community</h1>
        <p className="text-gray-400 text-sm text-center mb-6">Share tips, upload photos, connect with real campers</p>

        <form onSubmit={handleSignup} className="space-y-4">
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
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Already a member?{' '}
          <Link href="/auth/login" className="text-green-700 font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
export const dynamic = 'force-dynamic'
