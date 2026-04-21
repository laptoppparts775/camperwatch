'use client'
import { useState } from 'react'
import { SiteGuide } from '@/lib/siteGuides'
import { ChevronDown, ChevronUp, Star, AlertTriangle, CheckCircle2, XCircle, Clock, Users, Car, Flame, PawPrint, Zap, MapPin } from 'lucide-react'

export default function SiteGuideSection({ guide, name }: { guide: SiteGuide; name: string }) {
  const [open, setOpen] = useState<string | null>(null)
  const toggle = (k: string) => setOpen(p => p === k ? null : k)

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

  return (
    <div className="space-y-3">

      {/* Loop Guide */}
      <Section id="loops" icon={MapPin} title="Loop Guide — which section to book" color="bg-blue-600">
        <div className="space-y-3">
          {guide.loops.map((loop, i) => (
            <div key={i} className="bg-blue-50 border border-blue-100 rounded-lg p-3">
              <div className="font-semibold text-blue-900 text-sm mb-1">{loop.name}</div>
              <div className="text-xs text-blue-800 mb-1">{loop.character}</div>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Best for: {loop.best_for}</span>
                {loop.hookups && <span className="bg-white border border-blue-200 text-blue-700 px-2 py-0.5 rounded-full">⚡ {loop.hookups}</span>}
              </div>
              {loop.notes && <p className="text-xs text-blue-600 mt-1 italic">{loop.notes}</p>}
            </div>
          ))}
        </div>
      </Section>

      {/* Best Sites */}
      <Section id="sites" icon={Star} title="Best specific sites — by number" color="bg-amber-500">
        <div className="space-y-2">
          {guide.best_sites.map((site, i) => (
            <div key={i} className="flex gap-3 bg-amber-50 border border-amber-100 rounded-lg p-3">
              <div className="bg-amber-500 text-white font-bold text-sm rounded-lg px-2.5 py-1 flex-shrink-0 h-fit">#{site.number}</div>
              <div>
                <p className="text-sm text-gray-800">{site.why}</p>
                {site.tip && <p className="text-xs text-amber-700 mt-1 font-medium">💡 {site.tip}</p>}
              </div>
            </div>
          ))}
          <div className="bg-red-50 border border-red-100 rounded-lg p-3 flex items-start gap-2">
            <XCircle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-xs font-semibold text-red-700">Avoid: </span>
              <span className="text-xs text-red-700">{guide.worst_to_avoid}</span>
            </div>
          </div>
        </div>
      </Section>

      {/* Booking Tip */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-start gap-2">
          <CheckCircle2 size={15} className="text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-green-800 mb-0.5">How to actually get a site</p>
            <p className="text-sm text-green-800">{guide.booking_tip}</p>
          </div>
        </div>
      </div>

      {/* Rules */}
      <Section id="rules" icon={AlertTriangle} title="Campground rules — know before you go" color="bg-red-500">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { icon: Users, label: 'Max people', value: guide.rules.max_people_per_site },
            { icon: Car, label: 'Max vehicles', value: guide.rules.max_vehicles },
            { icon: Clock, label: 'Max stay', value: guide.rules.max_stay },
            { icon: Zap, label: 'Generators', value: guide.rules.generator_hours || 'Not permitted' },
            { icon: Flame, label: 'Fires', value: guide.rules.fires },
            { icon: PawPrint, label: 'Pets', value: guide.rules.pets },
            { icon: Clock, label: 'Quiet hours', value: guide.rules.noise_quiet_hours },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-white border border-gray-100 rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Icon size={12} className="text-gray-400" />
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</span>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">{value}</p>
            </div>
          ))}
        </div>
        {guide.rules.prohibitions.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-semibold text-red-700 mb-1.5">Prohibited:</p>
            <ul className="space-y-1">
              {guide.rules.prohibitions.map((p, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-red-700">
                  <XCircle size={11} className="mt-0.5 flex-shrink-0" /> {p}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Section>

      {/* Activities */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Available Activities</p>
        <div className="flex flex-wrap gap-1.5">
          {guide.activities.map(a => (
            <span key={a} className="bg-white border border-gray-200 text-gray-700 text-xs px-2.5 py-1 rounded-full font-medium">{a}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
