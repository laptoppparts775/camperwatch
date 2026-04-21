'use client'

import { campgrounds } from '@/lib/data'
import { useRouter } from 'next/navigation'
import { MapPin, Star, ExternalLink, ChevronLeft, Check, TreePine, Clock, AlertCircle, Phone, Mountain, Users, Zap, Calendar, ChevronRight } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useState } from 'react'

const MapView = dynamic(() => import('@/components/map/MapView'), { ssr: false })

export default function CampgroundPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const camp = campgrounds.find(c => c.slug === params.slug)
  const [activeImg, setActiveImg] = useState(0)

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

  const images = camp.images as Array<{url: string, alt: string, title: string, caption: string}>

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.back()} className="flex items-center gap-1 text-gray-500 hover:text-gray-900 text-sm">
            <ChevronLeft size={16} /> Back
          </button>
          <div className="flex items-center gap-2 ml-2">
            <TreePine size={18} className="text-green-700" />
            <span className="font-display font-semibold text-gray-900">CamperWatch</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Image Gallery */}
        <div className="mb-6">
          <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden mb-2">
            <img
              src={images[activeImg]?.url}
              alt={images[activeImg]?.alt}
              title={images[activeImg]?.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <p className="text-white text-sm">{images[activeImg]?.caption}</p>
            </div>
            {images.length > 1 && (
              <>
                <button onClick={() => setActiveImg(i => (i - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow">
                  <ChevronLeft size={16} />
                </button>
                <button onClick={() => setActiveImg(i => (i + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow">
                  <ChevronRight size={16} />
                </button>
              </>
            )}
          </div>
          <div className="flex gap-2">
            {images.map((img, i) => (
              <button key={i} onClick={() => setActiveImg(i)}
                className={`flex-1 h-16 rounded-lg overflow-hidden border-2 transition-all ${activeImg === i ? 'border-green-600' : 'border-transparent'}`}>
                <img src={img.url} alt={img.alt} title={img.title} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left — main content */}
          <div className="md:col-span-2 space-y-6">

            {/* Title block */}
            <div>
              <div className="flex items-start justify-between mb-1">
                <h1 className="font-display text-3xl font-bold text-gray-900">{camp.name}</h1>
                <span className={`ml-3 mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${camp.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {camp.available ? '✓ Sites Available' : '✗ Fully Booked'}
                </span>
              </div>
              {(camp as any).tagline && (
                <p className="text-green-700 font-medium text-sm mb-2">{(camp as any).tagline}</p>
              )}
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1"><MapPin size={13} />{camp.location}</span>
                <span className="flex items-center gap-1"><Star size={13} className="text-yellow-400 fill-yellow-400" />{camp.rating} ({camp.review_count} reviews)</span>
                {(camp as any).elevation && <span className="flex items-center gap-1"><Mountain size={13} />{(camp as any).elevation}</span>}
              </div>
            </div>

            {/* About */}
            <div>
              <h2 className="font-semibold text-gray-900 mb-2">About</h2>
              <p className="text-gray-600 leading-relaxed text-sm">{camp.description}</p>
            </div>

            {/* Best For + Site Types */}
            <div className="grid grid-cols-2 gap-4">
              {(camp as any).best_for && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">Best For</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {(camp as any).best_for.map((b: string) => (
                      <span key={b} className="bg-green-50 text-green-800 text-xs px-2.5 py-1 rounded-full font-medium">{b}</span>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">Site Types</h3>
                <div className="flex flex-wrap gap-1.5">
                  {camp.site_types.map(t => (
                    <span key={t} className="bg-blue-50 text-blue-800 text-xs px-2.5 py-1 rounded-full font-medium">{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="font-semibold text-gray-900 mb-3">Amenities</h2>
              <div className="grid grid-cols-2 gap-1.5">
                {camp.amenities.map(a => (
                  <div key={a} className="flex items-start gap-2 text-sm text-gray-700">
                    <Check size={13} className="text-green-600 flex-shrink-0 mt-0.5" />{a}
                  </div>
                ))}
              </div>
            </div>

            {/* Pro Tips */}
            {(camp as any).pro_tips && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                <h2 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                  <span>💡</span> Pro Tips from Real Campers
                </h2>
                <ul className="space-y-2">
                  {(camp as any).pro_tips.map((tip: string, i: number) => (
                    <li key={i} className="text-sm text-amber-800 leading-relaxed">{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Known Issues */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <AlertCircle size={15} className="text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-800 mb-1 text-sm">Known Issues</h3>
                  <p className="text-sm text-red-700">{camp.known_issues}</p>
                </div>
              </div>
            </div>

            {/* Nearby */}
            {(camp as any).nearby && (
              <div>
                <h2 className="font-semibold text-gray-900 mb-3">Nearby Attractions</h2>
                <div className="grid grid-cols-2 gap-2">
                  {(camp as any).nearby.map((n: string) => (
                    <div key={n} className="flex items-center gap-2 text-sm text-gray-600 bg-white border border-gray-100 rounded-lg px-3 py-2">
                      <MapPin size={12} className="text-green-600 flex-shrink-0" />{n}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cancellation Policy */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <Calendar size={15} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-blue-800 mb-1 text-sm">Cancellation Policy</h3>
                  <p className="text-sm text-blue-700">{camp.cancellation_policy}</p>
                </div>
              </div>
            </div>

            {/* Check-in/out + Quick Facts */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: Clock, label: 'Check-in', value: camp.check_in },
                { icon: Clock, label: 'Check-out', value: camp.check_out },
                { icon: Calendar, label: 'Season', value: camp.season },
                { icon: Users, label: 'Max/site', value: '6 people' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-white rounded-xl border border-gray-100 p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon size={12} className="text-green-700" />
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</span>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">{value}</p>
                </div>
              ))}
            </div>

            {/* Map */}
            <div>
              <h2 className="font-semibold text-gray-900 mb-3">Location</h2>
              <div className="h-64 rounded-2xl overflow-hidden border border-gray-100">
                <MapView campgrounds={[camp]} selectedId={camp.id} onSelect={() => {}} />
              </div>
              {(camp as any).address && (
                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                  <MapPin size={11} /> {(camp as any).address}
                </p>
              )}
            </div>
          </div>

          {/* Right — booking card */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-200 p-5 sticky top-20 shadow-sm">
              <div className="mb-1">
                <span className="text-3xl font-bold text-gray-900">${camp.price_per_night}</span>
                {(camp as any).price_high && (camp as any).price_high !== camp.price_per_night && (
                  <span className="text-gray-500 text-sm"> – ${(camp as any).price_high}</span>
                )}
                <span className="text-base font-normal text-gray-400">/night</span>
              </div>
              <div className="flex items-center gap-1 mb-4 text-sm">
                <Star size={13} className="text-yellow-400 fill-yellow-400" />
                <span className="font-semibold">{camp.rating}</span>
                <span className="text-gray-400">· {camp.review_count} reviews</span>
              </div>

              <div className="space-y-2.5 mb-5 text-sm">
                {[
                  ['Season', camp.season],
                  ['Max RV', camp.max_rig_length ? `${camp.max_rig_length} ft` : 'Tent only'],
                  ['Hookups', (camp as any).hookups?.split('.')[0] || 'None'],
                  ['Beach', (camp as any).nearest_beach || '—'],
                  ['Grocery', (camp as any).nearest_grocery || '—'],
                  ['Phone', camp.phone || '—'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-2">
                    <span className="text-gray-500 flex-shrink-0">{label}</span>
                    <span className="font-medium text-gray-900 text-right text-xs">{value}</span>
                  </div>
                ))}
              </div>

              <a href={camp.booking_url} target="_blank" rel="noopener noreferrer"
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-colors ${
                  camp.available
                    ? 'bg-green-700 hover:bg-green-800 text-white'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
                }`}>
                {camp.available ? <><ExternalLink size={15} /> Book Official Site</> : 'Currently Fully Booked'}
              </a>

              {!camp.available && (
                <p className="text-xs text-center text-amber-600 mt-2 font-medium">
                  ⚡ Check daily for cancellations on Recreation.gov
                </p>
              )}
              <p className="text-xs text-center text-gray-400 mt-2">
                Redirects to official booking page. No fees added by CamperWatch.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
