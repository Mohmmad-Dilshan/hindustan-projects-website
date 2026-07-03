import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Activity,
  AlertTriangle,
  Server,
  Trash2,
  RefreshCw,
  Clock,
  TrendingUp,
  Cpu,
  Database,
  ExternalLink,
  ShieldCheck,
  Eye,
  Search,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { api } from '@/utils/api'
import { SEO } from '@/components/ui'

export default function AdminMonitoringPage() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('traffic') // traffic | errors | health
  const [errorFilter, setErrorFilter] = useState('ALL') // ALL | FRONTEND | BACKEND
  const [searchTerm, setSearchTerm] = useState('')

  // 1. Query stats (recent errors, traffic counters, charts, system health)
  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['monitoring-stats'],
    queryFn: () => api.get('/admin/monitoring/stats').then((r) => r.data),
    refetchInterval: activeTab === 'health' ? 30000 : false, // Auto-refresh health every 30s
  })

  // 2. Error deletion mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/monitoring/errors/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monitoring-stats'] })
    },
  })

  const stats = data || {}
  const errorLogs = stats.errorLogs || []
  const traffic = stats.traffic || { today: 0, week: 0, month: 0, popularPages: [], chartData: [] }
  const health = stats.systemHealth || { database: 'UNKNOWN', uptime: 0, memoryUsed: 0, memoryTotal: 0, platform: '', cpuLoad: [0, 0, 0] }
  const config = stats.config || { sentry: false, googleAnalytics: false }

  // Filter error logs
  const filteredErrors = errorLogs.filter((err) => {
    const matchesSource = errorFilter === 'ALL' || err.source === errorFilter
    const matchesSearch =
      err.errorMessage.toLowerCase().includes(searchTerm.toLowerCase()) ||
      err.pageOrRoute.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSource && matchesSearch
  })

  // Format uptime (seconds to hh:mm:ss)
  const formatUptime = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    return `${hrs}h ${mins}m ${secs}s`
  }

  return (
    <div className="space-y-6">
      <SEO title="System Monitoring" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-gray-900">System Monitoring</h1>
            <p className="text-sm text-gray-500">
              Real-time site traffic analytics, frontend/backend crash logs, and server health.
            </p>
          </div>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isLoading || isRefetching}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold border border-gray-200 rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
          Refresh Stats
        </button>
      </div>

      {/* Integration Status Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sentry status banner */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-start gap-4">
          <div className={`p-2.5 rounded-xl ${config.sentry ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
            {config.sentry ? <ShieldCheck className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 text-sm">Sentry Error Tracking</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${config.sentry ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {config.sentry ? 'Active' : 'Missing'}
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              {config.sentry
                ? 'Full runtime crash capture is active. Real-time trace telemetry is reporting to Sentry.'
                : 'Sentry DSN is not set. Local backup logging is active, but dashboard tracking is offline.'}
            </p>
            {config.sentry && (
              <a
                href="https://sentry.io"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-brand-blue hover:text-brand-blue/80 font-medium pt-1"
              >
                Go to Sentry Console
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* GA4 status banner */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-start gap-4">
          <div className={`p-2.5 rounded-xl ${config.googleAnalytics ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
            {config.googleAnalytics ? <TrendingUp className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 text-sm">Google Analytics 4</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${config.googleAnalytics ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {config.googleAnalytics ? 'Active' : 'Missing'}
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              {config.googleAnalytics
                ? 'GA4 script is active. Standard visitor pageviews, channels, and demographics are reporting.'
                : 'Measurement ID is not set. GA4 tag script is bypassed; visitors are only tracked in lightweight DB.'}
            </p>
            {config.googleAnalytics && (
              <a
                href="https://analytics.google.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-brand-blue hover:text-brand-blue/80 font-medium pt-1"
              >
                Open Google Analytics
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 flex gap-6">
        <button
          onClick={() => setActiveTab('traffic')}
          className={`pb-3 font-semibold text-sm transition-all border-b-2 outline-none cursor-pointer ${
            activeTab === 'traffic'
              ? 'border-brand-blue text-brand-blue'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          Site Traffic
        </button>
        <button
          onClick={() => setActiveTab('errors')}
          className={`pb-3 font-semibold text-sm transition-all border-b-2 outline-none cursor-pointer flex items-center gap-2 ${
            activeTab === 'errors'
              ? 'border-brand-blue text-brand-blue'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          Recent Errors
          {errorLogs.length > 0 && (
            <span className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full text-[10px] font-bold">
              {errorLogs.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('health')}
          className={`pb-3 font-semibold text-sm transition-all border-b-2 outline-none cursor-pointer ${
            activeTab === 'health'
              ? 'border-brand-blue text-brand-blue'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          System Health
        </button>
      </div>

      {/* Content Panels */}
      {isLoading ? (
        <div className="min-h-[300px] flex flex-col items-center justify-center gap-2 bg-white rounded-2xl border border-gray-200">
          <RefreshCw className="w-8 h-8 text-brand-blue animate-spin" />
          <p className="text-sm text-gray-500 font-semibold">Loading system statistics...</p>
        </div>
      ) : isError ? (
        <div className="min-h-[300px] flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border border-gray-200 p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-gray-900">Failed to load monitoring stats</h3>
          <p className="text-sm text-gray-500 max-w-sm">
            Please make sure the backend server is running and the database is accessible.
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-brand-blue hover:bg-brand-blue-hover text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          {/* TAB 1: SITE TRAFFIC */}
          {activeTab === 'traffic' && (
            <div className="space-y-6">
              {/* Traffic Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Visits Today</span>
                  <div className="text-3xl font-bold text-gray-900 mt-1">{traffic.today}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Visits This Week</span>
                  <div className="text-3xl font-bold text-gray-900 mt-1">{traffic.week}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Visits This Month</span>
                  <div className="text-3xl font-bold text-gray-900 mt-1">{traffic.month}</div>
                </div>
              </div>

              {/* Chart */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="font-heading font-bold text-gray-900 text-lg">Traffic History (Last 7 Days)</h3>
                <div className="h-64 md:h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={traffic.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1A3E8C" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#1A3E8C" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: '#6B7280', fontSize: 11 }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fill: '#6B7280', fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                        labelClassName="font-bold text-gray-900 text-sm"
                        itemStyle={{ color: '#1A3E8C', fontSize: '13px' }}
                      />
                      <Area type="monotone" dataKey="visits" stroke="#1A3E8C" strokeWidth={2} fillOpacity={1} fill="url(#colorVisits)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Popular Pages */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-150">
                  <h3 className="font-heading font-bold text-gray-900 text-lg">Most Visited Pages</h3>
                </div>
                {traffic.popularPages.length === 0 ? (
                  <div className="p-8 text-center text-sm text-gray-400">No traffic logs found. Make sure client page tracking is working.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Page Path</th>
                          <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Hit Count</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {traffic.popularPages.map((pg, idx) => (
                          <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 text-sm font-semibold text-gray-800 font-mono">{pg.path}</td>
                            <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">{pg.count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: RECENT ERRORS */}
          {activeTab === 'errors' && (
            <div className="space-y-4">
              {/* Filter controls */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-gray-200">
                <div className="flex gap-2 w-full sm:w-auto">
                  {['ALL', 'FRONTEND', 'BACKEND'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setErrorFilter(filter)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                        errorFilter === filter
                          ? 'bg-brand-blue text-white border-brand-blue'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
                <div className="relative w-full sm:max-w-xs">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search error messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                  />
                </div>
              </div>

              {/* Errors List */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                {filteredErrors.length === 0 ? (
                  <div className="p-12 text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-green-50 text-green-500 flex items-center justify-center mx-auto">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm">No errors found</h4>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto">
                      Excellent! There are no critical frontend or backend errors logged matching your criteria.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-150">
                    {filteredErrors.map((err) => (
                      <div key={err.id} className="p-6 hover:bg-gray-50/50 transition-colors flex gap-4 items-start group">
                        {/* Icon */}
                        <div className={`p-2 rounded-lg shrink-0 ${err.source === 'FRONTEND' ? 'bg-indigo-50 text-indigo-600' : 'bg-red-50 text-red-600'}`}>
                          <AlertTriangle className="w-5 h-5" />
                        </div>
                        {/* Details */}
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${err.source === 'FRONTEND' ? 'bg-indigo-100 text-indigo-700' : 'bg-red-100 text-red-700'}`}>
                              {err.source}
                            </span>
                            <span className="text-xs text-gray-400 font-medium">
                              {new Date(err.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-gray-900 break-words leading-snug">
                            {err.errorMessage}
                          </h4>
                          <div className="text-xs text-gray-500 flex flex-wrap gap-x-4 gap-y-1 font-mono">
                            <span className="break-all">Route: <strong>{err.pageOrRoute}</strong></span>
                            {err.userAgent && <span className="truncate max-w-md">UA: {err.userAgent}</span>}
                          </div>
                        </div>
                        {/* Actions */}
                        <button
                          onClick={() => {
                            if (window.confirm('Delete this error log entry?')) {
                              deleteMutation.mutate(err.id)
                            }
                          }}
                          disabled={deleteMutation.isPending}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                          title="Delete Log"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: SYSTEM HEALTH */}
          {activeTab === 'health' && (
            <div className="space-y-6">
              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Database Connection */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Database Status</span>
                    <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                      <Database className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className={`text-2xl font-bold flex items-center gap-2 ${health.database === 'ONLINE' ? 'text-green-600' : 'text-red-600'}`}>
                      <span className={`w-3.5 h-3.5 rounded-full ${health.database === 'ONLINE' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      {health.database}
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {health.database === 'ONLINE'
                        ? 'Database is active and accepting read/write transactions.'
                        : 'Server is unable to execute SQL transactions.'}
                    </p>
                  </div>
                </div>

                {/* Memory Usage */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Heap Memory</span>
                    <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                      <Cpu className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-gray-900">
                      {health.memoryUsed} MB <span className="text-xs text-gray-400 font-normal">/ {health.memoryTotal} MB allocated</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-brand-blue h-full"
                        style={{ width: `${Math.min(100, Math.round((health.memoryUsed / health.memoryTotal) * 100))}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500">Allocated memory currently being used by the Node runtime.</p>
                  </div>
                </div>

                {/* Server Uptime */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Server Uptime</span>
                    <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                      <Clock className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      {formatUptime(health.uptime)}
                    </div>
                    <p className="text-xs text-gray-500">Continuous uptime since the backend process started.</p>
                  </div>
                </div>
              </div>

              {/* Detailed Server Parameters */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-150">
                  <h3 className="font-heading font-bold text-gray-900 text-lg">Server Host Configuration</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  <div className="px-6 py-4 flex items-center justify-between text-sm">
                    <span className="text-gray-500 font-medium">Node Runtime Version</span>
                    <span className="font-mono text-gray-800">{process.version}</span>
                  </div>
                  <div className="px-6 py-4 flex items-center justify-between text-sm">
                    <span className="text-gray-500 font-medium">Operating System Platform</span>
                    <span className="font-mono text-gray-800 uppercase">{health.platform}</span>
                  </div>
                  <div className="px-6 py-4 flex items-center justify-between text-sm">
                    <span className="text-gray-500 font-medium">Load Average (1m, 5m, 15m)</span>
                    <span className="font-mono text-gray-800">
                      {health.cpuLoad.map((l) => l.toFixed(2)).join(', ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
