'use client'

import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { Loader2, Shield, Lock } from 'lucide-react'
import { getSupabase } from '@/lib/supabase'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface BookingDetails {
  siteId: string
  siteName: string
  campgroundSlug: string
  checkIn: string
  checkOut: string
  guests: number
  nights: number
  totalPrice: number
  guestName: string
  guestEmail: string
  guestPhone?: string
  specialRequests?: string
}

interface Props {
  booking: BookingDetails
  onSuccess: (bookingRef: string) => void
  onBack: () => void
}

function fmtDate(iso: string) {
  try {
    return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch { return iso }
}

function PaymentForm({ booking, onSuccess, onBack }: Props) {
  const stripe = useStripe()
  const elements = useElements()
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')

  async function handlePay() {
    if (!stripe || !elements) return
    setError('')
    setPaying(true)

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    })

    if (confirmError) {
      setError(confirmError.message || 'Payment failed. Please try again.')
      setPaying(false)
      return
    }

    if (paymentIntent?.status === 'succeeded') {
      // Webhook will create the booking row — poll for it
      let ref = ''
      for (let i = 0; i < 10; i++) {
        await new Promise(r => setTimeout(r, 1500))
        const sb = getSupabase()
        const { data } = await sb
          .from('bookings')
          .select('booking_ref')
          .eq('stripe_payment_intent_id', paymentIntent.id)
          .maybeSingle()
        if (data?.booking_ref) { ref = data.booking_ref; break }
      }
      onSuccess(ref || 'CW-PENDING')
    } else {
      setError('Payment was not completed. Please try again.')
      setPaying(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* Order summary */}
      <div className="bg-gray-50 rounded-2xl p-4 text-sm space-y-2">
        <div className="font-semibold text-gray-900 mb-3">{booking.siteName}</div>
        <div className="flex justify-between text-gray-600">
          <span>{fmtDate(booking.checkIn)} → {fmtDate(booking.checkOut)}</span>
          <span>{booking.nights} nights</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>{booking.guests} guest{booking.guests !== 1 ? 's' : ''}</span>
          <span>${(booking.totalPrice / booking.nights).toFixed(0)}/night</span>
        </div>
        <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-900">
          <span>Total</span>
          <span>${booking.totalPrice.toFixed(2)}</span>
        </div>
        <div className="text-xs text-gray-400">CamperWatch fee (5%) included · No hidden charges</div>
      </div>

      {/* Stripe Elements */}
      <div>
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Payment details</div>
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 rounded-xl p-3">{error}</div>
      )}

      <button
        onClick={handlePay}
        disabled={!stripe || paying}
        className="w-full flex items-center justify-center gap-2 py-4 bg-green-700 text-white font-bold rounded-2xl hover:bg-green-800 transition-colors disabled:opacity-50 text-base"
      >
        {paying ? <Loader2 size={18} className="animate-spin" /> : <Lock size={16} />}
        {paying ? 'Processing…' : `Pay $${booking.totalPrice.toFixed(2)}`}
      </button>

      <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
        <Shield size={12} />
        Secured by Stripe · Your card info never touches our servers
      </div>

      <button
        onClick={onBack}
        disabled={paying}
        className="w-full text-center text-sm text-gray-400 hover:text-gray-600 transition-colors py-1"
      >
        ← Back to details
      </button>
    </div>
  )
}

export default function StripePaymentStep({ booking, onSuccess, onBack }: Props) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function createIntent() {
      setLoading(true)
      setError('')
      try {
        const sb = getSupabase()
        const { data: { session } } = await sb.auth.getSession()
        const res = await fetch('/api/stripe/payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token || ''}`,
          },
          body: JSON.stringify({
            siteId: booking.siteId,
            campgroundSlug: booking.campgroundSlug,
            checkIn: booking.checkIn,
            checkOut: booking.checkOut,
            guests: booking.guests,
            guestName: booking.guestName,
            guestEmail: booking.guestEmail,
            guestPhone: booking.guestPhone,
            specialRequests: booking.specialRequests,
          }),
        })
        const data = await res.json()
        if (!res.ok) {
          if (res.status === 402) {
            setError('The owner of this campground has not yet connected their Stripe account. Booking is not available right now.')
          } else {
            setError(data.error || 'Failed to initialize payment.')
          }
          return
        }
        setClientSecret(data.clientSecret)
      } catch {
        setError('Failed to initialize payment. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    createIntent()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 gap-3 text-gray-400">
        <Loader2 size={20} className="animate-spin" />
        <span className="text-sm">Preparing payment…</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700">{error}</div>
        <button onClick={onBack} className="w-full text-center text-sm text-gray-400 hover:text-gray-600 py-1">
          ← Back to details
        </button>
      </div>
    )
  }

  if (!clientSecret) return null

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#15803d',
            borderRadius: '12px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          },
        },
      }}
    >
      <PaymentForm booking={booking} onSuccess={onSuccess} onBack={onBack} />
    </Elements>
  )
}
