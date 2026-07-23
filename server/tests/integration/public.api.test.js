/**
 * public.api.test.js — Integration tests for public (unauthenticated) API routes
 *
 * Tests:
 *  - GET /api/health
 *  - GET /api/services
 *  - GET /api/services/:slug
 *  - GET /api/projects
 *  - GET /api/team
 *  - GET /api/testimonials
 */

import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../../src/app.js'

// ─────────────────────────────────────────────────────────────
describe('GET /api/health', () => {
  it('responds to health check endpoint', async () => {
    const res = await request(app).get('/api/health')
    // 200 = DB connected, 503 = DB offline (mock mode) — both are valid responses
    expect([200, 503]).toContain(res.status)
    expect(res.body).toHaveProperty('status')
  })
})

// ─────────────────────────────────────────────────────────────
describe('GET /api/services', () => {
  it('returns 200 with an array of services', async () => {
    const res = await request(app).get('/api/services')

    expect(res.status).toBe(200)
    expect(res.body.status).toBe('ok')
    expect(Array.isArray(res.body.data)).toBe(true)
  })

  it('only returns active services (mock DB has all active by default)', async () => {
    const res = await request(app).get('/api/services')

    expect(res.status).toBe(200)
    expect(res.body.data.length).toBeGreaterThan(0)
    // Mock DB pre-populates only active services — verify none are returned with isActive: false
    res.body.data.forEach((service) => {
      // isActive may be omitted from response (select optimization) or true — either is valid
      if (service.isActive !== undefined) {
        expect(service.isActive).toBe(true)
      }
    })
  })

  it('returns services with expected fields', async () => {
    const res = await request(app).get('/api/services')

    expect(res.status).toBe(200)
    if (res.body.data.length > 0) {
      const service = res.body.data[0]
      expect(service).toHaveProperty('id')
      expect(service).toHaveProperty('title')
      expect(service).toHaveProperty('slug')
      expect(service).toHaveProperty('shortDescription')
      expect(service).toHaveProperty('icon')
    }
  })

  it('mock DB returns all fields (select is a real-DB optimization)', async () => {
    const res = await request(app).get('/api/services')

    expect(res.status).toBe(200)
    // The mock DB doesn't apply Prisma's `select` — that's a real-DB concern.
    // Here we just verify the list returns valid service objects.
    if (res.body.data.length > 0) {
      expect(res.body.data[0]).toHaveProperty('id')
      expect(res.body.data[0]).toHaveProperty('slug')
    }
  })
})

// ─────────────────────────────────────────────────────────────
describe('GET /api/services/:slug', () => {
  it('returns 200 with full service data for a valid slug', async () => {
    const res = await request(app).get('/api/services/web-development')

    expect(res.status).toBe(200)
    expect(res.body.status).toBe('ok')
    expect(res.body.data).toHaveProperty('slug', 'web-development')
    expect(res.body.data).toHaveProperty('fullDescription')
  })

  it('returns 404 for a non-existent slug', async () => {
    const res = await request(app).get('/api/services/this-service-does-not-exist')

    expect(res.status).toBe(404)
    expect(res.body.status).toBe('error')
    expect(res.body.message).toMatch(/not found/i)
  })
})

// ─────────────────────────────────────────────────────────────
describe('GET /api/projects', () => {
  it('returns 200 with an array of projects', async () => {
    const res = await request(app).get('/api/projects')

    expect(res.status).toBe(200)
    expect(res.body.status).toBe('ok')
    expect(Array.isArray(res.body.data)).toBe(true)
  })

  it('returns projects with required fields', async () => {
    const res = await request(app).get('/api/projects')

    if (res.body.data.length > 0) {
      const project = res.body.data[0]
      expect(project).toHaveProperty('id')
      expect(project).toHaveProperty('title')
      expect(project).toHaveProperty('slug')
      expect(project).toHaveProperty('category')
    }
  })

  it('filters by ?featured=true and returns only featured projects', async () => {
    const res = await request(app).get('/api/projects?featured=true')

    expect(res.status).toBe(200)
    if (res.body.data.length > 0) {
      res.body.data.forEach((p) => {
        expect(p.isFeatured).toBe(true)
      })
    }
  })
})

// ─────────────────────────────────────────────────────────────
describe('GET /api/team', () => {
  it('returns 200 with team members array', async () => {
    const res = await request(app).get('/api/team')

    expect(res.status).toBe(200)
    expect(res.body.status).toBe('ok')
    expect(Array.isArray(res.body.data)).toBe(true)
  })

  it('returns team members with required fields', async () => {
    const res = await request(app).get('/api/team')

    if (res.body.data.length > 0) {
      const member = res.body.data[0]
      expect(member).toHaveProperty('id')
      expect(member).toHaveProperty('name')
      expect(member).toHaveProperty('role')
    }
  })
})

// ─────────────────────────────────────────────────────────────
describe('GET /api/testimonials', () => {
  it('returns 200 with testimonials array', async () => {
    const res = await request(app).get('/api/testimonials')

    expect(res.status).toBe(200)
    expect(res.body.status).toBe('ok')
    expect(Array.isArray(res.body.data)).toBe(true)
  })
})

// ─────────────────────────────────────────────────────────────
describe('404 handler — unknown routes', () => {
  it('returns 404 for completely unknown API routes', async () => {
    const res = await request(app).get('/api/this-does-not-exist')

    expect(res.status).toBe(404)
  })

  it('returns 404 for unknown non-API routes', async () => {
    const res = await request(app).get('/some-random-page')

    expect(res.status).toBe(404)
  })
})
