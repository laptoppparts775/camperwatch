import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const next = requestUrl.searchParams.get('next') || 
               requestUrl.searchParams.get('redirect') || '/'

  if (error) {
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/login?error=${encodeURIComponent(error)}`
    )
  }

  if (code) {
    // Exchange code — redirect to a client page that handles the session
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/confirm?code=${code}&next=${encodeURIComponent(next)}`
    )
  }

  return NextResponse.redirect(`${requestUrl.origin}${next}`)
}
