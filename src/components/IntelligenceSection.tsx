'use client'
import { useState } from 'react'
import { CampIntelligence } from '@/lib/intelligence'
import { ChevronDown, ChevronUp, AlertTriangle, Lightbulb, Star, Sparkles, Eye, Signal, Flame, CheckCircle2, XCircle } from 'lucide-react'

export default function IntelligenceSection({ intel, name }: { intel: CampIntelligence; name: string }) {
  const [expanded, setExpanded] = useState<string | null>('why')
  const toggle = (key: string) => setExpanded(p => p === key ? null : key)

  const Section = ({ id, icon: Icon, title, color, children }: { id: string; icon: any; title: string; color: string; children: React.ReactNode }) => (
    <div className={`rounded-xl border overflow-hidden ${expanded === id ? 'border-gray-200' : 'border-gray-100'}`}>
      <button onClick={() => toggle(id)} className={`w-full flex items-center gap-3 p-4 text-left transition-colors ${expanded === id ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'}`}>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}><Icon size={15} className="text-white" /></div>
        <span className="font-semibold text-gray-900 text-sm">{title}</span>
        <span className="ml-auto text-gray-400">{expanded === id ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}</span>
      </button>
      {expanded === id && <div className="px-4 pb-4 pt-1">{children}</div>}
    </div>
  )

  return (
    <div className="space-y-3">
      <Section id="why" icon={Star} title={`Why ${name} is worth it`} color="bg-green-600">
        <p className="text-sm text-gray-700 leading-relaxed">{intel.why_its_good}</p>
      </Section>

      <Section id="gem" icon={Sparkles} title="The Rare Gem — what most campers miss" color="bg-amber-500">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-sm text-amber-900 leading-relaxed font-medium">{intel.rare_gem}</p>
        </div>
      </Section>

      <Section id="issues" icon={AlertTriangle} title="Real issues & honest solutions" color="bg-red-500">
        <div className="space-y-3">
          {intel.real_issues.map((item, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="bg-red-50 border border-red-100 rounded-lg p-3 flex items-start gap-2">
                <XCircle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-red-800 font-medium">{item.issue}</p>
              </div>
              <div className="bg-green-50 border border-green-100 rounded-lg p-3 flex items-start gap-2">
                <CheckCircle2 size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-green-800">{item.solution}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="say" icon={Eye} title="What real campers say" color="bg-blue-600">
        <div className="space-y-2">
          {intel.what_people_say.map((item, i) => (
            <div key={i} className={`rounded-lg p-3 border ${item.sentiment === 'love' ? 'bg-green-50 border-green-100' : item.sentiment === 'warn' ? 'bg-red-50 border-red-100' : 'bg-blue-50 border-blue-100'}`}>
              <p className="text-sm text-gray-800 italic leading-relaxed mb-1">&ldquo;{item.quote}&rdquo;</p>
              <p className="text-xs text-gray-400">— {item.source}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="miss" icon={Lightbulb} title="Don't miss — verified must-dos" color="bg-purple-600">
        <ul className="space-y-2">
          {intel.not_to_miss.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-purple-500 mt-0.5 flex-shrink-0">→</span>{item}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="season" icon={Sparkles} title="Best time to visit" color="bg-teal-600">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {intel.best_season.map((s, i) => (
            <div key={i} className="bg-teal-50 border border-teal-100 rounded-lg p-3">
              <div className="font-semibold text-teal-800 text-sm mb-1">{s.season}</div>
              <p className="text-xs text-teal-700">{s.why}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="new" icon={Sparkles} title="What's new in 2026" color="bg-indigo-600">
        <p className="text-sm text-gray-700 leading-relaxed">{intel.whats_new}</p>
      </Section>

      <Section id="avoid" icon={XCircle} title="Skip this campground if..." color="bg-gray-600">
        <ul className="space-y-1">
          {intel.avoid_if.map((a, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
              <XCircle size={13} className="text-gray-400 mt-0.5 flex-shrink-0" />{a}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="hacks" icon={Lightbulb} title="Insider hacks" color="bg-orange-500">
        <ul className="space-y-2">
          {intel.insider_hacks.map((h, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-orange-500 font-bold flex-shrink-0">✦</span>{h}
            </li>
          ))}
        </ul>
      </Section>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-gray-100 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1"><Signal size={13} className="text-blue-600" /><span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Cell Signal</span></div>
          <p className="text-xs text-gray-700">{intel.cell_signal}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1"><Flame size={13} className="text-red-500" /><span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Fire Rules</span></div>
          <p className="text-xs text-gray-700">{intel.fire_rules}</p>
        </div>
        {intel.wildlife_alert && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1"><AlertTriangle size={13} className="text-amber-600" /><span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Wildlife</span></div>
            <p className="text-xs text-amber-800">{intel.wildlife_alert}</p>
          </div>
        )}
      </div>
    </div>
  )
}
