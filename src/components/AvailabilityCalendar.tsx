'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
const AlertButton = dynamic(() => import('@/components/AlertButton'), { ssr: false })

interface AvailabilityData {
  totalSites: number
  dailyAvailable: Record<string, number>
  dailyTotal: Record<string, number>
  siteTypes: Record<string, number>
  loops: string[]
  error?: string
}

interface Props {
  facilityId: string
  bookingUrl: string
  campgroundName: string
  campgroundSlug: string
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

function getDayColor(available: number, total: number, isPast: boolean) {
  if (isPast) return 'bg-gray-100 text-gray-300 cursor-not-allowed'
  if (total === 0) return 'bg-gray-50 text-gray-300 cursor-not-allowed'
  if (available === 0) return 'bg-red-50 text-red-400 cursor-not-allowed'
  const pct = available / total
  if (pct > 0.5) return 'bg-green-50 text-green-700 hover:bg-green-100 cursor-pointer font-medium'
  if (pct > 0.2) return 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 cursor-pointer font-medium'
  return 'bg-orange-50 text-orange-700 hover:bg-orange-100 cursor-pointer font-medium'
}

function getDotColor(available: number, total: number, isPast: boolean) {
  if (isPast || total === 0) return ''
  if (available === 0) return 'bg-red-400'
  const pct = available / total
  if (pct > 0.5) return 'bg-green-500'
  if (pct > 0.2) return 'bg-yellow-500'
  return 'bg-orange-500'
}

function buildBookingUrl(baseUrl: string, arrivalDate: string): string {
  if (!baseUrl) return baseUrl
  try {
    // Recreation.gov reads checkin/checkout from the URL when the SPA loads.
    // Format: YYYY-MM-DD. Checkout defaults to arrival + 1 night.
    if (baseUrl.includes('recreation.gov')) {
      const arrival = new Date(arrivalDate + 'T12:00:00')
      const departure = new Date(arrival)
      departure.setDate(departure.getDate() + 1)
      const fmt = (d: Date) => d.toISOString().slice(0, 10)
      const base = baseUrl.split('?')[0]
      return `${base}?checkin=${fmt(arrival)}&checkout=${fmt(departure)}`
    }
  } catch {}
  return baseUrl
}

export default function AvailabilityCalendar({ facilityId, bookingUrl, campgroundName, campgroundSlug }: Props) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [data, setData] = useState<AvailabilityData | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const monthStr = `${year}-${String(month + 1).padStart(2, '0')}-01`

  const fetchAvailability = useCallback(async () => {
    setLoading(true)
    setData(null)
    try {
      const res = await fetch(`/api/availability?facilityId=${facilityId}&month=${monthStr}`)
      const json = await res.json()
      setData(json)
    } catch {
      setData({ totalSites: 0, dailyAvailable: {}, dailyTotal: {}, siteTypes: {}, loops: [], error: 'Failed to load' })
    } finally {
      setLoading(false)
    }
  }, [facilityId, monthStr])

  useEffect(() => {
    fetchAvailability()
  }, [fetchAvailability])

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
    setSelectedDate(null)
  }

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
    setSelectedDate(null)
  }

  const canGoPrev = year > today.getFullYear() || (year === today.getFullYear() && month > today.getMonth())

  // Build calendar grid
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const todayStr = today.toISOString().slice(0, 10)

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null)

  const selectedAvail = selectedDate ? (data?.dailyAvailable[selectedDate] ?? 0) : 0
  const selectedTotal = selectedDate ? (data?.dailyTotal[selectedDate] ?? 0) : 0

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold text-lg">Live Availability</h3>
            <p className="text-green-100 text-sm mt-0.5">Real-time from Recreation.gov</p>
          </div>
          {data && !data.error && (
            <div className="text-right">
              <div className="text-white font-bold text-xl">{data.totalSites}</div>
              <div className="text-green-100 text-xs">total sites</div>
            </div>
          )}
        </div>
      </div>

      {/* Month nav */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
        <button
          onClick={prevMonth}
          disabled={!canGoPrev}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="font-semibold text-gray-800">{MONTHS[month]} {year}</span>
        <button
          onClick={nextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Calendar grid */}
      <div className="px-4 py-3">
        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map(d => (
            <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">{d}</div>
          ))}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center h-40">
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-gray-400">Loading availability...</span>
            </div>
          </div>
        )}

        {/* Error state */}
        {!loading && data?.error && (
          <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
            Availability data unavailable
          </div>
        )}

        {/* Calendar days */}
        {!loading && data && !data.error && (
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, idx) => {
              if (!day) return <div key={idx} />

              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const isPast = dateStr < todayStr
              const avail = data.dailyAvailable[dateStr] ?? 0
              const total = data.dailyTotal[dateStr] ?? 0
              const isSelected = selectedDate === dateStr
              const dotColor = getDotColor(avail, total, isPast)
              const cellColor = isSelected
                ? 'bg-green-600 text-white cursor-pointer'
                : getDayColor(avail, total, isPast)

              return (
                <button
                  key={dateStr}
                  onClick={() => {
                    if (!isPast && total > 0 && avail > 0) {
                      setSelectedDate(isSelected ? null : dateStr)
                    }
                  }}
                  className={`relative rounded-lg py-1.5 text-sm transition-all text-center ${cellColor} ${isSelected ? 'ring-2 ring-green-600 ring-offset-1' : ''}`}
                >
                  <span className="block text-xs">{day}</span>
                  {dotColor && !isSelected && (
                    <span className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${dotColor}`} />
                  )}
                  {isSelected && avail > 0 && (
                    <span className="block text-xs font-bold leading-none mt-0.5">{avail}</span>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Legend */}
      {!loading && data && !data.error && (
        <div className="px-4 pb-3 flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" />Plenty open</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-500 inline-block" />Limited</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" />Full</span>
        </div>
      )}

      {/* Selected date callout */}
      {selectedDate && data && (
        <div className="mx-4 mb-4 p-3 bg-green-50 rounded-xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-green-800">
                {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </div>
              <div className="text-green-700 text-sm mt-0.5">
                <span className="font-bold">{selectedAvail}</span> of {selectedTotal} sites available
              </div>
            </div>
            <a
              href={selectedDate ? buildBookingUrl(bookingUrl, selectedDate) : bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
            >
              See available sites on Recreation.gov →
            </a>
          </div>
        </div>
      )}

      {/* Footer CTA when no date selected */}
      {!selectedDate && (
        <div className="px-4 pb-4 space-y-3">
          <p className="text-center text-sm text-gray-500 leading-snug">
            <span className="font-medium text-gray-700">Pick a green date</span> — we&apos;ll take you to Recreation.gov with your dates pre-filled to choose a site.
          </p>
          <AlertButton
            campgroundSlug={campgroundSlug}
            campgroundName={campgroundName}
            facilityId={facilityId}
          />
        </div>
      )}
    </div>
  )
}
