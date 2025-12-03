'use client'

import { CheckCircle, Circle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const steps = [
  {
    title: '1. Daftar & Setup Akun',
    description: 'Buat akun gratis dan verifikasi email Anda',
    status: 'start',
    duration: '2 menit',
    details: [
      'Isi form pendaftaran dengan email perusahaan',
      'Verifikasi email melalui link yang dikirim',
      'Lengkapi profil perusahaan Anda',
      'Pilih paket subscription yang sesuai'
    ]
  },
  {
    title: '2. Connect Data Sources',
    description: 'Hubungkan platform analytics Anda',
    status: 'process',
    duration: '5-10 menit',
    details: [
      'Google Analytics 4 - Tracking website',
      'Shopee API - Data e-commerce',
      'Facebook Ads - Marketing metrics',
      'Instagram Business - Social media stats',
      'PostgreSQL Database - Custom data'
    ]
  },
  {
    title: '3. Customize Dashboard',
    description: 'Atur dashboard sesuai kebutuhan bisnis',
    status: 'process',
    duration: '10-15 menit',
    details: [
      'Pilih template dashboard (Sales, Marketing, Finance)',
      'Drag & drop widgets untuk customize layout',
      'Set up real-time notifications',
      'Configure data refresh intervals',
      'Add team members & set permissions'
    ]
  },
  {
    title: '4. AI-Powered Insights',
    description: 'Dapatkan rekomendasi berbasis AI',
    status: 'process',
    duration: 'Auto',
    details: [
      'AI akan menganalisis data Anda 24/7',
      'Deteksi anomali otomatis (revenue drop, spike traffic)',
      'Predictive analytics untuk forecasting',
      'Rekomendasi actionable untuk growth',
      'Natural language queries: "Berapa revenue bulan ini?"'
    ]
  },
  {
    title: '5. Collaboration & Reporting',
    description: 'Berbagi insights dengan team',
    status: 'process',
    duration: 'Ongoing',
    details: [
      'Generate PDF reports otomatis',
      'Schedule email reports (daily, weekly, monthly)',
      'Share live dashboards dengan stakeholders',
      'Export data ke CSV/Excel',
      'API access untuk custom integrations'
    ]
  },
  {
    title: '6. Scale & Optimize',
    description: 'Tingkatkan performance bisnis',
    status: 'end',
    duration: 'Continuous',
    details: [
      'Monitor KPIs secara real-time',
      'A/B testing recommendations',
      'Budget optimization suggestions',
      'Automated alerts untuk critical metrics',
      'Upgrade plan untuk fitur lanjutan'
    ]
  }
]

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Roadmap Menggunakan OASIS BI PRO
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Panduan lengkap dari pendaftaran hingga mendapatkan insights bisnis yang powerful.
            Ikuti langkah-langkah ini untuk memaksimalkan platform kami.
          </p>
        </div>

        <div className="space-y-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-8 relative">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  {step.status === 'start' && (
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-7 h-7 text-green-600" />
                    </div>
                  )}
                  {step.status === 'process' && (
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Circle className="w-7 h-7 text-blue-600" />
                    </div>
                  )}
                  {step.status === 'end' && (
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <ArrowRight className="w-7 h-7 text-purple-600" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">{step.title}</h2>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                      {step.duration}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{step.description}</p>

                  <ul className="space-y-2">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Siap Memulai?</h2>
          <p className="text-lg mb-6 opacity-90">
            Dapatkan akses penuh ke semua fitur dengan free trial 14 hari. Tanpa kartu kredit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-all"
            >
              Mulai Free Trial
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-all"
            >
              Lihat Pricing
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
