/**
 * Shared Framer Motion variants — subtle, professional animations.
 * Keep them understated: short durations, gentle easing.
 */

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
}

/** Staggered container — wraps a list of fadeUp children */
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
}

/** Viewport config — trigger once when 15% of element is visible */
export const viewportOnce = { once: true, amount: 0.15 }
