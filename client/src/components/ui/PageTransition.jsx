import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * PageTransition — wraps page content with a smooth fade+slide animation.
 * The key prop must be the current pathname so React re-mounts on route change.
 */
export default function PageTransition({ children }) {
  const ref = useRef(null)
  const { pathname } = useLocation()

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Reset — start from invisible + shifted down slightly
    el.style.transition = 'none'
    el.style.opacity = '0'
    el.style.transform = 'translateY(12px)'

    // Trigger reflow so the starting state sticks
    void el.offsetHeight

    // Animate in
    el.style.transition = 'opacity 0.35s ease, transform 0.35s ease'
    el.style.opacity = '1'
    el.style.transform = 'translateY(0)'
  }, [pathname])

  return (
    <div ref={ref} style={{ opacity: 0 }}>
      {children}
    </div>
  )
}
