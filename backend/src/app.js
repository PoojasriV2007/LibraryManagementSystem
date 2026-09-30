import express from 'express'
import cors from 'cors'
import config from './config.js'
import authRoutes from './routes/auth.js'
import bookRoutes from './routes/books.js'
import { errorHandler, notFound } from './middleware/errors.js'
import { BOOK_CATEGORIES } from './utils/validate.js'

export function createApp(store) {
  const app = express()
  app.disable('x-powered-by')
  app.set('trust proxy', 1)

  app.use(
    cors({
      origin(origin, callback) {
        // Allow same-origin / server-to-server requests (no Origin header) and configured frontends.
        if (!origin || config.clientOrigins.includes(origin)) return callback(null, true)
        callback(new Error(`Not allowed by CORS: ${origin}`))
      },
    }),
  )
  app.use(express.json({ limit: '100kb' }))

  app.get('/', (_req, res) => res.json({ name: 'Book Library API', health: '/api/health' }))

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', storage: store.mode, categories: BOOK_CATEGORIES })
  })

  app.use('/api/auth', authRoutes(store))
  app.use('/api/books', bookRoutes(store))

  app.use(notFound)
  app.use(errorHandler)
  return app
}
