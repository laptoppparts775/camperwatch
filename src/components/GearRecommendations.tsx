'use client'
import { ExternalLink } from 'lucide-react'

type GearItem = {
  name: string
  reason: string
  emoji: string
  searchQuery: string // Amazon search URL — replace with affiliate links when ready
  affiliate?: string // placeholder for affiliate link
}

function getGearForCampground(camp: any): GearItem[] {
  const gear: GearItem[] = []
  const issues = (camp.known_issues || '').toLowerCase()
  const tips = (camp.pro_tips || []).join(' ').toLowerCase()
  const amenities = (camp.amenities || []).join(' ').toLowerCase()
  const hookups = (camp.hookups || '').toLowerCase()
  const elevation = camp.elevation || ''

  // Bear activity
  if (issues.includes('bear') || tips.includes('bear')) {
    gear.push({
      emoji: '🐻',
      name: 'Bear Canister',
      reason: 'Bears active at this campground — required for food storage',
      searchQuery: 'bear canister camping',
    })
  }

  // WiFi broken → hotspot
  if (issues.includes('wifi') || issues.includes('wi-fi') || tips.includes('hotspot') || tips.includes('cellular')) {
    gear.push({
      emoji: '📶',
      name: 'Portable WiFi Hotspot',
      reason: 'WiFi unreliable here — most campers bring a cellular hotspot',
      searchQuery: 'portable cellular hotspot camping',
    })
  }

  // No fires / propane only
  if (issues.includes('no wood') || issues.includes('propane') || tips.includes('propane')) {
    gear.push({
      emoji: '🔥',
      name: 'Propane Camp Stove',
      reason: 'Wood fires restricted — propane stoves are allowed year-round',
      searchQuery: 'propane camp stove Coleman',
    })
  }

  // High elevation
  if (elevation && parseInt(elevation) > 7000) {
    gear.push({
      emoji: '🌙',
      name: '20°F Sleeping Bag',
      reason: `At ${elevation} elevation, nights drop well below freezing`,
      searchQuery: '20 degree sleeping bag camping',
    })
  }

  // No hookups → solar
  if (!hookups || hookups.includes('none') || camp.site_types?.includes('Tent')) {
    gear.push({
      emoji: '☀️',
      name: 'Solar Charger Panel',
      reason: 'No electric hookups — keep devices charged off-grid',
      searchQuery: 'solar charger panel camping BioLite',
    })
  }

  // RV / full hookups → surge protector
  if (hookups && (hookups.includes('30') || hookups.includes('50') || hookups.includes('electric'))) {
    gear.push({
      emoji: '⚡',
      name: 'RV Surge Protector',
      reason: 'Always protect your RV from power surges at campground pedestals',
      searchQuery: 'RV surge protector 30 amp 50 amp',
    })
  }

  // Pet friendly
  if (amenities.includes('pet') || camp.amenities?.includes('Pet Friendly')) {
    gear.push({
      emoji: '🐾',
      name: 'Retractable Dog Leash',
      reason: 'Pet-friendly campground — a long leash lets dogs explore safely',
      searchQuery: 'retractable dog leash camping',
    })
  }

  // Water access / lake
  if (camp.nearest_beach || amenities.includes('beach') || (camp.nearby || []).some((n: string) => n.toLowerCase().includes('lake') || n.toLowerCase().includes('beach'))) {
    gear.push({
      emoji: '💧',
      name: 'Waterproof Dry Bag',
      reason: 'Keep gear dry for lake and beach access nearby',
      searchQuery: 'waterproof dry bag camping Sea to Summit',
    })
  }

  // Biking nearby
  if ((camp.nearby || []).some((n: string) => n.toLowerCase().includes('bike') || n.toLowerCase().includes('trail'))) {
    gear.push({
      emoji: '🚲',
      name: 'Bike Repair Kit',
      reason: 'Bike trails nearby — patch kits and multi-tools are essential',
      searchQuery: 'bike repair kit trail camping',
    })
  }

  // Limit to 3 most relevant
  return gear.slice(0, 3)
}

export default function GearRecommendations({ camp }: { camp: any }) {
  const gear = getGearForCampground(camp)
  if (gear.length === 0) return null

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-gray-900 text-sm">🎒 Gear for {camp.name.split(' ')[0]}</h2>
        <span className="text-[10px] text-gray-400 uppercase tracking-wider">Affiliate links</span>
      </div>
      <p className="text-xs text-gray-500 mb-4">Based on this campground's conditions and camper reports</p>
      <div className="space-y-3">
        {gear.map((item, i) => (
          <a
            key={i}
            href={`https://www.amazon.com/s?k=${encodeURIComponent(item.searchQuery)}&tag=YOURTAG-20`}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50 transition-colors group"
          >
            <span className="text-2xl flex-shrink-0">{item.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-900 group-hover:text-green-700">{item.name}</div>
              <div className="text-xs text-gray-500 leading-snug">{item.reason}</div>
            </div>
            <ExternalLink size={13} className="text-gray-300 group-hover:text-green-500 flex-shrink-0" />
          </a>
        ))}
      </div>
      <p className="text-[10px] text-gray-400 mt-3 text-center">
        As an Amazon Associate we earn from qualifying purchases
      </p>
    </div>
  )
}
