/**
 * authCookie.js — Shared helper for setting/clearing the admin JWT cookie.
 * Centralises cookie options so changes apply everywhere at once.
 */

import { env } from '../config/env.js'

const ACCESS_COOKIE_NAME = 'adminToken'
const REFRESH_COOKIE_NAME = 'adminRefreshToken'

const ACCESS_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 2 * 60 * 60 * 1000, // 2 hours
}

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
}

export function setAdminCookie(res, token) {
  res.cookie(ACCESS_COOKIE_NAME, token, ACCESS_COOKIE_OPTIONS)
}

export function setAdminRefreshTokenCookie(res, token) {
  res.cookie(REFRESH_COOKIE_NAME, token, REFRESH_COOKIE_OPTIONS)
}

export function clearAdminCookies(res) {
  res.clearCookie(ACCESS_COOKIE_NAME, { httpOnly: true, sameSite: 'strict' })
  res.clearCookie(REFRESH_COOKIE_NAME, { httpOnly: true, sameSite: 'strict' })
}

export function clearAdminCookie(res) {
  clearAdminCookies(res)
}
