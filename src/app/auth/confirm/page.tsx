'use client'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@supabase/auth-helpers-nextjs'
import { Suspense } from 'react'
import { TreePine } from 'lucide-react'

function ConfirmInner() {
  const router = useRouter()
  const params = useSearchParams()
  const code = params.get('code')
  const next = params.get('next') || '/'

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) {
          router.push(`/auth/login?error=${encodeURIComponent(error.message)}`)
        } else {
          router.push(next)
        }
      })
    } else {
      // Handle implicit flow (magic link token in hash — Supabase handles automatically)
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) {
          router.push(next)
        } else {
          router.push('/auth/login')
        }
      })
    }
  }, [code, next])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-green-900 to-emerald-800 flex items-center justify-center">
      <div className="text-center text-white">
        <TreePine size={40} className="mx-auto mb-4 animate-pulse" />
        <p className="text-green-100 text-sm">Signing you in...</p>
      </div>
    </div>
  )
}

export default function ConfirmPage() {
  return <Suspense fallback={<div className="min-h-screen bg-green-950" />}><ConfirmInner /></Suspense>
}
export const dynamic = 'force-dynamic'
