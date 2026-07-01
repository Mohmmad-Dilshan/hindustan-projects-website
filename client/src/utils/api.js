/**
 * api.js — thin fetch wrapper.
 * Base URL comes from Vite proxy in dev (/api → localhost:5000)
 * and from VITE_API_URL env var in production.
 */

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    credentials: 'include', // sends httpOnly cookies for admin auth
    ...options,
  })

  const json = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new ApiError(json.message || 'Something went wrong', res.status)
  }

  return json
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: 'DELETE' }),
}
