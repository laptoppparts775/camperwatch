'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, Info, XCircle, Sunrise, Sunset, Wind, Bird, PawPrint, Newspaper, Flame, Activity } from 'lucide-react'

interface NPSAlert { id: string; title: string; category: string; description: string; url: string }
interface AQData { available: boolean; aqi?: number; level?: string; color?: string; description?: string; noData?: boolean }
interface SunData { today: { sunrise: string; sunset: string; civilTwilightBegin: string; civilTwilightEnd: string; dayLength: number }; tomorrow: { sunrise: string; sunset: string } }
interface Wildlife { name: string; scientific: string; observedOn: string; photo: string; iconic: string }
interface Fire { name: string; acres: number | null; contained: number | null; state: string; distanceMi: number; updatedAt: string }
interface Quake { mag: number; place: string; time: string; depth: number; distanceMi: number; felt: number | null; url: string }

function alertIcon(c: string) {
  if (c === 'Park Closure') return <XCircle size={14} className="text-red-600 shrink-0 mt-0.5" />
  if (c === 'Danger') return <AlertTriangle size={14} className="text-orange-600 shrink-0 mt-0.5" />
  if (c === 'Caution') return <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
  return <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />
}
function alertBg(c: string) {
  if (c === 'Park Closure') return 'bg-red-50 border-red-200'
  if (c === 'Danger') return 'bg-orange-50 border-orange-200'
  if (c === 'Caution') return 'bg-amber-50 border-amber-200'
  return 'bg-blue-50 border-blue-200'
}
function aqiBg(color: string) {
  const m: Record<string, string> = {
    green: 'bg-green-50 border-green-200 text-green-800',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    orange: 'bg-orange-50 border-orange-200 text-orange-800',
    red: 'bg-red-50 border-red-200 text-red-800',
    purple: 'bg-purple-50 border-purple-200 text-purple-800',
    maroon: 'bg-red-100 border-red-300 text-red-900',
  }
  return m[color] || 'bg-gray-50 border-gray-200 text-gray-700'
}
function formatTime(iso: string) {
  if (!iso) return '--'
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}
function formatDayLength(s: number) {
  return `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`
}
function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const d = Math.floor(diff / 86400000)
  if (d === 0) return 'today'
  if (d === 1) return 'yesterday'
  return `${d}d ago`
}

interface Props { lat: number; lng: number; npsCode?: string; campgroundName: string }

export default function CampConditionsPanel({ lat, lng, npsCode, campgroundName }: Props) {
  const [alerts, setAlerts] = useState<NPSAlert[] | null>(null)
  const [aqi, setAqi] = useState<AQData | null>(null)
  const [sun, setSun] = useState<SunData | null>(null)
  const [wildlife, setWildlife] = useState<{ mammals: Wildlife[]; birds: Wildlife[]; recentSightings: Wildlife[] } | null>(null)
  const [fires, setFires] = useState<Fire[] | null>(null)
  const [quakes, setQuakes] = useState<Quake[] | null>(null)
  const [showAllAlerts, setShowAllAlerts] = useState(false)
  const [wildlifeTab, setWildlifeTab] = useState<'recent' | 'mammals' | 'birds'>('recent')

  useEffect(() => {
    if (npsCode) {
      fetch(`/api/nps-alerts?parkCode=${npsCode}`)
        .then(r => r.ok ? r.json() : null)
        .then(d => d?.alerts && setAlerts(d.alerts))
        .catch(() => {})
    }
    fetch(`/api/airquality?lat=${lat}&lng=${lng}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => d && setAqi(d))
      .catch(() => {})
    fetch(`/api/sunrise?lat=${lat}&lng=${lng}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => d?.today && setSun(d))
      .catch(() => {})
    fetch(`/api/wildlife?lat=${lat}&lng=${lng}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => d?.mammals && setWildlife(d))
      .catch(() => {})
    fetch(`/api/fires?lat=${lat}&lng=${lng}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => d?.fires && setFires(d.fires))
      .catch(() => {})
    fetch(`/api/earthquakes?lat=${lat}&lng=${lng}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => d?.quakes && setQuakes(d.quakes))
      .catch(() => {})
  }, [lat, lng, npsCode])

  const hasContent = (alerts && alerts.length > 0) || (aqi?.available && !aqi.noData) || sun || wildlife ||
    (fires && fires.length > 0) || (quakes && quakes.length > 0)

  if (!hasContent) return null

  const displayAlerts = showAllAlerts ? (alerts || []) : (alerts || []).slice(0, 2)

  return (
    <div className="space-y-4">

      {/* Active Fires */}
      {fires && fires.length > 0 && (
        <div className="bg-red-50 rounded-2xl border border-red-200 overflow-hidden">
          <div className="px-4 pt-4 pb-2 flex items-center gap-2">
            <Flame size={14} className="text-red-600" />
            <span className="text-xs font-semibold text-red-800">Active Wildfires Nearby</span>
            <span className="text-[10px] font-bold bg-red-200 text-red-700 px-2 py-0.5 rounded-full">{fires.length}</span>
            <span className="text-[10px] text-red-400 ml-auto">via NIFC</span>
          </div>
          <div className="px-4 pb-4 space-y-2">
            {fires.slice(0, 3).map((fire, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-xl border border-red-100 p-3">
                <Flame size={16} className="text-red-500 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-gray-900">{fire.name}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5 flex flex-wrap gap-x-2">
                    {fire.distanceMi > 0 && <span>{fire.distanceMi} mi away</span>}
                    {fire.acres && <span>{fire.acres.toLocaleString()} acres</span>}
                    {fire.contained !== null && <span>{fire.contained}% contained</span>}
                    {fire.state && <span>{fire.state}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NPS Alerts */}
      {alerts && alerts.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-4 pt-4 pb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} className="text-amber-500" />
              <span className="text-xs font-semibold text-gray-700">Park Alerts</span>
              <span className="text-[10px] text-gray-400">via NPS</span>
            </div>
            <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{alerts.length}</span>
          </div>
          <div className="px-4 pb-4 space-y-2">
            {displayAlerts.map(alert => (
              <div key={alert.id} className={`flex gap-2.5 p-3 rounded-xl border text-xs ${alertBg(alert.category)}`}>
                {alertIcon(alert.category)}
                <div className="min-w-0">
                  <div className="font-semibold text-gray-900 leading-tight">{alert.title}</div>
                  {alert.description && <div className="text-gray-600 mt-0.5 line-clamp-2">{alert.description}</div>}
                  {alert.url && <a href={alert.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mt-1 inline-block">Details →</a>}
                </div>
              </div>
            ))}
            {alerts.length > 2 && (
              <button onClick={() => setShowAllAlerts(!showAllAlerts)} className="text-xs text-gray-500 hover:text-gray-700 font-medium">
                {showAllAlerts ? 'Show less' : `+${alerts.length - 2} more alerts`}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Air Quality */}
      {aqi?.available && !aqi.noData && aqi.aqi !== undefined && (
        <div className={`rounded-2xl border p-4 ${aqiBg(aqi.color || 'green')}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wind size={14} />
              <span className="text-xs font-semibold">Air Quality</span>
              <span className="text-[10px] opacity-60">via EPA AirNow</span>
            </div>
            <div className="text-right">
              <span className="text-xl font-black">{aqi.aqi}</span>
              <span className="text-xs ml-1 font-semibold opacity-80">{aqi.level}</span>
            </div>
          </div>
          {aqi.description && <p className="text-xs mt-1 opacity-75">{aqi.description}</p>}
        </div>
      )}

      {/* Sunrise / Sunset */}
      {sun?.today && (
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sunrise size={14} className="text-amber-500" />
            <span className="text-xs font-semibold text-gray-700">Sun times today</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
              <div className="flex items-center gap-1.5 mb-1">
                <Sunrise size={12} className="text-amber-500" />
                <span className="text-[10px] text-amber-700 font-semibold uppercase tracking-wide">Sunrise</span>
              </div>
              <div className="text-base font-black text-gray-900">{formatTime(sun.today.sunrise)}</div>
              {sun.today.civilTwilightBegin && <div className="text-[10px] text-gray-500 mt-0.5">Golden hour: {formatTime(sun.today.civilTwilightBegin)}</div>}
            </div>
            <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-100">
              <div className="flex items-center gap-1.5 mb-1">
                <Sunset size={12} className="text-indigo-500" />
                <span className="text-[10px] text-indigo-700 font-semibold uppercase tracking-wide">Sunset</span>
              </div>
              <div className="text-base font-black text-gray-900">{formatTime(sun.today.sunset)}</div>
              {sun.today.civilTwilightEnd && <div className="text-[10px] text-gray-500 mt-0.5">Golden hour ends: {formatTime(sun.today.civilTwilightEnd)}</div>}
            </div>
          </div>
          {sun.today.dayLength && (
            <div className="mt-2 text-xs text-gray-400 text-center">
              {formatDayLength(sun.today.dayLength)} of daylight
              {sun.tomorrow?.sunrise && <> · Tomorrow sunrise: {formatTime(sun.tomorrow.sunrise)}</>}
            </div>
          )}
        </div>
      )}

      {/* Earthquakes */}
      {quakes && quakes.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-4 pt-4 pb-2 flex items-center gap-2">
            <Activity size={14} className="text-purple-500" />
            <span className="text-xs font-semibold text-gray-700">Recent Seismic Activity</span>
            <span className="text-[10px] text-gray-400">30-day · via USGS</span>
          </div>
          <div className="px-4 pb-4 space-y-2">
            {quakes.slice(0, 4).map((q, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-sm ${
                  q.mag >= 4.5 ? 'bg-red-100 text-red-700' :
                  q.mag >= 3.5 ? 'bg-orange-100 text-orange-700' :
                  'bg-purple-50 text-purple-600'
                }`}>M{q.mag.toFixed(1)}</div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-gray-900 truncate">{q.place}</div>
                  <div className="text-[10px] text-gray-400">{relativeTime(q.time)} · {q.depth}km deep · {q.distanceMi}mi away</div>
                </div>
              </div>
            ))}
            {quakes.length > 4 && <div className="text-[10px] text-gray-400">+{quakes.length - 4} more this month</div>}
          </div>
        </div>
      )}

      {/* Wildlife */}
      {wildlife && (wildlife.recentSightings.length > 0 || wildlife.mammals.length > 0 || wildlife.birds.length > 0) && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-4 pt-4 pb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PawPrint size={14} className="text-green-600" />
              <span className="text-xs font-semibold text-gray-700">Wildlife nearby</span>
              <span className="text-[10px] text-gray-400">via iNaturalist</span>
            </div>
          </div>
          <div className="flex gap-0 border-b border-gray-100 px-4">
            {[
              { key: 'recent', label: 'Recent', icon: <Newspaper size={10} /> },
              { key: 'mammals', label: `Mammals (${wildlife.mammals.length})`, icon: <PawPrint size={10} /> },
              { key: 'birds', label: `Birds (${wildlife.birds.length})`, icon: <Bird size={10} /> },
            ].map(tab => (
              <button key={tab.key}
                onClick={() => setWildlifeTab(tab.key as any)}
                className={`flex items-center gap-1 px-3 py-2 text-[10px] font-semibold border-b-2 transition-colors ${
                  wildlifeTab === tab.key ? 'border-green-600 text-green-700' : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}>
                {tab.icon}{tab.label}
              </button>
            ))}
          </div>
          <div className="p-4">
            {wildlifeTab === 'recent' && (
              <div className="space-y-2">
                {wildlife.recentSightings.length === 0 ? (
                  <p className="text-xs text-gray-400">No recent sightings recorded nearby.</p>
                ) : wildlife.recentSightings.map((obs, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {obs.photo ? (
                      <img src={obs.photo} alt={obs.name} className="w-10 h-10 rounded-lg object-cover shrink-0 bg-gray-100" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                        <PawPrint size={16} className="text-green-400" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-gray-900 truncate">{obs.name}</div>
                      <div className="text-[10px] text-gray-400">{obs.observedOn} · {obs.iconic}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {(wildlifeTab === 'mammals' || wildlifeTab === 'birds') && (
              <div className="space-y-2">
                {(wildlifeTab === 'mammals' ? wildlife.mammals : wildlife.birds).map((obs, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {obs.photo ? (
                      <img src={obs.photo} alt={obs.name} className="w-10 h-10 rounded-lg object-cover shrink-0 bg-gray-100" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                        {wildlifeTab === 'birds' ? <Bird size={16} className="text-green-400" /> : <PawPrint size={16} className="text-green-400" />}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-gray-900 truncate">{obs.name}</div>
                      <div className="text-[10px] text-gray-400 italic truncate">{obs.scientific}</div>
                      <div className="text-[10px] text-gray-400">Last seen {obs.observedOn}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="px-4 pb-3 text-[10px] text-gray-400">
            Research-grade observations within 8km. Data from volunteer naturalists.
          </div>
        </div>
      )}
    </div>
  )
}
