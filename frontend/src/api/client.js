export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5050/api').replace(/\/$/, '')

const TOKEN_KEY = 'shelfly.token'

export const tokenStore = {
  get: () => {
    try {
      return localStorage.getItem(TOKEN_KEY)
    } catch {
      return null
    }
  },
  set: (token) => {
    try {
      localStorage.setItem(TOKEN_KEY, token)
    } catch {
      /* ignore */
    }
  },
  clear: () => {
    try {
      localStorage.removeItem(TOKEN_KEY)
    } catch {
      /* ignore */
    }
  },
}

export class ApiError extends Error {
  constructor(status, message, errors) {
    super(message)
    this.status = status
    this.errors = errors
  }
}

let onUnauthorized = () => {}
export const setUnauthorizedHandler = (fn) => {
  onUnauthorized = fn
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  const token = tokenStore.get()
  if (auth && token) headers.Authorization = `Bearer ${token}`

  let res
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError(0, `Can't reach the server at ${API_URL}. Is the backend running?`)
  }

  if (res.status === 204) return null
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    if (res.status === 401 && auth) onUnauthorized(data.message)
    throw new ApiError(res.status, data.message || `Request failed (${res.status})`, data.errors)
  }
  return data
}

const qs = (params) => {
  const search = new URLSearchParams(Object.entries(params).filter(([, v]) => v))
  const s = search.toString()
  return s ? `?${s}` : ''
}

export const api = {
  health: () => request('/health', { auth: false }),
  signup: (payload) => request('/auth/signup', { method: 'POST', body: payload, auth: false }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload, auth: false }),
  me: () => request('/auth/me'),
  listBooks: (params = {}) => request(`/books${qs(params)}`),
  createBook: (payload) => request('/books', { method: 'POST', body: payload }),
  updateBook: (id, payload) => request(`/books/${id}`, { method: 'PUT', body: payload }),
  deleteBook: (id) => request(`/books/${id}`, { method: 'DELETE' }),
}
