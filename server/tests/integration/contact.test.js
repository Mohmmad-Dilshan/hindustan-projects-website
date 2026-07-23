/**
 * contact.test.js — Integration tests for POST /api/contact
 *
 * Note: contactLimiter is ALWAYS active (even in dev/test) — max 5 req / IP / 15min.
 * Each test uses a unique email to avoid the 24h duplicate check.
 * We stay within the 5-request limit per IP window by using a fresh email per test.
 */

import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../../src/app.js'

// Unique email per test run to avoid cross-test 24h duplicate collisions
const testRun = Date.now()
function email(label) {
  return `test-${label}-${testRun}@example.com`
}

// ── Shared valid payload factory ───────────────────────────────
function payload(overrides = {}) {
  return {
    name: 'Test User',
    email: email('valid'),
    phone: '9876543210',
    message: 'This is a test message that is long enough to pass validation.',
    serviceInterested: 'Web Development',
    recaptchaToken: 'mock-token', // RECAPTCHA_SECRET_KEY not set → auto-skip in dev
    ...overrides,
  }
}

// ─────────────────────────────────────────────────────────────
describe('POST /api/contact', () => {
  // ── Validation: missing recaptchaToken (runs BEFORE rate limit hit) ──
  it('returns 422 when recaptchaToken is missing', async () => {
    const { recaptchaToken, ...withoutToken } = payload()
    const res = await request(app)
      .post('/api/contact')
      .send({ ...withoutToken, email: email('notoken') })

    expect(res.status).toBe(422)
    expect(res.body.status).toBe('error')
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'recaptchaToken' }),
      ])
    )
  })

  // ── Validation: name missing ───────────────────────────────
  it('returns 422 when name is missing', async () => {
    const { name, ...withoutName } = payload()
    const res = await request(app)
      .post('/api/contact')
      .send({ ...withoutName, email: email('noname') })

    expect(res.status).toBe(422)
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'name', message: expect.stringContaining('required') }),
      ])
    )
  })

  // ── Validation: name too short ─────────────────────────────
  it('returns 422 when name is less than 2 characters', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send(payload({ email: email('shortname'), name: 'A' }))

    expect(res.status).toBe(422)
    expect(res.body.errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'name' })])
    )
  })

  // ── Validation: invalid email ──────────────────────────────
  it('returns 422 when email format is invalid', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send(payload({ email: 'not-a-valid-email' }))

    expect(res.status).toBe(422)
    expect(res.body.errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'email' })])
    )
  })

  // ── Validation: message too short ─────────────────────────
  it('returns 422 when message is less than 10 characters', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send(payload({ email: email('shortmsg'), message: 'Short' }))

    expect(res.status).toBe(422)
    expect(res.body.errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'message' })])
    )
  })
})
