import dotenv from 'dotenv'

dotenv.config({ quiet: true })

const isProduction = process.env.NODE_ENV === 'production'

const list = (value) =>
  (value || '')
    .split(',')
    .map((s) => s.trim().replace(/\/$/, ''))
    .filter(Boolean)

const config = {
  isProduction,
  port: Number(process.env.PORT) || 5050,
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/book_library',
  // When MongoDB can't be reached, fall back to a local JSON file so the app still runs.
  allowFileFallback: process.env.ALLOW_FILE_FALLBACK !== 'false',
  fileDbPath: process.env.FILE_DB_PATH || 'data/local-db.json',
  jwtSecret: process.env.JWT_SECRET || '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientOrigins: list(process.env.CLIENT_ORIGIN || 'http://localhost:5174,http://127.0.0.1:5174'),
  seedSampleBooks: process.env.SEED_SAMPLE_BOOKS !== 'false',
}

if (!config.jwtSecret) {
  if (isProduction) {
    console.error('JWT_SECRET must be set in production.')
    process.exit(1)
  }
  config.jwtSecret = 'dev-only-secret-change-me'
  console.warn('⚠️  JWT_SECRET not set – using an insecure development secret.')
}

export default config
