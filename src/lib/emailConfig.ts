/**
 * Email configuration — sender addresses, inbound routing, brand constants.
 *
 * SENDER SCHEME (locked May 2 2026):
 *   bookings@camperwatch.org  — booking confirmations (camper + owner)
 *   alerts@camperwatch.org    — availability alerts (Phase 1.5, outbound only)
 *   info@camperwatch.org      — contact-form auto-replies, general system mail
 *   noreply@camperwatch.org   — system messages owners shouldn't reply to
 *
 * REPLY-TO POLICY (locked):
 *   - Booking confirmations to camper -> Reply-To: owner's email (owner owns guest comms)
 *   - Booking confirmations to owner  -> Reply-To: camper's email (so owner can reach guest)
 *   - All other system mail           -> Reply-To: info@camperwatch.org
 */

export const BRAND = {
  name: 'CamperWatch',
  domain: 'camperwatch.org',
  url: 'https://camperwatch.org',
  primaryColor: '#15803d',     // green-700
  primaryColorDark: '#14532d', // green-900
  textColor: '#111827',        // gray-900
  mutedColor: '#6b7280',       // gray-500
  backgroundColor: '#f9fafb',  // gray-50
}

export const SENDERS = {
  bookings:  `CamperWatch Bookings <bookings@${BRAND.domain}>`,
  alerts:    `CamperWatch Alerts <alerts@${BRAND.domain}>`,
  info:      `CamperWatch <info@${BRAND.domain}>`,
  noreply:   `CamperWatch <noreply@${BRAND.domain}>`,
} as const

/**
 * Inbound routing rules.
 * When an email arrives at one of our addresses, the webhook handler
 * looks up the destination Gmails here and forwards via Resend.
 *
 * `null` = discard (don't forward, just log).
 */
export const ADMIN_GMAILS = [
  'lubiarz.tek@gmail.com',
  'picinski@gmail.com',
  'dawoodanialtaaf@gmail.com',
] as const

export const INBOUND_ROUTING: Record<string, readonly string[] | null> = {
  // public addresses — forward to all 3 admins
  [`info@${BRAND.domain}`]:     ADMIN_GMAILS,
  [`bookings@${BRAND.domain}`]: ADMIN_GMAILS,
  [`hello@${BRAND.domain}`]:    ADMIN_GMAILS,
  [`support@${BRAND.domain}`]:  ADMIN_GMAILS,
  [`contact@${BRAND.domain}`]:  ADMIN_GMAILS,
  // personal addresses
  [`patryk@${BRAND.domain}`]:   ['picinski@gmail.com'],
  [`tek@${BRAND.domain}`]:      ['lubiarz.tek@gmail.com'],
  // outbound-only addresses — discard
  [`alerts@${BRAND.domain}`]:   null,
  [`noreply@${BRAND.domain}`]:  null,
}

/**
 * Default fallback when an inbound email's recipient isn't in INBOUND_ROUTING.
 * Prevents lost mail when the sender mistypes or uses an unanticipated alias.
 */
export const DEFAULT_INBOUND_ROUTE = ADMIN_GMAILS

/**
 * Look up routing destination for a given recipient address.
 * Returns null to discard, or array of gmail addresses to forward to.
 */
export function resolveInboundRoute(
  recipient: string
): readonly string[] | null {
  const normalized = recipient.trim().toLowerCase()
  if (normalized in INBOUND_ROUTING) {
    return INBOUND_ROUTING[normalized]
  }
  // Anything else at our domain falls back to all admins
  if (normalized.endsWith(`@${BRAND.domain}`)) {
    return DEFAULT_INBOUND_ROUTE
  }
  // Not our domain — discard
  return null
}
