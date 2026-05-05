'use client'

import { useState, useEffect } from 'react'
import { Trees, Zap, Droplets, Car, Users, Camera } from 'lucide-react'

interface Site {
  id: string
  name: string
  loop: string
  type: string
  accessible: boolean
  shade: string | null
  maxPeople: number | null
  maxVehicleLength: number | null
  electric: string | null
  water: string | null
  sewer: string | null
  pullThrough: boolean
}

interface Photo {
  url: string
  title: string
  description: string
}

interface CampsiteData {
  totalSites: number
  sites: Site[]
  photos: Photo[]
}

interface Props {
  facilityId: string
  campgroundName: string
}

function SiteTypeBadge({ type }: { type: string }) {
  const t = type.toLowerCase()
  if (t.includes('electric')) return <span className="bg-yellow-50 text-yellow-700 border border-yellow-200 text-[10px] font-bold px-2 py-0.5 rounded-full">Electric</span>
  if (t.includes('tent')) return <span className="bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold px-2 py-0.5 rounded-full">Tent Only</span>
  if (t.includes('group')) return <span className="bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold px-2 py-0.5 rounded-full">Group</span>
  if (t.includes('rv')) return <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-full">RV</span>
  return null
}

export default function SiteIntelligencePanel({ facilityId, campgroundName }: Props) {
  const [data, setData] = useState<CampsiteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [photoIdx, setPhotoIdx] = useState(0)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    fetch(`/api/campsites?facilityId=${facilityId}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.sites?.length) setData(d) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [facilityId])

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-5 animate-pulse">
        <div className="h-4 bg-gray-100 rounded w-32 mb-4" />
        <div className="grid grid-cols-2 gap-3">
          {[1,2,3,4].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl" />)}
        </div>
      </div>
    )
  }

  if (!data) return null

  // Build summary stats
  const shadedSites = data.sites.filter(s => s.shade === 'Yes').length
  const electricSites = data.sites.filter(s => s.electric && s.electric !== 'None').length
  const pullThroughs = data.sites.filter(s => s.pullThrough).length
  const maxRVLen = Math.max(...data.sites.map(s => s.maxVehicleLength || 0))
  const accessibleSites = data.sites.filter(s => s.accessible).length

  // Group by loop
  const loops = Array.from(new Set(data.sites.map(s => s.loop).filter(Boolean))).sort()

  const displaySites = showAll ? data.sites : data.sites.slice(0, 12)

  return (
    <div className="space-y-4">

      {/* Official photos from recreation.gov */}
      {data.photos.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-4 pt-4 pb-3">
            <div className="flex items-center gap-2">
              <Camera size={14} className="text-gray-400" />
              <span className="text-xs font-semibold text-gray-700">Official Photos</span>
              <span className="text-[10px] text-gray-400">via Recreation.gov</span>
            </div>
            <div className="flex gap-1">
              {data.photos.slice(0, 5).map((_, i) => (
                <button key={i} onClick={() => setPhotoIdx(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${i === photoIdx ? 'bg-green-600' : 'bg-gray-200'}`} />
              ))}
            </div>
          </div>
          <div className="relative aspect-video mx-4 mb-4 rounded-xl overflow-hidden bg-gray-100">
            <img
              src={data.photos[photoIdx]?.url}
              alt={data.photos[photoIdx]?.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {data.photos[photoIdx]?.title && (
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2">
                <p className="text-white text-xs font-medium">{data.photos[photoIdx].title}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Campground stats summary */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <div className="text-xs font-semibold text-gray-700 mb-3">
          Site breakdown — {data.totalSites} sites
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { icon: <Trees size={14} />, label: 'Shaded sites', val: `${shadedSites}`, color: 'text-green-600' },
            { icon: <Zap size={14} />, label: 'Electric hookup', val: electricSites > 0 ? `${electricSites}` : 'None', color: 'text-yellow-600' },
            { icon: <Car size={14} />, label: 'Pull-through', val: pullThroughs > 0 ? `${pullThroughs}` : 'None', color: 'text-blue-600' },
            { icon: <Users size={14} />, label: 'ADA accessible', val: `${accessibleSites}`, color: 'text-purple-600' },
          ].map(({ icon, label, val, color }) => (
            <div key={label} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <div className={`${color} mb-1`}>{icon}</div>
              <div className="text-sm font-bold text-gray-900">{val}</div>
              <div className="text-[10px] text-gray-500 leading-tight">{label}</div>
            </div>
          ))}
        </div>
        {maxRVLen > 0 && (
          <div className="mt-2 text-xs text-gray-500">
            Max RV length: <span className="font-semibold text-gray-700">{maxRVLen} ft</span>
            {loops.length > 0 && <> · Loops: <span className="font-semibold text-gray-700">{loops.slice(0,4).join(', ')}{loops.length > 4 ? ` +${loops.length-4}` : ''}</span></>}
          </div>
        )}
      </div>

      {/* Per-site grid */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <div className="text-xs font-semibold text-gray-700 mb-3">Individual sites</div>
        <div className="space-y-1.5">
          {displaySites.map(site => (
            <div key={site.id} className="flex items-center gap-2 py-1.5 border-b border-gray-50 last:border-0">
              <div className="w-12 text-xs font-bold text-gray-800 shrink-0">{site.name}</div>
              <div className="text-[10px] text-gray-400 w-24 shrink-0 truncate">{site.loop}</div>
              <SiteTypeBadge type={site.type} />
              <div className="flex items-center gap-2 ml-auto text-[10px] text-gray-500">
                {site.shade === 'Yes' && <span className="text-green-600">🌳</span>}
                {site.electric && site.electric !== 'None' && <span className="text-yellow-600">⚡</span>}
                {site.pullThrough && <span className="text-blue-600">↔</span>}
                {site.maxPeople && <span className="flex items-center gap-0.5"><Users size={9} />{site.maxPeople}</span>}
                {site.maxVehicleLength && <span>{site.maxVehicleLength}ft</span>}
                {site.accessible && <span className="text-purple-600">♿</span>}
              </div>
            </div>
          ))}
        </div>
        {data.sites.length > 12 && (
          <button onClick={() => setShowAll(!showAll)}
            className="mt-3 text-xs text-green-600 hover:text-green-700 font-semibold">
            {showAll ? 'Show less' : `Show all ${data.sites.length} sites`}
          </button>
        )}
      </div>
    </div>
  )
}
