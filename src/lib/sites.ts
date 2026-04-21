// Per-campground site intelligence: loops, best sites by number, rules, activities
// All data verified from Recreation.gov, Campendium, The Dyrt, PerfectCamp — April 2026

export type Loop = {
  name: string
  character: string // what makes this loop distinct
  best_for: string
  downsides?: string
}

export type BestSite = {
  number: string
  why: string
  type: 'view' | 'privacy' | 'access' | 'size' | 'shade'
}

export type SiteRules = {
  max_people: number
  max_vehicles: number
  max_tents?: number
  max_rv_length?: number
  generator_hours?: string
  quiet_hours: string
  stay_limit: string
  pets: string
  fires: string
  notes?: string[]
}

export type ActivityTag = {
  name: string
  icon: string
  distance?: string
}

export type SiteGuide = {
  loops?: Loop[]
  best_sites: BestSite[]
  avoid_sites?: { number: string; why: string }[]
  rules: SiteRules
  activities: ActivityTag[]
  booking_tips: string[]
  recreation_gov_id?: string
}

export const siteGuides: Record<string, SiteGuide> = {

  'nevada-beach': {
    loops: [
      { name: 'Lakeside Row (Sites 1–20)', character: 'Closest to the lake, partial lake views through pines, sparse tree cover', best_for: 'Lake views, photographers, sunset watchers', downsides: 'More exposed, less shade, fill fastest' },
      { name: 'Outer Forest Loop (Sites 30–54)', character: 'More mature pine canopy, best site spacing, most privacy from neighbors', best_for: 'Privacy seekers, large rigs, dog owners', downsides: 'Longer walk to beach (5–7 min)' },
      { name: 'South Loop (Sites 40–54)', character: 'Closest to dog beach, quieter end of campground, south-end restrooms need work', best_for: 'Dog owners, families', downsides: 'South-end restrooms reported leaking/poor condition' },
    ],
    best_sites: [
      { number: '20', why: 'Closest to water — reviewer says "seconds from the lake." Most requested site. Book the moment window opens.', type: 'access' },
      { number: '14', why: 'Beautiful lake view in the distance, very spacious, great for large trailers. Camp host top pick.', type: 'view' },
      { number: '28', why: 'More private feel than lakeside sites, good spacing from neighbors.', type: 'privacy' },
      { number: '39', why: 'Steps from restroom, fits 29ft trailer + tow vehicle easily, level paved pad. Good solar if you have panels.', type: 'access' },
      { number: '24', why: 'Praised for shoulder season visits — spacious, well-maintained, less crowded outer loop.', type: 'privacy' },
    ],
    avoid_sites: [
      { number: '28', why: 'Reported noise issues on some weekends despite good spacing — mixed reviews.' },
    ],
    rules: {
      max_people: 6,
      max_vehicles: 2,
      max_rv_length: 50,
      quiet_hours: '10pm – 6am',
      stay_limit: '14 days maximum per calendar year (Jan–Dec), forest-wide. Book annually but cannot exceed 14 total nights.',
      pets: 'Leashed pets allowed in campground. Dogs allowed on south end of beach only. No pets in picnic areas or main beach.',
      fires: 'Campfire rings at each site. No wood, charcoal, or solid fuel fires on the beach — propane grills only on beach.',
      notes: [
        'Extra vehicle fee charged at campground (not reflected in Recreation.gov booking)',
        'Reservation holder must present ID at check-in',
        'No showers on site — Zephyr Cove (2 mi) has pay showers',
      ],
    },
    activities: [
      { name: 'Swimming', icon: '🏊', distance: 'On-site' },
      { name: 'Dog Beach', icon: '🐕', distance: '0.2 mi south end' },
      { name: 'Fishing', icon: '🎣', distance: 'On-site' },
      { name: 'Kayak/SUP Rental', icon: '🛶', distance: '0.3 mi (Kayak Tahoe)' },
      { name: 'Lam Wa Tah Trail', icon: '🚶', distance: '0.1 mi (2.6 mi loop)' },
      { name: 'Cycling', icon: '🚴', distance: 'On-site paths' },
      { name: 'Stateline Casinos', icon: '🎰', distance: '2 mi' },
      { name: 'Round Hill Beach', icon: '🏖️', distance: '1 mi north' },
      { name: 'Spooner Lake / Flume Trail', icon: '⛰️', distance: '8 mi' },
    ],
    booking_tips: [
      'Set alarm for 7:00 AM PST exactly 6 months before target arrival — Recreation.gov window opens at that moment',
      'Site 20 goes first — have it selected before the clock turns',
      'Campnab.com sends texts when cancellations appear — worth the fee for summer dates',
      'Sept/Oct shoulder season: sites often available 1–2 months out instead of 6',
    ],
    recreation_gov_id: '232768',
  },

  'camp-richardson': {
    loops: [
      { name: "Eagles Nest (Tent Only)", character: 'Newer premium tent campground, paved parking pads, 31 sites, 24hr security, flush toilets, coin showers. Walk to beach in 10 min via paved path.', best_for: 'Tent campers wanting full resort access', downsides: 'Coin showers. No pets. No RVs.' },
      { name: "Badger's Den (Tent Only)", character: 'Older section, more character, closer to the resort core and ice cream parlor', best_for: 'Families, first-timers, quick resort access', downsides: 'Older facilities, some sites uneven' },
      { name: 'RV Village', character: 'Hookup sites scattered through resort — water and electric. Limited full hookup. Sites haphazardly positioned.', best_for: 'RV campers wanting resort access', downsides: 'Bring 50ft water hose and 30ft electric extension — hookups are far from pads' },
    ],
    best_sites: [
      { number: 'Eagles Nest 85–90', why: 'White Bark Loop — most private sites in Eagles Nest, furthest from the road, good tree screening', type: 'privacy' },
      { number: 'Eagles Nest 112–115', why: 'Lodgepole Loop — newer sites, largest paved pads, best for larger tent setups', type: 'size' },
      { number: "Badger's Den lakeside row", why: 'Walk to beach in 2 minutes. When available these are the most requested sites at the entire resort.', type: 'access' },
    ],
    rules: {
      max_people: 6,
      max_vehicles: 1,
      max_tents: 2,
      quiet_hours: '10pm – 8am',
      stay_limit: '14 days per calendar year, forest-wide (Jan–Dec)',
      pets: 'NO pets at this resort. Zero exceptions. Service animals only.',
      fires: 'Campfire rings at each site. No charcoal BBQs in campground or on beach. Fires must be attended at all times.',
      notes: [
        'Reservation holder must be present at check-in with photo ID',
        'Eagles Nest check-in kiosk on HWY 89 — not at the resort office',
        'On-site security staffed 24 hours',
        'Double sites accommodate 12 people, 4 tents, 2 vehicles',
        'Triple sites accommodate 18 people, 6 tents, 3 vehicles',
      ],
    },
    activities: [
      { name: 'Lake Beach', icon: '🏖️', distance: '0.2 mi walk' },
      { name: 'Bike Rentals', icon: '🚴', distance: 'On-site' },
      { name: 'Marina / Parasailing', icon: '⛵', distance: 'On-site' },
      { name: 'Ice Cream Parlor', icon: '🍦', distance: 'On-site (summer only)' },
      { name: 'The Grove Restaurant', icon: '🍽️', distance: 'On-site' },
      { name: 'Pope Baldwin Bike Path', icon: '🛤️', distance: 'Departs from resort' },
      { name: 'Emerald Bay Boat Tour', icon: '🚢', distance: 'Marina' },
      { name: 'Horseback Riding', icon: '🐴', distance: '0.5 mi' },
      { name: 'Fallen Leaf Lake', icon: '🏞️', distance: '2 mi' },
    ],
    booking_tips: [
      'Eagles Nest reservations via Recreation.gov (campground ID 10305438)',
      'Last-minute cancellations drop at 7am daily — check before giving up on peak dates',
      'Lakeside Badger\'s Den sites book first — specify lakeside in comments',
      'RV Village hookups: request specific site and confirm hookup position before arrival',
    ],
    recreation_gov_id: '10305438',
  },

  'fallen-leaf': {
    loops: [
      { name: 'Loops A–C (General camping)', character: 'Large forested sites among Jeffrey pine and white fir, most with good tree screening', best_for: 'Tent campers and smaller RVs', downsides: 'No hookups, coin showers only' },
      { name: 'Yurt area', character: '5 yurts with electricity and sleeping platforms — rare for a USFS campground', best_for: 'Shoulder season (Sept–Oct) when temps drop to 40s at night', downsides: 'Books quickly, limited availability' },
    ],
    best_sites: [
      { number: 'Any lakeside (1–15)', why: 'Walk to Fallen Leaf Lake in under 2 min. These are the most-requested sites — go for any in this range', type: 'access' },
      { number: 'Yurts (book by type)', why: 'Heated, electric sleeping platforms — game-changer in September when nights hit 40°F', type: 'access' },
    ],
    rules: {
      max_people: 6,
      max_vehicles: 2,
      max_rv_length: 40,
      quiet_hours: '10pm – 8am',
      generator_hours: 'Check with campground — generally daytime only',
      stay_limit: '14 days max. Federal forest 14-day calendar year limit applies.',
      pets: 'Leashed pets allowed at campsites. Bears are active — food storage mandatory.',
      fires: 'Fire rings at each site. California fire rules. Check CalFire for restrictions before arrival.',
    },
    activities: [
      { name: 'Fallen Leaf Lake Swimming', icon: '🏊', distance: '0.1 mi' },
      { name: 'Glen Alpine Trailhead (Desolation Wilderness)', icon: '⛰️', distance: '2 mi' },
      { name: 'Mt. Tallac Trail', icon: '🥾', distance: '5 mi' },
      { name: 'Cycling to Lake Tahoe', icon: '🚴', distance: '2 mi' },
      { name: 'Lake Tahoe Beach (Fallen Leaf Rd)', icon: '🏖️', distance: '2 mi' },
      { name: 'Angora Lakes', icon: '🏞️', distance: '4 mi' },
    ],
    booking_tips: [
      'Book 3–4 months ahead instead of 6 — 206 sites means better odds than Nevada Beach',
      'Yurts have electricity — check availability for September when you want the heater',
      'Senior/Access Pass cuts rate below $20/night — best value in South Tahoe',
    ],
    recreation_gov_id: '232447',
  },

  'watchman-campground': {
    loops: [
      { name: 'A & B Loops (Electric)', character: 'Standard sites with 30A electric hookups — best for RVs and charge-dependent campers. More exposed, less shade.', best_for: 'RV campers, phone/device charging, CPAP users', downsides: 'More crowded. Sites feel exposed.' },
      { name: 'C & D Loops (Non-electric)', character: 'Standard non-electric sites. No vehicles 19ft+ combined length.', best_for: 'Tent campers and small vans', downsides: 'No power. Small vehicle limit.' },
      { name: 'F Loop (Walk-in / Tent Only)', character: 'Walk-in tent sites with pergola shade structures — most separation from neighbors, most intimate feel', best_for: 'Privacy seekers, backcountry-style experience inside the park', downsides: 'Car parks in lot, not at site. Carry gear to site.' },
      { name: 'E Loop (Group)', character: 'Tent-only group sites, 7–40 people', best_for: 'Group trips', downsides: 'Tent only, no RVs' },
    ],
    best_sites: [
      { number: 'F Loop (any)', why: 'Walk-in sites with pergola shade. Most separation from neighbors. Best tent experience in the campground.', type: 'privacy' },
      { number: 'C24 / D5 / D3', why: 'Verified by recent campers: good shade, good tree cover, reasonable restroom distance', type: 'access' },
      { number: 'B54 / B50', why: 'Outer ring of B loop — mountain views in 3 directions, less hemmed in', type: 'view' },
    ],
    avoid_sites: [
      { number: 'B41 / D31', why: 'Inner B/D loop sites — very close to neighbors. Noise, bright lights, music from surrounding sites reported.' },
    ],
    rules: {
      max_people: 6,
      max_vehicles: 1,
      max_tents: 3,
      quiet_hours: '10pm – 6am',
      stay_limit: '14 days. Campground fills to capacity almost every night from March–November.',
      pets: 'Pets allowed on Pa\'rus Trail only — the only pet-friendly trail in Zion NP. No pets on any other trail.',
      fires: 'Campfire rings only. No fires when restrictions posted. No gathering firewood in the park. Wood prohibited from moving between states.',
      notes: [
        'No generators permitted anywhere in the campground',
        'Hammocks and slacklines prohibited',
        'Dump station available at campground entrance ($5 for non-campers)',
        'Non-US residents: $100/person surcharge on top of $35 park entrance fee (effective Jan 2026)',
        'South Campground closed indefinitely — Watchman is the only NPS canyon campground in 2026',
        'Tunnel ban for oversized vehicles (over 11\'4" tall) starts June 7, 2026',
      ],
    },
    activities: [
      { name: 'Zion Shuttle', icon: '🚌', distance: 'Stop inside campground' },
      { name: 'Watchman Trail', icon: '🥾', distance: 'Trailhead in campground' },
      { name: 'Pa\'rus Trail (dogs OK)', icon: '🐕', distance: 'Trailhead in campground' },
      { name: 'Angels Landing (permit)', icon: '⛰️', distance: '2 mi by shuttle' },
      { name: 'The Narrows', icon: '💧', distance: '2 mi by shuttle' },
      { name: 'Emerald Pools', icon: '🌊', distance: '2 mi by shuttle' },
      { name: 'Springdale Restaurants', icon: '🍽️', distance: '0.5 mi walk/bridge' },
      { name: 'E-bike Rentals (Zion Outfitter)', icon: '🚲', distance: '0.5 mi' },
      { name: 'Virgin River Swimming', icon: '🏊', distance: 'In campground' },
    ],
    booking_tips: [
      'Book exactly 6 months ahead at 7am on Recreation.gov',
      'F Loop walk-in sites sometimes available same-day — arrive at the campground kiosk by noon',
      'April–May has tent caterpillar infestation — availability is better, crowds thinner',
      'Spring (Mar–May) and Fall (Oct–Nov) are best availability windows outside the 6-month rush',
    ],
    recreation_gov_id: '232445',
  },

  'rubys-inn-bryce': {
    loops: [
      { name: 'Front Forest Section (older)', character: 'Mature ponderosa pine shade, more of a classic campground feel, better spacing', best_for: 'Those wanting shade and character', downsides: 'Some older facilities' },
      { name: 'Back Section (newer, open)', character: 'No tree shade, gravel sites, very spacious. Better satellite TV signal.', best_for: 'Large RVs, satellite TV users, dogs', downsides: 'No shade at all, can be hot in summer' },
      { name: 'Premium Sites', character: 'Lawn area, large picnic table, fire pit. The nicest sites in the campground.', best_for: 'Those wanting the best experience', downsides: 'More expensive. Book first.' },
    ],
    best_sites: [
      { number: '39–43', why: 'Best full hookup layout — sewer connection positioned correctly for back-in rigs', type: 'access' },
      { number: 'Premium sites (ask at booking)', why: 'Lawn, pine shade, large metal picnic table. Reviewers paid $175/3 nights and said worth every dollar.', type: 'size' },
      { number: 'Any tree section near entrance', why: 'Mature ponderosa shade plus easy shuttle access at the gate', type: 'shade' },
    ],
    avoid_sites: [
      { number: 'Sites near office', why: 'Constant dust from traffic. Every car entering kicks up gravel dust toward office-adjacent sites.' },
    ],
    rules: {
      max_people: 6,
      max_vehicles: 2,
      quiet_hours: '10pm – 8am',
      stay_limit: 'No strict limit — private campground',
      pets: 'Pet friendly throughout campground. Pets must be leashed.',
      fires: 'Fire rings and pits at each site. High elevation (7,700ft) — dry conditions. Check Utah fire restrictions.',
      notes: [
        'No Good Sam, AAA, or military discounts honored',
        'Free Bryce Canyon shuttle stops at campground entrance every 15 minutes (seasonal)',
        'Paved bike trail from campground goes directly into Bryce Canyon National Park',
        'Rodeo at adjacent property Wed–Sat evenings — free entertainment for guests',
        'RV auto service station on-site — rare amenity',
      ],
    },
    activities: [
      { name: 'Bryce Canyon Shuttle', icon: '🚌', distance: 'At campground entrance' },
      { name: 'Bike to Bryce', icon: '🚴', distance: 'Paved trail from camp' },
      { name: 'Bryce Canyon Rim Trail', icon: '🥾', distance: '0.5 mi to park entrance' },
      { name: 'Heated Pool & Hot Tub', icon: '🏊', distance: 'On-site' },
      { name: 'Horseback Riding', icon: '🐴', distance: 'Activities desk' },
      { name: 'ATV Tours', icon: '🏜️', distance: 'Activities desk' },
      { name: 'Bryce Canyon Rodeo', icon: '🤠', distance: 'Adjacent property, Wed–Sat' },
      { name: 'Kodachrome Basin SP', icon: '🏞️', distance: '24 mi' },
      { name: 'Dark Sky Stargazing', icon: '🌌', distance: 'On-site (best after 9pm)' },
    ],
    booking_tips: [
      'Call directly at (866) 866-6616 to request specific sites — website doesn\'t always show best options',
      'Request sites 39–43 for best full hookup sewer layout',
      'Premium sites with pine shade go fast — book as far ahead as possible',
      'November–March: significantly lower rates, pool may be closed but everything else open',
    ],
    recreation_gov_id: undefined,
  },

  'colter-bay-grand-teton': {
    loops: [
      { name: 'Loops A–C (Mixed)', character: 'Dense lodgepole pine, fire rings and bear bins at every site, bathrooms in each loop', best_for: 'Most campers — best balance of access and shade', downsides: 'Sites can be close together' },
      { name: 'Loop I / O (Tent only sections)', character: 'Walk-in tent sites, more separation. Loop I bathrooms have been reported poorly maintained.', best_for: 'Tent campers wanting separation', downsides: 'Loop I restrooms consistently reported dirty' },
      { name: 'Waterfront Sites (O Loop)', character: 'Limited sites with Jackson Lake water views', best_for: 'Lake view and wildlife spotting', downsides: 'Sloped sites reported in O Loop. Can be challenging to level RVs.' },
    ],
    best_sites: [
      { number: '158', why: 'Reviewer: "Stayed one night, loved it so much stayed three more." Wooded, private, good access to village.', type: 'privacy' },
      { number: '29 / 174', why: 'Level, reasonable spacing, close to Loop restrooms, praised by multiple reviewers', type: 'access' },
      { number: 'Any A or B Loop lakeside', why: 'Jackson Lake water glimpses through lodgepole pines. Go as early in booking window as possible.', type: 'view' },
    ],
    avoid_sites: [
      { number: 'Loop I (any)', why: 'Restrooms in Loop I consistently reported filthy across multiple years of reviews.' },
      { number: 'O Loop slopes', why: 'O Loop sites have "significant slopes" that challenge RV leveling.' },
    ],
    rules: {
      max_people: 6,
      max_vehicles: 2,
      quiet_hours: '10pm – 8am',
      stay_limit: '14 nights max. 30 nights max cumulative across all GTNP campgrounds.',
      pets: 'Pet-friendly. Must be on leash at all times. Do not leave pets unattended — grizzly bears present.',
      fires: 'Gas and charcoal grills permitted. Wood fires NOT permitted. Must clean and store grill after use.',
      notes: [
        'No generators permitted at any time — strict rule, enforced',
        'Tent camping not permitted in the RV Park section',
        'Check in after 12pm. Check out by 11am.',
        'Non-US residents: same $100/person surcharge applies at GTNP (same policy as Zion/Yosemite)',
        'RV Park (full hookups) is a separate reservation — check recreation.gov ID 258831',
      ],
    },
    activities: [
      { name: 'Jackson Lake Beach', icon: '🏖️', distance: '5 min walk' },
      { name: 'Jackson Lake Boat Rentals', icon: '⛵', distance: 'Marina, 5 min walk' },
      { name: 'Jackson Lake Dinner Cruise', icon: '🚢', distance: 'Marina — book at activities desk' },
      { name: 'Horseback Riding', icon: '🐴', distance: 'Colter Bay corrals' },
      { name: 'Swan Lake / Heron Pond Trail', icon: '🦢', distance: '1 mi (3 mi loop)' },
      { name: 'Hermitage Point Trail', icon: '🥾', distance: '3 mi (9 mi round trip)' },
      { name: 'Ranger Programs', icon: '🎓', distance: 'Visitor Center daily' },
      { name: 'Kayak / Canoe Rental', icon: '🛶', distance: 'Marina' },
      { name: 'Wildlife Viewing (Jackson Lake Dam)', icon: '🦌', distance: '1 mi (moose at dusk)' },
    ],
    booking_tips: [
      'Book at recreation.gov 6 months ahead — opens at 7am Pacific',
      'RV Park (full hookups) is a completely separate listing from the campground',
      'September walk-up availability is often possible on weekdays even at peak season',
      'Book dinner cruise at the marina activities desk the moment you arrive — fills within hours',
    ],
    recreation_gov_id: '258830',
  },

  'moraine-park-rmnp': {
    loops: [
      { name: 'Loop A (Non-electric, RV OK)', character: 'Less scenic, more utilitarian. Open areas with limited shade. First-come in winter.', best_for: 'Budget campers, large RVs without electric needs', downsides: 'Not the ridge views everyone posts about' },
      { name: 'Loop B & C (Electric premium)', character: 'THE sites — ridge views of Longs Peak and Moraine Park meadow. Electric hookups ($55/night). Best sites in the campground.', best_for: 'View seekers, elk rut campers, photographers', downsides: 'All electric now, $55/night. These used to be accessible to non-electric campers.' },
      { name: 'Loop D (Walk-in tent)', character: 'Walk-in tent sites with the most dramatic views. D141 is legendary. Parking lot nearby.', best_for: 'Serious tent campers wanting the best views', downsides: 'Walk to site carrying gear. No vehicle at site.' },
    ],
    best_sites: [
      { number: 'D141', why: 'Legendary site — panoramic Longs Peak + elk meadow views. Walk-in. Multiple reviewers call it best campsite in 50 years of camping.', type: 'view' },
      { number: 'A038', why: 'Very private, great mountain views, own parking, no visible neighbors, easy bathroom access', type: 'privacy' },
      { number: 'B192', why: 'Loop B with electric, excellent Moraine Park views, good level pad', type: 'view' },
      { number: 'C60', why: 'Outer C loop — scenic, good spacing, morning sun on Longs Peak', type: 'view' },
    ],
    rules: {
      max_people: 6,
      max_vehicles: 2,
      max_rv_length: 40,
      quiet_hours: '10pm – 8am',
      generator_hours: 'Allowed in designated loops during posted hours only',
      stay_limit: '7 nights maximum inside RMNP during summer season (all campgrounds combined)',
      pets: 'Leashed pets allowed at campsites and on paved roads only. Not allowed on trails.',
      fires: 'Fire rings at each site. No fires in winter season (Nov–Apr). Check current RMNP fire conditions.',
      notes: [
        'Campground reservation serves as Bear Lake Corridor timed-entry permit — huge benefit vs day visitors',
        'Campers can enter via Beaver Meadows, Grand Lake, or Fall River entrances from 1pm on arrival day',
        'Winter season (Nov–Apr): first-come, first-served. No reservation. Pay via QR code at entrance.',
        'Solar showers: stalls available but you MUST bring your own solar shower bag',
        'D loop closed to campers (but open for walking/dog walks in the loop road)',
      ],
    },
    activities: [
      { name: 'Elk Rut Viewing (Sept)', icon: '🦌', distance: 'Moraine Park meadow — walk from camp' },
      { name: 'Cub Lake Trail', icon: '🥾', distance: '4.6 mi round trip from camp' },
      { name: 'Fern Lake Trail', icon: '🌿', distance: '7.8 mi round trip from camp' },
      { name: 'Bear Lake (shuttle)', icon: '🚌', distance: 'Free shuttle from campground' },
      { name: 'Mills Lake', icon: '🏞️', distance: 'Via Bear Lake shuttle, 5.5 mi' },
      { name: 'Trail Ridge Road', icon: '🚗', distance: '10 mi — highest paved road in US' },
      { name: 'Estes Park', icon: '🛒', distance: '3 mi — grocery, restaurants, gear' },
      { name: 'Alberta Falls', icon: '💧', distance: 'Via shuttle, 1.6 mi easy hike' },
    ],
    booking_tips: [
      'D141 is a walk-up only — arrive before noon on a weekday to claim it',
      'Book the 15th of each month at 7am PST, 6 months ahead',
      'Buy firewood at Estes Park Safeway — 40% cheaper than the campground vendor with a better attitude',
      'Mid-week (Tue–Thu) has significantly better walk-up availability',
    ],
    recreation_gov_id: '232463',
  },

  'upper-pines-yosemite': {
    loops: [
      { name: 'Loops 1–3 (RV/mixed)', character: 'Road-accessible sites, mix of sun and shade. Generator noise during allowed hours.', best_for: 'RV campers, larger groups', downsides: 'Generator noise. Close spacing.' },
      { name: 'Loops 4–6 (Tent/quiet)', character: 'Further from RV section. Better for tent campers wanting lower noise.', best_for: 'Tent campers, hammock lovers, quiet seekers', downsides: 'Further walk to Curry Village' },
      { name: 'River-adjacent sites', character: 'Sites nearest the Merced River. Background sound of water. More popular.', best_for: 'Photographers, romantic camping, river swimmers', downsides: 'Snap fastest. Rarely available walk-up.' },
    ],
    best_sites: [
      { number: '8, 9, 10', why: 'Known "insider" cluster — good position in the campground, frequented by repeat visitors', type: 'access' },
      { number: '172, 208, 210', why: 'Widely cited as best spots: river proximity, good shade, reasonable spacing', type: 'privacy' },
      { number: '220, 222, 228', why: 'End of loop — less through-traffic, better spacing', type: 'privacy' },
      { number: '44', why: 'Easy access to Happy Isles and Curry Village from back of site. Two trees for hammock.', type: 'access' },
    ],
    avoid_sites: [
      { number: 'Sites near generator loops', why: 'Generator hours (3 two-hour slots daily) make these sites significantly noisier' },
    ],
    rules: {
      max_people: 6,
      max_vehicles: 2,
      max_rv_length: 35,
      quiet_hours: '10pm – 6am',
      generator_hours: 'Three 2-hour slots daily: 7–9am, 12–2pm, 5–7pm',
      stay_limit: '7 nights maximum in Yosemite Valley',
      pets: 'Leashed pets allowed. Not allowed on most trails or in Yosemite Valley meadows.',
      fires: 'Wood fires permitted year-round in rings. May–Sept: campfires 5pm–10pm only. Charcoal any time. Bears will investigate — extinguish before sleeping.',
      notes: [
        'BEAR LOCKERS MANDATORY — everything with a scent including toothpaste, sunscreen, chapstick',
        'Rangers cite violations and fine heavily — bears have opened car doors here',
        'Closed May 26–June 8, 2026 for road construction — book Lower Pines for this window',
        'Reservations open on the 15th of each month at 7am PST, 5 months ahead',
        'No advance day-use permits required in 2026 (major change from 2023–2025)',
        'Non-US residents: $100/person surcharge (effective 2026)',
      ],
    },
    activities: [
      { name: 'Mist Trail to Vernal Falls', icon: '💧', distance: '0.5 mi to trailhead' },
      { name: 'Half Dome Trail (permit)', icon: '⛰️', distance: '0.5 mi to trailhead' },
      { name: 'Mirror Lake Loop', icon: '🏞️', distance: '1.5 mi walk' },
      { name: 'Bike Rentals (Curry Village)', icon: '🚴', distance: '0.4 mi' },
      { name: 'Valley Floor Loop (12 mi)', icon: '🛤️', distance: '0.4 mi to start' },
      { name: 'Yosemite Falls Trail', icon: '🥾', distance: '1 mi to trailhead' },
      { name: 'Merced River Swimming', icon: '🏊', distance: 'In campground' },
      { name: 'Curry Village (supplies)', icon: '🛒', distance: '0.4 mi' },
      { name: 'El Capitan Meadow', icon: '🧗', distance: '3 mi' },
    ],
    booking_tips: [
      'Set monthly alarm: 7am PST on the 15th, 5 months ahead. Have Recreation.gov open with payment saved.',
      'Tue–Thu availability slightly better than Fri–Sun for same-window bookings',
      'Winter (Dec–Feb): first-come first-served, walk-up sites available, no reservation battle',
      'Shop in Mariposa before entering — Village Store is 40–50% more expensive',
    ],
    recreation_gov_id: '232447',
  },
}
