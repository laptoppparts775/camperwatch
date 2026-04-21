'use client'

import { campgrounds } from '@/lib/data'
import { useRouter } from 'next/navigation'
import { MapPin, Star, ExternalLink, ChevronLeft, Check, TreePine, Clock, AlertCircle } from 'lucide-react'
import dynamic from 'next/dynamic'

const MapView = dynamic(() => import('@/components/map/MapView'), { ssr: false })

export default function CampgroundPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const camp = campgrounds.find(c => c.slug === params.slug)

  if (!camp) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Campground not found.</p>
          <button onClick={() => router.push('/search')} className="text-green-700 font-medium">← Back to search</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.back()} className="flex items-center gap-1 text-gray-500 hover:text-gray-900 text-sm">
            <ChevronLeft size={16} /> Back
          </button>
          <div className="flex items-center gap-2 ml-2">
            <TreePine size={18} className="text-green-700" />
            <span className="font-display font-semibold text-gray-900">CamperWatch</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Image gallery */}
        <div className="grid grid-cols-2 gap-3 mb-6 rounded-2xl overflow-hidden h-72">
          <img src={camp.images[0]} alt={camp.name} className="w-full h-full object-cover" />
          <img src={camp.images[1] || camp.images[0]} alt={camp.name} className="w-full h-full object-cover" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - main info */}
          <div className="md:col-span-2 space-y-6">
            {/* Title */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="font-display text-3xl font-bold text-gray-900">{camp.name}</h1>
                <span className={`badge ${camp.available ? 'badge-green' : 'badge-red'} ml-3 mt-1`}>
                  {camp.available ? '✓ Available' : '✗ Fully Booked'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1"><MapPin size={13} />{camp.location}</span>
                <span className="flex items-center gap-1"><Star size={13} className="text-yellow-400 fill-yellow-400" />{camp.rating} ({camp.review_count} reviews)</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="font-semibold text-gray-900 mb-2">About</h2>
              <p className="text-gray-600 leading-relaxed">{camp.description}</p>
            </div>

            {/* Site types */}
            <div>
              <h2 className="font-semibold text-gray-900 mb-2">Site Types</h2>
              <div className="flex flex-wrap gap-2">
                {camp.site_types.map(type => (
                  <span key={type} className="badge-blue">{type}</span>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="font-semibold text-gray-900 mb-3">Amenities</h2>
              <div className="grid grid-cols-2 gap-2">
                {camp.amenities.map(a => (
                  <div key={a} className="flex items-center gap-2 text-sm text-gray-700">
                    <Check size={14} className="text-green-600 flex-shrink-0" />
                    {a}
                  </div>
                ))}
              </div>
            </div>

            {/* Cancellation Policy */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <AlertCircle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-amber-800 mb-1">Cancellation Policy</h3>
                  <p className="text-sm text-amber-700">{camp.cancellation_policy}</p>
                </div>
              </div>
            </div>

            {/* Check-in/out */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Clock size={14} className="text-green-700" />
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Check-in</span>
                </div>
                <p className="font-semibold text-gray-900">{camp.check_in}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Clock size={14} className="text-green-700" />
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Check-out</span>
                </div>
                <p className="font-semibold text-gray-900">{camp.check_out}</p>
              </div>
            </div>

            {/* Map */}
            <div>
              <h2 className="font-semibold text-gray-900 mb-3">Location</h2>
              <div className="h-64 rounded-2xl overflow-hidden border border-gray-100">
                <MapView campgrounds={[camp]} selectedId={camp.id} onSelect={() => {}} />
              </div>
            </div>
          </div>

          {/* Right column - booking card */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-200 p-5 sticky top-20 shadow-sm">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                ${camp.price_per_night}
                <span className="text-base font-normal text-gray-400">/night</span>
              </div>
              <div className="flex items-center gap-1 mb-4 text-sm">
                <Star size={13} className="text-yellow-400 fill-yellow-400" />
                <span className="font-semibold">{camp.rating}</span>
                <span className="text-gray-400">· {camp.review_count} reviews</span>
              </div>

              <div className="space-y-3 mb-5 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Season</span>
                  <span className="font-medium text-gray-900">{camp.season}</span>
                </div>
                {camp.max_rig_length && (
                  <div className="flex justify-between">
                    <span>Max RV Length</span>
                    <span className="font-medium text-gray-900">{camp.max_rig_length} ft</span>
                  </div>
                )}
              </div>

              <a
                href={camp.booking_url}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-colors ${
                  camp.available
                    ? 'bg-green-700 hover:bg-green-800 text-white'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
                }`}
              >
                {camp.available ? (
                  <><ExternalLink size={15} /> Book on Official Site</>
                ) : (
                  'Fully Booked'
                )}
              </a>

              <p className="text-xs text-center text-gray-400 mt-3">
                You'll be redirected to the official booking page.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
