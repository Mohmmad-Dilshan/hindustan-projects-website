import { Router } from 'express'
import { getAllProjects, getProjectBySlug } from '../controllers/projects.controller.js'

const router = Router()

// GET /api/projects
router.get('/', getAllProjects)

// GET /api/projects/:slug
router.get('/:slug', getProjectBySlug)

export default router
