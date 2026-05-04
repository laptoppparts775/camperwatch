'use client'

import { useState, useEffect } from 'react'
import { getSupabase } from '@/lib/supabase'
import { Plus, Trash2, Loader2 } from 'lucide-react'

interface PricingRule {
  id: string
  label: string
  date_from: string
  date_to: string
  price_per_night: number
}

interface Props {
  siteId: string
}

export default function SitePricingRules({ siteId }: Props) {
  const supabase = getSupabase()
  const [rules, setRules] = useState<PricingRule[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    label: '',
    date_from: '',
    date_to: '',
    price_per_night: '',
  })

  useEffect(() => {
    fetchRules()
  }, [siteId])

  async function fetchRules() {
    setLoading(true)
    const { data } = await supabase
      .from('site_pricing_rules')
      .select('id, label, date_from, date_to, price_per_night')
      .eq('site_id', siteId)
      .order('date_from', { ascending: true })
    setRules(data || [])
    setLoading(false)
  }

  async function addRule() {
    setError('')
    if (!form.date_from || !form.date_to || !form.price_per_night) {
      setError('Date range and price are required.')
      return
    }
    if (form.date_from > form.date_to) {
      setError('Start date must be before end date.')
      return
    }
    setSaving(true)
    const { error: insertErr } = await supabase.from('site_pricing_rules').insert({
      site_id: siteId,
      label: form.label.trim() || 'Custom rate',
      date_from: form.date_from,
      date_to: form.date_to,
      price_per_night: parseFloat(form.price_per_night),
    })
    setSaving(false)
    if (insertErr) {
      setError('Failed to save rule. Try again.')
      return
    }
    setForm({ label: '', date_from: '', date_to: '', price_per_night: '' })
    fetchRules()
  }

  async function deleteRule(id: string) {
    setDeleting(id)
    await supabase.from('site_pricing_rules').delete().eq('id', id)
    setRules(prev => prev.filter(r => r.id !== id))
    setDeleting(null)
  }

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <div className="text-xs font-semibold text-gray-700 mb-3">Seasonal / special rates</div>
      <p className="text-xs text-gray-500 mb-3">
        Override your base price for specific date ranges — holidays, peak season, events. Highest-priority rule wins when ranges overlap.
      </p>

      {loading ? (
        <div className="flex items-center gap-2 text-xs text-gray-400 py-2">
          <Loader2 size={12} className="animate-spin" /> Loading rules…
        </div>
      ) : (
        <>
          {rules.length > 0 && (
            <div className="space-y-2 mb-3">
              {rules.map(rule => (
                <div key={rule.id} className="flex items-center justify-between gap-3 bg-gray-50 rounded-lg px-3 py-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-800 truncate">{rule.label}</div>
                    <div className="text-xs text-gray-500">{rule.date_from} → {rule.date_to}</div>
                  </div>
                  <div className="text-sm font-semibold text-green-700 shrink-0">${rule.price_per_night}/night</div>
                  <button
                    onClick={() => deleteRule(rule.id)}
                    disabled={deleting === rule.id}
                    className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40 shrink-0"
                    title="Delete rule"
                  >
                    {deleting === rule.id
                      ? <Loader2 size={14} className="animate-spin" />
                      : <Trash2 size={14} />}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add rule form */}
          <div className="border border-dashed border-gray-200 rounded-xl p-3 space-y-2">
            <div className="text-xs text-gray-500 font-medium">Add a rate rule</div>
            <input
              value={form.label}
              onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
              placeholder="Label (e.g. July 4th weekend, Peak summer)"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-500 block mb-1">From</label>
                <input
                  type="date"
                  value={form.date_from}
                  onChange={e => setForm(f => ({ ...f, date_from: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">To</label>
                <input
                  type="date"
                  value={form.date_to}
                  onChange={e => setForm(f => ({ ...f, date_to: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Price per night (USD)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.price_per_night}
                onChange={e => setForm(f => ({ ...f, price_per_night: e.target.value }))}
                placeholder="95.00"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            {error && <div className="text-xs text-red-600">{error}</div>}
            <button
              onClick={addRule}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              {saving ? 'Saving…' : 'Add rule'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
