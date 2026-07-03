import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { HelmetProvider } from 'react-helmet-async'
import * as Sentry from '@sentry/react'

// Local fonts — no internet required
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/500.css'
import '@fontsource/poppins/600.css'
import '@fontsource/poppins/700.css'
import '@fontsource/poppins/800.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import './index.css'
import App from './App.jsx'
import { ErrorBoundary } from './components/monitoring/ErrorBoundary.jsx'

// Inject reCAPTCHA site key as a meta tag so index.html can pick it up
const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY
if (recaptchaSiteKey) {
  const meta = document.createElement('meta')
  meta.name = 'recaptcha-site-key'
  meta.content = recaptchaSiteKey
  document.head.appendChild(meta)
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 2 * 60 * 1000,
    },
  },
})

// Asynchronously load settings to initialize optional integrations before rendering
async function bootstrapApp() {
  let settings = {}
  try {
    const res = await fetch('/api/settings')
    if (res.ok) {
      const data = await res.json()
      settings = data?.data || {}
    }
  } catch (err) {
    console.warn('[main] Failed to fetch settings for Sentry/GA4 configs:', err.message)
  }

  // 1. Optional Sentry Integration
  if (settings.sys_sentry_dsn) {
    Sentry.init({
      dsn: settings.sys_sentry_dsn,
      environment: import.meta.env.MODE,
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    })
    window.SENTRY_INITIALIZED = true
    console.log('[Sentry] Initialized successfully')
  }

  // 2. Optional Google Analytics 4 Integration
  if (settings.sys_ga_measurement_id) {
    const gaId = settings.sys_ga_measurement_id
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
    document.head.appendChild(script)

    window.dataLayer = window.dataLayer || []
    window.gtag = function () {
      window.dataLayer.push(arguments)
    }
    window.gtag('js', new Date())
    window.gtag('config', gaId, { page_path: window.location.pathname })
    console.log('[GA4] Loaded successfully')
  }

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <ErrorBoundary>
        <HelmetProvider>
          <BrowserRouter>
            <QueryClientProvider client={queryClient}>
              <App />
              {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
            </QueryClientProvider>
          </BrowserRouter>
        </HelmetProvider>
      </ErrorBoundary>
    </StrictMode>
  )
}

bootstrapApp()
