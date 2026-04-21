'use client'
import { useState } from 'react'
import { SiteGuide } from '@/lib/sites'
import { MapPin, Users, Car, Clock, Flame, PawPrint, ChevronDown, ChevronUp, ExternalLink, Star, AlertTriangle } from 'lucide-react'

export default function SiteGuideSection({ guide, campgroundName }: { guide: SiteGuide; campgroundName: string }) {
  const [open, setOpen] = useState<string | null>('sites')

  const toggle = (s: string) => setOpen(p => p === s ? null : s)

  const Section = ({ id, icon: Icon, title, color, children }: any) => (
    <div className={`rounded-xl border overflow-hidden ${open === id ? 'border-gray-200' : 'border-gray-100'}`}>
      <button onClick={() => toggle(id)} className={`w-full flex items-center gap-3 p-4 text-left transition-colors ${open === id ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'}`}>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}><Icon size={15} className="text-white" /></div>
        <span className="font-semibold text-gray-900 text-sm">{title}</span>
        <span className="ml-auto text-gray-400">{open === id ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}</span>
      </button>
      {open === id && <div className="px-4 pb-4 pt-1">{children}</div>}
    </div>
  )

  const typeColors: Record<string, string> = {
    view: 'bg-blue-100 text-blue-800',
    privacy: 'bg-green-100 text-green-800',
    access: 'bg-purple-100 text-purple-800',
    size: 'bg-orange-100 text-orange-800',
    shade: 'bg-teal-100 text-teal-800',
  }

  return (
    <div className="space-y-3">

      {/* Best Sites */}
      <Section id="sites" icon={Star} title="Best sites by number — verified picks" color="bg-amber-500">
        <div className="space-y-2">
          {guide.best_sites.map((s, i) => (
            <div key={i} className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-lg p-3">
              <div className="bg-amber-500 text-white font-bold text-sm rounded-lg w-12 h-8 flex items-center justify-center flex-shrink-0">#{s.number}</div>
              <div className="flex-1 min-w-0">
                <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium mb-1 ${typeColors[s.type]}`}>{s.type}</span>
                <p className="text-sm text-gray-700">{s.why}</p>
              </div>
            </div>
          ))}
          {guide.avoid_sites && guide.avoid_sites.length > 0 && (
            <div className="mt-3 pt-3 border-t border-amber-100">
              <p className="text-xs font-semibold text-red-700 mb-2">⚠ Sites to avoid</p>
              {guide.avoid_sites.map((s, i) => (
                <div key={i} className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-lg p-3 mb-2">
                  <div className="bg-red-400 text-white font-bold text-sm rounded-lg w-12 h-8 flex items-center justify-center flex-shrink-0">#{s.number}</div>
                  <p className="text-sm text-red-700">{s.why}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* Loops */}
      {guide.loops && guide.loops.length > 0 && (
        <Section id="loops" icon={MapPin} title="Loop guide — know before you book" color="bg-blue-600">
          <div className="space-y-3">
            {guide.loops.map((loop, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-lg p-3">
                <div className="font-semibold text-sm text-gray-900 mb-1">{loop.name}</div>
                <p className="text-xs text-gray-600 mb-1">{loop.character}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">✓ {loop.best_for}</span>
                  {loop.downsides && <span className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-full">✗ {loop.downsides}</span>}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Rules */}
      <Section id="rules" icon={AlertTriangle} title="Rules & limits — the details that matter" color="bg-red-500">
        <div className="grid grid-cols-2 gap-3 mb-3">
          {[
            { icon: Users, label: 'Max people', value: `${guide.rules.max_people} per site` },
            { icon: Car, label: 'Max vehicles', value: `${guide.rules.max_vehicles} per site` },
            { icon: Clock, label: 'Quiet hours', value: guide.rules.quiet_hours },
            { icon: Clock, label: 'Stay limit', value: guide.rules.stay_limit },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-0.5"><Icon size={12} className="text-gray-500"/><span className="text-xs text-gray-500 font-medium">{label}</span></div>
              <p className="text-sm font-semibold text-gray-900">{value}</p>
            </div>
          ))}
        </div>
        {guide.rules.max_rv_length && (
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <p className="text-xs text-gray-500 font-medium mb-0.5">Max RV length</p>
            <p className="text-sm font-semibold text-gray-900">{guide.rules.max_rv_length} feet</p>
          </div>
        )}
        <div className="space-y-2">
          <div className="flex items-start gap-2 bg-orange-50 border border-orange-100 rounded-lg p-3">
            <Flame size={14} className="text-orange-500 mt-0.5 flex-shrink-0" />
            <div><p className="text-xs font-semibold text-orange-800 mb-0.5">Fire Rules</p><p className="text-xs text-orange-700">{guide.rules.fires}</p></div>
          </div>
          <div className="flex items-start gap-2 bg-green-50 border border-green-100 rounded-lg p-3">
            <PawPrint size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
            <div><p className="text-xs font-semibold text-green-800 mb-0.5">Pets Policy</p><p className="text-xs text-green-700">{guide.rules.pets}</p></div>
          </div>
          {guide.rules.generator_hours && (
            <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-lg p-3">
              <Clock size={14} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div><p className="text-xs font-semibold text-blue-800 mb-0.5">Generator Hours</p><p className="text-xs text-blue-700">{guide.rules.generator_hours}</p></div>
            </div>
          )}
        </div>
        {guide.rules.notes && guide.rules.notes.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 mb-2">Additional rules</p>
            <ul className="space-y-1.5">
              {guide.rules.notes.map((n, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                  <span className="text-gray-400 flex-shrink-0 mt-0.5">•</span>{n}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Section>

      {/* Activities */}
      <Section id="activities" icon={MapPin} title="What to do — activities & distances" color="bg-teal-600">
        <div className="grid grid-cols-2 gap-2">
          {guide.activities.map((a, i) => (
            <div key={i} className="flex items-center gap-2 bg-teal-50 border border-teal-100 rounded-lg px-3 py-2">
              <span className="text-base flex-shrink-0">{a.icon}</span>
              <div className="min-w-0">
                <p className="text-xs font-medium text-teal-900 truncate">{a.name}</p>
                {a.distance && <p className="text-xs text-teal-600">{a.distance}</p>}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Booking tips */}
      <Section id="booking" icon={Clock} title="How to actually get a site" color="bg-indigo-600">
        <ul className="space-y-2">
          {guide.booking_tips.map((t, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-indigo-500 font-bold flex-shrink-0">✦</span>{t}
            </li>
          ))}
        </ul>
        {guide.recreation_gov_id && (
          <a href={`https://www.recreation.gov/camping/campgrounds/${guide.recreation_gov_id}`} target="_blank" rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 bg-green-700 hover:bg-green-800 text-white text-sm font-semibold rounded-lg transition-colors">
            <ExternalLink size={14}/> Book on Recreation.gov
          </a>
        )}
      </Section>

    </div>
  )
}
