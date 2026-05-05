'use client'

import { useState } from 'react'

interface Props {
  source?: string
  placeholder?: string
  buttonText?: string
  className?: string
}

export default function EmailCapture({
  source = 'homepage',
  placeholder = 'your@email.com',
  buttonText = 'Get alerts',
  className = '',
}: Props) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || status === 'loading') return
    setStatus('loading')

    try {
      const res = await fetch('/api/email-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      })
      setStatus(res.ok ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div className={`flex items-center gap-2 text-green-400 text-sm font-semibold ${className}`}>
        <span>✓</span>
        <span>You&apos;re on the list. We&apos;ll alert you when sites open up.</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder={placeholder}
        required
        className="flex-1 min-w-0 px-4 py-3 rounded-xl text-sm bg-white/10 border border-white/20
                   text-white placeholder-stone-500 focus:outline-none focus:border-amber-400/60
                   focus:bg-white/15 transition-all"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="px-5 py-3 rounded-xl text-sm font-bold bg-amber-400 hover:bg-amber-300
                   text-stone-950 transition-colors disabled:opacity-60 whitespace-nowrap flex-shrink-0"
      >
        {status === 'loading' ? '…' : buttonText}
      </button>
      {status === 'error' && (
        <span className="text-red-400 text-xs self-center">Try again</span>
      )}
    </form>
  )
}
