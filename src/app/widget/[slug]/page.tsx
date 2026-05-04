/**
 * /widget/[slug]
 *
 * Embeddable booking widget. Owners paste this into their own website:
 *   <iframe src="https://camperwatch.org/widget/[slug]" width="400" height="600" frameborder="0"></iframe>
 *
 * Iframe-safe: no NavBar, no external fonts, minimal footprint.
 * Shows available sites + check-in/out date pickers.
 * "Book" button opens the full /book/[slug] page in a new tab (Recreation.gov-style).
 */

import { campgrounds } from '@/lib/data'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default function WidgetPage({ params }: { params: { slug: string } }) {
  const camp = campgrounds.find((c: any) => c.slug === params.slug)
  if (!camp) notFound()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://camperwatch.org'
  const bookUrl = `${siteUrl}/book/${camp.slug}`
  const campUrl = `${siteUrl}/campground/${camp.slug}`

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Book {camp.name}</title>
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #fff; color: #111827; }
          .widget { padding: 20px; max-width: 420px; }
          .header { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
          .dot { width: 8px; height: 8px; border-radius: 50%; background: #16a34a; }
          .name { font-size: 15px; font-weight: 700; color: #111827; }
          .meta { font-size: 12px; color: #6b7280; margin-top: 2px; }
          .price { font-size: 22px; font-weight: 800; color: #111827; margin-bottom: 4px; }
          .price span { font-size: 13px; font-weight: 400; color: #6b7280; }
          .rating { font-size: 12px; color: #6b7280; margin-bottom: 16px; }
          .star { color: #f59e0b; }
          label { display: block; font-size: 11px; font-weight: 600; color: #6b7280; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.04em; }
          input[type=date] { width: 100%; padding: 10px 12px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 14px; color: #111827; outline: none; }
          input[type=date]:focus { border-color: #16a34a; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px; }
          .btn { display: block; width: 100%; padding: 13px; background: #16a34a; color: #fff; font-size: 15px; font-weight: 700; border: none; border-radius: 12px; cursor: pointer; text-align: center; text-decoration: none; transition: background 0.15s; }
          .btn:hover { background: #15803d; }
          .footer { margin-top: 12px; text-align: center; font-size: 11px; color: #9ca3af; }
          .footer a { color: #16a34a; text-decoration: none; }
          .amenities { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; }
          .chip { font-size: 11px; background: #f0fdf4; color: #15803d; border-radius: 20px; padding: 3px 10px; border: 1px solid #bbf7d0; }
          .divider { height: 1px; background: #f3f4f6; margin: 16px 0; }
        `}</style>
      </head>
      <body>
        <div className="widget">
          <div className="header">
            <div className="dot" />
            <div>
              <div className="name">{camp.name}</div>
              <div className="meta">{(camp as any).location}</div>
            </div>
          </div>

          <div className="price">
            ${camp.price_per_night}<span>/night</span>
            {(camp as any).price_high && (camp as any).price_high !== camp.price_per_night && (
              <span> – ${(camp as any).price_high}</span>
            )}
          </div>
          <div className="rating">
            <span className="star">★</span> {camp.rating} · {camp.review_count} reviews
          </div>

          <div className="amenities">
            {((camp as any).site_types || []).slice(0, 3).map((t: string) => (
              <span key={t} className="chip">{t}</span>
            ))}
            {camp.amenities.slice(0, 3).map((a: string) => (
              <span key={a} className="chip">{a}</span>
            ))}
          </div>

          <div className="divider" />

          <form action={bookUrl} method="get" target="_blank">
            <div className="grid">
              <div>
                <label htmlFor="checkIn">Check-in</label>
                <input type="date" id="checkIn" name="checkIn" />
              </div>
              <div>
                <label htmlFor="checkOut">Check-out</label>
                <input type="date" id="checkOut" name="checkOut" />
              </div>
            </div>
            <button type="submit" className="btn">
              Check availability →
            </button>
          </form>

          <div className="footer">
            Powered by <a href={campUrl} target="_blank" rel="noopener noreferrer">CamperWatch</a> · No booking fees
          </div>
        </div>
      </body>
    </html>
  )
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const camp = campgrounds.find((c: any) => c.slug === params.slug)
  return { title: camp ? `Book ${camp.name}` : 'CamperWatch Widget' }
}
