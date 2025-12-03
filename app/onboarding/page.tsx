'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  CheckCircle,
  BarChart3,
  Database,
  Zap,
  TrendingUp,
  Users,
  ArrowRight,
  Play,
} from 'lucide-react'

const steps = [
  {
    id: 1,
    title: 'Welcome to OASIS BI PRO',
    description: 'Your all-in-one business intelligence platform',
    icon: CheckCircle,
    content: (
      <div className="space-y-4">
        <p className="text-gray-700 leading-relaxed">
          OASIS BI PRO adalah platform Business Intelligence yang membantu Anda menganalisis
          data bisnis secara real-time dengan AI-powered insights.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <FeatureCard
            icon={<BarChart3 className="w-6 h-6" />}
            title="Real-time Analytics"
            description="Monitor performa bisnis Anda secara real-time"
          />
          <FeatureCard
            icon={<TrendingUp className="w-6 h-6" />}
            title="AI Insights"
            description="Dapatkan rekomendasi berbasis AI untuk bisnis Anda"
          />
          <FeatureCard
            icon={<Database className="w-6 h-6" />}
            title="Data Integration"
            description="Hubungkan dengan 50+ sumber data"
          />
          <FeatureCard
            icon={<Zap className="w-6 h-6" />}
            title="Automated Reports"
            description="Laporan otomatis setiap hari"
          />
        </div>
      </div>
    ),
  },
  {
    id: 2,
    title: 'Connect Your Data Sources',
    description: 'Hubungkan platform Anda untuk mulai menganalisis data',
    icon: Database,
    content: (
      <div className="space-y-6">
        <p className="text-gray-700">
          Pilih sumber data yang ingin Anda integrasikan dengan OASIS BI PRO:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DataSourceCard
            name="Google Analytics"
            category="Analytics"
            status="recommended"
          />
          <DataSourceCard
            name="Facebook Ads"
            category="Advertising"
            status="popular"
          />
          <DataSourceCard name="Shopee" category="E-commerce" />
          <DataSourceCard name="Tokopedia" category="E-commerce" />
          <DataSourceCard name="Instagram" category="Social Media" />
          <DataSourceCard name="TikTok" category="Social Media" />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <p className="text-sm text-blue-800">
            💡 <strong>Pro Tip:</strong> Mulai dengan Google Analytics untuk mendapatkan
            gambaran lengkap traffic website Anda.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    title: 'Explore Your Dashboard',
    description: 'Kenali fitur-fitur dashboard Anda',
    icon: BarChart3,
    content: (
      <div className="space-y-6">
        <p className="text-gray-700">
          Dashboard Anda menyediakan berbagai fitur untuk menganalisis bisnis:
        </p>

        <div className="space-y-4">
          <DashboardFeature
            title="Overview Tab"
            description="Lihat KPI utama bisnis Anda: Revenue, Active Users, Conversion Rate, dan Total Events"
            icon={<BarChart3 className="w-5 h-5 text-blue-600" />}
          />
          <DashboardFeature
            title="Analytics Tab"
            description="Analisis mendalam dengan berbagai chart interaktif dan filter waktu"
            icon={<TrendingUp className="w-5 h-5 text-green-600" />}
          />
          <DashboardFeature
            title="Data Sources Tab"
            description="Kelola koneksi data source Anda dan sync data secara real-time"
            icon={<Database className="w-5 h-5 text-purple-600" />}
          />
          <DashboardFeature
            title="AI Insights Tab"
            description="Dapatkan rekomendasi dan insight otomatis dari AI untuk meningkatkan bisnis"
            icon={<Zap className="w-5 h-5 text-orange-600" />}
          />
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 mt-6">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
            <Play className="w-5 h-5 mr-2 text-purple-600" />
            Quick Actions
          </h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
              Klik "Refresh" untuk update data terbaru
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
              Gunakan "Export" untuk download laporan PDF/Excel
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
              Klik "Sync Now" pada data source untuk sync manual
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    title: 'Ready to Go!',
    description: 'Semua siap! Mari mulai menganalisis bisnis Anda',
    icon: CheckCircle,
    content: (
      <div className="space-y-6 text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>

        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            You're All Set! 🎉
          </h3>
          <p className="text-gray-600">
            Akun Anda sudah siap digunakan. Mari mulai explore dashboard dan fitur-fitur OASIS BI PRO!
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6">
          <h4 className="font-semibold text-lg mb-3">What's Next?</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div>
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-2">
                <Database className="w-5 h-5" />
              </div>
              <h5 className="font-semibold mb-1">Connect Data</h5>
              <p className="text-sm text-blue-50">
                Hubungkan data source pertama Anda
              </p>
            </div>
            <div>
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-2">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h5 className="font-semibold mb-1">View Analytics</h5>
              <p className="text-sm text-blue-50">
                Lihat dashboard dan analytics
              </p>
            </div>
            <div>
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-2">
                <Users className="w-5 h-5" />
              </div>
              <h5 className="font-semibold mb-1">Invite Team</h5>
              <p className="text-sm text-blue-50">
                Undang tim untuk berkolaborasi
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-gray-500">
            Butuh bantuan? Hubungi kami di{' '}
            <a href="mailto:support@oasisbipro.com" className="text-blue-600 hover:underline">
              support@oasisbipro.com
            </a>
          </p>
        </div>
      </div>
    ),
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [completed, setCompleted] = useState(false)

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      setCompleted(true)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    router.push('/member/dashboard')
  }

  const handleFinish = () => {
    router.push('/member/dashboard')
  }

  const currentStepData = steps.find((step) => step.id === currentStep)!
  const Icon = currentStepData.icon

  if (completed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <CheckCircle className="w-24 h-24 text-green-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Onboarding Complete!
          </h2>
          <p className="text-gray-600 mb-8">Redirecting to your dashboard...</p>
          <Button onClick={handleFinish} size="lg">
            Go to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} of {steps.length}
            </span>
            <button
              onClick={handleSkip}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Skip Tutorial
            </button>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold
                  ${
                    step.id <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }
                `}
              >
                {step.id < currentStep ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  step.id
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`
                    w-12 h-1 mx-2
                    ${step.id < currentStep ? 'bg-blue-600' : 'bg-gray-200'}
                  `}
                />
              )}
            </div>
          ))}
        </div>

        {/* Content Card */}
        <Card className="p-8 mb-8">
          <div className="mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Icon className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {currentStepData.title}
            </h2>
            <p className="text-gray-600">{currentStepData.description}</p>
          </div>

          <div className="mt-8">{currentStepData.content}</div>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            variant="outline"
          >
            Previous
          </Button>

          <Button onClick={handleNext} className="flex items-center">
            {currentStep === steps.length ? 'Finish' : 'Next'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// Helper Components
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="text-blue-600 mb-2">{icon}</div>
      <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  )
}

function DataSourceCard({
  name,
  category,
  status,
}: {
  name: string
  category: string
  status?: 'recommended' | 'popular'
}) {
  return (
    <div className="relative bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer">
      {status && (
        <span
          className={`
            absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded-full
            ${
              status === 'recommended'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-purple-100 text-purple-700'
            }
          `}
        >
          {status === 'recommended' ? '⭐ Recommended' : '🔥 Popular'}
        </span>
      )}
      <h4 className="font-semibold text-gray-900 mb-1">{name}</h4>
      <p className="text-sm text-gray-600">{category}</p>
    </div>
  )
}

function DashboardFeature({
  title,
  description,
  icon,
}: {
  title: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <div className="flex items-start bg-white rounded-lg p-4 border border-gray-200">
      <div className="mr-4 flex-shrink-0">{icon}</div>
      <div>
        <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  )
}
