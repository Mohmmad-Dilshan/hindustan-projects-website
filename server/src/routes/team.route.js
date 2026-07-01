import { Router } from 'express'
import { getAllTeamMembers } from '../controllers/team.controller.js'

const router = Router()

// GET /api/team
router.get('/', getAllTeamMembers)

export default router
