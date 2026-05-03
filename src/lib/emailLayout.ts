/**
 * Branded HTML email layout.
 *
 * One layout function that all templates wrap their content in.
 * Inline CSS only — most email clients strip <style> tags or don't apply them.
 */

import { BRAND } from './emailConfig'

type LayoutInput = {
  preheader?: string  // hidden preview text shown in inbox list
  contentHtml: string
}

export function renderEmailLayout({ preheader, contentHtml }: LayoutInput): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${BRAND.name}</title>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.backgroundColor};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${BRAND.textColor};line-height:1.5;">
${preheader ? `<div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:${BRAND.backgroundColor};opacity:0;">${escapeHtml(preheader)}</div>` : ''}
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:${BRAND.backgroundColor};">
  <tr>
    <td align="center" style="padding:24px 12px;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
        <tr>
          <td style="padding:24px 32px;border-bottom:1px solid #f3f4f6;">
            <a href="${BRAND.url}" style="text-decoration:none;color:${BRAND.primaryColor};font-weight:700;font-size:20px;letter-spacing:-0.01em;">
              🌲 ${BRAND.name}
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;font-size:15px;color:${BRAND.textColor};">
            ${contentHtml}
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px;border-top:1px solid #f3f4f6;background-color:${BRAND.backgroundColor};font-size:12px;color:${BRAND.mutedColor};">
            <div style="margin-bottom:6px;">
              <a href="${BRAND.url}" style="color:${BRAND.primaryColor};text-decoration:none;">${BRAND.domain}</a>
              &middot; Independent campgrounds, transparent pricing.
            </div>
            <div>
              You're receiving this because of an action you took on ${BRAND.name}.
              Reply to this email to respond directly.
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`
}

export function button(label: string, href: string): string {
  return `<a href="${href}" style="display:inline-block;background-color:${BRAND.primaryColor};color:#ffffff;text-decoration:none;font-weight:600;padding:12px 24px;border-radius:10px;font-size:15px;">${escapeHtml(label)}</a>`
}

export function infoRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:8px 0;color:${BRAND.mutedColor};font-size:13px;width:140px;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:8px 0;color:${BRAND.textColor};font-size:14px;font-weight:500;">${escapeHtml(value)}</td>
  </tr>`
}

export function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
