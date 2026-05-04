/**
 * Concrete email templates. Each function returns { subject, html, text }.
 * Wire into sendEmail() in the route handlers.
 */

import { renderEmailLayout, button, infoRow, escapeHtml } from './emailLayout'
import { BRAND } from './emailConfig'

// ---------- Booking confirmation: CAMPER ----------

export type BookingConfirmationInput = {
  bookingRef: string
  campgroundName: string
  campgroundSlug: string
  siteName: string
  checkIn: string         // YYYY-MM-DD
  checkOut: string
  guests: number
  totalPrice: number
  guestName: string
  // for the camper email
  ownerName?: string
  ownerEmail?: string
  // for the owner email
  guestEmail?: string
  guestPhone?: string
  specialRequests?: string
}

function fmtDate(iso: string): string {
  try {
    const d = new Date(iso + 'T00:00:00')
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return iso
  }
}

export function bookingConfirmationCamper(i: BookingConfirmationInput) {
  const url = `${BRAND.url}/profile?tab=bookings`
  const subject = `Booking confirmed at ${i.campgroundName} — ${fmtDate(i.checkIn)}`
  const content = `
    <h1 style="margin:0 0 12px 0;font-size:22px;font-weight:700;color:${'#111827'};">You're booked, ${escapeHtml(i.guestName.split(' ')[0])}!</h1>
    <p style="margin:0 0 20px 0;color:#374151;">Your stay at <strong>${escapeHtml(i.campgroundName)}</strong> is confirmed. Booking reference: <code style="background:#f3f4f6;padding:2px 6px;border-radius:4px;font-size:13px;">${escapeHtml(i.bookingRef)}</code></p>

    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:0 0 24px 0;border-top:1px solid #f3f4f6;">
      ${infoRow('Site', i.siteName)}
      ${infoRow('Check-in', fmtDate(i.checkIn))}
      ${infoRow('Check-out', fmtDate(i.checkOut))}
      ${infoRow('Guests', String(i.guests))}
      ${infoRow('Total paid', '$' + i.totalPrice.toFixed(2))}
    </table>

    <div style="margin:0 0 24px 0;">${button('View my bookings', url)}</div>

    ${i.ownerName ? `<p style="margin:0 0 12px 0;color:#374151;font-size:14px;">Questions about your stay? Reply to this email — it goes directly to ${escapeHtml(i.ownerName)}, your host.</p>` : `<p style="margin:0 0 12px 0;color:#374151;font-size:14px;">Questions about your stay? Reply to this email to reach your host directly.</p>`}
    <p style="margin:0;color:#6b7280;font-size:13px;">Need help with the booking itself? Email <a href="mailto:info@${BRAND.domain}" style="color:${'#15803d'};">info@${BRAND.domain}</a>.</p>
  `
  return {
    subject,
    html: renderEmailLayout({ preheader: `${i.campgroundName} · ${fmtDate(i.checkIn)} → ${fmtDate(i.checkOut)} · ${i.guests} guests`, contentHtml: content }),
    text: `Booking confirmed at ${i.campgroundName}\n\nReference: ${i.bookingRef}\nSite: ${i.siteName}\nCheck-in: ${fmtDate(i.checkIn)}\nCheck-out: ${fmtDate(i.checkOut)}\nGuests: ${i.guests}\nTotal: $${i.totalPrice.toFixed(2)}\n\nView your bookings: ${url}\n\nQuestions? Reply to this email to reach your host directly.`,
  }
}

export function bookingConfirmationOwner(i: BookingConfirmationInput) {
  const url = `${BRAND.url}/owner-dashboard`
  const subject = `New booking at ${i.campgroundName} — ${fmtDate(i.checkIn)}`
  const content = `
    <h1 style="margin:0 0 12px 0;font-size:22px;font-weight:700;color:#111827;">New booking received 🎉</h1>
    <p style="margin:0 0 20px 0;color:#374151;">A camper just booked <strong>${escapeHtml(i.siteName)}</strong> at ${escapeHtml(i.campgroundName)}. Reference: <code style="background:#f3f4f6;padding:2px 6px;border-radius:4px;font-size:13px;">${escapeHtml(i.bookingRef)}</code></p>

    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:0 0 24px 0;border-top:1px solid #f3f4f6;">
      ${infoRow('Guest', i.guestName)}
      ${infoRow('Email', i.guestEmail || '—')}
      ${infoRow('Phone', i.guestPhone || '—')}
      ${infoRow('Check-in', fmtDate(i.checkIn))}
      ${infoRow('Check-out', fmtDate(i.checkOut))}
      ${infoRow('Guests', String(i.guests))}
      ${infoRow('Total', '$' + i.totalPrice.toFixed(2))}
    </table>

    ${i.specialRequests ? `<div style="margin:0 0 20px 0;padding:12px 16px;background:#fffbeb;border-left:3px solid #f59e0b;border-radius:6px;"><div style="font-size:12px;color:#92400e;font-weight:600;margin-bottom:4px;">SPECIAL REQUESTS</div><div style="color:#451a03;font-size:14px;">${escapeHtml(i.specialRequests)}</div></div>` : ''}

    <div style="margin:0 0 24px 0;">${button('Open dashboard', url)}</div>

    <p style="margin:0;color:#6b7280;font-size:13px;">Reply to this email to message ${escapeHtml(i.guestName.split(' ')[0])} directly.</p>
  `
  return {
    subject,
    html: renderEmailLayout({ preheader: `${i.guestName} · ${fmtDate(i.checkIn)} · $${i.totalPrice.toFixed(2)}`, contentHtml: content }),
    text: `New booking at ${i.campgroundName}\n\nGuest: ${i.guestName} (${i.guestEmail || ''})\nSite: ${i.siteName}\nCheck-in: ${fmtDate(i.checkIn)}\nCheck-out: ${fmtDate(i.checkOut)}\nGuests: ${i.guests}\nTotal: $${i.totalPrice.toFixed(2)}\n${i.specialRequests ? `\nSpecial requests: ${i.specialRequests}\n` : ''}\nDashboard: ${url}`,
  }
}

// ---------- Contact form: admin notification ----------

export type ContactFormInput = {
  fromName: string
  fromEmail: string
  subject: string
  message: string
}

export function contactFormAdminNotification(i: ContactFormInput) {
  const subject = `📬 Contact form: ${i.subject || '(no subject)'}`
  const content = `
    <h1 style="margin:0 0 12px 0;font-size:20px;font-weight:700;color:#111827;">New contact form submission</h1>

    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:0 0 16px 0;border-top:1px solid #f3f4f6;">
      ${infoRow('Name', i.fromName)}
      ${infoRow('Email', i.fromEmail)}
      ${infoRow('Subject', i.subject || '(no subject)')}
    </table>

    <div style="margin:0 0 8px 0;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Message</div>
    <div style="padding:14px 16px;background:#f9fafb;border-radius:8px;color:#111827;font-size:14px;white-space:pre-wrap;line-height:1.6;">${escapeHtml(i.message)}</div>

    <p style="margin:20px 0 0 0;color:#6b7280;font-size:13px;">Reply directly to this email to respond to ${escapeHtml(i.fromName)}.</p>
  `
  return {
    subject,
    html: renderEmailLayout({ preheader: `${i.fromName} <${i.fromEmail}>`, contentHtml: content }),
    text: `New contact form submission\n\nName: ${i.fromName}\nEmail: ${i.fromEmail}\nSubject: ${i.subject}\n\nMessage:\n${i.message}`,
  }
}


// ---------- Availability alert: camper notification ----------

export type AvailabilityAlertInput = {
  campgroundName: string
  campgroundSlug: string
  checkIn: string   // YYYY-MM-DD
  checkOut: string
  recreationGovUrl: string
  nearbyPrivate: Array<{ name: string; slug: string; pricePerNight: number }>
}

export function availabilityAlertEmail(i: AvailabilityAlertInput) {
  const subject = `🏕️ Site opened: ${i.campgroundName} for ${fmtDate(i.checkIn)}`
  const bookUrl = i.recreationGovUrl || `https://www.recreation.gov`
  const alertsUrl = `${BRAND.url}/alerts`

  const crossSell = i.nearbyPrivate.length > 0 ? `
    <div style="margin:24px 0 0 0;padding:16px;background:#f0fdf4;border-radius:12px;border:1px solid #bbf7d0;">
      <div style="font-size:12px;font-weight:700;color:#15803d;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:10px;">Meanwhile — private campgrounds nearby with availability</div>
      ${i.nearbyPrivate.map(c => `
        <div style="margin-bottom:8px;">
          <a href="${BRAND.url}/campground/${c.slug}" style="color:#15803d;font-weight:600;font-size:14px;text-decoration:none;">${escapeHtml(c.name)}</a>
          <span style="color:#6b7280;font-size:13px;"> · from $${c.pricePerNight}/night · Book instantly</span>
        </div>
      `).join('')}
    </div>
  ` : ''

  const content = `
    <h1 style="margin:0 0 12px 0;font-size:22px;font-weight:700;color:#111827;">A site just opened up! 🎉</h1>
    <p style="margin:0 0 16px 0;color:#374151;">
      Good news — <strong>${escapeHtml(i.campgroundName)}</strong> now has availability for your dates.
      These go fast — book now before it's gone.
    </p>

    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:0 0 20px 0;border-top:1px solid #f3f4f6;">
      ${infoRow('Campground', i.campgroundName)}
      ${infoRow('Check-in', fmtDate(i.checkIn))}
      ${infoRow('Check-out', fmtDate(i.checkOut))}
    </table>

    <div style="margin:0 0 24px 0;">${button('Book on Recreation.gov →', bookUrl)}</div>

    ${crossSell}

    <p style="margin:20px 0 0 0;color:#9ca3af;font-size:12px;">
      You set this alert at <a href="${alertsUrl}" style="color:#6b7280;">camperwatch.org/alerts</a>.
      <a href="${alertsUrl}" style="color:#6b7280;">Manage or delete your alerts.</a>
    </p>
  `

  return {
    subject,
    html: renderEmailLayout({
      preheader: `${i.campgroundName} · ${fmtDate(i.checkIn)} → ${fmtDate(i.checkOut)} · Book now!`,
      contentHtml: content,
    }),
    text: `A site opened up at ${i.campgroundName}!

Check-in: ${fmtDate(i.checkIn)}
Check-out: ${fmtDate(i.checkOut)}

Book now: ${bookUrl}

Manage alerts: ${alertsUrl}`,
  }
}

// ---------- Test email (used by the smoke-test endpoint) ----------

export function testEmail() {
  const content = `
    <h1 style="margin:0 0 12px 0;font-size:22px;font-weight:700;color:#111827;">It works ✅</h1>
    <p style="margin:0 0 16px 0;color:#374151;">If you're reading this, the CamperWatch email pipeline is configured correctly: Resend Pro is connected, DNS is verified, and the branded layout is rendering.</p>
    <p style="margin:0;color:#6b7280;font-size:13px;">Sent at ${new Date().toISOString()}</p>
  `
  return {
    subject: 'CamperWatch email pipeline test',
    html: renderEmailLayout({ preheader: 'Resend + DNS + layout all working.', contentHtml: content }),
    text: 'CamperWatch email pipeline test — it works.',
  }
}

// ---------- Forwarded inbound email wrapper ----------

export type ForwardWrapperInput = {
  originalFrom: string
  originalFromName?: string
  originalTo: string  // which @camperwatch.org address it came in on
  originalSubject: string
  bodyHtml?: string
  bodyText?: string
}

export function forwardedInboundEmail(i: ForwardWrapperInput) {
  const subject = `[${i.originalTo}] ${i.originalSubject || '(no subject)'}`
  const fromLine = i.originalFromName
    ? `${i.originalFromName} <${i.originalFrom}>`
    : i.originalFrom

  const banner = `
    <div style="margin:0 0 16px 0;padding:10px 14px;background:#ecfdf5;border-left:3px solid #10b981;border-radius:6px;font-size:13px;color:#065f46;">
      <div style="font-weight:600;margin-bottom:2px;">📨 Forwarded from ${escapeHtml(i.originalTo)}</div>
      <div>From: ${escapeHtml(fromLine)}</div>
    </div>
  `

  // Prefer the original HTML body if present; otherwise render text as preformatted.
  const body = i.bodyHtml
    ? i.bodyHtml
    : `<div style="white-space:pre-wrap;font-family:-apple-system,sans-serif;color:#111827;">${escapeHtml(i.bodyText || '')}</div>`

  return {
    subject,
    html: renderEmailLayout({
      preheader: `From ${i.originalFrom} to ${i.originalTo}`,
      contentHtml: banner + body,
    }),
    text: `Forwarded from ${i.originalTo}\nFrom: ${fromLine}\nSubject: ${i.originalSubject}\n\n${i.bodyText || '(no plain-text body)'}`,
  }
}
