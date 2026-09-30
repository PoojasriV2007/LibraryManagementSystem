import { HttpError } from '../utils/validate.js'

export const notFound = (req, _res, next) => {
  next(new HttpError(404, `Route not found: ${req.method} ${req.originalUrl}`))
}

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, _req, res, _next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Request body must be valid JSON.' })
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: Object.values(err.errors)[0]?.message || 'Invalid data.' })
  }
  if (err.message?.startsWith('Not allowed by CORS')) {
    return res.status(403).json({ message: err.message })
  }

  const status = err.status || 500
  if (status >= 500) console.error(err)
  res.status(status).json({
    message: status >= 500 ? 'Something went wrong on the server.' : err.message,
    ...(err.details && { errors: err.details }),
  })
}
