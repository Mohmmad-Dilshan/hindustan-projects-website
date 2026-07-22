import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // eslint-disable-next-line no-console
    console.error('[Global ErrorBoundary]', error, errorInfo)

    // Log to backend monitoring endpoint asynchronously
    try {
      fetch(`${import.meta.env.VITE_API_URL || '/api'}/admin/monitoring/errors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'FRONTEND',
          errorMessage: error?.message || 'React Render Crash',
          pageOrRoute: window.location.pathname,
          userAgent: navigator.userAgent,
        }),
      }).catch(() => {})
    } catch (_err) {
      // Ignore network errors during log reporting
    }
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center font-sans">
          <div className="bg-white border border-gray-200 rounded-3xl p-8 max-w-md w-full shadow-xl space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold font-heading text-gray-900">System Recovery Triggered</h2>
              <p className="text-xs text-gray-500 leading-relaxed">
                An unexpected component error occurred. The incident has been logged for system monitoring.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-left font-mono text-[11px] text-gray-700 overflow-x-auto">
                {this.state.error.message}
              </div>
            )}

            <button
              onClick={this.handleReload}
              className="w-full py-3 bg-brand-blue hover:bg-blue-600 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Reload Application
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
