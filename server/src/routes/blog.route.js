/**
 * blog.route.js — Public blog routes
 */
import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import {
  getPublicPosts,
  getBlogCategories,
  getPublicPostBySlug,
  getPostComments,
  submitComment,
} from '../controllers/blog.controller.js'

const router = Router()

// Rate limiter for comment submission (same as contact form)
const commentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'development',
  message: { status: 'error', message: 'Too many comment submissions. Please wait before trying again.' },
})

router.get('/', getPublicPosts)
router.get('/categories', getBlogCategories)
router.get('/:slug', getPublicPostBySlug)
router.get('/:slug/comments', getPostComments)
router.post('/:slug/comment', commentLimiter, submitComment)

export default router
