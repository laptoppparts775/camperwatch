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

  'watchman-campground': {
    why_its_good: 'The only campground inside Zion Canyon as of 2026. South Campground is indefinitely closed and BLM dispersed camping around the park was banned in March 2026 — making Watchman the sole option for camping in the canyon. The shuttle stop inside the campground means you park once and ride to every trailhead without moving your car. The Virgin River flows alongside camp and the canyon walls glow red-orange at sunrise and sunset from every site.',
    real_issues: [
      { issue: 'No showers anywhere on-site', solution: 'Zion Outfitter in Springdale (0.5 mi) offers pay showers. Easy walk across the pedestrian bridge.' },
      { issue: 'Sites very close together — tent is 10-11ft from neighbor in peak season', solution: 'Book F-Loop walk-in sites for the most separation. Arrive early — walk-in sites are first-come.' },
      { issue: 'Oversized vehicles banned from Zion-Mt. Carmel Tunnel from June 7, 2026', solution: 'If your rig is over 11\'4" tall, 7\'10" wide, or 35\'9" long — you cannot use the east entrance at all from June 7. Plan routes accordingly.' },
      { issue: 'April–May tent caterpillar infestation falls from trees onto everything', solution: 'Shake your gear before use. Not harmful — just unpleasant. Keeps most people away, meaning better availability.' },
      { issue: 'Non-US residents pay $100/person surcharge on top of park entrance fee (since Jan 2026)', solution: 'Budget accordingly. America the Beautiful Pass exempts the surcharge for pass holders.' },
    ],
    what_people_say: [
      { quote: 'Woke up, stepped on the shuttle, hiked Angels Landing before 8am. No crowds. This is how you do Zion.', source: 'The Dyrt Nov 2025', sentiment: 'tip' },
      { quote: 'Views are mesmerizing — sandstone walls glow every morning. But bring your own shower plan, there are none here.', source: 'PerfectCamp Mar 2026', sentiment: 'tip' },
      { quote: 'Clean sites, clean bathrooms, easy shuttle access. Perfect base camp. Bathrooms were always a bit overcrowded but otherwise flawless.', source: 'Recreation.gov Mar 2026', sentiment: 'love' },
      { quote: 'Spectacular mountain views. Clean restrooms. Walking bridge to restaurants makes this feel like camping and vacation at the same time.', source: 'PerfectCamp Mar 2026', sentiment: 'love' },
    ],
    rare_gem: 'The Watchman Trail starts directly from the campground and climbs behind the formation at dawn before any shuttle crowds arrive. At the top you\'re eye-level with the canyon walls while the valley floor is still in shadow. It\'s the best possible start to a Zion day and most visitors never attempt it because they\'re focused on shuttle-accessed trails.',
    not_to_miss: ['Watchman Trail at sunrise — trailhead in the campground, canyon walls at eye level', 'Pa\'rus Trail — paved, dog-friendly, runs alongside the river connecting camp to the visitor center', 'The Narrows wading via shuttle — wade up the Virgin River into a slot canyon', 'Angels Landing permit hike — ballot required, apply 3 months ahead', 'Springdale restaurants at night — excellent farm-to-table options in a tiny Utah town'],
    whats_new: 'South Campground permanently closed for rehabilitation in 2026 — Watchman is now the only NPS canyon campground. BLM banned dispersed camping around Zion in March 2026. New Virgin Park & Ride opened March 1, 2026 with $5 shuttle to Springdale. $100/person non-resident surcharge effective January 2026.',
    best_season: [
      { season: 'Mar–May', why: 'Waterfalls running, wildflowers, fewer crowds than summer. Caterpillar season (Apr–May) actually thins competition for sites.' },
      { season: 'Oct–Nov', why: 'Fall color, ideal temperatures, no surcharge controversy, crowds down 40%.' },
    ],
    avoid_if: ['You need RV hookups (none exist)', 'You have an oversized vehicle — tunnel ban June 7, 2026', 'You need showers at the campground'],
    insider_hacks: ['F-Loop walk-in sites offer the most privacy — arrive early to claim them', 'Virgin River swimming holes within camp cool off sweltering summer afternoons', 'The pedestrian bridge to Springdale is 0.5 miles — no need to drive for dinner'],
    wildlife_alert: 'Mule deer are common throughout camp. No bear canisters required (unlike many NPS parks) but food storage rules apply. Rattlesnakes possible on trails — watch your step.',
    cell_signal: 'OK near the visitor center and Springdale. Disappears almost completely deeper in the canyon past the visitor center.',
    fire_rules: 'Campfires in designated rings only. No fires when fire restrictions are in place — check nps.gov/zion. No gathering firewood in the park.',
  },

  'rubys-inn-bryce': {
    why_its_good: 'The only campground with a direct free shuttle into Bryce Canyon National Park. Half a mile from the park entrance with 250+ sites, full hookups for large rigs, and the full Best Western resort next door. The paved bike trail running from the campground directly into Bryce means you can pedal to the hoodoos without a car. At 7,700 feet elevation, Bryce is a certified Dark Sky Park — the Milky Way is extraordinary.',
    real_issues: [
      { issue: 'RV sites are close together and some are dusty with limited shade in newer sections', solution: 'Request the older front section with mature ponderosa pine shade. Sites near the entrance tend to have more trees.' },
      { issue: 'No Good Sam, AAA, or military discounts — full price only', solution: 'Book directly through Ruby\'s website rather than third parties for best rates. Off-season (Nov–Mar) rates are significantly lower.' },
      { issue: 'Some back-in RV sewer connections are positioned awkwardly at the front of the site', solution: 'Ask for sites #39–43 specifically for full hookups with the best layout. Call ahead to confirm.' },
    ],
    what_people_say: [
      { quote: 'Location is everything. Shuttle stops at the entrance every 15 minutes — never needed the car inside the park.', source: 'Good Sam 2025', sentiment: 'love' },
      { quote: 'Premium ponderosa pine sites have a lawn, nice picnic table, fire pit. Worth the extra cost. $175 for 3 nights felt justified.', source: 'ParkAdvisor 2025', sentiment: 'love' },
      { quote: 'Very convenient but pricey for what it is. Pool is great, laundry is convenient, proximity to park is the real value.', source: 'Tripadvisor 2025', sentiment: 'tip' },
      { quote: 'Rodeo runs Wednesday through Saturday starting at 7pm — great evening entertainment. Staff are welcoming and knowledgeable.', source: 'ParkAdvisor 2025', sentiment: 'tip' },
    ],
    rare_gem: 'The nightly Bryce Canyon Astronomy Program offered through the park and visible from the campground is one of the best ranger programs in the NPS system. Bryce Canyon is one of the least light-polluted national parks in the continental US — 7,700 feet elevation and no nearby cities. The program includes telescopes and a ranger guide. Most guests are asleep by 9pm and miss it entirely.',
    not_to_miss: ['Bryce Canyon at sunrise from Sunrise Point — take the shuttle, arrive before 6am', 'The Figure-8 Loop hike through hoodoos — the best single-day trail in Bryce', 'Evening stargazing — Bryce is a certified Dark Sky Park, best in America', 'Horseback riding into the canyon from Ruby\'s activities desk', 'Kodachrome Basin State Park (24 miles) — colorful spires with almost no visitors'],
    whats_new: 'Ruby\'s completed facility upgrades to their newer section in fall 2025. North Campground inside the park is open year-round but limited in winter. Sunset Campground inside the park is reservation-only.',
    best_season: [
      { season: 'Sep–Oct', why: 'Fall colors + cooler temps + fewer crowds. Night sky darkest of the year.' },
      { season: 'May–Jun', why: 'Mild weather, everything open, before peak July–August crowds.' },
    ],
    avoid_if: ['You want a wilderness feel', 'You need Good Sam/AAA discounts (none honored)', 'You\'re visiting Nov–Mar (pool closed, limited amenities)'],
    insider_hacks: ['Sites #39–43 have the best full hookup layout', 'The paved bike trail from campground goes directly into Bryce — bring bikes', 'Shuttle is free with proof of park admission — park once at Ruby\'s and never drive inside'],
    wildlife_alert: 'Mule deer common in camp. Utah prairie dogs in the park meadows. No bears in this area.',
    cell_signal: 'Decent — Verizon and AT&T work in Bryce Canyon City. Weaker inside the park itself.',
    fire_rules: 'Fire rings at sites. High elevation means dry conditions — check Utah fire restrictions before building fires.',
  },

  'colter-bay-grand-teton': {
    why_its_good: 'Grand Teton\'s most complete camping village. Colter Bay is positioned on Jackson Lake\'s north shore with the full Teton Range as a backdrop — Mount Moran reflected in the lake at sunrise is one of the most photographed views in the American West. Unlike most national park campgrounds, everything you could need is within walking distance: grocery store, restaurant, marina, boat rentals, horseback riding, laundry, showers. It truly functions as summer camp for the whole family.',
    real_issues: [
      { issue: 'Main campground has no hookups — must book the separate Colter Bay RV Park ($72–78/night) for full hookups', solution: 'Book the RV Park (separate Recreation.gov listing) well in advance. 112 sites with full hookups including 50A.' },
      { issue: 'No generators permitted at any time — strict rule', solution: 'Plan ahead for a fully battery-powered stay or book the RV Park which has shore power.' },
      { issue: 'Some loop restrooms (particularly Loop I) reported poorly maintained', solution: 'Request sites in Loop A, B, or C. Avoid Loop I or O which get the heaviest use.' },
      { issue: 'Mosquitoes can be intense in June–early July', solution: 'DEET-based repellent, long sleeves at dawn and dusk. Bring a head net — it\'s not optional in June.' },
    ],
    what_people_say: [
      { quote: 'Loaded with wildlife. Two nights here and we saw mule deer, a badger, and a grizzly. The best campground in the Tetons, full stop.', source: 'Hipcamp Sep 2025', sentiment: 'love' },
      { quote: 'Everything is a short walk — restaurant, store, lake, marina. Stayed for one night headed to Yellowstone and liked it so much we stayed three more.', source: 'PerfectCamp Sep 2025', sentiment: 'love' },
      { quote: 'Showers cost extra at the launderette — bring quarters. Otherwise this place has genuinely everything you need inside the park.', source: 'The Dyrt Sep 2024', sentiment: 'tip' },
      { quote: 'September here: golden fall color everywhere, almost no crowds, grizzly sightings near the lake dam. Best month to visit by far.', source: 'Campendium Sep 2025', sentiment: 'tip' },
    ],
    rare_gem: 'The Jackson Lake dinner cruise departs from Colter Bay Marina and takes you to a private meal site on Elk Island in the middle of the lake with the Teton Range looming in every direction. Most campers eat at the cafeteria or cook at camp and never know the dinner cruise exists. It runs May–September and is one of the most extraordinary dining experiences in any national park.',
    not_to_miss: ['Jackson Lake dinner cruise — departs Colter Bay Marina, book at activities desk immediately', 'Swan Lake and Heron Pond Trail — easy 3-mile loop with exceptional bird and moose viewing', 'Jackson Lake Dam at dusk — most reliable moose viewing spot in the park', 'Horseback rides — depart from Colter Bay corrals, 1 and 2-hour options', 'Ranger-led Indian Arts and Culture program at the Visitor Center'],
    whats_new: 'All Grand Teton campgrounds moved to Recreation.gov reservations in 2024. Colter Bay Village marina refreshed for 2026 season. New ADA-accessible sites added to the RV Park.',
    best_season: [
      { season: 'Sep', why: 'Fall colors peak. Crowds drop 50%. Grizzlies active before hibernation. Moose sightings frequent. Fishing excellent.' },
      { season: 'Jun–Jul', why: 'Everything running. Wildflowers. Bears with cubs. All activities available.' },
    ],
    avoid_if: ['You need hookups in the main campground (none — book RV Park separately)', 'You\'re visiting after late September (campground closes)', 'You\'re mosquito-intolerant in June'],
    insider_hacks: ['Book the dinner cruise at the marina activities desk first thing — it fills within hours', 'September walk-up sites are often available even at this popular campground', 'Drive the 1-mile road to Colter Bay from the highway at dawn — moose in the willows is near-guaranteed'],
    wildlife_alert: 'GRIZZLY BEAR country. Bear spray is mandatory on all hikes — not optional. Store ALL food in bear boxes including inside tents. Bears have been seen in the campground and village. Black bears also present.',
    cell_signal: 'Limited. Verizon may work near the village. No reliable signal in the campground itself. Download everything before leaving Jackson.',
    fire_rules: 'Campfires permitted in fire rings only. No fires when restrictions posted (common in dry years). No wood gathering in the park.',
  },

  'madison-yellowstone': {
    why_its_good: 'The most strategically positioned campground in Yellowstone. Madison sits at the exact center of the park — equidistant between Old Faithful (14 miles south) and Norris Geyser Basin (14 miles north). The confluence of the Firehole and Gibbon rivers at your doorstep creates the Madison River, one of the most famous fly fishing rivers in the American West. Bison and elk graze through Madison Valley every single morning without exception.',
    real_issues: [
      { issue: 'No hookups at Madison — only Fishing Bridge has hookups inside Yellowstone (hard-sided RVs only)', solution: 'Fishing Bridge RV Park (requires hard-sided RV only — no soft-sided) for hookups. West Yellowstone gateway town has multiple full-hookup options 10 miles west.' },
      { issue: 'No camp store — no food, fuel, or supplies at Madison', solution: 'Old Faithful Village (14 miles) has a general store, fast food, and restaurant. Stock up before arriving.' },
      { issue: 'Bears — food storage strictly enforced, rangers will cite and fine you', solution: 'Everything with a scent goes in the bear box at all times, including inside your vehicle if it has a soft top. Rangers check sites.' },
    ],
    what_people_say: [
      { quote: 'Woke up at 6am and bison were grazing 50 feet from my tent in the valley. This is what camping in America should be.', source: 'The Dyrt 2025', sentiment: 'love' },
      { quote: 'Madison River brown trout fishing right from camp. Wyoming fishing license required. Best part of the whole trip.', source: 'Reddit 2025', sentiment: 'tip' },
      { quote: 'Ranger amphitheater program at night was the best I\'ve seen in any national park. Particularly great for kids.', source: 'Campendium 2025', sentiment: 'tip' },
      { quote: 'Enter before 9am or after 5pm — midday the park is a parking lot. From Madison you can be at Old Faithful before the crowds arrive.', source: 'wereintherockies.com', sentiment: 'tip' },
    ],
    rare_gem: 'The Firehole River swimming area — 2 miles south of Madison Junction — is one of the only places in Yellowstone where swimming is permitted. The water is heated by geothermal activity to a perfect 80°F in summer. It\'s free, often empty by 7am, and one of the most surreal swim spots on Earth. Most Yellowstone visitors never know it exists.',
    not_to_miss: ['Madison Valley wildlife walk at 6am — bison and elk guaranteed', 'Firehole River swimming area (2 mi south) — geothermally heated, 80°F, often empty at dawn', 'Grand Prismatic Spring (4 miles) — most vivid thermal feature in the world, best seen from the overlook trail', 'Old Faithful Upper Geyser Basin (14 mi) — arrive before 9am or after 4pm', 'Norris Geyser Basin (14 mi) — most geologically active area, often overlooked for Old Faithful'],
    whats_new: 'All Yellowstone campgrounds are now managed through Recreation.gov — Xanterra no longer handles reservations. Madison Campground fully reservable in advance for the first time in 2025.',
    best_season: [
      { season: 'May', why: 'Newborn bison and elk. Snow can still fall but fewer crowds. Most dramatic wildlife.' },
      { season: 'Sep–Oct', why: 'Elk rut. Fall color. Crowds drop. Bears feeding before hibernation near the river.' },
    ],
    avoid_if: ['You need RV hookups (none — only Fishing Bridge has them for hard-sided only)', 'You need a camp store (none at Madison)', 'You\'re visiting peak July–August without booking 6 months ahead'],
    insider_hacks: ['The Firehole swimming area is 2 miles south — best kept secret in Yellowstone', 'Enter the park before 9am or after 5pm — road congestion at Old Faithful is genuinely severe midday', 'Wyoming fishing license required for Madison River — available online before you arrive'],
    wildlife_alert: 'BISON right-of-way always. Never approach — 2,000lb animals that charge with no warning. Grizzly bears present throughout Yellowstone. Bear spray required on all backcountry hikes.',
    cell_signal: 'Essentially none inside Yellowstone. Download all maps, weather, and park info before entering any gate. This is non-negotiable.',
    fire_rules: 'Campfires in rings only. Fire restrictions common in dry summers. No firewood gathering in the park. Check nps.gov/yell for current conditions.',
  },

  'moraine-park-rmnp': {
    why_its_good: 'The elk rut at Moraine Park in late September is one of the most extraordinary free wildlife experiences in North America. Bull elk bugling — a haunting, multi-note call — echoes through the glacier-carved valley starting before 4am. Dozens of elk are in the meadow every morning. At 8,160 feet, the stars are extraordinary, the air is thin and clean, and the views of Longs Peak from certain sites are stunning. Your campground reservation also serves as your Bear Lake Corridor timed-entry permit — a significant advantage over day visitors competing for limited slots.',
    real_issues: [
      { issue: 'All the best ridge sites in B and C loops are now electric-only at $55/night', solution: 'Budget for the electric sites if you want the view. Non-electric tent sites in Loop A are $30 but in a less scenic section.' },
      { issue: 'No proper showers — solar stall only (bring your own solar bag)', solution: 'Estes Park (3 miles) has a rec center with pay showers. Many campers use dry shampoo and camp wipes for multi-night stays.' },
      { issue: 'Rude firewood vendor is a recurring complaint across many reviews', solution: 'Buy firewood at Safeway in Estes Park — significantly cheaper AND no attitude.' },
      { issue: 'Some sites are severely sloped for RVs', solution: 'Check individual site specs on Recreation.gov before booking. Many sites show the slope clearly in photos. Sites D141 and A038 are specifically mentioned as good level tent sites.' },
    ],
    what_people_say: [
      { quote: 'September elk rut — bulls bugling at 4am across the valley. Nothing in North America sounds like it. Nothing.', source: 'Reddit Sep 2025', sentiment: 'love' },
      { quote: 'D141 walk-up site: stunning views of Longs Peak and elk in the meadow below. Best campsite I\'ve ever had.', source: 'Tripadvisor 2025', sentiment: 'love' },
      { quote: 'AT&T hotspot got 60Mbps here — unheard of for a national park campground. The location and signal make this exceptional.', source: 'Campendium 2025', sentiment: 'tip' },
      { quote: 'Camping reservation is also your Bear Lake timed entry permit — saves you from the morning madness at the entrance gate.', source: 'Campendium 2026', sentiment: 'tip' },
    ],
    rare_gem: 'Winter camping at Moraine Park (November–April) is first-come, first-served with no reservation required. The campground stays open through snowfall, roads are plowed, vault toilets remain accessible. Elk are in the meadow in larger groups than summer. Essentially no other visitors. Sites cost the same but you\'re alone in a snow-covered glacial valley inside a national park. Experienced winter campers describe it as one of the best kept secrets in the NPS system.',
    not_to_miss: ['September elk rut at dawn — 4am alarm, walk to the meadow, listen to bugling bulls', 'Bear Lake and Emerald Lake trail (3 mi by shuttle) — the most visually perfect alpine lakes in the Rockies', 'Cub Lake trail (4.6 mi from campground) — wildflowers and wildlife-dense wetlands', 'Trail Ridge Road drive in summer — highest continuous paved road in the US, tundra ecosystems', 'Winter camping (Nov–Apr) — no reservations, no competition, snowy valley all to yourself'],
    whats_new: 'Moraine Park recently completed hydroseeding restoration in disturbed areas — stay off marked areas. Timed entry permits for Bear Lake Corridor included with campground reservation in 2026. Timber Creek Campground closing Aug 2026 for sewer rehab.',
    best_season: [
      { season: 'Sep', why: 'Elk rut + fall color + thinning crowds. The best single month in any Rocky Mountain campground.' },
      { season: 'Nov–Apr', why: 'Winter first-come camping — no reservation wars, snowy valley, incredible solitude.' },
    ],
    avoid_if: ['You need showers at the campground', 'You want the best sites without paying electric site premium', 'You\'re visiting peak July–August without booking 6 months ahead'],
    insider_hacks: ['Site D141 and A038 are specifically praised — try for them', 'Buy firewood at Estes Park Safeway — cheaper and no attitude from the vendor', 'Your campground reservation includes Bear Lake timed entry — huge convenience advantage'],
    wildlife_alert: 'Elk, mule deer, and black bears all present. September rutting elk are unpredictable — maintain 75-yard distance from bulls. Mountain lions present but rarely seen.',
    cell_signal: 'Surprisingly good — AT&T reportedly gets 60 Mbps. Verizon also works. Better signal than most national park campgrounds.',
    fire_rules: 'Fire rings at sites. Fire restrictions common in dry conditions. No fires in winter season (Nov–Apr). Check nps.gov/romo before building fires.',
  },

  'upper-pines-yosemite': {
    why_its_good: 'There is no more iconic camping address in America. Upper Pines puts you inside Yosemite Valley — the birthplace of American conservation — with El Capitan and Half Dome visible through your tent opening. Every world-class trail in the valley is walkable or a short free shuttle ride away. The Merced River runs alongside the campground. For anyone visiting Yosemite, camping inside the valley is dramatically superior to commuting from gateway towns — you\'re there at first light before day visitors arrive.',
    real_issues: [
      { issue: 'Sites are extremely close together — you can hear your neighbors breathing in summer', solution: 'Book weekdays (Tue–Thu) if possible — slightly less packed. Sites 8, 9, 10, 172, 208, 210, 220 are specifically praised for better positioning.' },
      { issue: 'Generator noise during allowed hours (three 2-hour slots daily)', solution: 'Request tent-only loops away from the RV section. Upper Pines has an RV-adjacent section that concentrates generator noise.' },
      { issue: 'Bear activity requires locking absolutely everything in metal bear lockers — rangers cite violations', solution: 'The rule is total. Toothpaste, sunscreen, lip balm, any snack packaging — all in the locker. Rangers will cite you. Bears have learned to open car doors in this valley.' },
      { issue: 'Reservations open on the 15th of each month at 7am PST, 5 months ahead — gone in minutes', solution: 'Set a recurring monthly alarm for 6:58am PST on the 15th. Log into Recreation.gov before 7am. Have payment info saved. Be ready for Tuesday–Thursday dates which are marginally easier.' },
      { issue: 'Closed May 26–June 8, 2026 for internal road construction', solution: 'Lower Pines and North Pines remain open during this closure. Book those instead for this date range.' },
    ],
    what_people_say: [
      { quote: 'Stayed here 15+ times. Beautiful views every time. Clean restrooms. Friendly staff. It never gets old.', source: 'PerfectCamp Jan 2026', sentiment: 'love' },
      { quote: 'Camp host Tony went out of his way for our two girls. The whole valley is your backyard. Nothing compares to waking up here.', source: 'PerfectCamp Feb 2026', sentiment: 'love' },
      { quote: 'If you\'re OK with close-quarters camping, this is perfect. People respect quiet hours, bathrooms cleaned every morning, bear boxes simple to use.', source: 'The Dyrt Jun 2025', sentiment: 'tip' },
      { quote: 'Winter camping here: fewer crowds, sites often available walk-up, Yosemite Falls running full, campfires anytime. This is how I prefer it.', source: 'PerfectCamp Jan 2026', sentiment: 'tip' },
    ],
    rare_gem: 'Yosemite Valley in winter (December–February) is a completely different experience. Upper Pines stays open, sites go first-come first-served, waterfalls run full from snowmelt, and the valley floor is often dusted with snow while the granite walls are sunlit. Campfires are allowed anytime (not just the summer 5–10pm restriction). It\'s the valley Ansel Adams photographed — essentially empty. Most people never attempt it.',
    not_to_miss: ['Half Dome via Mist Trail (16 mi, permit required via lottery) — start from the campground', 'Mist Trail to Vernal Falls (3 mi round trip) — starts 0.5 miles from camp, one of the best short hikes in America', 'Mirror Lake loop (5 mi) — walk from camp, Half Dome reflection in still morning water', 'Valley bike path (12 mi loop) — rent bikes at Curry Village, see the entire valley floor', 'Yosemite Falls trail (7.2 mi) — best in spring when falls are at full volume'],
    whats_new: 'Upper Pines closed May 26–June 8, 2026 for road construction. No advance reservation required for Yosemite day visits in 2026 (major change from 2023–2025 timed entry). $100/person non-resident surcharge effective 2026 (same as Zion).',
    best_season: [
      { season: 'Apr–May', why: 'Waterfalls at peak from snowmelt. Merced River full. Fewer crowds than summer.' },
      { season: 'Dec–Feb', why: 'Walk-up sites available. Valley essentially empty. Snow-dusted granite. Campfires anytime.' },
    ],
    avoid_if: ['You value privacy — this is not that camping experience', 'You have an RV over 35ft', 'You\'re visiting May 26–Jun 8, 2026 (road closure — book Lower Pines instead)'],
    insider_hacks: ['Book on the 15th at 7:00am PST exactly, 5 months ahead — have payment info pre-saved', 'Best sites: 8, 9, 10, 46, 172, 208, 210, 220', 'Shop in Mariposa before entry — Village Store prices are 40-50% higher', 'Rent bikes at Curry Village for the valley loop — best way to see everything'],
    wildlife_alert: 'BEARS are highly habituated to human food in Yosemite Valley. They know to look in cars and tents. Metal lockers are mandatory for everything with a scent — rangers cite violations and fine heavily. This rule exists because of decades of bear conditioning to human food.',
    cell_signal: 'Decent in the valley floor near Curry Village and the visitor center. Weakens in the campground interior. Download AllTrails maps before arrival.',
    fire_rules: 'Campfires permitted year-round in fire rings. May–September restricted to 5pm–10pm only. Charcoal fires anytime. Bears associate fire smoke with food — extinguish fires completely before sleeping.',
  },

  'cape-lookout-oregon': {
    why_its_good: 'The best combination of privacy, beach access, and facility quality on the entire Oregon coast. Cape Lookout\'s sites are separated by dense native spruce and shrubs — you genuinely cannot see your neighbors in the better loops. The Pacific Ocean beach is directly adjacent. Free hot showers are included in the nightly rate. The headland trail delivers panoramic ocean views with gray whale sightings during migration. This is the Oregon coast campground that Oregon coast regulars actually use.',
    real_issues: [
      { issue: 'D loop bathrooms are poorly maintained — mildew and aging infrastructure', solution: 'Request A, B, or upper C loop sites only. D loop is noticeably inferior to the rest of the campground.' },
      { issue: 'Some lower A and B loop sites are exposed with less natural screening', solution: 'Request upper sections of loops A, B, C for the best site separation and privacy.' },
      { issue: 'Oregon coast weather means rain is always possible, even in summer', solution: 'Pack a quality tarp and rain gear for every day regardless of forecast. The old-growth forest makes rain atmospheric rather than miserable.' },
      { issue: 'Major upgrades underway summer 2026 — some sections may be closed', solution: 'Call Oregon State Parks ahead: (800) 551-6949. Check reserveamerica.com for current closure notices.' },
    ],
    what_people_say: [
      { quote: 'Best state park on the Oregon coast. The natural separation between sites is like nothing I\'ve seen. You can barely see your neighbors.', source: 'The Dyrt Sep 2025', sentiment: 'love' },
      { quote: 'Fell asleep to the sound of waves. Free hot showers every morning. Perfect base camp for exploring the coast. Will be back every year.', source: 'The Dyrt Sep 2025', sentiment: 'love' },
      { quote: 'Stick to A, B, C loops upper sections. D loop needs work. Bathrooms in D are rough. Otherwise one of my favorite campgrounds anywhere.', source: 'The Dyrt Sep 2023', sentiment: 'tip' },
      { quote: 'Planning to return when they finish the 2026 upgrades — looks like they\'re fixing the issues. The location is too good to abandon.', source: 'The Dyrt 2025', sentiment: 'tip' },
    ],
    rare_gem: 'The Cape Lookout headland trail (5 miles round trip) thrusts out into the Pacific on a narrow forested cape with 400-foot cliffs. During gray whale migration (peak December–January and March–May), whales are spotted from the trail multiple times per day. The tip of the cape puts you over open ocean with no land visible in three directions — one of the most dramatic headland trails in the Pacific Northwest. Most campers never attempt it, assuming it\'s too long.',
    not_to_miss: ['Cape Lookout headland trail — 5 miles, 400-foot ocean cliffs, whale migration viewpoint', 'Netarts Bay kayaking — the estuary behind camp is perfect for sea kayaking and bird watching', 'Tillamook Creamery (14 mi) — free factory tour, legendary ice cream, world-famous cheese', 'Pacific City haystack rock and Pelican Pub (20 mi south) — best drive-to beach nearby', 'Cannon Beach (55 mi north) — Haystack Rock tidepool walking at low tide'],
    whats_new: 'Major campground infrastructure upgrades announced for summer 2026. State making capital improvements to bathroom facilities and road surfaces. Some loops may be temporarily closed during construction. Check Oregon State Parks website before booking.',
    best_season: [
      { season: 'Jun–Aug', why: 'Best weather. Warmest water. Fewest rain days. Highest campfire safety.' },
      { season: 'Mar–May', why: 'Gray whale migration peak. Dramatically fewer crowds. Waterfalls running full inland.' },
    ],
    avoid_if: ['You want hookups (limited availability)', 'You\'re visiting during summer 2026 D loop closures without checking ahead', 'You genuinely cannot handle rain at all'],
    insider_hacks: ['Request A, B, C upper loops specifically — D loop is notably inferior', 'Free hot showers are included — one of the few Oregon coast campgrounds where this is true', 'Tillamook Creamery is worth the 14-mile detour for lunch'],
    wildlife_alert: 'Gray whales visible from Cape Lookout trail March–May. Steller sea lions on offshore rocks. Black bears rare but possible in forest. Harbor seals in Netarts Bay.',
    cell_signal: 'Limited on Oregon coast. Verizon gets 1–2 bars near the campground entrance. Download offline maps before arriving.',
    fire_rules: 'Beach fires prohibited. Campground fire rings only. Oregon coastal fire restrictions apply — check Oregon State Parks before building fires.',
  },

  'sol-duc-olympic': {
    why_its_good: 'The only campground in America where you can soak in natural hot springs from your campsite. Sol Duc is inside Olympic National Park\'s Hoh Rainforest — the most biologically diverse temperate rainforest in North America. The trees are 500+ years old, draped in moss and ferns, and so large that multiple people can\'t link arms around them. The Sol Duc River is teal-green from glacial silt. The combination of old-growth forest, a wild salmon river, and accessible hot springs is completely unique in the NPS system.',
    real_issues: [
      { issue: 'Hot springs access costs extra (~$20–25/day) on top of camping fees', solution: 'Buy a 3-day hot springs pass at check-in for better value. Soak at 9pm when day visitors leave and pools are quiet.' },
      { issue: 'No cell signal anywhere on the Sol Duc Road — 40+ miles of dead zone', solution: 'This is non-negotiable. Download AllTrails, weather forecasts, and emergency contacts before turning onto Sol Duc Road from Highway 101.' },
      { issue: 'Only 82 sites — fills extremely quickly in summer', solution: 'Book exactly 6 months ahead on Recreation.gov at 7am PST. Weekday availability is marginally better.' },
      { issue: 'Annual rainfall is 140+ inches — rain is not occasional, it\'s the climate', solution: 'Bring a quality tarp for your cooking area and a quality rain fly. The old-growth forest makes rain atmospheric and beautiful rather than miserable — embrace it.' },
    ],
    what_people_say: [
      { quote: 'Hot springs soak at 9pm under the stars after hiking through 500-year-old trees. Nothing else like this in America.', source: 'Hipcamp 2025', sentiment: 'love' },
      { quote: 'Sol Duc Falls trail through the old-growth is the best 3-mile hike I\'ve ever done. Trees so big you can\'t believe they\'re real.', source: 'Reddit 2025', sentiment: 'love' },
      { quote: 'October: salmon spawning in the river right from camp. Bears feeding on salmon in the river. Complete wild experience.', source: 'The Dyrt 2024', sentiment: 'tip' },
      { quote: 'Rain is the Olympic Peninsula. Bring a tarp and good rain gear and the forest becomes magical, not miserable.', source: 'Campendium 2024', sentiment: 'tip' },
    ],
    rare_gem: 'October brings the salmon spawning run to the Sol Duc River. Chinook and coho salmon fight their way upstream past the campground — you can watch from camp. Black bears feed on dead salmon in the shallows. This simultaneous bear-and-salmon-and-old-growth experience in the rain happens every October and is almost completely unknown outside the Pacific Northwest camping community.',
    not_to_miss: ['Sol Duc Falls (1.6 mi round trip) — three-branched waterfall through mossy canyon, best short hike in Olympic NP', 'Hot springs at 9pm — after day visitors leave, pools quiet, stars visible', 'Hoh Rain Forest Visitor Center (50 mi) — Hall of Mosses trail, most primeval forest in the lower 48', 'Hurricane Ridge (65 mi) — subalpine meadows, Olympic Mountains panorama, deer and marmots', 'October salmon run — watch bears feed on salmon in the river from camp'],
    whats_new: 'Olympic National Park removed the wilderness permit requirement for most day hikes in 2025. Sol Duc Hot Springs Resort refreshed facilities for 2026. Recreation.gov now handles all Olympic NP campground reservations.',
    best_season: [
      { season: 'Jul–Aug', why: 'Driest months. Hot springs comfortable. All facilities open. Best weather.' },
      { season: 'Oct', why: 'Salmon run + bears + fall color + almost no other campers. The best-kept secret on the peninsula.' },
    ],
    avoid_if: ['You cannot accept paying extra for hot springs on top of camping fee', 'You need cell service for work', 'You have a rig over 35ft (narrow forest access roads)'],
    insider_hacks: ['Buy a multi-day hot springs pass at check-in — better value than daily entry', 'Soak at 9pm after day visitors leave — pools quiet, often just a few campers', 'October salmon run: watch from the bridge near camp at dawn'],
    wildlife_alert: 'Black bears are present and active — especially near the river during salmon season. Food storage rules strictly enforced. Roosevelt elk (very large) common in the campground. Spotted owls possible at night.',
    cell_signal: 'Zero. No cell service anywhere on Sol Duc Road. Download everything before leaving Highway 101.',
    fire_rules: 'Campfires permitted in rings. Olympic NP fire restrictions apply in dry summers. Rain forest is wet but fire rules still apply — check nps.gov/olym.',
  },

  'pfeiffer-big-sur': {
    why_its_good: 'Big Sur is one of the most dramatic stretches of coastline on Earth and Pfeiffer Big Sur puts you inside it rather than observing from above on Highway 1. The Big Sur River swimming hole is right inside the campground. The coastal redwoods here are not the towering giants of Muir Woods but they are ancient, mossy, and serene. You are base-camped for the most iconic coastal drive in California with Bixby Creek Bridge (5 miles), McWay Falls (10 miles), and Julia Pfeiffer Burns State Park (10 miles) all reachable without leaving the car.',
    real_issues: [
      { issue: 'Highway 1 closures from landslides can block access entirely — with no warning', solution: 'Check Caltrans quickmap.dot.ca.gov the morning you plan to arrive AND before any day trip south. Big Sur road closures are unpredictable and can strand you.' },
      { issue: 'RV size strictly limited to 32ft due to narrow campground access roads', solution: 'If your rig is larger, stay at Kirk Creek Campground (30 miles south) which accommodates larger rigs but has no amenities.' },
      { issue: 'Books months ahead for summer and holiday weekends', solution: 'Book through ReserveCalifornia.com. Weekday spots in shoulder season (Apr–May, Sep–Oct) have better availability.' },
    ],
    what_people_say: [
      { quote: 'Woke up to redwood-filtered light, walked to the river swimming hole in 5 minutes, drove to Bixby Bridge for sunset. Perfect day.', source: 'The Dyrt 2025', sentiment: 'love' },
      { quote: 'This is why people live in California. The campground is beautiful but the road out of it is one of the most dramatic drives in the world.', source: 'Reddit 2025', sentiment: 'love' },
      { quote: 'Always check Caltrans before heading south — Highway 1 closures happen with no warning and can trap you.', source: 'Campendium 2025', sentiment: 'warn' },
      { quote: 'California condors soar overhead regularly. The first time you see a 10-foot wingspan bird over a redwood forest you\'ll understand why this place is special.', source: 'The Dyrt 2024', sentiment: 'love' },
    ],
    rare_gem: 'Pfeiffer Beach — 2 miles from the campground via a narrow road — has purple sand from manganese garnet deposits washing down from the hills. A natural rock arch called Keyhole Rock perfectly frames the setting sun in late November and December. It costs nothing to visit. Most campers never find it because the access road (Sycamore Canyon Rd) is unmarked — just a sharp right turn with a small brown sign.',
    not_to_miss: ['Pfeiffer Beach (2 mi) — purple sand, keyhole rock sunset arch, usually uncrowded', 'McWay Falls (10 mi south) — only waterfall in California falling onto a beach', 'Bixby Creek Bridge (5 mi north) — most photographed bridge on the Pacific Coast', 'Big Sur River swimming hole — inside the campground, perfect on hot days', 'California condor spotting from Pfeiffer Ridge trail — one of the most reliable spots in their range'],
    whats_new: 'Highway 1 south of Big Sur fully reopened in 2024 after years of landslide-related closures. ReserveCalifornia.com now handles all Pfeiffer Big Sur reservations. The Big Sur Lodge restaurant inside the campground has new management for 2026.',
    best_season: [
      { season: 'Apr–May', why: 'Waterfalls running full. Wildflowers. Before summer crowds. Condors active.' },
      { season: 'Sep–Oct', why: 'Summer crowds gone. Highway 1 typically open. Fall light is extraordinary for photography.' },
    ],
    avoid_if: ['You have an RV over 32ft', 'You need hookups', 'You\'re visiting without checking Caltrans highway status'],
    insider_hacks: ['Pfeiffer Beach: unmarked turn onto Sycamore Canyon Rd — look for the small brown sign', 'McWay Falls viewpoint requires no hike — pull-out parking on Highway 1 side', 'Buy groceries in Carmel (30 mi north) — Big Sur has only a small general store at premium prices'],
    wildlife_alert: 'California condors soar over the ridgeline — wingspan up to 10 feet, unmistakable. Black bears present — bear boxes mandatory. Rattlesnakes common on dry sunny trails. Mountain lions present but rarely seen.',
    cell_signal: 'Intermittent. Verizon gets 1-2 bars in parts of the campground. Highway 1 has dead zones for miles. Download offline maps before entering Big Sur.',
    fire_rules: 'California standard fire rules. Campfire rings at most sites. No fires during Red Flag warnings — check CAL FIRE. Bears associate smoke with food — extinguish fires before sleeping.',
  },

  'apgar-glacier': {
    why_its_good: 'Glacier National Park is the most visually dramatic national park in the continental US and Apgar is its best-positioned campground. Lake McDonald\'s shore — famous for its kaleidoscopic multi-colored pebbles photographed by millions — is a 5-minute walk from every site. Going-to-the-Sun Road west entrance is 1 mile away. The Apgar Village cluster of visitor center, general store, pizza shop, and boat rentals makes it the most self-contained major campground in the park. And this is prime grizzly country.',
    real_issues: [
      { issue: 'Going-to-the-Sun Road requires a separate vehicle permit in peak season (late May–Sept, 7am–3pm)', solution: 'Book the vehicle permit ($2 reservation fee) through Recreation.gov when booking camping. The permit window is 7am–3pm. Arrive before 7am or after 3pm to enter without a permit.' },
      { issue: 'Mosquitoes in June–early July are extremely intense', solution: 'DEET repellent is mandatory. Bring a head net. Long sleeves and pants at dawn and dusk. This is not an exaggeration — June mosquitoes in Glacier are notorious.' },
      { issue: 'No hookups — dry camping only', solution: 'Whitefish, MT (25 miles) has private campgrounds with full hookups. West Glacier town (2 miles) has limited services.' },
    ],
    what_people_say: [
      { quote: 'Lake McDonald pebble shore at sunrise. Teal water, multi-colored rocks, mountains reflected. Nothing in the lower 48 looks like this.', source: 'The Dyrt 2025', sentiment: 'love' },
      { quote: 'Hiked Avalanche Lake trail from the campground. Completely silent glacial lake inside a cedar grove. One of the best hikes of my life.', source: 'Reddit 2025', sentiment: 'love' },
      { quote: 'Grizzly bear seen near the Apgar visitor center two days running. Bear spray is mandatory — not optional here.', source: 'Campendium 2025', sentiment: 'warn' },
      { quote: 'Logan Pass wildflowers in July are extraordinary. Book Going-to-the-Sun vehicle permit when you book camping — they fill fast.', source: 'The Dyrt Jul 2025', sentiment: 'tip' },
    ],
    rare_gem: 'The colored pebbles of Lake McDonald\'s shoreline look like scattered stained glass — red, green, purple, blue, and orange stones from different geological formations polished by glacial meltwater over thousands of years. The colors are most vivid when wet, making post-rain mornings the best photography opportunity. The north shore of the lake, accessible by boat or a 5-mile drive, has the densest concentration of colored stones and almost no visitors.',
    not_to_miss: ['Lake McDonald north shore pebble photography at dawn after rain', 'Avalanche Lake trail (6 mi round trip) — cedar grove and glacially carved lake, one of the best hikes in the park', 'Going-to-the-Sun Road drive to Logan Pass — highest road in the Rockies, open mid-June', 'Logan Pass wildflowers in July — mountain goats and bighorn sheep year-round', 'Lake McDonald boat tour from Apgar Village marina'],
    whats_new: 'Glacier NP vehicle permits required through recreation.gov for peak season 2026. New shuttle system expanded with more frequent service between Apgar and St. Mary Visitor Center. Bear activity reports updated in real-time on the Glacier NP app.',
    best_season: [
      { season: 'Jul', why: 'Logan Pass open. Wildflowers peak. Beargrass bloom. Mountain goats with kids. All trails snow-free.' },
      { season: 'Sep', why: 'Crowds drop 40%. No vehicle permits needed after Labor Day. Fall color begins. Bears feeding before hibernation.' },
    ],
    avoid_if: ['You need hookups', 'You\'re going without bear spray (not optional in Glacier)', 'You\'re visiting late May–early June without a mosquito strategy'],
    insider_hacks: ['Book Going-to-the-Sun vehicle permits simultaneously with campground reservation — they have the same demand', 'North shore of Lake McDonald for best pebble photography — drive or take the boat', 'Enter the park before 7am or after 3pm to avoid the vehicle permit requirement window'],
    wildlife_alert: 'HIGHEST grizzly bear density in the lower 48. Bear spray is absolutely required on every hike — no exceptions. Both grizzly and black bears present. Mountain lions, wolves, and wolverines all present. This is true wilderness.',
    cell_signal: 'Limited. West Glacier town entrance area has decent signal. Inside the park deteriorates rapidly. Apgar Village has minimal signal. Download everything before entering.',
    fire_rules: 'Campfires in designated rings only. Fire restrictions common in summer — Glacier is a dry fire-risk area. Check nps.gov/glac for current conditions.',
  },

  'mather-grand-canyon': {
    why_its_good: 'One mile from the edge of one of the Seven Natural Wonders of the World. From Mather Campground you can walk to Mather Point at sunrise and stand at the rim of a canyon 1 mile deep and 18 miles wide. The free South Rim shuttle eliminates all the parking problems that plague day visitors. At 6,860 feet elevation, the South Rim is 30°F cooler than the canyon bottom in summer. The village around Mather — restaurants, the historic El Tovar Hotel, Yavapai Geology Museum, general store — rivals any campground setting in the NPS system.',
    real_issues: [
      { issue: 'No hookups and only 30ft RV length limit', solution: 'Trailer Village (adjacent to Mather) has full hookups and accepts larger rigs — book separately through Xanterra.' },
      { issue: 'Extremely hot and dry in summer — dehydration is a serious risk', solution: 'Carry and drink 1 liter of water per hour while hiking. Summer temperatures at the rim top 90°F; at the bottom they exceed 110°F. Start inner canyon hikes at dawn only.' },
      { issue: 'Books very fast for summer — 6-month advance booking required', solution: 'December–February has walk-up availability, magical snow, and cold but manageable temperatures. Shoulder season (March, October, November) is best for combining availability with good weather.' },
    ],
    what_people_say: [
      { quote: 'Walked to Mather Point at 5am. Sunrise light on the canyon walls — orange, red, purple, gold. No words. Book this campground.', source: 'The Dyrt 2025', sentiment: 'love' },
      { quote: 'Mule deer walked through the campground every morning. California condors soar overhead. Free shuttle to every viewpoint. This is the Grand Canyon done right.', source: 'Campendium 2025', sentiment: 'love' },
      { quote: 'El Tovar dinner reservation is worth it — historic 1905 lodge, canyon rim dining. Book weeks ahead.', source: 'Tripadvisor 2025', sentiment: 'tip' },
      { quote: 'Winter camping here: snow on the canyon rim, almost no other visitors, campfires at night. The Grand Canyon without the crowds is a different place.', source: 'Reddit Dec 2024', sentiment: 'tip' },
    ],
    rare_gem: 'The Bright Angel Trail at dawn — before 7am — is completely different from the crowded midday experience. Mather Campground is the only accommodation that puts you close enough to start hiking before 6am. You can reach Indian Garden (now Havasupai Gardens) and be back at camp for breakfast before most day visitors have parked their cars. The morning light on the Redwall Limestone layer is one of the most extraordinary natural light shows on Earth.',
    not_to_miss: ['Mather Point at sunrise — walk from camp, arrive 30 minutes before sunrise', 'Bright Angel Trail at dawn — descend before day visitors arrive for the best light', 'El Tovar Hotel dinner (0.5 mi) — 1905 historic lodge, rim-adjacent dining, book weeks ahead', 'Yavapai Geology Museum (1 mi) — best geology exhibit in the NPS system, explains what you\'re looking at', 'Desert View Watchtower (25 mi east) — Mary Colter masterpiece with Colorado River views'],
    whats_new: 'Grand Canyon NP ended its timed-entry day permit system in 2025 — day visitors no longer need advance permits to enter. $100/person non-resident surcharge effective 2026 (same as Zion and Yosemite). Bright Angel trailhead area refreshed with new shade structures.',
    best_season: [
      { season: 'Mar & Oct', why: 'Ideal rim temperatures. Inner canyon hikes possible. Crowds 40% lower than summer.' },
      { season: 'Dec–Feb', why: 'Walk-up sites available. Snow on the rim. Canyon in winter light. Almost no competition for views.' },
    ],
    avoid_if: ['You need hookups or have a rig over 30ft (book Trailer Village instead)', 'You plan inner canyon hikes in summer midday (heat kills — go at dawn only)', 'You\'re booking less than 6 months ahead for July–August'],
    insider_hacks: ['Trailer Village (adjacent) has full hookups for larger rigs — book through Xanterra separately', 'Start Bright Angel hike at 5:30am — you\'ll descend into the canyon alone', 'El Tovar dinner requires advance reservation — book the day you book camping'],
    wildlife_alert: 'California condors (10-foot wingspan) soar over the rim daily — look up. Mule deer and elk common in the village and campground. Rattlesnakes on inner canyon trails in summer — most active at dawn and dusk. Ringtail cats in the campground at night.',
    cell_signal: 'Decent on the South Rim near the visitor center and village. Weakens in the campground. No signal in the canyon — download emergency contacts and maps before descending.',
    fire_rules: 'Fire rings at sites. No fires during periods of high fire danger — check nps.gov/grca. Fire grates elevated for comfort. Extinguish completely before sleeping.',
  },

  'washoe-lake-state-park': {
    why_its_good: 'Washoe Lake State Park delivers something almost no campground near Reno can match: genuine wildness without a long drive. Free-roaming wild mustangs visit the lakeside at dawn, bald eagles fish the shallows, and white pelicans cruise overhead in formation. The 49-site campground frames three mountain ranges — Sierra Nevada to the west, Carson Range to the south, Virginia Mountains to the east. Loop A has water and electric hookups for RVs up to 45ft. Loop B is spacious dry camping with real privacy between sites. It sits exactly between Reno and Carson City, so you get wilderness mornings and town dinners without effort.',
    real_issues: [
      { issue: 'Washoe Lake water quality varies significantly by year', solution: 'In drought years the lake can drop to a shallow mudflat and develop algae blooms. Check Nevada State Parks for current swim/paddle advisories before planning water activities.' },
      { issue: 'Loop B showers are push-button timed with low pressure', solution: 'Bring quarters and lower expectations. The showers work but require pushing the button every 15–20 seconds. They\'re better than nothing after a dusty day of birding.' },
      { issue: 'Horse manure on trails is an ongoing complaint', solution: 'The equestrian facilities are heavily used. Stick to the non-equestrian hiking trails and wear closed-toe shoes on all park paths.' },
      { issue: 'No reservations for some sites — fills on summer holiday weekends', solution: 'Arrive Thursday by noon for a weekend stay. Mid-week in summer is reliably open. Loop A reservable sites book out faster than walk-in sites.' },
    ],
    what_people_say: [
      { quote: 'Woke up to three wild mustangs grazing 50 feet from our tent at sunrise. Best morning of the whole road trip.', source: 'Campendium 2025', sentiment: 'love' },
      { quote: 'Bald eagles fishing the lake, white pelicans landing in formation, osprey diving. Did not expect this level of birding 30 minutes from Reno.', source: 'The Dyrt 2025', sentiment: 'love' },
      { quote: 'Site 7 Loop A — pull-through with water and electric for $32.50. Clean bathrooms, great views, friendly host. Way better than any RV park in Reno proper.', source: 'Campendium 2025', sentiment: 'love' },
      { quote: 'The showers are push-button style and kind of annoying. Worth dealing with for everything else this park offers.', source: 'Tripadvisor 2025', sentiment: 'warn' },
      { quote: 'Dead Man\'s Trail leads up to a gazebo with a view of the entire valley. Worth the 45-minute climb. You can see Reno, Carson City, and Lake Tahoe on a clear day.', source: 'The Dyrt 2024', sentiment: 'tip' },
    ],
    rare_gem: 'Little Washoe Lake — the smaller lake at the southern end of the park — is almost always empty of other visitors and has the best mountain reflections in the entire park at sunrise. The main campground crowds go to Big Washoe, but Little Washoe offers ice skating in winter (when the lake freezes), exceptional photography, and a completely different mood. The ice is thin and unpredictable — local knowledge only, never alone.',
    not_to_miss: ['Wild horse dawn viewing — walk to the lake edge before 7am', 'Dead Man\'s Trail to the gazebo overlook — views of three mountain ranges and both cities', 'Bowers Mansion (5 mi) — Nevada\'s most impressive 1860s Victorian estate, free grounds', 'Virginia City (20 mi) — America\'s best-preserved mining boomtown, free self-guided walking', '18-hole disc golf course — free, accessible from the Maze parking lot'],
    whats_new: 'Washoe Lake levels were healthy in 2025–2026 following above-average Sierra snowpack. Loop A hookup sites upgraded with improved electrical pedestals. Equestrian group area now reservable through Reserve Nevada online platform.',
    best_season: [
      { season: 'Apr & May', why: 'Wildflowers, migrating birds, mustang foals born in spring. Crowds minimal. Lake levels typically high from snowmelt.' },
      { season: 'Sep & Oct', why: 'Best temperatures. Half sites open for first-come. Fall colors in nearby Davis Creek canyon. Bird migration peaks.' },
    ],
    avoid_if: ['You need full hookups in Loop B — only Loop A has utilities', 'You\'re planning water sports in a low-snow year — check lake levels first (can become an algae mudflat)', 'You need a premium shower experience — bring expectations for basic facilities'],
    insider_hacks: ['Loop A Site 7 is a pull-through with mountain views on three sides — request it specifically', 'Arrive before 11am on summer Saturdays to snag first-come Loop B sites', 'Download offline maps before arrival — cell signal is patchy throughout the park', 'The disc golf course is genuinely good and completely free — check the Maze parking lot access'],
    wildlife_alert: 'Wild mustangs are habituated to people but remain wild — never approach, feed, or block their path. They can kick and bite. Keep dogs leashed at all times; the horses react defensively to dogs. Rattlesnakes active in warm months on rocky trails and sagebrush areas. Bald eagles are sensitive to disturbance near the lake — observe from distance.',
    cell_signal: 'Verizon and AT&T have 4G/5G confirmed throughout the park. T-Mobile works in most areas. Signal stronger near the park entrance, patchier at the northern lake edge.',
    fire_rules: 'Campfires permitted in designated fire rings only. Fire restrictions imposed during Red Flag Warnings — check nevadafireinfo.org before arrival. Firewood for sale at the park entrance station.',
  },

  'gold-ranch-rv-verdi': {
    why_its_good: 'Gold Ranch Casino & RV Resort solves the single biggest problem with camping near Reno: there isn\'t a good full-hookup RV resort close to the city. Gold Ranch in Verdi fills that gap with 105 paved, full-hookup sites (30/50A), 68 pull-throughs handling rigs up to 75ft, and a casino complex with restaurant, Starbucks, mini-mart, and gas station steps away. The Sierra Nevada rises immediately to the west, with a genuine hiking trail leaving from the park into the foothills. Pool and hot tub on-site. Clean facilities with consistent reports of friendly staff. Twelve miles from Reno, thirty from Lake Tahoe — the ideal I-80 base camp or stopover.',
    real_issues: [
      { issue: 'Highway noise from I-80 on perimeter sites', solution: 'Request interior sites away from the freeway side when booking. The central sites and tree-screened back rows are significantly quieter.' },
      { issue: 'Not a wilderness or nature-focused camping experience', solution: 'This is a casino RV resort — it\'s comfortable, convenient, and well-maintained but not rustic. Set expectations accordingly. For nature, drive 30 minutes to Lake Tahoe or Washoe Lake.' },
      { issue: 'Sprinkler systems have surprised campers in early morning hours', solution: 'Ask at check-in whether your assigned site\'s sprinklers run on a schedule. Moving to an alternate site if needed is easy — park has 105 sites and is rarely fully booked midweek.' },
    ],
    what_people_say: [
      { quote: 'Staff let us pull in at 11pm with our 43-foot fifth wheel and truck. Spotlights on, friendly face at the gate, easy pull-through. This place gets it.', source: 'Yelp 2025', sentiment: 'love' },
      { quote: 'Casino has a Starbucks, a restaurant, a mini-mart and a gas station. After a long drive from the Bay Area, this was exactly what we needed before pushing on to Reno.', source: 'Google 2025', sentiment: 'love' },
      { quote: 'Hiking trail from the park goes into real Sierra foothills — not just a walking path. Took the dogs and hit it every morning.', source: 'RVLife 2025', sentiment: 'love' },
      { quote: 'I-80 noise is real if you get a perimeter site. Ask for an interior site — night and day difference.', source: 'Campendium 2024', sentiment: 'warn' },
      { quote: 'Sign up for the casino player card at check-in — gets you food comps. Saved $20 on dinner without even gambling.', source: 'The Dyrt 2025', sentiment: 'tip' },
    ],
    rare_gem: 'Verdi itself — the tiny Nevada border town the resort sits in — has a local distillery (Verdi Local Distillery) and a genuine historic downtown that most I-80 travelers blow past without stopping. The Von Schmidt Monument Historic Park marks the original California-Nevada border established in 1872. It\'s a 10-minute walk from the campground and one of the most overlooked historical markers in the West.',
    not_to_miss: ['Sierra Nevada foothills hike — trail starts from the RV park, goes into real mountains', 'Casino player card sign-up at check-in — food comps worth $15–25 for most stays', 'Von Schmidt Monument Historic Park — California-Nevada original border marker, 10 min walk', 'Verdi Local Distillery — small-batch Nevada spirits, 2 minutes from the park'],
    whats_new: 'Gold Ranch completed restroom renovations in 2025. New pool heater installed — pool now reliably warm season-round. Expanded pull-through pad lengths to accommodate more fifth-wheel and toy-hauler combos.',
    best_season: [
      { season: 'Year-round', why: 'Full hookups and paved sites make this a genuine four-season resort. Summer fills faster but never truly crowded. Winter has cold nights but clear mountain views and zero competition for sites.' },
      { season: 'Sep & Oct', why: 'Perfect shoulder season temperatures. Fall colors in the Sierra visible from the park. Tahoe day trips without summer traffic. Sites wide open midweek.' },
    ],
    avoid_if: ['You want a wilderness or nature-forward camping experience — this is a casino resort', 'You\'re towing a trailer under 30ft and want rustic camping — better options at Washoe Lake or Davis Creek', 'You\'re sensitive to any highway noise — I-80 is adjacent'],
    insider_hacks: ['Call ahead to request an interior non-freeway-adjacent site — staff are accommodating', 'Gas station prices are convenient but not always the cheapest — check GasBuddy for Reno prices first', 'Pool and hot tub are open until 10pm — evening soak after a Tahoe day is the move', 'Casino comps work even on small slot plays — $5 in, $15 in food credit is common'],
    wildlife_alert: null,
    cell_signal: 'Excellent — all major carriers have strong 4G/5G at this location on the I-80 corridor. WiFi also included at every site. One of the best-connected campgrounds in Nevada.',
    fire_rules: 'No open fires. Charcoal grills and propane only at sites. Nevada fire regulations apply — no wood fires on the property.',
  },

  'south-campground-zion': {
    why_its_good: 'Best location in Zion — shuttle stop two minutes away means you’re first at Angels Landing and The Narrows before the crowds arrive. Sandstone cliffs glow orange at dusk from inside the campground itself.',
    real_issues: [
      { issue: 'Sells out in under 60 seconds at the 6-month mark', solution: 'Set a Recreation.gov cancellation alert — people cancel constantly. Also check 2-week availability windows.' },
      { issue: 'Summer heat reaches 105°F in the canyon', solution: 'Hike before 10am or after 4pm. Narrows is cooler — wade the river mid-day.' },
      { issue: '27ft rig limit strictly enforced', solution: 'Watchman Campground (1 mile south) accepts rigs up to 40ft with electric hookups.' },
    ],
    what_people_say: [
      { quote: 'Woke up and the canyon walls were glowing orange. Nothing prepares you for it.', source: 'Google', sentiment: 'love' },
      { quote: 'First shuttle at 6am — we were at Angels Landing before anyone else. Life-changing hike.', source: 'Campendium', sentiment: 'love' },
      { quote: 'Summer heat is no joke. Narrows was the only comfortable place at noon.', source: 'The Dyrt', sentiment: 'warn' },
    ],
    rare_gem: 'The Canyon Overlook Trail (1.2 miles) at the east entrance tunnel — most visitors skip it because it’s not on the shuttle. One of the best views in Zion with a fraction of the foot traffic.',
    not_to_miss: ['Angels Landing sunrise run', 'Narrows bottom-up hike', 'Canyon Overlook Trail at dusk', 'Emerald Pools on a weekday morning'],
    whats_new: '2025: Timed entry permits now required for the main canyon road (April–October) — book via Recreation.gov separately from your campsite. Shuttle free with permit.',
    best_season: [
      { season: 'Mar–May', why: 'Wildflowers, comfortable temps (60–80°F), fewer crowds. Spring runoff makes the Narrows powerful but manageable.' },
      { season: 'Sep–Nov', why: 'Best weather, fall color on the cottonwoods, and significantly fewer crowds than summer.' },
    ],
    avoid_if: ['You need hookups (none available)', 'You have a rig over 27ft', 'You want to camp without a reservation 6 months out'],
    insider_hacks: [
      'Watchman Campground 1 mile south has electric hookups for larger rigs',
      'Book Narrows water shoes from Zion Adventure Company in Springdale — much better than hiking boots',
      'The free town shuttle runs between Springdale shops and the park entrance',
    ],
    wildlife_alert: 'Ringtail cats frequent the campsites at night — store food and scented items in the bear boxes provided. Rattlesnakes possible on rocky trails.',
    cell_signal: 'Limited inside Zion Canyon. Verizon and T-Mobile get 1–2 bars at the campground. AT&T weaker. WiFi not available. Download offline maps before entering.',
    fire_rules: 'Campfires allowed in designated fire rings only when not under fire restrictions. Restrictions common June–September. Check nps.gov/zion day-of.',
  },

  'blackwoods-acadia': {
    why_its_good: 'Half a mile from the Atlantic Ocean in dense Maine spruce-fir forest. Bike to Sand Beach on the carriage roads, drive Cadillac Mountain for the first sunrise in America, and eat lobster rolls in Bar Harbor — all within 6 miles of camp.',
    real_issues: [
      { issue: 'Fog and rain common even in summer', solution: 'Pack rain layers for every hike. Fog often burns off by 10am. The forest smells incredible in the mist.' },
      { issue: 'Bar Harbor crowds July–August are intense', solution: 'Visit Island Explorer bus stops — park and ride from campground. Or bike the carriage roads and skip town entirely.' },
      { issue: 'No hookups, 35ft max', solution: 'Quietside Campground in Southwest Harbor has hookups and less crowding.' },
    ],
    what_people_say: [
      { quote: 'Biked the carriage roads for three days. Best cycling in any national park, full stop.', source: 'Campendium', sentiment: 'love' },
      { quote: 'Cadillac sunrise with pink fog below us. Worth every dollar and every mile.', source: 'Google', sentiment: 'love' },
      { quote: 'September — crowds gone, foliage starting, perfect temps. Book it.', source: 'The Dyrt', sentiment: 'tip' },
    ],
    rare_gem: 'The Beehive Trail — exposed iron rung ladder climb to a 360° view of Frenchman Bay. Only 1.6 miles but feels like a Via Ferrata. Go on a weekday morning before 8am.',
    not_to_miss: ['Cadillac Mountain sunrise (reservation required)', 'Carriage road bike loop', 'Jordan Pond House tea and popovers', 'Thunder Hole at high tide'],
    whats_new: '2025: Cadillac Mountain sunrise reservations expanded to April 15–Oct 31. Book weeks in advance. Evening reservations also available and often easier to get.',
    best_season: [
      { season: 'Jun', why: 'Before summer crowds. Lupine wildflowers along the coast. Perfect 60–70°F temps.' },
      { season: 'Sep–Oct', why: 'Fall foliage, empty trails, best coastal light for photography. October peak color.' },
    ],
    avoid_if: ['You want hookups', 'You hate fog and rain', 'You’re coming in peak July–August without reservations 6 months out'],
    insider_hacks: [
      'Island Explorer bus is free with park pass — skip driving and parking entirely',
      'Eagle Lake carriage loop (6 miles) is the best flat ride, perfect for families',
      'MDI Ice Cream in Bar Harbor: best scoop on the East Coast. Get the wild blueberry.',
    ],
    wildlife_alert: 'Deer, fox, and the occasional black bear near the campground. Store food properly. Ticks are common in the forest — check daily.',
    cell_signal: 'Weak inside the campground itself — 1 bar AT&T, better Verizon. Bar Harbor has full coverage. Download offline maps for trails.',
    fire_rules: 'Campfires in fire rings only. Wood fires allowed unless fire restrictions active. Check nps.gov/acad for current restrictions. Firewood available at camp store.',
  },

  'elkmont-smoky-mountains': {
    why_its_good: 'The iconic Smoky Mountains campground. Little River runs through it, fireflies pulse in synchrony in late May, and you’re surrounded by the most biodiverse forest east of the Mississippi. No entry fee makes it one of the last free national parks.',
    real_issues: [
      { issue: 'Synchronous firefly lottery is intensely competitive', solution: 'Apply in April for late May dates. Check for cancellations daily in the weeks before.' },
      { issue: 'Black bears are frequent campground visitors', solution: 'Use the bear boxes provided — no exceptions. NEVER leave food in your car. Rangers are strict.' },
      { issue: 'Summer humidity and 90°F heat', solution: 'Hike early, swim at Abrams Creek or Little River mid-day. Higher elevation trails (Alum Cave) are 10°F cooler.' },
    ],
    what_people_say: [
      { quote: 'Firefly show at dusk — hundreds of them blinking in unison across the whole meadow. We were speechless.', source: 'The Dyrt', sentiment: 'love' },
      { quote: 'October foliage peak. Every color you can imagine. Most beautiful campground I’ve ever been to.', source: 'Campendium', sentiment: 'love' },
      { quote: 'Bear came into camp at 3am. Put your food away. Park rules exist for a reason.', source: 'Google', sentiment: 'warn' },
    ],
    rare_gem: 'The abandoned Elkmont historic district — ghost town of 1920s vacation cabins hidden in the forest 0.5 miles from the campground. Completely free and almost no one goes.',
    not_to_miss: ['Synchronous firefly display (late May)', 'Alum Cave Trail to Mt LeConte', 'Little River swimming holes', 'Cades Cove wildlife drive at dawn'],
    whats_new: '2026: Timed entry required for Cades Cove (May–October). Laurel Falls trail paved — accessible year-round. New backcountry permit system launched.',
    best_season: [
      { season: 'Late May', why: 'Synchronous fireflies — a once-in-a-lifetime natural event. Lottery required.' },
      { season: 'Oct', why: 'Peak fall color. The Smokies have the best autumn foliage in the Appalachians.' },
    ],
    avoid_if: ['You need hookups (none)', 'You won’t follow bear safety rules', 'You want solitude in July–August'],
    insider_hacks: [
      'Sites A1–A9 are directly on the Little River — request these specifically',
      'Hike Alum Cave at 6am — you’ll be alone until the crowds arrive at 9am',
      'The Abrams Falls swimming hole (Cades Cove, 4.5 mile round trip) is the best swim in the park',
    ],
    wildlife_alert: 'Black bears are actively managed in the campground — bear boxes mandatory. Wild hogs also present on some trails. Copperheads and timber rattlesnakes in rocky areas. Yellow jackets active August–October.',
    cell_signal: 'Poor throughout the park. Verizon 1 bar near the campground entrance. AT&T and T-Mobile unreliable. Download Gaia GPS or AllTrails maps offline before arrival.',
    fire_rules: 'Campfires in fire rings only. Wood fires common but check for seasonal restrictions. Smoky Mountains has some of the strictest fire management in the NPS system. Firewood sold at camp store.',
  },
  'assateague-island-oceanside': {
    why_its_good: 'The only campground in the US where wild horses roam through your site and ocean waves put you to sleep. Assateague offers an experience impossible anywhere else — primitive island camping on a living barrier island with genuine wildlife.',
    real_issues: [
      { issue: 'Biting insects (greenhead flies, mosquitoes) are severe June–August', solution: 'Use strong DEET, long sleeves at dusk. Off-season (Sept–May) is dramatically more comfortable.' },
      { issue: 'Wild ponies steal food and damage gear', solution: 'Use hard-sided coolers only. Never soft bags or food left out. Ponies are surprisingly fast and aggressive about food.' },
      { issue: 'No shade at oceanside sites', solution: 'Bring a sun shelter/beach canopy. Sites are open beach — zero tree cover.' },
    ],
    what_people_say: [
      { quote: 'Woke up with a wild pony literally standing over our tent. Nothing prepares you for that.', source: 'Campendium', sentiment: 'love' },
      { quote: 'The greenhead flies in July are absolutely vicious. Go in September instead.', source: 'The Dyrt', sentiment: 'warn' },
      { quote: 'Best sunrise of my life. East-facing beach, nobody around, coffee by the surf. Perfect.', source: 'Google', sentiment: 'love' },
    ],
    rare_gem: 'The bayside sites have warmer, calmer water than the ocean side — great for kayaking and are quieter. Almost nobody books them over the oceanside spots.',
    not_to_miss: ['Sunrise from your tent (east-facing beach)', 'Wild pony spotting at dawn', 'Swimming in the Atlantic', 'Night sky over the ocean'],
    whats_new: '2026: New solar-powered shower facilities installed. Beach restoration project near site 75–80 — some minor disruption possible.',
    best_season: [
      { season: 'May', why: 'Pony foaling season, mild temps, minimal insects.' },
      { season: 'Sep–Oct', why: 'Best weather, insects mostly gone, uncrowded, ponies active.' },
    ],
    avoid_if: ['You hate insects (summer)', 'You need hookups', 'You need shade', 'You can’t resist feeding wildlife'],
    insider_hacks: [
      'Sites 1–15 are closest to the ocean — request these specifically when booking',
      'Arrive with more water than you think you need — faucets can be unreliable',
      'The Pony Swim from Chincoteague happens in late July — spectacular but extremely crowded',
    ],
    wildlife_alert: 'Wild ponies are dangerous — do not approach, feed, or pet them. They bite and kick. Greenhead flies peak July–August. Jellyfish common in the surf July–September.',
    cell_signal: 'Verizon and AT&T get 2–3 bars in most of the campground. T-Mobile weak. Download maps offline — island GPS can be inconsistent.',
    fire_rules: 'Campfires permitted in designated fire rings only. No fires on the beach. Firewood available at visitor center. Campfires prohibited during high fire danger periods.',
  },

  'mazama-crater-lake': {
    why_its_good: 'Crater Lake holds water of such impossible blue that first-time visitors genuinely stop and stare in disbelief. At 1,943 feet deep, it’s the deepest lake in the US and the water filters itself into perfect clarity. The caldera walls rise 2,000 feet above the surface. Nothing looks real.',
    real_issues: [
      { issue: 'Short season — roads closed by snow October through June most years', solution: 'Visit July–September. Check NPS road status at nps.gov/crla before departure — late spring closures happen.' },
      { issue: 'Cleetwood Cove is the ONLY water access — 1-mile steep trail with 700ft elevation gain back up', solution: 'Start early, bring water. The swim is worth the climb but it’s strenuous going back up.' },
      { issue: 'Campground is 3 miles below the Rim — no lake views from camp', solution: 'Drive to Rim Village (5 min) for sunrise/sunset views. Crater Lake’s rim is the attraction, not the campground itself.' },
    ],
    what_people_say: [
      { quote: 'I have camped in 38 states. Nothing has made me stop the car and cry from sheer beauty like Crater Lake.', source: 'Campendium', sentiment: 'love' },
      { quote: 'July 4th at Rim Village is spectacular — the fireworks reflect off the lake. Book 6 months out to the day.', source: 'The Dyrt', sentiment: 'tip' },
      { quote: 'Wizard Island boat tours are worth every dollar but book immediately — gone in minutes when reservations open.', source: 'Google', sentiment: 'warn' },
    ],
    rare_gem: 'The Pinnacles — a canyon of volcanic spires 10 miles east of camp, rarely visited and genuinely eerie. Most visitors never find it.',
    not_to_miss: ['Sunrise at Rim Village', 'Cleetwood Cove swim', 'Wizard Island boat tour', 'The Pinnacles canyon', 'Pacific Crest Trail section'],
    whats_new: '2026: Rim Drive vehicle reservation system continues. New interpretive center near Mazama Village. Wizard Island boat tours expanded capacity.',
    best_season: [
      { season: 'Jul–Aug', why: 'Full access, warm enough to swim at Cleetwood Cove, wildflowers on the rim.' },
      { season: 'Sep', why: 'Crowds thin, fall color starting, cooler temps, boats still running.' },
    ],
    avoid_if: ['You need hookups (some available but limited)', 'You’re claustrophobic on steep trails', 'You visit before July (snow likely)'],
    insider_hacks: [
      'Drive Rim Drive counterclockwise — you’ll be on the lake side the entire way',
      'Phantom Ship overlook at sunrise is the best photo in the park — usually empty at 5am',
      'The PCT enters from the north — hike 3 miles northbound for complete solitude',
    ],
    wildlife_alert: 'Black bears present in the park — use food storage. Mountain lion sightings rare but documented. No dangerous wildlife at the rim. The lake has no fish-eating predators — it’s one of the clearest ecosystems in the world.',
    cell_signal: 'No cell signal in most of the park. Verizon gets 1 bar near Rim Village occasionally. Download offline maps before arrival. Park WiFi available at Crater Lake Lodge.',
    fire_rules: 'Campfires in designated rings only at Mazama. Rim Village area is no-fire zone. Check for seasonal restrictions — fire danger high in late summer. Firewood sold at Mazama Village store.',
  },

  'jumbo-rocks-joshua-tree': {
    why_its_good: 'Joshua Tree occupies a unique overlap zone between two deserts — the Mojave and Sonoran — creating landscapes found nowhere else. The granite boulder formations at Jumbo Rocks are geological sculptures that create natural campsite rooms. The dark sky here is among the best accessible by car in Southern California.',
    real_issues: [
      { issue: 'No water at Jumbo Rocks — must bring all water', solution: 'Minimum 1 gallon per person per day. Fill up in Twentynine Palms before entering. The park has water at Indian Cove and Cottonwood but not Jumbo Rocks.' },
      { issue: 'Extreme summer heat — regularly 110°F+', solution: 'Visit October through April. Shoulder season (May, September) is borderline. June–August is genuinely dangerous for daytime activity.' },
      { issue: 'Rattlesnakes and scorpions are common', solution: 'Shake out shoes before putting on. Don’t reach into cracks without looking. Scorpions glow under UV light — a UV flashlight at night is useful.' },
    ],
    what_people_say: [
      { quote: 'The Milky Way from Jumbo Rocks is the reason I bought a camera. Completely changed my life.', source: 'The Dyrt', sentiment: 'love' },
      { quote: 'Bring every drop of water you need. This is not a suggestion. There is nothing at the campground.', source: 'Campendium', sentiment: 'warn' },
      { quote: 'Scrambled up the boulder behind our site at sunrise. Most beautiful 20 minutes I’ve had camping.', source: 'Google', sentiment: 'love' },
    ],
    rare_gem: 'The Cholla Cactus Garden at sunset — the jumping cholla backlit by desert light looks like science fiction. 6 miles from Jumbo Rocks, almost nobody makes the trip.',
    not_to_miss: ['Milky Way photography', 'Boulder scrambling from your site', 'Skull Rock Trail', 'Cholla Cactus Garden at sunset', 'Keys View at dawn'],
    whats_new: '2026: Timed entry pilot program may be implemented for peak weekends. New shade structures at Cottonwood Campground (different area). Visitor center hours extended.',
    best_season: [
      { season: 'Nov–Feb', why: 'Cool temperatures, uncrowded, best for hiking. Occasional snow on boulders is surreal.' },
      { season: 'Mar–Apr', why: 'Wildflower superbloom years (check forecasts). Spring is the most popular season.' },
    ],
    avoid_if: ['You visit June–September (dangerous heat)', 'You need water at camp', 'You need hookups', 'You need shade'],
    insider_hacks: [
      'Sites with boulders behind them (numbers 15–30) have natural wind protection and better scrambling',
      'The park entrance gate has no cell signal — download maps and permits before arrival',
      'For Milky Way photography, new moon weekends in winter/spring are ideal — plan 2 months ahead',
    ],
    wildlife_alert: 'Diamondback rattlesnakes are common in rocky areas — wear boots, watch where you step. Scorpions active at night — UV flashlight helpful. Coyotes regularly visit camp at night. Desert kit fox are harmless and curious.',
    cell_signal: 'No cell signal throughout most of the park. Verizon gets 1 bar near the east entrance. Download Gaia GPS offline maps before arrival. No WiFi anywhere in the park.',
    fire_rules: 'Campfires permitted in fire rings. Ground fires strictly prohibited. Gathering firewood prohibited — bring your own or purchase at visitor center. Fire restrictions common spring–fall. Check current conditions at nps.gov/jotr.',
  },

  'st-mary-glacier': {
    why_its_good: 'Glacier National Park contains some of the most dramatic mountain scenery remaining in the continental US, and St. Mary sits at the east entrance where the plains meet the Rockies in a collision of geology. Going-to-the-Sun Road, considered the most scenic 50 miles of road in America, begins here.',
    real_issues: [
      { issue: 'Vehicle reservations required for Going-to-the-Sun Road May–October', solution: 'Book at recreation.gov — reserve at 8am MST when your entry date becomes available 60 days out.' },
      { issue: 'Grizzly bear country requires constant food discipline', solution: 'Use the provided bear boxes religiously. Cook away from sleeping areas. Carry bear spray on every hike — available to rent at St. Mary Village.' },
      { issue: 'Extremely short season — snow can close roads through June', solution: 'Mid-July through mid-September is the reliable window. Check NPS road status at nps.gov/glac.' },
    ],
    what_people_say: [
      { quote: 'Saw a grizzly bear 50 yards from camp on my first morning. Absolutely terrifying and magnificent.', source: 'Campendium', sentiment: 'love' },
      { quote: 'Going-to-the-Sun Road should not be legal — too beautiful for human eyes. I had to pull over every mile.', source: 'The Dyrt', sentiment: 'love' },
      { quote: 'Get the vehicle permit AND book Logan Pass parking if you want to summit. Both sell out.', source: 'Google', sentiment: 'warn' },
    ],
    rare_gem: 'Two Medicine Lake — the least-visited major valley in Glacier, 30 miles south of St. Mary. Boat tours, dramatic peaks, almost no crowds compared to Logan Pass.',
    not_to_miss: ['Going-to-the-Sun Road', 'St. Mary Lake sunrise', 'Grinnell Glacier hike (Many Glacier)', 'Baring Falls Trail', 'Logan Pass boardwalk'],
    whats_new: '2026: New vehicle reservation system continues. Logan Pass visitor center renovations complete. Additional bear spray rental stations added at St. Mary.',
    best_season: [
      { season: 'Mid-Jul', why: 'Roads fully open, wildflowers peaking, best wildlife activity.' },
      { season: 'Aug–Sep', why: 'Huckleberries ripe (grizzly prime time), clear weather, warm enough to hike.' },
    ],
    avoid_if: ['You can’t deal with grizzly bear protocols', 'You need hookups (21ft RV limit)', 'You visit before July (road likely closed)', 'You want solitude — it’s a busy park'],
    insider_hacks: [
      'Stay at the St. Mary KOA if the campground is full — it’s adjacent and has hot showers',
      'The Chief Mountain border crossing (seasonal) to Canada is 30 miles — do a day trip to Waterton Lakes NP',
      'Hike Otokomi Lake Trail from Rose Creek (2 miles from camp) — almost nobody does it, spectacular views',
    ],
    wildlife_alert: 'Grizzly bears are common throughout the park — bear spray mandatory on all trails. Mountain goats at Logan Pass are habituated and will approach for salt. Moose often seen near St. Mary Lake. Mountain lions rare but present.',
    cell_signal: 'No cell signal in most of the park. St. Mary Village gets weak Verizon signal. Download offline maps before arrival. Park WiFi at Apgar Visitor Center (west side only).',
    fire_rules: 'Campfires in fire rings only. Fire restrictions common in late summer — check nps.gov/glac. Firewood available at camp store. Ground fires strictly prohibited. No campfires during dry periods.',
  },

  'big-meadows-shenandoah': {
    why_its_good: 'Big Meadows sits atop the Blue Ridge at 3,510 feet with the Appalachian Trail running through the meadow and Skyline Drive offering 75 overlooks. The meadow itself hosts deer every evening without fail, and the fall foliage from the ridgeline is among the most spectacular drives in the eastern US.',
    real_issues: [
      { issue: 'October weekend reservations fill months in advance for peak foliage', solution: 'Book October weekends in April. Weekdays in foliage season are significantly more available and less crowded.' },
      { issue: 'Bears are common and managed — strict food storage required', solution: 'Use the metal food storage boxes at every site. Bears in Shenandoah are habituated to campers and bold — non-negotiable compliance.' },
      { issue: 'Skyline Drive 35mph speed limit means travel takes longer than expected', solution: 'Treat it as a scenic drive, not transportation. The drive itself IS the attraction — budget extra time.' },
    ],
    what_people_say: [
      { quote: 'Seven deer in the meadow at sunset. My kids were speechless. Then an AT thru-hiker walked by. Perfect Shenandoah night.', source: 'The Dyrt', sentiment: 'love' },
      { quote: 'Mid-October peak color on Skyline Drive is the most beautiful I’ve seen in 20 years of East Coast camping.', source: 'Campendium', sentiment: 'love' },
      { quote: 'Dark Hollow Falls is 0.8 miles and worth every step. Go first thing in the morning.', source: 'Google', sentiment: 'tip' },
    ],
    rare_gem: 'The Limberlost Trail — a universally accessible boardwalk through an ancient hemlock forest. Magical in morning mist and completely overlooked by most visitors.',
    not_to_miss: ['Meadow walk at dusk (deer guaranteed)', 'Dark Hollow Falls (0.8 mi)', 'Skyline Drive sunrise at Hawksbill overlook', 'Appalachian Trail section hike', 'Story of the Forest Trail (self-guided)'],
    whats_new: '2026: Hemlock restoration project on Limberlost Trail ongoing. New amphitheater programming added. Skyline Drive reopened after storm damage repairs at MP 48.',
    best_season: [
      { season: 'Oct', why: 'Peak fall color — arguably the best foliage drive in the mid-Atlantic.' },
      { season: 'May–Jun', why: 'Wildflowers, AT thru-hiker season, comfortable temps.' },
    ],
    avoid_if: ['You need hookups', 'You need fast travel (35mph limit throughout)', 'You visit peak October without reservations'],
    insider_hacks: [
      'Campsites D1–D20 are closest to the meadow — request these at check-in if available',
      'The AT intersects Big Meadows — chat with thru-hikers who pass through May–June',
      'Luray Caverns is 15 miles east — a rainy day option that is genuinely spectacular',
    ],
    wildlife_alert: 'Black bears are actively managed and bold — food storage boxes are mandatory. White-tailed deer are abundant and unafraid. Copperhead snakes in rocky areas — watch your step. Black bears in Shenandoah have learned to open car doors — lock your vehicle and never leave food inside.',
    cell_signal: 'Varies significantly along Skyline Drive. Verizon gets 2 bars near Big Meadows. AT&T inconsistent. Download AllTrails maps offline. Park WiFi at Byrd Visitor Center (seasonal).',
    fire_rules: 'Campfires in fire rings only. Firewood sold at Big Meadows camp store. No outside firewood — to prevent invasive insects. Fire restrictions may apply during dry periods — check nps.gov/shen on arrival.',
  },

}
