/**
 * middleware.security.test.js
 *
 * Unit tests for:
 *  - validateRequest  (express-validator result checker)
 *  - enforceHttps     (HTTP → HTTPS redirect in production)
 *  - requestTimeout   (503 if no response within 10s)
 */

import { describe, it, expect, vi, afterEach } from 'vitest'
import { validationResult } from 'express-validator'
import { validateRequest, enforceHttps, requestTimeout } from '../../src/middleware/security.js'

vi.mock('express-validator', async (importOriginal) => {
  const original = await importOriginal()
  return { ...original, validationResult: vi.fn() }
})

function mockReqRes(overrides = {}) {
  const req = { ip: '127.0.0.1', headers: {}, method: 'GET', url: '/test', ...overrides }
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    redirect: vi.fn().mockReturnThis(),
    on: vi.fn(),
    headersSent: false,
  }
  const next = vi.fn()
  return { req, res, next }
}

// ─────────────────────────────────────────────────────────────
describe('validateRequest', () => {
  it('calls next() when no validation errors', () => {
    validationResult.mockReturnValue({ isEmpty: () => true })
    const { req, res, next } = mockReqRes()

    validateRequest(req, res, next)

    expect(next).toHaveBeenCalledOnce()
    expect(res.status).not.toHaveBeenCalled()
  })

  it('returns 422 with field-level errors on validation failure', () => {
    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [
        { path: 'email', msg: 'Please provide a valid email address.' },
        { path: 'name',  msg: 'Name is required.' },
      ],
    })
    const { req, res, next } = mockReqRes()

    validateRequest(req, res, next)

    expect(res.status).toHaveBeenCalledWith(422)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'error',
        message: 'Validation failed',
        errors: expect.arrayContaining([
          expect.objectContaining({ field: 'email' }),
          expect.objectContaining({ field: 'name' }),
        ]),
      })
    )
    expect(next).not.toHaveBeenCalled()
  })
})

// ─────────────────────────────────────────────────────────────
describe('enforceHttps', () => {
  const savedEnv = process.env.NODE_ENV
  afterEach(() => { process.env.NODE_ENV = savedEnv })

  it('redirects HTTP → HTTPS (301) in production', () => {
    process.env.NODE_ENV = 'production'
    const { req, res, next } = mockReqRes({
      headers: { 'x-forwarded-proto': 'http', host: 'www.hindustanprojects.in' },
      url: '/services',
    })

    enforceHttps(req, res, next)

    expect(res.redirect).toHaveBeenCalledWith(301, 'https://www.hindustanprojects.in/services')
    expect(next).not.toHaveBeenCalled()
  })

  it('calls next() when already HTTPS in production', () => {
    process.env.NODE_ENV = 'production'
    const { req, res, next } = mockReqRes({
      headers: { 'x-forwarded-proto': 'https' },
    })

    enforceHttps(req, res, next)

    expect(next).toHaveBeenCalledOnce()
    expect(res.redirect).not.toHaveBeenCalled()
  })

  it('calls next() in development regardless of protocol', () => {
    process.env.NODE_ENV = 'development'
    const { req, res, next } = mockReqRes({
      headers: { 'x-forwarded-proto': 'http' },
    })

    enforceHttps(req, res, next)

    expect(next).toHaveBeenCalledOnce()
  })
})

// ─────────────────────────────────────────────────────────────
describe('requestTimeout', () => {
  it('calls next() immediately', () => {
    const { req, res, next } = mockReqRes()
    requestTimeout(req, res, next)
    expect(next).toHaveBeenCalledOnce()
  })

  it('registers finish and close listeners on res', () => {
    const { req, res, next } = mockReqRes()
    requestTimeout(req, res, next)
    expect(res.on).toHaveBeenCalledWith('finish', expect.any(Function))
    expect(res.on).toHaveBeenCalledWith('close', expect.any(Function))
  })

  it('sends 503 if no response is sent within 10 seconds', () => {
    vi.useFakeTimers()
    const req = { headers: {} }
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn(), on: vi.fn(), headersSent: false }
    const next = vi.fn()

    requestTimeout(req, res, next)
    vi.advanceTimersByTime(11000)

    expect(res.status).toHaveBeenCalledWith(503)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'error', message: expect.stringContaining('timed out') })
    )
    vi.useRealTimers()
  })

  it('does NOT send 503 if headers were already sent', () => {
    vi.useFakeTimers()
    const req = { headers: {} }
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn(), on: vi.fn(), headersSent: true }
    const next = vi.fn()

    requestTimeout(req, res, next)
    vi.advanceTimersByTime(11000)

    expect(res.status).not.toHaveBeenCalled()
    vi.useRealTimers()
  })
})
