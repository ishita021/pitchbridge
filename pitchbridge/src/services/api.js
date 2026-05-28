/**
 * Thin API client for PitchBridge backend.
 * All requests go through here — easy to swap base URL or add interceptors.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// ── Token storage helpers ─────────────────────────────────────────────────────

export function getAccessToken() {
  return localStorage.getItem('pb_access_token')
}

export function getRefreshToken() {
  return localStorage.getItem('pb_refresh_token')
}

export function saveTokens(accessToken, refreshToken) {
  localStorage.setItem('pb_access_token', accessToken)
  localStorage.setItem('pb_refresh_token', refreshToken)
}

export function clearTokens() {
  localStorage.removeItem('pb_access_token')
  localStorage.removeItem('pb_refresh_token')
}

// ── Core fetch wrapper ────────────────────────────────────────────────────────

async function request(endpoint, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' }

  if (auth) {
    const token = getAccessToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json()

  if (!res.ok) {
    // Throw a structured error so callers can read .message and .errors
    const err = new Error(data.message || 'Request failed')
    err.statusCode = res.status
    err.errors = data.errors
    throw err
  }

  return data
}

// ── Auth endpoints ────────────────────────────────────────────────────────────

/**
 * Register a new user.
 * @param {Object} payload - { name, email, password, role, company?, industry?, investmentFocus? }
 */
export async function apiSignup(payload) {
  const data = await request('/auth/signup', { method: 'POST', body: payload })
  saveTokens(data.data.accessToken, data.data.refreshToken)
  return data.data.user
}

/**
 * Log in an existing user.
 * @param {Object} payload - { email, password }
 */
export async function apiLogin(payload) {
  const data = await request('/auth/login', { method: 'POST', body: payload })
  saveTokens(data.data.accessToken, data.data.refreshToken)
  return data.data.user
}

/**
 * Log out — invalidates the refresh token on the server.
 */
export async function apiLogout() {
  try {
    await request('/auth/logout', { method: 'POST', auth: true })
  } finally {
    clearTokens()
  }
}

/**
 * Get the currently authenticated user's profile.
 */
export async function apiGetMe() {
  const data = await request('/auth/me', { auth: true })
  return data.data.user
}

/**
 * Refresh the access token using the stored refresh token.
 */
export async function apiRefreshToken() {
  const refreshToken = getRefreshToken()
  if (!refreshToken) throw new Error('No refresh token available')

  const data = await request('/auth/refresh', {
    method: 'POST',
    body: { refreshToken },
  })
  saveTokens(data.data.accessToken, data.data.refreshToken)
  return data.data.accessToken
}
