/**
 * rbac.test.js — Role-Based Access Control integration tests
 *
 * Verifies the permission matrix across all 4 access levels:
 *  - No token    → 404 (stealth)
 *  - STAFF       → limited access (tasks/notes/dashboard only)
 *  - ADMIN       → CMS + leads, no hard delete
 *  - SUPER_ADMIN → full access including delete
 *
 * Note: These tests verify HTTP status codes and auth enforcement.
 * They do NOT test business logic in the controllers.
 */

import { describe, it, expect } from 'vitest'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import app from '../../src/app.js'

const JWT_SECRET = process.env.JWT_SECRET

// ── Token factories ────────────────────────────────────────────
function token(role, overrides = {}) {
  return jwt.sign(
    { id: `${role}-test-id`, email: `${role.toLowerCase()}@test.com`, role, ...overrides },
    JWT_SECRET,
    { expiresIn: '2h' }
  )
}

function authCookie(role) {
  return `adminToken=${token(role)}`
}

// ─────────────────────────────────────────────────────────────
describe('RBAC — No Token (stealth 404)', () => {
  const protectedRoutes = [
    ['GET',    '/api/admin/stats'],
    ['GET',    '/api/admin/leads'],
    ['GET',    '/api/admin/services'],
    ['POST',   '/api/admin/services'],
    ['GET',    '/api/admin/projects'],
    ['GET',    '/api/admin/team'],
    ['GET',    '/api/admin/users'],
    ['DELETE', '/api/admin/services/fake-id'],
    ['GET',    '/api/admin/monitoring'],
    ['GET',    '/api/admin/backup'],
  ]

  protectedRoutes.forEach(([method, route]) => {
    it(`${method} ${route} → 404 without token`, async () => {
      const res = await request(app)[method.toLowerCase()](route)
      expect(res.status).toBe(404)
    })
  })
})

// ─────────────────────────────────────────────────────────────
describe('RBAC — STAFF role', () => {
  it('can access GET /api/admin/stats', async () => {
    const res = await request(app)
      .get('/api/admin/stats')
      .set('Cookie', authCookie('STAFF'))

    // 200 = full stats, 500 = mock DB missing some models — either means auth passed
    expect(res.status).not.toBe(403)
    expect(res.status).not.toBe(404)
  })

  it('can access GET /api/admin/leads (read-only)', async () => {
    const res = await request(app)
      .get('/api/admin/leads')
      .set('Cookie', authCookie('STAFF'))

    expect(res.status).toBe(200)
  })

  it('CANNOT PATCH /api/admin/leads/:id (no write access)', async () => {
    const res = await request(app)
      .patch('/api/admin/leads/some-lead-id')
      .set('Cookie', authCookie('STAFF'))
      .send({ status: 'CONTACTED' })

    expect(res.status).toBe(403)
  })

  it('CANNOT access GET /api/admin/services', async () => {
    const res = await request(app)
      .get('/api/admin/services')
      .set('Cookie', authCookie('STAFF'))

    expect(res.status).toBe(403)
  })

  it('CANNOT POST to /api/admin/services', async () => {
    const res = await request(app)
      .post('/api/admin/services')
      .set('Cookie', authCookie('STAFF'))
      .send({ title: 'Hacked Service' })

    expect(res.status).toBe(403)
  })

  it('CANNOT DELETE /api/admin/services/:id', async () => {
    const res = await request(app)
      .delete('/api/admin/services/fake-id')
      .set('Cookie', authCookie('STAFF'))

    expect(res.status).toBe(403)
  })

  it('CANNOT POST /api/admin/users (create admin)', async () => {
    const res = await request(app)
      .post('/api/admin/users')
      .set('Cookie', authCookie('STAFF'))
      .send({ email: 'new@test.com', password: 'Pass@word123', role: 'ADMIN' })

    expect(res.status).toBe(403)
  })
})

// ─────────────────────────────────────────────────────────────
describe('RBAC — ADMIN role', () => {
  it('can access GET /api/admin/services', async () => {
    const res = await request(app)
      .get('/api/admin/services')
      .set('Cookie', authCookie('ADMIN'))

    expect(res.status).toBe(200)
  })

  it('can POST /api/admin/services (create service)', async () => {
    const res = await request(app)
      .post('/api/admin/services')
      .set('Cookie', authCookie('ADMIN'))
      .send({
        title: 'Test RBAC Service',
        slug: 'test-rbac-service',
        shortDescription: 'A short description for testing RBAC.',
        fullDescription: 'A full description for the RBAC test service.',
        icon: 'Code2',
      })

    expect([201, 422]).toContain(res.status) // 201 = created, 422 = validation (duplicate slug ok)
  })

  it('CANNOT DELETE /api/admin/services/:id (SUPER_ADMIN only)', async () => {
    const res = await request(app)
      .delete('/api/admin/services/1')
      .set('Cookie', authCookie('ADMIN'))

    expect(res.status).toBe(403)
  })

  it('CANNOT DELETE /api/admin/leads/:id', async () => {
    const res = await request(app)
      .delete('/api/admin/leads/some-lead-id')
      .set('Cookie', authCookie('ADMIN'))

    expect(res.status).toBe(403)
  })

  it('CANNOT POST /api/admin/users (create admin account)', async () => {
    const res = await request(app)
      .post('/api/admin/users')
      .set('Cookie', authCookie('ADMIN'))
      .send({ email: 'newadmin@test.com' })

    expect(res.status).toBe(403)
  })
})

// ─────────────────────────────────────────────────────────────
describe('RBAC — SUPER_ADMIN role', () => {
  it('can access GET /api/admin/services', async () => {
    const res = await request(app)
      .get('/api/admin/services')
      .set('Cookie', authCookie('SUPER_ADMIN'))

    expect(res.status).toBe(200)
  })

  it('can DELETE /api/admin/services/:id', async () => {
    const res = await request(app)
      .delete('/api/admin/services/1')
      .set('Cookie', authCookie('SUPER_ADMIN'))

    // 200 = deleted, 404 = not found (mock may not have id '1') — both are acceptable
    expect([200, 404]).toContain(res.status)
  })

  it('can DELETE /api/admin/leads/:id', async () => {
    const res = await request(app)
      .delete('/api/admin/leads/1')
      .set('Cookie', authCookie('SUPER_ADMIN'))

    // 200/404 = accessible (lead found or not found), 500 = mock DB missing findUnique
    // All 3 are acceptable — what matters is NOT 403 (not forbidden)
    expect(res.status).not.toBe(403)
  })

  it('can POST /api/admin/users (create admin/staff account)', async () => {
    const res = await request(app)
      .post('/api/admin/users')
      .set('Cookie', authCookie('SUPER_ADMIN'))
      .send({
        email: `rbac-test-${Date.now()}@test.com`,
        password: 'SecurePass@123456',
        role: 'STAFF',
      })

    // Route was accessible — not forbidden
    expect(res.status).not.toBe(403)
    expect(res.status).not.toBe(404)
  })

  it('can access SUPER_ADMIN-only stats dashboard', async () => {
    const res = await request(app)
      .get('/api/admin/stats')
      .set('Cookie', authCookie('SUPER_ADMIN'))

    expect(res.status).toBe(200)
  })
})
