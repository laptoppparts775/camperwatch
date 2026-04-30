'use client'

import { useState, useEffect } from 'react'
import { ExternalLink, RefreshCw, TreePine, ChevronLeft, ChevronRight, TrendingUp, Calendar, Tent, Zap } from 'lucide-react'

interface Props {
  facilityId: string
  campgroundName: string
  bookingUrl?: string
}

interface AvailData {
  totalSites: number
  available: number
  reserved: number
  siteTypes: Record<string, number>
  loops: string[]
  month: string
}

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function formatSiteType(type: string): string {
  const map: Record<string, string> = {
    'STANDARD NONELECTRIC': 'Tent / No Hookups',
    'ELECTRIC HOOKUP': 'Electric Hookup',
    'FULL HOOKUP': 'Full Hookups',
    'WALK TO': 'Walk-in',
    'TENT ONLY NONELECTRIC': 'Tent Only',
    'RV NONELECTRIC': 'RV No Hookups',
    'GROUP STANDARD NONELECTRIC': 'Group Site',
    'EQUESTRIAN NONELECTRIC': 'Equestrian',
    'MANAGEMENT': 'Host Site',
  }
  return map[type] ?? type
}

function getAvailColor(available: number, total: number): string {
  if (total === 0) return 'bg-gray-200'
  const pct = available / (total * 30)
  if (available === 0) return 'bg-red-500'
  if (pct < 0.1) return 'bg-amber-500'
  return 'bg-green-500'
}

function getAvailLabel(available: number): string {
  if (available === 0) return 'Fully Booked'
  if (available < 20) return 'Very Limited'
  if (available < 100) return 'Some Available'
  return 'Good Availability'
}

export default function AvailabilityWidget({ facilityId, campgroundName, bookingUrl }: Props) {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth()) // 0-indexed
  const [data, setData] = useState<AvailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchAvailability = async (y: number, m: number) => {
    setLoading(true)
    setError(false)
    const monthStr = `${y}-${String(m + 1).padStart(2, '0')}-01`
    try {
      const res = await fetch(`/api/availability?facilityId=${facilityId}&month=${monthStr}`)
      if (!res.ok) throw new Error()
      const d = await res.json()
      setData(d)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAvailability(year, month) }, [facilityId, year, month])

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  // Don't show past months
  const isPast = year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth())

  const availPct = data && data.totalSites > 0
    ? Math.round((data.available / (data.totalSites * 30)) * 100)
    : 0

  return (
    <div className="rounded-2xl border border-green-100 bg-gradient-to-br from-green-50 to-emerald-50 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-green-700 text-white rounded-lg p-1.5">
            <Calendar size={16} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">Live Availability</h3>
            <p className="text-xs text-gray-400">via Recreation.gov · updates every 15min</p>
          </div>
        </div>
        <button
          onClick={() => fetchAvailability(year, month)}
          disabled={loading}
          className="p-1.5 rounded-lg text-gray-400 hover:text-green-700 hover:bg-white transition-colors"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Month navigator */}
      <div className="flex items-center justify-between bg-white rounded-xl px-4 py-2.5 mb-4 border border-gray-100">
        <button
          onClick={prevMonth}
          disabled={isPast}
          className="p-1 rounded-lg text-gray-400 hover:text-gray-700 disabled:opacity-30 transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="font-semibold text-gray-900 text-sm">
          {MONTH_NAMES[month]} {year}
        </span>
        <button onClick={nextMonth} className="p-1 rounded-lg text-gray-400 hover:text-gray-700 transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2 py-6 text-gray-400 text-sm">
          <RefreshCw size={14} className="animate-spin" />
          Checking Recreation.gov…
        </div>
      )}

      {!loading && error && (
        <div className="text-center py-4 text-sm text-gray-400">
          Could not load availability — try refreshing
        </div>
      )}

      {!loading && !error && data && (
        <div className="space-y-4">
          {/* Big availability status */}
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {MONTH_NAMES[month]} availability
              </span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                data.available === 0
                  ? 'bg-red-100 text-red-700'
                  : data.available < 20
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-green-100 text-green-700'
              }`}>
                {getAvailLabel(data.available)}
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
              <div
                className={`h-full rounded-full transition-all ${getAvailColor(data.available, data.totalSites)}`}
                style={{ width: `${Math.min(100, availPct * 3)}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-xl font-bold text-green-700">{data.available}</div>
                <div className="text-xs text-gray-400">Available nights</div>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-400">{data.reserved}</div>
                <div className="text-xs text-gray-400">Reserved</div>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">{data.totalSites}</div>
                <div className="text-xs text-gray-400">Total sites</div>
              </div>
            </div>
          </div>

          {/* Site types */}
          {Object.keys(data.siteTypes).length > 0 && (
            <div className="space-y-1.5">
              {Object.entries(data.siteTypes)
                .filter(([t]) => t !== 'MANAGEMENT')
                .sort((a, b) => b[1] - a[1])
                .map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-gray-100">
                    <div className="flex items-center gap-2">
                      {type.includes('ELECTRIC') || type.includes('HOOKUP')
                        ? <Zap size={13} className="text-yellow-500" />
                        : <Tent size={13} className="text-amber-700" />
                      }
                      <span className="text-sm text-gray-700">{formatSiteType(type)}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{count} sites</span>
                  </div>
                ))}
            </div>
          )}

          {/* Loops */}
          {data.loops.length > 0 && data.loops.length <= 8 && (
            <div>
              <p className="text-xs text-gray-500 mb-1.5 font-medium">Loops</p>
              <div className="flex flex-wrap gap-1.5">
                {data.loops.map(loop => (
                  <span key={loop} className="bg-white text-xs text-gray-600 border border-gray-200 rounded-full px-2.5 py-1">
                    {loop}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <a
            href={bookingUrl || `https://www.recreation.gov/camping/campgrounds/${facilityId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-green-700 hover:bg-green-800 text-white text-sm font-semibold py-3 rounded-xl transition-colors"
          >
            {data.available === 0 ? 'Check for Cancellations' : 'Book on Recreation.gov'}
            <ExternalLink size={14} />
          </a>

          {data.available === 0 && (
            <p className="text-xs text-amber-700 text-center bg-amber-50 rounded-lg py-2">
              ⏰ Check daily at 7am PST — cancellations open instantly
            </p>
          )}
        </div>
      )}
    </div>
  )
}
