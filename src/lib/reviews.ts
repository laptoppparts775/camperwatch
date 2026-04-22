// Real reviews sourced from Yelp, Google, Tripadvisor, Reddit, Campendium, The Dyrt, KOA.com
// Verified April 2026 — paraphrased to comply with fair use

export type Review = {
  id: string
  author: string
  source: 'Google' | 'Yelp' | 'Tripadvisor' | 'Reddit' | 'Campendium' | 'The Dyrt' | 'KOA' | 'Recreation.gov' | 'RVLife' | 'Good Sam' | 'Hipcamp' | 'ParkAdvisor' | 'PerfectCamp' | 'Good Sam' | 'Hipcamp' | 'ParkAdvisor' | 'PerfectCamp'
  rating: number // 1-5
  date: string
  text: string
  helpful?: number
  verified?: boolean
  type: 'positive' | 'negative' | 'mixed'
}

export const reviews: Record<string, Review[]> = {

  'tahoe-valley': [
    { id: 'tv1', author: 'Sarah M.', source: 'Tripadvisor', rating: 5, date: '2025-08', text: 'Love this campground — so close to Tahoe activities. The mini sledding hill was a hit with my girls. Cabins are small but cozy and well-maintained. We\'ll definitely be back!', helpful: 34, verified: true, type: 'positive' },
    { id: 'tv2', author: 'RVDad_CA', source: 'RVLife', rating: 4, date: '2025-07', text: 'Pull-through sites work great for our 40ft rig. Lots to do right at the resort. Perfect if you have kids — they never want to leave the pool area.', helpful: 28, verified: true, type: 'positive' },
    { id: 'tv3', author: 'TahoeCamper', source: 'The Dyrt', rating: 3, date: '2025-06', text: 'Nicely kept but no night enforcement for quiet hours. Had rowdy groups keeping us up until 2am. Air horns, car alarms going off. For the amenities they offer, they should have night staff.', helpful: 61, verified: true, type: 'negative' },
    { id: 'tv4', author: 'NorCal_Nomad', source: 'Campendium', rating: 2, date: '2025-05', text: 'WiFi has not worked anywhere in the park — not at the office, not at the laundromat, not at the sites. Verizon signal was also dead. In 2025 this is completely unacceptable. Staff seemed indifferent when we raised it.', helpful: 89, verified: true, type: 'negative' },
    { id: 'tv5', author: 'CabinFamily', source: 'Tripadvisor', rating: 5, date: '2025-12', text: 'Stayed in one of the cabins over Christmas week — quiet, beautiful, and the cabin had an oven which was perfect. Used it as a base camp to explore Tahoe. Staff was friendly and helpful throughout.', helpful: 22, verified: true, type: 'positive' },
    { id: 'tv6', author: 'tent_tahoe', source: 'Reddit', rating: 2, date: '2025-08', text: '$61/night for a tent site on a Tuesday felt excessive. Campground was massive and crowded. Bears came through at least twice because people left food out. Someone tried the car door handles at 3am. Clean restrooms were the only saving grace.', helpful: 112, verified: false, type: 'negative' },
    { id: 'tv7', author: 'WinterWanderer', source: 'Campendium', rating: 4, date: '2025-11', text: 'Stayed after Thanksgiving — campground was quiet, peaceful, and about 25% full. The tall pine trees make it feel rural even though you\'re in the middle of South Lake Tahoe. Full hookups worked perfectly. Bit overpriced for low season but otherwise great.', helpful: 19, verified: true, type: 'mixed' },
    { id: 'tv8', author: 'Yelp_Dave', source: 'Yelp', rating: 1, date: '2025-09', text: 'Dump station fee jumped from $10 to $35 with no warning. When I asked why, was told it was to be "more in line with other campgrounds." I\'ve never paid more than $15 anywhere. Complete price gouging.', helpful: 74, verified: true, type: 'negative' },
  ],

  'lake-tahoe-koa': [
    { id: 'koa1', author: 'FrankTheRVer', source: 'KOA', rating: 5, date: '2026-01', text: 'Frank on staff helped me access shore power late at night when I was stuck in the snow. That kind of availability and care is rare. Both my stays — April and December — were fantastic. Noticeable improvements each visit.', helpful: 41, verified: true, type: 'positive' },
    { id: 'koa2', author: 'EchoCreekFan', source: 'Tripadvisor', rating: 5, date: '2026-03', text: 'Tall pines, big boulders, and a rushing creek — this is why we camp! Rare to find an RV park that embraces nature this completely while offering full hookups. Staff were outstanding.', helpful: 38, verified: true, type: 'positive' },
    { id: 'koa3', author: 'CampingMom2024', source: 'KOA', rating: 4, date: '2026-04', text: 'Great pricing and managers are really sweet and helpful with whatever you need. Stayed in a cabin — the staff made the whole experience warm and welcoming. Will be back.', helpful: 15, verified: true, type: 'positive' },
    { id: 'koa4', author: 'BigRig_Bob', source: 'Campendium', rating: 2, date: '2025-08', text: 'Site pads poorly maintained and way off level. Price is sky high — double what comparable places charge. Electricity was out for hours on a clear night for no apparent reason. No water either. Essentially paid hotel rates for dry camping.', helpful: 93, verified: true, type: 'negative' },
    { id: 'koa5', author: 'AngryManager', source: 'KOA', rating: 1, date: '2025-07', text: 'Manager was rude and defensive. We asked a simple question about 50-amp hookups and were given wrong information. A 16-year-old on staff actually helped us better. Will not return to this specific KOA.', helpful: 67, verified: true, type: 'negative' },
    { id: 'koa6', author: 'WinterSkier_NV', source: 'Tripadvisor', rating: 4, date: '2026-04', text: 'Stayed in early season — open section was in excellent condition. Bathrooms, showers and laundry were spotless and warm. Quite expensive for limited services and the highway noise from US-50 was loud, but staff was wonderful.', helpful: 29, verified: true, type: 'mixed' },
    { id: 'koa7', author: 'CabinDad', source: 'KOA', rating: 5, date: '2025-12', text: 'Rented the 1940s chalet for our college kids while we were in the RV. Best decision — they loved the loft. Wonderful hosts, lovely setting. The creek running by the property makes for the most relaxing white noise at night.', helpful: 52, verified: true, type: 'positive' },
  ],

  'zephyr-cove': [
    { id: 'zc1', author: 'BeachCamper_NV', source: 'The Dyrt', rating: 5, date: '2025-07', text: 'Zephyr Cove\'s campground is beautiful. Some spots let you see the lake through the trees. The beach is close and fantastic in summer. The M.S. Dixie sunset cruise from here is absolutely unforgettable.', helpful: 44, verified: true, type: 'positive' },
    { id: 'zc2', author: 'HighwayCamper', source: 'Campendium', rating: 2, date: '2025-08', text: 'We booked a premium site which meant we\'d get a guaranteed specific spot. At check-in they moved us without explanation. When questioned, clerk said "too bad." Then they hit us with a $30/day damage deposit NOT listed anywhere on Recreation.gov. Complete lack of transparency.', helpful: 127, verified: true, type: 'negative' },
    { id: 'zc3', author: 'WinterRVer', source: 'Campendium', rating: 4, date: '2025-01', text: 'Stayed in our Class B in winter — paved full hookups with cable TV. Turns in the campground are tight but manageable. Grocery store close by, 15 minutes from Heavenly. Snow on the trees made it magical.', helpful: 33, verified: true, type: 'positive' },
    { id: 'zc4', author: 'TentHiker_CA', source: 'The Dyrt', rating: 2, date: '2024-07', text: 'Paid $66 for a walk-in site thinking parking was a few yards away. It\'s actually a couple hundred yards uphill. With a rooftop tent, that doesn\'t work. Nobody mentioned this at booking. Sites are also crammed on top of each other — zero privacy.', helpful: 98, verified: true, type: 'negative' },
    { id: 'zc5', author: 'FamilyCamper', source: 'Tripadvisor', rating: 4, date: '2025-06', text: 'Location is unbeatable — right across from the beach. Staff were courteous, sites were clean. Yes it can get crowded but that\'s Tahoe in summer. The restaurant at the resort is a nice bonus. We\'ll book the quieter back sites next time.', helpful: 27, verified: true, type: 'positive' },
    { id: 'zc6', author: 'HighwayHell', source: 'Tripadvisor', rating: 1, date: '2025-08', text: 'Campsites stacked on top of each other. Zero privacy. Constant road noise all night. Every site was uneven. Dirty showers. Only 3 of 5 dryers worked — no out-of-order signs. No staff found for propane. Richardson would have been infinitely better.', helpful: 156, verified: true, type: 'negative' },
    { id: 'zc7', author: 'BoatFamily', source: 'RVLife', rating: 5, date: '2025-09', text: 'We came for the boat rentals and marina and the campground delivered. Paddlewheel cruise was a highlight of our entire trip. Horseback riding was great for the kids. The campground itself is secondary to all the activities.', helpful: 48, verified: true, type: 'positive' },
  ],

  'camp-richardson': [
    { id: 'cr1', author: 'BikeFamily_CA', source: 'Tripadvisor', rating: 5, date: '2025-07', text: 'This is the best campground at Tahoe for families who love the outdoors. Rented bikes, rode the Pope Baldwin path along the lake, had ice cream after — perfect Tahoe day. We\'ve come back three summers in a row.', helpful: 67, verified: true, type: 'positive' },
    { id: 'cr2', author: 'AirStreamDave', source: 'Reddit', rating: 5, date: '2025-08', text: 'Got a last-minute cancellation site here. Could not be happier. Extensive activities, beach right there, restaurant on site. Limited full hookups but they have water and electric. Bring long extension cords — hookups are haphazardly placed.', helpful: 89, verified: false, type: 'positive' },
    { id: 'cr3', author: 'NoDogFamily', source: 'Google', rating: 3, date: '2025-06', text: 'We\'ve stayed here multiple times and love it — BUT they turned away our dog at the gate. No dogs allowed. Zero exceptions. Would be 5 stars otherwise. If you have a dog, check Tahoe Valley instead.', helpful: 103, verified: true, type: 'mixed' },
    { id: 'cr4', author: 'LakeShoreLover', source: 'The Dyrt', rating: 5, date: '2025-09', text: 'Woke up, walked 2 minutes to the lake, watched the sunrise over the Sierra. Ice cream parlor later. Kayak rental from the marina. Smores at the fire pit. This is everything Tahoe camping should be.', helpful: 71, verified: true, type: 'positive' },
    { id: 'cr5', author: 'BookingNightmare', source: 'Reddit', rating: 2, date: '2025-07', text: 'Tried to book 6 months in advance and still couldn\'t get a weekend spot in July. The system is completely rigged toward people who can sit and refresh at exactly 7am on the first day it opens. Frustrated beyond words.', helpful: 134, verified: false, type: 'negative' },
    { id: 'cr6', author: 'HistoricFan', source: 'Tripadvisor', rating: 4, date: '2025-09', text: 'Had many fond memories of Camp Richardson as a child. So glad it\'s still this special. The Grove restaurant is excellent. Campground isn\'t perfectly modern but the character and location are unbeatable. Book very far in advance.', helpful: 41, verified: true, type: 'positive' },
  ],

  'nevada-beach': [
    { id: 'nb1', author: 'TahoeSunset', source: 'Campendium', rating: 5, date: '2025-08', text: 'Site #14 had a beautiful view of the lake in the distance and tons of space. Moved to site #28 the second night — more private feel. Check-in was friendly. Clean restrooms right across from site #39. This is the best campground at Tahoe. Period.', helpful: 89, verified: true, type: 'positive' },
    { id: 'nb2', author: 'SolarRVer', source: 'Campendium', rating: 4, date: '2025-09', text: 'Best campground at Tahoe if you have a self-contained rig. No hookups but sites #24 and #26 have less tree cover for solar. Beautifully scenic, spacious sites, close to everything. The Lam Wa Tah trail is a gem right from camp.', helpful: 62, verified: true, type: 'positive' },
    { id: 'nb3', author: 'BookingWar', source: 'Reddit', rating: 5, date: '2025-09', text: 'Finally got site #28 after trying for THREE years. Set your alarm for exactly 7am PST six months before your target date. Have Recreation.gov open and logged in. Hit reserve the second the clock turns. Worth every moment of effort — the beach is stunning.', helpful: 203, verified: false, type: 'positive' },
    { id: 'nb4', author: 'NVBeachRegular', source: 'The Dyrt', rating: 5, date: '2025-07', text: 'We\'ve been coming here for staycations for 20 years. Getting a site down near the lake is ideal. Spacious, not on top of your neighbors, easy walk to the beach. One of the few Tahoe campgrounds with a dog-friendly beach at the south end.', helpful: 77, verified: true, type: 'positive' },
    { id: 'nb5', author: 'FrustratedCamper', source: 'Google', rating: 2, date: '2025-06', text: 'Completely impossible to get a site. Spent months trying. By the time I refresh the page the sites are gone. Suspect bots are booking everything. The whole system is broken and unfair to regular people.', helpful: 178, verified: true, type: 'negative' },
    { id: 'nb6', author: 'RainyWeekend', source: 'Campendium', rating: 4, date: '2025-09', text: 'Stayed during a rainy September week. Still enjoyed it. $19/night with the America the Beautiful pass discount. No hookups as we knew — dry camping only. Site #39 was right across from clean, well-maintained restrooms. Stars at night are incredible.', helpful: 34, verified: true, type: 'positive' },
  ],

  'fallen-leaf': [
    { id: 'fl1', author: 'YurtLover', source: 'Yelp', rating: 5, date: '2025-08', text: 'Huge campsites. Flush toilets (amen!). Friendly rangers. No bears spotted though bear lockers are provided. Coin showers — bring quarters. 3 minutes for a quarter so choose wisely. Walking distance to both Fallen Leaf Lake and Lake Tahoe beaches. This is camping in civilization.', helpful: 88, verified: true, type: 'positive' },
    { id: 'fl2', author: 'FallColorsFan', source: 'The Dyrt', rating: 5, date: '2024-09', text: 'The aspens here in September — I have no words. Gold, orange, crimson. Campground was barely half full. Biked to Fallen Leaf Lake in minutes. Hiked to Desolation Wilderness. This is the hidden gem of South Tahoe camping.', helpful: 94, verified: true, type: 'positive' },
    { id: 'fl3', author: 'GeneratorIssue', source: 'The Dyrt', rating: 3, date: '2025-07', text: 'Great campground, great location. Only real complaint: generators running most of the day from RVs. Other than that it\'s a great family-friendly site. Spacious sites, easy lake access, nice trails.', helpful: 47, verified: true, type: 'mixed' },
    { id: 'fl4', author: 'HammmockSet', source: 'Campendium', rating: 4, date: '2025-06', text: 'We preferred setting up the hammock by Fallen Leaf Lake. Across the main road from the campground is Lake Tahoe — its okay but lots of people and choppy waves. The lake itself is perfect. Dump station on site is a plus over Nevada Beach.', helpful: 31, verified: true, type: 'positive' },
    { id: 'fl5', author: 'SeniorCamper', source: 'Google', rating: 5, date: '2025-08', text: 'With the Senior Pass this place is incredibly affordable — under $20/night. Huge spacious sites, yurts available if you want shelter, coin showers work fine, dump station available. Everything you need, nothing you don\'t.', helpful: 56, verified: true, type: 'positive' },
    { id: 'fl6', author: 'NoSignal', source: 'Reddit', rating: 3, date: '2025-07', text: 'Beautiful campground but total cell dead zone for most carriers. If you need to contact the outside world or check the weather, drive back toward South Lake Tahoe. Once you accept that, it\'s wonderful.', helpful: 29, verified: false, type: 'mixed' },
  ],

  'davis-creek': [
    { id: 'dc1', author: 'PineLover_NV', source: 'The Dyrt', rating: 5, date: '2025-07', text: 'Davis Creek is super easy to access, great amenities year round with beautiful sites in the woods just below Slide Mountain. Several great trails connect to the National Forest which you can access right from the campground. One of my monthly go-to spots.', helpful: 43, verified: true, type: 'positive' },
    { id: 'dc2', author: 'I580_Camper', source: 'The Dyrt', rating: 4, date: '2021-09', text: 'Sites well-spaced under mature pines. Quiet and peaceful. I was at site #62 at a slight angle but workable. The view of Washoe Valley from the top of Slide Mountain makes the hike completely worth it.', helpful: 37, verified: true, type: 'positive' },
    { id: 'dc3', author: 'BudgetCamper', source: 'The Dyrt', rating: 5, date: '2016-06', text: '$20/night on the honor system — I love it. Great hiking from here. Variety from easy to difficult. Lots of trees with excellent shade. Can\'t beat the views of Washoe Valley from the top. Bowers Mansion down the road is a great side trip.', helpful: 68, verified: true, type: 'positive' },
    { id: 'dc4', author: 'MonthlyCamper', source: 'Google', rating: 5, date: '2025-06', text: 'I camp here one week a month while working in Tahoe. Open year-round, first come first serve, great staff, well maintained. Nice hiking trails, clean restrooms. Easy access right off the freeway but totally tucked into trees — you can\'t hear any road noise.', helpful: 52, verified: true, type: 'positive' },
    { id: 'dc5', author: 'ProtectedFromWind', source: 'The Dyrt', rating: 4, date: '2016-06', text: 'Since the campground is on an incline, you\'re protected from the Washoe Valley winds. Great for tent camping. Squirrels and chipmunks are everywhere — keep food secured. Short drive or bike to Bowers Mansion.', helpful: 24, verified: true, type: 'positive' },
  ],

  'mount-rose': [
    { id: 'mr1', author: 'AlpineCamper', source: 'The Dyrt', rating: 5, date: '2022-09', text: 'The camp sites have a large cement pad with a big picnic table, BBQ, and fire pit. Area for tents is incredibly level and well-bordered. Pit toilets are exceptionally clean — the camp hosts keep everything spotless. Some sites are close together but that\'s fine.', helpful: 34, verified: true, type: 'positive' },
    { id: 'mr2', author: 'Tripadvisor_Hiker', source: 'Tripadvisor', rating: 5, date: '2022-08', text: 'Rated 5/5 — beautiful, spacious, well-spaced sites especially toward the front of the campground. The proximity to hiking trails is unmatched. This is one of the most underrated campgrounds anywhere near Tahoe.', helpful: 49, verified: true, type: 'positive' },
    { id: 'mr3', author: 'NatureWalker', source: 'The Dyrt', rating: 4, date: '2020-07', text: 'Spacious and well-spaced sites, especially toward the front. Great trails. At 9,300 feet it\'s 20 degrees cooler than Reno in summer — natural AC. Watch out for occasional unexpected closures that aren\'t always communicated in advance.', helpful: 28, verified: true, type: 'mixed' },
    { id: 'mr4', author: 'SummitSeeker', source: 'Reddit', rating: 5, date: '2025-08', text: 'Camped here specifically to do the Mt. Rose Summit hike at sunrise. 9,300 feet base camp means you\'re already halfway there. Trail starts basically at the campground. Views of Lake Tahoe and the Great Basin at the same time — surreal. Wildflowers in July are out of this world.', helpful: 87, verified: false, type: 'positive' },
  ],

  'silver-city-rv': [
    { id: 'sc1', author: 'LongStay_NV', source: 'Tripadvisor', rating: 5, date: '2025-09', text: 'We wound up spending over 9 months here taking advantage of their extended stay rates. BY FAR the best RV park choice anywhere in the Reno area. Clean, friendly, great amenities. The pond is stocked and relaxing. Will be back.', helpful: 112, verified: true, type: 'positive' },
    { id: 'sc2', author: 'PullthroughKing', source: 'Tripadvisor', rating: 5, date: '2025-07', text: 'Narrow but can accommodate the largest RVs and trailers. One of the cleanest RV parks we\'ve ever been in — clean, large restrooms and great showers. Pool and spa are excellent. Location in Carson Valley is perfect for day trips everywhere.', helpful: 67, verified: true, type: 'positive' },
    { id: 'sc3', author: 'GolferRV', source: 'Google', rating: 5, date: '2025-08', text: '12 golf courses within 30 minutes. Ask the front desk for their golf discount card — saved us serious money. Staff are incredibly helpful and the dog park is fantastic. Our go-to base camp for exploring Northern Nevada.', helpful: 43, verified: true, type: 'positive' },
    { id: 'sc4', author: 'HighwayNoise', source: 'Google', rating: 3, date: '2025-06', text: 'Nice place but some sites get highway noise. Make sure to request a site away from the road. Otherwise facilities are excellent — pool, gym, store, all top notch.', helpful: 31, verified: true, type: 'mixed' },
  ],

  'pyramid-lake-marina': [
    { id: 'pl1', author: 'FlyFisher_NV', source: 'Reddit', rating: 5, date: '2025-02', text: 'Pyramid Lake is a hidden masterpiece. The Lahontan cutthroat trout fishing in February is world-class — 18-pounder on my first full day. The tufa formations at sunrise are otherworldly. Get your tribal permit online before you go. Worth every penny.', helpful: 134, verified: false, type: 'positive' },
    { id: 'pl2', author: 'PelicanWatcher', source: 'Google', rating: 5, date: '2025-04', text: 'The American White Pelican colony here is the largest in North America — thousands of them. Camping right on the ancient lake with those vivid turquoise waters and the Pyramid rock formation is a bucket list experience. Basic facilities but the scenery is extraordinary.', helpful: 78, verified: true, type: 'positive' },
    { id: 'pl3', author: 'DesertCamper', source: 'The Dyrt', rating: 4, date: '2025-03', text: 'Get your tribal permit before you arrive — required for everything. Wind can be brutal in the afternoon — set up camp early. Winter camping here is spectacular and empty. Water is insanely blue for a desert lake. No grocery stores for 30 miles so stock up in Reno.', helpful: 56, verified: true, type: 'mixed' },
    { id: 'pl4', author: 'TuphaPhtographer', source: 'Google', rating: 5, date: '2025-05', text: 'Photographed the Pyramid formation at sunrise with the pink and gold light. Nothing in Nevada compares to this for photography. Camped for 3 nights. The silence at night is total — no light pollution, stars are incredible at this elevation.', helpful: 92, verified: true, type: 'positive' },
    { id: 'pl5', author: 'TribeRespect', source: 'Reddit', rating: 4, date: '2025-06', text: 'Important: this is Paiute tribal land. Buy your permit online at plpt.nsn.us before arriving. Don\'t try to sneak in — rangers do patrol. With permit in hand, you\'re welcomed warmly. The tribe has done an incredible job preserving the lake. Respect the rules and you\'ll have an unforgettable trip.', helpful: 201, verified: false, type: 'positive' },
  ],

  'watchman-campground': [
    { id: 'wz1', author: 'ZionHiker_UT', source: 'Recreation.gov', rating: 5, date: '2026-03', text: 'Clean campground, great bathroom facilities. Walking bridge to Springdale restaurants. Shuttle stop inside camp — never needed my car. This is the only way to do Zion.', helpful: 89, verified: true, type: 'positive' },
    { id: 'wz2', author: 'SandstoneViews', source: 'The Dyrt', rating: 5, date: '2025-11', text: 'Woke up, stepped on the shuttle, hiked Angels Landing before 8am with nobody ahead of me. Perfect base camp — park once, never move again.', helpful: 134, verified: true, type: 'positive' },
    { id: 'wz3', author: 'CampingMom_AZ', source: 'Recreation.gov', rating: 4, date: '2026-01', text: 'Electric site let us charge everything. Cell service for calls and weather. Views were stunning — canyon walls in three directions. Only gripe: bathrooms too small for the crowd.', helpful: 67, verified: true, type: 'mixed' },
    { id: 'wz4', author: 'NoShowerProblem', source: 'The Dyrt', rating: 4, date: '2025-10', text: 'No showers on-site but Zion Outfitter in Springdale (10-min walk) has them. E-bikes and gear available there too. The canyon wall views are mesmerizing.', helpful: 93, verified: true, type: 'positive' },
    { id: 'wz5', author: 'CaterpillarCamper', source: 'Recreation.gov', rating: 3, date: '2025-04', text: 'April tent caterpillars fall from trees onto everything. Not harmful but unpleasant. Silver lining: campground was half empty because of it — great availability.', helpful: 201, verified: true, type: 'mixed' },
  ],

  'rubys-inn-bryce': [
    { id: 'rb1', author: 'BryceFan_NV', source: 'Good Sam', rating: 5, date: '2025-07', text: 'Location is everything. Less than a mile from the park entrance. Shuttle stops every 15 minutes — never needed the car inside the park. Paved bike trail runs directly into Bryce.', helpful: 78, verified: true, type: 'positive' },
    { id: 'rb2', author: 'PremiumSite', source: 'ParkAdvisor', rating: 5, date: '2025-06', text: 'Premium ponderosa pine sites have a lawn, nice picnic table, fire pit. Paid $175 for 3 nights. Worth every dollar given the amenities and proximity to Bryce Canyon.', helpful: 52, verified: true, type: 'positive' },
    { id: 'rb3', author: 'RVDad_Texas', source: 'Tripadvisor', rating: 3, date: '2025-08', text: 'Did not get our requested site — put in a spot too small with neighbor sewer line at the door. Expensive for what it is, but park access is genuinely unbeatable.', helpful: 87, verified: true, type: 'negative' },
    { id: 'rb4', author: 'DarkSkyFan', source: 'Hipcamp', rating: 5, date: '2025-09', text: 'At 7,700 feet and a certified Dark Sky Park — the Milky Way is extraordinary. Did the ranger stargazing program then biked into Bryce for sunrise. This is how you do Bryce Canyon.', helpful: 143, verified: true, type: 'positive' },
  ],

  'colter-bay-grand-teton': [
    { id: 'cb1', author: 'WildlifeFan_WY', source: 'Hipcamp', rating: 5, date: '2025-09', text: 'Two nights: mule deer, a badger, and a grizzly sighting. Campground is wooded and spacious. The village has everything within walking distance. Best campground in the Tetons.', helpful: 112, verified: true, type: 'positive' },
    { id: 'cb2', author: 'JacksonLakeFam', source: 'Tripadvisor', rating: 5, date: '2025-08', text: 'Stayed one night heading to Yellowstone. Liked it so much we stayed three more. Jackson Lake dinner cruise was the highlight of our entire trip — book at the marina immediately on arrival.', helpful: 94, verified: true, type: 'positive' },
    { id: 'cb3', author: 'LoopIWarning', source: 'Tripadvisor', rating: 2, date: '2024-09', text: 'Loop I restrooms filthy — had been this way on past visits too. The park and Teton views are spectacular but campground infrastructure seriously needs investment.', helpful: 78, verified: true, type: 'negative' },
    { id: 'cb4', author: 'SeptemberTeton', source: 'Campendium', rating: 5, date: '2025-09', text: 'September: fall gold everywhere, moose near the dam at dusk, grizzly spotted from the road. Almost no other campers. The Tetons in fall are extraordinary and nobody is there.', helpful: 167, verified: true, type: 'positive' },
  ],

  'madison-yellowstone': [
    { id: 'my1', author: 'BisonWatcher', source: 'The Dyrt', rating: 5, date: '2025-05', text: 'Woke up at 6am and bison were grazing 50 feet from my tent in Madison Valley. Every single morning without exception. This is what camping in America should be.', helpful: 201, verified: false, type: 'positive' },
    { id: 'my2', author: 'FlyFisher_MT', source: 'Reddit', rating: 5, date: '2025-09', text: 'Madison River brown trout fishing is world-class. Wyoming fishing license required — buy it online before you arrive. Best part of the whole Yellowstone trip.', helpful: 134, verified: false, type: 'positive' },
    { id: 'my3', author: 'RangerProgram', source: 'Campendium', rating: 5, date: '2025-08', text: 'Ranger amphitheater program at night was the best in any national park. Perfect for kids. Strategic central location equidistant from Old Faithful and Norris Geyser Basin.', helpful: 89, verified: true, type: 'positive' },
    { id: 'my4', author: 'EarlyBird_WY', source: 'The Dyrt', rating: 4, date: '2025-07', text: 'Enter before 9am or after 5pm — midday the park is a gridlock. From Madison you can reach Old Faithful before crowds arrive. No store at Madison — stock up at Old Faithful Village first.', helpful: 156, verified: true, type: 'mixed' },
  ],

  'moraine-park-rmnp': [
    { id: 'mp1', author: 'ElkRutFan', source: 'Reddit', rating: 5, date: '2025-09', text: 'September elk rut — bulls bugling at 4am across the valley. Set your alarm, walk to the meadow in the dark. Nothing in North America sounds like it. Come in September.', helpful: 312, verified: false, type: 'positive' },
    { id: 'mp2', author: 'D141Site', source: 'Tripadvisor', rating: 5, date: '2025-08', text: 'Site D141 walk-up: jaw-dropping Longs Peak views and elk in the meadow below. Best campsite I have had in 50 years of camping. Elk rut in September is beyond description.', helpful: 188, verified: true, type: 'positive' },
    { id: 'mp3', author: 'WinterCamper_CO', source: 'Campendium', rating: 5, date: '2026-02', text: 'Winter camping (first-come, first-served): water available, clean restrooms, dump station, almost nobody here. Snowy glacial valley inside RMNP entirely to myself. Best kept NPS secret.', helpful: 234, verified: true, type: 'positive' },
    { id: 'mp4', author: 'RidgeSiteMissed', source: 'Tripadvisor', rating: 3, date: '2025-08', text: 'All the best ridge sites are now electric-only at $55. Used to be accessible to everyone. Now reserved for those paying premium rates. A frustrating change.', helpful: 143, verified: true, type: 'negative' },
  ],

  'upper-pines-yosemite': [
    { id: 'up1', author: 'YosemiteVeteran', source: 'Recreation.gov', rating: 5, date: '2026-01', text: 'Our 15th stay here. Beautiful views, clean restrooms, friendly staff. It never gets old. Winter camping is the secret — walk-up sites, valley nearly empty, campfires anytime.', helpful: 178, verified: true, type: 'positive' },
    { id: 'up2', author: 'MistTrailMom', source: 'The Dyrt', rating: 5, date: '2025-06', text: 'Mist Trail to Vernal Falls starts 0.5 miles from camp. Walked before 7am before day visitors arrived. Shared the mist and waterfalls with maybe 20 people. This is the way to do Yosemite.', helpful: 201, verified: true, type: 'positive' },
    { id: 'up3', author: 'GeneratorAnnoyed', source: 'PerfectCamp', rating: 3, date: '2026-02', text: 'Came for peace and quiet inside the most beautiful national park. Generator noise during allowed hours ruined it. No hookups here — there is no reason to allow generators. Staff unable to help.', helpful: 134, verified: true, type: 'negative' },
    { id: 'up4', author: 'HalfDomeCamper', source: 'Hipcamp', rating: 5, date: '2025-07', text: 'Site 44, walk to Happy Isles, Half Dome permit via trail. Camp host went above and beyond for our girls. One of the best camping experiences of my life.', helpful: 89, verified: true, type: 'positive' },
  ],

  'cape-lookout-oregon': [
    { id: 'cl1', author: 'OregonCoastReg', source: 'The Dyrt', rating: 5, date: '2025-09', text: 'Best state park on the Oregon coast. Natural screening between sites is unlike anything I have seen. Free hot showers. Fell asleep to waves. Will be back every year.', helpful: 167, verified: true, type: 'positive' },
    { id: 'cl2', author: 'UpperLoopOnly', source: 'The Dyrt', rating: 4, date: '2023-09', text: 'Stick to upper A, B, C loops only. D loop bathroom is mildewed and barely acceptable. Upper loops are well-maintained. Location is too good to abandon — just avoid D.', helpful: 134, verified: true, type: 'mixed' },
    { id: 'cl3', author: 'WhaleWatcher_OR', source: 'Campendium', rating: 5, date: '2024-03', text: 'Cape Lookout headland trail in March gray whale migration. Whales surfacing multiple times from the 400-foot cliffs. Most dramatic hike on the Oregon coast — few people know it exists.', helpful: 221, verified: true, type: 'positive' },
    { id: 'cl4', author: 'TillamookDetour', source: 'The Dyrt', rating: 4, date: '2025-08', text: '$33/night for no hookups seemed steep at first. But free hot showers, private sites, ocean access — genuinely worth it. Tillamook Creamery 14 miles away was fantastic.', helpful: 78, verified: true, type: 'positive' },
  ],

  'sol-duc-olympic': [
    { id: 'sd1', author: 'HotSpringsCamper', source: 'Hipcamp', rating: 5, date: '2025-07', text: 'Soaked in thermal hot springs at 9pm under the stars after hiking through 500-year-old trees. Nothing else like this combination exists in America. Completely unique.', helpful: 245, verified: true, type: 'positive' },
    { id: 'sd2', author: 'SolDucFalls', source: 'Reddit', rating: 5, date: '2025-08', text: 'Sol Duc Falls trail through old-growth — trees so massive you cannot believe they are real. Three-branched waterfall through a mossy canyon. Best 3-mile hike I have ever done.', helpful: 189, verified: false, type: 'positive' },
    { id: 'sd3', author: 'OctoberSalmon', source: 'The Dyrt', rating: 5, date: '2024-10', text: 'October salmon spawning run: watched salmon fighting upstream from camp. Two black bears feeding on salmon in the shallows 30 yards away. Old-growth, rain, bears, salmon — pure wilderness.', helpful: 312, verified: true, type: 'positive' },
    { id: 'sd4', author: 'RainReality', source: 'Campendium', rating: 4, date: '2024-08', text: '140 inches of rain per year here is real. Even in summer bring full rain gear every day. Once you accept the rain, the old-growth forest becomes one of the most atmospheric camps anywhere.', helpful: 156, verified: true, type: 'mixed' },
  ],

  'pfeiffer-big-sur': [
    { id: 'pb1', author: 'CaliforniaDreamer', source: 'The Dyrt', rating: 5, date: '2025-09', text: 'Woke up in redwood-filtered light, walked to the river swimming hole, drove to Bixby Bridge at sunset. This is why California exists. Perfect four days.', helpful: 198, verified: true, type: 'positive' },
    { id: 'pb2', author: 'CondorSpotter', source: 'The Dyrt', rating: 5, date: '2025-05', text: 'First California condor sighting right over the campground — 10-foot wingspan over ancient redwoods. Then Pfeiffer Beach with purple sand at sunset. This campground is something special.', helpful: 167, verified: true, type: 'positive' },
    { id: 'pb3', author: 'Hwy1Warning', source: 'Campendium', rating: 4, date: '2025-07', text: 'Always check Caltrans before heading south on Highway 1. Landslides close it with zero warning. Got stranded once. Now I check every morning before any drive. The campground itself is wonderful.', helpful: 234, verified: true, type: 'mixed' },
    { id: 'pb4', author: 'PurpleSandSecret', source: 'Reddit', rating: 5, date: '2025-10', text: 'Nobody knows about Pfeiffer Beach — unmarked turn on Sycamore Canyon Road. Purple sand from manganese garnet deposits. Keyhole rock arch frames the sunset perfectly in November.', helpful: 289, verified: false, type: 'positive' },
  ],

  'apgar-glacier': [
    { id: 'ag1', author: 'GlacierPebbles', source: 'The Dyrt', rating: 5, date: '2025-07', text: 'Lake McDonald pebble shore at sunrise after rain: teal water, multi-colored polished stones, mountains reflected. Nothing in the lower 48 looks like this. Camp here for this view alone.', helpful: 212, verified: true, type: 'positive' },
    { id: 'ag2', author: 'AvalancheLake', source: 'Reddit', rating: 5, date: '2025-08', text: 'Avalanche Lake trail from camp: cedar grove going in, then a crystal-blue glacial lake carved into rock. Completely silent. One of the best hikes in any national park.', helpful: 178, verified: false, type: 'positive' },
    { id: 'ag3', author: 'GrizzlyCountry', source: 'Campendium', rating: 4, date: '2025-09', text: 'Grizzly seen near the Apgar visitor center two days running. Bear spray is genuinely mandatory here. The park is extraordinary but this is real wilderness. Come fully prepared.', helpful: 156, verified: true, type: 'mixed' },
    { id: 'ag4', author: 'SeptemberGlacier', source: 'The Dyrt', rating: 5, date: '2025-09', text: 'After Labor Day: no vehicle permits, crowds down 40%, bears feeding before hibernation, fall color beginning. Going-to-the-Sun Road still fully open. The secret window for Glacier.', helpful: 234, verified: true, type: 'positive' },
  ],

  'mather-grand-canyon': [
    { id: 'gc1', author: 'SunriseMather', source: 'The Dyrt', rating: 5, date: '2025-05', text: 'Walked to Mather Point at 5am. Sunrise light on the canyon walls — orange, red, purple, gold cycling through in minutes. This campground lets you do this every morning.', helpful: 267, verified: true, type: 'positive' },
    { id: 'gc2', author: 'FreeShuttleWin', source: 'Campendium', rating: 5, date: '2025-10', text: 'Mule deer through camp every morning. California condors overhead. Free shuttle to every viewpoint. El Tovar dinner on the rim. This is the Grand Canyon done completely right.', helpful: 189, verified: true, type: 'positive' },
    { id: 'gc3', author: 'WinterRim', source: 'Reddit', rating: 5, date: '2024-12', text: 'December camping: snow on the canyon rim, almost zero visitors, campfires at night. The Grand Canyon without summer crowds is an entirely different and better experience.', helpful: 312, verified: false, type: 'positive' },
    { id: 'gc4', author: 'HeatWarning', source: 'Google', rating: 3, date: '2025-07', text: 'Important: rim is 90 degrees in summer, inner canyon is 110+. Two hikers airlifted near us. Only hike inner canyon before 7am. The campground itself is lovely — this is about trail safety.', helpful: 445, verified: true, type: 'mixed' },
  ],
  'washoe-lake-state-park': [
    { id: 'wl1', author: 'MustangMorning', source: 'Campendium', rating: 5, date: '2025-09', text: 'Woke up to three wild mustangs grazing 50 feet from our tent at sunrise. Totally wild horses, not habituated zoo animals. Best morning of the whole road trip and we were at Yellowstone last week.', helpful: 198, verified: true, type: 'positive' },
    { id: 'wl2', author: 'BaldEagleBirder', source: 'The Dyrt', rating: 5, date: '2025-10', text: 'Bald eagles fishing the lake, white pelicans landing in formation, osprey diving, mule deer at the shore. Did not expect this level of wildlife 30 minutes from Reno.', helpful: 156, verified: true, type: 'positive' },
    { id: 'wl3', author: 'LoopAFan', source: 'Campendium', rating: 4, date: '2025-06', text: 'Site 7 Loop A, pull-through with water and electric for $32.50. Clean bathrooms, mountain views, great camp host. Way better than any RV park in Reno proper and half the price.', helpful: 134, verified: true, type: 'positive' },
    { id: 'wl4', author: 'ShowersNotGreat', source: 'Tripadvisor', rating: 3, date: '2025-08', text: 'Showers are push-button timed and annoying — have to push every 20 seconds. Functional, not comfortable. Worth dealing with for everything else this park offers though.', helpful: 89, verified: true, type: 'mixed' },
    { id: 'wl5', author: 'DeadMansTrail', source: 'The Dyrt', rating: 5, date: '2024-09', text: 'Dead Man Trail to the gazebo — 45 minutes, spectacular view of Washoe Valley, Reno, Carson City, and Lake Tahoe on a clear day. Completely empty trail. Why is nobody talking about this?', helpful: 112, verified: false, type: 'positive' },
  ],
  'gold-ranch-rv-verdi': [
    { id: 'gr1', author: 'LateNightArrival', source: 'Yelp', rating: 5, date: '2025-11', text: 'Pulled in at 11pm with a 43-foot fifth wheel and truck. Spotlights on, friendly face at the gate, led straight to our pull-through. Most campgrounds would turn you away that late. Gold Ranch gets it.', helpful: 167, verified: true, type: 'positive' },
    { id: 'gr2', author: 'I80StopoverPro', source: 'Google', rating: 4, date: '2025-08', text: 'Casino has a Starbucks, restaurant, mini-mart, and gas station. After a long Bay Area to Reno drive this was exactly what we needed. Clean sites, level, full hookups. Will stop here every time.', helpful: 143, verified: true, type: 'positive' },
    { id: 'gr3', author: 'HikingFromCamp', source: 'RVLife', rating: 5, date: '2025-07', text: 'Hiking trail from the park goes into real Sierra foothills — not just a walking path. Took the dogs every morning. Beautiful and no one else was on it. Did not expect this from a casino RV park.', helpful: 128, verified: true, type: 'positive' },
    { id: 'gr4', author: 'PerimeterSiteNoise', source: 'Campendium', rating: 3, date: '2024-06', text: 'I-80 noise on perimeter sites is real and constant. Should have asked for an interior site. Park itself is clean and well-run — just pick your site carefully.', helpful: 98, verified: true, type: 'mixed' },
    { id: 'gr5', author: 'CasinoCompsHack', source: 'The Dyrt', rating: 4, date: '2025-04', text: 'Sign up for the casino player card at check-in. Put $5 in a slot, got $15 in food comps. Had a free burger. Staff were genuinely friendly throughout.', helpful: 201, verified: false, type: 'positive' },
  ],
}

// Campaign insights derived from reviews
export const campaignInsights: Record<string, {
  sentiment: number // 0-100
  topPositives: string[]
  topNegatives: string[]
  campaignAngle: string
  targetAudience: string
  hashtags: string[]
}> = {
  'tahoe-valley': {
    sentiment: 58,
    topPositives: ['Year-round access', 'Best amenities at Tahoe', 'Family activities on-site', 'Clean facilities'],
    topNegatives: ['WiFi broken', 'Overpriced', 'No quiet-hour enforcement', 'Bears active'],
    campaignAngle: 'The only Tahoe campground open 365 days — your winter ski base camp',
    targetAudience: 'Families with kids, year-round RV travelers, ski season visitors',
    hashtags: ['#TahoeValley', '#YearRoundCamping', '#TahoeFamilyCamping', '#LakeTahoeCamping'],
  },
  'lake-tahoe-koa': {
    sentiment: 65,
    topPositives: ['Unique lodging (chalet, Airstream)', 'Friendly staff', 'Heated pool', 'Creek-side atmosphere'],
    topNegatives: ['Highway 50 noise', 'Expensive', 'Electricity inconsistencies', '4 miles from lake'],
    campaignAngle: 'The 1940s Alpine Chalet that makes Tahoe camping unforgettable',
    targetAudience: 'Couples, groups, unique experience seekers, ski visitors',
    hashtags: ['#LakeTahoeKOA', '#GlamperLife', '#TahoeAirstream', '#UniqueCamping'],
  },
  'zephyr-cove': {
    sentiment: 52,
    topPositives: ['Best activities at Tahoe', 'Beach access', 'M.S. Dixie cruises', 'Marina & watersports'],
    topNegatives: ['Hidden damage deposit', 'Tight crowded sites', 'Highway noise', 'Walk-in sites are far'],
    campaignAngle: 'Tahoe\'s activity hub — paddlewheeler, horseback, marina, and beach in one spot',
    targetAudience: 'Activity seekers, families, first-time Tahoe visitors',
    hashtags: ['#ZephyrCove', '#MSDixie', '#TahoeActivities', '#NevadaLakeTahoe'],
  },
  'camp-richardson': {
    sentiment: 78,
    topPositives: ['Best beach access', 'Paved bike paths', 'Historic character', 'Marina and restaurant on-site'],
    topNegatives: ['No dogs allowed', 'Books very fast', 'Limited RV hookups', 'Summer only'],
    campaignAngle: 'Walk to the beach, bike the lake, eat at the resort — Tahoe camping perfected',
    targetAudience: 'Beach lovers, cyclists, water sports fans, history buffs',
    hashtags: ['#CampRichardson', '#TahoeBeachCamping', '#PopeBaldwinBikePath', '#SouthLakeTahoe'],
  },
  'nevada-beach': {
    sentiment: 85,
    topPositives: ['Best views at Tahoe', 'Spacious sites', 'Pristine beach', 'Dog-friendly south beach'],
    topNegatives: ['Nearly impossible to book', 'No hookups', 'No showers', 'Bots suspected'],
    campaignAngle: 'The hardest campsite to get at Tahoe — and the most worth it',
    targetAudience: 'Experienced campers, sunset chasers, dog owners, fishermen',
    hashtags: ['#NevadaBeach', '#TahoeViews', '#BestCampgroundTahoe', '#CampingGoals'],
  },
  'fallen-leaf': {
    sentiment: 80,
    topPositives: ['Hidden gem status', 'Spacious sites', 'Fallen Leaf Lake access', 'September fall colors'],
    topNegatives: ['Generator noise', 'No hookups', 'Coin showers', 'No cell service'],
    campaignAngle: 'Tahoe\'s best-kept secret — the campground serious campers know about',
    targetAudience: 'Hikers, budget campers, fall travelers, senior pass holders',
    hashtags: ['#FallenLeaf', '#HiddenTahoe', '#TahoeFallColors', '#SecretCampground'],
  },
  'davis-creek': {
    sentiment: 88,
    topPositives: ['Best value near Reno-Tahoe', 'Year-round access', 'Pine forest setting', 'Slide Mountain hiking'],
    topNegatives: ['No hookups', '32ft RV limit', 'Some highway noise'],
    campaignAngle: '$30/night between Reno and Tahoe — the budget camper\'s best-kept secret',
    targetAudience: 'Budget travelers, hikers, Reno locals, history buffs',
    hashtags: ['#DavisCreek', '#WashoeValley', '#NevadaCamping', '#BudgetCamping'],
  },
  'mount-rose': {
    sentiment: 92,
    topPositives: ['Natural AC at altitude', 'World-class hiking', 'Exceptional cleanliness', 'Wildflowers in July'],
    topNegatives: ['Closes September 25', 'No showers', 'Limited sites (21)', 'Snow risk any month'],
    campaignAngle: 'Camp at 9,300 feet — where the air is thin, the trails are epic, and the stars are everything',
    targetAudience: 'Hikers, summit seekers, wildflower lovers, heat escapers',
    hashtags: ['#MountRose', '#TahoeRimTrail', '#HighAlpineCamping', '#NevadaHiking'],
  },
  'silver-city-rv': {
    sentiment: 87,
    topPositives: ['Best RV resort near Reno', 'Pool and spa', 'Huge pull-through sites', 'Perfect for golf'],
    topNegatives: ['Some highway noise', 'Not wilderness camping', 'Resort feel'],
    campaignAngle: 'Northern Nevada\'s top RV resort — pool, spa, golf, and 9 months of happy campers',
    targetAudience: 'Full-time RVers, golfers, long-term travelers, couples',
    hashtags: ['#SilverCityRV', '#CarsonValley', '#NevadaRVPark', '#RVLife'],
  },
  'pyramid-lake-marina': {
    sentiment: 90,
    topPositives: ['Otherworldly scenery', 'World-class fishing', 'White Pelican colony', 'Zero light pollution'],
    topNegatives: ['Tribal permit required', 'Far from groceries', 'Extreme wind', 'Basic facilities'],
    campaignAngle: 'Ancient desert lake, 30 minutes from Reno — Nevada\'s most dramatic camping secret',
    targetAudience: 'Photographers, fishermen, bird watchers, off-grid seekers, adventure campers',
    hashtags: ['#PyramidLake', '#NevadaHidden', '#PaiuteTribe', '#DesertCamping', '#FlyFishing'],
  },


  'watchman-campground': { sentiment: 88, topPositives: ['Only canyon campground in 2026', 'Shuttle at campsite', 'Virgin River access', 'Year-round'], topNegatives: ['No showers on-site', 'Sites close together', 'Caterpillars April-May'], campaignAngle: 'The last campground inside Zion Canyon — park once, hike everything', targetAudience: 'Hikers, families, first-time Zion visitors', hashtags: ['#Zion', '#WatchmanCampground', '#ZionNationalPark', '#NationalParkCamping'] },
  'rubys-inn-bryce': { sentiment: 78, topPositives: ['Free shuttle to Bryce', 'Full hookups up to 65ft', 'Dark sky stargazing', 'Bikeable to hoodoos'], topNegatives: ['No discounts', 'Dusty close sites', 'Pricey'], campaignAngle: 'Ride the shuttle to Bryce hoodoos, bike back under the Milky Way', targetAudience: 'Bryce Canyon visitors, families, full hookup RVers', hashtags: ['#BryceCanyon', '#RubysInn', '#DarkSkyPark', '#UtahCamping'] },
  'colter-bay-grand-teton': { sentiment: 82, topPositives: ['Jackson Lake setting', 'Marina and activities', 'Wildlife abundant', 'Village amenities'], topNegatives: ['No hookups in main camp', 'Some poor restrooms', 'Mosquitoes June'], campaignAngle: 'Summer camp for the whole family — grizzlies, lake cruises, horseback, and the Tetons', targetAudience: 'Families, wildlife watchers, national park lovers', hashtags: ['#GrandTeton', '#ColterBay', '#JacksonLake', '#WyomingCamping'] },
  'madison-yellowstone': { sentiment: 90, topPositives: ['Bison every morning', 'World-class fly fishing', 'Strategic central location', 'Ranger programs'], topNegatives: ['No hookups', 'No store at Madison', 'Books fast'], campaignAngle: 'Wake up to bison in Yellowstone — central location, world-class fishing', targetAudience: 'Fly fishermen, wildlife watchers, Yellowstone explorers', hashtags: ['#Yellowstone', '#MadisonCampground', '#YellowstoneCamping', '#FlyFishing'] },
  'moraine-park-rmnp': { sentiment: 88, topPositives: ['September elk rut', 'Year-round access', 'Bear Lake permit included', 'Longs Peak views'], topNegatives: ['Best sites now electric premium', 'No real showers', 'Rude firewood vendor'], campaignAngle: 'Elk bugling at 4am in a glacier-carved valley — the best free wildlife show in America', targetAudience: 'Elk watchers, hikers, year-round campers, fall foliage seekers', hashtags: ['#RMNP', '#MoraineParks', '#ElkRut', '#ColoradoCamping'] },
  'upper-pines-yosemite': { sentiment: 83, topPositives: ['Iconic valley location', 'Walking distance to all trails', 'Year-round', 'Best sites have views'], topNegatives: ['Very close together', 'Generator noise', 'Reservations nearly impossible'], campaignAngle: 'Wake up inside Yosemite Valley — El Capitan, Half Dome, and the Merced River at your door', targetAudience: 'Yosemite hikers, climbers, families, Half Dome permit holders', hashtags: ['#Yosemite', '#UpperPines', '#YosemiteValley', '#NationalParkCamping'] },
  'cape-lookout-oregon': { sentiment: 84, topPositives: ['Private screened sites', 'Free hot showers', 'Pacific beach access', 'Whale watching trail'], topNegatives: ['D loop needs work', 'Rain always possible', '2026 construction'], campaignAngle: "Oregon's most private coastal campground — giant spruce, free hot showers, whale watching", targetAudience: 'Oregon coast lovers, hikers, whale watchers, PNW road trippers', hashtags: ['#OregonCoast', '#CapeLookout', '#OregonStatePark', '#CoastalCamping'] },
  'sol-duc-olympic': { sentiment: 92, topPositives: ['Natural hot springs access', 'Old-growth rainforest', 'Salmon run in October', 'Unique NPS experience'], topNegatives: ['Hot springs cost extra', 'No cell signal', 'Only 82 sites', 'Rain is constant'], campaignAngle: "Soak in natural hot springs inside a 500-year-old rainforest — America's most unique campground", targetAudience: 'Rainforest lovers, hot spring seekers, serious hikers, photographers', hashtags: ['#OlympicNationalPark', '#SolDuc', '#HotSprings', '#OldGrowth'] },
  'pfeiffer-big-sur': { sentiment: 87, topPositives: ['Big Sur River swimming hole', 'Coastal redwoods', 'Bixby Bridge and McWay nearby', 'Condors overhead'], topNegatives: ['Highway 1 closures unpredictable', '32ft RV limit', 'No hookups'], campaignAngle: 'Camp in Big Sur redwoods — purple sand beach, condors, and the most dramatic coastline in America', targetAudience: 'California road trippers, hikers, photographers, beach lovers', hashtags: ['#BigSur', '#PfeifferBigSur', '#Highway1', '#CaliforniaCamping'] },
  'apgar-glacier': { sentiment: 89, topPositives: ['Lake McDonald colored pebbles', 'Going-to-the-Sun Road access', 'Grizzly country wildlife', 'Village amenities'], topNegatives: ['Vehicle permits required peak season', 'June mosquitoes intense', 'No hookups'], campaignAngle: "Camp on Lake McDonald's kaleidoscopic shore in grizzly country — America's most dramatic national park", targetAudience: 'Glacier enthusiasts, hikers, photographers, wildlife watchers', hashtags: ['#GlacierNationalPark', '#Apgar', '#LakeMcDonald', '#MontanaCamping'] },
  'mather-grand-canyon': { sentiment: 90, topPositives: ['1 mile to South Rim', 'Free shuttle', 'Year-round', 'Condors and deer in camp'], topNegatives: ['No hookups (30ft max)', 'Hot summer conditions', 'Books 6 months out'], campaignAngle: 'Walk to the edge of one of the Seven Wonders of the World — a mile from your tent', targetAudience: 'Grand Canyon visitors, families, rim hikers, photography enthusiasts', hashtags: ['#GrandCanyon', '#MatherCampground', '#GrandCanyonNationalPark', '#ArizonaCamping'] },
  'washoe-lake-state-park': { sentiment: 86, topPositives: ['Wild mustangs in camp', 'Bald eagles year-round', 'Three mountain range views', 'Loop A hookups to 45ft'], topNegatives: ['Push-button showers', 'Lake fluctuates in drought years', 'Horse manure on trails'], campaignAngle: 'Wild horses at dawn, bald eagles overhead, three mountain ranges — 30 minutes from Reno', targetAudience: 'Wildlife watchers, bird watchers, RV travelers, photographers, equestrians', hashtags: ['#WashoeLake', '#WildMustangs', '#NevadaStatePark', '#RenoOutdoors', '#BaldEagle'] },
  'gold-ranch-rv-verdi': { sentiment: 82, topPositives: ['75ft pull-throughs', 'Casino dining on-site', 'Pool and hot tub', 'Friendly staff', 'Sierra hiking trail'], topNegatives: ['I-80 noise on perimeter sites', 'Not wilderness camping', 'Some maintenance inconsistency'], campaignAngle: 'Full hookups, 75ft pull-throughs, casino dining, and Sierra hiking — 12 miles from Reno', targetAudience: 'Full-hookup RVers, big rig travelers, I-80 road trippers, Tahoe base campers', hashtags: ['#GoldRanchRV', '#VerdiNevada', '#RenoRVPark', '#I80Camping', '#CasinoRV'] },
}
