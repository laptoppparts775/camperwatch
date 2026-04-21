import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Profile = {
  id: string
  username: string
  full_name: string
  avatar_url: string
  bio: string
  location: string
  camps_visited: number
  tips_shared: number
  created_at: string
}

export type UserTip = {
  id: string
  campground_id: string
  user_id: string
  tip: string
  upvotes: number
  verified: boolean
  created_at: string
  profiles?: Profile
}

export type CommunityPost = {
  id: string
  user_id: string
  campground_id?: string
  content: string
  images: string[]
  likes: number
  created_at: string
  profiles?: Profile
}
