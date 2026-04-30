'use client'

import { useState, useEffect } from 'react'
import { ExternalLink, RefreshCw, Tent, Zap, Droplets, TreePine, Info, AlertCircle, TrendingUp, Calendar } from 'lucide-react'
import { getRIDBFacility, getRIDBCampsites, formatCampsiteType, RIDBFacility, RIDBCampsite } from '@/lib/ridb'

interface DemandData {
  total: number
  avgNights: number
  avgPeople: number
  peakMonths: string[]
  topEquipment: { type: string; count: number }[]
}

interface Props {
  facilityId: string
  campgroundName: string
  bookingUrl?: string
}

interface SiteTypeSummary {
  type: string
  count: number
  accessible: number
}

function groupBySiteType(campsites: RIDBCampsite[]): SiteTypeSummary[] {
  const map = new Map<string, SiteTypeSummary>()
  for (const site of campsites) {
    const key = formatCampsiteType(site.CampsiteType)
    const existing = map.get(key)
    if (existing) {
      existing.count++
      if (site.CampsiteAccessible) existing.accessible++
    } else {
      map.set(key, { type: key, count: 1, accessible: site.CampsiteAccessible ? 1 : 0 })
    }
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count)
}

function siteTypeIcon(type: string) {
  if (type.includes('Full')) return <Droplets size={14} className="text-blue-500" />
  if (type.includes('Electric')) return <Zap size={14} className="text-yellow-500" />
  if (type.includes('Walk')) return <TreePine size={14} className="text-green-600" />
  return <Tent size={14} className="text-amber-700" />
}

export default function RIDBAvailability({ facilityId, campgroundName, bookingUrl }: Props) {
  const [facility, setFacility] = useState<RIDBFacility | null>(null)
  const [campsites, setCampsites] = useState<RIDBCampsite[]>([])
  const [demand, setDemand] = useState<DemandData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const [fac, sites] = await Promise.all([
        getRIDBFacility(facilityId),
        getRIDBCampsites(facilityId),
      ])
      setFacility(fac)
      setCampsites(sites)
      // Load demand data in background (non-blocking)
      fetch(`/api/ridb/reservations?facilityId=${facilityId}`)
        .then(r => r.json())
        .then(d => { if (d.total > 0) setDemand(d) })
        .catch(() => {}) // demand is bonus data — silently fail
    } catch {
      setError('Could not load live data from Recreation.gov')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [facilityId])

  const siteGroups = groupBySiteType(campsites)
  const totalSites = campsites.length
  const accessibleCount = campsites.filter(s => s.CampsiteAccessible).length
  const loops = Array.from(new Set(campsites.map(s => s.Loop).filter(Boolean)))

  const reservationUrl = facility?.FacilityReservationURL || bookingUrl

  return (
    <div className="rounded-2xl border border-green-100 bg-gradient-to-br from-green-50 to-emerald-50 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-green-700 text-white rounded-lg p-1.5">
            <TreePine size={16} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">Live Recreation.gov Data</h3>
            <p className="text-xs text-gray-500">RIDB · Facility #{facilityId}</p>
          </div>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="p-1.5 rounded-lg text-gray-400 hover:text-green-700 hover:bg-white transition-colors"
          title="Refresh"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-2 py-4 justify-center text-gray-400 text-sm">
          <RefreshCw size={14} className="animate-spin" />
          Loading from Recreation.gov…
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex items-center gap-2 text-amber-700 text-sm bg-amber-50 rounded-xl px-3 py-2">
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      {/* Data */}
      {!loading && !error && (
        <div className="space-y-4">
          {/* Facility name from RIDB */}
          {facility && (
            <div className="text-xs text-gray-500 bg-white/60 rounded-lg px-3 py-2">
              <span className="font-medium text-gray-700">Official name: </span>
              {facility.FacilityName}
              {facility.FacilityPhone && (
                <span className="ml-2 text-gray-400">· {facility.FacilityPhone}</span>
              )}
            </div>
          )}

          {/* Site count + ADA */}
          {totalSites > 0 && (
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-green-700">{totalSites}</div>
                <div className="text-xs text-gray-500 mt-0.5">Total Sites</div>
              </div>
              <div className="bg-white rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-blue-600">{loops.length}</div>
                <div className="text-xs text-gray-500 mt-0.5">Loops</div>
              </div>
              <div className="bg-white rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-purple-600">{accessibleCount}</div>
                <div className="text-xs text-gray-500 mt-0.5">ADA Sites</div>
              </div>
            </div>
          )}

          {/* Site type breakdown */}
          {siteGroups.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-600 mb-2 flex items-center gap-1">
                <Info size={12} /> Site types from official data
              </p>
              <div className="space-y-1.5">
                {siteGroups.map(g => (
                  <div key={g.type} className="flex items-center justify-between bg-white rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      {siteTypeIcon(g.type)}
                      <span className="text-sm text-gray-700">{g.type}</span>
                      {g.accessible > 0 && (
                        <span className="text-xs text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-full">
                          ♿ {g.accessible}
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{g.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Loops */}
          {loops.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1.5">Loops</p>
              <div className="flex flex-wrap gap-1.5">
                {loops.map(loop => (
                  <span key={loop} className="bg-white text-xs text-gray-600 border border-gray-200 rounded-full px-2.5 py-1">
                    {loop}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Demand intelligence from reservation history */}
          {demand && demand.total > 0 && (
            <div className="border border-amber-100 bg-amber-50 rounded-xl p-4 space-y-2">
              <p className="text-xs font-semibold text-amber-800 flex items-center gap-1.5">
                <TrendingUp size={12} /> Booking Demand (last 12 months)
              </p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white rounded-lg py-2 px-1">
                  <div className="text-base font-bold text-gray-900">{demand.total}</div>
                  <div className="text-xs text-gray-400">Reservations</div>
                </div>
                <div className="bg-white rounded-lg py-2 px-1">
                  <div className="text-base font-bold text-gray-900">{demand.avgNights}n</div>
                  <div className="text-xs text-gray-400">Avg stay</div>
                </div>
                <div className="bg-white rounded-lg py-2 px-1">
                  <div className="text-base font-bold text-gray-900">{demand.avgPeople}</div>
                  <div className="text-xs text-gray-400">Avg party</div>
                </div>
              </div>
              {demand.peakMonths.length > 0 && (
                <p className="text-xs text-amber-700 flex items-center gap-1">
                  <Calendar size={11} />
                  Peak months: <strong>{demand.peakMonths.join(', ')}</strong>
                </p>
              )}
            </div>
          )}

          {/* Book button */}
          {reservationUrl && (
            <a
              href={reservationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-green-700 hover:bg-green-800 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
            >
              Check Live Availability → Recreation.gov
              <ExternalLink size={14} />
            </a>
          )}

          <p className="text-xs text-gray-400 text-center">
            Data via RIDB · Live from Recreation.gov
          </p>
        </div>
      )}
    </div>
  )
}
