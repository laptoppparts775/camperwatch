// Per-campground loop guides and best specific sites
// Sourced from Recreation.gov, Reddit, Campendium, The Dyrt — April 2026

export type Loop = {
  name: string
  character: string
  best_for: string
  hookups?: string
  notes?: string
}

export type BestSite = {
  number: string
  why: string
  tip?: string
}

export type CampRules = {
  max_people_per_site: string
  max_vehicles: string
  max_stay: string
  generator_hours: string | null
  fires: string
  pets: string
  noise_quiet_hours: string
  prohibitions: string[]
}

export type SiteGuide = {
  loops: Loop[]
  best_sites: BestSite[]
  worst_to_avoid: string
  booking_tip: string
  rules: CampRules
  activities: string[]
}

export const siteGuides: Record<string, SiteGuide> = {

  'camp-richardson': {
    loops: [
      { name: 'Eagles Nest — White Bark Loop', character: 'Most private tent loop, deepest in the trees', best_for: 'Solo campers and couples wanting seclusion', hookups: 'None — tent only', notes: 'Sites 85–90. Farthest from facilities but quietest.' },
      { name: 'Eagles Nest — Jeffrey Loop', character: 'Central loop, good balance of access and privacy', best_for: 'Families wanting proximity to bathrooms', hookups: 'None — tent only', notes: 'Sites 91–102. Closest to coin showers and flush toilets.' },
      { name: 'Eagles Nest — Lodgepole Loop', character: 'Largest loop, tallest pines, most spacious sites', best_for: 'Groups — some double and triple sites here', hookups: 'None — tent only', notes: 'Sites 102–115. Double sites sleep 12, triple sites sleep 18.' },
    ],
    best_sites: [
      { number: '87', why: 'White Bark Loop — furthest from road noise, excellent tree screening, large tent pad', tip: 'Book 30 days out exactly when the window opens — White Bark goes first' },
      { number: '96', why: 'Jeffrey Loop — directly across from flush toilets, large flat pad, good shade', tip: 'Best for families with young kids needing fast bathroom access' },
      { number: '108', why: 'Lodgepole Loop — largest pad in the loop, double site available, under old-growth pine canopy' },
      { number: '113', why: 'Lodgepole Loop — end of loop gives extra space on one side, more privacy than most' },
    ],
    worst_to_avoid: 'Sites 91–93 in Jeffrey Loop are closest to the highway kiosk entrance — car headlights sweep through at night.',
    booking_tip: 'Recreation.gov window opens 30 days ahead at 7am PST. July and August weekends go in under 2 minutes. Midweek (Tue–Thu) has better odds. Set a specific site alert on Campnab.com.',
    rules: {
      max_people_per_site: 'Standard: 6. Double: 12. Triple: 18.',
      max_vehicles: 'Standard: 1. Double: 2. Triple: 3. Additional parking pass purchasable.',
      max_stay: '14 days total per calendar year across all LTBMU campgrounds — not just per stay',
      generator_hours: null,
      fires: 'Fire rings only. Must be attended at all times. No charcoal BBQs anywhere on property or beach.',
      pets: 'NO pets. Service animals only. Strictly enforced.',
      noise_quiet_hours: '10pm – 8am',
      prohibitions: ['No dogs or pets (service animals only)', 'No RVs — tent camping only', 'No charcoal BBQs', 'No campfires outside designated rings', 'No unattended fires', '14-day calendar year maximum stay across all Lake Tahoe Basin campgrounds'],
    },
    activities: ['Swimming', 'Biking', 'Hiking', 'Boating', 'Fishing', 'Kayaking', 'Paddling', 'Horseback Riding', 'Mountain Biking', 'Jet Skiing'],
  },

  'nevada-beach': {
    loops: [
      { name: 'Lake Loop', character: 'Premium lakeside sites with partial lake views through Jeffrey pines', best_for: 'Sunset chasers, photographers, anniversary trips', hookups: 'None', notes: 'Sites #14, #28, #39 are community favorites. Books instantly — must try for these at 7am.' },
      { name: 'Forest Loop', character: 'More wooded, slightly more private, less direct lake view', best_for: 'Campers prioritizing shade and privacy over views', hookups: 'None', notes: 'Sites #24, #26 have less canopy — better solar charging for van campers.' },
    ],
    best_sites: [
      { number: '28', why: 'Community consensus #1 site — lake view, spacious, good separation from neighbors', tip: 'Campers have tried for 3 years straight before getting this one. Set Campnab alert.' },
      { number: '14', why: 'Distant lake view in the trees, tons of space, close to restrooms at site #39', tip: 'Slightly easier to book than #28 — target this if #28 is gone' },
      { number: '39', why: 'Right across from the best-maintained restroom block, large flat pad', tip: 'Good fallback if lake-view sites are gone — clean, spacious, quiet' },
      { number: '24', why: 'Forest loop, less tree canopy than average — best for solar panels / van camping' },
      { number: '26', why: 'Southwest-facing clearings for afternoon solar charging. Less competition than lake loop sites' },
    ],
    worst_to_avoid: 'Sites #1–5 near the entrance have more foot traffic from late arrivals walking to their sites.',
    booking_tip: 'Opens 6 months ahead at exactly 7:00am PST on Recreation.gov. Have an account with saved payment. The best sites are gone in under 90 seconds. Use Campnab.com for cancellation monitoring — weekday openings happen regularly.',
    rules: {
      max_people_per_site: '6 people maximum',
      max_vehicles: '2 vehicles per site',
      max_stay: '14 days within a 30-day period',
      generator_hours: null,
      fires: 'Fire rings only. No beach fires. Check Nevada/USFS fire restrictions before arrival.',
      pets: 'Pets allowed on leash. Dogs can enter the lake at the south beach end — one of the only dog-friendly Tahoe beaches.',
      noise_quiet_hours: '10pm – 6am',
      prohibitions: ['No fires on beach', 'No glass containers on beach', 'No dumping gray water on ground (no dump station — plan ahead)', 'No hookups'],
    },
    activities: ['Swimming', 'Fishing', 'Hiking', 'Biking', 'Dog Beach Access', 'Stargazing', 'Photography'],
  },

  'fallen-leaf': {
    loops: [
      { name: 'RV Loop', character: 'Paved pads near the entrance, more open, closer to dump station', best_for: 'RVs up to 40ft, campers wanting hookup access to dump station', hookups: 'None — but dump station accessible', notes: 'Generator hours apply in this loop.' },
      { name: 'Tent Loop (Inner)', character: 'Wooded sites with more separation, better for privacy', best_for: 'Tent campers, hikers, families wanting shade', hookups: 'None', notes: 'Walk-in sites available. Yurt units are bookable separately — have electricity.' },
    ],
    best_sites: [
      { number: 'Yurt 1–3', why: 'Heated platform yurts with electricity — game-changer in September when temps drop to 40°F at night', tip: 'Yurts rent for nearly the same price as a tent site. Book them for September — they disappear fast.' },
      { number: 'Walk-in sites', why: 'Short walk from parking gives extra privacy and buffer from RV generator noise', tip: 'Inner walk-in sites are about 100ft from parking — not a long haul' },
    ],
    worst_to_avoid: 'Sites adjacent to the RV loop when that section has generators running 8am–8pm.',
    booking_tip: '206 sites means better odds than Nevada Beach. Book 3–4 months ahead rather than 6. Yurts book separately — check Recreation.gov for yurt availability independently from tent sites.',
    rules: {
      max_people_per_site: '6 people per standard site',
      max_vehicles: '1 vehicle + 1 tow per site',
      max_stay: '14 days',
      generator_hours: '8am – 8pm in RV loop only',
      fires: 'California fire rules — campfire rings only. No fires during Red Flag conditions.',
      pets: 'Pets allowed on leash. Bears active — secure food at all times including during day hikes.',
      noise_quiet_hours: '10pm – 6am',
      prohibitions: ['No fires outside designated rings', 'No food in tents (bear activity)', 'No driving past your site into walk-in areas'],
    },
    activities: ['Hiking', 'Swimming (Fallen Leaf Lake)', 'Biking', 'Fishing', 'Desolation Wilderness Day Hikes', 'Stargazing'],
  },

  'tahoe-valley': {
    loops: [
      { name: 'Loop F', character: 'Furthest from the main activity areas — quieter and more wooded', best_for: 'Light sleepers, couples wanting less noise', hookups: 'Full 30/50A', notes: 'Specifically request Loop F at booking.' },
      { name: 'Main Loops (A–E)', character: 'Closer to pools, store, and facilities — busier and louder', best_for: 'Families with kids who want to be near activities', hookups: 'Full 30/50A', notes: 'Summer weekends can be rowdy after 10pm.' },
    ],
    best_sites: [
      { number: 'Loop F (any)', why: 'Consistently quieter — furthest from the pool/activity areas, older trees give better shade', tip: 'Call (530) 541-2222 and specifically request Loop F — not possible to guarantee online' },
    ],
    worst_to_avoid: 'Sites near the pool in summer — noise until well after quiet hours. Sites near the dump station entrance have truck traffic throughout the day.',
    booking_tip: 'Year-round availability makes this the backup when everything else is full. Book direct through Thousand Trails for best rates — third-party sites add fees. Extended stay (185+ days) must be booked by phone.',
    rules: {
      max_people_per_site: '6 people per site',
      max_vehicles: '2 vehicles',
      max_stay: '14 days per site April 15–Sept 15 (can move to adjacent site to continue)',
      generator_hours: 'Generators discouraged but no strict enforcement reported',
      fires: 'NO wood or charcoal fires May 1 – Nov 1. Propane fires allowed year-round. Fire pits purchasable at Bear Necessities store.',
      pets: 'Pet friendly — large dog park on property.',
      noise_quiet_hours: '10pm – 8am (inconsistently enforced in summer)',
      prohibitions: ['No wood/charcoal fires May 1–Nov 1', 'Bears active — use bear boxes at all times'],
    },
    activities: ['Swimming (2 pools)', 'Pickleball', 'Basketball', 'Volleyball', 'Tennis', 'Biking', 'Horseshoes', 'Movie Nights'],
  },

  'watchman-campground': {
    loops: [
      { name: 'A & B Loop', character: 'Electric hookup sites (30A/50A), paved pads, most amenity-adjacent', best_for: 'RVers needing power, families, first-timers', hookups: '30A/50A electric only — no water or sewer', notes: 'No generators permitted even on electric sites.' },
      { name: 'C & D Loop', character: 'Non-electric standard sites, slightly more privacy', best_for: 'Tent campers, small trailers', hookups: 'None', notes: 'Vehicles over 19ft not permitted in these loops.' },
      { name: 'E Loop', character: 'Group tent sites only — 7 to 40 people', best_for: 'Groups only', hookups: 'None', notes: 'Group reservations only — cannot book as individual.' },
      { name: 'F Loop', character: 'Walk-to tent sites — park in a lot, short walk to site', best_for: 'Tent campers wanting most separation from RV crowd', hookups: 'None', notes: 'Some shade from pergolas over picnic tables. Best privacy in the campground.' },
    ],
    best_sites: [
      { number: 'F Loop walk-ins', why: 'Maximum privacy, furthest from RV generator noise in A/B loops, pergola shade', tip: 'First-come first-served within F loop — arrive before noon in peak season' },
      { number: 'D5', why: 'Near bathrooms, good tree with shade, low fire ring — reviewer called it "doesn\'t get better"', tip: 'Reviewers specifically name D5 as one of the best non-electric sites' },
      { number: 'B18A / B50 / B54', why: 'Outer B loop sites have mountain views in three directions — sunrise over canyon walls', tip: 'Outer B loop is slightly further from high-traffic areas within the loop' },
    ],
    worst_to_avoid: 'Sites near construction zone on the river-adjacent side — ongoing development visible and audible. Check nps.gov/zion for current construction updates.',
    booking_tip: 'Opens 6 months ahead at 7am on Recreation.gov. South Campground is CLOSED indefinitely — Watchman is the only option and demand reflects that. April–May has caterpillar infestations that deter some bookings — use that window for better odds.',
    rules: {
      max_people_per_site: '6 people, 2 tents, 1 RV (or 2 tents + 1 RV combined)',
      max_vehicles: '1 vehicle per standard site. Group sites vary.',
      max_stay: 'No specified limit — max park visit governed by entrance pass (7 days)',
      generator_hours: 'NO generators permitted anywhere in campground',
      fires: 'Campfires in designated rings only. No fires during fire restrictions. No firewood gathering in park.',
      pets: 'Pets allowed. Only trail in the park allowing pets is Pa\'rus Trail — starting at campground.',
      noise_quiet_hours: '10pm – 6am',
      prohibitions: ['No generators', 'No hammocks or slacklines', 'No firewood gathering', 'No OHVs/ATVs', 'No gathering of any natural materials'],
    },
    activities: ['Hiking', 'Rock Climbing', 'Biking (Pa\'rus Trail)', 'Fishing', 'Swimming (Virgin River)', 'Photography', 'Ranger Programs'],
  },

  'moraine-park-rmnp': {
    loops: [
      { name: 'A Loop', character: 'Most shaded, more tent-only sites, closest to shuttle stop', best_for: 'Tent campers, Bear Lake day hikers', hookups: 'None (non-electric)', notes: 'Site A038 specifically praised for privacy and level pad. Walk-in sites available.' },
      { name: 'B & C Loop', character: 'Best views of Longs Peak and the valley — most premium sites', best_for: 'View seekers, photographers, RVers with electric', hookups: 'Electric 20/30/50A — $55/night', notes: 'The ridge sites with Longs Peak views are all electric-only now.' },
      { name: 'D Loop', character: 'Largest sites, most walk-up availability, excellent elk meadow views', best_for: 'Walk-up arrivals, large groups, elk watchers', hookups: 'Mix of electric and non-electric', notes: 'Site D141 is the community-favorite walk-up site. D loop is sometimes closed for restoration — check ahead.' },
    ],
    best_sites: [
      { number: 'D141', why: 'Jaw-dropping Longs Peak view + elk meadow below. Most praised single site in the campground by far', tip: 'Walk-up only — arrive early (before noon) on weekdays in September for best chance' },
      { number: 'A038', why: 'Own parking area, no visible neighbors, convenient to bathrooms but visually screened from them', tip: 'One of the most private standard sites. Reviewers specifically call out A038 by number.' },
      { number: 'B192', why: 'B loop electric — mountain views, good level pad, recommended by multiple reviewers' },
    ],
    worst_to_avoid: 'Sites adjacent to the amphitheater — evening programs are great but the sound carries until 9pm. Sites near the generator loops if you\'re tent camping.',
    booking_tip: 'Your campground reservation includes Bear Lake Corridor timed entry — huge advantage. Book on Recreation.gov 6 months ahead. November–April is first-come first-served with no reservation needed — some of the best camping in the park.',
    rules: {
      max_people_per_site: '6 people',
      max_vehicles: '2 vehicles',
      max_stay: '7 nights summer season. 14 nights total per calendar year.',
      generator_hours: 'Allowed in RV loops. Not permitted in tent-only areas.',
      fires: 'Campfire rings only. No fires during high fire danger or winter. No firewood gathering in park.',
      pets: 'Pets on leash. Not permitted on most backcountry trails. Bears and mountain lions present — secure food.',
      noise_quiet_hours: '10pm – 6am',
      prohibitions: ['No fires outside designated rings', 'Bear boxes required for food storage', 'No feeding wildlife (heavy fines)', 'No pets on most trails'],
    },
    activities: ['Hiking', 'Wildlife Viewing', 'Fishing', 'Biking (some trails)', 'Ranger Programs', 'Elk Rut Watching (September)', 'Stargazing', 'Winter Snowshoeing'],
  },

  'upper-pines-yosemite': {
    loops: [
      { name: 'Loops 1–3 (RV-adjacent)', character: 'Paved pads, close to Curry Village, more generator noise', best_for: 'RVers, campers wanting amenity access', hookups: 'None (one water hookup site)', notes: 'Generator hours apply. Road noise from valley shuttle.' },
      { name: 'Loops 4–6 (Pine)',  character: 'Denser tree cover, further from Curry Village noise, more atmospheric', best_for: 'Tent campers, hikers, photographers', hookups: 'None', notes: 'Sites 172, 208, 210, 220 are community favorites in these loops.' },
    ],
    best_sites: [
      { number: '208', why: 'Community consensus top site — tree canopy, good separation, close to Happy Isles trail start', tip: 'Most-recommended site number across Reddit threads about Upper Pines' },
      { number: '210', why: 'Adjacent to 208 with similar character — good fallback if 208 is taken' },
      { number: '220', why: 'End of loop position gives extra open space on one side' },
      { number: '172', why: 'River proximity — can hear the Merced flowing. Atmospheric but slight flood risk in high water years' },
      { number: '46', why: 'Good shade, relatively private for the campground, away from generator sections' },
    ],
    worst_to_avoid: 'Sites 1–10 in the first loop are closest to the road and have the most vehicle pass-through noise from late shuttle bus arrivals.',
    booking_tip: 'Recreation.gov opens on the 15th of each month at exactly 7:00am PST — 5 months before arrival. Have payment saved. Tuesday–Thursday has marginally better odds. Closed May 26–June 8, 2026 for road construction — book Lower Pines for that window.',
    rules: {
      max_people_per_site: '6 people maximum',
      max_vehicles: '2 vehicles (including towed)',
      max_stay: 'No per-visit limit stated — but 7-night valley limit applies',
      generator_hours: 'Three 2-hour slots daily: 7–9am, 12–2pm, 5–7pm',
      fires: 'Wood fires in rings only. Summer (May–Sept): 5pm–10pm only. October–April: anytime.',
      pets: 'Pets allowed on leash. Permitted on paved valley paths. Not on most trails. Bears highly habituated — bear lockers MANDATORY for everything.',
      noise_quiet_hours: '10pm – 6am',
      prohibitions: ['Bear lockers mandatory — everything scented including toothpaste', 'No fires outside rings', 'No fires before 5pm May–Sept', 'Generator hours strictly limited'],
    },
    activities: ['Hiking', 'Rock Climbing', 'Biking', 'Fishing', 'Rafting (Merced)', 'Photography', 'Ranger Programs', 'Half Dome Hike (permit)'],
  },

  'colter-bay-grand-teton': {
    loops: [
      { name: 'Loops A–C', character: 'More wooded, better privacy, closer to lake access', best_for: 'Tent campers wanting seclusion, wildlife watchers', hookups: 'None — tent/dry RV only', notes: 'Best overall loops for the campground experience.' },
      { name: 'Loops O & I', character: 'More open, higher traffic, less canopy', best_for: 'Larger vehicles needing more maneuvering room', hookups: 'None', notes: 'Loop I restrooms reported as poorly maintained — multiple reviews.' },
      { name: 'Colter Bay RV Park', character: 'Separate from main campground — 112 full hookup sites', best_for: 'Full hookup RVers', hookups: 'Full (water, sewer, 20/30/50A)', notes: 'Separate Recreation.gov listing. $72–78/night. 14-night max. No generators anytime.' },
    ],
    best_sites: [
      { number: 'C60 area', why: 'C loop sites near the waterfront have the most separation and lodge-pine atmosphere', tip: 'Reviewer noted site C60 is 500ft from restrooms — good or bad depending on preference' },
      { number: 'Waterfront sites', why: 'A small number of sites provide Jackson Lake views — book the most in advance', tip: 'Select "waterfront" filter on Recreation.gov when searching' },
    ],
    worst_to_avoid: 'Loop I — restrooms consistently reported as the worst-maintained in the campground.',
    booking_tip: 'Opens 6 months ahead on Recreation.gov at 7am Pacific. September has best combination of wildlife, fall color, and availability. Waterfront sites book first — try for those specifically.',
    rules: {
      max_people_per_site: '6 people',
      max_vehicles: '2 vehicles',
      max_stay: '14 nights at Colter Bay. 30 nights cumulative across all Grand Teton campgrounds.',
      generator_hours: 'NO generators permitted at any time in either campground or RV park',
      fires: 'Campfire rings only. Wood fires permitted. No fires during restrictions. No firewood gathering.',
      pets: 'Pets allowed on leash. This is GRIZZLY country — bear spray required on all hikes. Bear boxes at every site.',
      noise_quiet_hours: '10pm – 8am',
      prohibitions: ['No generators ever', 'No food outside bear boxes', 'Gas/charcoal grills must be cleaned and stored after use', 'No tent camping in RV Park'],
    },
    activities: ['Boating', 'Kayaking', 'Canoeing', 'Horseback Riding', 'Fishing', 'Hiking', 'Swimming', 'Lake Cruises', 'Ranger Programs', 'Wildlife Watching'],
  },
}
