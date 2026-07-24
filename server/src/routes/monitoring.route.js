import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import {
  trackPageVisit,
  getMonitoringStats,
  deleteErrorLog,
  deleteAllErrorLogs,
  logFrontendError,
} from '../controllers/monitoring.controller.js'
import { verifyToken, requireRole } from '../middleware/auth.js'

const router = Router()

// Rate limiters to prevent visit/error logging abuse
const visitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 visit reports per IP per 15 min
  message: { status: 'error', message: 'Too many visits logged from this IP.' },
  skip: () => process.env.NODE_ENV === 'development',
})

const errorLogLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // max 20 client error reports per IP per 15 min
  message: { status: 'error', message: 'Too many error reports from this IP.' },
  skip: () => process.env.NODE_ENV === 'development',
})

// ── Public Routes ──────────────────────────────────────────────
router.post('/track-visit', visitLimiter, trackPageVisit)
router.post('/monitoring/log-frontend-error', errorLogLimiter, logFrontendError)

// ── Protected Admin Routes ──────────────────────────────────────
router.get(
  '/admin/monitoring/stats',
  verifyToken,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  getMonitoringStats
)

router.delete(
  '/admin/monitoring/errors',
  verifyToken,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  deleteAllErrorLogs
)

router.delete(
  '/admin/monitoring/errors/:id',
  verifyToken,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  deleteErrorLog
)

export default router
