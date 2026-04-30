import { createServerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const redirect = requestUrl.searchParams.get('redirect') || '/'

  if (error) {
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/login?error=${encodeURIComponent(error)}&redirect=${encodeURIComponent(redirect)}`
    )
  }

  if (code) {
    // Use auth-helpers which correctly sets session cookies
    const cookieStore = cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies: { get: (name: string) => cookieStore.get(name)?.value, set: () => {}, remove: () => {} } })
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(`${requestUrl.origin}${redirect}`)
}
