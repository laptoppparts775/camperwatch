'use client'

import { useState, useEffect } from 'react'
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Thermometer } from 'lucide-react'

interface Props {
  lat: number
  lng: number
  campgroundName: string
}

interface WeatherData {
  temp_f: number
  temp_c: number
  condition: string
  wind_mph: number
  humidity: number
  icon: string
}

function WeatherIcon({ condition, size = 18 }: { condition: string; size?: number }) {
  const c = condition.toLowerCase()
  if (c.includes('snow') || c.includes('blizzard')) return <CloudSnow size={size} className="text-blue-400" />
  if (c.includes('rain') || c.includes('drizzle') || c.includes('shower')) return <CloudRain size={size} className="text-blue-500" />
  if (c.includes('cloud') || c.includes('overcast') || c.includes('fog') || c.includes('mist')) return <Cloud size={size} className="text-gray-400" />
  if (c.includes('wind')) return <Wind size={size} className="text-gray-500" />
  return <Sun size={size} className="text-yellow-400" />
}

export default function WeatherWidget({ lat, lng, campgroundName }: Props) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchWeather() {
      try {
        // wttr.in — free, no API key, returns JSON
        const res = await fetch(
          `https://wttr.in/${lat},${lng}?format=j1`,
          { signal: AbortSignal.timeout(8000) }
        )
        if (!res.ok) throw new Error('fetch failed')
        const data = await res.json()
        const current = data.current_condition?.[0]
        if (!current) throw new Error('no data')
        setWeather({
          temp_f: parseInt(current.temp_F),
          temp_c: parseInt(current.temp_C),
          condition: current.weatherDesc?.[0]?.value || 'Clear',
          wind_mph: parseInt(current.windspeedMiles),
          humidity: parseInt(current.humidity),
          icon: current.weatherDesc?.[0]?.value || '',
        })
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchWeather()
  }, [lat, lng])

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-4 animate-pulse">
        <div className="h-4 bg-gray-100 rounded w-24 mb-3" />
        <div className="h-8 bg-gray-100 rounded w-16" />
      </div>
    )
  }

  if (error || !weather) return null

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Weather at camp
        </div>
        <div className="text-xs text-gray-400">Live</div>
      </div>
      <div className="flex items-center gap-3">
        <WeatherIcon condition={weather.condition} size={28} />
        <div>
          <div className="text-2xl font-black text-gray-900">
            {weather.temp_f}°F
            <span className="text-sm font-normal text-gray-400 ml-1">/ {weather.temp_c}°C</span>
          </div>
          <div className="text-xs text-gray-500 capitalize">{weather.condition}</div>
        </div>
      </div>
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Wind size={11} /> {weather.wind_mph} mph wind
        </span>
        <span className="flex items-center gap-1">
          <Thermometer size={11} /> {weather.humidity}% humidity
        </span>
      </div>
    </div>
  )
}
