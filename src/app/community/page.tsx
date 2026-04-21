import CommunityFeed from '@/components/community/CommunityFeed'
import { TreePine } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Community — CamperWatch',
  description: 'Connect with real campers. Share tips, photos, and trip reports from Lake Tahoe campgrounds.',
}

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <TreePine size={20} className="text-green-700" />
            <span className="font-display font-semibold text-gray-900">CamperWatch</span>
          </Link>
          <nav className="ml-auto flex gap-4 text-sm">
            <Link href="/search" className="text-gray-500 hover:text-gray-900">Campgrounds</Link>
            <Link href="/community" className="text-green-700 font-semibold">Community</Link>
            <Link href="/auth/login" className="text-gray-500 hover:text-gray-900">Sign In</Link>
          </nav>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-gray-900 mb-1">Camper Community 🏕️</h1>
          <p className="text-gray-500 text-sm">Real tips, photos, and stories from real campers at Lake Tahoe.</p>
        </div>
        <CommunityFeed />
      </main>
    </div>
  )
}
export const dynamic = 'force-dynamic'
