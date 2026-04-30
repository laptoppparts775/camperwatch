/**
 * RIDB (Recreation Information Database) API client
 * Docs: https://ridb.recreation.gov/docs
 * All requests are proxied through /api/ridb to keep the API key server-side.
 */

export interface RIDBFacility {
  FacilityID: string
  FacilityName: string
  FacilityDescription: string
  FacilityTypeDescription: string
  FacilityPhone: string
  FacilityEmail: string
  FacilityReservationURL: string
  FacilityLatitude: number
  FacilityLongitude: number
  FacilityADAAccess: string
  GEOJSON: {
    TYPE: string
    COORDINATES: [number, number]
  }
  ENTITYMEDIA: RIDBMedia[]
  CAMPSITE?: RIDBCampsite[]
}

export interface RIDBMedia {
  MediaType: string
  EntityMediaID: string
  URL: string
  Title: string
  Description: string
  IsPrimary: boolean
}

export interface RIDBCampsite {
  CampsiteID: string
  CampsiteName: string
  CampsiteType: string
  TypeOfUse: string
  Loop: string
  CampsiteAccessible: boolean
  attributes: RIDBAttribute[]
}

export interface RIDBAttribute {
  AttributeName: string
  AttributeValue: string
}

export interface RIDBSearchResult {
  RECDATA: RIDBFacility[]
  METADATA: {
    RESULTS: {
      CURRENT_COUNT: number
      TOTAL_COUNT: number
    }
    PARAMETERS: Record<string, string>
    SEARCH_PARAMETERS: Record<string, string>
  }
}

export interface RIDBCampsiteResult {
  RECDATA: RIDBCampsite[]
  METADATA: {
    RESULTS: {
      CURRENT_COUNT: number
      TOTAL_COUNT: number
    }
  }
}

/**
 * Search RIDB for campground facilities by name or keyword.
 * Proxied through /api/ridb to protect the API key.
 */
export async function searchRIDBFacilities(query: string, limit = 10): Promise<RIDBFacility[]> {
  const params = new URLSearchParams({
    endpoint: 'facilities',
    query,
    limit: String(limit),
    activity: 'CAMPING',
  })
  const res = await fetch(`/api/ridb?${params}`)
  if (!res.ok) return []
  const data: RIDBSearchResult = await res.json()
  return data.RECDATA ?? []
}

/**
 * Get a specific facility by ID.
 */
export async function getRIDBFacility(facilityId: string): Promise<RIDBFacility | null> {
  const params = new URLSearchParams({
    endpoint: `facilities/${facilityId}`,
  })
  const res = await fetch(`/api/ridb?${params}`)
  if (!res.ok) return null
  const data = await res.json()
  return data ?? null
}

/**
 * Get all campsites for a facility.
 */
export async function getRIDBCampsites(facilityId: string): Promise<RIDBCampsite[]> {
  const params = new URLSearchParams({
    endpoint: `facilities/${facilityId}/campsites`,
    limit: '500',
  })
  const res = await fetch(`/api/ridb?${params}`)
  if (!res.ok) return []
  const data: RIDBCampsiteResult = await res.json()
  return data.RECDATA ?? []
}

/**
 * Known RIDB facility IDs for CamperWatch campgrounds.
 * These are the federal campgrounds that exist in the RIDB database.
 * Private campgrounds (KOA, RV resorts, state parks) are NOT in RIDB.
 * IDs are verified from Recreation.gov booking URLs in data.ts.
 */
export const RIDB_FACILITY_IDS: Record<string, string> = {
  // Lake Tahoe — federal
  'zephyr-cove':          '10097082',
  'nevada-beach':         '232454',
  'fallen-leaf':          '232450',
  'mount-rose':           '232186',
  // National expansion — NPS / USFS
  'watchman-campground':  '232445',  // Zion NP
  'colter-bay-grand-teton': '258830', // Grand Teton NP
  'madison-yellowstone':  '232493',  // Yellowstone NP
  'moraine-park-rmnp':    '232463',  // RMNP
  'upper-pines-yosemite': '232447',  // Yosemite NP
  'sol-duc-olympic':      '233116',  // Olympic NP
  'apgar-glacier':        '232487',  // Glacier NP
  'mather-grand-canyon':  '232489',  // Grand Canyon NP
}

/**
 * Format a campsite type for display.
 */
export function formatCampsiteType(type: string): string {
  const map: Record<string, string> = {
    'STANDARD NONELECTRIC': 'Tent / No Hookups',
    'ELECTRIC HOOKUP':       'Electric Hookup',
    'FULL HOOKUP':           'Full Hookups',
    'WALK TO':               'Walk-in',
    'GROUP STANDARD NONELECTRIC': 'Group Site',
    'EQUESTRIAN NONELECTRIC': 'Equestrian',
    'RV NONELECTRIC':        'RV (No Hookups)',
    'TENT ONLY NONELECTRIC': 'Tent Only',
  }
  return map[type] ?? type
}
