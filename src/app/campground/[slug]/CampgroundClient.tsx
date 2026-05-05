'use client'
import { Campground } from '@/lib/data'
import { ridbData } from '@/lib/ridbData'
import { useRouter } from 'next/navigation'
import { MapPin, Star, ExternalLink, ChevronLeft, Check, TreePine, Clock, AlertCircle, Mountain, Users, Calendar, ChevronRight } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useState, Suspense } from 'react'
import ShareButtons from '@/components/community/ShareButtons'
import SiteGuide from '@/components/SiteGuide'
import { siteGuides } from '@/lib/siteGuides'
import { campIntelligence } from '@/lib/intelligence'
import { reviews as allReviews, campaignInsights } from '@/lib/reviews'
import ReviewsSection from '@/components/reviews/ReviewsSection'
import Link from 'next/link'
import NavBar from '@/components/NavBar'

const MapView = dynamic(() => import('@/components/map/MapView'), { ssr: false })
const TipsList = dynamic(() => import('@/components/community/TipsList'), { ssr: false })
const CommunityFeed = dynamic(() => import('@/components/community/CommunityFeed'), { ssr: false })
const PhotoUpload = dynamic(() => import('@/components/community/PhotoUpload'), { ssr: false })
const IntelligenceSection = dynamic(() => import('@/components/IntelligenceSection'), { ssr: false })
const AvailabilityCalendar = dynamic(() => import('@/components/AvailabilityCalendar'), { ssr: false })
const ReferralPartners = dynamic(() => import('@/components/ReferralPartners'), { ssr: false })
const WeatherWidget = dynamic(() => import('@/components/WeatherWidget'), { ssr: false })
const SiteIntelligencePanel = dynamic(() => import('@/components/SiteIntelligencePanel'), { ssr: false })
const CampConditionsPanel = dynamic(() => import('@/components/CampConditionsPanel'), { ssr: false })
const CampgroundChat = dynamic(() => import('@/components/community/CampgroundChat'), { ssr: false })
const TripLogButton = dynamic(() => import('@/components/TripLogButton'), { ssr: false })
const GearRecommendations = dynamic(() => import('@/components/GearRecommendations'), { ssr: false })

export default function CampgroundClient({ camp }: { camp: Campground }) {
  const router = useRouter()
  const [activeImg, setActiveImg] = useState(0)
  const images = camp.images || []
  const intel = campIntelligence[camp.slug]
  const campReviews = (allReviews as any)[camp.slug] || []
  const insights = campaignInsights[camp.slug]
  const guide = siteGuides[camp.slug]
  const proTips = camp.pro_tips || []

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-0 overflow-x-hidden">
      {/* Header */}
      <NavBar />

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Image Gallery */}
        <div className="mb-6">
          <div className="relative h-72 md:h-[420px] rounded-2xl overflow-hidden mb-2">
            <img
              src={images[activeImg]?.url}
              alt={images[activeImg]?.alt}
              title={images[activeImg]?.title}
              width={1200} height={420}
              fetchPriority="high"
              loading="eager"
              decoding="sync"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <p className="text-white text-sm">{images[activeImg]?.caption}</p>
            </div>
            {images.length > 1 && <>
              <button onClick={() => setActiveImg(i => (i - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow"><ChevronLeft size={16}/></button>
              <button onClick={() => setActiveImg(i => (i + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow"><ChevronRight size={16}/></button>
            </>}
          </div>
          <div className="flex gap-2">
            {images.map((img, i) => (
              <button key={i} onClick={() => setActiveImg(i)} className={`flex-1 h-14 md:h-20 rounded-lg overflow-hidden border-2 transition-all ${activeImg === i ? 'border-green-600' : 'border-transparent opacity-70'}`}>
                <img
                  src={img.url}
                  alt={img.alt}
                  title={img.title}
                  width={300} height={80}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left */}
          <div className="md:col-span-2 space-y-6">
            {/* Title */}
            <div>
              <div className="flex items-start justify-between mb-1 flex-wrap gap-2">
                <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-900">{camp.name}</h1>
                {!(camp as any).ridb_facility_id && (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${camp.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {camp.available ? '✓ Sites Available' : '✗ Fully Booked'}
                  </span>
                )}
              </div>
              {(camp as any).tagline && <p className="text-green-700 font-medium text-sm mb-2" data-speakable="true">{(camp as any).tagline}</p>}
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
                <span className="flex items-center gap-1"><MapPin size={13}/>{camp.location}</span>
                <span className="flex items-center gap-1"><Star size={13} className="text-yellow-400 fill-yellow-400"/>{camp.rating} ({camp.review_count})</span>
                {(camp as any).elevation && <span className="flex items-center gap-1"><Mountain size={13}/>{(camp as any).elevation}</span>}
              </div>
              <ShareButtons title={camp.name} url={`https://camperwatch.org/campground/${camp.slug}`} description={(camp as any).tagline || camp.description?.slice(0,120) || ''}/>
            </div>

            {/* About */}
            <div>
              <h2 className="font-semibold text-gray-900 mb-2">About</h2>
              <p className="text-gray-600 leading-relaxed text-sm" data-speakable="true">{camp.description}</p>
            </div>

            {/* Best For + Site Types */}
            <div className="grid grid-cols-2 gap-4">
              {(camp as any).best_for && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">Best For</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {(camp as any).best_for.map((b: string) => <span key={b} className="bg-green-50 text-green-800 text-xs px-2.5 py-1 rounded-full font-medium">{b}</span>)}
                  </div>
                </div>
              )}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">Site Types</h3>
                <div className="flex flex-wrap gap-1.5">
                  {camp.site_types.map(t => <span key={t} className="bg-blue-50 text-blue-800 text-xs px-2.5 py-1 rounded-full font-medium">{t}</span>)}
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="font-semibold text-gray-900 mb-3">Amenities</h2>
              <div className="grid grid-cols-2 gap-1.5">
                {camp.amenities.map(a => (
                  <div key={a} className="flex items-start gap-2 text-sm text-gray-700">
                    <Check size={13} className="text-green-600 flex-shrink-0 mt-0.5"/>{a}
                  </div>
                ))}
              </div>
            </div>

            {/* Intelligence Guide */}
            {intel && (
              <div>
                <h2 className="font-semibold text-gray-900 mb-4">Complete Campground Guide 🧠</h2>
                <IntelligenceSection intel={intel} name={camp.name}/>
              </div>
            )}

            {/* Site Guide — loops, best sites, rules */}
            {siteGuides[camp.slug] && (
              <div>
                <h2 className="font-semibold text-gray-900 mb-4">Site Guide — Pick the Right Spot 🗺️</h2>
                <SiteGuide guide={siteGuides[camp.slug]} name={camp.name} />
              </div>
            )}

            <div className="flex flex-wrap gap-2 mb-6">
              <TripLogButton slug={camp.slug} campName={camp.name} />
            </div>
            {/* Pro Tips */}
            {proTips.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                <h2 className="font-semibold text-amber-900 mb-3">💡 Pro Tips from Real Campers</h2>
                <ul className="space-y-2">
                  {proTips.map((tip: string, i: number) => <li key={i} className="text-sm text-amber-800 leading-relaxed">{tip}</li>)}
                </ul>
              </div>
            )}

            {/* Gear Recommendations — contextual affiliate placements */}
            <GearRecommendations camp={camp} />

            {/* Community Tips */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <Suspense fallback={<p className="text-xs text-gray-400">Loading tips...</p>}>
                <TipsList campgroundId={camp.slug}/>
              </Suspense>
            </div>

            {/* Camper Photos */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <Suspense fallback={<p className="text-xs text-gray-400">Loading photos...</p>}>
                <PhotoUpload campgroundId={camp.slug}/>
              </Suspense>
            </div>

            {/* Reviews */}
            {allReviews[camp.slug] && (
              <div>
                <h2 className="font-semibold text-gray-900 mb-4">What Campers Are Saying 💬</h2>
                <ReviewsSection campgroundId={camp.slug} reviews={allReviews[camp.slug]} sentiment={campaignInsights[camp.slug]?.sentiment || 70}/>
              </div>
            )}

            {/* Known Issues */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <AlertCircle size={15} className="text-red-500 mt-0.5 flex-shrink-0"/>
                <div>
                  <h3 className="font-semibold text-red-800 mb-1 text-sm">Known Issues</h3>
                  <p className="text-sm text-red-700">{camp.known_issues}</p>
                </div>
              </div>
            </div>

            {/* Nearby */}
            {(camp as any).nearby && (
              <div>
                <h2 className="font-semibold text-gray-900 mb-3">Nearby</h2>
                <div className="grid grid-cols-2 gap-2">
                  {(camp as any).nearby.map((n: string) => (
                    <div key={n} className="flex items-center gap-2 text-sm text-gray-600 bg-white border border-gray-100 rounded-lg px-3 py-2">
                      <MapPin size={12} className="text-green-600 flex-shrink-0"/>{n}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cancellation */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <Calendar size={15} className="text-blue-600 mt-0.5 flex-shrink-0"/>
                <div>
                  <h3 className="font-semibold text-blue-800 mb-1 text-sm">Cancellation Policy</h3>
                  <p className="text-sm text-blue-700">{camp.cancellation_policy}</p>
                </div>
              </div>
            </div>

            {/* Quick facts */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: Clock, label: 'Check-in', value: camp.check_in },
                { icon: Clock, label: 'Check-out', value: camp.check_out },
                { icon: Calendar, label: 'Season', value: camp.season },
                { icon: Users, label: 'Max/site', value: '6 people' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-white rounded-xl border border-gray-100 p-3">
                  <div className="flex items-center gap-1.5 mb-1"><Icon size={12} className="text-green-700"/><span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</span></div>
                  <p className="font-semibold text-gray-900 text-sm">{value}</p>
                </div>
              ))}
            </div>

            {/* RIDB Data — federal campgrounds, sourced from official RIDB export */}
            {(camp as any).ridb_facility_id && camp.booking_url?.includes('recreation.gov') && (() => {
              const rd = ridbData[camp.slug]
              if (!rd) return null
              return (
                <div className="rounded-2xl border border-green-100 bg-gradient-to-br from-green-50 to-emerald-50 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-green-700 text-white rounded-lg p-1.5">
                      <TreePine size={16} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">Federal Campground</h3>
                      <p className="text-xs text-gray-500">Official data via Recreation.gov · RIDB #{rd.facilityId}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-white rounded-xl p-3 text-center">
                      <div className="text-base font-bold text-green-700">{rd.totalSites}</div>
                      <div className="text-xs text-gray-400 mt-0.5">Total Sites</div>
                    </div>
                    <div className="bg-white rounded-xl p-3 text-center">
                      <div className="text-base font-bold text-purple-600">{rd.accessibleSites}</div>
                      <div className="text-xs text-gray-400 mt-0.5">ADA Sites</div>
                    </div>
                    <div className="bg-white rounded-xl p-3 text-center">
                      <div className="text-base font-bold text-blue-600">{rd.loops.length || '—'}</div>
                      <div className="text-xs text-gray-400 mt-0.5">Loops</div>
                    </div>
                  </div>
                  {rd.siteTypes.length > 0 && (
                    <div className="space-y-1.5 mb-4">
                      {rd.siteTypes.map(st => (
                        <div key={st.type} className="flex items-center justify-between bg-white rounded-lg px-3 py-2">
                          <span className="text-sm text-gray-700">{st.type}</span>
                          <span className="text-sm font-semibold text-gray-900">{st.count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {rd.loops.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {rd.loops.map(l => (
                        <span key={l} className="bg-white border border-gray-200 text-xs text-gray-600 px-2.5 py-1 rounded-full">{l}</span>
                      ))}
                    </div>
                  )}
                  <div className="mt-2">
                    <AvailabilityCalendar
                      facilityId={(camp as any).ridb_facility_id}
                      bookingUrl={camp.booking_url}
                      campgroundName={camp.name}
                      campgroundSlug={camp.slug}
                    />
                  </div>
                </div>
              )
            })()}

            {/* Weather */}
            {camp.lat && camp.lng && <WeatherWidget lat={camp.lat} lng={camp.lng} campgroundName={camp.name} />}

            {/* Park conditions — NPS alerts, air quality, sunrise, wildlife */}
            {camp.lat && camp.lng && (
              <CampConditionsPanel
                lat={camp.lat}
                lng={camp.lng}
                npsCode={(camp as any).nps_park_code}
                campgroundName={camp.name}
              />
            )}

            {/* Site intelligence — official photos + per-site data from RIDB */}
            {(camp as any).ridb_facility_id && (
              <SiteIntelligencePanel
                facilityId={(camp as any).ridb_facility_id}
                campgroundName={camp.name}
              />
            )}

            {/* Map */}
            <div>
              <h2 className="font-semibold text-gray-900 mb-3">Location</h2>
              <div className="h-64 rounded-2xl overflow-hidden border border-gray-100">
                <MapView campgrounds={[camp]} selectedId={camp.id ?? null} onSelect={() => {}}/>
              </div>
            </div>

            {/* Community Feed */}
            <div>
              <h2 className="font-semibold text-gray-900 mb-4">Camper Posts 🏕️</h2>
              <Suspense fallback={<p className="text-xs text-gray-400">Loading...</p>}>
            {/* Live Camper Chat */}
            <div className="mt-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">💬 Live Camper Chat</h2>
              <CampgroundChat slug={camp.slug} />
            </div>

                <CommunityFeed campgroundId={camp.slug}/>
              </Suspense>
            </div>
          </div>

          {/* Right — booking card / availability */}
          <div>
            <div className="sticky top-20">
            {(camp as any).ridb_facility_id && camp.booking_url?.includes('recreation.gov') ? (
              <>
                <AvailabilityCalendar
                  facilityId={(camp as any).ridb_facility_id}
                  bookingUrl={camp.booking_url}
                  campgroundName={camp.name}
                  campgroundSlug={camp.slug}
                />
                <ReferralPartners campgroundSlug={camp.slug} />
              </>
            ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <div className="mb-1">
                <span className="text-3xl font-bold text-gray-900">${camp.price_per_night}</span>
                {(camp as any).price_high && (camp as any).price_high !== camp.price_per_night && <span className="text-gray-400 text-sm"> – ${(camp as any).price_high}</span>}
                <span className="text-gray-400 text-sm">/night</span>
              </div>
              <div className="flex items-center gap-1 mb-4 text-sm">
                <Star size={13} className="text-yellow-400 fill-yellow-400"/>
                <span className="font-semibold">{camp.rating}</span>
                <span className="text-gray-400">· {camp.review_count} reviews</span>
              </div>
              <div className="space-y-2 mb-5 text-sm divide-y divide-gray-50">
                {[
                  ['Season', camp.season],
                  ['Max RV', camp.max_rig_length ? `${camp.max_rig_length} ft` : 'No hookups'],
                  ['Hookups', ((camp as any).hookups || 'None').split('.')[0]],
                  ['Beach', (camp as any).nearest_beach || '—'],
                  ['Grocery', (camp as any).nearest_grocery || '—'],
                  ['Phone', camp.phone || '—'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-2 pt-2 first:pt-0">
                    <span className="text-gray-400">{label}</span>
                    <span className="font-medium text-gray-900 text-right text-xs leading-relaxed max-w-[60%]">{value}</span>
                  </div>
                ))}
              </div>
              <a href={`/book/${camp.slug}`}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm bg-green-700 hover:bg-green-800 text-white transition-colors mb-2">
                🏕 Book Directly — No Extra Fees
              </a>
              <ReferralPartners campgroundSlug={camp.slug} />
              {camp.booking_url && (
                <a href={camp.booking_url} target="_blank" rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors">
                  <ExternalLink size={13}/> Also on {camp.booking_url.includes('recreation.gov') ? 'Recreation.gov' : 'external site'}
                </a>
              )}
              <p className="text-xs text-center text-gray-400 mt-2">No fees added by CamperWatch.</p>
            </div>
            )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile sticky CTA — psychology: urgency + clear price + trust */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 pt-3 pb-safe z-40 shadow-2xl" style={{paddingBottom: 'max(16px, env(safe-area-inset-bottom))'}}>
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 min-w-0">
            <div className="flex items-baseline gap-0.5">
              <span className="font-black text-xl text-gray-900">${camp.price_per_night}</span>
              <span className="text-gray-400 text-xs">/night</span>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <Star size={10} className="text-yellow-400 fill-yellow-400 shrink-0" />
              <span className="text-[10px] font-bold text-gray-700">{camp.rating}</span>
              <span className="text-[10px] text-gray-400">({camp.review_count})</span>
            </div>
          </div>
          {camp.available ? (
            <a href={`/book/${camp.slug}`}
              className="flex-1 flex items-center justify-center gap-1.5 py-3.5 rounded-2xl font-bold text-sm bg-green-700 text-white shadow-lg active:bg-green-800 transition-colors">
              🏕 Book Now — No Fees
            </a>
          ) : (
            <a href={camp.booking_url || `#`} target={camp.booking_url ? '_blank' : undefined} rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-3.5 rounded-2xl font-bold text-sm bg-amber-500 text-white shadow-lg active:bg-amber-600 transition-colors">
              Check Recreation.gov →
            </a>
          )}
        </div>
        <p className="text-center text-[10px] text-gray-400 mt-1.5">
          {camp.available ? 'Instant confirmation · No booking fees · Cancel free' : 'Sold out here · Set an alert above for cancellations'}
        </p>
      </div>
    </div>
  )
}
