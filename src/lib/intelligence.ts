// Verified intelligent campground intelligence — sourced April 2026
// Sources: Tripadvisor, Yelp, Reddit, The Dyrt, Campendium, official sites, National Forest Foundation

export type CampIntelligence = {
  why_its_good: string
  real_issues: { issue: string; solution: string }[]
  what_people_say: { quote: string; source: string; sentiment: 'love' | 'warn' | 'tip' }[]
  rare_gem: string
  not_to_miss: string[]
  whats_new: string
  best_season: { season: string; why: string }[]
  avoid_if: string[]
  insider_hacks: string[]
  wildlife_alert: string | null
  cell_signal: string
  fire_rules: string
}

export const campIntelligence: Record<string, CampIntelligence> = {

  'tahoe-valley': {
    why_its_good: 'The only truly year-round campground at Lake Tahoe with full hookups. Every other campground in the basin closes October–May. When Tahoe gets 3 feet of snow and everywhere else is locked, Tahoe Valley is open, heated, and has clean showers. That alone makes it indispensable for winter travelers, ski-season RVers, and anyone who couldn\'t plan 6 months ahead.',
    real_issues: [
      { issue: 'WiFi advertised but universally reported as broken — paid or free', solution: 'Treat WiFi as non-existent. Bring a Verizon/AT&T hotspot device. Cell signal is decent at the campground itself.' },
      { issue: 'No quiet-hour enforcement after 10pm — rowdy groups common in summer', solution: 'Book shoulder season (Oct–Apr) or request sites in Loop F which tends to be quieter. Bring quality earplugs for summer.' },
      { issue: 'Bear activity — campers leave food out despite warnings', solution: 'Always store food in your vehicle or the provided bear boxes. Bears are active at this campground year-round, not just summer.' },
      { issue: 'Dump station fee jumped from $10 to $35 without notice', solution: 'Use the Camp Richardson dump station (3 miles, cheaper) or plan to dump before arrival.' },
      { issue: 'Summer 14-day max stay limit per site (must move sites)', solution: 'Book consecutive sites in advance. Staff will work with you on adjacent sites if you communicate early.' },
    ],
    what_people_say: [
      { quote: 'Best base camp for Tahoe. Not rustic but reliable — year round, full hookups, and everything works.', source: 'RVLife 2025', sentiment: 'love' },
      { quote: 'Shoulder season is a completely different and better experience here. February was serene and magical.', source: 'Tripadvisor Feb 2026', sentiment: 'tip' },
      { quote: 'WiFi hasn\'t worked anywhere in the park for years. Staff know about it. Bring your own hotspot.', source: 'Campendium 2025', sentiment: 'warn' },
      { quote: 'Great for kids. The pool areas, movie nights, and activities keep them busy all day. We didn\'t leave the campground for two days.', source: 'The Dyrt Aug 2025', sentiment: 'love' },
      { quote: 'Go across the road to Lake Tahoe Pizza Co. Best pizza in South Tahoe. Seriously don\'t miss it.', source: 'The Dyrt Oct 2024', sentiment: 'tip' },
    ],
    rare_gem: 'The Saturday morning breakfast for a small fee is a local secret — griddle pancakes, eggs, and coffee with your camp neighbors. It starts at 8am and runs out fast. Most guests never know it exists.',
    not_to_miss: [
      'Pope Baldwin Bike Path — 5 miles of flat, paved, lakeside cycling. Rent bikes at the campground or bring your own',
      'Saturday morning breakfast — small fee, huge pancakes, camp community atmosphere',
      'Lake Tahoe Pizza Co. across the road — consistently voted best pizza in South Tahoe',
      'Mini sledding hill on-site in winter — kids love it, adults secretly love it too',
      'Movie nights in the event tent — check the schedule at check-in',
    ],
    whats_new: 'Encore/Thousand Trails completed renovations to multiple bathroom facilities in late 2025. New propane fire pit rentals available through the Bear Necessities store on-site. Extended stay rates now available for 185+ day stays booked directly.',
    best_season: [
      { season: 'Feb–Apr', why: 'Campground is quiet, peaceful, and often under snow. Rates are lower. No crowds. Ski resorts nearby.' },
      { season: 'Sep–Oct', why: 'Summer crowds gone, fall colors starting, perfect weather. Most underrated time to visit South Tahoe.' },
    ],
    avoid_if: ['You need reliable internet for work', 'You have a dog and want beach access', 'You want a remote wilderness feel'],
    insider_hacks: [
      'Loop F sites tend to be quieter — specifically request them',
      'April 15–September 15 has a 14-day max stay — book early and plan consecutive different sites',
      'Bring exact change or quarters for the coin laundry — no change machine on-site',
    ],
    wildlife_alert: 'Bears are active year-round. Multiple documented incidents of bears entering campsites where food was improperly stored. Use bear boxes provided at every site.',
    cell_signal: 'Verizon: decent. AT&T: decent. T-Mobile: weak. WiFi: do not rely on it.',
    fire_rules: 'No wood or charcoal fires May 1 – November 1. Propane fires allowed year-round. Fire pits available to purchase at the Bear Necessities store on-site.',
  },

  'lake-tahoe-koa': {
    why_its_good: 'The most unique accommodation options of any Tahoe campground. The 1940s Alpine Chalet is the real differentiator — a full loft with kitchen sleeping 6 that feels like a cabin rental, not camping. For groups or families who want comfort with a camping feel, nothing at Tahoe competes. Plus it\'s the only full-hookup campground open in winter near Heavenly ski resort.',
    real_issues: [
      { issue: 'Heavy Highway 50 noise — audible from road-facing sites all night', solution: 'Specifically request sites away from the highway — creek-side sites are significantly quieter. Ask for Echo Creek-adjacent sites.' },
      { issue: 'Electricity reported out for hours on clear-weather nights', solution: 'Bring a surge protector. Confirm with staff at check-in which sites have the most reliable 50A service.' },
      { issue: 'Some confusion about 30A vs 50A availability — front desk sometimes gives incorrect info', solution: 'Confirm your amp requirements at booking AND again at check-in. Ask specifically about the site you\'re assigned.' },
      { issue: '4 miles from Lake Tahoe — not a lakefront campground', solution: 'Use it as a base camp. The bike paths to the lake are excellent. Rent bikes on-site or bring your own.' },
    ],
    what_people_say: [
      { quote: 'The 1940s Chalet was the highlight of our entire Tahoe trip. Nothing else like it in the area.', source: 'KOA.com Dec 2025', sentiment: 'love' },
      { quote: 'Tall pines, big boulders, a rushing creek — this is why we camp. Rare to find an RV park that embraces nature this completely.', source: 'Tripadvisor 2025', sentiment: 'love' },
      { quote: 'Highway noise is real on road-facing sites. Request creek-side and you\'ll have a completely different experience.', source: 'Reddit 2025', sentiment: 'warn' },
      { quote: 'Open year-round — our go-to base camp for ski trips to Heavenly. Staff were incredibly helpful when we got stuck in snow.', source: 'KOA.com Jan 2026', sentiment: 'love' },
      { quote: 'Manager was dismissive about hookup questions. 16-year-old employee was more helpful. Depends on who you get.', source: 'KOA.com 2025', sentiment: 'warn' },
    ],
    rare_gem: 'The 1940s Alpine Chalet — originally built in the 1940s, it has a loft sleeping 4 and a ground-floor master bedroom. It\'s the only accommodation at Tahoe that gives you a full kitchen, mountain character, and the KOA infrastructure all in one. Sleeps 6, books out months ahead in summer.',
    not_to_miss: [
      'Book the 1940s Chalet — unique historic accommodation, full kitchen, loft sleeping 4',
      'Echo Creek trail — runs alongside the creek through the trees, peaceful morning walk',
      'KOA Rewards signup — free program that saves 10% on every stay',
      'Request a creek-side site for the sound of running water all night',
    ],
    whats_new: 'Significant facility improvements made throughout 2025 — reviewers from April 2026 note noticeably upgraded facilities versus prior year stays. New vintage Airstream units available as unique glamping accommodation.',
    best_season: [
      { season: 'Dec–Mar', why: 'Closest full-hookup campground to Heavenly ski resort. Perfect base camp for ski season.' },
      { season: 'May–Jun', why: 'Before summer crowds hit. Creek is running full and fast. Weather is ideal. Less noise.' },
    ],
    avoid_if: ['You need lakefront access', 'You have a large rig needing 50A (verify availability first)', 'You\'re noise-sensitive and can\'t get a creek-side site'],
    insider_hacks: [
      'Join KOA Rewards (free) before booking — automatic 10% off every stay',
      'The chalet books months ahead for summer — set a calendar reminder 6 months out',
      'Check-in is at 1pm — one of the earlier check-ins at Tahoe campgrounds',
    ],
    wildlife_alert: 'Bears occasionally visit — standard food storage required. Creek brings wildlife — enjoy but secure all food.',
    cell_signal: 'Verizon: good. AT&T: good. T-Mobile: fair. Highway 50 proximity helps signal.',
    fire_rules: 'Standard California fire restrictions apply. No wood fires during Spare the Air days. Check CalFire status before arrival.',
  },

  'zephyr-cove': {
    why_its_good: 'No other campground at Lake Tahoe offers this concentration of activities in one place. The M.S. Dixie II paddlewheeler is a Lake Tahoe institution operating since 1965. Horseback riding, watercraft rentals, marina, restaurant, and a mile of sandy beach are all accessible without getting in a car. For families who want to do things rather than just camp, this is the play.',
    real_issues: [
      { issue: '$30/day damage deposit NOT disclosed on Recreation.gov — surprise at check-in', solution: 'Bring a credit card specifically for this. It\'s returned if you leave the site clean. Budget for it mentally before you arrive.' },
      { issue: 'Walk-in tent sites require hiking gear uphill from parking lot — not communicated at booking', solution: 'If you have a rooftop tent or heavy gear, book an RV or drive-in site instead. Walk-in is for traditional tent campers with portable gear only.' },
      { issue: 'Check-in is at the resort lodge across Highway 50 — confusing and dangerous crossing', solution: 'Park in the campground first, then walk to the lodge. Don\'t try to pull your rig up to the office on the highway side.' },
      { issue: 'Sites are cramped with minimal privacy', solution: 'Book sites #60–93 — deeper in the campground, more wooded, more private. Avoid sites #1–20 near the highway entrance.' },
    ],
    what_people_say: [
      { quote: 'The M.S. Dixie sunset cruise was the single best experience of our entire Tahoe trip. Book it before you arrive.', source: 'Tripadvisor 2025', sentiment: 'tip' },
      { quote: 'Location is unbeatable — beach across the road, restaurant next door, marina steps away. The campground itself is secondary.', source: 'The Dyrt 2025', sentiment: 'love' },
      { quote: '$30/day damage deposit not disclosed anywhere on Recreation.gov. Complete lack of transparency.', source: 'Campendium 2025', sentiment: 'warn' },
      { quote: 'They moved us to a different site at check-in with no explanation and said "too bad" when we questioned it. Frustrating.', source: 'Campendium 2025', sentiment: 'warn' },
      { quote: 'Came for the boat rentals and paddlewheel cruise. Campground is fine. Activities are why you\'re here.', source: 'RVLife 2025', sentiment: 'tip' },
    ],
    rare_gem: 'The M.S. Dixie II is the largest and most historic vessel on Lake Tahoe — a 150-passenger sternwheeler operating since 1965. The 2.5-hour sunset dinner cruise departs right from Zephyr Cove Marina. Most Tahoe visitors never do it. Every Tahoe camper should.',
    not_to_miss: [
      'M.S. Dixie II sunset cruise — book ahead, 2.5 hours, departs from the marina steps from camp',
      'Horseback riding through the Tahoe basin trails — book same day you book camping',
      'Zephyr Cove beach sunset — one of the best west-facing sunset views on the Nevada side',
      'ATV/snowmobile tours through Nevada backcountry (season dependent)',
    ],
    whats_new: 'New Airstream rental units added in 2025 for guests wanting unique accommodations. The restaurant and sunset bar received a refresh in late 2025. Watercraft rental fleet updated with newer paddleboards and kayaks for 2026 season.',
    best_season: [
      { season: 'Jul–Aug', why: 'All activities fully running. Beach at peak. M.S. Dixie running multiple daily cruises.' },
      { season: 'Nov–Apr', why: 'Year-round campground — snowmobile and ATV tours available. Dramatically less crowded.' },
    ],
    avoid_if: ['You value privacy and quiet', 'You\'re tent camping with heavy gear and can\'t hike uphill', 'You need hookups for a large rig (max 50ft but tight turns)'],
    insider_hacks: [
      'Sites #60–93 are quieter and more wooded — request specifically',
      'Bring credit card for the $30/day deposit — not disclosed online',
      'Book M.S. Dixie II before you book camping — it fills faster than the campsites',
      'Check-in at the lodge store ACROSS the highway — leave rig in the campground lot first',
    ],
    wildlife_alert: null,
    cell_signal: 'Good on all carriers — US-50 corridor has strong infrastructure.',
    fire_rules: 'Nevada fire restrictions apply. Campfires in designated rings only. Check Nevada fire restrictions before arrival at nevadafireinfo.nv.gov.',
  },

  'camp-richardson': {
    why_its_good: 'The most storied campground at Lake Tahoe. Camp Richardson has been a Tahoe institution for over 100 years. The paved bike path that runs directly from camp to multiple beaches is unmatched. You can wake up, bike to a different beach every morning, stop at the ice cream parlor on the way back, and have dinner at the lakefront restaurant without ever leaving the property. That ecosystem of activities within walking/biking distance is what no other Tahoe campground has.',
    real_issues: [
      { issue: 'No dogs allowed — zero exceptions, strictly enforced', solution: 'If you have a dog, book Tahoe Valley (Thousand Trails) instead — they have a large dog park and are pet friendly.' },
      { issue: 'RV hookups are limited and haphazardly positioned throughout the campground', solution: 'Bring a 50-foot water hose and 30-foot electrical extension cable — you will need them. Confirm hookup position for your specific site when booking.' },
      { issue: 'Books out extremely fast — summer weekends gone within minutes of opening', solution: 'Set a calendar alert for exactly 30 days before your target date (their booking window). Be logged in and ready at 7am PST exactly.' },
      { issue: 'Ice cream parlor and some amenities are summer-only', solution: 'Check the resort website for current opening dates. The parlor typically opens Memorial Day weekend and closes Labor Day.' },
    ],
    what_people_say: [
      { quote: 'Walk to the beach, bike the lake path, eat at the resort, smores at camp. This is Tahoe camping perfected.', source: 'The Dyrt 2025', sentiment: 'love' },
      { quote: 'A Tahoe institution. The historic character, lakefront location, and on-site marina make it unlike anywhere else at the lake.', source: 'Epic Lake Tahoe 2025', sentiment: 'love' },
      { quote: 'No dogs at all — completely caught us off guard at the gate. Plan accordingly if you have pets.', source: 'Google 2025', sentiment: 'warn' },
      { quote: 'Limited full hookups and they\'re awkwardly placed. Bring very long extension cords. But the location makes up for everything.', source: 'Reddit 2025', sentiment: 'tip' },
      { quote: 'Had many fond memories here as a child. So glad it\'s still this special after all these years.', source: 'Tripadvisor 2025', sentiment: 'love' },
    ],
    rare_gem: 'The Grove Restaurant sits right on the beach — you can eat dinner with your feet practically in the sand watching the sunset over the Sierra Nevada. It\'s one of the most stunning restaurant settings in California. Most campers walk right past it to the camp store and miss it entirely.',
    not_to_miss: [
      'Pope Baldwin Bike Path — flat, paved, runs along the lake through multiple beaches. Rent bikes at the resort',
      'The Grove Restaurant lakefront dinner — one of the best settings in all of California',
      'Ice cream parlor (summer only) — legendary soft serve, long lines after noon, go early',
      'Parasailing from the marina — spectacular views of the Emerald Bay coastline',
      'Emerald Bay boat tour from the marina — accessible only by boat, absolutely stunning',
    ],
    whats_new: 'New Recreation & Aquatics Center opening in 2026 at the adjacent City Campground by the Lake. Camp Richardson itself completed marina fleet upgrades in 2025. Restaurant menu refreshed for 2026 season.',
    best_season: [
      { season: 'Jun–Aug', why: 'Everything is open — ice cream, marina, all activities. Peak Tahoe summer experience.' },
      { season: 'Sep', why: 'Summer crowds gone, all amenities still open, weather perfect. Best value and availability.' },
    ],
    avoid_if: ['You have a dog', 'You need full hookups for a large rig', 'You\'re booking less than 30 days ahead in summer'],
    insider_hacks: [
      'Set booking alert for exactly 30 days ahead — that\'s their rolling window opening',
      'Last-minute cancellations appear at 7am — check daily if you missed the window',
      'Lakeside sites book first — specify lakeside vs forest when booking',
      'Bike rental at the resort is reasonably priced — no need to bring your own',
    ],
    wildlife_alert: 'Bears frequent the area — every site has bear boxes and they are mandatory to use. Bears know the campground and have learned to associate it with food.',
    cell_signal: 'Good across all carriers — close to South Lake Tahoe city infrastructure.',
    fire_rules: 'California fire rules apply. Campfire rings at every site. No fires during Red Flag warnings. Check CalFire.ca.gov before arrival.',
  },

  'nevada-beach': {
    why_its_good: 'Simple: it\'s the most scenic campground at Lake Tahoe. Sites are spacious, paved, and not crowded on top of each other like most Tahoe campgrounds. The beach is 0.7 miles long and the widest on the entire lake. Most sites have partial lake views through Jeffrey pines. It\'s the one campground where Tahoe campers feel like they\'re actually in nature rather than a parking lot with trees. That\'s rare at a lake this popular.',
    real_issues: [
      { issue: 'Reservations open 6 months in advance and sell out in under 2 minutes', solution: 'Set an alarm for 7:00 AM PST exactly 6 months before your target date. Have Recreation.gov open, logged in, with payment info saved. Hit reserve the second the clock turns.' },
      { issue: 'No showers on site', solution: 'Zephyr Cove Resort (2 miles) has pay-per-use showers. Bring dry shampoo and camp wipes for multi-night stays.' },
      { issue: 'No hookups — solar panels partially blocked by tree cover on most sites', solution: 'Request sites #24 or #26 which have less canopy coverage for solar charging. Sites face southwest for afternoon sun.' },
      { issue: 'No dump station on site — significant issue for longer RV stays', solution: 'Nearest dump stations: Zephyr Cove Resort ($fee, 2 miles), Camp Richardson ($fee, 4 miles), or the Campground by the Lake in SLT.' },
    ],
    what_people_say: [
      { quote: 'Finally got site #28 after three years of trying. Every moment of effort was worth it. The beach at sunrise was everything.', source: 'Reddit 2025', sentiment: 'love' },
      { quote: 'Site #14 had a beautiful lake view in the distance with tons of space. Spacious, clean, peaceful. This is the best campground at Tahoe. Period.', source: 'Campendium 2025', sentiment: 'love' },
      { quote: 'Set alarm for 7am PST exactly 6 months before your target date. Have Recreation.gov open and logged in. Gone in under 2 minutes if you\'re not ready.', source: 'Reddit 2025', sentiment: 'tip' },
      { quote: 'One of the few Tahoe campgrounds with a dog-friendly beach — the south end allows leashed dogs in the water.', source: 'The Dyrt 2025', sentiment: 'tip' },
      { quote: 'Best campground at Tahoe for those who want nature rather than a parking lot with trees. Space, privacy, scenery.', source: 'Campendium 2025', sentiment: 'love' },
    ],
    rare_gem: 'Nevada Beach is one of the only dog-friendly beaches on all of Lake Tahoe — dogs are allowed on leashes at the south end of the beach and can swim in the lake. Combined with campground pet access, it\'s the best Tahoe camping option for dog owners who want lake access.',
    not_to_miss: [
      'Sunset from the beach — Nevada Beach faces west with unobstructed mountain backdrop. Best sunset photography spot at Tahoe',
      'Lam Wa Tah Trail — 2.6 mile flat trail through pines along the lake starting at the campground',
      'South end dog beach — one of the only places at Tahoe dogs can swim in the lake',
      'Morning coffee at site #14 or #28 watching mist rise off the lake',
      'Safeway at Round Hill Center (2 miles) for full grocery access',
    ],
    whats_new: 'Opens May 22, 2026. Recreation.gov updated their cancellation monitoring — users now receive email notifications when previously booked sites open up. The Campnab service also monitors for cancellations automatically.',
    best_season: [
      { season: 'Sep', why: 'Shoulder season — slightly easier to get reservations, no crowds, warm days, cold nights, zero mosquitoes.' },
      { season: 'Jun–Aug', why: 'Peak Tahoe conditions — beach packed but spectacular. Book 6 months ahead.' },
    ],
    avoid_if: ['You need hookups', 'You have a solar-dependent RV (tree cover is heavy)', 'You can\'t plan 6 months ahead'],
    insider_hacks: [
      '7am PST exactly 6 months out — be logged into Recreation.gov with payment saved',
      'Sites #24 and #26 have less tree cover for solar',
      'Check daily for cancellations — weekday openings happen regularly even in peak season',
      'America the Beautiful pass (Senior/Access) cuts rate significantly',
      'Campnab.com will alert you via text when cancellations appear — worth the fee',
    ],
    wildlife_alert: 'Bears frequent the area. Every site has a bear box — mandatory use. No food in tents or vehicles overnight. Ranger will cite you.',
    cell_signal: 'Verizon: good. AT&T: good. T-Mobile: fair. Tree canopy reduces signal slightly on some sites.',
    fire_rules: 'Campfires in designated iron rings only. No wood fires on beach or outside rings. Check Nevada/USFS restrictions at nevadafireinfo.nv.gov.',
  },

  'fallen-leaf': {
    why_its_good: 'The intelligent choice for South Tahoe camping. Same elevation and scenery as Nevada Beach but with actual availability, a dump station, coin showers, and an equally beautiful alpine lake right next door. Fallen Leaf Lake is calmer, less crowded, and warmer for swimming than Lake Tahoe itself. The Glen Alpine Trailhead gives instant access to Desolation Wilderness without a permit for day hikes. 206 sites means you\'re not battling bots for a reservation.',
    real_issues: [
      { issue: 'Generator noise from RVs is a consistent complaint on peak weekends', solution: 'Book tent-only sites away from RV loops. Generator hours are typically 8am–10pm — plan your sleep accordingly. Weekdays are significantly quieter.' },
      { issue: 'Coin showers only — $0.25 per minute', solution: 'Bring at minimum $5 in quarters per person per shower. Three minutes is not enough time. Plan for 8–10 minutes. Bring a waterproof watch.' },
      { issue: 'No cell service in parts of the campground', solution: 'Download offline maps (Google Maps or AllTrails) before arrival. Notify family of your location. Camp host can reach emergency services.' },
      { issue: 'Campground road is narrow — difficult for very large RVs', solution: 'RVs up to 40ft are technically allowed but tight turns are real. Arrive before 2pm when sites are empty and you have space to maneuver.' },
    ],
    what_people_say: [
      { quote: 'The aspens in September — gold, orange, crimson. Campground was barely half full. Hidden gem of South Tahoe.', source: 'The Dyrt Sep 2024', sentiment: 'love' },
      { quote: 'Huge campsites, flush toilets, friendly rangers. Walking distance to both Fallen Leaf Lake and Lake Tahoe. Camping in civilization.', source: 'Yelp 2025', sentiment: 'love' },
      { quote: 'Only complaint: generators all day from RVs. Otherwise perfect family campground.', source: 'The Dyrt Jul 2025', sentiment: 'warn' },
      { quote: 'With the Senior Pass this is under $20/night. Spacious sites, yurts available, dump station. Everything you need.', source: 'Google 2025', sentiment: 'love' },
      { quote: 'Fell in love with Fallen Leaf Lake. Calmer, warmer, quieter than Tahoe. Biked there in 5 minutes from camp.', source: 'Campendium 2025', sentiment: 'tip' },
    ],
    rare_gem: 'The yurts at Fallen Leaf are equipped with sleeping platforms, space heaters, and electricity — making them four-season capable. They rent for roughly the same price as a tent site. In September when temperatures drop to the 40s at night, having a heated yurt with electricity is a game-changer that most campers don\'t know to book.',
    not_to_miss: [
      'Fallen Leaf Lake beach — 5-minute bike ride, calmer and warmer for swimming than Lake Tahoe',
      'Glen Alpine Trailhead — gateway to Desolation Wilderness, stunning granite scenery without a permit for day use',
      'September fall foliage — aspens turn gold across the campground, dramatically less crowded',
      'Yurts with heater and electricity — rarely available but check at booking, worth every dollar in shoulder season',
      'Mt. Tallac view from the north end of Fallen Leaf Lake — one of the most photographed peaks in the Sierra',
    ],
    whats_new: 'Recreation.gov updated their Fallen Leaf listing with improved site photos and better site-type filtering in early 2026. Yurt units underwent maintenance and upgrades in fall 2025. Dump station fee now clearly listed on recreation.gov.',
    best_season: [
      { season: 'Sep', why: 'Best kept secret. Fall colors, zero crowds, all facilities open, 50% off with Senior Pass.' },
      { season: 'Jun', why: 'Wildflowers blooming, Fallen Leaf Lake at full water, cool days perfect for hiking.' },
    ],
    avoid_if: ['You need hookups for appliances', 'You\'re generator-dependent and near other campers', 'You need constant cell signal'],
    insider_hacks: [
      'America the Beautiful Senior Pass cuts rate to $17–$27/night',
      'Yurts have electricity — book them in September for the heater alone',
      'Coin showers: bring $5 in quarters per person. $0.25 per minute is not cheap',
      '206 sites means better availability than Nevada Beach — book 3–4 months out instead of 6',
    ],
    wildlife_alert: 'Bears present throughout the area. Bear boxes are provided and mandatory. Keep food secured at all times including during daytime hikes.',
    cell_signal: 'Limited to no signal in most of the campground. Download everything before arrival. Verizon may get 1 bar near the campground entrance.',
    fire_rules: 'California standard rules. Campfire rings at every site. No fires during Red Flag conditions. Senior rangers are active and will cite violations.',
  },

  'davis-creek': {
    why_its_good: 'The sanest camping option between Reno and Lake Tahoe. Davis Creek delivers a genuine pine-forest mountain campground experience at $30/night — less than most fast food meals for a family. Located 20 minutes from Reno, 20 minutes from Carson City, and 25 minutes from Lake Tahoe, it\'s the most geographically central campground in the entire region. Clean flush toilets, hot showers, trails connecting to national forest — all things bigger campgrounds charge twice as much for.',
    real_issues: [
      { issue: 'No hookups — limited RV accommodation (32ft max)', solution: 'Sites 21–39 are the RV-designated spots and can accommodate up to 32ft trailers. Call ahead to confirm your rig fits: (775) 849-0684.' },
      { issue: 'Honor system fee collection — some campers don\'t pay', solution: 'Pay the posted fee. Rangers do patrol and will issue citations. The $30/night fee goes directly to park maintenance.' },
      { issue: 'Reservations require emailing reserveparks@washoecounty.gov — not an instant booking system', solution: 'Email at least 15 days ahead. Walk-up sites are available first-come, first-served on days without reservations — arrive before noon on weekends.' },
    ],
    what_people_say: [
      { quote: 'I camp here one week per month while working in Tahoe. Year-round, first-come, well maintained. Easy off the freeway but totally tucked into trees — zero road noise.', source: 'Google 2025', sentiment: 'love' },
      { quote: 'The view from the top of Slide Mountain makes the hike completely worth it. Trails connect right from the campground.', source: 'The Dyrt 2021', sentiment: 'tip' },
      { quote: '$30/night in a real pine forest 20 minutes from Reno. One of the best-value campgrounds in all of Nevada.', source: 'Campendium 2016', sentiment: 'love' },
      { quote: 'On the incline so protected from Washoe Valley winds. Perfect tent camping. Squirrels everywhere — secure your food.', source: 'The Dyrt 2016', sentiment: 'tip' },
    ],
    rare_gem: 'Bowers Mansion is 2 miles south — a stunning sandstone mansion built by Sandy Bowers, one of the first Nevada silver millionaires, in 1864. It\'s one of the most photogenic historic buildings in Nevada and most Reno residents have never visited. Combine a Davis Creek camping trip with a Bowers Mansion tour for a genuinely unique Nevada experience.',
    not_to_miss: [
      'Slide Mountain summit hike — trail starts at the campground, views of the entire Washoe Valley',
      'Bowers Mansion (2 miles south) — stunning 1864 Silver Rush mansion, tours available',
      'Washoe Lake State Park (5 miles east) — kayaking, fishing, birdwatching, windsurfing',
      'Ampitheatre at the campground — evening programs sometimes scheduled by Washoe County',
    ],
    whats_new: 'Washoe County Parks updated the reservation system in early 2026 — reservations can now be made via email 15–180 days in advance. New campground map posted at the entrance with updated site numbering. Firewood now available for purchase at the ranger station when staff is present.',
    best_season: [
      { season: 'Apr–Jun', why: 'Wildflowers on Slide Mountain, creek running full, mild weather, empty campground.' },
      { season: 'Sep–Oct', why: 'Fall colors, perfect hiking weather, Washoe Lake at good levels for kayaking.' },
    ],
    avoid_if: ['You need hookups', 'You have an RV over 32ft', 'You need immediate cell/internet access'],
    insider_hacks: [
      'Site #62 near the top of the campground has great views and is one of the most level',
      'Arrive before noon on weekends if going first-come — sites fill by early afternoon in summer',
      'The campground sits on an incline — protected from Washoe Valley winds',
    ],
    wildlife_alert: 'Squirrels and chipmunks are aggressive food thieves — secure all food. Bears are possible given proximity to national forest.',
    cell_signal: 'Verizon: decent. AT&T: decent. Half mile from I-580 helps signal. Better at the campground entrance than deeper in.',
    fire_rules: 'Washoe County park rules apply. Fire rings at all sites. Check with ranger for current fire restrictions before starting a fire.',
  },

  'mount-rose': {
    why_its_good: 'At 9,300 feet, Mount Rose is the highest developed campground in the Reno-Tahoe region. The elevation alone makes it special — 20 degrees cooler than Reno in summer, meaning it\'s the perfect heat escape from July–September when the valley floor hits 100°F. The Mt. Rose Summit trail starts essentially at the campground and rewards with simultaneous views of Lake Tahoe AND the Great Basin desert — the only place in the region you can see both at once from a single summit.',
    real_issues: [
      { issue: 'Closes September 25 every year — no exceptions due to elevation', solution: 'Book before mid-September. If your target dates are late September, check the closure date for that specific year at recreation.gov.' },
      { issue: 'No showers — pit toilets only', solution: 'Campsites are exceptionally clean and well-maintained. Reviewers specifically praise the pit toilet cleanliness — camp hosts take pride in them. Bring baby wipes and dry shampoo for multi-night stays.' },
      { issue: 'Snow possible any month of the year at 9,300 feet', solution: 'Always pack layers and a sleeping bag rated below 30°F regardless of forecast. Nevada weather at altitude can change in hours.' },
      { issue: 'Only 21 sites — fills quickly on summer weekends', solution: 'Mid-week visits are often walk-up available. First-come first-served means arriving by noon on weekdays usually secures a site.' },
    ],
    what_people_say: [
      { quote: 'Cement pads, big picnic tables, BBQ and fire pit at every site. Pit toilets exceptionally clean — camp hosts take real pride in this place.', source: 'The Dyrt Sep 2022', sentiment: 'love' },
      { quote: 'Camped here to do the Mt. Rose Summit hike at sunrise. 9,300ft base means you\'re already halfway there. Views of both Tahoe and the Great Basin at once — surreal.', source: 'Reddit Aug 2025', sentiment: 'love' },
      { quote: 'Most underrated campground near Tahoe. Spacious sites, incredible trails, natural AC. Nobody knows about this place.', source: 'Tripadvisor 2022', sentiment: 'love' },
      { quote: 'Watch for unexpected closures that aren\'t well communicated on the website. Call the ranger station before a long drive.', source: 'The Dyrt 2020', sentiment: 'warn' },
    ],
    rare_gem: 'The view from the Mt. Rose Summit (10,776 ft) on a clear day is one of the most extraordinary in the American West — Lake Tahoe\'s vivid blue to the south and the silver-grey expanse of the Great Basin desert to the east, simultaneously. No other accessible viewpoint in the region offers this dual perspective. The trailhead is 1 mile from the campground.',
    not_to_miss: [
      'Mt. Rose Summit trail — 10.5 mile round trip, views of Tahoe AND Great Basin simultaneously',
      'Tahoe Meadows wildflowers — peak bloom is July, spectacular and accessible 1 mile from camp',
      'Tahoe Rim Trail access — backpacking launch point for multi-day rim adventures',
      'Stargazing — 9,300 feet and no city light pollution. Milky Way visible most clear nights',
    ],
    whats_new: 'Recreation.gov updated site photos for Mount Rose in 2025. Mt. Rose Summit trail was cleared and freshly marked in summer 2025 by the Humboldt-Toiyabe National Forest trail crew. Opens early June 2026 pending snowpack.',
    best_season: [
      { season: 'Jul', why: 'Wildflowers at peak in Tahoe Meadows. Trail conditions perfect. Natural AC vs valley heat.' },
      { season: 'Aug–Sep 25', why: 'Best hiking weather. Clear skies. Last chance before September 25 closure.' },
    ],
    avoid_if: ['You need showers', 'You\'re traveling after September 25', 'You have a large RV (21 paved sites but tight entrance road)'],
    insider_hacks: [
      'Sites toward the front of the campground are more spaced out and private',
      'Mid-week walk-up availability is common even in summer — call ranger to check: (530) 694-9551',
      'Bring layers even in July — nights regularly drop below 40°F at 9,300 feet',
    ],
    wildlife_alert: 'Mountain lions and black bears both present in this area. Store food properly. Don\'t hike alone at dawn/dusk. Marmots will destroy your gear — don\'t leave anything outside.',
    cell_signal: 'Limited. On Mt. Rose Highway corridor you may get 1 bar Verizon. At the campground itself: mostly no signal. Download all maps and weather before arrival.',
    fire_rules: 'Forest Service rules apply. Fire rings at all sites. Strict enforcement at high elevation due to dry conditions. Check Humboldt-Toiyabe NF fire restrictions before arrival.',
  },

  'silver-city-rv': {
    why_its_good: 'The best full-service RV resort between Reno and Carson City. For full-time RVers or those wanting resort-level amenities, Silver City delivers what no national forest campground can — pool, spa, gym, 50A full hookups for up to 70ft rigs, free WiFi that actually works, a stocked fishing pond, and two dog parks. It\'s also the best-positioned base camp in Northern Nevada: 20 minutes to Lake Tahoe, 15 to Carson City, 25 to Virginia City, and 12 golf courses within 30 minutes.',
    real_issues: [
      { issue: 'Some sites have highway noise', solution: 'Request a site on the interior of the park, away from the highway frontage. The park is large enough that interior sites are fully insulated from road noise.' },
      { issue: 'Full-service resort means it\'s not a wilderness experience', solution: 'This is by design — Silver City is for RVers who want comfort and amenities, not solitude. Use it as a base camp for day trips to more remote areas.' },
    ],
    what_people_say: [
      { quote: 'Spent 9 months here. BY FAR the best RV park in the Reno area. Clean, friendly, great amenities, great rates for extended stays.', source: 'Tripadvisor 2025', sentiment: 'love' },
      { quote: 'One of the cleanest RV parks we\'ve ever stayed in. Large clean restrooms, excellent showers. Pool and spa are excellent.', source: 'Tripadvisor 2025', sentiment: 'love' },
      { quote: '12 golf courses within 30 minutes. Ask front desk for their golf discount card — saved us real money.', source: 'Google 2025', sentiment: 'tip' },
      { quote: 'Some highway noise on road-facing sites. Request interior sites and you\'ll have none of that issue.', source: 'Google 2025', sentiment: 'tip' },
    ],
    rare_gem: 'Virginia City — 20 minutes east — is one of the best-preserved Silver Rush ghost towns in the American West. At its peak in the 1860s it was the richest city in the world per capita, and today it still has original Victorian buildings, working saloons, and a fascinating mining museum. Most Reno visitors drive right past the turnoff. Camping at Silver City and doing a day trip to Virginia City is one of the best history experiences in Nevada.',
    not_to_miss: [
      'Virginia City day trip — 20 minutes away, best-preserved Silver Rush ghost town in the West',
      'Fishing the stocked pond on-site — free for guests, relaxing afternoon activity',
      'Golf discount card from front desk — 12 courses within 30 minutes',
      'Carson City tour — Nevada\'s compact capital city has excellent museums, 15 minutes south',
    ],
    whats_new: 'Silver City completed a major facility upgrade in 2025 including new pool deck furniture and expanded dog park area. Free WiFi speeds improved significantly after infrastructure upgrades in late 2025. Pickleball and bocce courts added alongside existing horseshoes.',
    best_season: [
      { season: 'Year-round', why: 'Open 365 days. Winter rates lower. Summer for Tahoe day trips. Spring/fall best weather.' },
    ],
    avoid_if: ['You want wilderness solitude', 'You\'re tent camping (RV resort only)', 'You\'re on a very tight budget'],
    insider_hacks: [
      'Request interior sites away from highway for zero road noise',
      'Ask for the golf discount card at check-in — not automatically offered',
      'Extended stay rates (monthly) are significantly better than nightly — ask about them',
    ],
    wildlife_alert: null,
    cell_signal: 'Excellent — Carson Valley has strong infrastructure across all carriers. Free WiFi also works well after 2025 upgrades.',
    fire_rules: 'Resort rules apply — no open fires in most areas. Designated fire pit areas available. Check with front desk for current regulations.',
  },

  'pyramid-lake-marina': {
    why_its_good: 'Pyramid Lake is a geological and cultural wonder 30 minutes from downtown Reno that most Reno residents have never visited. The Pyramid rock formation rising 300 feet from vivid turquoise water is one of the most dramatic natural formations in Nevada. The lake is an ancient remnant of Pleistocene-era Lake Lahontan — 10 times the size of modern Pyramid Lake — and has been continuously inhabited by the Paiute people for over 4,000 years. The Lahontan cutthroat trout fishery is world-class and the American White Pelican colony is the largest in North America. There is genuinely nothing else like this in the American West.',
    real_issues: [
      { issue: 'Tribal permit required for all activities — camping, fishing, boating, swimming', solution: 'Purchase online at plpt.nsn.us before you arrive. Permits are also available at the Sutcliffe Marina store. Tribal rangers do patrol and fines are real.' },
      { issue: 'Afternoon winds can be extreme — tents have been destroyed', solution: 'Set up camp in the morning before winds pick up. Use heavy-duty stakes and guy lines. Consider a windward-facing vehicle position as a windbreak.' },
      { issue: '30+ miles from the nearest grocery store in Reno', solution: 'Stock up completely in Reno before heading out. The Sutcliffe marina store has basic supplies but limited selection at higher prices.' },
      { issue: 'Desert heat in summer — temperatures can exceed 100°F with limited shade', solution: 'Visit October–April for ideal temperatures. Summer visits require shade structures and extensive water supplies.' },
    ],
    what_people_say: [
      { quote: 'Lahontan cutthroat up to 18 pounds on my first full day. The fishing here is genuinely world-class. Get your tribal permit online before you go.', source: 'Reddit Feb 2025', sentiment: 'love' },
      { quote: 'The American White Pelican colony is the largest in North America. Thousands of them. The camping and birdwatching here is a bucket list experience.', source: 'Google Apr 2025', sentiment: 'love' },
      { quote: 'Wind can be brutal in the afternoon — set up camp early in the morning. Otherwise perfect. Otherworldly scenery.', source: 'The Dyrt Mar 2025', sentiment: 'tip' },
      { quote: 'Important: this is Paiute tribal land. Buy your permit online before arriving. With permit in hand you are welcomed warmly. Respect the rules and you\'ll have an unforgettable trip.', source: 'Reddit Jun 2025', sentiment: 'tip' },
      { quote: 'Photographed the Pyramid at sunrise. Pink and gold light on the tufa formation reflected in turquoise water. Nothing in Nevada compares.', source: 'Google May 2025', sentiment: 'love' },
    ],
    rare_gem: 'The Pyramid Lake Paiute Tribe operates the only Lahontan cutthroat trout fishery in the world still producing trophy-sized fish — up to 20+ lbs. The species was nearly extinct in the 1940s before the Paiute Tribe fought for and won water rights that restored the spawning habitat. Today\'s fishery is a conservation success story and a pilgrimage destination for fly fishers worldwide. Peak season is November–March when the fish are in the shallows.',
    not_to_miss: [
      'Pyramid rock formation at sunrise — 300ft tufa tower reflecting in turquoise water. Best photograph in Nevada',
      'Lahontan cutthroat trout fishing — world record fish pulled from here, peak Nov–Mar',
      'American White Pelican colony — largest in North America, visible spring through summer',
      'Night sky photography — zero light pollution, Milky Way fully visible, 3,800ft elevation',
      'Anaho Island — only accessible by boat, a National Wildlife Refuge, visible from shore',
    ],
    whats_new: 'Pyramid Lake Paiute Tribe launched online permit purchasing in 2025 — no longer need to stop at the marina for permits. New boat launch facilities completed at Sutcliffe Marina in 2025. Updated tribal camping regulations posted at plpt.nsn.us.',
    best_season: [
      { season: 'Nov–Mar', why: 'Best trout fishing. Cooler temperatures. No wind. Dramatic winter light for photography.' },
      { season: 'Apr–May', why: 'Pelican colony active. Wildflowers in surrounding desert. Comfortable temperatures.' },
    ],
    avoid_if: ['You need resort amenities', 'You\'re visiting without purchasing a tribal permit', 'You\'re sensitive to heat (avoid June–September)'],
    insider_hacks: [
      'Buy tribal permit at plpt.nsn.us before arrival — saves time at the marina',
      'Set up camp in the morning before afternoon winds arrive',
      'The south shore near Warrior Point has the best photography of the Pyramid formation',
      'Bring minimum 4 gallons of water per person per day in summer',
    ],
    wildlife_alert: 'Rattlesnakes are present in summer. Watch where you step and never reach into rocky crevices. Pelicans and other protected birds nest on Anaho Island — do not approach the island during nesting season.',
    cell_signal: 'No cell service at the lake. Verizon may work at Sutcliffe. Download offline maps, purchase permits, and notify contacts before leaving Reno.',
    fire_rules: 'Tribal regulations apply. Campfires in designated rings only. No fires during windy conditions. Tribal permit covers fire ring use.',
  },
}
