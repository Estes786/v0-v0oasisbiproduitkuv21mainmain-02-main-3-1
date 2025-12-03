'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseClient } from '@/lib/supabase/client'
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  RefreshCw,
  Download,
  ArrowUp,
  ArrowDown,
  Settings,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function MemberDashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [integrations, setIntegrations] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'sources' | 'insights'>('overview')
  const [syncing, setSyncing] = useState<string | null>(null)

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
    await loadDashboardData(user)
    setLoading(false)
  }

  const loadDashboardData = async (user: any) => {
    try {
      // Get analytics data from Edge Function
      const { data: session } = await supabaseClient.auth.getSession()
      
      const analyticsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/get-user-analytics`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${session.session?.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (analyticsResponse.ok) {
        const analytics = await analyticsResponse.json()
        setAnalyticsData(analytics)
      }

      // Get integrations from Edge Function
      const integrationsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/get-integrations`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${session.session?.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (integrationsResponse.ok) {
        const integrationsData = await integrationsResponse.json()
        setIntegrations(integrationsData)
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    }
  }

  const syncDataSource = async (provider: string, integrationId: string) => {
    setSyncing(integrationId)
    
    try {
      const { data: session } = await supabaseClient.auth.getSession()
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/sync-data-source`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.session?.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            provider,
            integration_id: integrationId,
          }),
        }
      )

      if (response.ok) {
        alert('Data synced successfully!')
        await loadDashboardData(user)
      } else {
        alert('Failed to sync data')
      }
    } catch (error) {
      console.error('Sync error:', error)
      alert('Failed to sync data')
    } finally {
      setSyncing(null)
    }
  }

  const refreshData = async () => {
    setLoading(true)
    await loadDashboardData(user)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('id-ID').format(value)
  }

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <ArrowUp className="w-4 h-4 text-green-600" />
    if (trend < 0) return <ArrowDown className="w-4 h-4 text-red-600" />
    return null
  }

  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'text-green-600'
    if (trend < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.user_metadata?.full_name || user?.email}!
              </h1>
              <p className="mt-2 text-gray-600">
                Here's what's happening with your business today
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <Button
                onClick={refreshData}
                variant="outline"
                className="flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button className="flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'sources', label: 'Data Sources', icon: Activity },
              { id: 'insights', label: 'AI Insights', icon: AlertCircle },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                  ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <tab.icon
                  className={`
                    mr-2 h-5 w-5
                    ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}
                  `}
                />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard
                title="Total Revenue"
                value={formatCurrency(analyticsData?.revenue?.current || 0)}
                trend={analyticsData?.revenue?.trend || 0}
                icon={<DollarSign className="w-6 h-6" />}
                color="green"
              />
              <KPICard
                title="Active Users"
                value={formatNumber(analyticsData?.users?.active || 0)}
                trend={analyticsData?.users?.trend || 0}
                icon={<Users className="w-6 h-6" />}
                color="blue"
              />
              <KPICard
                title="Conversion Rate"
                value={`${(analyticsData?.conversions?.rate || 0).toFixed(2)}%`}
                trend={analyticsData?.conversions?.trend || 0}
                icon={<TrendingUp className="w-6 h-6" />}
                color="purple"
              />
              <KPICard
                title="Total Events"
                value={formatNumber(analyticsData?.events?.total || 0)}
                trend={analyticsData?.events?.trend || 0}
                icon={<Activity className="w-6 h-6" />}
                color="orange"
              />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Revenue Trend
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={sampleRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                    />
                    <Area
                      type="monotone"
                      dataKey="target"
                      stroke="#94a3b8"
                      fill="#94a3b8"
                      fillOpacity={0.1}
                      strokeDasharray="5 5"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>

              {/* Traffic Chart */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Traffic & Conversions
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sampleTrafficData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="visits" fill="#3b82f6" />
                    <Bar dataKey="conversions" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'sources' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Data Source Connections
              </h2>
              <Button className="flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Add Integration
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {integrations.length > 0 ? (
                integrations.map((integration) => (
                  <IntegrationCard
                    key={integration.id}
                    integration={integration}
                    onSync={() => syncDataSource(integration.provider, integration.id)}
                    syncing={syncing === integration.id}
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    No data sources connected yet
                  </p>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Connect Your First Data Source
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-6">
            <AIInsightsSection analyticsData={analyticsData} />
          </div>
        )}
      </div>
    </div>
  )
}

// KPI Card Component
function KPICard({
  title,
  value,
  trend,
  icon,
  color,
}: {
  title: string
  value: string
  trend: number
  icon: React.ReactNode
  color: 'green' | 'blue' | 'purple' | 'orange'
}) {
  const colorClasses = {
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  }

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>{icon}</div>
        <div className="flex items-center">
          {trend > 0 ? (
            <ArrowUp className="w-4 h-4 text-green-600 mr-1" />
          ) : trend < 0 ? (
            <ArrowDown className="w-4 h-4 text-red-600 mr-1" />
          ) : null}
          <span
            className={`text-sm font-semibold ${
              trend > 0
                ? 'text-green-600'
                : trend < 0
                ? 'text-red-600'
                : 'text-gray-600'
            }`}
          >
            {trend > 0 ? '+' : ''}
            {trend.toFixed(1)}%
          </span>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
    </Card>
  )
}

// Integration Card Component
function IntegrationCard({
  integration,
  onSync,
  syncing,
}: {
  integration: any
  onSync: () => void
  syncing: boolean
}) {
  const getStatusIcon = () => {
    switch (integration.status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />
    }
  }

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 capitalize">
            {integration.provider.replace('_', ' ')}
          </h3>
          <p className="text-sm text-gray-600 capitalize">
            {integration.provider_type}
          </p>
        </div>
        {getStatusIcon()}
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Last synced:{' '}
          {integration.last_synced
            ? new Date(integration.last_synced).toLocaleString()
            : 'Never'}
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          onClick={onSync}
          disabled={syncing}
          className="flex-1"
          size="sm"
        >
          {syncing ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Sync Now
            </>
          )}
        </Button>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  )
}

// AI Insights Section
function AIInsightsSection({ analyticsData }: { analyticsData: any }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">AI-Powered Insights</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border-l-4 border-blue-600">
          <div className="flex items-start">
            <AlertCircle className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Revenue Opportunity
              </h3>
              <p className="text-gray-600">
                Your conversion rate is trending upward! Consider increasing ad spend
                to capitalize on this momentum. Estimated additional revenue: Rp 15.2M
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-green-600">
          <div className="flex items-start">
            <TrendingUp className="w-6 h-6 text-green-600 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Peak Performance Hours
              </h3>
              <p className="text-gray-600">
                Your users are most active between 4-6 PM. Schedule important
                campaigns during these hours for maximum impact.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-purple-600">
          <div className="flex items-start">
            <Users className="w-6 h-6 text-purple-600 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                User Retention Alert
              </h3>
              <p className="text-gray-600">
                23% of your users haven't logged in for 7+ days. Send a
                re-engagement campaign with special offers.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-orange-600">
          <div className="flex items-start">
            <Activity className="w-6 h-6 text-orange-600 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Anomaly Detected
              </h3>
              <p className="text-gray-600">
                Unusual spike in traffic from organic search detected. Possible
                viral content or SEO breakthrough. Monitor closely.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

// Sample data for charts
const sampleRevenueData = [
  { name: 'Jan', revenue: 45200000, target: 50000000 },
  { name: 'Feb', revenue: 52800000, target: 55000000 },
  { name: 'Mar', revenue: 48900000, target: 52000000 },
  { name: 'Apr', revenue: 61500000, target: 60000000 },
  { name: 'May', revenue: 72100000, target: 70000000 },
  { name: 'Jun', revenue: 68900000, target: 75000000 },
]

const sampleTrafficData = [
  { name: 'Mon', visits: 2400, conversions: 240 },
  { name: 'Tue', visits: 2800, conversions: 290 },
  { name: 'Wed', visits: 2200, conversions: 210 },
  { name: 'Thu', visits: 3100, conversions: 340 },
  { name: 'Fri', visits: 2900, conversions: 310 },
  { name: 'Sat', visits: 2600, conversions: 270 },
  { name: 'Sun', visits: 2400, conversions: 250 },
]
