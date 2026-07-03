/**
 * backup.route.js — Data backup endpoints (SUPER_ADMIN only)
 */
import { Router } from 'express'
import { verifyToken, requireRole } from '../middleware/auth.js'
import { downloadBackup, getBackupTableInfo } from '../controllers/backup.controller.js'

const router = Router()

// GET /api/admin/backup/tables — available tables + record counts
router.get('/tables', verifyToken, requireRole('SUPER_ADMIN'), getBackupTableInfo)

// GET /api/admin/backup — download backup JSON
// Optional query: ?tables=services,projects,team
router.get('/', verifyToken, requireRole('SUPER_ADMIN'), downloadBackup)

export default router
