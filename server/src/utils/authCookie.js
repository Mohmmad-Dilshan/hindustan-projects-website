/**
 * authCookie.js — Shared helper for setting/clearing the admin JWT cookie.
 * Centralises cookie options so changes apply everywhere at once.
 */

import { env } from '../config/env.js'

const COOKIE_NAME = 'adminToken'
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
}

export function setAdminCookie(res, token) {
  res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS)
}

export function clearAdminCookie(res) {
  res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: 'strict' })
}
