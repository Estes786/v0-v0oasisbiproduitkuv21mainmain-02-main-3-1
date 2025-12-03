'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabaseClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Loader2, CreditCard, Building2, Wallet } from 'lucide-react'

const planDetails: Record<
  string,
  { name: string; price: number; features: string[] }
> = {
  professional: {
    name: 'Professional',
    price: 299000,
    features: [
      'Real-time Analytics Dashboard',
      'AI-Powered Insights',
      'Multi-Touch Attribution',
      'Up to 50 Data Integrations',
      'Custom Reports & Exports',
      'Email Support',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    price: 999000,
    features: [
      'Everything in Professional',
      'Unlimited Data Integrations',
      'Advanced AI Models',
      'Custom AI Training',
      'Dedicated Account Manager',
      '24/7 Priority Support',
      'SLA Guarantee',
    ],
  },
}

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan') || 'professional'

  const [loading, setLoading] = useState(false)
  const [gateway, setGateway] = useState<'xendit' | 'midtrans'>('xendit')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()
    
    if (!user) {
      router.push(`/auth/signin?redirect=/checkout?plan=${plan}`)
      return
    }
    
    setUser(user)
  }

  const handlePayment = async () => {
    if (!user) {
      router.push(`/auth/signin?redirect=/checkout?plan=${plan}`)
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/payment/create-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan,
          gateway,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Payment creation failed')
      }

      // Redirect to payment page
      if (gateway === 'xendit' && data.invoice_url) {
        window.location.href = data.invoice_url
      } else if (gateway === 'midtrans' && data.snap_token) {
        // Load Midtrans Snap
        const script = document.createElement('script')
        script.src =
          process.env.NODE_ENV === 'production'
            ? 'https://app.midtrans.com/snap/snap.js'
            : 'https://app.sandbox.midtrans.com/snap/snap.js'
        script.setAttribute(
          'data-client-key',
          process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ''
        )
        document.body.appendChild(script)

        script.onload = () => {
          ;(window as any).snap.pay(data.snap_token, {
            onSuccess: function () {
              router.push('/payment/success')
            },
            onPending: function () {
              router.push('/payment/pending')
            },
            onError: function () {
              router.push('/payment/failed')
            },
            onClose: function () {
              setLoading(false)
            },
          })
        }
      }
    } catch (error: any) {
      alert(error.message || 'Terjadi kesalahan saat membuat pembayaran')
      setLoading(false)
    }
  }

  const selectedPlan = planDetails[plan] || planDetails.professional

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Complete Your Purchase
          </h1>
          <p className="text-gray-600">
            Choose your payment method and complete the checkout
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Plan Details */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {selectedPlan.name} Plan
            </h2>
            <div className="mb-6">
              <span className="text-4xl font-bold text-blue-600">
                Rp {selectedPlan.price.toLocaleString('id-ID')}
              </span>
              <span className="text-gray-600">/bulan</span>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 mb-3">
                Features Included:
              </h3>
              {selectedPlan.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Payment Method */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Payment Method
            </h2>

            <div className="space-y-4">
              {/* Xendit */}
              <button
                onClick={() => setGateway('xendit')}
                className={`w-full p-4 border-2 rounded-lg transition-all ${
                  gateway === 'xendit'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                  <div className="text-left flex-1">
                    <p className="font-semibold text-gray-900">
                      Xendit Payment
                    </p>
                    <p className="text-sm text-gray-600">
                      Credit Card, Bank Transfer, E-Wallet, QRIS
                    </p>
                  </div>
                  {gateway === 'xendit' && (
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </button>

              {/* Midtrans */}
              <button
                onClick={() => setGateway('midtrans')}
                className={`w-full p-4 border-2 rounded-lg transition-all ${
                  gateway === 'midtrans'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <Building2 className="w-6 h-6 text-blue-600" />
                  <div className="text-left flex-1">
                    <p className="font-semibold text-gray-900">
                      Midtrans Payment
                    </p>
                    <p className="text-sm text-gray-600">
                      Virtual Account, GoPay, ShopeePay, QRIS
                    </p>
                  </div>
                  {gateway === 'midtrans' && (
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            </div>

            {/* Pay Button */}
            <Button
              onClick={handlePayment}
              disabled={loading}
              className="w-full h-14 text-lg font-semibold mt-8"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Wallet className="w-5 h-5 mr-2" />
                  Pay Rp {selectedPlan.price.toLocaleString('id-ID')}
                </>
              )}
            </Button>

            <p className="text-sm text-gray-500 text-center mt-4">
              🔒 Secure payment powered by {gateway === 'xendit' ? 'Xendit' : 'Midtrans'}
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}


export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>}>
      <CheckoutContent />
    </Suspense>
  )
}
