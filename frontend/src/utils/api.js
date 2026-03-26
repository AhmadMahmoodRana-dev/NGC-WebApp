// ── NGC CMS API Service ────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// ── Token helpers ──────────────────────────────────────────────────
export const getToken = () => localStorage.getItem('ngc_access_token')
export const getRefreshToken = () => localStorage.getItem('ngc_refresh_token')
export const setTokens = (access, refresh) => {
  localStorage.setItem('ngc_access_token', access)
  if (refresh) localStorage.setItem('ngc_refresh_token', refresh)
}
export const clearTokens = () => {
  localStorage.removeItem('ngc_access_token')
  localStorage.removeItem('ngc_refresh_token')
  localStorage.removeItem('ngc_user')
}
export const getUser = () => {
  try { return JSON.parse(localStorage.getItem('ngc_user')) } catch { return null }
}
export const setUser = (user) => localStorage.setItem('ngc_user', JSON.stringify(user))

// ── Core fetch wrapper with auto token refresh ─────────────────────
async function apiFetch(path, options = {}) {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  let res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  // Token expired — attempt silent refresh
  if (res.status === 401 && getRefreshToken()) {
    try {
      const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: getRefreshToken() }),
      })
      if (refreshRes.ok) {
        const { accessToken, refreshToken } = await refreshRes.json()
        setTokens(accessToken, refreshToken)
        headers.Authorization = `Bearer ${accessToken}`
        res = await fetch(`${BASE_URL}${path}`, { ...options, headers })
      } else {
        clearTokens()
        window.location.href = '/cms/login'
        return
      }
    } catch {
      clearTokens()
      window.location.href = '/cms/login'
      return
    }
  }

  const data = await res.json()
  if (!res.ok) throw Object.assign(new Error(data.message || 'API error'), { status: res.status, data })
  return data
}

// ── Auth ───────────────────────────────────────────────────────────
export const authAPI = {
  login: (username, password) =>
    apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),

  verifyMFA: (username, password, token) =>
    apiFetch('/auth/verify-mfa', { method: 'POST', body: JSON.stringify({ username, password, token }) }),

  logout: () =>
    apiFetch('/auth/logout', { method: 'POST' }),

  me: () =>
    apiFetch('/auth/me'),

  auditLog: () =>
    apiFetch('/auth/audit-log'),
}

// ── Content ────────────────────────────────────────────────────────
export const contentAPI = {
  /** CMS: all statuses */
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return apiFetch(`/content/cms/all${qs ? `?${qs}` : ''}`)
  },

  /** Public: published only */
  getPublished: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return apiFetch(`/content${qs ? `?${qs}` : ''}`)
  },

  getBySlug: (slug) => apiFetch(`/content/${slug}`),

  create: (body) =>
    apiFetch('/content', { method: 'POST', body: JSON.stringify(body) }),

  update: (id, body) =>
    apiFetch(`/content/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),

  /** advance | reject workflow */
  workflow: (id, action, note = '') =>
    apiFetch(`/content/${id}/workflow`, { method: 'PATCH', body: JSON.stringify({ action, note }) }),

  delete: (id) =>
    apiFetch(`/content/${id}`, { method: 'DELETE' }),
}

// ── Media ──────────────────────────────────────────────────────────
export const mediaAPI = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return apiFetch(`/media${qs ? `?${qs}` : ''}`)
  },

  getById: (id) => apiFetch(`/media/${id}`),

  update: (id, body) =>
    apiFetch(`/media/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),

  delete: (id) =>
    apiFetch(`/media/${id}`, { method: 'DELETE' }),

  /** Upload file via multipart/form-data */
  upload: (formData) => {
    const token = getToken()
    return fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    }).then(async (res) => {
      const data = await res.json()
      if (!res.ok) throw Object.assign(new Error(data.message || 'Upload failed'), { status: res.status })
      return data
    })
  },
}

// ── Publications ───────────────────────────────────────────────────
export const publicationsAPI = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return apiFetch(`/publications${qs ? `?${qs}` : ''}`)
  },

  getById: (id) => apiFetch(`/publications/${id}`),

  create: (body) =>
    apiFetch('/publications', { method: 'POST', body: JSON.stringify(body) }),

  addVersion: (id, body) =>
    apiFetch(`/publications/${id}/version`, { method: 'PATCH', body: JSON.stringify(body) }),

  trackDownload: (id) =>
    apiFetch(`/publications/${id}/download`, { method: 'POST' }),

  delete: (id) =>
    apiFetch(`/publications/${id}`, { method: 'DELETE' }),
}

// ── Careers ────────────────────────────────────────────────────────
export const careersAPI = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return apiFetch(`/careers${qs ? `?${qs}` : ''}`)
  },

  getById: (id) => apiFetch(`/careers/${id}`),

  apply: (id, body) =>
    apiFetch(`/careers/${id}/apply`, { method: 'POST', body: JSON.stringify(body) }),

  getApplications: (jobId) =>
    apiFetch(`/careers/cms/applications${jobId ? `?jobId=${jobId}` : ''}`),
}

// ── Search ─────────────────────────────────────────────────────────
export const searchAPI = {
  query: (q, params = {}) => {
    const qs = new URLSearchParams({ q, ...params }).toString()
    return apiFetch(`/search?${qs}`)
  },
}

// ── Health ─────────────────────────────────────────────────────────
export const healthAPI = {
  check: () => apiFetch('/health'),
}
