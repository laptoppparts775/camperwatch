'use client'

import { useState, useEffect } from 'react'
import { Cloud, Sun, CloudRain, CloudSnow, Wind, CloudLightning, AlertTriangle, Droplets, Thermometer } from 'lucide-react'

interface Period {
  name: string; temp: number; unit: string; isDaytime: boolean
  shortForecast: string; detailedForecast?: string
  windSpeed: string; windDirection: string; precipProbability: number | null
}
interface Alert { event: string; severity: string; headline: string }
interface WeatherData {
  periods: Period[]; alerts: Alert[]
  uvIndex?: number[]; windGusts?: number[]; uvDates?: string[]
  source?: string; stale?: boolean
}

function WeatherIcon({ forecast, size = 18, className = '' }: { forecast: string; size?: number; className?: string }) {
  const f = forecast.toLowerCase()
  if (f.includes('thunder') || f.includes('storm')) return <CloudLightning size={size} className={`text-yellow-500 ${className}`} />
  if (f.includes('snow') || f.includes('blizzard') || f.includes('flurr')) return <CloudSnow size={size} className={`text-blue-300 ${className}`} />
  if (f.includes('rain') || f.includes('shower') || f.includes('drizzle')) return <CloudRain size={size} className={`text-blue-400 ${className}`} />
  if (f.includes('cloud') || f.includes('overcast') || f.includes('fog') || f.includes('mist')) return <Cloud size={size} className={`text-gray-400 ${className}`} />
  if (f.includes('sun') || f.includes('clear') || f.includes('fair')) return <Sun size={size} className={`text-yellow-400 ${className}`} />
  return <Cloud size={size} className={`text-gray-400 ${className}`} />
}

function uvLabel(uv: number) {
  if (uv <= 2) return { label: 'Low', color: 'text-green-600 bg-green-50' }
  if (uv <= 5) return { label: 'Moderate', color: 'text-yellow-600 bg-yellow-50' }
  if (uv <= 7) return { label: 'High', color: 'text-orange-600 bg-orange-50' }
  if (uv <= 10) return { label: 'Very High', color: 'text-red-600 bg-red-50' }
  return { label: 'Extreme', color: 'text-purple-700 bg-purple-50' }
}

interface Props { lat: number; lng: number; campgroundName: string }

export default function WeatherWidget({ lat, lng, campgroundName }: Props) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    fetch(`/api/weather?lat=${lat}&lng=${lng}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { setWeather(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [lat, lng])

  if (loading) return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 animate-pulse">
      <div className="h-4 bg-gray-100 rounded w-24 mb-3" />
      <div className="h-12 bg-gray-100 rounded" />
    </div>
  )
  if (!weather || !weather.periods?.length) return null

  const today = weather.periods.find(p => p.isDaytime) || weather.periods[0]
  const daytimePeriods = weather.periods.filter(p => p.isDaytime).slice(0, 5)
  const todayUV = weather.uvIndex?.[0]
  const todayGusts = weather.windGusts?.[0]

  const uvInfo = todayUV ? uvLabel(todayUV) : null

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Active Alerts */}
      {weather.alerts?.map((alert, i) => (
        <div key={i} className={`flex items-start gap-2 px-4 py-3 text-xs border-b ${
          alert.severity === 'Extreme' || alert.severity === 'Severe' ? 'bg-red-50 border-red-200 text-red-800' :
          alert.severity === 'Moderate' ? 'bg-orange-50 border-orange-200 text-orange-800' :
          'bg-amber-50 border-amber-200 text-amber-800'
        }`}>
          <AlertTriangle size={13} className="shrink-0 mt-0.5" />
          <span className="font-semibold">{alert.event}:</span>
          <span className="font-normal opacity-80 line-clamp-1">{alert.headline}</span>
        </div>
      ))}

      {/* Current conditions header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <WeatherIcon forecast={today.shortForecast} size={20} />
              <span className="text-2xl font-black text-gray-900">{today.temp}°{today.unit}</span>
            </div>
            <div className="text-xs text-gray-600 font-medium">{today.shortForecast}</div>
            <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-500">
              <span className="flex items-center gap-1"><Wind size={11} /> {today.windSpeed} {today.windDirection}</span>
              {today.precipProbability !== null && today.precipProbability > 0 && (
                <span className="flex items-center gap-1"><Droplets size={11} /> {today.precipProbability}%</span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1.5 items-end">
            {uvInfo && todayUV !== undefined && (
              <div className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${uvInfo.color}`}>
                <Sun size={11} />
                UV {Math.round(todayUV)} · {uvInfo.label}
              </div>
            )}
            {todayGusts !== undefined && todayGusts > 20 && (
              <div className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
                <Wind size={11} />
                Gusts {Math.round(todayGusts)} mph
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5-day forecast */}
      {daytimePeriods.length > 1 && (
        <>
          <div className="border-t border-gray-100 px-4 py-3">
            <div className="grid grid-cols-5 gap-1">
              {daytimePeriods.map((p, i) => {
                const uv = weather.uvIndex?.[i]
                const gusts = weather.windGusts?.[i]
                return (
                  <button key={i} onClick={() => setExpanded(expanded === false || true)}
                    className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                    <span className="text-[10px] font-semibold text-gray-500">{p.name.slice(0, 3)}</span>
                    <WeatherIcon forecast={p.shortForecast} size={16} />
                    <span className="text-xs font-bold text-gray-900">{p.temp}°</span>
                    {p.precipProbability !== null && p.precipProbability > 10 && (
                      <span className="text-[9px] text-blue-500 font-semibold">{p.precipProbability}%</span>
                    )}
                    {uv !== undefined && uv >= 6 && (
                      <span className="text-[9px] text-orange-500 font-semibold">UV{Math.round(uv)}</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* UV + wind gusts detail row */}
          {(weather.uvIndex?.some(v => v > 0) || weather.windGusts?.some(v => v > 15)) && (
            <div className="border-t border-gray-50 px-4 pb-3">
              <div className="grid grid-cols-5 gap-1 mt-2">
                {daytimePeriods.map((_, i) => {
                  const uv = weather.uvIndex?.[i]
                  const gusts = weather.windGusts?.[i]
                  const uvI = uv ? uvLabel(uv) : null
                  return (
                    <div key={i} className="flex flex-col items-center gap-0.5">
                      {uv !== undefined && <span className={`text-[9px] font-bold px-1 rounded ${uvI?.color}`}>UV{Math.round(uv)}</span>}
                      {gusts !== undefined && gusts > 15 && <span className="text-[9px] text-blue-600 font-semibold">{Math.round(gusts)}g</span>}
                    </div>
                  )
                })}
              </div>
              <div className="flex gap-3 mt-2 text-[10px] text-gray-400">
                {weather.uvIndex?.some(v => v > 0) && <span>UV index</span>}
                {weather.windGusts?.some(v => v > 15) && <span>Wind gusts (g)</span>}
              </div>
            </div>
          )}
        </>
      )}

      <div className="px-4 pb-3 text-[10px] text-gray-400">
        {weather.stale ? '⚠️ Cached forecast · ' : ''}
        NWS + OpenMeteo · Updated hourly
      </div>
    </div>
  )
}
