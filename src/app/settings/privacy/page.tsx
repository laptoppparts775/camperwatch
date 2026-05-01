'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'
import NavBar from '@/components/NavBar'
import { Shield, Eye, EyeOff, User, MapPin, MessageCircle, Users, Lock, Check, ChevronRight } from 'lucide-react'

type Privacy = {
  privacy_display_name: string
  privacy_avatar: string
  privacy_trips: string
  privacy_location: string
  privacy_online: string
  privacy_dm: string
  privacy_profile: string
}

const SETTINGS = [
  {
    key: 'privacy_display_name',
    label: 'Your name in chat & community',
    icon: User,
    description: 'How other campers see you in chats, reviews, and tips',
    options: [
      { value: 'full_name', label: 'Full name', desc: 'e.g. "Patryk Picinski"', recommended: false },
      { value: 'username', label: 'Username only', desc: 'e.g. "@patryk"', recommended: true },
      { value: 'anonymous', label: 'Anonymous', desc: 'Shows as "A camper"', recommended: false },
    ]
  },
  {
    key: 'privacy_avatar',
    label: 'Profile picture',
    icon: Eye,
    description: 'What others see for your profile image',
    options: [
      { value: 'show', label: 'Show my photo', desc: 'Your Google/uploaded photo', recommended: false },
      { value: 'initials', label: 'Initials only', desc: 'Colored circle with your initials', recommended: true },
      { value: 'hidden', label: 'Hidden', desc: 'Grey placeholder', recommended: false },
    ]
  },
  {
    key: 'privacy_profile',
    label: 'Profile visibility',
    icon: Shield,
    description: 'Who can see your profile page',
    options: [
      { value: 'public', label: 'Public', desc: 'Anyone on CamperWatch', recommended: true },
      { value: 'followers', label: 'Followers only', desc: 'People who follow you', recommended: false },
      { value: 'private', label: 'Private', desc: 'Only you', recommended: false },
    ]
  },
  {
    key: 'privacy_trips',
    label: 'Trip history',
    icon: MapPin,
    description: 'Who can see which campgrounds you\'ve visited',
    options: [
      { value: 'public', label: 'Public', desc: 'Everyone can see your trips', recommended: false },
      { value: 'followers', label: 'Followers only', desc: 'Only people who follow you', recommended: true },
      { value: 'private', label: 'Just me', desc: 'Hidden from everyone', recommended: false },
    ]
  },
  {
    key: 'privacy_location',
    label: 'Your location',
    icon: MapPin,
    description: 'How precisely your location shows on your profile',
    options: [
      { value: 'exact', label: 'Exact city', desc: 'e.g. "South Lake Tahoe, CA"', recommended: false },
      { value: 'general', label: 'General area', desc: 'e.g. "Northern California"', recommended: true },
      { value: 'hidden', label: 'Hidden', desc: 'Location not shown', recommended: false },
    ]
  },
  {
    key: 'privacy_dm',
    label: 'Direct messages',
    icon: MessageCircle,
    description: 'Who can send you private messages',
    options: [
      { value: 'anyone', label: 'Anyone', desc: 'Any logged-in camper', recommended: false },
      { value: 'followers', label: 'Followers only', desc: 'Only people you follow back', recommended: true },
      { value: 'nobody', label: 'No one', desc: 'DMs disabled', recommended: false },
    ]
  },
  {
    key: 'privacy_online',
    label: 'Online status',
    icon: Eye,
    description: 'Show when you\'re currently active',
    options: [
      { value: 'show', label: 'Show', desc: 'Others can see you\'re online', recommended: false },
      { value: 'hide', label: 'Hide', desc: 'Always appear offline', recommended: true },
    ]
  },
]

export default function PrivacySettings() {
  const router = useRouter()
  const [privacy, setPrivacy] = useState<Privacy>({
    privacy_display_name: 'username',
    privacy_avatar: 'initials',
    privacy_trips: 'followers',
    privacy_location: 'general',
    privacy_online: 'hide',
    privacy_dm: 'followers',
    privacy_profile: 'public',
  })
  const [userId, setUserId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sb = getSupabase()
    sb.auth.getSession().then(async ({ data }: any) => {
      const uid = data.session?.user?.id
      if (!uid) { router.push('/auth/login?redirect=/settings/privacy'); return }
      setUserId(uid)
      const { data: profile } = await sb.from('profiles').select('privacy_display_name,privacy_avatar,privacy_trips,privacy_location,privacy_online,privacy_dm,privacy_profile').eq('id', uid).single()
      if (profile) setPrivacy(p => ({ ...p, ...profile }))
      setLoading(false)
    })
  }, [])

  async function save() {
    if (!userId) return
    setSaving(true)
    await getSupabase().from('profiles').update(privacy).eq('id', userId)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) return <div className="min-h-screen bg-gray-50"><NavBar /><div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /></div></div>

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center">
            <Shield size={20} className="text-green-700" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Privacy & identity</h1>
            <p className="text-sm text-gray-500">Control how you appear to other campers. Your choice, always.</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 text-sm text-amber-800">
          <strong>Your data belongs to you.</strong> CamperWatch never sells your personal information. These settings only affect how you appear to other community members.
        </div>

        <div className="space-y-4">
          {SETTINGS.map(setting => (
            <div key={setting.key} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-5 pt-5 pb-3">
                <div className="flex items-center gap-2 mb-0.5">
                  <setting.icon size={16} className="text-gray-500" />
                  <span className="font-semibold text-gray-900 text-sm">{setting.label}</span>
                </div>
                <p className="text-xs text-gray-400">{setting.description}</p>
              </div>
              <div className="px-3 pb-3 space-y-1">
                {setting.options.map(opt => (
                  <button key={opt.value}
                    onClick={() => setPrivacy(p => ({ ...p, [setting.key]: opt.value }))}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                      privacy[setting.key as keyof Privacy] === opt.value
                        ? 'bg-green-50 border border-green-200'
                        : 'hover:bg-gray-50'
                    }`}>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      privacy[setting.key as keyof Privacy] === opt.value ? 'border-green-600 bg-green-600' : 'border-gray-300'
                    }`}>
                      {privacy[setting.key as keyof Privacy] === opt.value && <Check size={11} className="text-white" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">{opt.label}</span>
                        {opt.recommended && <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">Recommended</span>}
                      </div>
                      <div className="text-xs text-gray-400">{opt.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <button onClick={save} disabled={saving}
            className="flex-1 py-3.5 bg-green-600 text-white font-semibold rounded-2xl hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> :
             saved ? <><Check size={16} /> Saved!</> : 'Save privacy settings'}
          </button>
        </div>

        <p className="text-xs text-center text-gray-400 mt-4">
          Changes apply immediately across CamperWatch. You can update these anytime.
        </p>
      </div>
    </div>
  )
}
export const dynamic = 'force-dynamic'
