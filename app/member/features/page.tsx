'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseClient } from '@/lib/supabase/client'
import {
  BarChart3,
  TrendingUp,
  Database,
  Zap,
  Users,
  FileText,
  Download,
  Settings,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function MemberFeaturesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      router.push('/auth/signin')
      return
    }

    setUser(user)
    setLoading(false)
  }

  const features = [
    {
      id: 'real-time-analytics',
      name: 'Real-Time Analytics',
      icon: BarChart3,
      description: 'Monitor your business metrics in real-time with live dashboards',
      status: 'active',
      usage: '89%',
      color: 'bg-blue-500',
    },
    {
      id: 'predictive-insights',
      name: 'Predictive Insights',
      icon: TrendingUp,
      description: 'AI-powered predictions for revenue, trends, and customer behavior',
      status: 'active',
      usage: '76%',
      color: 'bg-green-500',
    },
    {
      id: 'data-integration',
      name: 'Data Integration',
      icon: Database,
      description: 'Connect to multiple data sources (Duitku, Shopify, WooCommerce, etc.)',
      status: 'active',
      usage: '92%',
      color: 'bg-purple-500',
    },
    {
      id: 'custom-reports',
      name: 'Custom Reports',
      icon: FileText,
      description: 'Create and schedule automated custom reports',
      status: 'active',
      usage: '68%',
      color: 'bg-orange-500',
    },
    {
      id: 'team-collaboration',
      name: 'Team Collaboration',
      icon: Users,
      description: 'Share insights and collaborate with your team members',
      status: 'coming-soon',
      usage: '0%',
      color: 'bg-yellow-500',
    },
    {
      id: 'api-access',
      name: 'API Access',
      icon: Zap,
      description: 'Programmatic access to your analytics data via REST API',
      status: 'coming-soon',
      usage: '0%',
      color: 'bg-red-500',
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
        <div className="text-white text-xl">Loading features...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">Features</h1>
              <p className="text-gray-400 mt-2">
                Explore and manage your OASIS BI PRO features
              </p>
            </div>
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => router.push('/member/dashboard')}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card
                key={feature.id}
                className="bg-white/5 backdrop-blur-sm border-white/10 p-6 hover:bg-white/10 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${feature.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-2">
                    {feature.status === 'active' ? (
                      <span className="flex items-center gap-1 text-green-400 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-yellow-400 text-sm">
                        <Clock className="w-4 h-4" />
                        Coming Soon
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.name}
                </h3>
                <p className="text-gray-400 text-sm mb-4">{feature.description}</p>

                {feature.status === 'active' && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400 text-sm">Usage</span>
                      <span className="text-white font-semibold text-sm">
                        {feature.usage}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${feature.color}`}
                        style={{ width: feature.usage }}
                      />
                    </div>
                  </div>
                )}

                {feature.status === 'coming-soon' && (
                  <div className="flex items-center gap-2 text-yellow-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>This feature is under development</span>
                  </div>
                )}
              </Card>
            )
          })}
        </div>

        {/* Feature Usage Stats */}
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6 mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Feature Usage Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-gray-400 text-sm mb-2">Total Features</div>
              <div className="text-4xl font-bold text-white">{features.length}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm mb-2">Active Features</div>
              <div className="text-4xl font-bold text-green-400">
                {features.filter((f) => f.status === 'active').length}
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-sm mb-2">Coming Soon</div>
              <div className="text-4xl font-bold text-yellow-400">
                {features.filter((f) => f.status === 'coming-soon').length}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
