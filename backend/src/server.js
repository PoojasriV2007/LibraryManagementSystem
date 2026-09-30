import config from './config.js'
import { connectStore } from './db/index.js'
import { createApp } from './app.js'
import { seedIfEmpty } from './seed.js'

const store = await connectStore()
if (config.seedSampleBooks) await seedIfEmpty(store)

const app = createApp(store)
const server = app.listen(config.port, () => {
  console.log(`🚀 API running on http://localhost:${config.port} (storage: ${store.mode})`)
  console.log(`   Allowed frontend origins: ${config.clientOrigins.join(', ')}`)
})

const shutdown = (signal) => {
  console.log(`${signal} received, shutting down…`)
  server.close(() => process.exit(0))
}
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
