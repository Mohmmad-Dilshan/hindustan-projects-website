import { Router } from 'express'
import { getAllServices, getServiceBySlug } from '../controllers/services.controller.js'

const router = Router()

// GET /api/services
router.get('/', getAllServices)

// GET /api/services/:slug
router.get('/:slug', getServiceBySlug)

export default router
