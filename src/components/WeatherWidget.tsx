'use client'

import { useState, useEffect } from 'react'
import { Cloud, Sun, CloudRain, CloudSnow, Wind, CloudLightning, AlertTriangle, Droplets } from 'lucide-react'

interface Period {
  name: string
  temp: number
  unit: string
  isDaytime: boolean
  shortForecast: string
  windSpeed: string
  precipProbability: number | null
}

interface Alert {
  event: string
  severity: string
  headline: string
}

interface WeatherData {
  periods: Period[]
  alerts: Alert[]
  source: string
  stale?: boolean
}

function WeatherIcon({ forecast, size = 18, className = '' }: { forecast: string; size?: number; className?: string }) {
  const f = forecast.toLowerCase()
  if (f.includes('thunder') || f.includes('storm')) return <CloudLightning size={size} className={`text-yellow-500 ${className}`} />
  if (f.includes('snow') || f.includes('blizzard') || f.includes('flurr')) return <CloudSnow size={size} className={`text-blue-400 ${className}`} />
  if (f.includes('rain') || f.includes('shower') || f.includes('drizzle')) return <CloudRain size={size} className={`text-blue-500 ${className}`} />
  if (f.includes('cloud') || f.includes('overcast') || f.includes('fog') || f.includes('mist')) return <Cloud size={size} className={`text-gray-400 ${className}`} />
  if (f.includes('wind')) return <Wind size={size} className={`text-gray-500 ${className}`} />
  return <Sun size={size} className={`text-yellow-400 ${className}`} />
}

interface Props {
  lat: number
  lng: number
  campgroundName: string
}

export default function WeatherWidget({ lat, lng, campgroundName }: Props) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    fetch(`/api/weather?lat=${lat}&lng=${lng}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.periods?.length) setWeather(d) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [lat, lng])

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-4 animate-pulse">
        <div className="h-4 bg-gray-100 rounded w-24 mb-3" />
        <div className="h-8 bg-gray-100 rounded w-16" />
      </div>
    )
  }

  if (!weather?.periods?.length) return null

  const today = weather.periods[0]
  const tonight = weather.periods[1]
  const forecast = weather.periods.filter(p => p.isDaytime).slice(0, 5)

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {weather.alerts?.map((alert, i) => (
        <div key={i} className={`flex items-start gap-2.5 px-4 py-3 border-b text-xs font-medium ${
          alert.severity === 'Extreme' ? 'bg-red-50 border-red-300 text-red-800' :
          alert.severity === 'Severe' ? 'bg-orange-50 border-orange-300 text-orange-800' :
          'bg-amber-50 border-amber-200 text-amber-800'
        }`}>
          <AlertTriangle size={14} className="shrink-0 mt-0.5" />
          <div><span className="font-bold">{alert.event}</span> — <span>{alert.headline?.replace(/^[^:]+:\s*/,'').slice(0,100)}</span></div>
        </div>
      ))}

      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Weather at camp</div>
          <div className="text-xs text-gray-400">{weather.source === 'nws' ? 'NWS Official' : 'Live'}</div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex items-center gap-2.5 flex-1">
            <WeatherIcon forecast={today.shortForecast} size={32} />
            <div>
              <div className="text-2xl font-black text-gray-900">{today.temp}°{today.unit}</div>
              <div className="text-xs text-gray-500 capitalize">{today.shortForecast}</div>
            </div>
          </div>
          {tonight && (
            <div className="text-right text-xs text-gray-500">
              <div className="font-semibold text-gray-700">Tonight</div>
              <div>{tonight.temp}°{tonight.unit}</div>
              <div className="text-[10px]">{tonight.shortForecast.split(' ').slice(0,3).join(' ')}</div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50 text-xs text-gray-500">
          {today.windSpeed && <span className="flex items-center gap-1"><Wind size={11} /> {today.windSpeed}</span>}
          {today.precipProbability !== null && today.precipProbability > 0 && (
            <span className="flex items-center gap-1"><Droplets size={11} /> {today.precipProbability}% precip</span>
          )}
        </div>
      </div>

      <div className="border-t border-gray-100">
        <button onClick={() => setExpanded(!expanded)}
          className="w-full px-4 py-2.5 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-between">
          <span className="font-medium">5-day forecast</span>
          <span>{expanded ? '▲' : '▼'}</span>
        </button>
        {expanded && (
          <div className="divide-y divide-gray-50">
            {forecast.map((p, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                <div className="w-16 text-xs font-medium text-gray-700 shrink-0">{p.name.split(' ')[0]}</div>
                <WeatherIcon forecast={p.shortForecast} size={14} />
                <div className="flex-1 text-xs text-gray-500 truncate">{p.shortForecast}</div>
                <div className="text-xs font-bold text-gray-800 shrink-0">{p.temp}°</div>
                {p.precipProbability !== null && p.precipProbability > 0 && (
                  <div className="text-[10px] text-blue-500 w-8 text-right shrink-0">{p.precipProbability}%</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
