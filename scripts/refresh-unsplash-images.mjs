/**
 * CamperWatch — Unsplash Image Refresher
 * Fetches 4 unique, relevant landscape photos per campground
 * and patches src/lib/data.ts in place.
 *
 * Usage (from repo root):
 *   NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=<key> node scripts/refresh-unsplash-images.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, '../src/lib/data.ts');

const ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
if (!ACCESS_KEY) {
  console.error('ERROR: NEXT_PUBLIC_UNSPLASH_ACCESS_KEY is not set');
  process.exit(1);
}

// Slugs already patched — skip them on resume
const SKIP_SLUGS = new Set([
  'tahoe-valley',
  'lake-tahoe-koa',
  'zephyr-cove',
  'camp-richardson',
  'nevada-beach',
  'fallen-leaf',
  'davis-creek',
  'mount-rose',
]);

const CAMPGROUNDS = [
  {
    slug: 'tahoe-valley',
    queries: ['South Lake Tahoe pine forest campground RV', 'Lake Tahoe blue water California shore', 'Sierra Nevada mountain campfire evening', 'RV campsite hookups pine trees California mountains'],
    titles: ['Tahoe Valley RV Sites', 'Lake Tahoe Shore Views', 'Evening Campfire at Tahoe Valley', 'Full Hookup Sites Under the Pines'],
    alts: ['Tahoe Valley Campground RV sites among tall Sierra Nevada pine trees', 'Crystal blue Lake Tahoe shore and pine forest South Lake Tahoe', 'Campfire at dusk in Sierra Nevada pine forest at Tahoe Valley', 'Full hookup RV campsite under towering pines South Lake Tahoe CA'],
    captions: ['Full hookup RV sites under towering pines — year round', 'Walking distance to Lake Tahoe beaches', 'Propane fires allowed year-round (no wood May–Nov)', 'One of the only year-round campgrounds at Lake Tahoe'],
  },
  {
    slug: 'lake-tahoe-koa',
    queries: ['creek camping Sierra Nevada pine forest tent', 'vintage airstream trailer glamping forest', 'campground swimming pool mountain summer', 'family camping Lake Tahoe summer California'],
    titles: ['KOA Tent Sites by Echo Creek', 'Vintage Airstream at Lake Tahoe KOA', 'Heated Pool at Lake Tahoe KOA', 'Family Camping at Lake Tahoe KOA'],
    alts: ['Tent camping beside a creek in Sierra Nevada pine forest', 'Vintage Airstream trailer parked in pine forest glamping', 'Heated outdoor pool surrounded by pine trees campground', 'Family camping summer at Lake Tahoe KOA Journey'],
    captions: ['Shaded tent sites alongside Echo Creek', 'Vintage Airstream lodging — books out weeks in advance', 'Heated pool open all season — rare at Tahoe campgrounds', 'Family-friendly with unique lodging options'],
  },
  {
    slug: 'zephyr-cove',
    queries: ['Lake Tahoe Nevada sandy beach turquoise water', 'marina dock boats mountain lake', 'full hookup RV campground Nevada mountains', 'lakeside campfire pine forest Nevada evening'],
    titles: ['Zephyr Cove Beach — Lake Tahoe', 'Zephyr Cove Marina on Lake Tahoe', 'Full Hookup RV Sites at Zephyr Cove', 'Lakeside Campfire at Zephyr Cove'],
    alts: ['Crystal clear Lake Tahoe at Zephyr Cove sandy beach Nevada', 'Marina on Lake Tahoe with boats and Sierra Nevada backdrop', 'Full hookup RV sites at Zephyr Cove campground Nevada', 'Campfire by pine trees with Lake Tahoe view Nevada'],
    captions: ['Beach is a 2-minute walk across Highway 50', 'Marina with boat and watercraft rentals on Lake Tahoe', 'Full hookup sites accommodate rigs up to 50ft', 'Some sites have glimpses of the lake through the pines'],
  },
  {
    slug: 'camp-richardson',
    queries: ['lakeside pine forest camping California beach', 'paved bicycle path lake shoreline California', 'tent camping forest California state park spacious', 'historic resort South Lake Tahoe pine trees'],
    titles: ['Camp Richardson on Lake Tahoe Shore', 'Bike Path Along the Tahoe Shore', 'Tent Sites at Camp Richardson', 'Historic Camp Richardson Resort'],
    alts: ['Pine forest campsite steps from Lake Tahoe at Camp Richardson', 'Paved bike path along Lake Tahoe shoreline near Camp Richardson', 'Spacious tent camping in tall Sierra Nevada pine forest', 'Historic resort buildings in South Lake Tahoe pines'],
    captions: ['Steps from Lake Tahoe beach — walk out your door', 'Flat paved bike paths along the entire south shore', 'Spacious tent sites steps from the beach', 'Historic resort with unique character dating back decades'],
  },
  {
    slug: 'nevada-beach',
    queries: ['Nevada wide sandy beach Lake Tahoe National Forest', 'Jeffrey pine forest blue sky Nevada campground', 'Lake Tahoe sunrise mist morning water', 'paved RV campsite dry camping Nevada lake'],
    titles: ['Nevada Beach Wide Sandy Shore', 'Jeffrey Pines at Nevada Beach', 'Sunrise at Nevada Beach Campground', 'Spacious RV Sites — Dry Camping Only'],
    alts: ['Nevada Beach wide sandy shore on Lake Tahoe Nevada', 'Jeffrey pine forest and blue sky at Nevada Beach Campground', 'Sunrise mist over Lake Tahoe from Nevada Beach campground', 'Spacious paved RV aprons at Nevada Beach dry camping only'],
    captions: ['Nearly a mile of wide sandy beach — 0.3 mi walk from sites', 'Spacious paved sites shaded by Jeffrey pines', 'Best sunsets at Tahoe — sites face west', 'Spacious paved aprons fit RVs up to 45ft — dry camping only'],
  },
  {
    slug: 'fallen-leaf',
    queries: ['alpine lake Sierra Nevada California hidden gem', 'aspen trees fall golden colors Tahoe California', 'large tent camping national forest tall pines California', 'mountain lake reflection forest National Forest California'],
    titles: ["Fallen Leaf Lake — Tahoe's Hidden Gem", 'Fall Aspen Gold at Fallen Leaf', 'Large Tent Sites in the National Forest', 'Alpine Lake in the Sierra Nevada'],
    alts: ['Fallen Leaf Lake surrounded by Sierra Nevada pines California', 'Golden aspen trees fall foliage near Fallen Leaf campground', 'Large tent site in tall National Forest pines near Fallen Leaf Lake', 'Alpine lake in National Forest near South Lake Tahoe California'],
    captions: ['Calmer, less crowded, and equally stunning as Tahoe', 'Aspens turn gold in September — far less crowded too', 'Sites noticeably larger than other Tahoe campgrounds', 'The hidden alpine gem near South Lake Tahoe'],
  },
  {
    slug: 'davis-creek',
    queries: ['Jeffrey pine forest Nevada state park campsite mature trees', 'Washoe Valley Nevada mountain landscape views desert', 'pine forest hiking trail Nevada Sierra Nevada', 'Nevada desert mountain sunset camping evening'],
    titles: ['Davis Creek Pine Forest Sites', 'Washoe Valley Views from Davis Creek', 'Hiking Trails from Davis Creek', 'Evenings at Davis Creek Campground'],
    alts: ['Campsite in mature Jeffrey pine forest Davis Creek Regional Park Nevada', 'Views of Washoe Valley and Carson Range from Davis Creek Nevada', 'Hiking trail through pine forest at Davis Creek Regional Park', 'Evening at Nevada state park campground with mountain views'],
    captions: ['Tall mature Jeffrey pines provide excellent shade', 'Incredible views of Washoe Lake and Slide Mountain', 'Trails connect directly to the national forest', 'Evenings are cool and peaceful with mountain views'],
  },
  {
    slug: 'mount-rose',
    queries: ['high alpine campsite elevation Nevada mountain', 'alpine meadow wildflowers mountain Nevada summer bloom', 'hiking trail wildflowers mountain meadow Nevada', 'high elevation camping Sierra Nevada peaks'],
    titles: ['Mount Rose High Alpine Campground', 'Alpine Meadow Views at Mount Rose', 'Tahoe Rim Trail Wildflowers', 'High Elevation Camping at Mount Rose'],
    alts: ['High alpine campsite at 9300 feet on Mount Rose Nevada', 'Alpine meadow and mountain views near Mount Rose Campground NV', 'Wildflowers on Tahoe Rim Trail near Mount Rose in summer', 'High elevation camping in Sierra Nevada at Mount Rose Nevada'],
    captions: ['Natural AC at altitude — 20°F cooler than Reno in summer', 'Stunning wildflower meadows peak in July', 'Direct trailhead access to Tahoe Rim Trail and Mt. Rose Summit', 'High alpine camping at 9,300 feet elevation'],
  },
  {
    slug: 'silver-city-rv',
    queries: ['Carson Valley Nevada RV resort mountains desert landscape', 'Nevada desert mountain sunrise dramatic landscape', 'full hookup pull-through RV park western Nevada', 'outdoor pool RV resort western Nevada desert'],
    titles: ['Silver City RV Resort Carson Valley', 'Desert Mountain Views at Silver City', 'Pull-Through Sites at Silver City', 'Silver City Pool and Spa'],
    alts: ['Silver City RV Resort in Carson Valley Nevada with mountain views', 'Carson Valley Nevada desert mountains at sunrise near RV resort', 'Full hookup pull-through RV sites at Silver City Nevada resort', 'Pool and amenities at Silver City RV Resort western Nevada'],
    captions: ["Northern Nevada's top-rated RV resort", 'Carson Valley and Sierra Nevada views from every site', 'Pull-through sites accommodate the largest rigs up to 70ft', 'Pool and spa open all season — resort-level amenities'],
  },
  {
    slug: 'pyramid-lake-marina',
    queries: ['tufa rock formations desert lake Nevada ancient', 'turquoise desert lake Nevada Great Basin landscape', 'fly fishing trout desert lake Nevada', 'Great Basin desert lake sunset vivid colors'],
    titles: ['Pyramid Lake Tufa Formations Nevada', 'Turquoise Waters of Pyramid Lake', 'World-Class Fishing at Pyramid Lake', 'Pyramid Lake Sunset Great Basin'],
    alts: ['Ancient tufa formations rising from vivid turquoise Pyramid Lake Nevada', 'Otherworldly turquoise desert lake Pyramid Lake Nevada Paiute lands', 'Fly fishing for Lahontan cutthroat trout at Pyramid Lake Nevada', 'Sunset reflection on Pyramid Lake Nevada Great Basin desert'],
    captions: ['The Pyramid rock formation rising 300ft from the lake', 'Otherworldly turquoise water and tufa towers', 'World-famous for Lahontan cutthroat trout — up to 20 lbs', 'Sunsets at Pyramid Lake are legendary — vivid reds and purples'],
  },
  {
    slug: 'watchman-campground',
    queries: ['Zion National Park red sandstone canyon sunrise Utah', 'Virgin River Zion narrow canyon red rock Utah', 'camping Zion National Park Utah desert landscape', 'Zion canyon starry night sky dark skies desert'],
    titles: ['Zion Canyon Sandstone at Sunrise', 'Virgin River Through Zion Canyon', 'Camping in Zion National Park', 'Stargazing in Zion Canyon'],
    alts: ['Towering red sandstone cliffs of Zion National Park at sunrise Utah', 'Virgin River flowing through Zion Canyon narrow red rock walls', 'Desert camping surrounded by Navajo sandstone Zion National Park', 'Dark starry night sky above 2000 foot canyon walls Zion'],
    captions: ['The Watchman peak rises directly above camp', 'The Narrows — wade the Virgin River into the slot canyon', 'Sites surrounded by iconic Navajo sandstone formations', 'Dark skies above 2,000-foot canyon walls'],
  },
  {
    slug: 'rubys-inn-bryce',
    queries: ['Bryce Canyon hoodoo orange red formations Utah landscape', 'ponderosa pine forest campfire Utah night', 'Bryce Canyon National Park rim sunrise amphitheater Utah', 'RV camping ponderosa pine forest Utah mountains'],
    titles: ["Bryce Canyon Hoodoos from Ruby's Inn", "Campfire Under Pines at Ruby's Inn", 'Bryce Canyon Sunrise from the Rim', "Ruby's Inn RV Sites in the Pines"],
    alts: ['Orange and red hoodoo rock formations at Bryce Canyon National Park Utah', 'Campfire under ponderosa pine trees at Bryce Canyon base camp Utah', 'Bryce Canyon amphitheater sunrise from the rim Utah', "RV sites in ponderosa pine forest near Bryce Canyon Utah"],
    captions: ['Half a mile to these iconic hoodoos — free shuttle from camp', 'Old West atmosphere under towering ponderosa pines', 'Bryce Canyon sunrise is worth the 5am wake-up call', 'Over 150 full hookup RV sites with pull-throughs up to 65ft'],
  },
  {
    slug: 'colter-bay-grand-teton',
    queries: ['Grand Teton mountains Jackson Lake Wyoming sunrise reflection', 'lodgepole pine forest camping Grand Teton National Park', 'moose wildlife meadow Grand Teton National Park Wyoming', 'Jackson Lake Wyoming mountain kayak water'],
    titles: ['Grand Tetons Over Jackson Lake', 'Colter Bay Tent Sites in the Pines', 'Wildlife at Colter Bay Grand Teton', 'Jackson Lake at Colter Bay'],
    alts: ['Grand Teton mountain range reflected in Jackson Lake at sunrise Wyoming', 'Tent camping in lodgepole pine forest Grand Teton National Park', 'Moose and wildlife in Grand Teton National Park Wyoming meadow', 'Jackson Lake with Grand Teton peaks Wyoming'],
    captions: ['Mount Moran reflected in Jackson Lake — walk from your site', '349 sites spread through towering lodgepole pine forest', 'Grizzly bears and moose are commonly spotted near camp', 'Ranger programs and lakeside campfire evenings'],
  },
  {
    slug: 'madison-yellowstone',
    queries: ['bison herd Yellowstone National Park valley grazing', 'Old Faithful geyser eruption steam Yellowstone', 'fly fishing mountain river clear Wyoming national park', 'lodgepole pine forest camping Yellowstone'],
    titles: ['Bison Herd at Madison Yellowstone', 'Old Faithful 14 Miles from Camp', 'Madison River Fly Fishing', 'Madison Campground Yellowstone'],
    alts: ['Bison herd grazing in Yellowstone National Park Madison Valley at dusk', 'Old Faithful geyser eruption with steam plume Yellowstone Wyoming', 'Fly fishing in clear mountain river Wyoming national park', 'Camping in lodgepole pine forest Yellowstone National Park Wyoming'],
    captions: ['Bison and elk graze through Madison Valley every morning', 'Old Faithful is 14 miles south — the closest campground to it', 'Madison River confluence — world-class brown trout fishing', 'Central location with access to the entire park'],
  },
  {
    slug: 'moraine-park-rmnp',
    queries: ['elk herd meadow Rocky Mountain National Park Colorado sunrise', 'Longs Peak Colorado Rocky Mountain summit landscape', 'aspen trees fall golden colors Colorado Rockies autumn', 'tent camping Colorado mountain national park forest sites'],
    titles: ['Elk Herd at Moraine Park Dawn', 'Longs Peak from Moraine Park', 'Fall Colors at Moraine Park RMNP', 'Moraine Park Glacier Valley Sites'],
    alts: ['Elk herd grazing in Moraine Park meadow Rocky Mountain National Park', 'Longs Peak 14259ft above Moraine Park campground Colorado', 'Golden aspen trees fall foliage Rocky Mountain National Park Colorado', 'Tent sites in Moraine Park glacier-carved valley Colorado camping'],
    captions: ['Elk graze in the meadow every morning and evening — right from camp', '14,259ft Longs Peak visible from many campsites', 'September aspen gold — peak elk rut and no crowds', '244 sites in glacier-carved valley at 8,160 feet elevation'],
  },
  {
    slug: 'upper-pines-yosemite',
    queries: ['Half Dome granite Yosemite Valley pine forest California', 'El Capitan Yosemite Valley granite wall vertical California', 'Merced River Yosemite Valley California clear water', 'camping Yosemite Valley forest night campfire California'],
    titles: ['Half Dome from Upper Pines', 'El Capitan from Upper Pines', 'Merced River at Upper Pines', 'Evening Campfire Upper Pines Yosemite'],
    alts: ['Half Dome granite peak above Yosemite Valley pine forest California', 'El Capitan 3000ft granite wall above Yosemite Valley floor', 'Merced River flowing through Yosemite Valley near Upper Pines', 'Campfire at night in Yosemite Valley forest Upper Pines campground'],
    captions: ['Half Dome visible through the pines from your campsite', 'El Capitan looms 3,000 feet above the valley floor', 'The Merced River flows alongside the campground', 'Campfires 5pm–10pm in summer; anytime Oct–Apr'],
  },
  {
    slug: 'cape-lookout-oregon',
    queries: ['Oregon coast beach Pacific Ocean sea stacks state park', 'Sitka spruce old-growth forest Oregon coast', 'yurt camping Oregon coast state park forest accommodation', 'Pacific Ocean mist fog Oregon coast morning'],
    titles: ['Cape Lookout Pacific Beach', 'Old-Growth Spruce at Cape Lookout', 'Yurt Camping at Cape Lookout', 'Pacific Mist at Cape Lookout'],
    alts: ['Cape Lookout Oregon coast wide beach with sea stacks Pacific Ocean', 'Ancient Sitka spruce old-growth forest Cape Lookout State Park Oregon', 'Yurt camping in Oregon coast state park forest', 'Pacific mist and surf Cape Lookout State Park morning Oregon'],
    captions: ['Wide Pacific beach — camp is steps from the surf', 'Private sites screened by ancient Sitka spruce and hemlock', 'Cozy yurts sleep 5 — perfect for rainy Oregon coast nights', 'Waking up to Pacific mist and the sound of surf'],
  },
  {
    slug: 'sol-duc-olympic',
    queries: ['Olympic National Park old-growth rainforest moss temperate Washington', 'natural hot spring mineral pool forest outdoor', 'glacial teal green river temperate rainforest Washington', 'old-growth Douglas fir giant trees Washington Olympic'],
    titles: ['Sol Duc Old-Growth Rainforest', 'Sol Duc Hot Springs Mineral Pools', 'Sol Duc River Through the Forest', '500-Year-Old Forest at Sol Duc'],
    alts: ['Ancient moss-covered old-growth rainforest Olympic National Park Washington', 'Sol Duc natural hot spring mineral pools surrounded by forest', 'Teal glacial Sol Duc River through temperate rainforest Washington', '500-year-old Douglas fir trees Olympic National Park rainforest'],
    captions: ['500-year-old Douglas fir dripping with moss above every campsite', 'Natural thermal mineral pools — campers get access (fee)', 'Teal-green glacial Sol Duc River flows beside the campground', 'The most lush forest environment of any US campground'],
  },
  {
    slug: 'pfeiffer-big-sur',
    queries: ['Big Sur coastal redwood forest California state park river', 'Bixby Creek Bridge Pacific Coast Highway Big Sur California', 'Big Sur River swimming hole California summer', 'California condor bird soaring ocean cliffs coast'],
    titles: ['Redwood Grove at Pfeiffer Big Sur', 'Bixby Creek Bridge Big Sur', 'Big Sur River Swimming Hole', 'California Condors Over Big Sur'],
    alts: ['Coastal redwood grove at Pfeiffer Big Sur State Park California', 'Bixby Creek Bridge on Pacific Coast Highway Big Sur California', 'Big Sur River swimming hole inside Pfeiffer Big Sur campground', 'California condor soaring over Big Sur coast Pacific cliffs'],
    captions: ['Towering coastal redwoods shade every site at Pfeiffer Big Sur', 'Bixby Creek Bridge — 5 miles from your campsite', 'The Big Sur River swimming hole is right inside the campground', 'California condors soar over the cliffs — look up'],
  },
  {
    slug: 'apgar-glacier',
    queries: ['Glacier National Park Lake McDonald colored pebbles turquoise Montana', 'Going-to-the-Sun Road mountain scenery Montana dramatic landscape', 'grizzly bear Glacier National Park Montana wildlife meadow', 'old-growth forest turquoise mountain lake Montana camping'],
    titles: ['Lake McDonald at Apgar Campground', 'Going-to-the-Sun Road Glacier NP', 'Grizzly Bear Glacier National Park', 'Old-Growth Forest at Apgar Montana'],
    alts: ['Lake McDonald kaleidoscopic colored pebbles Glacier National Park Montana', 'Going-to-the-Sun Road dramatic mountain scenery Glacier National Park', 'Grizzly bear in Glacier National Park Montana meadow', 'Old-growth forest and turquoise mountain lake Apgar campground Montana'],
    captions: ["Lake McDonald's famous colored pebble shore — steps from camp", 'Going-to-the-Sun Road west entrance is 1 mile from camp', 'Both grizzly and black bears are active — bear spray required', '194 sites in old-growth forest with Lake McDonald nearby'],
  },
  {
    slug: 'mather-grand-canyon',
    queries: ['Grand Canyon South Rim sunrise orange rock layers Arizona', 'Grand Canyon panoramic view Mather Point Arizona vast', 'ponderosa pine forest campground Grand Canyon rim Arizona', 'Colorado River Grand Canyon inner gorge Arizona vista'],
    titles: ['Grand Canyon South Rim Sunrise', 'Mather Point Grand Canyon View', 'Ponderosa Pines at Mather Campground', 'Colorado River from the South Rim'],
    alts: ['Grand Canyon South Rim at sunrise with orange rock layers Arizona', 'Mather Point Grand Canyon panoramic view from South Rim Arizona', 'Ponderosa pine forest campground at Grand Canyon South Rim', 'Colorado River from Grand Canyon inner gorge South Rim Arizona'],
    captions: ['Sunrise from the South Rim — a mile walk from your campsite', 'Mather Point — most photographed Grand Canyon viewpoint — 1 mile', '327 sites in a ponderosa pine forest on the South Rim', 'The Colorado River carved this 1-mile-deep canyon over 6 million years'],
  },
  {
    slug: 'washoe-lake-state-park',
    queries: ['wild horses mustang Nevada mountain high desert roaming', 'Nevada mountain valley lake Sierra Nevada panoramic views', 'Nevada state park campsite hookups mountain view desert', 'bald eagle flying high desert lake Nevada bird'],
    titles: ['Wild Mustangs at Washoe Lake', 'Washoe Lake Valley Panoramic Views', 'Washoe Lake State Park Campsite', 'Bald Eagles at Washoe Lake'],
    alts: ['Wild mustangs grazing near Washoe Lake with Sierra Nevada mountains', 'Washoe Lake valley views with three mountain ranges Nevada', 'Campsite with covered picnic table and mountain views Nevada state park', 'Bald eagle flying over Washoe Lake Nevada high desert'],
    captions: ['Free-roaming wild mustangs visit the campground and lakeshore', 'Panoramic views of three mountain ranges from every campsite', 'Loop A sites have water and electric hookups with pull-throughs', 'Bald eagles and white pelicans are year-round residents'],
  },
  {
    slug: 'gold-ranch-rv-verdi',
    queries: ['Sierra Nevada foothills western Nevada mountains landscape', 'paved full hookup RV resort Nevada trees', 'outdoor pool hot tub RV resort Nevada western', 'hiking trail Sierra Nevada foothills Nevada outdoor'],
    titles: ['Sierra Nevada Views from Verdi NV', 'Gold Ranch Full Hookup RV Sites', 'Gold Ranch Pool and Hot Tub', 'Sierra Foothills Trail from Gold Ranch'],
    alts: ['Sierra Nevada mountains from Verdi Nevada near Reno western foothills', 'Paved full hookup RV sites at Nevada casino RV resort with mature trees', 'Outdoor pool and hot tub at RV resort western Nevada', 'Hiking trail through Sierra Nevada foothills near Verdi Nevada'],
    captions: ['Sierra Nevada mountains on three sides — 12 miles west of Reno', '105 paved sites — all full hookup, 30/50 amp, water, sewer', 'Pool and hot tub on-site — rare amenity for a Reno-area RV park', 'Trail from the campground leads directly into Sierra Nevada foothills'],
  },
];

// ─── Unsplash fetch ──────────────────────────────────────────────────────────
async function searchUnsplash(query, page = 1) {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=8&page=${page}&orientation=landscape&content_filter=high`;
  const res = await fetch(url, { headers: { Authorization: `Client-ID ${ACCESS_KEY}` } });
  if (!res.ok) throw new Error(`Unsplash ${res.status}: ${await res.text()}`);
  return (await res.json()).results || [];
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ─── Patch images block for a slug using bracket matching ────────────────────
function patchImagesBlock(content, slug, newBlock) {
  const marker = content.indexOf(`slug: '${slug}'`) !== -1
    ? content.indexOf(`slug: '${slug}'`)
    : content.indexOf(`slug: "${slug}"`);
  if (marker === -1) throw new Error(`slug '${slug}' not found`);

  const start = content.indexOf('images: [', marker);
  if (start === -1) throw new Error(`images: [ not found for '${slug}'`);

  let depth = 0, i = start + 'images: '.length;
  while (i < content.length) {
    if (content[i] === '[') depth++;
    if (content[i] === ']') { depth--; if (depth === 0) break; }
    i++;
  }

  return content.slice(0, start) + newBlock + content.slice(i + 1);
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  const used = new Set();
  const fetched = {};

  const toProcess = CAMPGROUNDS.filter(cg => !SKIP_SLUGS.has(cg.slug));
  console.log(`\nFetching images for ${toProcess.length} campgrounds (skipping ${SKIP_SLUGS.size} already done)...\n`);

  for (const cg of toProcess) {
    const photoIds = [];

    for (let i = 0; i < 4; i++) {
      const q = cg.queries[i];
      let picked = null;

      for (let pg = 1; pg <= 4 && !picked; pg++) {
        const results = await searchUnsplash(q, pg);
        for (const p of results) {
          if (!used.has(p.id)) { picked = p.id; used.add(p.id); break; }
        }
        if (!picked) await sleep(200);
      }

      if (!picked) {
        const fallback = await searchUnsplash(q);
        picked = fallback[0]?.id ?? null;
        if (picked) console.warn(`  ⚠  ${cg.slug}[${i+1}] duplicate accepted`);
        else console.error(`  ✗  ${cg.slug}[${i+1}] NO RESULT for "${q}"`);
      }

      photoIds.push(picked);
      if (picked) console.log(`  ✓  ${cg.slug} [${i+1}/4] photo-${picked}`);
      await sleep(1500); // ~40 req/hr — stays under 50/hr demo limit
    }

    fetched[cg.slug] = photoIds;
    await sleep(2000); // extra pause between campgrounds
  }

  console.log('\nPatching src/lib/data.ts...\n');
  let content = fs.readFileSync(DATA_FILE, 'utf8');

  for (const cg of toProcess) {
    const ids = fetched[cg.slug];
    if (!ids || ids.filter(Boolean).length < 4) {
      console.warn(`  ⚠  Skipping ${cg.slug}`);
      continue;
    }

    const lines = ids.map((id, i) =>
      `      { url: 'https://images.unsplash.com/photo-${id}?w=1200&q=80', alt: '${cg.alts[i]}', title: '${cg.titles[i]}', caption: '${cg.captions[i]}' }`
    );
    const newBlock = `images: [\n${lines.join(',\n')},\n    ]`;

    try {
      content = patchImagesBlock(content, cg.slug, newBlock);
      console.log(`  ✓  Patched ${cg.slug}`);
    } catch (e) {
      console.error(`  ✗  ${cg.slug}: ${e.message}`);
    }
  }

  fs.writeFileSync(DATA_FILE, content, 'utf8');
  console.log('\n✅ data.ts updated. Run: npm run build\n');
}

main().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
