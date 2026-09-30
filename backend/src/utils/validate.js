export const BOOK_CATEGORIES = ['Fiction', 'Technology', 'Science', 'History', 'Biography', 'Self-Help', 'Others']
export const BOOK_STATUSES = ['Available', 'Issued']

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export class HttpError extends Error {
  constructor(status, message, details) {
    super(message)
    this.status = status
    this.details = details
  }
}

const str = (v) => (typeof v === 'string' ? v.trim() : '')

export const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const fail = (errors) => {
  if (Object.keys(errors).length) {
    throw new HttpError(400, Object.values(errors)[0], errors)
  }
}

export function validateSignup(body = {}) {
  const name = str(body.name)
  const email = str(body.email).toLowerCase()
  const password = typeof body.password === 'string' ? body.password : ''
  const errors = {}
  if (!name) errors.name = 'Name is required.'
  else if (name.length > 60) errors.name = 'Name must be 60 characters or fewer.'
  if (!EMAIL_RE.test(email)) errors.email = 'Please enter a valid email address.'
  if (password.length < 6) errors.password = 'Password must be at least 6 characters.'
  else if (password.length > 72) errors.password = 'Password must be 72 characters or fewer.'
  fail(errors)
  return { name, email, password }
}

export function validateLogin(body = {}) {
  const email = str(body.email).toLowerCase()
  const password = typeof body.password === 'string' ? body.password : ''
  const errors = {}
  if (!email) errors.email = 'Email is required.'
  if (!password) errors.password = 'Password is required.'
  fail(errors)
  return { email, password }
}

const normaliseIsbn = (v) => str(v).replace(/[-\s]/g, '').toUpperCase()

// `partial` allows updating only some fields (e.g. just the status).
export function validateBook(body = {}, { partial = false } = {}) {
  const data = {}
  const errors = {}
  const has = (k) => Object.prototype.hasOwnProperty.call(body, k)

  if (!partial || has('title')) {
    data.title = str(body.title)
    if (!data.title) errors.title = 'Title is required.'
    else if (data.title.length > 150) errors.title = 'Title must be 150 characters or fewer.'
  }
  if (!partial || has('author')) {
    data.author = str(body.author)
    if (!data.author) errors.author = 'Author is required.'
    else if (data.author.length > 100) errors.author = 'Author must be 100 characters or fewer.'
  }
  if (!partial || has('category')) {
    data.category = str(body.category)
    if (!BOOK_CATEGORIES.includes(data.category)) errors.category = `Category must be one of: ${BOOK_CATEGORIES.join(', ')}.`
  }
  if (!partial || has('status')) {
    data.status = str(body.status) || 'Available'
    if (!BOOK_STATUSES.includes(data.status)) errors.status = 'Status must be Available or Issued.'
  }
  if (has('isbn')) {
    data.isbn = normaliseIsbn(body.isbn)
    if (data.isbn && !/^(\d{9}[\dX]|\d{13})$/.test(data.isbn)) errors.isbn = 'ISBN must be 10 or 13 digits.'
  }
  if (has('issuedTo')) {
    data.issuedTo = str(body.issuedTo).slice(0, 80)
  }
  if (data.status === 'Available') data.issuedTo = ''

  if (partial && Object.keys(data).length === 0) errors.body = 'Nothing to update.'
  fail(errors)
  return data
}

export function parseBookQuery(query = {}) {
  const search = str(query.search).slice(0, 100)
  const status = BOOK_STATUSES.includes(query.status) ? query.status : ''
  const category = BOOK_CATEGORIES.includes(query.category) ? query.category : ''
  return { search, status, category }
}
