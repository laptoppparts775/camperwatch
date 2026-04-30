import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/auth-helpers-nextjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

// Standard client for non-auth operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth-aware client — use this in components that need session persistence
export const createSupabaseClient = () => createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

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
