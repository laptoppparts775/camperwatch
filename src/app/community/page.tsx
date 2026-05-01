import CommunityFeed from '@/components/community/CommunityFeed'
import { TreePine } from 'lucide-react'
import Link from 'next/link'
import NavBar from '@/components/NavBar'

export const metadata = {
  title: 'Community — CamperWatch',
  description: 'Connect with real campers. Share tips, photos, and trip reports from campgrounds across the US.',
}

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-gray-900 mb-1">Camper Community 🏕️</h1>
          <p className="text-gray-500 text-sm">Real tips, photos, and stories from real campers across the US.</p>
        </div>
        <CommunityFeed />
      </main>
    </div>
  )
}
export const dynamic = 'force-dynamic'
