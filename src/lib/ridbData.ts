// Auto-generated from RIDB Full Export CSV — no API key needed
// Source: https://ridb.recreation.gov/downloads/RIDBFullExport_V1_CSV.zip
// Last updated: April 2026

export interface RIDBFacilityData {
  facilityId: string
  facilityName: string
  phone: string
  totalSites: number
  accessibleSites: number
  loops: string[]
  siteTypes: { type: string; count: number }[]
  latitude: number
  longitude: number
}

export const ridbData: Record<string, RIDBFacilityData> = {
  'zephyr-cove': {
    facilityId: '10300216',
    facilityName: "Zephyr Cove RV & Campground",
    phone: "17755894906",
    totalSites: 150,
    accessibleSites: 9,
    loops: ["1", "2", "3", "4"],
    siteTypes: [{"type": "RV Electric", "count": 93}, {"type": "Tent Only", "count": 57}],
    latitude: 39.005593,
    longitude: -119.945821,
  },
  'mount-rose': {
    facilityId: '232186',
    facilityName: "MOUNT ROSE (NV)",
    phone: "530-694-1002",
    totalSites: 26,
    accessibleSites: 1,
    loops: ["Loop 1", "Loop 2"],
    siteTypes: [{"type": "Standard (No Hookups)", "count": 19}, {"type": "Tent Only", "count": 7}],
    latitude: 39.312278,
    longitude: -119.897361,
  },
  'watchman-campground': {
    facilityId: '232445',
    facilityName: "WATCHMAN CAMPGROUND",
    phone: "435-772-3837",
    totalSites: 190,
    accessibleSites: 9,
    loops: ["Loop A", "Loop B", "Loop C", "Loop D", "Loop F", "Zion Group Sites"],
    siteTypes: [{"type": "Electric Hookup", "count": 92}, {"type": "Standard (No Hookups)", "count": 68}, {"type": "Walk-in", "count": 18}, {"type": "Group Site", "count": 6}],
    latitude: 37.198611,
    longitude: -112.986389,
  },
  'upper-pines-yosemite': {
    facilityId: '232447',
    facilityName: "Upper Pines Campground",
    phone: "(209)372-8502",
    totalSites: 240,
    accessibleSites: 10,
    loops: ["Upper Pines"],
    siteTypes: [{"type": "Standard (No Hookups)", "count": 202}, {"type": "RV (No Hookups)", "count": 29}, {"type": "Tent Only", "count": 4}],
    latitude: 37.736111,
    longitude: -119.5625,
  },
  'moraine-park-rmnp': {
    facilityId: '232463',
    facilityName: "Rocky Mountain National Park Moraine Park Campground",
    phone: "970-586-1206",
    totalSites: 258,
    accessibleSites: 17,
    loops: ["A Loop", "B Loop", "C Loop", "D Loop", "E Loop", "Loop A", "Loop E", "Scan and Pay"],
    siteTypes: [{"type": "Standard (No Hookups)", "count": 188}, {"type": "Electric Hookup", "count": 44}, {"type": "Tent Only Electric", "count": 1}],
    latitude: 40.3625,
    longitude: -105.601944,
  },
  'mather-grand-canyon': {
    facilityId: '232490',
    facilityName: "MATHER CAMPGROUND",
    phone: "1-877-444-6777",
    totalSites: 357,
    accessibleSites: 16,
    loops: ["ADA Sites", "Aspen Loop (Sites 1-59)", "Fir Loop (Sites 60-106)", "Hiker-Cycle", "Hiker-Cycler", "Juniper Loop (Sites 107-184)", "Maple Loop (Sites 185-200)", "Oak Loop (Sites 201-264)"],
    siteTypes: [{"type": "Tent Only", "count": 143}, {"type": "RV (No Hookups)", "count": 76}, {"type": "Standard (No Hookups)", "count": 60}, {"type": "Group Site", "count": 7}, {"type": "Equestrian Nonelectric", "count": 2}],
    latitude: 36.049722,
    longitude: -112.120469,
  },
  'nevada-beach': {
    facilityId: '232768',
    facilityName: "Nevada Beach Campground",
    phone: "775-588-5562",
    totalSites: 54,
    accessibleSites: 1,
    loops: ["HOST", "Nevada Beach Campground and Day Use Pavilion"],
    siteTypes: [{"type": "Standard (No Hookups)", "count": 54}],
    latitude: 38.981464,
    longitude: -119.95154,
  },
  'fallen-leaf': {
    facilityId: '232769',
    facilityName: "FALLEN LEAF CAMPGROUND",
    phone: "530-544-0426",
    totalSites: 208,
    accessibleSites: 6,
    loops: ["AREA FALLEN LEAF CAMPGROUND", "HOST", "Office", "Yurts"],
    siteTypes: [{"type": "Standard (No Hookups)", "count": 198}, {"type": "Cabin", "count": 6}],
    latitude: 38.926376,
    longitude: -120.046995,
  },
  'apgar-glacier': {
    facilityId: '251720',
    facilityName: "Apgar Campground",
    phone: "",
    totalSites: 0,
    accessibleSites: 0,
    loops: [],
    siteTypes: [],
    latitude: 46.214686,
    longitude: -115.535675,
  },
  'sol-duc-olympic': {
    facilityId: '251906',
    facilityName: "SOL DUC HOT SPRINGS RESORT CAMPGROUND",
    phone: "1 (888) 896-3818",
    totalSites: 97,
    accessibleSites: 3,
    loops: ["20' RV Site", "26' RV Site", "36' RV Site", "36'SLIDE OUT RV Site", "GROUP", "Loop A", "Loop B"],
    siteTypes: [{"type": "Standard (No Hookups)", "count": 78}, {"type": "RV Electric", "count": 17}, {"type": "Group Standard Nonelectric", "count": 1}],
    latitude: 47.966753,
    longitude: -123.857825,
  },
  'colter-bay-grand-teton': {
    facilityId: '258830',
    facilityName: "Colter Bay Campground",
    phone: "307-543-2811",
    totalSites: 360,
    accessibleSites: 14,
    loops: ["A", "B", "C", "D", "E", "F", "G", "Group"],
    siteTypes: [{"type": "Standard (No Hookups)", "count": 283}, {"type": "Tent Only", "count": 39}, {"type": "Electric Hookup", "count": 13}, {"type": "Group Standard Nonelectric", "count": 10}, {"type": "RV (No Hookups)", "count": 1}],
    latitude: 43.906227,
    longitude: -110.640349,
  },
  'madison-yellowstone': {
    facilityId: '259305',
    facilityName: "Madison Campground",
    phone: "(307) 344-7311",
    totalSites: 0,
    accessibleSites: 0,
    loops: [],
    siteTypes: [],
    latitude: 44.645422,
    longitude: -110.861303,
  },
}
