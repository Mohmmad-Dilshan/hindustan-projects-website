/**
 * middleware.auth.test.js
 *
 * Unit tests for auth.js middleware:
 *  - verifyToken
 *  - requireRole
 *  - hideAdminRoutes
 *  - verifyClientToken
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import jwt from 'jsonwebtoken'
import { verifyToken, requireRole, hideAdminRoutes, verifyClientToken } from '../../src/middleware/auth.js'

const JWT_SECRET = process.env.JWT_SECRET

// ── Helpers ────────────────────────────────────────────────────
function makeAdminToken(payload = {}) {
  return jwt.sign(
    { id: 'admin-1', email: 'admin@test.com', role: 'ADMIN', ...payload },
    JWT_SECRET,
    { expiresIn: '2h' }
  )
}

function makeClientToken(payload = {}) {
  return jwt.sign(
    { id: 'client-1', email: 'client@test.com', role: 'CLIENT', ...payload },
    JWT_SECRET,
    { expiresIn: '2h' }
  )
}

function makeExpiredToken() {
  return jwt.sign(
    { id: 'admin-1', email: 'admin@test.com', role: 'ADMIN' },
    JWT_SECRET,
    { expiresIn: '-1s' } // Already expired
  )
}

// Mock Express req/res/next
function mockReqRes(overrides = {}) {
  const req = {
    cookies: {},
    headers: {},
    ...overrides,
  }
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  }
  const next = vi.fn()
  return { req, res, next }
}

// ══════════════════════════════════════════════════════════════
describe('verifyToken middleware', () => {
  // ── Happy path ─────────────────────────────────────────────
  it('should pass with a valid JWT in httpOnly cookie', () => {
    const token = makeAdminToken()
    const { req, res, next } = mockReqRes({ cookies: { adminToken: token } })

    verifyToken(req, res, next)

    expect(next).toHaveBeenCalledOnce()
    expect(req.admin).toBeDefined()
    expect(req.admin.email).toBe('admin@test.com')
    expect(req.admin.role).toBe('ADMIN')
  })

  it('should pass with a valid JWT in Authorization Bearer header', () => {
    const token = makeAdminToken()
    const { req, res, next } = mockReqRes({
      headers: { authorization: `Bearer ${token}` },
    })

    verifyToken(req, res, next)

    expect(next).toHaveBeenCalledOnce()
    expect(req.admin.id).toBe('admin-1')
  })

  it('should prefer cookie over Authorization header when both are present', () => {
    const cookieToken = makeAdminToken({ email: 'cookie@test.com' })
    const headerToken = makeAdminToken({ email: 'header@test.com' })
    const { req, res, next } = mockReqRes({
      cookies: { adminToken: cookieToken },
      headers: { authorization: `Bearer ${headerToken}` },
    })

    verifyToken(req, res, next)

    expect(next).toHaveBeenCalledOnce()
    expect(req.admin.email).toBe('cookie@test.com') // cookie wins
  })

  // ── Error cases ────────────────────────────────────────────
  it('should return 401 when no token is provided', () => {
    const { req, res, next } = mockReqRes()

    verifyToken(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'error', message: expect.stringContaining('Authentication required') })
    )
    expect(next).not.toHaveBeenCalled()
  })

  it('should return 401 with "Session expired" message for expired token', () => {
    const expiredToken = makeExpiredToken()
    const { req, res, next } = mockReqRes({ cookies: { adminToken: expiredToken } })

    verifyToken(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('Session expired') })
    )
    expect(next).not.toHaveBeenCalled()
  })

  it('should return 401 for a tampered/invalid token', () => {
    const { req, res, next } = mockReqRes({
      cookies: { adminToken: 'completely.fake.token' },
    })

    verifyToken(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('Invalid token') })
    )
  })

  it('should return 401 for a token signed with wrong secret', () => {
    const wrongToken = jwt.sign({ id: 'hacker', role: 'SUPER_ADMIN' }, 'wrong-secret', { expiresIn: '2h' })
    const { req, res, next } = mockReqRes({ cookies: { adminToken: wrongToken } })

    verifyToken(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
  })
})

// ══════════════════════════════════════════════════════════════
describe('requireRole middleware', () => {
  beforeEach(() => {
    // Give req.admin a token payload (verifyToken would have done this)
  })

  it('should call next() when admin has exact required role', () => {
    const { req, res, next } = mockReqRes()
    req.admin = { id: 'a1', role: 'ADMIN' }

    requireRole('ADMIN')(req, res, next)

    expect(next).toHaveBeenCalledOnce()
  })

  it('should call next() when admin role is in multi-role list', () => {
    const { req, res, next } = mockReqRes()
    req.admin = { id: 'a1', role: 'SUPER_ADMIN' }

    requireRole('ADMIN', 'SUPER_ADMIN')(req, res, next)

    expect(next).toHaveBeenCalledOnce()
  })

  it('should return 403 when role is not in allowed list', () => {
    const { req, res, next } = mockReqRes()
    req.admin = { id: 'a1', role: 'STAFF' }

    requireRole('ADMIN', 'SUPER_ADMIN')(req, res, next)

    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'error', message: expect.stringContaining('permission') })
    )
    expect(next).not.toHaveBeenCalled()
  })

  it('should return 403 when ADMIN tries to access SUPER_ADMIN-only route', () => {
    const { req, res, next } = mockReqRes()
    req.admin = { id: 'a1', role: 'ADMIN' }

    requireRole('SUPER_ADMIN')(req, res, next)

    expect(res.status).toHaveBeenCalledWith(403)
    expect(next).not.toHaveBeenCalled()
  })

  it('should return 401 when req.admin is not set', () => {
    const { req, res, next } = mockReqRes()
    // req.admin not set

    requireRole('ADMIN')(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
  })
})

// ══════════════════════════════════════════════════════════════
describe('hideAdminRoutes middleware (stealth 404)', () => {
  beforeEach(() => {
    process.env.ADMIN_SECRET_PATH = 'test-admin-path'
  })

  it('should return 404 when no ADMIN_SECRET_PATH is set in env', () => {
    const savedPath = process.env.ADMIN_SECRET_PATH
    delete process.env.ADMIN_SECRET_PATH
    const { req, res, next } = mockReqRes({
      method: 'GET',
      originalUrl: '/api/admin/services',
      cookies: {},
    })

    hideAdminRoutes(req, res, next)

    expect(res.status).toHaveBeenCalledWith(404)
    process.env.ADMIN_SECRET_PATH = savedPath
  })

  it('should return 404 (NOT 401) when no token present — stealth mode', () => {
    const { req, res, next } = mockReqRes({
      method: 'GET',
      originalUrl: '/api/admin/services',
      cookies: {},
    })

    hideAdminRoutes(req, res, next)

    expect(res.status).toHaveBeenCalledWith(404) // NOT 401 — stealth
    expect(next).not.toHaveBeenCalled()
  })

  it('should return 404 (NOT 401) when expired token used', () => {
    const expiredToken = makeExpiredToken()
    const { req, res, next } = mockReqRes({
      method: 'GET',
      originalUrl: '/api/admin/services',
      cookies: { adminToken: expiredToken },
    })

    hideAdminRoutes(req, res, next)

    expect(res.status).toHaveBeenCalledWith(404) // NOT 401
    expect(next).not.toHaveBeenCalled()
  })

  it('should call next() when valid token provided', () => {
    const token = makeAdminToken()
    const { req, res, next } = mockReqRes({
      method: 'GET',
      originalUrl: '/api/admin/services',
      cookies: { adminToken: token },
    })

    hideAdminRoutes(req, res, next)

    expect(next).toHaveBeenCalledOnce()
  })

  it('should allow login path without token (allowedPaths bypass)', () => {
    const { req, res, next } = mockReqRes({
      method: 'POST',
      originalUrl: '/api/admin/test-admin-path/login',
      cookies: {},
    })

    hideAdminRoutes(req, res, next)

    expect(next).toHaveBeenCalledOnce()
    expect(res.status).not.toHaveBeenCalled()
  })

  it('should allow /api/admin/logout without token', () => {
    const { req, res, next } = mockReqRes({
      method: 'POST',
      originalUrl: '/api/admin/logout',
      cookies: {},
    })

    hideAdminRoutes(req, res, next)

    expect(next).toHaveBeenCalledOnce()
  })
})

// ══════════════════════════════════════════════════════════════
describe('verifyClientToken middleware', () => {
  it('should pass with valid CLIENT role token', () => {
    const token = makeClientToken()
    const { req, res, next } = mockReqRes({ cookies: { clientToken: token } })

    verifyClientToken(req, res, next)

    expect(next).toHaveBeenCalledOnce()
    expect(req.client).toBeDefined()
    expect(req.client.role).toBe('CLIENT')
  })

  it('should return 401 when no token provided', () => {
    const { req, res, next } = mockReqRes()

    verifyClientToken(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
  })

  it('should return 403 when ADMIN role token used on client route', () => {
    const adminToken = makeAdminToken({ role: 'ADMIN' }) // ADMIN, not CLIENT
    const { req, res, next } = mockReqRes({ cookies: { clientToken: adminToken } })

    verifyClientToken(req, res, next)

    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Access denied.' })
    )
    expect(next).not.toHaveBeenCalled()
  })

  it('should return 401 with "Session expired" for expired token', () => {
    const expiredToken = makeExpiredToken()
    const { req, res, next } = mockReqRes({ cookies: { clientToken: expiredToken } })

    verifyClientToken(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('Session expired') })
    )
  })
})
