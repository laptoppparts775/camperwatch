import { createBrowserClient } from '@supabase/ssr'

// Single shared instance — prevents "Multiple GoTrueClient" warning
let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null

export function getSupabase() {
  if (typeof window === 'undefined') {
    // Server-side: always create new
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  // Client-side: reuse single instance
  if (!supabaseInstance) {
    supabaseInstance = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return supabaseInstance
}

// Backwards compat
export const supabase = {
  get auth() { return getSupabase().auth },
  from: (table: string) => getSupabase().from(table),
  storage: { from: (bucket: string) => getSupabase().storage.from(bucket) },
}

export type Profile = {
  id: string
  username: string
  full_name: string
  avatar_url: string | null
  bio: string | null
  location: string | null
  role: string
  referral_code: string
  camps_visited: number
  tips_shared: number
  avatar_color: string
}

export type Tip = {
  id: string
  campground_id: string
  user_id: string
  tip: string
  upvotes: number
  verified: boolean
  created_at: string
}

export type Post = {
  id: string
  user_id: string
  campground_id: string | null
  content: string
  images: string[]
  likes: number
  created_at: string
}

export type CommunityPost = {
  id: string
  user_id: string
  campground_id: string | null
  content: string
  images: string[]
  likes: number
  created_at: string
  profiles?: {
    username: string
    full_name: string
    avatar_url: string | null
    avatar_color?: string
  }
}

export type UserTip = {
  id: string
  campground_id: string
  user_id: string
  tip: string
  upvotes: number
  verified: boolean
  created_at: string
  profiles?: {
    username: string
    full_name: string
    avatar_color?: string
  }
}
