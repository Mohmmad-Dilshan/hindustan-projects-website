import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { api } from '@/utils/api'

/**
 * Custom hook to track page visit statistics.
 * Pings backend POST /api/track-visit endpoint upon page change.
 * Runs asynchronously and fails silently to prevent page load delays.
 */
export function useTrafficTracker() {
  const location = useLocation()
  const lastTrackedPath = useRef('')

  useEffect(() => {
    const currentPath = location.pathname

    // Prevent duplicate logs on double renders in strict mode
    if (lastTrackedPath.current === currentPath) return
    lastTrackedPath.current = currentPath

    // Queue tracking request to execute asynchronously after page rendering finishes
    const track = async () => {
      try {
        const payload = {
          path: currentPath,
          referrer: document.referrer || null,
          userAgent: navigator.userAgent,
        }

        // Fails silently, does not block UI
        await api.post('/track-visit', payload)
      } catch (err) {
        // Silent catch to prevent console errors for end-users
        console.warn('[TrafficTracker] Failed to record page visit:', err.message)
      }
    }

    // Delay slightly to ensure browser page has settled
    const timer = setTimeout(track, 300)
    return () => clearTimeout(timer)
  }, [location.pathname])
}
